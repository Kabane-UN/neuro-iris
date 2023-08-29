from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('calibration', views.calibration, name='calibration'),
    path('settings', views.settings, name='settings'),
    path('save_data', views.save_data, name='save_data'),
    path('success_screen', views.success_screen, name='success_screen'),
    path('fail_screen', views.fail_screen, name='fail_screen'),
]
