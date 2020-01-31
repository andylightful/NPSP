"""Locators for spring '20"""

npsp_lex_locators={
    'breadcrumb': "//li[contains(@class, 'slds-breadcrumb__item')]/span[text()='{}']",
    'spl-breadcrumb':"//div[@class= 'slds-media__body']/p[text()='{}']",
    'breadcrumb-link':"//a[@title='{}' and contains(@class,'BreadCrumbItem')]",
    'obj-header':"//h1//*[text()='{}']",
    'placeholder': "//*[contains(@placeholder,'{}')]",
    'app_launcher':{
        'select-option':'//span/mark[text()="{}"]',
    },
    'object_dd':'//h1[contains(@class,"slds-page-header__title")]//a',
    'main-header':{
        "header_text": "//h1/div/span",
        "header_text_spl": "//h1//lightning-formatted-text",
    },
    "record": {
        'button':"//div[contains(@class,'form-footer')]//button[@title='{}']",
        'footer':"//div[@class='footer active' or contains(@class,'footer-visible')]",
        'datepicker':"//div[contains(@class,'uiDatePickerGrid')]/table[@class='calGrid']//*[text()='{}']",
        'month_pick':"//div[@class='dateBar']//a[@title='{}']",
        'edit_button':'//*[@title="{}"]',
        'edit_form': 'css: div.forcePageBlockItemEdit',
        'flexipage_edit_form': 'css: force-record-layout-item.slds-is-editing',
        'list':"//div[contains(@class,'forcePageBlockSectionRow')]/div[contains(@class,'forcePageBlockItem')]/div[contains(@class,'slds-hint-parent')]/div[@class='slds-form-element__control']/div[.//span[text()='{}']][//div[contains(@class,'uiMenu')]//a[@class='select']]",
        'flexipage-list':'//lightning-combobox[./label[text()="{}"]]/div//input[contains(@class,"combobox__input")]',
        'dropdown':"//div[@class='select-options']/ul[@class='scrollable']/li[@class='uiMenuItem uiRadioMenuItem']/a[contains(text(),'{}')]",
        'related': {
            'button': "//article[contains(@class, 'forceRelatedListCardDesktop')][.//img][.//span[@title='{}']]//a[@title='{}']",
            'check_occurrence':'//h2/a/span[@title="{}"]/following-sibling::span',
            'drop-down':'//div[contains(@class, "slds-card")]/header[.//span[@title="{}"]]/parent::*/div/div/div/a[contains(@class, "slds-button")]',
            'title':'//div[contains(@class, "slds-grid")]/header//a[./span[text()="{}"]]',
            'viewall':'//a[.//span[text()="View All"]/span[text()="{}"]]',
            'item':"//article[contains(@class, 'forceRelatedListCardDesktop')][.//img][.//span[@title='{}']]//h3//a",
            'field_value': '//a[text()="{}"]/ancestor::li//div[contains(@class, "slds-item--detail")]//*[text()="{}"]',
            'link':"//article[contains(@class, 'forceRelatedListCardDesktop')][.//img][.//span[@title='{}']]//table[contains(@class,'forceRecordLayout')]/tbody/tr[.//th/div/a[contains(@class,'textUnderline')]][.//td//a[text()='{}']]/th//a",
            'dd-link':'//div[contains(@class,"actionMenu")]//a[@title="{}"]',
            'allocations':"//article[contains(@class, 'forceRelatedListCardDesktop')][.//img][.//span[@title='{}']]//tbody/tr[./td//a[text()='{}']]/td/span[text()='{}']",
         },
    },
    "alert": "//span[contains(@class,'toastMessage')]/a/div",
    "alert-text":"//span[contains(@class,'toastMessage')]",
    'batch_status':'//div[contains(@class,"slds-tile__title")][.//*[text()="{}"]]/div[contains(@class,"slds-col")]//span[text()="{}"]',
    'popup': "//div[contains(@class, 'uiPopupTarget')][contains(@class, 'visible')]",
    'flexipage-popup':"//div[contains(@class, 'slds-is-open')][contains(@class, 'slds-combobox')]",
    'test':'/html/body/div[6]/table/tbody/tr[23]/td[1]/a',
    "toast-msg":"//span[@class='toastMessage slds-text-heading--small forceActionsText']",
    "toast-close":"//button[contains(@class,'toastClose')]",
    'frame_new':'//iframe[contains(@name, "{}") or contains(@title, "{}")]',
    'frame':'//iframe[@title= "{}"]',
    'frame_by_name': "//iframe[contains(@name, '${}')]",
    'id':'//*[contains(@id,"{}")]',
    'button':'//input[contains(@value,"{}")]',
    'link':'//a[.//span[text()="{}" or contains(text(),"{}")]]',
    'link-text':'//a[text()="{}"]',
    'link-title':'//a[@title="{}"]',
    'link-contains':'//button[.//span[contains(text(),"{}")]]',
    'checkbox':{
        'model-checkbox':'//div[contains(@class,"uiInputCheckbox")]/label/span[text()="{}"]/../following-sibling::input[@type="checkbox"]',
        'details-checkbox':'//label[@class="slds-checkbox__label"][./span[text()="{}"]]/span[contains(@class,"slds-checkbox_faux")]',
        'table_checkbox':'//tbody/tr[./td[2]/a[text()="{}"]]/td/input[@type="checkbox"]',
        'id':'//input[@type="checkbox" and contains(@id,"{}")]',
    }, 
    'tabs':{   
        'tab': "//div[@class='uiTabBar']/ul[@class='tabs__nav']/li[contains(@class,'uiTabItem')]/a[@class='tabHeader']/span[contains(text(), '{}')]",
        'spl-tab':"//div[@class='slds-tabs_default']//ul[@class='slds-tabs_default__nav']/li[contains(@class,'slds-tabs_default__item')]/a[text()= '{}']",
    },
    'desktop_rendered': 'css: div.desktop.container.oneOne.oneAppLayoutHost[data-aura-rendered-by]',
    'loading_box': 'css: div.auraLoadingBox.oneLoadingBox',
    'contacts_actions_dropdown_menu': 'css: a.slds-grid--align-center[aria-expanded="true"]',
    'household_lookup_dropdown_menu': 'css: div.slds-show',
    'spinner': 'css: div.slds-spinner',
    'Delete_opportunity_modal_button': 'css: div.forceModalActionContainer button.uiButton--brand',
    'modal_field':"//div[contains(@class, 'lookupInput')][./label[contains(text(), '{}')]]/div//span[@class='lookupInput']/input",
    'name':'//tbody/tr/th/span/a',
    'select_name':'//tbody//a[text()= "{}"]',
    'opportunities_dropdown':"css:a.slds-button.slds-button--icon-border-filled",
    'locate_dropdown':'//tbody/tr[{}]/td/span//div/a/lightning-icon',
    'locating_delete_dropdown':'//tbody//a[text()= "{}"]/../../following-sibling::td/span//div/a/lightning-icon',
    'related_name':'//tbody/tr/td/a[contains(@class,"forceOutputLookup")]',
    'rel_loc_dd':'//tbody/tr[{}]/td[4]//lightning-primitive-icon',
    'delete_icon':'//span[contains(text() ,"{}")]/following::span[. = "{}"]/following-sibling::a/child::span[@class = "deleteIcon"]',
    'delete_icon_record':'//label[contains(text() ,"{}")]/following::input[@placeholder = "{}"]/following-sibling::div/child::button[@title="Clear Selection"]',
    'aff_list':'//div[@role="tablist"]/following::div[@class = "container forceRelatedListSingleContainer"][7]/article/div[@class="slds-card__body"]/div/div/div/div/div/div/div/table/tbody/tr/td[1]',
    'aff_status':'//table[contains(@class,"forceRecordLayout")]/tbody/tr[.//th/div/a[contains(@class,"textUnderline")]][.//td/a[@title="{}"]]/td[3]',
    'relationship_status':'//lightning-formatted-text[contains(text(),"is")]',
    'aff_id':'//table[contains(@class,"forceRecordLayout")]/tbody/tr[.//th/div/a[contains(@class,"textUnderline")]][.//td/a[@title="{}"]]/th//a',
    'click_aff_id':'//table[contains(@class,"forceRecordLayout")]/tbody/tr/th/div/a[text()="{}"]',
    'confirm': {
        'check_value':'//div[contains(@class, "slds-form-element_stacked")][.//span[text()="{}"]]//following-sibling::div[.//span[contains(@class, "test-id__field-value")]]//*[text()="{}"]',
        'check_status':'//div[contains(@class, "field-label-container")][.//span[text()="{}"]]//following-sibling::div[.//span[contains(@class, "test-id__field-value")]]/span//lightning-formatted-text',
        'check_numbers':'//div[contains(@class, "field-label-container")][.//span[text()="{}"]]//following-sibling::div[.//span[contains(@class, "test-id__field-value")]]/span//lightning-formatted-number',
    },
    'check_field':'//div[contains(@class, "forcePageBlockItem")][.//span[text()="{}"]]//following-sibling::div[.//span[contains(@class, "test-id__field-value")]]/span/div//a',
    'check_field_spl':'//div[contains(@class, "field-label-container")][.//span[text()="{}"]]//following-sibling::div[.//span[contains(@class, "test-id__field-value")]]//a',
    'account_list':'//tbody/tr/th[.//span[contains(@class, "slds-grid")]]/descendant::a[text()="{}"]',
    'dd_options':'//*[@id="p3"]/option[text()="{}"]',
    'related_list_items':'//div[@class = "forceRelatedListContainer"][.//a[contains(@class, "slds-card")]]//span[text() = "{}"]/ancestor::div[contains(@class, "slds-grid")]/following-sibling::div[.//div[contains(@class, "outputLookupContainer")]]//a[text()="{}"]',
    'span_button':'//span[text()="{}"]',
    'span':"//span[@title='{}']",
    'header_field_value':'//*[contains(@class, "slds-page-header__detail")][.//*[@title="{}"]]//*[text()="{}"]',
    'header_datepicker':'//li[contains(@class, "slds-page-header__detail")][.//p[contains(@class, "slds-text-heading--label")][@title="{}"]]//*[@class="uiOutputDate"]',
    'select_one_record':"//tbody/tr[1]/th/span/a",
    'click_search':'//div[@class="slds-form-element"][./label[text()="{}"]]/div/span/span/input[contains(@id,"inputX")]',
    'field': "//div[contains(@class, 'uiInput')][.//label[contains(@class, 'uiLabel')][.//span[text()='{}']]]//input",
    'field_lookup_value': "//a[@role='option'][.//div[@title='{}']]",
    'field-value':"//div[contains(@class,'slds-form-element')][./label[text()='{}']]/div/span",
    'header':'//h1//child::div/span[text()="{}"]',
    'check_related_list_item':'//article[.//span[text() = "{}"]]/descendant::tbody//th//a[text()="{}"]',
    'detail_page': {
        'section_header':'//h3//span[text()="{}"]',
        'address':'//h3[contains(@class, "slds-section__title")][.//span[contains(text(),"Address")]]/../..//div[contains(@class, "test-id")]/span[text()= "{}"]/../following-sibling::div//a//div[contains(@class, "slds")]',
        'field':'//h3[contains(@class, "slds-section__title")][.//span[text()="{}"]]/../..//div[contains(@class, "test-id")]/span[text()= "{}"]/../following-sibling::div//span[text()="{}"]',
        'field-value':{
            'verify_field_value1':'//div[contains(@class, "forcePageBlockItem")]/div/div//span[text()="{}"]/../../div[2]/span/span[text() = "{}"]',
            'verify_field_value2':'//force-record-layout-item//div[./span[text()="{}"]]/following-sibling::div//lightning-formatted-text[text() = "{}"]',
        },
        'edit_mode':{
            'section_header':'//div[contains(@class,"forcePageBlockSectionEdit")]/h3//span[text()="{}"]',
            },
    },
    
    'manage_hh_page':{
        'address_link':'//h4[text()="{}"]',
        'address':'//div[contains(@class, "uiInput")][.//label[contains(@class, "uiLabel")]/span[text()="{}"]]/',
        'mhh_checkbox':'//*[@id="SortCanvas"]/li//a[text()="{}"]/ancestor::div[contains(@class, "slds-card__header")]/following-sibling::div[contains(@class,"slds-card__body")]//form//div//label/span[@id = "{}"]',
        'button':'//*[text()="{}"]',
        
    },
    'opportunity':{
        'contact_role':'//div[contains(@class,"listItemBody")][./h3//a[text()="{}"]]//parent::h3/following-sibling::ul/li/div[contains(@class,"forceListRecordItem")]/div[@title="Role:"]/following-sibling::div/span[text()="{}"]',
    },
    'object':{
        'record':'//tbody//a[text()= "{}"]',
        "field": "//div[contains(@class, 'uiInput')][.//label[contains(@class, 'uiLabel')][.//span[text()='{}']]]//*[self::input or self::textarea]",
        'button': "css: div.windowViewMode-normal ul.forceActionsContainer.oneActionsRibbon a[title='{}']",
        'radio_button':"//div[contains(@class,'changeRecordTypeRightColumn')]/div/label[@class='slds-radio']/div[.//span[text()='{}']]/preceding::div[1]/span[@class='slds-radio--faux']",
        'field-value':'//tbody/tr[./th//a[text()="{}"]]/td[.//span[text()="{}"]]',
    },
    'engagement_plan':{
        'input_box':'//fieldset[./legend[text()="{}"]]/div[@class="slds-grid"]//div[@class="requiredInput"]/input',
        'dropdown':'//div[contains(@class,"slds-p-top_small")]/label[text()="{}"]/following-sibling::div/select',
        'checkbox':'//div[contains(@class,"slds-p-top_small")]/label[@class="slds-checkbox"][./span/following-sibling::{}[text()="{}"]/]',
        'button':'//div[contains(@class,"slds-button-group")][.//span[text()="toTask {}"]]/button[contains(text(),"{}")]',
        'activity-button':'//button[contains(@class,"{}")]',
        'check_eng_plan':'//h2/a/span[@title="{}"]//ancestor::div[contains(@class, "slds-card__header slds-grid")]/following-sibling::div//tbody/tr/th/div/a',
        'dd':'//h2/a/span[@title="{}"]//ancestor::div[contains(@class,"slds-card__header slds-grid")]/following-sibling::div//tbody/tr/th/div/a/ancestor::th/following-sibling::td//lightning-primitive-icon',
        'tasks':'//div[contains(@class,"slds-section__content")]/ul/li//a[text()="{}"]',
    },
    'levels':{
        'id':'//input[contains(@id,"{}")]',
        'select':'//select[contains(@id,"{}")]',
        
    },
    'recurring_donations':{
        'actions-link':'//a[@title="{}" or @name="{}"]',
        },
    'payments':{
        'date_loc':"//*[@id='pmtTable']/tbody/tr/td[3]/div//input",       
        'no_payments':'//tbody/tr[./th//a[contains(@title,"PMT")]]/td[3]',
        'pays':'//tbody/tr[./th//a[contains(@title,"PMT")]]/td[.//span[text()="{}"]]',
        'pay_amount':'//tbody/tr[{}]/td[3]/span/span[text()="{}"]',
        'check_occurrence':'//h2/a/span[@title="{}"]/following-sibling::span',
        'text':'//*[@id="j_id0:vfForm:j_id76:util_formfield:inputx:util_inputfield:inputX"]',
        'field-value':"//div[contains(@class,'slds-form-element')][./span[text()='{}']]/following-sibling::div",
        'allocations':"//article[contains(@class, 'forceRelatedListCardDesktop')][.//img][.//span[@title='{}']]//tbody/tr[./td/a[text()='{}']]/th",
        },
    'gaus':{
        'input_field':'//div[@class="slds-form-element"][./label[text()="{}"]]/div/input',
        },
    'npsp_settings':{
        'panel_sub_link':'//ul/li/a[text()="{}"]',
        'field_value':"//div[@class='slds-form-element'][./label[contains(text(),'{}')]]/div/span",
        'side_panel':'//div[@id="{}"]//child::button[contains(@class,"chevronright")]',
        'list':"//div[contains(@class,'slds-form_horizontal')]/div[@class='slds-form-element']/label[text()='{}']/following-sibling::div/select",
        'multi_list':'//div[contains(@class,"slds-form_horizontal")]/div[@class="slds-form-element"][./label[text()="{}"]]/div//select',
        'list_val':'//div[@class="slds-form-element"][./label[text()="{}"]]/div/span[text()="{}"]',
        'status':'//div[contains(@class,"slds-tile__title")][.//span[text()="{}"]]/div[contains(@class,"slds-col")]//span[text()="{}"]',
        'button':'//form[.//h1[contains(text(),"{}")]]//input[contains(@value,"{}")]',
        'completed':'//span[contains(@class, \'slds-theme_success\')]',
        'batch-button':'//div[@id="{}"]//child::input[@value="{}"]',
        'checkbox':'//div[@id= "idPanel{}"]/descendant::span[@class="slds-checkbox_faux"]'
        },
    'data_imports':{
        'status':'//div[contains(@class,"slds-tile__title")][./p[text()="BDI_DataImport_BATCH"]]/div[contains(@class,"slds-col")]/span[text()="{}"]',
        'checkbox':'//tr[./th//a[@title="{}"]]/td//span[@class="slds-checkbox--faux"]',
        'actions_dd':'//a[contains(@title,"more actions")and @aria-expanded="true"]',
        },
    'bge':{
        'checkbox':'//label/span[text()="{}"]//parent::label/span[@class="slds-checkbox_faux"]',
        'field-duellist':'//label[text()="{}"]/following-sibling::lightning-dual-listbox//div[contains(@class,"slds-dueling-list__column")][./span[text()="{}"]]//div[contains(@class,"slds-dueling-list__options")]/ul/li//span[text()="{}"]',
        'duellist':'//h3[./span[text()="{}"]]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")][./span[text()="{}"]]//div[contains(@class,"slds-dueling-list__options")]/ul/li//span[text()="{}"]',
        'duellist2':'//div/div[text()="{}"]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")][./span[text()="{}"]]//div[contains(@class,"slds-dueling-list__options")]/ul/li//span[text()="{}"]',
        'field-select-button':'//label[text()="{}"]/following-sibling::lightning-dual-listbox//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        'select-button':'//h3[./span[text()="{}"]]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        'select-button2':'//div/div[text()="{}"]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        'title':'//p[text()="{}"]/following-sibling::h1',
        'field-input':'//label[text()="{}"]/following-sibling::div/input',
        'field-text':'//label[text()="{}"]/following-sibling::div/textarea',
        'button':'//div[contains(@class,"active")]/descendant::button[text()="{}"]',
        'month':"//div[@class='slds-align-middle']//button[@title='{}']",
        'date':"//div[contains(@class,'slds-datepicker')]/table[@class='slds-datepicker__month']//span[text()='{}']",
        'card-header':'//article[./div[@class="slds-card__body"]//lightning-formatted-text[text()="{}"]]/header',
        'edit_button':'//td[@data-label="{}"]//button',
        'edit_field':'//lightning-primitive-datatable-iedit-panel//input',
        'count':'//div[contains(@class,"BGE_DataImportBatchEntry")]//tbody/tr',
        'value':'//td[@data-label="{}"]//a',
        'name':'//div[contains(@class,"BGE_DataImportBatchEntry")]//tbody/tr/th//a',
        'locate_dropdown':'//div[contains(@class,"BGE_DataImportBatchEntry")]//tbody/tr[{}]/td[6]//div//button[./span[text()="Show actions"]]/lightning-primitive-icon',
        'gift-amount':'//div[./label[text()="{}"]]',
        'modal-link':'//tbody/tr/td/a[text()="{}"]',
        'datepicker_open':"//div[contains(@class,'slds-is-open')][./label[text()='{}']]",
        },    
    'bge-lists':{
        'list1':"//div[./label[text()='{}']]/div//select",
        'list2':"//div[contains(@class,'slds-grid')]/div[contains(@class,'slds-text-align_left')]/span[text()='{}']/../following-sibling::div//select",
        'list3':"//div[./label/span[text()='{}']]/div//select",
        
        },
    'bge-duellist-btn':{
        'select-button':'//h3[./span[text()="{}"]]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        'select-button2':'//div/div[text()="{}"]/following-sibling::div//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        'field-select-button':'//label[text()="{}"]/following-sibling::lightning-dual-listbox//div[contains(@class,"slds-dueling-list__column")]//button[@title="{}"]',
        },

    'object_manager':{
        'button':'//input[@title="{}"]',
        },
    'custom_settings':{
        'subtree':'//a/mark[text()="{}"]',
        'link':"//table[@class='list']/tbody/tr[./th/a[text()='{}']]/td/a[text()='{}']",
        'cbx_status':'//table[@class="detailList"]/tbody/tr/th[./span[text()="{}"]]/following-sibling::td//img[@title="{}"]',
        },
    'adv_mappings':{
        'dropdown':"//tr[.//*[text()='{}']]/td[.//span[text()='Show actions']]//button",
        'modal_open':'//div[contains(@class,"slds-backdrop_open")]',
        'field_mapping':'//input[@name="{}"]',
        'combobox':'//div[contains(@class,"slds-is-open") and @role="combobox"]',
        'footer-btn':"//footer[@class='slds-modal__footer']/button[text()='{}']", 
        'button':"//button[text()='Create New Field Mapping']",
        'field-label':'//lightning-formatted-text[text()="{}"]',
        },
    'modal-form':{
        'label':'//div[./*/*[text()="{}"]]',
        },
    
}
    

extra_locators={
    'related_list_items1':'//div[@class = "forceRelatedListContainer"][.//a[contains(@class, "slds-card")]]//span[text() = "Relationships"]/ancestor::div[contains(@class, "slds-card")]/following-sibling::div[contains(@class, "slds-card")]//tbody//td/span[text()="{}"]',
    
}
dnd={ ""
    }