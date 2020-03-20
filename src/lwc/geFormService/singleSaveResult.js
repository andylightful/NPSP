class SingleSaveResult {
    hasProcessedDataImport;
    recordId;
    httpResponse;

    constructor(hasProcessedDataImport, recordId, httpResponse) {
        this.hasProcessedDataImport = hasProcessedDataImport;
        this.recordId = recordId;
        this.httpResponse = httpResponse;
    }
}

export { SingleSaveResult }