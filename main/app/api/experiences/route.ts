import { Experience } from "@/public/models/experience";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";


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
	let urlObj = new URL(req.url);
	let searchTitle = urlObj.searchParams.get("title");
	let strict = urlObj.searchParams.get("strict");
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
			
		return new NextResponse(JSON.stringify(result), {
			status: 200
		});

	} catch (err) {
		return new NextResponse(JSON.stringify([]), {
			status: 500
		});
	}
}