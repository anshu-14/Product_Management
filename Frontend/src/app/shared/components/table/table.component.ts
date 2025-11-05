import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'app-table',
  imports: [TableModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() columns=[];
  @Input() rows=[];
  @Input() loading=false;
  @Output() toggleStatus=new EventEmitter<any>();
  
  onToggleActive(row: any) {
    this.toggleStatus.emit( row );
  }
  
}
