import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency.pipe';

@NgModule({
    declarations: [
        CurrencyPipe
    ],
    imports: [],
    exports: [
        CurrencyPipe
    ],
    providers: []
})
export class PipesModule {}
