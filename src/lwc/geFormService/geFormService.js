import getRenderWrapper from '@salesforce/apex/GE_TemplateBuilderCtrl.retrieveDefaultSGERenderWrapper';
import getAllocationSettings from '@salesforce/apex/GE_FormRendererService.getAllocationsSettings';
import saveAndProcessDataImport from '@salesforce/apex/GE_GiftEntryController.saveAndProcessDataImport';
import { handleError } from 'c/utilTemplateBuilder';
import saveAndDryRunDataImport
    from '@salesforce/apex/GE_GiftEntryController.saveAndDryRunDataImport';
import {api} from "lwc";
import { isNotEmpty, isEmpty } from 'c/utilCommon';
import getFormRenderWrapper
    from '@salesforce/apex/GE_FormServiceController.getFormRenderWrapper';
import OPPORTUNITY_AMOUNT from '@salesforce/schema/Opportunity.Amount';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import DI_PAYMENT_STATUS_FIELD from '@salesforce/schema/DataImport__c.Payment_Status__c';
import DI_PAYMENT_DECLINED_REASON_FIELD from '@salesforce/schema/DataImport__c.Payment_Declined_Reason__c';

import insertDataImport from '@salesforce/apex/GE_GiftEntryController.insertDataImport';
import makePurchaseCall from '@salesforce/apex/GE_GiftEntryController.makePurchaseCall';

// TODO: Remove placeholder tokenize call later
import makeTokenizeCall from '@salesforce/apex/GE_GiftEntryController.makeTokenizeCall';
import { SingleSaveResult } from './singleSaveResult';

const PAYMENT_STATUS__C = DI_PAYMENT_STATUS_FIELD.fieldApiName;
const PAYMENT_DECLINED_REASON__C = DI_PAYMENT_DECLINED_REASON_FIELD.fieldApiName;

// https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_enum_Schema_DisplayType.htm
// this list only includes fields that can be handled by lightning-input
const inputTypeByDescribeType = {
    'BOOLEAN': 'checkbox',
    'CURRENCY': 'number',
    'DATE': 'date',
    'DATETIME': 'datetime-local',
    'EMAIL': 'email',
    'DOUBLE': 'number',
    'INTEGER': 'number',
    'LONG': 'number',
    'PERCENT': 'number',
    'STRING': 'text',
    'PHONE': 'tel',
    'TEXT': 'text',
    'TIME': 'time',
    'URL': 'url'
};

const numberFormatterByDescribeType = {
  'PERCENT': 'percent-fixed',
  'CURRENCY': 'currency',
  'DECIMAL': 'decimal'
};

class GeFormService {

    fieldMappings;
    objectMappings;
    fieldTargetMappings;
    donationFieldTemplateLabel;

    /**
     * Retrieve the default form render wrapper.
     * @returns {Promise<FORM_RenderWrapper>}
     */
    @api
    getFormTemplate() {
        return new Promise((resolve, reject) => {
            getRenderWrapper({})
                .then((result) => {
                    this.fieldMappings = result.fieldMappingSetWrapper.fieldMappingByDevName;
                    this.objectMappings = result.fieldMappingSetWrapper.objectMappingByDevName;
                    this.fieldTargetMappings = result.fieldMappingSetWrapper.fieldMappingByTargetFieldName;
                    if(isEmpty(this.donationFieldTemplateLabel)) {
                        this.donationFieldTemplateLabel = this.getDonationAmountCustomLabel(result.formTemplate);
                    }
                    resolve(result);
                })
                .catch(error => {
                    handleError(error);
                });
        });
    }

    getAllocationSettings() {
        return new Promise((resolve, reject) => {
           getAllocationSettings()
               .then(resolve)
               .catch(handleError)
        });
    }

    /**
     * Get the type of lightning-input that should be used for a given field type.
     * @param dataType  Data type of the field
     * @returns {String}
     */
    getInputTypeFromDataType(dataType) {
        return inputTypeByDescribeType[dataType];
    }

    /**
     * Get the formatter for a lightning-input that should be used for a given field type
     * @param dataType  Data type of the field
     * @returns {String | undefined}
     */
    getNumberFormatterByDescribeType(dataType) {
        return numberFormatterByDescribeType[dataType];
    }

    /**
     * Get a field info object by dev name from the render wrapper object
     * @param fieldDevName  Dev name of the object to retrieve
     * @returns {BDI_FieldMapping}
     */
    getFieldMappingWrapper(fieldDevName) {
        return this.fieldMappings[fieldDevName];
    }

    /**
     * Get a field info object by dev name from the render wrapper object
     * @param fieldDevName  Dev name of the object to retrieve
     * @returns {BDI_FieldMapping}
     */
    getFieldMappingWrapperFromTarget(targetFieldName) {
        return this.fieldTargetMappings[targetFieldName];
    }

    /**
     * Get a object info object by dev name from the render wrapper object
     * @param objectDevName
     * @returns {BDI_ObjectMapping}
     */
    getObjectMappingWrapper(objectDevName) {
        return this.objectMappings[objectDevName];
    }

    /**
     * Get the user-defined label used for the Opportunity Amount field on the
     * @return {string}
     */
    getDonationAmountCustomLabel(formTemplate) {
        // find field that is mapped to Opportunity Amount
        const mapping = this.getFieldMappingWrapperFromTarget(`${OPPORTUNITY_OBJECT.objectApiName}.${OPPORTUNITY_AMOUNT.fieldApiName}`);
        const mappingDevName = mapping.DeveloperName;
        // get developer name of mapping cmt
        let fieldElement;
        for(const section of formTemplate.layout.sections) {
           fieldElement = section.elements.find( element => {
               if(Array.isArray(element.dataImportFieldMappingDevNames)) {
                   return element.dataImportFieldMappingDevNames.includes(mappingDevName);
               }
           });
        }

        if(isNotEmpty(fieldElement)) {
            // return custom label from the form template layout
            return fieldElement.customLabel;
        }
    }

    /**
     * Takes a list of sections, reads the fields and values, creates a di record, and creates an opportunity from the di record
     * @param sectionList
     * @returns opportunityId
     */
    async handleSave(sectionList, record, dataImportRecord, dataImportRecordId) {
        let { diRecord, widgetValues } = this.getDataImportRecord(sectionList, record, dataImportRecord);
        const hasUserSelectedDonation = isNotEmpty(dataImportRecord);

        const hasPaymentToProcess = await this.retrieveToken(diRecord);
        const isPaymentProcessReattempt = hasPaymentToProcess && dataImportRecordId;

        if (isPaymentProcessReattempt) {
            diRecord.Id = dataImportRecordId;
        }

        const saveResponse = hasPaymentToProcess ?
            await this.handlePaymentProcessing(diRecord, widgetValues, hasUserSelectedDonation) :
            await this.handleSaveAndProcess(diRecord, widgetValues, hasUserSelectedDonation);

        return saveResponse;
    }

    /*******************************************************************************
    * @description Methods attempts to retrieve a token from the tokenize card widget
    * (geFormWidgetTokenizeCard).
    *
    * @param {object} dataImportRecord: A DataImport__c record
    *
    * @return {boolean}: True if a token was retrieved from the tokenize card widget
    */
    retrieveToken = async (dataImportRecord) => {
        // TODO: Temporary way of retrieving the token, replace with actual call later
        // Query for the widget component?
        dataImportRecord.token = await makeTokenizeCall();
        return dataImportRecord.token ? true : false;
    }

    /*******************************************************************************
    * @description Methods handles attempting to make a purchase call to Payment
    * Services. Immediately attempts to the charge the card provided in the Payment
    * Services iframe (GE_TokenizeCard).
    *
    * @param {object} dataImportRecord: A DataImport__c record
    * @param {object} widgetValues: Data held in various form widgets
    * @param {boolean} hasUserSelectedDonation: True if a user has selected a
    *   donation/payment through the 'Review Donations' modal. It means that we're
    *   attempting to match to a specific donation record during BDI processing.
    *
    * @return {object} saveResponse: Object will either contain data from successfully
    *   processing a data import or data from a failed purchase call attempt.
    */
    handlePaymentProcessing = async (dataImportRecord, widgetValues, hasUserSelectedDonation) => {
        const purchaseCallResponse = await this.handlePurchaseCall(dataImportRecord);
        if (purchaseCallResponse) {
            this.setPaymentStatusAndReason(dataImportRecord, purchaseCallResponse);

            const isSuccessfulPurchase = purchaseCallResponse.statusCode === 201;
            const saveResponse = isSuccessfulPurchase ?
                await this.handleSaveAndProcess(dataImportRecord, widgetValues, hasUserSelectedDonation) :
                await this.handleFailedPurchaseCall(dataImportRecord, widgetValues, purchaseCallResponse);

            return saveResponse;
        }
    }

    /*******************************************************************************
    * @description Methods posts an http request through the `makePurchaseCall` apex
    * method and parses the response.
    *
    * @param {object} dataImportRecord: A DataImport__c record
    *
    * @return {object} response: An http response object
    */
    handlePurchaseCall = async (dataImportRecord) => {
        let purchaseCallResponseString = await makePurchaseCall({ dataImportRecord: dataImportRecord });
        let response = JSON.parse(purchaseCallResponseString);
        response.body = JSON.parse(response.body);

        return response;
    }

    /*******************************************************************************
    * @description Methods sets values Payment Services related Data Import fields.
    * Payment_Status__c and Payment_Declined_Reason__c.
    *
    * @param {object} dataImportRecord: A DataImport__c record
    * @param {object} purchaseResponse: An http response object
    */
    setPaymentStatusAndReason = (dataImportRecord, purchaseResponse) => {
        const paymentStatus = purchaseResponse.body.status || purchaseResponse.status || 'Unknown';
        dataImportRecord[PAYMENT_STATUS__C] = paymentStatus;

        const isSuccessfulPurchase = purchaseResponse.statusCode === 201;
        if (isSuccessfulPurchase) {
            dataImportRecord[PAYMENT_DECLINED_REASON__C] = null;
        } else {
            dataImportRecord[PAYMENT_DECLINED_REASON__C] = JSON.stringify(purchaseResponse.body);
        }
    }

    /*******************************************************************************
    * @description Methods handles a failed purchase call. Inserts the DataImport__c
    * record with the purchase call response info.
    *
    * @param {object} dataImportRecord: A DataImport__c record
    * @param {object} widgetValues: Data held in various form widgets
    * @param {object} purchaseResponse: An http response object
    *
    * @return {object} SingleSaveResult: Single save response object defined in
    *   singeSaveResponse.js
    */
    handleFailedPurchaseCall = async (dataImportRecord, widgetValues, purchaseResponse) => {
        const widgetJson = JSON.stringify(widgetValues);
        const insertResponse =
            await insertDataImport({ diRecord: dataImportRecord, widgetData: widgetJson });

        return new SingleSaveResult(false, insertResponse.Id, purchaseResponse);
    }

    /*******************************************************************************
    * @description Methods handles saving and processing a Data Import record.
    *
    * @param {object} dataImportRecord: A DataImport__c record
    * @param {object} widgetValues: Data held in various form widgets
    * @param {boolean} hasUserSelectedDonation: True if a user has selected a
    *   donation/payment through the 'Review Donations' modal. It means that we're
    *   attempting to match to a specific donation record during BDI processing.
    *
    * @return {object} SingleSaveResult: Single save response object defined in
    *   singeSaveResponse.js
    */
    handleSaveAndProcess = async (dataImportRecord, widgetValues, hasUserSelectedDonation) => {
        const widgetJson = JSON.stringify(widgetValues);
        const opportunityId = await saveAndProcessDataImport({
            diRecord: dataImportRecord,
            widgetData: widgetJson,
            updateGift: hasUserSelectedDonation
        });

        return new SingleSaveResult(true, opportunityId);
    }

    /**
     * Grab the data from the form fields and widgets, convert to a data import record.
     * @param sectionList   List of ge-form-sections on the form
     * @param record        Existing account or contact record to attach to the data import record
     * @return {{widgetValues: {}, diRecord: {}}}
     */
    getDataImportRecord(sectionList, record, dataImportRecord) {
        let fieldData = {};
        let widgetValues = {};

        sectionList.forEach(section => {
            fieldData = {...fieldData, ...(section.values)};
            widgetValues = {...widgetValues, ...(section.widgetValues)};
        });

        // Build the DI Record
        let diRecord = {};

        for (let [key, value] of Object.entries(fieldData)) {
            let fieldWrapper = this.getFieldMappingWrapper(key);
            diRecord[fieldWrapper.Source_Field_API_Name] = value;
        }

        // Include any fields from a user selected donation, if
        // those fields are not already on the diRecord
        if (dataImportRecord) {
            for (const [key, value] of Object.entries(dataImportRecord)) {
                if (!diRecord.hasOwnProperty(key)) {
                    diRecord[key] = value === null || value.value === null ?
                        null : value.value || value;
                }
            }
        }

        return {diRecord, widgetValues};
    }

    saveAndDryRun(batchId, dataImport, widgetData) {
        return new Promise((resolve, reject) => {
            saveAndDryRunDataImport({batchId, dataImport, widgetData})
                .then((result) => {
                    resolve(JSON.parse(result));
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getFormRenderWrapper(templateId) {
        return new Promise((resolve, reject) => {
            getFormRenderWrapper({templateId: templateId})
                .then(renderWrapper => {
                    this.fieldMappings =
                        renderWrapper.fieldMappingSetWrapper.fieldMappingByDevName;
                    this.objectMappings =
                        renderWrapper.fieldMappingSetWrapper.objectMappingByDevName;
                    this.fieldTargetMappings =
                        renderWrapper.fieldMappingSetWrapper.fieldMappingByTargetFieldName;
                    resolve(renderWrapper);
                })
                .catch(err => {
                    reject(err);
                });
        });

    }

    getFormTemplateById(templateId) {
        return new Promise((resolve, reject) => {
            this.getFormRenderWrapper(templateId)
                .then(renderWrapper => {
                    resolve(renderWrapper.formTemplate);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    get importedRecordFieldNames() {
        return Object.values(this.objectMappings).map(
            ({Imported_Record_Field_Name}) =>
                Imported_Record_Field_Name
        );
    }

    getObjectMappingWrapperByImportedFieldName(importedFieldName) {
        return Object.values(this.objectMappings)
            .find(({Imported_Record_Field_Name}) =>
                Imported_Record_Field_Name === importedFieldName);
    }

}

const geFormServiceInstance = new GeFormService();

export default geFormServiceInstance;