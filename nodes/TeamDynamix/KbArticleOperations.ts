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
	kbArticlesBaseUrl: string,
): Promise<INodeExecutionData[]> {
	const kbArticleDataRaw = this.getNodeParameter('kbArticleData', itemIndex) as
		| IDataObject
		| string;
	const body = parseJsonObject.call(this, kbArticleDataRaw, 'KB Article Data', itemIndex);

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'POST',
		url: kbArticlesBaseUrl,
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
	kbArticlesBaseUrl: string,
): Promise<INodeExecutionData[]> {
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'GET',
		url: kbArticlesBaseUrl,
		json: true,
	});

	const kbArticles = Array.isArray(response) ? response : [response];
	return kbArticles.map((article) => ({
		json: article as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

async function executeGet(
	this: IExecuteFunctions,
	itemIndex: number,
	kbArticlesBaseUrl: string,
	kbArticleId: number,
): Promise<INodeExecutionData[]> {
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'GET',
		url: `${kbArticlesBaseUrl}/${kbArticleId}`,
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
	kbArticlesBaseUrl: string,
	kbArticleId: number,
): Promise<INodeExecutionData[]> {
	const kbArticleDataRaw = this.getNodeParameter('kbArticleData', itemIndex) as
		| IDataObject
		| string;
	const body = parseJsonObject.call(this, kbArticleDataRaw, 'KB Article Data', itemIndex);

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'PUT',
		url: `${kbArticlesBaseUrl}/${kbArticleId}`,
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
	kbArticlesBaseUrl: string,
	kbArticleId: number,
): Promise<INodeExecutionData[]> {
	await this.helpers.httpRequestWithAuthentication.call(this, 'teamDynamixApi', {
		method: 'DELETE',
		url: `${kbArticlesBaseUrl}/${kbArticleId}`,
		json: true,
	});

	return [
		{
			json: {
				kbArticleId,
				deleted: true,
			},
			pairedItem: { item: itemIndex },
		},
	];
}

export async function executeKbArticleOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', itemIndex) as string;
	const operation = this.getNodeParameter('operation', itemIndex) as string;

	if (resource !== 'kbArticle') {
		throw new NodeOperationError(
			this.getNode(),
			`Unsupported combination: ${resource}.${operation}`,
			{
				itemIndex,
			},
		);
	}

	const kbArticlesBaseUrl = `${baseUrl}/knowledgebase/articles`;

	if (operation === 'create') {
		return executeCreate.call(this, itemIndex, kbArticlesBaseUrl);
	}

	if (operation === 'getAll') {
		return executeGetAll.call(this, itemIndex, kbArticlesBaseUrl);
	}

	const kbArticleId = this.getNodeParameter('kbArticleId', itemIndex) as number;
	if (!kbArticleId || kbArticleId <= 0) {
		throw new NodeOperationError(this.getNode(), 'KB Article ID must be greater than 0', {
			itemIndex,
		});
	}

	if (operation === 'get') {
		return executeGet.call(this, itemIndex, kbArticlesBaseUrl, kbArticleId);
	}

	if (operation === 'update') {
		return executeUpdate.call(this, itemIndex, kbArticlesBaseUrl, kbArticleId);
	}

	if (operation === 'delete') {
		return executeDelete.call(this, itemIndex, kbArticlesBaseUrl, kbArticleId);
	}

	throw new NodeOperationError(
		this.getNode(),
		`Unsupported combination: ${resource}.${operation}`,
		{
			itemIndex,
		},
	);
}
