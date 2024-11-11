import { RESULT_ANSWER } from "./dictionaries/result_dictionary.js";

interface IResult {

	status: RESULT_ANSWER.OK | RESULT_ANSWER.ERROR;
	result: unknown | unknown[] | Record<string, unknown>;

}

export class Result {

	static ok(result?: unknown | unknown[] | Record<string, unknown>): IResult {

		return {
			status: RESULT_ANSWER.OK,
			result
		};

	}

	static error(result: unknown | unknown[] | Record<string, unknown>): IResult {

		return {
			status: RESULT_ANSWER.OK,
			result
		};

	}

}