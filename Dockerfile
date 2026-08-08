FROM node:22.17.1
WORKDIR /app
ENV NODE_ENV=dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5002
CMD ["npm", "run", "dev"]