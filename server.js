#! /usr/bin/env node

const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
//const sqlConfig = require('commander');
const mysql = require('mysql');
const cors = require('cors');
const dataHelp = require('./lib/util/data.helper.js');
const AuthPlugin = require('./lib/auth.js');

const Xapi = require('./lib/xapi.js');
//const cmdargs = require('./lib/util/cmd.helper.js');

//cmdargs.handle(sqlConfig);

const sqlConfig = require('./config.js');

//console.log(sqlConfig);

/**************** START : setup express ****************/
let app = express();

app.use(morgan('tiny'));
app.use(AuthPlugin.authn());
app.use(AuthPlugin.authz());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
/**************** END : setup express ****************/


/**************** START : setup mysql ****************/
let mysqlPool = mysql.createPool(sqlConfig);
/**************** END : setup mysql ****************/


/**************** START : setup Xapi ****************/
console.log('');
console.log('');
console.log('');
console.log('          Generating REST APIs at the speed of your thought.. ');
console.log('');

let t = process.hrtime();
let moreApis = new Xapi(sqlConfig,mysqlPool,app);

moreApis.init((err, results) => {

  //app.listen(sqlConfig.portNumber,sqlConfig.ipAddress);
  app.listen(sqlConfig.portNumber);
  var t1 = process.hrtime(t);
  var t2 = t1[0]+t1[1]/1000000000;


  console.log("          Xmysql took           :    %d seconds",dataHelp.round(t2,1));
  console.log('                                                            ');
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');

  var login = require('./helper/login');
  var auth = new AuthPlugin(moreApis, login);
});
/**************** END : setup Xapi ****************/
