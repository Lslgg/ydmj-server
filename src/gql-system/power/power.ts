import { model, Schema, Document } from 'mongoose';

export interface IPowerModel extends Document {
	id:string,
	title: String,
	operation: [String],
	code: String,
	url: String,
	explain: String,
	type: String,
	menuId:String,
	isValid: Boolean,
	updateAt: Date,
	createAt: Date
}
const OPERATION = [ 'SHOW', 'ADD', 'UPDATE', 'DELETE' ];
let schema: Schema = new Schema({
	title: String,
	operation: {
		type: [ String ],
		enum: OPERATION  
	},
	code: String,
	url: String,
	explain: String,
	type: String,
	menuId:String,
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
	}
});

export default model<IPowerModel>('Power', schema);
