import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-orderformdelete',
  templateUrl: './orderformdelete.component.html',
  styleUrls: ['./orderformdelete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderformdeleteComponent implements OnInit {
  gridapi: any;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  public params:any
  private valueGetter: (rowNode: RowNode) => any
  public text: string = ''
  @ViewChild('input', { read: ViewContainerRef }) public input
  agInit(param): void {
    this.params = param
    this.gridapi=param.api
  }
  deleteorder(){ }
}
