export class FilterPostDto {
    title?: string;
    author?: string;
    description?: string;
    category?: string[]; 
    limit?: number;
    offset?: number;
}