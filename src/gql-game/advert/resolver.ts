import AdvertSchema, { IAdvertModel } from './advert';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { UploadFile } from '../../common/file/uploadFile';

export class Advert {
	constructor() { }

	static Advert: any = {
		Images(model) {
			var uploadFile = new UploadFile();
			let promise = new Promise<Array<any>>((resolve, reject) => {
				uploadFile.getImgById(model.imageId).then(files => {
					resolve(files);
				})
			});
			return promise;
		}
	};

	static Query: any = {
		getAdverts(_, __, context): Promise<Array<IAdvertModel>> {
			if(!context.user) return null;

			var uploadFile = new UploadFile();
			let promise = new Promise<Array<IAdvertModel>>((resolve, reject) => {
				AdvertSchema.find().then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertById(_, { id }, context): Promise<IAdvertModel> {
			if(!context.user) return null;

			let promise = new Promise<IAdvertModel>((resolve, reject) => {
				AdvertSchema.findById(id).then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertPage(_, { pageIndex = 1, pageSize = 10, advert }, context) {
			if(!context.user) return null;

			var userInfo = AdvertSchema.find(advert).skip((pageIndex - 1) * pageSize).limit(pageSize);
			return userInfo;
		},

		getAdvertCount(_, { advert }, context) {
			if(!context.user) return null;

			var count = AdvertSchema.count(advert);
			return count;
		},

		getAdvertWhere(_, { advert }, context) {
			if(!context.user) return null;

			var users = AdvertSchema.find(advert);
			return users;
		}
	};

	static Mutation: any = {
		saveAdvert(_, { advert }, context) {
			if(!context.user) return null;

			if (advert.id) {
				return new Promise<IAdvertModel>((resolve, reject) => {
					AdvertSchema.findByIdAndUpdate(advert.id, advert, (err, res) => {
						Object.assign(res, advert);
						resolve(res);
					});
				});
			}
			return AdvertSchema.create(advert);
		},

		deleteAdvert(_, { id }, context): Promise<Boolean> {
			if(!context.user) return null;

			let promise = new Promise<Boolean>((resolve, reject) => {
				AdvertSchema.findByIdAndRemove(id, (err, res) => {
					new UploadFile().deleteImg(res.imageId);
					resolve(res != null);
				});
			});
			return promise;
		}
	};
}