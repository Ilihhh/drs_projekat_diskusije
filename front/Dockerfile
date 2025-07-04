# 1. faza - Build React aplikacije
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# 2. faza - Nginx server
FROM nginx:alpine

# Kopiraj build iz prve faze u NGINX public folder
COPY --from=build /app/build /usr/share/nginx/html

# Kopiraj prilagođeni nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Pokreni nginx
CMD ["nginx", "-g", "daemon off;"]
