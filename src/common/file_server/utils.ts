import * as del from 'del';
import * as Loki from 'lokijs';

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const loadCollection = function (colName, db: Loki): Promise<any> {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

const cleanFolder = function (folderPath,fileName) {
    // delete files inside folder but not the folder itself
    console.log([`${folderPath}/${fileName}`, `!${folderPath}`]);
    del.sync([`${folderPath}/${fileName}`, `!${folderPath}`]);
};

export { imageFilter, loadCollection, cleanFolder }
