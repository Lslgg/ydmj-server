import { model, Schema, Document } from 'mongoose';

export interface IUserBusinessModel extends Document {
    id: string
    userId: String
    businessId: String
}

let schema: Schema = new Schema({      
    userId: String,
    businessId: String
})


export default model<IUserBusinessModel>('UserBusiness', schema);