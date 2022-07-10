const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLEnumType,
    GraphQLNonNull,
} = require("graphql");
const { clientSchema } = require("../models/Client");
const { projectSchema } = require("../models/Project");
// const {
//     projects,
//     clients
// } = require("../sampleData");
const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: {
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
    }
})
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: {
        id: {
            type: GraphQLID
        },
        clientId: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        status: {
            type: GraphQLString
        },
        client:{
            type:ClientType,
            resolve(parent,args){
                return clientSchema.findById(parent.clientId)
            }
        }
    }
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        clients: {
            type: GraphQLList(ClientType),
            resolve(parent, args) {
                return clientSchema.find();
            }
        },
        client: {
            type: ClientType,
            args: {
                id: {
                    type: GraphQLString,
                }
            },
            resolve: (parent, args) => {
                return clientSchema.findById(args.id)
            }
        },
        //get project by id
        projects: {
            type: GraphQLList(ProjectType),
            resolve(parent, args) {
                return projectSchema.find();
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve: (parent, args) => {
                // console.log(parent);
                return projectSchema.findById(args.id)
            }
        }
    }
})
const mutation=new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addClient:{
            type:ClientType,
            args:{
                name:{
                    type:GraphQLString
                },
                email:{
                    type:GraphQLString
                },
                phone:{
                    type:GraphQLString
                }
            }, 
            resolve(parent,args){
                const client=new clientSchema({
                    name:args.name,
                    email:args.email,
                    phone:args.phone
                });
                return client.save();
            }
        },
        deleteClient:{
            type:ClientType,
            args:{
                id:{
                    type:GraphQLID
                }
            },
            resolve(parent,args){
                return clientSchema.findByIdAndDelete(args.id)
            }
        }
        ,
        //add project
        addProject:{
            type:ProjectType,
            args:{
                name:{
                    type:GraphQLString
            },
            description:{
                type:GraphQLString
        },
        status:{
            type:new GraphQLEnumType({
                name:"proj_status",
                values:{
                    "new":{
                        value:"New project"
                    },
                    "progress":{
                        value:"In progress"
                    },
                    "complete":{
                    value:"Completed"
                    }
                }
            }),
            defaultValue:"Not started"
        },
        clientId:{
            type:GraphQLID
        }
    },
    resolve(parent,args){
        const project=new projectSchema({
            name:args.name,
            description:args.description,
            status:args.status,
            clientId:args.clientId
        })
        return project.save();
    }
},
//delete project
deleteProject:{
    type:ProjectType,
    args:{
        id:{
            type:GraphQLID
        }
    },
    resolve(parent,args){
        return projectSchema.findByIdAndDelete(args.id);
    }
},
//update project
updateProject:{
    type:ProjectType,
    args:{
        id:{
            type:GraphQLNonNull(GraphQLID)
        },
        name:{
            type:GraphQLString
        },
       description:{
        type:GraphQLString
       },
       status:{
        type:new GraphQLEnumType({
            name:"update_status",
            values:{
                "new":{
                    value:"New project"
                },
                "progress":{
                    value:"In progress"
                },
                "complete":{
                value:"Completed"
                }
            }
        }),
        defaultValue:"Not started"
    }
    },
    resolve(parent,args){
        return projectSchema.findByIdAndUpdate(args.id,{
            name:args.name,
            description:args.description,
            status:args.complete
        },
        {
        new:true
        }
        )
    }
}
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})