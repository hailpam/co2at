PRAGMA foreign_keys = ON;
-- Preventive clean up

DROP TABLE users;
DROP TABLE companies;
DROP TABLE products;
DROP TABLE certificates;
DROP TABLE reports;
DROP TABLE ads;

-- Tables addition

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

CREATE TABLE certificates (
    created_at INTEGER NOT NULL,
    product text NOT NULL,
    producer text NOT NULL,
    provenance text NOT NULL,
    report_id text,                         -- link back a report if any is associated with it
    certificate_id text PRIMARY KEY,        -- unique identifier
    co2e_scope1 REAL NOT NULL,
    co2e_scope2 REAL NOT NULL,
    co2e_scope3 REAL NOT NULL
);

CREATE TABLE reports (
    created_at INTEGER NOT NULL,
    company text NOT NULL,
    product text NOT NULL,
    graph_id text NOT NULL,
    graph_level INTEGER NOT NULL,
    report_id text PRIMARY KEY,
    certificate_id text,
    co2e_supplier REAL NOT NULL,
    co2e_retailer REAL NOT NULL,
    co2e_producer REAL NOT NULL,
    co2e_logistic REAL NOT NULL,
    co2e_waste REAL NOT NULL
);

CREATE TABLE ads (
    created_at INTEGER NOT NULL,
    ad_id text PRIMARY KEY,
    type text NOT NULL,
    product text NOT NULL,
    graph_id text NOT NULL,
    recommendation_id text NOT NULL,
    creator text NOT NULL,
    recipient text NOT NULL,
    nr_click INTEGER NOT NULL,
    acked INTEGER NOT NULL
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

-- Adding Certificates
INSERT INTO certificates (
    created_at,
    product,
    producer,
    provenance,
    report_id,
    certificate_id,
    co2e_scope1,
    co2e_scope2,
    co2e_scope3
) VALUES (
    1653477792,
    'Badone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef059',
    1.2,
    0.3,
    0.4
);

-- Adding Reports
INSERT INTO reports (
    created_at,
    company,
    product,
    graph_id,
    graph_level,
    report_id,
    certificate_id,
    co2e_supplier,
    co2e_retailer,
    co2e_producer,
    co2e_logistic,
    co2e_waste
) VALUES (
    1653477792,
    'Acme',
    'Decentone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba540d',
    '',
    0.7,
    0.2,
    0.5,
    0.3,
    0.8
);

-- Adding Ads
INSERT INTO ads (
    created_at,
    ad_id,
    type,
    product,
    graph_id,
    recommendation_id,
    creator,
    recipient,
    nr_click,
    acked
) VALUES (
    1653477792,
    '9f651d04-df04-4f11-9463-9d5fbde74fd5',
    'B2B',
    'Decentone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'DHL',
    'Acme',
    0,
    0
);
