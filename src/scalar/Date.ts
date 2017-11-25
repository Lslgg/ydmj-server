import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
    name: 'Date',
    description: '日期类型',
    parseValue(value) {
        return new Date(value); // sent to resolvers
    },
    serialize(value) {
        return value.toISOString(); // sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Query error: Can only parse dates strings, got a: ${ast.kind}`,
                [ast],
            );
        }
        if (isNaN(Date.parse(ast.value))) {
            throw new GraphQLError(`Query error: not a valid date`, [ast]);
        }
        return new Date(ast.value);
    },
});


