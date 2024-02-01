import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/schemas/user.schema";


@Injectable()
export class RolesGuard implements CanActivate { 
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string>('roles',context.getHandler());
        if(!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (typeof user.isAdmin === 'boolean') {
            return user.isAdmin; 
        }
        return false; 
    }
} 