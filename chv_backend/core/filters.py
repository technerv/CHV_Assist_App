import django_filters
from django.db import models

from .models import Facility


class FacilityFilter(django_filters.FilterSet):
    class Meta:
        model = Facility
        fields = [
            "name",
            "type",
            "services",
        ]
        filter_overrides = {
            models.JSONField: {
                "filter_class": django_filters.CharFilter,
                "extra": lambda f: {
                    "lookup_expr": "icontains",
                },
            }
        }
