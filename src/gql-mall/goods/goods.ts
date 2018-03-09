import { model, Schema, Document } from 'mongoose';

export interface IGoodsModel extends Document {
    id: string
    businessId: String
    goodsTypeId: String
    name: String
    score: Number
    ruler: String
    explain: String
    stock: Number
    times: Number
    validTime: Number
    sortIndex: Number
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id: String,    
    businessId: String,
    goodsTypeId: String,
    name: String,
    score: Number,
    ruler: String,
    explain: String,
    stock: Number,
    times: Number,
    validTime: Number,
    sortIndex: Number,
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