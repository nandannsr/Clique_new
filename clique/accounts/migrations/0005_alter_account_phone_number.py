# Generated by Django 4.1.5 on 2023-03-29 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_userprofile_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='phone_number',
            field=models.CharField(max_length=50, null=True, unique=True),
        ),
    ]
