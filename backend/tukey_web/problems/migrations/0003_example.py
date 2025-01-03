# Generated by Django 5.1.3 on 2024-12-07 03:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0002_problem_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='Example',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input_data', models.TextField()),
                ('output_data', models.TextField()),
                ('explanation', models.TextField()),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='examples', to='problems.problem')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
