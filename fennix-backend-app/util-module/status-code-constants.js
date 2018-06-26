const statusCodeConstants = {
    STATUS_NO_ROLES_FOR_ID: 211,
    STATUS_OK: 200,
    STATUS_NO_CARDS_FOR_USER_ID: 207,
    STATUS_NO_TICKETS_FOR_USER_ID: 208,
    STATUS_NO_ROLES: 209,
    STATUS_NO_FILTERS_FOR_ID: 210,
    STATUS_USER_AUTHENTICATED: 600,
    STATUS_EMAIL_PRESENT: 601,
    STATUS_EMAIL_NOT_PRESENT: 602,
    STATUS_USER_RETIRED: 603,
    STATUS_NO_SIMCARDS_FOR_ID: 212,
    STATUS_NO_DEVICES_FOR_ID: 213,
    STATUS_NO_CENTERS_FOR_ID: 214,
    STATUS_NO_COUNTRIES_FOR_ID: 216,
    STATUS_PASSWORD_INCORRECT: 604,
    STATUS_POSTGRES_CONNECTION_ERROR: 700,
    STATUS_MONGO_CONNECTION_ERROR: 701
};

module.exports = {statusCodeConstants};
