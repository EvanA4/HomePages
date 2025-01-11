import { json, type RequestEvent } from "@sveltejs/kit";
import { Blog } from "$lib/models/blog";
import type { BlogType } from "$lib/types/types";
import { Op } from "@sequelize/core"
import { toSQLDate } from "$lib/utils/sqlDate";


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
    let searchTitle = req.url.searchParams.get("title");
	let strict = req.url.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	if (strict != "true" && strict != "false") {
		return json([], {
			status: 400
		});
	}

	if (!searchTitle) searchTitle = "";

	// try to use the query
	try {
		const result = await Blog.findAll({
			where: {
				title: {
					[Op.like]: strictBool ? searchTitle : '%' + searchTitle + '%'
				}
			},
			order: [
				['postdate', 'DESC'],
			]
		})

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
	console.log("blogs got a POST request!")
    const body: BlogType = await req.request.json();
	if (body.title == undefined || body.summary == undefined || body.content == undefined) {
		return json(false, {
			status: 400
		});
	}

	// try to use the query
	try {
		if (body.postdate) {
			await Blog.create({
				title: body.title,
				summary: body.summary,
				content: body.content,
				postdate: toSQLDate(body.postdate),
			});
		} else {
			await Blog.create({
				title: body.title,
				summary: body.summary,
				content: body.content,
			});
		}

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
	let searchTitle = req.url.searchParams.get("title")
	if (searchTitle == "" || searchTitle == null) {
		return json(false, {
			status: 400
		});
	}

	// try to use the query
	try {
		await Blog.destroy({
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