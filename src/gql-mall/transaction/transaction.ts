import { model, Schema, Document } from 'mongoose';

export interface ITransactionModel extends Document {
    id: string
    code: String
    goodsId: String
    businessId: String
    userId: String
    state: Number
    endTime: Date
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id: String,        
    code: String,
    goodsId: String,
    businessId: String,
    userId: String,
    state: Number,
    endTime: Date,
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

export default model<ITransactionModel>('Transaction', schema);