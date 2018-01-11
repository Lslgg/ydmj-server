import { model, Schema, Document } from 'mongoose';

export interface IGoodsModel extends Document {
    id: string
    name: String
    cost_score: Number
    rule: String
    explain: String
    count: Number
    trans_times: Number
    goods_type: String
    imageSrc: String
    stock: Number
    limit: Number
    business_id: String
    goodsType_id: String
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id: String,
    name: String,
    cost_score: Number,
    rule: String,
    explain: String,
    count: Number,
    trans_times: Number,
    goods_type: String,
    imageSrc: String,
    stock: Number,
    limit: Number,
    business_id: String,
    goodsType_id: String,
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

export default model<IGoodsModel>('Goods', schema);