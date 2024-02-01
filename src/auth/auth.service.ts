import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import * as bcrypt from 'bcrypt';
import { RegisterUsertDto } from "src/dto/users/register-user.dto";
import { LoginUsertDto } from "src/dto/users/login-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async validateUser(username: string, createUsertDto: LoginUsertDto) {
        const user = await this.userModel.findOne({ username });
        
        if (user) {
            const passwordMatch = await bcrypt.compare(createUsertDto.password, user.password);

            if(passwordMatch) {
                return { username: user.username, isAdmin: user.isAdmin };
            }
        }
        return null;
    }

    async register({ username, password, isAdmin }: RegisterUsertDto) {
        const user = await this.userModel.findOne({username});

        if (user) {
            throw new BadRequestException('User already exists');
        }

        await this.userModel.create({
            username,
            isAdmin,
            password: await bcrypt.hash(password, 10),
        });

        return {
            username,
            isAdmin,
        };
    }

    async login(user: LoginUsertDto) {
        const userLogin = await this.validateUser(user.username, user);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { username: user.username, admin: userLogin.isAdmin };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}