import { model, Schema, Document } from 'mongoose';

export interface IAnswerModel extends Document {
    id: string
    name: String
    type: String
    content: String
    startDate: Date
    endDate: Date
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id:string
    name: String,
    type: String,
    content: String,
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

export default model<IAnswerModel>('Answer', schema);