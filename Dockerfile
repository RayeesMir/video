FROM node:14.17.5

WORKDIR /home/node/app

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

USER node
