const {locationDetails} = require('../models/beneficiary-location-model');

const getBeneficiaryLocationList = (query) => {
    return locationDetails.aggregate()
        .match({beneficiaryId: {$in: query}})
        .sort({"deviceDate": -1})
        .project({
            beneficiaryId: 1,
            latitude: 1,
            longitude: 1,
            locationId: 1
        })
        .group({
            _id: "$beneficiaryId",
            latestBeneficiaryLocation: {"$first": "$$CURRENT"}
        });
};
//OPERATOR
const selectCenterIdsForOperatorQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from users where user_id = $1)';

//SUPERVISOR
const selectCenterIdsForSupervisorQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1))';

//ADMIN
const selectCenterIdsForAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1)))';

//SUPER_ADMIN
const selectCenterIdsForSuperAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1))))';

//MASTER_ADMIN
const selectAllCenterIdsForMasterAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where location_level = 0';

const selectCenterIdsForGivenUserIdQuery = 'select location_id from location where parent_location_id = (select location_id from location where parent_location_id = (select location_id from users where user_id = $1))';



module.exports = {
    getBeneficiaryLocationList,
    selectCenterIdsForSupervisorQuery,
    selectCenterIdsForAdminQuery,
    selectCenterIdsForSuperAdminQuery,
    selectAllCenterIdsForMasterAdminQuery,
    selectCenterIdsForGivenUserIdQuery,
    selectCenterIdsForOperatorQuery
};
