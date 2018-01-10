import { model, Schema, Document } from 'mongoose';

export interface IAdvertModel extends Document {
    id:string,
    title:string,
    imageIds:[string],
    startDate:Date,
    endDate:Date,
    explain:string,
    activity:Number,  
    type:String,
    isValid:Boolean,
    updateAt:Date,
    createAt:Date
}

let schema: Schema = new Schema({
    title:String,
    imageIds:[String],
    startDate:Date,
    endDate:Date,
    explain:String, 
    activity:Number,  
    type:String,
    isValid:Boolean,
    createAt: {
        type: Date,
        default: new Date(),
        required: true
    },
    updateAt: {
        type: Date,
        default: new Date(),
        required: true
    }
})

export default model<IAdvertModel>('Advert', schema);