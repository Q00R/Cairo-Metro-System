const { isEmpty } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
const { getSessionToken } = require('../../utils/session');
const e = require("express");

const getUser = async function (req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect("/");
  }
  console.log("hi", sessionToken);
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
  if (!user) {
    throw new Error("User not found");
  }
  console.log("user =>", user);
  user.isNormal = user.roleId === roles.user;
  user.isAdmin = user.roleId === roles.admin;
  user.isSenior = user.roleId === roles.senior;
  console.log("user =>", user)
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
  app.put('/api/v1/password/reset', async function (req, res) {
    try {
      const newPassword = req.body.newPassword;
      const email = (await getUser(req)).email;


      // Update the user's password in the database
      await db('se_project.users').where('email', email).update({
        password: newPassword
      });

      return res.status(200).send('Password reset successfully');
    } catch (e) {
      console.log(e.message);
      return res.status(400).send('Could not reset password');
    }
  });



  app.get('/api/v1/zones', async function (req, res) {
    try {
      const zones = await db.select('*').from("se_project.zones")
      return res.status(200).json(zones);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not get zones");
    }
  });
















  app.post('/api/v1/payment/ticket', async function (req, res) {

    console.log("straaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat");
    try {
      const {creditCardNumber, holderName, payedAmount, origin, destination, tripDate } = req.body;
      const user = (await getUser(req));
      const currentID = user.userId;
      const userSubscription = await db('se_project.subsription').where('userId', currentID).orderBy('id', 'desc').first();//getting the last subscription
      console.log("userSubscription", userSubscription);
      if (!(userSubscription)) {
        if(origin===destination){
          return res.json({ "Price that should be paid": 0 ,"you are already at your destination": destination});
        }else{
        //checking if desitanationand origin are valid
        console.log("checking if desitanation and origin are valid");
        const originResult = await db.select("id").from('se_project.stations').where('stationName', origin).first();
        const destinationResult = await db.select("id").from('se_project.stations').where('stationName', destination).first();
        console.log(!(originResult && destinationResult));
        if (!(originResult && destinationResult)) {
          return res.status(400).send('Invalid origin or destination');
        } else {

        const originID = originResult.id;
        const destinationID = destinationResult.id;
        let retrievingRoute = "";
        let numberOfSations = 0;
        let priceThatShouldBePayed = 0;
        let route = "";
        try {
          retrievingRoute = await calculatePrice(originID, destinationID);
          numberOfSations = Number(retrievingRoute.charAt(0));
          route = retrievingRoute.substring(1);
        }
        catch (e) {

          return (res.send(e.message));
        }
        const stationToBeTaken = [];
        const transferStations = [];
        for (let i = 0; i < route.length; i++) {
          let id = Number(route.charAt(i));
          stationToBeTaken.push(await getStationName(id));
          if (await isStationTransfer(id)) {
            transferStations.push(await getStationName(id));
          }
        }
        if (numberOfSations <= 9)
          priceThatShouldBePayed = 5;
        else if (numberOfSations <= 16 && numberOfSations > 9)
          priceThatShouldBePayed = 7;
        else
          priceThatShouldBePayed = 10;

        if (user.isSenior)
          priceThatShouldBePayed = priceThatShouldBePayed * 0.5;




        if (priceThatShouldBePayed <= payedAmount) {

          const newticket = {
            origin: origin,
            destination: destination,
            userId: currentID,
            subId: null,
            tripDate: tripDate
          }


          const ticket = await db('se_project.tickets').insert(newticket).returning("*");
          const ticketId = ticket[0].id;
          const transaction = await db('se_project.transactions').insert({

            amount: priceThatShouldBePayed,
            userId: currentID,
            purchasedId: ticketId,
            type: "ticket"
          });

          const ride = await db('se_project.rides').insert({
            status: "upcoming",
            origin: origin,
            destination: destination,
            userId: currentID,
            ticketId: ticketId,
            tripDate: tripDate,

          });

          console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
          return res.json({ priceThatShouldBePayed, stationToBeTaken, transferStations });
        } else {
          console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
          return res.status(400).send('Not enough money');
        }
      }
      }

      } else {
        console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        return res.status(400).send('User has a subscription not the right api for purchasing ticket');
      }


    } catch (e) {
      console.log(e.message);
      return res.status(400).send('Could not create ticket');
    }
  });


  app.post('/api/v1/tickets/purchase/subscription', async function (req, res) {
    try {
      const { subId, origin, destination, tripDate } = req.body;
      const user = (await getUser(req));
      console.log(user);
      const currentID = user.userId;
      const hasSubscription = await db('se_project.subsription').where('id', subId).where('userId', currentID).first();
      const originResult = await db.select("id").from('se_project.stations').where('stationName', origin).first();
      const destinationResult = await db.select("id").from('se_project.stations').where('stationName', destination).first();
      console.log("hasSubscription", hasSubscription);
      //Object.keys(myObject).length
      if (hasSubscription && Object.keys( hasSubscription).length !== 0) {
        console.log(originResult, destinationResult);
        if(origin===destination){
          return res.json({ "Price that should be paid": 0 ,"you are already at your destination": destination});
        }else{

        console.log(!(originResult && destinationResult));
        if (!(originResult && destinationResult)) {
          return res.status(400).send('Invalid origin or destination');
        } else {

          const originID = originResult.id;
          const destinationID = destinationResult.id;
          let retrievingRoute = "";
          let numberOfSations = 0;
          let priceThatShouldBePayed = 0;
          let route = "";
          try {
            retrievingRoute = await calculatePrice(originID, destinationID);
            numberOfSations = Number(retrievingRoute.charAt(0));
            route = retrievingRoute.substring(1);
          }
          catch (e) {

            return (res.send(e.message));
          }
          const stationToBeTaken = [];
          const transferStations = [];
          for (let i = 0; i < route.length; i++) {
            let id = Number(route.charAt(i));
            stationToBeTaken.push(await getStationName(id));
            if (await isStationTransfer(id)) {
              transferStations.push(await getStationName(id));
            }
          }


          console.log("back");
          if (numberOfSations <= 9) {
            priceThatShouldBePayed = 5;

          } else if (numberOfSations <= 16) {
            priceThatShouldBePayed = 7;
          } else {
            priceThatShouldBePayed = 10;
          }
          if (user.isSenior) {
            priceThatShouldBePayed = priceThatShouldBePayed * 0.5;
          }
          console.log("priceThatShouldBePayed", priceThatShouldBePayed)




          let subscription = await db('se_project.subsription').where('id', subId).where('userId', currentID).first();
          let numnberOfRemainingTickets = subscription.noOfTickets;
          console.log("numnberOfRemainingTickets before purchaing", numnberOfRemainingTickets)
          if (numnberOfRemainingTickets > 0) {
            numnberOfRemainingTickets = numnberOfRemainingTickets - 1;
            let userSubscription = await db('se_project.subsription').where('id', subId).where('userId', currentID).update({
              noOfTickets: numnberOfRemainingTickets
            });
            const newticket = {
              origin: origin,
              destination: destination,
              userId: currentID,
              subId: subId,
              tripDate: tripDate
            }


            const ticket = await db('se_project.tickets').insert(newticket).returning("*");
            const ticketId = ticket[0].id;
            const transaction = await db('se_project.transactions').insert({

              amount: priceThatShouldBePayed,
              userId: currentID,
              purchasedId: ticketId,
              type: "ticket"
            });

            const ride = await db('se_project.rides').insert({
              status: "upcoming",
              origin: origin,
              destination: destination,
              userId: currentID,
              ticketId: ticketId,
              tripDate: tripDate,

            });

            console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            return res.json({ numnberOfRemainingTickets, priceThatShouldBePayed, stationToBeTaken, transferStations });

          }
          else {
            console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

            return res.status(400).send('No tickets remaining');
          }
        }
      } 
      } else {
        console.log("User does not have a subscription not corrct api for purchasing ticket", "DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

        return res.status(400).send('User does not have a subscription not corrct api for purchasing ticket');
      }

    } catch (e) {
      console.log(e.message, "DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

      console.log(e.message);
      return res.status(400).send('Could not create ticket');
    }

  });




  app.get('/api/v1/tickets/price/:originId & :destinationId', async function (req, res) {
    const user = (await getUser(req));
    let numberOfSations = 0;
    console.log("hena")
    let originID = Number(req.params.originId);
    let destinationID = Number(req.params.destinationId);
    if(origin===destination){
      return res.json({ "Price that should be paid": 0 });
    }else{
    try {
      retrievingRoute = await calculatePrice(originID, destinationID);
      numberOfSations = Number(retrievingRoute.charAt(0));
      route = retrievingRoute.substring(1);
    }
    catch (e) {

      return (res.send(e.message));
    }
    const stationToBeTaken = [];
    const transferStations = [];
    for (let i = 0; i < route.length; i++) {
      let id = Number(route.charAt(i));
      stationToBeTaken.push(await getStationName(id));
      if (await isStationTransfer(id)) {
        transferStations.push(await getStationName(id));
      }
    }
    if (numberOfSations <= 9)
      priceThatShouldBePayed = 5;
    else if (numberOfSations <= 16 && numberOfSations > 9)
      priceThatShouldBePayed = 7;
    else
      priceThatShouldBePayed = 10;

    if (user.isSenior)
      priceThatShouldBePayed = priceThatShouldBePayed * 0.5;



    return res.json({ "Price that should be paid": priceThatShouldBePayed });
  }
  });




  async function getStationName(stationId) {
    console.log("getStationName")
    let entry = await db('se_project.stations').where('id', stationId).first();
    let stationName = entry.stationName;
    return stationName;
  }

  async function isStationTransfer(stationId) {
    console.log("isStationTransfer")
    let entry = await db('se_project.stations').where('id', stationId).first();

    let stationtype = entry.stationType;
    return stationtype === "transfer";
  }









  // JavaScript code for printing shortest path between
  // two vertices of unweighted graph
  const max_value = 9007199254740992;

  // utility function to form edge between two vertices
  // source and dest
  function add_edge(adj, src, dest) {
    Number(src);
    Number(dest);


    adj[src].push(dest);
    adj[dest].push(src);

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








};

