const express = require('express')

const auth = require('./auth')
const user = require('./route_handlers/user')
const article = require('./route_handlers/article')
const profile = require('./route_handlers/profile')

const app = express()

app.use(express.json())

//user operations
app.post('/register', user.register);
app.post('/login', user.login);
app.post('/update_credentials', auth.authenticateToken, user.update);

// profile operations
app.post('/update_profile', auth.authenticateToken, profile.update);
app.put('/follow', auth.authenticateToken, profile.follow);
app.put('/unfollow', auth.authenticateToken, profile.unfollow);
app.get('/show_my_profile', auth.authenticateToken, profile.showMyProfile);
app.get('/show_all_profiles', auth.authenticateToken, profile.showAllProfiles);
app.get('/show_profile', auth.authenticateToken, profile.showProfile);

// article type operations
app.post('/create_article', auth.authenticateToken, article.createArticle);
app.post('/update_article', auth.authenticateToken, article.updateArticle);
app.delete('/delete_article', auth.authenticateToken, article.deleteArticle);
app.get('/list_articles_by_user', auth.authenticateToken, article.listArticlesByUser);
app.get('/list_my_articles', auth.authenticateToken, article.listMyArticles);
app.get('/list_all_articles', auth.authenticateToken, article.listAllArticles);
app.get('/feed', auth.authenticateToken, article.myFeed);

app.listen(3000, () => {
	console.log('Started server at port 3000.')
})

