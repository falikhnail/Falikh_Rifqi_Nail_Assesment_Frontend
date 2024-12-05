import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  data: any[] = [];
  apiUrl = 'https://dev.patriotmed.id/BannerAds/Package/List'; // Ganti dengan URL API yang sesuai
  newData = {
    package_name: '',
    package_description: '',
    package_price: null,
    package_duration: null
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Cek token login pada localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You are not logged in!');
      this.router.navigate(['/login']);
    } else {
      this.fetchData();
    }
  }

  // Fungsi untuk mengambil data dari API
  fetchData() {
    this.http.get(this.apiUrl).subscribe({
      next: (response: any) => {
        this.data = response;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  // Fungsi untuk menambahkan data
  addData(event: Event) {
    event.preventDefault();
    const postData = {
      package_name: this.newData.package_name,
      package_description: this.newData.package_description,
      package_price: this.newData.package_price,
      package_duration: this.newData.package_duration
    };

    // Misalnya, kirim data ke API untuk ditambahkan
    this.http.post(this.apiUrl, postData).subscribe({
      next: (response) => {
        this.data.push(response);
        alert('Data added successfully!');
        this.newData = { package_name: '', package_description: '', package_price: null, package_duration: null }; // Clear form
      },
      error: (err) => {
        console.error('Error adding data:', err);
      }
    });
  }

  // Fungsi untuk menghapus data berdasarkan ID
  deleteItem(id: string) {
    // Misalnya, hapus data dari API
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.data = this.data.filter(item => item.id !== id);
        alert('Data deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting data:', err);
      }
    });
  }

  // Fungsi untuk mengekspor data ke PDF
  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Data Report', 10, 10);
    autoTable(doc, {
      head: [['#', 'Package Name', 'Price', 'Duration']],
      body: this.data.map((item, index) => [
        index + 1,
        item.package_name,
        item.package_price,
        item.package_duration
      ])
    });
    doc.save('data-report.pdf');
  }

  // Fungsi untuk mengekspor data ke Excel
  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Report');
    XLSX.writeFile(workbook, 'data-report.xlsx');
  }
}
