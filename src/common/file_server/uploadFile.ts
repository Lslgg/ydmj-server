import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';
import { imageFilter, loadCollection, cleanFolder } from './utils';

export class UploadFile {
	private app: express.Application;

	private COLLECTION_NAME: string = 'editor';
	private upload: any;
	private db: any;

	constructor() {
		this.config();
	}

	private config() {
		var storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'uploads/editor')
			},
			filename: function (req, file, cb) {
				var index = file.originalname.lastIndexOf(".");
				var fileName = file.originalname.substr(0, index);
				var exit = file.originalname.substr(index);
				cb(null, fileName + '-' + Date.now() + exit);
			}
		})

		this.upload = multer({ storage: storage, fileFilter: imageFilter });
		this.db = new Loki(`uploads/editor/editor.json`, { persistenceMethod: 'fs' });
	}

	public router(): express.Router {
		let router: express.Router;
		router = express.Router();

		//上传图片
		router.post('/upload', this.upload.single('file'), async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const data = col.insert(req.file);
				this.db.saveDatabase();
				const web = "http://" + req.hostname + ":" + req.app.settings.port + "/";
				res.send({ location: web + data.path})
			} catch (err) {
				res.sendStatus(400);
			}
		});

		//上传图片2
		router.post('/profile', this.upload.single('avatar'), async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const data = col.insert(req.file);
				this.db.saveDatabase();
				const web = "http://" + req.hostname + ":" + req.app.settings.port + "/";
				res.send({ link: web + data.path, id: data.id })
			} catch (err) {
				res.sendStatus(400);
			}
		});


		//根据图片名字删除图片
		router.post('/delimg/:id', async (req, res) => {
			try {
				const col = await loadCollection(this.COLLECTION_NAME, this.db);
				const result = col.find({ filename: req.params.id })[0];
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

		return router;
	}
}