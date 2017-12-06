import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
    name: 'JsonObject',
    description: 'Json字符串转换为对象',
    parseValue(value) {
        return value; // sent to the client
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
        console.log(ast.value);
        let jsobj =JSON.parse(ast.value);
        console.log(jsobj);
        return  jsobj;
    },
});