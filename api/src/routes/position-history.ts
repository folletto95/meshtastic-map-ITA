import { prisma } from "../db.js";
import express from "../express.js";

express.get("/api/v1/nodes/:nodeId/position-history", async (req, res) => {
	try {
		// defaults
		const nowInMilliseconds = new Date().getTime();
		const oneHourAgoInMilliseconds = new Date().getTime() - 3600 * 1000;

		// get request params
		const nodeId = Number.parseInt(req.params.nodeId);
		const timeFrom = req.query.time_from
			? Number.parseInt(req.query.time_from as string)
			: oneHourAgoInMilliseconds;
		const timeTo = req.query.time_to
			? Number.parseInt(req.query.time_to as string)
			: nowInMilliseconds;

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

		const positions = await prisma.position.findMany({
			where: {
				node_id: nodeId,
				created_at: {
					gte: new Date(timeFrom),
					lte: new Date(timeTo),
				},
			},
		});

		const mapReports = await prisma.mapReport.findMany({
			where: {
				node_id: nodeId,
				created_at: {
					gte: new Date(timeFrom),
					lte: new Date(timeTo),
				},
			},
		});

		const positionHistory: {
			id?: bigint;
			node_id: bigint;
			type: string;
			latitude: number | null;
			longitude?: number | null;
			altitude: number | null;
			gateway_id?: bigint | null;
			channel_id?: string | null;
			created_at: Date;
		}[] = [];

		positions.forEach((position, i) => {
			positionHistory.push({
				id: position.id,
				node_id: position.node_id,
				type: "position",
				latitude: position.latitude,
				longitude: position.longitude,
				altitude: position.altitude,
				gateway_id: position.gateway_id,
				channel_id: position.channel_id,
				created_at: position.created_at,
			});
		});

		mapReports.forEach((mapReport, i) => {
			positionHistory.push({
				node_id: mapReport.node_id,
				type: "map_report",
				latitude: mapReport.latitude,
				longitude: mapReport.longitude,
				altitude: mapReport.altitude,
				created_at: mapReport.created_at,
			});
		});

		// sort oldest to newest
		positionHistory.sort(
			(a, b) => a.created_at.getTime() - b.created_at.getTime()
		);

		res.json({
			position_history: positionHistory,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
