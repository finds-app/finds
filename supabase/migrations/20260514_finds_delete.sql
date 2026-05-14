-- Delete find feature
-- Adds: RLS policy allowing a user to delete their own find rows.
--
-- Run in Supabase SQL editor. Idempotent.
--
-- Notes:
--   * Related rows in `comments`, `reactions`, `saves`, `find_links`, `tags`,
--     and `notifications` are expected to use `references public.finds(id)
--     on delete cascade` and will be removed automatically by Postgres.
--   * The image in the `finds-images` storage bucket is removed from the
--     client (see src/services/storage.service.ts deleteImage). Storage RLS
--     should already allow the owning user to delete their objects.

------------------------------------------------------------
-- finds delete policy
------------------------------------------------------------

drop policy if exists "finds_delete_own" on public.finds;
create policy "finds_delete_own" on public.finds
  for delete
  to authenticated
  using (auth.uid() = user_id);
