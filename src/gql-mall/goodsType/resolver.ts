import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
export class GoodsType{
    constructor(){
  
    }

    static GoodsType: any = {
        Business(model) {            
            return BusinessSchema.findById(model.business_id);
        },        
    }

    static Query:any={
        getGoodsType(parent, {}, context): Promise<Array<IGoodsTypeModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IGoodsTypeModel>>((resolve, reject) => {
                GoodsTypeSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },  
        getGoodsTypeById(parent, { id }, context): Promise<IGoodsTypeModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsTypeModel>((resolve, reject) => {
                GoodsTypeSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getGoodsTypePage(parent, { pageIndex = 1, pageSize = 10, goodsType }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var goodsTypeInfo = GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize)
            return goodsTypeInfo;
        },

        getGoodsTypeWhere(parent, { goodsType }, context) {
            if (!context.user) return null;
            var goodsTypeInfo = GoodsTypeSchema.find(goodsType);
            return goodsTypeInfo;
        },

        getGoodsTypeCount(parent, { goodsType }, context) {
            if (!context.user) return 0;
            var count = GoodsTypeSchema.count(goodsType);
            return count;
        },         
    }

    static Mutation: any = {
        saveGoodsType(parent, { goodsType }, context) {
            if(!context.user) return null;        
            if (goodsType.id && goodsType.id != "0") {
                return new Promise<IGoodsTypeModel>((resolve, reject) => {
                    GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                        Object.assign(res, goodsType);
                        resolve(res);
                    })
                });
            }
            return GoodsTypeSchema.create(goodsType)
        },
        deleteGoodsType(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}