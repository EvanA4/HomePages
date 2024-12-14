import mysql from "mysql2";
import dotenv from "dotenv";
import { json, type RequestEvent } from "@sveltejs/kit";
import type { Blog, BlogRow } from "$lib/types/types.js";
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
	- [...blogs] if success
	- [] if failure
	Status:
	- 200 if success
	- 400 if bad request
	- 500 if server error
	*/

	// access search parameters
	console.log("blogs got a GET request!");
    let title = req.url.searchParams.get("title");
	let strict = req.url.searchParams.get("strict");

	// check for bad request
	if (strict != "true" && strict != "false") {
		return json([], {
			status: 400
		});
	}
	
	// determine query string
	let strictBool = strict == "true";
	let sql: string;
	if (!strictBool) sql = `SELECT * FROM Blogs WHERE title LIKE "%${title}%" ORDER BY postdate DESC`;
	else sql = `SELECT * FROM Blogs WHERE title="${title}" ORDER BY postdate DESC`;

	// try to use the query
	try {
		const [result, fields] = await pool.query<BlogRow[]>(sql);
		return json(result, {
			status: 200
		});

	} catch {
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
	console.log("blogs got a POST request!")
    const body: Blog = await req.request.json();
	if (body.title == undefined || body.summary == undefined || body.content == undefined) {
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql = `INSERT INTO Blogs (title, summary, content, postdate) VALUES ("${body.title}", "${body.summary}", "${body.content}", "${body.postdate}")`;
	if (body.postdate == "") sql = `INSERT INTO Blogs (title, summary, content) VALUES ("${body.title}", "${body.summary}", "${body.content}")`;

	// try to use the query
	try {
		await pool.query(sql);
		return json(true, {
			status: 200
		});

	} catch (err) {
		console.log(err);
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
	console.log("blogs got a DELETE request!")
	let title = req.url.searchParams.get("title")
	if (title == "" || title == null) {
		return json(false, {
			status: 400
		});
	}

	// determine query string
	let sql = `DELETE FROM Blogs WHERE title="${title}"`

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