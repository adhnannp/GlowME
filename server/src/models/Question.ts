import mongoose, {Document} from "mongoose";


// Table questions {
//     id integer [primary key]
//     createdBy integer [ref: > users.id]
//     type enum('descriptive', 'optionol','survey')
//     heading varchar
//     header_image varchar
//     description text
//     tags array [ref: > tags.id]
//     options text[]
//     correct_answer varchar
//     bounty_coin integer [default: 0]
//     bounty_expires timestamp  
//     created_at timestamp
//     edited_at timestamp
//     is_archive bool
//     report_count integer [default: 0]
//   }
//reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

export interface IQuestion extends Document{
    heading: string;
    createdBy: string | mongoose.Types.ObjectId;
    header_image: string;
    description: string;
    bounty_coin?:number;
    isListed:boolean;
    created_at:Date;
    edited_at:Date;
}

const questionSchema = new mongoose.Schema<IQuestion>({
    heading: { type: String, required: true, unique: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description:{type:String, required:true},
    header_image: { type: String, required: true },
    isListed: {type:Boolean, default:true},
    bounty_coin:{type:Number, required:true, default:0},
    created_at: { type: Date, default: Date.now },
    edited_at: { type: Date, default: Date.now },
})

export const QuestionModel = mongoose.model<IQuestion>('Question', questionSchema);