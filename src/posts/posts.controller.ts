import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param,
    Post, 
    Put, 
    Query, 
    Request, 
    UnauthorizedException, 
    UseGuards 
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "src/dto/posts/create-post.dto";
import { UpdatePostDto } from "src/dto/posts/update-post.dto";
import { FilterPostDto } from "src/dto/posts/filter-post.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import {  ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('posteos')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }
    
    @ApiResponse({status: 200, description: 'todos los posteos'})
    @Get()
    async getAllPosts(@Query() params?: FilterPostDto) {
        return await this.postsService.filterPosts(params);
    }

    @ApiResponse({status: 200, description: 'posteos por busqueda'})
    @Get('search')
    async searchPost(@Query() params?: FilterPostDto) {
        return await this.postsService.filterPosts(params);
    }

    @ApiResponse({status: 200, description: 'posteos filtrados'})
    @Get('filter')
    async filterPost(@Query() params?: FilterPostDto) {
        return await this.postsService.filterPosts(params);
    }

    @ApiResponse({status: 200, description: 'post eliminado'})
    @ApiResponse({status: 401, description: 'no tienes permiso para eliminar este post'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':postId')
    @Roles('admin', 'owner') 
    async deletePost(@Param('postId') post: string, @Request() req) {
    const username = req.user.userId;

    if (typeof req.user.isAdmin || await this.postsService.isOwner(username, post)) {
        return await this.postsService.delete(post);
    } else {
        throw new UnauthorizedException('No tiene permisos para eliminar este post');
    }
    }

    @ApiResponse({status: 200, description: 'post actualizado'})
    @ApiResponse({status: 401, description: 'no tienes permiso para editar este post'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':postId')
    @Roles('admin', 'owner')
    async updatePost(@Param('postId') post: string, @Request() req, @Body() body: UpdatePostDto) {
        const username = req.user.userId;
    
        if (typeof req.user.isAdmin || await this.postsService.isOwner(username, post)) {
            return await this.postsService.update(post, body);
        } else {
            throw new UnauthorizedException('No tiene permisos para editar este post');
        }
    }

    @ApiResponse({status: 200, description: 'posteo especifico'})
    @ApiResponse({status: 404, description: 'post no encontrado'})
    @Get(':id')
    async getPostsById(@Param('id') id: string) {
        try {
            const post = await this.postsService.getById(id);
            return post; 
        } catch (error) {
            return 'post no encontrado'
        }
    }

    @ApiResponse({status: 200, description: 'posteo por author'})
    @ApiResponse({status: 404, description: 'autor no encontrado'})
    @Get('user/:userId')
    async getPostsByUserId(@Param('userId') author: string) {
        try {
            return await this.postsService.getAllForAuthor(author);
        } catch (error) {
            return 'autor no encontrado'
        }
    }

    @ApiResponse({status: 200, description: 'posteo creado'})
    @ApiResponse({status: 404, description: 'todos los campos son requeridos'})
    @Post()
    async create(@Body() body: CreatePostDto) {
        try {
            return await this.postsService.create(body);
        } catch (error) {
            return 'todos los campos son requeridos'
        }
    }
}