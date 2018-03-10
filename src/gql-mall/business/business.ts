import { model, Schema, Document } from 'mongoose';

export interface IBusinessModel extends Document {
    id: string
    name: String
    address: String
    phone: String
    hours: String
    brief: String
    imageIds: [String]
    times: Number
    sortIndex:Number
    score: Number
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id:String,        
    name: String,
    address: String,
    phone: String,
    hours: String,
    brief: String,
    imageIds: [String],
    times: Number,
    sortIndex:Number,
    score: Number,
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