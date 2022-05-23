from flask import Flask
from flask import request
from matplotlib import use

from api.services import retrieve_company, retrieve_data, retrieve_graph, retrieve_product, retrieve_user

import json
import base64

app = Flask(__name__)

@app.route('/api/v1/data')
def get_data():
    return retrieve_data()

@app.route('/api/v1/user')
def get_user():
    auth = request.headers.get('Authorization')
    print(auth)
    if not auth:
        return json.dumps({}, indent=4)
    parts = auth.split(' ')
    if len(parts) != 2 and parts[0] != 'Basic':
        return json.dumps({}, indent=4)
    decoded = base64.b64decode(parts[1]).decode('UTF-8')
    parts = decoded.split(':')
    print(decoded)
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
