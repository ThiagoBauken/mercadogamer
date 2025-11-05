import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorHandler, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
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

// Material Design

// import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

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
import { TicketsComponent } from './modules/tickets/tickets.component';
import { ProductsComponent } from './modules/products/products.component';
import { SellsComponent } from './modules/sells/sells.component';
import { RetreatsComponent } from './modules/retreats/retreats.component';
import { PersonalizeComponent } from './modules/personalize/personalize.component';
import { FeedbackComponent } from './modules/feedback/feedback.component';
import { StatisticsComponent } from './modules/statistics/statistics.component';
import { DiscountComponent } from './modules/discount/discount.component';
import { ProfitsComponent } from './modules/profits/profits.component';
import { LoginComponent } from './modules/login/login.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { FiltersComponent } from './modules/filters/filters.component';
import { ProductDetailComponent } from './modules/product-detail/product-detail.component';
import { PurchaseComponent } from './modules/purchase/purchase.component';
import { TopmenuComponent } from './modules/shared/topmenu/topmenu.component';
import { FooterComponent } from './modules/shared/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ProductRejectDialogComponent } from './modules/products/product-reject-dialog/product-reject-dialog.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SearchProductsComponent } from './modules/personalize/search-products/search-products.component';
// widgets
import { CategoryItemComponent } from './widgets/category-item/category-item.component.';
import { MercadoInputComponent } from './widgets/mercado-input/mercado-input.component';
import { SearchComponent } from './widgets/search/search.component';
import { NavBarComponent } from './widgets/nav-bar/nav-bar.component';
import { UsersComponent } from './modules/users/users.component';
import { LoadingComponent } from './widgets/loading/loading.component';
import { UserViewComponent } from './modules/user-view/user-view.component';
import { PagenationComponent } from './widgets/pagenation/pagenation.component';
import { ButtonComponent } from './widgets/button/button.component';
import { UserCategorySalesComponent } from './widgets/user-cagetory/user-category-sales/user-category-sales.component';
import { UserCategoryProductsComponent } from './widgets/user-cagetory/user-category-products/user-category-products.component';
import { UserCategoryTicketsComponent } from './widgets/user-cagetory/user-category-tickets/user-category-tickets.component';
import { UserCategoryWithdrawalsComponent } from './widgets/user-cagetory/user-category-withdrawals/user-category-withdrawals.component';
import { OrderStatusIconComponent } from './widgets/order-status-icon/order-status-icon.component';
import { MercadoDialogComponent } from './widgets/mercado-dialog/mercado-dialog.component';
import { StatusCardComponent } from './modules/statistics/widgets/status-card/status-card.component';
import { SearchKeyComponent } from './modules/searchkeywords/searchkeywords.component';

const config: SocketIoConfig = { url: environment.chatUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TopmenuComponent,
    FooterComponent,
    TicketsComponent,
    ProductsComponent,
    SellsComponent,
    RetreatsComponent,
    PersonalizeComponent,
    FeedbackComponent,
    StatisticsComponent,
    DiscountComponent,
    ProfitsComponent,
    PurchaseComponent,
    FiltersComponent,
    LoginComponent,
    ProfileComponent,
    ProductDetailComponent,
    ProductRejectDialogComponent,
    SearchProductsComponent,
    CategoryItemComponent,
    MercadoInputComponent,
    SearchComponent,
    NavBarComponent,
    UsersComponent,
    LoadingComponent,
    UserViewComponent,
    PagenationComponent,
    ButtonComponent,
    UserCategorySalesComponent,
    UserCategoryProductsComponent,
    UserCategoryTicketsComponent,
    UserCategoryWithdrawalsComponent,
    OrderStatusIconComponent,
    MercadoDialogComponent,
    StatusCardComponent,
    SearchKeyComponent,
  ],
  imports: [
    PipesModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config),
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

    DpDatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    NgApexchartsModule,
  ],
  exports: [
    // HttpModule,
  ],
  providers: [
    { provide: ErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-AR' },

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
})
export class AppModule {}
