import { fromBinary } from "@bufbuild/protobuf";
import {
	type ServiceEnvelope,
	ServiceEnvelopeSchema,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mqtt_pb.js";
import { prisma } from "../db.js";
import { COLLECT_SERVICE_ENVELOPES } from "../settings.js";
import { convertHexIdToNumericId, decrypt } from "../tools/decrypt.js";
import type {
	Data,
	MeshPacket,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mesh_pb.js";

export async function handleServiceEnvelope(
	topic: string,
	message: Buffer
): Promise<
	| {
			envelope: ServiceEnvelope;
			packet: MeshPacket;
			payload: Data | undefined;
	  }
	| undefined
> {
	try {
		const envelope: ServiceEnvelope = fromBinary(
			ServiceEnvelopeSchema,
			message
		);

		const packet = envelope.packet;
		if (!packet) return undefined;

		// track when a node last gated a packet to mqtt
		try {
			await prisma.node.updateMany({
				where: {
					node_id: convertHexIdToNumericId(envelope.gatewayId),
				},
				data: {
					mqtt_connection_state_updated_at: new Date(),
				},
			});
		} catch (e) {
			console.error(e);
			// don't care if updating mqtt timestamp fails
		}

		if (COLLECT_SERVICE_ENVELOPES) {
			await prisma.serviceEnvelope.create({
				data: {
					mqtt_topic: topic,
					channel_id: envelope.channelId,
					gateway_id: envelope.gatewayId
						? convertHexIdToNumericId(envelope.gatewayId)
						: null,
					to: packet.to,
					from: packet.from,
					protobuf: message,
				},
			});
		}

		let decodedPayload: Data | undefined = undefined;

		decodedPayload = packet.payloadVariant.value as Data;

		if (packet.payloadVariant.case === "encrypted")
			decodedPayload = await decrypt(packet);

		return {
			envelope: envelope,
			packet: packet,
			payload: decodedPayload,
		};
	} catch (err) {
		console.error(err);
	}
}
