import { cloneDeep } from 'lodash'
import { from, interval, ReplaySubject,Subject } from 'rxjs'
import { concatMap, debounceTime, map, take, takeWhile } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { Column, HeaderPosition, IServerSideGetRowsParams } from 'ag-grid-community'
import { NumericEditor } from './numeric-editor.component'
import { StorageService } from 'src/app/services/storage.service'
import { UntypedFormBuilder,UntypedFormGroup,Validators } from '@angular/forms'
import { OrderformService } from '../orderform/orderform.service'
import { AlljobService } from 'src/app/services/alljob/alljob.service'
import { DynamicFieldComponent } from 'src/app/components/dynamic-field/dynamic-field.component';
import { OrdercalculationService } from '../ordercalc/ordercalculation.service'
import { CommonvalidationService } from 'src/app/services/commonvalidation.service'
import { CommonsearchfilterService } from 'src/app/services/commonsearchfilter.service'
import { CommonsettingService } from 'src/app/services/commonsetting/commonsetting.service'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component,ElementRef,EventEmitter,HostListener,Input,OnInit,Output,QueryList,ViewChild,ViewChildren, TemplateRef } from '@angular/core'
import { CommonnotificationService } from 'src/app/services/commonnotification/commonnotification.service'
import { DeliveryeditComponent } from 'src/app/components/settings/company-settings/deliveryedit/deliveryedit.component'
import { OptionsMaterialsService } from 'src/app/services/settings/options-materials/options-materials.service'
import { CommonPopupService } from 'src/app/services/common-popup/common-popup.service'
import { OrderheadercheckboxComponent } from './orderheadercheckbox/orderheadercheckbox.component'
import { CustomerapiService } from 'src/app/services/contacts/customerapi.service'
import { CommonproductService } from 'src/app/services/commonproduct/commonproduct.service'
import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
import {debounce} from 'lodash';
import { Editoption_fabricComponent } from './editoption_fabric/editoption_fabric.component'
import { environment } from 'src/environments/environment'
import { toJavaScript } from 'excel-formula';
import { JobService } from 'src/app/services/add/job/job.service'
import { AuthService } from 'src/app/core/auth/service/auth.service'
import { FormulalanguageformatService } from 'src/app/services/formulalanguageformat.service';
import html2canvas from 'html2canvas';
import { CommonserviceService } from 'src/app/commonservice.service'
import { NgxModalService } from 'src/app/ngx-modal.service'
import * as moment from 'moment';
import { DeletePopupComponent } from 'src/app/components/delete-popup/delete-popup.component'
import { MatDialog } from '@angular/material/dialog';
import { AppstatuspopupComponent } from 'src/app/components/commoncalendarsetup/commonappionmentstatus/appstatuspopup.component';
import { TooltipComponent } from '@syncfusion/ej2-angular-popups'
import { PermissionService } from 'src/app/userpermission/permission.service'
declare var $:any
export interface form {
  id: string,
  formGroup: UntypedFormGroup,
  metaData: any[],
  transactionalData: any[]
}
@Component({
  selector: 'lib-orderformpopup',
  templateUrl: './orderformpopup.component.html',
  styleUrls: ['./orderformpopup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderformpopupComponent implements OnInit {
  currentIndex = 0;
//multi quotation start
  pivotId: any = ''
  acceptanceflag: boolean = true
//multi quotation end
  apiflagcount: any = 0
  groupedData: { [key: string]: any[] } = {};
  sectionTotalCost: { [key: string]: any } = {};
  sectionTotalSelling: { [key: string]: any } = {};
  vattypearray:any = {
    type : '',
    value : '',
    vatarray : []
  }
  vatcalctoggle:boolean = false
  editorderitemselectedvalues: any={}
  @ViewChild("materialfabric") materialfabric: any;
  @ViewChild("saveOptionsPopup") optionsPopup:any
  @ViewChild("colorfabric") colorfabric:any;
  @ViewChild('appstatus') appstatus:AppstatuspopupComponent;
  @ViewChild('singleSelect') singleSelect = null;
  @ViewChild('locationPopupSetup') locationPopupSetup: any;
  context:any
  totalRows:any
  page:number = 1
  getRowHeight:any
  searchtext:any = ''
  agGridOptions:any = {}
  paginationPageSize:any
  fabricSubscription: any;
  colorsubscription: any
  optionpopupsubscription: any
  assignPricePopup:any;
  fieldListObj:any;
  optiongridsubscription: any
  supplierSaveSubscription: any
  paginationNumberFormatter:any
  noRowsTemplate:any = "No Rows To Show"
  isLoadingorderitem:boolean = false
  category:any;
  optionqtyarray:any = {}
  public tooltipShowDelay = 100;
  widthdropfraction:any={width:0,drop:0}
  gridApi: any
  modules: any
  orderid: any
  orderview: any
  ordercost: any
  orderprice: any
  isdropdonwexit: boolean=false
  columnDefs: any
  receipe: any=''
  formatdate: any
  gridOptions: any
  forms: form[]=[] 
  currentcontactid=0;
  commonfabricarray:any
  pricegrouparray:any
  dynamicForms: UntypedFormGroup;
  customizedArray: any = [];
  imagedataarray: any = [];
  unittypecurrent : any = []; 
  changesflag: boolean=false
  fabricarraypush:any = {};
  customerchecked: boolean=false
  sofyfurningindex:any
  pricegroupindex:any
  suppliercurrent:any
  supplierindex:any
  unittypeval: any
  selectedocoourid: any
  untitypeid: any
  softfurningfabricid: any
  softfurningfabricname: any
  pricegroupcurrent: any
  valueForSupplier: any
  editruleoverridecurrent:any
  imageSrc: any = {};
  addeditmode: any
  receipename: any
  orderparams: any
  rowSelection:any
  Measurementarray:any;
  inchfractionselected:any;
  widthdecimalinches:any=0;
  dropdecimalinches:any=0;
  numericDecimalInches:any=0;
  prostatus: any=''
  dropcalac:any =[]
  ordertabindex: any
  gridColumnApi:any
  defaultColDef: any
  widthcalac:any =[]
  unittypevalue: any
  unittypevaluehideshow: any
  ordersubindex: any
  orderwidthdrop: any
  changeRuleTime:any;
  ordermode: any = ''
  vatvalue: any=20
  rulesvalue: any = 1
  receipelistArr: any
  orderparentrow: any
  editorderfield: any
  costpricevalue: any;
  orderfieldid: any=''
  rowHeight: number=31
  standarddata:any =[]
  gridBoxValue:any = []
  decimalvalue: any = 2
  timestamp = Date.now();
  orderimageurl: any=''
  backgroundimageurl: any=''
  frameimageurl: any=''
  colorimageurl: any=''
  widthdropmsg: any = ''
  selectedcompindex: any
  selectedproductid: any
  orderpricearray:any =[]
  onlineOverrideTypeARRAY:any=[]
  productionindex:any = 0
  selectedproduct: string
  inst =this.fb.group({})
  headerHeight: number=33
  orderlength: number = 10
  frameworkComponents: any
  selectedproductfield: any
  productstatusarray:any =[]
  orderstatusidarray: any=[]
  netpricecomesfrom: any = ''
  validationerrmsg: string=''
  overRideFlag: boolean=false 
  rulesBaseDisableSave : boolean = false
  rulecount:any=0
  orderproductiondata: any=[]
  prostatusselectarray:any=[]
  selectedcompsetcontrol: any
  costpricecomesfrom: any = ''
  ordercalculationarray: any=[]
  floatingFiltersHeight: number
  validationflag: boolean=false
  productstatusselectedindex= 0
  costpriceflag: boolean = false
  ordercalcflag: boolean = false
  widthdropflag: boolean = false
  selectionProductFieldName: any
  selectioncategory:any
  materialList:any=[]
  materialDataArry:any=[]
  materialArry:any;
  materialListFilter:any;
  removedIdArry:any=[]
  ordereditparams: any={ready:''}
  closeEscapeFlag: boolean = false
  fabricIds: any = [5,19,20,21,22]
  combofabricIds = [5,19,22]
  combocolorIds = [20]
  orderchangeflag: boolean = false
  productstatusflag: boolean=false
  prostatussinglemultipleflag: any=''
  pricegroupselectedidArry:any=''
  Displayformat: any = '';
  loader: any = new Subject<string>()
  widthdropprice = new Subject<string>()
  changeTime = new Subject<any>();
  @Output() childEvent = new EventEmitter()
  @Output() saveCopySelected = new EventEmitter();
  filteredWebsites: any=new ReplaySubject(1);
  keepFlag:boolean = false;
  costpriceValue:boolean = false;
  overridetypeValue:boolean = false;
  @ViewChildren('datePicker') datePicker:QueryList<ElementRef>
  @ViewChild('dropdownElement') dropdownElement: ElementRef;
  
  stopRuleFlag:boolean;
  orderpricevalidation: any = {costprice:'',netprice:'',grossprice:''}
  dropdownSettings = {
    singleSelection: false,
    idField: 'optionid',
    textField: 'optionname',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  statusdropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'itemname',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    enableCheckAll: false
  }
  
  statussingledropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'itemname',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  }
  orderpricecalculation:any = {
    createdate: new Date(),
    productiondate: new Date(),
    costpricetoggle: false,
    totalcost: '',
    overrideprice: 1,
    overridepricecalc: '',
    netprice: '',
    vat: this.vatvalue,
    totalgross:'',
    optionprice: '',
    pricegroupprice: ''
  }
  productarr = [
    {productid:1,productvalue:'Curtain'},
    {productid:2,productvalue:'Venetian'},
    {productid:3,productvalue:'Roller Blinds'},
    {productid:4,productvalue:'Shutter'}
  ]
  isAddLocSelected:boolean = false;
  unittypedata: any
  opencloseflag: any=[]
  ordereditform: any=[]
  datevalidation: any=''
  saveflag: boolean = false
  dropminmaxvalue: any = ''
  widthminmaxvalue: any = ''
  numericminmaxvalue: any = ''
  closeflag: boolean = false
  widthdroppricemsg: any = ''
  productiontotalcost: any = 0
  fabricccolroptdefault: any=''
  popupcloseflag: boolean = false
  costpricetoggle: boolean = false
  productionmaterialnetprice: any=''
  productionmaterialnetpricewithdiscount: any='';
  overridepricevalue: any=''
  getpricegroupprice:any=''
  productionmaterialcostprice: any=''
  materialFormulaPrice: any=''
  widthdroppriceflag: boolean = false
  oneditmode: boolean = false
  filterbasearray:any = { fabric: [], color: [], option: [],fabricdual:[],colordual:[] }
  filterarray = {supplier:[],pricegroup:[],fabric:[],color:[]}
  oldorderpricecalculation:any = {netprice:'',vat:'',totalgross:''}
  endcustomerorderpricecalculation = {netprice:'',vat:'',totalgross:'',overrideprice:1,overridepricecalc: '',calvatprice:''} // for online portal
  isDisabled:boolean = false;
  vat_type: number=0;
  vat_value: number=0;
  vattype: number=0;
  defaultsalestaxlabel='';
  subrulesvalue: any=0
  job_tempid:any;
  @Input() organisation_id:any;
  @Input() zip_code:any;
  @Input() currencydetail:any;
  @Input() commissionvalues:any;
  @Input() disableFields:boolean;
  @Input() diableComboRow:boolean;
  seletarray: any=[]
  submenu_gridoption:any;
  submenu_suppressPaginationPanel:boolean=true;
  submenu_pagination:boolean=false;
  dynamicwidthtypeid: any =''
  dynamicdroptypeid: any=''
  //online portal section
  onlineflag:boolean=false;
  onlineportalendpricecal:any;
  onlineportalendpricecalSub = new Subject<any>();
  onllineaftersubmitordereditflag:boolean=true;
  roundflag:boolean=false
  selectproduct_typeid:any='';
  selectproduct_typeiddual:any=[];
  orderpricechangeflag: any=0
  // fieldnameTerms = new Subject()
  searchSubscription: any
  checkpriceval: any
  priceupdate: any
  rulescount: any=''
  formulacount: any=''
  enabledisableflag: boolean = false
  singlemultipleflag: any=''
  selectedoption: any=[]
  maxwidtherr: any=''
  paginationarray:any= {}
  reportpriceresults: any=[]
  operationsubscribe:any;
  textfieldheight: any 
  paginationflag: boolean = true
  receipedisabledflag: boolean = false
  getchangefield: any = []
  globaleditselectedids: any = []
  fractionshowhideflag: boolean = false
  ///edit option_fabric grid parms
  option_fabric_rowData:any;
  option_fabric_agGridOptions: any;
  option_fabric_columnDefsOptions:any;
  option_fabric_defaultColDefOptions:any;
  option_fabric_frameworkComponents:any;
  optionFilterScrollFlag:boolean=false;
  option_fabric_columnapi:any;
  option_fabric_gridapi:any;
  homeUrl: any;
  option_fabric_editfielddata:any;
  option_fabric_index: any;
  option_fabric_indexflag:boolean=false;
  edit_fabricCloseSubscriptionField:any;
  edit_optionlistsubscription: any
  edit_loadColorSLATS: any;
  edit_slatcolorid:any;
  edit_colorlistsubscription: any
  edit_saveColorsubscription: any;
  edit_shuttersupplierlist:any = [];
  vatarray:any = []
  ordervattype:any = ''
  imageForProColOpt:any = {
    productimage : '',
    fabricimage : '',
    optionsimages :  [],
    splitoptionsimages : []
  }
  globalLocation:any=[];
  envImageUrl:any = '';
  battanLength = {};
  showtaxjobitem: boolean = false
  alertonPrice: boolean = false
  vatinputboxvalue: any=''
  suppliersetmanual: number = 0;
  globaleditPopup = false;
  roundOfroundOnValue:any=''
  selectedNameForOverridePrice:any='Select'
  numberFraction:any;
  ///price fields based show_hide
  pricefields:any = {};
  ispriceenable:any=''
  saveorderflag: boolean = true
  isLoading: boolean=false;
  selectDebouncedSearch = new Subject<any>();
  savedFormValue:any;
  inputField:string=''
  locationList: any=[]
  isEditLocSelected: boolean = false;
  currentLocation: string=''
  searchTerm: string='';
  listOfLocations: any = [];
  listOfLocationsClone: any[]=[]
  isDropdownOpen: boolean = false;
  isDropdown:boolean = false;
  locationId: any;
  addLocation: string='';
  locationColorId: number;
  currentLocationCopy: string='';
  locationError: boolean = false;
  previousLocations: any[]=[]
  newLocationVal: any[]=[];
  productId: number;
  onlyKeepflag: boolean = false;
  progress: number = 0;
  selectedId: any; 
  productMaxSqArea: boolean = false;
  enableMaxSqAreaOnlineOrder: boolean = false;
  maxSqAreaFlagCheck: boolean = true;
  tempImage: any;
  showImg: boolean = false;
  hoverTimeout: any;
  isInvalidDiscount: boolean=false
  maxDiscountErrorMsg: string=''
  maxDiscountCalculation:any=new Subject<any>();
  maxDiscountCalSubscription:any;
  rowIndex:any;
  save_copy: boolean = false;
  ruleModeOpt: boolean = false;
  priceCalculation: boolean = false;
  productlist: any = []
  currentTooltip: TooltipComponent | null = null;
  numericChangeSubject = new Subject<{ event: any, prop: any, i: any, fieldid: any, allreadycon: any }>();
  paramWarningBase: boolean = false; // LA-I3630
  private minMaxSetConditionRunning = false; // LA-I3630
  dateClicked: boolean = false;
  lastDueDate: any;
  manualDueDate: any = 0;
  jobStatus: any;
  jobDueDate: any;
  customerAccountType:any;
  totalOperationSellingCost:any = 0.00;
  sectionName: string=''

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.key == 'Tab' || event.key == 'ArrowDown'  || event.key == 'ArrowUp' || event.keyCode == 32) && (this.enabledisableflag)) {
      event.preventDefault();
    }
  }
  @HostListener('window:click', ['$event'])
onWindowClick(event: MouseEvent) {
  if(this.enabledisableflag ){
    event.preventDefault();
  }
}
  optiondefaultarray: any = { optionArray: [], selectedIds: [], searchOpt : [] };
  comboFilterData:any = {}
  @ViewChild('globalProductModal', {static: false}) globalProductModal: TemplateRef<any>;
  @ViewChild('fabricEditModal', {static: false}) fabricEditModal: TemplateRef<any>;
  @ViewChild('galleryImageModal', {static: false}) galleryImageModal: TemplateRef<any>;
  @ViewChild('priceUpdateModal', {static: false}) priceUpdateModal: TemplateRef<any>;
  @ViewChild('dueDateModal', {static: false}) dueDateModal: TemplateRef<any>;

  constructor(public orderauth:JobService,public permission:PermissionService,private productapi: OptionsMaterialsService,private commonapiService: CommonproductService,private customer:CustomerapiService,public popupService: CommonPopupService,private toast: CommonnotificationService,private pricecalc:OrdercalculationService,private commonsetup:CommonsettingService,
    private route: ActivatedRoute, private fb: UntypedFormBuilder,private commonfilter: CommonsearchfilterService,private dynamicform:DynamicFieldComponent,
    private productser:AlljobService,public orderser: OrderformService,private validation: CommonvalidationService,private storage: StorageService,private productService: CommonproductService,private Auth: AuthService,private formulalanguageformat: FormulalanguageformatService,public service: CommonserviceService,private cd: ChangeDetectorRef,public dialogRef: MatDialog, public ngxModalService: NgxModalService) {
      // disable grid onchange save in case-id LA-I567
      this.orderser.orderqtychanges.pipe(debounceTime(1000)).subscribe(value => {
        this.forms[0].metaData[this.selectedcompindex].optionsvalue.map((data:any)=>{
          if(this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 33  && (data["length"] > 0 || data.qty > 0)){
            this.battanLength[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data["length"]
            this.optionqtyarray[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data.qty
          }else{
            if(parseFloat(data.optionqty) > 0){
              this.optionqtyarray[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data.optionqty
            }
          }
        })
     })
     
     this.searchSubject.pipe(
      debounceTime(500), // Adjust the debounce time as needed (in milliseconds)
    ).subscribe((value:any) => {
      this.comboFilterData = JSON.parse(value)
      if($('#comboGrid'+this.comboFilterData.index).data('openPanel')){
        this.getServerData(this.comboFilterData.index,'',[],this.comboFilterData)
      }
    });
     this.selectDebouncedSearch.pipe(debounceTime(300),).subscribe(value => {
       this.selectedfieldfn(value.e,value.i,value.parentfield,value.event)
    })
    this.maxDiscountCalSubscription = this.maxDiscountCalculation.pipe(debounceTime(500),).subscribe(value => {
      this.validateMaxVal()
   })
    this.numericChangeSubject.pipe(debounceTime(1200)).subscribe(({ event, prop, i, fieldid, allreadycon }) => {
      this.paramWarningBase = true;
      this.doNumericChange(event, prop, i, fieldid, allreadycon);
      this.cd.markForCheck();
    });
    this.context = {
      componentParent: this,
      onRowClicked: this.onRowClicked.bind(this)
    }
    this.getRowHeight =(params)=>{
      return params.data.rowHeight
    }
    this.frameworkComponents = {
      DeliveryeditComponent: DeliveryeditComponent,
      NumericEditor: NumericEditor
    }
    //online portal section
    this.onlineflag = this.storage.getCookie('onlineorderuserid') ? true : false
   
    this.onlineportalendpricecal = this.onlineportalendpricecalSub.pipe(debounceTime(500),).subscribe((value) => {
      this.onlineportalorderpricecalc()
    })
    // formula changes
    this.saveFormulaSubscription = this.popupService._popupFormulaSaveSubject.subscribe((res: any) => {
      if (res.type == 'rule') {
        this.saveRule(res.formData);
      } else {
        this.systemFields = res.systemFields;
        this.saveFormula(res.formData);
      }
      setTimeout(()=>{
        this.commonfilter.resetsearch()
      },100)
    });
    this.operationsubscribe = this.productService._refershjob.subscribe((res:any)=>{ 
      if(!this.keepFlag){
        this.ordercalc();
      }
    })

    this.fabricSubscription = this.popupService._popupFabricSaveSubject.subscribe((res: any) => {
        this.saveFabric(res);
    });
    this.colorsubscription = this.popupService._popupOptionSaveSubject.subscribe((data: any) => {
      this.saveColor(data)
    })
    this.optionpopupsubscription = this.popupService._productpopupColorSubject.subscribe((data : any) => {
      this.optionpopupsubscription.openColorpopup(data)
      this.changesflag= false
    })
    this.assignPricePopup = this.popupService._fabricValueSubject.subscribe((data:any)=>{
      if(this.assignPricePopup.materialProductFlag && !this.assignPricePopup.submitAddCOLORFlag && this.assignPricePopup.saveAsFlag){
        $('#materialFabric-modal').modal('hide')
        this.popupService.openPriceModal(this.assignPricePopup.sendValue);
      }else{
          if(this.assignPricePopup.saveOnlyColorFlag==false && data){
          $('#materialFabric-modal').modal('hide')
        }
      }
    })
    this.optiongridsubscription = this.popupService._productColorloadgrid.subscribe((data : any) => {
        setTimeout(() => {
          this.page = 1
          this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
        }, 100)
    })
    this.supplierSaveSubscription = this.toast._OverallSupplierSave.subscribe((data: any) => {
      if(this.toast.activeSupplierModule == '130' || this.toast.activeSupplierModule == '174' || this.toast.activeSupplierModule == '374' || this.toast.activeSupplierModule == '293'){
        this.loadSupplierList()
      }
    })
    this.edit_fabricCloseSubscriptionField = this.popupService._popupFabricCloseSubject.subscribe((res: any) => {
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[],res))
      }, 100)
    });
    this.edit_optionlistsubscription = this.popupService._popupOptionlistPassSubject.subscribe((data: any) => {
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
      }, 100)
    })
   
    this.edit_loadColorSLATS = this.popupService._SLATpopupColorSaveSubject.subscribe((data:any)=>{
      this.edit_slatcolorid = data;
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[],data))
      }, 100)
    })
    this.edit_colorlistsubscription = this.popupService._popuplistfabricSubject.subscribe((data: any) => {
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[],data.materials))
      }, 100)
    })
    this.edit_saveColorsubscription = this.popupService._colorSaveSubject.subscribe((data: any) => {
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[],data?.colourid))
      }, 100)
    })
    ///////Edit option/fabric (materials)  from job item
    this.option_fabric_agGridOptions = {
      enableCellTextSelection: true,
      suppressLoadingOverlay: false,
      stopEditingWhenCellsLoseFocus: true,
      suppressDragLeaveHidesColumns: true,
      suppressMenuHide: true,
      applyColumnDefOrder: true,
      rowSelection: 'multiple',
      cacheBlockSize: 50,
      paginationPageSize: 50,
      maxBlocksInCache: 10,
      rowModelType: 'serverSide',
      serverSideStoreType: "partial",
      pagination: false,
      flex: 1,
      paginationAutoPageSize: false,
      blockLoadDebounceMillis: 100,
    }
    this.option_fabric_defaultColDefOptions = {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      sortable: true,
      resizable: false,
      flex:1,
      editable: false,
      suppressMovable: true,
      suppressKeyboardEvent: this.commonfilter.suppressNavigation,
      suppressHeaderKeyboardEvent: this.commonfilter.suppressUpDownNavigation,
      // cellRenderer: this.createHyperLink.bind(this),
    }
    this.option_fabric_frameworkComponents = {
      FieldchagesComponent: Editoption_fabricComponent,
      };
      this.option_fabric_columnDefsOptions = [];
    this.orderwidthdrop = this.widthdropprice.pipe(debounceTime(500),).subscribe((value) => {
      let ordervalue:any = value
      this.getordertextboxvalue(ordervalue.inputvalue,ordervalue.orderfield,ordervalue.orderindex,ordervalue.orderfieldname)
    })

    this.changeRuleTime = this.changeTime.pipe(debounceTime(1000),).subscribe((value) => {
      if(!this.rulescount && !this.formulacount){
        this.ordercalc()
        let unittypeid = ''
        let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34 )
        if(ind != -1){
          unittypeid = this.forms[0].metaData[ind].optiondefault
        }
        if(this.oneditmode==false){
          let temp:any=Number(unittypeid)
          this.unittypefractionlist(-1,temp)
        }
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
    })

    this.orderview =  this.orderser.orderviewchange$.subscribe((data:any)=>{
      let orderId = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : this.job_tempid;
      let customerType = this.productser.customerType;
      if(data.action != "newproduct"){
        this.orderser.getPricefieldsForGlobaledit({ jobid: orderId, customertype: customerType }).subscribe((res: any) => {
          this.ispriceenable = res?.ispriceenable;
          this.pricefields.allpricefield = res?.globaleditpricefield ?? [];
          this.cd.markForCheck();
        });
      }
      this.orderid = data.orderid
      this.receipe = data.receipeid
      this.pivotId = data.pivotId
      this.globaleditselectedids = data.selectedrow
      this.globaleditselectedids = this.globaleditselectedids.map(({ 
        jsondata, 
        description, 
        reportdescription, 
        reporttitles, 
        productionformulajsondata, 
        ...rest 
      }) => rest)
      this.receipedisabledflag = data.receipeid ? true : false
      this.globaleditPopup = this.receipedisabledflag;
      this.fractionshowhideflag = this.receipedisabledflag ? true : false
      this.filterbasearray = {fabric:[],color:[],option:[],fabricdual:[],colordual:[]}
      this.oldorderpricecalculation.totalgross = '0.00'
      this.oldorderpricecalculation.vat = '0.00'
      this.oldorderpricecalculation.netprice = '0.00'
      this.orderpricecalculation.totalcost = 0.00
      this.costpricetoggle = false
      this.widthdropflag = false
      this.widthdropmsg = ''
      this.widthminmaxvalue = ''
      this.dropminmaxvalue = ''
      this.numericminmaxvalue = ''
      this.closeflag = false
      this.productiontotalcost=0
      this.ordermode = 'add'
      this.stopRuleFlag = false;
      this.ordereditparams.ready = 0
      this.widthdroppriceflag = false
      this.widthdroppricemsg = ''
      this.popupcloseflag = false
      this.saveflag = false
      this.productionmaterialcostprice = ''
      this.materialFormulaPrice = '';
      this.productionmaterialnetprice = ''
      this.productionmaterialnetpricewithdiscount = ''
      this.getpricegroupprice = ''
      this.fabricccolroptdefault = ''
      this.subrulesvalue = 0
      this.dynamicwidthtypeid = ''
      this.dynamicdroptypeid = '';
      this.endcustomerorderpricecalculation = {netprice:'',vat:'',totalgross:'',overrideprice:1,overridepricecalc: '',calvatprice:''} // for online portal
      this.dynamicdroptypeid = ''
      this.orderser.orderformeditflag = ''
      this.orderpricechangeflag = 0
      this.enabledisableflag = false
      this.optionqtyarray = {}
      this.battanLength = {}
      this.getchangefield = []
      this.reportpriceresults = []
      this.editorderitemselectedvalues = {}
      this.vattypearray = {type : '',value : '',vatarray : []}
      this.isInvalidDiscount=false
      this.firstLoad = true
      this.createForm(data.productid);
      this.cd.markForCheck();
    })
    this.loader.pipe(debounceTime(1000),).subscribe((value) => {
    if(!this.priceCalculation){
      if(!this.rulescount && !this.formulacount){
          this.ordercalc()
          if(this.ordermode!='edit'){
          let unittypeid = ''
          let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
          if( ind != -1 ){
            unittypeid = this.forms[0].metaData[ind].optiondefault
          }
          if(this.oneditmode==false){
            let temp:any=Number(unittypeid)
            this.unittypefractionlist(-1,temp)
          }
          }
        }
      }else{
        this.saveorderflag = this.rulesBaseDisableSave = this.saveflag = this.isLoading = false;
        if(this.loadingIndex ){ 
          this.removeSubLoader()
        }
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      this.cd.markForCheck();
    })
    this.editorderfield = this.productser.orderedit$.subscribe((value:any) => {  
      this.ruleModeOpt = true;   
      this.acceptanceflag = value.acceptanceflag
      this.pivotId = value.pivotId
      this.receipedisabledflag = value.globaledit ? true : false
      this.fractionshowhideflag = this.receipedisabledflag ? true : false
      this.filterbasearray = {fabric:[],color:[],option:[],fabricdual:[],colordual:[]}
      this.oldorderpricecalculation.totalgross = '0.00'
      this.oldorderpricecalculation.vat = '0.00'
      this.oldorderpricecalculation.netprice = '0.00'
      this.orderpricecalculation.totalcost = 0.00
      this.widthdropflag = false
      this.widthdropmsg = ''
      this.widthminmaxvalue = ''
      this.dropminmaxvalue = ''
      this.numericminmaxvalue = ''
      this.productstatusselectedindex = 0
      this.productiontotalcost=0
      this.ordermode = 'edit'  
      this.stopRuleFlag = true;
      this.selectioncategory=value.rowdata.pi_category;
      this.category = this.selectioncategory
      this.selectedproductid=value.rowdata.productid;
      this.onllineaftersubmitordereditflag = this.route.snapshot.queryParams.copyproduct ? true :  value.afterjobsubmitted
      if(this.selectioncategory==6){ 
        this.orderser.getPricegrouplist(this.selectedproductid).toPromise().then((res: any) => { 
         let edata= res.result;  
         this.pricegrouparray =edata;
        });
      }
      this.endcustomerorderpricecalculation = {netprice:'',vat:'',totalgross:'',overrideprice:1,overridepricecalc: '',calvatprice:''} // for online portal
      if(value.mode == 'edit'){
        this.costpricetoggle = false
        this.ordercalcflag = true
        this.datevalidation = ''
        this.closeflag = true
        this.addeditmode = 'edit'
        this.popupcloseflag = false
        this.saveflag = false
        this.productionmaterialcostprice = ''
        this.materialFormulaPrice = '';
        this.productionmaterialnetprice = ''
        this.productionmaterialnetpricewithdiscount = ''
        this.getpricegroupprice=''
        this.fabricccolroptdefault = ''
        this.dynamicwidthtypeid = ''
        this.dynamicdroptypeid = ''
        this.orderser.orderformeditflag = 'true'
        this.orderpricechangeflag = 0
        this.enabledisableflag = false
        this.optionqtyarray = {}
        this.battanLength = {}
        this.getchangefield = []
        this.reportpriceresults = []
        this.editorderitemselectedvalues = {}
        this.vattypearray = {
          type : '',
          value : '',
          vatarray : []
        }
        this.isInvalidDiscount=false
        this.orderdataedit(value.rowdata,value.mode)
        this.subrulesvalue = 0
        this.rowIndex = value.rowIndex;
      }
      else if(value.mode == 'copy'){
        this.filterbasearray = {fabric:[],color:[],option:[],fabricdual:[],colordual:[]}
        this.oldorderpricecalculation.totalgross = '0.00'
        this.oldorderpricecalculation.vat = '0.00'
        this.oldorderpricecalculation.netprice = '0.00'
        this.orderpricecalculation.totalcost = 0.00
        this.costpricetoggle = false
        this.ordercalcflag = false
        this.datevalidation = ''
        this.closeflag = false
        this.productiontotalcost=0
        this.addeditmode = 'add'
        this.popupcloseflag = false
        this.saveflag = false
        this.productionmaterialcostprice = ''
        this.materialFormulaPrice = '';
        this.productionmaterialnetprice = ''
        this.productionmaterialnetpricewithdiscount = ''
        this.getpricegroupprice=''
        this.fabricccolroptdefault = ''
        this.dynamicwidthtypeid = ''
        this.dynamicdroptypeid = ''
        this.orderser.orderformeditflag = ''
        this.orderpricechangeflag = 0
        this.enabledisableflag = false
        this.optionqtyarray = {}
        this.battanLength = {}
        this.getchangefield = []
        this.reportpriceresults = []
        this.editorderitemselectedvalues = {}
        this.vattypearray = {
          type : '',
          value : '',
          vatarray : []
        }
        this.isInvalidDiscount=false
        this.orderdataedit(value.rowdata,value.mode)
        this.rowIndex = value.rowIndex;       
      }
      else{
        this.datevalidation = ''
        this.orderdelete(value.rowdata,value.jobid)
      }
    })
    this.defaultColDef = {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      flex:1,
      sortable: true,
      suppressMenu : true,
      editable: false
    }
    this.rowSelection = 'multiple'
    this.job_tempid = this.storage.getLocal('job_tempid');
  }

//pagination code start
  changeSelect(e,i,parentfield,event,optionId?){
    if(parentfield.fieldtypeid == 4){
      parentfield.optiondefault = optionId;
      let loc = parentfield.optionsvalue.filter(x=>x.optionid == optionId)
      this.inst.get(e.toString()).setValue(loc[0].optionname);
      this.toggleLocation();
    }
    let obj = {e:e,i:i,parentfield : parentfield, event : event}
    this.selectDebouncedSearch.next(obj)
  }
  bodyScroll(event){}
  sortChanged(event){
    setTimeout(() => {
      this.page = 1
      this.gridApi.setServerSideDatasource(this.getDataSource(this.selectedcompindex,'',[]))
    }, 100)
  }
onPaginationChanged(event){
    if(this.paginationarray[this.gridApi?.paginationGetCurrentPage() + 1]){
      let data = this.paginationarray[this.page];
      if(this.page > 1) {
        //below code commented by thirumoorthy for LA-I2746 - TIP-I291-(66395)-AUS McCraes Purchase order for magicseal components, to fix duplicate options ids save after scroll and select options from grid.
        //data.map(el => {
          //this.forms[0].metaData[this.ordertabindex].optionsbackup.push(el);
        //})
      }
      else {
        this.forms[0].metaData[this.ordertabindex].optionsvalue = this.paginationarray[this.gridApi.paginationGetCurrentPage() + 1]
        this.forms[0].metaData[this.ordertabindex].optionsbackup = this.paginationarray[this.gridApi.paginationGetCurrentPage() + 1]
      }
    }
  }
  getoptionvalue(index,rulesarray){
    this.isLoadingorderitem = false
    // only for update the battens qun in filed
  
      this.forms[0].metaData.map(async (value:any,i:any)=>{
      if(value.field_has_sub_option == 1 && value.fieldtypeid != 13){
        if(value.fieldid == index.fieldid){
          let edata:any = {}
          let search:any = ''
          edata.orderitemselectedvalues = this.getallselectedvalues()
          edata.filterids = []
          edata.optionqtys = this.optionqtyarray
          if(value.fieldtypeid == 3){
            let fieldid = value.fieldid
            if(Object.keys(this.filterbasearray.option).length > 0){
              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                if(key == fieldid){
                    edata.filterids = value
                }
              }
            }
          } else if(value.fieldtypeid == 33){
            edata.battenslength = this.battanLength
          }
          else{
            if(this.fabricIds.includes(value.fieldtypeid)){
              if(value.fieldtypeid == 20){
                if(this.filterbasearray.color.length > 0){
                  this.filterbasearray.color.map((color:any)=>{
                    edata.filterids.push(color)
                  })
                }
              }
              else{
                if(value.fieldlevel == 2){
                  if(this.category != 6){ 
                   if(value.dualseq != 2) {
                    if(this.filterbasearray.color.length > 0){
                      this.filterbasearray.color.map((color:any)=>{
                        edata.filterids.push(color)
                      })
                    }
                  }
                  if(value.dualseq == 2) { ////for dual fabric and color
                    if(this.filterbasearray.colordual.length > 0){
                      this.filterbasearray.colordual.map((color:any)=>{
                        edata.filterids.push(color)
                      })
                    }
                  }
                }else{
                  if(value.multiseq <= 1) {
                    if(this.filterbasearray.color.length > 0){
                      this.filterbasearray.color.map((color:any)=>{
                        edata.filterids.push(color)
                      })
                    }
                  }
                  if(value.multiseq > 1) { ////for multicurtain and color
                    if(this.filterbasearray.colordual.length > 0){
                      this.filterbasearray.colordual.map((color:any)=>{
                        if(color.multiseq == value.multiseq){
                          edata.filterids.push(color.id)
                        }
                      })
                    }
                  }
                }
                }
              }
            }
          }
          edata.gridsearch = search
          edata.productionformulalist = this.orderproductiondata
          edata.forrulebased = 1
          edata.fieldselectedids = value.optiondefault 
          if(this.fabricIds.includes(value.fieldtypeid) && value.fieldlevel==1 || (value.fieldlevel==2 && value.issubfabric==1)){
            edata.fabricselectedid = value.optiondefault
            if(this.category != 6){
            edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault : ''
           }else{    
              edata.pricegroupselectedid =  this.forms[0].metaData.find(el => el.multiseq == index.multiseq && el.fieldtypeid == 13)?.optiondefault ? this.forms[0].metaData.find(el => el.multiseq == index.multiseq && el.fieldtypeid == 13)?.optiondefault.toString() : '';           
           }
            edata.supplierselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault : ''
            edata.productid = this.selectedproduct;
            if(value.fieldtypeid == '5'){
              edata['dualseq'] = value?.dualseq;
            }
            if(value.fieldtypeid == '22'){
              edata['multiseq'] = value?.multiseq;
            }
          }
          else{
            edata.fabricselectedid = ''
            edata.pricegroupselectedid = ''
          }
          let page = 1
          let ruleperpagecount = 0
          if(value.optiondefault){
            ruleperpagecount = value.optiondefault.toString().split(',').length
          }
          let perpage = ruleperpagecount
          let contactid = this.currentcontactid =(this.productser.contactid==0)?0:this.productser.contactid
          let fieldtypeid = value.fieldtypeid
          let fabricolorcolor = value.fabricorcolor
          let fieldid = value.fieldid
          let fieldlevel = value.fieldlevel
          edata.productid = this.selectedproductid
          edata.customertype = this.productser.customerType;
          let url = `products/get/fabric/options/list/${this.receipe}/${fieldlevel}/${contactid}/${fieldtypeid}/${fabricolorcolor}/${fieldid}?page=${page}&perpage=${perpage}`
          await this.orderser.getrulefabric(url, edata).subscribe((response: any) => {
            // this.loadcomboGrid(true,i)
            setTimeout(() => {
              this.serverProps(response, this.orderparams,i,'rule',rulesarray,value)
            }, 100);
          })
           
        }
      }
    })
  }
  getallselectedvalues() {
    let orderitemselectedvalues = {}
    let fieldtypearray = [13,14,17,34]
    this.forms[0].metaData.forEach(({ fieldid, optiondefault, fieldtypeid, fieldname }) => {
      if (this.inst.value[fieldid] && !fieldtypearray.includes(fieldtypeid)) {
        orderitemselectedvalues[fieldid] = optiondefault ? optiondefault.toString().split(',') : this.inst.value[fieldid]
      }
    })  
    return orderitemselectedvalues
  }

  private getDataSource(index: any, flag: any, rulesarray, editop?: any) {
    const dataSource = {
      getRows: (params: IServerSideGetRowsParams) => {
        this.isLoadingorderitem = true
        let edata: any = {
          gridsearch: {}
        }
        edata.orderitemselectedvalues = this.getallselectedvalues() 
        edata.filterids = []
        edata.optionqtys = this.optionqtyarray
        if (this.forms[0].metaData[index].fieldtypeid == 3) {
          if (Object.keys(this.filterbasearray.option).length > 0) {
            for (const [key, value] of Object.entries(this.filterbasearray.option)) {
              let optionarray = []
              optionarray.push(this.forms[0].metaData[index])
              if (optionarray.filter(el => el.fieldid == key).length > 0) {
                edata.filterids = value
              }
            }
          }
        } else if (this.forms[0].metaData[index].fieldtypeid == 2) {
          if (Object.keys(this.filterbasearray.option).length > 0) {
            for (const [key, value] of Object.entries(this.filterbasearray.option)) {
              let optionarray = []
              optionarray.push(this.forms[0].metaData[index])
              if (optionarray.filter(el => el.fieldid == key).length > 0) {
                edata.filterids = value
              }
            }
          }
        } else if (this.forms[0].metaData[index].fieldtypeid == 33) {
          edata.battenslength = this.battanLength
          edata.customerid = this.productser.customerid ? parseInt(this.productser.customerid) : parseInt(this.productser.existingcusID)
          if (this.route.snapshot.paramMap.get('id')) {
            edata.jobid = this.route.snapshot.paramMap.get('id')
          } else {
            edata.jobtempid = this.job_tempid
          }
        }
        else {
          if (this.fabricIds.includes(this.forms[0].metaData[index].fieldtypeid)) {
            if (this.forms[0].metaData[index].fieldtypeid == 20) {
              if (this.filterbasearray.color.length > 0) {
                this.filterbasearray.color.map((color: any) => {
                  edata.filterids.push(color)
                })
              }
            }
            else{
              if(this.forms[0].metaData[index].fieldlevel == 2){ 
                if(this.category != 6){
                if(this.forms[0].metaData[index].dualseq !=2){
                if(this.filterbasearray.color.length > 0){
                  this.filterbasearray.color.map((color:any)=>{
                    edata.filterids.push(color)
                  })
                }
                if (this.forms[0].metaData[index].dualseq == 2) { ////for dual fabric and color
                  if (this.filterbasearray.colordual.length > 0) {
                    this.filterbasearray.colordual.map((color: any) => {
                      edata.filterids.push(color)
                    })
                  }
                }
              }
            }else{
              if(this.forms[0].metaData[index].multiseq <= 1){
                if(this.filterbasearray.color.length > 0){
                  this.filterbasearray.color.map((color:any)=>{
                    edata.filterids.push(color)
                  })
                }
              }
              if(this.forms[0].metaData[index].multiseq >1){ ////for multicurtain and color
                if(this.filterbasearray.colordual.length > 0){
                  this.filterbasearray.colordual.map((color:any)=>{
                    if(color.multiseq == this.forms[0].metaData[index].multiseq){
                      edata.filterids.push(color.id)
                    }
                  })
                }
              }
            }
              }
            }
          }
        }
        if (editop) {
          let noduplictedata: any = [];
          if (this.forms[0].metaData[index].fieldtypeid == 3) {
            if (Array.isArray(editop)) {
              editop.forEach((res: any) => {
                edata.filterids.push(res.colourid);
              })
            } else {
              edata.filterids.push(editop);
            }
          } else {
            noduplictedata = this.filterbasearray.color;
            if (Array.isArray(editop)) {
              editop.forEach((res: any) => {
                noduplictedata.push(res.colourid);
              })
            } else {
              noduplictedata.push(editop);
            }
            this.filterbasearray.color = [...new Set(noduplictedata)];
          }
        }
        this.pricegroupselectedidArry = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault : '';
        let search: any = params.request.filterModel;
        edata.gridsearch = search;
        edata.productionformulalist = this.orderproductiondata;
        edata.forrulebased = flag == 'rule' ? 1 : 0;
        edata.fieldselectedids = '';
        var fieldselectedids = [];
        this.selectedoption = this.gridApi.getSelectedRows().length > 0 ? this.gridApi.getSelectedRows() :this.forms[0].metaData[index].optiondefault;
        if(this.selectedoption instanceof Array){
          this.selectedoption.forEach((sel)=>{
            fieldselectedids.push(sel.optionid);
          })
        }
        else {
          fieldselectedids.push(this.selectedoption);
        }
        edata.fieldselectedids = fieldselectedids.join(',');

        this.forms[0].metaData.forEach((field) => {
          if ([11, 7, 8, 31].includes(field.fieldtypeid)) {
            edata['width'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
          else if ([12, 9, 10, 32].includes(field.fieldtypeid)) {
            edata['drop'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
          else if (field.fieldtypeid == 34) {
            edata['unittype'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
        })
        
        if ((this.fabricIds.includes(this.forms[0].metaData[index].fieldtypeid) && this.forms[0].metaData[index].fieldlevel == 1) || (this.forms[0].metaData[index].fieldlevel == 2 && this.forms[0].metaData[index].issubfabric == 1)) {
          edata.fabricselectedid = '';
          edata.fabricselectedid = this.forms[0].metaData[index].optiondefault
          
          edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid == this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid === this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.optiondefault : ''
          edata.supplierselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault : ''
          edata.productid = this.selectedproduct;
          if (this.forms[0].metaData[index].fieldtypeid == '5') {
            edata['dualseq'] = this.forms[0].metaData[index].dualseq;
          }
          if(this.forms[0].metaData[index].fieldtypeid == '22'){
            edata['multiseq'] = this.forms[0].metaData[index].multiseq;
          }
        }
        else {
          edata.fabricselectedid = ''
          //   edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault;
          if(this.category != 6){
          edata.pricegroupselectedid = this.forms[0].metaData[index].dualseq == '2' ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[1]?.optiondefault : this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault
          }else{
          if(this.forms[0].metaData[index].multiseq > 1){
            edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.multiseq == this.forms[0].metaData[index].multiseq)[0]?.optiondefault;
          }else{
            edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault;
          }
        }
        }
        if(this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid == this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.showfieldonjob == 0){
            edata.pricegroupselectedid = ""
            edata.supplierselectedid  = ""
        }
        let page = params.request.endRow / this.agGridOptions.cacheBlockSize
        //fieldedit page
        if (this.option_fabric_indexflag) {
          page = params.request.endRow / this.option_fabric_agGridOptions.cacheBlockSize
        }
        let ruleperpagecount = 0
        if (this.forms[0].metaData[index].optiondefault) {
          ruleperpagecount = this.forms[0].metaData[index].optiondefault.split(',').length
        }
        let perpage = flag == 'rule' ? ruleperpagecount : 50
        let sorting
        let sortLength = params.request.sortModel.length
        if (sortLength > 0) {
          sorting = {
            colId: params.request.sortModel[0].colId,
            orderBy: params.request.sortModel[0].sort
          }
        }
        let contactid = this.currentcontactid = (this.productser.contactid == 0) ? 0 : this.productser.contactid
        let fieldtypeid = this.forms[0].metaData[index].fieldtypeid
        let fabricolorcolor = this.forms[0].metaData[index].fabricorcolor
        let fieldid = this.forms[0].metaData[index].fieldid
        let fieldlevel = this.forms[0].metaData[index].fieldlevel
        edata.productid = this.selectedproductid
        let url = ''
        sorting?.colId
          ? url = `products/get/fabric/options/list/${this.receipe}/${fieldlevel}/${contactid}/${fieldtypeid}/${fabricolorcolor}/${fieldid}/${this.orderid}?page=${page}&perpage=${perpage}&sort=${sorting.colId}&orderby=${sorting.orderBy}`
          : url = `products/get/fabric/options/list/${this.receipe}/${fieldlevel}/${contactid}/${fieldtypeid}/${fabricolorcolor}/${fieldid}/${this.orderid}?page=${page}&perpage=${perpage}`
        edata.customertype = this.productser.customerType;
        this.orderser.getfabric(url, edata, this.forms[0].metaData[index].fieldtypeid).subscribe((response: any) => {
          this.serverProps(response, params, index, flag, rulesarray, this.forms[0].metaData[index])
          if (!params.request.filterModel || Object.keys(params.request.filterModel).length === 0) {
            this.optiondefaultarray.optionArray = response[0]?.data[0]?.optionsvalue;
            this.optiondefaultarray.selectedIds = []
          }else{
            this.optiondefaultarray.searchOpt = response[0]?.data[0]?.optionsvalue;
            this.optiondefaultarray.selectedIds = [...edata.fieldselectedids.split(',')];
          }
          if (response[0]?.data[0]?.optionsselectedcolumns) {
            this.editFabric_optionColumn(response[0]?.data[0]?.optionsselectedcolumns)
          }
          this.commonfilter.globalsearchfn()
        }, err => {
          params.successCallback([], 0);
          this.gridApi.showNoRowsOverlay();
          this.isLoadingorderitem = false;
        })
        setTimeout(() => {
          this.commonfilter.globalsearchfn()
        }, 100)
      }
    }
    setTimeout(() => {
      this.commonfilter.globalsearchfn()
    }, 100)
    return { ...dataSource }
  }


  changeColSort(newSortDirection: string) {
    const currentSortDirection = this.gridApi.getFocusedCell().column.getSort();
    // first, reset all currently set sort models
    this.gridColumnApi.getAllColumns().forEach((c: Column) => {
      c.setSort(null);
    });
    if (currentSortDirection !== newSortDirection) {
      this.gridApi.getFocusedCell().column.setSort(newSortDirection);
    }
    this.gridApi.onSortChanged();
  }
  serverProps(response, params,index,flag,rulesarray,data) {
    index = this.forms[0].metaData.findIndex((fieldindex) => fieldindex.fieldid == data.fieldid)
    let fieldid = data.fieldid
    let optionimagearr = []
    this.totalRows = response[0].totalrows
    this.page = parseInt(response[0].currentpage);// + 1
    this.storage.setCookie('gridtotalrowslength', this.totalRows)
    if(response[0].data.length == 0){
      this.paginationarray[response[0].currentpage] = []
      this.forms[0].metaData[index].optionsvalue = []
      this.forms[0].metaData[index].optionsbackup = []
      this.isLoadingorderitem = false
    }
    else{
      this.paginationarray[response[0].currentpage] = response[0].data[0].optionsvalue
      if(this.forms[0].metaData[index]?.optionsvalue){
        if(this.page > 1) {
          response[0].data[0].optionsvalue.map(el => {
            this.forms[0].metaData[index].optionsvalue.push(el);
            //below code commented by thirumoorthy for LA-I2746 - TIP-I291-(66395)-AUS McCraes Purchase order for magicseal components, to fix duplicate options ids save after scroll and select options from grid.
            //this.forms[0].metaData[index].optionsbackup.push(el);
          })
        }
        else {
          this.forms[0].metaData[index].optionsvalue = response[0].data[0].optionsvalue
          this.forms[0].metaData[index].optionsbackup = response[0].data[0].optionsvalue
        }
      }
      this.isLoadingorderitem = false
    }
    if(flag == 'rule'){
      this.forms[0].metaData.map((v:any,index:any)=>{
        if(rulesarray.length > 0){
          rulesarray.map((price:any,i:any)=>{
            if(price[v.fieldid]){
              let pricechangedata = price[v.fieldid]
              if(v.fieldtypeid == 4 || v.fieldtypeid == 30 || v.fieldtypeid == 29 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                  }
                }
              }else if(v.fieldtypeid == 18 || v.fieldtypeid == 1){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(v.ruleoverride!=1) 
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                  }
                }
              }
              else if(v.fieldtypeid == 13 || v.fieldtypeid == 17){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                   if(this.category != 6){
                     if(v.fieldtypeid == 13 && v.dualseq != 2)
                    {
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.dualseq == 2)
                    {
                      this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }else{
                    if(v.fieldtypeid == 13 && v.multiseq <= 1)
                      {
                        this.selectproduct_typeid = pricechangedata[0].optionid;
                      }
                      if(v.fieldtypeid == 13 && v.multiseq > 1)
                      {
                        let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                        if(unique !== -1){
                          this.selectproduct_typeiddual[unique].id = pricechangedata[0].optionid;
                        }else{
                          this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:pricechangedata[0].optionid});
                        }
                      }
                  }
                    v.optiondefault = pricechangedata[0].optionid.toString()
                  }
                }
              }else if(this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor==2){
                if(!v.optiondefault){
                  if(pricechangedata.length > 0){
                    if(pricechangedata[0].optionvalue){
                      if(this.checkoptionexistence(v.optionsvalue,pricechangedata[0].optionid)){
                        this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                        v.optiondefault = pricechangedata[0].optionid.toString()
                      }
                    }
                  }
                }
              } else if(this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor==1 && this.editruleoverridecurrent==1){
                return;
                 
              }else{
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionvalue){
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                    v.optiondefault = pricechangedata[0].optionid.toString()
                  }
                }
              }

              if(pricechangedata?.[0]?.optionid){
                let checkSame = response[0]?.data[0]?.optionsvalue.find((op) => op?.optionid == pricechangedata[0]?.optionid)
                if(checkSame){
                  if(checkSame?.optionimage){
                    if(v.fabricorcolor == '2'){
                      let flagdata = checkSame;
                      flagdata['flagcolor']=1;
                      this.colorimageurl = this.envImageUrl + checkSame?.optionimage + "?nocache=" + this.timestamp;
                    }
                    optionimagearr = optionimagearr.concat(checkSame)  
                  }
                }
              }
            }
          })
        }
      })
      if(rulesarray.length > 0){
        this.forms[0].metaData.map((v:any,index:any)=>{
          if(v.optiondefault && v.field_has_sub_option == 1 && v.subchild.length == 0){
            if(v.optionsvalue.length > 0){
              let splitoptiondefault = v.optiondefault.toString().split(',')
              if(v.optionsvalue.filter(el=>splitoptiondefault.includes(el.optionid.toString())).length > 0){
                let countdata = []
                v.optionsvalue.filter(el=>splitoptiondefault.includes(el.optionid.toString())).map((sub:any)=>{
                  if(sub.subdatacount > 0){
                    countdata.push(sub.subdatacount)
                  }
                })
                if(countdata.length > 0){
                  let subgridarray = []
                  subgridarray.push(v)
                  this.rulesdefaultorderitem(subgridarray)
                }
              }
            }
          }
        })
      }
    }
    else{
      if(params != "params"){
        if(response[0].data.length == 0  ){
          params.successCallback([], this.totalRows)
          this.gridApi.showNoRowsOverlay()
        }
        else{
          params.successCallback(response[0].data[0].optionsvalue, this.totalRows)
          if(response[0]?.data[0]?.optionsvalue.length > 0) {
            this.gridApi.hideOverlay()
          } 
          else{
            this.gridApi.showNoRowsOverlay()
          }
        }
      }
      if(this.gridApi.getSelectedRows().length > 0){
      }
      else{
        if(this.forms[0].metaData[index].optiondefault){
          let optionidarray = this.forms[0].metaData[index].optiondefault.split(',')
          let fielddata = []
          if(this.forms[0].metaData[index]?.pricegrpid){
            let pricegrpidarray = this.forms[0].metaData[index].pricegrpid.split(',')
            fielddata = this.forms[0].metaData[index].optionsvalue.filter(el => optionidarray.includes(el.optionid.toString()) && pricegrpidarray.includes(el.pricegroupid.toString()))
          }else{
            fielddata = this.forms[0].metaData[index].optionsvalue.filter(el => optionidarray.includes(el.optionid.toString()))
          }
          this.selectedoption = fielddata
        }
      }
      if(this.selectedoption.length == 0){
        this.paginationflag = false
      }
      let showfieldonjobArry:any = ''
      let showFieldOnCustomerPortalArry:any = ''
      this.forms[0].metaData.map((feild:any)=>{
        if(feild.fieldtypeid == 13){
          if(feild.showfieldonjob == 0){
            showfieldonjobArry = feild.showfieldonjob
          }
          if(feild.showFieldOnCustomerPortal == 0){
            showFieldOnCustomerPortalArry = feild.showFieldOnCustomerPortal
          }
        }
      })
       if(this.fabricIds.includes(this.forms[0].metaData[index].fieldtypeid) && this.forms[0].metaData[index].fieldlevel==1 && ( (!this.onlineflag && showfieldonjobArry == 0) || (this.onlineflag && showFieldOnCustomerPortalArry==0))){
        if (Array.isArray(this.selectedoption)) {
          this.selectedoption.map((value:any)=>{
            setTimeout(() => {
              this.gridApi.forEachNode((node) =>{
                if(this.category != 6){
                if( node?.data?.pricegroupid && this.forms[0].metaData[index].dualseq != 2 ){
                  if(node.data?.optionid == value?.optionid && node?.data?.forchildfieldoptionlinkid == value?.forchildfieldoptionlinkid){
                    node.setSelected(true)
                  }
                }else{
                  if(node.data?.optionid == value?.optionid && node?.data?.forchildfieldoptionlinkid == value?.forchildfieldoptionlinkid){
                    node.setSelected(true)
                  }
                }
                }else{
                  if( node?.data?.pricegroupid && this.forms[0].metaData[index].multiseq <= 1 ){
                    if(node.data?.optionid == value?.optionid && node.data?.pricegroupid.toString() == this.pricegroupselectedidArry.toString() && node?.data?.forchildfieldoptionlinkid == value?.forchildfieldoptionlinkid){
                      node.setSelected(true)
                    }
                  }else{
                    if(node.data?.optionid == value?.optionid && node?.data?.forchildfieldoptionlinkid == value?.forchildfieldoptionlinkid){
                      node.setSelected(true)
                    }
                  }
                }
              })
              this.paginationflag = false
            }, 500)
          })
        }
       }else{
        this.gridApi.forEachNode((nodede) =>{
          nodede.setSelected(false);
        });
        if (Array.isArray(this.selectedoption)) {
          this.selectedoption?.map((value:any)=>{
            setTimeout(() => {
              this.gridApi.forEachNode((node) =>{
                if(node.data?.optionid == value?.optionid && node?.data?.forchildfieldoptionlinkid == value?.forchildfieldoptionlinkid){
                  node.setSelected(true)
                }
              })
              this.paginationflag = false
            }, 500)
          })
         }
        }
      let splitarray = []
      if(this.forms[0].metaData[index].optiondefault){
        splitarray = this.forms[0].metaData[index].optiondefault.split(',')
      }
      let checkedarray = {
        optiondefaultarray : splitarray,
        optionvaluearray : this.forms[0].metaData[index].optionsvalue
      }
      this.customer.contactservercheckbox$.next(checkedarray)
    }
    setTimeout(() => {
      if((response[0].data[0]?.showfieldonjob ==1 && !this.onlineflag) || (response[0].data[0]?.showFieldOnCustomerPortal ==1 && this.onlineflag) || ( response[0].data.length == 0 )){
        if($('#comboGrid'+fieldid).data('combogrid')){
          this.loadComboGridData(response,fieldid,this.comboFilterData)
        }
      }
    }, 0);
    this.setCarouselImage(optionimagearr)
  }
  getallsubchildcount(parentdata,parentlimit){
    let subchildcount = 0; 
    if(parentdata.length > 0){
      for (let pd = 0; pd < parentlimit; pd++) {
        let nxtlvlchild = parentdata[pd].subchild;
        if(nxtlvlchild.length > 0){
            subchildcount += nxtlvlchild.length + this.getallsubchildcount(nxtlvlchild,nxtlvlchild.length);
        }
      }                                     
    }
    return subchildcount;
  }
  async rulesdefaultorderitem(defaultdatadata){
    let optionimagearr = []
    return new Promise(async (resolve, reject) => {
      let widthid =''
      let dropid =''
      for(let data of defaultdatadata){
        if(this.singlemultipleflag == 'single'){
          this.enabledisableflag = true
        }
        this.orderparentrow = data
        this.orderfieldid = data.fieldid
        const selectedRow = []
        selectedRow.push(data)
        if(selectedRow.length > 0){
          let splitarray = []
          if(data.optiondefault){
            let subdatacount:number = 0
            let suboptioncount:number = -1;
            splitarray = data.optiondefault.toString().split(',')
            for(let splitvalue of splitarray){
              suboptioncount += 1;
              let linkoptionid:any =[]
              if(splitvalue){
                const optiondata = data.optionsvalue.filter(el => splitarray.includes(el.optionid.toString()))
                let optionnamearray:any = []
                optiondata.map((optvalue:any)=>{
                  if(this.fabricIds.includes(data.fieldtypeid) && (data.fieldlevel==1 || (data.fieldlevel == 2 && data.issubfabric == 1)) && data.fieldtypeid!=21)
                  {
                    if(this.category != 6){
                    if((this.selectproduct_typeid==optvalue.pricegroupid || this.selectproduct_typeiddual==optvalue.pricegroupid) || data.ruleoverride==1 || data.ruleoverride==0 ){
                      optionnamearray.push(optvalue.optionname)
                    }
                  }else{
                    let findind = this.selectproduct_typeiddual.filter((re => re.multiseq == optvalue.multiseq));
                    if((this.selectproduct_typeid==optvalue.pricegroupid || findind[0]?.id==optvalue.pricegroupid) || data.ruleoverride==1){
                      optionnamearray.push(optvalue.optionname)
                    }
                  }
                    if(optionnamearray.length == 0){
                      data.optiondefault = ''
                    }
                  }
                  else
                    optionnamearray.push(optvalue.optionname)

                  if(optvalue?.optionimage){
                    if(data.fabricorcolor == '2'){
                      let flagdata = optvalue;
                      flagdata['flagcolor']=1;
                      this.colorimageurl = this.envImageUrl + optvalue?.optionimage + "?nocache=" + this.timestamp;
                    }
                    optionimagearr = optionimagearr.concat(optvalue)  
                  }
                })
                let linkdata = data.optionsvalue.filter(el => el.optionid == splitvalue)
                if(linkdata[0])
                {
                  linkoptionid.push(data.optionsvalue.filter(el => el.optionid == splitvalue)[0].fieldoptionlinkid)
                  subdatacount = data.optionsvalue.filter(el => el.optionid == splitvalue)[0].subdatacount
                }
                if(data.fieldtypeid != 13){
                 if(this.fabricIds.includes(data.fieldtypeid) && data.fabricorcolor ==2){
                  if(data.ruleoverride!=1 && data.ruleoverride != undefined) 
                  this.inst.get(data.fieldid.toString()).setValue(optionnamearray.toString())
                 }
                  else 
                  this.inst.get(data.fieldid.toString()).setValue(optionnamearray.toString())
                }
              }
              if(this.fabricIds.includes(data.fieldtypeid) && data.fieldlevel == 2 && data.issubfabric != 1){ 
                if(this.singlemultipleflag == 'single'){
                  this.enabledisableflag = false
                }
              }
              else{
                if(data.field_has_sub_option == 1 && data.optiondefault && ((!this.onlineflag && data.showfieldonjob == 1) || (this.onlineflag && data.showFieldOnCustomerPortal))){
                  let optiondata:any =[]
                  optiondata.push(splitvalue)
                  if(subdatacount > 0){
                    let subgriddata = { optionid: optiondata, subfieldoptionlinkid: linkoptionid, productionformulalist: this.orderproductiondata,orderitemselectedvalues: this.getallselectedvalues(),unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault}
                    let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
                    this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
                    await this.orderser.dumygetorderitemsublevel(contactid,this.receipe,data.fieldlevel + 1,subgriddata,data.fieldtypeid,data.masterparentfieldid).toPromise().then(async (res: any) => {
                      if(this.receipedisabledflag){
                        if(res[0].data.length > 0){
                          res[0].data.map((subfield:any)=>{
                            if(subfield.optiondefault || subfield.value){
                              if(!this.getchangefield.includes(subfield.fieldid.toString())){
                                this.getchangefield.push(subfield.fieldid.toString())
                              }
                            }
                          })
                        }
                      }
                      if(Object.keys(this.filterbasearray.option).length > 0){
                        for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                          if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                            this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                              let optionvaluearray:any = []
                              optionvaluearray = value
                              data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                              let optsplitarray = []
                              if(data.optiondefault){
                                optsplitarray = data.optiondefault.split(',')
                              }
                              if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                data.optiondefault = ''
                                this.inst.get(data.fieldid.toString()).setValue('')
                              }
                            })
                          }
                          else{
                            res[0].data.map((filter:any)=>{
                              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                                if(filter.fieldid == key){
                                  let optionvaluearray:any = []
                                  optionvaluearray = value
                                  if(optionvaluearray.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                                    let optsplitarray = []
                                    if(filter.optiondefault){
                                      optsplitarray = filter.optiondefault.split(',')
                                    }
                                    if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                      filter.optiondefault = ''
                                    }
                                  }
                                  else{
                                    filter.optionsvalue = []
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            })
                          }
                        }
                       }
                       if(res[0].data.length > 0){
                        res[0].data.map((filter:any)=>{
                          if(this.fabricIds.includes(filter.fieldtypeid)){
                            if(filter.fieldtypeid == 20){
                              if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                if(this.filterbasearray.color.length > 0){
                                  filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                            }
                            else{
                              if(filter.fieldlevel == 1){
                                if(this.category != 6){
                                if(filter.dualseq !=2){
                                if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                                if(this.filterbasearray.fabric.length > 0){
                                  filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                                }
                              }
                              if(filter.dualseq ==2){ ////for dual fabric and color
                                if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                                if(this.filterbasearray.fabricdual.length > 0){
                                  filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabricdual.includes(el.optionid))
                                }
                              }
                               }else{
                                if(filter.multiseq <= 1){
                                  if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabric.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                                  }
                                }
                                if(filter.multiseq >1){ ////for multicurtain and color
                                  if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabricdual.length > 0){
                                    this.filterbasearray.fabricdual.map((loop:any)=>{
                                      if(loop.multiseq == filter.multiseq){
                                        filter.optionsvalue = filter.optionsbackup.filter(el => loop.id.includes(el.optionid))
                                      }
                                    })
                                  }
                                }
                               }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                              if(filter.fieldlevel == 2){
                                if(this.category != 6){
                                if(filter.dualseq !=2){
                                  if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.color.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                  }
                                }
                                if(filter.dualseq ==2){ ////for dual fabric and color
                                  if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.colordual.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.colordual.includes(el.optionid))
                                  }
                                }
                              }else{
                                if(filter.multiseq <= 1){
                                  if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.color.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                  }
                                }
                                if(filter.multiseq >1){ ////for multicurtain and color
                                  if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.colordual.length > 0){
                                    this.filterbasearray.fabricdual.map((loop:any)=>{
                                      if(loop.multiseq == filter.multiseq){
                                        filter.optionsvalue = filter.optionsbackup.filter(el => loop.id.includes(el.optionid))
                                      }
                                    })
                                    
                                  }
                                }
                              }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            }
                          }
                        })
                      }
                      this.forms[0].metaData.map((el:any,ij:any)=>{
                        if(el.fieldid == data.fieldid){
                          this.selectedcompindex = ij
                        } 
                        let widtharray = [7,8,11,31]
                        let droparray = [9,10,12,32]
                        if(this.widthminmaxvalue){
                          if(widtharray.includes(el.fieldtypeid)){
                            widthid = el.fieldid
                          }
                        }
                        if(this.dropminmaxvalue){
                          if(droparray.includes(el.fieldtypeid)){
                            dropid = el.fieldid
                          }
                        }
                      })
                      if(this.forms[0].metaData[this.selectedcompindex].subchild){
                        if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
                          res[0].data.map((subfilter:any)=>{
                            const found = this.forms[0].metaData[this.selectedcompindex].subchild.some(el => el.subfieldlinkid == subfilter.subfieldlinkid)
                            if(!found){
                              this.forms[0].metaData[this.selectedcompindex].subchild.push(subfilter)
                            }
                          })
                        }
                        else{
                          this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                        }
                      }
                      else{
                        this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                      }
                      if(res[0].data.length > 0){
                        res[0].data.map((data:any)=>{
                          if(this.fabricIds.includes(data.fieldtypeid)){
                            if(data.fieldtypeid == 20){
                              this.filterarray.color = data.optionsbackup
                            }
                            else{
                              if(data.fieldlevel == 2){ this.filterarray.color = data.optionsbackup }
                              else { this.filterarray.fabric = data.optionsbackup }
                            }
                          }
                          if(data.fieldtypeid == 13){
                            this.filterarray.pricegroup = data.optionsbackup
                          }
                          if(data.fieldtypeid == 17){
                            this.filterarray.supplier = data.optionsbackup
                          }
                        })
                        this.isdropdonwexit=false;
                        if(this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                          for(let v=0;v<=res[0].data.length - 1;v++){
                            // res[0].data.forEach(async (v,i)=>{
                              res[0].data[v]['dumydata'] = []
                              if(res[0].data[v].fieldtypeid == 29 || res[0].data[v].fieldtypeid == 18 || res[0].data[v].fieldtypeid == 11 || res[0].data[v].fieldtypeid == 14 || res[0].data[v].fieldtypeid == 1 || res[0].data[v].fieldtypeid == 12 || res[0].data[v].fieldtypeid == 6 || res[0].data[v].fieldtypeid == 7 || res[0].data[v].fieldtypeid == 8 || res[0].data[v].fieldtypeid == 9 || res[0].data[v].fieldtypeid == 10 || res[0].data[v].fieldtypeid == 31 || res[0].data[v].fieldtypeid == 32){
                                this.inst.addControl(res[0].data[v].fieldid,this.fb.control(res[0].data[v]?.value ?? '',this.mapValidators(res[0].data[v].mandatory)))
                              }
                              else{
                                this.inst.addControl(res[0].data[v].fieldid,this.fb.control(null,this.mapValidators(res[0].data[v].mandatory)))
                              }
                              if(this.widthminmaxvalue){
                                this.inst.controls[widthid.toString()].setErrors({ errors: true })
                              }
                              if(this.dropminmaxvalue){
                                this.inst.controls[dropid.toString()].setErrors({ errors: true })
                              }
                              const found = this.forms[0].metaData.some(el => el.fieldid === res[0].data[v].fieldid)
                              if(!found){
                                let allsubchildcount = 0;
                                this.forms[0].metaData.map(async(indexdata:any,index:any)=>{
                                  if(indexdata.optionsvalue.length > 0){
                                    indexdata.optionsvalue.map(async(linkid:any,j:any)=>{
                                      if(linkid.forchildfieldoptionlinkid == res[0].data[v].forchildsubfieldlinkid){
                                        let currentsubindex = indexdata.subchild.findIndex(el => el.fieldid == res[0].data[v].fieldid)
                                        let tmp_allsubchildcount = await this.getallsubchildcount(indexdata.subchild,currentsubindex);
                                        allsubchildcount = (suboptioncount * currentsubindex) + tmp_allsubchildcount;
                                        this.selectedcompindex = index;
                                      }
                                    })
                                  }
                                })
                                let subindex = 0
                                subindex = v + 1 + allsubchildcount;
                                this.forms[0].metaData = this.insertfieldfn(this.forms[0].metaData, this.selectedcompindex+subindex, res[0].data[v])
                                if(!this.rulescount && !this.formulacount){
                                  await this.ordercalc()
                                }
                                if(this.rulescount && !this.formulacount){
                                  this.rulesvalue = 1
                                  await this.paginationrulesbaseprice()
                                }
                                if(!this.rulescount && this.formulacount){
                                  this.rulesvalue = 2
                                  await this.paginationrulesbaseprice()
                                }
                                if(this.rulescount && this.formulacount){
                                  this.rulesvalue = 1
                                  await this.paginationrulesbaseprice()
                                }  
                                let orderarraylength:number = this.forms[0].metaData.length
                                if(orderarraylength > 10){
                                  this.orderlength = (orderarraylength / 2)
                                  if(this.orderlength <= 10) this.orderlength = 10
                                }
                                else this.orderlength = 10
                              }
                            // })
                          }
                        }
                      }
                      if(this.singlemultipleflag == 'single'){
                        this.enabledisableflag = false
                      }
                      if(Object.keys(this.filterbasearray.option).length > 0){
                        for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                          if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                            this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                              let optionvaluearray:any = []
                              optionvaluearray = value
                              data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                              let optsplitarray = []
                              if(data.optiondefault){
                                optsplitarray = data.optiondefault.split(',')
                              }
                              if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                data.optiondefault = ''
                                this.inst.get(data.fieldid.toString()).setValue('')
                                if(data.subchild.length > 0){
                                  var uniqueResultOne = data.subchild
                                  uniqueResultOne.map((removedata:any)=>{
                                    data.subchild = []
                                    this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                                    this.removeorderdata(removedata)
                                  })
                                }
                              }
                            })
                          }
                          else{
                            res[0].data.map((filter:any)=>{
                              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                                if(filter.fieldid == key){
                                  let optionvaluearray:any = []
                                  optionvaluearray = value
                                  if(optionvaluearray.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                                    let optsplitarray = []
                                    if(filter.optiondefault){
                                      optsplitarray = filter.optiondefault.split(',')
                                    }
                                    if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                      filter.optiondefault = ''
                                    }
                                  }
                                  else{
                                    filter.optionsvalue = []
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            })
                          }
                        }
                       }
                    })
                  }
                  else{
                    if(this.singlemultipleflag == 'single'){
                      this.enabledisableflag = false
                    }
                  }
                }
                else{
                  if(this.singlemultipleflag == 'single'){
                    this.enabledisableflag = false
                  }
                }
              }
            }
            if(data.subchild && data.subchild.length > 0){
              await this.rulesdefaultorderitem(data.subchild)
            }
          }
          else{
            if(this.singlemultipleflag == 'single'){
              this.enabledisableflag = false
            }
          }
        }
        else{
          if(this.singlemultipleflag == 'single'){
            this.enabledisableflag = false
          }
        }
      }
      this.setCarouselImage(optionimagearr)
      resolve(null)    
    })
  }
  public productionresults:any
  async paginationrulesbaseprice(){
    this.orderpricechangeflag = this.orderpricechangeflag + 1
    let saveorderarray = []
    let widthvalue='' ;
    let dropvalue = ''
    let qtyvalue = '';
    let numericValue = '';
    let optionarray:any =[]
    let optionarraydual:any =[]
    let orderunitype = ''
    let calctestdata:any =[]
    let optlinkarray = []
    let blindopeningwidtharray:any=[]
    let widthfieldtypeid ='';   
    let dropfieldtypeid ='';
    let dummyarg = 3
    let fabncoldetails = {
      fabricid : '',
      fabriciddual : '',
      colorid : '',
      coloriddual : '',
      subfabricid : '',
      subcolorid : '',
    }
    this.forms[0].metaData.map((data:any,index:any)=>{
      if(data.fieldtypeid == 1){
        let joinvalue:any = ''
        if(this.inst.value[data.fieldid] && !data.blindswidth){
          joinvalue =  parseFloat(this.inst.value[data.fieldid])
        }
        if(data.blindswidth && !this.inst.value[data.fieldid]){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue = this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue
          }
        }
        if(this.inst.value[data.fieldid] && data.blindswidth){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue =  parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue)
          }
          else{
            joinvalue =  parseFloat(this.inst.value[data.fieldid])
          }
        }
        if(joinvalue){
          blindopeningwidtharray.push(joinvalue)
        }
      }
      if(data.optiondefault){
        let optdefault = data.optiondefault.toString().split(',')
        optlinkarray = []
        if(data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).length == 0){
          optlinkarray.push(data['valueid'])
        }
        else{
          data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).map((select:any)=>{optlinkarray.push(select.fieldoptionlinkid)})
        }
        if(data.fieldtypeid != 34){
          let valuesplit = data.optiondefault.toString().split(',')
          valuesplit.map((value:any)=>{
            let defaultoptionname =  data.optionsvalue.filter(o1 => o1.optionid == value)
            if(defaultoptionname.length > 0){
              calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
            }
            else{
              if(data.optiondefault && data['valueid']){
                calctestdata.push({optionvalue:parseFloat(data.optiondefault),fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
              }
            }
          })
        }
      }
      if(data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31){
        widthvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          if(isNaN(parseFloat(widthvalue))){
            widthvalue="0";
          }
          let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthvalue)
          widthvalue= widthvalue1;
        }  
        widthfieldtypeid = data.fieldtypeid
      }
      if(data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32){
        dropvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          if(isNaN(parseFloat(dropvalue))){
            dropvalue="0";
          }
          let dropvalue1:any = parseFloat(this.dropdecimalinches) +parseFloat(dropvalue)
          dropvalue= dropvalue1;
        } 
        dropfieldtypeid = data.fieldtypeid
      }
      if(data.fieldtypeid == 14){
        qtyvalue = this.inst.value[data.fieldid.toString()]
      }
      if(data.fieldtypeid == 13){
        if(data.optiondefault){
          if(this.category != 6){
          if(data.dualseq == 2){
            optionarraydual.push(data.optiondefault);
          }
          if(data.dualseq != 2){
            optionarray.push(data.optiondefault)
          }
        }else{
          if(data.multiseq > 1){
            optionarraydual.push({multiseq:data.multiseq,id:data.optiondefault});
          }
          if(data.multiseq <= 1){
            optionarray.push(data.optiondefault)
          }
        }
        }
      }
      if(data.fieldtypeid == 34){
        orderunitype = data.optiondefault
        if(data.optiondefault) { this.unittypevalue = (data.optionsvalue.filter(el => el.optionid == data.optiondefault))[0].optionname }
        else { this.unittypevalue = ''}
      }
      let ordervalue = ''
      let quantityarray = []
      let lengthArray = []
      if(data.optionsvalue.length > 0){
        data.optionsvalue.map((qty:any)=>{
          if( data.fieldtypeid != 33 ){
            if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.optionqty){
                  quantityarray.push(qty.optionqty)
                }
              }
            }
          }else{
             if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.qty){
                  quantityarray.push(qty.qty)
                  lengthArray.push(qty["length"])
                }
              }
            }
          }
          if(data.optiondefault && data['valueid']){
            if(quantityarray.length == 0){
              quantityarray.push(1)
            }
          }
        })
      }
      if(data.fieldtypeid == 34 || data.fieldtypeid == 4 || data.fieldtypeid == 13 || data.fieldtypeid == 17 || data.fieldtypeid == 30){
        if(this.inst.value[data.fieldid.toString()]){
          if(data.optionsvalue.length>0){
            ordervalue = data.optionsvalue.filter(el => el.optionid.toString() == this.inst.value[data.fieldid.toString()].toString())[0]?.optionname
          }
        }
      }
      else{
        ordervalue = this.inst.value[data.fieldid.toString()]
      }
      let format:any = {
        id: data.fieldid,
        labelname: data.fieldname,
        value: ordervalue ? [...new Set(ordervalue.toString().split(','))].join(',') : '',
        valueid: data?.optiondefault && optlinkarray ?  [...new Set(optlinkarray.toString().split(','))].join(',') : '',
        quantity: quantityarray.length > 0 ?  quantityarray.toString() : '',
        type: data.fieldtypeid,
        optionid: data.optiondefault ? data.optiondefault : '',
        fabricorcolor: data.fabricorcolor,
        labelnamecode : data.labelnamecode ? data.labelnamecode : '',
        issubfabric : data.issubfabric ? data.issubfabric : 0,
        fractionValue : data.fieldtypeid == 1 ? parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.find(el=>el.id == data.blindswidth)?.decimalvalue) : 0
      } 
      if(data.fieldtypeid == 33){
        format.length = lengthArray.toString()
      }
      if(data.fieldtypeid == 28){
        Object.assign(format,{numfrac:this.numfracvalue(data)})
      }

      if(data.editruleoverride==1){
        this.editruleoverridecurrent= 1;
        Object.assign(format,{editruleoverride:1})
      }else{
        this.editruleoverridecurrent= 0;
        Object.assign(format,{editruleoverride:0})
      }
      saveorderarray.push(format)

      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          fabncoldetails.colorid = data.optiondefault
        }
        else{
          if(data.fieldlevel == 2 && data.issubfabric != 1){
             if(data.fieldtypeid == 5 && data.dualseq == 2){
              fabncoldetails['coloriddual'] = data.optiondefault;
             } else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {
               saveorderarray.forEach(x => {  // multicurtain
                 if (x.id == data.fieldid) {
                   x['multiseq'] = data.multiseq;
                 }
               });
             } else{
                fabncoldetails.colorid = data.optiondefault;
              }
            }else if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
              fabncoldetails.subfabricid = data.optiondefault;
            }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
              fabncoldetails.subcolorid = data.optiondefault;
            }
          else { 
            if(dummyarg==1){
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = this.softfurningfabricid;
              }else{
                fabncoldetails.fabricid =  this.softfurningfabricid;
              }
            }
            else{
              if(dummyarg==2)
              {
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = '';
                }else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {
                  saveorderarray.forEach(x => {  // multicurtain
                    if (x.id == data.fieldid) {
                      x['multiseq'].delete;
                    }
                  });
                }else{
                  fabncoldetails.fabricid = "";
                }
              }
              else{
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = data.optiondefault;
              }else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {
                saveorderarray.forEach(x => {  // multicurtain
                  if (x.id == data.fieldid) {
                    x['multiseq'] = data.multiseq;
                  }
                });
              } else{
                fabncoldetails.fabricid = data.optiondefault;
              }
              }
            }
           }
        }
      }
    })
    let productionoverridarray = this.orderproductiondata.map((pro: any) => ({
      id: pro.fs_id,
      productionoveride: pro.productionoverrideeditflag,
      productioneditedvalue: pro.productionoverrideeditflag === 1 ? pro.pricevalue : ''
    }));
    let pricecalc:any = {
      vatpercentage: this.vatcalctoggle ?  this.returnvatvalue() : 0,
      blindopeningwidth: blindopeningwidtharray,
      recipeid: this.receipe,
      productid: this.selectedproductid,
      orderitemdata: saveorderarray,
      supplierid: 51,
      mode: optionarray.length > 0 ? 'pricetableprice' : '',
      width: widthvalue ? widthvalue : '',
      drop: dropvalue ? dropvalue : '',
      pricegroup: optionarray.length > 0 ? optionarray : '',
      pricegroupdual:this.category !=6 ? optionarraydual.length > 0 ? optionarraydual : '' : '',///for dual fabric
      pricegroupmulticurtain:this.category == 6 ?optionarraydual.length > 0 ? optionarraydual : []:[],///for multicurtain
      customertype: this.productser.customerType,
      optiondata: calctestdata,
      unittype: orderunitype,
      orderitemqty: qtyvalue,
      jobid: this.route.snapshot.paramMap.get('id'),
      customerid:this.productser.customerid ? this.productser.customerid : this.productser.existingcusID,
      rulemode : this.rulesvalue == 1 ? 0 : 1,
      productionoveridedata: productionoverridarray,
      widthfieldtypeid:widthfieldtypeid,
      dropfieldtypeid:dropfieldtypeid,
      overridetype: this.orderpricecalculation.overrideprice ? parseFloat(this.orderpricecalculation.overrideprice) : '',
      overrideprice: (this.orderpricecalculation.overridevalue !== null || this.orderpricecalculation.overridepricecalc !== '') ? this.orderpricecalculation.overridepricecalc : 0,
      ...fabncoldetails
    }
    // this.orderser.cancelruleRequests();
    await this.orderser.rulesbasecalc(pricecalc).toPromise().then(async (res: any) => {
      this.productionmaterialcostprice = res.productionmaterialcostprice
      this.productionmaterialnetprice = res.productionmaterialnetprice
      this.materialFormulaPrice = res.materialFormulaPrice
      this.productionmaterialnetpricewithdiscount = res.productionmaterialnetpricewithdiscount
      this.overridepricevalue = res.overridepricevalue
      this.getpricegroupprice = res?.getpricegroupprice
      this.rulesvalue = this.rulesvalue + 1
      this.productionresults = res.productionresults
      if(this.orderproductiondata.length > 0){
        if(res.productionresults.length >0){
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
          })
          res.productionresults.map((data:any)=>{
            if( data[0].battenstype != 0){ // implement battens LA-I567
            this.orderproductiondata.map((price:any)=>{
              if(data[0].fs_id == price.fs_id){
                if(data[0].bom == 0) {
                  this.forms[0].metaData.map((val:any)=>{
                    if(val.fieldtypeid!=0){
                      if(val.fieldtypeid == 29 || val.fieldtypeid == 18 || val.fieldtypeid == 11 || val.fieldtypeid == 14 || val.fieldtypeid == 1 || val.fieldtypeid == 12 || val.fieldtypeid == 6 || val.fieldtypeid == 7 || val.fieldtypeid == 8 || val.fieldtypeid == 9 || val.fieldtypeid == 10 || val.fieldtypeid == 31 || val.fieldtypeid == 32){
                        if(this.inst.get(val.fieldid.toString()).value){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          price.pricecalvalue = data[0].formulatype == 0 ? data[0].productionprice : data[0].getcostprice
                          price.costPrice = data[0].getcostprice
                          price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                          price.getpricesuppdisc=data[0].getpricesuppdisc
                        }
                      }
                      if(val.optiondefault){
                        let result = val.optionsvalue.filter(o1 => data.some(o2 => o1.optionid == o2.optionid))
                        if(result.length > 0){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          price.pricecalvalue = data[0].formulatype == 0 ? data[0].productionprice : data[0].getcostprice
                          price.costPrice = data[0].getcostprice
                          price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                          price.getpricesuppdisc=data[0].getpricesuppdisc
                      }
                      }
                    }
                  })
                }
                else if(data[0].bom == 1) {
                  price.pricevalue = data[0].formularesult
                  price.showhideflag = data[0].formularesult ? 1 : 0
                  price.unittype = data[0].jobunittype
                  if(data[0].formulatype == 0){
                    price.pricecalvalue = data[0].productionprice
                    price.costPrice = data[0].productionprice
                    price.sellingprice=data[0].productionnetprice?data[0].productionnetprice:"-"

                  }
                  else{
                    price.pricecalvalue = '-'
                    price.costPrice = '-'
                  }
                }
              }
            })
          }else{
            let battendObj = data[0]
            battendObj.pricevalue = data[0].formularesult,
            battendObj.showhideflag = data[0].formularesult ? 1 : 0
            battendObj.unittype = data[0].jobunittype
            battendObj.pricecalvalue = data[0].productionprice
            battendObj.costPrice = data[0].productionprice
            battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
            battendObj.battens = true
            battendObj.fs_displayonproduction = 1
            this.orderproductiondata.push(battendObj)
          }
          })
        }
        else{
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
          })
        }
      }else {
        if(res.productionresults.length >0){
          let getBattens =  res.productionresults[0].filter( x => x.battenstype == 0 )
          if(getBattens.length > 0){
            res.productionresults.map((data:any)=>{
              let battendObj = data[0]
                battendObj.pricevalue = data[0].formularesult,
                battendObj.showhideflag = data[0].formularesult ? 1 : 0
                battendObj.unittype = data[0].jobunittype
                battendObj.pricecalvalue = data[0].productionprice
                battendObj.costPrice = data[0].productionprice
                battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
                battendObj.battens = true
                battendObj.fs_displayonproduction = 1
                this.orderproductiondata.push(battendObj)
            })
          }
        }
      }
      this.forms[0].metaData.map((v:any,index:any)=>{
        if(res.ruleresults.length > 0){
          res.ruleresults.map((price:any,i:any)=>{
            if(price[v.fieldid]){
              let pricechangedata = price[v.fieldid]
              if(v.fieldtypeid == 4 || v.fieldtypeid == 30 || v.fieldtypeid == 29  || v.fieldtypeid == 11 || v.fieldtypeid == 14  || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    // this.getoptionvalue(v,res.ruleresults)
                  } else {
                    this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                  }
                }
              }else if(v.fieldtypeid == 18 || v.fieldtypeid == 1){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                  }
                }
              }
              else if(v.fieldtypeid == 13 || v.fieldtypeid == 17){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    // this.getoptionvalue(v,res.ruleresults)
                    if(this.category != 6){
                    if(v.fieldtypeid == 13 && v.dualseq != 2){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.dualseq == 2){
                      this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }else{
                    if(v.fieldtypeid == 13 && v.multiseq <= 1){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.multiseq > 1){
                      let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                      if(unique !== -1){
                        this.selectproduct_typeiddual[unique].id = pricechangedata[0].optionid;
                      }else{
                        this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:pricechangedata[0].optionid});
                      }
                      // this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }
                    v.optiondefault = pricechangedata[0].optionid.toString()
                  }
                  else{
                    if(!pricechangedata[0].optionid || pricechangedata[0].optionid == null){
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }else if(this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor==2){
                if(!v.optiondefault){
                  if(pricechangedata.length > 0){
                    if(pricechangedata[0].optionvalue && pricechangedata[0].optionid){
                      if(!this.getchangefield.includes(v.fieldid.toString())){
                        this.getchangefield.push(v.fieldid.toString())
                      }
                      if(this.checkoptionexistence(v.optionsvalue,pricechangedata[0].optionid)){
                        this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                        v.optiondefault = pricechangedata[0].optionid.toString()
                        this.getoptionvalue(v,res.ruleresults)
                      }
                    }
                  }
                }
              }else if(this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor==1 && this.editruleoverridecurrent==1){
                return; 
              }
              else {
                if (pricechangedata.length > 0) {
                  const previousvalue = this.inst.value[v?.fieldid] ? this.inst.value[v?.fieldid].toString().split(',') : ''
                  const currentvalue = pricechangedata[0]?.optionvalue?.toString().split(',')
                  if (pricechangedata[0].optionid) {
                    if (previousvalue?.length > 0 && currentvalue?.length > 0) {
                      const final = previousvalue.filter(function (item) {
                        return !currentvalue.includes(item);
                      })
                      if (final.length > 0) {
                        this.rulebasefieldaddremove(pricechangedata, v);
                      }
                    }
                    this.inst.get(v?.fieldid.toString()).setValue(pricechangedata[0]?.optionvalue);
                    v.optiondefault = pricechangedata[0]?.optionid?.toString();
                    v['valueid'] = pricechangedata[0]?.valueid?.toString();
                    this.getoptionvalue(v, res?.ruleresults);
                  }
                  else {
                    if (!pricechangedata[0].optionid || pricechangedata[0].optionid == null) {
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
            }
          })
          if(v.optiondefault && v.field_has_sub_option == 1 && v.subchild.length == 0){
            if(v.optionsvalue.length > 0){
              if(v.optionsvalue.filter(el=>el.optionid.toString() == v.optiondefault).length > 0){
                if(v.optionsvalue.filter(el=>el.optionid.toString() == v.optiondefault)[0].subdatacount > 0){
                  let subgridarray = []
                  subgridarray.push(v)
                  this.rulesdefaultorderitem(subgridarray)
                }
              }
            }
          }
        }
      })
      if(res?.stockavailability?.length){
        this.checkStockAvailability(res.stockavailability)
      }
    })
    if(this.priceCalculation){
      this.saveorderflag = this.rulesBaseDisableSave = this.saveflag = this.isLoading = false;
    }
    if(this.rulesvalue <= 2 && (!this.priceCalculation || this.ruleModeOpt)){
      if(this.formulacount){
        this.ruleModeOpt = false;
        await this.paginationrulesbaseprice()
        return
      }
    }
    return this.ordercalc()
  }
  currencySymbole;
  currencyPosition:any
  ngOnInit(): void {
    this.keepFlag = false
    this.currencySymbole = this.Auth.decryptString( this.storage.getCookie("currency_symbol"))
    let position:any = this.storage.getCookie("currency_position")
    this.currencyPosition = position == 1 ? true : false
    this.agGridOptions = {
      enableCellTextSelection: true,
      suppressLoadingOverlay: false,
      stopEditingWhenCellsLoseFocus: true,
      suppressDragLeaveHidesColumns: true,
      paginationPageSize: 50,
      suppressMenuHide: true,
      applyColumnDefOrder: true,
      rowSelection: 'multiple',
      cacheBlockSize: 50,
      maxBlocksInCache: 10,
      rowModelType: 'serverSide',
      serverSideStoreType:"partial",
      serversideInfiniteScroll: true,
      pagination: false,
      cacheOverflowSize: 2,
      angularCompileHeaders: true,
      blockLoadDebounceMillis: 1000,
      maxConcurrentDatasourceRequests: 1,
      onCellEditingStarted: this.onCellEditingStarted.bind(this),
    }
//pagination code end
    this.rowHeight=this.commonsetup.rowHeight
    this.headerHeight=this.commonsetup.headerHeight
    this.floatingFiltersHeight=this.commonsetup.floatingFiltersHeight
    this.formatdate=this.storage.getCookie('Globaldate')
    if(this.formatdate=='DD-MM-YYYY'){
      this.formatdate="dd-MM-yyyy"
      this.Displayformat = "dd-MM-yyyy";
   }else{
    this.formatdate="MM-dd-yyyy"
    this.Displayformat = "MM-dd-yyyy";
   }
   if(this.route.snapshot.queryParams.copyproduct)
      this.isDisabled = true;
    else
      this.isDisabled = false;
    this.submenu_suppressPaginationPanel = true;
    this.submenu_pagination = false;

    $('#sampleModal').on('shown.bs.modal', () => {
      setTimeout(() => {
        // this.saveorderflag = true
        var createdate = document.querySelector('#createdate input');
        var customeventkey = document.querySelector(".customeventkey");
        var proddate = document.querySelector('#proddate input');
        proddate!=null && proddate.setAttribute('tabindex', '-1');
        createdate!=null && createdate.setAttribute('tabindex', '-1');
        let cancelbtn = document.querySelector(".forhighupdte .jobbtn2");
         let savebtn = document.querySelector('.forhighupdte .jobbtn1');
         let prodcutStaus = document.querySelector('.marketmulti1');
        prodcutStaus.addEventListener("keydown",(event:any)=>{
          if (event.key === 'Tab') {
            setTimeout(()=> {
              $('.jobbtn2').focus()
            },0)
          }
        })
        customeventkey.addEventListener("keydown",(event:any)=>{
          if(event.shiftKey && event.keyCode == 9) { 
           setTimeout(()=>{
                $(savebtn?.nextElementSibling).focus()
            },50)
        }
        })
        cancelbtn?.addEventListener("keydown",(event:any)=>{
          // alert()
         if (event.key === 'Tab') {
          
           setTimeout(()=> {
            let getIndex = !this.onlineflag ? this.forms[0].metaData.findIndex(x => x.showfieldonjob) : this.forms[0].metaData.findIndex(x => x.showfieldonshowFieldOnCustomerPortaljob)
            let fieldType = this.forms[0].metaData[getIndex].fieldtypeid;
            let isComboField = [2, 5, 19, 20, 21, 22,33].includes(fieldType) || (fieldType === 3 && this.edishowhideField(this.forms[0].metaData[getIndex]));
            if(isComboField ){
              $('#comboGrid'+getIndex).combogrid('textbox').focus()
            }else{
              $('#subgrid'+getIndex).focus()
            }
           },100)
         }
         else if(event.key ==='ArrowLeft')
         {
          setTimeout(()=>{
           $(cancelbtn?.previousElementSibling).focus()
          },100)
         }
        })
        savebtn?.addEventListener("keydown",(event:any)=>{
          // alert()
          if(event.key === 'ArrowRight')
          {
            setTimeout(()=>{
                $(savebtn?.nextElementSibling).focus()
            },100)
          }
        })

      }, 300);
    });
    this.envImageUrl = environment.imageUrl
  }
 
  ngOnDestroy() {
    this.editorderfield.unsubscribe()
    this.orderview.unsubscribe()
    this.orderwidthdrop.unsubscribe()
    this.changeRuleTime.unsubscribe()
    this.onlineportalendpricecal.unsubscribe()
    this.fabricSubscription.unsubscribe();  
    this.colorsubscription.unsubscribe();  
    this.optionpopupsubscription.unsubscribe();
    this.optiongridsubscription.unsubscribe();
    this.supplierSaveSubscription.unsubscribe();
    this.assignPricePopup.unsubscribe();
    this.edit_fabricCloseSubscriptionField.unsubscribe();
    this.edit_optionlistsubscription.unsubscribe();
    this.edit_loadColorSLATS.unsubscribe();
    this.edit_colorlistsubscription.unsubscribe();
    this.edit_saveColorsubscription.unsubscribe();
    this.maxDiscountCalSubscription.unsubscribe();
  }
  loadViewd = false
  ngAfterViewInit(): void {
    this.loadViewd = true
   this.commonfilter.globalsearchfn()
  }
  currencysetPosition(pVal:any){
    if(pVal != '-' && pVal != '' || pVal == '0')
      {
        if(this.currencydetail?.bacs){
          return pVal+' '+this.currencySymbole; 
        }else{
         return this.currencySymbole +' '+ pVal; 
        }
      }else{
       return pVal != "" ? pVal : "-";
      }
    }
  ///price fields based show_hide
  pricefieldsshow_hide(par:any){
    if(this.ispriceenable == '1'){
      let conpar:any = par.toLowerCase();
      if(conpar != 'override selection'){
      let checkdata = this.pricefields?.standardpricefield?.some(obj => obj.name.toLowerCase() == conpar);
      return checkdata ?? false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
  validationdata(event,fieldtypeid=0,unittypename='',selectedfraction=0){ 
    // this.saveorderflag = true
    if((fieldtypeid== 11 || fieldtypeid ==12  || fieldtypeid == 7 || fieldtypeid == 8 || fieldtypeid == 9 || fieldtypeid == 10 || fieldtypeid == 31 || fieldtypeid == 32 || fieldtypeid == 28) && unittypename=='Inches' && selectedfraction!=3){
      this.validation.numberonlyvalidation(event,event.target.value)
    }else {
    this.validation.numberdecimalvalidation(event,event.target.value)
    }
  }
  Pastedata(event,fieldtypeid=0,unittypename='',selectedfraction=0){
    if((fieldtypeid== 11 || fieldtypeid ==12  || fieldtypeid == 7 || fieldtypeid == 8 || fieldtypeid == 9 || fieldtypeid == 10 || fieldtypeid == 31 || fieldtypeid == 32 || fieldtypeid == 28) && unittypename=='Inches' && selectedfraction!=3){
      this.validation.numberonlyvalidation(event,event.target.value)
    }else
    this.validation.numberdecimalpastevalidation(event,event.target.value)
  }
  numberPastedata(event){
    this.validation.numberpastevalidation(event,event.target.value)
  }
  numberonlyvalidationdata(event){ 
    this.validation.numberonlyvalidation(event,event.target.value)
  }
// for tab and mobile validation
tabkeyupvalidate(event){
    if ( /[^0-9]+/.test(event.target.value) ){
      event.target.value = event.target.value.replace(/[^0-9]*/g,"")
   }
}
tabvalidationdata(event,fieldtypeid=0,unittypename='',selectedfraction=0){ 
  if((fieldtypeid== 11 || fieldtypeid ==12  || fieldtypeid == 7 || fieldtypeid == 8 || fieldtypeid == 9 || fieldtypeid == 10 || fieldtypeid == 31 || fieldtypeid == 32 || fieldtypeid == 28) && unittypename=='Inches' && selectedfraction!=3){
    this.validation.tabnumberonlyvalidation(event,event.target.value)
  }else 
  this.validation.tabnumberdecimalvalidation(event,event.target.value)
}
tabnumberonlyvalidationdata(event){ 
  this.validation.tabnumberonlyvalidation(event,event.target.value)
}

  suppliereset(event,fieldname){
   if(fieldname=='Supplier'){
    this.loadSupplierList();
   }
  }
  tabvalidate = function(e) {
    // alert('hi')
    var t = e.value;
    e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
  }
  loadSupplierList(){ 
    this.orderser.getMainSuppliers().subscribe((res:any)=>{
      this.valueForSupplier = res.result;
      this.cd.markForCheck();
    })
  }
  
  productFormResetFn(){
    this.globaleditPopup = false;
    this.ngxModalService.closeModal('globalProductModal')
    $('.middlecol ').removeClass('righthiiden')
    $('.slidercontrol').removeClass('sidecontroloverwrite')
    $('#collapsethree').removeClass('show')
    $("#ordergrid").scrollTop(0)
     this.removePanel()
    this.orderchangeflag = false
    let order_id = this.route.snapshot.paramMap.get('id');
    if(this.route.snapshot.queryParams.copyproduct)
      order_id = this.route.snapshot.queryParams.copyproduct;
    this.orderser.getorderlistdata(order_id,this.pivotId).subscribe((res: any) => {
      let data = { griddata: res.data,ordercalc: this.orderpricecalculation,mode:'cancel' }
      this.childEvent.emit(data)
      this.orderauth.collapseOrderGridFlag = false
    })
  }

  
  
 editFabric_optionColumn(par:any){
  let columdata:any = [
  //   {
  //   headerName: "",
  //   field: 'Subject',
  //   checkboxSelection: true,
  //   //headerCheckboxSelection: true,
  //   headerCheckboxSelectionFilteredOnly: true,
  //   headerComponentFramework: ContackserverheadercheckboxComponent,
  //   suppressMenu: true,
  //   suppressSorting: true,
  //   filter: false,
  //   minWidth: 40,
  //   maxWidth: 40,
  //   pinned: 'left'
  // },
  {
    floatingFilter: false,
    filter: 'FieldchagesComponent',
    menuTabs: ['filterMenuTab'],
    icons: {
      menu: '<i class="fa fa-ellipsis-h plusgird"></i>',
    },
    sortable: false,
    editable: false,
    suppressMenu:false,
    minWidth: 40,
    maxWidth: 40,
    suppressColumnsToolPanel: true,
    pinned: 'right'
  },  
]
Object.entries(par).forEach(([key, value], index) => {
  if(value != 'Option Id' && value !='pricegroupid'){
  columdata.splice(index, 0,{
    field:key,
    headerName: value,
    minWidth: 150,
    cellRenderer:this.fabricIds.includes(this.option_fabric_editfielddata?.fieldtypeid) ? this.createHyperLinkFabric.bind(this) : this.createHyperLink.bind(this),
  },
);
}
});
this.option_fabric_gridapi?.setColumnDefs(columdata)
 }
 async editfabricoption(event,index,field){
  // this.selectioncategory = field.fieldtypeid;
  this.option_fabric_index = index;
  this.option_fabric_editfielddata = field;
  this.option_fabric_indexflag = true;
  this.addCustomeBattenFlag = false;
  this.ngxModalService.openModal(this.fabricEditModal, 'fabricEditModal', 'modal-lg');
   this.ngxModalService.checkGridReady.pipe(take(1)).subscribe(() => {
     setTimeout(() => {
       this.page = 1;
       this.option_fabric_columnapi?.applyColumnState({
         defaultState: { sort: null },
       });
       this.option_fabric_gridapi.setFilterModel(null);
       this.option_fabric_gridapi.refreshHeader();
       this.option_fabric_gridapi.deselectAll();
       this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(index, '', []));
     }, 100)
   });
  return
  
 }
exitingOptionPopupOpen(){
  this.commonapiService.productId=this.selectedproductid;
  this.popupService.fieldtypeid=this.option_fabric_editfielddata.fieldtypeid;
  this.popupService.fieldlevel=this.option_fabric_editfielddata.fieldlevel;

  if(this.option_fabric_editfielddata.fieldtypeid == 22 && this.selectioncategory == 6){ 
    this.popupService.open_field_grid = true
    this.commonapiService.categoryId = this.selectioncategory
    this.popupService.field_id = this.option_fabric_editfielddata.fieldid
    this.popupService.linkedPriceGroupId = this.option_fabric_editfielddata.linktopricegroup
  }
  let data = {
    level: this.option_fabric_editfielddata.fieldlevel,
    optionsIds: this.option_fabric_editfielddata.linkarray,
    fieldtype : this.option_fabric_editfielddata.fieldtypeid,
    fieldid : this.option_fabric_editfielddata.fieldid,
    customtype : this.option_fabric_editfielddata.customtype,
    flag : false,
    fabric:true,
    parentId: this.option_fabric_editfielddata.mainParent??this.option_fabric_editfielddata.masterparentfieldid//masterparentfieldid
  }
  if(this.option_fabric_editfielddata.fabricorcolor == '2'){
    let fabricoptionid:any;
    this.forms[0].metaData.map((field:any)=>{
      if(this.fabricIds.includes(field.fieldtypeid)){
        if(field.fieldtypeid != 20){
          if(field.fieldlevel == 1){
             fabricoptionid = field.optiondefault;
             this.productapi.fabricId = fabricoptionid;
          }
        }
      }
    });
    // if(this.option_fabric_editfielddata.fieldtypeid == '21'){
    //   Object.assign(data,{openColorlist:'color'})
    // }else{
      Object.assign(data,{openColorlist:'color'})
      Object.assign(data,{fb_id:this.option_fabric_editfielddata.subfieldlinkid})
    // }
  this.popupService.openOptionlistModal(data)
  }else{
    this.popupService.openOptionlistModal(data)
  }
}

  async materialpopup(){  
    if( !this.onOpenPanel){
      return false 
    } 
    this.priceTableArrayList  = [];
    this.changesflag = false; 
    let commonfabricarray: any = [];  
    this.customerchecked=false;
   await  this.orderser.getFabricsLayout('22').toPromise().then((res: any) => { 
      this.commonfabricarray = JSON.parse(res.result.layoutdetails.ld_customoizedarray);
      this.cd.markForCheck();
     }).catch(err => {});
 

    this.commonfabricarray.map((element, i) => {
      element.weeklist.map((data) => {
        if(data.optionsvalue)
          {
            if (!Array.isArray(data.optionsvalue)) {

              let edata = JSON.parse(data.optionsvalue)
              data.optionsvalue = edata
            }
          }

          
          if(data.name == "Unit Type")
          {
            this.untitypeid=data.id;
             this.unittypeval=data.optionsvalue;
             data.optionsvalue.map((val:any,i:any)=>{
              if(val.defaultid==1){
                this.unittypecurrent=val.id
                }
            }) 
          }
          if(data.idname == "material_unitcost")
            { 
              data['unittype_id'] = this.untitypeid;  
            }
          
          if(data.name == "Price Groups")
          { 
            data.optionsvalue= this.pricegrouparray;
            data.required = 1;  
          }

          if(data.name == "Supplier")
          { 
            this.loadSupplierList();
          //  this.valueForSupplier=data.optionsvalue; 
          }


          if(data.name == "Fabric Type")
          {
            var aaa;
            data.optionsvalue.map((val:any,i:any)=>{
              if(val.id==1){
                aaa=val.id
                }
            })
            data.value = aaa;
          }
          if(data.name == "Source")
          {
            var aaa;
            data.optionsvalue.map((val:any,i:any)=>{
              if(val.setdefault==1){
                aaa=val.id
                }
            })
            data.value = aaa;
          }
      });
    })
    this.dynamicForms= this.dynamicform.toFormGroup(this.commonfabricarray);
    this.customizedArray = this.commonfabricarray; 
    const data = this.commonfabricarray[0]?.weeklist;
        // Define the new order using the `idname`
        const desiredOrder = [
          "sf_fabricname",
          "sf_colorname",
          "sf_patternrepeat",
          "material_unitcost",
          "material_unittype",
          "sf_fabricrollwidth",
          "sf_supplier",
          "list_pricegroups",
          "material_customernotes",
          "sf_fabrictype",
          "material_weighted"
        ];

        // Reorder the array
        const reorderedData = desiredOrder
          .map(id => data?.find(item => item.idname == id))
          .filter(Boolean); // Removes undefined if any idname doesn't match
        if (reorderedData.length > 0) {
          this.customizedArray[0].weeklist = reorderedData;
        }
    if ($('[id=materialsoftfurnishing-modal]').length > 1) {
      $('body > #materialsoftfurnishing-modal').remove();
    }

    $('#materialsoftfurnishing-modal').appendTo('body').modal('show'); 
    $("#materialsoftfurnishing-modal").on('shown.bs.modal', function (e) {
      $(document).off('focusin.modal'); 
      $(this).off('shown.bs.modal');
    });

    setTimeout(() => {
      this.commonfilter.dyanmicfocsed('.appdynamicfabric app-dynamic-field')
    }, 100); 
    this.dynamicForms.valueChanges.subscribe(x => {
      this.changesflag = true; 
  })
  } 


  onCheckboxChange(event){
    this.customerchecked= event.target.value; 
  }

  onSelectFile(event,idname,formindex,rowindex) {
    if (event) {
      if (event.target.files && event.target.files[0]) {

        const file = event.target.files && event.target.files[0]
        if (file) {
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (event) => {
            // this.url = (<FileReader>event.target).result;
            // this.customizedArray[formindex].weeklist[rowindex].url=this.url
            // this.imagearraydata.push({url:this.url,name:idname})
            // this.uploadflag=false
          }
          if (!this.imagedataarray.includes(idname)) this.imagedataarray.push(idname)
            this.imageSrc[idname] = file;
        }
      }
    } else {
      this.imageSrc[idname] = "";
    }
  }
  onItemChange(event){
    this.unittypecurrent= event.target.value;
  }
  submitHandlersoft() {
    this.dynamicForms.markAllAsTouched(); 
    this.dynamicForms.updateValueAndValidity(); 
    if (this.dynamicForms.valid) {
      // let formValue = this.dynamicForms.value;
      let formValue = this.dynamicForms.getRawValue();
      let totalArray = {};
      for (const [key, value] of Object.entries(formValue)) {
        for (let [objKey, objValue] of Object.entries(value)) {
          objValue = objValue != null && objValue != undefined ? objValue : "";
          if (typeof objValue == "object" && typeof objValue?.getMonth !== 'function') {
            objValue = objValue.map((val) => val.id).join(',');
          }
          totalArray[objKey] = objValue;
        }
      }
      totalArray['productid'] = this.selectedproductid;
      this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ; 
      if(this.customerchecked)
      totalArray['contactid'] =  this.currentcontactid; 

      totalArray['recipeid'] =this.receipe;
      totalArray['type'] = 'jobsave';

      let data = {
        materialdata: totalArray,         
      }    
      this.orderser.softfurningmaterialadd(data).subscribe((res: any) => {
       
        let edata= res.result;
        if(edata.pricegroupval){
         this.fabricarraypush={}; 
        this.fabricarraypush['fieldoptionlinkid'] = edata.fieldoptionlinkid;
        this.fabricarraypush['optionid'] = edata.optionid;
        this.fabricarraypush['optionname'] = edata.optionname;
        this.fabricarraypush['optioncode'] = edata.optioncode;
        this.fabricarraypush['optionquantity'] = edata.optionquantity; 
    this.resetform(this.receipe,this.currentcontactid,this.selectedproductid,edata);
     if(this.forms[0].metaData[this.sofyfurningindex].optiondefault==edata.optionid){
      this.selectedcompindex =this.sofyfurningindex; 
      this.softfurningfabricid=edata.optionid;
      this.rowSelection='single';
      this.softfurningfabricname=edata.optionname;
      this.selectedcompindex=this.sofyfurningindex;
      this.selectedcompsetcontrol=this.forms[0].metaData[this.sofyfurningindex].fieldid;
      this.seletarray[0]=edata;
      this.exampleModalbk(1);//colour refresh
    } 
  }
  this.toast.successToast("Material added Successfully")
  $('#materialsoftfurnishing-modal').modal('hide');    
  $('#materialPopupButton').focus()
this.cd.markForCheck();
}, err => {
        if (err.status == 403)
          this.toast.errorToast(err.error.message);
      }); 
    }
    else{
      return;
    }
  }

  resetform(receipe,currentcontactid,selectedproductid,edata){
    this.orderser.getorderdefaultdata(receipe,1,currentcontactid, selectedproductid).subscribe((res:any)=>{
      let dataObject = res[0].data;
      this.noSupplierbasedflag = res[0].supplierbasedproduct;
      this.isdualproduct = res[0].isdualproduct;
      let ind = dataObject.findIndex(v => v.fieldtypeid == 22 )
      if( ind != -1 ){
        this.forms[0].metaData[this.sofyfurningindex].optionsvalue=dataObject[ind].optionsvalue
        this.forms[0].metaData[this.sofyfurningindex].optionsbackup=dataObject[ind].optionsbackup
        this.selectedcompindex =this.sofyfurningindex; 
        this.softfurningfabricid=edata.optionid;
        this.rowSelection='single';
        this.softfurningfabricname=edata.optionname;
        this.pricegroupcurrent=this.forms[0].metaData[this.pricegroupindex].optiondefault;
        this.selectedcompindex=this.sofyfurningindex;
        this.suppliercurrent=this.forms[0].metaData[this.supplierindex].optiondefault;
        this.selectedcompsetcontrol=this.forms[0].metaData[this.sofyfurningindex].fieldid;
        this.seletarray[0]=edata;
        this.exampleModalbk(2);//fabric refresh 
      }
      this.cd.markForCheck();
    });
  }

  
  unittypefractionlist(arg,tempselect='temp'){ 
    if(arg==0){
    this.widthdropfraction.width= 0;
    this.widthdropfraction.drop=0;
   }
   this.orderser.getfractionlist(this.selectedproductid,arg,tempselect).subscribe((res: any) => {
     this.Measurementarray=res.result.inchfraction
       if(arg==0){
       this.unittypevaluehideshow=res.result.fractioname; 
       this.inchfractionselected=res.result.inchfractionselected 
       } 
       if(tempselect!='temp'){
         this.unittypevaluehideshow=res.result.fractioname; 
         this.inchfractionselected=res.result.inchfractionselected 
       }
       this.cd.markForCheck();
   }); 
 }
 
//order form grid
  onGridReady(params:any) {
    params.api.showLoadingOverlay()
    this.orderparams = params
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }
  productmanuallist(e){
    this.orderser.getproductmanuallist(e).subscribe((res: any) => {
      this.currentIndex = 0
      this.productlist = res[0].data.map(item=> {
        let filetype= item.pm_attachmentfile.split('.').pop();
         return{filetype,...item}
       })
    })
  }
//create order form
  createForm(e) { 
    this.widthdecimalinches = 0
    this.dropdecimalinches = 0
    this.Measurementarray = []
    this.datevalidation = ''
    this.unittypedata = ''
    this.ordercalcflag = false
    this.orderpricevalidation = {costprice:'',netprice:'',grossprice:''}
    this.prostatus = ''
    this.prostatusselectarray = []
    this.unittypefractionlist(0);
    this.orderser.productstatus(e).subscribe((res: any) => {
      this.productstatusarray = res.data.productionstatuslist
      // this.prostatussinglemultipleflag = res.data.productstatusselectiontype
      this.prostatussinglemultipleflag = "2" // set always single select for operation LA-I297  // set always Multi select for  LA-I349 Factory setup
      this.cd.markForCheck();
    })
 this.productmanuallist(e)
    this.orderpricecalculation.costpricetoggle = false
    this.costpriceflag = false
    this.productstatusselectedindex = 0
    this.orderchangeflag = false
    this.validationerrmsg = ""
    this.validationflag = false
    this.widthcalac = []
    this.dropcalac = []
    this.orderpricecalculation = {
      createdate: new Date(),
      productiondate: new Date(),
      costpricetoggle: false,
      totalcost: '',
      overrideprice: 1,
      overridepricecalc: '',
      netprice: '',
      vat: this.vatvalue,
      totalgross:'',
      optionprice: '',
      pricegroupprice: '',
      overridevalue:''
    }
    this.lastDueDate = this.orderpricecalculation.productiondate
    this.addeditmode = 'add'
    if(!this.receipedisabledflag){
      this.orderid = ''
    }
    this.rulescount = ''
    this.formulacount = ''
    // $('#sampleModal').modal('show')
    // $('.middlecol ').removeClass('righthiiden')
    // $('.slidercontrol').removeClass('sidecontroloverwrite')
    this.forms = []
    this.imageForProColOpt.optionsimages = []
    this.imageForProColOpt.splitoptionsimages = [];
    this.colorimageurl='';
    this.productarr = this.productser.orderproarray
    this.productarr.map((res:any)=>{
      if(res.id == e){
        if(this.receipedisabledflag){
          this.selectionProductFieldName = 'Global Edit - ' + res.label
        }
        else{
          this.selectionProductFieldName = res.label + ' Info'
        }
        this.selectioncategory = res.category 
      }
    })
    this.productstatusflag = true
    this.selectedproduct = e
    this.selectedproductid = e,
    this.selectproduct_typeid='';
    this.selectproduct_typeiddual=[];
    if(this.selectioncategory==6){ 
    this.orderser.getPricegrouplist(this.selectedproductid).toPromise().then((res: any) => { 
     let edata= res.result;
          
     this.pricegrouparray =edata;
    });
  }
    
    this.orderser.getreceipelist(e).subscribe((res: any) => {
      this.priceCalculation = res[0].priceCalculation === 0 ? true : false;
      // this.orderimageurl = res?.[0]?.imageurl ?  this.envImageUrl+res[0].imageurl :  'assets/no-image.jpg'
      this.orderimageurl = res[0]?.imageurl ? this.envImageUrl+res[0].imageurl : '';
      this.backgroundimageurl = res[0]?.backgroundimageurl ? this.envImageUrl+res[0].backgroundimageurl : '';
      this.frameimageurl = res[0]?.frameimageurl ? this.envImageUrl+res[0].frameimageurl : '';
      this.backgroundimageurl = (this.backgroundimageurl == '' && this.frameimageurl == '' && this.orderimageurl == '') ?  'assets/noimage.png' : this.backgroundimageurl;
      
      // $('.prdimg').css('background-image', 'url(' + '"' + this.orderimageurl + '"' + ')');
      $('.prdimg').css('background-image', 'url(' + '"' + this.backgroundimageurl + '"' + ')');
      this.receipelistArr = res[0].data
      if(this.receipelistArr.length > 0){
        if(!this.receipedisabledflag){
          const found = this.receipelistArr.find(el => el.default === 1)
          if(found) {
            this.receipe = found.id
            this.receipename = found.recipename
            if(!this.receipedisabledflag){
              this.rulescount = found.rulescount
              this.formulacount = found.formulacount
            }
            else{
              this.rulescount = 0
              this.formulacount = 0
            }
          }
          else{
            this.receipe = this.receipelistArr[0].id
            this.receipename = this.receipelistArr[0].recipename
            if(!this.receipedisabledflag){
              this.rulescount = this.receipelistArr[0].rulescount
              this.formulacount = this.receipelistArr[0].formulacount
            }
            else{
              this.rulescount = 0
              this.formulacount = 0
            }
          }
        }
        this.selectrecipe()
      }
      this.cd.markForCheck();
    })
  }


//choose receipe
firstLoad = false
  selectrecipe(isFromSelectReceipe?){
    this.orderchangeflag = false
    this.oldorderpricecalculation.totalgross = '0.00'
    this.oldorderpricecalculation.vat = '0.00'
    this.oldorderpricecalculation.netprice = '0.00'
    this.orderpricecalculation.totalcost = 0.00
    this.subrulesvalue = 0
    this.costpriceflag = false
    this.ordermode = 'add'
    this.orderlength = 10
    this.saveFlag = false;
    const found = this.receipelistArr.find(el => el.id == this.receipe)
    let globflag = (this.globaleditPopup)?this.globaleditPopup:'';
    this.receipename = found.recipename
    if(!this.receipedisabledflag){
      this.rulescount = found.rulescount
      this.formulacount = found.formulacount
    }
    else{
      this.rulescount = 0
      this.formulacount = 0
    }
    this.selectproduct_typeid=0;
    this.selectproduct_typeiddual=[];
     let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
    let productid = { jobid: this.route.snapshot.paramMap.get('id') }
    let vat_data = {
      productid:this.selectedproductid,
      jobid: this.route.snapshot.paramMap.get('id'),
      organisation:this.organisation_id,
      zipcode:this.zip_code
    };
    this.orderser.getvatvalue('orderitem',vat_data).subscribe((res:any)=>{
      this.showtaxjobitem = res.showtaxjobitem
      this.vatcalctoggle = res.vatonoff
      this.vatarray = res.taxlist
      this.ordervattype = res.vat_type
      this.productMaxSqArea = res.productMaxSqArea;
      this.enableMaxSqAreaOnlineOrder = res.enableMaxSqAreaOnlineOrder;
      this.maxSqAreaFlagCheck = true;
      let getvalue = ''
      if(res.vatonoff == 0){
        getvalue = res.taxlist[0].value
      }
      this.vatinputboxvalue = getvalue ? getvalue : res.data
      this.vatvalue = res.data
      this.vat_type = res.vat_type
      this.defaultsalestaxlabel = res.defaultsalestaxlabel
      this.cd.markForCheck();
     })
     this.unittypefractionlist(0);
    this.orderser.getorderdefaultdata(this.receipe,1,contactid,productid).subscribe(async (res:any)=>{
      this.category= this.productarr.filter((data:any) => data.id == this.selectedproductid)[0]["category"]
      if(this.receipedisabledflag){
        res[0].data.map((order:any)=>{
          order.mandatory = 0
          if(order.value){
            order.value = ''
          }
          if(order.optiondefault){
            order.optiondefault =  ''
            if(order.subchild.length > 0){
              order.subchild = []
            }
          }
        })
      }
      this.staticArrayData = res[0].static_headers
      this.orderpricearray = res[0].orderitemoverride_nested_dropdowns;
      this.selectedId = this.orderpricearray[0]?.id;
      let onlineOrderFormPriceLIST = res[0]?.orderitemoverride
      onlineOrderFormPriceLIST?.map((typeres:any)=>{
        if(typeres?.primaryid==1){
          typeres.displayname = 'Override Price'
          typeres.label = 'Override Price'
          typeres.name = 'Override Price'
        }
      })
      this.onlineOverrideTypeARRAY = onlineOrderFormPriceLIST
      this.noSupplierbasedflag = res[0].supplierbasedproduct;
      this.isdualproduct = res[0].isdualproduct;
      this.orderpricearray.map((res:any, i)=>{
        if (this.ispriceenable == 1 && !this.onlineflag) {
          if (i == 0) {
            this.orderpricecalculation.overrideprice = res.primaryid
            this.selectedNameForOverridePrice = res.name
            this.selectedId = res.id
          }
        } else {
          if(res.default==1){
            this.orderpricecalculation.overrideprice = res.primaryid
            this.selectedNameForOverridePrice = res.name
            this.selectedId = res.id
          }else{
            if(res?.sub_data?.length>0){
              res?.sub_data?.map((resTwo:any)=>{
                if(resTwo?.default==1){
                  if(resTwo?.primaryid=='4'||resTwo?.primaryid=='5'){
                    this.orderpricecalculation.overrideprice = resTwo.primaryid
                    this.selectedNameForOverridePrice = resTwo?.displayname;
                    this.overRideFlag=false
                  }else{
                    this.orderpricecalculation.overrideprice = resTwo.primaryid
                    this.overRideFlag=true
                    this.selectedNameForOverridePrice = 'Round Gross Price'
                  }
                }
              })
            }
          }
        }
      })
      if(res[0].orderitemoverride_nested_dropdowns.filter(el => el.default == 1).length > 0){
        if (this.ispriceenable != 1)
          this.orderpricecalculation.overrideprice = res[0].orderitemoverride_nested_dropdowns.filter(el => el.default == 1)[0].primaryid
        //for online portal
        // this.endcustomerorderpricecalculation.overrideprice = res[0].orderitemoverride.filter(el => el.default == 1)[0].primaryid
        
        if(this.orderpricecalculation.overrideprice==1){
          this.overRideFlag=true
        }
        if(this.endcustomerorderpricecalculation.overrideprice==1){
          this.overRideFlag=true
        }
        if(this.orderpricecalculation.overrideprice == 6 || this.orderpricecalculation.overrideprice == 7 || this.orderpricecalculation.overrideprice == 8){
          this.overRideFlag=true;
        } 
       else if(this.orderpricecalculation.overrideprice!=1){
          this.overRideFlag=false
        }
      }
      else{
        // this.orderpricecalculation.overrideprice = ''
        // this.orderpricecalculation.overrideprice = this.orderpricearray[0].primaryid;
        this.endcustomerorderpricecalculation.overrideprice = 1;
      }
      (this.orderpricecalculation.overrideprice == '2' || this.orderpricecalculation.overrideprice == '3' || this.orderpricecalculation.overrideprice == '5') ? this.currencySymFlag = true : this.currencySymFlag = false;
      this.costpricecomesfrom = res[0].costpricecomesfrom
      this.netpricecomesfrom = res[0].netpricecomesfrom
      this.orderproductiondata = res[0].productionformuladata
      if(this.orderproductiondata.length > 0){
        this.orderproductiondata.map((val:any)=>{
          val['pricevalue'] = ''
          val['showhideflag'] = 0
          val['pricecalvalue'] = ''
          val['unittype'] = ''
          // val['productionmode'] = 0
          val['productionoverrideeditflag'] = 0
        })
      }
      this.apiflagcount = 0;
      this.firstLoad = true
      this.dateClicked = false;
      if (!isFromSelectReceipe) {
        this.ngxModalService.openModal(this.globalProductModal, 'globalProductModal', 'customWidth');
      }
      this.setModalProperties();
      this.saveorderflag = true
      $('.middlecol ').removeClass('righthiiden')
      $('.slidercontrol').removeClass('sidecontroloverwrite')
      if(res[0]?.data.length>0){
        this.forms = []
        this.imageForProColOpt.optionsimages = []
        this.imageForProColOpt.splitoptionsimages = []
        this.colorimageurl='';  
        this.inst = this.fb.group({})
        let dataObject = res[0].data
        this.selectedproductfield = res[0].data
        dataObject.forEach(async (v,i)=>{
          if(v['widthfraction']){
            v['blindswidth'] = v['widthfraction'].split('_')[0]
          }
          else{
            v['blindswidth'] = 0
          }
          if(v.fieldtypeid == 34){
            if(v.optiondefault){
              this.unittypedata = v.optionsvalue.filter(el => el.optionid.toString() == v.optiondefault.toString())[0].optionname
              this.unittypevalue = v.optionsvalue.filter(el => el.optionid.toString() == v.optiondefault.toString())[0].optionname
            }
          }
          if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
            if(v?.value == 'null'){ v.value = '' }
            this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))
          
          } 
          if(v.fieldtypeid == 28){   
            this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory))) ;
            this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(v?.value ?? 0,this.mapValidators(v.mandatory)));       
            // this.inst.controls[v.fieldname].setValue(0);               
          }
          if (v.fieldtypeid == 4) {  // If default value is there for location_list.            
            this.locationId = v?.locationid;
            let location = v?.optionsvalue.filter(x => x?.optionid == v?.optiondefault);
            this.productId = v?.productId;
            this.inst.addControl(v.fieldid, this.fb.control(location[0]?.optionname ?? ''));
            this.searchTerm = location[0]?.optionname ?? '';
            await this.getGlobalLocation(v.fieldid);
            const globalFiltered = this.globalLocation.filter(item => item.fieldOptionLinkId !== null); // Get the order of ids from arr2
            v.optionsvalue = globalFiltered.map(id => v.optionsvalue.find(item => item.fieldoptionlinkid === id.fieldOptionLinkId));
            this.listOfLocations = v?.optionsvalue ?? [];
            this.cd.markForCheck();
          }
          else {
            if(v.fieldtypeid == 22)
            this.sofyfurningindex=i;
            else if(v.fieldtypeid == 13)
            this.pricegroupindex=i;
            else if(v.fieldtypeid == 17)
            this.supplierindex=i; 
            this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
          }
          if(v.fieldtypeid == 18){
            this.textfieldheight = v.textfieldheight
          }
        })
        const form: form = {
          id: new Date().getUTCMilliseconds().toString(),
          formGroup: this.inst,
          metaData: dataObject,
          transactionalData: []
        }
        this.forms.push(form)
        let orderarraylength:number = this.forms[0].metaData.length
        this.orderlength = (orderarraylength / 2)
        if(this.orderlength <= 10) this.orderlength = 10
        let orderdefaultarray = []
        orderdefaultarray = dataObject.filter(el => el.optiondefault)
        if(orderdefaultarray.length > 0){
          await this.orderformdefault(orderdefaultarray)
          //this.filterbasecall()
          await this.getFilterData("filterBasedcall")
          // if(!this.priceCalculation && this.ordermode!='edit'){
            this.loader.next()
          // }else{
          //   this.saveorderflag = this.rulesBaseDisableSave = this.saveflag =false;
          // }
        }else if(globflag === true){
          // this.filterbasecall();
          this.getFilterData("filterBasedcall")
        }
           this.currentFiledID = this.forms[0].metaData[0].fieldid;
        this.loadcomboGrid(true) 
        if(this.forms[0].metaData.some((e:any) => 'ruleoverride' in e && e.ruleoverride == 0 && !this.globaleditPopup)) {
          let lastMatchingObject = this.forms[0].metaData.filter((e: any) => e.fieldtypeid == 6).pop();
          this.numericChangeSubject.next({ event: {}, prop: lastMatchingObject, i: 0, fieldid: lastMatchingObject.fieldid, allreadycon: 1});
          this.cd.markForCheck();
        }
        return form
      }
      else {
        this.forms =[]
        this.imageForProColOpt.optionsimages = []
        this.imageForProColOpt.splitoptionsimages = []
        this.colorimageurl='';  
      }
      this.cd.markForCheck();
    })
  }
 
//order item default from form creation
  orderformdefault(defaultdatadata){
    let optionimagearr = []
    for(let data of defaultdatadata){
      this.orderparentrow = data
      this.orderfieldid = data.fieldid
      const selectedRow = []
      selectedRow.push(data)
      if(selectedRow.length > 0){
        let splitarray = []
        if(data.optiondefault){
          splitarray = data.optiondefault.toString().split(',')
          for(let splitvalue of splitarray){
            if(splitvalue){
              const optiondata = data.optionsvalue.filter(el => splitarray.includes(el.optionid.toString()))
              let optionnamearray:any = []
              optiondata.map((optvalue:any)=>{
                if((this.fabricIds.includes(data.fieldtypeid) && data.fieldlevel==1) && data.fieldtypeid!=21)
                {
                  if((this.category == 6 && data.multiseq <= 1) || this.category != 6){
                  if(this.selectproduct_typeid==optvalue.pricegroupid || this.selectproduct_typeiddual == optvalue.pricegroupid)
                    optionnamearray.push(optvalue.optionname)
                  }else{
                   let findind = this.selectproduct_typeiddual.find((re => re.multiseq == data.multiseq));
                   if(findind?.id == optvalue.pricegroupid)
                    optionnamearray.push(optvalue.optionname)
                  }
                }
                else
                  optionnamearray.push(optvalue.optionname)
                if(optvalue?.optionimage){
                  if(data.fabricorcolor == '2'){
                    let flagdata = optvalue;
                    flagdata['flagcolor']=1;
                    this.colorimageurl = this.envImageUrl + optvalue?.optionimage + "?nocache=" + this.timestamp;
                  }
                  optionimagearr = optionimagearr.concat(optvalue)  
                }
              })
              if(data.fieldtypeid == 33){
                optionnamearray = []
                let optionName = optiondata.length + " Selected"
                optionnamearray.push(optionName)
              }
              if( optionnamearray.length > 0){
                this.inst?.get(data?.fieldid.toString())?.setValue(optionnamearray.toString())
              }
            }
            if(this.fabricIds.includes(data.fieldtypeid) && (data.fieldlevel == 2 && data.issubfabric != 1)){ }
            else if(this.fabricIds.includes(data.fieldtypeid) && (data.fieldlevel == 3 && data.issubfabric == 1)){ }
            else{
              this.selectedcompindex = this.forms[0].metaData.findIndex(el => el.fieldid == data.fieldid)
              if(this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                this.forms[0].metaData[this.selectedcompindex].subchild.forEach((v,i)=>{
                  v['dumydata'] = []
                  if(v['widthfraction']){
                    v['blindswidth'] = v['widthfraction'].split('_')[0]
                  }
                  else{
                    v['blindswidth'] = 0
                  }
                  if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32 || v.fieldtypeid == 33 || v.fieldtypeid == 28){
                    if(v?.value == 'null'){ v.value = '' }
                    this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))
                  }
                  else{
                    this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
                  }
                  if(v.fieldtypeid == 28){
                    if(v?.value == 'null'){ v.value = '' }
                    this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)));     
                    this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(v?.numberfraction?.split('_')[0] ?? '0',this.mapValidators(v.mandatory)))
                    // this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(v?.value ?? 0 ,this.mapValidators(v.mandatory)))
                  }
                  const found = this.forms[0].metaData.some(el => el.fieldid == v.fieldid)
                  if(!found){
                    if(v.optiondefault == '' && v.value == ''){
                      this.inst.get(v.fieldid.toString()).setValue('')
                    }
                    this.forms[0].metaData.map((indexdata:any,index:any)=>{
                      if(indexdata.optionsvalue.length > 0){
                        indexdata.optionsvalue.map((linkid:any,j:any)=>{
                          if(this.category != 6 ){
                          if(linkid.forchildfieldoptionlinkid == v.forchildsubfieldlinkid){
                            this.selectedcompindex = index
                          }
                        }else{
                          if((linkid.fieldid == v.fieldid) && linkid.forchildfieldoptionlinkid == v.forchildsubfieldlinkid){
                            this.selectedcompindex = index;
                          }
                        }
                        })
                      }
                    })
                    let subindex = 0
                    subindex = i + 1
                    this.forms[0].metaData = this.insertfieldfn(this.forms[0].metaData, this.selectedcompindex+subindex, v)
                    //  this.loadcomboGrid(true,this.selectedcompindex+subindex)
                    let orderarraylength:number = this.forms[0].metaData.length
                    if(orderarraylength > 10){
                      this.orderlength = (orderarraylength / 2)
                      if(this.orderlength <= 10) this.orderlength = 10
                    }
                    else this.orderlength = 10
                  }
                })
              }
              this.forms[0].metaData.map((val:any)=>{
                if(val.optiondefault){
                  this.gridBoxValue = val.optiondefault.toString().split(',')
                  val['dumydata'] = []
                  val.optionsvalue.map((drop:any)=>{
                    if(this.gridBoxValue.includes(drop.optionid.toString())){
                      val['dumydata'].push(drop)
                    }
                  })
                }
                else{ val['dumydata'] = [] }
              })
              // setTimeout(() => {
              //   this.saveflag = false
              // }, 1000)
              if(this.forms[0].metaData[this.selectedcompindex].subchild && this.forms[0].metaData[this.selectedcompindex].subchild.length > 0)
              this.orderformdefault(this.forms[0].metaData[this.selectedcompindex].subchild)

            }
          }
        }
      }
    }
    // setTimeout(() => {
    //   this.filterbasecall()
    // }, 1000)
    this.orderfiltercondition()
    this.rulesvalue = 1
    this.setCarouselImage(optionimagearr)
  }
  orderfiltercondition(){
    this.forms[0].metaData.map((data:any)=>{
      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          this.filterarray.color = data.optionsbackup
        }
        else{
          if(data.fieldlevel == 2){ this.filterarray.color = data.optionsbackup }
          else { this.filterarray.fabric = data.optionsbackup }
        }
      }
      if(data.fieldtypeid == 13){
        this.filterarray.pricegroup = data.optionsbackup
      }
      if(data.fieldtypeid == 17){
        this.filterarray.supplier = data.optionsbackup
      }
    })
  }
  public orderQuantity;
  public priceFullPrice;
  public totalOperationCost:any = 0.00;
  public pricePopupFlag = false;
  public saveFlag = false;
  async ordercalc(isSaveBtnDisabled?,rule=''){
    if(this.priceCalculation && this.orderchangeflag && rule == ''){
      this.saveflag = this.rulesBaseDisableSave = this.closeflag = false;
      if(this.loadingIndex ){ 
        this.removeSubLoader()
      }
      return;
    }
    if(!this.receipedisabledflag){
      let AllWidth:any=''
      let AllMultiWidth:any=''
      let  MultipleWidthArray = []
      let blindswidtharray = []
      this.maxwidtherr = ''
      this.forms[0].metaData.map((field)=>{
        AllMultiWidth=''
        if(field.fieldtypeid == 7 || field.fieldtypeid == 8 || field.fieldtypeid == 11 || field.fieldtypeid == 31){
          if(this.inst.value[field.fieldid] && !this.widthdropfraction.width){
            AllWidth =  parseFloat(this.inst.value[field.fieldid])
          }
          if(this.widthdropfraction.width && !this.inst.value[field.fieldid]){
            if(this.widthdropfraction.width != '0'){
              AllWidth = parseFloat(this.Measurementarray?.filter(el=>el.id == this.widthdropfraction.width)[0]?.frac_decimalvalue)
            }
          } 
          if(this.inst.value[field.fieldid] && this.widthdropfraction.width){
            if(this.widthdropfraction.width != '0'){
              AllWidth =  parseFloat(this.inst.value[field.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == this.widthdropfraction.width)[0]?.frac_decimalvalue)
            }
            else{
              AllWidth =  parseFloat(this.inst.value[field.fieldid])
            }
          }
        }
        if(field.fieldtypeid == 1){
          blindswidtharray.push(field)
          if(this.inst.value[field.fieldid] && !field.blindswidth){
            AllMultiWidth =  parseFloat(this.inst.value[field.fieldid])
          }
          if(field.blindswidth && !this.inst.value[field.fieldid]){
            if(field.blindswidth != '0' && field.blindswidth != 'undefined'){
              AllMultiWidth = parseFloat(this.Measurementarray?.filter(el=>el.id == field.blindswidth)[0]?.frac_decimalvalue)
            }
          }
          if(this.inst.value[field.fieldid] && field.blindswidth){
            if(field.blindswidth != '0' && field.blindswidth != 'undefined'){
              AllMultiWidth =  parseFloat(this.inst.value[field.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == field.blindswidth)[0]?.frac_decimalvalue)
            }
            else{
              AllMultiWidth =  parseFloat(this.inst.value[field.fieldid])
            }
          }
          if(AllMultiWidth){
            MultipleWidthArray.push(AllMultiWidth)
          }
        }
      })
      if(AllWidth){
        let widthsumvalue = MultipleWidthArray.reduce((a, b) => a + b, 0)
        if(widthsumvalue){
          this.maxwidtherr = widthsumvalue != AllWidth ? 'Over All Width does not match Multiple Width' : ""
        }
        if(MultipleWidthArray.length == 0 && blindswidtharray.length > 0){
          this.maxwidtherr = 'Over All Width does not match Multiple Width'
        }
      }
      else{
        this.maxwidtherr = ''
        this.forms[0].metaData.map((field)=>{
          if(field.fieldtypeid == 1){
            this.inst.controls[field.fieldid].setErrors({ errors: null })
            this.inst.controls[field.fieldid].setErrors({ errors: null })
          }
        })
      }
      // if(!this.costpriceflag){
        let vat_data = {
          productid:this.selectedproductid,
          jobid: this.route.snapshot.paramMap.get('id'),
          organisation:this.organisation_id,
          zipcode:this.zip_code
        };
        this.vat_value = this.vatvalue;
        if(this.addeditmode == 'edit'){
          await this.orderser.getvatvalue('orderitem',vat_data).toPromise().then((res:any)=>{
          // this.vatarray = res.taxlist
               if(this.saveFlag){
                this.vatarray = res.taxlist
                this.vatvalue = res.data
                this.ordervattype = res.vat_type
              }
            this.vattypearray = {
              type : res.vat_type,
              value : res.data,
              vatarray : res.taxlist
            }
            this.vat_value = res.data
            this.vattype = res.vat_type
            this.defaultsalestaxlabel = res.defaultsalestaxlabel
            this.productMaxSqArea = res.productMaxSqArea;
            this.enableMaxSqAreaOnlineOrder = res.enableMaxSqAreaOnlineOrder;
            this.maxSqAreaFlagCheck = true;
            this.cd.markForCheck();
          })
        }
        
        let netprice = {}
        let calctestdata:any =[]
        let fabricfieldtypeid = ''
        let fabricoptionid=''
        let fabricoptioniddual=[]
        let colorid = ''
        let coloriddual = []
        let subfabricid = ''
        let subcolorid = ''
        this.forms[0].metaData.map((field:any)=>{
          if(this.fabricIds.includes(field.fieldtypeid)){
            if(field.fieldtypeid == 20){
              colorid = field.optiondefault
            }
            else{
              if(field.fieldlevel == 1){
                if(this.category != 6){
                if(field.dualseq ==2){
                  fabricoptioniddual = field.optiondefault
                }
                  fabricoptionid = field.optiondefault
                }else{
                  if(field.multiseq >1){
                    fabricoptioniddual.push({multiseq:field.multiseq,id:field.optiondefault});
                  }
                  if(field.multiseq <= 1){
                    fabricoptionid = field.optiondefault
                  }
                }
              }
                fabricfieldtypeid = field.fieldtypeid
              }
              if(field.fieldlevel == 2 && field.issubfabric != 1){
                if(this.category != 6){
                if(field.dualseq ==2){
                  coloriddual = field.optiondefault
                }
                if(field.dualseq !=2){
                  colorid = field.optiondefault
                }
              }else{
                if(field.multiseq >1){
                  coloriddual.push({multiseq:field.multiseq,id:field.optiondefault});
                }
                if(field.multiseq <= 1){
                  colorid = field.optiondefault
                }
              }
              }else if(field.fieldlevel == 2 && field.issubfabric == 1){
                subfabricid = field.optiondefault
              }else if(field.fieldlevel == 3 && field.issubfabric == 1){
                subcolorid = field.optiondefault
              }
            }          
          if(field.fieldtypeid == 34){
            if(field.optiondefault){
              this.unittypevalue = (field.optionsvalue.filter(el => el.optionid == field.optiondefault))[0].optionname 
            }
            else{
              this.unittypevalue = ''
            }
          }
          if(field.optiondefault){
            if(field.fieldtypeid != 0){
              if(field.fieldtypeid == 3){
                if(this.noSupplierbasedflag){
                  let valuesplit = field.optiondefault.toString().split(',')
                  valuesplit.map((data:any)=>{
                    let defaultoptionname =  field.optionsvalue.filter(o1 => o1.optionid == data)
                    if(defaultoptionname.length > 0){
                      if(defaultoptionname[0].hasprice == 1){
                        calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:field.fieldtypeid,optionqty:parseFloat(defaultoptionname[0].optionqty),fieldoptionlinkid:defaultoptionname[0].fieldoptionlinkid})
                      }
                    }
                  })
              }else{
                let valuesplit = field.optiondefault.toString().split(',');
                valuesplit.map((data:any)=>{
                  let defaultoptionname =  field.optionsvalue.filter(o1 => o1.optionid == data)
                  if(defaultoptionname.length > 0){
                    if(defaultoptionname[0].hasprice == 1){
                      calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:field.fieldtypeid,optionqty:parseFloat(defaultoptionname[0].optionqty),fieldoptionlinkid:defaultoptionname[0].fieldoptionlinkid})
                    }
                  }
                })
              }
              }else if(field.fieldtypeid == 33){
                let valuesplit = field.optiondefault.toString().split(',')
                valuesplit.map((data:any)=>{
                  let defaultoptionname =  field.optionsvalue.filter(o1 => o1.optionid == data)
                  if(defaultoptionname.length > 0){
                      calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:field.fieldtypeid,optionqty:parseFloat(defaultoptionname[0].qty),length : parseFloat(defaultoptionname[0].length),fieldoptionlinkid:defaultoptionname[0].fieldoptionlinkid})
                  }
                })
              }else{
                let valuesplit = field.optiondefault.toString().split(',')
                valuesplit.map((data:any)=>{
                  let defaultoptionname =  field.optionsvalue.filter(o1 => o1.optionid == data)
                  if(defaultoptionname.length > 0){
                    if(defaultoptionname[0].hasprice == 1){
                      calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:field.fieldtypeid,optionqty:parseFloat(defaultoptionname[0].optionqty),fieldoptionlinkid:defaultoptionname[0].fieldoptionlinkid})
                    }
                  }
                })
              }
              
            }
          }
        })
        let widthvalue = '' ; let dropvalue = '' ; let qtyvalue = '' ;let widthfieldtypeid =''; let dropfieldtypeid ='';
        let optionarray:any =[] ; let orderunitype = ''
        let optionarraydual:any =[] ;
        let blindopeningwidtharray:any=[]
        this.forms[0].metaData.map((field)=>{
          if(field.fieldtypeid == 1){
            let joinvalue:any = ''
            if(this.inst.value[field.fieldid] && !field.blindswidth){
              joinvalue =  parseFloat(this.inst.value[field.fieldid])
            }
            if(field.blindswidth && !this.inst.value[field.fieldid]){
              if(field.blindswidth != '0' && field.blindswidth != 'undefined'){
                joinvalue = this.Measurementarray?.filter(el=>el.id == field.blindswidth)[0].decimalvalue
              }
            }
            if(this.inst.value[field.fieldid] && field.blindswidth){
              if(field.blindswidth != '0' && field.blindswidth != 'undefined'){
                joinvalue =  parseFloat(this.inst.value[field.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == field.blindswidth)[0].decimalvalue)
              }
              else{
                joinvalue =  parseFloat(this.inst.value[field.fieldid])
              }
            }
            if(joinvalue){
              blindopeningwidtharray.push(joinvalue)
            }
          }
          if(field.fieldtypeid == 7 || field.fieldtypeid == 8 || field.fieldtypeid == 11 || field.fieldtypeid == 31){
            widthvalue = this.inst.value[field.fieldid]
            if( this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          if(isNaN(parseFloat(widthvalue))){
          widthvalue="0";
        }
              let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthvalue)
              widthvalue= widthvalue1;
            }  
            widthfieldtypeid = field.fieldtypeid
          }
          if(field.fieldtypeid == 9 || field.fieldtypeid == 10 || field.fieldtypeid == 12 || field.fieldtypeid == 32){
            dropvalue = this.inst.value[field.fieldid.toString()]
            if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
              if(isNaN(parseFloat(dropvalue))){
                dropvalue="0";
              }
              let dropvalue1:any = parseFloat(this.dropdecimalinches) + parseFloat(dropvalue)
              dropvalue= dropvalue1;
            } 
            dropfieldtypeid = field.fieldtypeid
          }
         
          if(field.fieldtypeid == 14){
            qtyvalue = this.inst.value[field.fieldid.toString()]
          }
          if(field.fieldtypeid == 13){
            if(field.optiondefault){
              if(this.category != 6){
              if(field.dualseq ==2){
                optionarraydual.push(field.optiondefault)
              }
              if(field.dualseq !=2){
                if(field.showfieldonjob){
                  optionarray.push(field.optiondefault)
                }else{
                  if(this.selectedoption.length>0){
                      optionarray.push(field.optiondefault)
                  }
                  else if(field.showfieldonjob == 0){
                    optionarray.push(field.optiondefault)
                  }
                  else{
                    optionarray = []
                  }
                }
              }
            }else{
              if(field.multiseq >1){
                optionarraydual.push({multiseq:field.multiseq,id:field.optiondefault});
              }
              if(field.multiseq <= 1){
                if(field.showfieldonjob){
                  optionarray.push(field.optiondefault)
                }else{
                  if(this.selectedoption.length>0){
                      optionarray.push(field.optiondefault)
                  }
                  else if(field.showfieldonjob == 0){
                    optionarray.push(field.optiondefault)
                  }
                  else{
                    optionarray = []
                  }
                }
              }
            }
            }
          }
          if(field.fieldtypeid == 34){
            orderunitype = field.optiondefault
          }
        })
        let zipprotax:any = ''
        let vatchangevalue:any = ''
        if(this.ordervattype && this.vattypearray.type){
          if(this.ordervattype != this.vattypearray.type){
            if(this.vattypearray.value || !this.vattypearray.value){
              vatchangevalue = this.vattypearray.value
            }
          }
          else{
            if(this.ordervattype != 1){
              zipprotax =  this.vat_value ;//? this.vat_value : this.vatvalue
            }
            vatchangevalue = this.ordervattype == 1 ? this.vatvalue : zipprotax
          }
        }
        else{
          if(this.ordervattype != 1){
            zipprotax =  this.vat_value;// ? this.vat_value : this.vatvalue
          }
          vatchangevalue = this.ordervattype == 1 ? this.vatvalue : zipprotax
        }
        this.vat_value = vatchangevalue
        netprice = {
          blindopeningwidth: blindopeningwidtharray,
          productid: this.selectedproductid,
          supplierid: 51,
          mode: optionarray.length > 0 ? 'pricetableprice' : '',
          width: widthvalue ? widthvalue : '',
          drop: dropvalue ? dropvalue : '',
          pricegroup: optionarray.length > 0 ? optionarray : '',
          customertype: this.productser.customerType,
          optiondata: calctestdata,
          unittype: orderunitype,
          orderitemqty: qtyvalue,
          jobid: this.route.snapshot.paramMap.get('id'),
          overridetype: this.orderpricecalculation.overrideprice ? parseFloat(this.orderpricecalculation.overrideprice) : '',
          overrideprice: (this.orderpricecalculation.overridevalue !== null || this.orderpricecalculation.overridepricecalc !== null) ? this.orderpricecalculation.overridepricecalc : "",
          // overrideprice: this.orderpricecalculation.overridepricecalc ? this.orderpricecalculation.overridepricecalc : 0,
          overridevalue: this.orderpricecalculation.overridepricecalc == "" ? null : this.orderpricecalculation.overridepricecalc,
          vatpercentage: this.vatcalctoggle && !isNaN(vatchangevalue)   ? vatchangevalue : 0,//this.vatvalue,
          costpriceoverride: this.orderpricecalculation.costpricetoggle == true ? 1 : 0,
          costpriceoverrideprice: this.orderpricecalculation.costpricetoggle ?  parseFloat(this.orderpricecalculation.totalcost) : 0.00,
          orderitemcostprice: !this.orderpricecalculation.costpricetoggle ?  parseFloat(this.orderpricecalculation.totalcost) : 0.00,
          productionmaterialcostprice : this.productionmaterialcostprice,
          materialFormulaPrice : this.materialFormulaPrice,
          productionmaterialnetprice : this.productionmaterialnetprice,
          productionmaterialnetpricewithdiscount : this.productionmaterialnetpricewithdiscount,
          overridepricevalue : this.overridepricevalue,
          getpricegroupprice :this.getpricegroupprice,
          rulescostpricecomesfrom : this.costpricecomesfrom,
          rulesnetpricecomesfrom : this.netpricecomesfrom,
          fabricfieldtype: fabricfieldtypeid,
          widthfieldtypeid:widthfieldtypeid,
          dropfieldtypeid:dropfieldtypeid,
          colorid: colorid,
          priceapicount:this.orderpricechangeflag,
        reportpriceresults : this.reportpriceresults,
          fabricid:fabricoptionid ?? '', // for shutter type case
          orderid : this.orderid,
          customerid:this.productser.customerid ? this.productser.customerid : this.productser.existingcusID,
          fabriciddual:this.category != 6?fabricoptioniddual ?? '':'', // for fabric dual
          fabricmulticurtain:this.category == 6? fabricoptioniddual.length>0?fabricoptioniddual:[]:[], //for multicurtain 
          coloriddual:coloriddual, 
          subfabricid: subfabricid,
          subcolorid: subcolorid,
          pricegroupdual:this.category !=6 ? optionarraydual.length > 0 ? optionarraydual : '' : '',///for dual fabric
          pricegroupmulticurtain:this.category == 6 ?optionarraydual.length > 0 ? optionarraydual : []:[],///for multicurtain
        }
        this.savedFormValue = {...this.inst};
        this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
        await this.orderser.getordercaldata(this.forms[0].metaData[this.selectedcompindex].fieldtypeid,this.route.snapshot.paramMap.get('id'),netprice).toPromise().then(async (cost: any) => {
          for (let [key, value] of Object.entries(this.savedFormValue)){
            if(this.savedFormValue[key] === this.inst.value[key]){
              this.inst.value[key]=value;
            }
          }
        this.reportpriceresults = cost.reportpriceresults
          this.checkpriceval = "This price has been updated to " + parseFloat(cost.fullpriceobject.grossprice).toFixed(this.decimalvalue) + " ,Would you like to update it to the new price or keep the same?"
          this.priceupdate = cost
          this.productiontotalcost = parseFloat(cost.optioncostpricesum).toFixed(this.decimalvalue)
          this.orderpricecalculation.optionprice = cost.optionprice
          this.orderpricecalculation.pricegroupprice = cost.pricegroupprice
          this.ordercost = cost
          this.orderprice = cost.finalnetprice
          this.widthdroppriceflag = false
          this.widthdroppricemsg = ''
          this.currencySymbole =  cost.currencysymbol;
          this.ispriceenable = cost.ispriceenable
          this.pricefields = cost.pricefields;
          this.saveorderflag = false
          this.onlyKeepflag = false;
          let pricevalidation = {width: '',drop:'',pricegroup:''}
          if(this.forms[0].metaData.filter(el => el.fieldtypeid == 11).length > 0){
            pricevalidation.width = this.inst.value[this.forms[0].metaData.filter(el => el.fieldtypeid == 11)[0].fieldid.toString()]
          }
          if(this.forms[0].metaData.filter(el => el.fieldtypeid == 12).length > 0){
            pricevalidation.drop = this.inst.value[this.forms[0].metaData.filter(el => el.fieldtypeid == 12)[0].fieldid.toString()]
          }
          pricevalidation.pricegroup = this.forms[0].metaData.filter(el => el.fieldtypeid == 13).length > 0 ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0].optiondefault : ''
          if(pricevalidation.width && pricevalidation.drop && pricevalidation.pricegroup){
            if(!this.widthdropflag){
              if(cost.pricegroupprice == 0 && this.costpricecomesfrom != 1){
                this.widthdroppriceflag = true
                this.widthdroppricemsg = 'There is no price for these measurements'
              }
            }
          }
          this.oldOperations = cost.oldoperations;
          this.keepFlag = false;
          this.pricePopupFlag = false;
          this.customerAccountType = this.productser.customerType;
          this.calenderPriceList = cost.operationscost.calendar.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }});
         this.workPriceList = cost.operationscost.workroom.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }});
         this.totalCostPrice = cost.operationscost.calculations;
         this.totalOperationCost = (parseFloat(this.totalCostPrice.workroom) + parseFloat(this.totalCostPrice.calendar)).toFixed(this.decimalvalue)
         this.totalOperationSellingCost = parseFloat(this.totalCostPrice.cost_with_markup).toFixed(this.decimalvalue)
          if((this.addeditmode !== 'edit' || (this.addeditmode === 'edit' && this.alertonPrice)) && (this.orderpricevalidation.costprice != cost.fullpriceobject.costprice.toFixed(this.decimalvalue) || this.orderpricevalidation.grossprice != cost.fullpriceobject.grossprice.toFixed(this.decimalvalue) && !this.route.snapshot.queryParams.copyproduct)){
            if(!this.ordercalcflag){
                            this.orderser.orderformeditflag = ''
                this.oldorderpricecalculation.netprice = cost.fullpriceobject.netprice.toFixed(this.decimalvalue)
                this.oldorderpricecalculation.vat = cost.fullpriceobject.vatprice.toFixed(this.decimalvalue)
                this.oldorderpricecalculation.totalgross = cost.fullpriceobject.grossprice.toFixed(this.decimalvalue)
                //////for online portal
                this.endcustomerorderpricecalculation.netprice = cost.fullpriceobject.netprice.toFixed(this.decimalvalue)
                // this.endcustomerorderpricecalculation.vat = cost.fullpriceobject.vatprice.toFixed(this.decimalvalue)
                this.endcustomerorderpricecalculation.totalgross = cost.fullpriceobject.grossprice.toFixed(this.decimalvalue)
                
                this.orderpricecalculation.netprice = cost.fullpriceobject.overridenetprice?cost.fullpriceobject.overridenetprice.toFixed(this.decimalvalue):''
                this.orderpricecalculation.vat = cost.fullpriceobject.overridevatprice?cost.fullpriceobject.overridevatprice.toFixed(this.decimalvalue):''
                this.orderpricecalculation.totalgross  = cost.fullpriceobject.overridegrossprice?cost.fullpriceobject.overridegrossprice.toFixed(this.decimalvalue):''
                this.orderpricecalculation.totalcost = cost.fullpriceobject.costprice.toFixed(this.decimalvalue)
                let overridevalue = cost.fullpriceobject.overridevalue === null ? cost.fullpriceobject.overrideprice = '' : cost.fullpriceobject.overrideprice
                // this.orderpricecalculation.overridepricecalc = overridevalue !== '' ? overridevalue.toFixed(this.decimalvalue) : ''
                this.vatvalue = this.vat_value;
                this.vat_type = this.vattype;
            }
            if(this.ordercalcflag){
              // if(this.orderpricechangeflag == cost.priceapicount){
                setTimeout(() => {
                  if(!this.ngxModalService.modals['priceUpdateModal'] && this.acceptanceflag && this.onllineaftersubmitordereditflag) {
                    this.ngxModalService.openModal(this.priceUpdateModal, 'priceUpdateModal');
                  }
                }, 500)
                this.checkpriceval = "This price has been updated to " + parseFloat(cost.fullpriceobject.grossprice).toFixed(this.decimalvalue) + " ,Would you like to update it to the new price or keep the same?"
                this.priceupdate = cost
                this.orderser.orderformeditflag = ''
                this.closeflag = false
            }
          }
          else{
            this.vatvalue = this.vat_value;
            this.orderser.orderformeditflag = ''
            this.closeflag = false
            this.ordercalcflag = false
            if(!this.ordercalcflag){
                this.oldorderpricecalculation.netprice = cost.fullpriceobject.netprice.toFixed(this.decimalvalue)
                this.oldorderpricecalculation.vat = cost.fullpriceobject.vatprice.toFixed(this.decimalvalue)
                this.oldorderpricecalculation.totalgross = cost.fullpriceobject.grossprice.toFixed(this.decimalvalue)
                //////for online portal
                this.endcustomerorderpricecalculation.netprice = cost.fullpriceobject.netprice.toFixed(this.decimalvalue)
                // this.endcustomerorderpricecalculation.vat = cost.fullpriceobject.vatprice.toFixed(this.decimalvalue)
                this.endcustomerorderpricecalculation.totalgross = cost.fullpriceobject.grossprice.toFixed(this.decimalvalue)
  
                this.orderpricecalculation.netprice = cost.fullpriceobject.overridenetprice.toFixed(this.decimalvalue)
                this.orderpricecalculation.vat = cost.fullpriceobject.overridevatprice.toFixed(this.decimalvalue)
                this.orderpricecalculation.totalgross  = cost.fullpriceobject.overridegrossprice.toFixed(this.decimalvalue)
                this.orderpricecalculation.totalcost = cost.fullpriceobject.costprice.toFixed(this.decimalvalue)
                let overridevalue = cost.fullpriceobject.overridevalue === null ? cost.fullpriceobject.overrideprice = '' : cost.fullpriceobject.overrideprice
                this.orderpricecalculation.overridepricecalc = overridevalue !== ''  ? overridevalue.toFixed(this.decimalvalue) : ''
              }
            }
            if(isSaveBtnDisabled || this.rulecount==0){
                  this.rulesBaseDisableSave = false
                  this.removeSubLoader()
            }
            this.orderCalculationFun()
            this.formulaCalculation()
            this.getWidthDropValidation()
          if(this.globaleditPopup){
            this.callcommonwidthdropvalidation();
            this.saveflag = false;
          }
          this.cd.markForCheck();
        }).catch(err=>{
        })
          let edata = {
          vatvalue: this.endcustomerorderpricecalculation.vat ?? this.vatvalue,
          overridetype: this.endcustomerorderpricecalculation.overrideprice,
          overridevalue: this.endcustomerorderpricecalculation.overridepricecalc,
          netprice: this.oldorderpricecalculation.netprice,
          mode: 'order item',
          productid:this.selectedproductid,
          jobid:this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id'): this.job_tempid,
          customertype:this.productser.customerType,
          pivotId: this.pivotId ? this.pivotId : ''
      }
      if(this.endcustomerorderpricecalculation.vat){
        edata.vatvalue = this.endcustomerorderpricecalculation.vat;
      }else{
        edata.vatvalue = this.vatvalue
      }
      this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
      return await  this.orderser.onlinegetoverridevatvalue(edata).toPromise().then((res:any)=>{
          if(res.data){
            this.endcustomerorderpricecalculation.netprice=res.data.net;
            this.endcustomerorderpricecalculation.totalgross=res.data.gross;
            this.endcustomerorderpricecalculation.calvatprice=res.data.vat;
            this.saveflag = false;
          }
          if(this.save_copy){
            this.isLoading = false;
            this.save_copy = false;
          }
          if (this.forms[0].metaData.some((e: any) => e?.fieldtypeid === 6 && e?.numeric_setcondition)) {
            this.minMaxSetConditionFull(); // LA-I3072 Condition added
            this.cd.markForCheck();
          }
          this.cd.markForCheck();
        }).catch(err =>{
          if(this.save_copy){
            this.isLoading = false;
            this.save_copy = false;
          }
        })
      // }
    } else {
      this.saveflag = false;
    }
  }
  callcommonwidthdropvalidation(){
    if(this.forms[0].metaData.filter(el => [13,11,12,21,8,9,10,7,31,32].includes(el.fieldtypeid)).length > 0){          
      this.commonwidthdropvalidation(this.forms[0].metaData.filter(el => [13,11,12,21,8,9,10,7,31,32].includes(el.fieldtypeid))[0]);
    }
  }
  changespricecalcpopup(flag){
    this.pricePopupFlag = true;
    if(flag == 'cancel'){
      this.ordercalcflag = false;
      this.keepFlag = true;
      this.calenderPriceList = this.oldOperations.calendar ? this.oldOperations.calendar.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }}) : [];
      this.workPriceList = this.oldOperations.workroom ? this.oldOperations.workroom.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }}) : [];
      this.totalCostPrice = this.oldOperations.calculations ? this.oldOperations.calculations : [];
      this.totalOperationCost = this.totalCostPrice.length != 0 ? (parseFloat(this.totalCostPrice.workroom) + parseFloat(this.totalCostPrice.calendar)).toFixed(this.decimalvalue) : "0.00"
      this.ngxModalService.closeModal('priceUpdateModal');
    }
    if(flag == 'update'){
      if(this.ordervattype && this.vattypearray.type){
        if(this.ordervattype != this.vattypearray.type){
          if(this.vattypearray.value || !this.vattypearray.value){
            this.ordervattype = this.vattypearray.type
            this.vatarray = this.vattypearray.vatarray
          }
        }
      }
      this.oldorderpricecalculation.netprice = this.priceupdate.fullpriceobject.netprice != null ? this.priceupdate.fullpriceobject.netprice.toFixed(this.decimalvalue) : 0;
      this.oldorderpricecalculation.vat = this.priceupdate.fullpriceobject.vatprice != null ? this.priceupdate.fullpriceobject.vatprice.toFixed(this.decimalvalue) : 0;
      this.oldorderpricecalculation.totalgross = this.priceupdate.fullpriceobject.grossprice != null ? this.priceupdate.fullpriceobject.grossprice.toFixed(this.decimalvalue) : 0;
      this.orderpricecalculation.netprice = this.priceupdate.fullpriceobject.overridenetprice != null ? this.priceupdate.fullpriceobject.overridenetprice.toFixed(this.decimalvalue) : 0;
      this.orderpricecalculation.vat = this.priceupdate.fullpriceobject.overridevatprice != null ? this.priceupdate.fullpriceobject.overridevatprice.toFixed(this.decimalvalue) : 0;
      this.orderpricecalculation.totalgross  = this.priceupdate.fullpriceobject.overridegrossprice != null ? this.priceupdate.fullpriceobject.overridegrossprice.toFixed(this.decimalvalue) : 0;
       //////for online portal
       this.endcustomerorderpricecalculation.netprice = this.priceupdate.fullpriceobject.netprice != null ? this.priceupdate.fullpriceobject.netprice.toFixed(this.decimalvalue) : 0;
       // this.endcustomerorderpricecalculation.vat = cost.fullpriceobject.vatprice.toFixed(this.decimalvalue) : 0;
       this.endcustomerorderpricecalculation.calvatprice = this.priceupdate.fullpriceobject.vatprice != null ? this.priceupdate.fullpriceobject.vatprice.toFixed(this.decimalvalue) : 0;
       this.endcustomerorderpricecalculation.totalgross = this.priceupdate.fullpriceobject.grossprice != null ? this.priceupdate.fullpriceobject.grossprice.toFixed(this.decimalvalue) : 0;
       
      this.orderpricecalculation.totalcost = this.priceupdate.fullpriceobject.costprice.toFixed(this.decimalvalue)
      let overridevalue = this.priceupdate.fullpriceobject.overridevalue === null ? this.priceupdate.fullpriceobject.overrideprice = '' : this.priceupdate.fullpriceobject.overrideprice
      this.orderpricecalculation.overridepricecalc = overridevalue !== '' ? overridevalue.toFixed(this.decimalvalue) : ''
     
      this.ordervattype = this.vattype;
      if( this.ordervattype == 1 ){
        this.vatarray = this.vattypearray.vatarray
      }
      this.vatvalue = this.vat_value;
      this.vat_type = this.vattype;
      this.ordercalcflag = false
      this.ngxModalService.closeModal('priceUpdateModal');
    } 
    if(flag == 'keep'){
      this.keepFlag = true;
     this.ordercalcflag = false
     this.onlyKeepflag = true;
     if(this.costpricetoggle){
        this.orderpricecalculation.costpricetoggle = true
        this.costpriceflag = true
     }
     this.calenderPriceList = this.oldOperations.calendar ? this.oldOperations.calendar.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }}) : [];
     this.workPriceList = this.oldOperations.workroom ? this.oldOperations.workroom.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }}) : [];
     this.totalCostPrice = this.oldOperations.calculations ? this.oldOperations.calculations : [];
     this.totalOperationCost = this.totalCostPrice.length != 0 ? (parseFloat(this.totalCostPrice.workroom) + parseFloat(this.totalCostPrice.calendar)).toFixed(this.decimalvalue) : "0.00"
    //  this.orderpricecalculation.totalcost =  (parseFloat(this.productiontotalcost) + parseFloat(this.totalOperationCost)).toFixed(this.decimalvalue)
    this.ngxModalService.closeModal('priceUpdateModal');
    }
    if(this.rulecount==0){
      this.rulesBaseDisableSave = false
    }
    this.cd.markForCheck();
  }
//order item textbox value
  async getordertextboxvalue(event,field,i,e){
    this.orderchangeflag = this.inst.dirty
    // this.selectedcompindex = i
    // this.orderparentrow = field
    // this.selectedcompsetcontrol = e
    if(!this.rulescount && !this.formulacount){
      this.ordercalc()
      let unittypeid = ''
      this.forms[0].metaData.map((field:any)=>{
        if(field.fieldtypeid == 34){
          unittypeid = field.optiondefault
         }
      })
      if(this.oneditmode==false){
        let temp:any=Number(unittypeid)
        this.unittypefractionlist(-1,temp)
      }
    }
    if(this.rulescount && !this.formulacount){
      this.rulesvalue = 1
      await this.rulesbaseprice()
    }
    if(!this.rulescount && this.formulacount){
      this.rulesvalue = 2
      await this.rulesbaseprice()
    }
    if(this.rulescount && this.formulacount){
      this.rulesvalue = 1
      await this.rulesbaseprice()
    }
  }
 
//order item default from form dropdown value change


  async selectedfieldfn(e,i,parentfield,event){
    this.singlemultipleflag = 'single'
     this.enabledisableflag = true
 if(parentfield.fieldtypeid==34){
  if(this.receipedisabledflag){
    this.fractionshowhideflag = false
  }
  this.forms[0].metaData.map((data:any)=>{
    if(data.fieldtypeid == 1){
      this.inst.get(data.fieldid.toString()).setValue('')
      data.blindswidth = 0
    }
    if(data.fieldtypeid==11 || data.fieldtypeid==7  || data.fieldtypeid==8  || data.fieldtypeid==31 ){
      this.widthdecimalinches =  0;
      this.widthdropfraction.width=0;
      this.inst.get(data.fieldid.toString()).setValue('')
    }else if(data.fieldtypeid==12 || data.fieldtypeid==9  || data.fieldtypeid==10 || data.fieldtypeid==32 ){
      this.dropdecimalinches=0;
      this.widthdropfraction.drop=0;
      this.inst.get(data.fieldid.toString()).setValue('')
    }
  })
  this.oneditmode=false; 
 }
 if(parentfield.fieldtypeid==13 || parentfield.fieldtypeid==17)
 {
  if(this.category != 6){
  if(parentfield.fieldtypeid==13 && parentfield.dualseq!=2){
    this.selectproduct_typeid = event.target.value;
  }
  if(parentfield.fieldtypeid==13 && parentfield.dualseq==2){
    this.selectproduct_typeiddual = event.target.value;
  }
}else{
  if(parentfield.fieldtypeid==13 && parentfield.multiseq<=1){
    this.selectproduct_typeid = event.target.value;
  }
  if(parentfield.fieldtypeid==13 && parentfield.multiseq>1){
    let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == parentfield.multiseq);
    if(unique !== -1){
      this.selectproduct_typeiddual[unique].id = parentfield.value;
    }else{
      this.selectproduct_typeiddual.push({multiseq:parentfield.multiseq,id:event.target.value});
    }
  }
}
  if(parentfield.fieldtypeid==17){
    this.selectproduct_typeid ='';
    this.suppliersetmanual = (event.target.value)?1:0;
    this.selectproduct_typeiddual =[];
  }
  // this.forms[0].metaData.map((data:any)=>{
  //   /* if(this.fabricIds.includes(data.fieldtypeid))
  //   {
  //     this.inst.get(data.fieldname).setValue('');
  //     if(data.fieldlevel==2)
  //     {
  //       data.optiondefault='';
  //       // data.optionsbackup=[];
  //     }
  //   } */
  //   if(parentfield.fieldtypeid==13 && data.fieldtypeid==17)
  //       this.inst.get(data.fieldname).setValue('');
  //   else if(parentfield.fieldtypeid==17 && data.fieldtypeid==13)
  //       this.inst.get(data.fieldname).setValue('');
  // });
  
 }
    let selectedid=event.target.value;
    if(parentfield.fieldtypeid==11 || parentfield.fieldtypeid==7  || parentfield.fieldtypeid==8  || parentfield.fieldtypeid==31 ){
      this.widthdropfraction.width=selectedid;
      if(selectedid==0)
      this.widthdecimalinches =  0;
      else
      this.widthdecimalinches =  this.Measurementarray?.filter(el => el.id.toString() ==selectedid)[0].decimalvalue
      this.commonwidthdropvalidation(parentfield)
    }else if(parentfield.fieldtypeid==12 || parentfield.fieldtypeid==9  || parentfield.fieldtypeid==10 || parentfield.fieldtypeid==32 ){
      this.widthdropfraction.drop=selectedid;
      if(selectedid==0)
      this.dropdecimalinches = 0;
      else
      this.dropdecimalinches =  this.Measurementarray?.filter(el => el.id.toString() ==selectedid)[0].decimalvalue
      this.commonwidthdropvalidation(parentfield)
    }else if(parentfield.fieldtypeid== 28){
      if(selectedid==0)
      this.numericDecimalInches = 0;
      else
      this.numericDecimalInches =  this.Measurementarray?.filter(el => el.id.toString() ==selectedid)[0].decimalvalue
    }   
    
    parentfield.editruleoverride = 1
    this.orderchangeflag = this.inst.dirty
    if(!event.target.value){
      if(!this.rulescount && !this.formulacount){
        this.ordercalc()
        let unittypeid = ''
        this.forms[0].metaData.map((field:any)=>{
          if(field.fieldtypeid == 34){
            unittypeid = field.optiondefault
           }
        })
        if(this.oneditmode==false){
          let temp:any=Number(unittypeid)
          this.unittypefractionlist(-1,temp)
        }
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      this.getFilterData("widthdropfilter",parentfield)
    }
    if(parentfield.fieldtypeid == 34){
      if(!this.rulescount && !this.formulacount){
        this.ordercalc()
        let unittypeid = ''
        this.forms[0].metaData.map((field:any)=>{
          if(field.fieldtypeid == 34){
            unittypeid = field.optiondefault
           }
        })
        if(this.oneditmode==false){
          let temp:any=Number(unittypeid)
          this.unittypefractionlist(-1,temp)
        }
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(event.target.value){
        this.unittypedata = parentfield.optionsvalue.filter(el => el.optionid == event.target.value)[0].optionname
      }
      else{
        this.unittypedata = ""
      }
    }
    if(event.target.value || selectedid==0){
        if(parentfield.fieldtypeid == 30 || parentfield.fieldtypeid == 34 || this.fabricIds.includes(parentfield.fieldtypeid) || parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 17 || parentfield.fieldtypeid == 4){
        let validationdata = {
          lineitemselectedvalues: this.editorderitemselectedvalues,
          productid: this.selectedproductid,
          supplier: '',
          pricegroup: '',
          fabricid: '',
          colorid: '',
          subfabricid: '',
          subcolorid: '',
          coloriddual:'',
          fabriciddual:'',
          pricegroupdual:'',
          pricegroupmulticurtain:[],
          fabricmulticurtain:[],
          selectedvalues: {'pricegroupmulticurtain':[]},
          orderitemselectedvalues: this.getallselectedvalues(),
          selectedfieldids: [],
          fieldtypeid: '',
          width: '',
          drop: '',          
          customertype: this.productser.customerType,
          changedfieldtypeid: parentfield.fieldtypeid,
          unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault,
          changedfieldid: parentfield?.fieldid
        }
        // validationdata.fieldtypeid = this.fabricIds.includes(parentfield.fieldtypeid) ? parentfield.fieldtypeid : ''
        this.forms[0].metaData.map((data:any)=>{
          validationdata.selectedfieldids.push(data.fieldid)
          if((this.fabricIds.includes(data.fieldtypeid) && data.showfieldonjob) || data.fieldtypeid == 13 || data.fieldtypeid == 17){
            // if(data.optiondefault){
              if(data.optionsbackup.length > 0){
                let optinvaluearray = []
                data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
                if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric != 1 && data.showfieldonjob){
                  if((this.category == 6 && data.multiseq <= 1) || (this.category != 6 && data.dualseq <= 1)){
                  let fieldid = [data.fieldtypeid] + '_' + data.fabricorcolor
                  validationdata.selectedvalues[fieldid]  = optinvaluearray
                }
              }
                else if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric == 1){
                  let fieldid = 'sub_'+ [data.fieldtypeid] + '_' + data.fabricorcolor
                  validationdata.selectedvalues[fieldid]  = optinvaluearray
                }
                else{          
                  if(this.category != 6) {     
                  let arrayname = data.fieldtypeid == 13 ? "pricegrouparray" : "supplierarray"
                  validationdata.selectedvalues[arrayname] = optinvaluearray
                }else{
                  let arrayname = ''
                  if(data.fieldtypeid == 13){
                    if(this.category == 6 && data.multiseq>1){
                      validationdata.selectedvalues['pricegroupmulticurtain'].push({multiseq:data.multiseq,id:optinvaluearray});
                    }else{
                      arrayname ='pricegrouparray'
                      validationdata.selectedvalues[arrayname] = optinvaluearray
                    }
                  }
                  if(data.fieldtypeid == 17){
                    arrayname ='supplierarray';
                    validationdata.selectedvalues[arrayname] = optinvaluearray
                  }
                }
              }
            }
          }
          else{
            if(data.optionsbackup.length > 0){
              let optinvaluearray = []
              data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
              validationdata.selectedvalues[data.fieldid] = optinvaluearray
            }
          }
          let fabricarray=[7,8,11]
          let colorarray=[9,10,12]
          if(fabricarray.includes(data.fieldtypeid)){
            let widthvalue:any = parseFloat(this.widthdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
            validationdata.width = widthvalue
          }
          if(colorarray.includes(data.fieldtypeid)){
            let dropvalue:any = parseFloat(this.dropdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
            validationdata.drop = dropvalue
          }
          if(data.fieldtypeid == 13){
            if(parentfield.fieldtypeid != 17){
              // validationdata.pricegroup = data.optiondefault
              if(this.category != 6){
              if(data.dualseq != 2){
                validationdata.pricegroup = data.optiondefault
              }
             if(data.dualseq == 2){
                validationdata.pricegroupdual = data.optiondefault
              }
            }else{
              if(data.multiseq <= 1){
                validationdata.pricegroup = data.optiondefault
              }
              if(data.multiseq > 1){
                validationdata.pricegroupmulticurtain.push({multiseq:data.multiseq,id:data.optiondefault});
              }
            }
            }
          }
          if(data.fieldtypeid == 17){
            // if(parentfield.fieldtypeid != 13){
              validationdata.supplier = data.optiondefault
            // } 
          }
          if(this.fabricIds.includes(data.fieldtypeid)){
            if(data.fieldtypeid == 20){
              validationdata.colorid = data.optiondefault
            }
            else{
              if(data.fieldlevel == 2){
                //  validationdata.colorid = data.optiondefault 
                if(this.category != 6){
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  validationdata['coloriddual'] = data.optiondefault;
                  } else{
                    validationdata.colorid = data.optiondefault;
                  } 
                }else{
                  if(data.fieldtypeid == 22 && data.multiseq > 1){
                    // validationdata['coloriddual'] = data.optiondefault; // not used in API
                    } else{
                      validationdata.colorid = data.optiondefault;
                    }
                }
              }
              else { 
                if(this.category != 6){
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  validationdata['fabriciddual'] = data.optiondefault;
                }else{
                  validationdata.fabricid = data.optiondefault;
                }
              }else{
                if(data.fieldtypeid == 22 && data.multiseq > 1){
                  validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id: data.optiondefault});
                }else{
                  validationdata.fabricid = data.optiondefault;
                }
              }
              }
            }
          }
        })
        this.forms[0].metaData.filter(el => {
          if(this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 1){
            validationdata.fieldtypeid = el.fieldtypeid
          }
        })
        if(parentfield.fieldtypeid==13 || parentfield.fieldtypeid==17)
        {
         if(parentfield.fieldtypeid==13){
          // validationdata.pricegroup = event.target.value;
          if((this.suppliersetmanual == 1 && validationdata.pricegroup != "" && validationdata.pricegroup != "0") || (this.isdualproduct == 1)){
            validationdata.supplier = (parentfield.optionsvalue.filter(iel=>iel.optionid == validationdata.pricegroup).length > 0)?parentfield.optionsvalue.filter(iel=>iel.optionid == validationdata.pricegroup)[0].mainsupplier:"";
          }else{
            validationdata.supplier = '';
          }
         }
      }
        // if(parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 17)
        // {
        //   validationdata.fabricid = '';
        //   validationdata.colorid ='';
        //   if(parentfield.fieldtypeid == 13)
        //     validationdata.supplier = '';
        //   if(parentfield.fieldtypeid == 17)
        //     validationdata.pricegroup = '';
        // }
        if(parentfield.fieldtypeid == 17 ||  parentfield.fieldtypeid == 13 ){ // for enable loading for mention field type as per selve instruction
          this.orderser.orderformeditflag = '' // for disable loading as per selva instruction
       }
       validationdata['orderItemId'] = this.addeditmode == 'add' ? '' : this.orderid;
        this.orderser.cancelFilterRequests()
        validationdata['apicall'] = this.apiflagcount += 1
        await this.orderser.ordertypevalidation(validationdata).then((res: any) => {
          if(res){
            let fabDual;
            let multiColor;
            if (this.category == 6) {
              fabDual = res[0].data.multifabricidsarray
              multiColor = res[0].data.multicoloridsarray
            } else {
              fabDual = res[0].data.fabricidsarraydual;
              multiColor = res[0].data.coloridsarraydual
            }
            this.filterbasearray = { fabric:res[0].data.fabricidsarray, color: res[0].data.coloridsarray, option: res[0].data.optionarray, fabricdual: fabDual, colordual: multiColor }
            let removedataflag:boolean = false
            this.forms[0].metaData.map((data:any)=>{
              if(parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 17)
              {
                if(this.fabricIds.includes(data.fieldtypeid) && (parentfield.fieldid == data.linktopricegroup || this.isdualproduct == '0'))
                  if (this.category != 6) {
                    data.optiondefault='';
                  }
                  this.forms[0].metaData.map((data:any)=>{
                    if(data.fieldtypeid == 13 && ((!this.onlineflag && data.showfieldonjob == 0) || ((this.onlineflag && data.showFieldOnCustomerPortal==0)))){
                      if(data.optiondefault){
                        data.optiondefault = ''
                      }
                    }
                  })
              }
              if(parentfield.fieldtypeid == 17 && data.fieldtypeid == 13) {
                data.optiondefault = res[0].data.selectproducttypeid;
              }
              if(data.fieldtypeid == 13){
                if(this.category != 6){
                data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
              }else{
                if(data.multiseq <= 1){
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
                  }else if(data.multiseq > 1){
                  let morepricegroupidsarray = res[0].data.multipricegroupidsarray;
                  let morepricegroupidsarrayfiltered = morepricegroupidsarray.filter(el => el.multiseq == data.multiseq);
                  data.optionsvalue = data.optionsbackup.filter(el => morepricegroupidsarrayfiltered[0]?.id?.includes(el.optionid))
                }
              }
                if(data.optiondefault){
                  this.inst.get(data.fieldid.toString()).markAsDirty()
                  if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    this.inst.get(data.fieldid.toString()).markAsPristine()
                    this.removeorderdata(data)
                    removedataflag = true
                  }
                  else {
                    let subgridarray = []
                    subgridarray.push(data)
                    this.rulesdefaultorderitem(subgridarray)
                  }
                }
                else {
                  this.inst.get(data.fieldid.toString()).setValue('')
                    this.removeorderdata(data)
                    removedataflag = true
                }
                            }
              if(data.fieldtypeid == 17){
                if(res[0].data.selectsupplierid != 0){
                  data.optiondefault = res[0].data.selectsupplierid;
                  if(!this.getchangefield.includes(data.fieldid.toString())){
                    this.getchangefield.push(data.fieldid.toString())
                  }
                }
                if(res[0].data.selectsupplierid == 0){
                  data.optiondefault = ''
                }
                // if(res[0].data.supplieridsarray.length == 1 && validationdata.supplier){
                //   data.optiondefault = res[0].data.supplieridsarray.toString()
                // }
                // if(res[0].data.supplieridsarray.length == 1 && validationdata.pricegroup){
                //   data.optiondefault = res[0].data.supplieridsarray.toString()
                // }
                data.optionsvalue = data.optionsbackup.filter(el => res[0].data.supplieridsarray.includes(el.optionid))
                if(data.optiondefault){
                  if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    this.removeorderdata(data)
                    removedataflag = true
                  }
                }
              }
              if(this.fabricIds.includes(data.fieldtypeid)){
                if(data.fieldtypeid == 20){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                  if(data.optiondefault){
                    if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }
                else{
                  if(data.fieldlevel == 2){
                    if(this.category != 6){
                    if(data.dualseq !=2){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                    }
                    if(data.dualseq ==2){ ////for dual fabric and color
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarraydual.includes(el.optionid))
                    }
                  }else{
                    if(data.multiseq <= 1){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                      }
                      if(data.multiseq >1){ ////for multicurtain and color
                        let multicoloridsarray = res[0].data.multicoloridsarray;
                        let multicoloridsarrayfiltered = multicoloridsarray.filter(el => el.multiseq == data.multiseq);
                        data.optionsvalue = data.optionsbackup.filter(el => multicoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                      }
                  }
                    if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                  }else{
                    if(data.fieldtypeid != 21){
                      if(data.multiseq <= 1){
                        if(res[0].data.pricegroupidsarray){
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                        }else{
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                        }
                      }
                      if(data.multiseq >1){ ////for multicurtain and color
                        let multifabricidsarray = res[0].data.multifabricidsarray;
                        let multifabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                        let multipriceidsarray = res[0].data.multipricegroupidsarray;
                        let multipriceidsarrayfiltered = multipriceidsarray.filter(el => el.multiseq == data.multiseq);
                        data.optionsvalue = data.optionsbackup.filter(el => multifabricidsarrayfiltered[0]?.id?.includes(el.optionid) && multipriceidsarrayfiltered[0]?.id.includes(el.pricegroupid));
                      }
                    }
                    else{
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) )
                    }
                      if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                  }
                }
              }
            })
          if(removedataflag){
            if(!this.rulescount && !this.formulacount){
              this.ordercalc()
              let unittypeid = ''
              let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
              if(ind != -1){ unittypeid = this.forms[0].metaData[ind].optiondefault}
              if(this.oneditmode==false){
                let temp:any=Number(unittypeid)
                this.unittypefractionlist(-1,temp)
              }
            }
            if(this.rulescount && !this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
            if(!this.rulescount && this.formulacount){
              this.rulesvalue = 2
              this.rulesbaseprice()
            }
            if(this.rulescount && this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
          }
          
            let removefieldarray = []
            for (const [key, value] of Object.entries(res[0].data.optionarray)) {
              removefieldarray.push(key)
              if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                  let optionvaluearray:any = []
                  optionvaluearray = value
                  let optdefault = ''
                  data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                  if(data.fieldtypeid == 2 || data.fieldtypeid == 3 || data.fieldtypeid == 5 || data.fieldtypeid == 19 || data.fieldtypeid == 20 || data.fieldtypeid == 21 || data.fieldtypeid == 33 || (data.fieldtypeid == 22 && data.issubfabric != 1)){
                    if(data.optiondefault){
                      optdefault = data.optiondefault
                      let splitdefault = data.optiondefault.split(',')
                      let defaultarray = data.optionsvalue.filter(el => data.optiondefault.split(',').includes(el.optionid.toString()))
                      let defaultids = []
                      let defaultnames = []
                      defaultarray.map((val:any)=>{ 
                        defaultids.push(val.optionid)
                        defaultnames.push(val.optionname)
                      })
                      data.optiondefault = defaultids.toString()
                      this.inst.get(data.fieldid.toString()).setValue(defaultnames.toString())
                      if(splitdefault.length != defaultids.length){
                        if(data.optionsvalue.length > 0){
                          let optionvaluefilter = data.optionsvalue.filter(el=>defaultids.includes(el.optionid))
                          if(data.subchild.length > 0){
                            var uniqueResultOne = data.subchild.filter(function(obj) {
                              return !optionvaluefilter.some(function(obj2) {
                                  return obj.forchildsubfieldlinkid == obj2.forchildfieldoptionlinkid
                              })
                            })
                            uniqueResultOne.map((removedata:any)=>{
                              data.subchild = data.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                              this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                              this.removeorderdata(removedata)
                            })
                          }
                        }
                      }
                    }
                  }
                  let optsplitarray = []
                  if(data.optiondefault){
                    optsplitarray = data.optiondefault.split(',')
                    optdefault = data.optiondefault
                  }
                  if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    if(optdefault){
                      this.removeorderdata(data)
                    }
                  }
                })
              }
            }
            this.forms[0].metaData.filter(el => !removefieldarray.includes(el.fieldid.toString())).map(data=>{
              if(data.fieldtypeid !=0 && parentfield.fieldid != data.fieldid){
                if(data.fieldtypeid == 3){
                  data.optiondefault = ''
                  data.optionsvalue = []
                }
              }
            })
          }
          this.orderser.orderformeditflag = ''
          this.cd.markForCheck();
        })
        // .catch((err : any) => {
        //   this.enabledisableflag = false;
        // });
      }
      if(parentfield.fieldtypeid == 34){
        this.unittypevalue = event.target.value ? (parentfield.optionsvalue.filter(el => el.optionid == event.target.value))[0].optionname : ""
      }
      this.orderparentrow = parentfield
      this.selectedcompsetcontrol = e
      this.selectedcompindex = this.forms[0].metaData.findIndex(x => x.fieldid == parentfield.fieldid)
      let widthdroparray=[7,8,11,9,10,12]
      if(parentfield.fieldtypeid != 1 && !widthdroparray.includes(parentfield.fieldtypeid)){
        this.forms[0].metaData[this.selectedcompindex].optiondefault = event.target.value
      }
      const selectedRow = this.forms[0].metaData[this.selectedcompindex].optiondefault.split(',')
      var uniqueResultOne = this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(function(obj) {
        return !selectedRow.some(function(obj2) {
            return obj.optionid.toString() == obj2.toString()
        })
      })
      if(uniqueResultOne.length > 0 && parentfield.fieldtypeid == 2 || parentfield.fieldtypeid == 3 || parentfield.fieldtypeid == 5 || parentfield.fieldtypeid == 19 || parentfield.fieldtypeid == 20 || parentfield.fieldtypeid == 21 || parentfield.fieldtypeid == 22){
        uniqueResultOne.map((splicedata:any,index:any)=>{
          let splitdata = this.forms[0].metaData.filter(el => el.subfieldlinkid == splicedata.fieldoptionlinkid)
          if(splitdata.length > 0){
            this.forms[0].metaData[this.selectedcompindex].subchild = this.forms[0].metaData[this.selectedcompindex].subchild.filter(el => el.subfieldlinkid != splicedata.fieldoptionlinkid)
            this.forms[0].metaData = this.forms[0].metaData.filter(el => el.subfieldlinkid != splicedata.fieldoptionlinkid)
            this.removeorderdata(splitdata[0])
            if(!this.rulescount && !this.formulacount){
              this.ordercalc()
              let unittypeid = ''
              let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
              if( ind == -1 ){
                unittypeid = this.forms[0].metaData[ind].optiondefault
              }
              
              if(this.oneditmode==false){
                let temp:any=Number(unittypeid)
                this.unittypefractionlist(-1,temp)
              }
            }
            if(this.rulescount && !this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
            if(!this.rulescount && this.formulacount){
              this.rulesvalue = 2
              this.rulesbaseprice()
            }
            if(this.rulescount && this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
          }
        })
      }
      setTimeout(() => {
        let dynamicid = parseInt(this.selectedcompindex)
        // $('#subgrid' + dynamicid).focus()
        if(this.singlemultipleflag == 'single'){
          this.enabledisableflag = false
          this.cd.markForCheck();
        }
      }, 500)
      if(this.forms[0].metaData[this.selectedcompindex].field_has_sub_option == 1 && ((!this.onlineflag && this.forms[0].metaData[this.selectedcompindex].showfieldonjob == 1) || (this.onlineflag && this.forms[0].metaData[this.selectedcompindex].showFieldOnCustomerPortal == 1))){
        let linkoptionid=[]
        let subdatacount:number = 0
        let linkoptionarray = this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(el => el.optionid == this.orderparentrow.optiondefault)
        if(linkoptionarray.length > 0){
          linkoptionid.push(this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(el => el.optionid == this.orderparentrow.optiondefault)[0].fieldoptionlinkid)
          subdatacount = this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(el => el.optionid == this.orderparentrow.optiondefault)[0].subdatacount
        }
        let optiondata = ''
        if(this.orderparentrow.optiondefault){
          optiondata = this.orderparentrow.optiondefault.toString().split(',')
        }
        
        if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
          if(this.forms[0].metaData[this.selectedcompindex]?.fieldtypeid == "13"){
            this.removeorderdata(this.forms[0].metaData[this.selectedcompindex]);
          }
        }          
        
        if(subdatacount > 0){
          let subgriddata = { optionid : optiondata,subfieldoptionlinkid : linkoptionid,productionformulalist : this.orderproductiondata,orderitemselectedvalues: this.getallselectedvalues(),unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault}
          let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
          this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
          await this.orderser.dumygetorderitemsublevel(contactid,this.receipe,this.orderparentrow.fieldlevel + 1,subgriddata,this.orderparentrow.fieldtypeid,this.orderparentrow.masterparentfieldid).toPromise().then((res: any) => {
            if(this.receipedisabledflag){
              if(res[0].data.length > 0){
                res[0].data.map((subfield:any)=>{
                  if(subfield.optiondefault || subfield.value){
                    if(!this.getchangefield.includes(subfield.fieldid.toString())){
                      this.getchangefield.push(subfield.fieldid.toString())
                    }
                  }
                })
              }
            }
            if(Object.keys(this.filterbasearray.option).length > 0){
              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                  this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                    let optionvaluearray:any = []
                    optionvaluearray = value
                    data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                    let optsplitarray = []
                    if(data.optiondefault){
                      optsplitarray = data.optiondefault.split(',')
                    }
                    if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                    }
                  })
                }
                else{
                  res[0].data.map((filter:any)=>{
                    for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                      if(filter.fieldid == key){
                        let optionvaluearray:any = []
                        optionvaluearray = value
                        if(optionvaluearray.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                          let optsplitarray = []
                          if(filter.optiondefault){
                            optsplitarray = filter.optiondefault.split(',')
                          }
                          if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                            filter.optiondefault = ''
                          }
                        }
                        else{
                          filter.optionsvalue = []
                          filter.optiondefault = ''
                        }
                      }
                    }
                  })
                }
              }
             }
             if(res[0].data.length > 0){
              res[0].data.map((filter:any)=>{
                if(this.fabricIds.includes(filter.fieldtypeid)){
                  if(filter.fieldtypeid == 20){
                    if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                      if(this.filterbasearray.color.length > 0){
                        filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                      }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                  }
                  else{
                    if(filter.fieldlevel == 1){
                      if(this.category != 6){
                      if(filter.dualseq !=2){
                        if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabric.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                        }
                      }
                      if(filter.dualseq ==2){////for dual fabric and color
                        if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabricdual.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabricdual.includes(el.optionid))
                        }
                      }
                    }else{
                      if(filter.multiseq <= 1){
                        if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabric.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                        }
                      }
                      if(filter.multiseq >1){////for multicurtain and color
                        if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabricdual.length > 0){
                          let morefabricidsarrayfiltered = this.filterbasearray.fabricdual.filter(el => el.multiseq == filter.multiseq);
                          filter.optionsvalue = filter.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));
                        }
                      }
                    }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                    }
                    if(filter.fieldlevel == 2){
                      if(this.category != 6){
                      if(filter.dualseq !=2){
                        if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.color.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                        }
                      }
                      if(filter.dualseq ==2){////for dual fabric and color
                        if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.colordual.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.colordual.includes(el.optionid))
                        }
                      }
                    }else{
                      if(filter.multiseq <= 1){
                        if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.color.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                        }
                      }
                      if(filter.multiseq >1){////for multicurtain and color
                        if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.colordual.length > 0){
                          let morecoloridsarrayfiltered = this.filterbasearray.colordual.filter(el => el.multiseq == filter.multiseq);
                          filter.optionsvalue = filter.optionsbackup.filter(el => morecoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                        }
                      }
                    }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                    }
                  }
                }
              })
            }
              if(this.forms[0].metaData[this.selectedcompindex].subchild){
                if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
                  res[0].data.map((subfilter:any)=>{
                    const found = this.forms[0].metaData[this.selectedcompindex].subchild.some(el => el.subfieldlinkid == subfilter.subfieldlinkid)
                    if(!found){
                      this.forms[0].metaData[this.selectedcompindex].subchild.push(subfilter)
                    }
                  })
                }
                else{
                  this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                }
              }
              else{
                this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
              }
              if(res[0].data.length > 0){
                res[0].data.map((data:any)=>{
                  if(this.fabricIds.includes(data.fieldtypeid)){
                    if(data.fieldtypeid == 20){
                      this.filterarray.color = data.optionsbackup
                    }
                    else{
                      if(data.fieldlevel == 2){ this.filterarray.color = data.optionsbackup }
                      else { this.filterarray.fabric = data.optionsbackup }
                    }
                  }
                  if(data.fieldtypeid == 13){
                    this.filterarray.pricegroup = data.optionsbackup
                  }
                  if(data.fieldtypeid == 17){
                    this.filterarray.supplier = data.optionsbackup
                  }
                })
                if(this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                  res[0].data.forEach((v,i)=>{
                    v['dumydata'] = []
                    if(v['widthfraction']){
                      v['blindswidth'] = v['widthfraction'].split('_')[0]
                    }
                    else{
                      v['blindswidth'] = 0
                    }
                    if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
                      if(v?.value == 'null'){ v.value = '' }
                      this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))
                    }
                    else {
                      this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
                    }
                    if(v.fieldtypeid == 28){
                      if(v?.value == 'null'){ v.value = '' }
                      this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control('0',this.mapValidators(v.mandatory)))
                    }
                    // this.inst.get(this.forms[0].metaData[this.selectedcompindex].subchild[0].fieldname).setValue('')
                    const found = this.forms[0].metaData.some(el => el.fieldid === v.fieldid)
                    if(!found){
                      if(v.optiondefault == '' && v.value == ''){this.inst.get(v.fieldid.toString()).setValue('')}
                      this.forms[0].metaData.map((indexdata:any,index:any)=>{
                        if(indexdata.optionsvalue.length > 0){
                          indexdata.optionsvalue.map((linkid:any,j:any)=>{
                            if(linkid.forchildfieldoptionlinkid == v.forchildsubfieldlinkid){
                              this.selectedcompindex = index
                            }
                          })
                        }
                      })
                      let subindex = 0
                      subindex = i + 1
                      this.forms[0].metaData = this.insertfieldfn(this.forms[0].metaData, this.selectedcompindex+subindex, v)
                      //  this.loadcomboGrid(true,this.selectedcompindex+subindex)
                      let orderarraylength:number = this.forms[0].metaData.length
                      if(orderarraylength > 10){
                        this.orderlength = (orderarraylength / 2)
                        if(this.orderlength <= 10) this.orderlength = 10
                      }
                      else this.orderlength = 10
                    }
                  })
                }
                if(this.forms[0].metaData[this.selectedcompindex].subchild && this.forms[0].metaData[this.selectedcompindex].subchild.length > 0)
                this.defaultorderitem(this.forms[0].metaData[this.selectedcompindex].subchild)
              }
              if(Object.keys(this.filterbasearray.option).length > 0){
                for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                  if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                    this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                      let optionvaluearray:any = []
                      optionvaluearray = value
                      data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                      let optsplitarray = []
                      if(data.optiondefault){
                        optsplitarray = data.optiondefault.split(',')
                      }
                      if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        if(data.subchild.length > 0){
                          var uniqueResultOne = data.subchild
                          uniqueResultOne.map((removedata:any)=>{
                            data.subchild = []
                            this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                            this.removeorderdata(removedata)
                          })
                        }
                      }
                    })
                  }
                  else{
                    res[0].data.map((filter:any)=>{
                      for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                        if(filter.fieldid == key){
                          let optionvaluearray:any = []
                          optionvaluearray = value
                          if(optionvaluearray.length > 0){
                            filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                            let optsplitarray = []
                            if(filter.optiondefault){
                              optsplitarray = filter.optiondefault.split(',')
                            }
                            if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                              filter.optiondefault = ''
                            }
                          }
                          else{
                            filter.optionsvalue = []
                            filter.optiondefault = ''
                          }
                        }
                      }
                    })
                  }
                }
               }
               this.cd.markForCheck();
          })
        }
      }
      if(!this.rulescount && !this.formulacount){
        this.ordercalc()
        let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
        let unittypeid = ""
        if(ind){
          unittypeid = this.forms[0].metaData[ind].optiondefault
        }
        if(this.oneditmode==false){
          let temp:any=Number(unittypeid)
          this.unittypefractionlist(-1,temp)
        }
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
    }
    if(parentfield.fieldtypeid==13 || parentfield.fieldtypeid==17)
    {
      this.forms[0].metaData.map((data:any)=>{
        if(this.fabricIds.includes(data.fieldtypeid))
        {
          if(parentfield.fieldtypeid==13){
            if(data.linktopricegroup == parentfield.fieldid || this.isdualproduct == '0' && this.category!=6){
              setTimeout(() => {
                data.optiondefault='';
                this.inst.get(data.fieldid.toString()).setValue('');
                this.removeorderdata(data);
                this.cd.markForCheck();
              }, 800);
            }
          }else{
            setTimeout(() => {
              data.optiondefault='';
              this.inst.get(data.fieldid.toString()).setValue('');
              this.removeorderdata(data);
              this.widthminmaxvalue = '';
              this.dropminmaxvalue = '';
              this.numericminmaxvalue = '';
              this.widthdropmsg = '';
              this.widthdropflag = false
              this.dynamicwidthtypeid && this.inst.controls[this.forms[0].metaData.find(el => el.fieldtypeid == this.dynamicwidthtypeid)?.fieldid.toString()]?.setErrors(null);
              this.dynamicdroptypeid && this.inst.controls[this.forms[0].metaData.find(el => el.fieldtypeid == this.dynamicdroptypeid)?.fieldid.toString()]?.setErrors(null);
              this.cd.markForCheck();
            }, 800);
          }
        }
      });
    }
    if(parentfield.fieldtypeid == 34 || parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 11 || parentfield.fieldtypeid == 12 || parentfield.fieldtypeid == 8 || parentfield.fieldtypeid == 10 || parentfield.fieldtypeid == 7 || parentfield.fieldtypeid == 9 || parentfield.fieldtypeid == 31 || parentfield.fieldtypeid == 32){
      // this.commonwidthdropvalidation(parentfield)
    }
    if(parentfield?.fieldtypeid==13 && !this.rulescount){
       this.commonwidthdropvalidation(parentfield)
    }
    if( parentfield.fieldtypeid == 17 || parentfield.fieldtypeid == 13){
        setTimeout(() => {
         this.loadFormValue()
          this.cd.markForCheck();
      }, 600);
    }
    this.cd.markForCheck();
  }
//order item default from form change
  async defaultorderitem(defaultdatadata){
    let optionimagearr = []
    return new Promise(async (resolve, reject) => {
      let widthid =''
      let dropid =''
      for(let data of defaultdatadata){
        if(this.singlemultipleflag == 'single'){
          this.enabledisableflag = true
        }
        this.orderparentrow = data
        this.orderfieldid = data.fieldid
        const selectedRow = []
        selectedRow.push(data)
        if(selectedRow.length > 0){
          let splitarray = []
          if(data.optiondefault){
            let subdatacount:number = 0
            splitarray = data.optiondefault.toString().split(',')
            for(let splitvalue of splitarray){
              let linkoptionid:any =[]
              if(splitvalue){
                const optiondata = data.optionsvalue.filter(el => splitarray.includes(el.optionid.toString()))
                let optionnamearray:any = []
                optiondata.map((optvalue:any)=>{
                  if(this.fabricIds.includes(data.fieldtypeid) && data.fieldlevel==1 && data.fieldtypeid!=21)
                  {
                    if(this.category != 6){
                    if(this.selectproduct_typeid==optvalue.pricegroupid || this.selectproduct_typeiddual==optvalue.pricegroupid){
                      optionnamearray.push(optvalue.optionname)
                    }
                  }else{
                    let findind = this.selectproduct_typeiddual.filter((re => re.multiseq == data.multiseq));
                    if(this.selectproduct_typeid==optvalue.pricegroupid || findind[0]?.id==optvalue.pricegroupid){ //multiCurtainCode changes
                      optionnamearray.push(optvalue.optionname)
                    }
                  }
                    if(optionnamearray.length == 0){
                      data.optiondefault = ''
                    }
                  }
                  else
                    optionnamearray.push(optvalue.optionname)

                  if(optvalue?.optionimage){
                    if(data.fabricorcolor == '2'){
                      let flagdata = optvalue;
                      flagdata['flagcolor']=1;
                      this.colorimageurl = this.envImageUrl + optvalue?.optionimage + "?nocache=" + this.timestamp;
                    }
                    optionimagearr = optionimagearr.concat(optvalue)  
                  } 
                  // linkoptionid.push(optvalue.fieldoptionlinkid)
                })
                let linkdata = data.optionsvalue.filter(el => el.optionid == splitvalue)
                if(linkdata[0])
                {
                  linkoptionid.push(data.optionsvalue.filter(el => el.optionid == splitvalue)[0].fieldoptionlinkid)
                  subdatacount = data.optionsvalue.filter(el => el.optionid == splitvalue)[0].subdatacount
                }
                if(data.fieldtypeid != 13){
                  this.inst.get(data.fieldid.toString()).setValue(optionnamearray.toString())
                }
              }
              if(this.fabricIds.includes(data.fieldtypeid) && data.fieldlevel == 2){ 
                if(this.singlemultipleflag == 'single'){
                  this.enabledisableflag = false
                }
              }
              else{
                if(data.field_has_sub_option == 1 && data.optiondefault && ((!this.onlineflag && data.showfieldonjob == 1) || (this.onlineflag && data.showFieldOnCustomerPortal == 1))){
                  let optiondata:any =[]
                  optiondata.push(splitvalue)
                  if(subdatacount > 0){
                    let subgriddata = { optionid : optiondata,subfieldoptionlinkid : linkoptionid,productionformulalist : this.orderproductiondata,orderitemselectedvalues: this.getallselectedvalues(),unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault}
                    let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
                    this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
                    await this.orderser.dumygetorderitemsublevel(contactid,this.receipe,data.fieldlevel + 1,subgriddata,data.fieldtypeid,data.masterparentfieldid).toPromise().then(async (res: any) => {
                      if(this.receipedisabledflag){
                        if(res[0].data.length > 0){
                          res[0].data.map((subfield:any)=>{
                            if(subfield.optiondefault || subfield.value){
                              if(!this.getchangefield.includes(subfield.fieldid.toString())){
                                this.getchangefield.push(subfield.fieldid.toString())
                              }
                            }
                          })
                        }
                      }
                      if(Object.keys(this.filterbasearray.option).length > 0){
                        for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                          if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                            this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                              let optionvaluearray:any = []
                              optionvaluearray = value
                              data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                              let optsplitarray = []
                              if(data.optiondefault){
                                optsplitarray = data.optiondefault.split(',')
                              }
                              if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                data.optiondefault = ''
                                this.inst.get(data.fieldid.toString()).setValue('')
                              }
                            })
                          }
                          else{
                            res[0].data.map((filter:any)=>{
                              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                                if(filter.fieldid == key){
                                  let optionvaluearray:any = []
                                  optionvaluearray = value
                                  if(optionvaluearray.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                                    let optsplitarray = []
                                    if(filter.optiondefault){
                                      optsplitarray = filter.optiondefault.split(',')
                                    }
                                    if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                      filter.optiondefault = ''
                                    }
                                  }
                                  else{
                                    filter.optionsvalue = []
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            })
                          }
                        }
                       }
                       if(res[0].data.length > 0){
                        res[0].data.map((filter:any)=>{
                          if(this.fabricIds.includes(filter.fieldtypeid)){
                            if(filter.fieldtypeid == 20){
                              if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                if(this.filterbasearray.color.length > 0){
                                  filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                            }
                            else{
                              if(filter.fieldlevel == 1){
                                if(this.category != 6){
                                if(filter.dualseq != 2){
                                  if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabric.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                                  }
                                }
                                if(filter.dualseq ==2){ ////for dual fabric and color
                                  if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabricdual.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabricdual.includes(el.optionid))
                                  }
                                }
                              }else{
                                if(filter.multiseq <= 1){
                                  if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabric.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                                  }
                                }
                                if(filter.multiseq >1){ ////for multicurtain and color
                                  if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.fabricdual.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabricdual.includes(el.optionid))
                                  }
                                }
                              }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                              if(filter.fieldlevel == 2){
                                if(this.category != 6){
                                if(filter.dualseq != 2){
                                  if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.color.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                  }
                                }
                                if(filter.dualseq ==2){ ////for dual fabric and color
                                  if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.colordual.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.colordual.includes(el.optionid))
                                  }
                                }
                              }else{
                                if(filter.multiseq <= 1){
                                  if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.color.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                                  }
                                }
                                if(filter.multiseq >1){ ////for multicurtain and color
                                  if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                                  if(this.filterbasearray.colordual.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.colordual.includes(el.optionid))
                                  }
                                }
                              }
                                if(filter.optiondefault){
                                  if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            }
                          }
                        })
                      }
                      this.forms[0].metaData.map((el:any,ij:any)=>{
                        if(el.fieldid == data.fieldid){
                          this.selectedcompindex = ij
                        }
                        let widtharray = [7,8,11,31]
                        let droparray = [9,10,12,32]
                        if(this.widthminmaxvalue){
                          if(widtharray.includes(el.fieldtypeid)){
                            widthid = el.fieldid
                          }
                        }
                        if(this.dropminmaxvalue){
                          if(droparray.includes(el.fieldtypeid)){
                            dropid = el.fieldid
                          }
                        }
                      })
                      if(this.forms[0].metaData[this.selectedcompindex].subchild){
                        if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
                          res[0].data.map((subfilter:any)=>{
                            const found = this.forms[0].metaData[this.selectedcompindex].subchild.some(el => el.subfieldlinkid == subfilter.subfieldlinkid)
                            if(!found){
                              this.forms[0].metaData[this.selectedcompindex].subchild.push(subfilter)
                            }
                          })
                        }
                        else{
                          this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                        }
                      }
                      else{
                        this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                      }
                      if(res[0].data.length > 0){
                        res[0].data.map((data:any)=>{
                          if(this.fabricIds.includes(data.fieldtypeid)){
                            if(data.fieldtypeid == 20){
                              this.filterarray.color = data.optionsbackup
                            }
                            else{
                              if(data.fieldlevel == 2){ this.filterarray.color = data.optionsbackup }
                              else { this.filterarray.fabric = data.optionsbackup }
                            }
                          }
                          if(data.fieldtypeid == 13){
                            this.filterarray.pricegroup = data.optionsbackup
                          }
                          if(data.fieldtypeid == 17){
                            this.filterarray.supplier = data.optionsbackup
                          }
                        })
                        if(this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                          for(let v=0;v<=res[0].data.length - 1;v++){
                            // res[0].data.forEach(async (v,i)=>{
                              res[0].data[v]['dumydata'] = []
                              if(res[0].data['widthfraction']){
                                res[0].data['blindswidth'] = v['widthfraction'].split('_')[0]
                              }
                              else{
                                res[0].data['blindswidth'] = 0
                              }
                              if(res[0].data[v].fieldtypeid == 1 || res[0].data[v].fieldtypeid == 29 || res[0].data[v].fieldtypeid == 18 || res[0].data[v].fieldtypeid == 11 || res[0].data[v].fieldtypeid == 14 || res[0].data[v].fieldtypeid == 1 || res[0].data[v].fieldtypeid == 12 || res[0].data[v].fieldtypeid == 6 || res[0].data[v].fieldtypeid == 7 || res[0].data[v].fieldtypeid == 8 || res[0].data[v].fieldtypeid == 9 || res[0].data[v].fieldtypeid == 10 || res[0].data[v].fieldtypeid == 31 || res[0].data[v].fieldtypeid == 32){
                                if(res[0].data[v]?.value == 'null'){ res[0].data[v].value = '' }
                                this.inst.addControl(res[0].data[v].fieldid,this.fb.control(res[0].data[v]?.value ?? '',this.mapValidators(res[0].data[v].mandatory)))
                              }
                              else{
                                this.inst.addControl(res[0].data[v].fieldid,this.fb.control(null,this.mapValidators(res[0].data[v].mandatory)))
                              }
                              if(this.widthminmaxvalue){
                                this.inst.controls[widthid.toString()].setErrors({ errors: true })
                              }
                              if(this.dropminmaxvalue){
                                this.inst.controls[dropid.toString()].setErrors({ errors: true })
                              }
                              // this.inst.get(this.forms[0].metaData[this.selectedcompindex].subchild[0].fieldname).setValue('')
                              const found = this.forms[0].metaData.some(el => el.fieldid === res[0].data[v].fieldid)
                              if(!found){
                                if(res[0].data[v].optiondefault == '' && res[0].data[v].value == ''){this.inst.get(res[0].data[v].fieldid.toString()).setValue('')}
                                this.forms[0].metaData.map((order:any,orderindex:any)=>{
                                  if(v == 0){
                                    if(order.optionsvalue.length > 0){
                                      let ind = order.optionsvalue.findIndex(linkid => linkid.forchildfieldoptionlinkid == res[0].data[v].forchildsubfieldlinkid)
                                      if( ind != -1){
                                        this.selectedcompindex = orderindex
                                      }
                                    }
                                  }
                                  else{
                                    if(order.optionsvalue.length > 0){
                                      let ind = order.optionsvalue.findIndex(linkid => linkid.forchildfieldoptionlinkid == res[0].data[v].forchildsubfieldlinkid)
                                      if(ind){
                                        this.selectedcompindex = orderindex
                                      }
                                    }
                                  }
                                })
                                let subindex = 0
                                subindex = v + 1
                                this.forms[0].metaData = this.insertfieldfn(this.forms[0].metaData, this.selectedcompindex+subindex, res[0].data[v])
                                //  this.loadcomboGrid(true,this.selectedcompindex+subindex)
                                if(!this.rulescount && !this.formulacount){
                                  await this.ordercalc()
                                  let unittypeid = ''
                                  let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
                                  if( ind != -1 ){
                                    unittypeid = this.forms[0].metaData[ind].optiondefault
                                  }
                                  if(this.oneditmode==false){
                                    let temp:any=Number(unittypeid)
                                    this.unittypefractionlist(-1,temp)
                                  }
                                }
                                if(this.rulescount && !this.formulacount){
                                  this.rulesvalue = 1
                                  await this.subfieldrule()
                                }
                                if(!this.rulescount && this.formulacount){
                                  this.rulesvalue = 2
                                  await this.subfieldrule()
                                }
                                if(this.rulescount && this.formulacount){
                                  this.rulesvalue = 1
                                  await this.rulesbaseprice()
                                }
                                let orderarraylength:number = this.forms[0].metaData.length
                                if(orderarraylength > 10){
                                  this.orderlength = (orderarraylength / 2)
                                  if(this.orderlength <= 10) this.orderlength = 10
                                }
                                else this.orderlength = 10
                              }
                            // })
                          }
                        }
                      }
                      if(this.singlemultipleflag == 'single'){
                        this.enabledisableflag = false
                      }
                      if(Object.keys(this.filterbasearray.option).length > 0){
                        for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                          if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                            this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                              let optionvaluearray:any = []
                              optionvaluearray = value
                              data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                              let optsplitarray = []
                              if(data.optiondefault){
                                optsplitarray = data.optiondefault.split(',')
                              }
                              if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                data.optiondefault = ''
                                this.inst.get(data.fieldid.toString()).setValue('')
                                if(data.subchild.length > 0){
                                  var uniqueResultOne = data.subchild
                                  uniqueResultOne.map((removedata:any)=>{
                                    data.subchild = []
                                    this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                                    this.removeorderdata(removedata)
                                  })
                                }
                              }
                            })
                          }
                          else{
                            res[0].data.map((filter:any)=>{
                              for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                                if(filter.fieldid == key){
                                  let optionvaluearray:any = []
                                  optionvaluearray = value
                                  if(optionvaluearray.length > 0){
                                    filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                                    let optsplitarray = []
                                    if(filter.optiondefault){
                                      optsplitarray = filter.optiondefault.split(',')
                                    }
                                    if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                                      filter.optiondefault = ''
                                    }
                                  }
                                  else{
                                    filter.optionsvalue = []
                                    filter.optiondefault = ''
                                  }
                                }
                              }
                            })
                          }
                        }
                       }
                    })
                    // if(this.closeflag){
                    //   this.fieldnameTerms.next('test')
                    // }
                  }
                  else{
                    if(this.singlemultipleflag == 'single'){
                      this.enabledisableflag = false
                    }
                  }
                }
                else{
                  if(this.singlemultipleflag == 'single'){
                    this.enabledisableflag = false
                  }
                }
              }
            }
            if(data.subchild && data.subchild.length > 0){
              await this.defaultorderitem(data.subchild)
            }
           
          }
          else{
            if(this.singlemultipleflag == 'single'){
              this.enabledisableflag = false
            }
          }
        }
        else{
          if(this.singlemultipleflag == 'single'){
            this.enabledisableflag = false
          }
        }
      }
      if(!this.rulescount && !this.formulacount){
        this.ordercalc()
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        this.rulesbaseprice()
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        this.rulesbaseprice()
      }
      this.setCarouselImage(optionimagearr)
      this.cd.markForCheck();
      resolve(null)
    })
  }
 //sub field rule base price calc
  async subfieldrule(){
    // alert('jjjj')
    this.orderpricechangeflag = this.orderpricechangeflag + 1
    let saveorderarray = []
    let widthvalue = ''
    let dropvalue = ''
    let numericvalue ='';
    let qtyvalue = ''
    let optionarray:any =[]
    let optionarraydual:any =[]
    let orderunitype = ''
    let calctestdata:any =[]
    let optlinkarray = []
    let blindopeningwidtharray:any=[]
    let dummyarg = 3
    let fabncoldetails = {
      fabricid : '',
      fabriciddual : '',
      colorid : '',
      coloriddual : '',
      subfabricid : '',
      subcolorid : '',
    }
    this.forms[0].metaData.map((data:any,index:any)=>{
      if(data.fieldtypeid == 1){
        let joinvalue:any = ''
        if(this.inst.value[data.fieldid] && !data.blindswidth){
          joinvalue =  parseFloat(this.inst.value[data.fieldid])
        }
        if(data.blindswidth && !this.inst.value[data.fieldid]){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue = this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue
          }
        }
        if(this.inst.value[data.fieldid] && data.blindswidth){
          joinvalue = data.blindswidth != '0' && data.blindswidth != 'undefined' ? parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue) : parseFloat(this.inst.value[data.fieldid])
        }
        if(joinvalue){
          blindopeningwidtharray.push(joinvalue)
        }
      }
      if(data.optiondefault){
        let optdefault = data.optiondefault.toString().split(',')
        optlinkarray = []
        if(data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).length == 0){
          optlinkarray.push(data['valueid'])
        }
        else{
          data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).map((select:any)=>{optlinkarray.push(select.fieldoptionlinkid)})
        }
        if(data.fieldtypeid != 0){
          let valuesplit = data.optiondefault.toString().split(',')
          valuesplit.map((value:any)=>{
            let defaultoptionname =  data.optionsvalue.filter(o1 => o1.optionid == value)
            if(defaultoptionname.length > 0){
              calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:data.fieldtypeid,optionqty:1})
            }
            else{
              if(data.optiondefault && data['valueid']){
                calctestdata.push({optionvalue:parseFloat(data.optiondefault),fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
              }
            }
          })
        }
      }
      if(data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31){
        widthvalue = this.inst.value[data.fieldid.toString()]
        if( this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3){
         	  
		   if(isNaN(parseFloat(widthvalue))){
        widthvalue="0";
      }
          let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthvalue)
          widthvalue= widthvalue1;
        } 
      }
      if(data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32){
        dropvalue = this.inst.value[data.fieldid.toString()]
        if( this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3){
          if(isNaN(parseFloat(dropvalue))){
            dropvalue="0";
          }
          let dropvalue1:any = parseFloat(this.dropdecimalinches) + parseFloat(dropvalue)
          dropvalue= dropvalue1;
        }
      }     
      if(data.fieldtypeid == 14){
        qtyvalue = this.inst.value[data.fieldid.toString()]
      }
      if(data.fieldtypeid == 13){
        if(data.optiondefault){
          if(this.category != 6){
          if(data.dualseq == 2){
            optionarraydual.push(data.optiondefault);
          }
          if(data.dualseq != 2){
          optionarray.push(data.optiondefault)
          }
        }else{
          if(data.multiseq > 1){
            optionarraydual.push({multiseq:data.multiseq,id:data.optiondefault});
          }
          if(data.multiseq <= 1){
          optionarray.push(data.optiondefault)
          }
        }
        }
      }
      if(data.fieldtypeid == 34){
        orderunitype = data.optiondefault
        if(data.optiondefault) { this.unittypevalue = (data.optionsvalue.filter(el => el.optionid == data.optiondefault))[0].optionname }
        else { this.unittypevalue = ''}
      }
      let ordervalue = ''
      let quantityarray = []
      let lengthArray = []
      if(data.optionsvalue.length > 0){
        data.optionsvalue.map((qty:any)=>{
          if( data.fieldtypeid != 33 ){
            if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.optionqty){
                  quantityarray.push(qty.optionqty)
                }
              }
            }
          }else{
             if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.qty){
                  quantityarray.push(qty.qty)
                  lengthArray.push(qty["length"])
                }
              }
            }
          }
          if(data.optiondefault && data['valueid']){
            if(quantityarray.length == 0){
              quantityarray.push(1)
            }
          }
        })
      }
      if(data.fieldtypeid == 34 || data.fieldtypeid == 4 || data.fieldtypeid == 13 || data.fieldtypeid == 17 || data.fieldtypeid == 30){
        if(this.inst.value[data.fieldid.toString()]){
          if(data.optionsvalue.length>0){
            ordervalue = data.optionsvalue.filter(el => el.optionid.toString() == this.inst.value[data.fieldid].toString())[0]?.optionname
          }
        }
      }
      else{
        ordervalue = this.inst.value[data.fieldid.toString()]
      }
      let format:any = {
        id: data.fieldid,
        labelname: data.fieldname,
        value: ordervalue ? [...new Set(ordervalue.toString().split(','))].join(',') : '',
        valueid: data?.optiondefault && optlinkarray ?  [...new Set(optlinkarray.toString().split(','))].join(',') : '',
        quantity: quantityarray.length > 0 ?  quantityarray.toString() : '',
        type: data.fieldtypeid,
        optionid: data.optiondefault ? data.optiondefault : '',
        fabricorcolor: data.fabricorcolor,
        labelnamecode : data.labelnamecode ? data.labelnamecode : '',
        issubfabric : data.issubfabric ? data.issubfabric : 0,
        fractionValue : data.fieldtypeid == 1 ? parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.find(el=>el.id == data.blindswidth)?.decimalvalue) : 0

      }
      if(data.fieldtypeid == 33){
        format.length = lengthArray.toString()
      }
      if(data.fieldtypeid == 28){
        Object.assign(format,{numfrac:this.numfracvalue(data)})
      }
      if(data.editruleoverride==1){
        Object.assign(format,{editruleoverride:1})
      }else{
        Object.assign(format,{editruleoverride:0})
      }
      saveorderarray.push(format)

      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          fabncoldetails.colorid = data.optiondefault
        }
        else{
          if(data.fieldlevel == 2 && data.issubfabric != 1){
             if(data.fieldtypeid == 5 && data.dualseq == 2){
              fabncoldetails['coloriddual'] = data.optiondefault;
              } else{
                fabncoldetails.colorid = data.optiondefault;
              }
            }else if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
              fabncoldetails.subfabricid = data.optiondefault;
            }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
              fabncoldetails.subcolorid = data.optiondefault;
            }
          else { 
            if(dummyarg==1){
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = this.softfurningfabricid;
              }else{
                fabncoldetails.fabricid =  this.softfurningfabricid;
              }
            }
            else{
              if(dummyarg==2)
              {
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = '';
                }else{
                  fabncoldetails.fabricid = "";
                }
              }
              else{
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = data.optiondefault;
              }else{
                fabncoldetails.fabricid = data.optiondefault;
              }
              }
            }
           }
        }
      }
    })
    let productionoverridarray = this.orderproductiondata.map((pro: any) => ({
      id: pro.fs_id,
      productionoveride: pro.productionoverrideeditflag,
      productioneditedvalue: pro.productionoverrideeditflag === 1 ? pro.pricevalue : ''
    }));
    let pricecalc:any = {
      vatpercentage: this.vatcalctoggle ?  this.returnvatvalue() : 0,
      blindopeningwidth: blindopeningwidtharray,
      recipeid: this.receipe,
      productid: this.selectedproductid,
      orderitemdata: saveorderarray,
      supplierid: 51,
      mode: optionarray.length > 0 ? 'pricetableprice' : '',
      width: widthvalue ? widthvalue : '',
      drop: dropvalue ? dropvalue : '',
      pricegroup: optionarray.length > 0 ? optionarray : '',
      pricegroupdual:this.category !=6 ? optionarraydual.length > 0 ? optionarraydual : '' : '',///for dual fabric
      pricegroupmulticurtain:this.category == 6 ?optionarraydual.length > 0 ? optionarraydual : []:[],///for multicurtain
      customertype: this.productser.customerType,
      optiondata: calctestdata,
      unittype: orderunitype,
      orderitemqty: qtyvalue,
      jobid: this.route.snapshot.paramMap.get('id'),
      customerid:this.productser.customerid ? this.productser.customerid : this.productser.existingcusID,
      rulemode : this.subrulesvalue == 1 ? 0 : 1,
      productionoveridedata: productionoverridarray,
      ...fabncoldetails
    }
   if(this.oneditmode==false){
    let temp:any=Number(orderunitype);
     this.unittypefractionlist(-1,temp);  
   }
  //  this.orderser.cancelruleRequests();
    await this.orderser.rulesbasecalc(pricecalc).toPromise().then(async (res: any) => {
      this.reportpriceresults = res.reportpriceresults
      this.productionmaterialcostprice = res.productionmaterialcostprice
      this.materialFormulaPrice = res.materialFormulaPrice;
      this.productionmaterialnetprice = res.productionmaterialnetprice
      this.productionmaterialnetpricewithdiscount = res.productionmaterialnetpricewithdiscount
      this.getpricegroupprice = res?.getpricegroupprice
      this.subrulesvalue = this.subrulesvalue + 1
      this.productionresults = res.productionresults
      if(this.orderproductiondata.length > 0){
        if(res.productionresults.length >0){
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
            // pro['productionmode'] = 0
            // pro['productionoverrideeditflag'] = 0
          })
          res.productionresults.map((data:any)=>{
            if( data[0].battenstype != 0){ // implement battens LA-I567
            this.orderproductiondata.map((price:any)=>{
              if(data[0].fs_id == price.fs_id){
                if(data[0].bom == 0) {
                  this.forms[0].metaData.map((val:any)=>{
                    if(val.fieldtypeid!=0){
                      if(val.fieldtypeid == 29 || val.fieldtypeid == 18 || val.fieldtypeid == 11 || val.fieldtypeid == 14 || val.fieldtypeid == 1 || val.fieldtypeid == 12 || val.fieldtypeid == 6 || val.fieldtypeid == 7 || val.fieldtypeid == 8 || val.fieldtypeid == 9 || val.fieldtypeid == 10 || val.fieldtypeid == 31 || val.fieldtypeid == 32){
                        if(this.inst.get(val.fieldid.toString()).value){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          // price.productionmode = data[0].productionoveridevalue
                          price.pricecalvalue = data[0].formulatype == 0 ? data[0].productionprice : data[0].getcostprice
                          price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                        }
                      }
                      if(val.optiondefault){
                        let result = val.optionsvalue.filter(o1 => data.some(o2 => o1.optionid == o2.optionid))
                        if(result.length > 0){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          // price.productionmode = data[0].productionoveridevalue
                          price.pricecalvalue = data[0].formulatype == 0 ? data[0].productionprice : data[0].getcostprice
                          price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                        }
                      }
                    }
                  })
                }
                else if(data[0].bom == 1) {
                  price.pricevalue = data[0].formularesult
                  price.showhideflag = data[0].formularesult ? 1 : 0
                  price.unittype = data[0].jobunittype
                  // price.productionmode = data[0].productionoveridevalue
                  if(data[0].formulatype == 0){
                    price.pricecalvalue = data[0].productionprice
                    price.costPrice = data[0].productionprice
                    price.sellingprice=data[0].productionnetprice?data[0].productionnetprice:"-"
                  }
                  else{
                    price.pricecalvalue = '-'
                    price.costPrice = '-'
                  }
                  
                }
              }
            })
          }else{
            let battendObj = data[0]
              battendObj.pricevalue = data[0].formularesult,
              battendObj.showhideflag = data[0].formularesult ? 1 : 0
              battendObj.unittype = data[0].jobunittype
              battendObj.pricecalvalue = data[0].productionprice
              battendObj.costPrice = data[0].productionprice
              battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
              battendObj.battens = true
              battendObj.fs_displayonproduction = 1
              this.orderproductiondata.push(battendObj)
          }
          })
        }
        else{
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
          })
        }
      } else {
        if(res.productionresults.length > 0){
          let getBattens =  res.productionresults[0].filter( x => x.battenstype == 0 )
          if(getBattens.length > 0){
            res.productionresults.map((data:any)=>{
              let battendObj = data[0]
                battendObj.pricevalue = data[0].formularesult,
                battendObj.showhideflag = data[0].formularesult ? 1 : 0
                battendObj.unittype = data[0].jobunittype
                battendObj.pricecalvalue = data[0].productionprice
                battendObj.costPrice = data[0].productionprice
                battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
                battendObj.battens = true
                battendObj.fs_displayonproduction = 1
                this.orderproductiondata.push(battendObj)
            })
          }
        }
      }
      this.forms[0].metaData.map((v:any,index:any)=>{
        if(res.ruleresults.length > 0){
          res.ruleresults.map((price:any,i:any)=>{
            if(price[v.fieldid]){
              let pricechangedata = price[v.fieldid]
              if(v.fieldtypeid == 4 || v.fieldtypeid == 30 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v,res.ruleresults)
                  }
                  else {
                    this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                  }
                }
              }
              else if(v.fieldtypeid == 13 || v.fieldtypeid == 17 ){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    if(this.category != 6){
                    if(v.fieldtypeid == 13 && v.dualseq !=2){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.dualseq ==2){
                      this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }else{
                    if(v.fieldtypeid == 13 && v.multiseq <= 1){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.multiseq >1){
                      let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                      if(unique !== -1){
                        this.selectproduct_typeiddual[unique].id = pricechangedata[0].optionid;
                      }else{
                        this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:pricechangedata[0].optionid});
                      }
                    }
                  }
                    v.optiondefault = pricechangedata[0].optionid.toString()
                    this.getoptionvalue(v,res.ruleresults)
                  }
                  else{
                    if(!pricechangedata[0].optionid || pricechangedata[0].optionid == null){
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
              else{
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                    v.optiondefault = pricechangedata[0].optionid.toString()
                    v['valueid'] = pricechangedata[0].valueid.toString()
                    this.getoptionvalue(v,res.ruleresults)
                  }
                  else{
                    if(!pricechangedata[0].optionid || pricechangedata[0].optionid == null){
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
            }
          })
        }
      })
      if(res?.stockavailability?.length){
        this.checkStockAvailability(res.stockavailability)
      }
      // if(this.closeflag){
      //   this.fieldnameTerms.next('test')
      // }
    })
    if(this.subrulesvalue <= 2){
      if(this.formulacount){
        await this.subfieldrule()
        return
      }
    }
    return this.ordercalc()
  }
  
//order item mandatory
  mapValidators(validators){
    const formValidators = []
    if(validators){
      formValidators.push(Validators.required)
    }
    return formValidators
  }
  addCustomeBattenFlag = false;
//order item sub grid
  supcomponentfn(event,e,i,parentfield,editIcon?:any){
    this.paginationflag = true
    this.isLoadingorderitem = true
    this.paginationarray = {}
    this.option_fabric_editfielddata = parentfield;
    // this.gridApi.forEachNode((node) =>{
    //   node?.setSelected(false)
    // })
    // this.fabricccolroptdefault = this.forms[0].metaData.filter(el=> this.fabricIds.includes(el.fieldtypeid)).filter(el=> el.fieldlevel == 1)[0].optiondefault
    this.selectedoption = []
    // this.gridApi.refreshHeader()
    // this.gridApi.setFilterModel(null)
    this.submenu_pagination = true
    // if(this.fabricIds.includes(parentfield.fieldtypeid) && parentfield.fieldlevel==1){
    //   if(parentfield.fieldlevel == 1){ 
        // this.submenu_pagination = true
      // }
      // setTimeout(() => {
      //   // this.page = 1
      //   this.gridColumnApi?.applyColumnState({
      //   defaultState: { sort: null },
      // });
     
      
      //   // $('#exampleModalbk').modal('show')
      // }, 0)
      // this.gridApi.setServerSideDatasource(this.getDataSource(i,'',[]))
    // }
    // if(editIcon == 'edit'){
    //   $('#editOption_fabricPopup').modal('show')
    // }else{
      
    // }
    this.getServerData(i,'',[])
    this.ordertabindex = i 
    this.orderparentrow = parentfield
    this.selectedcompsetcontrol = e
    this.selectedcompindex = i
    this.battanFlag = parentfield.fieldtypeid == 33 ? true : false;
    var checkboxwidth = this.forms[0].metaData[this.selectedcompindex].selection == 1 ? 30 : 0
    // this.standarddata = this.forms[0].metaData[this.selectedcompindex].optionsvalue
    this.rowSelection = this.forms[0].metaData[this.selectedcompindex].selection == 1 ? 'multiple' : 'single'
    if(this.fabricIds.includes(parentfield.fieldtypeid))
    {
      // this.submenu_pagination=true;
      this.submenu_suppressPaginationPanel=false;
      this.standarddata = this.selectproduct_typeid && parentfield.fieldlevel==1 && parentfield.fieldtypeid!=21 ? this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(el=>el.pricegroupid==this.selectproduct_typeid) : this.forms[0].metaData[this.selectedcompindex].optionsvalue
    }
    else
    {
      // this.submenu_pagination=false;
      this.submenu_suppressPaginationPanel=true;
      this.standarddata = this.forms[0].metaData[this.selectedcompindex].optionsvalue
    }
    // this.commonfilter.resetsearch();
    // this.gridApi.setRowData(this.standarddata)
    if(this.forms[0].metaData[this.selectedcompindex].optiondefault){
      let selectedrow:any = []
      let fielddata = []
      selectedrow = this.forms[0].metaData[this.selectedcompindex].optiondefault.toString().split(',')
      if(this.forms[0].metaData[this.selectedcompindex]?.pricegrpid){
        let pricegrpidarray = this.forms[0].metaData[this.selectedcompindex].pricegrpid.toString().split(',')
         fielddata = parentfield.optionsvalue.filter(el => selectedrow.includes(el.optionid.toString()) && pricegrpidarray.includes(el.pricegroupid.toString()))
      }else{
        fielddata = parentfield.optionsvalue.filter(el => selectedrow.includes(el.optionid.toString()))

      }
      this.selectedoption = fielddata
      if(this.rowSelection == 'single'){
        this.opencloseflag = fielddata.map(el =>el.optionid)
      }
      }
  }
  onFilterChanged(e:any) {
    this.commonfilter.globalsearchfn();
    this.gridApi.deselectAll()
    setTimeout(() => {
      this.orderparams.api.ensureIndexVisible(0)
      var firstCol = this.orderparams.columnApi.getAllDisplayedColumns()[0]
      this.orderparams.api.ensureColumnVisible(firstCol)
      // this.orderparams.api.setFocusedCell(0, firstCol)
    },500)
  }
  option_fabric_onFilterChanged(e:any){
    setTimeout(() => {
      this.page = 1
      this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
    }, 100)
  }
  CombinedFocusHandler = (param,timeout)=> {
    setTimeout(()=>{     
      this.orderparams.api.ensureIndexVisible(param)
      var firstCol = this.orderparams.columnApi.getAllDisplayedColumns()[param]
      this.orderparams.api.ensureColumnVisible(firstCol)
      this.orderparams.api.setFocusedCell(param, firstCol)        
    },timeout)
  }
  OnTabHandler= (param:any)=>
  {
      setTimeout(() => {
        let footercutom = document.querySelector(
          '.footercustom > button:first-child'
        );
        $(footercutom).focus();
      }, 300);
  }
  navigateToNextCell(params: any){
    const previousCell = params.previousCellPosition,
    suggestedNextCell = params.nextCellPosition
    let nextRowIndex, renderedRowCount;
    switch (params.event.key) {
      case KEY_DOWN:
        nextRowIndex = previousCell.rowIndex + 1
        renderedRowCount = this.standarddata.length
        let rows:any = document.querySelectorAll(".subMenu .ag-center-cols-container .ag-row");  
        let lastrow = document.querySelector(".subMenu .ag-center-cols-container .ag-row-last");
        let rowfocus = document.querySelector(".subMenu .ag-center-cols-container .ag-row-focus");
        let Nodeconv = [...rows];
        let Focusedrowindex = Nodeconv.indexOf(rowfocus);
        let lastRowIndex = Nodeconv.indexOf(lastrow);
        if(nextRowIndex >= renderedRowCount) {
          // return null
        }
        return {
          rowIndex: nextRowIndex,
          column: previousCell.column,
          rowPinned: previousCell.rowPinned,
        }
      case KEY_UP:
        nextRowIndex = previousCell.rowIndex - 1
        if (nextRowIndex < -1) {
          return null
        }
        return {
          rowIndex: nextRowIndex,
          column: previousCell.column,
          rowPinned: previousCell.rowPinned,
        }
      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell
      default:
        throw Error('this will never happen, navigation is always one of the 4 keys above')
    }
  }
  closeordersubgrid(){
    let index = '#sublevelgrid' + this.ordersubindex
    $(index).css({'display':'none'})
  }
  closesubgrid(i){
    let index = '#ordersubgrid' + i
    $(index).css({'display':'none'})
  }
//order form costprice
  vatchange(event:any){
    this.vatcalctoggle = event.target.checked
    if(this.ordervattype && this.vattypearray.type && !this.keepFlag && !this.pricePopupFlag){
      if(this.ordervattype != this.vattypearray.type){
        if(this.vattypearray.value || !this.vattypearray.value){
          this.ordervattype = this.vattypearray.type
          this.vatarray = this.vattypearray.vatarray
        }
      }
    }
    if(this.ordervattype != 1){
      if(this.vatcalctoggle){
        this.vatvalue = this.vatinputboxvalue
      }
    }
    this.saveFlag = event.target.checked == true ? true : false
    this.ordercalc()
  }
  costpriceedit(event:any){
    this.orderchangeflag = true;
    this.costpriceValue = true;
    this.costpriceflag = event.target.checked
    this.orderpricecalculation.costpricetoggle = event.target.checked
    this.costpricetoggle = false;
    if(!event.target.checked){
      this.costpricetoggle = true;
      this.ordercalc()
    }
  }
  // As per the requirement of LA-I2958(Netoverride issue) case remove some line of code in the below method
  costpricecalc(event:any){
    this.orderchangeflag = true
      this.orderpricecalculation.totalcost = event.target.value;
  }
  // case LA-I1153
  validateMaxVal(){
    let payLoad={
      discount_value: this.orderpricecalculation.overridepricecalc,
      discount_type:this.orderpricecalculation.overrideprice==4 ? 'percentage' : 'value',
      price: this.orderpricecalculation.totalcost,
      currency_symbol: this.currencySymbole,
      bacs: this.currencydetail?.bacs,
    }
    this.orderser.validateMaxDiscoutPercentage(payLoad).subscribe((res:any)=>{
      this.isInvalidDiscount = res.result.status == 0 ? true : false
      this.maxDiscountErrorMsg=res?.message 
      this.cd.markForCheck();
      if (this.receipedisabledflag && this.orderpricecalculation.overrideprice == 5) {
        this.isInvalidDiscount = false
      } 
    })
  }
  htmlConvert(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (this.backgroundimageurl.includes('noimage')) {
        return resolve(true);
      }
      const element = document.querySelector('.bgImgDiv') as HTMLElement;
      if (!element && !this.globaleditPopup) {
        return resolve(true);
      }
      try {
        const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
        const base64String = canvas.toDataURL().split(',')[1];
        localStorage.setItem('convertimage', JSON.stringify(base64String));
      } catch (error) {
        console.error('Error generating canvas:', error);
      }
      resolve(true);
    });
  }
  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  orderproduction:any = []
//order form save
  async saveorderform(type){
    this.saveorderflag = this.ruleModeOpt = true;
    if(this.receipedisabledflag){
      Object.keys(this.inst.controls).forEach(key => {
        let currentControl:any = this.inst.controls[key]
        if(currentControl.dirty) {
          if(!this.getchangefield.includes(key.toString())){
             this.getchangefield.push(key.toString())
          }
        }
      })
    } 
    this.saveCopySelected.emit(type==='copy')  
    this.forms[0].metaData.map((field)=>{
      if(field.mandatory){
        if(!this.inst.value[field.fieldid.toString()]){
          this.inst.controls[field.fieldid].setErrors({ required: true })
        }
      }
    })
    this.inst.markAllAsTouched()
    let requiredfields = []
    for(const [key, value] of Object.entries(this.inst.controls)) {
      let getField = this.forms[0].metaData.filter(el => key.toString() == el.fieldid.toString())
      let index = this.forms[0].metaData.findIndex(el => key.toString() == el.fieldid.toString())  
      if(value.errors){
        if(value.errors.required){
          this.saveflag = false
          if(this.forms[0].metaData.filter(el => key.toString() == el.fieldid.toString()).length > 0){
            if((!this.onlineflag && this.forms[0].metaData.filter(el => key.toString() == el.fieldid.toString())[0]['showfieldonjob']) || (this.onlineflag && this.forms[0].metaData.filter(el => key.toString() == el.fieldid.toString())[0]['showFieldOnCustomerPortal']) ){
              if(getField[0]?.fieldtypeid == 2 || getField[0]?.fieldtypeid == 5 || getField[0]?.fieldtypeid == 19 || getField[0]?.fieldtypeid == 20 || getField[0]?.fieldtypeid == 21 || getField[0]?.fieldtypeid == 22 || getField[0]?.fieldtypeid == 3  ){
                $(`#comboGrid${getField[0].fieldid}`).parent().find('.textbox.easyui-fluid.combo').addClass('validationComboInput');
              }
              requiredfields.push(key)

            }
          }
        }
      }else{
        if(getField[0]?.fieldid){
          $(`#comboGrid${getField[0]?.fieldid}`).parent().find('.textbox.easyui-fluid.combo').removeClass('validationComboInput');
        }
      }
    }
    if(requiredfields.length > 0) {
      this.saveorderflag = this.ruleModeOpt = false
    }
    //LA-I2765 orderitem opt start
    if(this.priceCalculation){
      if(!this.rulescount && !this.formulacount){
        await this.ordercalc(false,'runRule')
      }
      if(this.rulescount && !this.formulacount){
        this.rulesvalue = 1
        await this.rulesbaseprice('runRule')
      }
      if(!this.rulescount && this.formulacount){
        this.rulesvalue = 2
        await this.rulesbaseprice('runRule')
      }
      if(this.rulescount && this.formulacount){
        this.rulesvalue = 1
        await this.rulesbaseprice('runRule')
      }
    }
    //LA-I2765 orderitem opt end
    //LA-I2409 Max sq area check start
    if (!this.receipedisabledflag) {
      if (this.onlineflag) {
        if (this.enableMaxSqAreaOnlineOrder && this.maxSqAreaFlagCheck) {
          this.productMaxSqAreaCheck('','submit',type)
          return;
        }
      } else {
        if (this.productMaxSqArea && this.maxSqAreaFlagCheck) {
          this.productMaxSqAreaCheck('','submit',type)
          return;
        }
      }
    }
    //LA-I2409 Max sq area check end
    // await this.htmlConvert();
    if(requiredfields.length == 0) {
     
      this.saveflag = this.keepFlag == true ? true : false;
      if(!this.onlyKeepflag){
        if((this.keepFlag || this.orderchangeflag) && this.disableFields==false){
          if(!this.rulescount && !this.formulacount){
            await this.ordercalc()
          }
          if(this.rulescount && !this.formulacount){
            this.rulesvalue = 1
            await this.paginationrulesbaseprice()
          }
          if(!this.rulescount && this.formulacount){
            this.rulesvalue = 2
            await this.paginationrulesbaseprice()
          }
          if(this.rulescount && this.formulacount){
            this.rulesvalue = 1
            await this.paginationrulesbaseprice()
          }  
        }
      }
      if(!this.datevalidation){
        // if(!this.widthdropflag){
          let saveorderarray = []
          let formulacolorid = ''
          let formula_colorid = ''
          let formula_coloriddual = ''
        
          this.forms[0].metaData.map((data:any,index:any)=>{
            if(data.optionsvalue){
              if(data.optionsvalue.length > 0){
                data.optionsvalue.map((opt:any)=>{
                  let indx =  this.reportpriceresults.findIndex(el => el.optionid.toString() == opt.optionid.toString() && el.fieldid == opt.fieldoptionlinkid)
                  if( indx != -1 ){
                    opt.unitcost = this.reportpriceresults[indx].unitcost
                    opt.reportprice = this.reportpriceresults[indx].reportprice
                  }
                })
              }
            }
           let optlinkarray = []
           let widthfraction = ''
           let widthfractiontext ='';
           let dropfractiontext= '';
           let dropfraction = '' 
           let numberFractionText='';
           let numberFraction = '';
            let optqtyarray = []
            let optlengtharray = []
            if(data.optiondefault){
              let optdefault = data.optiondefault.toString().split(',')
              data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).map((res:any)=>{
                optlinkarray.push(res.fieldoptionlinkid);
                if(data.fieldtypeid==33){
                  optqtyarray.push(res.qty)
                  optlengtharray.push(res["length"])
                }else{
                  optqtyarray.push(res.optionqty)
                }
              })
             
            }
            if(data.fieldtypeid==5 || data.fieldtypeid==19 || data.fieldtypeid==20 || data.fieldtypeid==21 || data.fieldtypeid==22)
            {
              if(data.fieldtypeid==5 && data.dualseq == '2'){
                formula_coloriddual = data.optiondefault
              }else if(data.fieldtypeid==22 && data.multiseq > 1 && this.category == 6){
                formula_coloriddual = data.optiondefault
              }
              else{
                formula_colorid = data.optiondefault
              }
            }
            if(data.fieldtypeid == 1){
              if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 && data.blindswidth!=0){
                widthfractiontext=this.Measurementarray?.filter(el => el.id.toString() ==data.blindswidth)[0].name;
                }
                widthfraction=data.blindswidth+"_"+this.unittypevaluehideshow+"_"+this.inchfractionselected+"_"+this.widthdecimalinches  
            }
            if(data.fieldtypeid==11 || data.fieldtypeid==7 || data.fieldtypeid==8 || data.fieldtypeid==31){
              if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 && this.widthdropfraction.width!=0){
              widthfractiontext=this.Measurementarray?.filter(el => el.id.toString() ==this.widthdropfraction.width)[0].name;
              }
              widthfraction=this.widthdropfraction.width+"_"+this.unittypevaluehideshow+"_"+this.inchfractionselected+"_"+this.widthdecimalinches  
            }
  
            if(data.fieldtypeid==12 || data.fieldtypeid==9 || data.fieldtypeid==10 || data.fieldtypeid==32){
              if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 && this.widthdropfraction.drop!=0 ){
               
              dropfractiontext=this.Measurementarray?.filter(el => el.id.toString() ==this.widthdropfraction.drop)[0].name;
              }
              dropfraction=this.widthdropfraction.drop+"_"+this.unittypevaluehideshow+"_"+this.inchfractionselected+"_"+this.dropdecimalinches
            }
            if(data.fieldtypeid == 28){
              if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 && this.inst.controls[`${data.fieldid}_${data.fieldname}`].value !=0){
                numberFractionText=this.Measurementarray?.filter(el => el.id.toString() == this.inst.controls[`${data.fieldid}_${data.fieldname}`].value)[0].name;
                }
                numberFraction = this.inst.controls[`${data.fieldid}_${data.fieldname}`].value+"_"+this.unittypevaluehideshow+"_"+this.inchfractionselected+"_"+this.numericDecimalInches
            }

            if(data.fieldname=='Color' && data.fieldtypeid==5)
            {
              formulacolorid = data.optiondefault
            }
            if(data.fieldtypeid === 4){          
              let isLocNotAvail = this.listOfLocations.every(x => x.optionname !== this.searchTerm);

              if(isLocNotAvail){
                data.optiondefault = '';
              }             
              const arr2Ids = this.listOfLocations;
              data.optionsvalue = arr2Ids.map(list => data.optionsvalue.find(item => item.fieldoptionlinkid === list.fieldoptionlinkid));
            }
            if(data.optiondefault){
              let defaultarray = data.optiondefault.toString().split(',')
              defaultarray.map((splitdata:any)=>{
                if(this.orderpricecalculation.optionprice[splitdata]){
                  data.optionsvalue.map((el:any)=>{
                    if(el.optionid.toString() == splitdata.toString()){
                      for (const [key, value] of Object.entries(this.orderpricecalculation.optionprice[splitdata])) {
                        el[key] = value
                      }
                    }
                  })
                }
              })
            } 
            let format:any = {
              id: +data.fieldid,
              labelname: data.fieldname,
              value: this.inst.value[data.fieldid.toString()] ? this.inst.value[data.fieldid.toString()] : '',
              valueid: data.optiondefault ?  [...new Set(optlinkarray.toString().split(','))].join(',') : '',
              type: data.fieldtypeid,
              optionid: data.optiondefault ? data.optiondefault : '',
              optionvalue: data.optionsvalue.filter(el => ((typeof data?.optiondefault == 'number')?data?.optiondefault.toString():data?.optiondefault)?.includes((typeof el.optionid == 'number')?el.optionid.toString():el.optionid)),
              issubfabric : data.issubfabric ? data.issubfabric : 0, 
              labelnamecode:data.labelnamecode,
              fabricorcolor: data.fabricorcolor,
              widthfraction: widthfraction,
              widthfractiontext:widthfractiontext,
              dropfractiontext:dropfractiontext,
              dropfraction: dropfraction,
              showfieldonjob: data.showfieldonjob,
              showFieldOnCustomerPortal: data.showFieldOnCustomerPortal,
              optionquantity: data.optiondefault ?  optqtyarray.toString() : '',
              globaledit: this.receipedisabledflag ? this.getchangefield.includes(data.fieldid.toString()) : false,
              numberfraction:numberFraction,
              numberfractiontext:numberFractionText,
              fieldlevel: data.fieldlevel,
              fieldtypeid : data.fieldtypeid,
              mandatory : data.mandatory,             
              fieldname : data.fieldname,
              fieldid : data.fieldid,
              subchild : data.subchild,
              fieldInformation : data.fieldInformation,
              ruleoverride : data.ruleoverride,
              optiondefault : data.optiondefault ? data.optiondefault : '',             
              optionsvalue : data.optionsvalue.filter(el => ((typeof data?.optiondefault == 'number')?data?.optiondefault.toString():data?.optiondefault)?.includes((typeof el.optionid == 'number')?el.optionid.toString():el.optionid)),
            }
            if(data.fieldtypeid==33){
              format.optionlength = data.optiondefault ?  optlengtharray.toString() : '';
            }
            if(data.editruleoverride==1){
              Object.assign(format,{editruleoverride:1})
            }else{
              Object.assign(format,{editruleoverride:0})
            }
            if(data?.fieldtypeid == 6 && data.setCondition) {
             format["setCondition"] = data.setCondition;
            }
            saveorderarray.push(format)
          })
          let prostatusmultiselect :any= []
          if(this.prostatusselectarray.length > 0){
            this.prostatusselectarray.map((status:any)=>{
              prostatusmultiselect.push(status.id)
            })
          }
          // await this.ordercalc()\
          // need this futhure referance LA-I2966
          let orderproduction = [];//{}
          this.orderproductiondata.map((bom:any)=>{
            // if(bom.fs_displayonproduction == 1){
              // orderproduction[bom.fs_id] = { value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue }
              if(bom.pricevalue!='null')
              {
                let fieldid = bom.fs_fieldid
                let fieldtype_id = 0;
                if(fieldid!=0)
                  fieldtype_id = 3
                if(bom.fs_variablename=='Fabric Quantity')
                {
                  fieldid=formula_colorid;
                }
                if(bom.fs_variablename=='Fabric Quantity_1')
                {
                  fieldid=formula_coloriddual;
                }
                if(fieldtype_id == 3 && bom.fs_bom == 0){     
                  let orderproductionobj = { productionoveride:bom.productionoverrideeditflag,id:bom.fs_id,value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue,sellingprice:bom.sellingprice,recipeid:bom.fs_recipeid,stockupdate:0,fieldid:fieldid,isdelete:0,defaultstock:bom.fs_deductfromstock,fieldtype_id:fieldtype_id ,option_name:bom.fs_variablename};            
                  if('predefinedlables' in bom){
                    let predefinedlabels = {};
                    for(let p=0;p<bom.predefinedlables.length;p++){
                      predefinedlabels[bom.predefinedlables[p]] = bom[bom.predefinedlables[p]];
                    }
                    Object.assign(orderproductionobj, predefinedlabels);
                  }
                  orderproduction.push(orderproductionobj)                
                }else{
                  orderproduction.push({ productionoveride:bom.productionoverrideeditflag,id:bom.fs_id,value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue,sellingprice:bom.sellingprice,recipeid:bom.fs_recipeid,stockupdate:0,fieldid:fieldid,isdelete:0,defaultstock:bom.fs_deductfromstock,fieldtype_id:fieldtype_id })
                }
              
              }
            // }
          })
         orderproduction.forEach((val)=>{
          if(val.value && this.productionresults?.length){
            let ind = this.productionresults.findIndex((prod) => prod.some((e:any) => e.fs_id == val.id))
            val.fractionvalue = ind != -1 ? this.productionresults[ind][0].fractionvalue : ""
          }else{
            val.fractionvalue = ""
          }
         })
          var saveorderdata:any ={}
          let costoverrideflag:any = 0
            if(!this.receipedisabledflag){
              costoverrideflag = this.orderpricecalculation.costpricetoggle == true ? 1 : 0
            }
            else{
              costoverrideflag = this.costpriceValue ? this.orderpricecalculation.costpricetoggle == true ? 1 : 0 : '' 
            }
          if(this.orderpricecalculation.overrideprice == 6 || this.orderpricecalculation.overrideprice == 7 || this.orderpricecalculation.overrideprice == 8 ){
             saveorderdata = {
              mode: this.orderauth.creditnoteflag ? 'creditnote' : '',
              globalpopup: this.receipedisabledflag,
              orderitemids: this.globaleditselectedids,
              jsondata: saveorderarray,
              recipeid: this.receipe,
              costprice: parseFloat(this.orderpricecalculation.totalcost) ? parseFloat(this.orderpricecalculation.totalcost) : 0,
              netprice: parseFloat(this.oldorderpricecalculation.netprice) ? parseFloat(this.oldorderpricecalculation.netprice) : 0,
              vatprice: parseFloat(this.oldorderpricecalculation.vat) ? parseFloat(this.oldorderpricecalculation.vat) : 0,
              grossprice: parseFloat(this.oldorderpricecalculation.totalgross) ? parseFloat(this.oldorderpricecalculation.totalgross) : 0,
              vatvalue: this.vatcalctoggle ? this.vatvalue : '',
              vatselected: this.vatarray.length > 0 && this.vatvalue ? this.vatarray.filter(el=>el.value == this.vatvalue)[0].id : '',
              overrideprice: parseFloat(this.orderpricecalculation.overridepricecalc) ,
              overridevalue: this.orderpricecalculation.overridepricecalc !== "" ? parseFloat(this.orderpricecalculation.overridepricecalc) : null,
              overridetype: parseFloat(this.orderpricecalculation.overrideprice),
              overridenetprice: parseFloat(this.orderpricecalculation.netprice) ,
              overridevatprice: parseFloat(this.orderpricecalculation.vat),
              overridegrossprice: parseFloat(this.orderpricecalculation.totalgross),
              productiondate: moment(this.orderpricecalculation.productiondate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              createddate:moment(this.orderpricecalculation.createdate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              costoverride: costoverrideflag,
              productionstatus: prostatusmultiselect,
              selectedstatus: prostatusmultiselect.length>0?prostatusmultiselect.at(-1):'',
              productionformulajson: this.orderproduction.length > 0 ? this.orderproduction : orderproduction,
              job_tempid:this.job_tempid,
              vat_type:this.ordervattype,
              vatonoff:this.vatcalctoggle,
              // productionstatus: this.prostatussinglemultipleflag == 1 ? prostatussingleselect : prostatusmultiselect
            /////online portal orderform save keys
              endcustomervatprice:parseFloat(this.endcustomerorderpricecalculation.vat) ? parseFloat(this.endcustomerorderpricecalculation.vat) : '',
              endcustomeroverridetype:this.endcustomerorderpricecalculation.overrideprice, 
              endcustomeroverridevalue:parseFloat(this.endcustomerorderpricecalculation.overridepricecalc) ? parseFloat(this.endcustomerorderpricecalculation.overridepricecalc) : '',
              endcustomeroverridenetprice:parseFloat(this.endcustomerorderpricecalculation.netprice) ? parseFloat(this.endcustomerorderpricecalculation.netprice) : '',
              endcustomeroverridevatprice:parseFloat(this.endcustomerorderpricecalculation.calvatprice) ? parseFloat(this.endcustomerorderpricecalculation.calvatprice) : '',
              endcustomeroverridegrossprice:parseFloat(this.endcustomerorderpricecalculation.totalgross) ? parseFloat(this.endcustomerorderpricecalculation.totalgross) : '',
              operation_workroom_data : this.workPriceList.length != 0 ? this.workPriceList : [],
              operation_calender_data : this.calenderPriceList.length != 0 ? this.calenderPriceList : [],
              operation_calculations : this.totalCostPrice,
              pivotId: this.pivotId,
              manualduedate: this.manualDueDate
            }
            if (this.receipedisabledflag) {
              saveorderdata['isoverridetypechanged'] = this.overridetypeValue ? 1 : 0
            }
          }else{
           saveorderdata = {
            mode: this.orderauth.creditnoteflag ? 'creditnote' : '',
            globalpopup: this.receipedisabledflag,
            orderitemids: this.receipedisabledflag ? this.globaleditselectedids : [],
            jsondata: saveorderarray,
            recipeid: this.receipe,
            costprice: parseFloat(this.orderpricecalculation.totalcost) ? parseFloat(this.orderpricecalculation.totalcost) : 0,
            netprice: parseFloat(this.oldorderpricecalculation.netprice) ? parseFloat(this.oldorderpricecalculation.netprice) : 0,
            vatprice: parseFloat(this.oldorderpricecalculation.vat) ? parseFloat(this.oldorderpricecalculation.vat) : 0,
            grossprice: parseFloat(this.oldorderpricecalculation.totalgross) ? parseFloat(this.oldorderpricecalculation.totalgross) : 0,
            vatvalue: this.vatcalctoggle ? this.vatvalue : '',
            vatselected : "",
            overrideprice: this.orderpricecalculation.overridepricecalc ? parseFloat(this.orderpricecalculation.overridepricecalc) : 0,
            overridevalue: this.orderpricecalculation.overridepricecalc !== "" ? parseFloat(this.orderpricecalculation.overridepricecalc) : null,
            overridetype: parseFloat(this.orderpricecalculation.overrideprice),
            isoverridetypechanged:this.overridetypeValue ? 1 : 0, 
            overridenetprice: this.orderpricecalculation.overridepricecalc ? parseFloat(this.orderpricecalculation.netprice) : 0,
            overridevatprice: this.orderpricecalculation.overridepricecalc ? parseFloat(this.orderpricecalculation.vat) : 0,
            overridegrossprice: this.orderpricecalculation.overridepricecalc ? parseFloat(this.orderpricecalculation.totalgross) : 0,
            productiondate:moment(this.orderpricecalculation.productiondate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            createddate:moment(this.orderpricecalculation.createdate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            costoverride: costoverrideflag,
            productionstatus: prostatusmultiselect,
            selectedstatus: prostatusmultiselect.length>0?prostatusmultiselect.at(-1):'',
            productionformulajson:  this.orderproduction.length > 0 ? this.orderproduction : orderproduction,
            job_tempid:this.job_tempid,
            vat_type:this.ordervattype,
            vatonoff:this.vatcalctoggle,
            // productionstatus: this.prostatussinglemultipleflag == 1 ? prostatussingleselect : prostatusmultiselect
          /////online portal orderform save keys
            endcustomervatprice:parseFloat(this.endcustomerorderpricecalculation.vat) ? parseFloat(this.endcustomerorderpricecalculation.vat) : '',
            endcustomeroverridetype:this.endcustomerorderpricecalculation.overrideprice, 
            endcustomeroverridevalue:parseFloat(this.endcustomerorderpricecalculation.overridepricecalc) ? parseFloat(this.endcustomerorderpricecalculation.overridepricecalc) : '',
            endcustomeroverridenetprice:parseFloat(this.endcustomerorderpricecalculation.netprice) ? parseFloat(this.endcustomerorderpricecalculation.netprice) : '',
            endcustomeroverridevatprice:parseFloat(this.endcustomerorderpricecalculation.calvatprice) ? parseFloat(this.endcustomerorderpricecalculation.calvatprice) : '',
            endcustomeroverridegrossprice:parseFloat(this.endcustomerorderpricecalculation.totalgross) ? parseFloat(this.endcustomerorderpricecalculation.totalgross) : '',
            operation_workroom_data : this.workPriceList.length != 0 ? this.workPriceList : [],
            operation_calender_data : this.calenderPriceList.length != 0 ? this.calenderPriceList : [],
            operation_calculations : this.totalCostPrice,
            customertype: this.productser.customerType,
            commissionvalues : JSON.stringify(this.commissionvalues),
            pivotId: this.pivotId,
            base64image: "",
            manualduedate: this.manualDueDate
          }
          this.save_copy = false;
          if(this.vatarray.length > 0 && this.vatvalue){
            saveorderdata.vatselected = this.vatarray.filter(el=>el.value == this.vatvalue).length != 0 ? this.vatarray.filter(el=>el.value == this.vatvalue)[0].id : ''
          }
        }
          if(this.priceupdate?.materials_cost_price_fabrics_or_shutters?.show_hide){
            Object.assign(saveorderdata,{pricecomesfrom_calculations:this.priceupdate.materials_cost_price_fabrics_or_shutters})
          }else{
            Object.assign(saveorderdata,{pricecomesfrom_calculations:{}})
          }
          Object.assign(saveorderdata,{pricefields:this.pricefields})
          if(this.costpricecomesfrom=="1" && this.netpricecomesfrom=="1"){
            if(this.orderproductiondata.length>0){
              let bindBOMPriceForReport=this.orderproductiondata.find((data)=>data.fs_variablename=="Fabric Quantity")
              Object.assign(saveorderdata,{priceCalForReport:{sellingPrice:bindBOMPriceForReport?.sellingprice ?? '',pricetableCostAfterSuppdisc:bindBOMPriceForReport?.getpricesuppdisc ??'',priceTableCost:bindBOMPriceForReport?.costPrice ?? ''}})
            }else{
              Object.assign(saveorderdata,{priceCalForReport:{sellingPrice:'',pricetableCostAfterSuppdisc:'',priceTableCost:''}})
            }
          }else{
            Object.assign(saveorderdata,{priceCalForReport:{sellingPrice:this.priceupdate?.pricegroupprice ?? '',pricetableCostAfterSuppdisc:this.priceupdate?.pricegroupcostprice ?? '',priceTableCost:this.priceupdate?.origpricetableprice ?? ''}})
          }
          if(!this.validationflag){
            this.searchTerm = "";
            if(!this.popupcloseflag){
              this.isLoading = true;             
              if(this.addeditmode == 'add'){
                saveorderdata.base64image = JSON.parse(localStorage.getItem('convertimage')) ?? ''
                this.orderser.saveorderitemdata(this.route.snapshot.paramMap.get('id'),this.selectedproductid,saveorderdata).subscribe((res: any) => {
                  this.popupcloseflag = true
                  // if(this.backgroundimageurl) {
                  //   this.saveImage(res.result);
                  // }
                  // else {
                  //   this.saveorderflag = false
                  //   $('#sampleModal').modal('hide')
                  // }
                  if(!this.receipedisabledflag){
                    this.toast.successToast("Order Added Successfully")
                  }
                  else{
                    this.toast.successToast("The entered value has been updated to the chosen products in the selected fields.")
                  }
                  if (type !== 'copy') {
                    this.ngxModalService.closeModal('globalProductModal');
                    this.isLoading = false;
                     this.removePanel()
                  }
                  this.globaleditPopup = this.costpriceValue = this.overridetypeValue = this.orderchangeflag = this.validationflag = this.ruleModeOpt = false;
                  this.validationerrmsg = ""
                  this.unittypevaluehideshow ='';
                  this.inchfractionselected='';
                  this.widthdropfraction.width=0;
                  this.widthdropfraction.drop=0;
                  let orderid = this.route.snapshot.paramMap.get('id')?this.route.snapshot.paramMap.get('id'):this.job_tempid;
                  this.orderser.getorderlistdata(orderid,this.pivotId).subscribe((res: any) => {
                    let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
                    this.childEvent.emit(data)
                    this.orderauth.collapseOrderGridFlag = false                    
                    if (type === 'copy') { // for Save & Copy functionality.
                      let passdata = {
                        rowdata: res.data[res.data.length - 1],
                        mode: 'copy',
                        globaledit: '',
                        pivotId: this.pivotId,
                        acceptanceflag: true,
                        rowIndex: this.rowIndex
                      }
                      passdata['afterjobsubmitted'] = true;
                      this.productser.orderedit$.next(passdata)
                      this.save_copy = true;
                    }           
                  })
                })
              }
              else{
                saveorderdata.base64image = JSON.parse(localStorage.getItem('convertimage')) ?? ''
                  if (this.receipedisabledflag) {
                    let unittypeChange = false;
                    let unittypevalue = '';
                saveorderdata.jsondata.forEach((res: any) => {
                  if (res.type == 34) {
                    unittypeChange = res.globaledit;
                    unittypevalue = res.value ?? res.valueid
                  }
                });
                const fractiondata = saveorderdata.jsondata.reduce((acc: any[], res: any) => {
                  const hasWidth = res.widthfraction?.length > 0;
                  const hasDrop = res.dropfraction?.length > 0;
                  if (hasWidth || hasDrop) {
                    if ([7, 8, 11, 31].includes(res.type)) {
                      const obj: any = {
                        id: res.id,
                        labelname: res.labelname,
                        type: res.type,
                        widthfraction: res.widthfraction,
                        widthfractiontext: res.widthfractiontext,
                        globaledit: unittypeChange,
                      };
                      if (unittypevalue =='4') { //Inches value id
                        obj.fractionedit = this.widthdropfraction.width != '0' ? true : false;
                      }
                      acc.push(obj);

                    } else if ([9, 10, 12, 32].includes(res.type)) {
                      const obj: any = {
                        id: res.id,
                        labelname: res.labelname,
                        type: res.type,
                        dropfraction: res.dropfraction,
                        dropfractiontext: res.dropfractiontext,
                        globaledit: unittypeChange,
                      };
                      if (unittypevalue =='4') { //Inches value id
                        obj.fractionedit = this.widthdropfraction.drop != '0' ? true : false;
                      }
                      acc.push(obj);
                    }
                  }
                  return acc;
                }, []);
                fractiondata.forEach((item: any) => {
                  if (item.fractionedit === false) {
                    delete item.fractionedit;
                  }
                });
                Object.assign(saveorderdata, { fractiondata });
                    const chunkSize = 15;
                    const chunks = this.chunkArray(saveorderdata.orderitemids, chunkSize);
                    const totalChunks = chunks.length; // Total number of chunks
                    let completedChunks = 0; // Track completed chunks
                    // Show progress loader (initialize to 0%)
                    this.orderser.showGlobalEdit = true;
                    let intervaltime = 0
                    interval(50)
                      .pipe(takeWhile(() => intervaltime < 5))
                      .subscribe(() => {
                        intervaltime++;
                        this.orderser.globalEditProgress = intervaltime;
                        this.toast.initGlobaleditFunctionCall(intervaltime);
                        this.progress = intervaltime;
                        this.cd.markForCheck();
                      });
                from(chunks)
                .pipe(
                  // Attach index to each chunk and assign a new value dynamically
                  map((chunk, index) => {
                  // Create a deep copy of saveorderdata and update the orderitemids
                  const modifiedChunk = { ...saveorderdata, orderitemids: chunk };
                  return { modifiedChunk, index };
                  }),
              
                  // Send each modified chunk sequentially
                  concatMap(({ modifiedChunk, index }) => 
                        this.orderser.updateorderitemdata('0',modifiedChunk).pipe(
                          // Attach index to the API response
                          map(response => ({ response, index }))
                        )
                  )
                )
                  .subscribe({
                    next: ({ response, index }) => {
                      // Update progress
                      completedChunks++;
                      const targetProgress = Math.round((completedChunks / totalChunks) * 100);
                      interval(50)
                      .pipe(takeWhile(() => this.progress < targetProgress))
                      .subscribe(() => {
                        this.progress++;
                        this.orderser.globalEditProgress = this.progress;
                        this.toast.initGlobaleditFunctionCall(this.progress);
                        this.cd.markForCheck();
                      });
                    },
                    error: err => {
                      console.error('Error sending batches:', err);
                      this.orderser.showGlobalEdit = false; // Hide loader on error
                    },
                    complete: () => {
                      this.progress = 100; // Set progress to 100%
                      this.orderser.globalEditProgress = this.progress;
                      this.toast.initGlobaleditFunctionCall(this.progress);
                      this.popupcloseflag = true
                      if(!this.receipedisabledflag){
                        this.toast.successToast("Order Updated Successfully")
                      }
                      else{
                        this.toast.successToast("The entered value has been updated to the chosen products in the selected fields.")
                      }
                      this.ngxModalService.closeModal('globalProductModal');
                       this.removePanel()
                      this.isLoading = this.globaleditPopup = this.costpriceValue = this.overridetypeValue = this.orderchangeflag = this.validationflag = this.ruleModeOpt = false;
                      this.validationerrmsg = ""
                      this.unittypevaluehideshow ='';
                      this.inchfractionselected='';
                      this.widthdropfraction.width=0;
                      this.widthdropfraction.drop=0;
                      if(this.route.snapshot.paramMap.get('id')){
                        this.orderser.getorderlistdata(this.route.snapshot.paramMap.get('id'),this.pivotId).subscribe((res: any) => {
                          let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
                          this.childEvent.emit(data)
                          this.orderauth.collapseOrderGridFlag = false
                          this.cd.markForCheck()
                        })
                      }else{
                        this.orderser.getorderlistdata(this.job_tempid,this.pivotId).subscribe((res: any) => {
                          let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
                          this.childEvent.emit(data)
                          this.orderauth.collapseOrderGridFlag = false
                          this.cd.markForCheck()
                        })
                      }
                    }
                  });
                  } else {
                      this.orderser.updateorderitemdata(this.orderid,saveorderdata).subscribe((res: any) => {
                      this.popupcloseflag = true
                      // if(this.backgroundimageurl) {
                      //   this.saveImage(this.orderid);
                      // }
                      // else {
                      //   this.saveorderflag = false
                      //   $('#sampleModal').modal('hide')
                      // }
                      let success = false;
                      if(!this.receipedisabledflag){
                        this.toast.successToast("Order Updated Successfully");
                        success = true                     
                      }
                      else{
                        this.toast.successToast("The entered value has been updated to the chosen products in the selected fields.")
                        success = false;
                      }
                      this.globaleditPopup = this.costpriceValue = this.overridetypeValue = this.orderchangeflag = this.validationflag = this.ruleModeOpt = false;
                      this.validationerrmsg = ""
                      this.unittypevaluehideshow ='';
                      this.inchfractionselected='';
                      this.widthdropfraction.width=0;
                      this.widthdropfraction.drop=0;
                      if(this.route.snapshot.paramMap.get('id')){
                        this.orderser.getorderlistdata(this.route.snapshot.paramMap.get('id'),this.pivotId).subscribe((res: any) => {
                          let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
                          this.childEvent.emit(data)
                          this.orderauth.collapseOrderGridFlag = false;
                          if(type === 'copy' && success){ // for Save & Copy functionality.
                            let passdata = {
                              rowdata : res.data[this.rowIndex],
                              mode: 'copy',
                              globaledit: '',
                              pivotId: this.pivotId,
                              acceptanceflag: true,
                              rowIndex:this.rowIndex
                            }
                            passdata['afterjobsubmitted'] = true;                        
                            this.productser.orderedit$.next(passdata);
                            this.save_copy = true;
                          }else{
                            this.ngxModalService.closeModal('globalProductModal');
                            this.isLoading = false;
                             this.removePanel()
                          }
                        })
                      }else{
                        this.orderser.getorderlistdata(this.job_tempid,this.pivotId).subscribe((res: any) => {
                          let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
                          this.childEvent.emit(data)
                          this.orderauth.collapseOrderGridFlag = false;
                          if(type === 'copy' && success){ // for Save & Copy functionality.
                            let passdata = {
                              rowdata : res.data[this.rowIndex],
                              mode: 'copy',
                              globaledit: '',
                              pivotId:this.pivotId,
                              acceptanceflag: true,
                              rowIndex:this.rowIndex
                            }
                            passdata['afterjobsubmitted'] = true;
                            this.productser.orderedit$.next(passdata);
                            this.save_copy = true;
                          }else{
                            this.ngxModalService.closeModal('globalProductModal');
                            this.isLoading = false;
                             this.removePanel()
                          }
                        })
                      }
                    })
                  }
              }
            }
          }
          $('#collapsethree').removeClass('show')
          $('.middlecol ').removeClass('righthiiden')
          $('.slidercontrol').removeClass('sidecontroloverwrite')
          $("#ordergrid").scrollTop(0);
          
        // }
      }
      else {
        this.saveorderflag = this.ruleModeOpt = false;
      }
    }
  }
  getDirtyValues(form: any) {
    let dirtyValues = {}
    Object.keys(form.controls).forEach(key => {
      let currentControl = form.controls[key]
      if(currentControl.dirty) {
        if(!this.getchangefield.includes(key.toString())){
           this.getchangefield.push(key.toString())
        }
        if(currentControl.controls){
           dirtyValues[key] = this.getDirtyValues(currentControl)
        }
        else{
          dirtyValues[key] = currentControl.value
        }
      }
    })
    return dirtyValues
}
//order option value save
  onSelectionChanged(event){
    if(this.rowSelection == 'multiple'){
      let checkedarray = {
        optiondefaultarray : this.gridApi.getSelectedRows(),
        optionvaluearray : this.forms[0].metaData[this.selectedcompindex].optionsvalue
      }
      this.customer.contactservercheckbox$.next(checkedarray)
    }
  }
  onRowClicked(event){
    if (event?.cellStartedEdit) {
      let selectedrowarray = []
      selectedrowarray.push(event.data)
      this.seletarray = selectedrowarray
      this.exampleModalbk(3);
      return;
    }
    // if(this.rowSelection == 'single'){
    //   this.orderser.doubleclickflag =  false
      setTimeout(() => {
        if(!this.orderser.doubleclickflag){
          this.seletarray=[]
            if(this.selectedoption.length == 0){
              let selectedrowarray = []
              selectedrowarray.push(event.data)
              this.seletarray = selectedrowarray
              this.selectedoption = []
              this.selectedoption.push(event.data)
             
            }
            else{
              this.selectedoption.map((node:any)=>{
                if(this.fabricIds.includes(this.forms[0].metaData[this.selectedcompindex].fieldtypeid)){
                  if(node?.pricegroupid){
                    if((event.data?.optionid == node?.optionid) && (event.data?.pricegroupid == node?.pricegroupid) &&(event?.data?.forchildfieldoptionlinkid == node?.forchildfieldoptionlinkid)){
                      this.seletarray = []
                      this.selectedoption = []
                    }
                    else{
                      let selectedrowarray = []
                      selectedrowarray.push(event.data)
                      this.seletarray = selectedrowarray
                      this.selectedoption = []
                      this.selectedoption.push(event.data)
                    }
                  }else{
                    if((event.data?.optionid == node?.optionid && event?.data?.forchildfieldoptionlinkid == node?.forchildfieldoptionlinkid)){
                      this.seletarray = []
                      this.selectedoption = []
                    }
                    else{
                      let selectedrowarray = []
                      selectedrowarray.push(event.data)
                      this.seletarray = selectedrowarray
                      this.selectedoption = []
                      this.selectedoption.push(event.data)
                    }
                  }
                }
                else{
                  if(node?.pricegroupid){
                    if((event.data?.optionid == node?.optionid) && (event.data?.pricegroupid == node?.pricegroupid) && (event?.data?.forchildfieldoptionlinkid == node?.forchildfieldoptionlinkid)){
                      this.seletarray = []
                      this.selectedoption = []
                    }
                    else{
                      let selectedrowarray = []
                      selectedrowarray.push(event.data)
                      this.seletarray = selectedrowarray;
                      this.selectedoption = []
                      this.selectedoption.push(event.data)
                    }
                  }else{
                    if((event.data?.optionid == node?.optionid && event?.data?.forchildfieldoptionlinkid == node?.forchildfieldoptionlinkid)){
                      this.seletarray = []
                      this.selectedoption = []
                    }
                    else{
                      let selectedrowarray = []
                      selectedrowarray.push(event.data)
                      this.seletarray = selectedrowarray
                      this.selectedoption = []
                      this.selectedoption.push(event.data)
                    }
                  }
                }
              })
            }
          this.exampleModalbk(3);//for colour remove for existing one fabric 
       }
      }, 500)
    // }
  }
  onCellEditingStarted(params: any){
    if( this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 33 ){
      if (!params.node.isSelected()) {
        params.api.stopEditing();
        this.toast.errorToast("Select the row to change value");
      }
    }
  }
  battanFlag:boolean = false;
  async exampleModalbk(dummyarg:any=0){
    // this.saveorderflag = true
    let multiplecall: boolean = false
    let hasSubChild = false
    this.orderchangeflag = this.priceCalculation ? true : this.orderchangeflag;
    this.saveflag = true;
    this.cd.markForCheck();
    this.orderchangeflag = true
    if(!this.getchangefield.includes(this.forms[0].metaData[this.selectedcompindex].fieldid.toString())){
      this.getchangefield.push(this.forms[0].metaData[this.selectedcompindex].fieldid.toString())
    }
    // await setTimeout(() => {
    //   this.page = 1;
    //   this.gridApi.deselectAll();
    //   this.gridApi.refreshHeader();
    //   // this.gridApi.setServerSideDatasource(this.getDataSource(this.selectedcompindex,'',[]))
    // }, 100)
    var selectedComboRows =  $('#comboGrid'+this.comboIndex).combogrid('grid').datagrid('getSelections');
    let selectedRow = selectedComboRows
    this.seletarray = selectedComboRows
    if (this.optiondefaultarray?.selectedIds?.length && this.rowSelection != 'single') {
      let arry:any = this.optiondefaultarray.optionArray.filter(o1 => this.optiondefaultarray?.selectedIds.some(o2 => o1.optionid == o2));
      if(selectedRow?.length > 0){
        selectedRow = [...arry,...selectedRow];
      }else{
        selectedRow = arry.filter((o1 => this.optiondefaultarray.searchOpt.some(o2 => o1.optionid != o2.optionid)))
      }
      this.forms[0].metaData[this.selectedcompindex].optionsvalue = selectedRow;
      this.forms[0].metaData[this.selectedcompindex].optionsbackup = selectedRow;
    }
    this.forms[0].metaData[this.selectedcompindex].optionsvalue.map((data:any)=>{
      if(this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 33  && (data["length"] > 0 || data.qty > 0)){
        this.battanLength[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data["length"]
        this.optionqtyarray[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data.qty
      }else{
        if(parseFloat(data.optionqty) > 0){
          this.optionqtyarray[this.forms[0].metaData[this.selectedcompindex].fieldid + '_' + data.optionid] = data.optionqty
        }
      }
    })
    this.selectedcompindex = this.ordertabindex
    if(dummyarg == 'enter'){
      this.seletarray = this.gridApi.getSelectedRows()
    }
    this.forms[0].metaData[this.selectedcompindex].editruleoverride = 1;
      this.ordertabindex = this.selectedcompindex
    var uniqueResultOne = this.forms[0].metaData[this.selectedcompindex].optionsvalue.filter(function(obj) {
      return !selectedRow.some(function(obj2) {
          return obj.optionid == obj2.optionid
      })
    })
    if(uniqueResultOne.length > 0){
      let removedataflag:boolean = false
      uniqueResultOne.map((splicedata:any,index:any)=>{
        let splitdata = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid == splicedata.forchildfieldoptionlinkid)
        if(splitdata.length > 0){
          removedataflag = true
          if(this.forms[0].metaData[this.selectedcompindex].subchild){
            // hasSubChild = true
            this.forms[0].metaData[this.selectedcompindex].subchild = this.forms[0].metaData[this.selectedcompindex].subchild.filter(el => el.forchildsubfieldlinkid != splicedata.forchildfieldoptionlinkid)
          }
          this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != splicedata.forchildfieldoptionlinkid)
          splitdata.map((removefield:any)=>{
            this.removeorderdata(removefield)
          })
        }
      })
      if(removedataflag){
        hasSubChild = true
        setTimeout(() => {
          if(!this.rulescount && !this.formulacount){
            this.ordercalc()
            let unittypeid = ''
            this.forms[0].metaData.map((field:any)=>{
              if(field.fieldtypeid == 34){
                unittypeid = field.optiondefault
               }
            })
            if(this.oneditmode==false){
              let temp:any=Number(unittypeid)
              this.unittypefractionlist(-1,temp)
            }
          }
          if(this.rulescount && !this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
          if(!this.rulescount && this.formulacount){
            this.rulesvalue = 2
            this.rulesbaseprice()
          }
          if(this.rulescount && this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
       }, 0)
      }
      if(selectedRow.length == 0 ){
        this.inst.get(this.selectedcompsetcontrol.toString()).setValue('')
        this.forms[0].metaData[this.selectedcompindex].optiondefault = ''
        this.removeorderdata(this.forms[0].metaData[this.selectedcompindex])
        let orderarraylength:number = this.forms[0].metaData.length
        this.orderlength = (orderarraylength / 2)
        if(this.orderlength <= 10) this.orderlength = 10
        $('#exampleModalbk').modal('hide')
        // let dynamicid = parseInt(this.ordertabindex)
        // $('#subgrid' + dynamicid).focus()
        if(!removedataflag){
          if(!this.rulescount && !this.formulacount){
            this.ordercalc()
            let unittypeid = ''
            let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
            if( ind != -1 ){
              unittypeid = this.forms[0].metaData[ind].optiondefault
            }
            if(this.oneditmode==false){
              let temp:any=Number(unittypeid)
              this.unittypefractionlist(-1,temp)
            }
          }
          if(this.rulescount && !this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
          if(!this.rulescount && this.formulacount){
            this.rulesvalue = 2
            this.rulesbaseprice()
          }
          if(this.rulescount && this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
        }
        this.getFilterData("widthdropfilter",this.forms[0].metaData[this.selectedcompindex])
      }
    }
    if(selectedRow.length > 0 ){
      this.orderparentrow = this.forms[0].metaData[this.selectedcompindex]
      let optionidarray = []
      let optionnamearray = []
      let pricegrpidarray = []
      if(this.rowSelection == 'multiple'){
        selectedRow.map((rowdata:any)=>{
          optionidarray.push(rowdata.optionid)
          optionnamearray.push(rowdata.optionname)
          if (rowdata.pricegroupid) {
            pricegrpidarray.push(rowdata.pricegroupid)
          }
        })
        if(this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 33){
          optionnamearray = []
          let optionName = selectedRow.length + " Selected"
          optionnamearray.push(optionName)
        }
      }
      $('#exampleModalbk').modal('hide')
      this.singlemultipleflag = 'single'
       this.enabledisableflag = true
      if(dummyarg!=2){
      this.forms[0].metaData[this.selectedcompindex].optiondefault = this.rowSelection == 'single' ? this.seletarray[0].optionid.toString() : optionidarray.toString()
      this.inst.get(this.selectedcompsetcontrol.toString()).setValue(this.rowSelection == 'single' ? this.seletarray[0].optionname : optionnamearray.toString())
      if(this.seletarray[0]?.pricegroupid){
        this.forms[0].metaData[this.selectedcompindex].pricegrpid = this.rowSelection == 'single' ? this.seletarray[0].pricegroupid.toString() : pricegrpidarray.toString()
      }
      }
      let parentfield = this.forms[0].metaData[this.selectedcompindex]
      let selectproducttypeid =0;
            let selectsupplierid =0;
      if(parentfield.fieldtypeid){
        let validationdata = {
          lineitemselectedvalues: this.editorderitemselectedvalues,
          productid: this.selectedproductid,
          supplier: '',
          pricegroup: '',
          fabricid: '',
          colorid: '',
          subfabricid: '',
          subcolorid: '',
          coloriddual:'',
          fabriciddual:'',
          pricegroupdual:'',
          selectedvalues: {'pricegroupmulticurtain':[]},
          pricegroupmulticurtain:[],
          fabricmulticurtain:[],
          orderitemselectedvalues:this.getallselectedvalues(),
          selectedfieldids:[],
          fieldtypeid:'',
          width: '',
          drop: '',
          numFraction:'',
          customertype: this.productser.customerType,
          changedfieldtypeid: parentfield.fieldtypeid,
          unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault,
          changedfieldid: parentfield?.fieldid
        }
        // validationdata.fieldtypeid = this.fabricIds.includes(this.forms[0].metaData[this.selectedcompindex].fieldtypeid) ? this.forms[0].metaData[this.selectedcompindex].fieldtypeid : ''
        let fabricarray=[7,8,11]
        let colorarray=[9,10,12]
        this.forms[0].metaData.map((data:any)=>{
          validationdata.selectedfieldids.push(data.fieldid)
          if((this.fabricIds.includes(data.fieldtypeid) && data.showfieldonjob)|| data.fieldtypeid == 13 || data.fieldtypeid == 17){
            // if(data.optiondefault){
             /* if(dummyarg==2 && data.fieldtypeid==13){
                validationdata.pricegroup =this.pricegroupcurrent;return;    
              }     
              if(dummyarg==2 && data.fieldtypeid==17){
                 validationdata.supplier =this.suppliercurrent;
                 return;    
              }   */
              if(data.optionsbackup.length > 0){ 
                let optinvaluearray = []
                data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
                if(dummyarg==2)//fabricrefresh
                optinvaluearray.push(this.softfurningfabricid)
                if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric != 1 && data.showfieldonjob){
                if((this.category == 6 && data.multiseq <= 1) || (this.category != 6 && data.dualseq <= 1)){
                 let fieldid = [data.fieldtypeid] + '_' + data.fabricorcolor
                    validationdata.selectedvalues[fieldid]  = optinvaluearray                
                 
                  // if(data.fieldlevel == 2){
                  //   if(this.fabricccolroptdefault){
                  //     if(this.fabricccolroptdefault != this.forms[0].metaData.filter(el=> this.fabricIds.includes(el.fieldtypeid)).filter(el=> el.fieldlevel == 1)[0].optiondefault){
                  //       optinvaluearray = []
                  //     }
                  //   }
                  // }                 
                  // }
                  if(data.fieldtypeid == 5 && data.fabricorcolor == 1 && validationdata.selectedvalues[fieldid]){
                  validationdata.selectedvalues[fieldid]  = validationdata?.selectedvalues[fieldid]?.concat(optinvaluearray); // LA-I2020 dual(first) fabric deselect issue
                  }else{
                  validationdata.selectedvalues[fieldid]  = optinvaluearray
                  }
                }
              }
                else if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric == 1){
                  let fieldid = 'sub_'+ [data.fieldtypeid] + '_' + data.fabricorcolor
                  validationdata.selectedvalues[fieldid]  = optinvaluearray
                }
                else{
                  let arrayname = ''
                  if(data.fieldtypeid == 13){
                    if(this.category == 6 && data.multiseq>1){
                      validationdata.selectedvalues['pricegroupmulticurtain'].push({multiseq:data.multiseq,id:optinvaluearray});
                    }else{
                      arrayname ='pricegrouparray'
                      validationdata.selectedvalues[arrayname] = optinvaluearray
                    }
                  }
                  if(data.fieldtypeid == 17){
                    arrayname ='supplierarray';
                    validationdata.selectedvalues[arrayname] = optinvaluearray
                  } 
                }
              }
            // }
          }
          else{
            if(data.optionsbackup.length > 0){
              let optinvaluearray = []
              data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
              validationdata.selectedvalues[data.fieldid] = optinvaluearray
            }
          }
          if(fabricarray.includes(data.fieldtypeid)){
            let widthvalue:any = parseFloat(this.widthdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
            validationdata.width = widthvalue
          }
          if(colorarray.includes(data.fieldtypeid)){
            let dropvalue:any = parseFloat(this.dropdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
            validationdata.drop = dropvalue
          }
          if(data.fieldtypeid == 28){
            let numericValue:any = parseFloat(this.numericDecimalInches) + parseFloat(this.inst.value[data.fieldid.toString()])
            validationdata.numFraction = numericValue
          }
          if(data.fieldtypeid == 13){
          if(this.category != 6){
            if(this.orderparentrow.issubfabric == 1){
              this.selectproduct_typeid = selectedRow[0].pricegroupid?selectedRow[0].pricegroupid:this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault : '';
              validationdata.pricegroup = data.optiondefault?data.optiondefault:'';
              validationdata.pricegroupdual = '';
            }
            if(this.forms[0].metaData[this.selectedcompindex].dualseq != 2 && this.orderparentrow.issubfabric != 1){
              this.selectproduct_typeid= validationdata.pricegroup = selectedRow[0].pricegroupid?selectedRow[0].pricegroupid:this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault : ''; 
              this.selectproduct_typeiddual = validationdata.pricegroupdual = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq == 2)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq == 2)[0]?.optiondefault : ''; 
            }
            if(this.forms[0].metaData[this.selectedcompindex].dualseq == 2){

              this.selectproduct_typeid= validationdata.pricegroup = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq != 2)[0]?.optiondefault : ''; 
              this.selectproduct_typeiddual = validationdata.pricegroupdual = selectedRow[0].pricegroupid?selectedRow[0].pricegroupid:this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq == 2)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.dualseq == 2)[0]?.optiondefault : '';
            }
          }else{
            if (this.orderparentrow.issubfabric == 1 && data.multiseq <= 1) {
              this.selectproduct_typeid = selectedRow[0].pricegroupid ? selectedRow[0].pricegroupid : this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.multiseq <= 1)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.multiseq <= 1)[0]?.optiondefault : '';
              validationdata.pricegroup = data.optiondefault ? data.optiondefault : '';
              validationdata.pricegroupdual = '';
              validationdata.pricegroupmulticurtain = [];
            }
            if (data.multiseq <= 1 && this.orderparentrow.issubfabric != 1) {              
                  this.selectproduct_typeid = validationdata.pricegroup = data?.optiondefault ? data?.optiondefault : selectedRow[0].pricegroupid;
            }
            if (data.multiseq > 1) {
              if (this.forms[0].metaData[this.selectedcompindex].multiseq == data.multiseq) {
                validationdata.pricegroupmulticurtain.push({ multiseq: data.multiseq, id: selectedRow[0].pricegroupid ? selectedRow[0].pricegroupid : '' })
              } else {
                validationdata.pricegroupmulticurtain.push({ multiseq: data.multiseq, id: data?.optiondefault ? data?.optiondefault : '' })
              }
            }
          }
            }
          if(data.fieldtypeid == 17){ 
            validationdata.supplier = data.optiondefault 
          }
          if(this.fabricIds.includes(data.fieldtypeid)){
            if(data.fieldtypeid == 20){
              validationdata.colorid = data.optiondefault
            }
            else{
              if(data.fieldlevel == 2 && data.issubfabric != 1){
                 if(data.fieldtypeid == 5 && data.dualseq == 2){
                  validationdata['coloriddual'] = data.optiondefault;
                  } else{
                    validationdata.colorid = data.optiondefault;
                  }
                }else if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
                  validationdata.subfabricid = data.optiondefault;
                }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
                  validationdata.subcolorid = data.optiondefault;
                }
              else { 
                if(dummyarg==1){
                  if(data.fieldtypeid == 5 && data.dualseq == 2){
                      validationdata['fabriciddual'] = this.softfurningfabricid;
                  }else if(data.fieldtypeid == 22 && data.multiseq > 1){
                    validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id: this.softfurningfabricid});
                }
                  else{
                    validationdata.fabricid =  this.softfurningfabricid;
                  }
                }
                else{
                  if(dummyarg==2)
                  {
                    if(data.fieldtypeid == 5 && data.dualseq == 2){
                      validationdata['fabriciddual'] = '';
                    }else if(data.fieldtypeid == 22 && data.multiseq > 1){
                      validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id:''});
                    }
                    else{
                      validationdata.fabricid = "";
                    }
                  }
                  else{
                    if(data.fieldtypeid == 5 && data.dualseq == 2){
                      validationdata['fabriciddual'] = data.optiondefault;
                  }else if(data.fieldtypeid == 22 && data.multiseq > 1){
                    validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id:data.optiondefault});
                }else{
                    validationdata.fabricid = data.optiondefault;
                  }
                  }
                }
               }
            }
          }
        })
        const field = this.forms[0].metaData.find(el => this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel === 1)
        if (field) {
          validationdata.fieldtypeid = field.fieldtypeid
        }
        if(this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 17 || this.fabricIds.includes(this.forms[0].metaData[this.selectedcompindex].fieldtypeid) || colorarray.includes(this.forms[0].metaData[this.selectedcompindex].fieldtypeid) || this.forms[0].metaData[this.selectedcompindex].fieldtypeid == 13 ){ // for enable loading for mention field type as per selve instruction
            this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
        }
        this.selectproduct_typeiddual = validationdata.pricegroupmulticurtain;
        if(dummyarg==2){ 
          validationdata.fieldtypeid ="22"; 
          validationdata.changedfieldtypeid=13;//fabric reset
        }
      //   if(parentfield.fieldtypeid==13 || parentfield.fieldtypeid==17)
      //   {
      //    if(parentfield.fieldtypeid==13){
      //     validationdata.supplier = '';
      //    }
      // }
      validationdata['orderItemId'] = this.addeditmode == 'add' ? '' : this.orderid;
       this.orderser.cancelFilterRequests()
       validationdata['apicall'] = this.apiflagcount += 1
      await this.orderser.ordertypevalidation(validationdata).then((res: any) => {
           if(res){
            let fabDual;
            let multiColor;
            if (this.category == 6) {
              fabDual = res[0].data.multifabricidsarray
              multiColor = res[0].data.multicoloridsarray
            } else {
              fabDual = res[0].data.fabricidsarraydual;
              multiColor = res[0].data.coloridsarraydual
            }
            this.filterbasearray = { fabric:res[0].data.fabricidsarray, color: res[0].data.coloridsarray, option: res[0].data.optionarray, fabricdual: fabDual, colordual: multiColor }
             let removedataflag:boolean = false
             this.forms[0].metaData.map((data:any)=>{
               if(data.fieldtypeid == 13){
                if(data.multiseq <= 1){
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
                }else if(data.multiseq > 1){
                  res[0].data?.multipricegroupidsarray.map((multi:any)=>{
                    if(data.multiseq == multi.multiseq){
                      data.optionsvalue = data.optionsbackup.filter(el => multi?.id?.includes(el.optionid))
                    }
                  })
                }                 
                 if(data.optiondefault){
                   if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                     data.optiondefault = ''
                     this.inst.get(data.fieldid.toString()).setValue('')
                     this.removeorderdata(data)
                     removedataflag = true
                   }
                 }
                 else {
                   this.inst.get(data.fieldid.toString()).setValue('')
                   this.removeorderdata(data)
                   removedataflag = true
                 }
               }
               if(data.fieldtypeid == 17){
                 if(res[0].data.selectsupplierid != 0){
                   data.optiondefault = res[0].data.selectsupplierid
                   selectsupplierid = res[0].data.selectsupplierid;
                 }
                 if(res[0].data.selectsupplierid == 0){
                   data.optiondefault = ''
                 }
                 // if(res[0].data.supplieridsarray.length == 1 && validationdata.supplier){
                 //   data.optiondefault = res[0].data.supplieridsarray.toString()
                 // }
                 // if(res[0].data.supplieridsarray.length == 1 && validationdata.pricegroup){
                 //   data.optiondefault = res[0].data.supplieridsarray.toString()
                 // }
                 data.optionsvalue = data.optionsbackup.filter(el => res[0].data.supplieridsarray.includes(el.optionid))
                 if(data.optiondefault){
                   if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                     data.optiondefault = ''
                     this.inst.get(data.fieldid.toString()).setValue('')
                     this.removeorderdata(data)
                     removedataflag = true
                   }
                 }
               }
               if(data.fieldtypeid == 13 && (parentfield.linktopricegroup == data.fieldid || this.isdualproduct == '0' && this.category != 6))
               {
                if(this.category != 6){
                 if(data.dualseq != 2){
                   if(res[0].data.selectproducttypeid != 0){
                     data.optiondefault = validationdata.pricegroup?validationdata.pricegroup:res[0].data.selectproducttypeid;
                     this.selectproduct_typeid = selectproducttypeid = data.optiondefault;
                     setTimeout(()=>{
                       let subgridarray = []
                       subgridarray.push(data)
                       hasSubChild = true
                       this.defaultorderitem(subgridarray)
                     },1000)
                   }
                   if(res[0].data.selectproducttypeid == 0){
                     data.optiondefault = ''
                   }
                 }else if(data.dualseq == 2){
                   if(res[0].data.selectproducttypeiddual != 0){
                     data.optiondefault = validationdata.pricegroupdual ? validationdata.pricegroupdual:res[0].data.selectproducttypeiddual;
                     this.selectproduct_typeiddual = data.optiondefault;
                     // setTimeout(()=>{
                     //   let subgridarray = []
                     //   subgridarray.push(data)
                     //   this.defaultorderitem(subgridarray)
                     // },1000)
                   }
                   if(res[0].data.selectproducttypeiddual == 0){
                     data.optiondefault = ''
                   }
                 }
                }else{
                  if(data.multiseq <= 1){
                    if(res[0].data.selectproducttypeid != 0){
                      data.optiondefault = validationdata.pricegroup?validationdata.pricegroup:res[0].data.selectproducttypeid;
                      this.selectproduct_typeid = selectproducttypeid = data.optiondefault;
                    }
                    if(res[0].data.selectproducttypeid == 0){
                      data.optiondefault = ''
                    }
                  } else if (data.multiseq > 1) {
                    let multiselectproducttypeidmore = res[0].data.multiselectproducttypeidmore;
                    let selectproducttypeidmorefiltered = multiselectproducttypeidmore.find(el => el.multiseq == data.multiseq);
                    if (selectproducttypeidmorefiltered?.id != 0) {
                      data.optiondefault = selectproducttypeidmorefiltered?.id;
                      this.selectproduct_typeiddual.push({ multiseq: data.multiseq, id: data.optiondefault });
                    }
                    if (selectproducttypeidmorefiltered?.id == 0 || multiselectproducttypeidmore.length == 0) {
                      data.optiondefault = ''
                    }
                  }
                }
                 // data.optionsvalue = data.optionsbackup.filter(el => res[0].data.supplieridsarray.includes(el.optionid))
                 if(data.optiondefault){
                   this.inst.get(data.fieldid.toString()).markAsDirty()
                   if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                     data.optiondefault = ''
                     this.inst.get(data.fieldid.toString()).setValue('')
                     this.inst.get(data.fieldid.toString()).markAsPristine()
                     this.removeorderdata(data)
                   }
                 }
               }
               if(this.fabricIds.includes(data.fieldtypeid)){
                 if(data.fieldtypeid == 20){
                     data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                   if(data.optiondefault){
                     if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                       data.optiondefault = ''
                       this.inst.get(data.fieldid.toString()).setValue('')
                       this.removeorderdata(data)
                       removedataflag = true
                     }
                   }
                 }
                 else{
                   if(data.fieldlevel == 2 && data.issubfabric != 1){ //coloridsarray
                    if(this.category != 6){
                     if(data.dualseq !=2){
                     data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                     }
                     if(data.dualseq ==2){ ////for dual fabric and color
                       data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarraydual.includes(el.optionid))
                     }
                    }else{
                      if(data.multiseq <= 1){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                        }
                        if(data.multiseq >1){ ////for multicurtain and color
                         let multicoloridsarray = res[0].data.multicoloridsarray;
                         let morecoloridsarrayfiltered = multicoloridsarray.filter(el => el.multiseq == data.multiseq);
                         data.optionsvalue = data.optionsbackup.filter(el => morecoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                        }
                    }
                     if(data.optiondefault){
                       if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                         data.optiondefault = ''
                         this.inst.get(data.fieldid.toString()).setValue('')
                         this.removeorderdata(data)
                         removedataflag = true
                       }
                     }
                   }else if(data.fieldlevel == 1 && data.issubfabric != 1){ // fabricidsarray
                     // data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                     if(this.category != 6){
                     if(data.dualseq !=2){
                      if(res[0].data.pricegroupidsarray){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                      }else{
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                      }
                     }
                     if(data.dualseq ==2){ ////for dual fabric and color
                       data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                     }
                    }else{
                      if(data.multiseq <= 1){
                        if(res[0].data.pricegroupidsarray){
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                        }else{
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                        }
                       }
                       if(data.multiseq >1){ ////for multicurtain and color
                       
                        let multifabricidsarray = res[0].data.multifabricidsarray;
                        let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                        let morepriceidsarray = res[0].data.multipricegroupidsarray;
                        let morepriceidsarrayfiltered = morepriceidsarray.filter(el => el.multiseq == data.multiseq);
                        data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid) && morepriceidsarrayfiltered[0]?.id.includes(el.pricegroupid));
                       }
                    }
                    if(data.optiondefault){
                       if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                         data.optiondefault = ''
                         this.inst.get(data.fieldid.toString()).setValue('')
                         this.removeorderdata(data)
                         removedataflag = true
                       }
                     }
                   }else if(data.fieldlevel == 2 && data.issubfabric == 1){ // subfabricidsarray
                     data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subfabricidsarray.includes(el.optionid))
                    if(data.optiondefault){
                       if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                         data.optiondefault = ''
                         this.inst.get(data.fieldid.toString()).setValue('')
                         this.removeorderdata(data)
                         removedataflag = true
                       }
                     }
                   }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcoloridsarray
                     data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subcoloridsarray.includes(el.optionid))
                    if(data.optiondefault){
                       if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                         data.optiondefault = ''
                         this.inst.get(data.fieldid.toString()).setValue('')
                         this.removeorderdata(data)
                         removedataflag = true
                       }
                     }
                   }
                   else {
                    if(this.category != 6){
                     if(data.dualseq !=2){
                       data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                     }
                     if(data.dualseq ==2){ ////for dual fabric and color
                       data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid))
                     }
                    }else{
                      if(data.multiseq <= 1){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                      }
                      if(data.multiseq >1){ ////for multicurtain and color
                       let multifabricidsarray = res[0].data.multifabricidsarray;
                       let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                       data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));                       
                    }
                  }
                    if(data.optiondefault){
                       if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                         data.optiondefault = ''
                         this.inst.get(data.fieldid.toString()).setValue('')
                         this.removeorderdata(data)
                         removedataflag = true
                       }
                     }
                   }
                 }
               }
             })
             if(removedataflag){
               if(!this.rulescount && !this.formulacount){
                multiplecall = true
                 this.ordercalc()
                 let unittypeid = ''
                 this.forms[0].metaData.map((field:any)=>{
                   if(field.fieldtypeid == 34){
                     unittypeid = field.optiondefault
                    }
                 })
                 if(this.oneditmode==false){
                   let temp:any=Number(unittypeid)
                   this.unittypefractionlist(-1,temp)
                 }
               }
               if(this.rulescount && !this.formulacount){
                 this.rulesvalue = 1
                 this.rulesbaseprice()
               }
               if(!this.rulescount && this.formulacount){
                 this.rulesvalue = 2
                 this.rulesbaseprice()
               }
               if(this.rulescount && this.formulacount){
                 this.rulesvalue = 1
                 this.rulesbaseprice()
               }
             }
             let removefieldarray = []
             for (const [key, value] of Object.entries(res[0].data.optionarray)) {
               removefieldarray.push(key)
               if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                 this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                   let optionvaluearray:any = []
                   optionvaluearray = value
                   data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                   let optdefault = ''
                  if(data.fieldtypeid == 2 || data.fieldtypeid == 3 || data.fieldtypeid == 5 || data.fieldtypeid == 19 || data.fieldtypeid == 20 || data.fieldtypeid == 21 || (data.fieldtypeid == 22 && data.issubfabric != 1)){
                     if(data.optiondefault){
                       optdefault = data.optiondefault
                       let splitdefault = data.optiondefault.split(',')
                       let defaultarray = data.optionsvalue.filter(el => data.optiondefault.split(',').includes(el.optionid.toString()))
                       let defaultids = []
                       let defaultnames = []
                       defaultarray.map((val:any)=>{ 
                        if(!defaultids.find(el=>el==val.optionid)) {
                          defaultids.push(val.optionid)
                          defaultnames.push(val.optionname)
                        }
                       })
                         data.optiondefault = defaultids.toString()
                       this.inst.get(data.fieldid.toString()).setValue(defaultnames.toString())
                       if(splitdefault.length != defaultids.length){
                         if(data.optionsvalue.length > 0){
                           let optionvaluefilter = data.optionsvalue.filter(el=>defaultids.includes(el.optionid))
                           if(data.subchild.length > 0){
                             var uniqueResultOne = data.subchild.filter(function(obj) {
                               return !optionvaluefilter.some(function(obj2) {
                                   return obj.forchildsubfieldlinkid == obj2.forchildfieldoptionlinkid
                               })
                             })
                             uniqueResultOne.map((removedata:any)=>{
                               data.subchild = data.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                               this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                               this.removeorderdata(removedata)
                             })
                           }
                         }
                       }
                     }
                   }
                   let optsplitarray = []
                   if(data.optiondefault){
                     optsplitarray = data.optiondefault.split(',')
                   }
                   if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                     data.optiondefault = ''
                     this.inst.get(data.fieldid.toString()).setValue('')
                     if(optdefault){
                       this.removeorderdata(data)
                     }
                   }
                 })
               }
             }
             this.forms[0].metaData.filter(el => !removefieldarray.includes(el.fieldid.toString())).map(data=>{
               if(data.fieldid !=0 && parentfield.fieldid != data.fieldid){
                 if(data.fieldtypeid == 3){
                   data.optiondefault = ''
                   data.optionsvalue = []
                 }
               }
             })
           }     
          this.orderser.orderformeditflag = ''
          this.cd.markForCheck();
        })
        // .catch((err : any) => {
        //   this.enabledisableflag = false;
        // });
      }
      if(this.fabricIds.includes(this.orderparentrow.fieldtypeid) && this.orderparentrow.fieldlevel == 2 && this.orderparentrow.issubfabric != 1){
        // $('#exampleModalbk').modal('hide')
        // let dynamicid = parseInt(this.ordertabindex)
        // $('#subgrid' + dynamicid).focus()
        if(this.singlemultipleflag == 'single'){
          this.enabledisableflag = false
        }
        if(!this.rulescount && !this.formulacount){
          this.ordercalc()
          let unittypeid = ''
          let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
          if( ind  != -1){
            unittypeid = this.forms[0].metaData[ind].optiondefault
          }
          if(this.oneditmode==false){
            let temp:any=Number(unittypeid)
            this.unittypefractionlist(-1,temp)
          }
        }
        if(this.rulescount && !this.formulacount){
          this.rulesvalue = 1
          this.colorrulesbaseprice()
        }
        if(!this.rulescount && this.formulacount){
          this.rulesvalue = 2
          this.colorrulesbaseprice()
        }
        if(this.rulescount && this.formulacount){
          this.rulesvalue = 1
          this.rulesbaseprice()
        }
      }
      else{
        let optiondata:any =[]
        let optionname:any =[]
        let passoptionid:any =[]
        let passsubfieldoptionlinkid:any =[]
        let fabricoptionname:any =[]
        let linkoptionid:any = [] 
        if(this.rowSelection == 'single'){
          this.seletarray.map((rowvalue:any)=>{
            if(rowvalue.subdatacount > 0){
              if(dummyarg==1){
                passoptionid.push(this.softfurningfabricid)
                this.orderparentrow.fieldlevel=1;
                this.orderparentrow.fieldtypeid=22;
                this.orderparentrow.masterparentfieldid=47;
                passsubfieldoptionlinkid.push(this.softfurningfabricid)  
                fabricoptionname.push(this.softfurningfabricname) 
                // optionname.push(rowvalue.optionname) 
              }else{
                passoptionid.push(rowvalue.optionid)
                passsubfieldoptionlinkid.push(rowvalue.fieldoptionlinkid)
                // optionname.push(rowvalue.optionname) 
              } 
            }
            optiondata.push(rowvalue.optionid)
            optionname.push(rowvalue.optionname)
            linkoptionid.push(rowvalue.fieldoptionlinkid)
          })
        }
        else{
          selectedRow.map((rowvalue:any)=>{
            if(rowvalue.subdatacount > 0){
              if(dummyarg==1){
                passoptionid.push(this.softfurningfabricid)
                this.orderparentrow.fieldlevel=1;
                this.orderparentrow.fieldtypeid=22;
                this.orderparentrow.masterparentfieldid=47;
                passsubfieldoptionlinkid.push(this.softfurningfabricid)  
                fabricoptionname.push(this.softfurningfabricname) 
              }else{
                passoptionid.push(rowvalue.optionid)
                passsubfieldoptionlinkid.push(rowvalue.fieldoptionlinkid)
              } 
            }
            optiondata.push(rowvalue.optionid)
            optionname.push(rowvalue.optionname)
            linkoptionid.push(rowvalue.fieldoptionlinkid)
          })
          if(parentfield.fieldtypeid == 33){
            optionname = []
            let optionName = selectedRow.length + " Selected"
            optionname.push(optionName)
          }
        }
        if(dummyarg==1){ 
          this.orderparentrow.field_has_sub_option=1;
       }
      
        if(this.orderparentrow.field_has_sub_option == 1 && ((!this.onlineflag && this.orderparentrow.showfieldonjob == 1) || (this.onlineflag && this.orderparentrow.showFieldOnCustomerPortal == 1))){
          let subgriddata = {
            pricegroupid:selectproducttypeid,
            supplierid:selectsupplierid,
            productid:this.selectedproductid,
            optionid : passoptionid,
            subfieldoptionlinkid : passsubfieldoptionlinkid,
            productionformulalist : this.orderproductiondata,
            orderitemselectedvalues: this.getallselectedvalues(),
            unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault
          }
          let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
          if(passoptionid.length > 0){
            this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
            await this.orderser.dumygetorderitemsublevel(contactid,this.receipe,this.orderparentrow.fieldlevel + 1,subgriddata,this.orderparentrow.fieldtypeid,this.orderparentrow.masterparentfieldid).toPromise().then(async (res: any) => {
              if(this.receipedisabledflag){
                if(res[0].data.length > 0){
                  res[0].data.map((subfield:any)=>{
                    if(subfield.optiondefault || subfield.value){
                      if(!this.getchangefield.includes(subfield.fieldid.toString())){
                        this.getchangefield.push(subfield.fieldid.toString())
                      }
                    }
                  })
                }
              }
              if(Object.keys(this.filterbasearray.option).length > 0){
                for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                  if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                    this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                      let optionvaluearray:any = []
                      optionvaluearray = value
                      data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                      let optsplitarray = []
                      if(data.optiondefault){
                        optsplitarray = data.optiondefault.split(',')
                      }
                      if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                      }
                    })
                  }
                  else{
                    res[0].data.map((filter:any)=>{
                      for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                        if(filter.fieldid == key){
                          let optionvaluearray:any = []
                          optionvaluearray = value
                          if(optionvaluearray.length > 0){
                            filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                            let optsplitarray = []
                            if(filter.optiondefault){
                              optsplitarray = filter.optiondefault.split(',')
                            }
                            if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                              filter.optiondefault = ''
                            }
                          }
                          else{
                            filter.optionsvalue = []
                            filter.optiondefault = ''
                          }
                        }
                      }
                    })
                  }
                }
               }
             if(res[0].data.length > 0){
              res[0].data.map((filter:any)=>{
                if(this.fabricIds.includes(filter.fieldtypeid)){
                  if(filter.fieldtypeid == 20){
                    if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                      if(this.filterbasearray.color.length > 0){
                        filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                      }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                  }
                  else{
                    if(filter.fieldlevel == 1){
                      if(this.category != 6){
                      if(filter.dualseq !=2){ 
                        if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabric.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                        }
                      }
                      if(filter.dualseq ==2){////for dual fabric and color
                        if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabricdual.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabricdual.includes(el.optionid))
                        }
                      }
                    }else{
                      if(filter.multiseq <= 1){ 
                        if(this.filterbasearray.fabric.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabric.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.fabric.includes(el.optionid))
                        }
                      }
                      if(filter.multiseq >1){////for multicurtain and color
                        if(this.filterbasearray.fabricdual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.fabricdual.length > 0){
                          let morefabricidsarrayfiltered = this.filterbasearray.fabricdual.filter(el => el.multiseq == filter.multiseq);
                          filter.optionsvalue = filter.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));
                        }
                      }
                    }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                    }
                    if(filter.fieldlevel == 2){
                      if(this.category != 6){
                      if(filter.dualseq !=2){ 
                        if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.color.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                        }
                      }
                      if(filter.dualseq ==2){////for dual fabric and color
                        if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.colordual.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.colordual.includes(el.optionid))
                        }
                      }
                    }else{
                      if(filter.multiseq <= 1){ 
                        if(this.filterbasearray.color.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.color.length > 0){
                          filter.optionsvalue = filter.optionsbackup.filter(el => this.filterbasearray.color.includes(el.optionid))
                        }
                      }
                      if(filter.multiseq >1){////for multicurtain and color
                        if(this.filterbasearray.colordual.length == 0){ filter.optionsvalue = []}
                        if(this.filterbasearray.colordual.length > 0){
                          let morecoloridsarrayfiltered = this.filterbasearray.colordual.filter(el => el.multiseq == filter.multiseq);
                          filter.optionsvalue = filter.optionsbackup.filter(el => morecoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                        }
                      }
                    }
                      if(filter.optiondefault){
                        if(filter.optionsvalue.filter( el => el.optionid.toString() == filter.optiondefault.toString()).length == 0){
                          filter.optiondefault = ''
                        }
                      }
                    }
                  }
                  this.removeorderdata(this.forms[0].metaData[this.selectedcompindex]);
                }
              })
            }
             if(dummyarg==1){ 
              this.inst.get(this.forms[0].metaData[this.selectedcompindex].fieldid.toString()).setValue(fabricoptionname.toString())
              }else{
                if(dummyarg!=2)
              this.inst.get(this.forms[0].metaData[this.selectedcompindex].fieldid.toString()).setValue(optionname.toString());
              if (dummyarg == 3) {
                this.removeorderdata(this.forms[0].metaData[this.selectedcompindex]);
              }
              } 
  
              this.forms[0].metaData[this.selectedcompindex].optiondefault = optiondata.toString()
              // this.removeorderdata(this.forms[0].metaData[this.selectedcompindex]); //comment on LA-I2046 CASE for ref by ramya
              if(this.forms[0].metaData[this.selectedcompindex].subchild){
                if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
                  res[0].data.map((subfilter:any)=>{
                    const found = this.forms[0].metaData[this.selectedcompindex].subchild.some(el => el.subfieldlinkid == subfilter.subfieldlinkid)
                    if(!found){
                      this.forms[0].metaData[this.selectedcompindex].subchild.push(subfilter)
                    }
                  })
                }
                else{
                  this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
                }
              }
              else{
                this.forms[0].metaData[this.selectedcompindex].subchild = res[0].data
              }
            
           
              if(res[0].data.length > 0){
                res[0].data.map((data:any)=>{
                  if(this.fabricIds.includes(data.fieldtypeid)){
                    if(data.fieldtypeid == 20){
                      this.filterarray.color = data.optionsbackup
                    }
                    else{
                      if(data.fieldlevel == 2){ this.filterarray.color = data.optionsbackup }
                      else { this.filterarray.fabric = data.optionsbackup }
                    }
                  }
                  if(data.fieldtypeid == 13){
                    this.filterarray.pricegroup = data.optionsbackup
                  }
                  if(data.fieldtypeid == 17){
                    this.filterarray.supplier = data.optionsbackup
                  }
                })
                if(this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                  res[0].data.forEach((v,i)=>{
                    v['dumydata'] = []
                    if(v['widthfraction']){
                      v['blindswidth'] = v['widthfraction'].split('_')[0]
                    }
                    else{
                      v['blindswidth'] = 0
                    }
                    if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32 || v.fieldtypeid == 33){
                      if(v?.value == 'null'){ v.value = '' }
                      this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))
                    }
                    else {
                      this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
                    }
                    if(v.fieldtypeid == 28){
                      if(v?.value == 'null'){ v.value = '' }
                      this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)));     
                      this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(0 ,this.mapValidators(v.mandatory)))
                    }
                    // this.inst.get(this.forms[0].metaData[this.selectedcompindex].subchild[0].fieldname).setValue('')
                    const found = this.forms[0].metaData.some(el => el.fieldid === v.fieldid)
                    if(!found){
                      if(v.optiondefault == '' && v.value == ''){
                        this.inst.get(v.fieldid.toString()).setValue('')
                      }
                      this.forms[0].metaData.map((indexdata:any,index:any)=>{
                        if(indexdata.optionsvalue.length > 0){
                          let ind = indexdata.optionsvalue.findIndex( linkid => linkid.forchildfieldoptionlinkid == v.forchildsubfieldlinkid )
                          if( ind != -1 ){
                            this.selectedcompindex = index
                          }
                        }
                      })
                      let subindex = 0
                      subindex = i + 1
                      this.forms[0].metaData = this.insertfieldfn(this.forms[0].metaData, this.selectedcompindex+subindex, v)
                      let orderarraylength:number = this.forms[0].metaData.length
                      if(orderarraylength > 10){
                        this.orderlength = (orderarraylength / 2)
                        if(this.orderlength <= 10) this.orderlength = 10
                      }
                      else this.orderlength = 10
                    }
                  })
                  hasSubChild = true
                }
                if(this.forms[0].metaData[this.selectedcompindex].subchild && this.forms[0].metaData[this.selectedcompindex].subchild.length > 0){
                  if(this.singlemultipleflag == 'single'){
                    this.enabledisableflag = true
                  }
                  hasSubChild = true
                 await this.defaultorderitem(this.forms[0].metaData[this.selectedcompindex].subchild)
                }
                else{
                  if(this.singlemultipleflag == 'single'){
                    this.enabledisableflag = false
                  }
                }
              }
              else{
                if(this.singlemultipleflag == 'single'){
                  this.enabledisableflag = false
                }
              }
              if(Object.keys(this.filterbasearray.option).length > 0){
                for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                  if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                    this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                      let optionvaluearray:any = []
                      optionvaluearray = value
                      data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                      let optsplitarray = []
                      if(data.optiondefault){
                        optsplitarray = data.optiondefault.split(',')
                      }
                      if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        if(data.subchild.length > 0){
                          var uniqueResultOne = data.subchild
                          uniqueResultOne.map((removedata:any)=>{
                            data.subchild = []
                            this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                            this.removeorderdata(removedata)
                          })
                        }
                      }
                    })
                  }
                  else{
                    res[0].data.map((filter:any)=>{
                      for (const [key, value] of Object.entries(this.filterbasearray.option)) {
                        if(filter.fieldid == key){
                          let optionvaluearray:any = []
                          optionvaluearray = value
                          if(optionvaluearray.length > 0){
                            filter.optionsvalue = filter.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                            let optsplitarray = []
                            if(filter.optiondefault){
                              optsplitarray = filter.optiondefault.split(',')
                            }
                            if(filter.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                              filter.optiondefault = ''
                            }
                          }
                          else{
                            filter.optionsvalue = []
                            filter.optiondefault = ''
                          }
                        }
                      }
                    })
                  }
                }
               }
              this.orderchangeflag = true
            })
          }
          else{
            if(this.singlemultipleflag == 'single'){
              this.enabledisableflag = false
            }
            if(this.forms[0].metaData[this.selectedcompindex].subchild){
              if(this.forms[0].metaData[this.selectedcompindex]?.subchild?.length > 0){
                this.removeorderdata(this.forms[0].metaData[this.selectedcompindex]);
                this.forms[0].metaData[this.selectedcompindex].subchild = []
              }
              else{
                this.forms[0].metaData[this.selectedcompindex].subchild = []
              }
            }
            else{
              this.forms[0].metaData[this.selectedcompindex].subchild = []
            }
          }
        }
        else{
          if(this.singlemultipleflag == 'single'){
            this.enabledisableflag = false
          }
        }
          if(!this.rulescount && !this.formulacount && !multiplecall){
            this.ordercalc()
            let unittypeid = ''
            let ind = this.forms[0].metaData.findIndex(field => field.fieldtypeid == 34)
            if(ind != -1){
              unittypeid = this.forms[0].metaData[ind].optiondefault
            }
            if(this.oneditmode==false){
              let temp:any=Number(unittypeid)
              this.unittypefractionlist(-1,temp)
            }
          }
          if(this.rulescount && !this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
          if(!this.rulescount && this.formulacount){
            this.rulesvalue = 2
            this.rulesbaseprice()
          }
          if(this.rulescount && this.formulacount){
            this.rulesvalue = 1
            this.rulesbaseprice()
          }
        // }
      }
    }
    if(this.fabricIds.includes(this.forms[0].metaData[this.selectedcompindex].fieldtypeid)){
      this.commonwidthdropvalidation(this.forms[0].metaData[this.selectedcompindex])
    }
   
    this.closeEscapeFlag = true

    if(selectedRow?.length){
      const uniqueArr = selectedRow.filter((obj, index) => {
        return index === selectedRow.findIndex(o => obj.optionid === o.optionid) && obj.optionimage;
      });
      if(this.orderimageurl === 'assets/noimage.png'){
        this.orderimageurl = uniqueArr[0].optionimage?this.envImageUrl+uniqueArr[0].optionimage :'assets/noimage.png';
      }
      if(this.imageForProColOpt?.optionsimages?.length){
        uniqueArr.forEach((oi) => {
          let checkExist = this.imageForProColOpt.optionsimages.find((e) => e.optionid == oi.optionid)
          if(!checkExist){
            if(this.forms[0].metaData[this.selectedcompindex].fabricorcolor == '2'){
              let flagdata = oi;
              flagdata['flagcolor']=1;
              this.colorimageurl = this.envImageUrl + oi.optionimage + "?nocache=" + this.timestamp;
              this.imageForProColOpt.optionsimages.push(oi)
            }
            else{
              this.showImg = true
              this.imageForProColOpt.optionsimages.push(oi)
              this.tempImage = oi
              if (!this.tempImage.optionimage) {
                this.showImg = false;
              }
            }
          }
        })
      }
      else{
        if(this.forms[0].metaData[this.selectedcompindex].fabricorcolor == '2'){
          uniqueArr.forEach((oi) => {
            let flagdata = oi;
            flagdata['flagcolor']=1;
            this.colorimageurl = this.envImageUrl + oi.optionimage + "?nocache=" + this.timestamp;
            this.imageForProColOpt.optionsimages.push(flagdata)
          })
        }else{
          this.imageForProColOpt.optionsimages = uniqueArr
        }
      }

      // if(selectedRow?.length !== this.standarddata?.length){   // purpose of commenting (after optimization at initial load we will get only one obj in arr, before that we will get all option) //
        let unselectedRow = this.standarddata.filter((item) => { 
            return selectedRow.findIndex(o => item.optionid === o.optionid) === -1
        })
        if(unselectedRow?.length){
          unselectedRow.forEach((sd) => {
            const findInd = this.imageForProColOpt.optionsimages.findIndex((oind) => oind.optionid == sd.optionid)
            if(findInd != -1){
              this.imageForProColOpt.optionsimages.splice(findInd, 1);
              // this.colorimageurl='';
            }
          })
        }
      // }
      this.setCarouselSplitImg()
    }
    else {
      if(this.standarddata?.length && this.imageForProColOpt?.optionsimages?.length){ 
        this.standarddata.forEach((sd) => {
          const findInd = this.imageForProColOpt.optionsimages.findIndex((oind) => oind.optionid == sd.optionid)
          if(findInd != -1){
            this.imageForProColOpt.optionsimages.splice(findInd, 1);
            this.colorimageurl='';
          }
        })
        this.setCarouselSplitImg()
      }
    }
     if(hasSubChild  && this.receipedisabledflag){ // for global edit
        this.removeSubLoader()
    }
    this.checkGlobalInput(this.forms[0].metaData[this.selectedcompindex]) // need this for future fixeing LA-I2370 
    this.cd.markForCheck();
  }
  
  insertfieldfn(arr:any, index:any, item:any){
    return [...arr.slice(0, index),item,...arr.slice(index)]
  }
//order item remove fields
  removeorderdata(removedata:any){
    this.removeCompImg(removedata)
    if(removedata.subchild){
      this.forms[0].metaData.map((sub)=>{
        if(sub.subchild){
          if(sub.subchild.length > 0){
            if(sub.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid).length > 0){
              sub.subchild = sub.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
            }
          }
        }
      })
      removedata.subchild.map((data:any)=>{
        this.forms[0].metaData.map((sub)=>{
          if(sub.subchild){
            if(sub.subchild.length > 0){
              if(sub.subchild.filter(el => el.forchildsubfieldlinkid != data.forchildsubfieldlinkid).length > 0){
                sub.subchild = sub.subchild.filter(el => el.forchildsubfieldlinkid != data.forchildsubfieldlinkid)
              }
            }
          }
        })
        let fieldid = data.fieldid
        const fielddata = this.forms[0].metaData.find(el => el.fieldid == fieldid)
        if(fielddata){
          if(fielddata.fieldtypeid == 28){
            this.inst.get(`${fielddata.fieldid}_${fielddata.fieldname}`.toString()).setValue(0);
          }
          this.inst.get(fielddata.fieldid.toString()).setValue('')
          let result = this.forms[0].metaData.filter(o1 =>  o1.fieldid != fielddata.fieldid)
          this.forms[0].metaData = result
          removedata.subchild = []
          let orderarraylength:number = this.forms[0].metaData.length
          this.orderlength = (orderarraylength / 2)
          if(this.orderlength <= 10) this.orderlength = 10
          this.removeorderdata(fielddata)
        }
      })
    }
    this.cd.markForCheck();
  }
//order option value close
  cancelModalbk(){
    // alert("flag true from cancel modal")
    this.commonfilter.resetsearch();
    this.closeEscapeFlag = true
    $('#exampleModalbk').modal('hide')
    let dynamicid = parseInt(this.ordertabindex)
    $('#subgrid' + dynamicid).focus()
    $('#exampleModalbk').on('hidden.bs.modal', function () {
      if(this.closeEscapeFlag){
        $('#subgrid' + dynamicid).focus()
      }
      else{
        $('#subgrid' + (dynamicid)).focus()
      }
    })
  }
//order item production tab
  productiontabClick(event){
    this.productionindex = event.index
  }
//order item production list
  async productstatustabClick(event){
    this.productionindex = 0;
    this.ruleModeOpt = false;
    // this.productstatusselectedindex = event.index
    if(event.index == 1){
      this.ruleModeOpt = true;
      this.ordercalculationarray = []
      let pushdata:any = {}
      this.costpricevalue = 0
      this.orderCalculationFun()
      this.formulaCalculation()
      if(this.priceCalculation) 
      this.runRule();
    }
  }
  runRule(){ 
    if(!this.rulescount && !this.formulacount){
      this.ordercalc(false,'runRule')
      let unittypeid = ''
      this.forms[0].metaData.map((field:any)=>{
        if(field.fieldtypeid == 34){
          unittypeid = field.optiondefault
         }
      })
      if(this.oneditmode==false){
        let temp:any=Number(unittypeid)
        this.unittypefractionlist(-1,temp)
      }
    }
    if(this.rulescount && !this.formulacount){
      this.rulesvalue = 1
      this.rulesbaseprice('runRule')
    }
    if(!this.rulescount && this.formulacount){
      this.rulesvalue = 2
      this.rulesbaseprice('runRule')
    }
    if(this.rulescount && this.formulacount){
      this.ruleModeOpt = true;
      this.rulesvalue = 1
      this.rulesbaseprice('runRule')
    }
  }
  orderCalculationFun(){
      this.ordercalculationarray = []
      let pushdata:any = {}
      this.costpricevalue = 0
    this.forms[0].metaData.map((optiondata:any)=>{
      if(optiondata.fieldtypeid == 3){
        if(optiondata.optiondefault){
          let valuesplit = optiondata.optiondefault.toString().split(',')
          valuesplit.map((data:any)=>{
            let defaultoptionname =  optiondata.optionsvalue.filter(o1 => o1.optionid.toString() == data.toString())
            if( defaultoptionname.length > 0 ){
              if(defaultoptionname[0]?.hasstock == 1 ||  (this.costpricecomesfrom == "2" || this.netpricecomesfrom =="2") || (this.costpricecomesfrom == 3 && this.netpricecomesfrom == 3 && (defaultoptionname[0]?.hasprice == 1 || optiondata.fieldtypeid == 33))){
                if( this.orderpricecalculation?.optionprice[data] != undefined){
                    let costPrice = parseFloat(this.orderpricecalculation.optionprice[data]['costprice']) 
                    let sellingPrice = parseFloat(this.orderpricecalculation.optionprice[data]['customersellingprice'])
                    let quantity = parseFloat(this.orderpricecalculation.optionprice[data]['quantity'])
                    pushdata = {
                      name: defaultoptionname[0]?.optionname,
                      costprice: costPrice,
                      quantity: quantity,
                      hasstock: defaultoptionname[0]?.hasstock,
                      sellingprice: sellingPrice,
                    }
                    this.ordercalculationarray.push(pushdata)
                }
              }
            }
          })
        }
      }
    })
    this.cd.markForCheck();
  }
  valueChange(event?, flag?) {
    if (!event && !['keep', 'update', 'cancel'].includes(flag)) {
      return;
    }
    if (event || ['keep', 'update'].includes(flag)) {
      let currentProdDate = new Date(new Date(this.jobDueDate).setHours(0, 0, 0, 0)).getTime();
      let newProdDate = event ? new Date(new Date(event).setHours(0, 0, 0, 0)).getTime() : null;
      if (!this.ngxModalService.modals['dueDateModal'] && this.dateClicked && this.jobStatus >= 2 && newProdDate > currentProdDate) {
        this.ngxModalService.openModal(this.dueDateModal, 'dueDateModal');
      }
      if (event) {
        this.orderpricecalculation.productiondate = event;
      }
      this.datevalidation = ''
      let createdate = new Date(new Date(this.orderpricecalculation.createdate).setHours(0, 0, 0, 0)).getTime()
      let productiondate = new Date(new Date(this.orderpricecalculation.productiondate).setHours(0, 0, 0, 0)).getTime()
      if (this.orderpricecalculation.productiondate) {
        if (createdate > productiondate) {
          this.datevalidation = "Invalid Production Date"
        }
        if (createdate != productiondate) {
          this.orderchangeflag = true
        }
      }
    } else if (flag == 'cancel') {
      this.orderpricecalculation.productiondate = this.lastDueDate;
      this.datevalidation = ''
      let createdate = new Date(new Date(this.orderpricecalculation.createdate).setHours(0, 0, 0, 0)).getTime()
      let productiondate = new Date(new Date(this.orderpricecalculation.productiondate).setHours(0, 0, 0, 0)).getTime()
      if (this.orderpricecalculation.productiondate) {
        if (createdate > productiondate) {
          this.datevalidation = "Invalid Production Date"
        }
        if (createdate != productiondate) {
          this.orderchangeflag = true
        }
      }
    }
  }
  dueDateUpdate(flag) {
    this.dateClicked = false;
    if (flag == 'keep') {
      this.manualDueDate = 2;
    } else if (flag == 'update') {
      this.manualDueDate = 1;
    }
    this.ngxModalService.closeModal('dueDateModal');
    this.valueChange('', flag);
  }
  currencySymFlag:boolean=false;
  changepricecalc(event:any,name?:any,id?:any){
    this.isInvalidDiscount=false
    this.selectedId = id;
    this.orderchangeflag = true;
    this.overridetypeValue = true;
    if(event==undefined||event==null){
      return;
    }
    this.orderpricecalculation.overrideprice = event
    this.orderchangeflag = true
    this.roundOfroundOnValue = event // LA-I575 roundon case VIJAY
    if(event==1){
      this.overRideFlag=true
      this.currencySymFlag = false;
      this.selectedNameForOverridePrice =  name
    }else if(event==6 || event==7 || event==8 ){
      this.currencySymFlag = false;
      this.overRideFlag=true
      this.selectedNameForOverridePrice = name
    }
    else{
      event=='4' ? this.currencySymFlag = false : this.currencySymFlag = true;
      this.overRideFlag=false
      this.selectedNameForOverridePrice =  name
    }
    this.validationflag = false;
    this.saveflag=false;
    this.validationerrmsg = "";
    this.orderpricecalculation.overridepricecalc = ''
    if (this.ispriceenable == 1 && !this.onlineflag) {
      this.ordercalc();
    }
      }
//order item price calc
  orderpricecalc(event){
    this.orderchangeflag = true
    this.validationerrmsg = ""
    this.validationflag = false
    this.saveflag=false;
    if(this.orderpricecalculation.overrideprice == 5){
      let discountvalue:any = parseFloat(event.target.value)
      let netprice:any = parseFloat(this.oldorderpricecalculation.netprice) ?? parseFloat(this.endcustomerorderpricecalculation.netprice)
      if(netprice < discountvalue){
        if (!this.receipedisabledflag) {
          this.validationflag = true
          this.saveflag=true;
          this.validationerrmsg = 'Discount price should be less then net price'
        }
      }
      this.maxDiscountCalculation.next()
    }
    if(this.orderpricecalculation.overrideprice == 4){
      if(event.target.value > 100){
        this.validationflag = true
        this.saveflag=true;
        this.validationerrmsg = 'Discount percentage should be less then 100%'
      }
      this.maxDiscountCalculation.next()
    }
    if (this.ispriceenable == 1 && !this.onlineflag) {
      this.ordercalc();
    }
  }
  ///online portal end customer price calculation
  endorderpricecalc(event){
    this.orderchangeflag = true
    this.validationerrmsg = ""
    this.validationflag = false
    this.saveflag=false;
    if(this.endcustomerorderpricecalculation.overrideprice == 5){
      let discountvalue:any = parseFloat(event.target.value)
      let netprice:any = parseFloat(this.oldorderpricecalculation.netprice) ?? parseFloat(this.endcustomerorderpricecalculation.netprice)
      if(netprice < discountvalue){
        this.validationflag = true
        this.saveflag=true;
        this.validationerrmsg = 'Discount price should be less then net price'
      }
    }
    if(this.endcustomerorderpricecalculation.overrideprice == 4){
      if(event.target.value > 100){
        this.validationflag = true
        this.saveflag=true;
        this.validationerrmsg = 'Discount percentage should be less then 100%'
      }
    }
  }
  currencySymFlagOnline = true
  onlineportalchangepricecalc(event){
    this.orderchangeflag = true;
    this.endcustomerorderpricecalculation.overrideprice = parseFloat(event.target.value)
    this.overRideFlag = event.target.value==1 ? true : false
    this.currencySymFlagOnline = event.target.value != "4" && event.target.value != "1" ? true : false;
    this.validationflag = false;
    this.saveflag=false;
    this.validationerrmsg = "";
    this.endcustomerorderpricecalculation.overridepricecalc = '';
  }
  onlineportalorderpricecalc(){
    this.saveflag = true;
    let edata = {
      vatvalue: this.endcustomerorderpricecalculation.vat ?? this.vatvalue,
      overridetype: this.endcustomerorderpricecalculation.overrideprice,
      overridevalue: this.endcustomerorderpricecalculation.overridepricecalc,
      netprice: this.oldorderpricecalculation.netprice,
      mode: 'order item',
      productid:this.selectedproductid,
      jobid:this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id'): this.job_tempid,
      customertype:this.productser.customerType,
      pivotId: this.pivotId ? this.pivotId : ''
  }
  edata.vatvalue = this.endcustomerorderpricecalculation.vat ? this.endcustomerorderpricecalculation.vat : this.vatvalue
  this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction 
  this.orderser.onlinegetoverridevatvalue(edata).subscribe((res:any)=>{
      if(res.data){
        this.endcustomerorderpricecalculation.netprice=res.data.net;
        this.endcustomerorderpricecalculation.totalgross=res.data.gross;
        this.endcustomerorderpricecalculation.calvatprice=res.data.vat;
        this.saveflag = false;
      }
      if (this.forms[0].metaData.some((e: any) => e?.fieldtypeid === 6 && e?.numeric_setcondition)) {
        this.minMaxSetConditionFull(); // LA-I3072 Condition added
        this.cd.markForCheck();
      }
      this.cd.markForCheck();
    },err =>{
      
    })
  }
  tracker(index: any, item: any) {
		return index
	}
  fractiontracker(index: any, item: any) {
	return item.id
	}
//order form status change
  changeorderstatus(event:any){
    let readyarray = {}
    readyarray[this.orderid] = event.target.checked ? 1 : 0
    let readyorderdata = {
      orderitemids : readyarray,
      jobid:this.route.snapshot.paramMap.get('id')
    }
    this.orderser.updatereadyorderitem(readyorderdata).subscribe((res: any) => {
      if(res?.result == 1)
        this.toast.successToast(res.message)
    })
  }
  async getGlobalLocation(id: number) {
    const field = { fieldid: id };  
      const response:any = await this.orderser.getGlobalLocation(field).toPromise();
      this.globalLocation = response.result;    
  }
//order form edit
staticArrayData = []
  orderdataedit(params,mode){
    params = params[0]!==undefined?params[0]:params  //if 'save&copy'=>params[0] else params
    this.orderser.orderformeditflag = ''
    this.unittypevaluehideshow ='';
    this.inchfractionselected='';
    this.widthdropfraction.width=0;
    this.orderproductiondata = [];
    this.ordercalculationarray = []
    this.widthdropfraction.drop=0;
    this.widthdroppriceflag = false 
    this.oneditmode = false 
    this.widthdroppricemsg = ''
    this.unittypedata = ''
    let vat_data = {
      productid:params.productid,
      jobid: this.route.snapshot.paramMap.get('id'),
      orderid:params.id,
      mode:mode,
      organisation:this.organisation_id,
      zipcode:this.zip_code
    };
    this.forms = []
    this.tempLoad(params,mode)
    this.orderser.getvatvalue('orderitem',vat_data).subscribe((res:any)=>{
      this.alertonPrice = res.alert_on_price_update;
      this.showtaxjobitem = res.showtaxjobitem
      this.vatcalctoggle = res.vatonoff
      this.vatarray = res.taxlist
      this.saveFlag = false;
      this.productMaxSqArea = res.productMaxSqArea;
      this.enableMaxSqAreaOnlineOrder = res.enableMaxSqAreaOnlineOrder;
      this.maxSqAreaFlagCheck = true;
      let getvalue = ''
       if(res.vatonoff == 0){
        getvalue = res.taxlist[0].value
        this.vatvalue = getvalue
      }
      if(this.ordervattype != this.vattypearray.type){
        this.ordervattype = this.vattypearray.type
      }
      this.vatinputboxvalue = getvalue ? getvalue : res.data
      // this.vatvalue = this.vatinputboxvalue
      this.vat_type = res.vat_type
      this.defaultsalestaxlabel = res.defaultsalestaxlabel
      this.cd.markForCheck();
    })
    this.productmanuallist(params.productid)
    this.prostatus = ''
    this.prostatusselectarray = []
    this.orderser.productstatus(params.productid).subscribe((res: any) => {
      this.productstatusarray = res.data.productionstatuslist
      // this.prostatussinglemultipleflag = res.data.productstatusselectiontype
      this.prostatussinglemultipleflag = "2" // set always single select for operation LA-I297 // set always Multi select for  LA-I349 Factory setup
      this.cd.markForCheck();
    })
    this.costpriceflag = false
    this.ordereditparams = params
    this.orderchangeflag = false
    this.validationerrmsg = ""
    this.validationflag = false
    this.orderpricecalculation = {
      createdate: new Date(),
      productiondate: new Date(),
      costpricetoggle: false,
      totalcost: '',
      overrideprice: 1,
      overridepricecalc: '',
      netprice: '',
      vat: this.vatvalue,
      totalgross:'',
      optionprice: '',
      pricegroupprice: ''
    }
    this.orderid = params.id
    this.receipe = params.recipeid
    // Reset `showImg` to false so the background image is shown initially
    this.showImg = false;
    // Clear tempImage so previous selections do not interfere
    this.tempImage = null;
    this.selectionProductFieldName = this.receipedisabledflag ? 'Global Edit - ' + params.productname : params.productname + ' Info'
    this.productstatusflag = true
    this.selectedproduct = params.productid
    this.selectedproductid = params.productid
    this.orderser.getreceipelist(params.productid,params.recipeid).subscribe((res: any) => {
      this.priceCalculation = res[0].priceCalculation === 0 ? true : false;
      // this.orderimageurl = res?.[0]?.imageurl ?  this.envImageUrl+res[0].imageurl :  'assets/no-image.jpg'
      this.orderimageurl = res[0]?.imageurl ? this.envImageUrl+res[0].imageurl : '';
      this.backgroundimageurl = res[0]?.backgroundimageurl ? this.envImageUrl+res[0].backgroundimageurl : '';
      this.frameimageurl = res[0]?.frameimageurl ? this.envImageUrl+res[0].frameimageurl : '';
      this.backgroundimageurl = (this.backgroundimageurl == '' && this.frameimageurl == '' && this.orderimageurl == '') ?  'assets/noimage.png' : this.backgroundimageurl;
      // $('.prdimg').css('background-image', 'url(' + '"' + this.orderimageurl + '"' + ')');
      $('.prdimg').css('background-image', 'url(' + '"' + this.backgroundimageurl + '"' + ')');
      this.receipelistArr = res[0].data
      const found = this.receipelistArr.find(el => el.id == this.receipe)
      this.receipename = found.recipename;
      if(!this.receipedisabledflag){
        this.rulescount = found.rulescount
        this.formulacount = found.formulacount
      }
      else{
        this.rulescount = 0
        this.formulacount = 0
      }
      let contactid=this.currentcontactid=(this.productser.contactid==0)?0:this.productser.contactid ;  
      this.orderser.orderformeditflag = ''
      this.orderser.editorderdefaultdata(params.recipeid,1,contactid,params.id,mode).subscribe(async (res:any)=>{
        this.productarr = this.productser.orderproarray
        this.category = params.pi_category
        this.staticArrayData = res[0].static_headers
        // this.category= this.productarr?.filter((data:any) => data.id == this.selectedproductid)[0]["category"]
        this.noSupplierbasedflag = res[0].supplierbasedproduct;
        this.isdualproduct = res[0].isdualproduct;
        this.orderpricevalidation.costprice = res[0].orderitemdata.result.costprice
        this.orderpricevalidation.netprice = res[0].orderitemdata.result.netprice
        this.orderpricevalidation.grossprice = res[0].orderitemdata.result.grossprice
        this.ordervattype = res[0].orderitemdata.result.vattype
        this.vatvalue = res[0].orderitemdata.result.vatvalue
        if(res[0].orderitemdata.result.productionstatus.length > 0){
          this.prostatusselectarray = this.productstatusarray.filter(el => res[0].orderitemdata.result.productionstatus.includes(el.id.toString()))
          this.orderstatusidarray = this.prostatusselectarray
        }
        this.orderpricearray =  res[0].orderitemoverride_nested_dropdowns
        let onlineOrderFormPriceLIST = res[0].orderitemoverride
        let ind = onlineOrderFormPriceLIST.findIndex(typeres => typeres?.primaryid==1)
        if( ind != -1 ){
          onlineOrderFormPriceLIST[ind].displayname = 'Override Price'
          onlineOrderFormPriceLIST[ind].label = 'Override Price'
          onlineOrderFormPriceLIST[ind].name = 'Override Price'
        }
        this.onlineOverrideTypeARRAY = onlineOrderFormPriceLIST
        this.costpricecomesfrom = res[0].costpricecomesfrom
        this.netpricecomesfrom = res[0].netpricecomesfrom
        this.receipe = res[0].orderitemdata.result['recipeid']
        this.orderproductiondata = []
        this.orderproductiondata = res[0].productionformuladata

        if(this.orderproductiondata.length > 0){
          this.orderproductiondata.map((val:any)=>{
            val['pricevalue'] = val.productioneditedvalue
            val['showhideflag'] = val.productioneditedvalue ? 1 : 0
            val['pricecalvalue'] = ''
            val['unittype'] = ''
            // val['productionmode'] = 0
            val['productionoverrideeditflag'] = val.productionoveride
          })
        }
       
        if(res[0].orderitemdata?.result['widthfraction'] || res[0].orderitemdata?.result['dropfraction']){
            if((res[0].orderitemdata?.result['widthfraction']?.split('_')[2]!=3  || res[0].orderitemdata?.result['dropfraction']?.split('_')[2]!=3 ) && (res[0].orderitemdata?.result['widthfraction']?.split('_')[1]=='Inches'  || res[0].orderitemdata?.result['dropfraction']?.split('_')[1]=='Inches')){ 
             this.unittypefractionlist(res[0].orderitemdata?.result['widthfraction']?.split('_')[2]); 
            this.inchfractionselected=res[0].orderitemdata?.result['widthfraction']?.split('_')[2];
            this.unittypevaluehideshow='Inches';
            
            if(res[0].orderitemdata?.result['widthfraction']?.split('_')[2])
            this.widthdecimalinches=res[0].orderitemdata?.result['widthfraction']?.split('_')[3]

            if(res[0].orderitemdata?.result['dropfraction']?.split('_')[2])
            this.dropdecimalinches=res[0].orderitemdata?.result['dropfraction']?.split('_')[3] 
            this.widthdropfraction.width = (res[0]?.orderitemdata?.result['widthfraction']?.split('_')[0]) 
            ? res[0].orderitemdata?.result['widthfraction']?.split('_')[0]: 0;
            this.widthdropfraction.drop= (res[0].orderitemdata?.result['dropfraction']?.split('_')[0])
            ?res[0].orderitemdata?.result['dropfraction']?.split('_')[0] : 0;
            }else if((res[0].orderitemdata?.result['widthfraction']?.split('_')[2]==3  || res[0].orderitemdata?.result['dropfraction']?.split('_')[2]==3) && (res[0].orderitemdata?.result['widthfraction']?.split('_')[1]=='Inches'  || res[0].orderitemdata?.result['dropfraction']?.split('_')[1]=='Inches')){
              this.inchfractionselected=3;
              this.unittypevaluehideshow='Inches';
            } 
            
            this.oneditmode = true; 
        } 
        this.orderpricecalculation.costpricetoggle = res[0].orderitemdata.result['costoverride'] == 1 ? true : false
        this.orderpricecalculation.totalcost = res[0].orderitemdata.result['costprice'].toFixed(this.decimalvalue)
        if(this.orderpricecalculation.costpricetoggle){
          this.costpriceflag = true
        }
        this.oldorderpricecalculation.netprice = res[0].orderitemdata.result['netprice'],
        this.oldorderpricecalculation.vat = res[0].orderitemdata.result['vatprice'],
        this.oldorderpricecalculation.totalgross  = res[0].orderitemdata.result['grossprice']
         //////for online portal
         this.endcustomerorderpricecalculation.netprice = res[0].orderitemdata.result['endcustomeroverridenetprice'],
         this.endcustomerorderpricecalculation.vat = res[0].orderitemdata.result['endcustomervatprice'],
        this.endcustomerorderpricecalculation.totalgross  = res[0].orderitemdata.result['endcustomeroverridegrossprice']
        this.endcustomerorderpricecalculation.overrideprice  = res[0].orderitemdata.result['endcustomeroverridetype']
        this.currencySymFlagOnline = this.endcustomerorderpricecalculation.overrideprice != 4 && this.endcustomerorderpricecalculation.overrideprice != 1 ? true : false;
        this.endcustomerorderpricecalculation.overridepricecalc  = res[0].orderitemdata.result['endcustomeroverridevalue']
        this.endcustomerorderpricecalculation.calvatprice  = res[0].orderitemdata.result['endcustomeroverridevatprice']
        this.orderpricecalculation.netprice = res[0].orderitemdata.result['overridenetprice'],
        this.orderpricecalculation.vat = res[0].orderitemdata.result['overridevatprice'],
        this.orderpricecalculation.totalgross  = res[0].orderitemdata.result['overridegrossprice']
        // this.orderpricecalculation.overridepricecalc = res[0].orderitemdata.result['overridevalue'] === null ? res[0].orderitemdata.result['overrideprice'] = '' : res[0].orderitemdata.result['overrideprice'],
        let overridevalue =  res[0].orderitemdata.result['overridevalue'] === null ? res[0].orderitemdata.result['overrideprice'] = '' : res[0].orderitemdata.result['overrideprice']
        this.orderpricecalculation.overridepricecalc = overridevalue !== "" ? parseFloat(overridevalue).toFixed(this.decimalvalue) : ''
        this.orderpricecalculation.overridepricecalc = res[0].orderitemdata.result['overridevalue'];
        this.orderpricecalculation.overridevalue = res[0].orderitemdata.result['overridevalue']
        this.orderpricecalculation.overrideprice = res[0].orderitemdata.result['overridetype']
        this.selectedNameForOverridePrice = 'select'
        if(this.orderpricecalculation.overrideprice==1){
          this.overRideFlag=true
        }
        if(this.endcustomerorderpricecalculation.overrideprice==1){
          this.overRideFlag=true
        }
        if(this.orderpricecalculation.overrideprice == 6 || this.orderpricecalculation.overrideprice == 7 || this.orderpricecalculation.overrideprice == 8){
          this.overRideFlag=true;
        } 
       else if(this.orderpricecalculation.overrideprice!=1){
          this.overRideFlag=false
        }
        if(mode == 'copy'){
          this.datevalidation=''
          this.vatvalue = this.vatinputboxvalue;
        }
        this.orderpricearray.map((res:any)=>{
          if(res?.primaryid==this.orderpricecalculation.overrideprice){
            this.selectedNameForOverridePrice = res.name
            this.selectedId = res.id
          }else{
            if(res?.sub_data?.length>0){
              res?.sub_data?.map((resTwo:any)=>{
                if(resTwo?.primaryid==this.orderpricecalculation.overrideprice){
                  if(this.orderpricecalculation.overrideprice=='4'||this.orderpricecalculation.overrideprice=='5'){
                    this.selectedNameForOverridePrice = resTwo?.displayname;
                    this.overRideFlag=false
                    this.orderpricecalculation.overrideprice =='4' ? this.currencySymFlag = false : this.currencySymFlag = true;
                  }else{
                    this.overRideFlag=true;
                    (this.orderpricecalculation.overrideprice =='2' || this.orderpricecalculation.overrideprice =='3') ? this.currencySymFlag = true : this.currencySymFlag = false;
                    this.selectedNameForOverridePrice = 'Round Gross Price'
                  }
                }
              })
            }
          }
        })
        this.orderpricecalculation.createdate = mode == 'copy' ? new Date() : this.service.convertToDate( res[0].orderitemdata.result['createdat'])
        this.orderpricecalculation.productiondate = mode == 'copy' ? new Date() :res[0].orderitemdata.result['productiondate']  ? this.service.convertToDate( res[0].orderitemdata.result['productiondate'] ) :""
        this.lastDueDate = this.orderpricecalculation.productiondate
        if(mode=='copy' && (this.orderpricecalculation.overrideprice == 4 || this.orderpricecalculation.overrideprice == 5)){
          this.validateMaxVal()
        }
        this.productstatusflag = true
        if(res[0]?.data.length>0){
          res[0]?.data.map((data:any,index)=>{
            if(data.fieldtypeid == 3 || data.fieldtypeid == 2 || this.fabricIds.includes(data.fieldtypeid)){
              if(data.optiondefault){
                this.editorderitemselectedvalues[data.fieldid]  = (typeof data.optiondefault == 'number')?(data.optiondefault.toString().split(',')):data.optiondefault.split(',')
              }
            }
          })
          this.forms = []
          this.imageForProColOpt.optionsimages = []
          this.imageForProColOpt.splitoptionsimages = []
          this.colorimageurl='';    
          this.inst = this.fb.group({})
          let dataObject = res[0].data
          this.selectedproductfield = res[0].data
          dataObject.forEach(async (v,i)=>{
            if(v['widthfraction']){
              v['blindswidth'] = v['widthfraction'].split('_')[0]
            }
            else{
              v['blindswidth'] = 0
            }
            if(v.fieldtypeid == 34){
              if(v.optiondefault){
                this.unittypedata = v.optionsvalue.filter(el => el.optionid.toString() == v.optiondefault.toString())[0].optionname
              }
            }
            if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32 || v.fieldtypeid == 33 || v.fieldtypeid == 28){
              if(v?.value == 'null'){ v.value = '' }
              this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))            
            } 
            else {
              if(v.fieldtypeid == 22 && v.issubfabric != 1)
              this.sofyfurningindex=i;
              else if(v.fieldtypeid == 13)
              this.pricegroupindex=i;
              else if(v.fieldtypeid == 17)
              this.supplierindex=i;
              this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
            }
            if(v.fieldtypeid == 28){
              
              if(v?.value == 'null'){ v.value = '' }
              this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)));     
              this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(v?.numberfraction?.split('_')[0] ?? '0',this.mapValidators(v.mandatory)))
            }
            if(this.category != 6){
            if(v.fieldtypeid ==13 && v.dualseq != 2)
            {
              this.selectproduct_typeid = v.value;
            }
            if(v.fieldtypeid ==13 && v.dualseq == 2)
            {
              this.selectproduct_typeiddual = v.value;
            }
          }else{
            if(v.fieldtypeid ==13 && v.multiseq <= 1)
              {
                this.selectproduct_typeid = v.value;
              }
              if(v.fieldtypeid ==13 && v.multiseq > 1)
              {
                let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                if(unique !== -1){
                  this.selectproduct_typeiddual[unique].id = v.value;
                }else{
                  this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:v.value});
                }
              }
          }
            if (v.fieldtypeid == 4) {  // If default value is there for location_list.
              this.searchTerm = v?.userinputlocation ?? '';                   
              this.locationId = v?.locationid;
              this.productId = v?.productId;
              await this.getGlobalLocation(v.fieldid);
              const globalFiltered = this.globalLocation.filter(item => item.fieldOptionLinkId !== null); // Get the order of ids from arr2
              v.optionsvalue = globalFiltered.map(id => v.optionsvalue.find(item => item.fieldoptionlinkid === id.fieldOptionLinkId));
              this.listOfLocations = v.optionsvalue;     
              this.cd.markForCheck();        
            }
          });
          const form: form = {
            id: new Date().getUTCMilliseconds().toString(),
            formGroup: this.inst,
            metaData: dataObject,
            transactionalData: []
          }
          this.forms.push(form)
           this.currentFiledID = this.forms[0].metaData[0].fieldid;
         
          let orderarraylength:number = this.forms[0].metaData.length
          this.orderlength = (orderarraylength / 2)
          if(this.orderlength <= 10) this.orderlength = 10
          let orderdefaultarray = []
          orderdefaultarray = dataObject.filter(el => el.optiondefault)
                    if(orderdefaultarray.length > 0){
           await this.orderformdefault(orderdefaultarray)
           this.orderser.orderformeditflag = ''
           await this.getFilterData("filterBasedcall")
           this.loader.next()
            // setTimeout(() => {
              // this.filterbasecall()
            // }, 1000)
          }
          this.firstLoad = true
          this.loadcomboGrid(true)
          const ClonedArray = cloneDeep(dataObject)
          this.ordereditform = ClonedArray
          this.saveorderflag = true
        //  $('#sampleModal').modal('show')
          let widthdropvalidation = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 || this.fabricIds.includes(el.fieldtypeid))
          if(widthdropvalidation.filter(el => this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 2).length > 0){
            this.commonwidthdropvalidation(widthdropvalidation.filter(el => this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 2)[0])
          }
          if(widthdropvalidation.filter(el => this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 2).length == 0){
            if(widthdropvalidation.filter(el => el.fieldtypeid == 13).length > 0){
              if(widthdropvalidation.filter(el => el.fieldtypeid == 13)[0].optiondefault){
                this.commonwidthdropvalidation(widthdropvalidation.filter(el => el.fieldtypeid == 13)[0])
              }
            }
          }
          this.forms[0].metaData.map((field:any,index:any)=>{
            if(field.fieldtypeid == 6){
              let emptycheck = this.inst.controls[field.fieldid.toString()].value;
              let checkvalue = parseFloat(this.inst.controls[field.fieldid.toString()].value);
              let numeric_min = field.numeric_minvalue;
              let numeric_max = field.numeric_maxvalue;
              this.numericminmaxvalue = '';
              if ((numeric_min == 0 && numeric_max == 0) || (emptycheck=='' )) {
                this.inst.controls[field.fieldid.toString()]?.setErrors(null);
              } else {
                if ((checkvalue && !isNaN(checkvalue) && checkvalue >= numeric_min && checkvalue <= numeric_max)) {
                  this.inst.controls[field.fieldid.toString()]?.setErrors(null)
                } else {
                  this.numericminmaxvalue = '(Min ' + numeric_min + ' - Max ' + numeric_max + ')'
                  this.inst.controls[field.fieldid.toString()]?.setErrors({ errors: this.numericminmaxvalue });
                }
              }
            }
          })
          if (this.forms[0].metaData.some((e: any) => e?.fieldtypeid === 6 && e?.numeric_setcondition)) {
            this.minMaxSetConditionFull(); // LA-I3072 Condition added
            this.cd.markForCheck();
          }
          return form
        }
        else {
          this.forms =[]
          this.imageForProColOpt.optionsimages = []
          this.imageForProColOpt.splitoptionsimages = []
          this.colorimageurl='';    
        }
        this.closeflag = false;
        this.cd.markForCheck();
      },(err)=>{
        this.closeflag = false;
      })
    })
  }
  
  async tempLoad(params,mode?){
    let rowdata = params.jsondata
    let dataObject:any = rowdata.filter(x => x.fieldlevel == 1)
    if( dataObject[0]?.fieldtypeid ){
      dataObject.forEach((v,i)=>{
        
        if(v['widthfraction']){
          v['blindswidth'] = v['widthfraction'].split('_')[0]
        }else{
          v['blindswidth'] = 0
        }
        if(v.fieldtypeid == 34){
          if(v.optiondefault){
            this.unittypedata = v.optionsvalue.filter(el => el.optionid.toString() == v.optiondefault.toString())[0].optionname
          }
        }
        if(v.fieldtypeid == 1 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32 || v.fieldtypeid == 33 || v.fieldtypeid == 28){
          if(v?.value == 'null'){ v.value = '' }
          this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)))            
        } 
        else {
          if(v.fieldtypeid == 22 && v.issubfabric != 1)
          this.sofyfurningindex=i;
          else if(v.fieldtypeid == 13)
          this.pricegroupindex=i;
          else if(v.fieldtypeid == 17)
          this.supplierindex=i;
          this.inst.addControl(v.fieldid,this.fb.control(null,this.mapValidators(v.mandatory)))
        }
        if(v.fieldtypeid == 28){
          
          if(v?.value == 'null'){ v.value = '' }
          this.inst.addControl(v.fieldid,this.fb.control(v?.value ?? '',this.mapValidators(v.mandatory)));     
          this.inst.addControl(`${v.fieldid}_${v.fieldname}`,this.fb.control(v?.numberfraction.split('_')[0] ?? '',this.mapValidators(v.mandatory)))
        }
        if (this.category != 6) {
          if (v.fieldtypeid == 13 && v.dualseq != 2) {
            this.selectproduct_typeid = v.value;
          }
          if (v.fieldtypeid == 13 && v.dualseq == 2) {
            this.selectproduct_typeiddual = v.value;
          }
        } else {
          if (v.fieldtypeid == 13 && v.multiseq <= 1) {
            this.selectproduct_typeid = v.value;
          }
          if (v.fieldtypeid == 13 && v.multiseq > 1) {
            
            this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:v.value});          
          }
        }
      })
      const form: form = {
        id: new Date().getUTCMilliseconds().toString(),
        formGroup: this.inst,
        metaData: dataObject,
        transactionalData: []
      }
      this.forms.push(form)
      let orderarraylength:number = this.forms[0].metaData.length
      this.orderlength = (orderarraylength / 2)
      if(this.orderlength <= 10) this.orderlength = 10
      let orderdefaultarray = []
      orderdefaultarray = dataObject.filter(el => el.optiondefault)
      if(orderdefaultarray.length > 0){
        await this.orderformdefault(orderdefaultarray)
      }
    }  
    this.saveorderflag = true;
    this.apiflagcount = 0
    this.dateClicked = false;
    if (!this.save_copy) {    
      this.ngxModalService.openModal(this.globalProductModal, 'globalProductModal', 'customWidth');
      this.firstLoad = true
    }
    this.closeflag = false;
    this.cd.markForCheck();
  } 
  public calenderPriceList = [];
  public workPriceList = [];
  public totalCostPrice:any;
  public oldOperations:any;
public costList = []
  getCostList(){
    return new Promise((resolve, reject) => { 
          this.addeditmode;
          this.vatvalue
          let vatValue = this.vatvalue;
          var sendData = { "vat_price" : vatValue }
          let jobId = this.route.snapshot.paramMap.get('id');
          this.costList = [];
         this.orderser.getCostList(this.selectedproductid,this.orderQuantity,jobId,this.orderid,sendData).subscribe(async (res: any) => { 
          this.costList.push(res);
          this.oldOperations = res.operationscost.oldoperations;
          this.calenderPriceList = res.operationscost.calendar.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }});
          this.workPriceList = res.operationscost.workroom.map((x:any,index) => {return {...x,price : x.price != null ?  x.price : "0.00" }});
          this.totalCostPrice = res.prices;
          // this.orderpricecalculation.totalcost
       
            if((parseFloat(this.orderpricevalidation.grossprice).toFixed(this.decimalvalue) != this.priceFullPrice) && !this.route.snapshot.queryParams.copyproduct && this.ordercalcflag){
              setTimeout(() => {
                if(!this.ngxModalService.modals['priceUpdateModal'] && this.acceptanceflag && this.onllineaftersubmitordereditflag) {
                  this.ngxModalService.openModal(this.priceUpdateModal, 'priceUpdateModal');
                }
              }, 500)
              this.checkpriceval = "This price has been updated to " + (parseFloat( this.priceFullPrice)).toFixed(this.decimalvalue) + " ,Would you like to update it to the new price or keep the same?"
          } else {
              this.ordercalcflag = false;
          }
          resolve(true);
      },err => {
        // this.toast.errorToast(err.error.message);
        resolve(true);
      })
    })
  }
 calPriceWithProcess(){
    this.orderpricecalculation.totalcost = (parseFloat(this.totalCostPrice.cost_with_discount) + parseFloat(this.priceupdate.fullpriceobject.costprice)).toFixed(this.decimalvalue);
    this.oldorderpricecalculation.netprice = (parseFloat(this.totalCostPrice.cost_markup) + parseFloat(this.priceupdate.fullpriceobject.netprice)).toFixed(this.decimalvalue);
    this.oldorderpricecalculation.totalgross= (parseFloat(this.totalCostPrice.gross_price) + parseFloat(this.priceupdate.fullpriceobject.grossprice)).toFixed(this.decimalvalue);
    this.oldorderpricecalculation.vat = (parseFloat(this.totalCostPrice.vat_price) + parseFloat(this.oldorderpricecalculation.vat)).toFixed(this.decimalvalue);
    
    this.endcustomerorderpricecalculation.netprice = (parseFloat(this.totalCostPrice.cost_with_discount) + parseFloat(this.endcustomerorderpricecalculation.netprice)).toFixed(this.decimalvalue); 
   this.endcustomerorderpricecalculation.totalgross  = (parseFloat(this.totalCostPrice.gross_price) + parseFloat(this.endcustomerorderpricecalculation.totalgross)).toFixed(this.decimalvalue);
    return true;
  }
//order form delete
  async orderdelete(params, jobid?:any){
    let dialogRef = this.dialogRef.open(DeletePopupComponent, {
      disableClose: true,
      data: { message:'Are you sure want to delete the order item?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let deletedata = []
      deletedata.push(params.id)
      let deleteorderdata = {
        orderitemids : deletedata,
        job_tempid : this.job_tempid,
        jobid : this.route.snapshot.paramMap.get('id'),
        commissionvalues : JSON.stringify(this.commissionvalues)
      }
      this.orderser.deleteorderitemdata(deleteorderdata).subscribe((res:any)=>{
        if(res?.result == 1){
          this.toast.successToast(res.message)
          if(this.route.snapshot.paramMap.get('id')){
            this.orderser.getorderlistdata(this.route.snapshot.paramMap.get('id'),this.pivotId).subscribe((res: any) => {
              let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
              this.childEvent.emit(data)
              this.orderauth.collapseOrderGridFlag = false
            })
          }else{
            this.orderser.getorderlistdata(jobid,this.pivotId).subscribe((res: any) => {
              let data = { griddata: res.data,ordercalc: this.orderpricecalculation }
              this.childEvent.emit(data)
              this.orderauth.collapseOrderGridFlag = false
            })
          }
        }
      })
      }
      });
  }
//width drop quantity value
  passwidthdropvalue(event,field,index,fieldname){    
    field.editruleoverride =1
    this.saveflag = true;
    this.commonwidthdropvalidation(field)
    let data:any = {
      inputvalue: event,
      orderfield: field,
      orderindex: index,
      orderfieldname: fieldname
    }
    this.widthdropprice.next(data)
    let filterbasearray: any = [1,6,29,18]
    if (filterbasearray.includes(field.fieldtypeid)) {
      this.getFilterData("filterBasedcall")
    }
    if (!this.receipedisabledflag) {
      this.productMaxSqAreaCheck(field)
    }
   
  }
  async productMaxSqAreaCheck(par: any,check?:any,type?) {
    let fiedtypecheck = [7, 8, 9, 10, 11, 12, 31, 32]
    let widthdrop: any = { productid: this.selectedproductid, unittype: '', width: '', drop: '' };
    let setWidthfieldid: any = '';
    let setDropfieldid: any = '';
    this.forms[0].metaData.map((data: any, index: any) => {
      if (data.fieldtypeid == 34) {
        widthdrop.unittype = data.optiondefault
      }
      if (data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31) {
        widthdrop.width = this.inst.value[data.fieldid.toString()]
        setWidthfieldid = data.fieldid;
      }
      if (data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32) {
        widthdrop.drop = this.inst.value[data.fieldid.toString()];
        setDropfieldid = data.fieldid;
      }
    })
    if (fiedtypecheck.includes(par?.fieldtypeid) || check == 'submit') {
      if (this.onlineflag) {
        if (this.enableMaxSqAreaOnlineOrder && widthdrop.width?.toString()?.length > 0 && widthdrop.drop?.toString()?.length > 0) {
         await this.maxAreaValidationCal(widthdrop,setWidthfieldid,setDropfieldid,check,type)
        } else {
          if (check == 'submit') {
            this.maxSqAreaFlagCheck = false;
        await this.saveorderform(type)
          }
        }
      } else {
        if (this.productMaxSqArea && widthdrop.width?.toString()?.length > 0 && widthdrop.drop?.toString()?.length > 0) {
          await this.maxAreaValidationCal(widthdrop,setWidthfieldid,setDropfieldid,check,type)
        } else {
          if (check == 'submit') {
            this.maxSqAreaFlagCheck = false;
          await this.saveorderform(type)
          }
        }
      }
    }
  }
  maxAreaValidationCal(widthdrop:any,setWidthfieldid:any,setDropfieldid:any,check?:any,type?){
    this.orderser.productMaxSqAreawidthdropvalidation(widthdrop).subscribe((res: any) => {
      if (res.maxSqError == 0) {
        this.maxSqAreaCheck(res.message, setWidthfieldid,setDropfieldid,check,type);
      } else {
        if (check == 'submit') {
          this.maxSqAreaFlagCheck = false;
          this.saveorderform(type)
        }
      }
      this.cd.markForCheck();
    })
  }
  async maxSqAreaCheck(msg: any, wId: any,dId:any,check?:any,type?) {
    let dialogRef = this.dialogRef.open(DeletePopupComponent, {
      disableClose: true,
      data: {
        flag: true,
        receipe: true,
        confirmation: true,
        type: 'warning',
        message: msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.saveorderflag = false;
        this.maxSqAreaFlagCheck = true;
        if (this.widthminmaxvalue) {
          this.inst.controls[wId.toString()].setErrors({ errors: this.widthminmaxvalue })
        } else {
          this.inst.controls[wId.toString()].setErrors({ required: true })
        }
        if (this.dropminmaxvalue) {
          this.inst.controls[dId.toString()].setErrors({ errors: this.dropminmaxvalue })
        } else {
          this.inst.controls[dId.toString()].setErrors({ required: true })
        }
      } else {
        this.saveorderflag = false;
        this.maxSqAreaFlagCheck = false;
        if (this.widthminmaxvalue) {
          this.inst.controls[wId.toString()].setErrors({ errors: this.widthminmaxvalue })
        } else {
          this.inst.controls[wId.toString()].setErrors(null)
        }
        if (this.dropminmaxvalue) {
          this.inst.controls[dId.toString()].setErrors({ errors: this.dropminmaxvalue })
        } else {
          this.inst.controls[dId.toString()].setErrors(null)
        }
        if (check == 'submit') {
          this.saveorderform(type)
        }
      }
      this.cd.markForCheck();
    })
  }
  async commonwidthdropvalidation(field){
    let fabricarray=[7,8,11]
    let colorarray=[9,10,12]
    if(field.fieldtypeid == 34 || field.fieldtypeid == 13 || fabricarray.includes(field.fieldtypeid) || colorarray.includes(field.fieldtypeid) || this.fabricIds.includes(field.fieldtypeid)){
      this.dynamicwidthtypeid = ''
      this.dynamicdroptypeid = ''
      if(fabricarray.includes(field.fieldtypeid) || colorarray.includes(field.fieldtypeid)){
       await this.getFilterData("widthdropfilter",field)
      }
      this.getWidthDropValidation(field)
    }
    if (this.forms[0].metaData.filter((e: any) => e?.fieldtypeid === 6).every((e: any) => !e?.numeric_setcondition)) { // LA-I3072 Condition added
    this.forms[0].metaData.map((field:any,index:any)=>{
      if(field.fieldtypeid == 6){
        let emptycheck = this.inst.controls[field.fieldid.toString()].value;
        let checkvalue = parseFloat(this.inst.controls[field.fieldid.toString()].value);
        let numeric_min = field.numeric_minvalue;
        let numeric_max = field.numeric_maxvalue;
        this.numericminmaxvalue = '';
        if ((numeric_min == 0 && numeric_max == 0) || (emptycheck=='' )) {
          this.inst.controls[field.fieldid.toString()]?.setErrors(null);
        } else {
          if ((checkvalue && !isNaN(checkvalue) && checkvalue >= numeric_min && checkvalue <= numeric_max)) {
            this.inst.controls[field.fieldid.toString()]?.setErrors(null)
          } else {
            this.numericminmaxvalue = '(Min ' + numeric_min + ' - Max ' + numeric_max + ')'
            this.inst.controls[field.fieldid.toString()]?.setErrors({ errors: this.numericminmaxvalue });
          }
        }
      }
    })
    }
     setTimeout(() => {
       this.loadFormValue()
    }, 100);
  }
  getWidthDropValidation(field?){
    let widthdropdata = { colorid: '',fieldtypeid: '',width: '',drop: '',unittype: '',mode:'',pricegroup:'',widthfieldtypeid:'',dropfieldtypeid:'',
      fabriciddual:'', coloriddual:'', pricegroupdual:'',numFraction:''}
      let fabricarray=[7,8,11]
      let colorarray=[9,10,12]
      if(field && fabricarray.includes(field.fieldtypeid)){
        widthdropdata.mode = 'width'
      }
      if(field && colorarray.includes(field.fieldtypeid)){
        widthdropdata.mode = 'drop'
      }
    this.forms[0].metaData.map((data:any,index:any)=>{
      if(data.fieldtypeid == 34){
        widthdropdata.unittype = data.optiondefault
      }
      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          widthdropdata.colorid = data.optiondefault
          if(data.optiondefault){
            widthdropdata.fieldtypeid = data.fieldtypeid
          }
        }
        else{
          if(data.fieldlevel == 2 && data.issubfabric != 1){
            if(this.category != 6){
              if(data.dualseq == 2){
               widthdropdata.coloriddual = data.optiondefault;
             }
             if(data.dualseq != 2){
               widthdropdata.colorid = data.optiondefault
             }
           }else{
             if(data.multiseq <= 1){
               widthdropdata.colorid = data.optiondefault
             }
           }
            if(data.optiondefault){
              widthdropdata.fieldtypeid = data.fieldtypeid
            }
          }
        }
      }
      if(data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31){
        widthdropdata.width = this.inst.value[data.fieldid.toString()]
        if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthdropdata.width)
          widthdropdata.width= widthvalue1;
        } 
        widthdropdata.widthfieldtypeid = data.fieldtypeid
        this.dynamicwidthtypeid = widthdropdata.widthfieldtypeid
      }
      if(data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32){
        widthdropdata.drop = this.inst.value[data.fieldid.toString()];
        if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3){
          let dropvalue1:any = parseFloat(this.dropdecimalinches) + parseFloat(widthdropdata.drop)
          widthdropdata.drop= dropvalue1;
        }
        widthdropdata.dropfieldtypeid = data.fieldtypeid
        this.dynamicdroptypeid = widthdropdata.dropfieldtypeid
      }   
      if(data.fieldtypeid == 13){
        if (this.category != 6) {
          if (data.dualseq == 2) {
            widthdropdata.pricegroupdual = data.optiondefault ? data.optiondefault : ''
          }
          if (data.dualseq != 2) {
            widthdropdata.pricegroup = data.optiondefault ? data.optiondefault : ''
          }
        } else {
          if (data.multiseq <= 1) {
            widthdropdata.pricegroup = data.optiondefault ? data.optiondefault : ''
          }
        }
      }
    })
    if(widthdropdata.width && !widthdropdata.drop) { widthdropdata.mode = 'width' }
    if(widthdropdata.drop && !widthdropdata.width) { widthdropdata.mode = 'drop' }
    if(widthdropdata.width && widthdropdata.drop) { widthdropdata.mode = 'both' }
    let widthdrop ={
      width: widthdropdata.width,
      drop: widthdropdata.drop,
      unittype: widthdropdata.unittype,
      mode: widthdropdata.mode,
      pricegroup: widthdropdata.pricegroup,
      colorid: widthdropdata.colorid,
      fieldtypeid: widthdropdata.fieldtypeid,
      fabriciddual:widthdropdata.fabriciddual, ////// dual fabric
      coloriddual:widthdropdata.coloriddual,
      pricegroupdual:widthdropdata.pricegroupdual,
      productid: this.selectedproductid
    }
    if(widthdropdata.pricegroup || widthdropdata.colorid){
      this.orderser.orderformeditflag = ''; // for disable loading as per selva instruction
      this.orderser.widthdropvalidation(widthdrop).subscribe((res: any) => {
           if(res!=null){
          if(res.showmmessage){
          this.widthdropflag = true
          this.widthminmaxvalue = ''
          this.dropminmaxvalue = ''
          this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
          this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
          this.widthdropmsg = res.message
        }
        else{
          var showminmax = 0;
          if(res.data.dropminmax.max > 0 || res.data.dropminmax.min > 0 || res.data.widthminmax.max > 0 || res.data.widthminmax.min > 0){
            showminmax = 1;
          }
          if(res.data.widtherror == 0 && res.data.droperror == 1 && showminmax == 1){
            this.widthdropflag = true
            this.dropminmaxvalue = ''
            this.widthminmaxvalue = '(Min ' + res.data.widthminmax.min + ' - Max ' + res.data.widthminmax.max + ')'
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors({ errors: true })
            this.widthdropmsg = res.message
          }
          else if(res.data.droperror == 0 && res.data.widtherror == 1 && showminmax == 1){
            this.widthdropflag = true
            this.widthminmaxvalue = ''
            this.dropminmaxvalue = '(Min ' + res.data.dropminmax.min + ' - Max ' + res.data.dropminmax.max + ')'
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors({ errors: true })
            this.widthdropmsg = res.message
          }
          else if(res.data.widtherror == 0 && res.data.droperror == 0 && showminmax == 1){
            this.widthdropflag = true
            this.widthminmaxvalue = '(Min ' + res.data.widthminmax.min + ' - Max ' + res.data.widthminmax.max + ')'
            this.dropminmaxvalue = '(Min ' + res.data.dropminmax.min + ' - Max ' + res.data.dropminmax.max + ')'
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors({ errors: true })
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors({ errors: true })
            this.widthdropmsg = res.message
          }
          else{
            if(res.message){
              this.widthdropflag = false;
              this.widthminmaxvalue = '';
              this.dropminmaxvalue = '';
              this.widthdropmsg = '';
              this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid]?.setErrors(null)
              this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid]?.setErrors(null)
            }else{
            this.widthdropflag = false
            this.widthminmaxvalue = ''
            this.dropminmaxvalue = ''
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
            this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
            this.widthdropmsg = ''
            }
          }
        }}else{
          this.widthdropflag = false
          this.widthminmaxvalue = ''
          this.dropminmaxvalue = ''
          this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid]?.setErrors(null)
          this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid]?.setErrors(null)
          this.widthdropmsg = ''
        } 
      })
    }else{
      this.widthdropflag = false
      this.widthdropmsg = ''
      this.widthminmaxvalue = ''
      this.dropminmaxvalue = ''
      this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.widthfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
      this.inst.controls[this.forms[0].metaData.filter(el => el.fieldtypeid == widthdropdata.dropfieldtypeid)[0]?.fieldid.toString()]?.setErrors(null)
    }
  }
//widh and drop base filter
  async widthdropfilter(parentfield:any){
    // if(this.fabricIds.includes(parentfield.fieldtypeid) || parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 17){
    let validationdata = {
        lineitemselectedvalues: this.editorderitemselectedvalues,
        productid: this.selectedproductid,
        supplier: '',
        pricegroup: '',
        fabricid: '',
        colorid: '',
        subfabricid: '',
        subcolorid: '',
        coloriddual:'',
        fabriciddual:'',
        pricegroupdual:'',
        selectedvalues: {'pricegroupmulticurtain':[]},
        pricegroupmulticurtain:[],
        fabricmulticurtain:[],
        categoryid:0,
        orderitemselectedvalues: this.getallselectedvalues(),
        selectedfieldids: [],
        fieldtypeid: '',
        width: '',
        drop: '',        
        customertype: this.productser.customerType,
        changedfieldtypeid: parentfield.fieldtypeid == 17 || parentfield.fieldtypeid == 13 ? parentfield.fieldtypeid : '',
        unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault,
        changedfieldid: parentfield?.fieldid
      }
      // validationdata.fieldtypeid = this.fabricIds.includes(parentfield.fieldtypeid) ? parentfield.fieldtypeid : ''
      this.forms[0].metaData.map((data:any)=>{
        validationdata.selectedfieldids.push(data.fieldid)
        if((this.fabricIds.includes(data.fieldtypeid) && data.showfieldonjob) || data.fieldtypeid == 13 || data.fieldtypeid == 17){
          // if(data.optiondefault){
            if(data.optionsbackup.length > 0){
              let optinvaluearray = []
              data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))              
              if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric != 1 && data.showfieldonjob){
                if ((this.category == 6 && data.multiseq <= 1) || (this.category != 6 && data.dualseq <= 1)) {
                let fieldid = [data.fieldtypeid] + '_' + data.fabricorcolor
                validationdata.selectedvalues[fieldid]  = optinvaluearray
                }
              }
              else if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric == 1){             
                let fieldid = 'sub_'+ [data.fieldtypeid] + '_' + data.fabricorcolor
                validationdata.selectedvalues[fieldid]  = optinvaluearray;                
              }
              else{
                let arrayname = ''
                if(data.fieldtypeid == 13){
                  if(this.category == 6 && data.multiseq>1){
                    validationdata.selectedvalues['pricegroupmulticurtain'].push({multiseq:data.multiseq,id:optinvaluearray});
                  }else{
                    arrayname ='pricegrouparray'
                    validationdata.selectedvalues[arrayname] = optinvaluearray
                  }
                }
                if(data.fieldtypeid == 17){
                  arrayname ='supplierarray';
                  validationdata.selectedvalues[arrayname] = optinvaluearray
                }             
              }
            }
          // }
        }
        else{
          if(data.optionsbackup.length > 0){
            let optinvaluearray = []
            data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
            validationdata.selectedvalues[data.fieldid] = optinvaluearray
          }
        }
        let fabricarray=[7,8,11]
        let colorarray=[9,10,12]
        if(fabricarray.includes(data.fieldtypeid)){
          let widthvalue:any = parseFloat(this.widthdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
          validationdata.width = widthvalue
        }
        if(colorarray.includes(data.fieldtypeid)){
          let dropvalue:any = parseFloat(this.dropdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
          validationdata.drop = dropvalue
        }            
        if(data.fieldtypeid == 13){
          // validationdata.pricegroup = data.optiondefault
          if(this.category != 6){
          if(data.dualseq != 2){
            validationdata.pricegroup = data.optiondefault
          }
          if(data.dualseq == 2){
            validationdata.pricegroupdual = data.optiondefault
          }
        }else{
          if(data.multiseq <= 1){
            validationdata.pricegroup = data.optiondefault
          }         
          if(data.multiseq > 1){
            validationdata.pricegroupmulticurtain.push({multiseq:data.multiseq,id:data.optiondefault ?? ''});
          }
        }
          // validationdata.supplier = ""
        }
        if(data.fieldtypeid == 17){
          validationdata.supplier = data.optiondefault
        }
        if(this.fabricIds.includes(data.fieldtypeid)){
          if(data.fieldtypeid == 20){
            validationdata.colorid = data.optiondefault
          }
          else{
            if(data.fieldlevel == 2 && data.issubfabric != 1){
              //  validationdata.colorid = data.optiondefault 
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                validationdata['coloriddual'] = data.optiondefault;
                } else{
                  validationdata.colorid = data.optiondefault;
                }  
            }
            else {
              //  validationdata.fabricid = data.optiondefault 
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                validationdata['fabriciddual'] = data.optiondefault;
              if(data.fieldtypeid == 22 && data.multiseq > 1){
                validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id: data.optiondefault});
              }
            }else{
              if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
                validationdata.subfabricid = data.optiondefault;
              }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
                validationdata.subcolorid = data.optiondefault;
              }else{
                validationdata.fabricid = data.optiondefault;
              }
            }
            }
          }
        }
      })
      this.forms[0].metaData.filter(el => {
        if(this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 1){
          validationdata.fieldtypeid = el.fieldtypeid
        }
      })
      if(parentfield.fieldtypeid == 13 || parentfield.fieldtypeid == 17)
        {
          validationdata.fabricid = '';
          validationdata.colorid ='';
          if(parentfield.fieldtypeid == 13)
            validationdata.supplier = '';
          if(parentfield.fieldtypeid == 17)
            validationdata.pricegroup = '';
        }
        validationdata['orderItemId'] = this.addeditmode == 'add' ? '' : this.orderid;
       this.orderser.cancelFilterRequests()
       validationdata.pricegroupdual = validationdata.supplier ? validationdata.pricegroupdual : ''
       validationdata['apicall'] = this.apiflagcount += 1
      await this.orderser.ordertypevalidation(validationdata).then((res: any) => {
        if(res){
          let fabDual;
            let multiColor;
          if (this.category == 6) {
            fabDual = res[0].data.multifabricidsarray
            multiColor = res[0].data.multicoloridsarray
          } else {
            fabDual = res[0].data.fabricidsarraydual;
            multiColor = res[0].data.coloridsarraydual
          }
          this.filterbasearray = { fabric: res[0].data.fabricidsarray, color: res[0].data.coloridsarray, option: res[0].data.optionarray, fabricdual: fabDual, colordual: multiColor }  
          let removedataflag:boolean = false
          this.forms[0].metaData.map((data:any)=>{
            if(data.fieldtypeid == 13){
              if(this.category != 6){
              if(data.dualseq != 2){
                if(res[0].data.selectproducttypeid != 0){
                  data.optiondefault = res[0].data.selectproducttypeid
                }
                if(res[0].data.selectproducttypeid == 0){
                  data.optiondefault = ''
                  this.inst.get(data.fieldid.toString()).setValue('')
                  this.inst.get(data.fieldid.toString()).markAsPristine()
                  this.removeorderdata(data)
                  removedataflag = true
                }
              }
              else if(data.dualseq == 2){
                if(res[0].data.selectproducttypeiddual != 0){
                  data.optiondefault = res[0].data.selectproducttypeiddual
                }
                if(res[0].data.selectproducttypeiddual == 0){
                  data.optiondefault = ''
                  this.inst.get(data.fieldid.toString()).setValue('')
                  this.inst.get(data.fieldid.toString()).markAsPristine()
                  this.removeorderdata(data)
                  removedataflag = true
                }
              }
            }else{
              if(data.multiseq <= 1){
                if(res[0].data.selectproducttypeid != 0){
                  data.optiondefault = res[0].data.selectproducttypeid
                }
                if(res[0].data.selectproducttypeid == 0){
                  data.optiondefault = ''
                }
              }
              else if(data.multiseq > 1){
                let multiselectproducttypeidmore = res[0].data.multiselectproducttypeidmore;
                let selectproducttypeidmorefiltered = multiselectproducttypeidmore.find(el => el.multiseq == data.multiseq);
                if (selectproducttypeidmorefiltered?.id != 0) {
                  data.optiondefault = selectproducttypeidmorefiltered?.id
                }
                if (selectproducttypeidmorefiltered?.id == 0 || selectproducttypeidmorefiltered.length == 0) {
                  data.optiondefault = ''
                }
              }
            }
            if(data.multiseq <= 1){
              data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
              }else if(data.multiseq > 1){
              let morepricegroupidsarray = res[0].data.multipricegroupidsarray;
              let morepricegroupidsarrayfiltered = morepricegroupidsarray.filter(el => el.multiseq == data.multiseq);
              data.optionsvalue = data.optionsbackup.filter(el => morepricegroupidsarrayfiltered[0]?.id?.includes(el.optionid))
            }
              if(data.optiondefault){
                this.inst.get(data.fieldid.toString()).markAsDirty()
                if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                  data.optiondefault = ''
                  this.inst.get(data.fieldid.toString()).setValue('')
                  this.inst.get(data.fieldid.toString()).markAsPristine()
                  this.removeorderdata(data)
                  removedataflag = true
                }
              }
              // else {
              //   this.inst.get(data.fieldid.toString()).setValue('')
              //     this.removeorderdata(data)
              //     removedataflag = true
              // }
            }
            if(data.fieldtypeid == 17){
              if(res[0].data.selectsupplierid != 0){
                data.optiondefault = res[0].data.selectsupplierid
              }
              if(res[0].data.selectsupplierid == 0){
                data.optiondefault = ''
              }
              // if(res[0].data.supplieridsarray.length == 1 && validationdata.supplier){
              //   data.optiondefault = res[0].data.supplieridsarray.toString()
              // }
              // if(res[0].data.supplieridsarray.length == 1 && validationdata.pricegroup){
              //   data.optiondefault = res[0].data.supplieridsarray.toString()
              // }
              data.optionsvalue = data.optionsbackup.filter(el => res[0].data.supplieridsarray.includes(el.optionid))
              if(data.optiondefault){
                if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                  data.optiondefault = ''
                  this.inst.get(data.fieldid.toString()).setValue('')
                  this.removeorderdata(data)
                  removedataflag = true
                }
              }
            }
            if(this.fabricIds.includes(data.fieldtypeid)){
              if(data.fieldtypeid == 20){
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                if(data.optiondefault){
                  if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    this.removeorderdata(data)
                    removedataflag = true
                  }
                }
              }
              else{
                if(data.fieldlevel == 2  && data.issubfabric != 1){  //coloridsarray
                  if(this.category != 6){
                  if(data.dualseq !=2){
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                  }
                  if(data.dualseq ==2){ ////for dual fabric and color
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarraydual.includes(el.optionid))
                  }
                }else{
                  if(data.multiseq <= 1){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                    }
                    if(data.multiseq >1){ ////for multicurtain and color
                      let multicoloridsarray = res[0].data.multicoloridsarray;
                      let morecoloridsarrayfiltered = multicoloridsarray.filter(el => el.multiseq == data.multiseq);
                      data.optionsvalue = data.optionsbackup.filter(el => morecoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                    }
                }
                  if(data.optiondefault){
                    if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }else if(data.fieldlevel == 1 && data.issubfabric != 1){ // fabricidsarray
                  // data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                  if(this.category != 6){
                  if(data.dualseq !=2){
                    if(res[0].data.pricegroupidsarray){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                    }else{
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                    }
                  }
                  if(data.dualseq ==2){ ////for dual fabric and color
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                  }
                }else{
                  if(data.multiseq <= 1){
                    if(res[0].data.pricegroupidsarray){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                    }else{
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                    }
                  }
                  if(data.multiseq >1){ ////for multicurtain and color
                    let multifabricidsarray = res[0].data.multifabricidsarray;
                    let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                  let morepriceidsarray = res[0].data.multipricegroupidsarray;
                    let morepriceidsarrayfiltered = morepriceidsarray.filter(el => el.multiseq == data.multiseq);
                    data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid) && morepriceidsarrayfiltered[0]?.id.includes(el.pricegroupid));
                  }
                }
                 if(data.optiondefault){
                    if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }else if(data.fieldlevel == 2 && data.issubfabric == 1){ // subfabricidsarray
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subfabricidsarray.includes(el.optionid))
                 if(data.optiondefault){
                    if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcoloridsarray
                  data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subcoloridsarray.includes(el.optionid))
                 if(data.optiondefault){
                    if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }
                else {
                  if(this.category != 6){
                  if(data.dualseq !=2){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                  }
                  if(data.dualseq ==2){ ////for dual fabric and color
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid))
                  }
                }else{
                  if(data.multiseq <= 1){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                  }
                  if(data.multiseq >1){ ////for multicurtain and color
                    let multifabricidsarray = res[0].data.multifabricidsarray;
                    let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                    data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));
                  }
                }
                    if(data.optiondefault){
                      
                    if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      this.removeorderdata(data)
                      removedataflag = true
                    }
                  }
                }
              }
            }
          })
          if(removedataflag){
            if(!this.rulescount && !this.formulacount){
              this.ordercalc()
              let unittypeid = ''
              this.forms[0].metaData.map((field:any)=>{
                if(field.fieldtypeid == 34){
                  unittypeid = field.optiondefault
                 }
              })
              if(this.oneditmode==false){
                let temp:any=Number(unittypeid)
                this.unittypefractionlist(-1,temp)
              }
            }
            if(this.rulescount && !this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
            if(!this.rulescount && this.formulacount){
              this.rulesvalue = 2
              this.rulesbaseprice()
            }
            if(this.rulescount && this.formulacount){
              this.rulesvalue = 1
              this.rulesbaseprice()
            }
          }
          let removefieldarray = []
          for (const [key, value] of Object.entries(res[0].data.optionarray)) {
            removefieldarray.push(key)
            if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
              this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                let optionvaluearray:any = []
                optionvaluearray = value
                data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                let optdefault = ''
                if(data.fieldtypeid == 2 || data.fieldtypeid == 3 || data.fieldtypeid == 5 || data.fieldtypeid == 19 || data.fieldtypeid == 20 || data.fieldtypeid == 21 || data.fieldtypeid == 33 || (data.fieldtypeid == 22 && data.issubfabric != 1)){
                  if(data.optiondefault){
                    optdefault = data.optiondefault
                    let splitdefault = data.optiondefault.split(',')
                    let defaultarray = data.optionsvalue.filter(el => data.optiondefault.split(',').includes(el.optionid.toString()))
                    let defaultids = []
                    let defaultnames = []
                    defaultarray.map((val:any)=>{ 
                      defaultids.push(val.optionid)
                      defaultnames.push(val.optionname)
                    })
                    data.optiondefault = defaultids.toString()
                    this.inst.get(data.fieldid.toString()).setValue(defaultnames.toString())
                    if(splitdefault.length != defaultids.length){
                      if(data.optionsvalue.length > 0){
                        let optionvaluefilter = data.optionsvalue.filter(el=>defaultids.includes(el.optionid))
                        if(data.subchild.length > 0){
                          var uniqueResultOne = data.subchild.filter(function(obj) {
                            return !optionvaluefilter.some(function(obj2) {
                                return obj.forchildsubfieldlinkid == obj2.forchildfieldoptionlinkid
                            })
                          })
                          uniqueResultOne.map((removedata:any)=>{
                            data.subchild = data.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                            this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                            this.removeorderdata(removedata)
                          })
                        }
                      }
                    }
                  }
                }
                let optsplitarray = []
                if(data.optiondefault){
                  optsplitarray = data.optiondefault.split(',')
                  optdefault = data.optiondefault
                }
                if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                  data.optiondefault = ''
                  this.inst.get(data.fieldid.toString()).setValue('')
                  if(optdefault){
                    this.removeorderdata(data)
                  }
                }
              })
            }
          }
          this.forms[0].metaData.filter(el => !removefieldarray.includes(el.fieldid.toString())).map(data=>{
            if(data.fieldid !=0 && parentfield.fieldid != data.fieldid){
              if(data.fieldtypeid == 3){
                data.optiondefault = ''
                data.optionsvalue = []
              }
            }
          })
          if(this.singlemultipleflag == 'single'){
            this.enabledisableflag = false
          }
        }
        this.orderser.orderformeditflag = ''
        this.cd.markForCheck();
      })
      this.cd.markForCheck();
      // .catch((err : any) => {
      //   this.enabledisableflag = false;
      // });
    // }
  }
//rule base price calc
  async rulesbaseprice(rule=''){
    this.rulecount++
    this.rulesBaseDisableSave = true
    this.orderpricechangeflag = this.orderpricechangeflag + 1
    let saveorderarray = []
    let widthvalue='' ;
    let dropvalue = '';
    let qtyvalue = ''
    let optionarray:any =[]
    let optionarraydual:any =[]
    let orderunitype = ''
    let calctestdata:any =[]
    let optlinkarray = []
    let blindopeningwidtharray:any=[]
    let widthfieldtypeid ='';
    let dropfieldtypeid ='';
    let dummyarg = 3
    let fabncoldetails = {
      fabricid : '',
      fabriciddual : '',
      colorid : '',
      coloriddual : '',
      subfabricid : '',
      subcolorid : '',
      fabricmulticurtain:[],
      colormulticurtain:[]
    }
    this.forms[0].metaData.map((data:any,index:any)=>{
      if(data.fieldtypeid == 1){
        let joinvalue:any = ''
        if(this.inst.value[data.fieldid] && !data.blindswidth){
          joinvalue =  parseFloat(this.inst.value[data.fieldid])
        }
        if(data.blindswidth && !this.inst.value[data.fieldid]){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue = this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue
          }
        }
        if(this.inst.value[data.fieldid] && data.blindswidth){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue =  parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue)
          }
          else{
            joinvalue =  parseFloat(this.inst.value[data.fieldid])
          }
        }
        if(joinvalue){
          blindopeningwidtharray.push(joinvalue)
        }
      }
      if(data.optiondefault){
        let optdefault = data.optiondefault.toString().split(',')
        optlinkarray = []
        if(data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).length == 0){
          optlinkarray.push(data['valueid'])
        }
        else{
          data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).map((select:any)=>{optlinkarray.push(select.fieldoptionlinkid)})
        }
        if(data.fieldtypeid != 0){
          let valuesplit = data.optiondefault.toString().split(',')
          valuesplit.map((value:any)=>{
            let defaultoptionname =  data.optionsvalue.filter(o1 => o1.optionid == value)
            if(defaultoptionname.length > 0){
              calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
            }
            else{
              if(data.optiondefault && data['valueid']){
                calctestdata.push({optionvalue:parseFloat(data.optiondefault),fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
              }
            }
          })
        }
      }
      if(data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31){
        widthvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          if(isNaN(parseFloat(widthvalue))){
            widthvalue="0";
          }
          let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthvalue)
          widthvalue= widthvalue1;
        }  
        widthfieldtypeid = data.fieldtypeid

      }
      if(data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32){
        dropvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
          if(isNaN(parseFloat(dropvalue))){
            dropvalue="0";
          }
          let dropvalue1:any = parseFloat(this.dropdecimalinches) +parseFloat(dropvalue)
          dropvalue= dropvalue1;
        } 
        dropfieldtypeid = data.fieldtypeid
      }
      if(data.fieldtypeid == 14){
        qtyvalue = this.inst.value[data.fieldid.toString()]
      }
      if(data.fieldtypeid == 13){
        if(data.optiondefault){
          if(this.category != 6){
          if(data.dualseq == 2){
            optionarraydual.push(data.optiondefault);
          }
          if(data.dualseq != 2){
          optionarray.push(data.optiondefault)
          }
          } else {
            if (data.multiseq > 1) {
              optionarraydual.push({ multiseq: data.multiseq, id: data.optiondefault });
            }
            if (data.multiseq <= 1) {
              optionarray.push(data.optiondefault)
            }
          }
        }
      }
      if(data.fieldtypeid == 34){
        orderunitype = data.optiondefault
        if(data.optiondefault) { this.unittypevalue = (data.optionsvalue.filter(el => el.optionid == data.optiondefault))[0].optionname }
        else { this.unittypevalue = ''}
      }
      let ordervalue = ''
      let quantityarray = [];
      let lengthArray = []
      if(data.optionsvalue.length > 0){
        data.optionsvalue.map((qty:any)=>{
          if( data.fieldtypeid != 33 ){
            if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.optionqty){
                  quantityarray.push(qty.optionqty)
                }
              }
            }
          }else{
             if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.qty){
                  quantityarray.push(qty.qty)
                  lengthArray.push(qty["length"])
                }
              }
            }
          }
        })
        if(data.optiondefault && data['valueid']){
          if(quantityarray.length == 0){
            quantityarray.push(1)
          }
        }
      }
      if(data.fieldtypeid == 34 || data.fieldtypeid == 4 || data.fieldtypeid == 13 || data.fieldtypeid == 17 || data.fieldtypeid == 30){
        if(this.inst.value[data.fieldid.toString()]){
          if(data.optionsvalue.length>0){
            ordervalue = data.optionsvalue.filter(el => el.optionid.toString() == this.inst.value[data.fieldid.toString()].toString())[0]?.optionname
          }
        }
      }
      else{
        ordervalue = this.inst.value[data.fieldid.toString()]
      }
      let format:any = {
        id: data.fieldid,
        labelname: data.fieldname,
        value: ordervalue ? [...new Set(ordervalue.toString().split(','))].join(',') : '',
        valueid: data?.optiondefault && optlinkarray ?  [...new Set(optlinkarray.toString().split(','))].join(',') : '',
        quantity: quantityarray.length > 0 ?  quantityarray.toString() : '',
        type: data.fieldtypeid,
        optionid: data.optiondefault ? data.optiondefault : '',
        fabricorcolor: data.fabricorcolor,
        labelnamecode : data.labelnamecode ? data.labelnamecode : '',
        issubfabric : data.issubfabric ? data.issubfabric : 0,
        fractionValue : data.fieldtypeid == 1 ? parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.find(el=>el.id == data.blindswidth)?.decimalvalue) : 0
      } 
      if(data.fieldtypeid == 33){
        format.length = lengthArray.toString()
      }
      if(data.fieldtypeid == 28){
        Object.assign(format,{numfrac: this.numfracvalue(data)})
      }
      if(data.editruleoverride==1){
        this.editruleoverridecurrent= 1;
        Object.assign(format,{editruleoverride:1})
      }else{
        this.editruleoverridecurrent= 0;
        Object.assign(format,{editruleoverride:0})
      }
      saveorderarray.push(format)

      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          fabncoldetails.colorid = data.optiondefault
        }
        else{
          if(data.fieldlevel == 2 && data.issubfabric != 1){
             if(data.fieldtypeid == 5 && data.dualseq == 2){
              fabncoldetails['coloriddual'] = data.optiondefault;
              }
              else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {               
                saveorderarray.forEach(x=>{  // multicurtain
                  if(x.id == data.fieldid){
                    x['multiseq']=data.multiseq;
                  }
                });
              }
              else {
                fabncoldetails.colorid = data.optiondefault;
              }
            }else if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
              fabncoldetails.subfabricid = data.optiondefault;
            }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
              fabncoldetails.subcolorid = data.optiondefault;
            }
          else { 
            if(dummyarg==1){
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = this.softfurningfabricid;
              }
              else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {
                saveorderarray.forEach(x=>{  // multicurtain
                  if(x.id == data.fieldid){
                    x['multiseq']=data.multiseq;
                  }
                })
              }
              else {
                fabncoldetails.fabricid =  this.softfurningfabricid;
              }
            }
            else{
              if(dummyarg==2)
              {
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = '';
                }
                else if(data.fieldtypeid == 22 && this.category == 6 && data.optiondefault){                 
                  saveorderarray.forEach(x=>{  // multicurtain
                    if(x.id == data.fieldid){
                      x['multiseq'].delete;
                    }
                  })
                }
                else{
                  fabncoldetails.fabricid = "";
                }
              }
              else{
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = data.optiondefault;
              }
              else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) {
                saveorderarray.forEach(x=>{  // multicurtain
                  if(x.id == data.fieldid){
                    x['multiseq']=data.multiseq;
                  }
                });
              }
              else{
                fabncoldetails.fabricid = data.optiondefault;
              }
              }
            }
           }
        }
      }
    })
    let productionoverridarray = this.orderproductiondata.map((pro: any) => ({
      id: pro.fs_id,
      productionoveride: pro.productionoverrideeditflag,
      productioneditedvalue: pro.productionoverrideeditflag === 1 ? pro.pricevalue : ''
    }));
    // LA-I200 price cal start
    // let productionoverridarray = []
    // this.orderproductiondata.map((pro:any)=>{
    //   // let overrideobj = 
    //   productionoverridarray.push({
    //     id : pro.fs_id,
    //     productionoveride : pro.productionoverrideeditflag,
    //     productioneditedvalue : pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
    //   })
    // })
    // LA-I200 price cal end
    let pricecalc:any = {
      vatpercentage: this.vatcalctoggle ?  this.returnvatvalue() : 0,
      blindopeningwidth: blindopeningwidtharray,
      recipeid: this.receipe,
      productid: this.selectedproductid,
      orderitemdata: saveorderarray,
      supplierid: 51,
      mode: optionarray.length > 0 ? 'pricetableprice' : '',
      width: widthvalue ? widthvalue : '',
      drop: dropvalue ? dropvalue : '',
      pricegroup: optionarray.length > 0 ? optionarray : '',
      pricegroupdual:this.category !=6 ? optionarraydual.length > 0 ? optionarraydual : '' : '',///for dual fabric
      pricegroupmulticurtain:this.category == 6 ?optionarraydual.length > 0 ? optionarraydual : []:[],///for multicurtain
      customertype: this.productser.customerType,
      optiondata: calctestdata,
      unittype: orderunitype,
      orderitemqty: qtyvalue,
      jobid: this.route.snapshot.paramMap.get('id'),
      customerid:this.productser.customerid ? this.productser.customerid : this.productser.existingcusID,
      rulemode : this.rulesvalue == 1 ? 0 : 1,
      productionoveridedata: productionoverridarray,
      widthfieldtypeid:widthfieldtypeid,
      dropfieldtypeid:dropfieldtypeid,      
      overridetype: this.orderpricecalculation.overrideprice ? parseFloat(this.orderpricecalculation.overrideprice) : '',
      overrideprice: (this.orderpricecalculation.overridevalue !== null || this.orderpricecalculation.overridepricecalc !== '') ? this.orderpricecalculation.overridepricecalc : 0,
      ...fabncoldetails
    }
    if(this.oneditmode==false){
      let temp:any=Number(orderunitype);
       this.unittypefractionlist(-1,temp);  
     } 
    //  this.orderser.cancelruleRequests()
    await this.orderser.rulesbasecalc(pricecalc).toPromise().then(async (res: any) => {
      this.rulecount--
      this.reportpriceresults = res.reportpriceresults
      this.productionmaterialcostprice = res.productionmaterialcostprice
      this.productionmaterialnetprice = res.productionmaterialnetprice
      this.materialFormulaPrice = res.materialFormulaPrice;
      this.productionmaterialnetpricewithdiscount = res.productionmaterialnetpricewithdiscount
      this.overridepricevalue = res.overridepricevalue
      this.getpricegroupprice = res?.getpricegroupprice
      this.rulesvalue = this.rulesvalue + 1
      this.productionresults = res.productionresults
      if(this.orderproductiondata.length > 0){
        if(res.productionresults.length >0){
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
            // pro['productionmode'] = 0
            // pro['productionoverrideeditflag'] = 0
          })
          
          res.productionresults.map((data:any)=>{
            if( data[0].battenstype != 0){ // implement battens LA-I567
              this.orderproductiondata.map((price:any)=>{
                if(data[0].fs_id == price.fs_id ){
                  if(data[0].bom == 0 && data[0].battenstype != 0) {
                    this.forms[0].metaData.map((val:any)=>{
                      if(val.fieldtypeid!=0){
                        if(val.fieldtypeid == 29 || val.fieldtypeid == 18 || val.fieldtypeid == 11 || val.fieldtypeid == 14 || val.fieldtypeid == 1 || val.fieldtypeid == 12 || val.fieldtypeid == 6 || val.fieldtypeid == 7 || val.fieldtypeid == 8 || val.fieldtypeid == 9 || val.fieldtypeid == 10 || val.fieldtypeid == 31 || val.fieldtypeid == 32){
                         
                          if(this.inst.get(val.fieldid.toString()).value){
                            price.pricevalue = data[0].formularesult
                            price.showhideflag = data[0].formularesult ? 1 : 0
                            price.unittype = data[0].jobunittype
                            // price.productionmode = data[0].productionoveridevalue
                            if(data[0].formulatype == 0){
                              price.pricecalvalue = data[0].productionprice
                            }
                            else{
                              price.pricecalvalue = data[0].getcostprice
                            }
                            price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                            price.fs_sectionName=data[0].fs_sectionName
                          }
                        }
                        if(val.optiondefault){
                          let result = val.optionsvalue.filter(o1 => data.some(o2 => o1.optionid == o2.optionid))
                          if(result.length > 0){
                            price.pricevalue = data[0].formularesult
                            price.showhideflag = data[0].formularesult ? 1 : 0
                            price.unittype = data[0].jobunittype
                            // price.productionmode = data[0].productionoveridevalue
                            if(data[0].formulatype == 0){
                              price.pricecalvalue = data[0].productionprice
                            }
                            else{
                              price.pricecalvalue = data[0].getcostprice
                            }
                            price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                            price.fs_sectionName=data[0].fs_sectionName
                          }
                        }
                      }
                    })
                  }
                  else if(data[0].bom == 1) {
                    price.pricevalue = data[0].formularesult
                    price.showhideflag = data[0].formularesult ? 1 : 0
                    price.unittype = data[0].jobunittype
                    price.fs_sectionName=data[0].fs_sectionName
                    // price.productionmode = data[0].productionoveridevalue
                    if(data[0].formulatype == 0){
                      price.pricecalvalue = data[0].productionprice
                      price.costPrice = data[0].productionprice
                      price.sellingprice=data[0].productionnetprice?data[0].productionnetprice:"-"
                      price.fs_sectionName=data[0].fs_sectionName
                    }
                    else{
                      price.pricecalvalue = '-'
                      price.costPrice = '-'
                      price.sellingprice='-'
                    }
                  }
                }
              })
            }else{
              let battendObj = data[0]
              battendObj.pricevalue = data[0].formularesult,
              battendObj.showhideflag = data[0].formularesult ? 1 : 0
              battendObj.unittype = data[0].jobunittype
              battendObj.pricecalvalue = data[0].productionprice
              battendObj.costPrice = data[0].productionprice
              battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
              battendObj.battens = true
              battendObj.fs_displayonproduction = 1
              battendObj.fs_sectionName = data[0].fs_sectionName
              this.orderproductiondata.push(battendObj)

            }
          })
        }
        else{
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
          })
        }
      }else {
        if(res.productionresults.length > 0){
          let getBattens =  res.productionresults[0].filter( x => x.battenstype == 0 )
          if(getBattens.length > 0){
            res.productionresults.map((data:any)=>{
              let battendObj = data[0]
                battendObj.pricevalue = data[0].formularesult,
                battendObj.showhideflag = data[0].formularesult ? 1 : 0
                battendObj.unittype = data[0].jobunittype
                battendObj.pricecalvalue = data[0].productionprice
                battendObj.costPrice = data[0].productionprice
                battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
                battendObj.battens = true
                battendObj.fs_displayonproduction = 1
                battendObj.fs_sectionName = data[0].fs_sectionName
                this.orderproductiondata.push(battendObj)
            })
          }
        }
      }
      if (res.ruleresults.length > 0) {
        let checkPriceFlagChage = false
        let valueCheckArray = [7, 8, 11, 31, 9, 10, 12, 32, 5, 19, 20, 21, 22]
        this.forms[0].metaData.map((v: any, index: any) => {
          res.ruleresults.map((price: any, i: any) => {
            if (price[v.fieldid]) {
              let pricechangedata = price[v.fieldid]
              if (valueCheckArray.includes(v.fieldtypeid)) {
                checkPriceFlagChage = true
              }
              if (v.fieldtypeid == 4 || v.fieldtypeid == 30 || v.fieldtypeid == 29 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32) {
                if (pricechangedata.length > 0) {
                  if (pricechangedata[0].optionid) {
                    if (!this.getchangefield.includes(v.fieldid.toString())) {
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v, res.ruleresults)
                  } else {
                    this.inst.get(v.fieldid.toString()).setValue('')
                    v.optiondefault = ''
                  }
                }
              } else if (v.fieldtypeid == 18 || v.fieldtypeid == 1) {
                if (pricechangedata.length > 0) {
                  if (pricechangedata[0].optionid) {
                    if (v.ruleoverride != 1 && v.ruleoverride != undefined) {
                      if (!this.getchangefield.includes(v.fieldid.toString())) {
                        this.getchangefield.push(v.fieldid.toString())
                      }
                      this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                      this.getoptionvalue(v, res.ruleresults)
                    }
                  }
                }
              }
              else if (v.fieldtypeid == 34) {
                if (pricechangedata.length > 0) {
                  if (pricechangedata[0].optionid) {
                    if (!this.getchangefield.includes(v.fieldid.toString())) {
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v, res.ruleresults)
                  }
                }
              }
              else if (v.fieldtypeid == 13 || v.fieldtypeid == 17) {
                if (pricechangedata.length > 0) {
                  if (pricechangedata[0].optionid) {
                    if (!this.getchangefield.includes(v.fieldid.toString())) {
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v, res.ruleresults)
                    if(this.category != 6){
                    if (v.fieldtypeid == 13 && v.dualseq != 2) {
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if (v.fieldtypeid == 13 && v.dualseq == 2) {
                      this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }else{
                    if(v.fieldtypeid == 13 && v.multiseq <= 1){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.multiseq >1){
                      let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                      if(unique !== -1){
                        this.selectproduct_typeiddual[unique].id = pricechangedata[0].optionid;
                      }else{
                        this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:pricechangedata[0].optionid});
                      }
                    }
                  }
                    v.optiondefault = pricechangedata[0].optionid.toString()
                  }
                  else {
                    if (!pricechangedata[0].optionid || pricechangedata[0].optionid == null) {
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              } else if (this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor == 2) {
                // if(!v.optiondefault){ //// for rule base color set
                if (pricechangedata.length > 0) {
                  if (pricechangedata[0].optionvalue) {
                    if (this.checkoptionexistence(v.optionsvalue, pricechangedata[0].optionid)) {
                      this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                      v.optiondefault = pricechangedata[0].optionid.toString()
                      this.getoptionvalue(v, res.ruleresults)
                    }
                  }
                  // }
                }
              } else if (this.fabricIds.includes(v.fieldtypeid) && v.fabricorcolor == 1 && this.editruleoverridecurrent == 1) {
                //&& v.ruleoverride==1 
                return;
              }
              else {
                if (pricechangedata.length > 0) {
                  let previousvalue = this.inst.value[v?.fieldid] ? this.inst.value[v?.fieldid].toString().split(',') : ''
                  let currentvalue = pricechangedata[0]?.optionvalue?.toString().split(',')
                  if (pricechangedata[0].optionid) {
                    if (previousvalue?.length > 0 && currentvalue?.length > 0) {
                      var final = previousvalue.filter(function (item) {
                        return !currentvalue.includes(item)
                      })
                      if (final.length > 0) {
                        this.rulebasefieldaddremove(pricechangedata, v)
                      }
                    }
                    this.inst.get(v?.fieldid.toString()).setValue(pricechangedata[0]?.optionvalue)
                    v.optiondefault = pricechangedata[0]?.optionid?.toString()
                    v['valueid'] = pricechangedata[0]?.valueid?.toString()
                    this.getoptionvalue(v, res?.ruleresults)
                  }
                  else {
                    if (!pricechangedata[0].optionid || pricechangedata[0].optionid == null) {
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
            }
          })
        })
          this.getFilterData("filterBasedcall");
      }
      if(res?.stockavailability?.length){
        this.checkStockAvailability(res.stockavailability)
      }
      if (pricecalc.rulemode == 0) {
          // setTimeout(() => { // command by sundar in LA-I1761
            this.getWidthDropValidation()
          // }, 500);
        }
      if(this.rulescount && !this.formulacount){
        await this.ordercalc(true,rule)
      }else if(pricecalc.rulemode == 1){
        await this.ordercalc(true,rule)
      }
      await this.setProductionRule()
      if (this.forms[0].metaData.some((e: any) => e?.fieldtypeid === 6 && e?.numeric_setcondition)) {
        await this.minMaxSetConditionFull(); // LA-I3072 Condition added
        this.cd.markForCheck();
      }
    },(err) => { 
      this.rulecount--;
    })
    if(this.priceCalculation){
      this.saveorderflag = this.rulesBaseDisableSave = this.saveflag = this.isLoading = false;
    }
    if(this.rulesvalue <= 2 && (!this.priceCalculation || this.ruleModeOpt)){
      if(this.formulacount){
        this.ruleModeOpt = false;
        await this.rulesbaseprice(this.priceCalculation?'runRule':'')
        return
      }
    }else{
      if(this.loadingIndex ){ 
        this.removeSubLoader()
      }
    }
    this.cd.markForCheck();
    // if(this.closeflag){
    //   this.fieldnameTerms.next('test')
    // }
    this.orderCalculationFun()
    return this.formulaCalculation()
  }
  // This is Very important critical bug below code. e.g : production formula not saveing. If need one need modified please check with kavitha,sundar,Visalachi
  setProductionRule(){
    return new Promise(async (resolve, reject) => {
      this.orderproduction = [];//{}
      let formulacolorid = ''
          let formula_colorid = ''
          let formula_coloriddual = ''
          // setTimeout(() => { // LA-I3118 
          this.forms[0].metaData
          .filter((data: any) => [5, 19, 20, 21, 22].includes(data.fieldtypeid))
          .forEach((data: any) => {
            const { fieldtypeid, dualseq, multiseq, optiondefault } = data;

            const isDualType5 = fieldtypeid === 5 && dualseq === '2';
            const isDualType22 = fieldtypeid === 22 && multiseq > 1 && this.category === 6;

            if (isDualType5 || isDualType22) {
              formula_coloriddual = optiondefault;
            } else {
              formula_colorid = optiondefault;
            }
          });
            this.orderproductiondata.map((bom:any)=>{
              // if(bom.fs_displayonproduction == 1){
                // orderproduction[bom.fs_id] = { value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue }
                if(bom.pricevalue!='null')
                {
                  let fieldid = bom.fs_fieldid
                  let fieldtype_id = 0;
                  if(fieldid!=0)
                    fieldtype_id = 3
                  if(bom.fs_variablename=='Fabric Quantity')
                  {
                    fieldid=formula_colorid;
                  }
                  if(bom.fs_variablename=='Fabric Quantity_1')
                  {
                    fieldid=formula_coloriddual;
                  }
                  if(fieldtype_id == 3 && bom.fs_bom == 0){     
                    let orderproductionobj = { productionoveride:bom.productionoverrideeditflag,id:bom.fs_id,value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue,recipeid:bom.fs_recipeid,stockupdate:0,fieldid:fieldid,isdelete:0,defaultstock:bom.fs_deductfromstock,fieldtype_id:fieldtype_id ,option_name:bom.fs_variablename};            
                    if('predefinedlables' in bom){
                      let predefinedlabels = {};
                      for(let p=0;p<bom.predefinedlables.length;p++){
                        predefinedlabels[bom.predefinedlables[p]] = bom[bom.predefinedlables[p]];
                      }
                      Object.assign(orderproductionobj, predefinedlabels);
                    }
                    this.orderproduction.push(orderproductionobj)                
                  }else{
                    this.orderproduction.push({ productionoveride:bom.productionoverrideeditflag,id:bom.fs_id,value: bom.pricevalue,formula: bom.fs_formula,price: bom.pricecalvalue,recipeid:bom.fs_recipeid,stockupdate:0,fieldid:fieldid,isdelete:0,defaultstock:bom.fs_deductfromstock,fieldtype_id:fieldtype_id })
                  }
                
                }
              // }
            })
           this.orderproduction.forEach((val)=>{
            if(val.value && this.productionresults?.length){
              let ind = this.productionresults.findIndex((prod) => prod.some((e:any) => e.fs_id == val.id))
              val.fractionvalue = ind != -1 ? this.productionresults[ind][0].fractionvalue : ""
            }else{
              val.fractionvalue = ""
            }
           })
           resolve(null)    
          //  }, 100);
    })
  }
  numfracvalue(data){
    let numfracvalue = this.inst.value[data.fieldid.toString()]
    let selectedid = this.inst.controls[`${data.fieldid}_${data.fieldname}`]?.value;
    if(selectedid==0)
      this.numericDecimalInches = 0;
      else
      this.numericDecimalInches =  this.Measurementarray?.filter(el => el.id.toString() ==selectedid)[0].decimalvalue

    if(this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3 ){
      if(isNaN(parseFloat(numfracvalue))){
        numfracvalue="0";
      }
      let dropvalue1:any = parseFloat(this.numericDecimalInches) +parseFloat(numfracvalue)
      numfracvalue= dropvalue1;
    }
    return numfracvalue;
  }
  checkoptionexistence(optionlist,optid){
    return optionlist.some(obj => obj.optionid == optid);
  }
  rulebasefieldaddremove(pricechangedata:any,v:any){
    var uniqueResultOne = v.optionsvalue.filter(function(obj) {
      return !pricechangedata.some(function(obj2) {
          return obj.optionid == obj2.optionid
      })
    })
    uniqueResultOne.map((splicedata:any,index:any)=>{
      let splitdata = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid == splicedata.forchildfieldoptionlinkid)
      if(splitdata.length > 0){
        if(v.subchild){
          v.subchild = v.subchild.filter(el => el.forchildsubfieldlinkid != splicedata.forchildfieldoptionlinkid)
        }
        this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != splicedata.forchildfieldoptionlinkid)
        splitdata.map(async (removefield:any)=>{
         this.removeorderdata(removefield)
        })
      }
    })
    debounce((v) => {
      let subgridarray = [];
      subgridarray.push(v);
      this.cd.markForCheck();
      this.defaultorderitem(subgridarray);
    }, 500);
  }
//color rule call
  async colorrulesbaseprice(){
    let saveorderarray = []
    let widthvalue = ''
    let dropvalue = ''
    let qtyvalue = ''
    let optionarray:any =[]
    let optionarraydual:any =[]
    let orderunitype = ''
    let calctestdata:any =[]
    let optlinkarray = []
    let blindopeningwidtharray:any=[]
    let widthfieldtypeid ='';
    let dropfieldtypeid ='';
    let dummyarg = 3
    let fabncoldetails = {
      fabricid : '',
      fabriciddual : '',
      colorid : '',
      coloriddual : '',
      subfabricid : '',
      subcolorid : '',
      colormulticurtain:[],
      fabricmulticurtain:[]
    }
    this.forms[0].metaData.map((data:any,index:any)=>{
      if(data.fieldtypeid == 1){
        let joinvalue:any = ''
        if(this.inst.value[data.fieldid] && !data.blindswidth){
          joinvalue =  parseFloat(this.inst.value[data.fieldid])
        }
        if(data.blindswidth && !this.inst.value[data.fieldid]){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue = this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue
          }
        }
        if(this.inst.value[data.fieldid] && data.blindswidth){
          if(data.blindswidth != '0' && data.blindswidth != 'undefined'){
            joinvalue =  parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.filter(el=>el.id == data.blindswidth)[0].decimalvalue)
          }
          else{
            joinvalue =  parseFloat(this.inst.value[data.fieldid])
          }
        }
        if(joinvalue){
          blindopeningwidtharray.push(joinvalue)
        }
      }
      if(data.optiondefault){
        let optdefault = data.optiondefault.toString().split(',')
        optlinkarray = []
        if(data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).length == 0){
          optlinkarray.push(data['valueid'])
        }
        else{
          data.optionsvalue.filter(el => optdefault.includes(el.optionid.toString())).map((select:any)=>{optlinkarray.push(select.fieldoptionlinkid)})
        }
        if(data.fieldtypeid != 0){
          let valuesplit = data.optiondefault.toString().split(',')
          valuesplit.map((value:any)=>{
            let defaultoptionname =  data.optionsvalue.filter(o1 => o1.optionid == value)
            if(defaultoptionname.length > 0){
              calctestdata.push({optionvalue:defaultoptionname[0].optionid,fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
            }
            else{
              if(data.optiondefault && data['valueid']){
                calctestdata.push({optionvalue:parseFloat(data.optiondefault),fieldtypeid:data.fieldtypeid,optionqty:1,fieldid:data.fieldid})
              }
            }
          })
        }
      }
      if(data.fieldtypeid == 7 || data.fieldtypeid == 8 || data.fieldtypeid == 11 || data.fieldtypeid == 31){
        widthvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3){
        
          if(isNaN(parseFloat(widthvalue))){
            widthvalue="0";
          }
          let widthvalue1:any = parseFloat(this.widthdecimalinches) + parseFloat(widthvalue)
          widthvalue= widthvalue1;
        } 
        widthfieldtypeid = data.fieldtypeid
      }
      if(data.fieldtypeid == 9 || data.fieldtypeid == 10 || data.fieldtypeid == 12 || data.fieldtypeid == 32){
        dropvalue = this.inst.value[data.fieldid.toString()]
        if(  this.unittypevaluehideshow =='Inches' && this.inchfractionselected !=3){
          if(isNaN(parseFloat(dropvalue))){
            dropvalue="0";
          }
          let dropvalue1:any = parseFloat(this.dropdecimalinches) + parseFloat(dropvalue)
          dropvalue= dropvalue1;
        }
        dropfieldtypeid = data.fieldtypeid		
      }
      if(data.fieldtypeid == 14){
        qtyvalue = this.inst.value[data.fieldid.toString()]
      }
      if(data.fieldtypeid == 13){
        if(data.optiondefault){
          if(this.category != 6){
          if(data.dualseq == 2){
            optionarraydual.push(data.optiondefault);
          }
          if(data.dualseq != 2){
          optionarray.push(data.optiondefault)
          }
        }else{
          if(data.multiseq > 1){
            optionarraydual.push({multiseq:data.multiseq,id:data.optiondefault});
          }
          if(data.multiseq <= 1){
          optionarray.push(data.optiondefault)
          }
        }
        }
      }
      if(data.fieldtypeid == 34){
        orderunitype = data.optiondefault
        if(data.optiondefault) { this.unittypevalue = (data.optionsvalue.filter(el => el.optionid == data.optiondefault))[0].optionname }
        else { this.unittypevalue = ''}
      }
      let ordervalue = ''
      let quantityarray = []
      let lengthArray = []
      if(data.optionsvalue.length > 0){
        data.optionsvalue.map((qty:any)=>{
          if( data.fieldtypeid != 33 ){
            if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.optionqty){
                  quantityarray.push(qty.optionqty)
                }
              }
            }
          }else{
             if(data.optiondefault){
              let splitarray = data.optiondefault.toString().split(',')
              if(splitarray.includes(qty.optionid.toString())){
                if(qty.qty){
                  quantityarray.push(qty.qty)
                  lengthArray.push(qty["length"])
                }
              }
            }
          }
          if(data.optiondefault && data['valueid']){
            if(quantityarray.length == 0){
              quantityarray.push(1)
            }
          }
        })
      }
      if(data.fieldtypeid == 34 || data.fieldtypeid == 4 || data.fieldtypeid == 13 || data.fieldtypeid == 17 || data.fieldtypeid == 30){
        if(this.inst.value[data.fieldid.toString()]){
          ordervalue = data.optionsvalue.filter(el => el.optionid.toString() == this.inst.value[data.fieldid.toString()])[0]. optionname
        }
      }
      else{
        ordervalue = this.inst.value[data.fieldid.toString()]
      }
      let format:any = {
        id: data.fieldid,
        labelname: data.fieldname,
        value: ordervalue ? [...new Set(ordervalue.toString().split(','))].join(',') : '',
        valueid: data?.optiondefault && optlinkarray ?  [...new Set(optlinkarray.toString().split(','))].join(',') : '',
        quantity: quantityarray.length > 0 ?  quantityarray.toString() : '',
        type: data.fieldtypeid,
        optionid: data.optiondefault ? data.optiondefault : '',
        fabricorcolor: data.fabricorcolor,
        labelnamecode : data.labelnamecode ? data.labelnamecode : '',
        issubfabric : data.issubfabric ? data.issubfabric : 0,
        fractionValue : data.fieldtypeid == 1 ? parseFloat(this.inst.value[data.fieldid]) + parseFloat(this.Measurementarray?.find(el=>el.id == data.blindswidth)?.decimalvalue) : 0
      }
      if(data.fieldtypeid == 33){
        format.length = lengthArray.toString()
      }
      if(data.fieldtypeid == 28){
        Object.assign(format,{numfrac:this.numfracvalue(data)})
      }
      if(data.editruleoverride==1){
        this.editruleoverridecurrent= 1;
        Object.assign(format,{editruleoverride:1})
      }else{
        this.editruleoverridecurrent= 0;
        Object.assign(format,{editruleoverride:0})
      }
      saveorderarray.push(format)

      if(this.fabricIds.includes(data.fieldtypeid)){
        if(data.fieldtypeid == 20){
          fabncoldetails.colorid = data.optiondefault
        }
        else{
          if(data.fieldlevel == 2 && data.issubfabric != 1){
             if(data.fieldtypeid == 5 && data.dualseq == 2){
              fabncoldetails['coloriddual'] = data.optiondefault;
              }
              else if(data.fieldtypeid == 22 && this.category == 6 && data.optiondefault){
                saveorderarray.forEach(x=>{  // multicurtain
                  if(x.id == data.fieldid){
                    x['multiseq']=data.multiseq;
                  }
                });
              }
               else{
                fabncoldetails.colorid = data.optiondefault;
              }
            }else if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
              fabncoldetails.subfabricid = data.optiondefault;
            }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
              fabncoldetails.subcolorid = data.optiondefault;
            }
          else { 
            if(dummyarg==1){
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = this.softfurningfabricid;
              }
              else if(data.fieldtypeid == 22  && this.category == 6 && data.optiondefault){ //multicurtain
                saveorderarray.forEach(x=>{  // multicurtain
                  if(x.id == data.fieldid){
                    x['multiseq']=data.multiseq;
                  }
                });
              }
              else{
                fabncoldetails.fabricid =  this.softfurningfabricid;
              }
            }
            else{
              if(dummyarg==2)
              {
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = '';
                }
                else if(data.fieldtypeid == 22 && this.category == 6 && data.optiondefault){
                  saveorderarray.forEach(x=>{  // multicurtain
                    if(x.id == data.fieldid){
                      x['multiseq'].delete;
                    }
                  })
                }
                else{
                  fabncoldetails.fabricid = "";
                }
              }
              else{
                if(data.fieldtypeid == 5 && data.dualseq == 2){
                  fabncoldetails['fabriciddual'] = data.optiondefault;
                } 
                else if (data.fieldtypeid == 22 && this.category == 6 && data.optiondefault) { 
                  saveorderarray.forEach(x=>{  // multicurtain
                    if(x.id == data.fieldid){
                      x['multiseq']=data.multiseq;
                    }
                  })
                }
              else{
                fabncoldetails.fabricid = data.optiondefault;
              }
              }
            }
           }
        }
      }
    })
    let productionoverridarray = this.orderproductiondata.map((pro: any) => ({
      id: pro.fs_id,
      productionoveride: pro.productionoverrideeditflag,
      productioneditedvalue: pro.productionoverrideeditflag === 1 ? pro.pricevalue : ''
    }));
    let pricecalc:any = {
        vatpercentage: this.vatcalctoggle ?  this.returnvatvalue() : 0,
        blindopeningwidth: blindopeningwidtharray,
        recipeid: this.receipe,
        productid: this.selectedproductid,
        orderitemdata: saveorderarray,
        supplierid: 51,
        mode: optionarray.length > 0 ? 'pricetableprice' : '',
        width: widthvalue ? widthvalue : '',
        drop: dropvalue ? dropvalue : '',
        pricegroup: optionarray.length > 0 ? optionarray : '',
        pricegroupdual:this.category !=6 ? optionarraydual.length > 0 ? optionarraydual : '' : '',///for dual fabric
        pricegroupmulticurtain:this.category == 6 ?optionarraydual.length > 0 ? optionarraydual : []:[],///for multicurtain
        customertype: this.productser.customerType,
        optiondata: calctestdata,
        unittype: orderunitype,
        orderitemqty: qtyvalue,
        jobid: this.route.snapshot.paramMap.get('id'),
        customerid:this.productser.customerid ? this.productser.customerid : this.productser.existingcusID,
        rulemode : this.rulesvalue == 1 ? 0 : 1,
        productionoveridedata: productionoverridarray,
        widthfieldtypeid:widthfieldtypeid,
        dropfieldtypeid:dropfieldtypeid,
        overridetype: this.orderpricecalculation.overrideprice ? parseFloat(this.orderpricecalculation.overrideprice) : '',
        overrideprice: (this.orderpricecalculation.overridevalue !== null || this.orderpricecalculation.overridepricecalc !== '') ? this.orderpricecalculation.overridepricecalc : 0,
        ...fabncoldetails
    } 
    if(this.oneditmode==false){
      let temp:any=Number(orderunitype);
       this.unittypefractionlist(-1,temp);  
     }
     
    //  this.orderser.cancelruleRequests()
    await this.orderser.rulesbasecalc(pricecalc).toPromise().then(async (res: any) => {
      this.reportpriceresults = res.reportpriceresults
      this.productionmaterialcostprice = res.productionmaterialcostprice
      this.productionmaterialnetprice = res.productionmaterialnetprice
      this.materialFormulaPrice = res.materialFormulaPrice;
      this.productionmaterialnetpricewithdiscount = res.productionmaterialnetpricewithdiscount
      this.overridepricevalue = res.overridepricevalue
      this.getpricegroupprice = res.getpricegroupprice
      this.productionresults = res.productionresults
      if(this.orderproductiondata.length > 0){
        if(res.productionresults.length >0){
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
            // pro['productionmode'] = 0
            // pro['productionoverrideeditflag'] = 0
          })
          res.productionresults.map((data:any)=>{
            if( data[0].battenstype != 0){ // implement battens LA-I567
            this.orderproductiondata.map((price:any)=>{
              if(data[0].fs_id == price.fs_id){
                if(data[0].bom == 0) {
                  this.forms[0].metaData.map((val:any)=>{
                    if(val.fieldtypeid!=0){
                      if(val.fieldtypeid == 29 || val.fieldtypeid == 18 || val.fieldtypeid == 11 || val.fieldtypeid == 14 || val.fieldtypeid == 1 || val.fieldtypeid == 12 || val.fieldtypeid == 6 || val.fieldtypeid == 7 || val.fieldtypeid == 8 || val.fieldtypeid == 9 || val.fieldtypeid == 10 || val.fieldtypeid == 31 || val.fieldtypeid == 32){
                        if(this.inst.get(val.fieldid.toString()).value){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          // price.productionmode = data[0].productionoveridevalue
                          if(data[0].formulatype == 0){
                            price.pricecalvalue = data[0].productionprice
                          }
                          else{
                            price.pricecalvalue = data[0].getcostprice
                          }
                          price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                        }
                      }
                      if(val.optiondefault){
                        let result = val.optionsvalue.filter(o1 => data.some(o2 => o1.optionid == o2.optionid))
                        if(result.length > 0){
                          price.pricevalue = data[0].formularesult
                          price.showhideflag = data[0].formularesult ? 1 : 0
                          price.unittype = data[0].jobunittype
                          // price.productionmode = data[0].productionoveridevalue
                          if(data[0].formulatype == 0){
                            price.pricecalvalue = data[0].productionprice
                          }
                          else{
                            price.pricecalvalue = data[0].getcostprice
                          }
                          price.costPrice = data[0].getcostprice
                            price.sellingprice=this.netpricecomesfrom=="1"?data[0]?.getnetprice:"-"
                            price.getpricesuppdisc=data[0].getpricesuppdisc
                        }
                      }
                    }
                  })
                }
                else if(data[0].bom == 1) {
                  price.pricevalue = data[0].formularesult
                  price.showhideflag = data[0].formularesult ? 1 : 0
                  price.unittype = data[0].jobunittype
                  // price.productionmode = data[0].productionoveridevalue
                  if(data[0].formulatype == 0){
                    price.pricecalvalue = data[0].productionprice
                    price.costPrice = data[0].productionprice
                    price.sellingprice=data[0].productionnetprice?data[0].productionnetprice:"-"
                    }
                  else{
                    price.pricecalvalue = '-'
                    price.costPrice = '-'
                  }
                }
              }
            })
          }else{
            let battendObj = data[0]
            battendObj.pricevalue = data[0].formularesult,
            battendObj.showhideflag = data[0].formularesult ? 1 : 0
            battendObj.unittype = data[0].jobunittype
            battendObj.pricecalvalue = data[0].productionprice
            battendObj.costPrice = data[0].productionprice
            battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
            battendObj.battens = true
            battendObj.fs_displayonproduction = 1
            this.orderproductiondata.push(battendObj)
          }
          })
        }
        else{
          this.orderproductiondata.map((pro:any)=>{
            pro['pricevalue'] = pro.productionoverrideeditflag == 1 ? pro.pricevalue : ''
            pro['showhideflag'] = 0
            pro['pricecalvalue'] = ''
            pro['unittype'] = ''
            pro['sellingprice']=''
            pro['getpricesuppdisc']=''
          })
        }
      }else {
        if(res.productionresults.length > 0){
          let getBattens =  res.productionresults[0].filter( x => x.battenstype == 0 )
          if(getBattens.length > 0){
            res.productionresults.map((data:any)=>{
              let battendObj = data[0]
                battendObj.pricevalue = data[0].formularesult,
                battendObj.showhideflag = data[0].formularesult ? 1 : 0
                battendObj.unittype = data[0].jobunittype
                battendObj.pricecalvalue = data[0].productionprice
                battendObj.costPrice = data[0].productionprice
                battendObj.sellingprice = data[0].productionnetprice?data[0].productionnetprice:"-"
                battendObj.battens = true
                battendObj.fs_displayonproduction = 1
                this.orderproductiondata.push(battendObj)
            })
          }
        }
      }
      this.forms[0].metaData.map((v:any,index:any)=>{
        if(res.ruleresults.length > 0){
          res.ruleresults.map((price:any,i:any)=>{
            if(price[v.fieldid]){
              let pricechangedata = price[v.fieldid]
              if(v.fieldtypeid == 4 || v.fieldtypeid == 30 || v.fieldtypeid == 29 || v.fieldtypeid == 18 || v.fieldtypeid == 11 || v.fieldtypeid == 14 || v.fieldtypeid == 1 || v.fieldtypeid == 12 || v.fieldtypeid == 6 || v.fieldtypeid == 7 || v.fieldtypeid == 8 || v.fieldtypeid == 9 || v.fieldtypeid == 10 || v.fieldtypeid == 31 || v.fieldtypeid == 32){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v,res.ruleresults)
                  } else {
                    this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                  }
                }
              }
              else if(v.fieldtypeid == 13  || v.fieldtypeid == 17){
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionid)
                    this.getoptionvalue(v,res.ruleresults)
                    if(this.category != 6){
                    if(v.fieldtypeid == 13 && v.dualseq !=2){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.dualseq ==2){
                      this.selectproduct_typeiddual = pricechangedata[0].optionid;
                    }
                  }else{
                    if(v.fieldtypeid == 13 && v.multiseq <= 1){
                      this.selectproduct_typeid = pricechangedata[0].optionid;
                    }
                    if(v.fieldtypeid == 13 && v.multiseq >1){
                      let unique = this.selectproduct_typeiddual.findIndex(item => item.multiseq == v.multiseq);
                      if(unique !== -1){
                        this.selectproduct_typeiddual[unique].id = pricechangedata[0].optionid;
                      }else{
                        this.selectproduct_typeiddual.push({multiseq:v.multiseq,id:pricechangedata[0].optionid});
                      }
                    }
                  }
                    v.optiondefault = pricechangedata[0].optionid.toString()
                  }
                  else{
                    if(!pricechangedata[0].optionid || pricechangedata[0].optionid == null){
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
              else{
                if(pricechangedata.length > 0){
                  if(pricechangedata[0].optionid){
                    if(!this.getchangefield.includes(v.fieldid.toString())){
                      this.getchangefield.push(v.fieldid.toString())
                    }
                    this.inst.get(v.fieldid.toString()).setValue(pricechangedata[0].optionvalue)
                    v.optiondefault = pricechangedata[0]?.optionid.toString()
                    v['valueid'] = pricechangedata[0]?.valueid.toString()
                    this.getoptionvalue(v,res.ruleresults)
                  }
                  else{
                    if(!pricechangedata[0].optionid || pricechangedata[0].optionid == null){
                      this.inst.get(v.fieldid.toString()).setValue('')
                      v.optiondefault = ''
                    }
                  }
                }
              }
            }
          })
        }
      })
      if(res?.stockavailability?.length){
        this.checkStockAvailability(res.stockavailability)
      }
    })
    this.ordercalc()
  }
//order status
  onSelectAll(item:any){
    this.orderchangeflag = true
    this.orderstatusidarray = []
    this.productstatusarray.forEach((element,index)=>{
      this.orderstatusidarray.push(element.id)
    })
  }
  saveColor(data: any) {
    let filesId = data.filesId
    let files = data.files
    let formValues = data.formvalue
    let ctypevalues = data.ctype
   // this.fieldid = data.fieldid
  //  this.fieldLevel = data.level
    const formData = new FormData()
    formData.append('leadimage', data.leadimage)
    if (filesId.length > 0) {
      filesId.map((v, i) => {
        formData.append(v, (files[v]) ? files[v] : '')
      })
    }
    formData.append('productid', this.commonapiService.productId)
    formData.append('fieldtype', data.fieldType)
    formData.append('imagearray', filesId)
    formData.append('optionhasprice', data.colorhasprice)
    formData.append('optionhasstock', data.colorhasstock)
    formData.append('jobform', ctypevalues.job_form)
    formData.append('onlineportal', ctypevalues.online_portal)
    formData.append('ecommercesite', ctypevalues.ecommerce_portal)
    formData.append('filter_contacttype', ctypevalues.filter_contacttype)
    formData.append('filter_supplier', ctypevalues.filter_supplier)
    formData.append('filter_shuttertype', ctypevalues.filter_shuttertype)
    formData.append('filter_shuttersupplier', ctypevalues.filter_shuttersupplier)
    formData.append('filter_pricegroup', ctypevalues.filter_pricegroup)
    formData.append('filter_minmax', ctypevalues.filter_minmax)
    formData.append('custmzdopdetails', JSON.stringify(formValues))
    formData.append('ctypevalues', JSON.stringify(ctypevalues.customerType))
    formData.append('vatstatus', JSON.stringify(data.vatdata))
    if(data.fieldType == 33 && this.addCustomeBattenFlag){
        if( this.route.snapshot.paramMap.get('id') ){
          formData.append('jobid', this.route.snapshot.paramMap.get('id'))
        }else{
          formData.append('jobtempid', this.job_tempid)
        }
        formData.append('customerid', this.productser.customerid ? this.productser.customerid : this.productser.existingcusID)
        $('#optionsModal').modal('hide');
        setTimeout(() => {
          $(`#comboGrid${this.comboIndex}`).combo('showPanel');
          $(`#comboGrid${this.comboIndex}`).combogrid('textbox').focus();
        }, 100);
    }
    if (data.colorId) {
      if(data.fieldType == 4){
        formData.append('fieldid', '')
      }else{
        formData.append('fieldid',data.fieldid)
      }
      formData.append('mode', 'edit')
      formData.append('manualduedate', this.manualDueDate)
      this.productapi.updateOption(data.colorId, formData).subscribe((res: any) => {
        if (res.result == '0') {
          this.toast.errorToast(res.message)
        }
        else {
          if(data.fieldType == 4){
            this.toast.successToast("Locations updated successfully")
          }
          else{
            this.toast.successToast("Option updated successfully")
          }
          // if(data.fieldType == 33 ){
          //   this.forms[0].metaData[this.option_fabric_index].optionsvalue.map((data:any)=>{ 
          //     if(this.forms[0].metaData[this.option_fabric_index].fieldtypeid == 33 && data.optionid == res.result.optionid  ){
          //       this.optionqtyarray[this.forms[0].metaData[this.option_fabric_index].fieldid + '_' + data.optionid] = res.result.Qty
          //     }
          //   })
          // }
          // this.popupService.existopenOptionlistModal(this.popupService.fieldtypeid)
          this.commonapiService.addoptionflag = false
          this.popupService.closeOptionModal() 
          setTimeout(() => {
            this.page = 1
            this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
          }, 100)
          //this.refreshdata(this.parentparams) 
        }
      })
    }
    else {
      this.popupService.fieldid = !this.commonapiService.addoptionflag ?  data.fieldid : ''
      if(data.fieldType == 4){
        formData.append('fieldid', '')
      }else{
        formData.append('fieldid', this.popupService.fieldid)
      }
      formData.append('mode', 'add')
      formData.append('recipeid', this.receipe)
      formData.append('manualduedate', this.manualDueDate)
      this.productapi.saveOption(formData).subscribe((res: any) => {
        if (res.result == '0') {
          this.toast.errorToast(res.message)
        }
        else {
          if(data?.addWidthPriceDropFlag){
            let seteditDropPriceValue = {data:{
            //  pricingtype: this.AddPriceTypeID,
              fol_optionId: res?.result?.fol_optionId ?? res?.result?.optionid
            }}
              this.popupService.setOptionIdPopUp(res?.result?.fol_optionId ?? res?.result?.optionid);
         //   this.onoptionpricingtypeClick(seteditDropPriceValue, 'edit')
           }else{
            this.popupService.closeOptionModal()
          }
          if(data.isLP){
            this.popupService.triggersaveOptionDone({mode:'add',optionid:res.result.optionid,optionname:res.result['Option Name']})
          }
          if(data.fieldType == 4){
            this.toast.successToast("Locations added successfully")
          } else if(data.fieldType == 33){
            this.toast.successToast("Battens Saved Successfully")
          }
          else{
            if(!data.isLP){
              this.toast.successToast("Option added successfully");
              //this.filterbasecall();
            }            
          }
           this.commonapiService.addoptionflag = false
           setTimeout(() => {
            this.page = 1
            if(data.fieldType == 33){
              this.gridApi.setServerSideDatasource(this.getDataSource(this.selectedcompindex,'',[]))
            }else{
              this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[],res?.result?.fol_optionId ?? res?.result?.optionid))
            }
          }, 100)
       //   this.refreshdata(this.parentparams) 
        }
      })
    }
  }
  orderpopupConfirmSave(par:any){
    if(par=='true'){
      $('#option_fabricConfirmPopup').modal('hide');
      $('#materialFabric-modal').modal('hide');
      this.saveFabric(this.materialfabric.orderpopupfabricdata);
      this.popupService.SLATsaveColor('yes');
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
      }, 100)
      this.toast.successToast('Changes Applied')
    }else{
      $('#materialFabric-modal').modal('hide');
    }
  }
    orderpopupConfirmColorSave(par:any){
    if(par=='true'){
      
      $('#materialColor-modal').modal('hide');
      $('#option_fabricColorConfirmPopup').modal('hide');
      this.popupService.saveColor(this.colorfabric.orderpopupColordata);
      this.toast.successToast('Changes Applied');
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
      }, 100)
    }else{
      $('#materialColor-modal').modal('hide');
    }
  }
    orderpopupConfirmOptionsSave(par:any){
    if(par=='true'){
      $('#optionsModal').modal('hide');
      $('#optionConfirmPopup').modal('hide');
      this.popupService.saveOption(this.optionsPopup.orderpopupOptiondata)
      setTimeout(() => {
        this.page = 1
        this.option_fabric_gridapi.setServerSideDatasource(this.getDataSource(this.option_fabric_index,'',[]))
      }, 100)
      this.toast.successToast('Changes Applied')
    }else{
      $('#optionsModal').modal('hide');
    }
  }
 saveFabric(data: any) {
  this.popupService.fieldtypeid = this.popupService.fieldtypeid != undefined ? this.popupService.fieldtypeid : this.popupService.initFiledID
  let filesId = data.filesId
  let files = data.files
  let formValues = data.formvalue
  const formData = new FormData()
  formData.append('leadimage', data.leadimage)
  if (filesId.length > 0) {
    filesId.map((v, i) => {
      formData.append(v, (files[v]) ? files[v] : '')
    })
  }
  if(this.popupService.fieldtypeid == 21){
    formData.append('hasprice', data.hasprice ?? true);
  }
  formData.append('imagearray', filesId)
  formData.append('custmzdfabdetails', JSON.stringify(formValues))
  formData.append('mtrlcategid', this.popupService.fieldtypeid)
  formData.append('productid', this.commonapiService.productId)
  // formData.append('groupids', this.priceGroupIds);
  if (data.fabricId && !this.productapi.fabricCopyFlag) {
    formData.append('mode', 'edit')
    formData.append('fabricid', data.fabricId)
    formData.append('selectcustomcolumnid', data.selectcustomcolumnid)
  }
  else if (data.fabricId && this.productapi.fabricCopyFlag) {
    formData.append('mode', 'copy');
    formData.append('existingfabricid', data.fabricId)
    formData.append('selectcustomcolumnid', data.selectcustomcolumnid)
    formData.append('existingcolourids', data.existingcolourids)
  }
  else {
    formData.append('mode', 'add')
    formData.append('recipeid', this.receipe);
    if(this.popupService.fieldtypeid == 21){
        $('#existingOptions').modal('hide')
    }
  }
  formData.append('vatstatus', JSON.stringify(data.vatdata))
  this.productapi.saveFabric(formData).toPromise().then((res: any) => {
    this.productapi.fabricId = res.fabricid
    this.productapi.fabricColorMapID = res.mapid
    this.productapi.fabricColorID = res.colourid
    if (data.addColor && this.productapi.fabricId) {
      // this.materialfabric.openColorpopup();
      this.popupService.openproductColorModal(res.colourid)
    }
    this.popupService.getFabricValue(true);
    this.popupService.productColorReload()
      // $('#materialFabric-modal').modal('hide')
    }).then(()=>{
  }).catch((err)=>{
      if (err.status == 403) {
        this.toast.errorToast(err.error.message)
      }
  })
}
  async getFilterData(action,parentfield?){
      let validationdata = {
        lineitemselectedvalues: this.editorderitemselectedvalues,
        productid: this.selectedproductid,
        supplier: '',
        pricegroup: '',
        fabricid: '',
        colorid: '',
        subfabricid: '',
        subcolorid: '',
        coloriddual:'',
        fabriciddual:'',
        pricegroupdual:'',
        selectedvalues: {'pricegroupmulticurtain':[]},
        pricegroupmulticurtain:[],
        fabricmulticurtain:[],
        orderitemselectedvalues: this.getallselectedvalues(),
        selectedfieldids: [],
        fieldtypeid: '',
        width: '',
        drop: '',
        numFraction:'',
        customertype: this.productser.customerType,
        changedfieldtypeid: '',
        unittype: this.forms[0].metaData.filter(el=>el.fieldtypeid == 34)[0].optiondefault,
        changedfieldid: parentfield?.fieldid
      }
      if(action == "widthdropfilter"){
        validationdata.changedfieldtypeid = parentfield.fieldtypeid == 17 || parentfield.fieldtypeid == 13 ? parentfield.fieldtypeid : '';
      }
      let supplierdata = (this.forms[0].metaData.filter(el=>el.fieldtypeid == 17).length > 0)?this.forms[0].metaData.filter(el=>el.fieldtypeid == 17)[0].optiondefault:"";
      // validationdata.fieldtypeid = this.fabricIds.includes(parentfield.fieldtypeid) ? parentfield.fieldtypeid : ''
      this.forms[0].metaData.map((data:any)=>{
        validationdata.selectedfieldids.push(data.fieldid)
        if((this.fabricIds.includes(data.fieldtypeid) && data.showfieldonjob) || data.fieldtypeid == 13 || data.fieldtypeid == 17){
          // if(data.optiondefault){
            if(data.optionsbackup.length > 0){
              let optinvaluearray = []
              data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
              if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric != 1 && data.showfieldonjob){
                let fieldid = [data.fieldtypeid] + '_' + data.fabricorcolor
                if((this.category == 6 && data.multiseq <= 1 ) || (this.category != 6 && data.dualseq <= 1)){
                if((data.fieldtypeid == 5 || data.fieldtypeid == 22) && data.fabricorcolor ==1 && validationdata.selectedvalues[fieldid]){
                  validationdata.selectedvalues[fieldid]  = validationdata?.selectedvalues[fieldid]?.concat(optinvaluearray)
                }
                else{
                  validationdata.selectedvalues[fieldid]  = optinvaluearray;
                }
              }
              }
              else if(this.fabricIds.includes(data.fieldtypeid) && data.issubfabric == 1){
                let fieldid = 'sub_'+ [data.fieldtypeid] + '_' + data.fabricorcolor
                validationdata.selectedvalues[fieldid]  = optinvaluearray
              }
              else{
                let arrayname = ''
                if(data.fieldtypeid == 13){
                  if(this.category == 6 && data.multiseq>1){
                    validationdata.selectedvalues['pricegroupmulticurtain'].push({multiseq:data.multiseq,id:optinvaluearray});
                  }else{
                    arrayname ='pricegrouparray'
                    validationdata.selectedvalues[arrayname] = optinvaluearray
                  }
                }
                if(data.fieldtypeid == 17){
                  arrayname ='supplierarray';
                  validationdata.selectedvalues[arrayname] = optinvaluearray
                }
              }
            }
          // }
          
        }
        else{
          if(data.optionsbackup.length > 0){
            let optinvaluearray = []
            data.optionsbackup.filter(el => optinvaluearray.push(el.optionid))
            validationdata.selectedvalues[data.fieldid] = optinvaluearray
          }
        }
        let fabricarray=[7,8,11]
        let colorarray=[9,10,12]
        if(fabricarray.includes(data.fieldtypeid)){
          let widthvalue:any = parseFloat(this.widthdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
          validationdata.width = widthvalue
        }
        if(colorarray.includes(data.fieldtypeid)){
          let dropvalue:any = parseFloat(this.dropdecimalinches) + parseFloat(this.inst.value[data.fieldid.toString()])
          validationdata.drop = dropvalue
        }
        if(data.fieldtypeid == 18){
          let numFraction:any = parseFloat(this.numericDecimalInches) + parseFloat(this.inst.value[data.fieldid.toString()])
          validationdata.numFraction = numFraction
        }
        if(data.fieldtypeid == 13){
          if(supplierdata != ""){
            this.suppliersetmanual = 1;
            let mainsupplier = (data.optionsbackup.filter(el => el.optionid == data.optiondefault).length > 0)?data.optionsbackup.filter(el => el.optionid == data.optiondefault)[0].mainsupplier:"";
            // validationdata.pricegroup = (supplierdata == data.mainsupplier)?data.optiondefault:"";
            if(this.category != 6){
            if(data.dualseq != 2){
              validationdata.pricegroup = (supplierdata == mainsupplier)?data.optiondefault:"";
            }
            if(data.dualseq == 2){
              validationdata.pricegroupdual = (supplierdata == mainsupplier)?data.optiondefault:"";
            }
          }else{
            if(data.multiseq <= 1){
              validationdata.pricegroup = (supplierdata == mainsupplier)?data.optiondefault:"";
            }
            if(data.multiseq > 1){
              validationdata.pricegroupmulticurtain.push({multiseq:data.multiseq,id:(supplierdata == mainsupplier)?data.optiondefault:""});
            }
          }
          }else{
            // validationdata.pricegroup = data.optiondefault;
            if(this.category != 6) {         
            if(data.dualseq != 2){
              validationdata.pricegroup = data.optiondefault
            }
            if(data.dualseq == 2){
              validationdata.pricegroupdual = data.optiondefault
            }
            } else {
              if (data.multiseq <= 1) {
                validationdata.pricegroup = data.optiondefault
              }
              if (data.multiseq > 1) {
                validationdata.pricegroupmulticurtain.push({ multiseq: data.multiseq, id: data.optiondefault });
              }
            }          
        }
      }
        if(data.fieldtypeid == 17){
          validationdata.supplier = data.optiondefault
        }
        if(this.fabricIds.includes(data.fieldtypeid)){
          if(data.fieldtypeid == 20){
            validationdata.colorid = data.optiondefault
          }
          else{
            if(data.fieldlevel == 2 && data.issubfabric != 1){
              //  validationdata.colorid = data.optiondefault 
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                validationdata['coloriddual'] = data.optiondefault;
                }else if(data.fieldtypeid == 22 && data.multiseq > 1){
                  // validationdata['coloriddual'] = data.optiondefault;
                  } else{
                  validationdata.colorid = data.optiondefault;
                }
            }
            else {
              //  validationdata.fabricid = data.optiondefault 
              if(data.fieldtypeid == 5 && data.dualseq == 2){
                validationdata['fabriciddual'] = data.optiondefault;                
                }
                else if(data.fieldtypeid == 22 && data.multiseq > 1){
                  validationdata['fabricmulticurtain'].push({multiseq:data.multiseq,id:data.optiondefault});
              }else{
                if(data.fieldlevel == 2 && data.issubfabric == 1){ //subfabricid
                  validationdata.subfabricid = data.optiondefault;
                }
                else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcolorid
                  validationdata.subcolorid = data.optiondefault;
                }else{
                  validationdata.fabricid = data.optiondefault;
                }
              }  
            }
          }
        }
      })
      this.forms[0].metaData.filter(el => {
        if(this.fabricIds.includes(el.fieldtypeid) && el.fieldlevel == 1){
          validationdata.fieldtypeid = el.fieldtypeid
        }
      })
      if(this.selectproduct_typeid) {
        validationdata.pricegroup = this.selectproduct_typeid ;
      }
      if(this.selectproduct_typeiddual?.length>0) {
        if(this.category != 6){
        validationdata.pricegroupdual = this.selectproduct_typeiddual ;
      }
      // else{
      //   validationdata.pricegroupmulticurtain = this.selectproduct_typeiddual ;
      // }
      }
      if(action == "widthdropfilter" && (parentfield?.fieldtypeid == 13 || parentfield?.fieldtypeid == 17)){
        validationdata.fabricid = '';
        validationdata.colorid ='';
        if(parentfield.fieldtypeid == 13)
          validationdata.supplier = '';
        if(parentfield.fieldtypeid == 17)
          validationdata.pricegroup = '';
        validationdata.pricegroupdual = ''
      }
        validationdata['orderItemId'] = this.addeditmode == 'add' ? '' : this.orderid;
      this.cd.markForCheck();
      this.orderser.cancelFilterRequests() 
      validationdata['apicall'] = this.apiflagcount += 1
        await this.orderser.ordertypevalidation(validationdata).then((res: any) => {
          if(res){
            let fabDual;
            let multiColor;
            if (this.category == 6) {
              fabDual = res[0].data.multifabricidsarray
              multiColor = res[0].data.multicoloridsarray
            } else {
              fabDual = res[0].data.fabricidsarraydual;
              multiColor = res[0].data.coloridsarraydual
            }
            this.filterbasearray = { fabric:res[0].data.fabricidsarray, color: res[0].data.coloridsarray, option: res[0].data.optionarray, fabricdual: fabDual, colordual: multiColor }
            let removedataflag:boolean = false
            this.forms[0].metaData.map((data:any)=>{
              if(data.fieldtypeid == 13){
                if(this.category != 6){
                if(data.dualseq != 2){
                if(res[0].data.selectproducttypeid != 0){
                data.optiondefault = res[0].data.selectproducttypeid
                }
                  if(res[0].data.selectproducttypeid == 0){
                data.optiondefault = ''
                }
                }
                else if(data.dualseq == 2){
                if(res[0].data.selectproducttypeiddual != 0){
                data.optiondefault = res[0].data.selectproducttypeiddual
                }
                  if(res[0].data.selectproducttypeiddual == 0){
                data.optiondefault = ''
                }
              }
              if(this.forms[0].metaData.find(x=>x.optiondefault != "" && x.fieldtypeid == 17)){
              data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
                  }else if(this.forms[0].metaData.find(x=>x.optiondefault == "" && x.fieldtypeid == 17)){
                    data.optionsvalue = data.optionsbackup
                  }
                
              }else{
                  if (data.multiseq <= 1) {
                    if (res[0].data.selectproducttypeid != 0) {
                      data.optiondefault = res[0].data.selectproducttypeid
                    }
                    if (res[0].data.selectproducttypeid == 0) {
                      data.optiondefault = ''
                    }
                  }
                  else if (data.multiseq > 1) {
                    let multiselectproducttypeidmore = res[0].data.multiselectproducttypeidmore;
                    let selectproducttypeidmorefiltered = multiselectproducttypeidmore?.find(el => el.multiseq == data.multiseq);
                    if (selectproducttypeidmorefiltered?.id != 0) {
                      data.optiondefault = selectproducttypeidmorefiltered?.id
                    }
                    if (selectproducttypeidmorefiltered?.id == 0 || selectproducttypeidmorefiltered?.length == 0 || res[0]?.data?.selectsupplierid?.length == 0) {
                      data.optiondefault = ''
                    }
                  }
                  if (data.multiseq <= 1) {
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.pricegroupidsarray.includes(el.optionid))
                  } else if (data.multiseq > 1) {
                    let morepricegroupidsarray = res[0].data.multipricegroupidsarray;
                    let morepricegroupidsarrayfiltered = morepricegroupidsarray.filter(el => el.multiseq == data.multiseq);
                    data.optionsvalue = data.optionsbackup.filter(el => morepricegroupidsarrayfiltered[0]?.id?.includes(el.optionid))
                  }
                }                
                if(data.optiondefault){
                  this.inst.get(data.fieldid.toString()).markAsDirty()
                  if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    this.inst.get(data.fieldid.toString()).markAsPristine()
                    this.removeorderdata(data)
                    removedataflag = true
                  }
                }
                else {
                  this.inst.get(data.fieldid.toString()).setValue('')
                    this.removeorderdata(data)
                    removedataflag = true
                }
              }
              if(data.fieldtypeid == 17){
                if(res[0].data.selectsupplierid != 0){
                  data.optiondefault = res[0].data.selectsupplierid
                }
                if(res[0].data.selectsupplierid == 0){
                  data.optiondefault = ''
                }
                // if(res[0].data.supplieridsarray.length == 1 && validationdata.supplier){
                //   data.optiondefault = res[0].data.supplieridsarray.toString()
                // }
                // if(res[0].data.supplieridsarray.length == 1 && validationdata.pricegroup){
                //   data.optiondefault = res[0].data.supplieridsarray.toString()
                // }
                data.optionsvalue = data.optionsbackup.filter(el => res[0].data.supplieridsarray.includes(el.optionid))
                if(data.optiondefault){
                  if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                    data.optiondefault = ''
                    this.inst.get(data.fieldid.toString()).setValue('')
                    this.removeorderdata(data)
                    removedataflag = true
                  }
                }
              }
              if(this.fabricIds.includes(data.fieldtypeid)){
                if(data.fieldtypeid == 20){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                    if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                }
                else{
                  if(data.fieldlevel == 2 && data.issubfabric != 1){ //coloridsarray
                    if(this.category != 6)
                   { if(data.dualseq !=2){
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                    }
                    if(data.dualseq ==2){ ////for dual fabric and color
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarraydual.includes(el.optionid))
                    }
                  }else{
                    if(data.multiseq <= 1){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.coloridsarray.includes(el.optionid))
                      }
                      if(data.multiseq >1){ ////for multicurtain and color
                        let multicoloridsarray = res[0].data.multicoloridsarray;
                        let morecoloridsarrayfiltered = multicoloridsarray.filter(el => el.multiseq == data.multiseq);
                        data.optionsvalue = data.optionsbackup.filter(el => morecoloridsarrayfiltered[0]?.id?.includes(el.optionid));
                      }
                  }
                    if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                  }else if(data.fieldlevel == 1 && data.issubfabric != 1){ // fabricidsarray
                    // data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                    if(this.category != 6){
                    if(data.dualseq !=2){
                      if(res[0].data.pricegroupidsarray){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                      }else{
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                      }
                    }
                    if(data.dualseq ==2){ ////for dual fabric and color
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                    }
                  }else{
                    if(data.multiseq <= 1){
                      if(res[0].data.pricegroupidsarray){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                      }else{
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                      }
                    }
                    if(data.multiseq >1){ ////for multicurtain and color
                      let multifabricidsarray = res[0].data.multifabricidsarray;
                    let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                    let morepriceidsarray = res[0].data.multipricegroupidsarray;
                    let morepriceidsarrayfiltered = morepriceidsarray.filter(el => el.multiseq == data.multiseq);
                    data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid) && morepriceidsarrayfiltered[0]?.id.includes(el.pricegroupid));
                    }
                  }
                  }else if(data.fieldlevel == 2 && data.issubfabric == 1){ // subfabricidsarray
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subfabricidsarray.includes(el.optionid))
                    if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                  }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcoloridsarray
                    data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subcoloridsarray.includes(el.optionid))
                    if(data.optiondefault){
                      if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                        data.optiondefault = ''
                        this.inst.get(data.fieldid.toString()).setValue('')
                        this.removeorderdata(data)
                        removedataflag = true
                      }
                    }
                  }
                  else {
                    if(this.category != 6){
                    if(data.dualseq !=2){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                    }
                    if(data.dualseq ==2){ ////for dual fabric and color
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarraydual.includes(el.optionid))
                    }
                  }else{
                    if(data.multiseq <= 1){
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                    }
                    if(data.multiseq >1){ ////for multicurtain and color
                      let multifabricidsarray = res[0].data.multifabricidsarray;
                      let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                      data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));
                    }
                  }
                      if(data.optiondefault){
                        if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                          data.optiondefault = 'dfsdf'
                          this.inst.get(data.fieldid.toString()).setValue('')
                          this.removeorderdata(data)
                          removedataflag = true
                        }
                    }else if(data.fieldlevel == 1 && data.issubfabric != 1){ // fabricidsarray
                      if(data.multiseq <= 1){
                        if(res[0].data.pricegroupidsarray){
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid) && res[0].data.pricegroupidsarray.includes(el.pricegroupid))
                        }else{
                          data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                        }
                      }
                      if(data.multiseq >1){ ////for multicurtain and color
                        let multifabricidsarray = res[0].data.multifabricidsarray;
                      let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                      let morepriceidsarray = res[0].data.multipricegroupidsarray;
                      let morepriceidsarrayfiltered = morepriceidsarray.filter(el => el.multiseq == data.multiseq);
                      data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid) && morepriceidsarrayfiltered[0]?.id.includes(el.pricegroupid));
                      }
                      if(data.optiondefault){
                        if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                          data.optiondefault = ''
                          this.inst.get(data.fieldid.toString()).setValue('')
                          this.removeorderdata(data)
                          removedataflag = true
                        }
                      }
                    }else if(data.fieldlevel == 2 && data.issubfabric == 1){ // subfabricidsarray
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subfabricidsarray.includes(el.optionid))
                      if(data.optiondefault){
                        if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                          data.optiondefault = ''
                          this.inst.get(data.fieldid.toString()).setValue('')
                          this.removeorderdata(data)
                          removedataflag = true
                        }
                      }
                    }else if(data.fieldlevel == 3 && data.issubfabric == 1){ //subcoloridsarray
                      data.optionsvalue = data.optionsbackup.filter(el => res[0].data.subcoloridsarray.includes(el.optionid))
                      if(data.optiondefault){
                        if(data.optionsvalue.filter( el => el.optionid.toString() == (typeof data.optiondefault == 'number')?data.optiondefault.toString():data.optiondefault).length == 0){
                          data.optiondefault = ''
                          this.inst.get(data.fieldid.toString()).setValue('')
                          this.removeorderdata(data)
                          removedataflag = true
                        }
                      }
                    }
                    else {
                      if(data.multiseq <= 1){
                        data.optionsvalue = data.optionsbackup.filter(el => res[0].data.fabricidsarray.includes(el.optionid))
                      }
                      if(data.multiseq >1){ ////for multicuratin and color
                        let multifabricidsarray = res[0].data.multifabricidsarray;
                        let morefabricidsarrayfiltered = multifabricidsarray.filter(el => el.multiseq == data.multiseq);
                        data.optionsvalue = data.optionsbackup.filter(el => morefabricidsarrayfiltered[0]?.id?.includes(el.optionid));
                      }
                        if(data.optiondefault){
                          if(data.optionsvalue.filter( el => el.optionid.toString() == data.optiondefault.toString()).length == 0){
                            data.optiondefault = ''
                            this.inst.get(data.fieldid.toString()).setValue('')
                            this.removeorderdata(data)
                            removedataflag = true
                          }
                      }
                    }
                  }
                }
              }
            })
            // LA-I2767 Orderitem optimisation start
            // if(removedataflag){
            //   if(!this.rulescount && !this.formulacount){
            //     this.ordercalc()
            //     let unittypeid = ''
            //     this.forms[0].metaData.map((field:any)=>{
            //       if(field.fieldtypeid == 34){
            //         unittypeid = field.optiondefault
            //         }
            //     })
            //     if(this.oneditmode==false){
            //       let temp:any=Number(unittypeid)
            //       this.unittypefractionlist(-1,temp)
            //     }
            //   }
            //   if(this.rulescount && !this.formulacount){
            //     this.rulesvalue = 1
            //     this.rulesbaseprice()
            //   }
            //   if(!this.rulescount && this.formulacount){
            //     this.rulesvalue = 2
            //     this.rulesbaseprice()
            //   }
            //   if(this.rulescount && this.formulacount){
            //     this.rulesvalue = 1
            //     this.rulesbaseprice()
            //   }
            // }
            // LA-I2767 Orderitem optimisation end
            let removefieldarray = []
            for (const [key, value] of Object.entries(res[0].data.optionarray)) {
              removefieldarray.push(key)
              if(this.forms[0].metaData.filter(el => el.fieldid == key).length > 0){
                this.forms[0].metaData.filter(el => el.fieldid == key).map((data:any)=>{
                  let optionvaluearray:any = []
                  // let optdefault =''
                  optionvaluearray = value
                  data.optionsvalue = data.optionsbackup.filter(el => optionvaluearray.includes(el.optionid))
                  let optdefault =''
                  if(data.fieldtypeid == 2 || data.fieldtypeid == 3 || data.fieldtypeid == 5 || data.fieldtypeid == 19 || data.fieldtypeid == 20 || data.fieldtypeid == 21 || data.fieldtypeid == 33 || (data.fieldtypeid == 22 && data.issubfabric != 1)){
                    if(data.optiondefault){
                      optdefault = data.optiondefault
                      let splitdefault = data.optiondefault.split(',')
                      let defaultarray = data.optionsvalue.filter(el => data.optiondefault.split(',').includes(el.optionid.toString()))
                      let defaultids = []
                      let defaultnames = []
                      defaultarray.map((val:any)=>{ 
                        defaultids.push(val.optionid)
                        defaultnames.push(val.optionname)
                      })
                      data.optiondefault = defaultids.toString()
                      this.inst.get(data.fieldid.toString()).setValue(defaultnames.toString())
                      if(splitdefault.length != defaultids.length){
                        if(data.optionsvalue.length > 0){
                          let optionvaluefilter = data.optionsvalue.filter(el=>defaultids.includes(el.optionid))
                          if(data.subchild.length > 0){
                            var uniqueResultOne = data.subchild.filter(function(obj) {
                              return !optionvaluefilter.some(function(obj2) {
                                  return obj.forchildsubfieldlinkid == obj2.forchildfieldoptionlinkid
                              })
                            })
                            uniqueResultOne.map((removedata:any)=>{
                              data.subchild = data.subchild.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                              this.forms[0].metaData = this.forms[0].metaData.filter(el => el.forchildsubfieldlinkid != removedata.forchildsubfieldlinkid)
                              this.removeorderdata(removedata)
                            })
                          }
                        }
                      }
                    }
                  }
                  let optsplitarray = []
                  if(data.optiondefault){
                    optsplitarray = data.optiondefault.split(',')
                    optdefault = data.optiondefault
                  }
                  if(data.optionsvalue.filter(el =>optsplitarray.includes(el.optionid.toString())).length == 0){
                      data.optiondefault = ''
                      this.inst.get(data.fieldid.toString()).setValue('')
                      if(optdefault){
                        this.removeorderdata(data)
                      }
                  }
                })
              }
            }
            this.forms[0].metaData.filter(el => !removefieldarray.includes(el.fieldid.toString())).map(data=>{
              // if(data.fieldid !=0 && parentfield.fieldid != data.fieldid){
              if(data.fieldid !=0){
                if(data.fieldtypeid == 3){
                  data.optiondefault = ''
                  data.optionsvalue = []
                }
              }
            })
            if(this.singlemultipleflag == 'single'){
              this.enabledisableflag = false
            }
          }
          this.orderser.orderformeditflag = ''
          this.cd.markForCheck();
    })
    this.cd.markForCheck();
    // .catch((err : any) => {
    //   this.enabledisableflag = false;
    // });
  }
  onDeSelectAll(item:any){
    this.orderchangeflag = true
    this.orderstatusidarray = []
  }
  onItemSelect(item:any){
    this.orderchangeflag = true
    this.orderstatusidarray.push(item.id)
  }
  OnItemDeSelect(item:any){
    this.orderchangeflag = true
    this.orderstatusidarray.forEach((element,index)=>{
      if(element==item.id) {
        this.orderstatusidarray.splice(index,1)
      }
    })
  }
  sliderforms(){
    $('.middlecol ').toggleClass('righthiiden')
    $('.slidercontrol').toggleClass('sidecontroloverwrite')
  }
  orderformkeyvalidation(event,fieldname,index,field){
    if(event.keyCode == 32){
      this.supcomponentfn(event,fieldname,index,field)
      // setTimeout(()=>{
      //  let rows = document.querySelectorAll(".subMenu .ag-center-cols-container .ag-row");
      //  $(rows[0]).focus();
      // },1600)
    }
    $('.modal-backdrop.fade.show').hide()
  }
  ordergridkeyvalidation(event){
    if(event.keyCode == 13){
      this.exampleModalbk('enter')
    }
  } 

  closesoftFabricModal() {
    $('#materialPopupButton').focus()
    $('#materialsoftfurnishing-modal').modal('hide');  
   }
  backclose(){
    $('#exampleModalbk').modal('hide')
    let dynamicid = parseInt(this.ordertabindex)
    $('#subgrid' + dynamicid).focus()
  }
//pinned and unpinned data
  pinneddata(data,flag){
    if(flag == 'quote'){
      this.orderser.pinorderdata(data.fs_id,flag).subscribe(()=>{
        data.fs_displayonquoteformulas = 1
      })
    }
    if(flag == 'production'){
      this.orderser.pinorderdata(data.fs_id,flag).subscribe(()=>{
        data.fs_displayonproduction = 1
      })
    }
  }
  onFocus(args: any){
    this.dateClicked = true;
    let data:any = {...this.datePicker}
      data._results[0].open()
      data._results[0].element.nativeElement.focus()
   }
  unpinneddata(data,flag){
    if(flag == 'quote'){
      this.orderser.unpinorderdata(data.fs_id,flag).subscribe((res:any)=>{
        if(res.result){
          data.fs_displayonquoteformulas = 0
        }
      })
    }
    if(flag == 'production'){
      this.orderser.unpinorderdata(data.fs_id,flag).subscribe((res:any)=>{
        if(res.result){
          data.fs_displayonproduction = 0
        }
      })
    }
  }
  productionoverride(event,proid){
    this.orderchangeflag = true
    this.orderproductiondata.map((production:any)=>{
      if(production.fs_id == proid){
        production.productionoverrideeditflag = 1
      }
    })
    if(this.formulacount){
      this.rulesvalue = 2
      this.rulesbaseprice()
    }
  }
  imageStyle(prop:any){
    return {
      'pointer-events': prop?.ruleoverride==0 ? 'none': '',
      height: prop?.textfieldheight ? `${prop?.textfieldheight * 32}px`: '32px',
      // 'line-height': `${prop?.textfieldheight > 1 ? "20px" :"30px"}`
  };
}
  ////EDI FIELDS
  noSupplierbasedflag:boolean=true;
  isdualproduct:any=0;
  edishowhideField(prod:any){
    let compare:any;
      if(prod.fieldtypeid == 18){
        let show = this.forms[0]?.metaData?.filter(t=>t.fieldtypeid == 17)[0]?.fieldid;
        compare = prod.supplierid?.includes(this.inst['controls'][show]?.value);
      }
      else if(prod.fieldtypeid == 6){
        let show = this.forms[0]?.metaData?.filter(t=>t.fieldtypeid == 17)[0]?.fieldid;
        compare = prod.supplierid?.includes(this.inst['controls'][show]?.value);
      } else if(prod.fieldtypeid == 3){
        let show = this.forms[0]?.metaData?.filter(t=>t.fieldtypeid == 17)[0]?.fieldid;
        compare = prod.supplierid?.includes(this.inst['controls'][show]?.value);
        
        
      }else{
        compare = true;
      }
      this.cd.markForCheck();
      if(this.noSupplierbasedflag){
        if(compare || prod.supplierid == '0' || prod.supplierid == '')
        return true;
        else
        return false;
      }
      else{
        return true;
      }
  }
  // job order formula changes
  saveFormulaSubscription:any
  systemFields:any
  receipeId;
  editFormula(data,flag){
    if(data.fs_formula != "" && data.fs_formula != "0" && data.fs_formula != "noFormula"){
      this.popupService.disableformulaInptflag= data.fs_bom == 0 ? true : false;
      this.receipeId = data.fs_recipeid
      let res = {
        type: 'production',
        receipeId: data.fs_recipeid,
        ruleorformulaId: data.fs_id,
        product_id : this.selectedproductid,
        from : "job"
      };
      this.popupService.openFormulaModal(res);
    }
    // let res = {
    //   source : "jobPage"
    // }
    // this.productService.openExistingFormulaModal(res);
  }
  saveRule(data) {
    // let overrideValue;
    // if(data.override==true){
    //   overrideValue=1
    // }else{
    //   overrideValue=0
    // }
    let jsformula = '';
    let jsformulareplaced = '';
    let formuladata :any= '';
    if(data.rule){

      let formula = data.rule.toLowerCase();
      
      let checkbackslash = formula.includes('\n') ? "true" : "false";
      if(checkbackslash == 'true') formula = formula.replaceAll('\n', "");
      formuladata = formula;

      jsformula = toJavaScript(formula);
      let jobUnitType = this.productService.jobunittype.filter(el => el.default == 1)[0]?.name;
      this.fieldListObj = this.productService.formulaarray;
      let widthDrop = this.fieldListObj.fieldname.filter(item => ([11,12,7,9,8,10,31,32].includes(item.typeid)));
      widthDrop.forEach(item => {
        let withDropField = this.formatValidString(item.fieldname);
        let availableFieldRegEx = new RegExp("(\\b(" +withDropField+ ")\\b)",'gi');
        let unitTypeValue = this.getUnitTypeValue(jobUnitType);
        if(formula.match(availableFieldRegEx)) {
          formula = formula.replaceAll(availableFieldRegEx, `${withDropField}/${unitTypeValue}`);
        }
      });
      formula = this.formatFormula(formula,'rule');
      jsformulareplaced = toJavaScript(formula);
    }
    let value = {
      recipeid: this.receipeId,
      rulename: data.rulename,
      fieldid: data.field,
      formula: data.rule ? data.rule : '',
      jsformula: jsformula,
      jsformulareplaced: jsformulareplaced,
      mode: data.ruleorformulaId ? 'edit' : 'add',
      productid: this.route.snapshot.paramMap.get('id'),
      override:data.override ? 1 : 0,
      fieldname: this.productService.formulaarray.fieldname.length > 0 ? this.productService.formulaarray.fieldname : [],
      rulelist: this.productService.formulaarray.rulelist.length > 0 ? this.productService.formulaarray.rulelist : []
    };
    if (data.ruleorformulaId) Object.assign(value, {ruleid: data.ruleorformulaId});
    this.productService.saveRule(value).subscribe(async (res: any) => {
      this.popupService.notifyToCloseFormulaModal(true);
      this.toast.successToast(res.result);
      // this.getRulelist()
      this.page=1;
      await this.rulesbaseprice()
      this.orderCalculationFun()
      this.formulaCalculation()
      // this.gridApiRules.setServerSideDatasource(this.getDataSource())
    }, (err: HttpErrorResponse) => {
      if (err.status == 403) {
        this.toast.errorToast(err.error.message);
      }
    });
  }

  getUnitTypeValue(unit) {
    let unitName = unit.toLowerCase();
    let unitValue;
    switch (unitName) {
      case 'mm':
        unitValue = 1
        break;
      case 'cm':
        unitValue = 10
        break;
      case 'm':
        unitValue = 1000
        break;
     case 'inches':
        unitValue = 25.4
        break;
      case 'feet':
        unitValue = 304.8
        break;
      case 'yard':
        unitValue = 914.4
        break;
      default:
        unitValue = 1;
        break;
    }
    return unitValue;
  } 
  formatValidString(value: string) {
    return value.replace(/\s/g,'');
  }
  
  formatFormula(formula,ruleOrformula) {
    formula = formula.trim();
    if (!this.fieldListObj) {
        return;
    }
    if (ruleOrformula == "rule") {
        this.fieldListObj.rulelist.forEach(element => {
          let name = this.formatValidString(element.name);
          let formulaRegx = new RegExp("(\\b(" + name + ")\\b)",'gi');
            if (element.formula.trim()) {
                if (name && formula.match(formulaRegx) && !formula.includes(`\"${name}\"`) && !formula.includes(`'${name}'`)) {
                    formula = formula.replace(name, element.formula);
                }
            }
        });
        let found = this.checkFormulaExists(this.fieldListObj.rulelist, formula);
        if (found) {
            formula = this.formatFormula(formula,ruleOrformula);
        }
    } else {
        this.fieldListObj.formulaslist.forEach(element => {
            if (element.formula.trim()) {
                let name = this.formatValidString(element.name);
                let formulaRegx = new RegExp("(\\b(" + name + ")\\b)",'gi');
                if (name &&  formula.match(formulaRegx) && !formula.match(`\"${name}\"`) && !formula.match(`'${name}'`)) {
                    formula = formula.replace(name, element.formula);
                }
            }
        });
        let found = this.checkFormulaExists(this.fieldListObj.formulaslist, formula);
        if (found) {
            formula = this.formatFormula(formula,ruleOrformula);
        }
    }
    return formula;
  }
  checkFormulaExists(formulaslist, formula) {
    return formulaslist.some(a => {
      let name = this.formatValidString(a.name);
      let formulaRegx = new RegExp("(\\b(" + name + ")\\b)",'gi');
      return (name && formula.match(formulaRegx) && !formula.match(`\"${name}\"`) && !formula.match(`'${name}'`) && a.formula.trim())
    });
  }
  allowanceUnitConvation(formulaExpression, unitValue) {
    return formulaExpression.replace(/Alloutputunit\((.*?)\)/g, `Alloutputunit($1/${unitValue})`);
  }
  saveFormula(data) {
    let typevaluearray = []
    let formulatypearray = []
    if(this.productService.formularules.materialprice == 1) {
      formulatypearray.push({name: 'materialprice',default: 1},{name: 'quantity',default: 0})
      this.productService.quantityarray.map((value)=>{
         value.default = 0
      })
      typevaluearray = JSON.parse(JSON.stringify(this.productService.materialpricearray));
      typevaluearray.map((material:any)=>{
        this.productService.quantityarray.map((quantity:any)=>{
          if(!typevaluearray.some(item => item.name === quantity.name)){
            typevaluearray.push(quantity)
          }
        })
      })
    }
    else{
      formulatypearray.push({name: 'quantity',default: 1},{name: 'materialprice',default: 0})
      this.productService.materialpricearray.map((value)=>{
        value.default = 0
      })
      typevaluearray = JSON.parse(JSON.stringify(this.productService.quantityarray));
      typevaluearray.map((material:any)=>{
        this.productService.materialpricearray.map((quantity:any)=>{
          if(!typevaluearray.some(item => item.name === quantity.name)){
            typevaluearray.push(quantity)
          }
        })
      })
    }
    let jsformula = '';
    let jsformulareplaced = '';
    let formuladata :any= '';
    if(data.rule){
      let formula = data.rule;
      
      let checkbackslash = formula.includes('\n') ? "true" : "false";
      if(checkbackslash == 'true') formula = formula.replaceAll('\n', "");
      formuladata = formula;

      jsformula = toJavaScript(formula);
      let jobUnitType = this.productService.jobunittype.filter(el => el.id == this.productService.selectedUnitType)[0]?.name;
      this.fieldListObj = this.productService.formulaarray;
      let widthDrop = this.fieldListObj.fieldname.filter(item => ([11,12,7,9,8,10,31,32].includes(item.typeid)));
      widthDrop.forEach(item => {
        let withDropField = this.formatValidString(item.fieldname);
        let availableFieldRegEx = this.formulalanguageformat.getregexLanguageBased(withDropField);
        let custom_boundarymatches:any = this.formulalanguageformat.customWordBoundaryCheck(withDropField,formula,'match');
        let unitTypeValue = this.getUnitTypeValue(jobUnitType);
        if(formula.match(availableFieldRegEx) && (jobUnitType !== 'None' && jobUnitType !== 'Qty')) {
          formula = this.formulalanguageformat.customreplaceAll(withDropField,formula,custom_boundarymatches,availableFieldRegEx,`${withDropField}/${unitTypeValue}`);
        }
      });
      formula = this.formatFormula(formula,'formula');
      formula = this.allowanceUnitConvation(formula,this.getUnitTypeValue(jobUnitType))
      jsformulareplaced = toJavaScript(formula);
    }
    let value = {
      recipeid: this.receipeId,
      formulaname: data.rulename,
      fieldid: data.field,
      formula: formuladata,
      jsformula: jsformula,
      jsformulareplaced: jsformulareplaced,
      mode: data.ruleorformulaId ? 'edit' : 'add',
      productid: this.route.snapshot.paramMap.get('id'),
      fieldname: this.productService.formulaarray.fieldname.length > 0 ? this.productService.formulaarray.fieldname : [],
      systemfields: this.productService.formulaarray.systemfields.length > 0 ? this.systemFields : [],
      rulelist: this.productService.formulaarray.rulelist.length > 0 ? this.productService.formulaarray.rulelist : [],
      formulatype: formulatypearray,
      formulavalue: typevaluearray,
      unittype: this.productService.unittype.filter(el => el.default == 1)[0].id,
      jobunittype:this.productService.selectedUnitType,
      decimal_place: this.productService.selectedDecimal,
      fs_sectionid:this.productService.getSectionId
    };
    if (data.ruleorformulaId) Object.assign(value, {formulaid: data.ruleorformulaId})
    this.productService.saveFormula(value).subscribe(async (res: any) => {
      this.popupService.notifyToCloseFormulaModal(true);
      this.toast.successToast(res.result)
      await this.rulesbaseprice()
      this.orderCalculationFun()
    this.formulaCalculation()
      this.page=1;
      setTimeout(()=>{
        this.commonfilter.resetsearch()
      },100)
    },err => {
     this.toast.errorToast(err.error.message)
   })
  }
  formulaCalculation(){
    this.orderproductiondata = this.orderproductiondata.filter(obj => obj.fs_formula !== "noFormula").map(obj => {
      let newObj = { ...obj };
      if(newObj.fs_bom == 0){
        if(this.costpricecomesfrom == "2" && this.netpricecomesfrom=="2"){
        newObj.costPrice = 0
        newObj.sellingprice=0
        newObj.quantity = 0
        }else if(this.costpricecomesfrom=="2" && this.netpricecomesfrom=="1"){
        newObj.costPrice = 0
        newObj.quantity = 0
        }else if(this.costpricecomesfrom=="1" && this.netpricecomesfrom=="2"){
        newObj.sellingprice=0
        newObj.quantity = 0
        }
      }
      return newObj;
     })
    if(this.ordercalculationarray.length != 0){
      this.ordercalculationarray.forEach(element => {
        let index = this.orderproductiondata.findIndex(x => x.fs_variablename == element.name)
        if(index != undefined && index != "-1"){
          if( this.orderproductiondata[index].fs_formula == "" || this.orderproductiondata[index].fs_formula == "0" || this.orderproductiondata[index].fs_formula == "noFormula" || this.costpricecomesfrom == "2" || this.netpricecomesfrom=="2"){ 
             if( (this.costpricecomesfrom == "2") || (this.costpricecomesfrom == 3 && this.netpricecomesfrom == 3)){ // for price + price && shutter + shutter
              // if( this.orderproductiondata[index].fs_formula == "noFormula"  ){
              if( this.orderproductiondata[index].fs_bom != 1 ){
                let costPrice = this.orderproductiondata[index].costPrice? this.orderproductiondata[index].costPrice : 0
                let sellingprice =this.orderproductiondata[index].sellingprice?this.orderproductiondata[index].sellingprice:0
                let quantity = this.orderproductiondata[index].quantity ? this.orderproductiondata[index].quantity : 0
                  this.orderproductiondata[index].costPrice = parseFloat(costPrice) + parseFloat(element.costprice)
                  if(this.netpricecomesfrom=="2"){
                  this.orderproductiondata[index].sellingprice =parseFloat(sellingprice) +parseFloat(element.sellingprice)
                  }else{
                    this.orderproductiondata[index].sellingprice =parseFloat(sellingprice)
                  }
                  this.orderproductiondata[index].quantity = parseInt(quantity) + parseInt(element.quantity)
              }
              // }
              // else{
              //   this.orderproductiondata[index].costPrice = element.costprice;
              //   this.orderproductiondata[index].quantity = element.quantity;
              // }
              if( this.costpricecomesfrom == 3 ){
                this.orderproductiondata[index].fs_overidevalue = 0
              }
             }
             if((this.costpricecomesfrom == "1" && this.orderproductiondata[index].fs_formula != "" && this.orderproductiondata[index].fs_formula != "0" ) || this.costpricecomesfrom == "2" || (this.costpricecomesfrom=="1" && this.netpricecomesfrom=="2")|| this.costpricecomesfrom == "3"){
               this.orderproductiondata[index].fs_displayonproduction = 1;
               this.orderproductiondata[index].showhideflag = 1;
              
             }
             if(this.costpricecomesfrom=="1" && this.netpricecomesfrom=="2"){
              this.orderproductiondata[index].costPrice = this.orderproductiondata[index].costPrice ? this.orderproductiondata[index].costPrice : "-"
              this.orderproductiondata[index].pricevalue = this.orderproductiondata[index].pricevalue ? this.orderproductiondata[index].pricevalue : "-"
              this.orderproductiondata[index].sellingprice = element.sellingprice?parseFloat(element.sellingprice):"-"
             }
          } 
        } else {
          if(this.costpricecomesfrom == "2" || this.netpricecomesfrom=="2" || this.netpricecomesfrom=="5" || (this.costpricecomesfrom == 3 && this.netpricecomesfrom == 3)){
            element.sellingprice = this.netpricecomesfrom!=1? element.sellingprice : 0.00;
            let obj = {...element,
              costPrice : this.costpricecomesfrom!=1?element.costprice:0.00,
              quantity : element.quantity,
              fs_displayonproduction : 1,
              showhideflag : 1,
              fs_formula : "noFormula",
              fs_variablename : element.name,
              fs_overidevalue : 0
            }
            this.orderproductiondata.push(obj);
          }
        }
        
      });
    }else{
      this.orderproductiondata.forEach(element => {
          if(element.fs_formula == "noFormula"){
            element.fs_displayonproduction = 0
            element.showhideflag = 0
          }
      })
    }
    if(this.costpricecomesfrom == "1" ){ // hide empty formula line items for costpricecomesfrom == BOM
      this.orderproductiondata.forEach(x => {
        let index2 = this.ordercalculationarray.findIndex(element => element.name == x.fs_variablename)
        //  && index2 == -1  && x.pricevalue == "" 
      if( (x.fs_formula == "" || x.fs_formula == "0" || (x.costPrice == undefined) || index2 == -1) && x.fs_bom != 1 ){ // hide uncheck stock consuption, unchecked option in info for costpricecomesfrom == BOM
        // x.fs_displayonproduction = 0;
        // x.showhideflag = 0
      }else{
        // x.fs_displayonproduction = 1;
        // x.showhideflag = 1
      }
      if(x.fs_variablename == "Fabric Quantity" && x.pricecalvalue != ""){
        x.fs_displayonproduction = 1;
        x.showhideflag = 1
      }
      if(this.ordercalculationarray[index2]?.hasstock == 1){ // for extra with stock consumption enabled
        // x.fs_displayonproduction = 1
        // x.showhideflag = 1
        // x.costPrice = this.ordercalculationarray[index2].costprice
        // x.quantity = this.ordercalculationarray[index2].quantity
        x.costPrice = x.costPrice == undefined ? this.ordercalculationarray[index2].costprice : x.costPrice;
        x.quantity =  x.quantity == undefined ? x.pricevalue != "" ? x.pricevalue : this.ordercalculationarray[index2].quantity : x.quantity; 
      if(x.costPrice == undefined ) {
        x.fs_displayonproduction = 0
        x.showhideflag = 0
      }
    }
    })
    }
    // if(this.costpricecomesfrom == "2" && this.netpricecomesfrom == "2"){ // hide Fabric Quantity for Price + Price
    if(this.costpricecomesfrom == "2"&& this.netpricecomesfrom == "2"){ // hide Fabric Quantity for Price + Price
      let index = this.orderproductiondata.findIndex(x => x.fs_variablename == "Fabric Quantity");
      if( index != -1 ){
        this.orderproductiondata[index].fs_displayonproduction = 0;
        this.orderproductiondata[index].showhideflag = 0;
      }
    }
    // if(this.costpricecomesfrom == "2" && this.netpricecomesfrom == "2" ){ // hide extra cat line item for without rules for Price + Price
    if(this.costpricecomesfrom == "2" && this.netpricecomesfrom == "2"){ // hide extra cat line item for without rules for Price + Price
      this.orderproductiondata.forEach(element => {
        const existsInArray2 = this.ordercalculationarray.some(item2 => item2.name == element.fs_variablename);
          if (!existsInArray2 && element.fs_bom != 1 && element.fs_formula != "noFormula") {
            element.fs_displayonproduction = 0;
            element.showhideflag = 0;
          }
        });
      }
      // const seen = new Map();
      // this.orderproductiondata = this.orderproductiondata.filter((item) => {
      //   const value = item["fs_variablename"];
      //   if (!seen.has(value)) {
      //     seen.set(value, true);
      //     return true;
      //   }
      //   return false;
      // });
    this.productiontotalcost = 0.00;
    this.productiontotalcost = this.orderproductiondata.reduce((sum, obj) => {
      if ( obj.showhideflag == 1 && obj.fs_displayonproduction == 1 && obj.fs_bom != 1 ) {
            if(obj.costPrice != "-" && obj.costPrice != "" ){
              return sum +  parseFloat(obj.costPrice)
            } else {
              return sum
            }
       return  obj.quantity == undefined ? obj.pricevalue != "-" ? sum +  parseFloat(obj.pricevalue) : sum : sum + parseFloat(obj.quantity); 
       // && this.costpricecomesfrom == "1" 
      }else if(obj.showhideflag == 1 && obj.fs_displayonproduction == 1 && obj.fs_bom == 1 && obj.fs_costprice == 1){ // check costprice
        return sum +  parseFloat(obj.costPrice);
      }
      return sum;
    }, 0);
    this.productiontotalcost = this.productiontotalcost.toFixed(this.decimalvalue)
    this.materialList = this.orderproductiondata;
    this.materialList.sort((a, b) => (a.battenstype === 0 ? -1 : 1) - (b.battenstype === 0 ? -1 : 1));
    this.materialList = []
    this.materialList = this.orderproductiondata;
    if(this.priceupdate?.materials_cost_price_fabrics_or_shutters?.show_hide ){
      let pushObject = 
        {
          "fs_id": "",
          "fs_variablename": this.keepFlag?this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label :this.priceupdate.materials_cost_price_fabrics_or_shutters.label ,
          "fs_fieldid": '',
          "fs_formula": "",
          "fs_recipeid": '',
          'fs_sectionName':'Materials',
          "fs_bom": 1,
          "fs_formulatype": 1,
          "fs_displayonproduction": 1,
          "fs_displayonquoteformulas": '',
          "fs_overidevalue": 0,
          "fs_deductfromstock": '',
          "fs_costprice": 0,
          "fs_netprice": 0,
          "fs_unittype": '-',
          "productioneditedvalue": 0,
          "predefinedlables": [],
          "pricevalue": "-",
          "showhideflag": 1,
          "pricecalvalue": "",
          "unittype": "-",
          "productionoverrideeditflag": 0,
          "costPrice" :this.keepFlag?this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price: this.priceupdate.materials_cost_price_fabrics_or_shutters.cost_price,
          "sellingprice":(this.netpricecomesfrom=="2" || this.netpricecomesfrom == "3" )?this.priceupdate.pricegroupprice:
                        this.netpricecomesfrom =="5"?this.priceupdate.separate_sellingprice.toFixed(2):"-",
          "priceComesFormFlag":1
      }
      let addPriceTableCostSUm = this.keepFlag? parseFloat(this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price): parseFloat( this.priceupdate.materials_cost_price_fabrics_or_shutters.cost_price)+ parseFloat(this.productiontotalcost)
      this.productiontotalcost = addPriceTableCostSUm.toFixed(this.decimalvalue)
      let price_cost = this.materialList.filter(el => el.fs_variablename == "Price table cost")
      let shutter_cost = this.materialList.filter(el => el.fs_variablename == "Shutter cost")
      if(price_cost?.length>0){
          price_cost[0].fs_variablename = this.keepFlag? this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label: this.priceupdate.materials_cost_price_fabrics_or_shutters.label
          price_cost[0].costPrice =  this.keepFlag?this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price :this.priceupdate.materials_cost_price_fabrics_or_shutters.cost_price
          price_cost[0].sellingprice =  this.netpricecomesfrom=="2"?this.priceupdate.pricegroupprice.toFixed(2):
                                        this.netpricecomesfrom =="5"?this.priceupdate.separate_sellingprice.toFixed(2):"-",
          price_cost[0].showhideflag =  1
          price_cost[0].pricevalue =  "-"
          price_cost[0].unittype =  "-"
          // this.materialList = aaa
      }else if (shutter_cost?.length>0){
          shutter_cost[0].fs_variablename =  this.keepFlag?this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label :this.priceupdate.materials_cost_price_fabrics_or_shutters.label
          shutter_cost[0].costPrice = this.keepFlag? this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price :this.priceupdate.materials_cost_price_fabrics_or_shutters.cost_price
          shutter_cost[0].sellingprice = this.priceupdate.pricegroupprice,
          shutter_cost[0].showhideflag =  1
          shutter_cost[0].pricevalue =  "-"
          shutter_cost[0].unittype =  "-"
      }else{
        this.materialList.unshift(pushObject)
      }
    }
    if(!this.priceupdate?.materials_cost_price_fabrics_or_shutters?.show_hide && this.priceupdate?.old_materials_cost_price_fabrics_or_shutters?.show_hide && this.keepFlag){
      let pushObject = 
        {
          "fs_id": "",
          "fs_variablename":this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label ,
          "fs_fieldid": '',
          "fs_formula": "",
          "fs_recipeid": '',
          'fs_sectionName':'Materials',
          "fs_bom": 1,
          "fs_formulatype": 1,
          "fs_displayonproduction": 1,
          "fs_displayonquoteformulas": '',
          "fs_overidevalue": 0,
          "fs_deductfromstock": '',
          "fs_costprice": 0,
          "fs_netprice": 0,
          "fs_unittype": '-',
          "productioneditedvalue": 0,
          "predefinedlables": [],
          "pricevalue": "-",
          "showhideflag": 1,
          "pricecalvalue": "",
          "unittype": "-",
          "productionoverrideeditflag": 0,
          "costPrice" :this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price,
          "sellingprice" :(this.netpricecomesfrom=="2" || this.netpricecomesfrom == "3")?this.priceupdate.pricegroupprice:
                          this.netpricecomesfrom=="5"?this.priceupdate.separate_sellingprice:"-",
          "priceComesFormFlag":1
      }
      let addPriceTableCostSUm2 = parseFloat(this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price)+parseFloat(this.productiontotalcost)
      this.productiontotalcost = addPriceTableCostSUm2.toFixed(this.decimalvalue)
      let price_cost = this.materialList.filter(el => el.fs_variablename == "Price table cost")
      let shutter_cost = this.materialList.filter(el => el.fs_variablename == "Shutter cost")
      if(price_cost?.length>0){
          price_cost[0].fs_variablename =  this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label
          price_cost[0].costPrice =  this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price
          price_cost[0].sellingprice =  this.netpricecomesfrom=="2"?this.priceupdate.pricegroupprice.toFixed(2):
                                        this.netpricecomesfrom=="5"?this.priceupdate.separate_sellingprice.toFixed(2):"-",
          price_cost[0].showhideflag =  1
          price_cost[0].pricevalue =  "-"
          price_cost[0].unittype =  "-"
          // this.materialList = aaa
      }else if (shutter_cost?.length>0){
          shutter_cost[0].fs_variablename =  this.priceupdate.old_materials_cost_price_fabrics_or_shutters.label 
          shutter_cost[0].costPrice =  this.priceupdate.old_materials_cost_price_fabrics_or_shutters.cost_price 
          shutter_cost[0].sellingprice =  this.priceupdate.pricegroupprice, 
          shutter_cost[0].showhideflag =  1
          shutter_cost[0].pricevalue =  "-"
          shutter_cost[0].unittype =  "-"
      }else{
        this.materialList.unshift(pushObject)
      }
    }
     if(this.keepFlag){
      // this.orderpricecalculation.totalcost =  (parseFloat(this.productiontotalcost) + parseFloat(this.totalOperationCost)).toFixed(this.decimalvalue)
     }
         this.groupData();
  this.cd.markForCheck();
  }
  editOperation(data,action){
    if( !data.soft_delete ){
      var res = {
        mode: "edit",
        process_id : data.process_id,
        link_id :data.link_id,
        tabIndex : action == "calender" ? 1 : 0,
        product_id : data.product_id,
        source : "jobPage"
  
      } 
      this.productService.openExistingProcessModal(res);
    }
   
  }
  unlinkOperation(data,action){
      var sendData = {
        linkid : [data.link_id]
      }
      this.productService.delectProcess(sendData).subscribe((res:any)=>{  
        this.toast.successToast(res.message);
        this.ordercalc();
        this.orderser.productstatus(data.product_id).subscribe((res: any) => {
          this.productstatusarray = res.data.productionstatuslist
          this.prostatusselectarray = this.productstatusarray.filter(el => this.prostatusselectarray.includes(el.id.toString()))
          this.orderstatusidarray = this.prostatusselectarray;
          this.cd.markForCheck();
        })
      },err => {
      this.toast.errorToast(err.error.message);
    })
  }

  ////////Edit option/fabric (materials)  from job item
  option_fabric_onSelectionChanged(event: any, index = null) {
    // this.customer.contactservercheckbox$.next(1)
  }
  optionBodyScroll(event) {
    if (event.direction == "vertical" && event.top != 0) {
      this.optionFilterScrollFlag = true;
    }
  }
  option_fabric_onGridReadyOptions(params: any) {
    setTimeout(() => {
      this.option_fabric_gridapi = params.api;
      this.option_fabric_columnapi = params.columnApi;
      this.commonfilter.globalsearchfn()
      this.ngxModalService.checkGridReady.emit();
    }, 100);

  }
  createHyperLink(params): any {
    if (!params.data) { return; }
    const spanElement = document.createElement('span');
    spanElement.innerHTML = `<a href="${this.homeUrl}" style="color:var(--black);" class="cellhover"> ${params.value ? params.value : ''}  </a> `;
    spanElement.addEventListener('click', ($event) => {
      this.fabricoptionEditClick(params,'edit')
      $event.preventDefault();
    });
    return spanElement;
  }
  createHyperLinkFabric(params): any {
    if (!params.data) { return; }
    const spanElement = document.createElement('span');
    spanElement.innerHTML = `<a href="${this.homeUrl}" style="color:var(--black);" class="cellhover"> ${params.value ? params.value : ''}  </a> `;
    spanElement.addEventListener('click', ($event) => {
      this.fabricoptionEditClick_fabric(params,'edit')
      $event.preventDefault();
    });
    return spanElement;
  }
  addBattens(){
    this.addCustomeBattenFlag = true
    this.fabricoptionEditClick(null, "addBattens")
  }
  fabricoptionEditClick(params, e){
    this.commonapiService.productId=this.selectedproductid;
  this.popupService.fieldtypeid=this.option_fabric_editfielddata.fieldtypeid;
  this.popupService.fieldlevel=this.option_fabric_editfielddata.fieldlevel;
    let data:any = {
        fieldtype : this.option_fabric_editfielddata.fieldtypeid,
        optionid : e == 'edit' ? params.data.optionid : '',
        grouptypeid:'',
        pricegroupdata:'',
        fieldid : this.option_fabric_editfielddata.fieldid,
        level : this.option_fabric_editfielddata.fieldlevel,
        customtype : this.option_fabric_editfielddata.customtype,
      }
      if( e == "addBattens" ){
        data.jobid  = this.route.snapshot.paramMap.get('id')?this.route.snapshot.paramMap.get('id'):this.job_tempid;
        data.jobType = this.route.snapshot.paramMap.get('id')? "edit" :"add";
      }
      this.popupService.openOptionModal(data)
    // //}
  }
  fabricoptionEditClick_fabric(params, e){
    this.productapi.fabricId = params.data?.optionid;
    
    if(this.option_fabric_editfielddata.fieldtypeid == 22 && this.selectioncategory == 6){
      this.popupService.open_field_grid = true
      this.commonapiService.categoryId = this.selectioncategory
      this.popupService.field_id = this.option_fabric_editfielddata.fieldid
      this.popupService.linkedPriceGroupId = this.option_fabric_editfielddata.linktopricegroup
    }
    this.commonapiService.productId=this.selectedproductid;
    this.commonapiService.materialType=this.option_fabric_editfielddata.fieldtypeid;
  this.popupService.fieldtypeid=this.option_fabric_editfielddata.fieldtypeid;
  this.popupService.fieldlevel=this.option_fabric_editfielddata.fieldlevel;
  if(this.option_fabric_editfielddata.fieldtypeid == '21'){
    if(this.option_fabric_editfielddata.fabricorcolor == '2'){
      this.forms[0].metaData.map((field:any)=>{
        if(this.fabricIds.includes(field.fieldtypeid)){
          if(field.fieldtypeid != 20){
            if(field.fieldlevel == 1){
              let fabricoptionid = field.optiondefault
              this.productapi.fabricId = fabricoptionid;
            }
          }
        }
      })
      let data = {
        id: e == 'edit' ? params.data?.optionid : '',
        materialtype: this.option_fabric_editfielddata.fieldtypeid,
        productId: this.selectedproductid,
        pricecomesFrom: '',
        prices: '',
        materialProductFlag:true,
        colorAddFlagFormSetup:'color'
      }
      this.popupService.openFabricModal(data);
    }else{
      let data = {
        id: e == 'edit' ? params.data?.optionid : '',
        materialtype: this.option_fabric_editfielddata.fieldtypeid,
        productId: this.selectedproductid,
        pricecomesFrom: '',
        prices: '',
        materialProductFlag:true,
        parentLevel:1
      }
      this.popupService.openFabricModal(data);
      this.commonapiService.formSetFabricColorFlag = true
    }
  }else if(this.option_fabric_editfielddata.fieldtypeid == '20' || this.option_fabric_editfielddata.fabricorcolor == '2'){
    this.forms[0].metaData.map((field:any)=>{
      if(this.fabricIds.includes(field.fieldtypeid)){
        if(field.fieldtypeid != 20){
          if(field.fieldlevel == 1){
            let fabricoptionid = field.optiondefault?field?.optiondefault:params?.data?.fabricmapid
            this.productapi.fabricId = fabricoptionid;
          }
        }
      }
    })
    let data = {
      id: e == 'edit' ? params.data?.optionid : '',
      materialtype: this.option_fabric_editfielddata.fieldtypeid,
      productId: this.selectedproductid,
      pricecomesFrom: '',
      prices: '',
      materialProductFlag:true,
      colorAddFlagFormSetup:'color'
    }
    this.popupService.openFabricModal(data);
  }
  else{

    // let data = {
    //     fieldtype : this.option_fabric_editfielddata.fieldtypeid,
    //     optionid : params.data.optionid,
    //     grouptypeid:'',
    //     pricegroupdata:'',
    //     fieldid : this.option_fabric_editfielddata.fieldid,
    //     level : this.option_fabric_editfielddata.fieldlevel,
    //     customtype : this.option_fabric_editfielddata.customtype,
    //   }
      let data = {
        id: e == 'edit' ? params.data?.optionid : '',
        materialtype: this.option_fabric_editfielddata.fieldtypeid,
        productId: this.selectedproductid,
        // pricecomesFrom: this.productgroup.pricecomesFrom
      }
      this.popupService.openFabricModal(data)
  }
    // //}
  }
  vatvaluechange(){
    this.saveFlag = false;
    // this.ordercalc()
    this.rulesvalue = 2
    this.colorrulesbaseprice()
  }
  fullpreview:boolean=true;
  openGalleryImageModel(par:any){
    // if(this.imageForProColOpt?.optionsimages?.length){
      this.ngxModalService.openModal(this.galleryImageModal, 'galleryImageModal', 'modal-lg');
      setTimeout(() => {
        $('.fulpreview').css('background-image', 'url(' + '"' + this.backgroundimageurl + '"' + ')');  
      }, 500);
    // }
  }
  openSingleImageModel(i){
    if ($('[id=singleImagePopup]').length > 1) {
      $('body > #singleImagePopup').remove();
    }
    $('#singleImagePopup').appendTo("body").modal('show') 

    $(".caro-img").removeClass("active");
    $(`#img_id_${i.optionid}`).addClass('active')
  }

  resetImageForProColOpt(){    
    this.imageForProColOpt = {
      productimage : '',
      fabricimage : '',
      optionsimages :  [],
      splitoptionsimages : []
    }
    this.searchTerm="";
    this.closeModal(true);
    this.saveCopySelected.emit(false);  
    this.selectproduct_typeiddual=[];
    this.ruleModeOpt = false;
    this.save_copy = false;
  }
  toggleActiveToCarouselPreview(e,type){
    if(type == 'over'){
      clearTimeout(this.hoverTimeout);
      // if(e?.flagcolor == '1'){
      //   $("#prod_colorimg").attr("src",`${this.envImageUrl + e.optionimage}`);
      // }else{
        $('.prdimg').css('background-image', 'url(' + '"' + this.envImageUrl + e.optionimage + '"' + ')');
        $(`#myCarousel #carousel-preview-${e.slideindex}`).addClass('active');
        // $('#prodbackurl').removeClass('d-block')
        // $('#prodbackurl').addClass('d-none')
        $('#pro_color_image').removeClass('d-block')
        $('#pro_color_image').addClass('d-none')
        // this.fullpreview = false;
      // }
    }
    else if(type == 'leave'){
      this.showImg = false;
      // if(e?.flagcolor == '1'){
      //   $("#prod_colorimg").attr("src",`${this.orderimageurl ?? this.frameimageurl}`);
      // }else{
        $('.prdimg').css('background-image', 'url(' + '"' + this.backgroundimageurl + '"' + ')');
        this.hoverTimeout = setTimeout(() => {
          if (!$('#myCarousel:hover').length) {
            $('.prdimg').css('background-image', `url('${this.backgroundimageurl}')`);
          }
        }, 50);
        $(`#myCarousel .carousel-item`).removeClass('active');
        // $('#prodbackurl').removeClass('d-none')
        // $('#prodbackurl').addClass('d-block')
        $('#pro_color_image').removeClass('d-none')
        $('#pro_color_image').addClass('d-block')
      // }
    }
  }

  carouselArrow(event,type){
    event.stopPropagation();
    event.preventDefault()

    $("#carousel-thumbs").carousel(type);
  }

  setCarouselImage(optionimagearr){
    if(optionimagearr?.length){
      const uniqueArr = optionimagearr.filter((obj, index) => {
        return index === optionimagearr.findIndex(o => obj.optionid === o.optionid) && obj.optionimage;
      });
      if(this.orderimageurl === 'assets/noimage.png'){
        this.orderimageurl = uniqueArr[0].optionimage?this.envImageUrl+uniqueArr[0].optionimage :'assets/noimage.png';
      }
      if(this.imageForProColOpt?.optionsimages?.length){
        uniqueArr.forEach((oi) => {
          let checkExist = this.imageForProColOpt.optionsimages.find((e) => e.optionid == oi.optionid)
          if(!checkExist){
            if(this.forms[0].metaData[this.selectedcompindex].fabricorcolor == '2'){
              let flagdata = oi;
              flagdata['flagcolor']=1;
              this.colorimageurl = this.envImageUrl + oi.optionimage + "?nocache=" + this.timestamp;
              this.imageForProColOpt.optionsimages.push(oi)
            }
            else{
            this.imageForProColOpt.optionsimages.push(oi)
            }
          }
        })
      }
      else{
        if(this.forms[0].metaData[this.selectedcompindex].fabricorcolor == '2'){
          uniqueArr.forEach((oi) => {
            let flagdata = oi;
            flagdata['flagcolor']=1;
            this.colorimageurl = this.envImageUrl + oi.optionimage + "?nocache=" + this.timestamp;
            this.imageForProColOpt.optionsimages.push(flagdata)
          })
        }else{
        this.imageForProColOpt.optionsimages = uniqueArr
        }
      }
      optionimagearr.map((res:any)=>{
        if(res.flagcolor == '1'){
              this.colorimageurl = this.envImageUrl + res.optionimage + "?nocache=" + this.timestamp;
            }
        })
      this.setCarouselSplitImg()   
    }
    else{
      this.imageForProColOpt?.optionsimages.map((res:any)=>{
        if(res.flagcolor == '1'){
          this.colorimageurl = this.envImageUrl + res.optionimage + "?nocache=" + this.timestamp;
        }
      })
      // this.imageForProColOpt.optionsimages = []
      // this.imageForProColOpt.splitoptionsimages = []
    }
  }

  removeCompImg(remove){
    if(remove?.optionsvalue?.length){
      remove.optionsvalue.forEach((rem) => {
        const findInd = this.imageForProColOpt.optionsimages.findIndex((oind) => oind.optionid == rem.optionid)
        if(findInd != -1){
          let newImgArr = this.imageForProColOpt.optionsimages.slice(findInd);
          this.imageForProColOpt.optionsimages.splice(findInd, 1);
          if (newImgArr[0].flagcolor === 1) {
            this.colorimageurl = '';
          }
        }
      })
      this.setCarouselSplitImg()
    }
    this.cd.markForCheck();
  }

  setCarouselSplitImg(){
    if(this.imageForProColOpt?.optionsimages?.length){
      let chunkSize:any = 6;
      // this.imageForProColOpt?.optionsimages.map((res:any)=>{
      //   if(res.flagcolor == '1'){
      //     this.colorimageurl = this.envImageUrl + res.optionimage + "?nocache=" + this.timestamp;
      //   }
      // })
      this.imageForProColOpt.splitoptionsimages = []
      let slideind = 0;
      let clonedeep = cloneDeep(this.imageForProColOpt.optionsimages);
      let clonetestdata = clonedeep.filter((res:any)=>  res?.flagcolor != '1');

      for (let i = 0; i < clonedeep?.length; i += chunkSize) {
          let slicearr = clonedeep?.slice(i, i + chunkSize);
          slicearr.forEach((sa) => { 
            sa.slideindex = slideind
            slideind++
          })
          this.imageForProColOpt.splitoptionsimages.push(slicearr);
      }   
  }
    else{
      this.imageForProColOpt.optionsimages = []
      this.imageForProColOpt.splitoptionsimages = []
    }
  }
  priceTableArrayList:any = [];
  orderSupplierChange(ev:any){
    let postdata = {
      productid: this.selectedproductid,
      supplierid: ev
    };
    this.orderser.supplierbasedpricegroup(postdata).subscribe((res:any)=>{
      this.priceTableArrayList = res[0].data;
    })
  }

  selectColor(prop): boolean {
    return (this.inst['controls'][prop.fieldid]?.value !== null && this.inst['controls'][prop.fieldid]?.value !== '');
  }
  selectWidth_DropColor(prop): boolean {
    return (prop !== null && prop !== '' && prop != '0');
  }
  // costpriceChange(evt){
  //   this.orderpricecalculation.totalcost = evt.target.value;
  // }
  overridePriceOptionHover(eve) {
    // $("#dropdownMenuLink").dropdown('hide')
    // $("#dropdownMenuLink1").dropdown('hide')
    // $("#dropdownMenuLink2").dropdown('hide')            

    // this.endreportsearchText = $('#endselectReportdropcustom').val();
    eve.stopPropagation();
    this.isDropdown = !this.isDropdown;       
  }
  overridepriceMouseLeave(){
    $("#dropdownMenuLink_orderform_one").dropdown('hide') 
  }

  checkStockAvailability(array){
    if(this.forms?.[0]?.metaData?.length){
      this.forms?.[0]?.metaData.forEach((field) => {
        field['stock_not_available_err'] = false
        field['stock_not_available_name_array'] = []
      })
    }
    
    array.forEach((element:any) => {
        const fields = element?.optionfieldids.split(',')
        if(fields?.length){
          fields.forEach(fld => {
            if(this.forms?.[0]?.metaData?.length){
              const ind = this.forms?.[0]?.metaData.findIndex((f) => f.fieldid == fld)
              if(ind != -1){
                this.forms[0].metaData[ind]['stock_not_available_err'] = element.stockexist == 0 ? true : false
                if(element.stockexist == 0){
                  if(this.forms?.[0]?.metaData?.[ind]?.['stock_not_available_name_array']?.length){
                     if(!this.forms[0].metaData[ind]['stock_not_available_name_array'].includes(element.optionname)){
                      this.forms[0].metaData[ind]['stock_not_available_name_array'].push(element.optionname)
                     }
                  } else {
                    this.forms[0].metaData[ind]['stock_not_available_name_array'] = [element.optionname]
                  }
                }
              }
            }
          });
        }
    });
  }
  blockKeyboardEvents(event: KeyboardEvent) {
    if(this.disableFields){
      event.preventDefault();
    }
  } 
  saveImage(orderid:any): void {
    const element = document.querySelector('.bgImgDiv') as HTMLElement
    if (!element) { return }
    html2canvas(element, { scale: 1.5, useCORS: true }).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData()
          formData.append('image', blob, new Date().getTime() + '.png')
          formData.forEach((value, key) => {})
          this.orderser.saveProductImage('upload-image/'+ orderid,formData).subscribe((res: any) => {
            this.saveorderflag = false
            this.ngxModalService.closeModal('globalProductModal')
             this.removePanel()
          },(error: any) => {
            this.saveorderflag = false
            this.ngxModalService.closeModal('globalProductModal')
             this.removePanel()
          })
        }
      }, 'image/png', 0.8)
    })
  }
  scrollRight() {
    const items:any =  (document.getElementById('scrollcarousel') as HTMLElement).querySelectorAll('.item') 
    if (this.currentIndex < items.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; 
    }
    this.updateCarousel();
  }

  scrollLeft() {
    const items:any =  (document.getElementById('scrollcarousel') as HTMLElement).querySelectorAll('.item')
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = items.length - 1;
    }
    this.updateCarousel();
  }

  updateCarousel() {
    const items:any =  (document.getElementById('scrollcarousel') as HTMLElement).querySelectorAll('.item')
    const offset = -this.currentIndex * 100;
    items.forEach((item: HTMLElement) => {
      item.style.transform = `translateX(${offset}%)`;
    });
  }

  breakLines(data) {
    return data.replace(/\n/g, '<br>');
  } 
  closeModal = (isFromResetFn?) => {
    if (!isFromResetFn) {
      this.globaleditPopup = false;
    }
    this.ngxModalService.closeModal('globalProductModal');
    this.removePanel()
  }
  fabricModalClose = () => {
    this.option_fabric_indexflag = false;
    this.ngxModalService.closeModal('fabricEditModal');
  }
  setModalProperties = () => {
    const modal = document.getElementsByTagName('modal-container')[0];
    if (modal) {
      modal.classList?.add('modaloverwrite');
      modal.setAttribute('id', 'sampleModal');
    }
  }
  //Based on LA-I1921 case requirement here we split datas by its sections and show it in a job page production tab
  groupData() {
    this.groupedData = {};
    this.sectionTotalCost = {};
    this.sectionTotalSelling = {};
    this.orderproductiondata.reduce((sum, obj) => {
      if (obj.showhideflag == 1 && obj.fs_displayonproduction == 1) {
        let sectionName = obj.fs_sectionName ? obj.fs_sectionName : "Materials";
        if (!this.groupedData[sectionName]) {
          this.groupedData[sectionName] = [];
          this.sectionTotalCost[sectionName] = 0.00;
          this.sectionTotalSelling[sectionName] = 0.00;
        }
        this.groupedData[sectionName].push(obj);
        let costTotal = 0;
        if (obj.fs_bom != 1) {
          if (obj.costPrice != "-" && obj.costPrice != "") {
            costTotal += parseFloat(obj.costPrice);
          } 
        } else if (obj.fs_bom == 1 && obj.fs_costprice == 1 && obj.costPrice != "-" && obj.costPrice != "") {
          costTotal += parseFloat(obj.costPrice);
        } else if (obj.fs_bom ==1 && (obj.fs_variablename == 'Price table cost' || obj.fs_variablename == 'Shutter cost') && obj.costPrice != "-" && obj.costPrice != ""){
          costTotal += parseFloat(obj.costPrice);
        }  
        let sellingTotal = 0;
        if (obj.fs_bom != 1) {
          if (obj.sellingprice != "-" && obj.sellingprice != "") {
            sellingTotal += parseFloat(obj.sellingprice);
          }
        } else if (obj.fs_bom == 1 && obj.fs_netprice == 1) {
          sellingTotal += parseFloat(obj.sellingprice);
        } else if (obj.fs_bom ==1 && obj.sellingprice != "" && (obj.fs_variablename == 'Price table cost' || obj.fs_variablename == 'Shutter cost') && obj.sellingprice != "-"){
          sellingTotal += parseFloat(obj.sellingprice);
        } 
        let getSectionTotalCost = parseFloat(this.sectionTotalCost[sectionName])+ costTotal      
        this.sectionTotalCost[sectionName] =(getSectionTotalCost).toFixed(2)
        let getSectionTotalSelling=parseFloat(this.sectionTotalSelling[sectionName])+ sellingTotal
        this.sectionTotalSelling[sectionName] =(getSectionTotalSelling).toFixed(2);
      }
      return sum;
    }, 0);
  }
  getSectionIds(): string[] {
    return Object.keys(this.groupedData);
  }
//LA-I1921 case code ends here
/**
 * location shown based on the input given.
 * @author Kotteeshwaran
 * @case LA-I1803
 * @param value 
 * @param optionsvalue 
 * @param field 
 */
  onLocationSearchChange(value: any, optionsvalue: any, field: any) {
    this.isDropdownOpen = this.searchTerm !== "";
    if (this.listOfLocationsClone.length > 0) {
      this.listOfLocations = [...this.listOfLocationsClone]
    }
    if (optionsvalue.length > 0) {
      this.listOfLocationsClone = [...this.listOfLocations];
      if (this.searchTerm == "") {
        this.listOfLocations = [...this.listOfLocationsClone];
      }
      else {
        this.listOfLocations = this.listOfLocationsClone.filter(item => item.optionname.toLowerCase().includes(this.searchTerm.toLowerCase()));
        if (this.listOfLocations.some(loc => loc.optionname.toLowerCase() === this.searchTerm.toLowerCase())) {
          field.userinputlocation = this.searchTerm;
          field.optiondefault = this.listOfLocations[0].optionid;
        } else {
          field.userinputlocation = this.searchTerm;
          field.optiondefault = "";
        }
      }
    }
  }


 // Used to open & pass values to the 'Add new location' popup component.
  fnAddSource(fieldId:number) {
    this.locationPopupSetup.fieldflag = 'location';
    this.locationPopupSetup.modalTitleValue = 'Global locations'; 
    this.locationPopupSetup.locationId = this.locationId;
    this.locationPopupSetup.dynamicCompFlag = true;       
    this.locationPopupSetup.isLocation = true;
    this.locationPopupSetup.selectedproductid = this.selectedproductid;
    this.locationPopupSetup.listOfLocations = this.listOfLocations;
    this.locationPopupSetup.fieldId = fieldId;
    this.locationPopupSetup.productId = this.productId;
    this.locationPopupSetup.appoinmentstatus(true);
  }

  /** 
   * LocationList value changes based on the add,edit or delete from the child component.
   * only for ADD:
        * The new location obj is pushed in the original arr based on the addSelected flag. 
  */
  newLocChanges(value: any) {
    this.listOfLocations = [...value];
    if (this.locationPopupSetup.addSelected) {
      for (let i = 0; i < this.forms[0].metaData.length; i++) {
        let data = this.forms[0].metaData[i];
        if (data.fieldtypeid === 4) {
          this.listOfLocations.map(x => {
            if (!data.optionsvalue.some(y=>y.optionid === x.optionid)) {
              data.optionsvalue.push(x);
            }
          });
          return;
        }
      }
    }
  }
  // new tab flow start
  private searchSubject = new Subject<string>();
  public comboCurrentIndex;
  public loadingIndex:number
  public onOpenPanel:boolean = false
  public currentFiledID;
  loadcomboGrid(render?,mainIndex?){
    $(document).ready(() =>
      {  
    if(this.firstLoad && this.onllineaftersubmitordereditflag && !this.disableFields){
        this.firstLoad = false
        this.enabledisableflag = false
        let getIndex = !this.onlineflag ? this.forms[0].metaData.findIndex(x => x.showfieldonjob && x.ruleoverride != 0) : this.forms[0].metaData.findIndex(x => x.showFieldOnCustomerPortal && x.ruleoverride != 0)
        let fieldType = this.forms[0].metaData[getIndex].fieldtypeid;
        let isComboField = [2, 5, 19, 20, 21, 22,33].includes(fieldType) || (fieldType === 3 && this.edishowhideField(this.forms[0].metaData[getIndex]));
        if(isComboField){
          setTimeout(() => {
            $('#comboGrid'+this.forms[0].metaData[getIndex].fieldid).focus()
          }, 200);
        }else{
          setTimeout(() => {
            $('#subgrid'+getIndex).focus()
          }, 200);
        }
        this.oneditmode = true
      }
      this.cd.markForCheck();
    })
    this.cd.markForCheck();
  }

  loadComboGridData(response,index,obj?){
    let result:any = {}
    let getSelection = $('#comboGrid'+index).combogrid('grid').datagrid('getSelections')
    result = {
      total : response[0].totalrows,
      rows: this.mergeUniqueArrays(getSelection,response[0].data[0]?.optionsvalue)
    }
    this.selectedoption = []
    this.selectedoption = getSelection
      if(obj?.gridGSearch == undefined){
        if(obj?.action == "scroll"){
          if( response[0].data.length != 0  ){
            if( response[0].data[0]?.optionsvalue?.length != 0 ){
               let selectedText = $('#comboGrid'+index).combogrid('getText');
              const getData = $('#comboGrid'+index).combogrid('grid').datagrid('getData')
              const laseIndex = getData.rows.length - 1
              getData.rows = getData.rows.concat(response[0].data[0]?.optionsvalue)
              $('#comboGrid'+index).combogrid('grid').datagrid('loadData', getData);
              $('#comboGrid'+index).combogrid('setText', selectedText);
              $('#comboGrid' + index).combogrid('grid').datagrid('highlightRow', laseIndex);
              // response[0].data[0].optionsvalue.forEach(element => {
              //   $('#comboGrid'+index).combogrid('grid').datagrid('appendRow',element)
              // });
            }
          }
        }else{
          if( response[0].data.length != 0  ){
            if ($('#comboGrid' + index).data('filter')) {
              let selectedText = $('#comboGrid'+index).combogrid('getText');
              $('#comboGrid'+index).combogrid('grid').datagrid('loadData', result);
              $('#comboGrid'+index).combogrid('setText', selectedText);
              $('#comboGrid'+index).combogrid('grid').datagrid('highlightRow', 0);
            }else{
              const selectedText = $('#comboGrid'+index).combogrid('getText');
              $('#comboGrid'+index).combogrid('grid').datagrid('loadData', result);
              let selcetvalue = response[0].data[0].combogriddata ? response[0].data[0].combogriddata.split(",") : []
              if(((this.combofabricIds.includes(response[0].data[0].fieldtypeid) && response[0].data[0].fabricorcolor == 1) || (this.combocolorIds.includes(response[0].data[0].fieldtypeid) && response[0].data[0].fabricorcolor == 2)) && selcetvalue.length > 0 ){
                  selcetvalue =  response[0].data[0].optionsvalue.filter(x => x.optionid == selcetvalue[0])[0].optionid_pricegroupid
              }
              // let selcetvalue = response[0].data[0].optiondefault ? response[0].data[0].optiondefault.split(",") : response[0].data[0].combogriddata ? response[0].data[0].combogriddata.split(",") : []
              $('#comboGrid'+index).combogrid('setValues', selcetvalue); 
              if( response[0].data[0].fieldtypeid == "33" ){
                let  number = response[0].data[0].combogriddata ? response[0].data[0].combogriddata.split(",").length : ""
                setTimeout(() => {
                  $('#comboGrid'+index).combogrid('setText', number ? `${number} Selected` : "");
                }, 100);
               }
               $('#comboGrid'+index).combogrid('setText', selectedText);
              $('#comboGrid'+index).combogrid('grid').datagrid('highlightRow', 0);
            }
          }else{
            if ($('#comboGrid' + index).data('filter')) {
              let selectedText = $('#comboGrid'+index).combogrid('getText');
              $('#comboGrid'+index).combogrid('grid').datagrid('loadData', result);
              $('#comboGrid'+index).combogrid('grid').datagrid('highlightRow', 0);
              $('#comboGrid'+index).combogrid('setText', selectedText);

            }else{
              let selectedText = $('#comboGrid'+index).combogrid('getText');
              $('#comboGrid'+index).combogrid('grid').datagrid('loadData', [])
              $('#comboGrid'+index).combogrid('setText',selectedText);
            }
          }
        }
        this.panelLoader("remove",index)
      }
 }
 loadFormValue(index?){

  let isComboField
  if(index){
    let res = this.forms[0].metaData[index]
    let selcetvalue = res.combogriddata ? res.combogriddata.split(",") : res.combogriddata ? res.optiondefault.split(",") : []
    $('#comboGrid'+index).combogrid('setValues', selcetvalue); 
  }else{
      this.forms[0].metaData.forEach((res,index) => {
        isComboField = [2, 5, 19, 20, 21, 22,33].includes(res.fieldtypeid) || (res.fieldtypeid === 3 && this.edishowhideField(this.forms[0].metaData[index]));
            if(isComboField){
             // setTimeout(() => {
             let selcetvalue = res.combogriddata ? res.combogriddata.split(",") : res.optiondefault ? res.optiondefault.split(",") : []
              if($('#comboGrid'+res.fieldid).data('combogrid')){
                 if(( this.combofabricIds.includes(res.fieldtypeid) &&  res.fabricorcolor == 1) || ( this.combocolorIds.includes(res.fieldtypeid) &&  res.fabricorcolor == 2 ) ){
                  selcetvalue =  res.optiondefault ? res.pricegrpid ?  [res.optiondefault+"_"+res.pricegrpid] : res.optionsvalue.filter(x => x.optionid == selcetvalue[0])[0].optionid_pricegroupid : []
                  // selcetvalue = res.optiondefault && res.pricegrpid ? [res.optiondefault+"_"+res.pricegrpid] : [] // LA-I3383
                }
                 $('#comboGrid'+res.fieldid).combogrid('grid').datagrid('loadData', res.optionsvalue);
                 $('#comboGrid'+res.fieldid).combogrid('setValues', selcetvalue); 
                 if(selcetvalue.length == 0 ){
                   $('#comboGrid'+res.fieldid).combogrid('setText', "");
                 }
             //  }, 200);
           }else{
            let defaultarray = res.optionsvalue.filter(el => selcetvalue.includes(el.optionid.toString())).map(x => x.optionname)
            this.inst.get(res.fieldid.toString()).setValue(defaultarray.length != 0 ? defaultarray.toString() : "");
           }
          }
     });
    
  }
  
 }
 mergeUniqueArrays(selectedArray, optionArray) {
  const map = new Map();
    if(selectedArray.length > 0){
    for (const obj of selectedArray) {
       const key = `${obj.optionid}_${obj.pricegroupid}`;
        if (!map.has(key)) {
            map.set(key, obj);
        }
    }
  }
  if(optionArray){
    for (const obj of optionArray) {
      const key = `${obj.optionid}_${obj.pricegroupid}`;
      // if (!map.has(obj.optionid)) {
          map.set(key, obj);
      // }
    }
  }
  return Array.from(map.values());
}
pageCount = 1
hasNextPage = true
 getServerData(index: any, flag: any, rulesarray, filterData?){
  this.isLoadingorderitem = true
        let edata: any = {
          gridsearch: {}
        }
        edata.filterids = []
         edata.orderitemselectedvalues = this.getallselectedvalues() 
        edata.optionqtys = this.optionqtyarray
        let params
        if (this.forms[0].metaData[index].fieldtypeid == 3) {
          if (Object.keys(this.filterbasearray.option).length > 0) {
            for (const [key, value] of Object.entries(this.filterbasearray.option)) {
              let optionarray = []
              optionarray.push(this.forms[0].metaData[index])
              if (optionarray.filter(el => el.fieldid == key).length > 0) {
                edata.filterids = value
              }
            }
          }
        } else if (this.forms[0].metaData[index].fieldtypeid == 2) {
          if (Object.keys(this.filterbasearray.option).length > 0) {
            for (const [key, value] of Object.entries(this.filterbasearray.option)) {
              let optionarray = []
              optionarray.push(this.forms[0].metaData[index])
              if (optionarray.filter(el => el.fieldid == key).length > 0) {
                edata.filterids = value
              }
            }
          }
        } else if (this.forms[0].metaData[index].fieldtypeid == 33) {
          edata.battenslength = this.battanLength
          edata.customerid = this.productser.customerid ? parseInt(this.productser.customerid) : parseInt(this.productser.existingcusID)
          if (this.route.snapshot.paramMap.get('id')) {
            edata.jobid = this.route.snapshot.paramMap.get('id')
          } else {
            edata.jobtempid = this.job_tempid
          }
        }
        else {
          if (this.fabricIds.includes(this.forms[0].metaData[index].fieldtypeid)) {
            if (this.forms[0].metaData[index].fieldtypeid == 20) {
              if (this.filterbasearray.color.length > 0) {
                this.filterbasearray.color.map((color: any) => {
                  edata.filterids.push(color)
                })
              }
            }
            else{
              if(this.forms[0].metaData[index].fieldlevel == 2){ 
                if(this.category != 6){
                if(this.forms[0].metaData[index].dualseq !=2){
                if(this.filterbasearray.color.length > 0){
                  this.filterbasearray.color.map((color:any)=>{
                    edata.filterids.push(color)
                  })
                }
                if (this.forms[0].metaData[index].dualseq == 2) { ////for dual fabric and color
                  if (this.filterbasearray.colordual.length > 0) {
                    this.filterbasearray.colordual.map((color: any) => {
                      edata.filterids.push(color)
                    })
                  }
                }
              }
            }else{
              if(this.forms[0].metaData[index].multiseq <= 1){
                if(this.filterbasearray.color.length > 0){
                  this.filterbasearray.color.map((color:any)=>{
                    edata.filterids.push(color)
                  })
                }
              }
              if(this.forms[0].metaData[index].multiseq >1){ ////for multicurtain and color
                if(this.filterbasearray.colordual.length > 0){
                  this.filterbasearray.colordual.map((color:any)=>{
                    if(color.multiseq == this.forms[0].metaData[index].multiseq){
                      edata.filterids.push(color.id)
                    }
                  })
                }
              }
            }
              }
            }
          }
        }
        this.pricegroupselectedidArry = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault : '';
        let search: any = params?.request?.filterModel;
        // edata.gridsearch = search;
        if(filterData && filterData?.value.split(',').pop() != ""){
          let obj:any = {
            optionname : {
              filterType : "text",
              type: "contains",
              filter : filterData?.value.split(',').pop()
            },
         
          }
           if (this.forms[0].metaData[index].fieldtypeid == 3) { // option name and code search was impplemetion only for option as per Kiran and kumar Instruction
           obj.optioncode = {
              filterType : "text",
              type: "contains",
              filter : filterData?.value.split(',').pop()
            }
           }
          edata.gridsearch = obj
          edata.is_tab_flow_search = true
        }
        edata.productionformulalist = this.orderproductiondata;
        edata.forrulebased = flag == 'rule' ? 1 : 0;
        edata.fieldselectedids = '';
        var getSelection = $('#comboGrid'+this.comboIndex).combogrid('grid').datagrid('getSelections').map(x => x.optionid).join()
        edata.fieldselectedids = getSelection;
        this.forms[0].metaData.forEach((field) => {
          if ([11, 7, 8, 31].includes(field.fieldtypeid)) {
            edata['width'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
          else if ([12, 9, 10, 32].includes(field.fieldtypeid)) {
            edata['drop'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
          else if (field.fieldtypeid == 34) {
            edata['unittype'] = this.forms[0]?.formGroup?.get(field.fieldid.toString())?.value;
          }
        })
        
        if ((this.fabricIds.includes(this.forms[0].metaData[index].fieldtypeid) && this.forms[0].metaData[index].fieldlevel == 1) || (this.forms[0].metaData[index].fieldlevel == 2 && this.forms[0].metaData[index].issubfabric == 1)) {
          edata.fabricselectedid = '';
          edata.fabricselectedid = this.forms[0].metaData[index].optiondefault
          
          edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid == this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid === this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.optiondefault : ''
          edata.supplierselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault ? this.forms[0].metaData.filter(el => el.fieldtypeid == 17)[0]?.optiondefault : ''
         
          if (this.forms[0].metaData[index].fieldtypeid == '5') {
            edata['dualseq'] = this.forms[0].metaData[index].dualseq;
          }
          if(this.forms[0].metaData[index].fieldtypeid == '22'){
            edata['multiseq'] = this.forms[0].metaData[index].multiseq;
          }
        }
        else {
          edata.fabricselectedid = ''
          //   edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault;
          if(this.category != 6){
          edata.pricegroupselectedid = this.forms[0].metaData[index].dualseq == '2' ? this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[1]?.optiondefault : this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault
          }else{
          if(this.forms[0].metaData[index].multiseq > 1){
            edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && el.multiseq == this.forms[0].metaData[index].multiseq)[0]?.optiondefault;
          }else{
            edata.pricegroupselectedid = this.forms[0].metaData.filter(el => el.fieldtypeid == 13)[0]?.optiondefault;
          }
        }
        }
        edata.productid = this.selectedproduct;
        if(this.forms[0].metaData.filter(el => el.fieldtypeid == 13 && (el.fieldid == this.forms[0].metaData[index].linktopricegroup || this.isdualproduct == '0' && this.category!=6))[0]?.showfieldonjob == 0){
            edata.pricegroupselectedid = ""
            edata.supplierselectedid  = ""
        }
        let page = params?.request?.endRow / this.agGridOptions.cacheBlockSize
        //fieldedit page
        if (this.option_fabric_indexflag) {
          page = params?.request?.endRow / this.option_fabric_agGridOptions.cacheBlockSize
        }
        let ruleperpagecount = 0
        if (this.forms[0].metaData[index].optiondefault) {
          ruleperpagecount = this.forms[0].metaData[index].optiondefault.split(',').length
        }
        let perpage = flag == 'rule' ? ruleperpagecount : 50
        let sorting
        let sortLength = params?.request?.sortModel?.length
        if (sortLength > 0) {
          sorting = {
            colId: params?.request?.sortModel[0]?.colId,
            orderBy: params?.request?.sortModel[0]?.sort
          }
        }
        let contactid = this.currentcontactid = (this.productser.contactid == 0) ? 0 : this.productser.contactid
        let fieldtypeid = this.forms[0].metaData[index].fieldtypeid
        let fabricolorcolor = this.forms[0].metaData[index].fabricorcolor
        let fieldid = this.forms[0].metaData[index].fieldid
        let fieldlevel = this.forms[0].metaData[index].fieldlevel
        let url = ''
        
        if( filterData?.action != "scroll" ){
          this.pageCount = 1
          this.hasNextPage = true
        }
        sorting?.colId
          ? url = `products/get/fabric/options/list/${this.receipe}/${fieldlevel}/${contactid}/${fieldtypeid}/${fabricolorcolor}/${fieldid}/${this.orderid}?page=${this.pageCount}&perpage=${perpage}&sort=${sorting.colId}&orderby=${sorting.orderBy}`
          : url = `products/get/fabric/options/list/${this.receipe}/${fieldlevel}/${contactid}/${fieldtypeid}/${fabricolorcolor}/${fieldid}/${this.orderid}?page=${this.pageCount}&perpage=${perpage}`
        edata.customertype = this.productser.customerType;
        if(this.hasNextPage){
        
          this.orderser.getfabric(url, edata, this.forms[0].metaData[index].fieldtypeid).subscribe((response: any) => {
              this.pageCount = parseInt(response[0].currentpage) + 1
              this.hasNextPage = response[0].data[0]?.optionsvalue?.length < 50 ? false : true
            this.serverProps(response, "params", index, flag, rulesarray, this.forms[0].metaData[index])
            // if (!params.request.filterModel || Object.keys(params.request.filterModel).length === 0) {
            //   this.optiondefaultarray.optionArray = response[0]?.data[0]?.optionsvalue;
            //   this.optiondefaultarray.selectedIds = []
            // }else{
            //   this.optiondefaultarray.searchOpt = response[0]?.data[0]?.optionsvalue;
            //   this.optiondefaultarray.selectedIds = [...edata.fieldselectedids.split(',')];
            // }
            // if (response[0]?.data[0]?.optionsselectedcolumns) {
            //   this.editFabric_optionColumn(response[0]?.data[0]?.optionsselectedcolumns)
            // }
            this.commonfilter.globalsearchfn()
          }
          // ,err => {
          //   params.successCallback([], 0);
          //   this.gridApi.showNoRowsOverlay();
          //   this.isLoadingorderitem = false;
          // }
        )
        }
 }
  setColoumData(res, index) {
    var old_time1:any = Date.now()
    let headerData: any
    if(res.fieldtypeid == 3){
      headerData = this.staticArrayData.find(x => x.field_type == res.fieldtypeid).headers;
    }else {
      headerData = res.optionsselectedcolumns;
    }
    let columns = []
    let filter = []
    if (res.selection == "1") {
      columns.push({ field: 'ck', checkbox: "true", hidden: false, resizable: false })
    } else {
      columns.push({ field: 'empty', hidden: false, width: 20, filterable: false, resizable: false })
      columns.push({ field: 'ck', checkbox: "true", hidden: true, resizable: false })
    }
    var headerwidth = 110;
    const editableSet = new Set(res.editablecolumns);
const customOrder = res.fieldtypeid == 33 ? ["qty","width","depth","length"] : res.fieldtypeid == 3 ?  ['optionqty', 'optionname', 'optioncode'] : [];
const headerKeys = Object.keys(headerData);
const restKeys = headerKeys.filter(k => !customOrder.includes(k));
const orderedKeys = [...customOrder, ...restKeys];

let key: string;
let value: string;
let hidden: boolean;
let obj: any;
for (let i = 0; i < orderedKeys.length; i++) {
  key = orderedKeys[i];
  value = headerData[key];

  if (value === 'Option Id') continue;

  hidden = value === 'pricegroupid';

  if (key === 'optionqty') {
    headerwidth = 110;
  } else if (key === 'optionname') {
    headerwidth = 300;
  } else {
    headerwidth = 120;
  }

  obj = {
    field: key,
    title: key == 'optionqty' ? "Qty" : value,
    width: headerwidth,
    hidden: value ? hidden : true,
    fixed : true,
    formatter:(value,row,index) =>{
      return  `<span title="${value}" matTooltip="${value}" [matTooltipPosition]="'below'"  > ${ value ? value : ""} </span>`
    },
    // formatter:"formatWithTooltip",
    resizable: true,
  };

  if (editableSet.has(key)) {
    obj.editor = { type: 'text' };
  }

  columns.push(obj);
}
    var new_time1:any = Date.now()
    return [columns]
  }
  public mode;
  public data;
  comboIndex: any
  handleAction(action:any) {
    this.mode = action.mode
    this.data = action.data
     if (this.mode === 'enabledisable') {
          this.enabledisableflag = true
          this.loadingIndex = this.data.index
     } 
     else if (this.mode === 'save') {
        this.selectedcompindex = this.data.index
        this.comboIndex = this.data.fieldid
        this.exampleModalbk('save');
     } 
     else if (this.mode === 'component') {
        this.hasNextPage = true
        this.comboFilterData = {};
        this.selectedcompindex = this.data.index
        this.comboIndex = this.data.fieldId
          const selectedText = $('#comboGrid'+this.data.fieldId).combogrid('getText');
         $('#comboGrid'+this.data.fieldId).combogrid('grid').datagrid('loadData', [])
        $('#comboGrid'+this.data.fieldId).combogrid('setText', selectedText);
         this.panelLoader("add",this.data.fieldId)
        this.supcomponentfn("", this.data.fieldId, this.data.index, this.data.res);
     }
     else if (this.mode === 'afteredit') {
          this.forms[0].metaData[this.selectedcompindex].optionsvalue[this.data.rowIndex] = this.data.row
     }
     else if (this.mode === 'rowclick') {
        this.selectedcompindex = this.data.index
        this.comboIndex = this.data.fieldid
        this.onRowClicked(this.data.data ? this.data.data : [])
     }
     else if (this.mode === 'addBattens') {
         this.addBattens()
     }
     else if (this.mode === 'load') {
        let getIndex = this.forms[0].metaData.findIndex(x => x.fieldid == this.currentFiledID)
        let fieldType = this.forms[0].metaData[getIndex].fieldtypeid
        let isComboField = [2, 5, 19, 20, 21, 22,33].includes(fieldType) || (fieldType === 3 && this.edishowhideField(this.forms[0].metaData[getIndex]))
        if(isComboField) {
            $('#comboGrid'+getIndex).combogrid('textbox').focus()
        } else {
          $('#subgrid'+getIndex).focus()
        }
        // this.loadcomboGrid(true,true)
     }
     else if(this.mode === 'globalSearch'){
        this.comboFilterData = this.data.filterData
        this.getServerData(this.comboFilterData.index,'',[],this.comboFilterData)
     }
     else if(this.mode === 'setvalues'){
      this.loadFormValue(this.data.index)
     }else if(this.mode === 'closePanelLoader'){
      this.panelLoader("remove",this.data.index)
     }
  }
  checkGlobalInput(prop){
let isComboField = [2, 5, 19, 20, 21, 22,33].includes(prop.fieldtypeid) || (prop.fieldtypeid === 3 && this.edishowhideField(prop))
        if(isComboField) {
          if(this.globaleditPopup){
              if(this.selectColor(prop)){
                 $('#comboGrid'+prop.fieldid).combogrid('textbox').addClass('bg_pinkColor')
                   $('#comboGrid'+prop.fieldid).next('.combo').find('.combo-arrow').addClass('bg_pinkColor');
              }else{
                  $('#comboGrid'+prop.fieldid).combogrid('textbox').removeClass('bg_pinkColor')
                  $('#comboGrid'+prop.fieldid).next('.combo').find('.combo-arrow').removeClass('bg_pinkColor');
              }
          }
        } 
  }
  
  removePanel(){
    this.loadViewd = false
    const panels = document.querySelectorAll('.panel');
      panels.forEach(panel => {
         panel.remove();
      });
  }
  comboLoader:any;
  panelLoader(action,index){
   if($('#comboGrid'+index).data('combogrid')){
    const panel = $('#comboGrid'+index).combo('panel');
      if( action == "add" ){
        this.diableComboRow = true
        if (panel.find('.comboloader').length) {
          panel.find('.comboLoader').remove();
          this.comboLoader.hide();
        }
        this.comboLoader = $('<div class="loading_spinnergrid"> <div class="spinner-border" role="status"> </div> </div>')
        this.comboLoader.appendTo(panel)
      }else if(action == "remove"){
        this.diableComboRow = false
        panel.find('.comboLoader').remove();
        this.comboLoader.hide();
      }
   }
  }

  removeSubLoader(){
    this.enabledisableflag = false
    if(this.loadingIndex ){
       if($('#comboGrid'+this.loadingIndex).data('combogrid')){
         console.log("this.loadingIndex",this.loadingIndex)
           $(`#spinnerId${this.loadingIndex} .loading_spinner`).removeClass("showLoader")
           $(`#comboGrid${this.loadingIndex}`).combogrid('textbox').focus()
           this.loadingIndex = undefined
       } else{
          this.loadingIndex = undefined
       }
    }
  }
  // new tab flow end
 //  Toggle the location dropdown based on the button click.
  toggleLocation() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen && this.listOfLocationsClone.length>0) {
      this.listOfLocations = [...this.listOfLocationsClone];
    }
  }
 // Used to close the location drop-down when clicked outside the location 'div'.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen) {
      const targetElement = event.target as HTMLElement;
      if (this.dropdownElement && !this.dropdownElement.nativeElement.contains(targetElement)) {
        this.isDropdownOpen = false;
      }
    }
    const dropdownButton = document.getElementById('dropdownMenuLink_orderform_one');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (
      this.isDropdown &&
      dropdownButton &&
      dropdownMenu &&
      !dropdownButton.contains(event.target as Node) &&
      !dropdownMenu.contains(event.target as Node)
    ) {
      this.isDropdown = false;
    }
  }
  returnvatvalue() {
    let zipprotax:any = ''
    let vatchangevalue:any = ''
    if (this.ordervattype && this.vattypearray.type) {
      if (this.ordervattype != this.vattypearray.type) {
        if (this.vattypearray.value || !this.vattypearray.value) {
          vatchangevalue = this.vattypearray.value
        }
      }
      else {
        if (this.ordervattype != 1) {
          zipprotax =  this.vat_value
        }
        vatchangevalue = this.ordervattype == 1 ? this.vatvalue : zipprotax
      }
    }
    else{
      if (this.ordervattype != 1) {
        zipprotax =  this.vat_value
      }
      vatchangevalue = this.ordervattype == 1 ? this.vatvalue : zipprotax
    }
    return vatchangevalue
  }
  onNumericChange(event: any, prop: any, i: any, fieldid: any) { // LA-I3072 START
    if (this.forms[0].metaData.some((e: any) => e?.fieldtypeid == 6 && e?.numeric_setcondition) && !this.globaleditPopup) {
      this.numericChangeSubject.next({ event, prop, i, fieldid, allreadycon: 0 });
      this.cd.markForCheck();
    }
  }

  doNumericChange(event: any, prop: any, i: any, fieldid: any, allreadycon: any) {
    let array = [];
    if(!allreadycon) {
      if (prop?.fieldid === fieldid) {
        delete prop.setCondition;
      }
      this.forms[0].metaData.forEach((e: any) => {
        if (e?.fieldtypeid === 6) {
          if (e?.setCondition && !e?.setCondition?.override) {
            delete e.setCondition;
          }
          this.cd.markForCheck();
        }
      });
    }
    let filterNumericSetcondition = this.forms[0].metaData.filter((e: any) => e?.fieldtypeid == 6 && e?.numeric_setcondition && 
      ((e.showfieldonjob && !environment?.onlineportal) || (e.showFieldOnCustomerPortal && environment?.onlineportal)));
    if (filterNumericSetcondition.length) {
      filterNumericSetcondition.forEach((el: any) => {
        if (el?.numeric_comparefieldid && this.inst.get(el.fieldid.toString()).value ) {
          array.push({
            fieldid: el.fieldid,
            currentValue: Number(this.inst.get(el.fieldid.toString()).value),
            compareValue: Number(this.inst.get(el.numeric_comparefieldid.toString()).value) ?? null,
            setConditionChanged: el.setCondition && el.setCondition.override ? true : false,
          });
        }
      });
      if (array.length) {
        const url = `orderitems/calculate/field/setcondition`;
        this.orderser.setconditionApi(url, array).subscribe((res: any) => {
          if (res.results.length) {
            this.afterResponseSetCondition(res.results);
          } else {
            this.forms[0].metaData.forEach((e: any) => {
              if (e?.fieldtypeid === 6 && e?.numeric_setcondition == 1) {
                this.inst.controls[e.fieldid.toString()]?.setErrors({ errors: null });
                this.cd.markForCheck();
              }
              this.minMaxSetConditions();
            });
          }
          this.cd.markForCheck();
        }, error => {
          this.toast.errorToast('error');
        });
      } else {
        this.minMaxSetConditions();
      }
      this.cd.markForCheck();
    } else { // bug case - LA-I3630 - Override Selection Greyed Out
      this.paramWarningBase = false;
      this.cd.markForCheck();
    }
  }

  afterResponseSetCondition(res: any) {
    this.forms[0].metaData.forEach((field: any) => {
      if (field?.fieldtypeid === 6 && field?.numeric_setcondition == 1) {
        this.inst.controls[field.fieldid.toString()]?.setErrors({ errors: null });
        this.cd.markForCheck();
      }
      const match = res.find((resultItem: any) => resultItem.fieldid === field.fieldid);
      if (match) {
        field.setCondition = match;
      }
    });
    this.minMaxSetConditions();
    this.cd.markForCheck();
  }

  openSetcondition(tooltip: TooltipComponent) {
    if (this.currentTooltip === tooltip) { // If it's the currently open tooltip, close and reset
      tooltip.close();
      this.currentTooltip = null;
      return;
    }
    if (this.currentTooltip) { // If another tooltip is open, close it first
      this.currentTooltip.close();
    }
    tooltip.open(); // Open the new tooltip and update reference
    this.currentTooltip = tooltip;
  }

  setConditionConfirmation(type: number, tooltipRef: any, prop: any) {
    tooltipRef.close();
    if (type === 1) {
      if (prop.numeric_allowoverride) {
        prop.setCondition.errorMessage = 'Field condition overridden';
        prop.setCondition.override = 1;
      }
      this.minMaxSetConditions();
    }
    this.cd.markForCheck();
  }

  minMaxSetConditions() {
    this.forms[0].metaData.map((field: any, index: any) => {
      if (field.fieldtypeid == 6) {
        let emptycheck = this.inst.controls[field.fieldid.toString()].value;
        let checkvalue = parseFloat(this.inst.controls[field.fieldid.toString()].value);
        let numeric_min = field.numeric_minvalue;
        let numeric_max = field.numeric_maxvalue;
        this.numericminmaxvalue = '';
        if ((numeric_min == 0 && numeric_max == 0) || (emptycheck == '')) {
          this.inst.controls[field.fieldid.toString()]?.setErrors(null);
        } else {
          if ((checkvalue && !isNaN(checkvalue) && checkvalue >= numeric_min && checkvalue <= numeric_max)) {
            this.inst.controls[field.fieldid.toString()]?.setErrors(null)
          } else {
            this.numericminmaxvalue = '(Min ' + numeric_min + ' - Max ' + numeric_max + ')'
            this.inst.controls[field.fieldid.toString()]?.setErrors({ errors: this.numericminmaxvalue });
          }
        }
        const ctrl = this.inst.controls[field.fieldid.toString()]; // this.inst.controls[field.fieldid.toString()]?.setErrors({ errors: this.numericminmaxvalue, required: true });
        if ((this.numericminmaxvalue && field?.setCondition && !field?.setCondition?.override) && (field.ruleoverride != 0)) {
          ctrl.setErrors({ errors: this.numericminmaxvalue, required: true });ctrl.markAsTouched();ctrl.markAsDirty();
        } else if ((this.numericminmaxvalue) && (field.ruleoverride != 0)) {
          ctrl.setErrors({ errors: this.numericminmaxvalue });ctrl.markAsTouched();ctrl.markAsDirty();
        } else if (field?.setCondition && !field?.setCondition?.override) {
          if('ruleoverride' in field && field.ruleoverride == 0){
            ctrl.setErrors({ required: true });ctrl.markAsTouched();ctrl.markAsDirty();
          }
          else {
            ctrl.setErrors({ required: true });ctrl.markAsTouched();ctrl.markAsDirty();
          }
        } else {
          this.inst.controls[field.fieldid.toString()]?.setErrors(null);
        }
        this.cd.markForCheck();
      }
      this.paramWarningBase = false;
      this.cd.markForCheck();
    })
  }

  minMaxSetConditionFull() {
    this.paramWarningBase = true;
    if (this.minMaxSetConditionRunning) {
      return;
    }
    this.minMaxSetConditionRunning = true;
    setTimeout(() => {
      this.minMaxSetConditionRunning = false; // unlock after logic
      if (this.forms[0].metaData.some((e: any) => ('ruleoverride' in e && e.ruleoverride == 0) && (!this.globaleditPopup) && (e?.fieldtypeid == 6))) {
        let lastMatchingObject = this.forms[0].metaData.filter((e: any) => e.fieldtypeid == 6).pop();
        this.numericChangeSubject.next({ event: {}, prop: lastMatchingObject, i: 0, fieldid: lastMatchingObject.fieldid, allreadycon: 1 });
        this.cd.markForCheck();
      } else if (this.forms[0].metaData.some((e: any) => e.setCondition && !this.globaleditPopup)) {
        this.minMaxSetConditions();
        this.cd.markForCheck();
      } else if (this.forms[0].metaData.some((e: any) => e.fieldtypeid == 6 && !this.globaleditPopup && this.inst.get(e.fieldid.toString()).value)) {
        let lastMatchingObject = this.forms[0].metaData.filter((e: any) => e.fieldtypeid == 6).pop();
        this.numericChangeSubject.next({ event: {}, prop: lastMatchingObject, i: 0, fieldid: lastMatchingObject.fieldid, allreadycon: 1 });
        this.cd.markForCheck();
      } else {
        this.paramWarningBase = false;
        this.cd.markForCheck();
      }
    }, 1500);
  }

  @HostListener('document:click', ['$event'])
  handlePageClick(event: MouseEvent) { // Detect document click
    if (this.currentTooltip && !this.currentTooltip.element.contains(event.target as Node)) {
      this.currentTooltip.close();
      this.currentTooltip = null;
    }
  } // LA-I3072 END

}
// define some handy keycode constants
  const KEY_LEFT = 'ArrowLeft'
  const KEY_UP = 'ArrowUp'
  const KEY_RIGHT = 'ArrowRight'
  const KEY_DOWN = 'ArrowDown'
  function moveHeaderFocusUpDown(previousHeader: HeaderPosition,headerRowCount: number,isUp: boolean) {
    const previousColumn = previousHeader.column
    const lastRowIndex = previousHeader.headerRowIndex
    let nextRowIndex = isUp ? lastRowIndex - 1 : lastRowIndex + 1
    let nextColumn
    if(nextRowIndex === -1){
      return previousHeader
    }
    if(nextRowIndex === headerRowCount){
      nextRowIndex = -1
    }
    const parentColumn = previousColumn.getParent()
    if(isUp){
      nextColumn = parentColumn || previousColumn
    }
    else{
      nextColumn = (previousColumn as any).children ? (previousColumn as any).children[0] : previousColumn
    }
    return {
      headerRowIndex: nextRowIndex,
      column: nextColumn
    }
  }
  