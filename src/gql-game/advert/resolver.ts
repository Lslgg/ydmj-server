import AdvertSchema, { IAdvertModel } from './advert';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { FileManager } from "../../common/file/fileManager";

export class Advert {
	constructor() { }

	static Advert: any = {
		Images(model) {
			let promise = new Promise<Array<any>>((resolve, reject) => {
				let fm = new FileManager();
				let imgs = fm.getFileByIds(model.imageIds);
				resolve(imgs);
			});
			return promise;
		}
	};

	static Query: any = {
		getAdverts(parent, { }, context): Promise<Array<IAdvertModel>> {
			if (!context.user) return null;

			let promise = new Promise<Array<IAdvertModel>>((resolve, reject) => {
				AdvertSchema.find().then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertById(parent, { id }, context): Promise<IAdvertModel> {
			if (!context.user) return null;

			let promise = new Promise<IAdvertModel>((resolve, reject) => {
				AdvertSchema.findById(id).then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;
		},

		getAdvertPage(parent, { pageIndex = 1, pageSize = 10, advert }, context) {
			if (!context.user) return null;

			var userInfo = AdvertSchema.find(advert).skip((pageIndex - 1) * pageSize).limit(pageSize);
			return userInfo;
		},

		getAdvertCount(parent, { advert }, context) {
			if (!context.user) return null;

			var count = AdvertSchema.count(advert);
			return count;
		},

		getAdvertWhere(parent, { advert }, context) {
			if (!context.user) return null;

			var users = AdvertSchema.find(advert);
			return users;
		}
	};

	static Mutation: any = {
		saveAdvert(parent, { advert }, context) {
			if (!context.user) return null;
			if (advert.id && advert.id != "0") {
				return new Promise<IAdvertModel>((resolve, reject) => {
					AdvertSchema.findByIdAndUpdate(advert.id, advert, (err, res) => {
						Object.assign(res, advert);
						resolve(res);
					});
				});
			}
			return AdvertSchema.create(advert);
		},

		deleteAdvert(parent, { id }, context): Promise<Boolean> {
			if (!context.user) return null;

			let promise = new Promise<Boolean>((resolve, reject) => {
				AdvertSchema.findByIdAndRemove(id, (err, res) => {
					var fm = new FileManager();
					fm.delFilds(res.imageIds);
					resolve(res != null);
				});
			});
			return promise;
		}
	};
}
