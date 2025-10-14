import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowseComponent } from './browse/browse.component'; // ✅ Import student page
import { AuthGuard } from './auth.guard'; // optional

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] // optional
  },
  { 
    path: 'browse',
    component: BrowseComponent,
    canActivate: [AuthGuard] // optional
  }
];
