import { model, Schema, Document } from 'mongoose';

export interface IMenuModel extends Document {
    id:string,
    title: String,
    menuImg: String,
    isLeaf: Boolean,
    pid: String,
    code: String,
    url: String,
    isValid: String,
    updateAt:Date
    createAt:Date
}

let schema: Schema = new Schema({  
    title: String,
    menuImg:String,  
    pid: String,
    code: String,
    url: String, 
    isLeaf: Boolean,
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

export default model<IMenuModel>('Menu', schema);