import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Put, 
    Request,
    UseGuards 
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUsertDto } from "src/dto/users/update-user.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService ) {}

    @ApiResponse({status: 200, description: 'usuarios administradores'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin')
    @Roles('admin')
    async getAllUsersAdmin() {
        return await this.usersService.getAllAdmins()
    }

    @ApiResponse({status: 200, description: 'usuarios administradores'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('admin/:id')
    @Roles('admin')
    async deleteByAdmin(@Param('id') id: string) {
        const user = this.usersService.delete(id)
        return user;
    }

    @ApiResponse({status: 200, description: 'todos los usuarios'})
    @Get()
    getAllUsers() {
        return this.usersService.getAll();
    }

    @ApiResponse({status: 200, description: 'usuario por id'})
    @ApiResponse({status: 404, description: 'usuario no encontrado'})
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        try {
            const user = this.usersService.getById(id);
            return user;
        } catch (error) {
            return 'usuario no encontrado';
        }
    }

    // @UseGuards(JwtAuthGuard, LocalAuthGuard)
    // @Put(':id')
    // @Roles('admin', 'owner')
    // async updateUser(@Param('id') userId: string, @Request() req, @Body() body: UpdateUsertDto) {
    //     const username = req.user.userId;
    
    //     if (typeof req.user.isAdmin || await this.usersService.isOwner(username, userId)) {
    //         return await this.usersService.update(userId, body);
    //     } else {
    //         throw new UnauthorizedException('No tiene permisos para editar este usuario');
    //     }
    // }

    @ApiResponse({status: 200, description: 'usuario editado'})
    @Put(':id')
    async update(@Param('id') userId: string, @Request() req, @Body() body: UpdateUsertDto) {
        return await this.usersService.update(userId, body)
    }
}