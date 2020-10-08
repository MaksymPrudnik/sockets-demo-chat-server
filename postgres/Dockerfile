FROM postgres:12.4

ADD ./tables/ /docker-entrypoint-initdb.d/tables/

ADD ./deploy_schemas.sql /docker-entrypoint-initdb.d/