import { BrowserModule } from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { ErrorHandler, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IconsModule } from 'angular-bootstrap-md';
import { SwiperModule } from 'swiper/angular';
registerLocaleData(localeEs);

// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { DpDatePickerModule } from 'ng2-date-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { QRCodeModule } from 'angularx-qrcode';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { MapComponent } from './core/components/map/map.component';
import { TopmenuComponent } from './modules/shared/topmenu/topmenu.component';
import { FooterComponent } from './modules/shared/footer/footer.component';
import { RegisterComponent } from './modules/register/register.component';
import { CatalogueComponent } from './modules/catalogue/catalogue.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { PurchaseComponent } from './modules/purchase/purchase.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { HelpComponent } from './modules/help/help.component';
import { RecoverPasswordComponent } from './modules/recover-password/recover-password.component';
import { SaleComponent } from './modules/sale/sale.component';
import { TermsComponent } from './modules/terms/terms.component';
import { MobileComponent } from './modules/mobile/mobile.component';
import { PrivacyComponent } from './modules/privacy/privacy.component';
import { MyAccountComponent } from './modules/my-account/my-account.component';
import { ProductDetailComponent } from './modules/product-detail/product-detail.component';
import { SelectCountryComponent } from './modules/select-country/select-country.component';
import { ProductTypeComponent } from './modules/product-type/product-type.component';
import { ProductAddComponent } from './modules/product-add/product-add.component';
import { ProductEditComponent } from './modules/product-edit/product-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CataloguePopupComponent } from './modules/shared/catalogue-popup/catalogue-popup.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NavService } from './modules/shared/nav.service';
import { SideNavItemComponent } from './modules/shared/side-nav-item/side-nav-item.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SaleCardComponent } from './widgets/sale-card/sale-card.component';
import { ProductsComponent } from './widgets/products/products.component';
import { LoadingComponent } from './widgets/loading/loading.component';
import { ProductCardComponent } from './widgets/product-card/product-card.component';
import { ButtonComponent } from './widgets/button/button.component';
import { PuchasesComponent } from './widgets/puchases/puchases.component';
import { CategoryItemComponent } from './widgets/category-item/category-item.component';
import { PurchaseCardComponent } from './widgets/purchase-card/purchase-card.component';
import { ProductInformationComponent } from './widgets/product-information/product-information.component';
import { SalesComponent } from './widgets/sales/sales.component';
import { CardProductTypeComponent } from './widgets/card-product-type/card-product-type.component';
import { WithdrawComponent } from './widgets/withdraw/withdraw.component';
import { MercadoDialogComponent } from './widgets/mercado-dialog/mercado-dialog.component';
import { MercadoInputComponent } from './widgets/mercado-input/mercado-input.component';
import { MercadoSelectComponent } from './widgets/mercado-select/mercado-select.component';
import { MercadoIconComponent } from './widgets/mercado-icon/mercado-icon.component';
import { VerificationCodeComponent } from './modules/verification-code/verification-code.component';
import { MercadoPhoneInputComponent } from './widgets/mercado-phone-input/mercado-phone-input.component';
import { SecurityComponent } from './widgets/security/security.component';
import { ChangePasswordComponent } from './widgets/change-password/change-password.component';
import { ChangePhoneComponent } from './widgets/change-phone/change-phone.component';
import { AddPhoneComponent } from './modules/add-phone/add-phone.component';
import { UseGiftsComponent } from './widgets/use-gifts/use-gifts.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { PagenationComponent } from './widgets/pagenation/pagenation.component';
// import { environmentProd } from 'src/environments/environment.prod';

const config: SocketIoConfig = { url: environment.chatUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TopmenuComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    MapComponent,
    RegisterComponent,
    SelectCountryComponent,
    CatalogueComponent,
    CheckoutComponent,
    PurchaseComponent,
    ProfileComponent,
    ProductDetailComponent,
    HelpComponent,
    SaleComponent,
    MyAccountComponent,
    ProductTypeComponent,
    ProductAddComponent,
    ProductEditComponent,
    TermsComponent,
    PrivacyComponent,
    MobileComponent,
    RecoverPasswordComponent,
    CataloguePopupComponent,
    SideNavItemComponent,
    SaleCardComponent,
    ProductsComponent,
    LoadingComponent,
    ProductCardComponent,
    ButtonComponent,
    PuchasesComponent,
    CategoryItemComponent,
    PurchaseCardComponent,
    ProductInformationComponent,
    SalesComponent,
    CardProductTypeComponent,
    WithdrawComponent,
    MercadoDialogComponent,
    MercadoInputComponent,
    MercadoSelectComponent,
    MercadoIconComponent,
    VerificationCodeComponent,
    MercadoPhoneInputComponent,
    SecurityComponent,
    ChangePasswordComponent,
    ChangePhoneComponent,
    AddPhoneComponent,
    UseGiftsComponent,
    LandingPageComponent,
    PagenationComponent,
  ],
  imports: [
    PipesModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    QRCodeModule,
    SwiperModule,
    // NgxMatDatetimePickerModule,
    // NgxMatTimepickerModule,
    // NgxMatNativeDateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MDBBootstrapModule.forRoot(),
    IconsModule,
    NgxMaterialTimepickerModule,
    SocketIoModule.forRoot(config),

    DpDatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    SlickCarouselModule,
    NgxSliderModule,
    NgApexchartsModule,
  ],
  exports: [
    // HttpModule,
  ],
  providers: [
    { provide: ErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    NavService,
    // {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    // {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},

    MatDatepickerModule,
    // NgxMatDatepicker
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
