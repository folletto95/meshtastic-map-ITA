import { prisma } from "../db.js";
import express from "../express.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseNumberOrNull(value: unknown): number | null {
	if (value === null || value === undefined) {
		return null;
	}

	if (typeof value === "number") {
		return Number.isFinite(value) ? value : null;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed === "") {
			return null;
		}

		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
}

function normaliseNeighbour(
	neighbour: unknown,
): Record<string, unknown> | null {
	if (!isPlainObject(neighbour)) {
		return null;
	}

	const nodeId = parseNumberOrNull(neighbour.node_id ?? neighbour.nodeId);
	if (nodeId == null) {
		return null;
	}

	const normalisedNeighbour: Record<string, unknown> = { ...neighbour };

	normalisedNeighbour.node_id = nodeId;
	normalisedNeighbour.snr = parseNumberOrNull(neighbour.snr);
	normalisedNeighbour.rssi = parseNumberOrNull(neighbour.rssi);

	return normalisedNeighbour;
}

express.get("/api/v1/nodes/:nodeId/neighbours", async (req, res) => {
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

		// get nodes from db that have this node as a neighbour
		const nodesThatHeardUs = await prisma.node.findMany({
			where: {
				neighbours: {
					array_contains: {
						node_id: Number(nodeId),
					},
				},
			},
		});

		if (!node.neighbours) {
			res.status(404).json({
				message: "Not Found",
			});
			return;
		}

		if (!Array.isArray(node.neighbours)) {
			res.status(500).json({
				message: "Internal Server Error",
			});
			return;
		}

		const nodesThatWeHeard: Record<string, unknown>[] = [];
		for (const neighbour of node.neighbours) {
			const normalisedNeighbour = normaliseNeighbour(neighbour);
			if (!normalisedNeighbour) {
				continue;
			}

			nodesThatWeHeard.push({
				...normalisedNeighbour,
				first_seen_at: node.neighbours_first_seen_at,
				updated_at: node.neighbours_updated_at,
			});
		}

		const nodesThatHeardUsFormatted: Record<string, unknown>[] = [];
		for (const nodeThatHeardUs of nodesThatHeardUs) {
			if (!Array.isArray(nodeThatHeardUs.neighbours)) {
				continue;
			}

			let neighbourQuality: Record<string, unknown> | null = null;
			for (const neighbour of nodeThatHeardUs.neighbours) {
				const normalisedNeighbour = normaliseNeighbour(neighbour);
				if (!normalisedNeighbour) {
					continue;
				}

				if (
					normalisedNeighbour.node_id?.toString() ===
					node.node_id.toString()
				) {
					neighbourQuality = normalisedNeighbour;
					break;
				}
			}

			if (!neighbourQuality) {
				continue;
			}

			const nodeThatHeardUsId = parseNumberOrNull(
				nodeThatHeardUs.node_id,
			);
			if (nodeThatHeardUsId == null) {
				continue;
			}

			nodesThatHeardUsFormatted.push({
				node_id: nodeThatHeardUsId,
				snr: parseNumberOrNull(neighbourQuality.snr),
				rssi: parseNumberOrNull(neighbourQuality.rssi),
				first_seen_at: nodeThatHeardUs.neighbours_first_seen_at,
				updated_at: nodeThatHeardUs.neighbours_updated_at,
			});
		}

		res.json({
			nodes_that_we_heard: nodesThatWeHeard,
			nodes_that_heard_us: nodesThatHeardUsFormatted,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Something went wrong, try again later.",
		});
	}
});
console.log(
	"API:EXPRESS registered route GET:/api/v1/nodes/:nodeId/neighbours",
);
