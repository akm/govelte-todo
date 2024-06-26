// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from '$lib/models/user';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | undefined;
			// sessionID: string | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
