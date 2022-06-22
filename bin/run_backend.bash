#!/bin/bash

if [ $# -ne 1 ];
then
    echo "errod: DB path required: please specify it as command line argument"
    exit 1
fi

export CO2AT_DB_PATH=$1

cd ../api
flask run --host=localhost --port=5050