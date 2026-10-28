import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './shared/components/home/home/home';
import { ServicesComponent } from './features/customer/services/services-component/services-component';
import { MyrequestsComponent } from './features/customer/my-requests/myrequests-component/myrequests-component';
import { Proffesionals } from './features/customer/proffesionals/proffesionals/proffesionals';
import { LoginComponent } from './features/auth/login/login-component/login-component';
import { RegisterComponent } from './features/auth/register/register-component/register-component';
import { OtpComponent } from './features/auth/otp/otp-component/otp-component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password-component/forgot-password-component';
import { NewPasswordComponent } from './features/auth/new-password/new-password-component/new-password-component';
import { ProfessionalDashboardComponent } from './features/provider/pro-dashboard/professional-dashboard-component/professional-dashboard-component';
import { MyJobsComponent } from './features/provider/my-jobs/my-jobs-component/my-jobs-component';
import { EarningsComponent } from './features/provider/earnings/earnings-component/earnings-component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard-component/admin-dashboard-component';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users-component/manage-users-component';
import { ManageJobsComponent } from './features/admin/manage-jobs/manage-jobs-component/manage-jobs-component';
import { AdminPayoutsComponent } from './features/admin/admin-payouts/admin-payouts-component/admin-payouts-component';
import { AdminServiceComponent } from './features/admin/admin-services/admin-service-component/admin-service-component';
import { AdminRequestsComponent } from './features/admin/admin-requests/admin-requests-component/admin-requests-component';
import { ProrequestsComponent } from './features/provider/pro-rerequests/prorequests-component/prorequests-component';
import { BannerUserComponenent } from './shared/components/banned/banner-user-componenent/banner-user-componenent';

const routes: Routes = [
  { path: '',component: Home},
  { path: 'home', component: Home},
  { path: 'services',component:ServicesComponent},
  { path: 'my-requests', component:MyrequestsComponent},
  { path: 'profesionals', component: Proffesionals},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'otp', component:OtpComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'new-password', component: NewPasswordComponent},
  { path: 'pro-dashboard', component: ProfessionalDashboardComponent},
  { path: 'my-jobs', component: MyJobsComponent},
  { path: 'earnings', component: EarningsComponent},
  { path: 'admin-dashboard', component:AdminDashboardComponent},
  { path: 'users', component: ManageUsersComponent},
  { path: 'manage-jobs', component: ManageJobsComponent},
  { path: 'admin-payouts', component:AdminPayoutsComponent},
  { path: 'admin-service',component: AdminServiceComponent},
  { path: 'admin-requests', component:AdminRequestsComponent},
  { path: 'pro-requests', component: ProrequestsComponent},
  { path: 'banner-user',component:BannerUserComponenent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}