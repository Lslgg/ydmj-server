import { createWriteStream } from 'fs';
import * as del from 'del';
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';
import { imageFilter, loadCollection, cleanFolder } from '../file_server/utils';

export class FileManager {

    private uploadDir = 'uploads';

    private COLLECTION_NAME: string = 'db';
    private upload: any;
    private db: any;

    constructor() {
        this.config();
    }

    private config() {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                var index = file.originalname.lastIndexOf(".");
                var fileName = file.originalname.substr(0, index);
                var exit = file.originalname.substr(index);
                cb(null, fileName + '-' + Date.now() + exit);
            }
        })

        this.upload = multer({ storage: storage, fileFilter: imageFilter });
        this.db = new Loki(`uploads/db.json`, { persistenceMethod: 'fs' });
    }

    //上传文件
    public processUpload = async upload => {
        var { stream, filename, mimetype, encoding } = await upload
        var { id, path } = await this.storeUpload({ stream, filename });
        var originalname = filename; //上传的文件名
        filename = `${id}-${filename}`; //新的文件名
        const col = await loadCollection(this.COLLECTION_NAME, this.db);
        const data = col.insert({ id, originalname, filename, mimetype, encoding, path });
        this.db.saveDatabase();
        return data;
    }

    //根据id查找文件
    public getFileById(id: string): Promise<any> {
        var promise = new Promise<any>((resolve, reject) => {
            loadCollection(this.COLLECTION_NAME, this.db).then((col) => {
                const result = col.findOne({ id: id });
                resolve(result);
            });
        })
        return promise
    }

    //根据id列表查找文件
    public async getFileByIds(ids: Array<string>): Promise<any> {
        var promise = new Promise<any>((resolve, reject) => {
            loadCollection(this.COLLECTION_NAME, this.db).then((col) => {
                const result = col.find({ id: { '$in': ids } });
                resolve(result);
            });
        })
        return promise;
    }

    /**
     * 删除单个文件
    */
    public delFild(id: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve, reject) => {
            this.getFileById(id).then((file) => {
                this.cleanFolder("uploads/", file.filename);
                loadCollection(this.COLLECTION_NAME, this.db).then((col) => {
                    col.remove(file);
                    this.db.saveDatabase();
                    resolve(true);
                })
            });
        });
        return promise;
    }

    /**
    * 批量删除删除文件
    */
    public delFilds(ids: Array<string>): Promise<boolean[]> {
        if (ids.length >= 0) {
            return Promise.all(ids.map(this.delFild));
        }
        return null;
    }

    //设置上传
    private storeUpload = async ({ stream, filename }) => {
        const shortid = require('shortid');
        const id = shortid.generate()
        const path = `${this.uploadDir}/${id}-${filename}`

        return new Promise<{ id: string, path: string }>((resolve, reject) =>
            stream.pipe(createWriteStream(path))
                .on('finish', () => resolve({ id, path }))
                .on('error', reject)
        )
    }

    //清除文件
    private cleanFolder = (folderPath, fileName) => {
        del.sync([`${folderPath}${fileName}`, `!${folderPath}`]);
    };
}