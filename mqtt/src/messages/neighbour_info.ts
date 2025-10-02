import {
	type Data,
	type MeshPacket,
	type Neighbor,
	type NeighborInfo,
	NeighborInfoSchema,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mesh_pb.js";
import type { ServiceEnvelope } from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mqtt_pb.js";
import { fromBinary } from "@bufbuild/protobuf";
import { prisma } from "../db.js";
import { COLLECT_NEIGHBOUR_INFO, LOG_KNOWN_PACKET_TYPES } from "../settings.js";
import { extractMetaData } from "../tools/decrypt.js";

export async function handleNeighbourInfo(
	envelope: ServiceEnvelope,
	packet: MeshPacket,
	payload: Data,
): Promise<void> {
	try {
		const neighbourInfo: NeighborInfo = fromBinary(
			NeighborInfoSchema,
			payload.payload,
		);

		const { envelopeMeta, packetMeta, payloadMeta } = extractMetaData(
			envelope,
			packet,
			payload,
		);

		if (LOG_KNOWN_PACKET_TYPES) {
			console.log("NEIGHBORINFO_APP", {
				envelopeMeta: envelopeMeta,
				packetMeta: packetMeta,
				payloadMeta: payloadMeta,
				neighbourInfo: neighbourInfo,
			});
		}

		const now = new Date();

		const existingNode = await prisma.node.findUnique({
			where: {
				node_id: packet.from,
			},
			select: {
				neighbours_first_seen_at: true,
			},
		});

		const mapNeighbour = (neighbour: Neighbor) => {
			const neighbourWithRssi = neighbour as Neighbor & {
				rssi?: number | null;
			};

			const neighbourRssi =
				typeof neighbourWithRssi.rssi === "number"
					? neighbourWithRssi.rssi
					: null;

			return {
				node_id: neighbour.nodeId,
				snr: neighbour.snr,
				rssi: neighbourRssi,
			};
		};

		if (existingNode) {
			await prisma.node.update({
				where: {
					node_id: packet.from,
				},
				data: {
					neighbours_first_seen_at:
						existingNode.neighbours_first_seen_at ?? now,
					neighbours_updated_at: now,
					neighbour_broadcast_interval_secs:
						neighbourInfo.nodeBroadcastIntervalSecs,
					neighbours: neighbourInfo.neighbors.map(mapNeighbour),
				},
			});
		}

		if (COLLECT_NEIGHBOUR_INFO) {
			await prisma.neighbourInfo.create({
				data: {
					node_id: packet.from,
					node_broadcast_interval_secs:
						neighbourInfo.nodeBroadcastIntervalSecs,
					neighbours: neighbourInfo.neighbors.map(mapNeighbour),
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
}
