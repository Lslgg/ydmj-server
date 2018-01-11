import ScoreSchema, { IScoreModel } from './score';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import UserSchema from '../../gql-system/user/user';
export class Score {
    constructor() {

    }

    static Score: any = {
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
        getScore(parent, { }, context): Promise<Array<IScoreModel>> {
            if (!context.user) return null;
            let promise = new Promise<Array<IScoreModel>>((resolve, reject) => {
                ScoreSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
    }

    static Mutation: any = {
        saveScore(parent, { score }, context) {
            if (!context.user) return null;
            if (score.id) {
                return new Promise<IScoreModel>((resolve, reject) => {
                    ScoreSchema.findByIdAndUpdate(score.id, score, (err, res) => {
                        Object.assign(res, score);
                        resolve(res);
                    })
                });
            }
            return ScoreSchema.create(score);
        }
    }
}