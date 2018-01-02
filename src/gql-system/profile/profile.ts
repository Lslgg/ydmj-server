import { model, Schema, Document } from 'mongoose';

export interface IProfileModel extends Document {
    id:string,
    card: Number,
    address: String,
    phone: String, 
    userId:String,
    createdAt: Date,
    updateAt: Date,
}

let schema: Schema = new Schema({ 
    card: Number,
    address: String,
    phone: String, 
    userId:String,
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

export default model<IProfileModel>('Profile', schema);