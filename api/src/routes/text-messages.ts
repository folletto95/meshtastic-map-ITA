import { prisma } from "../db.js";
import express from "../express.js";
import { buildTextMessagesQuery } from "./text-messages-query.js";

express.get("/api/v1/text-messages", async (req, res) => {
	try {
		const queryResult = buildTextMessagesQuery(req.query);

		if (!queryResult.success) {
			res.status(queryResult.status).json(queryResult.body);
			return;
		}

		const { where, order, count } = queryResult;

		// get text messages from db
		const textMessages = await prisma.textMessage.findMany({
			where,
			orderBy: {
				id: order,
			},
			take: count,
		});

		res.json({
			text_messages: textMessages,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log("API:EXPRESS registered route GET:/api/v1/text-messages");
