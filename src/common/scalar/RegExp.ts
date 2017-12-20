import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
    name: 'RegExp',
    description: '正则表达式类型，用于正则查询！',
    parseValue(value) {
        let regex = new RegExp(value);
        return regex; // sent to resolvers
    },
    serialize(value) {
        let regex = new RegExp(value);
        return regex; // sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Query error: Can only parse dates strings, got a: ${ast.kind}`,
                [ast],
            );
        }
        let regex = new RegExp(ast.value);
        return  regex;
    },
});