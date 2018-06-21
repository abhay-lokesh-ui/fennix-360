const {notNullCheck, arrayNotEmptyCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
const {fetchUserProfileAccesor,addUserAccessor, getUserListAccesor, updateUserProfileAccesor} = require('../../repository-module/data-accesors/user-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const fetchUserProfileBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userProfileResponse, returnObj;
    userProfileResponse = await fetchUserProfileAccesor(request);
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
        let userProfileReturnObj = {};
        userProfileResponse.rows.forEach((item) => {
            userProfileReturnObj = {
                firstName: item['first_name'],
                lastName: item['last_name'],
                phoneNo: item['mobile_no'],
                emailId: item['emailid'],
                center: item['center_name'],
                gender: item['gender'],
                image: item['image'],
                role: item['role_name'],
                address: item['address'],
            };
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', userProfileReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
//TODO write the logic for this
const updateUserProfileBusiness = async (req) => {
    let request = [req.body.userId], userProfileResponse, returnObj;
    userProfileResponse = await updateUserProfileAccesor(request);
    if (notNullCheck(userProfileResponse) && arrayNotEmptyCheck(userProfileResponse)) {
        let ticketObj = {};
        userProfileResponse.forEach((item) => {
            ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

const getUserListBusiness = async (req) => {
    let request = [req.body.userId], userProfileResponse, returnObj;
    userProfileResponse = await getUserListAccesor(request);
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', userProfileResponse.rows);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
const addUserBusiness = async (req) => {
    let request = req.body;
    await addUserAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', []);
};

module.exports = {
    addUserBusiness,
    fetchUserProfileBusiness,
    updateUserProfileBusiness,
    getUserListBusiness
};