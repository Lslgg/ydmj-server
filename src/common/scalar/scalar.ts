import Date from './Date';
import RegExp from './RegExp';
import JsonObject from './JsonObject';
import { GraphQLUpload } from 'apollo-upload-server';

export class Scalar{
    constructor(){

    }

    static Scalar:any={
        Date,
        RegExp,
        JsonObject,
        Upload:GraphQLUpload
    }
}