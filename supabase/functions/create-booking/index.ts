import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Get user's org
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("organization_id")
      .eq("id", userId)
      .single();

    if (!profile?.organization_id) {
      return new Response(JSON.stringify({ error: "No organization" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orgId = profile.organization_id;

    const body = await req.json();
    const { customer_id, service_id, start_at, end_at, source = "manual", notes, metadata = {} } = body;

    if (!start_at || !end_at) {
      return new Response(JSON.stringify({ error: "start_at and end_at required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate start is in future
    if (new Date(start_at) <= new Date()) {
      return new Response(JSON.stringify({ error: "Cannot book in the past" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate end > start
    if (new Date(end_at) <= new Date(start_at)) {
      return new Response(JSON.stringify({ error: "end_at must be after start_at" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use the atomic DB function for capacity check + insert
    const { data: result, error: rpcError } = await supabaseAdmin.rpc(
      "create_booking_with_capacity_check",
      {
        p_organization_id: orgId,
        p_customer_id: customer_id || null,
        p_service_id: service_id || null,
        p_start_at: start_at,
        p_end_at: end_at,
        p_source: source,
        p_notes: notes || null,
        p_metadata: metadata,
      }
    );

    if (rpcError) throw rpcError;

    // The DB function returns jsonb with either { id, status } or { error, message }
    if (result?.error) {
      return new Response(JSON.stringify({ error: result.error, message: result.message }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the full booking for response
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("*, customer:customers(id, full_name, email, phone), service:knowledge_items(id, name)")
      .eq("id", result.id)
      .single();

    return new Response(JSON.stringify({ booking }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
