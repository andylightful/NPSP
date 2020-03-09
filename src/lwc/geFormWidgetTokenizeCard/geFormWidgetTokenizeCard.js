import { LightningElement, track, api } from 'lwc';
import GeLabelService from 'c/geLabelService';
import getDomainUrl from '@salesforce/apex/GE_FormRendererService.getDomainUrl';
import makePurchaseCall from '@salesforce/apex/GE_FormRendererService.makePurchaseCall';
// TODO: maybe import data import token field reference?

export default class geFormWidgetTokenizeCard extends LightningElement {

    CUSTOM_LABELS = GeLabelService.CUSTOM_LABELS;

    @track domain;
    @track visualforceOrigin;
    @track tokenizeCardPageUrl;
    @track isLoading = true;
    @track token;

    async connectedCallback() {
        let domainUrl = await getDomainUrl();
        this.domain = domainUrl.split('.')[0];
        this.visualforceOrigin = `https://${this.domain}--npsp.visualforce.com`;
        this.tokenizeCardPageUrl = `${this.visualforceOrigin}/apex/GE_TokenizeCard`;
    }

    renderedCallback() {
        this.registerPostMessageListener();
    }

    @api
    isValid() {
        return true;
    }

    @api
    getToken() {
        console.log('*** getToken: ', this.token);
        return this.token;
    }

    /*******************************************************************************
    * @description Method listens for a message from the visualforce iframe.
    * Rejects any messages from an unknown origin.
    */
    registerPostMessageListener() {
        let component = this;

        window.onmessage = async function (event) {
            if (event && event.origin !== component.visualforceOrigin) {
                // Reject any messages from an unexpected origin
                return;
            } else {
                const message = JSON.parse(event.data);
                component.handleMessage(message);
            }
        }
    }

    /*******************************************************************************
    * @description Method handles messages received from iframed visualforce page.
    *
    * @param {object} message: Message received from iframe
    */
    async handleMessage(message) {
        if (message.error) {
            let error = JSON.stringify(message.error);
            console.log(error);
            alert(error);
        } else if (message.token) {
            this.token = message.token;
            // TODO: Start - Remove later
            // Make purchase call... for dev only
            //let purchaseCallResponse = await makePurchaseCall({ token: message.token });

            // Tokenize - good
            // Insert DI - good
            // Make purchase call - pass di, get jwt in server
            // Update DI - good
            // Process DI - 

            //this.purchaseResult = JSON.parse(purchaseCallResponse);
            //console.log(this.purchaseResult);
            //alert(this.purchaseResult)
            // TODO: End - Remove later

            // TODO: Save token locally in widget until form requests it
        } else if (message.isLoaded) {
            this.isLoading = false;
        }
    }

    /*******************************************************************************
    * @description Method sends a message to the visualforce page iframe requesting
    * a token. Response for this request is found and handled in
    * registerPostMessageListener.
    */
    requestToken() {
        const iframe = this.template.querySelector('iframe');

        if (iframe) {
            iframe.contentWindow.postMessage(
                { action: 'createToken' },
                this.visualforceOrigin);
        }
    }
}