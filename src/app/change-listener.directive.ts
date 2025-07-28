import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeListener]'
})
export class ChangeListenerDirective {
  @Input() fieldArgs: any;
  @Output() fieldChange = new EventEmitter<any>();

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    this.fieldChange.emit({ event, fieldArgs: this.fieldArgs });
  }
}
