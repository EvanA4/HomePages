import mysql from "mysql2";
import dotenv from "dotenv";
import type { Exp, ExpRow } from "@/types/types";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
dotenv.config();


var pool = mysql.createPool({
	host: process.env.MYSQL_URL,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_BASE
}).promise();


export async function GET(req: NextRequest, { params }: { params: { title: string, timeperiod: string, strict: string } }) {
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
	let title = (params != undefined && "title" in params) ? params.title : "";
	let timeperiod = (params != undefined && "timeperiod" in params) ? params.timeperiod : "";
	let strict = (params != undefined && "strict" in params) ? params.strict : "";
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but only one of the params are defined
	if (strictBool && (title == "") != (timeperiod == "")) {
		return new NextResponse(JSON.stringify([]), {
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
		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch (err) {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}