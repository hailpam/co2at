import sqlite3
import os
import requests

db_path = os.environ['CO2AT_DB_PATH']

def retrieve_data(metric='scope', company='Acme', product=None, period=1, bucket=60):
    if metric == 'scope':
        return retrieve_scope_data(company, product, period, bucket)
    return {}

def retrieve_scope_data(company='Acme', product=None, period=0.5, bucket=60):
    params = {
        'q': 'SELECT MEAN(scope1) as "scope1", MEAN(scope2) as "scope2", MEAN(scope3) as "scope3" FROM "scope" WHERE company=\'%s\' AND time > now() - %dh GROUP BY time(%ds)' % (company, period, bucket),
        'db': 'co2at',
        'pretty': True
    }
    return requests.get('http://127.0.0.1:8086/query?pretty=true', params=params).json()

def retrieve_user(username, password):
    user = {}
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM users WHERE username = "%s" AND password = "%s"' % (username, password))
        for row in cursor:
            user['username'] = row[0]
            user['password'] = row[1]
            user['name'] = row[2]
            user['surname'] = row[3]
            user['role'] = row[4]
            user['company'] = row[5]
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return user

def retrieve_company(name):
    company = {}
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM companies WHERE name = "%s"' % (name))
        for row in cursor:
            company['name'] = row[0]
            company['address'] = row[1]
            company['country'] = row[2]
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return company

def retrieve_product(company):
    products = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM products WHERE producer = "%s"' % (company))
        for row in cursor:
            product = {}
            product['name'] = row[0]
            product['type'] = row[1]
            product['producer'] = row[2]
            products.append(product)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return products

def retrieve_graph(company):
    data = {
        'query': 'FOR c in company FILTER c.name == \"%s\" FOR v, e, p IN 1..3 ANY c company_to, product_to, input_to, output_to RETURN p' % company,
        'count': True,
        'batchSize': 1000
    }
    return requests.post('http://localhost:8529/_api/cursor', json=data).json()
