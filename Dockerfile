# Použijeme stabilní odlehčenou verzi Node.js
FROM node:20-alpine

# Pracovní složka uvnitř kontejneru
WORKDIR /app

# Zkopírujeme definice balíčků ze složky app/
COPY app/package*.json ./

# Nainstalujeme závislosti
RUN npm install

# Zkopírujeme veškeré zdrojové kódy frontendu ze složky app/
COPY app/ .

# Vite běží standardně na portu 5173
EXPOSE 5173

# Spuštění aplikace přes Vite s povolením přístupu zvenčí
CMD ["npm", "run", "dev", "--", "--host"]