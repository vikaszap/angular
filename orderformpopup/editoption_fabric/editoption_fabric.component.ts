import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonPopupService } from 'src/app/services/common-popup/common-popup.service';
import { CommonnotificationService } from 'src/app/services/commonnotification/commonnotification.service';
import { CommonproductService } from 'src/app/services/commonproduct/commonproduct.service';
import { ProductformsetupService } from '../../../product-new/form-setup/productformsetup.service';
declare var $: any

@Component({
  selector: 'app-editoption_fabric',
  templateUrl: './editoption_fabric.component.html',
  styleUrls: ['./editoption_fabric.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Editoption_fabricComponent implements OnInit {
  fabricIds: any = [5,19,20,21,22]
  ngOnInit(): void {}
  params:any
  button1: any
  button2: any;
  constructor(public popupService: CommonPopupService, public productService: CommonproductService,
    public formsetup: ProductformsetupService,private toast: CommonnotificationService){}
  agInit(param): void {
    this.params = param
    if(this.fabricIds.includes(param.context?.componentParent?.option_fabric_editfielddata.fieldtypeid)){
      if(param.context?.componentParent?.option_fabric_editfielddata.fieldtypeid == '21'){
        if(this.params.context?.componentParent?.option_fabric_editfielddata.fabricorcolor == '2'){
          this.button1 = 'Add New Color';
          this.button2 = 'Use Existing Color';
        }else{
          this.button1 = 'Add New Shutter Type';
          this.button2 = 'Use Existing Shutter Type';
        }
      }else if(param.context?.componentParent?.option_fabric_editfielddata.fieldtypeid == '20' || this.params.context?.componentParent?.option_fabric_editfielddata.fabricorcolor == '2'){
        this.button1 = 'Add New Color';
        this.button2 = 'Use Existing Color';
      }
      else{
        this.button1 = 'Add New Fabric';
        this.button2 = 'Use Existing Fabric';
      }
    }else if(param.context?.componentParent?.option_fabric_editfielddata.fieldtypeid == 13){
      this.button1 = 'Add New Price';
      this.button2 = 'Use Existing Price';
    }else if(param.context?.componentParent?.option_fabric_editfielddata.fieldtypeid == 33){
      this.button1 = 'Add New Battens';
      this.button2 = 'Use Existing Battens';
    }
    else{
      this.button1 = 'Add New Option';
      this.button2 = 'Use Existing Option';
    }
  }
  onClick($event,mode) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onClick(this.params,mode)
    }
  }
  addoption(){
      if (this.fabricIds.includes(this.params.context?.componentParent?.option_fabric_editfielddata.fieldtypeid)) {
        // if(this.params.context?.componentParent?.option_fabric_editfielddata.fabricorcolor == '2'){
         
        // }else{
        this.params.context?.componentParent?.fabricoptionEditClick_fabric(this.params,'add')
        // }
    }
    else{
      this.params.context?.componentParent?.fabricoptionEditClick(this.params,'add')
    } 
 
  }
  existoption(){

    this.params.context?.componentParent?.exitingOptionPopupOpen();
    return;
  }
}
