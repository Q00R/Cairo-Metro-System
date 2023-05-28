const { isEmpty, countBy } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
const {getSessionToken}=require('../../utils/session')
const getUser = async function (req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect("/");
  }
  console.log("hi",sessionToken);
  const user = await db
    .select("*")
    .from("se_project.sessions")
    .where("token", sessionToken)
    .innerJoin(
      "se_project.users",
      "se_project.sessions.userId",
      "se_project.users.id"
    )
    .innerJoin(
      "se_project.roles",
      "se_project.users.roleId",
      "se_project.roles.id"
    )
   .first();

  console.log("user =>", user);
  user.isNormal = user.roleId === roles.user;
  user.isAdmin = user.roleId === roles.admin;
  user.isSenior = user.roleId === roles.senior;
  return user;
};

module.exports = function (app) {
  // example
  app.put("/users", async function (req, res) {
    try {
       const user = await getUser(req);
     // const {userId}=req.body
     console.log("hiiiiiiiiiii");
      const users = await db.select('*').from("se_project.users")
        
      return res.status(200).json(users);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not get users");
    }
  });

  // really bteshta8al bmazagha if we remove v1, it works perfectly fine
  app.post("/api/v2/senior/request", async function(req, res){
    let user = await getUser(req);
    let userId = user.userId;
    const {nationalId} = req.body;
    const requestExists = await db("se_project.senior_requests").select("*").where("userId", userId).first();
    if (!isEmpty(requestExists)) 
    {
      return res.status(400).send("This user already submitted a request to be a senior");
    }
    const newRequest = 
    {
      status: "pending",
      userId,
      nationalId
    }
    try
    {
      const result = await db.insert(newRequest).into("se_project.senior_requests").returning("*");
      return res.status(200).json(result); 
    }
    catch (e)
    { 
      console.log(e.message);
      return res.status(400).send("Could not create senior request");
    }
  });

  
// The calculate price is not working......
  app.post("/api/v1/refund/:ticketId", async function (req, res) {
    const { ticketId } = req.params;
    console.log("hena", ticketId);
    const user = await getUser(req);
    const userId = user.userId;
    const ticketQuery = await db
        .select("*")
        .from("se_project.tickets")
        .where("id", ticketId)
        .first();
    if (isEmpty(ticketQuery)) {
      return res.status(400).send("This ticket doesn't exist in the first place to be refunded");
    }
    if(ticketQuery.tripDate < (new Date()))
    {
      return res.status(400).send("This ticket is already expired");
    }
    if(ticketQuery.userId !== userId)
    {
      return res.status(400).send("This ticket doesn't belong to you");
    }
    const refundsSearch = await db("se_project.refund_requests")
    .select("*")
    .where("ticketId", ticketId)
    .andWhere("userId", userId);
    if (!isEmpty(refundsSearch))
    {
      return res.status(400).send("There is already a refund request for this ticket");
    }

    const tick = await db("se_project.transactions")
    .select("*")
    .where("purchasedId", ticketId)
    .andWhere("type", "ticket")
    .first();  
    const ticketPrice = tick.amount;

    try
    {
      const newRefund =
      {
        status: "pending",
        userId,
        refundAmount: ticketPrice,
        ticketId
      }
      const refund = await db("se_project.refund_requests").insert(newRefund).returning("*");
      return res.status(200).json(refund);
      
    }
    catch (e)
    {
      console.log(e.message);
      return res.status(400).send("Could not refund ticket");
    }
      
  });



  // Works
  app.put("/api/v1/ride/simulate", async function(req, res) {
    const {origin, destination, tripDate } = req.body;
    const user = await getUser(req);
    const userId = user.userId;
    console.log("user id", userId);
    try
    {
      const newRide = await db("se_project.rides")
      .where("origin", origin)
      .andWhere("destination", destination)
      .andWhere("tripDate", tripDate)
      .andWhere("userId", userId)
      .update("status", "completed")
      .returning("*");
      return res.status(200).json(newRide);
    }
    catch (e) 
    {
      console.log(e.message);
      return res.status(400).send("Could not simulate ride");
    }
  });


//api to create a new route
app.post("/api/v1/route",async function(req, res){
  const {newStationId, connectedStationId, routeName } = req.body;
  const newRoute = {
    "fromStationId": newStationId,
    "toStationId": connectedStationId,
    routeName
  }
  try {
    const addedRoute = await db("se_project.routes").insert(newRoute).returning("*");
    return res.status(200).json(addedRoute);
  } catch (e) {
    return res.send(e.message);
  }
})

//api to update a route's name
app.put("/api/v1/route/:routeId",async function(req, res){
  const routeName = req.body.routeName;
  const routeId = req.params.routeId;
  try {
    const updatedRoute = await db("se_project.routes").update("routeName", routeName).where("id", routeId).returning("*");
    return res.status(200).json(updatedRoute);
  } catch (e) {
    res.send(e.message);
  }
})

//api to delete a route
app.delete("/api/v1/route/:routeId",async function(req, res){
  const routeId = req.params.routeId  
  try {
    const stationsId = await db("se_project.routes").select("fromStationId","toStationId").where("id",routeId).first();
    n = await db("se_project.routes").count("fromStationId").where("fromStationId",stationsId.fromStationId).first().count;
    m = await db("se_project.routes").count("fromStationId").where("fromStationId",stationsId.toStationId).first().count;
    if(n>1 && m>1)
      return res.status(302).send("This route is not in the start or end")
    const deletedRoute = await db("se_project.routes").del().where("id", routeId).returning("*");
    return res.status(200).json(deletedRoute);
  } catch (e) {
    return res.send(e.message);
  }
})
};
// JavaScript code for printing shortest path between
// two vertices of unweighted graph
const max_value = 9007199254740992;

// a modified version of BFS that stores predecessor
// of each vertex in array p
// and its distance from source in array d
function BFS(adj, src, dest, v, pred, dist)
{
  console.log("IN BFS");
	// a queue to maintain queue of vertices whose
	// adjacency list is to be scanned as per normal
	// DFS algorithm
	let queue = [];

	// boolean array visited[] which stores the
	// information whether ith vertex is reached
	// at least once in the Breadth first search
	let visited = new Array(v);

	// initially all vertices are unvisited
	// so v[i] for all i is false
	// and as no path is yet constructed
	// dist[i] for all i set to infinity
	for (let i = 0; i < v; i++) {
		visited[i] = false;
		dist[i] = max_value;
		pred[i] = -1;
	}

	// now source is first to be visited and
	// distance from source to itself should be 0
	visited[src] = true;
	dist[src] = 0;
	queue.push(src);

	// standard BFS algorithm
	while (queue.length > 0) {
		let u = queue[0];
		queue.shift();
		for (let i = 0; i < adj[u].length; i++) {
			if (visited[adj[u][i]] == false) {
				visited[adj[u][i]] = true;
				dist[adj[u][i]] = dist[u] + 1;
				pred[adj[u][i]] = u;
				queue.push(adj[u][i]);

				// We stop BFS when we find
				// destination.
				if (adj[u][i] == dest){
          console.log("vsited", visited);
          return true;
        }

				
			}
		}
    
	}

	return false;
}

// utility function to print the shortest distance
// between source vertex and destination vertex
function shortestDistance(adj, s, dest, v)
{
  console.log("IN SHORTEST DISTANCE");
	// predecessor[i] array stores predecessor of
	// i and distance array stores distance of i
	// from s
	let pred = new Array(v).fill(0);
	let dist = new Array(v).fill(0);

	if (BFS(adj, s, dest, v, pred, dist) == false) {
		throw new Error("unreachable destination" );
	}

	// vector path stores the shortest path
	let path = new Array();
  
	let crawl = dest;
	path.push(crawl);
	while (pred[crawl] != -1) {
		path.push(pred[crawl]);
  
		crawl = pred[crawl];
  }
	// distance from source is in distance array
  console.log("heloo");
  console.log(dist[dest]);
  console.log("Path is::");
  let route="";
	for (let i = path.length - 1; i >= 0; i--){
		console.log(path[i]);
    route+=path[i]
  }
  console.log("route", route,"concatenated",dist[dest]+route);
    return dist[dest]+route;


	// printing path from source to destination
	
}

async function computingTicketPrice(originID, destinationID) {    
  const user = (await getUser(req));
    let numberOfSations = 0;
    console.log("hena")
    let priceThatShouldBePayed = 0;
    if (originID === destinationID) {
      return priceThatShouldBePayed;
    } else {
      try {
        retrievingRoute = await calculatePrice(originID, destinationID);
        numberOfSations = Number(retrievingRoute.charAt(0));
      }
      catch (e) {

        return (res.send(e.message));
      }
      
      if (numberOfSations <= 9)
        priceThatShouldBePayed = 5;
      else if (numberOfSations <= 16 && numberOfSations > 9)
        priceThatShouldBePayed = 7;
      else
        priceThatShouldBePayed = 10;

      if (user.isSenior)
        priceThatShouldBePayed = priceThatShouldBePayed * 0.5;



      return priceThatShouldBePayed;
    }
  }

async function calculatePrice(source, dest){
  // no. of vertices
  console.log("IN CALCULATE PRICE");
  let test = await db.count("*").from("se_project.stations");
  console.log("test:", test[0].count);
  let v = Number(test[0].count)+1;
  console.log("printing V: ",v);

  // array of vectors is used to store the graph
  // in the form of an adjacency list
  const adj = new Array(v).fill(0);

  for(let i = 0; i < v; i++){
    adj[i] = new Array();
  }

  // Creating graph given in the above diagram.
  // add_edge function takes adjacency list, source
  // and destination vertex as argument and forms
  // an edge between them.
  fromTo = await db.select("fromStationId","toStationId").from("se_project.routes");
  
  console.log(fromTo);
  for(let i=0;i<fromTo.length;i++){
    a=fromTo[i].fromStationId;
    b=fromTo[i].toStationId;
    
    adj[src].push(dest);

  }
  console.log("HENAAAAAAAAAAAAAAA");
  console.log(adj)
 
  return shortestDistance(adj, source, dest, v);

  // The code is contributed by Gautam goel
}
async function getStationName(stationId){
  let entry =await db('se_project.stations').where('id', stationId).first();
  let stationName=entry.stationName;
  return stationName;
 }

 async function isStationTransfer(stationId){
  let entry =await db('se_project.stations').where('id', stationId).first();
  
  let stationtype=entry.stationType;
  return stationtype==="transfer";
 }