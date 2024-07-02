import { Global, Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [
        ValidationService,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        }
    ],
    exports: [ValidationService]
})
export class CommonModule { }
