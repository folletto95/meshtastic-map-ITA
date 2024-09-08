import { prisma } from "../db.js";
import express from "../express.js";

express.get("/api/v1/nodes/:nodeId/traceroutes", async (req, res) => {
	try {
		const nodeId = Number.parseInt(req.params.nodeId);
		const count = req.query.count
			? Number.parseInt(req.query.count as string)
			: 10; // can't set to null because of $queryRaw

		// find node
		const node = await prisma.node.findFirst({
			where: {
				node_id: nodeId,
			},
		});

		// make sure node exists
		if (!node) {
			res.status(404).json({
				message: "Not Found",
			});
			return;
		}

		// get latest traceroutes
		// We want replies where want_response is false and it will be "to" the
		// requester.

		const traceroutes = await prisma.traceRoute.findMany({
			where: {
				to: nodeId,
				want_response: false,
				gateway_id: {
					not: null,
				},
			},
			orderBy: {
				id: "desc",
			},
			take: count,
		});

		res.json({
			traceroutes: traceroutes.map((trace) => {
				// ensure route is json array
				if (typeof trace.route === "string") {
					trace.route = JSON.parse(trace.route);
				}

				// ensure route_back is json array
				if (typeof trace.route_back === "string") {
					trace.route_back = JSON.parse(trace.route_back);
				}

				// ensure snr_towards is json array
				if (typeof trace.snr_towards === "string") {
					trace.snr_towards = JSON.parse(trace.snr_towards);
				}

				// ensure snr_back is json array
				if (typeof trace.snr_back === "string") {
					trace.snr_back = JSON.parse(trace.snr_back);
				}

				return trace;
			}),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log(
	"API:EXPRESS registered route GET:/api/v1/nodes/:nodeId/traceroutes",
);
