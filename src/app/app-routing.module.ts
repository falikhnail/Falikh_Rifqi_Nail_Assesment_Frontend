import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Halaman awal mengarah ke login
  { path: 'login', component: LoginComponent },
  { path: 'data', component: DataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}