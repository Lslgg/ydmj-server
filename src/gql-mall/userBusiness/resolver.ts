import UserBusinessSchema, { IUserBusinessModel } from './userBusiness';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import UserSchema from '../../gql-system/user/user';
import BusinessSchema from '../../gql-mall/business/business';
import { resolve, reject } from 'bluebird';
export class UserBusiness {

    constructor() { }

    static UserBusiness: any = {

        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
        User(model) {
            return UserSchema.findById(model.userId);
        }

    }

    static Query: any = {

        async getUserBusiness(parent, { }, context): Promise<Array<IUserBusinessModel>> {

            if (!context.user || !context.session.isManger) return null;

            return await UserBusinessSchema.find();

        },

        async getUserBusinessById(parent, { id }, context): Promise<IUserBusinessModel> {

            if (!context.user || !context.session.isManger) return null;

            return await UserBusinessSchema.findById(id);
        },

        async getUserBusinessWhere(parent, { userBusiness }, context): Promise<IUserBusinessModel[]> {

            if (!context.user || !context.session.isManger) return null;

            return await UserBusinessSchema.find(userBusiness);
        },

        async getUserBusinessPage(parent, { pageIndex = 1, pageSize = 10, userbusiness }, context): Promise<IUserBusinessModel[]> {

            if (!context.user || !context.session.isManger) return null;

            var skip = (pageIndex - 1) * pageSize;

            return await UserBusinessSchema.find(userbusiness).skip(skip).limit(pageSize);
        },

        async getUserBusinessCount(parent, { userBusiness }, context): Promise<Number> {

            if (!context.user || !context.session.isManger) return null;

            return await UserBusinessSchema.count(userBusiness);
        },

    }

    static Mutation: any = {

        saveUserBusiness(parent, { userBusiness }, context): Promise<any> {

            if (!context.user || !context.session.isManger) return null;
            return null;
            // return new Promise<any>((resolve, reject) => {

            //     if (userBusiness.id && userBusiness.id != "0") {
            //         UserBusinessSchema.findByIdAndUpdate(userBusiness.id, userBusiness, (err, res) => {
            //             Object.assign(res, userBusiness);
            //             resolve(res);
            //             return;
            //         });
            //         return;
            //     }
            //     UserBusinessSchema.create(userBusiness).then(info => {
            //         resolve(info);
            //         return;
            //     });
            // });
        },

        async saveUserBusinessAll(parent, { userBusiness }, context): Promise<IUserBusinessModel[]> {

            if (!context.user || !context.session.isManger) return null;

            return await UserBusinessSchema.create(userBusiness);
        },

        async deleteUserBusinessAll(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return (await UserBusinessSchema.find({ _id: { $in: id } }).remove() != null);

        },

        deleteUserBusiness(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return null;

        },
    }
}