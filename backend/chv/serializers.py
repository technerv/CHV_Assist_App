"""
Serializers for CHV Management System
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    CHV, Household, Member, Facility, Visit, Pregnancy,
    Referral, Reminder, MessageLog
)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user


class CHVSerializer(serializers.ModelSerializer):
    households_count = serializers.IntegerField(source='households.count', read_only=True)
    visits_count = serializers.IntegerField(source='visits.count', read_only=True)

    class Meta:
        model = CHV
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class FacilitySerializer(serializers.ModelSerializer):
    referrals_count = serializers.IntegerField(source='referrals.count', read_only=True)

    class Meta:
        model = Facility
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class HouseholdSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(source='members.count', read_only=True)
    visits_count = serializers.IntegerField(source='visits.count', read_only=True)
    assigned_chv_name = serializers.CharField(source='assigned_chv.name', read_only=True)

    class Meta:
        model = Household
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class MemberSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(read_only=True)
    household_head_name = serializers.CharField(source='household.head_name', read_only=True)
    pregnancies_count = serializers.IntegerField(source='pregnancies.count', read_only=True)

    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class VisitSerializer(serializers.ModelSerializer):
    chv_name = serializers.CharField(source='chv.name', read_only=True)
    household_head_name = serializers.CharField(source='household.head_name', read_only=True)
    member_name = serializers.CharField(source='member.name', read_only=True, allow_null=True)

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class PregnancySerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    gestational_age_weeks = serializers.IntegerField(read_only=True)

    class Meta:
        model = Pregnancy
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ReferralSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    chv_name = serializers.CharField(source='chv.name', read_only=True, allow_null=True)

    class Meta:
        model = Referral
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ReminderSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True, allow_null=True)
    chv_name = serializers.CharField(source='chv.name', read_only=True, allow_null=True)

    class Meta:
        model = Reminder
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class MessageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageLog
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'timestamp')
