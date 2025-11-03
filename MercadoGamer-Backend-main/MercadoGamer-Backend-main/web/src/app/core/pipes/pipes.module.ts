import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency.pipe';
import { TimeagoPipe } from './timeago/timeago.pipe';

@NgModule({
    declarations: [
        CurrencyPipe,
        TimeagoPipe
    ],
    imports: [],
    exports: [
        CurrencyPipe,
        TimeagoPipe
    ],
    providers: []
})
export class PipesModule {}
