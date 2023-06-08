const { isEmpty, countBy, toLower } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
const { getSessionToken } = require('../../utils/session')
const getUser = async function (req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect("/");
  }
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

  user.isNormal = user.roleId === roles.user;
  user.isAdmin = user.roleId === roles.admin;
  user.isSenior = user.roleId === roles.senior;
  return user;
};


module.exports = function (app) {

  app.put("/users", async function (req, res) {
    try {


      const user = await getUser(req);
      // const {userId}=req.body

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
      if (user.isAdmin) {
        const { stationName } = req.body;
        if (!stationName) {
          return res.status(400).send("name is required");
        }
        const stationsWithName = await db("se_project.stations")
          .where("stationName", stationName)
          .returning("*");
        if (stationsWithName.length > 0)
          return res.status(400).send("Station with same name already exists!")
        const station = await db("se_project.stations")
          .insert({ stationName, stationType: "normal", stationStatus: "new" })
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
      if (user.isAdmin) {
        const { stationId } = req.params;
        const { stationName } = req.body;
        if (!stationId) {
          return res.status(400).send("stationId is required");
        }
        const stationsWithSameName = await db("se_project.stations")
          .where("stationName", stationName)
          .returning("*");
        if (stationsWithSameName.length > 0) {
          return res.status(400).send("There is a station with same name!");
        }
        let station = await db("se_project.stations")
          .where("id", stationId)
          .returning("*");
        const tickets1 = await db('se_project.tickets')
          .where('origin', station[0].stationName)
          .update({ origin: stationName })
          .returning("*");
        const tickets2 = await db("se_project.tickets")
          .where('destination', station[0].stationName)
          .update({ destination: stationName })
          .returning("*");
        const rides1 = await db("se_project.rides")
          .where('origin', station[0].stationName)
          .andWhere('status', 'upcoming')
          .update({ origin: stationName })
          .returning("*");
        const rides2 = await db("se_project.rides")
          .where("destination", station[0].stationName)
          .andWhere("status", "upcoming")
          .update({ destination: stationName })
          .returning("*");
        station = await db("se_project.stations")
          .where("id", stationId)
          .update({ stationName })
          .returning("*");
        return res.status(200).json(station);
      }
      else {
        return res.status(400).send("You are Unauthorized to do this action");
      }
    } catch (e) {
      return res.status(400).send("Could not update station");
    }
  });

  app.delete("/api/v1/station/:stationId", async function (req, res) {
    try {
      const user = await getUser(req);
      if (user.isAdmin) {
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
        for (let i = 0; i < connectedStationsIds.length - 1; i++) {
          for (let j = i + 1; j < connectedStationsIds.length; j++) {
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
              "routeId": id
            }
            const newStationRoute4 = {
              "stationId": newRoute2.toStationId,
              "routeId": id
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

  app.put('/api/v1/requests/refunds/:requestId', async function (req, res) {
    try {
      const user = await getUser(req);
      if (user.isAdmin) {
        const { requestId } = req.params;
        let { refundStaus } = req.body;
        refundStaus = toLower(refundStaus);

        if (!requestId) {
          return res.status(400).send("requestId is required");
        }
        if (!refundStaus) {
          return res.status(400).send("status is required");
        }
        let request = await db("se_project.refund_requests")
          .where("id", requestId)
          .returning("*");
        if (request[0].status === "accepted") {
          return res.status(400).send("Refund Already Accepted!");
        }
        if (refundStaus === "accepted") {
          const transaction = await db("se_project.transactions")
            .insert({ userId: request[0].userId, amount: request[0].refundAmount, purchasedId: request[0].ticketId, type: "Ticket Refund" })
            .insert({ userId: request[0].userId, amount: request[0].refundAmount, purchasedId: request[0].ticketId, type: "ticket" })
            .returning("*");
        }
        request = await db("se_project.refund_requests")
          .where("id", requestId)
          .update({ status: refundStaus })
          .returning("*");
        return res.status(200).json(request[0]);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    }
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not accept/reject");
    }
  });

  app.put('/api/v1/requests/senior/:requestId', async function (req, res) {
    try {
      const user = await getUser(req);
      if (user.isAdmin) {
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
          .where("id", request[0].userId)
          .update({ roleId: (seniorStaus === "accepted" ? 3 : 1) })
          .returning("*");
        return res.status(200).json(request[0]);
      }
      else
        return res.status(400).send("You are Unauthorized to do this action")
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not accept/reject");
    }
  });

  app.put('/api/v1/zones/:zoneId', async function (req, res) {
    try {
      const user = await getUser(req);
      if (user.isAdmin) {
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

  // really bteshta8al bmazagha if we remove v1, it works perfectly fine
  app.post("/api/v1/senior/request", async function (req, res) {
    let user = await getUser(req);
    let userId = user.userId;
    const { nationalId } = req.body;
    const requestExists = await db("se_project.senior_requests").select("*").where("userId", userId).andWhere("status", "pending").first();
    if (!isEmpty(requestExists)) {
      return res.status(400).send("This user already submitted a request to be a senior");
    }
    const newRequest =
    {
      status: "pending",
      userId,
      nationalId
    }
    try {
      const result = await db.insert(newRequest).into("se_project.senior_requests").returning("*");
      return res.status(200).json(result);
    }
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not create senior request");
    }
  });

  app.post("/api/v1/refund/:ticketId", async function (req, res) {
    const { ticketId } = req.params;
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
    if (ticketQuery.tripDate < (new Date())) {
      return res.status(400).send("This ticket is already expired");
    }
    if (ticketQuery.userId !== userId) {
      return res.status(400).send("This ticket doesn't belong to you");
    }

    const rideCompletedCheck = await db("se_project.rides").select("*").where("ticketId", ticketId).andWhere("status", "completed").first();
    if (!isEmpty(rideCompletedCheck)) {
      return res.status(400).send('This ticket is already used as the status for this ride is "completed"');
    }

    const refundsSearch = await db("se_project.refund_requests")
      .select("*")
      .where("ticketId", ticketId)
      .andWhere("userId", userId);
    if (!isEmpty(refundsSearch)) {
      return res.status(400).send("There is already a refund request for this ticket");
    }

    const tick = await db("se_project.tickets")
      .innerJoin("se_project.transactions", "se_project.tickets.id", "se_project.transactions.purchasedId")
      .where("se_project.tickets.id", ticketId)
      .andWhere("se_project.transactions.type", "ticket")
      .first();
    console.log("ticket   ", tick);
    const ticketPrice = tick.amount;

    console.log("ticketPrice   ", ticketPrice);

    try {
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
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not refund ticket");
    }

  });

  // Works
  app.put("/api/v1/ride/simulate", async function (req, res) {
    const { origin, destination, tripDate } = req.body;
    const user = await getUser(req);
    const userId = user.userId;
    const rideQuery = await db("se_project.rides").select("*").where("origin", origin).andWhere("destination", destination).andWhere("tripDate", tripDate).andWhere("userId", userId).first();
    const ticketId = rideQuery.ticketId;
    const checkAppliedRefReq = await db("se_project.refund_requests").select("*").where("ticketId", ticketId).andWhereNot("status", "rejected").first();
    if (!isEmpty(checkAppliedRefReq)) {
      return res.status(400).send("There is a refund request for this ticket. You can't simulate the ride");
    }
    try {
      const newRide = await db("se_project.rides")
        .where("origin", origin)
        .andWhere("destination", destination)
        .andWhere("tripDate", tripDate)
        .andWhere("userId", userId)
        .update("status", "completed")
        .returning("*");
      return res.status(200).json(newRide);
    }
    catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not simulate ride");
    }
  });

  //api to create a new route
  app.post("/api/v1/route", async function (req, res) {
    const { newStationId, connectedStationId, routeName } = req.body;
    const newRoute = {
      "fromStationId": newStationId,
      "toStationId": connectedStationId,
      routeName
    }
    try {
      if (await db("se_project.routes").select("*").where("fromStationId", newStationId).andWhere("toStationId", connectedStationId).first())
        return res.send("This route already exists! You can rename the already existing route if you want");

      fromStation = await db("se_project.stations").select("*").where("id", newRoute.fromStationId).first();
      if (!fromStation)
        return res.send("This source does not exist!");
      toStation = await db("se_project.stations").select("*").where("id", newRoute.toStationId).first();
      if (!toStation)
        return res.send("This destination does not exist!");
      if (fromStation.stationPosition == "middle" && toStation.stationPosition == "middle")
        return res.send("These stations are in the middle!");

      if (fromStation.stationPosition == null) {
        await db("se_project.stations").update("stationPosition", "start").where("id", fromStation.id);
        await db("se_project.stations").update("stationPosition", "middle").where("id", toStation.id);
      }
      else if (toStation.stationPosition == null) {
        await db("se_project.stations").update("stationPosition", "end").where("id", toStation.id);
        await db("se_project.stations").update("stationPosition", "middle").where("id", fromStation.id);
      }

      let addedRoute = await db("se_project.routes").insert(newRoute).returning("*");
      addedRoute = addedRoute[0];
      const s1 = { "stationId": newStationId, "routeId": addedRoute.id };
      await db("se_project.stationRoutes").insert(s1);
      await db("se_project.stations").update("stationStatus", "old").where("id", fromStation.id)
      const s2 = { "stationId": connectedStationId, "routeId": addedRoute.id };
      await db("se_project.stationRoutes").insert(s2);
      await db("se_project.stations").update("stationStatus", "old").where("id", toStation.id)
      return res.status(200).json(addedRoute);

    } catch (e) {
      return res.json(e.message);
    }
  })

  //api to update a route's name
  app.put("/api/v1/route/:routeId", async function (req, res) {
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
  app.delete("/api/v1/route/:routeId", async function (req, res) {
    const routeId = req.params.routeId;
    try {
      const stationsId = await db("se_project.routes").select("fromStationId", "toStationId").where("id", routeId).first();
      if (!stationsId)
        return res.status(302).send("This route id does not exist");

      fromStation = await db("se_project.stations").select("*").where("id", stationsId.fromStationId).first();
      toStation = await db("se_project.stations").select("*").where("id", stationsId.toStationId).first();

      if (fromStation.stationPosition == "middle" && toStation.stationPosition == "middle")
        return res.send("Can't delete a route in the middle!");

      let deletedRoute = await db("se_project.routes").delete().where("id", routeId).returning("*");
      deletedRoute = deletedRoute[0];

      if (!(await db("se_project.stationRoutes").select("*").where("stationId", fromStation.id).first())) {
        console.log(fromStation.stationPosition);
        await db("se_project.stations").update("stationPosition", fromStation.stationPosition).where("id", toStation.id);
        await db("se_project.stations").update("stationPosition", null).where("id", fromStation.id);
        return res.json(deletedRoute);
      }
      else if (!(await db("se_project.stationRoutes").select("*").where("stationId", toStation.id).first())) {
        await db("se_project.stations").update("stationPosition", toStation.stationPosition).where("id", fromStation.id);
        await db("se_project.stations").update("stationPosition", null).where("id", toStation.id);
        return res.json(deletedRoute);
      }

      if (fromStation.stationPosition == "start" && toStation.stationPosition == "middle") {
        await db("se_project.stations").update("stationPosition", "end").where("id", fromStation.id);
      }
      else if (fromStation.stationPosition == "middle" && toStation.stationPosition == "end") {
        await db("se_project.stations").update("stationPosition", "start").where("id", toStation.id);
      }

      

      return res.status(200).send(deletedRoute);


    } catch (e) {
      return res.send(e.message);
    }
  })

  app.put('/api/v1/password/reset', async function (req, res) {
    try {
      const newPassword = req.body.newPassword;
      const email = (await getUser(req)).email;
      console.log("newPassword", newPassword);

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

  app.post('/api/v1/payment/subscription', async function (req, res) {
    try {
      let { creditCardNumber, holderName, payedAmount, subType, zoneId } = req.body;
      let noOfTickets = 0;
      let deductionAmount = 0;

      zoneId = Number(zoneId);
      payedAmount = Number(payedAmount);

      // Calculate the number of tickets and deduction amount based on the subscription type and zone
      if (subType === 'monthly' && zoneId === 1) {
        noOfTickets = 10;
        deductionAmount = 30;
      }
      else if (subType === 'quarterly' && zoneId === 1) {
        noOfTickets = 50;
        deductionAmount = 175;
      }
      else if (subType === 'annual' && zoneId === 1) {
        noOfTickets = 100;
        deductionAmount = 370;
      }
      else if (subType === 'monthly' && zoneId === 2) {
        noOfTickets = 10;
        deductionAmount = 50;
      }
      else if (subType === 'quarterly' && zoneId === 2) {
        noOfTickets = 50;
        deductionAmount = 270;
      }
      else if (subType === 'annual' && zoneId === 2) {
        noOfTickets = 100;
        deductionAmount = 550;
      }
      else if (subType === 'monthly' && zoneId === 3) {
        noOfTickets = 10;
        deductionAmount = 70;
      }
      else if (subType === 'quarterly' && zoneId === 3) {
        noOfTickets = 50;
        deductionAmount = 340;
      }
      else if (subType === 'annual' && zoneId === 3) {
        noOfTickets = 100;
        deductionAmount = 650;
      }
      else {
        return res.status(400).send('Invalid subscription type or zone');
      }

      // Check if the user is a senior
      const user = await getUser(req);
      const userId = user.userId;

      if (user.roleId === 3) {
        deductionAmount = deductionAmount / 2; // Apply 50% discount
      }

      // Make sure that the paid amount is sufficient
      if (payedAmount < deductionAmount) {
        return res.status(400).send('Insufficient payment amount');
      }

      const subscriptions = await db('se_project.subsription');
      if (subscriptions.length > 0) {
        // Check if the user already has a subscription
        const existingSubscription = await db('se_project.subsription')
          .where('userId', userId)
          .first();


        if (existingSubscription) {
          // Check if the new subscription is an upgrade or downgrade
          const isUpgrade = (
            (subType === 'quarterly' && existingSubscription.subType === 'monthly') ||
            (subType === 'annual' && (existingSubscription.subType === 'monthly' || existingSubscription.subType === 'quarterly')) ||
            (zoneId > existingSubscription.zoneId)
          );

          if (!isUpgrade) {
            return res.status(400).send('Cannot downgrade subscription or subscription already exists');
          }

          // Delete the existing subscription but first change the subId in tickets to null

          await db('se_project.tickets')
            .where('subId', existingSubscription.id)
            .update({ subId: null });

          await db('se_project.subsription')
            .where('userId', userId)
            .del();
        }



      }

      const remainingAmount = payedAmount - deductionAmount;

      // Create the subscription record
      const subscription = await db('se_project.subsription').insert({
        subType: subType,
        zoneId: zoneId,
        userId: userId,
        noOfTickets: noOfTickets,
      });

      // Create the transaction record
      const sub = await db('se_project.subsription')
        .where('userId', userId)
        .select('id').first();
        
      const newTrans = {
        amount: deductionAmount,
        userId,
        purchasedId: sub.id,
        type: 'subscription',
      }
      // const subID=sub[0].id;
      const transaction = await db('se_project.transactions').insert(newTrans).returning("*");


      const message = 'Remaining Amount: ' + remainingAmount + 'Subscription Successful';

      return res.status(200).send({ message: message });
    } catch (e) {
      console.log(e.message);
      return res.status(400).send('Could not create subscription');
    }
  });

  app.post('/api/v1/payment/ticket', async function (req, res) {
    try {
      const { creditCardNumber, holderName, payedAmount, origin, destination, tripDate } = req.body;
      const user = (await getUser(req));
      const currentID = user.userId;
      const userSubscription = await db('se_project.subsription').where('userId', currentID).orderBy('id', 'desc').first();//getting the last subscription
      // console.log("userSubscription", userSubscription);
      if (!(userSubscription)) {
        if (origin === destination) {

          return res.status(400).send("price: 0, " + `You are already at your destination ${destination}`);
        } else {
          //checking if desitanationand origin are valid
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
            if (numberOfSations <= 9) {
              const zone = await db('se_project.zones').where('id', 1).first();
              priceThatShouldBePayed = zone.price;

            } else if (numberOfSations <= 16) {
              const zone = await db('se_project.zones').where('id', 2).first();
              priceThatShouldBePayed = zone.price;
              priceThatShouldBePayed = 7;
            } else {
              const zone = await db('se_project.zones').where('id', 3).first();
              priceThatShouldBePayed = zone.price;
              priceThatShouldBePayed = 10;
            }
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

              console.log("ticketId", ticketId);
              const ride = await db('se_project.rides').insert({
                status: "upcoming",
                origin: origin,
                destination: destination,
                userId: currentID,
                ticketId: ticketId,
                tripDate: tripDate,

              });

              return res.json({ price: priceThatShouldBePayed, stationToBeTaken, transferStations });
            } else {
              return res.status(400).send('Not enough money');
            }
          }
        }

      } else {
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
      if (hasSubscription && Object.keys(hasSubscription).length !== 0) {
        console.log(originResult, destinationResult);
        if (origin === destination) {
          return res.status(400).send("price: 0, " + `You are already at your destination ${destination}`);
        } else {

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
              const zone = await db('se_project.zones').where('id', 1).first();
              priceThatShouldBePayed = zone.price;

            } else if (numberOfSations <= 16) {
              const zone = await db('se_project.zones').where('id', 2).first();
              priceThatShouldBePayed = zone.price;
              priceThatShouldBePayed = 7;
            } else {
              const zone = await db('se_project.zones').where('id', 3).first();
              priceThatShouldBePayed = zone.price;
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

                amount: 0,
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

              return res.json({ price: priceThatShouldBePayed, stationToBeTaken, transferStations, numnberOfRemainingTickets });

            }
            else {

              return res.status(400).send('No tickets remaining');
            }
          }
        }
      } else {

        return res.status(400).send('User does not have a subscription  or incorrect subscription id was provided ');
      }

    } catch (e) {
      console.log(e.message);
      return res.status(400).send('Could not create ticket');
    }

  });

  app.post('/api/v1/tickets/price/:originId/:destinationId', async function (req, res) {
    const user = (await getUser(req));
    let numberOfSations = 0;
    let originID = Number(req.params.originId);
    let destinationID = Number(req.params.destinationId);
    const originResult = await db.select("id").from('se_project.stations').where('id', originID).first();
    const destinationResult = await db.select("id").from('se_project.stations').where('id', destinationID).first();
    if (!(originResult && destinationResult)) {
      return res.status(400).send('Invalid origin or destination');
    } else {
      let station = await getStationName(originID);
      if (originID === destinationID) {
        return res.json({ "price": 0, "message": `You are already at your destination ${station}` });
      } else {
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
        if (numberOfSations <= 9) {
          const zone = await db('se_project.zones').where('id', 1).first();
          priceThatShouldBePayed = zone.price;

        } else if (numberOfSations <= 16) {
          const zone = await db('se_project.zones').where('id', 2).first();
          priceThatShouldBePayed = zone.price;
          priceThatShouldBePayed = 7;
        } else {
          const zone = await db('se_project.zones').where('id', 3).first();
          priceThatShouldBePayed = zone.price;
          priceThatShouldBePayed = 10;
        }
        if (user.isSenior)
          priceThatShouldBePayed = priceThatShouldBePayed * 0.5;



        return res.json({ "price": priceThatShouldBePayed });

      }
    }
  });

  async function stationExists(stationId) {
    const station = await db("se_project.stations")
      .where("id", stationId)
      .first();
    return !isEmpty(station);
  }

};
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
        if (adj[u][i] == dest) {
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
  console.log("heloo");
  console.log(dist[dest]);
  console.log("Path is::");
  let route = "";
  for (let i = path.length - 1; i >= 0; i--) {
    console.log(path[i]);
    route += path[i]
  }
  console.log("route", route, "concatenated", dist[dest] + route);
  return dist[dest] + route;


  // printing path from source to destination

}
async function calculatePrice(source, dest) {
  // no. of vertices
  console.log("IN CALCULATE PRICE");
  let test = await db.count("*").from("se_project.stations");
  console.log("test:", test[0].count);
  let v = Number(test[0].count) + 1;
  console.log("printing V: ", v);

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

  console.log(fromTo);
  for (let i = 0; i < fromTo.length; i++) {
    a = fromTo[i].fromStationId;
    b = fromTo[i].toStationId;

    add_edge(adj, a, b);

  }
  console.log("HENAAAAAAAAAAAAAAA");
  console.log(adj)

  return shortestDistance(adj, source, dest, v);

  // The code is contributed by Gautam goel
}
async function getStationName(stationId) {
  let entry = await db('se_project.stations').where('id', stationId).first();
  let stationName = entry.stationName;
  return stationName;
}
async function isStationTransfer(stationId) {
  let entry = await db('se_project.stations').where('id', stationId).first();

  let stationtype = entry.stationType;
  return stationtype === "transfer";
}