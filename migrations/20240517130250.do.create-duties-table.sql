
create table duties (
  id serial primary key,
  name text not null,
  is_completed boolean default false
);