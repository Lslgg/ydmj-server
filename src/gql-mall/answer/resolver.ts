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
        getAnswerById(parent, { id }, context): Promise<IAnswerModel> {
            if (!context.user) return null;

            let promise = new Promise<IAnswerModel>((resolve, reject) => {
                AnswerSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getAnswerPage(parent, { pageIndex = 1, pageSize = 10, answer }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var advertmInfo = AnswerSchema.find(answer).skip(skip).limit(pageSize)
            return advertmInfo;
        },

        getAnswerWhere(parent, { answer }, context) {
            if (!context.user) return null;
            var answers = AnswerSchema.find(answer);
            return answers;
        },

        getAnswerCount(parent, { answer }, context) {
            if (!context.user) return 0;
            var count = AnswerSchema.count(answer);
            return count;
        },
    }

    static Mutation: any = {
        saveAnswer(parent, { answer }, context) {
            if (!context.user) return null;            
            if (answer.id && answer.id != "0") {
                return new Promise<IAnswerModel>((resolve, reject) => {
                    AnswerSchema.findByIdAndUpdate(answer.id, answer, (err, res) => {
                        Object.assign(res, answer);
                        resolve(res);
                    })
                });
            }
            return AnswerSchema.create(answer);
        },
        deleteAnswer(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                AnswerSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}