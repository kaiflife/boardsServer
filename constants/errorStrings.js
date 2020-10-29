const notFound = 'not found';
const instructions = 'instructions';
const invalid = 'invalid';
const alreadyExist = 'already exist';

const USER_NOT_FOUND = { message: `user ${notFound}` };
const BOARD_NOT_FOUND = { message: `board ${notFound}` };
const SOMETHING_WENT_WRONG = { message: 'something went wrong' };
const INVALID_PASSWORD = { message: `${invalid} password` };
const INVALID_TOKEN = { message: `${invalid} token` };
const ID_TASK_EXISTS = { message: `id of this task ${alreadyExist}` };
const EMAIL_EXISTS = { message: `email ${alreadyExist}` };

const PASSWORD_INSTRUCTIONS = { message: `password ${instructions}` };
const FULL_NAME_INSTRUCTIONS = { message: `fullName ${instructions}` };
const EMAIL_INSTRUCTIONS = { message: `email ${instructions}` };

export {
	USER_NOT_FOUND,
	BOARD_NOT_FOUND,
	SOMETHING_WENT_WRONG,
	INVALID_PASSWORD,
	ID_TASK_EXISTS,
	PASSWORD_INSTRUCTIONS,
	FULL_NAME_INSTRUCTIONS,
	EMAIL_INSTRUCTIONS,
	INVALID_TOKEN,
	EMAIL_EXISTS,
}