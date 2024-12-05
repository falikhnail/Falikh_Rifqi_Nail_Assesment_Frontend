import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  apiUrl = 'https://api.example.com/login'; // Ganti dengan URL API login yang sesuai

  constructor(private router: Router, private http: HttpClient) {}

  // Fungsi untuk menangani submit form login
  onSubmit(event: Event) {
    event.preventDefault();
    
    // Pastikan username dan password diisi
    if (!this.username || !this.password) {
      alert('Please fill in both username and password!');
      return;
    }

    // Data yang akan dikirim ke API untuk login
    const loginData = {
      username: this.username,
      password: this.password
    };

    // Lakukan request POST ke API untuk login
    this.http.post<any>(this.apiUrl, loginData).subscribe({
      next: (response) => {
        // Jika login berhasil, simpan token di localStorage
        if (response && response.authToken) {
          localStorage.setItem('authToken', response.authToken);
          alert('Login successful!');
          // Redirect ke halaman data setelah login
          this.router.navigate(['/data']);
        } else {
          alert('Invalid credentials, please try again.');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed, please try again.');
      }
    });
  }
}
