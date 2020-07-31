FROM node:carbon

COPY ./package.json /app/package.json

WORKDIR /app

RUN npm install -f

COPY . /app

CMD ["npm", "run", "start:dev"]
