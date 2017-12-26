import { model, Schema, Document } from 'mongoose';

export interface ICardLogModel extends Document {
    id:string,
    userName: String,
    playName: String,
    card:number,
    type:String,
    createdAt: Date,
    updateAt: Date,
}

let schema: Schema = new Schema({
    userName: String,
    playName: String,  
    card: Number,  
    type:String,
    createAt: {
        type: Date, 
        default: new Date(),
        required: true
    },
    updateAt: { 
        type: Date,
        default: new Date(),
        required: true
    },
})

export default model<ICardLogModel>('CardLog', schema);