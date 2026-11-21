create table notes(
    id number primary key
    note varchar(500),
    created date,
    active boolean default true
);
