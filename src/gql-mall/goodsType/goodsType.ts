import { model, Schema, Document } from 'mongoose';
import { Business } from '../business/resolver';

export interface IGoodsTypeModel extends Document {
    id: string
    name: String
    business_id: Business
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    id: String,
    name: String,
    business_id: Business,
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

export default model<IGoodsTypeModel>('GoodsType', schema);