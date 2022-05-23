
provision:
	sqlite3 co2at.db < co2at.sql

build:
	docker build -t co2at.loader:latest -f Dockerfile ../.

test_influx:
	curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=co2at" --data-urlencode "q=SELECT * FROM \"scope\""

test_api:
	curl -G "http://127.0.0.1:5000/api/v1/user" -H "Authorization: Basic amRvZTpKRE9F"
	curl -G "http://127.0.0.1:5000/api/v1/company?name=Acme"
	curl -G "http://127.0.0.1:5000/api/v1/product?company=Acme"