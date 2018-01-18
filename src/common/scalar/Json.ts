import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
    name: 'Json',
    description: 'Json字符串转换为对象',
    parseValue(value) {
        let json =JSON.parse(value);
        return json; // sent to the client
    },
    serialize(value) {
        return value; // sent to resolvers
    }, 
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Query error: Can only parse dates strings, got a: ${ast.kind}`,
                [ast],
            );
        }
        try{
            let json =JSON.parse(ast.value);
            return  json;
        }catch{
            return ast.value;
        }
    },
});