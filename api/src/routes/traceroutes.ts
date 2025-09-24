import type { TraceRoute } from "@prisma/client";

import { prisma } from "../db.js";
import express from "../express.js";

type SerializableTraceRoute = TraceRoute & {
	route: unknown;
	route_back: unknown;
	snr_towards: unknown;
	snr_back: unknown;
	age_in_seconds: number | null;
};

function calculateTraceAgeInSeconds(trace: TraceRoute): number | null {
	const updatedAt = trace.updated_at ?? trace.created_at;
	if (!updatedAt) {
		return null;
	}

	const ageInMilliseconds = Date.now() - updatedAt.getTime();
	if (!Number.isFinite(ageInMilliseconds)) {
		return null;
	}

	const ageInSeconds = Math.floor(ageInMilliseconds / 1000);
	return Math.max(ageInSeconds, 0);
}

function formatTraceRoute(trace: TraceRoute): SerializableTraceRoute {
	const formattedTrace: SerializableTraceRoute = {
		...trace,
		route: trace.route,
		route_back: trace.route_back,
		snr_towards: trace.snr_towards,
		snr_back: trace.snr_back,
		age_in_seconds: calculateTraceAgeInSeconds(trace),
	};

	if (typeof formattedTrace.route === "string") {
		formattedTrace.route = JSON.parse(formattedTrace.route);
	}

	if (typeof formattedTrace.route_back === "string") {
		formattedTrace.route_back = JSON.parse(formattedTrace.route_back);
	}

	if (typeof formattedTrace.snr_towards === "string") {
		formattedTrace.snr_towards = JSON.parse(formattedTrace.snr_towards);
	}

	if (typeof formattedTrace.snr_back === "string") {
		formattedTrace.snr_back = JSON.parse(formattedTrace.snr_back);
	}

	return formattedTrace;
}

express.get("/api/v1/traceroutes", async (req, res) => {
	try {
		const count = req.query.count
			? Number.parseInt(req.query.count as string)
			: 100;

		const traceroutes = await prisma.traceRoute.findMany({
			where: {
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
			traceroutes: traceroutes.map((trace) => formatTraceRoute(trace)),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log("API:EXPRESS registered route GET:/api/v1/traceroutes");

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
			traceroutes: traceroutes.map((trace) => formatTraceRoute(trace)),
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
