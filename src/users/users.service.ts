import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateUsertDto } from "src/dto/users/update-user.dto";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User> ) {}

    getAll() {
        return this.userModel.find();
    }

    async getAllAdmins() {
        return this.userModel.find({isAdmin: true});
    }

    async getById(id: string) {
        return this.userModel.findById(id);
    }

    async delete(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }

    async update(id: string, user: UpdateUsertDto) {
        return this.userModel.findByIdAndUpdate(id, user, {new: true});
    }

}