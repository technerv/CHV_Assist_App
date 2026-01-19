"""
Views for CHV Management System
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    CHV, Household, Member, Facility, Visit, Pregnancy,
    Referral, Reminder, MessageLog
)
from .serializers import (
    CHVSerializer, HouseholdSerializer, MemberSerializer, FacilitySerializer,
    VisitSerializer, PregnancySerializer, ReferralSerializer,
    ReminderSerializer, MessageLogSerializer, UserRegistrationSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CHVViewSet(viewsets.ModelViewSet):
    queryset = CHV.objects.all().order_by('-created_at')
    serializer_class = CHVSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['county', 'sub_county', 'is_active']
    search_fields = ['name', 'phone', 'email']
    ordering_fields = ['created_at', 'name']


class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all().order_by('-created_at')
    serializer_class = HouseholdSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['county', 'sub_county', 'ward', 'assigned_chv']
    search_fields = ['head_name', 'contact_phone', 'location_text']
    ordering_fields = ['created_at', 'head_name']


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by('-created_at')
    serializer_class = MemberSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sex', 'household', 'is_pregnant', 'has_chronic_condition']
    search_fields = ['name', 'national_id', 'phone']
    ordering_fields = ['created_at', 'name']


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all().order_by('name')
    serializer_class = FacilitySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['county', 'sub_county', 'facility_type', 'is_active']
    search_fields = ['name', 'address']
    ordering_fields = ['name', 'created_at']


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all().order_by('-visit_date')
    serializer_class = VisitSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['chv', 'household', 'member', 'channel', 'follow_up_required']
    ordering_fields = ['visit_date', 'created_at']


class PregnancyViewSet(viewsets.ModelViewSet):
    queryset = Pregnancy.objects.all().order_by('-created_at')
    serializer_class = PregnancySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['member', 'status']
    ordering_fields = ['created_at', 'edd']


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all().order_by('-referral_date')
    serializer_class = ReferralSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['member', 'facility', 'chv', 'priority', 'status']
    search_fields = ['reason']
    ordering_fields = ['referral_date', 'created_at']


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all().order_by('schedule_at')
    serializer_class = ReminderSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'member', 'chv']
    ordering_fields = ['schedule_at', 'created_at']


class MessageLogViewSet(viewsets.ModelViewSet):
    queryset = MessageLog.objects.all().order_by('-timestamp')
    serializer_class = MessageLogSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['channel', 'direction', 'phone']
    ordering_fields = ['timestamp', 'created_at']
