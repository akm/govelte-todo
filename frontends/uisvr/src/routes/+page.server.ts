import type { Task } from '$lib/models/task';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { TaskService } from '../gen/task/v1/task_connect';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { Status } from '../gen/task/v1/task_pb';

export async function load(event: ServerLoadEvent): Promise<{ tasks: Task[] }> {
	console.log('load: event.constructor', event.constructor);

	const transport = createConnectTransport({ baseUrl: 'http://localhost:8080' });

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
