import type { MqttProtocol } from "mqtt";
import { extractBoolean } from "./tools/decrypt.js";

export const MQTT_URL: string =
	process.env.MQTT_URL || "mqtt://mqtt.si";
export const MQTT_PROTOCOL: MqttProtocol =
	process.env.MQTT_PROTOCOL === "mqtts" ? "mqtts" : "mqtt";
export const MQTT_USERNAME: string = process.env.MQTT_USERNAME || "test";
export const MQTT_PASSWORD: string = process.env.MQTT_PASSWORD || "test";
export const MQTT_CLIENT_ID: string =
	process.env.MQTT_CLIENT_ID || "Test";
export const MQTT_TOPIC: string = process.env.MQTT_TOPIC || "msh/#";

export const PURGE_INTERVAL_SECONDS: number = Number.parseInt(
	process.env.PURGE_INTERVAL_SECONDS || "2592000",
);
export const PURGE_DEVICE_METRICS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_DEVICE_METRICS_AFTER_SECONDS || "2592000",
);
export const PURGE_ENVIROMENT_METRICS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_ENVIROMENT_METRICS_AFTER_SECONDS || "2592000",
);
export const PURGE_POWER_METRICS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_POWER_METRICS_AFTER_SECONDS || "2592000",
);
export const PURGE_MAP_REPORTS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_MAP_REPORTS_AFTER_SECONDS || "2592000",
);
export const PURGE_NEIGHBOUR_INFOS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_NEIGHBOUR_INFOS_AFTER_SECONDS || "2592000",
);
export const PURGE_UNHEARD_NODES_FOR_SECONDS: number = Number.parseInt(
        process.env.PURGE_UNHEARD_NODES_FOR_SECONDS || "2592000",
);
export const PURGE_POSITIONS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_POSITIONS_AFTER_SECONDS || "2592000",
);
export const PURGE_SERVICE_ENVELOPES_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_SERVICE_ENVELOPES_AFTER_SECONDS || "2592000",
);
export const PURGE_TEXT_MESSAGES_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_TEXT_MESSAGES_AFTER_SECONDS || "2592000",
);
export const PURGE_TRACEROUTES_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_TRACEROUTES_AFTER_SECONDS || "2592000",
);
export const PURGE_WAYPOINTS_AFTER_SECONDS: number = Number.parseInt(
        process.env.PURGE_WAYPOINTS_AFTER_SECONDS || "2592000",
);

export const COLLECT_SERVICE_ENVELOPES: boolean =
	!!process.env.COLLECT_SERVICE_ENVELOPES || true;
export const COLLECT_POSITIONS: boolean =
	!!process.env.COLLECT_POSITIONS || true;
export const COLLECT_TEXT_MESSAGES: boolean =
	!!process.env.COLLECT_TEXT_MESSAGES || true;
export const IGNORE_DIRECT_MESSAGES: boolean =
	!!process.env.IGNORE_DIRECT_MESSAGES || false;
export const COLLECT_WAYPOINTS: boolean =
	!!process.env.COLLECT_WAYPOINTS || true;
export const COLLECT_NEIGHBOUR_INFO: boolean =
	!!process.env.COLLECT_NEIGHBOURINFOS || true;
export const COLLECT_TRACEROUTES: boolean =
	!!process.env.COLLECT_TRACEROUTES || true;
export const COLLECT_MAP_REPORTS: boolean =
	!!process.env.COLLECT_MAP_REPORTS || true;

export const LOG_KNOWN_PACKET_TYPES: boolean = extractBoolean(
	process.env.LOG_KNOWN_PACKET_TYPES,
	true,
);
export const LOG_UNKNOWN_PACKET_TYPES: boolean = extractBoolean(
	process.env.LOG_UNKNOWN_PACKET_TYPES,
	true,
);

export const DECRYPTION_KEYS: string[] = process.env.DECRYPTION_KEYS?.split(
	",",
) || [
	"AQ==",
];
