import {
	type Data,
	type MeshPacket,
	type Position,
	PositionSchema,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mesh_pb.js";
import type { ServiceEnvelope } from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mqtt_pb.js";
import { fromBinary } from "@bufbuild/protobuf";
import { prisma } from "../db.js";
import { COLLECT_POSITIONS, LOG_KNOWN_PACKET_TYPES } from "../settings.js";
import { convertHexIdToNumericId, extractMetaData } from "../tools/decrypt.js";

export async function handlePosition(
	envelope: ServiceEnvelope,
	packet: MeshPacket,
	payload: Data,
): Promise<void> {
	try {
		const position: Position = fromBinary(PositionSchema, payload.payload);
		const positionPayload = {
			latitude_i: position.latitudeI,
			longitude_i: position.longitudeI,
			altitude: position.altitude,
			time: position.time,
			location_source: position.locationSource,
			altitude_source: position.altitudeSource,
			timestamp: position.timestamp,
			timestamp_millis_adjust: position.timestampMillisAdjust,
			altitude_hae: position.altitudeHae,
			altitude_geoidal_separation: position.altitudeGeoidalSeparation,
			pdop: position.PDOP,
			hdop: position.HDOP,
			vdop: position.VDOP,
			gps_accuracy: position.gpsAccuracy,
			ground_speed: position.groundSpeed,
			ground_track: position.groundTrack,
			fix_quality: position.fixQuality,
			fix_type: position.fixType,
			sats_in_view: position.satsInView,
			sensor_id: position.sensorId,
			next_update: position.nextUpdate,
			seq_number: position.seqNumber,
			precision_bits: position.precisionBits,
		};

		const { envelopeMeta, packetMeta, payloadMeta } = extractMetaData(
			envelope,
			packet,
			payload,
		);

		if (LOG_KNOWN_PACKET_TYPES) {
			console.log("POSITION_APP", {
				envelopeMeta: envelopeMeta,
				packetMeta: packetMeta,
				payloadMeta: payloadMeta,
				position: positionPayload,
			});
		}

		const data = {
			latitude: position.latitudeI,
			longitude: position.longitudeI,
			altitude: position.altitude !== 0 ? position.altitude : null,
			position_precision: position.precisionBits,
			position_updated_at: new Date(),
		};

		// update node position in db
		if (position.latitudeI && position.longitudeI) {
			await prisma.node.upsert({
				where: {
					node_id: packet.from,
				},
				create: {
					node_id: packet.from,
					hardware_model: 0,
					role: 0,
					long_name: `!${packet.from.toString(16)}`,
					short_name: packet.from.toString(16).substring(0, 4),
					...data,
				},
				update: data,
			});
		}

		if (COLLECT_POSITIONS) {
			// find an existing position with duplicate information created in the last 60 seconds
			const isDuplicate = await prisma.position.findFirst({
				where: {
					node_id: packet.from,
					packet_id: packet.id,
					created_at: {
						gte: new Date(Date.now() - 60000), // created in the last 60 seconds
					},
				},
			});

			if (!isDuplicate) {
				await prisma.position.create({
					data: {
						node_id: packet.from,
						to: packet.to,
						from: packet.from,
						channel: packet.channel,
						packet_id: packet.id,
						channel_id: envelope.channelId,
						gateway_id: envelope.gatewayId
							? convertHexIdToNumericId(envelope.gatewayId)
							: null,
						latitude: position.latitudeI,
						longitude: position.longitudeI,
						ground_speed: position.groundSpeed,
						altitude: position.altitude,
					},
				});
			}
		}
	} catch (err) {
		console.error(err);
	}
}
