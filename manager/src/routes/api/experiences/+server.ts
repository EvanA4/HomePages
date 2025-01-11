import dotenv from "dotenv";
import { json, type RequestEvent } from "@sveltejs/kit";
import type { ExpType } from "$lib/types/types.js";
import { Experience } from "$lib/models/experience";
import { Op, Sequelize } from "@sequelize/core"
import { toSQLDate } from "$lib/utils/sqlDate";
dotenv.config();


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
    let searchTitle = req.url.searchParams.get("title");
	let strict = req.url.searchParams.get("strict");
	let strictBool = strict == "true";

	// try to use the query
	try {
		let result;
		if (strictBool) {
			result = await Experience.findAll({
				where: {
					title: searchTitle,
				},
				order: [
					["endTime", "DESC"],
				]
			});
		}

		else
			result = await Experience.findAll({
				where: {
					title: {
						[Op.like]: '%' + searchTitle + '%'
					}
				},

				order: [
					["endTime", "DESC"],
				]
			});

		return json(result, {
			status: 200
		});

	} catch (err) {
		console.log(err);
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
    const body: ExpType = await req.request.json();
	if (body.title == undefined || body.startTime == undefined || body.endTime == undefined) {
		console.log("bad request")
		return json(false, {
			status: 400
		});
	}

	// determine query string
	// let sql = `INSERT INTO Experiences (title, link, timeperiod, bullets) VALUES ("${body.title}", "${body.link}", "${body.timeperiod}", "${body.bullets}")`;
	// if (body.link == "") sql = `INSERT INTO Experiences (title, timeperiod, bullets) VALUES ("${body.title}", "${body.timeperiod}", "${body.bullets}")`;

	// try to use the query
	try {
		await Experience.create({
			title: body.title,
			link: body.link,
			startTime: toSQLDate(body.startTime),
			endTime: body.endTime ? toSQLDate(body.endTime) : undefined,
			bullets: body.bullets,
		});

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
	console.log("exp got a DELETE request!");
	let searchTitle = req.url.searchParams.get("title");
	if (!searchTitle) {
		return json(false, {
			status: 400
		});
	}

	// try to use the query
	try {
		await Experience.destroy({
			where: {
				title: searchTitle
			}
		});
		return json(true, {
			status: 200
		});
		
	} catch (err) {
		return json(false, {
			status: 500
		});
	}
}