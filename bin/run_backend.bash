#!/bin/bash

export CO2AT_DB_PATH=/Users/pmaresca/Developments/Workspaces/Hybrid/co2at/data/co2at.db

cd ../api
flask run --host=localhost --port=5050