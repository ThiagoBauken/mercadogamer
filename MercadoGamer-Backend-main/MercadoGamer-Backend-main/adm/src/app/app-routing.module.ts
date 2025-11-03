import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpGuard } from './core/http.guard';
import { Settings } from './app.settings';
import { TicketsComponent } from './modules/tickets/tickets.component';
import { ProductsComponent } from './modules/products/products.component';
import { SellsComponent } from './modules/sells/sells.component';
import { RetreatsComponent } from './modules/retreats/retreats.component';
import { PersonalizeComponent } from './modules/personalize/personalize.component';
import { FeedbackComponent } from './modules/feedback/feedback.component';
import { StatisticsComponent } from './modules/statistics/statistics.component';
import { DiscountComponent } from './modules/discount/discount.component';
import { ProfitsComponent } from './modules/profits/profits.component';
import { FiltersComponent } from './modules/filters/filters.component';
import { LoginComponent } from './modules/login/login.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ProductDetailComponent } from './modules/product-detail/product-detail.component';
import { PurchaseComponent } from './modules/purchase/purchase.component';
import { UsersComponent } from './modules/users/users.component';
import { UserViewComponent } from './modules/user-view/user-view.component';
import { SearchKeyComponent } from './modules/searchkeywords/searchkeywords.component';

Settings.routes.tickets.component = TicketsComponent;
Settings.routes.products.component = ProductsComponent;
Settings.routes.sells.component = SellsComponent;
Settings.routes.retreats.component = RetreatsComponent;
Settings.routes.personalize.component = PersonalizeComponent;
Settings.routes.feedback.component = FeedbackComponent;
Settings.routes.statistics.component = StatisticsComponent;
Settings.routes.discount.component = DiscountComponent;
Settings.routes.profits.component = ProfitsComponent;
Settings.routes.filters.component = FiltersComponent;
Settings.routes.login.component = LoginComponent;
Settings.routes.profile.component = ProfileComponent;
Settings.routes.productDetail.component = ProductDetailComponent;
Settings.routes.purchase.component = PurchaseComponent;
Settings.routes.users.component = UsersComponent;
Settings.routes.userView.component = UserViewComponent;
Settings.routes.searchKey.component = SearchKeyComponent;

const routes: Routes = [];
// tslint:disable-next-line: forin
for (const routeKey in Settings.routes) {
  const route = Settings.routes[routeKey];

  const r: any = {};
  if (route.path || route.path === '') {
    r.path = route.path;
  }
  if (route.redirectTo) {
    r.redirectTo = route.redirectTo;
  }
  if (route.pathMatch) {
    r.pathMatch = route.pathMatch;
  }
  if (route.component) {
    r.component = route.component;
  }
  if (route.data) {
    r.data = route.data;
    r.canActivate = [HttpGuard];
  }
  routes.push(r);
}

// routes.push({
//   path: 'pay',
//   loadChildren: () => import('./modules/pay/pay.module').then(m => m.PayPageModule)
// });

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
