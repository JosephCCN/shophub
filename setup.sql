\c postgres
DROP DATABASE IF EXISTS shophub;
CREATE DATABASE shophub;
\c shophub

DROP TABLE if exists users;
DROP TABLE if exists history;
DROP TABLE if exists product;
DROP TABLE if exists cart;
DROP TABLE if exists wishlist;
DROP TABLE if exists review;
DROP SEQUENCE if exists history_order_id;

CREATE SEQUENCE if not exists history_order_id
    INCREMENT 1
    START 1;

CREATE TABLE if not exists users(
    user_id serial PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL unique,
    password VARCHAR(30) NOT NULL ,
    is_admin boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT users_no_duplicate UNIQUE (user_id, username)
);

CREATE TABLE if not exists product(
    product_id serial PRIMARY KEY NOT NULL,
    seller_id integer NOT NULL,
    product_name varchar(100) NOT NULL,
    info varchar(200),
    price DECIMAL(19, 1) NOT NULL,
    quantity integer CHECK (0 <= quantity),
    category varchar(100),
    is_deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT product_seller_id_exist FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE if not exists history(
    order_id integer NOT NULL,
    buyer_id integer NOT NULL,
    seller_id integer NOT NULL,
    product_id integer NOT NULL,
    order_date timestamp NOT NULL DEFAULT current_timestamp,
    quantity integer NOT NULL CHECK (1 <= quantity),
    price DECIMAL(19, 1) NOT NULL,
    CONSTRAINT history_buyer_id_exist FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    CONSTRAINT history_seller_id_exist FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT history_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE if not exists cart(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT cart_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id),
    CONSTRAINT cart_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE if not exists wishlist(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT wishlist_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT wishlist_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id),
    CONSTRAINT wishlist_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE if not exists review(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    context varchar(400),
    rating integer CHECK (1 <= rating and rating <= 5),
    CONSTRAINT review_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT review_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id),
    CONSTRAINT review_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE if not exists noti(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT noti_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id),
    CONSTRAINT noti_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, password, is_admin) VALUES ('admin', 'admin', TRUE);
insert into users (username, password, is_admin) values ('user1', 'a', FALSE);

insert into product (product_name, seller_id, info, quantity, price, category) values ('item1', 2,'oops', 10, 12.2, 'fuck');
insert into product (product_name, seller_id, info, quantity, price, category) values ('item2', 2, 'hi', 1, 2.4, 'hell');