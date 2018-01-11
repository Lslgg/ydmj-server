import { Business } from './business/resolver';

export class MallResolver {
    constructor() {

    }
    static Mall: any = {
        Business: Business.Business,
    }

    static Query: any = {
        ...Business.Query,    
    }

    static Mutation: any = {
        ...Business.Mutation,   
    }
}