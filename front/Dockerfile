# Koristimo Node.js kao osnovni imidž za buildovanje React aplikacije
FROM node:20 AS build

# Postavi radni direktorijum
WORKDIR /app

# Kopiraj package.json i package-lock.json
COPY package.json package-lock.json ./

# Instaliraj zavisnosti
RUN npm install

# Kopiraj ceo frontend kod
COPY . .

# Build aplikacije za produkciju
RUN npm run build

# 2. FAZA - Koristimo nginx za produkcijsko hostovanje
FROM nginx:alpine

# Kopiraj build iz prethodne faze u nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Pokreni nginx
CMD ["nginx", "-g", "daemon off;"]
