import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';
import { imageFilter, loadCollection, cleanFolder } from './utils';

export class UploadFile {
	private app: express.Application;
	private DB_NAME: string = 'file.json';
	private COLLECTION_NAME: string = 'images';
	private UPLOAD_PATH: string = 'uploads';
	private upload: any;
	private db: any;

	constructor() {
		this.config();
	}

	private config() {
		// setup
		this.upload = multer({ dest: `${this.UPLOAD_PATH}/`, fileFilter: imageFilter });
		this.db = new Loki(`${this.UPLOAD_PATH}/${this.DB_NAME}`, { persistenceMethod: 'fs' });
	}

	public router(): express.Router {
		let router: express.Router;
		router = express.Router();

		router.post('/profile', this.upload.single('avatar'), async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const data = col.insert(req.file);

				this.db.saveDatabase();
				res.send({
					id: data.$loki,
					fileName: data.filename,
					originalName: data.originalname,
					mimetype: data.mimetype
				});
			} catch (err) {
				res.sendStatus(400);
			}
		});

		router.post('/photos/upload', this.upload.array('photos', 12), async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				let data = [].concat(col.insert(req.files));

				this.db.saveDatabase();
				res.send(data.map((x) => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname })));
			} catch (err) {
				res.sendStatus(400);
			}
		});

		router.post('/delimg/:id', async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const result = col.get(req.params.id);
				if (!result) {
					res.send({ success: false });
					return;
				}
				cleanFolder(result.destination, result.filename);
				col.remove(result);
				this.db.saveDatabase();
				res.send({ success: true });
			} catch (err) {
				res.sendStatus(400);
			}
		});

		router.get('/images', async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				res.send(col.data);
			} catch (err) {
				res.sendStatus(400);
			}
		});

		router.get('/images/:id', async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const result = col.get(req.params.id);

				if (!result) {
					res.sendStatus(404);
					return;
				}

				res.setHeader('Content-Type', result.mimetype);
				fs.createReadStream(path.join(this.UPLOAD_PATH, result.filename)).pipe(res);
			} catch (err) {
				res.sendStatus(400);
			}
		});

		router.get('/getImg/:id', async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const result = col.get(req.params.id);
				res.send(result);
			} catch (err) {
				res.sendStatus(400);
			}
		});

		return router;
	}

	async getImgById(id: any): Promise<any> {
		try {
			const col = await loadCollection(this.COLLECTION_NAME, this.db);
			const result = col.find({ $loki: { $in: id } });
			var list = [];
			for (var i = 0; i < result.length; i++) {
				let self = result[i];
				let info = Object.assign({ id: 0 }, self);
				info.id = self['$loki'];
				list.push(info);
			}
			return list;
		} catch (err) {
			return null;
		}
	}

	async deleteImg(id: any): Promise<any> {
		try {
			console.log(id);
			const col = await loadCollection(this.COLLECTION_NAME, this.db);
			const result = col.find({ $loki: { $in: id } });
			if (!result) {
				return null;
			}
			for(var i=0,leth=result.length; i<leth;i++){
				let self=result[i];
				cleanFolder(self.destination, self.filename);
			}
			col.remove(result);
			this.db.saveDatabase();
		} catch (err) {
			return null;
		}
	}
}
