FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app/

RUN npm install

CMD ["sh", "start.sh"]
