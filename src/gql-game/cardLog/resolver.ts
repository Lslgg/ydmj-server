import schema, { ICardLogModel } from './cardLog';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class CardLog {

    constructor() {
        
    }


    static Query: any = {

        getCardLogs(_, __, context): Promise<Array<ICardLogModel>> {
            let promise = new Promise<Array<ICardLogModel>>((resolve, reject) => {
                schema.find().then(res => {
                    resolve(res);
                }).catch(err=>resolve(null)); 
            }) 
            return promise;  
        },

        getCardLogPage(_, { pageIndex = 1, pageSize = 10, cardLog }, context) {
            var info = schema.find(cardLog)
                .skip((pageIndex - 1) * pageSize).limit(pageSize)
            return info;
        },

        getCardLogCount(_, { cardLog }, context) {
            var count = schema.count(cardLog);
            return count;
        },

        getCardLogWhere(_, { cardLog }, context) {
            return schema.find(cardLog);
        },
    } 

    static Mutation: any = {
 
        createCardLog (_, { cardLog }, context): MongoosePromise<Array<ICardLogModel>> {
            return schema.create(cardLog)
        },

        deleteCardLog(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                schema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}