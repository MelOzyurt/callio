CREATE POLICY "Users can insert org"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);