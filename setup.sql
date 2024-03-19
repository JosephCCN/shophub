CREATE DATABASE shophub;
\c shophub

DROP TABLE if exists users;
DROP TABLE if exists history;
DROP TABLE if exists product;
DROP TABLE if exists cart;
DROP TABLE if exists wishlist;
DROP TABLE if exists review;

CREATE TABLE if not exists users(
    user_id serial PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL unique,
    password VARCHAR(30) NOT NULL ,
    is_admin boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT users_no_duplicate UNIQUE (user_id, username)
);

INSERT INTO users (username, password, is_admin)
VALUES ('admin', 'admin', TRUE);

CREATE TABLE if not exists history(
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    buyer integer NOT NULL ,
    seller integer NOT NULL,
    order_date timestamp NOT NULL,
    price DECIMAL(19, 4) NOT NULL
);

CREATE TABLE if not exists product(
    product_id serial PRIMARY KEY NOT NULL,
    product_name varchar(100) NOT NULL,
    price DECIMAL(19, 4) NOT NULL,
    category varchar(100)
);

CREATE TABLE if not exists cart(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_no_duplicate UNIQUE (user_id, product_id) 
);

CREATE TABLE if not exists wishlist(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT wishlist_no_duplicate UNIQUE (user_id, product_id) 
);

CREATE TABLE if not exists review(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    context varchar(400),
    rating integer CHECK (1 <= rating and rating <= 5),
    CONSTRAINT review_no_duplicate UNIQUE (user_id, product_id) 
);