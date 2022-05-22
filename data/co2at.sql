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
    type text NOT NULL
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
    'Acme, Inc.'
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
    'Acme, Inc.'
);

-- Adding 1 company: Acme, Inc.

INSERT INTO companies (
    name,
    address,
    country
) VALUES (
    'Acme, Inc.',
    '1 Acme Road, San Francisco, CA 94104',
    'USA'
);

-- Adding 3 products for Acme, Inc.

INSERT INTO products (
    name,
    type
) VALUES (
    'Goodone',
    'Cheese'
);

INSERT INTO products (
    name,
    type
) VALUES (
    'Greatone',
    'Cheese'
);

INSERT INTO products (
    name,
    type
) VALUES (
    'Badone',
    'Cheese'
);

INSERT INTO products (
    name,
    type
) VALUES (
    'Decentone',
    'Cheese'
);
