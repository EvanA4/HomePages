import { Project } from "@/public/models/project";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";


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
	let searchTitle = urlObj.searchParams.get("title");
	let strict = urlObj.searchParams.get("strict");
	let strictBool = strict == "true";

	// check for bad request
	// - invalid strict parameter
	// - if strict but title not defined
	if ((strict != "true" && strict != "false") || (strictBool && searchTitle == "")) {
		console.log("bad request")
		return new NextResponse(JSON.stringify([]), {
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

		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch (err) {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}