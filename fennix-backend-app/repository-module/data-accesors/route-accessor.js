const routeQueries = require('../queries/route-query');

const insertRouteAccessor = async (req) => {
    let response;
    response = await routeQueries.insertCompanyRoutesQuery(req);
    return response;
};

const fetchAndUpdateCompanyRoutePrimaryKeyAccessor = async () => {
    let response;
    response = await routeQueries.fetchAndUpdateCompanyRoutePrimaryKeyQuery();
    return response;
};

const editCompanyRoutesAccessor = async (routeId, req) => {
    let response;
    response = await routeQueries.editCompanyRoutesQuery(routeId, req);
    return response;
};
const insertCompanyPrimaryAddressAccessor = async (req) => {
    let response;
    response = await routeQueries.insertCompanyPrimaryAddressQuery(req);
    return response;
};

const getRouteByCompanyIdAccessor = async(req)=>{
    let response;
    response = await routeQueries.getRouteByCompanyIdQuery(req);
    return response;
}
module.exports = {
    insertRouteAccessor,
    insertCompanyPrimaryAddressAccessor,
    editCompanyRoutesAccessor,
    getRouteByCompanyIdAccessor,
    fetchAndUpdateCompanyRoutePrimaryKeyAccessor
};
