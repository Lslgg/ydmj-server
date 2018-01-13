import { model, Schema, Document } from 'mongoose';

export interface ITransactionModel extends Document {
    id: string
    trade_code: String
    goods_id: String
    business_id: String
    user_id: String
    user_name: String
    start_time: String
    end_time: String
    complete_time: Date
    state: Boolean
    t_code: String
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id: String,    
    trade_code: String,
    goods_id: String,
    business_id: String,
    user_id: String,
    user_name: String,
    start_time: String,
    end_time: String,
    complete_time: Date,
    state: Boolean,
    t_code: String,
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

export default model<ITransactionModel>('Transaction', schema);