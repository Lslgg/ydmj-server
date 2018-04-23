import { model, Schema, Document } from 'mongoose';

export interface IUserBusinessModel extends Document {
    id: string
    userId: String
    businessId: String
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    userId: String,
    businessId: String,
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


export default model<IUserBusinessModel>('UserBusiness', schema);