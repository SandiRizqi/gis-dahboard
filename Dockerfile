FROM node:16.17.0
ENV NODE_ENV=production
COPY package.json ./
#COPY package.json .
COPY . .
#RUN npm install


RUN npm install -g npm@9.3.0
RUN npm install
COPY .env.local ./
COPY next.config.js ./



RUN npm run build

EXPOSE 3000
# CMD ["yarn", "start"]
CMD ["npm", "run", "start"]