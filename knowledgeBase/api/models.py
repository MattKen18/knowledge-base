from uuid import uuid4
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # user = models.ForeignKey(settings.AUTH_USER_MODEL,
    #                          null=True, blank=False, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=False)
    color = models.CharField(max_length=50, null=True,
                             blank=False, default='#00bfff')

    def get_color(self):  # remove
        return self.color

    def __str__(self):
        return self.name if self.name else ''


class Entry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL, null=True, blank=False, on_delete=models.CASCADE)
    tag = models.ForeignKey(
        Tag, on_delete=models.CASCADE, null=True, blank=True)
    content = models.CharField(max_length=250, null=True, blank=False)
    answer = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self):
        return self.content
