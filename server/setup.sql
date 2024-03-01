CREATE TABLE if not exists user_info(
    user_id serial PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL ,
    password VARCHAR(30) NOT NULL
);