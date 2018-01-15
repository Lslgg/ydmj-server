import { model, Schema, Document } from 'mongoose';

export interface IBusinessModel extends Document {
    id: string
    name: String
    phone_num: String
    address: String
    b_hours: String
    brief: String
    score: Number
    imageIds: [string]
    trans_times: Number
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id:String,    
    name: String,
    phone_num: String,
    address: String,
    b_hours: String,
    brief: String,
    score: Number,
    imageIds: [String],
    trans_times: Number,
    isValid: Boolean,
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

export default model<IBusinessModel>('Business', schema);