/* eslint-disable consistent-return */
import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { inputTypeByDescribeType, dispatch } from 'c/utilTemplateBuilder';
import { isNotEmpty } from 'c/utilCommon';
import geBodyBatchFieldBundleInfo from '@salesforce/label/c.geBodyBatchFieldBundleInfo';

const WIDGET = 'widget';
const TEXTAREA = 'textarea';
const COMBOBOX = 'combobox';
const SEARCH = 'search';
const RICHTEXT = 'richtext';
const CHECKBOX = 'checkbox';
const DATE = 'date';
const DATETIME = 'datetime-local';
const YES = 'Yes';
const TEXT = 'text';
const TRUE = 'true';
const RICH_TEXT_FORMATS = [
    'font', 'size', 'bold', 'italic', 'underline', 'strike', 'list', 'indent', 'align', 'link', 'clean', 'table', 'header'
];
const CURRENCY = 'currency';
const PERCENT = 'percent';
const DECIMAL = 'decimal';

export default class utilInput extends LightningElement {

    // expose custom labels to template
    CUSTOM_LABELS = { geBodyBatchFieldBundleInfo };
    richTextFormats = RICH_TEXT_FORMATS;

    @api fieldApiName;
    @api label;
    @api defaultValue;
    @api required;
    @api type;
    @api formFieldType;
    @api objectInfo;
    @api objectApiName;
    @api tabIndex;
    @api variant = 'label-stacked';

    @api value;

    @api
    reportValue() {
        return {
            objectApiName: this.uiObjectApiName,
            fieldApiName: this.fieldApiName,
            value: this.fieldValue
        };
    }

    get fieldValue() {
        if (this.isLightningCheckbox) {
            return isNotEmpty(this.value) ? this.value : this.checkboxDefaultValue;
        }
        return this.value !== undefined ? this.value : this.defaultValue;
    }

    get checkboxDefaultValue() {
        return (this.defaultValue === TRUE || this.defaultValue === true) ? true : false;
    }

    get isWidget() {
        return this.formFieldType === WIDGET ? true : false;
    }

    get isLightningTextarea() {
        return this.lightningInputType === TEXTAREA ? true : false;
    }

    get isLightningCombobox() {
        return this.lightningInputType === COMBOBOX ? true : false;
    }

    get isLightningSearch() {
        return this.lightningInputType === SEARCH ? true : false;
    }

    get isLightningRichText() {
        return this.lightningInputType === RICHTEXT ? true : false;
    }

    get isLightningCheckbox() {
        return this.lightningInputType === CHECKBOX ? true : false;
    }

    get isLightningDateOrDatetime() {
        return (this.lightningInputType === DATE || this.lightningInputType === DATETIME) ? true : false;
    }

    get isBaseLightningInput() {
        if (this.lightningInputType !== TEXTAREA &&
            this.lightningInputType !== COMBOBOX &&
            this.lightningInputType !== RICHTEXT &&
            this.lightningInputType !== SEARCH &&
            this.lightningInputType !== CHECKBOX &&
            this.lightningInputType !== DATE &&
            this.lightningInputType !== DATETIME) {
            return true;
        }
        return false;
    }

    get dataType() {
        return this.type ? this.type.toLowerCase() : undefined;
    }

    get formatter() {
        if (this.dataType === CURRENCY || this.dataType === PERCENT || this.dataType === DECIMAL) {
            return this.dataType;
        }
        return undefined;
    }

    get granularity() {
        if (this.formatter) {
            switch (this.dataType) {
                case CURRENCY: return '0.01';
                case PERCENT: return '0.01';
                case DECIMAL: return '0.001';
                default: return 'any';
            }
        }
        return undefined;
    }

    get lightningInputType() {
        return this.type ? inputTypeByDescribeType[this.type.toLowerCase()] : TEXT;
    }

    get isRequired() {
        const _required = this.required === YES || this.required === true;
        return (_required && !this.isLightningCheckbox) ? true : false;
    }

    get fieldDescribe() {
        if (this.objectInfo && this.objectInfo.fields) {
            return this.objectInfo.fields[this.fieldApiName];
        }
    }

    get uiLabel() {
        if (this.label) {
            return this.label;
        } else if (this.fieldDescribe) {
            return this.fieldDescribe.label;
        }
        return undefined;
    }

    get uiObjectApiName() {
        return this.objectInfo && this.objectInfo.apiName ? this.objectInfo.apiName : this.objectApiName;
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    wiredObjectInfo(response) {
        if (response.data) {
            this.objectInfo = response.data;
            if (!this.type) {
                this.type = this.objectInfo.fields[this.fieldApiName].dataType;
            }
        }
    }

    /*******************************************************************************
    * @description Dispatches an event to notify parent component that the form
    * field's defaultValue property for a combobox has changed.
    *
    * @param {object} event: Event object from lightning-combobox onchange event handler 
    */
    handleChangeCombobox(event) {
        let detail = {
            objectApiName: this.uiObjectApiName,
            fieldApiName: this.fieldApiName,
            value: event.target.value
        }

        dispatch(this, 'changevalue', detail);
    }

    /*******************************************************************************
    * @description Dispatches an event to notify parent component that the form
    * field's defaultValue property has changed.
    *
    * @param {object} event: Event object from various lightning-input type's
    * change event handler.
    */
    handleValueChange(event) {
        if (this.type && this.lightningInputType === CHECKBOX) {
            this.value = event.target.checked;
        } else if (this.type && this.lightningInputType === SEARCH) {
            this.value = event.detail.value;
        } else if (event.target) {
            this.value = event.target.value;
        }

        let detail = {
            objectApiName: this.uiObjectApiName,
            fieldApiName: this.fieldApiName,
            value: this.fieldValue
        }

        dispatch(this, 'changevalue', detail);
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}