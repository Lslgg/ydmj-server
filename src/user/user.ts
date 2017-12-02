import { model, Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
    id:string,
    name: string,
    username: string,
    email: number,
    password: String,
    roleId: string,
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