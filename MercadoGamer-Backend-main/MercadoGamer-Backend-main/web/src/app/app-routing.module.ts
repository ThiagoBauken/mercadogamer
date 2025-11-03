import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { HttpGuard } from './core/http.guard';
import { LoginComponent } from './modules/login/login.component';
import { Settings } from './app.settings';
import { RegisterComponent } from './modules/register/register.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { SelectCountryComponent } from './modules/select-country/select-country.component';
import { CatalogueComponent } from './modules/catalogue/catalogue.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { PurchaseComponent } from './modules/purchase/purchase.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ProductDetailComponent } from './modules/product-detail/product-detail.component';
import { HelpComponent } from './modules/help/help.component';
import { SaleComponent } from './modules/sale/sale.component';
import { MyAccountComponent } from './modules/my-account/my-account.component';
import { ProductTypeComponent } from './modules/product-type/product-type.component';
import { ProductAddComponent } from './modules/product-add/product-add.component';
import { ProductEditComponent } from './modules/product-edit/product-edit.component';
import { TermsComponent } from './modules/terms/terms.component';
import { PrivacyComponent } from './modules/privacy/privacy.component';
import { MobileComponent } from './modules/mobile/mobile.component';
import { RecoverPasswordComponent } from './modules/recover-password/recover-password.component';
import { VerificationCodeComponent } from './modules/verification-code/verification-code.component';
import { AddPhoneComponent } from './modules/add-phone/add-phone.component';

// Settings.routes.root.component = LandingPageComponent;
Settings.routes.home.component = HomeComponent;
Settings.routes.login.component = LoginComponent;
Settings.routes.register.component = RegisterComponent;
Settings.routes.selectCountry.component = SelectCountryComponent;
Settings.routes.catalogue.component = CatalogueComponent;
Settings.routes.catalogueFiltered.component = CatalogueComponent;
Settings.routes.checkout.component = CheckoutComponent;
Settings.routes.purchase.component = PurchaseComponent;
Settings.routes.profile.component = ProfileComponent;
Settings.routes.productDetail.component = ProductDetailComponent;
Settings.routes.help.component = HelpComponent;
Settings.routes.sale.component = SaleComponent;
Settings.routes.myAccount.component = MyAccountComponent;
Settings.routes.productType.component = ProductTypeComponent;
Settings.routes.productAdd.component = ProductAddComponent;
Settings.routes.productEdit.component = ProductEditComponent;
Settings.routes.terms.component = TermsComponent;
Settings.routes.privacy.component = PrivacyComponent;
Settings.routes.mobile.component = MobileComponent;
Settings.routes.recoverPassword.component = RecoverPasswordComponent;
Settings.routes['verification-code'].component = VerificationCodeComponent;
Settings.routes['add-phone'].component = AddPhoneComponent;

const routes: Routes = [];
for (const key of Object.keys(Settings.routes)) {
  const route = { ...Settings.routes[key] };
  if (route.data) {
    route.canActivate = [HttpGuard];
  }
  routes.push(route);
}

// routes.push({
//   path: 'pay',
//   loadChildren: () => import('./modules/pay/pay.module').then(m => m.PayPageModule)
// });

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
