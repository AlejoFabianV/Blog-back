import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"; 

@Schema({timestamps: true})
export class User {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    username: string;

    @Prop({
        type: String,
        required: true,
        trim: true
    })
    password: string;

    @Prop({
        type: Boolean,
        required: true,
        default: false
    })
    isAdmin: boolean;
} 

export const UserSchema = SchemaFactory.createForClass(User);
