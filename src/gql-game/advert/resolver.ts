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
			var uploadFile = new UploadFile();
			let promise = new Promise<Array<IAdvertModel>>((resolve, reject) => {
				AdvertSchema.find().then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertById(_, { id }, context): Promise<IAdvertModel> {
			let promise = new Promise<IAdvertModel>((resolve, reject) => {
				AdvertSchema.findById(id).then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertPage(_, { pageIndex = 1, pageSize = 10, advert }, context) {
			var userInfo = AdvertSchema.find(advert).skip((pageIndex - 1) * pageSize).limit(pageSize);
			return userInfo;
		},

		getAdvertCount(_, { advert }, context) {
			var count = AdvertSchema.count(advert);
			return count;
		},

		getAdvertWhere(_, { advert }, context) {
			var users = AdvertSchema.find(advert);
			return users;
		}
	};

	static Mutation: any = {
		createAdvert(_, { advert }, context) {
			return AdvertSchema.create(advert);
		},

		updateAdvert(_, { id, advert }, context) {
			let promise = new Promise<IAdvertModel>((resolve, reject) => {
				AdvertSchema.findByIdAndUpdate(id, advert, (err, res) => {
					Object.assign(res, advert);
					resolve(res);
				});
			});

			return promise;
		},

		deleteAdvert(_, { id }, context): Promise<Boolean> {
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
