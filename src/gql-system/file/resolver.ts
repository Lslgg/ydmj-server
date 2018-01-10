import { createWriteStream } from 'fs';
import { FileManager } from "../../common/file/fileManager";

export class File {

    constructor() {
      
    }

    static Query: any = {
        images(parent, { id }, context) {
            var fm = new FileManager();
            return fm.getFileById(id);          
        }
    }

    static Mutation: any = {
        singleUpload(parent, { file }, context) {
            var fm = new FileManager();
            return fm.processUpload(file);
        },
        multipleUpload(parent, { files }, context) {
            var fm = new FileManager();
            return Promise.all(files.map(fm.processUpload));
        },
        deleFile(parent, { id }, context){
            var fm = new FileManager();
            return fm.delFild(id);
        }
    }
}
