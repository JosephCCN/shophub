CREATE TABLE if not exists user_info(
    user_id serial PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL unique,
    password VARCHAR(30) NOT NULL ,
    CONSTRAINT id_username UNIQUE (user_id, username) 
);

CREATE TABLE if not exists history(
    product_id serial PRIMARY KEY NOT NULL,
    buyer integer NOT NULL ,
    seller integer NOT NULL,
    order_date timestamp NOT NULL,
    price DECIMAL(19, 4) NOT NULL
);

CREATE TABLE if not exists product(
    product_id serial PRIMARY KEY NOT NULL,
    product_name varchar(100) NOT NULL ,
    price DECIMAL(19, 4) NOT NULL,
    category varchar(100)
);

CREATE TABLE if not exists cart(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT no_duplicate UNIQUE (user_id, product_id) 
);

CREATE TABLE if not exists wish_list(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT no_duplicate UNIQUE (user_id, product_id) 
);

CREATE TABLE if not exists comment(
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    context varchar(400),
    rating integer CHECK (0 <= rating and rating <= 5),
    CONSTRAINT no_duplicate_2 UNIQUE (user_id, product_id) 
);