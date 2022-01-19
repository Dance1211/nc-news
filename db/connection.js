const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

// Know which database we're using depending on if we're in a testing enviroment or not
require("dotenv").config({
	path: `${__dirname}/../.env.${ENV}`,
});

// Error handling for compulsary enviromental constants
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
	throw new Error("PGDATABASE or DATABASE_URL not set");
}

// Configure the connection depending ont he enviroment
const config =
  ENV === "production"
  	? {
  		connectionString: process.env.DATABASE_URL,
  		ssl: {
  			rejectUnauthorized: false,
  		},
  	}
  	: {};

module.exports = new Pool(config);
