# Generated by Django 3.0.2 on 2020-02-27 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0005_auto_20200210_1515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question_text',
            field=models.CharField(max_length=200, verbose_name='nazwa'),
        ),
        migrations.AlterField(
            model_name='question',
            name='scrub_schroob',
            field=models.PositiveIntegerField(choices=[('aaa', 2), (3, 'bbb'), ('asd', 'ddd')], default=('asd', 3, 'nxddddx'), help_text='help text'),
        ),
    ]
