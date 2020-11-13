
const {execQuery} = require('../database');
const {execQuery2} = require('../database');


//INSERT
function createArticle(req, res) {
	//input: {title: ..., content: ...}

	execQuery('INSERT INTO Articles (username, article_title, article_content, timestamp) VALUES (?, ?, ?, ?)',
		[req.user.username, req.body.title, req.body.content, Date.now()], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Article inserted!');
	});
}

//UPDATE
function updateArticle(req, res) {
	//input: {article_id: ..., new_title: ..., new_content: ...}
	
	execQuery('UPDATE Articles SET article_title=?, article_content=?, timestamp=? where username=? and article_id=?',
		[req.body.new_title, req.body.new_content, Date.now(), req.user.username, req.body.article_id],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}
	  	res.status(201).send('If such an article existed, it is updated successfully!');
		});
}

//DELETE
function deleteArticle(req, res) {
	//input: {article_id: ...}
	// check if this article exists and is written by current user
	// delete row
	execQuery('DELETE FROM Articles WHERE article_id=? AND username=?',
		[req.body.article_id, req.user.username], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(200).send('Article deleted!');//user + ' stopped following ' + user_to_follow + '.')
	});
}

async function getArticlesByUser(username) {			
	let resultPromise = execQuery2('SELECT * FROM Articles where username=?', [username]);
	try {
		let result = await resultPromise;
		return result;
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

async function listArticlesByUser(req, res) {
	//input: {"username": ...}
	try {
		let result = await getArticlesByUser(req.body.username);
		res.json(result);
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

async function listMyArticles(req, res) {
	//input: empty
	try {
		let result = await getArticlesByUser(req.user.username);
		res.json(result);
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}

async function listAllArticles(req, res) {
	//input: empty
	try {
		let resultPromise = execQuery2('SELECT * FROM Articles', []);
		let result = await resultPromise;
		res.json(result);
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}


async function myFeed(req, res) {

	let resultPromise = execQuery2('SELECT B as username FROM AfollowsB where A=?', [req.user.username]);
	
	try {
		let followingUsers = await resultPromise;
		let feed = [];
		for (user of followingUsers) {
			let articlesForThisUser = await getArticlesByUser(user.username);
			for (article of articlesForThisUser)
				feed.push(article);
		}
		// sort into descending order by timestamp, so most recent article is on top of our feed
	
		feed.sort(function (item1, item2) {
			return item2.timestamp - item1.timestamp; 
		});
	
		for (article of feed) {
			let dateObj = new Date(article.timestamp);			
			let readableTimestamp = dateObj.toLocaleTimeString() + ", " + dateObj.getDate() + "/"
										+ dateObj.getMonth() + "/" + dateObj.getFullYear();
			article.timestamp = readableTimestamp;		
		}
		res.json(feed);
	} catch (e) {
		console.error('PROMISE REJECTION ERROR:', e);
	}
}


module.exports = {
	myFeed,
	createArticle,
	updateArticle,
	deleteArticle,
	listArticlesByUser,
	listMyArticles,
	listAllArticles
};

