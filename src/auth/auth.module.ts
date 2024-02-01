import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.register({ 
            secret: 'MXCy$M3+1uXcz%J+zfG,0rwxD5+t0',
            signOptions: { expiresIn: '3600s' },
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
        }
    ])
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
