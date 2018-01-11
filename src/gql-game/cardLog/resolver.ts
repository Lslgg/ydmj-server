import schema, { ICardLogModel } from './cardLog';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class CardLog {

    constructor() {
        
    }


    static Query: any = {

        getCardLogs(parent, __, context): Promise<Array<ICardLogModel>> {
            // if(!context.user) return null;

            let promise = new Promise<Array<ICardLogModel>>((resolve, reject) => {
                schema.find().then(res => {
                    resolve(res);
                }).catch(err=>resolve(null)); 
            }) 
            return promise;  
        },

        getCardLogPage(parent, { pageIndex = 1, pageSize = 10, cardLog }, context) {
            if(!context.user) return null;

            var info = schema.find(cardLog)
                .skip((pageIndex - 1) * pageSize).limit(pageSize)
            return info;
        },

        getCardLogCount(parent, { cardLog }, context) {
            if(!context.user) return 0;

            var count = schema.count(cardLog);
            return count;
        },

        getCardLogWhere(parent, { cardLog }, context) {
            if(!context.user) return null;

            return schema.find(cardLog);
        },
    } 

    static Mutation: any = {
 
        saveCardLog (parent, { cardLog }, context){
            if(!context.user) return null;
            return schema.create(cardLog)
        },

        deleteCardLog(parent, { id }, context): Promise<Boolean> {
            if(!context.user) return null;

            let promise = new Promise<Boolean>((resolve, reject) => {
                schema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}