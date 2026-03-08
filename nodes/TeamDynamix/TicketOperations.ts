import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

function parseJsonObject(
	this: IExecuteFunctions,
	value: IDataObject | string,
	fieldName: string,
	itemIndex: number,
): IDataObject {
	let body: IDataObject;
	if (typeof value === 'string') {
		try {
			body = JSON.parse(value) as IDataObject;
		} catch {
			throw new NodeOperationError(this.getNode(), `${fieldName} must be valid JSON`, {
				itemIndex,
			});
		}
	} else {
		body = value;
	}

	if (Array.isArray(body) || typeof body !== 'object' || body === null) {
		throw new NodeOperationError(this.getNode(), `${fieldName} must be a JSON object`, {
			itemIndex,
		});
	}

	return body;
}

async function executeCreate(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
): Promise<INodeExecutionData[]> {
	let body: IDataObject;
	const createMode = this.getNodeParameter('createMode', itemIndex) as string;
	this.logger.debug('Creating TeamDynamix ticket');
	if (createMode === 'json') {
		const ticketDataRaw = this.getNodeParameter('ticketData', itemIndex) as IDataObject | string;
		body = parseJsonObject.call(this, ticketDataRaw, 'Ticket Data', itemIndex);
	} else {
		const createTitle = this.getNodeParameter('createTitle', itemIndex) as string;
		const createDescription = this.getNodeParameter('createDescription', itemIndex) as string;
		const createPriorityId = this.getNodeParameter('createPriorityId', itemIndex) as number;
		const createStatusId = this.getNodeParameter('createStatusId', itemIndex) as number;
		const createRequestorUid = this.getNodeParameter('createRequestorUid', itemIndex) as string;

		body = {
			Title: createTitle,
		};

		if (createDescription) {
			body.Description = createDescription;
		}
		if (createPriorityId > 0) {
			body.PriorityID = createPriorityId;
		}
		if (createStatusId > 0) {
			body.StatusID = createStatusId;
		}
		if (createRequestorUid) {
			body.RequestorUid = createRequestorUid;
		}
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'POST',
		url: ticketsBaseUrl,
		body,
		json: true,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

async function executeGetAll(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
): Promise<INodeExecutionData[]> {
	const searchMode = this.getNodeParameter('searchMode', itemIndex, 'json') as string;
	let body: IDataObject;

	if (searchMode === 'json') {
		const searchDataRaw = this.getNodeParameter('searchData', itemIndex) as IDataObject | string;
		body = parseJsonObject.call(this, searchDataRaw, 'Search Data', itemIndex);
	} else {
		body = this.getNodeParameter('search', itemIndex, {}) as IDataObject;
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'POST',
		url: `${ticketsBaseUrl}/search`,
		body,
		json: true,
	});

	const tickets = Array.isArray(response) ? response : [response];
	return tickets.map((ticket) => ({
		json: ticket as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

async function executeGet(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
	ticketId: number,
): Promise<INodeExecutionData[]> {
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'GET',
		url: `${ticketsBaseUrl}/${ticketId}`,
		json: true,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

async function executeUpdate(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
	ticketId: number,
): Promise<INodeExecutionData[]> {
	const updateDataRaw = this.getNodeParameter('updateData', itemIndex) as IDataObject | string;
	const body = parseJsonObject.call(this, updateDataRaw, 'Update Data', itemIndex);

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'PUT',
		url: `${ticketsBaseUrl}/${ticketId}`,
		body,
		json: true,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

async function executeDelete(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
	ticketId: number,
): Promise<INodeExecutionData[]> {
	await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'DELETE',
		url: `${ticketsBaseUrl}/${ticketId}`,
		json: true,
	});

	return [
		{
			json: {
				ticketId,
				deleted: true,
			},
			pairedItem: { item: itemIndex },
		},
	];
}

async function executeAddFeed(
	this: IExecuteFunctions,
	itemIndex: number,
	ticketsBaseUrl: string,
	ticketId: number,
): Promise<INodeExecutionData[]> {
	const feedDataRaw = this.getNodeParameter('feedData', itemIndex) as IDataObject | string;
	const body = parseJsonObject.call(this, feedDataRaw, 'Feed Data', itemIndex);

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'POST',
		url: `${ticketsBaseUrl}/${ticketId}/feed`,
		body,
		json: true,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

export async function executeTicketOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
	appId: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', itemIndex) as string;
	const operation = this.getNodeParameter('operation', itemIndex) as string;

	if (resource !== 'ticket') {
		throw new NodeOperationError(
			this.getNode(),
			`Unsupported combination: ${resource}.${operation}`,
			{
				itemIndex,
			},
		);
	}

	const ticketsBaseUrl = `${baseUrl}/${appId}/tickets`;

	if (operation === 'create') {
		return executeCreate.call(this, itemIndex, ticketsBaseUrl);
	}

	if (operation === 'getAll') {
		return executeGetAll.call(this, itemIndex, ticketsBaseUrl);
	}

	const ticketId = this.getNodeParameter('ticketId', itemIndex) as number;
	if (!ticketId || ticketId <= 0) {
		throw new NodeOperationError(this.getNode(), 'Ticket ID must be greater than 0', {
			itemIndex,
		});
	}

	if (operation === 'get') {
		return executeGet.call(this, itemIndex, ticketsBaseUrl, ticketId);
	}

	if (operation === 'update') {
		return executeUpdate.call(this, itemIndex, ticketsBaseUrl, ticketId);
	}

	if (operation === 'delete') {
		return executeDelete.call(this, itemIndex, ticketsBaseUrl, ticketId);
	}

	if (operation === 'addFeed') {
		return executeAddFeed.call(this, itemIndex, ticketsBaseUrl, ticketId);
	}

	throw new NodeOperationError(
		this.getNode(),
		`Unsupported combination: ${resource}.${operation}`,
		{
			itemIndex,
		},
	);
}
