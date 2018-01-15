import { model, Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
    id:string,
    name: String,
    username: String,
    email: String,
    password: String,
    roleId: String,
    profileId:String,
    createdAt: Date,
    updateAt: Date,
    isValid:Boolean,
}

let UserSchema: Schema = new Schema({
    name: String,
    username: {
        type: String,
        default: '',
        required: true
    },
    email: String,
    password: String, 
    roleId: String,
    profileId:String,
    isValid:{
        type:Boolean,
        default:true
    },
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

export default model<IUserModel>('User', UserSchema);