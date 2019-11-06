import { LightningElement, api, track } from 'lwc';

export default class GeTemplateBuilderFormLayout extends LightningElement {
    @api fieldMappingSet;
    @track activeFormSectionId;

    @track formSections = [];
    /* Public setter for the tracked property selectedFieldMappingSet */
    // TODO: Needs to be revisited, WIP tied to retrieving and rendering an existing template
    @api
    set formSections(formSections) {
        this.formSections = formSections;
    }

    /*******************************************************************************
    * @description Public method that returns an instance of FormLayout.
    *
    * @return {object} formLayout: Instance of FormLayout containing FormSections
    * and FormFields
    */
    @api
    getFormLayout() {
        let formSectionComponents = this.template.querySelectorAll('c-ge-template-builder-form-section');
        let formSections = [];
        for (let i = 0; i < formSectionComponents.length; i++) {
            let formSection = formSectionComponents[i].getFormSectionValues();
            formSections.push(formSection);
        }

        /* Where's this version number going to come from? */
        const version = '1.0';
        let formLayout = {
            fieldMappingSetDevName: this.fieldMappingSet,
            version: version,
            sections: formSections
        }

        return formLayout;
    }

    /*******************************************************************************
    * @description Handles setting the active section and updating the slds icon
    * across all sections and dispatches an event to parent component
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleSelectActiveSection(event) {
        const sectionId = event.detail;
        this.activeFormSectionId = sectionId;

        this.dispatchEvent(new CustomEvent(
            'changeactivesection',
            { detail: sectionId }));
    }

    /*******************************************************************************
    * @description Dispatches an event to parent component geTemplateBuilderGiftFields.
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleDeleteFormSection(event) {
        const formSectionId = event.detail.id;
        this.dispatchEvent(new CustomEvent(
            'deleteformsection',
            { detail: formSectionId }));
    }

    /*******************************************************************************
    * @description Dispatches an event up to parent component geTemplateBuilderGiftFields
    * for shifting the FormSection element up in the data structure
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleFormSectionUp(event) {
        const sectionId = event.detail;
        this.dispatchEvent(new CustomEvent(
            'formsectionup',
            { detail: sectionId }));
    }

    /*******************************************************************************
    * @description Dispatches an event up to parent component geTemplateBuilderGiftFields
    * for shifting the FormSection element up in the data structure
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleFormSectionDown(event) {
        const sectionId = event.detail;
        this.dispatchEvent(new CustomEvent(
            'formsectiondown',
            { detail: sectionId }));
    }

    /*******************************************************************************
    * @description Dispatches an event up to parent component geTemplateBuilderGiftFields
    * for shifting the FormField element up in the data structure
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleFormFieldUp(event) {
        const formFieldId = event.detail;
        this.dispatchEvent(new CustomEvent(
            'formfieldup',
            { detail: formFieldId }));
    }

    /*******************************************************************************
    * @description Dispatches an event up to parent component geTemplateBuilderGiftFields
    * for shifting the FormField element down in the data structure
    *
    * @param {object} event: Custom Event received from child component
    * geTemplateBuilderFormSection
    */
    handleFormFieldDown(event) {
        const formFieldId = event.detail;
        this.dispatchEvent(new CustomEvent(
            'formfielddown',
            { detail: formFieldId }));
    }
}