import mysql from "mysql2";
import dotenv from "dotenv";
import { json, type RequestEvent } from "@sveltejs/kit";
import type { NewProject, Project, ProjectRow } from "$lib/types/types.js";
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
	console.log("projects got a GET request!");
    let title = req.url.searchParams.get("title");
	let strict = req.url.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but title not defined
	if ((strict != "true" && strict != "false") || (strictBool && title == "")) {
		console.log("bad request")
		return json([], {
			status: 400
		});
	}
	
	// determine query string
	let sql: string;
	if (!strictBool) sql = `SELECT * FROM Projects WHERE title LIKE "%${title}%" ORDER BY title ASC`;
	else sql = `SELECT * FROM Projects WHERE title="${title}" ORDER BY title ASC`;

	// try to use the query
	try {
		const [result, fields] = await pool.query<ProjectRow[]>(sql);
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
	console.log("projects got a POST request!");
    const body: NewProject = await req.request.json();
	if ((body.title == "") || (body.summary == "")) {
		console.log("bad request");
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql: string;
	if (body.link == "" && body.flags == "") sql = `INSERT INTO Projects (title, summary) VALUES ("${body.title}", "${body.summary}")`;
	else if (body.link == "" && body.flags != "") sql = `INSERT INTO Projects (title, summary, flags) VALUES ("${body.title}", "${body.summary}", "${body.flags}")`;
	else if (body.link != "" && body.flags == "") sql = `INSERT INTO Projects (title, link, summary) VALUES ("${body.title}", "${body.link}", "${body.summary}")`;
	else sql = `INSERT INTO Projects (title, link, summary, flags) VALUES ("${body.title}", "${body.link}", "${body.summary}", "${body.flags}")`;

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
	console.log("projects got a DELETE request!");
	let title = req.url.searchParams.get("title");
	if (title == "") {
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql = `DELETE FROM Projects WHERE title="${title}"`;

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