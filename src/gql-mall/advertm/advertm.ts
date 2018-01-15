import { model, Schema, Document } from 'mongoose';

export interface IAdvertmModel extends Document {
    id: string
    title: String
    type: String
    link: String
    imageIds:[string]
    explain: String
    startDate: Date
    endDate: Date
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id:string    
    title: String,
    type: String,
    link: String,
    imageIds:[String],
    explain: String,
    startDate: Date,
    endDate: Date,
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

export default model<IAdvertmModel>('Advertm', schema);