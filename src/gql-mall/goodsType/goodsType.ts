import { model, Schema, Document } from 'mongoose';

export interface IGoodsTypeModel extends Document {
    id: string
    name: String
    businessId:String    
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id: String,
    name: String,
    businessId:String,    
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