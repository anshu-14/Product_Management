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
  @Input() columns = [];
  @Input() rows = [];
  @Input() loading = false;
  @Input() hasAction = false;
  @Output() toggleStatus = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  @Input() totalRecords = 0;
  @Input() rowsPerPage = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];
  @Input() first = 0;
  @Output() pageChange = new EventEmitter();

  onToggleActive(row: any) {
    this.toggleStatus.emit(row);
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  onLazyLoad(event: any) {
    const page = Math.floor(event.first / event.rows) + 1;
    const size = event.rows;
    this.pageChange.emit({
      page,
      size,
      sortField: event.sortField,
      sortOrder: event.sortOrder, 
      filters: event.filters,
    });
  }
}
