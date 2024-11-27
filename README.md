# TukeyWeb

![Tukey Mascot](https://raw.githubusercontent.com/dvillagrans/TukeyWeb/main/Tukey_Mesa%20de%20trabajo%201%20copia%208.png)

**TukeyWeb** es un proyecto web orientado a **ciencia de datos** que combina un frontend moderno desarrollado en **Astro** y un backend robusto construido con **Django**. Este proyecto está inspirado en plataformas como LeetCode o HackerRank, diseñadas para resolver retos y ejercicios enfocados en ciencia de datos.

---

## 🚀 Funcionalidades

- **Ejercicios Interactivos**: Resuelve retos de ciencia de datos directamente en la plataforma.
- **Visualización de Datos**: Experimenta con gráficos y análisis de datos generados en tiempo real.
- **Resultados en Vivo**: Feedback inmediato tras enviar tus soluciones.
- **Interfaz Moderna**: UI intuitiva desarrollada con Astro.
- **Backend Escalable**: Potente soporte backend con Django.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Astro
- **Backend**: Django
- **Lenguaje Principal**: Python
- **Base de Datos**: SQLite (por defecto, configurable a otras opciones)
- **Estilos**: Tailwind CSS (si aplica)
- **API**: Django REST Framework (DRF)

---

## 🌟 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v16 o superior)
- Python (v3.9 o superior)
- pipenv o pip para manejar dependencias de Python

---

## 📦 Instalación

Sigue los pasos para clonar e iniciar el proyecto localmente:

### 1. Clona este repositorio

```bash
git clone https://github.com/dvillagrans/TukeyWeb.git
cd TukeyWeb
```

### 2. Configura el Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Configura el Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Accede a la aplicación
Abre tu navegador y ve a http://localhost:4321 para el frontend y a http://localhost:8000 para la API del backend.

## 📖 Uso
- Inicio: Accede a la plataforma y explora los retos disponibles.
- Resuelve Ejercicios: Elige un reto, edita tu código y envíalo para evaluar tus resultados.
- Aprende: Analiza el feedback y mejora tus habilidades en ciencia de datos.

## 📚 Contribuciones
### ¡Contribuciones son bienvenidas! Sigue estos pasos:

- Haz un fork del repositorio.
- Crea una nueva rama para tu funcionalidad (git checkout -b feature/NombreDeTuFeature).
- Realiza tus cambios y realiza un commit (git commit -m 'Agrego nueva funcionalidad').
- Haz un push a tu rama (git push origin feature/NombreDeTuFeature).
- Abre un pull request.
