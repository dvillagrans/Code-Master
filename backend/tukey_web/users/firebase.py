import firebase_admin
from firebase_admin import credentials, auth
import os

# Construye la ruta al archivo de credenciales dinámicamente
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(BASE_DIR, 'config', 'firebase', 'tukeyweb-firebase-adminsdk-v4qax-6a0bbbfe1c.json')

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
