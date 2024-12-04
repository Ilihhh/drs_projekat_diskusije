# Koristimo Node.js kao osnovni imidž za buildovanje React aplikacije
FROM node:20

# Postavi radni direktorijum
WORKDIR /app

# Kopiraj package.json i package-lock.json u radni direktorijum
COPY package.json package-lock.json ./

# Instaliraj zavisnosti
RUN npm install

# Kopiraj ceo frontend kod u radni direktorijum
COPY . .

# Build aplikacije za produkciju
RUN npm run build

# Koristimo `serve` paket za produkcijsko hostovanje aplikacije
RUN npm install -g serve

# Izloži port 3000 za komunikaciju
EXPOSE 3000

# Pokreni aplikaciju koristeći `serve` (serviranje build-ovane aplikacije)
CMD ["serve", "-s", "build", "-l", "3000"]
