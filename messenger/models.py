from django.db import models


class Experiment(models.Model):
    experiment_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    surname = models.CharField(max_length=150)
    patronymic = models.CharField(max_length=150)
    age = models.CharField(max_length=50)
    gender = models.CharField(max_length=150)
    word = models.CharField(max_length=250)
    margins = models.CharField(max_length=50)
    time = models.CharField(max_length=150)

    def __str__(self):
        return f'Эксперимент №{str(self.experiment_id)}'
