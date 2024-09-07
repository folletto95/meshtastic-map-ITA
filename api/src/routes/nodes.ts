import { prisma } from "../db.js";
import express from "../express.js";
import { formatNodeInfo } from "../tools/format.js";

express.get("/api/v1/nodes", async (req, res) => {
	try {
		// get query params
		const role = req.query.role
			? Number.parseInt(req.query.role as string)
			: undefined;
		const hardwareModel = req.query.hardware_model
			? Number.parseInt(req.query.hardware_model as string)
			: undefined;

		// get nodes from db
		const nodes = await prisma.node.findMany({
			where: {
				role: role,
				hardware_model: hardwareModel,
			},
		});

		const nodesWithInfo = [];
		for (const node of nodes) {
			nodesWithInfo.push(formatNodeInfo(node));
		}

		res.json({
			nodes: nodesWithInfo,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log("API:EXPRESS registered route GET:/api/v1/nodes");

express.get("/api/v1/nodes/:nodeId", async (req, res) => {
	try {
		const nodeId = Number.parseInt(req.params.nodeId);

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

		res.json({
			node: formatNodeInfo(node),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log("API:EXPRESS registered route GET:/api/v1/nodes/:nodeId");
