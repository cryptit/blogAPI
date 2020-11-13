const dbconn = require('./dbconn');

function execQuery(sql, placeholderValues, callback) {
	dbconn.query(sql, placeholderValues, callback);
}

//Uses Promise; was having trouble with grabbing return values from callback; had to settle for async-await finally
function execQuery2(sqlQuery, placeholderValues) {
	return new Promise((resolve, reject) => {					
		dbconn.query(sqlQuery, placeholderValues, (err, result, fields) => {
			if (err) {
				console.error(err);
				reject('ERROR');
			}
			resolve(result);
		});
	});
}

module.exports = {execQuery, execQuery2};
