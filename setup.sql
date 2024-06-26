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
DROP TABLE if exists noti;
DROP TABLE if exists category;
DROP TABLE if exists category_product;
DROP SEQUENCE if exists history_order_id;

CREATE SEQUENCE if not exists history_order_id
    INCREMENT 1
    START 1;

CREATE TABLE if not exists users(
    user_id serial PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL unique,
    password VARCHAR(30) NOT NULL,
    contact varchar(30) NOT NULL DEFAULT 'N/A',
    is_admin boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT users_no_duplicate UNIQUE (user_id, username)
);

CREATE TABLE if not exists category_list(
    tag VARCHAR(30) PRIMARY KEY NOT NULL
);

CREATE TABLE if not exists product(
    product_id serial PRIMARY KEY NOT NULL,
    seller_id integer NOT NULL,
    product_name varchar(100) NOT NULL,
    info varchar(200),
    price DECIMAL(19, 1) NOT NULL,
    quantity integer CHECK (0 <= quantity),
    is_deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT product_seller_id_exist FOREIGN KEY (seller_id) REFERENCES users(user_id) on delete CASCADE
);

CREATE TABLE if not exists history(
    order_id integer NOT NULL,
    buyer_id integer NOT NULL,
    seller_id integer NOT NULL,
    product_id integer NOT NULL,
    order_date timestamp NOT NULL DEFAULT current_timestamp,
    quantity integer NOT NULL CHECK (1 <= quantity),
    price DECIMAL(19, 1) NOT NULL,
    CONSTRAINT history_buyer_id_exist FOREIGN KEY (buyer_id) REFERENCES users(user_id) on delete CASCADE,
    CONSTRAINT history_seller_id_exist FOREIGN KEY (seller_id) REFERENCES users(user_id) on delete CASCADE,
    CONSTRAINT history_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id) on delete CASCADE
);

CREATE TABLE if not exists cart(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT cart_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id) on delete CASCADE,
    CONSTRAINT cart_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id) on delete CASCADE
);

CREATE TABLE if not exists wishlist(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT wishlist_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT wishlist_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id) on delete CASCADE,
    CONSTRAINT wishlist_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id) on delete CASCADE
);

CREATE TABLE if not exists review(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    context varchar(400),
    rating integer CHECK (1 <= rating and rating <= 5),
    CONSTRAINT review_no_duplicate UNIQUE (user_id, product_id),
    CONSTRAINT review_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id) on delete CASCADE,
    CONSTRAINT review_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id) on delete CASCADE
);

CREATE TABLE if not exists noti(
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    context varchar(400),
    create_at TIMESTAMP DEFAULT current_timestamp,
    CONSTRAINT noti_user_id_exist FOREIGN KEY (user_id) REFERENCES users(user_id) on delete CASCADE,
    CONSTRAINT noti_product_id_exist FOREIGN KEY (product_id) REFERENCES product(product_id) on delete CASCADE
);

CREATE TABLE if not exists category(
    tag varchar(40),
    product_id integer,
    CONSTRAINT category_exist FOREIGN KEY (tag) REFERENCES category_list(tag),
    CONSTRAINT cate_produt_id_exist FOREIGN KEY(product_id) REFERENCES product(product_id) on delete CASCADE
);


INSERT INTO category_list (tag) values ('Fashion'), ('Sports'), ('Accessories'), ('Health and Wellness'), ('Electronics and Gadgets'),
('Toys and Games'), ('Stationery'), ('Music and Movies'), ('Luggage'), ('Grocery'), ('Food'), ('Wearables'), ('Pet Supplies'), ('Men'),
('Women'), ('Underwear'), ('Kids'), ('Cosmetics and Skincare'), ('Music'), ('Greenery'), ('Personal Care'), ('Others');

INSERT INTO users (username, password, is_admin) VALUES ('admin', 'admin', TRUE);

insert into users (username, password, is_admin) values ('user1', 'a', FALSE);
insert into product (product_name, seller_id, info, quantity, price) values ('item1', 2,'oops', 10, 12.2);
insert into product (product_name, seller_id, info, quantity, price) values ('item2', 2, 'hi', 1, 2.4);
insert into category values ('Fashion', 2);
insert into category values ('Fashion', 1);
insert into category values ('Sports', 1);
