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
 


  app.put("/api/v1/user/password/reset", async function (req, res) {
    if(session.userId === null)
    {
      return res.status(400).send("user not logged in");
    }
    else
    {
      const newPass = req.body.newPassword;
      db.update({password: newPass}).from("se_project.users").where("id", session.userId);
    }
  });

  app.get("/api/v1/zones", async function (req, res) {
    const zones = await db.select("*").from("se_project.zones");
    return res.status(200).json(zones);
  });

  app.post("/api/v1/payment/subscription", async function (req, res) {
    if(session.userId === null)
    {
      return res.status(400).send("user not logged in");
    }
    else
    {
      const newSub = {
        purchaseId: req.body.purchaseId,
        subType: req.body.subType,
        zoneId: req.body.zoneId,
        userId: session.userId,
        noOfTickets: req.body.amount,
        // why do we need the credit card number and holder name?
        creditCardNumber: req.body.creditCardNumber,
        holderName: req.body.holderName,
      };
      try {
        const sub = await db("se_project.subscriptions").insert(newSub).returning("*");
        return res.status(200).json(sub);
      } catch (e) {
        console.log(e.message);
        return res.status(400).send("Could not create subscription");
      }
    }
  });

  app.post("/api/v1/user/payment/ticket", async function (req, res) {
});

  
};
