import AnswerSchema, { IAnswerModel } from './answer';
import { DocumentQuery, MongoosePromise } from 'mongoose';
export class Answer {
    constructor() {

    }

    static Query: any = {
        getAnswer(parent, { }, context): Promise<Array<IAnswerModel>> {
            if (!context.user) return null;

            let promise = new Promise<Array<IAnswerModel>>((resolve, reject) => {
                AnswerSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
    }

    static Mutation: any = {
        saveAnswer(parent, { answer }, context) {
            if (!context.user) return null;            
            if (answer.id) {
                return new Promise<IAnswerModel>((resolve, reject) => {
                    AnswerSchema.findByIdAndUpdate(answer.id, answer, (err, res) => {
                        Object.assign(res, answer);
                        resolve(res);
                    })
                });
            }
            return AnswerSchema.create(answer);
        }
    }
}