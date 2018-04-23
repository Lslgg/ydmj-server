import { model, Schema, Document } from 'mongoose';

export interface IBusinessModel extends Document {
<<<<<<< HEAD
    id:string
   user_id:String
   name:String
   phone_num:String
   address:String
   b_hours:String  
   brief:String
   score:Number
   imageSrc: String
   trans_times:Number
   isValid: Boolean
   updateAt:Date
   createAt:Date 
}

let schema: Schema = new Schema({        
    // id:String,
    user_id:String,
    name:String,
    phone_num:String,
    address:String,
    b_hours:String,  
    brief:String,
    score:Number,
    imageSrc: String,
    trans_times:Number,    
    isValid: Boolean,    
=======
    id: string
    name: String
    address: String
    phone: String
    hours: String
    brief: String
    imageIds: [String]
    times: Number
    sortIndex:Number
    score: Number
    isValid: Boolean
    updateAt: Date
    createAt: Date
}

let schema: Schema = new Schema({
    // id:String,        
    name: String,
    address: String,
    phone: String,
    hours: String,
    brief: String,
    imageIds: [String],
    times: Number,
    sortIndex:Number,
    score: Number,
    isValid: Boolean,
>>>>>>> 4c46324f89109bf7ee79710b0760e625ecc3e908
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


export default model<IBusinessModel>('Business', schema);