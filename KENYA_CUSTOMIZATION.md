# Kenya Market Customization Summary

This document summarizes all the customizations made to the CHV Assist App for the Kenyan market.

## Backend Changes

### 1. Settings (chv_backend/chv_backend/settings.py)
- **Timezone**: Changed from `UTC` to `Africa/Nairobi` to use Kenya's timezone

### 2. Models (chv_backend/core/models.py)

#### CHV Model
- Added `mpesa_number` field for M-Pesa payments
- Added `county` field with all 47 Kenyan counties
- Added `sub_county` field
- Added `ward` field

#### Facility Model
- Updated `type` field with Kenyan healthcare facility types:
  - Dispensary
  - Health Centre
  - Sub-County Hospital
  - County Hospital
  - National Referral Hospital
  - Private Hospital
  - Clinic
  - Other
- Added `mpesa_paybill` field for facility payments
- Added `county` field
- Added `sub_county` field
- Added `ward` field

#### Household Model
- Added `county` field
- Added `sub_county` field
- Added `ward` field
- Added `village` field

#### Member Model
- Added `mpesa_number` field
- Added `nhif_number` field for NHIF membership
- Updated `national_id` field help text to specify 8 digits

## Frontend Changes

### 1. New Utility File (admin/src/utils/kenyaConstants.js)
Created comprehensive Kenyan constants:
- **KENYAN_COUNTIES**: All 47 counties as dropdown options
- **FACILITY_TYPES**: Kenyan healthcare facility types
- **HEALTH_SERVICES**: Common health services in Kenya
- **validateKenyanPhone()**: Validates Kenyan phone formats (07XX, +254, 254)
- **formatKenyanPhone()**: Normalizes phone numbers to Kenyan format
- **validateKenyanNationalID()**: Validates 8-digit Kenyan National ID

### 2. CHV Component (admin/src/resources/CHVs.jsx)
- Added county dropdown with all 47 counties
- Added M-Pesa number field with validation
- Added sub-county and ward fields
- Updated phone number field with Kenyan validation
- Updated labels and helper text for Kenyan context

### 3. Facilities Component (admin/src/resources/Facilities.jsx)
- Added facility type dropdown with Kenyan healthcare types
- Added county dropdown
- Added sub-county and ward fields
- Added M-Pesa Paybill number field
- Updated services to use predefined Kenyan health services
- Updated phone validation for Kenyan format

### 4. Households Component (admin/src/resources/Households.jsx)
- Added county dropdown
- Added sub-county, ward, and village fields
- Updated phone number validation for Kenyan format
- Updated location fields for Kenyan administrative structure

### 5. Members Component (admin/src/resources/Members.jsx)
- Added M-Pesa number field
- Added National ID field with 8-digit validation
- Added NHIF number field
- Updated phone number validation for Kenyan format
- Updated date of birth field name to `dob` (matching backend)

### 6. App Component (admin/src/App.jsx)
- Updated app title to "CHV Assist - Kenya"

### 7. Dashboard Component (admin/src/Dashboard.jsx)
- Updated title to include "Kenya"
- Updated time display to use Kenya timezone formatting

## Database Migration Required

After these changes, you need to create and run migrations:

```bash
cd chv_backend
python manage.py makemigrations
python manage.py migrate
```

## Key Features for Kenya

1. **47 Counties Support**: Full administrative structure (County → Sub-County → Ward → Village)

2. **M-Pesa Integration**: 
   - CHV M-Pesa numbers for payments
   - Member M-Pesa numbers
   - Facility Paybill numbers

3. **Phone Number Handling**:
   - Accepts multiple formats (07XX, +254, 254)
   - Automatic normalization
   - Validation for Kenyan mobile networks

4. **National ID**: 
   - 8-digit validation
   - Format checking

5. **NHIF Support**: 
   - NHIF membership number tracking

6. **Kenyan Healthcare System**:
   - Facility types matching Kenya's healthcare structure
   - Common health services pre-configured
   - Alignment with Kenyan healthcare terminology

7. **Timezone**: 
   - All timestamps in Africa/Nairobi timezone
   - Proper date/time display for Kenyan users

## Testing Checklist

- [ ] Test phone number validation with various formats
- [ ] Test National ID validation (8 digits)
- [ ] Test county dropdown with all 47 counties
- [ ] Test facility type selection
- [ ] Test M-Pesa number fields
- [ ] Verify timezone displays correctly
- [ ] Test form submissions with Kenyan data
- [ ] Verify database migrations run successfully

## Notes

- All phone numbers are normalized to local format (07XX) for consistency
- County selection is required for proper location tracking
- M-Pesa fields are optional but recommended for payment functionality
- National ID validation ensures data quality
- Facility types align with Kenya's healthcare system structure
