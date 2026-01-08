from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SymptomReport, Pregnancy
from .rules_engine import run_rules

@receiver(post_save, sender=SymptomReport)
def after_symptom_report(sender, instance, created, **kwargs):
    if created:
        run_rules("visit", instance)

@receiver(post_save, sender=Pregnancy)
def after_pregnancy(sender, instance, created, **kwargs):
    if created:
        run_rules("pregnancy", instance)
