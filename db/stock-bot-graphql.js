const GraphQL = require('graphql');
const DB = require('./database-manager.js');
const MessageRouter = require('../message-router.js');


const User = new GraphQL.GraphQLObjectType({
    name: "User",
    fields: ({
        user_id: { type: GraphQL.GraphQLInt },
        username: { type: GraphQL.GraphQLString },
        nickname: { type: GraphQL.GraphQLString },
        client_id: { type: GraphQL.GraphQLString }
    })
});
const UserInput = new GraphQL.GraphQLInputObjectType({
    name: "UserInput",
    fields: ({
        user_id: { type: GraphQL.GraphQLInt },
        username: { type: GraphQL.GraphQLString },
        nickname: { type: GraphQL.GraphQLString },
        client_id: { type: GraphQL.GraphQLString }
    })
});

const UserResponse = new GraphQL.GraphQLObjectType({
    name: "UserResponse",
    fields: {
        response_id: { type: GraphQL.GraphQLInt },
        response_text: { type: GraphQL.GraphQLString },
        user_id: { type: GraphQL.GraphQLInt }
    }
});
const UserResponseInput = new GraphQL.GraphQLInputObjectType({
    name: "UserResponseInput",
    fields: {
        response_id: { type: GraphQL.GraphQLInt },
        response_text: { type: GraphQL.GraphQLString },
        user_id: { type: GraphQL.GraphQLInt }
    }
});

const FlowInput = new GraphQL.GraphQLInputObjectType({
    name: "FlowInput",
    fields: {
        hello: { type: GraphQL.GraphQLString }
    }
})


const schema = new GraphQL.GraphQLSchema({
  query: new GraphQL.GraphQLObjectType({
    name: 'RootQueryType',
    fields: ({
        users: {
            type: GraphQL.GraphQLList(User),
            args: {
                params: { type: UserInput }
            },
            resolve: (parent, {params}) => {
                return Promise.resolve(DB.getUsers(params));
            }
        },
        user_responses: {
            type: GraphQL.GraphQLList(UserResponse),
            args: {
                params: { type: UserResponseInput }
            },
            resolve: (parent, {params}) => {
                return Promise.resolve(DB.getUserResponses(params));
            }
        },
    })
  }),
  mutation: new GraphQL.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        user: {
            type: User,
            args: {
                params: { type: UserInput }
            },
            resolve: (parent, {params}) => {
                return Promise.resolve(DB.setUser(params));
            }
        },
        user_response: {
            type: UserResponse,
            args: {
                params: { type: UserResponseInput }
            },
            resolve: (parent, {params}) => {
                return Promise.resolve(DB.setUserResponse(params));
            }
        },
        the_flow: {
            type: GraphQL.GraphQLBoolean,
            args: {
                params: { type: FlowInput }
            },
            resolve: (parent, {params}) => {
                return Promise.resolve(MessageRouter.forwardFlow(params))
            }
        }
    }
  })
})

module.exports = schema;