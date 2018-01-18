import Date from './Date';
import Comparison from './Comparison';
import RegExp from './RegExp';
import Json from './Json';
import { GraphQLUpload } from 'apollo-upload-server';

export class Scalar{
    constructor(){

    }

    static Scalar:any={ 
        Comparison,
        Date,
        RegExp,
        Json,
        Upload:GraphQLUpload
    } 
}