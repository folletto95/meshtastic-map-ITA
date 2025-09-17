import {
	type Data,
	type MeshPacket,
	type RouteDiscovery,
	RouteDiscoverySchema,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mesh_pb.js";
import type { ServiceEnvelope } from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mqtt_pb.js";
import { fromBinary } from "@bufbuild/protobuf";
import { prisma } from "../db.js";
import { COLLECT_TRACEROUTES, LOG_KNOWN_PACKET_TYPES } from "../settings.js";
import { convertHexIdToNumericId, extractMetaData } from "../tools/decrypt.js";

export async function handleTraceroute(
	envelope: ServiceEnvelope,
	packet: MeshPacket,
	payload: Data,
): Promise<void> {
	try {
		const traceroute: RouteDiscovery = fromBinary(
			RouteDiscoverySchema,
			payload.payload,
		);

		const { envelopeMeta, packetMeta, payloadMeta } = extractMetaData(
			envelope,
			packet,
			payload,
		);

		if (LOG_KNOWN_PACKET_TYPES) {
			console.log("TRACEROUTE_APP", {
				envelopeMeta: envelopeMeta,
				packetMeta: packetMeta,
				payloadMeta: payloadMeta,
				traceroute: traceroute,
			});
		}

		if (COLLECT_TRACEROUTES) {
			await prisma.traceRoute.create({
				data: {
					to: packet.to,
					from: packet.from,
					want_response: payload.wantResponse ?? false,
					route: traceroute.route,
					snr_towards: traceroute.snrTowards,
					route_back: traceroute.routeBack,
					snr_back: traceroute.snrBack,
					channel: packet.channel,
					packet_id: packet.id,
					channel_id: envelope.channelId,
					gateway_id: envelope.gatewayId
						? convertHexIdToNumericId(envelope.gatewayId)
						: null,
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
}
