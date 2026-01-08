from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .filters import FacilityFilter
from .models import (
    CHV,
    Facility,
    Household,
    Member,
    MessageLog,
    Pregnancy,
    Referral,
    Reminder,
    Rule,
    SymptomReport,
    SyncEnvelope,
    Visit,
)
from django.utils import timezone
from .serializers import (
    CHVSerializer,
    FacilitySerializer,
    HouseholdSerializer,
    MemberSerializer,
    VisitSerializer,
    SymptomReportSerializer,
    PregnancySerializer,
    ReferralSerializer,
    ReminderSerializer,
    MessageLogSerializer,
    RuleSerializer,
    SyncEnvelopeSerializer,
)

class CHVViewSet(viewsets.ModelViewSet):
    queryset = CHV.objects.all().order_by("-created_at")
    serializer_class = CHVSerializer
    permission_classes = [permissions.IsAuthenticated]

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all().order_by("-created_at")
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = FacilityFilter
    search_fields = ["name", "address"]
    ordering_fields = ["name", "created_at"]

class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all().order_by("-created_at")
    serializer_class = HouseholdSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["head_name", "contact_phone"]
    search_fields = ["head_name", "location_text"]
    ordering_fields = ["created_at"]

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-created_at")
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["sex", "household"]
    search_fields = ["name", "national_id"]
    ordering_fields = ["created_at", "name"]

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all().order_by("-created_at")
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["chv", "household", "member", "channel", "visit_date"]
    ordering_fields = ["visit_date", "created_at"]

class SymptomReportViewSet(viewsets.ModelViewSet):
    queryset = SymptomReport.objects.all().order_by("-created_at")
    serializer_class = SymptomReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["severity", "flagged", "visit"]
    ordering_fields = ["severity", "created_at"]

class PregnancyViewSet(viewsets.ModelViewSet):
    queryset = Pregnancy.objects.all().order_by("-created_at")
    serializer_class = PregnancySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["member"]
    ordering_fields = ["created_at", "gestational_age_weeks"]

class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all().order_by("-created_at")
    serializer_class = ReferralSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["member", "facility", "priority", "status"]
    search_fields = ["reason"]
    ordering_fields = ["created_at", "completed_at"]

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all().order_by("-created_at")
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["type", "status", "member", "chv"]
    ordering_fields = ["schedule_at", "created_at"]
    @action(detail=False, methods=["post"])
    def send_due(self, request):
        from django.utils import timezone
        import uuid
        now = timezone.now()
        due = Reminder.objects.filter(status="scheduled", schedule_at__lte=now)
        count = 0
        for r in due:
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
            count += 1
        return Response({"sent": count})

class MessageLogViewSet(viewsets.ModelViewSet):
    queryset = MessageLog.objects.all().order_by("-timestamp")
    serializer_class = MessageLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["channel", "direction", "phone"]
    ordering_fields = ["timestamp"]

class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=True, methods=["post"])
    def test(self, request, pk=None):
        rule = self.get_object()
        from .rules_engine import matches
        payload = request.data.get("payload", {})
        ok = matches(rule, payload)
        return Response({"matches": ok})

class USSDWebhook(APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        import hmac, hashlib, os
        secret = os.getenv("SHARED_WEBHOOK_SECRET")
        if secret:
            raw = request.body or b""
            sig = request.headers.get("X-Signature","")
            expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
            if sig != expected:
                return Response({"error":"invalid signature"}, status=403)
        phone = request.data.get("phone") or request.data.get("from")
        text = request.data.get("text","")
        session_id = request.data.get("sessionId","")
        MessageLog.objects.create(channel="ussd", direction="in", phone=phone or "", content=text or "", payload=request.data)
        menu = "Welcome\n1. Household Visit\n2. Referral\n3. Emergency"
        return Response(menu, content_type="text/plain")

class WhatsAppWebhook(APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        import hmac, hashlib, os
        secret = os.getenv("SHARED_WEBHOOK_SECRET")
        if secret:
            raw = request.body or b""
            sig = request.headers.get("X-Signature","")
            expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
            if sig != expected:
                return Response({"error":"invalid signature"}, status=403)
        phone = request.data.get("from")
        text = request.data.get("body","")
        MessageLog.objects.create(channel="whatsapp", direction="in", phone=phone or "", content=text or "", payload=request.data)
        return Response({"status":"ok"})

class SMSDLR(APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        import hmac, hashlib, os
        secret = os.getenv("SHARED_WEBHOOK_SECRET")
        if secret:
            raw = request.body or b""
            sig = request.headers.get("X-Signature","")
            expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
            if sig != expected:
                return Response({"error":"invalid signature"}, status=403)
        status = request.data.get("status","delivered")
        phone = request.data.get("to","")
        corr = request.data.get("correlation_id","")
        MessageLog.objects.create(channel="sms", direction="in", phone=phone, content=status, payload=request.data, correlation_id=corr)
        if corr:
            Reminder.objects.filter(provider_message_id=corr).update(status="delivered" if status=="delivered" else "failed")
        return Response({"status":"ok"})

class WhatsAppDLR(APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        import hmac, hashlib, os
        secret = os.getenv("SHARED_WEBHOOK_SECRET")
        if secret:
            raw = request.body or b""
            sig = request.headers.get("X-Signature","")
            expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
            if sig != expected:
                return Response({"error":"invalid signature"}, status=403)
        status = request.data.get("status","delivered")
        phone = request.data.get("to","")
        corr = request.data.get("correlation_id","")
        MessageLog.objects.create(channel="whatsapp", direction="in", phone=phone, content=status, payload=request.data, correlation_id=corr)
        if corr:
            Reminder.objects.filter(provider_message_id=corr).update(status="delivered" if status=="delivered" else "failed")
        return Response({"status":"ok"})
class SyncApply(APIView):
    def post(self, request):
        device_id = request.data.get("device_id","unknown")
        changes = request.data.get("changes",[])
        env = SyncEnvelope.objects.create(device_id=device_id, payload={"changes":changes})
        applied = []
        conflicts = []
        model_map = {
            "households": Household,
            "members": Member,
            "visits": Visit,
            "symptom_reports": SymptomReport,
            "pregnancies": Pregnancy,
            "referrals": Referral,
        }
        for ch in changes:
            model = model_map.get(ch.get("model"))
            if not model:
                continue
            data = ch.get("data",{})
            op = ch.get("op","upsert")
            client_updated = ch.get("updated_at")
            obj = None
            if op == "delete":
                pk = data.get("id")
                if pk:
                    model.objects.filter(id=pk).delete()
                    applied.append({"model":ch.get("model"), "id":pk, "op":"delete"})
                continue
            pk = data.get("id")
            if pk:
                obj = model.objects.filter(id=pk).first()
            if obj:
                server_updated = getattr(obj, "updated_at", None)
                if server_updated and client_updated and str(server_updated) > str(client_updated):
                    conflicts.append({"model":ch.get("model"), "id":pk, "reason":"server_newer"})
                    continue
                for k,v in data.items():
                    setattr(obj, k, v)
                obj.save()
                applied.append({"model":ch.get("model"), "id":obj.id, "op":"update"})
            else:
                # create
                obj = model.objects.create(**data)
                applied.append({"model":ch.get("model"), "id":obj.id, "op":"create"})
        env.applied_at = env.updated_at
        env.conflict_status = "conflicts" if conflicts else "none"
        env.save(update_fields=["applied_at","conflict_status"])
        return Response({"applied": applied, "conflicts": conflicts, "envelope_id": env.id})

class SyncChanges(APIView):
    def get(self, request):
        since = request.query_params.get("since")
        out = {}
        def serialize_qs(qs):
            return [obj.__dict__ for obj in qs]
        if since:
            out["households"] = list(Household.objects.filter(updated_at__gt=since).values())
            out["members"] = list(Member.objects.filter(updated_at__gt=since).values())
            out["visits"] = list(Visit.objects.filter(updated_at__gt=since).values())
            out["symptom_reports"] = list(SymptomReport.objects.filter(updated_at__gt=since).values())
            out["pregnancies"] = list(Pregnancy.objects.filter(updated_at__gt=since).values())
            out["referrals"] = list(Referral.objects.filter(updated_at__gt=since).values())
        else:
            out["households"] = list(Household.objects.all().values())
            out["members"] = list(Member.objects.all().values())
            out["visits"] = list(Visit.objects.all().values())
            out["symptom_reports"] = list(SymptomReport.objects.all().values())
            out["pregnancies"] = list(Pregnancy.objects.all().values())
            out["referrals"] = list(Referral.objects.all().values())
        return Response(out)

class SupervisorSummary(APIView):
    def get(self, request):
        now = timezone.now()
        visits_24h = Visit.objects.filter(created_at__gte=now - timezone.timedelta(hours=24)).count()
        pregnancies_total = Pregnancy.objects.count()
        referrals_pending = Referral.objects.filter(status="pending").count()
        referrals_urgent = Referral.objects.filter(priority="urgent", status="pending").count()
        emergencies_flagged_24h = SymptomReport.objects.filter(flagged=True, created_at__gte=now - timezone.timedelta(hours=24)).count()
        reminders_scheduled = Reminder.objects.filter(status="scheduled").count()
        return Response({
            "visits_24h": visits_24h,
            "pregnancies_total": pregnancies_total,
            "referrals_pending": referrals_pending,
            "referrals_urgent": referrals_urgent,
            "emergencies_flagged_24h": emergencies_flagged_24h,
            "reminders_scheduled": reminders_scheduled,
        })
