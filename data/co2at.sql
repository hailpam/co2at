PRAGMA foreign_keys = ON;
-- Preventive clean up

DROP TABLE users;
DROP TABLE companies;
DROP TABLE products;
DROP TABLE certificates;
DROP TABLE reports;
DROP TABLE ads;
DROP TABLE balance;
DROP TABLE transaction_log;
DROP TABLE notifications;
DROP TABLE recommendations;

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
    producer text NOT NULL,
    size text NOT NULL,
    weight text NOT NULL,
    packaging text NOT NULL,
    price REAL NOT NULL
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

CREATE TABLE balance (
    company text PRIMARY KEY,
    credits INTEGER NOT NULL,
    debits INTEGER NOT NULL,
    targets INTEGER NOT NULL
);

CREATE TABLE transaction_log (
    created_at INTEGER NOT NULL,
    operation text NOT NULL,
    op_from text NOT NULL,
    op_to text NOT NULL,
    amount REAL NOT NULL,
    dollar REAL NOT NULL
);

CREATE TABLE notifications (
    created_at INTEGER NOT NULL,
    company text NOT NULL,
    type text NOT NULL,
    brief text NOT NULL,
    reference text NOT NULL
);

CREATE TABLE recommendations (
    created_at INTEGER NOT NULL,
    company text NOT NULL,
    for text NOT NULL, 
    scope text NOT NULL,
    summary text NOT NULL
);

-- Adding notifications

INSERT INTO notifications (
    created_at,
    company,
    type, 
    brief,
    reference
) VALUES (
    1653940877111,
    'Acme',
    'Ad',
    'A recommendation for your product to be checked out',
    'Goodone'
);

-- Adding recommendations

INSERT INTO recommendations (
    created_at,
    company,
    for,
    scope,
    summary
) VALUES (
    1653940877111,
    'Acme',
    'Acme',
    'Logistics',
    'Replace your truck XYZ to save up 20% of emissions for product Goodone'
);

-- Adding a row for the balance

INSERT INTO balance (
    company,
    credits,
    debits,
    targets
) VALUES (
    'Acme',
    0,
    10000,
    100000
);

-- Adding a few transactions

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302111,
    'buy',
    'GreenerInstitutionA',
    'Acme',
    101.0,
    1111.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302211,
    'buy',
    'GreenerInstitutionA',
    'Acme',
    101.0,
    1111.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302311,
    'buy',
    'GreenerInstitutionD',
    'Acme',
    33.0,
    4500.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302411,
    'buy',
    'GreenerInstitutionC',
    'Acme',
    45.0,
    4500.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302511,
    'buy',
    'GreenerInstitutionB',
    'Acme',
    44.0,
    8800.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302611,
    'buy',
    'GreenerInstitutionA',
    'Acme',
    23.0,
    3500.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    16538053021711,
    'buy',
    'GreenerInstitutionD',
    'Acme',
    22.0,
    2200.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302111,
    'buy',
    'GreenerInstitutionC',
    'Acme',
    111.0,
    3504.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302811,
    'buy',
    'GreenerInstitutionB',
    'Acme',
    15.0,
    2000.0
);

INSERT INTO transaction_log (
    created_at,
    operation,
    op_from,
    op_to,
    amount,
    dollar
) VALUES (
    1653805302911,
    'buy',
    'GreenerInstitutionA',
    'Acme',
    11.0,
    1111.0
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
    producer,
    size,
    weight,
    packaging,
    price
) VALUES (
    'Goodone',
    'Cheese',
    'Acme',
    '10cmx10cm',
    '100gr',
    'recyclable',
    1.50
);

INSERT INTO products (
    name,
    type,
    producer,
    size,
    weight,
    packaging,
    price
) VALUES (
    'Greatone',
    'Cheese',
    'Acme',
    '10cmx10cm',
    '100gr',
    'recyclable',
    2.50
);

INSERT INTO products (
    name,
    type,
    producer,
    size,
    weight,
    packaging,
    price
) VALUES (
    'Badone',
    'Cheese',
    'Acme',
    '10cmx10cm',
    '100gr',
    'recyclable',
    0.50
);

INSERT INTO products (
    name,
    type,
    producer,
    size,
    weight,
    packaging,
    price
) VALUES (
    'Decentone',
    'Cheese',
    'Acme',
    '10cmx10cm',
    '100gr',
    'recyclable',
    1.00
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
    1653477792111,
    'Goodone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef0590',
    1.20,
    0.30,
    0.40
);

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
    1653477792111,
    'Badone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef051',
    1.21,
    0.31,
    0.41
);

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
    1653477792111,
    'Decentone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef052',
    1.22,
    0.32,
    0.42
);

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
    1653477792111,
    'Greatone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef053',
    1.23,
    0.33,
    0.43
);

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
    1653477792111,
    'Goodone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef054',
    1.24,
    0.34,
    0.44
);

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
    1653477792111,
    'Badone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef055',
    1.25,
    0.35,
    0.45
);

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
    1653477792111,
    'Decentone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef056',
    1.26,
    0.36,
    0.46
);

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
    1653477792111,
    'Greatone',
    'Acme',
    'us-west',
    '8b68e87d-e1aa-4115-a514-39014cba5401',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef057',
    1.27,
    0.37,
    0.47
);

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
    1653477792111,
    'Goodone',
    'Acme',
    'us-west',
    '',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef058',
    1.2,
    0.3,
    0.4
);

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
    1653477792111,
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
    1653477792010,
    'Acme',
    'Decentone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5400',
    '',
    0.70,
    0.20,
    0.50,
    0.30,
    0.80
);

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
    1653477792010,
    'Acme',
    'Greatone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5401',
    '16cf75e7-16bb-4c74-be2b-edb1c75ef057',
    0.71,
    0.21,
    0.51,
    0.31,
    0.81
);

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
    1653477792010,
    'Acme',
    'Badone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5402',
    '',
    0.72,
    0.22,
    0.52,
    0.32,
    0.82
);

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
    1653477792010,
    'Acme',
    'Goodone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5403',
    '',
    0.73,
    0.23,
    0.53,
    0.33,
    0.83
);

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
    1653477792010,
    'Acme',
    'Decentone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5404',
    '',
    0.74,
    0.24,
    0.54,
    0.34,
    0.84
);

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
    1653477792010,
    'Acme',
    'Greatone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5405',
    '',
    0.75,
    0.25,
    0.55,
    0.35,
    0.85
);

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
    1653477792010,
    'Acme',
    'Badone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5406',
    '',
    0.76,
    0.26,
    0.56,
    0.36,
    0.86
);

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
    1653477792010,
    'Acme',
    'Goodone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5407',
    '',
    0.77,
    0.27,
    0.57,
    0.37,
    0.87
);

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
    1653477792010,
    'Acme',
    'Decentone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5408',
    '',
    0.78,
    0.28,
    0.58,
    0.38,
    0.88
);

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
    1653477792010,
    'Acme',
    'Goodone',
    'f0115c3e-3441-4102-b2c5-bde91e3dfb9b',
    1,
    '8b68e87d-e1aa-4115-a514-39014cba5409',
    '',
    0.79,
    0.29,
    0.59,
    0.39,
    0.89
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
    1653477792100,
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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fd6',
    'B2B',
    'Goodone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'DHL',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fd7',
    'B2B',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'DHL',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fd8',
    'B2B',
    'Badone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'DHL',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fd9',
    'B2B',
    'Decentone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'UPS',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fe5',
    'B2B',
    'Goodone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'UPS',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fb5',
    'B2B',
    'Badone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'UPS',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fc5',
    'B2B',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'UPS',
    'Acme',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz0',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz1',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz2',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz3',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz4',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz5',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz6',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz7',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz8',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);

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
    1653477792100,
    '9f651d04-df04-4f11-9463-9d5fbde74fz9',
    'B2C',
    'Greatone',
    '52049bfc-b275-4067-9121-aab59a88813d',
    '3908fc1e-53dd-42fd-8b47-ddd8aa63d55e',
    'Acme',
    'Joe Connor',
    0,
    0
);