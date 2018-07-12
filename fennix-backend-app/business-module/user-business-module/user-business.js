const {notNullCheck, arrayNotEmptyCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
const {fetchUserProfileAccesor, addUserAccessor, getTotalRecordsForListUsersAccessor, getUserListAccesor, updateUserProfileAccesor, getTotalNoOfUsersAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {excelRowsCreator, excelColCreator} = require('../../util-module/request-validators');

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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', userProfileReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const fetchUserDetailsBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userProfileResponse, returnObj;
    userProfileResponse = await fetchUserProfileAccesor(request);
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
        let userProfileReturnObj = {};
        userProfileResponse.rows.forEach((item) => {
            userProfileReturnObj = {
                userName: `${item['first_name']} ${item['last_name']}`,
                mobileNo: item['mobile_no'],
                userMailId: item['emailid'],
                userCenter: item['center_name'],
                gender: item['gender'],
                image: item['image'],
                userRole: item['role_name'],
                userAddress: item['address'],
            };
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', userProfileReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const getUserListBusiness = async (req) => {
    let request = [req.body.userId, req.body.languageId, req.body.skip, req.body.limit], userProfileResponse,
        returnObj, totalRecordsResponse, finalResponse = {};
    userProfileResponse = await getUserListAccesor(request);
    totalRecordsResponse = await getTotalRecordsForListUsersAccessor([req.body.userId]);
    finalResponse['totalNoOfRecords'] = totalRecordsResponse.rows[0]['count'];
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
        finalResponse['gridData'] = userProfileResponse.rows;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};
const addUserBusiness = async (req) => {
    let request = req.body;
    await addUserAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', []);
};
const downloadUsersListBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userListResponse, colsKeysResponse = {}, rowsIdsResponse,
        workbook = new Excel.Workbook(), modifiedResponse, downloadMapperResponse, keysArray = [], returnObj = {},
        sheet = workbook.addWorksheet('Beneficiary Sheet');
    colsKeysResponse = await excelColCreator([req.query.filterId]);
    sheet.columns = colsKeysResponse['cols'];
    keysArray = colsKeysResponse['keysArray'];
    userListResponse = await getUserListAccesor(request);
    rowsIdsResponse = excelRowsCreator(userListResponse, 'users', keysArray);
    returnObj = rowsIdsResponse['rows'];
    modifiedResponse = Object.keys(returnObj).map(key => returnObj[key]);
    sheet.addRows(modifiedResponse);
    return workbook.xlsx.writeFile('/home/sindhura.gudarada/Downloads/users.xlsx');
};
module.exports = {
    addUserBusiness,
    fetchUserProfileBusiness,
    updateUserProfileBusiness,
    getUserListBusiness,
    fetchUserDetailsBusiness,
    downloadUsersListBusiness
};
