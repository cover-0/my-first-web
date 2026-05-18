-- user profile auto-creation trigger
create or replace function public.handle_new_user()
returns trigger
security definer
as $$
begin
  insert into public.profiles (id, username, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    null,
    'user'
  );
  return new;
end;
$$ language plpgsql;

-- trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- backfill existing users (if any)
insert into public.profiles (id, username, role)
select id, coalesce(raw_user_meta_data->>'name', email), 'user'
from auth.users
where not exists (
  select 1 from public.profiles where profiles.id = auth.users.id
);
