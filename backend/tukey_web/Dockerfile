# Usa la imagen base oficial de Python 3.12
FROM python:3.12-slim

# Configuración del entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establece el directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    apt-get clean

# Copia las dependencias
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del proyecto
COPY . /app/

# Expone el puerto 8000
EXPOSE 8000

# Comando para iniciar Daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "tukey_web.asgi:application"]
