import mongoose, {Document} from "mongoose";

export interface IBadge extends Document{
    name: string;
    image: string;
    requiredXp: number;
    isListed:boolean;
    created_at?:Date;
    edited_at?: Date;
}

const badgeSchema = new mongoose.Schema<IBadge>({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    requiredXp: { type: Number, required: true, min: 0},
    isListed: {type:Boolean, default:true},
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
})

export const BadgeModel = mongoose.model<IBadge>('Badge', badgeSchema);