const {listSimcardsAccessor, listSimcardTypesAccessor} = require('../../repository-module/data-accesors/sim-card-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {arrayNotEmptyCheck} = require('../../util-module/data-validators');
const listSimcardsBusiness = async (req) => {
    let response, request = {centerId: `${req.query.centerId}`}, finalResponse, modifiedResponse = [];
    response = await listSimcardsAccessor(request);
    if (arrayNotEmptyCheck(response)) {
        response.forEach((item) => {
            let obj = {
                simCardId: item['_id'],
                number: item['phoneNo'],
                serialNo: item['serialNp'],
                isActive: item['isActive'],
                carrier: item['carrier']['name']
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_SIMCARDS_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const listSimcardTypesBusiness = async () => {
    let response, finalResponse;
    response = await listSimcardTypesAccessor();
    if (arrayNotEmptyCheck(response)) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', response);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_SIMCARD_TYPES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

module.exports = {
    listSimcardsBusiness,
    listSimcardTypesBusiness
};