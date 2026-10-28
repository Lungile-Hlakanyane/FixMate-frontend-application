import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './shared/components/home/home/home';
import { Footer } from './shared/components/footer/footer/footer';
import { Navbar } from './shared/components/navigation-bar/navbar/navbar';
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

@NgModule({
  declarations: [App, Home],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Footer,
    Navbar,
    RegisterComponent,
    OtpComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    ProfessionalDashboardComponent,
    MyJobsComponent,
    EarningsComponent,
    AdminDashboardComponent,
    ManageUsersComponent,
    AdminPayoutsComponent,
    ProrequestsComponent,
    // BannerUserComponenent
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
