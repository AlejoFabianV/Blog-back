import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Post } from "src/schemas/post.schema";
import { User } from "src/schemas/user.schema";
import { CreatePostDto } from "src/dto/posts/create-post.dto";
import { UpdatePostDto } from "src/dto/posts/update-post.dto";
import { FilterPostDto } from "src/dto/posts/filter-post.dto";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User> ,
        @InjectModel(Post.name) private postsModel: Model<Post>) { }

    async filterPosts(params?: FilterPostDto) {
        try {
            let filters: FilterQuery<Post> = {};
            const { title, author, description, category, limit = 10, offset = 0 } = params;
            if(params) {
                if(title) {
                    filters = {
                        title: {
                            $regex: title,
                            $options: 'i',
                        },
                        ...filters,
                    };
                }
                if(author) {
                    filters = {
                        author: {
                            $regex: author,
                            $options: 'i',
                        },
                        ...filters,
                    };
                }
                if(description) {
                    filters = {
                        description: {
                            $regex: description,
                            $options: 'i',
                        },
                        ...filters,
                    };
                }
                if(category) {
                    filters = {
                        category: {
                            $regex: category,
                            $options: 'i',
                        },
                        ...filters,
                    };
                }
            }
            const records = await this.postsModel.find(filters).limit(limit).skip(offset * limit).exec();
            const totalPosts = await this.postsModel.countDocuments(filters).exec();

            return {
                records,
                totalPosts
            };
        } catch (error) { }
        return await this.postsModel.find().exec();
    }

    async isOwner(username: string, author: string) {
        const user = this.userModel.findOne({ username });
        const post = this.postsModel.findOne({ author });

        if(user && post && (await user).username.toString() === (await post).author.toString()) {
            return true;
        }
        return false;
    }

    async getById(id: string) {
        return this.postsModel.findById(id);
    }

    async getAllForAuthor(author: string) {
        return this.postsModel.find({ author });
    }

    async create(createPost: CreatePostDto) {
        const newPost = new this.postsModel(createPost);
        return newPost.save();
    }

    async delete(id: string) {
        return this.postsModel.findByIdAndDelete(id);
    }

    async update(id: string, post: UpdatePostDto) {
        return this.postsModel.findByIdAndUpdate(id, post, { new: true });
    }

}