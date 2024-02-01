import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "src/schemas/post.schema";
import { User, UserSchema } from "src/schemas/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Post.name,
                schema: PostSchema,
        }
    ]),
    MongooseModule.forFeature([
        {
            name: User.name,
            schema: UserSchema,
        }
    ]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}