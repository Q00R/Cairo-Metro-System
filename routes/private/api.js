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
      "se_project.sessions.userid",
      "se_project.users.id"
    )
    .innerJoin(
      "se_project.roles",
      "se_project.users.roleid",
      "se_project.roles.id"
    )
   .first();

  console.log("user =>", user);
  user.isNormal = user.roleid === roles.user;
  user.isAdmin = user.roleid === roles.admin;
  user.isSenior = user.roleid === roles.senior;
  console.log("user =>", user)
  return user;
};

module.exports = function (app) {
  // example
  app.get("/users", async function (req, res) {
    try {
       const user = await getUser(req);
      const users = await db.select('*').from("se_project.users")
        
      return res.status(200).json(users);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not get users");
    }
   
  });
 app.put("/api/v1/station/:stationId", async function (req, res) {
   try {
     const user = await getUser(req);
     if (user.isAdmin) {
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
     } else {
       return res.status(400).send("You are Unauthrized to do this action");
     }
   } catch (e) {
     console.log(e.message);
     return res.status(400).send("Could not update station");
   }
 });

 app.post("/api/v1/station", async function (req, res) {
   try {
     const user = await getUser(req);
     if (user.isAdmin) {
       console.log(req.body);
       const { stationName } = req.body;
       if (!stationName) {
         return res.status(400).send("name is required");
       }
       const station = await db("se_project.stations")
         .insert({
           stationName,
           stationType: "normal",
           stationStatus: "new created",
         })
         .returning("*");
       return res.status(200).json(station);
     } else {
       return res.status(400).send("You are Unauthrized to do this action");
     }
   } catch (e) {
     console.log(e.message);
     return res.status(400).send("Could not create station");
   }
 });

 app.delete("/api/v1/station/:stationId", async function (req, res) {
   try {
     const user = await getUser(req);
     const { stationId } = req.params;
     if (!stationId) {
       return res.status(400).send("stationId is required");
     }
     const station = await db("se_project.stations")
       .where("id", stationId)
       .del()
       .returning("*");
     return res.status(200).json(station);
   } catch (e) {
     console.log(e.message);
     return res.status(400).send("Could not delete station");
   }
 });


  
};
