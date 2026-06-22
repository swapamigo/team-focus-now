REVOKE EXECUTE ON FUNCTION public.create_invite(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_workspace(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.join_with_invite(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_invite(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_with_invite(text) TO authenticated;