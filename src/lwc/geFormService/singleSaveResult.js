class SingleSaveResult {
    /*******************************************************************************
    * @description Boolean: If true, we have successfully processed a Data Import
    * record.
    */
    hasProcessedDataImport;

    /*******************************************************************************
    * @description String: Either an Opportunity or Data Import record id.
    * Is an Opportunity record id if data import processed successfully.
    * Is a Data Import record id if data import processing failed.
    */
    recordId;

    /*******************************************************************************
    * @description Object: Purchase call http response if one was made.
    */
    httpResponse;

    constructor(hasProcessedDataImport, recordId, httpResponse) {
        this.hasProcessedDataImport = hasProcessedDataImport;
        this.recordId = recordId;
        this.httpResponse = httpResponse;
    }
}

export { SingleSaveResult }