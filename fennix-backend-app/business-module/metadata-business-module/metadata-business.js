const {getCardMetadataAccessor, getFilterMetadataAccessor,getModalMetadataAccessor, getHeaderMetadataAccessor, getLoginMetadataAccessor, getLanguagesAccessor, getSideNavMetadataAccessor, getCenterIdsBasedOnUserIdAccessor, getSimcardDetailsAccessor, getRolesAccessor} = require('../../repository-module/data-accesors/metadata-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {mongoWhereInCreator} = require('../../util-module/request-validators');


const getBaseMetadataBusiness = async (req) => {
    let responseObj, headerResponse, sideNavResponse, composedData = {}, request;
    request = [req.body.userId, req.body.lang];
    headerResponse = await getHeaderMetadataAccessor(request);
    sideNavResponse = await getSideNavMetadataAccessor(request);
    if (objectHasPropertyCheck(headerResponse, 'rows') && objectHasPropertyCheck(sideNavResponse, 'rows')) {
        let headerObj = routeDataModifier(headerResponse);
        let sideNavObj = routeDataModifier(sideNavResponse);
        composedData['header'] = Object.keys(headerObj).map(dataItem => headerObj[dataItem]);
        composedData['sideNav'] = Object.keys(sideNavObj).map(dataItem => sideNavObj[dataItem]).sort((item, prevItem) => (item.sideNavOrder - prevItem.sideNavOrder));
        responseObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', composedData);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_NO_CARDS_FOR_USER_ID, 'en', composedData);
    }
    return responseObj;
};

const getCardMetadataForRouteBusiness = async (req) => {
    let responseObj, cardResponse, request;
    request = [req.body.userId, req.body.routeId, req.body.lang];
    cardResponse = await getCardMetadataAccessor(request);
    if (objectHasPropertyCheck(cardResponse, 'rows') && arrayNotEmptyCheck(cardResponse.rows)) {
        let returnObj;
        returnObj = cardResponse.rows.reduce(function (init, item) {
            if (objectHasPropertyCheck(init, 'widgetCards') && !objectHasPropertyCheck(init.widgetCards, item['role_cards_widgets_id'])) {
                const widgetObj = {};
                widgetObj[item['role_cards_widgets_id']] = {};
                init['widgetCards'][item['role_cards_widgets_id']] = {
                    cardId: 'C_' + item['role_card_id'],
                    cardSize: item['card_size'],
                    cardHeader: item['card_header'],
                    cardOrderId: item['card_order_id'],
                    widgets: widgetObj
                }
            }
            if (objectHasPropertyCheck(init['widgetCards'][item['role_cards_widgets_id']], 'widgets') && !objectHasPropertyCheck(init['widgetCards']['widgets'], item['role_cards_widgets_id'])) {
                let widgetSectionsObj = {...init['widgetCards'][item['role_cards_widgets_id']]['widgets'][item['role_cards_widgets_id']].widgetSections} || {};
                widgetSectionsObj = widgetSectionCreator(item, widgetSectionsObj);

                init['widgetCards'][item['role_cards_widgets_id']]['widgets'][item['role_cards_widgets_id']] = {
                    widgetId: 'W_' + item['role_cards_widgets_id'],
                    widgetOrderId: item['widget_order_id'],
                    widgetSize: item['widget_size'],
                    widgetSections: {...widgetSectionsObj},
                    widgetEndpoint: item['widget_endpoint'],
                    widgetInitSort: item['widget_init_sort'],
                    widgetReqType: item['widget_req_type'],
                    widgetReqParams: item['widget_req_params']
                }
            }
            return init;
        }, {widgetCards: {}});
        returnObj.widgetCards = Object.keys(returnObj.widgetCards).map((card) => {
            returnObj.widgetCards[card]['widgets'] = Object.keys(returnObj.widgetCards[card]['widgets']).map((widget) => {
                returnObj.widgetCards[card]['widgets'][widget]['widgetSections'] = Object.keys(returnObj.widgetCards[card]['widgets'][widget]['widgetSections']).map((section) => {
                    returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections'] = Object.keys(returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections']).map((subsection) => {
                        returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections'][subsection]['widgetSectionRows'] = Object.keys(returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections'][subsection]['widgetSectionRows']).map((row) => returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections'][subsection]['widgetSectionRows'][row]);
                        return returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section]['widgetSubSections'][subsection]
                    });
                    return returnObj.widgetCards[card]['widgets'][widget]['widgetSections'][section];
                });
                return returnObj.widgetCards[card]['widgets'][widget];
            });
            return returnObj.widgetCards[card];
        });
        responseObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', returnObj.widgetCards);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_NO_CARDS_FOR_USER_ID, 'en', []);
    }
    return responseObj;
};

const getFilterMetadataBusiness = async (req,colName) => {
    let request = [req.query.id], filterResponse, response;
    filterResponse = await getFilterMetadataAccessor(request,colName);
    if (objectHasPropertyCheck(filterResponse, 'rows') && arrayNotEmptyCheck(filterResponse.rows)) {
        response = fennixResponse(statusCodeConstants.STATUS_OK, 'en', filterResponse);
    } else {
        response = fennixResponse(statusCodeConstants.STATUS_NO_FILTERS_FOR_ID, 'en', []);
    }
    return response;
};

const getSimCardDetailsBusiness = async (req) => {
    var request = [req.query.userId], centerIds, mongoRequest, response;
    centerIds = await getCenterIdsBasedOnUserIdAccessor(request);
    if (objectHasPropertyCheck(centerIds, 'rows') && arrayNotEmptyCheck(centerIds.rows)) {
        let centerIdsReq = [];
        centerIds.rows.forEach(item => {
            centerIdsReq.push(`${item['location_id']}`);
        });
        mongoRequest = {centerId: mongoWhereInCreator(centerIdsReq)};
        response = await getSimcardDetailsAccessor(mongoRequest);
    }
    return response;
};

const getLoginMetadataBusiness = async (req) => {
    let responseObj, loginMetadtaResponse = {widgetSections: {}};
    responseObj = await getLoginMetadataAccessor();
    if (objectHasPropertyCheck(responseObj, 'rows') && arrayNotEmptyCheck(responseObj.rows)) {
        loginMetadtaResponse.widgetSections = responseObj.rows.reduce((init, item) => {
            init = {...init, ...widgetSectionCreator(item, init)};
            return init;
        }, {});
        loginMetadtaResponse['widgetSections'] = Object.keys(loginMetadtaResponse.widgetSections).map((section) => {
            loginMetadtaResponse.widgetSections[section]['widgetSubSections'] = Object.keys(loginMetadtaResponse.widgetSections[section]['widgetSubSections']).map((subsection) => {
                loginMetadtaResponse.widgetSections[section]['widgetSubSections'][subsection]['widgetSectionRows'] = Object.keys(loginMetadtaResponse.widgetSections[section]['widgetSubSections'][subsection]['widgetSectionRows']).map((rows) => loginMetadtaResponse.widgetSections[section]['widgetSubSections'][subsection]['widgetSectionRows'][rows]);
                return loginMetadtaResponse.widgetSections[section]['widgetSubSections'][subsection];
            });
            return loginMetadtaResponse.widgetSections[section];
        });
    }
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', loginMetadtaResponse);
};

const getLanguagesListBusiness = async (req) => {
    let responseObj, request, languageListResponse = {dropdownList: []};
    responseObj = await getLanguagesAccessor();
    if (objectHasPropertyCheck(responseObj, 'rows') && arrayNotEmptyCheck(responseObj.rows)) {
        responseObj.rows.forEach((item) => {
            languageListResponse.dropdownList.push(dropdownCreator(item.language_code, item.language_name, false));
        });
    }
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', languageListResponse);
};

const getModelMetadataBusiness = async (req) => {
    let response, responseMap = {}, request;
    request = [req.query.modalId, req.query.languageId];
    response = await getModalMetadataAccessor(request);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach(item => {
            switch (item['modal_attribute_position']) {
                case 'modal-body': {
                    responseMap = modalCreator(item, responseMap);
                    break;
                }
                case 'modal-footer': {
                    responseMap = modalCreator(item, responseMap);
                    break;
                }
            }
            responseMap['modal-header'] = {modalHeader: item['modal_header_name'], modalPosition: 'modal-header'};
        });
        responseMap = Object.keys(responseMap).map((key) => {
            if (key.toLowerCase() !== 'modal-header') {
                responseMap[key]['modalSection'] = Object.keys(responseMap[key]['modalSection']).map((section) => {
                    responseMap[key]['modalSection'][section]['modalRow'] = Object.keys(responseMap[key]['modalSection'][section]['modalRow']).map(row => responseMap[key]['modalSection'][section]['modalRow'][row]);
                    return responseMap[key]['modalSection'][section];
                });
            }
            return responseMap[key];
        });
        response = fennixResponse(statusCodeConstants.STATUS_OK, 'en', responseMap);
    } else {
        response = fennixResponse(statusCodeConstants.STATUS_NO_ROLES, 'en', []);
    }
    return response;
};

const getRolesBusiness = async (req) => {
    let response, rolesResponse;
    rolesResponse = getRolesAccessor([req.query.languageId]);
    if (objectHasPropertyCheck(rolesResponse, 'rows') && arrayNotEmptyCheck(rolesResponse.rows)) {
        let rolesResponse = rolesResponse.rows[0];
        response = fennixResponse(statusCodeConstants.STATUS_OK, 'en', rolesResponse);
    } else {
        response = fennixResponse(statusCodeConstants.STATUS_NO_ROLES, 'en', []);
    }
    return response;
};
//Private methods to modify the data for the way we need in the response
const widgetSectionCreator = (widgetItem, widgetSectionObj) => {
    let widgetSectionFinalObj = {};
    if (!objectHasPropertyCheck(widgetSectionObj, widgetItem['widget_section_order_id'])) {
        let widgetSectionBaseObj = {[widgetItem['widget_section_order_id']]: {}};
        widgetSectionBaseObj[widgetItem['widget_section_order_id']] = {
            sectionId: widgetItem['widget_section_order_id'],
            sectionTitle: widgetItem['widget_section_title'],
            sectionType: widgetItem['widget_section_type'],
            sectionSubType: widgetItem['widget_section_subtype'],
            widgetSubSections: widgetSubSectionCreator(widgetItem, {})
        };
        widgetSectionFinalObj = {...widgetSectionObj, ...widgetSectionBaseObj};
    } else {
        widgetSectionObj[widgetItem['widget_section_order_id']]['widgetSubSections'] = widgetSubSectionCreator(widgetItem, widgetSectionObj[widgetItem['widget_section_order_id']]['widgetSubSections']);
        widgetSectionFinalObj = widgetSectionObj;
    }
    return widgetSectionFinalObj;
};

const widgetSubSectionCreator = (widgetSubSectionItem, subSectionObj) => {
    let widgetSubSectionFinalObj = {};
    if (!objectHasPropertyCheck(subSectionObj, widgetSubSectionItem['widget_sub_section_order_id'])) {
        let widgetSubSectionBaseObj = {[widgetSubSectionItem['widget_sub_section_order_id']]: {}};
        widgetSubSectionBaseObj[widgetSubSectionItem['widget_sub_section_order_id']] = {
            subSectionType: widgetSubSectionItem['widget_sub_section_type'],
            subSectionOrderId: widgetSubSectionItem['widget_sub_section_order_id'],
            subSectionTitle: widgetSubSectionItem['widget_sub_section_title'],
            widgetSectionRows: {...widgetSectionRowCreator(widgetSubSectionItem, {})}
        };
        widgetSubSectionFinalObj = {...subSectionObj, ...widgetSubSectionBaseObj};
    } else {
        subSectionObj[widgetSubSectionItem['widget_sub_section_order_id']]['widgetSectionRows'] = {...subSectionObj[widgetSubSectionItem['widget_sub_section_order_id']]['widgetSectionRows'], ...widgetSectionRowCreator(widgetSubSectionItem, subSectionObj[widgetSubSectionItem['widget_sub_section_order_id']]['widgetSectionRows'])};
        widgetSubSectionFinalObj = subSectionObj;
    }
    return widgetSubSectionFinalObj;
};

const widgetSectionRowCreator = (widgetRowItem, sectionRowObj) => {
    let widgetSectionRowFinalObj = {};
    if (!objectHasPropertyCheck(sectionRowObj, widgetRowItem['widget_row_count'])) {
        let widgetSectionRowBaseObj = {[widgetRowItem['widget_row_count']]: {}};
        widgetSectionRowBaseObj[widgetRowItem['widget_row_count']] = {
            sectionRowId: widgetRowItem['widget_row_count'],
            sectionCols: [widgetColElementCreator(widgetRowItem)]
        };
        widgetSectionRowFinalObj = {...sectionRowObj, ...widgetSectionRowBaseObj};
    } else {
        const originalCol = [...sectionRowObj[widgetRowItem['widget_row_count']]['sectionCols']];
        originalCol.push(widgetColElementCreator(widgetRowItem));
        sectionRowObj[widgetRowItem['widget_row_count']] = {
            sectionRowId: widgetRowItem['widget_row_count'],
            sectionCols: [...originalCol]
        };
        widgetSectionRowFinalObj = sectionRowObj;
    }
    return widgetSectionRowFinalObj;
};

const widgetColElementCreator = (widgetColItem) => {
    let widgetBaseColItem = {
        widgetColId: widgetColItem['widget_col_count'],
        widgetColType: widgetColItem['widget_element_type'],
        widgetColSubType: widgetColItem['widget_element_subtype']
    };
    switch (widgetColItem['widget_section_type'].toLowerCase()) {
        case 'grid':
            widgetBaseColItem = {...widgetBaseColItem, ...widgetGridElementCreator(widgetColItem)};
            break;
        case 'chart':
            widgetBaseColItem = {...widgetBaseColItem, ...widgetChartElementCreator(widgetColItem)};
            break;
        case 'form':
            widgetBaseColItem = {...widgetBaseColItem, ...widgetFormElementCreator(widgetColItem)};
            break;
        case 'detail':
            widgetBaseColItem = {...widgetBaseColItem, ...widgetDetailElementCreator(widgetColItem)};
            break;
        case 'map':
            widgetBaseColItem = {...widgetBaseColItem, ...widgetMapElementCreator(widgetColItem)};
            break;
    }
    return widgetBaseColItem;
};

const widgetGridElementCreator = (widgetElementItem) => {
    let returnObj = {
        gridElementAction: widgetElementItem['element_action'],
        gridHeaderOrderId: widgetElementItem['widget_col_count'],
        gridHeaderMappingKey: widgetElementItem['request_mapping_key'],
        gridColType: widgetElementItem['element_type'],
        gridColSubType: widgetElementItem['element_subtype'],
        subWidgetColId: widgetElementItem['widget_col_count'],
        subWidgetRowId: widgetElementItem['widget_row_count'],
        gridHeaderColName: widgetElementItem['element_title']
    };
    switch (widgetElementItem['element_subtype'].toLowerCase()) {
        case 'modal-pill':
            returnObj = {
                ...returnObj,
                primaryValue: widgetElementItem['element_primary_value__validation'],
                secondaryValue: widgetElementItem['element_secondary_value__async_validation'],
                hoverValue: widgetElementItem['default_value__hover_value'],
                iconValue: widgetElementItem['element_icon_value'],
                accentValue: widgetElementItem['default_key__accent_value'],
                gridModalId: widgetElementItem['default_key']
            };
            break;
        case 'navigate-link':
            returnObj = {
                ...returnObj,
                gridModalId: widgetElementItem['default_key'],
                gridNavigationRoute: widgetElementItem['navigation_route'],
            };
            break;
        case 'modal-link':
            returnObj = {
                ...returnObj,
                gridModalId: widgetElementItem['default_key'],
                gridSubmitEndpoint: widgetElementItem['submit_endpoint'],
                gridNavigationRoute: widgetElementItem['navigation_route']
            };
            break;
        case 'text':
        case 'text-number':
            returnObj = {
                ...returnObj,
                gridDefaultValue: widgetElementItem['default_value__hover_value'],
                gridDefaultKey: widgetElementItem['default_key__accent_value']
            };
            break;
        case 'color-cell':
            returnObj = {
                ...returnObj,
                gridBgColor: widgetElementItem['default_value__hover_value'],
                gridTextColor: widgetElementItem['default_key__accent_value']
            };
            break;
    }
    return returnObj;
};
const widgetChartElementCreator = (widgetElementItem) => {
    let widgetElementData = {
        elementColumnId: widgetElementItem['widget_col_count'],
        attributeId: widgetElementItem['role_card_widget_attribute_id'],
        elementType: widgetElementItem['element_type'],
        elementSubType: widgetElementItem['element_subtype'],
        colorKey: widgetElementItem['request_mapping_key'],
        colorValue: widgetElementItem['default_value__hover_value']
    };
    return widgetElementData;
};
const widgetFormElementCreator = (widgetElementItem) => {
    let widgetElementData = {};
    if (objectHasPropertyCheck(widgetElementItem, 'element_type')) {
        widgetElementData = {
            elementColumnId: widgetElementItem['widget_col_count'],
            attributeId: widgetElementItem['role_card_widget_attribute_id'],
            elementType: widgetElementItem['element_type'],
            elementSubType: widgetElementItem['element_subtype'],
            syncValidations: widgetElementItem['element_primary_value__validation'],
            asyncValidations: widgetElementItem['element_secondary_value__async_validation'],
            elementIsEditableFlag: widgetElementItem['is_editable'],
            elementIsDisabledFlag: widgetElementItem['disable_flag'],
            onElementChangeAction: widgetElementItem['element_action_type']
        };
        switch (widgetElementItem['element_type'].toLowerCase()) {
            case 'input':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetElementItem['default_value__hover_value'],
                        elementTitle: widgetElementItem['element_title'],
                        requestMappingKey: widgetElementItem['request_mapping_key']
                    }
                };
                break;
            case 'checkbox':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetElementItem['default_value__hover_value'],
                        elementTitle: widgetElementItem['element_title'],
                        requestMappingKey: widgetElementItem['request_mapping_key'],
                        elementLabel: widgetElementItem['element_label']
                    }
                };
                break;

            case 'dropdown':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetElementItem['default_value__hover_value'],
                        defaultKey: widgetElementItem['default_key__accent_value'],
                        elementTitle: widgetElementItem['element_title'],
                        requestMappingKey: widgetElementItem['request_mapping_key'],
                        dropdownEndpoint: widgetElementItem['dropdown_endpoint'],
                        submitEndpoint: widgetElementItem['submit_endpoint'],
                    }
                };
                break;
            case 'button':
                widgetElementData = {
                    ...widgetElementData, ...{
                        submitEndpoint: widgetElementItem['submit_endpoint'],
                        elementLabel: widgetElementItem['element_label']
                    }
                };
                break;

            case 'text-link':
            case 'detail-text':
                widgetElementData = {
                    ...widgetElementData, ...{
                        elementLabel: widgetElementItem['element_label']
                    }
                };
                break;
        }
    }
    return widgetElementData;
};
const widgetDetailElementCreator = (widgetElementItem) => {
};
const widgetMapElementCreator = (widgetElementItem) => {
    let widgetElementData = {};
    switch (widgetElementItem['element_subtype'].toLowerCase()) {
        case 'marker':
            widgetElementData = {
                ...widgetElementData,
                markerMappingKey: widgetElementItem['request_mapping_key']
            };
            break;
        case 'marker-details':
            widgetElementData = {
                ...widgetElementData,
                markerPrimaryDetails: widgetElementItem['default_key__accent_value'],
                markerDetailModalId: widgetElementItem['element_modal_id']
            };
            break;
    }
    return widgetElementData;
};

const routeDataModifier = (arrayResponse) => {
    let modifiedRouteObj = {};
    if (arrayNotEmptyCheck(arrayResponse.rows)) {
        arrayResponse.rows.forEach((item) => {
            const parentRouteId = item['parent_route_id'];
            if (objectHasPropertyCheck(item, 'child_route_id') && objectHasPropertyCheck(modifiedRouteObj, parentRouteId)) {
                const childItem = childRouteCreator(item);
                modifiedRouteObj[parentRouteId]['childItems'] = modifiedRouteObj[parentRouteId]['childItems'] || [];
                modifiedRouteObj[parentRouteId]['childItems'].push(childItem);
            } else {
                const parentItem = {
                    itemId: item['parent_route_id'],
                    routeId: item['parent_route_id'],
                    routeModalId: item['parent_route_modal_id'],
                    action: item['parent_action'],
                    icon: item['parent_icon'],
                    position: item['route_position'],
                    routeType: item['parent_route_type'],
                    routeHoverTooltip: item['parent_route_hover_tooltip'],
                    routeOrderId: item['route_order_id'],
                    routeName: item['parent_route_name'],
                    routeUrl: item['parent_route_url'],
                    sideNavOrder: item['sidenav_order_id']
                };
                if (objectHasPropertyCheck(item, 'child_route_id')) {
                    parentItem['childItems'] = [childRouteCreator(item)];
                }
                modifiedRouteObj[parentRouteId] = parentItem;
            }
        });
    }
    return modifiedRouteObj;
};
const childRouteCreator = (item) => {
    const childItem = {
        itemId: item['child_route_id'],
        routeId: item['child_route_id'],
        action: item['child_action'],
        icon: item['child_icon'],
        routeModalId: item['child_route_modal_id'],
        position: item['route_position'],
        routeName: item['child_route_name'],
        routeUrl: item['child_route_url']
    };
    return childItem;
};

const modalCreator = (item, response) => {
    let responseMap = response || {};
    const modalObj = {
        modalElementName: item['modal_element_name'],
        modalId: item['modal_id'],
        modalDataEndpoint: item['data_element'],
        modalSubmitEndpoint: item['submit_endpoint'],
        modalElementAction: item['action_name'],
        modalElementType: item['element_type'],
        modalElementSubType: item['sub_type'],
        modalColId: item['modal_col_count']
    };
    if (objectHasPropertyCheck(responseMap, item['modal_attribute_position'])) {
        responseMap[item['modal_attribute_position']] = responseMap[item['modal_attribute_position']];
    } else {
        responseMap[item['modal_attribute_position']] = {};
    }
    if (objectHasPropertyCheck(responseMap[item['modal_attribute_position']], 'modalSection')) {
        responseMap[item['modal_attribute_position']] = responseMap[item['modal_attribute_position']];
    } else {
        responseMap[item['modal_attribute_position']] = {
            modalPosition: item['modal_attribute_position'],
            modalSection: {}
        };
    }
    if (objectHasPropertyCheck(responseMap[item['modal_attribute_position']]['modalSection'], item['modal_section'])) {
        responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']] = responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']];
    } else {
        responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']] = {
            modalSectionType: item['modal_parent_type'],
            modalRow: {},
            modalSectionId: item['modal_section']
        };
    }
    if (objectHasPropertyCheck(responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']], 'modalRow') && objectHasPropertyCheck(responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']]['modalRow'], item['modal_row_count'])) {
        responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']]['modalRow'][item['modal_row_count']] = responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']]['modalRow'][item['modal_row_count']];
    } else {
        responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']]['modalRow'][item['modal_row_count']] = {
            modalRowId: item['modal_row_count'],
            modalCols: []
        };
    }
    responseMap[item['modal_attribute_position']]['modalSection'][item['modal_section']]['modalRow'][item['modal_row_count']]['modalCols'].push(modalObj);
    return responseMap;
};
module.exports = {
    getFilterMetadataBusiness,
    getBaseMetadataBusiness,
    getCardMetadataForRouteBusiness,
    getSimCardDetailsBusiness,
    getLoginMetadataBusiness,
    getModelMetadataBusiness,
    getLanguagesListBusiness,
    getRolesBusiness
};