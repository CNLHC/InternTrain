from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from numpy.random import choice
from turntable.models import Prize



class RatedThrottle(AnonRateThrottle):
    rate="10/min"


class drawlottery(APIView):
    """
    View to list all users in the system.
    """

    throttle_classes = (RatedThrottle,)

    def get(self, request, format=None):
        prizes = list(Prize.objects.all())
        name = choice([i.name for i in prizes],p=[j.chance/100.0 for j in prizes])
        return Response({
            "name":name
        })