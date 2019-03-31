from django.core.management.base import BaseCommand, CommandError
import  argparse
import  json
from  turntable.models import  Prize
from  django.db.transaction import atomic

class Command(BaseCommand):
    help = 'change the chance of lottery'

    def add_arguments(self, parser):
        parser.add_argument('-c','--conf', nargs=1, type=argparse.FileType('r'), required=True)

    @atomic
    def handle(self, *args, **options):
        jsobj = json.load(options['conf'][0])
        for item in jsobj:
            try:
                prize = Prize.objects.get(name__exact=item['name'])
                prize.chance=item['chance']
                prize.save()
            except Prize.DoesNotExist:
                Prize.objects.create(**item)




