  import { ICellEditorParams } from 'ag-grid-community'
  import { ICellEditorAngularComp } from 'ag-grid-angular'
  import { AfterViewInit,Component,ViewChild,ViewContainerRef } from '@angular/core'
import { OrderformService } from '../orderform/orderform.service'
  const KEY_BACKSPACE = 'Backspace'
  const KEY_DELETE = 'Delete'
  const KEY_F2 = 'F2'
  const KEY_ENTER = 'Enter'
  const KEY_TAB = 'Tab'
  @Component({
    selector: 'numeric-cell',
    template: `<input #input (click)="clickevent()" (change)="onInputChange($event)" (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%" />`
  })
  export class NumericEditor implements ICellEditorAngularComp, AfterViewInit {
    constructor(public orderitem: OrderformService) { }
    private params: any
    public value!: number
    public highlightAllOnFocus = true
    private cancelBeforeStart = false
    @ViewChild('input', { read: ViewContainerRef })
    public input!: ViewContainerRef
    agInit(params: ICellEditorParams): void {
      this.params = params
      this.setInitialState(this.params)
      this.cancelBeforeStart = !!(
        params.charPress && '1234567890'.indexOf(params.charPress) < 0
      )
    }
    setInitialState(params: any) {
      let startValue
      let highlightAllOnFocus = true
      if (params.eventKey === KEY_BACKSPACE || params.eventKey === KEY_DELETE) {
        startValue = ''
      } 
      else if (params.charPress) {
        startValue = params.charPress
        highlightAllOnFocus = false
      } 
      else {
        startValue = params.value;
        if (params.eventKey === KEY_F2) {
          highlightAllOnFocus = false
        }
      }
      this.value = startValue
      this.highlightAllOnFocus = highlightAllOnFocus
    }
    getValue(): any {
      return this.value
    }
    isCancelBeforeStart(): boolean {
      return this.cancelBeforeStart
    }
    isCancelAfterEnd(): boolean {
      return this.value > 10000000000000000000
    }
    clickevent(){
      setTimeout(() => {
        this.orderitem.doubleclickflag = true
      })
    }
    onKeyDown(event: any): void {
      setTimeout(() => {
        this.orderitem.doubleclickflag = true
      })
      if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
        event.stopPropagation()
        return
      }
      if (!this.finishedEditingPressed(event) && !this.isKeyPressedNumeric(event)) {
        if (event.preventDefault) event.preventDefault()
      }
    }
    ngAfterViewInit() {
      window.setTimeout(() => {
       this.orderitem.doubleclickflag = true
        this.input.element.nativeElement.focus()
        if (this.highlightAllOnFocus) {
          this.input.element.nativeElement.select()
          this.highlightAllOnFocus = false
        } 
        else {
          const length = this.input.element.nativeElement.value ? this.input.element.nativeElement.value.length : 0
          if (length > 0) {
            this.input.element.nativeElement.setSelectionRange(length, length)
          }
        }
        this.input.element.nativeElement.focus()
      })
    }
    private isCharNumeric(charStr: string): boolean {
      const dotIndex = charStr.indexOf('.');

      if (dotIndex !== -1) {
        const decimalPart = charStr.substring(dotIndex + 1);
        return decimalPart.length <= 2 && /^\d*$/.test(decimalPart);
      }

      return /^\d*$/.test(charStr);
    }
    private isKeyPressedNumeric(event: any): boolean {
      const charStr = event.target.value
      return this.isCharNumeric(charStr.concat(event.key))
    }
    private deleteOrBackspace(event: any) {
      return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1
    }
    private isLeftOrRight(event: any) {
      return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1
    }
    private finishedEditingPressed(event: any) {
      const key = event.key
      return key === KEY_ENTER || key === KEY_TAB
    }
    onInputChange(event: any) {
      this.value = event.target.value;
      if (this.params.context?.onRowClicked) {
        this.params.context.onRowClicked(this.params);
      }
      this.orderitem.orderqtychanges.next(event);
    }
  }
  