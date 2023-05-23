const { isEmpty } = require("lodash");
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
  
  app.post("/api/v1/station", async function (req, res) {
    try {
      const user = await getUser(req);
      if (user.isAdmin){
        const { stationName } = req.body;
        if (!stationName) {
          return res.status(400).send("name is required");
        }
        const station = await db("se_project.stations")
          .insert({ stationName , stationType: "normal", stationStatus: "new created" })
          .returning("*");
        return res.status(200).json(station);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not create station");
    }
  });

  app.put("/api/v1/station/:stationId", async function (req, res) {
    try {
      const user = await getUser(req);
      if(user.isAdmin){
        const { stationId } = req.params;
        const { stationName } = req.body;
        if (!stationId) {
          return res.status(400).send("stationId is required");
        }
        const station = await db("se_project.stations")
          .where("id", stationId)
          .update({ stationName })
          .returning("*");
        return res.status(200).json(station);
      }
      else{
        return res.status(400).send("You are Unauthorized to do this action");
      }
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not update station");
    }
  });
  
  app.delete("/api/v1/station/:stationId", async function (req, res) {
    try {
      const user = await getUser(req);
        if (user.isAdmin){
        const { stationId } = req.params;
        if (!stationId) {
          return res.status(400).send("stationId is required");
        }
        const station = await db("se_project.stations")
          .where("id", stationId)
          .del()
          .returning("*");
        return res.status(200).json(station);
        }
        else
          return res.status(400).send("You are Unauthorized to do this action")
    }
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not delete station");
    }
  });

  app.put('/api/v1/requests/refunds/:requestId', async function (req, res){
    try {
      const user = await getUser(req);
      if (user.isAdmin){
        const { requestId } = req.params;
        const { refundStaus } = req.body;
        if (!requestId) {
          return res.status(400).send("requestId is required");
        }
        if (!refundStaus) {
          return res.status(400).send("status is required");
        }
        const request = await db("se_project.refund_requests")
          .where("id", requestId)
          .update({ status: refundStaus })
          .returning("*");
        return res.status(200).json(request);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    }
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not accept/reject");
    }
  });

  app.put('/api/v1/requests/senior/:requestId', async function (req, res){
    try {
      const user = await getUser(req);
      if (user.isAdmin){
        const { requestId } = req.params;
        const { seniorStaus } = req.body;
        if (!requestId) {
          return res.status(400).send("requestId is required");
        }
        if (!seniorStaus) {
          return res.status(400).send("status is required");
        }
        const request = await db("se_project.senior_requests")
          .where("id", requestId)
          .update({ status: seniorStaus })
          .returning("*");
        return res.status(200).json(request);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not accept/reject");
    }
  });

  app.put('/api/v1/zones/:zoneId', async function (req, res){
    try {
      const user = await getUser(req);
      if (user.isAdmin){
        const { zoneId } = req.params;
        const { price } = req.body;
        if (!zoneId) {
          return res.status(400).send("zoneId is required");
        }
        if (!price) {
          return res.status(400).send("price is required");
        }
        const zone = await db("se_project.zones")
          .where("id", zoneId)
          .update({ price })
          .returning("*");
        return res.status(200).json(zone);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not update zone price");
    }
  });

};