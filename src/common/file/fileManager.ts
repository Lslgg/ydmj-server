import { createWriteStream } from 'fs';
import * as del from 'del';

export class FileManager {

    private uploadDir = 'uploads';

    private db: any;

    private dbName: string;

    /**
     * 如果默认为images不用填
     * @param dbname 默认:images
     * @param Dbdefaluts 默认:{ images: [] } 
     */
    constructor(dbname: string = "images",
        Dbdefaluts: {} = { images: [] }) {

        this.dbName = dbname;
        const mkdirp = require('mkdirp');
        mkdirp.sync(this.uploadDir);

        const lowdb = require('lowdb');
        const FileSync = require('lowdb/adapters/FileSync');
        this.db = lowdb(new FileSync(this.uploadDir + '/db.json'));
        this.db.defaults(Dbdefaluts).write()
    }

    //上传文件
    public processUpload = async upload => {
        var { stream, filename, mimetype, encoding } = await upload
        var { id, path } = await this.storeUpload({ stream, filename });
        var originalname = filename; //上传的文件名
        filename = `${id}-${filename}`; //新的文件名
        return this.recordFile({ id, originalname, filename, mimetype, encoding, path })
    }

    //根据id查找文件
    public getFileById(id: string): any {
        return this.db.get(this.dbName).find({ id }).value();
    }

    //根据id列表查找文件
    public getFileByIds(ids: Array<string>): Array<any> {
        var list = [];
        ids.forEach(p => {
            var file = this.getFileById(p);
            list.push(file);
        })
        return list;
    }

    /**
     * 删除单个文件
    */
    public delFild(id: string) {
        var file = this.getFileById(id);
        this.cleanFolder("uploads/", file.filename);
        this.db.get(this.dbName).remove({ id }).write();
        return true;
    }

    /**
    * 批量删除删除文件
   */
    public delFilds(ids: Array<string>) {
        if(ids.length<=0) return true;
        ids.forEach(p=>{
            this.delFild(p)
        });
        return true;
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
        console.log([`${folderPath}${fileName}`, `!${folderPath}`]);
        del.sync([`${folderPath}${fileName}`, `!${folderPath}`]);
    };

    //保存文件
    private recordFile = file => this.db.get(this.dbName).push(file).last().write()


}