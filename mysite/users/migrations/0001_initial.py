# Generated by Django 3.0.4 on 2020-03-15 11:19

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('join_timestamp', models.DateField(blank=True)),
                ('alias', models.CharField(blank=True, max_length=50, validators=[django.core.validators.RegexValidator('^[0-9a-zA-Z ]*$', 'Only alphanumeric characters are allowed.')])),
                ('name', models.CharField(blank=True, max_length=60, null=True, validators=[django.core.validators.RegexValidator('^[a-zA-Z ]*$', 'Only letters are allowed.')])),
                ('profile_img', models.ImageField(default='default_profile_pic.jpg', upload_to='profile_pics')),
                ('background_img', models.ImageField(default='default_background_pic.jpg', upload_to='background_pics')),
                ('description', models.TextField(blank=True, max_length=300)),
                ('following', models.ManyToManyField(blank=True, related_name='_profile_following_+', to='users.Profile')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
