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
 

  
  // doesn't want to work for some reason
  

app.post("/api/v1/refund/:ticketId", async function (req, res) {
  const ticketId = req.params.ticketId;
  const ticketQuery = await db
      .select("*")
      .from("se_project.tickets")
      .where("id", ticketId)
      .first();
    if (isEmpty(ticketQuery)) {
      return res.status(400).send("This ticket doesn't exist in the first place to be refunded");
    }
    else
    {
      db.del().where('id', '==', ticketId)
    }
});



// not yet tested as it requires some rides that are not yet created
app.put("/api/v1/ride/simulate", async function(req, res) {
  const {origin, destination, tripDate } = req.body;
  const userId = getUser(req).userId;
  try
  {
    const newRide = await db("se_project.rides")
    .where("origin", origin)
    .andWhere("destination", destination)
    .andWhere("tripDate", tripDate)
    .andWhere(userId, userId)
    .update("status", "completed").returning("*");
    return res.status(200).json(newRide);
  }
  catch (e) 
  {
    console.log(e.message);
    return res.status(400).send("Could not simulate ride");
  }
});

app.post("/api/v1/senior/request", async function (req, res) {
  userId = await getUser(req).userId;
  const requestExists = await db
    .select("*")
    .from("se_project.senior_requests")
    .where("userId", userId);
  if (!isEmpty(requestExists)) {
    return res.status(400).send("This user already submitted a request to be a senior");
  }
  const newRequest = 
  {
    status: "pending",
    userId,
    nationalId: req.body.nationalId
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

app.post("/api/v1/senior/request", async function (req, res) {
  userId = await getUser(req).userId;
  const requestExists = await db
    .select("*")
    .from("se_project.senior_requests")
    .where("userId", userId);
  if (!isEmpty(requestExists)) {
    return res.status(400).send("This user already submitted a request to be a senior");
  }
  const newRequest = 
  {
    status: "pending",
    userId,
    nationalId: req.body.nationalId
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
