FROM node:10.19
WORKDIR /usr/src/app
COPY . .
RUN npm install -y
