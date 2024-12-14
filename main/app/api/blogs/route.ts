import mysql from "mysql2";
import dotenv from "dotenv";
import type { BlogRow } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
dotenv.config();


var pool = mysql.createPool({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_BASE
}).promise();


export async function GET(req: NextRequest) {
	/*
	Returns:
	- [...blogs] if success
	- [] if failure
	Status:
	- 200 if success
	- 400 if bad request
	- 500 if server error
	*/

	console.log("blogs got a GET request!");
	let urlObj = new URL(req.url);
	let title = urlObj.searchParams.get("title");
	let strict = urlObj.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	if (strictBool && title == "") {
		return new NextResponse(JSON.stringify([]), {
			status: 400
		});
	}
	
	// determine query string
	let sql: string;
	if (!strictBool) sql = `SELECT * FROM Blogs WHERE title LIKE "%${title}%" ORDER BY postdate DESC`;
	else sql = `SELECT * FROM Blogs WHERE title="${title}" ORDER BY postdate DESC`;

	// try to use the query
	try {
		const [result, fields] = await pool.query<BlogRow[]>(sql);
		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}