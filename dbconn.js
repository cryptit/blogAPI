const {createPool} = require("mysql");
//Pooling
const pool = createPool({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'blog',
    connectionLimit: 1000
});

/*  // Uncomment if require msgs to trigger on connection.
pool.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error('MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error('MySQL close', err);
  });
}); */

module.exports = pool;
