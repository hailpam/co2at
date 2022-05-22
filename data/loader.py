
from time import sleep, time

import requests
import random

def create_databases():
    res = requests.post('http://127.0.0.1:8086/query?q=CREATE DATABASE co2at')
    print(res, res.text)

def generate_scope_datapoints():
    datapoint = 'scope,company=Acme,region=us-west scope1=%f,scope2=%f,scope3=%f %d'
    timestamp = int(time() * 1000)
    scope1 = random.random()
    scope2 = random.random()
    scope3 = random.random()
    res = requests.post('http://127.0.0.1:8086/write?db=co2at', datapoint % (scope1, scope2, scope3, timestamp))
    print(res, res.text)
    sleep(1)

def main():
    create_databases()
    while True:
        generate_scope_datapoints()
    
if __name__ == '__main__':
    main()
