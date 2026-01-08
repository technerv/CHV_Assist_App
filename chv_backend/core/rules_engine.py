from datetime import datetime, timedelta
from django.utils import timezone
from .models import Rule, Referral, Reminder, Facility

def evaluate_condition(payload, condition):
    try:
        key = condition.get("key")
        op = condition.get("op")
        value = condition.get("value")
        actual = payload
        for part in key.split("."):
            if isinstance(actual, dict):
                actual = actual.get(part)
            else:
                actual = getattr(actual, part, None)
        if op == "eq":
            return actual == value
        if op == "neq":
            return actual != value
        if op == "gt":
            return actual is not None and actual > value
        if op == "gte":
            return actual is not None and actual >= value
        if op == "lt":
            return actual is not None and actual < value
        if op == "lte":
            return actual is not None and actual <= value
        if op == "in":
            return actual in value
        if op == "contains":
            return isinstance(actual, (list, str)) and value in actual
        return False
    except Exception:
        return False

def matches(rule, payload):
    cond = rule.condition_json or {}
    if isinstance(cond, dict) and cond.get("all"):
        return all(evaluate_condition(payload, c) for c in cond["all"])
    if isinstance(cond, dict) and cond.get("any"):
        return any(evaluate_condition(payload, c) for c in cond["any"])
    return False

def execute_actions(rule, payload):
    actions = rule.actions_json or []
    for action in actions:
        t = action.get("type")
        if t == "set_flag" and hasattr(payload, "flagged"):
            payload.flagged = True
            payload.save(update_fields=["flagged"])
        if t == "create_referral":
            member = getattr(payload, "member", None) or getattr(getattr(payload, "visit", None), "member", None)
            facility_id = action.get("facility_id")
            facility = Facility.objects.filter(id=facility_id).first() if facility_id else None
            reason = action.get("reason", "Auto referral")
            priority = action.get("priority", "normal")
            if member and facility:
                Referral.objects.create(member=member, facility=facility, reason=reason, priority=priority)
        if t == "schedule_reminder":
            member = getattr(payload, "member", None) or getattr(getattr(payload, "visit", None), "member", None)
            chv = getattr(payload, "chv", None) or getattr(getattr(payload, "visit", None), "chv", None)
            when_minutes = action.get("in_minutes", 0)
            schedule_at = timezone.now() + timedelta(minutes=when_minutes)
            template_code = action.get("template_code", "follow_up")
            Reminder.objects.create(member=member, chv=chv, type=action.get("channel","sms"), schedule_at=schedule_at, template_code=template_code)

def run_rules(scope, payload):
    for rule in Rule.objects.filter(scope=scope, enabled=True):
        if matches(rule, payload):
            execute_actions(rule, payload)
