import { 
    Controller, 
    Request, 
    Post, 
    UseGuards, 
    Get,
    Body, 
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterUsertDto } from "src/dto/users/register-user.dto";
import { LoginUsertDto } from "src/dto/users/login-user.dto";;

@ApiTags('registro y autenticacion')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiResponse({status: 201, description: 'usuario registrado'})
    @ApiResponse({status: 401, description: 'unauthorized, este nombre de usuario ya existe'})
    @Post('users')
    register(@Body() registerDto: RegisterUsertDto) {
        return this.authService.register(registerDto);
    }

    @ApiResponse({status: 201, description: 'token de autenticacion'})
    @ApiResponse({status: 401, description: 'unauthorized'})
    @UseGuards(LocalAuthGuard)
    @Post('users/login')
    login(@Body() loginDto: LoginUsertDto) { 
        return this.authService.login(loginDto);
    }

    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'perfil de administrador'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin/profile')
    @Roles('admin')
    async getProfileAdmin(@Request() req) {
        return req.user;
    }

    @ApiResponse({status: 200, description: 'perfil de usuario'})
    @ApiResponse({status: 401, description: 'unauthorized'})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}