import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [DatePipe,CommonModule,MatPaginatorModule,MatSortModule,MatInputModule,MatTableModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
 
  userList: any[] = []; 
  displayedColumns: string[] = ['sno', 'name', 'phone', 'eventTime', 'eventName', 'tickets', 'id'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      // Safely access localStorage
      const storedUsers = localStorage.getItem('registrations');
      if (storedUsers) {
        this.userList = JSON.parse(storedUsers);
      }
    }
    this.dataSource = new MatTableDataSource(this.userList);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
