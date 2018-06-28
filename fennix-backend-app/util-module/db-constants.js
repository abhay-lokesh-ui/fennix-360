const TABLE_USERS = 'users';
const TABLE_BENEFICIARIES = 'beneficiaries';
const TABLE_LOCATION = 'location';
const TABLE_ROLES = 'roles';

const dbTableColMap = {
    users: {
        locationId: 'location_id',
        address: 'address1',
        center:'center_id',
        country:'location_id',
        firstName: 'first_name',
        lastName: 'last_name',
        emailId: 'email_id',
        phoneNo: 'mobile_no',
        gender: 'gender',
        image: 'image',
        role: 'user_role'
    },
    beneficiaries: {
        firstName: 'firstname',
        lastName: 'lastname',
        emailId: 'emailid',
        mobileNo: 'mobileno',
        gender: 'gender',
        image: 'image',
        locationId: 'location_id',
        height: 'height',
        weight: 'weight',
        role: 'beneficiary_role',
        hairColor: 'hair_color',
        eyeColor: 'eye_color',
        crimeId: 'crime_id',
        documentId: 'document_id',
        ethnicityId: 'ethnicity_id',
        familyPhone: 'family_phone',
        centerId: 'center_id',
        languageId: 'language_id',
        riskId: 'risk_id',
        scarsMarksTatoos: 'scars_marks_tatoos',
        dob: 'dob',
        hasHouseArrest: 'hashousearrest',
        address: 'address1',
        ownerUserId: 'owner_user_id'
    },
    filterset: {
        roleCardId: 'role_card_id',
        routeId: 'route_id',
        roleCardWidgetId: 'role_card_widget_id'
    }
};

module.exports = {
    dbTableColMap,
    TABLE_BENEFICIARIES,
    TABLE_LOCATION,
    TABLE_ROLES,
    TABLE_USERS
};
