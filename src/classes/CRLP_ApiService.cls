/*
    Copyright (c) 2019, Salesforce.org
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Salesforce.org nor the names of
      its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
    FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
    COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
    INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
    LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
    ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    POSSIBILITY OF SUCH DAMAGE.
*/
/**
* @author Salesforce.org
* @date 2019
* @group API
* @group-content ../../ApexDocContent/Rollups2.htm
* @description Service methods for the Customizable Rollups API
*/
public without sharing class CRLP_ApiService {    
    @TestVisible
    private static final String ACTION_ARCHIVE_BRIDGE_GET_ROLLUP_STATE = 'dso.getRollupStateForRecords';
    private static final String ACTION_ARCHIVE_BRIDGE_SET_STALE_ROLLUPS = 'dso.setRollupStateAsStale';

    @TestVisible
    private UTIL_IntegrationConfig archiveBridgeConfig {
        get {
            if (archiveBridgeConfig == null) {
                archiveBridgeConfig = UTIL_IntegrationConfig.getConfig(UTIL_IntegrationConfig.Integration.ArchiveBridge);
            }
            return archiveBridgeConfig;
        }
        set;
    }

    /**
    * @description Generates the list of Rollup Definitions for the specified rollup type
    * @param rollupTypeName String representation of the Rollup Type enum
    * @return List<CRLP_Rollup>
    */
    public List<CRLP_Rollup> getRollupDefinitions(String rollupTypeName) {

        if (!CRLP_Rollup_SVC.isCustomizableRollupEngineEnabled) {
            return new List<CRLP_Rollup>();
        }

        CRLP_RollupProcessingOptions.RollupType rollupType;
        try {
            rollupType = CRLP_RollupProcessingOptions.rollupTypeByName.get((String) rollupTypeName.toLowerCase());
        } catch (Exception ex) { }

        if (rollupType == null) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_TYPE, 'Unable to Match');
        }

        CRLP_VRollupHandler handler = new CRLP_VRollupHandler();
        handler.buildGroupedRollups(rollupType);

        return handler.getRollupsList();
    }


    /**
    * @description Confirms if Rollup State is enabled by checking if the DSO-NPSP bridge is installed
    * @return Boolean
    */
    public Boolean isRollupStateEnabled() {
        return archiveBridgeConfig.isInstalled();
    }

    /**
    * @description Confirms if Rollup State is enabled by checking if the DSO-NPSP bridge is installed
    * @param recordIds Ids of records that you want to retrieve archived rollup data for
    * @param rollupType The rollup type that you want to retrieve archived rollup data for
    * @return Map<Id, List<CRLP_Rollup>> List of CRLP_Rollup data for each specified record Id
    */
    public Map<Id, List<CRLP_Rollup>> getBaseRollupStateForRecords(Set<Id> recordIds, CRLP_RollupProcessingOptions.RollupType rollupType) {
        if (!isRollupStateEnabled()) {
            return new Map<Id, List<CRLP_Rollup>>();
        }

        Map<Id, String> result = (Map<Id, String>) archiveBridgeConfig.getCallableApi().call(
            ACTION_ARCHIVE_BRIDGE_GET_ROLLUP_STATE,
            new Map<String, Object> {
                'RecordIds' => recordIds,
                CallableApiParameters.PARAM_ROLLUP_TYPE => rollupType.name()
            }
        );

        Map<Id, List<CRLP_Rollup>> rollupStatesById = new Map<Id, List<CRLP_Rollup>>();
        for (Id referenceId : result.keySet()) {
            String rollupData = result.get(referenceId);
            rollupStatesById.put(referenceId, (List<CRLP_Rollup>) JSON.deserialize(rollupData, List<CRLP_Rollup>.class));
        }
        return rollupStatesById;
    }

    /**************************************************************************************************************
    * @description set the rollup state as stale
    * @param set of rollup type names
    **************************************************************************************************************/
    public void setRollupStateAsStale(Set<String> rollups) {

        if (!isRollupStateEnabled()) {
            return;
        }
        
        archiveBridgeConfig.getCallableApi().call(
            ACTION_ARCHIVE_BRIDGE_SET_STALE_ROLLUPS,
            new Map<String, Object> {
                CallableApiParameters.PARAM_ROLLUP_TYPES => rollups
            }
        );
        
    }

    /**
    * @description Entry point for external packages to call the Customizable Rollups API
    * @param parentId
    * @param rollupTypeName
    * @param rollupDefs
    * @param rollupData
    * @return Updated Rollup Definitions
    */
    public List<CRLP_Rollup> executeRollups(Id parentId, String rollupTypeName, List<CRLP_Rollup> rollupDefs,
            Map<Id, Map<SObjectType, List<SObject>>> rollupData, Boolean commitToDatabase) {

        // Convert the Rollup Type into an Enum
        CRLP_RollupProcessingOptions.RollupType rollupType;
        try {
            rollupType = CRLP_RollupProcessingOptions.rollupTypeByName.get((String) rollupTypeName.toLowerCase());
        } catch (Exception ex) {
        }

        if (rollupType == null) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_TYPE, 'No matching RollupType');
        }

        // If there are no active rollups, just return an empty collection
        if (!CRLP_Rollup_SVC.hasActiveRollups(rollupType)) {
            return new List<CRLP_Rollup>();
        }

        // Ensure the Rollup Definitions are populated
        if (rollupDefs == null || rollupDefs.size() == 0) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_DEFS, 'Empty Rollup Definitions Collection');
        }

        // Ensure there is data to rollup for the parent record
        if (rollupData == null || rollupData.size() == 0) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_DATA, 'Empty Rollup Data Collection');
        }

        // Ensure the specified ParentId is both not null and refers to an existing record.
        if (parentId == null) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_PARENTID, 'A valid Parent record Id is required');
        }
        String validateParentSoql =
            'SELECT COUNT() FROM ' + parentId.getSobjectType().getDescribe().getName() +
            ' WHERE Id = :parentId LIMIT 1';
        if (Database.countQuery(validateParentSoql) != 1) {
            throwParameterException(CallableApiParameters.PARAM_ROLLUP_PARENTID, 'A existing Parent record is required');
        }

        try {
            CRLP_ApiExecuteRollups rollupApiProcess = new CRLP_ApiExecuteRollups()
                .withRollupType(rollupType)
                .withParentId(parentId)
                .withRollupData(rollupData)
                .withRollupDefs(rollupDefs)
                .withCommitToDatabase(commitToDatabase);

            rollupDefs = rollupApiProcess.executeRollups();
        } catch (Exception ex) {
            throwAPIException('CRLP.ExecuteRollups', '\n' + ex.getMessage() + '\n' + ex.getStackTraceString());
        }
        return rollupDefs;
    }

    /**
    * @description indicates of CRLP is enabled
    * @return Boolean
    */
    public Boolean isCrlpEnabled() {
        return CRLP_Rollup_SVC.isCustomizableRollupEngineEnabled;
    }

    /**
    * @description Throw a custom exception there is an error parsing the parameter
    */
    private void throwParameterException(String paramName, String errMessage) {
        throw new ApiException(
            String.format( System.Label.CallableApiParameterError,
            new List<String>{ paramName, errMessage } ));
    }

    /**
    * @description Throw a custom exception when api call cannot be completed
    */
    private void throwAPIException(String apiName, String errMessage) {
        throw new ApiException(
            String.format( System.Label.CallableApiProcessingError,
            new List<String>{ apiName, errMessage } ));
    }


    /*
    * @description build a deployment handler based on the changed rollup types 
    * @param changedRollupTypes is a set of rollup Type strings
    * @return a MetadataHandler that can be used for deployment callbacks
    */
    private RollupMetadataHandler getRollupHandler(Set<String> changedRollupTypes) {
        RollupMetadataHandler callback = new RollupMetadataHandler();

         if (!changedRollupTypes.isEmpty()) {
            callback.params = new Map<String, Set<String>> {
                CallableApiParameters.PARAM_ROLLUP_TYPES => changedRollupTypes
            };
        }

        return callback;
    }

    /*
    * @description build a set of changed rollup types based on a list of rollups
    * @param rollups is a list of rollups
    * @return a set of change rollup types
    */

    private Set<String> buildChangedRollupTypes(List<CRLP_RollupCMT.Rollup> rollups) {
        Set<String> changedRollupTypes = new Set<String>();

        if (!isRollupStateEnabled()) {
            return changedRollupTypes;
        }

        for (CRLP_RollupCMT.Rollup cmtRollup : rollups) {
            RollupUtil util = new RollupUtil(cmtRollup);
            if (util.hasChanged()) {
                changedRollupTypes.addAll(util.getRollupTypes());
            }
        }

        return changedRollupTypes;
    }

    /*
    * @description build a set of changed rollup types based on a list of filter groups
    * @param filterGroups is a List of filtergroups
    * @return a set of change rollup types
    */
    private Set<String> buildChangedRollupTypes(List<CRLP_RollupCMT.FilterGroup> filterGroups) {
        Set<String> changedRollupTypes = new Set<String>();

        if (!isRollupStateEnabled()) {
            return changedRollupTypes;
        }

        FilterGroupUtil util = new FilterGroupUtil();
        for (CRLP_RollupCMT.FilterGroup cmtFilterGroup : filterGroups) {
            if (util.hasChanged(cmtFilterGroup)) {
                changedRollupTypes.addAll(util.getRollupTypes(cmtFilterGroup.recordId));
            }
        }

        return changedRollupTypes;
    }

    /*
    * @description handle changes to customizable rollups and send back a callback handler if 
    * there is processing that needs to be executed after deloyment
    * @param rollups is a List of Rollups
    * @return a MetadataHandler that can be used for deployment callbacks
    */
    public RollupMetadataHandler sendChangeEvent(List<CRLP_RollupCMT.Rollup> rollups) {
        Set<String> changedRollupTypes = buildChangedRollupTypes(rollups);

       return getRollupHandler(changedRollupTypes);
    }

    /*
    * @description handle changes to customizable filter groups and send back a callback handler if
    * there is processing that needs to be executed after deployment
    * @param filterGroups is a list of filtergroups
    * @return a MetadataHandler that can be used for deployment callbacks
    */
    public RollupMetadataHandler sendChangeEvent(List<CRLP_RollupCMT.FilterGroup> filterGroups) {
        Set<String> changedRollupTypes = buildChangedRollupTypes(filterGroups);

        return getRollupHandler(changedRollupTypes);
    }

    /*
    * @description handle changes to both rollups and customizable filter groups and send back a callback handler if
    * there is processing that needs to be executed after deployment
    * @param rollups is a list of Rollups
    * @param filterGroups is a list of filtergroups
    * @return a MetadataHandler that can be used for deployment callbacks
    */
    public RollupMetadataHandler sendChangeEvent(List<CRLP_RollupCMT.Rollup> rollups, List<CRLP_RollupCMT.FilterGroup> filterGroups) {
        Set<String> changedRollupTypes = new Set<String>();

        changedRollupTypes.addAll(buildChangedRollupTypes(rollups));
        changedRollupTypes.addAll(buildChangedRollupTypes(filterGroups));

        return getRollupHandler(changedRollupTypes);
    }

    /*******************************************************************************************************
    * @description Utility class for a CMT rollup
    */
    public class RollupUtil {
        CRLP_RollupCMT.Rollup cmtRollup;
        private CRLP_RollupProcessingOptions.RollupType oldRollupType = null;

        private CRLP_RollupProcessingOptions.RollupType rollupType {
            get {
                if (rollupType == null) {
                    rollupType = cmtRollup.getRollupType();
                }
                return rollupType;
            }
            set;
        }
        private Boolean isNew {
            get {
                if (isNew == null) {
                    isNew = String.isBlank(cmtRollup.recordName);
                }
                return isNew;
            }
            set;
        }

        /*******************************************************************************************************
         * @description Constructor
         */
        public RollupUtil(CRLP_RollupCMT.Rollup cmtRollup) {
            this.cmtRollup = cmtRollup;
        }

        /*******************************************************************************************************
         * @description If the archive bridge needs to be notified about rollup type change, compare rollups.
         */
        public Boolean hasChanged() {
            if (isNew) {
                return true;
            }

            for (Rollup__mdt rlp : CRLP_Rollup_SEL.cachedRollups) {
                if (cmtRollup.recordName == rlp.DeveloperName) {
                    if (cmtRollup.isDifferent(rlp)) {
                        oldRollupType = new CRLP_RollupCMT.Rollup(rlp).getRollupType();
                        return true;
                    }
                    break;
                }
            }

            return false;
        }


        /*******************************************************************************************************
         * @description Builds a set of rollup types associated with the rollup
         * @return Set<String> Set of rollup types 
         */
        public Set<String> getRollupTypes() {
            if (oldRollupType == null) {
                oldRollupType = rollupType;
            }

            return new Set<String> { rollupType.name(), oldRollupType.name() };
        }
    }

    /******************************************************************************************************************
    * @description Utility class for Filter Group processing
    */
    public class FilterGroupUtil {
    
        private List<Filter_Group__mdt> allGroups {
            get {
                if (allGroups == null) {
                    allGroups = CMT_FilterRule_SEL.getFilterGroups();
                }
                return allGroups;
            }
            set;
        }

        private Map<Id, List<Rollup__mdt>> rollupsById {
            get {
                if (rollupsById == null) {
                    rollupsById = CRLP_Rollup_SEL.getRollupsByFilterGroup();
                }
                return rollupsById;
            }
            set;
        }

        private Map<Id, List<Filter_Rule__mdt>> rulesByGroupId {
            get {
                if (rulesByGroupId == null) {
                    rulesByGroupId = CMT_FilterRule_SEL.getFilterRulesByGroup();
                }
                return rulesByGroupId;
            }
            set;
        }

        /******************************************************************************************************************
        * @description Determines if the filter group has changed
        */
        public Boolean hasChanged(CRLP_RollupCMT.FilterGroup cmtFilterGroup) {
            Boolean hasChanged  = false;

            for (Filter_Group__mdt filterGroup : allGroups) {
                CRLP_RollupCMT.FilterGroup existingGroup = new CRLP_RollupCMT.FilterGroup(filterGroup);
                
                if (cmtFilterGroup.recordId != existingGroup.recordId) {
                    continue;
                }

                if (cmtFilterGroup.isDifferent(
                    existingGroup.withRules(rulesByGroupId.get(existingGroup.recordId))
                )) {
                    hasChanged = true;
                }

                break;
            }
            
            return hasChanged;
        }

        /******************************************************************************************************************
        * @description Returns rollup types in the filter group
        */
        public Set<String> getRollupTypes(Id groupId) {
            Set<String> rollypTypes = new Set<String>();

            List<Rollup__mdt> rollups = rollupsById.get(groupId);
            if (rollups == null) {
                return rollypTypes;
            }
            
            for (Rollup__mdt rlp : rollups) {
                CRLP_RollupProcessingOptions.RollupType rollupType = (new CRLP_RollupCMT.Rollup(rlp)).getRollupType();

                if (rollupType != null) {
                    rollypTypes.add(rollupType.name());
                }
            }
            return rollypTypes;
        }
    }
  

    /**
    * @description Exception class
    */
    private class ApiException extends Exception {}


    /**************************************************************************************************************
    * @description Metadata Call back handler class to execute actions when the metadata has successfully been deployed
    **/
    public class RollupMetadataHandler implements CMT_MetadataAPI.MetadataCallbackHandler {

        public Map<String, Object> params;

        /**********************************************************************************************************
        * @description success handler - will call the ApiService to set rollup as stale 
        **/
        public void performSuccessHandler(Map<String, Object> callbackParams, String status) {
            updateDeploymentStatus(status, true);

            if (callbackParams == null || callbackParams.isEmpty()) {
                return;
            }

            try {
                new CRLP_ApiService().setRollupStateAsStale(
                    (Set<String>)callbackParams.get(CallableApiParameters.PARAM_ROLLUP_TYPES)
                );
            } catch (Exception ex) {
                logError(ex);
            }
        }

        /**
        * @description error handler - will call the update deployment status
        */
        public void performErrorHandler(Map<String, Object> callbackParams, String status) {
            updateDeploymentStatus(status, false);
        }

        /**
        * @description write the deployment status to the custom settings object
        * @param status string of the status
        * @param isSuccess boolean that indicates if the rollups was sucessful
        */
        private void updateDeploymentStatus(String status, Boolean isSuccess) {
            Customizable_Rollup_Settings__c crlpSettings = UTIL_CustomSettingsFacade.getCustomizableRollupSettings();
            
            crlpSettings.CMT_API_Status__c = status;
            crlpSettings.Customizable_Rollups_Enabled__c = (isSuccess || crlpSettings.Customizable_Rollups_Enabled__c == true);

            update crlpSettings;
        }

        /**
        * @description Inserts an error log into the Error table
        * @param ex Exception object that is to be logged
        */
        private void logError(Exception ex) {
            Error__c rollupHandlerError = new Error__c(
                Error_Type__c = 'Rollup Metadata Handler Error',
                Object_Type__c = 'CustomMetadata',
                Context_Type__c = ERR_Handler_API.Context.CRLP.name(),
                Datetime__c = System.now(), 
                Full_Message__c = ex.getMessage()
            );

            Database.insert(rollupHandlerError, true);
        }
    }

}