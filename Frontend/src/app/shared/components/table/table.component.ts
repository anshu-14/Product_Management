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
  @Input() hasAction = false;
  @Output() toggleStatus=new EventEmitter();
  @Output() edit = new EventEmitter();   
  @Output() delete = new EventEmitter();
  
  onToggleActive(row: any) {
    this.toggleStatus.emit( row );
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }
  
}
