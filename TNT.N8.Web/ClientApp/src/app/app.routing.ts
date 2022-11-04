import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UserprofileComponent } from './userprofile/userprofile.component'

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'userprofile', component: UserprofileComponent, canActivate: [AuthGuard] },
      { path: 'forgot-pass', loadChildren: () => import('./forgot-pass/forgot-pass.module').then(m => m.ForgotPassModule) },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
      { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule), canActivate: [AuthGuard] },
      { path: 'asset', loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule), canActivate: [AuthGuard] },
      { path: 'salary', loadChildren: () => import('./salary/salary.module').then(m => m.SalaryModule), canActivate: [AuthGuard] },
    ])],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard]
})
export class AppRouting {
}
