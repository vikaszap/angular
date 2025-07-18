import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { baseurl } from 'src/environments/environment'
import { nodeurl } from 'src/environments/environment'
import { environment } from 'src/environments/environment'
import { Subject,Observable } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators';
import { JobService } from 'src/app/services/add/job/job.service'
@Injectable({
  providedIn: 'root'
})
export class OrderformService {
constructor(public orderauth:JobService,private http: HttpClient) { }
  passparentchilddata = new Subject<any>()
  orderqtychanges = new Subject<string>()
  jobseqchanges = new Subject<string>()
  paymentshowmore = new Subject<string>()
  public orderviewchange$ = new Subject()
  jobPageFlag:boolean=false;
  productserchlength:any;
  doubleclickflag:boolean=false
  orderformeditflag:any=''
  private unsubscribeFilter$ = new Subject<void>();
  private unsubscribeRule$ = new Subject<void>();
  reworkinit = new Subject<string>()
  public showGlobalEdit: boolean = false;
  public globalEditProgress: number = 0;
  public jobApiReruestCount:number = 0
  GetMethod(url){
    return this.http.get(`${environment.APIURL}${url}`).toPromise()
  }
  postMethod(url,data){
    return this.http.post(`${environment.APIURL}${url}`,data).toPromise()
  }
  getfabric(url, body,flag) {
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/json')
    headers = headers.set('skipLoading', 'true')
    // let fabriccolorarray = [5,19,20,21,22]
    // if(!fabriccolorarray.includes(flag)){
    //   headers = headers.set('skipLoading', 'true')
    // }
    return this.http.post(`${nodeurl}${url}`, body, {headers:headers})
  }
  getrulefabric(url, body) {
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/json')
    headers = headers.set('skipLoading', 'true')
    return this.http.post(`${nodeurl}${url}`, body, {headers:headers})
  }
  orderpricepostMethod(netprice){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'orderitems/calculate/option/price',netprice, { headers: { skipLoading: flag }}).toPromise()
  }
  getallproductlist(customerid:any,mode:any){
    var head = { headers: { skipLoading: ""}}
    if(this.jobPageFlag){
      head =  { headers: { skipLoading: "true"}}
    }
    return this.http.get(nodeurl + 'products/list/all/' + customerid + '/' + mode  ,head)
  }
  // getallproductlist() replace function getallproductgrouplist
  getallproductgrouplist(customerid:any,mode:any){
    var head = { headers: { skipLoading: ""}}
    if(this.jobPageFlag){
      head =  { headers: { skipLoading: "true"}}
    }
    return this.http.get(nodeurl + 'products/productgroup/listall/' + customerid + '/' + mode  ,head)
    //return this.http.get(nodeurl + 'products/list/all/' + customerid + '/' + mode  ,head)
  }
 
  getPricegrouplist(productid:any) {
    return this.http.get(baseurl + 'product/pricegrouplist/by/product/' + productid)
  }
 
  getallist(){
    var head = { headers: { skipLoading: ""}}
    if(this.jobPageFlag){
      head =  { headers: { skipLoading: "true"}}
    }
    return this.http.get(nodeurl + 'products/list/all'  ,head)
  }
  // getallist() replace function allproductgrouplist
  allproductgrouplist(){
    var head = { headers: { skipLoading: ""}}
    if(this.jobPageFlag){
      head =  { headers: { skipLoading: "true"}}
    }
    return this.http.get(nodeurl + 'products/productgroup/listall'  ,head)
  }
  getAccountTypelist(){
     let head =  { headers: { skipLoading: "true"}}
    return this.http.get(baseurl + 'contacttype/list'  ,head)
  }
  getDefaultContact(data){
    let head =  { headers: { skipLoading: "true"}}
   return this.http.post(nodeurl + 'customer/default-contact',data,head)
 }
  proceedAccountType(contactid,accounttype){
   return this.http.post(baseurl + `contacttoaccount/${contactid}/${accounttype}`,'assign')
 }
  alteraddressUpdate(jobid,data){
   return this.http.post(baseurl + `updatedeliveryaddress/${jobid}`,data,{ headers: { skipLoading: 'true' }})
 }
  getreceipefieldlist(list){
    return this.http.post(baseurl + 'job/product/fieldlist' , list)
  }
  pasteorderitem(jobid,deletedata){
    return this.http.post(baseurl + 'job/orderitem/paste/' + jobid,deletedata)
  }
  getfieldlist(recipeid:any,level:any){
    return this.http.get(nodeurl + 'products/fields/list/' + recipeid + '/' + level)
  }
  getlocationbasedlist(jobid){  
    var head = { headers: { skipLoading: "" }}
    if(this.jobPageFlag){
      head =  { headers: { skipLoading: "true"}}
    }
    return this.http.get(nodeurl + 'orderitems/locationview/' + jobid,head)
  }
  getlocationsubbasedlist(jobid,subdataid){  
    return this.http.post(nodeurl + 'orderitems/locationview/orderitem/' + jobid,subdataid)
  }
  updateholdorderitem(readystatus){
    return this.http.post(baseurl + 'job/orderitem/onhold', readystatus)
  }
  orderseq(lineitemid:any,index:any){
    return this.http.get(baseurl + 'job/orderitem/updatesequence/' + lineitemid + '/' + index)
  }
  getMainSuppliers() {
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + 'products/get/mainsuppliers', { headers: { skipLoading: flag }})
  }
  getFabricsLayout(materialType) {
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + `softfurnishingcollspe/${materialType}`, { headers: { skipLoading: flag }});
 }
 softfurningmaterialadd(materaldata){
  let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
  return this.http.post(baseurl + 'product/softfurnishing/materialadd', materaldata, { headers: { skipLoading: flag }})
}
  copyproduct(copy_data){  
    return this.http.post(baseurl + 'job/orderitem/copy',copy_data);
  }
  getoverridevatvalue(data:any=''){
    let crediteditflag = true
    if(window.location.href.split('/').includes('creditnote')){
      if(window.location.href.split('/').includes('edit')){
        crediteditflag = false
      }
    }
    if(crediteditflag){
      let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
      return this.http.post(nodeurl + 'job/get/override/vatprice',data, { headers: { skipLoading: flag }})
    }
  }
  getoutstandingamt(validatedata){
    return this.http.post(nodeurl + 'job/get/outstanding',validatedata, { headers: { skipLoading: 'true' }})
  }
  getpricingfieldsvalue(data:any=''){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'pricefields/getall',data, { headers: { skipLoading: flag }})
  }
 
  getPricefieldsForGlobaledit(data:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'pricefields/globaledit',data, { headers: { skipLoading: flag }})
  }
  updateitemcommission(data:any=''){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(baseurl + 'job/orderitem/updateitemcommission',data, { headers: { skipLoading: flag }})
  }
  getorganisationtaxlavel(data:any=''){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'job/get/organisation/taxlabel',data, { headers: { skipLoading: flag }})
  }
  getorderlistdata(jobid,pivotid){  
    var head = { headers: { skipLoading: "" }}
    if(this.jobPageFlag){
      let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
      head =  { headers: { skipLoading: flag }}
    }
    if(pivotid) {
      let url = this.orderauth.creditnoteflag ? 'orderitems/list/all/' + jobid + '/' + pivotid + '?mode=creditnote' : 'orderitems/list/all/' + jobid + '/' + pivotid
      return this.http.get(nodeurl + url,head)
    }
    else{
      let url = this.orderauth.creditnoteflag ? 'orderitems/list/all/' + jobid + '?mode=creditnote' : 'orderitems/list/all/' + jobid
      return this.http.get(nodeurl + url,head)
    }
  }
  getProductListByOrderIds(data:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + `productslistbyorderids/${data.moduleid}/${data.orderids}${data?.orderitmids ? '/'+ data.orderitmids : ''}`, { headers: { skipLoading: flag }} )
  }
  getreceipelist(productid:any,recipeid?:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(nodeurl + `products/recipe/list/${productid}/${recipeid ?? ''}`, { headers: { skipLoading: flag }})
  }
  saveorderitemdata(jobid,productid,orderdata){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(baseurl + 'job/orderitem/add/' + jobid + '/' + productid , orderdata, { headers: { skipLoading: 'true' }})
  }
  getorderitemsublevel(recipeid:any,level:any,optionid:any,fieldtypeid:any,masterfieldid:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(nodeurl + 'products/fields/list/' + recipeid + '/' + level + '/' + optionid + '/' + fieldtypeid + '/' + masterfieldid, { headers: { skipLoading: flag }})
  }
  dumygetorderitemsublevel(contactid:any,recipeid:any,level:any,optionid:any,fieldtypeid:any,masterfieldid:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post( nodeurl + 'products/fields/list/' + contactid + '/' + recipeid + '/' + level + '/' + fieldtypeid + '/' + masterfieldid,optionid, { headers: { skipLoading: flag }})
  }
  // ordertypevalidation(fielddata:any){
  //   let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
  //   return this.http.post(nodeurl + 'products/fields/filterbasedongeneraldata' ,fielddata, { headers: { skipLoading: flag }})
  // }
  async ordertypevalidation(fielddata:any): Promise<any> {
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    this.unsubscribeFilter$.next();
      this.unsubscribeFilter$ = new Subject<void>();
      const response = await this.http.post(nodeurl + 'products/fields/filterbasedongeneraldata' ,fielddata, { headers: { skipLoading: flag }}).pipe(
        takeUntil(this.unsubscribeFilter$)
      ).toPromise();
      return response;
  }
  cancelFilterRequests() {  
    this.unsubscribeFilter$.next();
    this.unsubscribeFilter$.complete();
    this.unsubscribeFilter$ = new Subject<void>();
  }
  getordercaldata(fieldtypeid:any,jobid:any,netprice:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'orderitems/calculate/option/price',netprice, { headers: { skipLoading: flag }})
  }
  getorderdefaultdata(recipeid:any,level:any,contactid:any,jobid:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(nodeurl + 'products/fields/withdefault/list/' + recipeid + '/' + level+'/'+contactid, { headers: { skipLoading: flag }})
  }
  updateorderitemdata(orderid,orderdata){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(baseurl + 'job/orderitem/edit/' + orderid , orderdata, { headers: { skipLoading: 'true' }})
  }
  editorderdefaultdata(recipeid:any,level:any,contactid:any,lineitemid:any,mode:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    let queryParam = ((lineitemid) && (mode && mode.toLowerCase() === 'copy')) ? '/copyitem' : '';
    return this.http.get(nodeurl + 'products/fields/withdefault/list/' + recipeid + '/' + level + '/' + contactid + '/' + lineitemid + queryParam, { headers: { skipLoading: flag }})
  }
  deleteorderitemdata(deletedata){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(baseurl + 'job/orderitem/delete',deletedata, { headers: { skipLoading: flag }})
  }
  updatereadyorderitem(readystatus){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(baseurl + 'job/orderitem/ready',readystatus, { headers: { skipLoading: flag }})
  }
  rulesbasecalc(rulescalc:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'orderitems/calculate/rules',rulescalc, { headers: { skipLoading: flag }})
    // this.unsubscribeRule$.next();
      // Create a new subject for the next request
      // this.unsubscribeRule$ = new Subject<void>();
      // const response = await this.http.post(nodeurl + 'orderitems/calculate/rules',rulescalc, { headers: { skipLoading: flag }}).pipe(
      //   takeUntil(this.unsubscribeRule$)
      // ).toPromise();
      // return response;
  }
  cancelruleRequests() {  
    this.unsubscribeRule$.next();
    this.unsubscribeRule$.complete();
    this.unsubscribeRule$ = new Subject<void>();
  }
  widthdropvalidation(widthdropdata:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'orderitems/check/widthdrop/minandmax',widthdropdata, { headers: { skipLoading: flag }})
  }
  productMaxSqAreawidthdropvalidation(widthdropdata: any) {
    let flag: any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + `orderitems/calculate/product/maxsqarea`, widthdropdata, { headers: { skipLoading: flag } })
  }
  productstatus(productid:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(nodeurl + 'orderitems/list/product/status/' + productid, { headers: { skipLoading: flag }})
  }
  getvatvalue(mode:any,data:any=''){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.post(nodeurl + 'job/get/vat/percentage/' + mode,data, { headers: { skipLoading: "true" }})
  }
  pinorderdata(formulaid:any,mode:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + 'products/formula/pin/' + formulaid + '/' + mode, { headers: { skipLoading: flag }})
  }
  unpinorderdata(formulaid:any,mode:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + 'products/formula/unpin/' + formulaid + '/' + mode, { headers: { skipLoading: flag }})
  }
  getfractionlist(productid:any,data:any='',dataset:any=''){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    return this.http.get(baseurl + 'appSetup/fractionlist/' + productid + '/' + data +'/' + dataset, { headers: { skipLoading: flag }})
  }
  /////online portal price calculation
 
  onlinegetoverridevatvalue(data:any='',jobid?:any){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true'
    if(jobid){
      return this.http.post(nodeurl + 'orderitems/get/orderitem/override/vatprice' + '/' + jobid ,data, { headers: { skipLoading: flag }})
    }else{
      return this.http.post(nodeurl + 'orderitems/get/orderitem/override/vatprice',data, { headers: { skipLoading: flag }})
    }
  }
   // for operation LA-I297 start
   getCostList(productId,quantity,jobId,orderID,senddata){
    let flag:any = this.orderformeditflag == 'true' ? '' : 'true';
    let url = orderID != "" ? baseurl + `operations/getLimitedDetailsForOperations/${productId}/${quantity}/${jobId}/${orderID}` : baseurl + `operations/getLimitedDetailsForOperations/${productId}/${quantity}/${jobId}`
    return this.http.post(url,senddata, { headers: { skipLoading: flag }})
  }
  // for operation LA-I297 end
  onlinepaymentlistGet(){
    return this.http.get(baseurl + 'onlinepaymentlist');
  }
  makestripepayment(mode:any,data:any){
    return this.http.post(baseurl + 'onlinepaymentgateway/'+mode,data);
  }
  checkPaymentGateway(data:any){
    return this.http.post(baseurl + 'checkonlinepayment',data);
  }
  /////EDI send po trasfer api
  editrasferlist(jobidpar:any){
    // let flag:any = this.orderformeditflag == 'true' ? '' : 'true';
    let data = {jobid:jobidpar}
    return this.http.post(baseurl + 'products/fields/edisupplierproducts',data, { headers: { skipLoading: '' }})
  }
  editrasferDisabledlist(jobidpar:any){
    // let flag:any = this.orderformeditflag == 'true' ? '' : 'true';
    let data = {jobid:jobidpar}
    return this.http.post(baseurl + 'products/fields/edisupplierproductsdisabled',data, { headers: { skipLoading: '' }})
  }
  ediOrderTransferdata(edata:any){
    return this.http.post(baseurl + 'products/fields/listediexport/1/0/1',edata, { headers: { skipLoading: '' }})
  }
  emailtracklist(data:any){
    return this.http.post(baseurl + 'emailtracklist',data);
  }
  getSingleEmail(data:any){
    return this.http.post(baseurl + 'getSingleEmail',data);
  }
  emailattachment(data:any){
    return this.http.post(baseurl + 'email/reportdownload',data,{responseType: 'blob'});
  }
  emailfilename(data:any){
    return this.http.post(baseurl + 'email/reportfilesavename',data);
  }
  getglobaleditproductlist(productid:any,pivoitid:any){
    if(pivoitid){
      return this.http.get(baseurl + 'productslistbyjob/' + productid + '/' + pivoitid)
    }
    else{
      return this.http.get(baseurl + 'productslistbyjob/' + productid)
    }
  }
  getImportProduct(jobid : any,onlineportal?: any){
    if(onlineportal){
      return this.http.get(baseurl + 'getproduct/'+ jobid + '/'+ onlineportal, { headers: { skipLoading: 'true' }})
    }else{
      return this.http.get(baseurl + 'getproduct/'+ jobid, { headers: { skipLoading: 'true' }})
    }   
  }
  getorderitemcolumnlist(jobid:any,productid:any,recipeid:any,pivotId:any){
    if(pivotId) {
      return this.http.get(nodeurl + 'orderitems/globallist/' + jobid + '/' + productid + '/' + recipeid + '/' + pivotId)
    }
    else {
      return this.http.get(nodeurl + 'orderitems/globallist/' + jobid + '/' + productid + '/' + recipeid)
    }
  }
  expotrSampleOrderItem(){
    return this.http.get(baseurl + 'job/orderitem/exportsample',{responseType: 'blob'})
  }
  importOrderItemCSV(jobid:any,pivotid:any,edata:any){
    return this.http.post(baseurl + 'job/orderitem/newformattimport/' + jobid + '/' + pivotid ,edata)
  }
  ImportOrderItemData(jobid:any,pivotid:any,edata:any){
    if(pivotid){
      return this.http.post(baseurl + 'job/orderitem/import/' + jobid + '/' + pivotid ,edata)
    }
    else{
      return this.http.post(baseurl + 'job/orderitem/import/' + jobid ,edata)
    }
  }
  supplierbasedpricegroup(fielddata:any){
    return this.http.post(nodeurl + 'products/fields/supplierbasedpricegroup' ,fielddata, { headers: { skipLoading: 'true' }})
  }
  updatejobproductgroupseq(seqval:any){
    return this.http.post(baseurl + 'productgroup/jobproductgroupseq',seqval)
    //return this.http.post(baseurl + `productgroup/deleteproductgroup`,productgrpid)
  }
  jobproductgroupsequpdate(groupseq:any){
    return this.http.post(baseurl + 'productgroup/updateproductgroupseq',groupseq)
  }
  getmovetobuttonview(data:any){
    return this.http.post(baseurl + `productgroup/jobmovetobuttongroup`,data)
  }
  
  getproductmanuallist(productid:any){
    return this.http.get(nodeurl + 'products/getproductmanulslist/' + productid)
  }
  getCustomerDataForMerge(data:any){
    return this.http.post(baseurl + 'customer/getcustomerdataformerge',data);
}
  getPaymentList(){
    return this.http.get(baseurl + 'getpaymentsetuplist', { headers: { skipLoading: 'true' }});
  }
  changeseqarray(seqdata){
   return this.http.post(baseurl + 'settings/lineitemfieldviewsq',seqdata, { headers: { skipLoading: 'true' }})
  }
  saveMergeCustomer(data:any){
    return this.http.post(baseurl + 'customer/mergecustomer',data);
  }
  saveProductImage(endPoint:any,formData:any){
    return this.http.post(baseurl + endPoint,formData, { headers: { skipLoading: 'true' }});
  }
  fetchProductImage(endPoint:any){
    return this.http.get(baseurl + endPoint, { headers: { skipLoading: 'true' }});
  }
  getStaticData(data){
    return this.http.post(baseurl + 'joballdetails',data, { headers: { skipLoading: 'true' }});
  }
  // Rework Api
  getReworkLayout(){
    return this.http.get(nodeurl + 'rework/layout', { headers: { skipLoading: 'true' }});
  }
  saveRework(savedata){
    return this.http.post(baseurl + 'rework/save',savedata);
  }
  reworkJobValidation(ids){
    return this.http.post(nodeurl + 'rework/check',ids,{ headers: { skipLoading: 'true' }});
  }
  getGlobalLocation(data){
    return this.http.post(`${baseurl}globallocation/list`,data,{ headers: { skipLoading: 'true' }});
  }
  //validatemaxdiscoutpercentage
  validateMaxDiscoutPercentage(data){
    return this.http.post(baseurl + 'max-discount/calculation',data, { headers: { skipLoading: 'true' }});
  }
}