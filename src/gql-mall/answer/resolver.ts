import AnswerSchema, { IAnswerModel } from './answer';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { resolve, reject } from 'bluebird';
export class Answer {
    constructor() {

    }

    static Query: any = {
        getAnswer(parent, { }, context): Promise<Array<IAnswerModel>> {
            if (!context.user) return null;

            let promise = new Promise<Array<IAnswerModel>>((resolve, reject) => {
                AnswerSchema.find().then(res => {
                    resolve(res);
                    return;
                }).catch(err => resolve(null));
            })
            return promise;
        },
        getAnswerById(parent, { id }, context): Promise<IAnswerModel> {
            if (!context.user) return null;

            let promise = new Promise<IAnswerModel>((resolve, reject) => {
                AnswerSchema.findById(id).then(res => {
                    resolve(res);
                    return;
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getAnswerPage(parent, { pageIndex = 1, pageSize = 10, answer }, context): Promise<IAnswerModel[]> {
            if (!context.user) return null;
            return new Promise<IAnswerModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize
                var advertmInfo = AnswerSchema.find(answer).skip(skip).limit(pageSize)
                resolve(advertmInfo);
                return;
            });
        },

        getAnswerWhere(parent, { answer }, context): Promise<IAnswerModel[]> {
            if (!context.user) return null;
            return new Promise<IAnswerModel[]>((resolve, reject) => {
                var answers = AnswerSchema.find(answer);
                resolve(answer);
                return;
            });
        },

        getAnswerCount(parent, { answer }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                var count = AnswerSchema.count(answer);
                resolve(count);
                return;
            });
        },
    }

    static Mutation: any = {
        saveAnswer(parent, { answer }, context): Promise<any> {
            if (!context.user || !context.session.isManger) return null;

            return new Promise<any>((resolve, reject) => {
                if (answer.id && answer.id != "0") {
                    AnswerSchema.findByIdAndUpdate(answer.id, answer, (err, res) => {
                        Object.assign(res, answer);
                        resolve(res);
                        return;
                    })
                    return;
                }
                AnswerSchema.create(answer).then(info => {
                    resolve(info);
                    return;
                });
            });
        },
        deleteAnswer(parent, { id }, context): Promise<Boolean> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                AnswerSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null);
                    return;
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}