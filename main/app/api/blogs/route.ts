import { Blog } from "@/public/models/blog";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

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
	let searchTitle = urlObj.searchParams.get("title");
	let strict = urlObj.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	if (strict != "true" && strict != "false") {
		return new NextResponse(JSON.stringify([]), {
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
		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch (err) {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}