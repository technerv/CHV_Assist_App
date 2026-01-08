from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Referral, SymptomReport, MessageLog

class Command(BaseCommand):
    help = "Send daily digest to supervisors"

    def handle(self, *args, **options):
        now = timezone.now()
        start = now - timedelta(days=1)
        total_referrals = Referral.objects.filter(created_at__gte=start).count()
        completed_referrals = Referral.objects.filter(created_at__gte=start, status="completed").count()
        emergencies = SymptomReport.objects.filter(created_at__gte=start, flagged=True).count()
        payload = {
            "referrals": total_referrals,
            "referrals_completed": completed_referrals,
            "emergencies": emergencies,
            "from": str(start),
            "to": str(now),
        }
        MessageLog.objects.create(channel="app", direction="out", phone="", content="daily_digest", payload=payload)
        self.stdout.write("Daily digest created")
