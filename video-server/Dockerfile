FROM node:10.19.0

COPY ./package.json /app/package.json

WORKDIR /app

RUN npm install -f

COPY . /app

CMD ["npm", "run", "start:dev"]
