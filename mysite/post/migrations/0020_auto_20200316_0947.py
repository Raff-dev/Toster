# Generated by Django 3.0.4 on 2020-03-16 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0019_action'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='post.Post'),
        ),
    ]
