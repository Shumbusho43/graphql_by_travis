const express=require('express');
const expressGraphQl=require('express-graphql').graphqlHTTP;
require("dotenv").config();
const Port=process.env.PORT || 3000
const schema=require("./schema/schema")
const app = express();
app.use(express.json())
app.use("/graphql", expressGraphQl({
    schema,
    graphiql:process.env.NODE_ENV==="development"
}))
app.listen(Port,()=>{
console.log('listening on port '+Port);
})
require("./config/db")