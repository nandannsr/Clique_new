# Generated by Django 4.1.5 on 2023-02-17 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0006_alter_video_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='title',
            field=models.URLField(max_length=100),
        ),
    ]