# Koristimo Python 3.11 za pokretanje aplikacije
FROM python:3.11-slim

# Postavi radni direktorijum unutar kontejnera
WORKDIR /app

# Kopiraj requirements.txt i instaliraj zavisnosti
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Instaliraj Gunicorn za pokretanje Flask aplikacije u produkciji
RUN pip install gunicorn

# Kopiraj ceo kod aplikacije
COPY . /app

# Postavi promenljive okruženja (učitavamo ih iz .env fajla preko docker-compose)
ENV FLASK_ENV=production

# Expose port koji koristi Flask aplikacija
EXPOSE 5000

# Pokreni aplikaciju koristeći Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
