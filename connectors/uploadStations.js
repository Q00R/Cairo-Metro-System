const db = require("./db");

async function uploadSR() {
  let SR = [
<<<<<<< HEAD
    { stationid: 1, routeid: 1 },
    { stationid: 1, routeid: 2 },
    { stationid: 2, routeid: 1 },
    { stationid: 2, routeid: 2 },
    { stationid: 2, routeid: 3 },
    { stationid: 2, routeid: 4 },
    { stationid: 3, routeid: 3 },
    { stationid: 3, routeid: 4 },
    { stationid: 3, routeid: 5 },
    { stationid: 3, routeid: 6 },
    { stationid: 3, routeid: 7 },
    { stationid: 3, routeid: 8},
    { stationid: 4, routeid: 5 },
    { stationid: 4, routeid: 6 },
    { stationid: 4, routeid: 9},
    { stationid: 4, routeid: 10 },
    { stationid: 5, routeid: 9 },
    { stationid: 5, routeid: 10 },
    { stationid: 6, routeid: 7 },
    { stationid: 6, routeid: 8 },
    { stationid: 6, routeid: 11 },
    { stationid: 6, routeid: 12 },
    { stationid: 7, routeid: 11 },
    { stationid: 7, routeid: 12 }
=======
    { stationId: 1, routeId: 1 },
    { stationId: 1, routeId: 2 },
    { stationId: 2, routeId: 2 },
    { stationId: 2, routeId: 3 },
    { stationId: 3, routeId: 3 },
    { stationId: 3, routeId: 4 },
    { stationId: 3, routeId: 5 },
    { stationId: 3, routeId: 6 },
    { stationId: 3, routeId: 7 },
    { stationId: 3, routeId: 8 },
    { stationId: 4, routeId: 5 },
    { stationId: 4, routeId: 6 },
    { stationId: 4, routeId: 9 },
    { stationId: 4, routeId: 10 },
    { stationId: 5, routeId: 9 },
    { stationId: 5, routeId: 10 },
    { stationId: 6, routeId: 7 },
    { stationId: 6, routeId: 8 },
    { stationId: 6, routeId: 11 },
    { stationId: 6, routeId: 12 },
>>>>>>> f8c47e3913b81c2ee5c7117856152667b658a6d4
  ];

  for (let i = 0; i < SR.length; i++) {
<<<<<<< HEAD
<<<<<<< HEAD
    const element =SR[i];
    await db("se_project.stationroutes").insert(element).returning("*");
=======
=======
>>>>>>> fc4fef44795d51cad7923dffbbafcc741a9068d7
    const element = SR[i];
    await db("se_project.stationRoutes").insert(element).returning("*");
>>>>>>> f8c47e3913b81c2ee5c7117856152667b658a6d4
  }

}

async function uploadS() {
  let stations = [
    {
      stationname: "s1",
      stationtype: "normal",
      stationposition: "start",
      stationstatus: "old",
    },
    {
      stationname: "s2",
      stationtype: "normal",
      stationposition: "middle",
      stationstatus: "old",
    },
    {
      stationname: "s3",
      stationtype: "transfer",
      stationposition: "middle",
      stationstatus: "old",
    },
    {
      stationname: "s4",
      stationtype: "normal",
      stationposition: "middle",
      stationstatus: "old",
    },
    {
      stationname: "s5",
      stationtype: "normal",
      stationposition: "end",
      stationstatus: "old",
    },
    {
      stationname: "s6",
      stationtype: "normal",
      stationposition: "middle",
      stationstatus: "old",
    },
    {
      stationname: "s7",
      stationtype: "normal",
      stationposition: "end",
      stationstatus: "old",
    },
  ];

  for (let i = 0; i < stations.length; i++) {
    const element = stations[i];
    await db("se_project.stations").insert(element).returning("*");
  }
}

async function uploadR() {
<<<<<<< HEAD
<<<<<<< HEAD
    let routes = [
      { routename: "hi12", fromstationid: 1, tostationid: 2 },
      { routename: "hi21", fromstationid: 2, tostationid: 1 },
      { routename: "hi23", fromstationid: 2, tostationid: 3 },
      { routename: "hi32", fromstationid: 3, tostationid: 2 },
      { routename: "hi34", fromstationid: 3, tostationid: 4 },
      { routename: "hi43", fromstationid: 4, tostationid: 3 },
      { routename: "hi36", fromstationid: 3, tostationid: 6 },
      { routename: "hi63", fromstationid: 6, tostationid: 3 },
      { routename: "hi45", fromstationid: 4, tostationid: 5 },
      { routename: "hi54", fromstationid: 5, tostationid: 4 },
      { routename: "hi76", fromstationid: 7, tostationid: 6 },
      { routename: "hi67", fromstationid: 6, tostationid: 7 },
    ];
  
=======
=======
>>>>>>> fc4fef44795d51cad7923dffbbafcc741a9068d7
  let routes = [
    { routeName: "hi12", fromStationId: 1, toStationId: 2 },
    { routeName: "hi21", fromStationId: 2, toStationId: 1 },
    { routeName: "hi23", fromStationId: 2, toStationId: 3 },
    { routeName: "hi32", fromStationId: 3, toStationId: 2 },
    { routeName: "hi34", fromStationId: 3, toStationId: 4 },
    { routeName: "hi43", fromStationId: 4, toStationId: 3 },
    { routeName: "hi36", fromStationId: 3, toStationId: 6 },
    { routeName: "hi63", fromStationId: 6, toStationId: 3 },
    { routeName: "hi45", fromStationId: 4, toStationId: 5 },
    { routeName: "hi54", fromStationId: 5, toStationId: 4 },
    { routeName: "hi76", fromStationId: 7, toStationId: 6 },
    { routeName: "hi67", fromStationId: 6, toStationId: 7 },
  ];

<<<<<<< HEAD
>>>>>>> f8c47e3913b81c2ee5c7117856152667b658a6d4
=======
>>>>>>> fc4fef44795d51cad7923dffbbafcc741a9068d7
  for (let i = 0; i < routes.length; i++) {
    const element = routes[i];
    await db("se_project.routes").insert(element).returning("*");
  }
}
<<<<<<< HEAD
<<<<<<< HEAD
//uploadS(); first to run
//uploadR(); second
//uploadSR(); third
=======
=======
>>>>>>> fc4fef44795d51cad7923dffbbafcc741a9068d7

async function uploadData() {
  await uploadS();
  await uploadR();
  await uploadSR();
  process.exit(0);
}

uploadData();
<<<<<<< HEAD
>>>>>>> f8c47e3913b81c2ee5c7117856152667b658a6d4
=======
>>>>>>> fc4fef44795d51cad7923dffbbafcc741a9068d7
