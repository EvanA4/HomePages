import mysql from "mysql2";
import dotenv from "dotenv";
import { json, type RequestEvent } from "@sveltejs/kit";
import type { Exp, ExpRow } from "$lib/types/types.js";
dotenv.config();


var pool = mysql.createPool({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_BASE
}).promise();


export async function GET(req: RequestEvent) {
	/*
	Returns:
	- [...exps] if success
	- [] if failure
	Status:
	- 200 if success
	- 400 if bad request
	- 500 if server error
	*/

	// access search parameters
	console.log("exp got a GET request!");
    let title = req.url.searchParams.get("title");
	let timeperiod = req.url.searchParams.get("timeperiod");
	let strict = req.url.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but only one of the params are defined
	if ((strict != "true" && strict != "false") || (strictBool && (title == "") != (timeperiod == ""))) {
		console.log("bad request")
		return json([], {
			status: 400
		});
	}
	
	// determine query string
	let sql: string;
	if (!strictBool) sql = `SELECT * FROM Experiences WHERE title LIKE "%${title}%" ORDER BY title ASC`;
	else sql = `SELECT * FROM Experiences WHERE title="${title}" AND timeperiod="${timeperiod}" ORDER BY title ASC`;

	// try to use the query
	try {
		const [result, fields] = await pool.query<ExpRow[]>(sql);
		return json(result, {
			status: 200
		});

	} catch (err) {
		return json([], {
			status: 500
		});
	}
}


export async function POST(req: RequestEvent) {
	/*
	Returns:
	- true if success
	- false if failure
	Status:
	- 200 if added
	- 400 if bad request
	- 500 if server error
	*/

	// access request body
	console.log("exp got a POST request!")
    const body: Exp = await req.request.json();
	if ((body.title == undefined || body.title == "") || (body.timeperiod == undefined || body.timeperiod == "") || (body.bullets == undefined || body.bullets.length == 0)) {
		console.log("bad request")
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql = `INSERT INTO Experiences (title, link, timeperiod, bullets) VALUES ("${body.title}", "${body.link}", "${body.timeperiod}", "${body.bullets}")`;
	if (body.link == "") sql = `INSERT INTO Experiences (title, timeperiod, bullets) VALUES ("${body.title}", "${body.timeperiod}", "${body.bullets}")`;

	// try to use the query
	try {
		await pool.query(sql);
		return json(true, {
			status: 200
		});

	} catch (err) {
		console.log(err)
		return json(false, {
			status: 500
		});
	}
}


export async function DELETE(req: RequestEvent) {
	/*
	Returns:
	- true if success
	- false if failure
	Status:
	- 200 if removed
	- 400 if bad request
	- 500 if server error
	*/

	// get search parameters
	console.log("exp got a DELETE request!")
	let title = req.url.searchParams.get("title")
	let timeperiod = req.url.searchParams.get("timeperiod")
	if (title == "" || title == null || timeperiod == "" || timeperiod == null) {
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql = `DELETE FROM Experiences WHERE title="${title}" AND timeperiod="${timeperiod}"`

	// try to use the query
	try {
		await pool.query(sql);
		return json(true, {
			status: 200
		});
		
	} catch (err) {
		return json(false, {
			status: 500
		});
	}
}