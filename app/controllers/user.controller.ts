import UserService from '#services/user.service';
import { Result } from '#utils/result_utils';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class UsersController {

	constructor(
		private userService: UserService
	) { }

	public async details({ response, auth }: HttpContext) {

		const _user = auth.getUserOrFail();
		const user = await this.userService.details(_user);

		return response.ok(Result.ok(user));

	}


}