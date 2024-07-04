import { Global, Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CacheModule.register({
            isGlobal: true
        })
    ],
    providers: [
        ValidationService,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
    exports: [ValidationService]
})
export class CommonModule { }
