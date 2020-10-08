FROM node:12.18-alpine3.9

WORKDIR /usr/src/sockets-server

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]