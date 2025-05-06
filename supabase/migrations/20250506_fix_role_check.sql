
-- Create a function to safely check if a user has a role without recursion
-- This will be executed as a stored procedure via RPC
CREATE OR REPLACE FUNCTION public.has_role(role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = role::user_role_enum
  );
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
