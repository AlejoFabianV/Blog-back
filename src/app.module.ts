import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule, 
    PostsModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/blogdb'),
  ],
})
export class AppModule {}
