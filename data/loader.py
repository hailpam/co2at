
from time import sleep, time

import requests
import random
import os

def fetch_env_variables():
    address, influx_port, arango_port = None, None, None
    try:
        address = os.environ['DOCKER_DB_ADDRESS']
    except:
        print('warning: unable to fetch the DB address')
    
    try:
        influx_port = os.environ['DOCKER_DB_INFLUX_PORT']
    except:
        print('warning: unable to fetch the InfluxDB port')
    
    try:
        arango_port = os.environ['DOCKER_DB_ARANGO_PORT']
    except:
        print('warning: unable to fetch the ArangoDB port')
    
    return address, influx_port, arango_port

def create_databases(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8086
    res = requests.post('http://%s:%s/query?q=CREATE DATABASE co2at' % (address, port))
    if res.status_code != 200:
        raise ConnectionError('unable to create InfluxDB database: %s' % res.text)
    print('database created successfully %s' % res.text)

def generate_scope_datapoints(address, port):
    if not address:
        address = '127.0.0.1'
    if not port:
        port = 8086
    datapoint = 'scope,company=Acme,region=us-west scope1=%f,scope2=%f,scope3=%f %d'
    timestamp = int(time() * 1000)
    scope1 = random.random()
    scope2 = random.random()
    scope3 = random.random()
    res = requests.post('http://%s:%s/write?db=co2at' % (address, port), datapoint % (scope1, scope2, scope3, timestamp))
    if res.status_code != 204:
        print('unable to push a datapoint: %s' % res.text)

def main():
    address, influx_port, arango_port = fetch_env_variables()
    print(address, influx_port, arango_port)
    create_databases(address, influx_port)
    while True:
        generate_scope_datapoints(address, influx_port)
        sleep(1)
    
if __name__ == '__main__':
    main()
