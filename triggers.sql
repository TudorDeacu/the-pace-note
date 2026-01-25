-- FUNCTION: Handle New User Creation
-- This function copies data from auth.users to public.profiles when a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, username)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER: Execute the function on new user insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
