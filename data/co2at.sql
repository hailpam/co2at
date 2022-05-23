PRAGMA foreign_keys = ON;

DROP TABLE users;
DROP TABLE companies;
DROP TABLE products;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    role text NOT NULL,
    company text NOT NULL
);

CREATE TABLE companies (
    name text PRIMARY KEY,
    address text NOT NULL,
    country text NOT NULL
);

CREATE TABLE products (
    name text PRIMARY KEY,
    type text NOT NULL,
    producer text NOT NULL
);

-- Adding 2 users for the Acme, Inc. company

INSERT INTO users (
    username,
    password,
    name,
    surname,
    role,
    company
) VALUES (
    'jdoe',
    'JDOE',
    'John',
    'Doe',
    'Supply Chain Manager',
    'Acme'
);

INSERT INTO users (
    username,
    password,
    name,
    surname,
    role,
    company
) VALUES (
    'asmith',
    'ASMITH',
    'Adam',
    'Smith',
    'Chief Operating Officer',
    'Acme'
);

-- Adding 1 company: Acme

INSERT INTO companies (
    name,
    address,
    country
) VALUES (
    'Acme',
    '1 Acme Road, San Francisco, CA 94104',
    'USA'
);

-- Adding 4 products for Acme

INSERT INTO products (
    name,
    type,
    producer
) VALUES (
    'Goodone',
    'Cheese',
    'Acme'
);

INSERT INTO products (
    name,
    type,
    producer
) VALUES (
    'Greatone',
    'Cheese',
    'Acme'
);

INSERT INTO products (
    name,
    type,
    producer
) VALUES (
    'Badone',
    'Cheese',
    'Acme'
);

INSERT INTO products (
    name,
    type,
    producer
) VALUES (
    'Decentone',
    'Cheese',
    'Acme'
);
