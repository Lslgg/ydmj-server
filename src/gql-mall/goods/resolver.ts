import GoodsSchema, { IGoodsModel } from './goods';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsTypeSchema from '../goodsType/goodsType';
export class Goods{
    constructor(){
  
    }

    static Goods: any = {

        Business(model) {            
            return BusinessSchema.findById(model.business_id);
        },
        GoodsType(model) {            
            return GoodsTypeSchema.findById(model.goodsType_id);
        },
        
    }

    static Query:any={
        getGoods(parent, {}, context): Promise<Array<IGoodsModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IGoodsModel>>((resolve, reject) => {
                GoodsSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },       
        getGoodsById(parent, { id }, context): Promise<IGoodsModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsModel>((resolve, reject) => {
                GoodsSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getGoodsPage(parent, { pageIndex = 1, pageSize = 10, goods }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var goodsInfo = GoodsSchema.find(goods).skip(skip).limit(pageSize)
            return goodsInfo;
        },

        getGoodsWhere(parent, { goods }, context) {
            if (!context.user) return null;
            var goodsInfo = GoodsSchema.find(goods);
            return goodsInfo;
        },

        getGoodsCount(parent, { goods }, context) {
            if (!context.user) return 0;
            var count = GoodsSchema.count(goods);
            return count;
        },    
    }

    static Mutation: any = {
        saveGoods(parent, { goods }, context) {
            if(!context.user) return null;

            if (goods.id && goods.id != "0") {
                return new Promise<IGoodsModel>((resolve, reject) => {
                    GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                        Object.assign(res, goods);
                        resolve(res);
                    })
                });
            }
            return GoodsSchema.create(goods)
        },
        deleteGoods(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                GoodsSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}