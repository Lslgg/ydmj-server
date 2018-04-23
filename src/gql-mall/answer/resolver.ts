import AnswerSchema, { IAnswerModel } from './answer';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { resolve, reject } from 'bluebird';
export class Answer {

    constructor() { }

    static Query: any = {

        async getAnswer(parent, { }, context): Promise<Array<IAnswerModel>> {

            if (!context.user) return null;

            return await AnswerSchema.find();
        },

        async getAnswerById(parent, { id }, context): Promise<IAnswerModel> {

            if (!context.user) return null;

            return await AnswerSchema.findById(id);
        },

        async getAnswerPage(parent, { pageIndex = 1, pageSize = 10, answer }, context): Promise<IAnswerModel[]> {

            if (!context.user) return null;

            var skip = (pageIndex - 1) * pageSize;

            return await AnswerSchema.find(answer).skip(skip).limit(pageSize);
        },

        async getAnswerWhere(parent, { answer }, context): Promise<IAnswerModel[]> {

            if (!context.user) return null;

            return await AnswerSchema.find(answer);

        },

        async getAnswerCount(parent, { answer }, context): Promise<Number> {

            if (!context.user) return null;

            return await AnswerSchema.count(answer);

        },
    }

    static Mutation: any = {

        async saveAnswer(parent, { answer }, context): Promise<any> {

            if (!context.user || !context.session.isManger) return null;

            if (answer.id && answer.id != "0") {
                let res = await AnswerSchema.findByIdAndUpdate(answer.id, answer);
                Object.assign(res, answer);
                return res;
            }

            return await AnswerSchema.create(answer);
        },

        async deleteAnswer(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return await (AnswerSchema.findByIdAndRemove(id) != null);
        }

    }
}