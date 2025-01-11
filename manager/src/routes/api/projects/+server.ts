import dotenv from "dotenv";
import { json, type RequestEvent } from "@sveltejs/kit";
import type { ProjectFormSQL } from "$lib/types/types.js";
import { Project } from "$lib/models/project";
import { toSQLDate } from "$lib/utils/sqlDate";
import { Op } from "@sequelize/core"
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
	console.log("projects got a GET request!");
    let searchTitle = req.url.searchParams.get("title");
	let strict = req.url.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but title not defined
	if ((strict != "true" && strict != "false") || (strictBool && searchTitle == "")) {
		console.log("bad request")
		return json([], {
			status: 400
		});
	}

	// try to use the query
	try {
		let result;

		if (strictBool) {
			result = await Project.findAll({
				where: {
					title: searchTitle,
				}
			})
		} else {
			result = await Project.findAll({
				where: {
					title: {
						[Op.like]: '%' + searchTitle + '%'
					}
				},
				order: [
					["completed", "DESC"],
				]
			})

		}

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
    const body: ProjectFormSQL = await req.request.json();
	if ((body.title == "") || (body.summary == "")) {
		console.log("bad request");
		return json(false, {
			status: 400
		});
	}

	// try to use the query
	try {
		if (body.completed) {
			await Project.create({
				title: body.title,
				completed: toSQLDate(body.completed),
				link: body.link,
				summary: body.summary,
				flags: body.flags,
			});
		
		} else {
			await Project.create({
				title: body.title,
				link: body.link,
				summary: body.summary,
				flags: body.flags,
			});

		}

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
	let searchTitle = req.url.searchParams.get("title");
	if (searchTitle == "") {
		return json(false, {
			status: 400
		});
	}

	// try to use the query
	try {
		await Project.destroy({
			where: {
				title: searchTitle,
			}
		})
		return json(true, {
			status: 200
		});
		
	} catch (err) {
		return json(false, {
			status: 500
		});
	}
}