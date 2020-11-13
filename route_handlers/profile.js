
const {execQuery} = require('../database');
const {execQuery2} = require('../database');

function update(req, res) {
	// {new_bio: ...}
	//update Users_Profile table;  replace bio by req.body.new_bio;
	execQuery('UPDATE Users SET bio=? where username=?',
		[req.body.new_bio, req.user.username], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Bio updated!');
	});
	
}

function follow(req, res) {
	// {user_to_follow: ... }
	//First check if the user whom we want to follow exists
	if (req.body.user_to_follow === req.user.username) {
		return res.status(400).send('Why follow yourself? :P');
	}
	
	execQuery('SELECT * FROM Users WHERE username=?', [req.body.user_to_follow],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}
			let status = (result.length == 0) ? 'Failure' : 'Success';

			if (status === 'Failure')
				res.status(400).send('The given user doesn\'t exist!');
			else {
				execQuery('INSERT INTO AfollowsB (A, B) VALUES (?, ?)',
					[req.user.username, req.body.user_to_follow], (err, result, fields) => {
					if (err) {
						console.error(err);
						res.status(500).send('Error!');
						return;
					}
					res.status(201).send(req.user.username + ' is following ' + req.body.user_to_follow + ' now!')
				});				
			}
	});
}


function unfollow(req, res) {
	// {user_to_unfollow: ... }
	execQuery('DELETE FROM AfollowsB WHERE A=? AND B=?',
		[req.user.username, req.body.user_to_unfollow], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Done!');
	});	
}

async function showMyProfile(req, res) {
	// input: empty body
	try {
		let result = await getProfileByUsername(req.user.username);
		res.json({username: result[0].username, bio: result[0].bio});
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

async function showProfile(req, res) {
	// {"username": ... } ; input format, profile to show
	try {
		let result = await getProfileByUsername(req.body.username);
		if (result.length !== 0)	
				res.json({username: result[0].username, bio: result[0].bio});
		else
				res.status(404).send('No such user!');
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}
async function getProfileByUsername(username) {
	
	let resultPromise = execQuery2('SELECT username, bio FROM Users where username=?', [username]);
	try {
		let result = await resultPromise;
		return result;
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

async function showAllProfiles(req, res) {
	//input: empty body
	let all_users = [];
	let resultPromise = execQuery2('SELECT username, bio FROM Users', []);
	try {
		let result = await resultPromise;
		res.json(result);
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

module.exports = {
	follow,
	unfollow,
	update,
	showAllProfiles,
	showMyProfile,
	showProfile
};

