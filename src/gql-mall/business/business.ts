import { model, Schema, Document } from 'mongoose';

export interface IBusinessModel extends Document {
    id:string,
    name:String
    address:String
    phone:String
    isValid: String,
    updateAt:Date
    createAt:Date
}

let schema: Schema = new Schema({  
    name:String,
    address:String,
    phone:String,
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