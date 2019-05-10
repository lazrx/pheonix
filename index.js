const cloud = require("@pulumi/cloud-aws");
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const mime = require("mime");
const awsx = require("@pulumi/awsx");
const qs = require('querystring');

//This is a basic CRUD example using AmazonAPIGateway, Lambdas to shuffle stuff around, and DDB for state.

//TODO read more here https://blog.pulumi.com/protecting-your-apis-with-lambda-authorizers-and-pulumi
//jwt token auth is supported, we should probably use cognito with a lambda and route in api gateway to vend these
//https://pulumi.io/reference/pkg/nodejs/@pulumi/awsx/apigateway/#API
//logs here: https://blog.pulumi.com/unified-logs-with-pulumi-logs
//
//TODO need a lot more validation/exception handler on promises, probably look into async/await instead as well

//make a table to store our expressed interests
let contactTable = new cloud.Table("contactTable", "id", "number", {});

// Create an API endpoint

let interestEndpoint = new cloud.API("interest");

interestEndpoint.post("/interest", (req, res) => {
    try {
	//TODO validation
	let data = qs.parse(req.body.toString()); //this is a buffer and parse wants a string I guess...
	let id = Math.floor((Math.random() * 100000) + 1)
        contactTable.insert({id, firstname:data.firstname, lastname:data.lastname}).then(() => {
	    res.status(200).json({"saved-data-under-id":id, "firstname":data.firstname, "lastname":data.lastname});
	    console.log(`registered interest for ${req.body} with id ${id} parsed value of ${JSON.stringify(data)}`);
	});
    } catch(e) {
        console.log(`failed to save interest for ${req.body} + ${e}`);
	res.status(500).json({"error-saving-data":e});
    }
   
});

interestEndpoint.get("/lookup-data", (req, res) => {
    //TODO more validation
    let id = parseInt(req.query["id"]);
    console.log(`attempting /lookup-data for id ${id}`);
    contactTable.get({id}).then(value => {
        res.status(200).json(value);
        console.log(`found data on /lookup-data id ${id} retrieved ${JSON.stringify(value)}`);
    });
});

interestEndpoint.get("/all-interest" , (req, res) => {
    console.log("displaying interest form");
    contactTable.scan().then(items=> {
        res.status(200).json(items);
        console.log(`/all-interest retrieved ${items.length} items`);
    });  
});

//serve our static pages
interestEndpoint.static("/", "www");

//export the endpoint for our interest apis
exports.interestEndpoint = interestEndpoint.publish().url;
