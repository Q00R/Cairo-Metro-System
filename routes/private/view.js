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
  
  user.isStudent = user.roleId === roles.user;
  user.isAdmin = user.roleId === roles.admin;
  user.isSenior = user.roleId === roles.senior;
  console.log('user =>', user);

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
    const users = await db.select('*').from('se_project.users');
    return res.render('users', { users });
  });

  app.get('/resetPassword', async function(req, res) {
    return res.render('resetPassword');
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