import json

from django.shortcuts import render, redirect


def index(request):
    request_dict = request.GET.dict()
    if (request.method == "GET" and 'r' in request_dict and 'l' in request_dict
            and 't' in request_dict and 'b' in request_dict):
        return render(request, 'messenger/index.html', {
            'right': json.dumps(request_dict['r']),
            'left': json.dumps(request_dict['l']),
            'top': json.dumps(request_dict['t']),
            'bottom': json.dumps(request_dict['b']),
        })
    else:
        return redirect('calibration')


def calibration(request):
    return render(request, 'messenger/calibration.html')
