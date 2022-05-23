
from time import sleep, time

import requests
import random
import os
import json
import socket


def wait_for(address, port):
    while True:
        try:
            conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            conn.connect((address, int(port)))
            print('info: connected to [%s:%s]' % (address, port))
            break
        except Exception as e:
            print('info: waiting to get connected to [%s:%s]: %s' % (address, port, e))
            sleep(5)
        finally:
            if conn:
                conn.close()

def fetch_env_variables():
    influx_address, arango_address, influx_port, arango_port = None, None, None, None
    try:
        influx_address = os.environ['DOCKER_DB_INFLUX_ADDRESS']
    except:
        print('warning: unable to fetch InfluxDB address')
    try:
        arango_address = os.environ['DOCKER_DB_ARANGO_ADDRESS']
    except:
        print('warning: unable to fetch ArangoDB address')
    try:
        influx_port = os.environ['DOCKER_DB_INFLUX_PORT']
    except:
        print('warning: unable to fetch the InfluxDB port')
    try:
        arango_port = os.environ['DOCKER_DB_ARANGO_PORT']
    except:
        print('warning: unable to fetch the ArangoDB port')
    
    return influx_address, arango_address, influx_port, arango_port

def create_influx_database(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8086
    wait_for(address, port)
    res = requests.post('http://%s:%s/query?q=CREATE DATABASE co2at' % (address, port))
    if res.status_code != 200:
        raise ConnectionError('unable to create InfluxDB database: %s' % res.text)
    print('IndluxDB database created successfully %s' % res.text)

def create_arango_database(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8529
    wait_for(address, port)
    data = { 
        "name" : "co2at", 
        "edgeDefinitions" : [ 
            { 
                "collection" : "organization_to", 
                "from" : [ 
                    "organization" 
                ], 
                "to" : [ 
                    "company",
                    "product" 
                ] 
            },
            { 
                "collection" : "company_to", 
                "from" : [ 
                    "company" 
                ], 
                "to" : [ 
                    "product",
                    "producer",
                    "supplier",
                    "retailer" 
                ] 
            },
            { 
                "collection" : "producer_to", 
                "from" : [ 
                    "producer" 
                ], 
                "to" : [ 
                    "product" 
                ] 
            },
            { 
                "collection" : "product_to", 
                "from" : [ 
                    "product" 
                ], 
                "to" : [ 
                    "input",
                    "output" 
                ] 
            },
            { 
                "collection" : "logistic_to", 
                "from" : [ 
                    "logistic" 
                ], 
                "to" : [ 
                    "input",
                    "output",
                    "product" 
                ] 
            },
            { 
                "collection" : "input_to", 
                "from" : [ 
                    "input" 
                ], 
                "to" : [ 
                    "supplier",
                    "producer" 
                ] 
            },
            { 
                "collection" : "output_to", 
                "from" : [ 
                    "output" 
                ], 
                "to" : [ 
                    "retailer",
                    "producer" 
                ] 
            }
        ]
    }
    headers = {
        'accept': 'application/json'
    }
    res = requests.post('http://%s:%s/_api/gharial' % (address, port), headers=headers, data=json.dumps(data, indent=0).encode())
    if res.status_code != 202:
        raise ConnectionError('unable to create ArangoDB database: %s' % res.text)
    print('ArangoDB database created successfully %s' % res.text)

def generate_co2at_graph(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8529
    
    headers = {
        'accept': 'application/json'
    }
    
    reverse_idx = {}
    
    oranization = {
        'name': 'Acme Group'
    }
    res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/organization' % (address, port), headers=headers, data=json.dumps(oranization, indent=0).encode())
    if res.status_code != 202:
        raise ConnectionError('unable to create the Organization: %s' % res.text)
    identifier = json.loads(res.text)['vertex']['_id']
    reverse_idx[oranization['name']] = identifier
    
    company = {
        'name': 'Acme'
    }
    res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/company' % (address, port), headers=headers, data=json.dumps(company, indent=0).encode())
    if res.status_code != 202:
        raise ConnectionError('unable to create the Company [%s]: %s' % (x, res.text))
    identifier = json.loads(res.text)['vertex']['_id']
    reverse_idx[company['name']] = identifier
    
    for x in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
        product = {
            'name': x,
            'type': 'Cheese'
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/product' % (address, port), headers=headers, data=json.dumps(product, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Product [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[x] = identifier
    
    for x in ['DHL', 'UPS', 'Maersk', 'MSC']:
        logistic = {
            'name': x
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/logistic' % (address, port), headers=headers, data=json.dumps(logistic, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Logistic [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[x] = identifier
    
    for x in ['SupplierA', 'SupplierB', 'SupplierC', 'SupplierD']:
        supplier = {
            'name': x
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/supplier' % (address, port), headers=headers, data=json.dumps(supplier, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Supplier [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[x] = identifier

    for x in ['RetailerA', 'RetailerB', 'RetailerC', 'RetailerD']:
        retailer = {
            'name': x
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/retailer' % (address, port), headers=headers, data=json.dumps(retailer, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Retailer [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[x] = identifier

    for x in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
        input = {
            'name': 'InputFor%s' % x
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/input' % (address, port), headers=headers, data=json.dumps(input, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Input [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[input['name']] = identifier
    
    for x in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
        output = {
            'name': 'OutputFor%s' % x
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/output' % (address, port), headers=headers, data=json.dumps(output, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Output [%s]: %s' % (x, res.text))
        identifier = json.loads(res.text)['vertex']['_id']
        reverse_idx[output['name']] = identifier

    producer = {
        'name': 'ProducerAcme'
    }
    res = requests.post('http://%s:%s/_api/gharial/co2at/vertex/producer' % (address, port), headers=headers, data=json.dumps(producer, indent=0).encode())
    if res.status_code != 202:
        raise ConnectionError('unable to create the Producer: %s' % (res.text))
    identifier = json.loads(res.text)['vertex']['_id']
    reverse_idx[producer['name']] = identifier
    
    for x in ['Acme', 'Goodone', 'Greatone', 'Badone', 'Decentone']:
        organization_to = {
            'type': 'control',
            '_from': reverse_idx['Acme Group'],
            '_to': reverse_idx[x]
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/edge/organization_to' % (address, port), headers=headers, data=json.dumps(organization_to, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Organization_to: %s' % (res.text))

    for x in ['ProducerAcme','Goodone', 'Greatone', 'Badone', 'Decentone', 'SupplierA', 'SupplierB', 'SupplierC', 'SupplierD', 'RetailerA', 'RetailerB', 'RetailerC', 'RetailerD']:
        company_to = {
            'type': 'control',
            '_from': reverse_idx['Acme'],
            '_to': reverse_idx[x]
        }
        res = requests.post('http://%s:%s/_api/gharial/co2at/edge/company_to' % (address, port), headers=headers, data=json.dumps(company_to, indent=0).encode())
        if res.status_code != 202:
            raise ConnectionError('unable to create the Company_To: %s' % (res.text))

    for x in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
        for y in [ 'InputFor%s' % x ]:
            product_to = {
                'type': 'has',
                '_from': reverse_idx[x],
                '_to': reverse_idx[y]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/product_to' % (address, port), headers=headers, data=json.dumps(product_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Product_To: %s' % (res.text))
        for y in [ 'OutputFor%s' % x ]:
            product_to = {
                'type': 'has',
                '_from': reverse_idx[x],
                '_to': reverse_idx[y]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/product_to' % (address, port), headers=headers, data=json.dumps(product_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Product_To: %s' % (res.text))

    for x in ['DHL', 'UPS', 'Maersk', 'MSC']:
        for y in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
            logistic_to = {
                'type': 'control',
                '_from': reverse_idx[x],
                '_to': reverse_idx[y]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/logistic_to' % (address, port), headers=headers, data=json.dumps(logistic_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Logistic_To: %s' % (res.text))
            input = 'InputFor%s' % y
            logistic_to = {
                'type': 'control',
                '_from': reverse_idx[x],
                '_to': reverse_idx[input]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/logistic_to' % (address, port), headers=headers, data=json.dumps(logistic_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Logistic_To: %s' % (res.text))
            output = 'OutputFor%s' % y
            logistic_to = {
                'type': 'control',
                '_from': reverse_idx[x],
                '_to': reverse_idx[output]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/logistic_to' % (address, port), headers=headers, data=json.dumps(logistic_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Logistic_To: %s' % (res.text))
    
    for x in ['Goodone', 'Greatone', 'Badone', 'Decentone']:
        input = 'InputFor%s' % x
        for y in [ 'ProducerAcme', 'SupplierA', 'SupplierB', 'SupplierC', 'SupplierD' ]:
            input_to = {
                'type': 'inputs',
                '_from': reverse_idx[input],
                '_to': reverse_idx[y]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/input_to' % (address, port), headers=headers, data=json.dumps(input_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Input_To: %s' % (res.text))
        output = 'OutputFor%s' % x
        for y in [ 'SupplierA', 'SupplierB', 'SupplierC', 'SupplierD', 'RetailerA', 'RetailerB', 'RetailerC', 'RetailerD' ]:
            output_to = {
                'type': 'outputs',
                '_from': reverse_idx[output],
                '_to': reverse_idx[y]
            }
            res = requests.post('http://%s:%s/_api/gharial/co2at/edge/output_to' % (address, port), headers=headers, data=json.dumps(output_to, indent=0).encode())
            if res.status_code != 202:
                raise ConnectionError('unable to create the Output_To: %s' % (res.text))

def generate_scope_datapoints(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8086
    datapoint = 'scope,company=Acme,region=us-west scope1=%f,scope2=%f,scope3=%f'
    scope1 = random.random()
    scope2 = random.random()
    scope3 = random.random()
    res = requests.post('http://%s:%s/write?db=co2at' % (address, port), datapoint % (scope1, scope2, scope3))
    if res.status_code != 204:
        print('unable to push a datapoint: %s' % res.text)

def main():
    influx_address, arango_address, influx_port, arango_port = fetch_env_variables()
    create_influx_database(influx_address, influx_port)
    create_arango_database(arango_address, arango_port)
    generate_co2at_graph(arango_address, arango_port)
    while True:
        generate_scope_datapoints(influx_address, influx_port)
        sleep(1)
    
if __name__ == '__main__':
    main()
