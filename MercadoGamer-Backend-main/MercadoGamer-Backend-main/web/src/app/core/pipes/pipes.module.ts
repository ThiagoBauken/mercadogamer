import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from './currency/currency.pipe';
import { TimeagoPipe } from './timeago/timeago.pipe';

@NgModule({
    declarations: [
        CurrencyPipe,
        TimeagoPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        CurrencyPipe,
        TimeagoPipe
    ],
    providers: []
})
export class PipesModule {}
