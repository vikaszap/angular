import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, HostListener, AfterViewInit, NgZone } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { OrderformService } from '../../orderform/orderform.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {  form, OrderformpopupComponent } from '../orderformpopup.component';
declare var $: any
 
@Component({
  selector: 'app-combrogrid',
  templateUrl: './combrogrid.component.html',
  styleUrls: ['./combrogrid.component.css']
})
export class CombrogridComponent implements OnInit,AfterViewInit  {
  // @Input() form: boolean = false;
  @Input() form!: FormGroup;
  @Input() prop!: any;
  @Input() res!: any;
  @Input() index!: number;
  @Input() disableFields: boolean = false;
  @Input() staticArrayData!: any;
  @Input() forms: form[]=[] 
  @Input() loadingIndex: number
  @Input() rulesBaseDisableSave
  @Input() diableComboRow
  @Input() onllineaftersubmitordereditflag
  pageCount = 1
  hasNextPage = true
  combofabricIds = [5,19,22]
  combocolorIds = [20]
  @ViewChild('comboRef', { static: true }) comboRef!: ElementRef;
  public onOpenPanel: boolean = false
  public currentFiledID;
  comboFilterData: any = {}
  private searchSubject = new Subject<string>();
  public currentIndex;
  
  selectedcompindex: any
  selectedoption: any = []
 
  @Output() actionTriggered = new EventEmitter<{ mode: string; data?: any }>();
  comboInitialized = false;
  observer!: IntersectionObserver;
  // observer!: MutationObserver;
  public fullGridObject = {}
  constructor(public orderser: OrderformService,private orderForm: OrderformpopupComponent,private host: ElementRef,private zone: NgZone) {
   
  }
  ngOnInit(): void { 
     this.searchSubject.pipe(
        debounceTime(500), // Adjust the debounce time as needed (in milliseconds)
      ).subscribe((value:any) => {
        this.comboFilterData = JSON.parse(value)
        if($('#comboGrid'+this.comboFilterData.fieldid).data('openPanel')){
          this.actionTriggered.emit({
          mode: 'globalSearch',
          data: {
            index : this.index,
            filterData: this.comboFilterData
          }
        });
        }
      });
  }
 
  ngAfterViewInit(): void {
  }
 
  ngOnDestroy() {
    this.loadingIndex = undefined
    const $panel = $("#comboPanel_" + this.res.fieldid);
    if ($panel.length) {
        $panel.closest('.panel').remove();
      }
  }
 
  focusCancel = false
  focusSave = false
  qtyChange = false;
  editingIndex = false;
  scroll = true
  scrollPosition = 0;
  maxScrollPosition = 0;
   handleShowPanel(index,res) {
    this.onOpenPanel = true
    const comboId = `#comboGrid${index}`;
    const panel = $(comboId).combo('panel');
    this.currentFiledID = res.fieldid
    this.comboFilterData = {};
    this.currentIndex = this.index;
    this.selectedcompindex = this.index;
    this.pageCount = 1;
    this.hasNextPage = true;
    this.focusCancel = false;
    this.focusSave = false;
    this.qtyChange = false;
    this.editingIndex = undefined;
    $(comboId).data('openPanel', true);
    $(comboId).data('saveCall', false);
    // Initialize panel once
    if (panel.find(`#fullPanel${index}`).length == 0) {
      const buttonHTML = `<div class="fullPanel" id="fullPanel${index}" style="padding:5px; display: flex; margin-top:2px; position: absolute; left:1px; right:1px; justify-content: flex-end; gap: 12px; border-top:1px solid var(--grey)">
              ${res.fieldtypeid == "33"
          ? `
                  <div style="display: flex;justify-content: space-between; width: 100%;">
                  <div>
                  <button type="button" id="battenSave" class="Newaddbtn mr-2 addBattens" >Add Custom Battens</button></div>
                  <div>
                    <button class="greenbtn Newsavebtn saveButton saveBtn mr-3" id="saveButton${index}" data-options="plain:true">Ok</button>
                    <button class="Newcancelbtn cancelbutton cancelBtn" id="cancelButton${index}" data-options="plain:true">Cancel</button>
                    </div>
                    </div>`
          : res.selection == 1
            ? `<button class="greenbtn Newsavebtn saveButton saveBtn" id="saveButton${index}" data-options="plain:true">Ok</button>
                      <button class="Newcancelbtn cancelbutton cancelBtn" id="cancelButton${index}" data-options="plain:true">Cancel</button>`
            : `<button class="Newcancelbtn cancelbutton cancelBtn" id="cancelButton${index}" data-options="plain:true">Cancel</button>`
        }</div>`;
 
      $(buttonHTML).appendTo(panel);
    }
    // Cancel button
    $(document).off("click", `#fullPanel${index} .cancelBtn`).on("click", `#fullPanel${index} .cancelBtn`, () => {
      this.qtyChange = false;
      $(comboId).data('saveCall', "cancel");
      // $(comboId).combogrid('setValues', res.optiondefault.split(",")); //LA-I3383
      $(comboId).data('openPanel', false);
      $(comboId).combo('hidePanel');
      $(comboId).combogrid('textbox').focus();
    });
    // Save button
    if (res.selection == "1") {
      $(document).off("click", `#fullPanel${index} .saveBtn`).on("click", `#fullPanel${index} .saveBtn`, () => {
        this.qtyChange = false;
        const grid = $(comboId).combogrid('grid');
        this.orderser.orderqtychanges.next(null)
        grid.datagrid('endEdit', this.editingIndex);
        this.editingIndex = undefined;
        const selectedRows = grid.datagrid('getSelections');
        res.optiondefault = selectedRows.map(x => x.optionid).toString();
        let get = $('#comboGrid' + index).combogrid('grid').datagrid('getSelections').find(x => x.subdatacount > 0)
        if (get) {
          $(`#spinnerId${index} .loading_spinner`).addClass("showLoader")
          this.actionTriggered.emit({
            mode: 'enabledisable',
           data: {index : index}
          });
          this.loadingIndex = index
        }
        if (res.fieldtypeid == "33") {
          let number = selectedRows.length
          setTimeout(() => {
            $('#comboGrid' + index).combogrid('setText', number ? `${number} Selected` : "");
          }, 100);
        }
        this.orderser.orderqtychanges.next(null);
        $(comboId).data('saveCall', true);
        $(comboId).data('openPanel', false);
        $(comboId).combo('hidePanel');
        $(comboId).combogrid('textbox').focus();
        $(`#comboGrid${index}`).parent().find('.textbox.easyui-fluid.combo').removeClass('validationComboInput');
        this.actionTriggered.emit({
          mode: 'save',
          data: {index:this.index,fieldid:index}
        });
      });
    }
    $(document).off("click", `#fullPanel${index} .addBattens`).on("click", `#fullPanel${index} .addBattens`, () => {
      this.qtyChange = false;
      // this.addBattens()
      this.actionTriggered.emit({
        mode: 'addBattens',
        data: {}
      });
      $(comboId).combo('hidePanel');
    })
    // Focus handling
    $(document).off("focusin", `#fullPanel${index} .cancelBtn`).on("focusin", `#fullPanel${index} .cancelBtn`, (e) => {
      e.preventDefault();
      this.focusCancel = true;
    });
    $(document).off("focusin", `#fullPanel${index} .saveBtn`).on("focusin", `#fullPanel${index} .saveBtn`, (e) => {
      e.preventDefault();
 
      this.focusSave = true;
    });
    panel.off('keydown').on('keydown', (e) => {
      const combo = $(comboId);
      const grid = combo.combogrid('grid');
      const textbox = combo.combogrid('textbox');
      const key = e.key;
      if (e.keyCode == 27 && $('#comboGrid' + index).data('openPanel')) {
        $('#comboGrid' + index).combo('hidePanel');
         textbox.focus();
        return false
      } 
      if (e.shiftKey && key === "Tab" && this.focusSave) {
        e.preventDefault();
        textbox.focus();
        this.focusSave = false;
        //shift was down when tab was pressed
      }
      if (this.focusCancel) {
        e.preventDefault();
      }
      if (key === "Tab" && this.focusCancel) {
        this.focusCancel = false;
        if (e.shiftKey) {
          if (res.selection == 1) {
            $('#saveButton' + index).focus()
          } else {
            textbox.focus();
          }
        } else {
          textbox.focus();
        }
        return;
      }
      if (!this.focusCancel && this.editingIndex !== undefined) {
        if (key === "Enter" || key === "Tab") {
          this.orderser.orderqtychanges.next(null)
          grid.datagrid('endEdit', this.editingIndex);
          this.editingIndex = undefined;
          if (key === "Enter") {
            $(comboId).combogrid('textbox').focus();
            // eventBinding(index, res, e, "panelEnter");
          }
          return;
        }
      }
      if (this.focusCancel && key === "Enter") {
        combo.data('saveCall', "cancel");
        // combo.combogrid('setValues', res.optiondefault.split(",")); //LA-I3383
        combo.data('openPanel', false);
        combo.combo('hidePanel');
        textbox.focus();
      }
    });
    // this.scroll handler
    this.scroll = true;
    this.scrollPosition = 0;
    this.maxScrollPosition = 0;
 
   
 
    // Trigger initial fetch
    this.actionTriggered.emit({
      mode: 'component',
      data: {
        fieldId: res.fieldid,
        index: this.index,
        res: res
      }
    });
    $(comboId).combogrid('textbox').attr('autocomplete', 'off');
  }
  handleHidePanel(index,res) {
    // this.currentFiledID = undefined;
    const comboId = `#comboGrid${index}`;
    const grid = $(comboId).combogrid('grid');
    this.focusCancel = false;
    $(comboId).data('openPanel', false);
    $(comboId).data('filter', false);
    let selectedOptionIds = grid.datagrid('getSelections');
    if(((this.combofabricIds.includes(res.fieldtypeid) && res.fabricorcolor == 1) || (this.combocolorIds.includes(res.fieldtypeid) && res.fabricorcolor == 2)) && selectedOptionIds.length > 0 ){
      if(selectedOptionIds.length == 0){
          selectedOptionIds = res.optiondefault 
          ? res.pricegrpid 
          ? res.optiondefault+"_"+res.pricegrpid 
          : res.optionsvalue.filter(x => x.optionid == res.optiondefault)[0].optionid_pricegroupid  
          : []
      }else{
         selectedOptionIds = selectedOptionIds.map(x =>  x.optionid_pricegroupid.toString())
      }
    }else{
      selectedOptionIds = selectedOptionIds.map(x =>  x.optionid.toString())
      if(res.selection == 1){
          selectedOptionIds = res.optiondefault.split(",")
      }
    }
    $(comboId).combogrid('setValues', selectedOptionIds);
    if (res.fieldtypeid == "33") {
      $('#comboGrid' + index).combogrid('setText', selectedOptionIds.length != 0 ? `${selectedOptionIds.length} Selected` : "");
    }
    //  if ($(`#fullPanel${index}`).length) {
    $(`#fullPanel${index}`).remove();
    // }
    if (this.editingIndex != undefined) {
      grid.datagrid('endEdit', this.editingIndex);
      this.editingIndex = undefined;
      this.qtyChange = true
    }
    if (this.qtyChange) {
      this.orderser.orderqtychanges.next(null)
      setTimeout(() => {
        if (res.selection == "1") {
          this.actionTriggered.emit({
            mode: 'save',
            data: {}
          });
        } else {
          this.actionTriggered.emit({
            mode: 'rowclick',
            data: {  data : $('#comboGrid' + index).combogrid('grid').datagrid('getSelections')[0], index: this.index,fieldid :res.fieldid  }
          });
          //  this.orderForm.onRowClicked({ data: $('#comboGrid' + index).combogrid('grid').datagrid('getSelections')[0] })
        }
      }, 10);
    }
    this.actionTriggered.emit({
            mode: 'closePanelLoader',
            data: {index:index}
          });
    setTimeout(() => {
      this.onOpenPanel = false
    }, 0);
    
    var panel = $('#comboGrid' + index).combogrid('panel');
        var datagrid = $('div.datagrid-view2', panel).find('.datagrid-body');
        // Reset horizontal scroll to left
        datagrid.scrollLeft(0);
    // Reset this.scroll
    // grid.datagrid('getPanel')
    //   .find('div.datagrid-view2 div.datagrid-body')[0]
    //   .scrollTo(0, 0);
 
    this.scroll = false;
  }
  handleClickCell(rowIndex, field,index,res) {
     const comboId = `#comboGrid${index}`;
    const grid = $(comboId).combogrid('grid');
    if (this.editingIndex !== undefined) {
      $(comboId).combogrid('grid').datagrid('endEdit', this.editingIndex);
      this.orderser.orderqtychanges.next(null);
      this.editingIndex = undefined;
    }
    if (!res.editablecolumns.includes(field)) {
      this.editingIndex = undefined;
    }
    if (res.selection == "1" && res.editablecolumns.includes(field)) {
      const selected = grid.datagrid('getSelections');
      const isSelected = selected.some(row => grid.datagrid('getRowIndex', row) === rowIndex);
      isSelected ? grid.datagrid('unselectRow', rowIndex) : grid.datagrid('selectRow', rowIndex);
    } else {
      setTimeout(() => {
        // if(res.selection == "1"){
          const selected = grid.datagrid('getSelections');
          if(res.selection != "1" &&  res.optiondefault.split(",").length > 1){
            grid.datagrid('clearSelections');
            grid.datagrid('selectRow', rowIndex);
          }else{
            const isSelected = selected.some(row => grid.datagrid('getRowIndex', row) === rowIndex);
            if (!isSelected) {
              grid.datagrid('unselectRow', rowIndex);
            } else {
              if (res.selection != "1") grid.datagrid('clearSelections');
              grid.datagrid('selectRow', rowIndex);
            }
          }
        // }else{
        //   grid.datagrid('clearSelections');
        //   grid.datagrid('selectRow', rowIndex);
        // }
        if (res.fieldtypeid == "33") {
          let number = grid.datagrid('getSelections').length
          setTimeout(() => {
            $('#comboGrid' + index).combogrid('setText', `${number != 0 ? number : ""} Selected`);
          }, 100);
        }
        if (res.selection != "1" && this.editingIndex == undefined ) {
          const hasSubData = grid.datagrid('getSelections').some(x => x.subdatacount > 0);
         if (!hasSubData) {
            $(comboId).combogrid('textbox').focus();
          } else {
            $(`#spinnerId${index} .loading_spinner`).addClass("showLoader")
            this.actionTriggered.emit({
              mode: 'enabledisable',
              data: {index : index}
            });
            this.loadingIndex = index
          }
          this.qtyChange = false;
          this.orderser.orderqtychanges.next(null)
          $(comboId).data('saveCall', true);
          const data = grid.datagrid('getSelections')[0];
          this.actionTriggered.emit({
            mode: 'rowclick',
            data: {  data : data, index: this.index,fieldid :res.fieldid  }
          });
          // this.orderForm.onRowClicked({ data });
          $(`#comboGrid${index}`).parent().find('.textbox.easyui-fluid.combo').removeClass('validationComboInput');
          $(comboId).combo('hidePanel');
        }
      }, 500);
    }
  }
  handleSelect(index,res) {
    if (res.fieldtypeid == "33") {
      let number = $('#comboGrid' + index).combogrid('grid').datagrid('getSelections').length
      $('#comboGrid' + index).combogrid('setText', `${number ? number : ""} Selected`);
    }
  }
  handleAfterEdit(rowIndex, row, changes,index,res) {
    if (Object.keys(changes).length != 0) {
      this.qtyChange = true
      const comboId = `#comboGrid${index}`;
      let row = $(comboId).combogrid('grid').datagrid('getRows')[rowIndex];
      if (row.optionqty == "") {
        row.optionqty = "1"
        $(comboId).combogrid('grid').datagrid('updateRow', { index: index, row: row });
      }
      this.actionTriggered.emit({
        mode: 'afteredit',
        data: {
          rowIndex: rowIndex,
          row: row
        }
      });
      this.orderser.orderqtychanges.next(null)
    }
  }
  initialLoad(index,res,action?) {
    // setTimeout(() => {
    if (this.loadingIndex) return false;
    // setTimeout(() => {
      const comboId = '#comboGrid' + index;
      if ($('#comborArrow' + index + ' .suffix_downarrow').length > 0) {
        let optionid = ((this.combofabricIds.includes(res.fieldtypeid) && res.fabricorcolor == 1) || (this.combocolorIds.includes(res.fieldtypeid) && res.fabricorcolor == 2 )) ? "optionid_pricegroupid" : "optionid"
       const fullGridObject ={
         width: '100%',
         class: 'comboGridValidation',
         multiple: true,
         panelWidth: 600,
         remoteFilter: true,
         idField: optionid,
         textField: 'optionname',
         editable: true,
         method: "GET",
         selectOnNavigation: false,
         url: '',
         fitColumns: false,
         columns: this.setColoumData(res, index),
         loadMsg: "loading",
         emptyMsg: 'No Rows To Show',
         disabled: res?.ruleoverride == 0 || this.disableFields ? true : false,
         panelHeight: "280",
         checkOnSelect: true,
         selectOnCheck: true,
        //  value : this.res.optiondefault ? this.res.selection == 1 ? this.res.optiondefault.split(",") : this.res.optiondefault : "" ,
         onShowPanel: () => this.handleShowPanel(index,res),
         onHidePanel: () => this.handleHidePanel(index,res),
         onClickCell: (rowIndex: any, field: any, event) => this.handleClickCell(rowIndex, field,index,res),
         onSelect: () => this.handleSelect(index,res),
         onUnselect: () => this.handleSelect(index,res),
         onAfterEdit: (rowIndex, row, changes) => this.handleAfterEdit(rowIndex, row, changes,index,res),
         onDblClickCell: (rowIndex: any, field: any, event) => this.handleDblClickCell(rowIndex, field,index,res),
         keyHandler: {
           enter: (e) => {
             e.preventDefault();
             if ($(comboId).data('openPanel')) {
               this.eventBinding(index, res, { keyCode: 13 }, "panelEnter");
             }
           },
           up: (e) => $.fn.combogrid.defaults.keyHandler.up.call(this, e),
           down: (e) => {
             if (!$(comboId).data('openPanel')) $(comboId).combo('showPanel');
             $.fn.combogrid.defaults.keyHandler.down.call(this, e);
           },
           query: (q, e) => {
             if (!$(comboId).data('openPanel')) $(comboId).combo('showPanel');
             e.preventDefault(); // Prevent default filtering
           }
         },
      }
        $(comboId).combogrid(fullGridObject);
        $(comboId).combogrid('textbox').focus();
         $(comboId).combogrid('grid').datagrid('loadData', res.optionsvalue);
        let selcetvalue = res.combogriddata ? res.combogriddata.split(",") : res.optiondefault ? res.optiondefault.split(",") : []
        if( (this.combofabricIds.includes(res.fieldtypeid) &&  res.fabricorcolor == 1) || (this.combocolorIds.includes(res.fieldtypeid) && res.fabricorcolor == 2) ){
          selcetvalue = res.optiondefault ? [res.optionsvalue[0].optionid_pricegroupid] : []
        }
        $(comboId).combogrid('setValues', selcetvalue); 
        if(action == "arrow"){
            $('#comboGrid' + index).combo('showPanel');
        }
        $('#comborArrow' + index + ' .suffix_downarrow').remove();
        setTimeout(() => {
          const $panel = $(comboId).combo('panel');
            if ($panel.length) {
              $panel.attr('id', 'comboPanel_' + index); // 👈 Unique panel ID
            }
             $(comboId).combogrid('textbox').addClass('autocomplete_off')
              $panel.on('click', (event) => {
                if (this.editingIndex !== undefined) {
                   $(comboId).combogrid('grid').datagrid('endEdit', this.editingIndex);
                  this.orderser.orderqtychanges.next(null);
                  this.editingIndex = undefined;
                }
              });
          }, 0);
      }

    
    // Attach optimized input events
       
    $(comboId).combogrid('textbox').off('keydown').on('keydown', (e) => {
      $(comboId).combogrid('textbox')[0].setAttribute('autocomplete', 'off');
      if (this.loadingIndex ) {
        e.preventDefault()
      } else if (e.keyCode == 27 && $('#comboGrid' + index).data('openPanel')) {
        $('#comboGrid' + index).combo('hidePanel');
        $('#comboGrid' + index).combogrid('textbox').focus()
        return false
      } else if(($('#comboGrid' + index).data('openPanel') || e.keyCode == 40)) {
        this.eventBinding(index, res, e, "keydown")
      }
    });
    $(comboId).combogrid('textbox').off('keyup').on('keyup', (e) => {
      e.preventDefault();
      if (e.key != "Tab" && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 27 && !this.focusCancel ) {
        if($('#comboGrid' + index).data('openPanel')){
          this.eventBinding(index, res, e, "globalSearch")
        }else{
            $('#comboGrid' + index).combo('showPanel');
        }
      }
    })
    // setTimeout(() => {
      $(comboId).combogrid('textbox').off('focus').on('focus', (e) => {
         $(comboId).combogrid('textbox')[0].setAttribute('autocomplete', 'off');
      })
      let lastScrollTops = {}; // Store scrollTop by index or ID
      $(comboId).combogrid('grid').datagrid('getPanel')
        .find('div.datagrid-view2 div.datagrid-body')
        .each((i, el) => {
          // Use el (DOM element) directly — no `this`
          const $el = $(el);

          $el.off('scroll.verticalOnly') // Don't interfere with EasyUI
            .on('scroll.verticalOnly', (e) => {
              const scrollTop = e.currentTarget.scrollTop;
              const lastScrollTop = lastScrollTops[i] || 0;

              if (scrollTop !== lastScrollTop) {
                lastScrollTops[i] = scrollTop;
                this.eventBinding(i, res, e, 'scroll'); // or call your handler
              }
            });
        });
    // }, 1000);
  // },10);
  }
  handleDblClickCell(rowIndex, field,index,res) {
    const comboId = `#comboGrid${index}`;
    const grid = $(comboId).combogrid('grid');
    if (res.editablecolumns.includes(field)) {
      if (this.editingIndex === undefined) {
        this.editingIndex = rowIndex;
        grid.datagrid('beginEdit', rowIndex);
      } else {
        grid.datagrid('endEdit', this.editingIndex);
        this.editingIndex = rowIndex;
        this.orderser.orderqtychanges.next(null);
        grid.datagrid('beginEdit', rowIndex);
      }
    } else {
      if (this.editingIndex !== undefined) {
        grid.datagrid('endEdit', this.editingIndex);
        this.orderser.orderqtychanges.next(null);
        this.editingIndex = undefined;
      }
    }
  }
  public upkey: any
  public upIndex: any
  public downkey: any
  public downIndex: any
  public currentInd: any
  public text: any
  eventBinding(index, res, e, type) {
    if (type == "keydown" || type == "panelEnter") {
      if (e.key == "Tab") { // Tab Key
        if ($('#comboGrid' + index).data('openPanel')) {
          e.preventDefault();
          if ($('#comboGrid' + index).data('openPanel')) {
            // Prevent default tab behavior
            if (this.focusCancel) {
              $('#comboGrid' + index).combogrid('textbox').focus()
              this.focusCancel = false
            }
            res.selection == "1" ? $('#saveButton' + index).focus() : $('#cancelButton' + index).focus()
          }
        }
      }
      if (e.keyCode == 38) { // up key
        this.upkey = $('#comboGrid' + index).combogrid('grid').datagrid('getPanel').find('tr.datagrid-row-over').index();
        this.upIndex = this.upkey == 0 ? 0 : this.upkey - 1
        $('#comboGrid' + index).combogrid('grid').datagrid('highlightRow', this.upIndex);
      }
      if (e.keyCode == 40) { // down key
        if (!$('#comboGrid' + index).data('openPanel')) {
          $('#comboGrid' + index).combo('showPanel');
        } else {
          this.downkey = $('#comboGrid' + index).combogrid('grid').datagrid('getPanel').find('tr.datagrid-row-over').index();
          this.downIndex = ($('#comboGrid' + index).combogrid('grid').datagrid('getRows').length - 1) == this.downkey ? this.downkey : this.downkey + 1
          $('#comboGrid' + index).combogrid('grid').datagrid('highlightRow', this.downIndex);
        }
      }
      if (e.keyCode == 13) { // Enter key
        if ($('#comboGrid' + index).data('openPanel')) {
          this.currentInd = $('#comboGrid' + index).combogrid('grid').datagrid('getPanel').find('tr.datagrid-row-over').index();
          var isRowSelected = $('#comboGrid' + index).combogrid('grid').datagrid('getSelections').some((row) => {
            return $('#comboGrid' + index).combogrid('grid').datagrid('getRowIndex', row) === this.currentInd;
          });
          if(res.selection != "1" &&  res.optiondefault.split(",").length > 1){
              $('#comboGrid' + index).combogrid('grid').datagrid('clearSelections');
              $('#comboGrid' + index).combogrid('grid').datagrid('selectRow', this.currentInd)
           } else {
          if (isRowSelected) {
            $('#comboGrid' + index).combogrid('grid').datagrid('unselectRow', this.currentInd)
          } else {
            if (res.selection != "1") {
              $('#comboGrid' + index).combogrid('grid').datagrid('clearSelections');
            }
            $('#comboGrid' + index).combogrid('grid').datagrid('selectRow', this.currentInd)
          }
        }
          if (res.selection != "1" ) {
            this.qtyChange = false;
            $('#comboGrid' + index).data('saveCall', true)
            this.orderser.orderqtychanges.next(null)
            let get = $('#comboGrid' + index).combogrid('grid').datagrid('getSelections').find(x => x.subdatacount > 0)
            if (!get) {
              $('#comboGrid' + index).combogrid('textbox').focus()
            } else {
              $(`#spinnerId${index} .loading_spinner`).addClass("showLoader")
              this.actionTriggered.emit({
                mode: 'enabledisable',
                data: {index : index}
              
              });
              this.loadingIndex = index
            }
            this.actionTriggered.emit({
              mode: 'rowclick',
              data: {  data : $('#comboGrid' + index).combogrid('grid').datagrid('getSelections')[0], index: this.index,fieldid :res.fieldid  }
            });
            //  this.orderForm.onRowClicked({ data: $('#comboGrid' + index).combogrid('grid').datagrid('getSelections')[0] })
            $('#comboGrid' + index).combo('hidePanel');
            $(`#comboGrid${index}`).parent().find('.textbox.easyui-fluid.combo').removeClass('validationComboInput');
          }
          let selcetvalue = $('#comboGrid' + index).combogrid('grid').datagrid('getSelections').map(x => x.optionid).toString();
          if (res.fieldtypeid == "33") {
            let number = selcetvalue ? selcetvalue.split(",").length : ""
            setTimeout(() => {
              $('#comboGrid' + index).combogrid('setText', `${number} Selected`);
            }, 100);
          }
          // $('#comboGrid' + index).combogrid('setValues', selcetvalue); //LA-I3383
          $('#comboGrid' + index).combogrid('textbox').focus()
        }
      }
    }
    if (type == "globalSearch") {
      $('#comboGrid' + index).combo('showPanel');
      $('#comboGrid' + index).data('filter', true)
      this.hasNextPage = true
      let text = e.target.value.split(',').pop()
      if (!$('#comboGrid' + index).combogrid('grid').datagrid('getSelections').map(x => x.optionname).includes(text)) {
        this.searchSubject.next(JSON.stringify({ "value": e.target.value, "action": "globalFilter", "index": this.index,fieldid: res.fieldid  }));
      }
    }
    if (type == "scroll") {
      const element = event?.target as HTMLElement;
      if(element){
        this.scrollPosition = element?.scrollTop;
        this.maxScrollPosition = element?.scrollHeight - element?.clientHeight;
        if ( (this.scrollPosition &&  this.maxScrollPosition) && this.scrollPosition >= this.maxScrollPosition - 1 && this.scroll) {
          let selectedText = $('#comboGrid' + res.fieldid).combogrid('getText');
          this.scroll = false
          this.searchSubject.next(JSON.stringify({ "value": selectedText, "action": "scroll", "index": this.index,fieldid: res.fieldid }));
          setTimeout(() => {
            this.scroll = true
          }, 700);
        }
      }
    }
  }
  setColoumData(res, index) {
    var old_time1: any = Date.now()
    let headerData: any
    if (res.fieldtypeid == 3) {
      headerData = this.staticArrayData.find(x => x.field_type == res.fieldtypeid).headers;
    } else {
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
    const customOrder = res.fieldtypeid == 33 ? ["qty", "width", "depth", "length"] : res.fieldtypeid == 3 ? ['optionqty', 'optionname', 'optioncode'] : [];
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
        fixed: true,
        formatter: (value, row, index) => {
          return `<span title="${value}" matTooltip="${value}" [matTooltipPosition]="'below'"  > ${value ? value : ""} </span>`
        },
        // formatter:"formatWithTooltip",
        resizable: true,
      };
 
      if (editableSet.has(key)) {
        obj.editor = { type: 'text' };
      }
 
      columns.push(obj);
    }
    var new_time1: any = Date.now()
    return [columns]
  }
}
 