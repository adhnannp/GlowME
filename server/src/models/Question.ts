import mongoose, {Document, Schema} from "mongoose";

export interface IQuestion extends Document{
    title: string;
    createdBy: string | mongoose.Types.ObjectId;
    header_image: string;
    description: string;
    bounty_coin?:number;
    isListed:boolean;
    is_archive?:boolean;
    created_at?:Date;
    edited_at?:Date;
}

const questionSchema = new mongoose.Schema<IQuestion>({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, unique: true },
    header_image: { type: String },
    isListed:{type:Boolean,default:true},
    description: { type: String },
    bounty_coin: { type: Number, default: 0 },
    is_archive: { type: Boolean, default: false },
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
})

export const QuestionModel = mongoose.model<IQuestion>('Question', questionSchema);