import { model, Schema, Document } from 'mongoose';

export interface IAdvertModel extends Document {
    title:String,
    imageId:[Number],
    startDate:Date,
    endDate:Date,
    explain:String,
    activity:Number,  
    type:Number,
    isValid:Boolean,
    updateAt:Date,
    createAt:Date
}

let schema: Schema = new Schema({
    title:String,
    imageId:[Number],
    startDate:Date,
    endDate:Date,
    explain:String, 
    activity:Number,  
    type:Number,
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