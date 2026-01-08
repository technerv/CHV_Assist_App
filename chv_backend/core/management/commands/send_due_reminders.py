from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Reminder, MessageLog
import uuid

class Command(BaseCommand):
    help = "Send due reminders"

    def handle(self, *args, **options):
        now = timezone.now()
        qs = Reminder.objects.filter(status="scheduled", schedule_at__lte=now)
        sent = 0
        for r in qs:
            corr = uuid.uuid4().hex
            MessageLog.objects.create(
                channel=r.type,
                direction="out",
                phone=r.member.household.contact_phone if r.member and r.member.household else "",
                content=r.template_code,
                payload={"reminder_id": r.id},
                correlation_id=corr,
            )
            r.status = "sent"
            r.provider_message_id = corr
            r.save(update_fields=["status","provider_message_id"])
            sent += 1
        self.stdout.write(f"Sent {sent} reminders")
