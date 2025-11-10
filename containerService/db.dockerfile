FROM postgres:15.4

COPY ./up.sql /docker-entrypoint-initdb.d/1.sql

EXPOSE 5432
CMD ["postgres"]