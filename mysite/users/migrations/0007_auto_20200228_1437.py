# Generated by Django 3.0.2 on 2020-02-28 13:37

import django.core.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20200228_1332'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='join_timestamp',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='profile',
            name='alias',
            field=models.CharField(blank=True, max_length=16, validators=[django.core.validators.RegexValidator('^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')]),
        ),
        migrations.AlterField(
            model_name='profile',
            name='name',
            field=models.CharField(blank=True, max_length=36, null=True, validators=[django.core.validators.RegexValidator('^[a-zA-Z]*$', 'Only letters are allowed.')]),
        ),
    ]