import TransactionSchema, { ITransactionModel } from './transaction';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import UserSchema from '../../gql-system/user/user';
export class Transaction {
    constructor() {

    }

    static Transaction: any = {
        Business(model) {
            return BusinessSchema.findById(model.business_id);
        },
        Goods(model) {
            return GoodsSchema.findById(model.goods_id);
        },
        User(model) {
            return UserSchema.findById(model.user_id);
        },
    }

    static Query: any = {
        getTransaction(parent, { }, context): Promise<Array<ITransactionModel>> {
            if (!context.user) return null;
            let promise = new Promise<Array<ITransactionModel>>((resolve, reject) => {
                TransactionSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
        getTransactionById(parent, { id }, context): Promise<ITransactionModel> {
            if (!context.user) return null;

            let promise = new Promise<ITransactionModel>((resolve, reject) => {
                TransactionSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getTransactionPage(parent, { pageIndex = 1, pageSize = 10, transaction }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var transactionInfo = TransactionSchema.find(transaction).skip(skip).limit(pageSize)
            return transactionInfo;
        },

        getTransactionWhere(parent, { transaction }, context) {
            if (!context.user) return null;
            var transactionInfo = TransactionSchema.find(transaction);
            return transactionInfo;
        },

        getTransactionCount(parent, { transaction }, context) {
            if (!context.user) return 0;
            var count = TransactionSchema.count(transaction);
            return count;
        },  
    }

    static Mutation: any = {
        saveTransaction(parent, { transaction }, context) {
            if (!context.user) return null;
            if (transaction.id && transaction.id != "0") {
                return new Promise<ITransactionModel>((resolve, reject) => {
                    TransactionSchema.findByIdAndUpdate(transaction.id, transaction, (err, res) => {
                        Object.assign(res, transaction);
                        resolve(res);
                    })
                });
            }
            return TransactionSchema.create(transaction);
        }
    }
}