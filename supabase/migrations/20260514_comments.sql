-- Comments feature
-- Adds: comments table + RLS, 'comment' notification type, notification trigger
--
-- Run in Supabase SQL editor. Idempotent where possible.

------------------------------------------------------------
-- 1. comments table
------------------------------------------------------------

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  find_id    uuid not null references public.finds(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  body       text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_comments_find_id on public.comments(find_id, created_at);
create index if not exists idx_comments_user_id on public.comments(user_id);

------------------------------------------------------------
-- 2. RLS
------------------------------------------------------------

alter table public.comments enable row level security;

drop policy if exists "comments_select_authenticated" on public.comments;
create policy "comments_select_authenticated" on public.comments
  for select
  to authenticated
  using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own" on public.comments
  for delete
  to authenticated
  using (auth.uid() = user_id);

------------------------------------------------------------
-- 3. 'comment' notification type
------------------------------------------------------------
-- The notifications.type column is a text column with a CHECK constraint.
-- Drop and recreate the constraint to include 'comment'.

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type = any (array['reaction'::text, 'follow'::text, 'chain'::text, 'comment'::text]));

------------------------------------------------------------
-- 4. Notification trigger for new comments
------------------------------------------------------------
-- Inserts a 'comment' notification for the find owner whenever someone
-- else comments on their find. Skips self-comments.

create or replace function public.notify_on_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  select user_id into owner_id from public.finds where id = new.find_id;

  if owner_id is null or owner_id = new.user_id then
    return new;
  end if;

  insert into public.notifications (user_id, type, actor_id, find_id, read)
  values (owner_id, 'comment', new.user_id, new.find_id, false);

  return new;
end;
$$;

drop trigger if exists trg_notify_on_comment on public.comments;
create trigger trg_notify_on_comment
  after insert on public.comments
  for each row
  execute function public.notify_on_comment();
