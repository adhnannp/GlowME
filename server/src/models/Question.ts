import mongoose, {Document, Schema} from 'mongoose';

export interface IQuestion extends Document{
    title: string;
    slug: string;
    createdBy: string | mongoose.Types.ObjectId;
    header_image?: string;
    document?: string;
    description: string;
    type: 'descriptive' | 'bounty';
    bounty_coin?:number;
    embedding: number[];
    tags?: mongoose.Types.ObjectId[]; 
    isListed:boolean;
    is_archive?:boolean;
    created_at?:Date;
    edited_at?:Date;
}

const questionSchema = new mongoose.Schema<IQuestion>({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    header_image: { type: String },
    document: { type: String },
    isListed:{type:Boolean,default:true},
    description: { type: String },
    type: {type: String,enum: ['descriptive', 'bounty'],required: true,default: 'descriptive'},
    bounty_coin: { type: Number, default: 0 },
    embedding: {type: [Number], required: true},
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    is_archive: { type: Boolean, default: false },
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const QuestionModel = mongoose.model<IQuestion>('Question', questionSchema);