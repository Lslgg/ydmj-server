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
    updateAt: Date,
    createAt: Date,
})


export default model<IUserBusinessModel>('UserBusiness', schema);