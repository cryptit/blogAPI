const {createPool} = require("mysql");

const pool = createPool({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'blog',
    connectionLimit: 1000
});
/*
pool.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });
}); */

module.exports = pool;
