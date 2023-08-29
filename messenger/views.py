import json

from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Experiment


def index(request):
    request_dict = request.GET.dict()
    if (request.method == "GET" and 'r' in request_dict and 'l' in request_dict
            and 't' in request_dict and 'b' in request_dict
            and 'margins' in request_dict and 'word' in request_dict):
        return render(request, 'messenger/index.html', {
            'right': json.dumps(request_dict['r']),
            'left': json.dumps(request_dict['l']),
            'top': json.dumps(request_dict['t']),
            'bottom': json.dumps(request_dict['b']),
            'margins': json.dumps(request_dict['margins']),
            'word': json.dumps(request_dict['word']),
        })
    else:
        return redirect('calibration')


def calibration(request):
    request_dict = request.GET.dict()
    if request.method == "GET" and 'margins' in request_dict and 'word' in request_dict:
        return render(request, 'messenger/calibration.html', {
            'margins': json.dumps(request_dict['margins']),
            'word': json.dumps(request_dict['word']),
        })
    else:
        return redirect('settings')


def settings(request):
    return render(request, 'messenger/settings.html')


def save_data(request):
    request_dict = request.POST.dict()
    if (request.method == "POST" and 'margins' in request_dict and 'word' in request_dict
            and 'time' in request_dict and 'gender' in request_dict
            and 'age' in request_dict and 'patronymic' in request_dict
            and 'surname' in request_dict and 'name' in request_dict):
        experiment = Experiment()
        experiment.name = request_dict['name']
        experiment.surname = request_dict['surname']
        experiment.patronymic = request_dict['patronymic']
        experiment.age = request_dict['age']
        experiment.gender = request_dict['gender']
        experiment.word = request_dict['word']
        experiment.margins = request_dict['margins']
        experiment.time = request_dict['time']
        experiment.save()
        return JsonResponse({}, status=200)
    else:
        return JsonResponse({}, status=400)


def success_screen(request):
    return render(request, 'messenger/experimentSuccess.html')


def fail_screen(request):
    return render(request, 'messenger/experimentFail.html')

