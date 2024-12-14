import mysql from "mysql2";
import dotenv from "dotenv";
import type { ProjectRow } from "@/types/types.js";
import { NextRequest, NextResponse } from "next/server";
dotenv.config();


var pool = mysql.createPool({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_BASE
}).promise();


export async function GET(req: NextRequest, { params }: { params: { title: string, strict: string } }) {
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
	let urlObj = new URL(req.url);
	let title = urlObj.searchParams.get("title");
	let strict = urlObj.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but title not defined
	if (strictBool && title == "") {
		console.log("bad request")
		return new NextResponse(JSON.stringify([]), {
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
		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch (err) {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}