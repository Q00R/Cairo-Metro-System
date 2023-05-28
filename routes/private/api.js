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
  // async function stationExists(stationId) {
  //   const station = await db("se_project.stations")
  //     .where("id", stationId)
  //     .first();
  //   return !isEmpty(station);
  // }
  // JavaScript code for printing shortest path between
  // two vertices of unweighted graph
  const max_value = 9007199254740992;

  // utility function to form edge between two vertices
  // source and dest
  function add_edge(adj, src, dest) {
    Number(src);
    Number(dest);
    adj[src].push(dest);
  }

  // a modified version of BFS that stores predecessor
  // of each vertex in array p
  // and its distance from source in array d
  function BFS(adj, src, dest, v, pred, dist) {
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
          if (adj[u][i] == dest)
            return true;
        }
      }
    }
    return false;
  }

  // utility function to print the shortest distance
  // between source vertex and destination vertex
  function shortestDistance(adj, s, dest, v) {
    console.log("IN SHORTEST DISTANCE");
    // predecessor[i] array stores predecessor of
    // i and distance array stores distance of i
    // from s
    let pred = new Array(v).fill(0);
    let dist = new Array(v).fill(0);

    if (BFS(adj, s, dest, v, pred, dist) == false) {
      throw new Error("unreachable destination");
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
    console.log("Path is::");
    let route = "";
    for (let i = path.length - 1; i >= 0; i--) {
      console.log(path[i]);
      route += path[i]
    }
    console.log("route", route, "route concatenated with # of stations", dist[dest] + route);
    return dist[dest] + route;


    // printing path from source to destination

  }
  async function calculatePrice(source, dest) {
    // no. of vertices
    console.log("IN CALCULATE PRICE");
    let test = await db.count("*").from("se_project.stations");
    let v = Number(test[0].count) + 1;

    // array of vectors is used to store the graph
    // in the form of an adjacency list
    const adj = new Array(v).fill(0);

    for (let i = 0; i < v; i++) {
      adj[i] = new Array();
    }

    // Creating graph given in the above diagram.
    // add_edge function takes adjacency list, source
    // and destination vertex as argument and forms
    // an edge between them.
    fromTo = await db.select("fromStationId", "toStationId").from("se_project.routes");


    for (let i = 0; i < fromTo.length; i++) {
      a = fromTo[i].fromStationId;
      b = fromTo[i].toStationId;

      add_edge(adj, a, b);

    }


    return shortestDistance(adj, source, dest, v);

    // The code is contributed by Gautam goel
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
          .returning("*");
        const tickets1 = await db("se_project.tickets")
          .where("origin", station.stationName)
          .update({ origin: stationName })
          .returning("*");
        const tickets2 = await db("se_project.tickets")
          .where("destination", station.stationName)
          .update({ destination: stationName })
          .returning("*");
        const rides1 = await db("se_project.rides")
          .where("origin", station.stationName)
          .andWhere("status", "upcoming")
          .update({ origin: stationName })
          .returning("*");
        const rides2 = await db("se_project.rides")
          .where("destination", station.stationName)
          .andWhere("status", "upcoming")
          .update({ destination: stationName })
          .returning("*");
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
        if (refundStaus == "accepted"){
          const transaction = await db("se_project.transactions")
            .insert({ userId: request.userId, amount: request.refundAmount, purchasedId: request.ticketId })
            .returning("*");
          const ticket = await db("se_project.tickets")
            .where("id", request.ticketId)
            .del()
            .returning("*");
        }
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
        const dbUser = await db("se_project.users")
          .where("id", request.userId)
          .update({ roleId: 3 })
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
