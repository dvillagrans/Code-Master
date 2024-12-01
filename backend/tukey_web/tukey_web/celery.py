import os
from celery import Celery
from django.conf import settings

# Establece el módulo de configuración de Django predeterminado
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tukey_web.settings')

# Crea la instancia de la aplicación Celery
app = Celery('tukey_web')

# Configuración detallada
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configuraciones de depuración y rendimiento
app.conf.update(
    # Configuraciones de ejecución
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_track_started=True,
    worker_cancel_long_running_tasks_on_connection_loss=True,
    
    # Configuraciones de tiempo
    task_time_limit=30,  # Límite de tiempo global para tareas
    task_soft_time_limit=25,  # Límite suave de tiempo
    
    # Logging detallado
    worker_log_format='[%(asctime)s: %(levelname)s/%(processName)s] %(message)s',
    worker_task_log_format='[%(asctime)s: %(levelname)s/%(processName)s][%(task_name)s(%(task_id)s)] %(message)s',
    
    # Configuraciones específicas para Windows
    worker_pool='solo',
    worker_concurrency=1,
    task_queue_max_priority=10,
    
    # Configuraciones de broker
    broker_connection_retry_on_startup=True,
    broker_connection_max_retries=10
)

# Descubrir tareas automáticamente
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# Tarea de depuración
@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')