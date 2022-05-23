FROM python:3.8-slim-buster

RUN mkdir /app

COPY data/loader.py /app/loader.py

RUN pip3 install requests

RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y netcat

ENTRYPOINT [ "python3", "-u", "/app/loader.py" ]
CMD [""]
