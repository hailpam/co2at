from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request

from api.services import retrieve_balance, retrieve_certificate, retrieve_company, retrieve_data, retrieve_graph, retrieve_product, retrieve_report, retrieve_transaction, retrieve_user, retrieve_ad

import json
import base64

app = Flask(__name__)
CORS(app)

@app.route('/api/v1/data')
def get_data():
    company = request.args.get('company')
    metric = request.args.get('metric')
    product = request.args.get('product')
    return retrieve_data(metric=metric, company=company, product=product)

@app.route('/api/v1/user')
@cross_origin()
def get_user():
    auth = request.headers.get('Authorization')
    if not auth:
        return json.dumps({}, indent=4)
    parts = auth.split(' ')
    if len(parts) != 2 and parts[0] != 'Basic':
        return json.dumps({}, indent=4)
    decoded = base64.b64decode(parts[1]).decode('UTF-8')
    parts = decoded.split(':')
    if len(parts) != 2:
        return json.dumps({}, indent=4)
    username = parts[0]
    password = parts[1]
    user = retrieve_user(username, password)
    return json.dumps(user, indent=4)

@app.route('/api/v1/company')
def get_company():
    name = request.args.get('name')
    company = retrieve_company(name)
    return json.dumps(company, indent=4)

@app.route('/api/v1/product')
def get_product():
    company = request.args.get('company')
    products = retrieve_product(company)
    return json.dumps(products, indent=4)

@app.route('/api/v1/graph')
def get_graph():
    company = request.args.get('company')
    return retrieve_graph(company)

@app.route('/api/v1/certificate')
def get_certificate():
    company = request.args.get('company')
    certificates = retrieve_certificate(company)
    return json.dumps(certificates, indent=4)

@app.route('/api/v1/report')
def get_report():
    company = request.args.get('company')
    reports = retrieve_report(company)
    return json.dumps(reports, indent=4)

@app.route('/api/v1/ad')
def get_ad():
    company = request.args.get('company')
    ads = retrieve_ad(company)
    return json.dumps(ads, indent=4)

@app.route('/api/v1/balance')
def get_balance():
    company = request.args.get('company')
    balance = retrieve_balance(company)
    return json.dumps(balance, indent=4)

@app.route('/api/v1/transaction')
def get_transaction():
    company = request.args.get('company')
    transactions = retrieve_transaction(company)
    return json.dumps(transactions, indent=4)
