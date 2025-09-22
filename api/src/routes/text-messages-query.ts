import type { Prisma } from "@prisma/client";
import type { Request } from "express";

const getFirstQueryValue = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		return value;
	}

	if (Array.isArray(value)) {
		for (const entry of value) {
			if (typeof entry === "string") {
				return entry;
			}
		}
	}

	return undefined;
};

const parseOptionalBigInt = (value: unknown): bigint | undefined => {
	const rawValue = getFirstQueryValue(value)?.trim();

	if (!rawValue) {
		return undefined;
	}

	try {
		return BigInt(rawValue);
	} catch {
		return undefined;
	}
};

type BuildQueryError = {
	success: false;
	status: number;
	body: { message: string };
};

type BuildQuerySuccess = {
	success: true;
	count: number;
	order: Prisma.SortOrder;
	where: Prisma.TextMessageWhereInput;
};

export type BuildTextMessagesQueryResult = BuildQueryError | BuildQuerySuccess;

export const buildTextMessagesQuery = (
	query: Request["query"],
): BuildTextMessagesQueryResult => {
	const directMessageIdsRaw = getFirstQueryValue(
		query.direct_message_node_ids,
	);
	const lastId = parseOptionalBigInt(query.last_id);
	const countParam = getFirstQueryValue(query.count);
	const parsedCount =
		countParam !== undefined ? Number.parseInt(countParam, 10) : Number.NaN;
	const count = Number.isNaN(parsedCount) ? 50 : parsedCount;

	// get query params
	const to = parseOptionalBigInt(query.to);
	const from = parseOptionalBigInt(query.from);
	const channelId = getFirstQueryValue(query.channel_id) ?? undefined;
	const gatewayId = parseOptionalBigInt(query.gateway_id);
	const directMessageNodeIds = directMessageIdsRaw
		?.split(",")
		.map((id) => id.trim())
		.filter((id) => id.length > 0);
	const orderParam = getFirstQueryValue(query.order);
	const order = (orderParam === "desc" ? "desc" : "asc") as Prisma.SortOrder;

	const directMessageNodesAsBigInt = directMessageNodeIds?.map((nodeId) => {
		try {
			return BigInt(nodeId);
		} catch {
			return undefined;
		}
	});

	let directMessageNodePair: [bigint, bigint] | undefined;

	if (directMessageNodeIds !== undefined) {
		if (directMessageNodeIds.length !== 2) {
			return {
				success: false,
				status: 400,
				body: {
					message:
						"direct_message_node_ids requires 2 node ids separated by a comma.",
				},
			};
		}

		if (
			directMessageNodesAsBigInt === undefined ||
			directMessageNodesAsBigInt.length !== 2 ||
			directMessageNodesAsBigInt[0] === undefined ||
			directMessageNodesAsBigInt[1] === undefined
		) {
			return {
				success: false,
				status: 400,
				body: {
					message:
						"direct_message_node_ids must contain valid numeric ids.",
				},
			};
		}

		directMessageNodePair = [
			directMessageNodesAsBigInt[0],
			directMessageNodesAsBigInt[1],
		];
	}

	const idFilter: Prisma.BigIntFilter | undefined =
		lastId !== undefined
			? order === "asc"
				? { gt: lastId }
				: { lt: lastId }
			: undefined;

	const baseWhere: Prisma.TextMessageWhereInput = {
		...(channelId !== undefined ? { channel_id: channelId } : {}),
		...(idFilter !== undefined ? { id: idFilter } : {}),
		...(gatewayId !== undefined ? { gateway_id: gatewayId } : {}),
	};

	const where: Prisma.TextMessageWhereInput =
		directMessageNodePair !== undefined
			? {
					AND: baseWhere,
					OR: [
						{
							to: directMessageNodePair[0],
							from: directMessageNodePair[1],
						},
						{
							to: directMessageNodePair[1],
							from: directMessageNodePair[0],
						},
					],
				}
			: {
					...baseWhere,
					to,
					from,
				};

	return {
		success: true,
		count,
		order,
		where,
	};
};
