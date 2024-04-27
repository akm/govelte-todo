import type { Task } from '$lib/models/task';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { TaskService } from '../gen/task/v1/task_connect';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { Status } from '../gen/task/v1/task_pb';
import { apisvrOrigin } from '$lib/server/apisvr';

export async function load(event: ServerLoadEvent): Promise<{ tasks: Task[] }> {
	if (!event.locals.user) {
		throw redirect(302, '/signin');
	}

	console.log('load: event.constructor', event.constructor);

	const transport = createConnectTransport({
		baseUrl: apisvrOrigin,
		interceptors: [
			(next) => async (req) => {
				req.header.set('cookie', event.request.headers.get('cookie') || '');
				return await next(req);
			}
		]
	});

	// Here we make the client itself, combining the service
	// definition with the transport.
	const client = createPromiseClient(TaskService, transport);

	const taskListResp = await client.list({});
	return {
		tasks: taskListResp.items.map((task) => ({
			id: task.id,
			name: task.name,
			done: task.status === Status.DONE
		}))
	};
}
