import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { CustomerapiService } from 'src/app/services/contacts/customerapi.service'
@Component({
  selector: 'app-orderheadercheckbox',
  templateUrl: './orderheadercheckbox.component.html',
  styleUrls: ['./orderheadercheckbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderheadercheckboxComponent implements OnInit {
  params: any
  retrivevalue: any
  checkdyn: boolean = false
  headercheckbox: boolean = true
  constructor(public customer:CustomerapiService,private cd: ChangeDetectorRef) {}
   agInit(params): void {
    this.params = params
    this.retrivevalue = this.customer.contactservercheckbox$.subscribe((res:any)=>{
      if(res.optiondefaultarray.length == res.optionvaluearray.length){
        this.checkdyn = true
      }
      else{
        this.checkdyn = false 
      }   
      this.cd.markForCheck();
    })
    this.cd.markForCheck();
  }
  refresh(params?: any): boolean { return true }
  onClick($event) {
    if($event.target.checked){
      this.params.api.forEachNode(node => {
        node.setSelected(true)
      })
    }
    else{
      this.params.api.forEachNode(node => {
        node.setSelected(false)
      })
    }
    this.cd.markForCheck();
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.retrivevalue.unsubscribe()
  }
}
