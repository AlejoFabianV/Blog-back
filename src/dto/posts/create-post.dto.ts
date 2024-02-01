export class CreatePostDto {
    title: string;
    author: string;
    description: string;
    category?: string[]; 
}