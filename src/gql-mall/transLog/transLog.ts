import { model, Schema, Document } from 'mongoose';

export interface ITransLogModel extends Document {
    id: string
    userId: String
    goodsId: String
    businessId: String
    info: String
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    userId: String,
    goodsId: String,
    businessId: String,
    info: String,
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

export default model<ITransLogModel>('TransLog', schema);