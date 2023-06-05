const db = require('../../connectors/db');
const roles = require('../../constants/roles');
const { getSessionToken } = require('../../utils/session');

const getUser = async function(req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect('/');
  }

  const user = await db.select('*')
    .from('se_project.sessions')
    .where('token', sessionToken)
    .innerJoin('se_project.users', 'se_project.sessions.userId', 'se_project.users.id')
    .innerJoin('se_project.roles', 'se_project.users.roleId', 'se_project.roles.id')
    .first();
  
  //console.log('user =>', user)
  user.isNormal = user.roleId === 1;
  user.isAdmin = user.roleId === 2;
  user.isSenior = user.roleId === 3;

  return user;  
}

module.exports = function(app) {
  // Register HTTP endpoint to render /users page
  app.get('/dashboard', async function(req, res) {
    const user = await getUser(req);
    return res.render('dashboard', user);
  });

  // Register HTTP endpoint to render /users page
  app.get('/users', async function(req, res) {
    const user = await getUser(req);
    const users = await db.select('*').from('se_project.users');
    return res.render('users', { ...user,users });
  });

  // Register HTTP endpoint to render /courses page
  app.get('/stations', async function(req, res) {
    const user = await getUser(req);
    const stations = await db.select('*').from('se_project.stations').orderBy("id");
    return res.render('stations_example', { ...user, stations });
  });

  app.get('/manage/routes', async function(req, res) {
    const user = await getUser(req);
    const routes = await db.select('*').from('se_project.routes').orderBy("id");
    return res.render('routes', { ...user, routes });
  });

  app.get('/manage/routes/edit/:routeId', async function(req, res) {
    const user = await getUser(req);
    const routes = await db.select('*').from('se_project.routes').orderBy("id");
    return res.render('routesUpdate', { ...user, routes });
  });

  app.get('/manage/routes/create', async function(req, res) {
    const user = await getUser(req);
    return res.render('routesCreate', { ...user});
  });

  app.get('/resetPassword', async function(req, res) {
    const user = await getUser(req);
    return res.render('resetPassword', {...user});
  });
  
 app.get('/requests/refund', async function(req, res) {
  const user = await getUser(req);
  const userId = user.userId;
  const userTickets = await db("se_project.tickets")
  .where("userId", userId)
  .returning("*");
  const hasNoTickets = userTickets.length === 0;
  return res.render('refund_request', {...user, userTickets, hasNoTickets });
 });

 app.get('/requests/senior', async function(req, res) {
  const user = await getUser(req);
  return res.render('senior_request', {...user});
 });

 app.get('/rides/simulate', async function(req, res) {
  const user = await getUser(req);
  const userId = user.userId;
  const rides = await db.select('*').from('se_project.rides').where('userId', userId);
  return res.render('rides', { ...user, rides });
  });

 app.get('/price', async function(req, res) {
  const user = await getUser(req);
  const stations = await db.select('*').from('se_project.stations');
  return res.render('price', { ...user, stations });
 });

app.get('/subscriptions/purchase', async function(req, res) {
  const user = await getUser(req);
  const zones = await db.select('*').from('se_project.zones');
  return res.render('subscriptions/purchase', { ...user, zones });
});

app.get('/subscriptions', async function(req, res) {
  const user = await getUser(req);
  const subscriptions = await db.select('*').from('se_project.subsription').where('userId', user.userId);
  const hasNoSubscription = subscriptions.length === 0;
  return res.render('subscriptions', { ...user, subscriptions, hasNoSubscription });
});

app.get('/price', async function(req, res) {

  const user = await getUser(req);
  const stations = await db.select('*').from('se_project.stations');
  return res.render('price', { ...user, stations });
 });

 app.get('/tickets/purchase', async function(req, res) {

  const user = await getUser(req);
  const stations = await db.select('*').from('se_project.stations');
  const userSubscription = await db('se_project.subsription').where('userId', user.userId).orderBy('id', 'desc').first();
  const hasSubscription = userSubscription !== undefined; // Check if userSubscription is defined
  const hasNoSubscription = !hasSubscription; // Check if userSubscription is undefined
  return res.render('tickets/purchase', { ...user, stations, hasSubscription ,hasNoSubscription});
 });
 
 app.get('/tickets', async function(req, res) {
  const user = await getUser(req);
  const tickets = await db.select('*').from('se_project.tickets').where('userId', user.userId);
  const hasNoTickets = tickets.length === 0;
  return res.render('tickets', { ...user, tickets, hasNoTickets });
 });
 
 app.get('/manage/stations', async function(req, res) {
  const user = await getUser(req);
  const stations = await db.select('*').from('se_project.stations');
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/stations', { ...user, stations });
});

app.get('/manage/stations/create', async function(req, res) {
  const user = await getUser(req);
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/stations/create', {...user});
});

app.get('/manage/stations/edit/:stationId', async function(req, res) {
  const user = await getUser(req);
  const stationId = req.params.stationId;
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/stations/edit', { ...user, stationId });
});

app.get('/manage/requests/refunds', async function(req, res) {
  const user = await getUser(req);
  const refunds = await db.select('*').from('se_project.refund_requests');
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/requests/refunds', { ...user, refunds });
});

app.get('/manage/requests/seniors', async function(req, res) {
  const user = await getUser(req);
  const seniors = await db.select('*').from('se_project.senior_requests');
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/requests/seniors', { ...user, seniors });
});

app.get('/manage/zones', async function(req, res) {
  const user = await getUser(req);
  const zones = await db.select('*').from('se_project.zones');
  if (!user.isAdmin) {
    return res.status(403).render('403');
  }
  return res.render('manage/zones', { ...user, zones });
});

};