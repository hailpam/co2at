import sqlite3
import os
import requests

db_path = os.environ['CO2AT_DB_PATH']

def retrieve_data(metric='scope', company='Acme', product=None, period=1, bucket=60):
    if metric == 'scope':
        return retrieve_scope_data(company, product, period, bucket)
    if metric == 'credit':
        return retrieve_credit_data(period)
    return {}

def retrieve_scope_data(company='Acme', product=None, period=0.5, bucket=60):
    query = 'SELECT MEAN(scope1) as "scope1", MEAN(scope2) as "scope2", MEAN(scope3) as "scope3" FROM "scope" WHERE company=\'%s\' AND time > now() - %dh GROUP BY time(%ds), product, region' % (company, period, bucket)
    if product:
        query = 'SELECT MEAN(scope1) as "scope1", MEAN(scope2) as "scope2", MEAN(scope3) as "scope3" FROM "scope" WHERE company=\'%s\' AND product=\'%s\' AND time > now() - %dh GROUP BY time(%ds), product, region' % (company, product, period, bucket)
    params = {
        'q': query,
        'db': 'co2at',
        'pretty': True
    }
    return requests.get('http://127.0.0.1:8086/query?pretty=true', params=params).json()

def retrieve_credit_data(period=0.5, bucket=60):
    query = 'SELECT MEAN(available) as "available" FROM "credit" WHERE time > now() - %dh GROUP BY time(%ds), institution, region' % (period, bucket)
    params = {
        'q': query,
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

def retrieve_certificate_by_report(company, report):
    certificates = retrieve_certificate(company)
    for certificate in certificates:
        if certificate['report_id'] == report:
            return certificate
    return {}

def retrieve_certificate(company):
    certificates = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM certificates WHERE producer = "%s"' % (company))
        for row in cursor:
            certificate = {}
            certificate['created_at'] = row[0]
            certificate['product'] = row[1]
            certificate['producer'] = row[2]
            certificate['provenance'] = row[3]
            certificate['report_id'] = row[4]
            certificate['certificate_id'] = row[5]
            certificate['co2e_scope1'] = row[6]
            certificate['co2e_scope2'] = row[7]
            certificate['co2e_scope3'] = row[8]
            certificates.append(certificate)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return certificates

def retrieve_report_by_certificate(company, certificate):
    reports = retrieve_report(company)
    for report in reports:
        if report['certificate_id'] == certificate:
            return report
    return {}

def retrieve_report(company):
    reports = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM reports WHERE company = "%s"' % (company))
        for row in cursor:
            report = {}
            report['created_at'] = row[0]
            report['company'] = row[1]
            report['product'] = row[2]
            report['provenance'] = row[3]
            report['graph_id'] = row[4]
            report['graph_level'] = row[5]
            report['report_id'] = row[6]
            report['certificate_id'] = row[7]
            report['co2e_supplier'] = row[8]
            report['co2e_retailer'] = row[9]
            report['co2e_producer'] = row[10]
            report['co2e_logistic'] = row[11]
            report['co2e_waste'] = row[12]
            reports.append(report)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return reports

def retrieve_ad(company):
    ads = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM ads WHERE (creator = "%s" OR recipient = "%s")' % (company, company))
        for row in cursor:
            ad = {}
            ad['created_at'] = row[0]
            ad['ad_id'] = row[1]
            ad['type'] = row[2]
            ad['product'] = row[3]
            ad['graph_id'] = row[4]
            ad['recommendation_id'] = row[5]
            ad['creator'] = row[6]
            ad['recipient'] = row[7]
            ad['nr_click'] = row[8]
            ad['acked'] = row[9]
            ads.append(ad)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return ads

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
            product['size'] = row[3]
            product['weight'] = row[4]
            product['packaging'] = row[5]
            product['price'] = row[6]
            products.append(product)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return products

def retrieve_balance(company):
    balance = {}
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM balance WHERE company = "%s"' % (company))
        for row in cursor:
            balance['company'] = row[0]
            balance['credits'] = row[1]
            balance['debits'] = row[2]
            balance['targets'] = row[3]
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return balance

def retrieve_transaction(company):
    transactions = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM transaction_log WHERE (op_from = "%s" OR op_to = "%s")' % (company, company))
        for row in cursor:
            transaction = {}
            transaction['created_at'] = row[0]
            transaction['operation'] = row[1]
            transaction['op_from'] = row[2]
            transaction['op_to'] = row[3]
            transaction['amount'] = row[4]
            transaction['dollar'] = row[5]
            transactions.append(transaction)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return transactions

def retrieve_notification(company):
    notifications = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM notifications WHERE company = "%s"' % (company))
        for row in cursor:
            notification = {}
            notification['created_at'] = row[0]
            notification['company'] = row[1]
            notification['type'] = row[2]
            notification['brief'] = row[3]
            notification['reference'] = row[4]
            notification['reference_id'] = row[5]
            notification['notification_id'] = row[6]
            notifications.append(notification)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return notifications

def retrieve_recommendation(company):
    recommendations = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.execute('SELECT * FROM recommendations WHERE company = "%s"' % (company))
        for row in cursor:
            recommendation = {}
            recommendation['created_at'] = row[0]
            recommendation['company'] = row[1]
            recommendation['for'] = row[2]
            recommendation['scope'] = row[3]
            recommendation['summary'] = row[4]
            recommendation['reference_id'] = row[5]
            recommendation['recommendation_id'] = row[6]
            recommendations.append(recommendation)
    except Exception as e:
        print('error: %s' % e)
    finally:
        if conn:
            conn.close()
    return recommendations

def retrieve_graph(company):
    data = {
        'query': 'FOR c in company FILTER c.name == \"%s\" FOR v, e, p IN 1..3 ANY c company_to, product_to, input_to, output_to RETURN p' % company,
        'count': True,
        'batchSize': 1000
    }
    return requests.post('http://localhost:8529/_api/cursor', json=data).json()
