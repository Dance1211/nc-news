# News API Project
**Website**
- Hosted link: https://j-banister-news.herokuapp.com/api/
## About
This is a social media style API where users can upload and view articles, search and sort them via queries, leave comments and vote on them via a REST api. The current list and descriptions of functioning endpoints can be found on the /api/ endpoint. Infomation is served directly as JSONs which are directly viewable in Firefox or Chrome, or available by a REST API viewer.

This project uses an node / express.js backend to serve infomation from a PSQL database.

The list of currently available endpoints can be found here:

    GET     /api/
    GET     /api/articles/
    GET     /api/articles/:article_id
    PATCH   /api/articles/:article_id
    DELETE  /api/articles/:article_id
    GET     /api/artciles/:article_id/comments
    POST    /api/articles/:article_id/comments
    PATCH   /api/comments/:comment_id
    DELETE  /api/comments/:comment_id
    GET     /api/topics
    POST    /api/topics
    GET     /api/users
    GET     /api/users/:username

## Installation
Ensure you have NodeJS at `npm@^16.0.0` and Postgres v12.9
If your `npm --version` is below 16.0.0, you can update it with:

    npm i npm@^16.0.0 -g

Clone the project using the following command and change directory inside:

	git clone https://github.com/Dance1211/nc-news.git
	cd nc-news
To install the dependencies, run:

    npm ci

### Setting up the local databases

Before running the application locally, two local PSQL databases must be created. To do so, create
two files in the main directory:

    .env.development
    .env.test
Inside each must contain their following assignment:

    ---.env.development---
	PGDATABASE=nc_news
	
	---.env.test---
	PGDATABASE=nc_news_test
Following this, the databases can be created and seeded by running 

    npm run setup-dbs
    npm run seed
You can confirm that this was successful by running the following command to dump the data into `dump.txt` to be checked.

    npm run dump
### Running the tests
Tests can be run by using the command `npm test`
    
