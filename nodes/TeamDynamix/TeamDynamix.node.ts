import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { executeKbArticleOperation } from './KbArticleOperations';
import { executeTicketOperation } from './TicketOperations';

export class TeamDynamix implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Team Dynamix',
		name: 'teamDynamix',
		icon: 'file:TeamDynamix.svg',
		group: ['transform'],
		version: 1,
		description: 'Work with TeamDynamix tickets and knowledge base articles',
		usableAsTool: true,
		defaults: {
			name: 'TeamDynamix',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'teamDynamixApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'ticket',
				options: [
					{
						name: 'KB Article',
						value: 'kbArticle',
					},
					{
						name: 'Ticket',
						value: 'ticket',
					},
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['kbArticle'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new knowledge base article',
						action: 'Create a knowledge base article',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a knowledge base article by ID',
						action: 'Delete a knowledge base article',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Fetch a single knowledge base article by ID',
						action: 'Get a knowledge base article',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Fetch a list of knowledge base articles',
						action: 'Get many knowledge base articles',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a knowledge base article by ID',
						action: 'Update a knowledge base article',
					},
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['ticket'],
					},
				},
				options: [
					{
						name: 'Add Feed',
						value: 'addFeed',
						description: 'Add a feed entry to a ticket',
						action: 'Add a ticket feed entry',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new ticket',
						action: 'Create a ticket',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a ticket by ID',
						action: 'Delete a ticket',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Fetch a single ticket by ID',
						action: 'Get a ticket',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Fetch a list of tickets',
						action: 'Get many tickets',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a ticket by ID',
						action: 'Update a ticket',
					},
				],
			},
			{
				displayName: 'App ID Source',
				name: 'appIdSource',
				type: 'options',
				default: 'node',
				options: [
					{
						name: 'Credential Default',
						value: 'credential',
					},
					{
						name: 'Node Parameter',
						value: 'node',
					},
				],
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'getAll', 'update', 'delete', 'addFeed'],
					},
				},
			},
			{
				displayName: 'App ID',
				name: 'appId',
				type: 'number',
				default: 0,
				required: true,
				description: 'TeamDynamix ticketing application ID',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'getAll', 'update', 'delete', 'addFeed'],
						appIdSource: ['node'],
					},
				},
			},
			{
				displayName: 'Create Mode',
				name: 'createMode',
				type: 'options',
				default: 'fields',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Guided Fields',
						value: 'fields',
					},
					{
						name: 'Raw JSON',
						value: 'json',
					},
				],
			},
			{
				displayName: 'Title',
				name: 'createTitle',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['fields'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'createDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['fields'],
					},
				},
			},
			{
				displayName: 'Priority ID',
				name: 'createPriorityId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['fields'],
					},
				},
			},
			{
				displayName: 'Status ID',
				name: 'createStatusId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['fields'],
					},
				},
			},
			{
				displayName: 'Requestor UID',
				name: 'createRequestorUid',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['fields'],
					},
				},
			},
			{
				displayName: 'Ticket Data',
				name: 'ticketData',
				type: 'json',
				default: '{\n  "Title": "Ticket created from n8n"\n}',
				description: 'JSON object containing ticket fields for creation',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
						createMode: ['json'],
					},
				},
			},
			{
				displayName: 'Search Data',
				name: 'searchData',
				type: 'json',
				default: '{\n  "StatusIDs": []\n}',
				description: 'TicketSearch request body for POST /tickets/search',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['get', 'update', 'delete', 'addFeed'],
					},
				},
			},
			{
				displayName: 'Update Data',
				name: 'updateData',
				type: 'json',
				default: '{\n  "Title": "Updated from n8n"\n}',
				description: 'JSON object containing ticket fields to update',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Feed Data',
				name: 'feedData',
				type: 'json',
				default: '{\n  "Comments": "Added from n8n"\n}',
				description: 'JSON object for the feed entry body',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['addFeed'],
					},
				},
			},
			{
				displayName: 'KB Article ID',
				name: 'kbArticleId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['kbArticle'],
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			{
				displayName: 'KB Article Data',
				name: 'kbArticleData',
				type: 'json',
				default: '{\n  "Title": "Article created from n8n"\n}',
				description: 'JSON object containing knowledge base article fields',
				displayOptions: {
					show: {
						resource: ['kbArticle'],
						operation: ['create', 'update'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('teamDynamixApi');
		const baseUrl = String(credentials.baseUrl ?? '').replace(/\/+$/, '');
		const credentialDefaultAppId = Number(credentials.defaultAppId ?? 0);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;

				if (resource === 'kbArticle') {
					const operationData = await executeKbArticleOperation.call(this, itemIndex, baseUrl);
					returnData.push(...operationData);
					continue;
				}

				if (resource !== 'ticket') {
					throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`, {
						itemIndex,
					});
				}

				const appIdSource = this.getNodeParameter('appIdSource', itemIndex) as string;
				let appId: number;

				if (appIdSource === 'credential') {
					appId = credentialDefaultAppId;
					if (!appId || appId <= 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Credential Default App ID must be greater than 0 when App ID Source is Credential Default',
							{ itemIndex },
						);
					}
				} else {
					appId = this.getNodeParameter('appId', itemIndex) as number;
					if (!appId || appId <= 0) {
						throw new NodeOperationError(this.getNode(), 'App ID must be greater than 0', {
							itemIndex,
						});
					}
				}

				const operationData = await executeTicketOperation.call(this, itemIndex, baseUrl, appId);
				returnData.push(...operationData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				throw error;
			}
		}

		return [returnData];
	}
}
