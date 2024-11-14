FROM node:23-alpine3.19

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

COPY wait-for-services.sh /app/wait-for-services.sh

RUN chmod +x /app/wait-for-services.sh

CMD ["/app/wait-for-services.sh"]