
provision:
	sqlite3 co2at.db < co2at.sql

build:
	docker build -t co2at.loader:latest -f Dockerfile ../.

test:
	curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=co2at" --data-urlencode "q=SELECT * FROM \"scope\""