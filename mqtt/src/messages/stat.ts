import { prisma } from "../db.js";
import { convertHexIdToNumericId } from "../tools/decrypt.js";

export async function handleStatMessage(topic: string, message: Buffer) {
	try {
		const nodeIdHex = topic.split("/").pop();
		if (!nodeIdHex) return;

		const nodeId = convertHexIdToNumericId(nodeIdHex);

		await prisma.node.updateMany({
			where: {
				node_id: nodeId,
			},
			data: {
				mqtt_connection_state_updated_at: new Date(),
			},
		});

		return;
	} catch (err) {
		console.error(err);
	}
}
