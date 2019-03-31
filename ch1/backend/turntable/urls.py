from django.urls import path,include
from  turntable.api import drawlottery

urlpatterns = [
    path('turnTable',drawlottery.as_view())
]
