import {
	IAuthenticateGeneric,
	Icon,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class TeamDynamixApi implements ICredentialType {
	name = 'teamDynamixApi';
	displayName = 'TeamDynamix API';
	documentationUrl = 'https://solutions.teamdynamix.com/TDWebApi/'; // optional
	icon: Icon = {
		light: 'file:../icons/TeamDynamix.svg',
		dark: 'file:../icons/TeamDynamix.dark.svg',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'hidden',
			typeOptions: { expirable: true, password: true },
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://solutions.teamdynamix.com/TDWebApi/api',
			required: true,
		},
		{
			displayName: 'Auth Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{ name: 'User Login', value: 'login' },
				{ name: 'Admin Login', value: 'loginadmin' },
			],
			default: 'login',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			displayOptions: { show: { authMethod: ['login'] } },
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			displayOptions: { show: { authMethod: ['login'] } },
			typeOptions: { password: true },
		},
		{
			displayName: 'Business Entity ID (BEID)',
			name: 'beid',
			type: 'string',
			default: '',
			displayOptions: { show: { authMethod: ['loginadmin'] } },
		},
		{
			displayName: 'Web Services Key',
			name: 'wsKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: { show: { authMethod: ['loginadmin'] } },
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.token}}',
			},
		},
	};

	// Log in to TDX and capture the plain-text JWT body
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const base = (credentials.baseUrl as string).replace(/\/+$/, '');
		const authMethod = String(credentials.authMethod ?? 'login');
		const authPath = authMethod === 'loginadmin' ? '/auth/loginadmin' : '/auth';

		let payload: Record<string, string>;
		if (authMethod === 'loginadmin') {
			const beid = String(credentials.beid ?? '').trim();
			const wsKey = String(credentials.wsKey ?? '').trim();

			if (!beid || !wsKey) {
				throw new Error('TeamDynamix admin auth requires both BEID and Web Services Key.');
			}

			payload = {
				BEID: beid,
				WebServicesKey: wsKey,
			};
		} else {
			const username = String(credentials.username ?? '').trim();
			const password = String(credentials.password ?? '');

			if (!username || !password) {
				throw new Error('TeamDynamix user auth requires both Username and Password.');
			}

			payload = {
				username,
				password,
			};
		}

		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: `${base}${authPath}`,
			// Send JSON but don't parse response as JSON (TDX returns text/plain)
			body: payload,
		});

		const rawBody = response;
		const token = typeof rawBody === 'string' ? rawBody.trim() : String(rawBody ?? '');
		if (!token) {
			throw new Error('TeamDynamix auth failed: token not found in response body.');
		}

		// Persist the token so authenticate{} can inject it
		credentials.token = token;
		return { token };
	}

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: '={{ $credentials.baseUrl.replace(/\\/+$/, "") }}/auth/getuser',
		},
	};
}
