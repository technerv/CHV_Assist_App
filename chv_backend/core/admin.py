from django.contrib import admin
from .models import CHV, Facility, Household, Member, Visit, SymptomReport, Pregnancy, Referral, Reminder, MessageLog, Rule, SyncEnvelope

admin.site.register(CHV)
admin.site.register(Facility)
admin.site.register(Household)
admin.site.register(Member)
admin.site.register(Visit)
admin.site.register(SymptomReport)
admin.site.register(Pregnancy)
admin.site.register(Referral)
admin.site.register(Reminder)
admin.site.register(MessageLog)
admin.site.register(Rule)
admin.site.register(SyncEnvelope)

# Register your models here.
