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
          .insert({ stationName , stationType: "normal", stationStatus: "new" })
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
            .returning("*");
          const stationRoutes = await db("se_project.stationRoutes")
            .innerJoin(
              "se_project.routes",
              "se_project.routes.id",
              "se_project.stationRoutes.routeId"
            )
            .where("stationId", stationId)
            .returning("se_project.routes.id", "se_project.routes.routeName", "se_project.routes.fromStationId", "se_project.routes.toStationId");
          const routesIds = stationRoutes.map(route => route.routeId);
          console.log("routesIds =>", routesIds);
          let connectedStationsIds = (stationRoutes.map(route => (route.toStationId == stationId ? route.fromStationId : route.toStationId))).filter(id => id != stationId);
          connectedStationsIds = connectedStationsIds.filter((id, index) => connectedStationsIds.indexOf(id) === index);
          console.log("connectedStationsIds =>", connectedStationsIds);
          let addedRoute;
          for (let i = 0; i < connectedStationsIds.length-1; i++) {
            for (let j = i+1; j < connectedStationsIds.length; j++) {
              const newRoute1 = {
                "fromStationId": connectedStationsIds[i],
                "toStationId": connectedStationsIds[j],
                "routeName": "New Route"
              }
              addedRoute = (await db("se_project.routes").insert(newRoute1).returning("*"));
              console.log("addedRoute =>", addedRoute);
              let id = addedRoute[0].id;
              const newStationRoute1 = {
                "stationId": newRoute1.fromStationId,
                "routeId": id
              }
              console.log("newStationRoute1 =>", newStationRoute1);
              const newStationRoute2 = {
                "stationId": newRoute1.toStationId,
                "routeId": id
              }
              console.log("newStationRoute2 =>", newStationRoute2);
              await db("se_project.stationRoutes").insert(newStationRoute1).returning("*");
              await db("se_project.stationRoutes").insert(newStationRoute2).returning("*");
              const newRoute2 = {
                "fromStationId": connectedStationsIds[j],
                "toStationId": connectedStationsIds[i],
                "routeName": "New Route"
              }
              addedRoute = (await db("se_project.routes").insert(newRoute2).returning("*"));
              id = addedRoute[0].id;
              console.log("addedRoute =>", addedRoute);
              const newStationRoute3 = {
                "stationId": newRoute2.fromStationId,
                "routeId":  id
              }
              const newStationRoute4 = {
                "stationId": newRoute2.toStationId,
                "routeId":  id
              }
              await db("se_project.stationRoutes").insert(newStationRoute3).returning("*");
              await db("se_project.stationRoutes").insert(newStationRoute4).returning("*");
            }
          }
          const deletedStationRoutes1 = await db("se_project.stationRoutes")
            .whereIn("routeId", routesIds)
            .del()
            .returning("*");
          console.log("deletedStationRoutes1 =>", deletedStationRoutes1);
          const deletedRoutes = await db("se_project.routes")
            .whereIn("id", routesIds)
            .del()
            .returning("*");
            console.log("deletedRoutes =>", deletedRoutes);
          const deletedStation = await db("se_project.stations")
            .where("id", stationId)
            .del()
            .returning("*");
            console.log("deletedStation =>", deletedStation);
          return res.status(200).json(deletedStation);
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
