import {
	Config_DeviceConfig_Role,
	Config_LoRaConfig_ModemPreset,
	Config_LoRaConfig_RegionCode,
} from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/config_pb.js";
import { HardwareModel } from "@buf/meshtastic_protobufs.bufbuild_es/meshtastic/mesh_pb.js";

// appends extra info for node objects returned from api
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function formatNodeInfo(node: any) {
	return {
		...node,
		node_id_hex: `!${node.node_id.toString(16)}`,
		hardware_model_name: HardwareModel[node.hardware_model] ?? null,
		role_name: Config_DeviceConfig_Role[node.role] ?? null,
		region_name: Config_LoRaConfig_RegionCode[node.region] ?? null,
		modem_preset_name:
			Config_LoRaConfig_ModemPreset[node.modem_preset] ?? null,
	};
}
