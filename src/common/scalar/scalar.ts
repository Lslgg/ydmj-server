import Date from './Date';
import Find from './Find';
import RegExp from './RegExp';
import JsonObject from './JsonObject';
import { GraphQLUpload } from 'apollo-upload-server';

export class Scalar{
    constructor(){

    }

    static Scalar:any={
        Find,
        Date,
        RegExp,
        JsonObject,
        Upload:GraphQLUpload
    }
}