FROM node:14.18.3-alpine

WORKDIR /client

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm",  "start"]