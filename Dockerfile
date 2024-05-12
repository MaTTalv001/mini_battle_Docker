FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx tailwindcss init -p

EXPOSE 3010

CMD ["yarn", "start"]