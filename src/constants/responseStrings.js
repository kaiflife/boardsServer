const notFound = 'not found';
const instructions = 'instructions';
const invalid = 'invalid';
const alreadyExist = 'already exist';

const USER_NOT_FOUND = { message: `user ${notFound}` };
const BOARD_NOT_FOUND = { message: `board ${notFound}` };
const COLUMN_NOT_FOUND = { message: `column ${notFound}` };
const TASK_NOT_FOUND = { message: `task ${notFound}` };
const SOMETHING_WENT_WRONG = { message: 'something went wrong' };
const ERROR_VALIDATE_TOKEN = { message: 'error validate token' };
const INVALID_PASSWORD = { message: `${invalid} password` };
const INVALID_TOKEN = { message: `${invalid} token` };
const EMAIL_EXISTS = { message: `email ${alreadyExist}` };
const EXPIRED_TOKEN = { message: 'jwt expired'};

const PASSWORD_INSTRUCTIONS = { message: `password ${instructions}` };
const FULL_NAME_INSTRUCTIONS = { message: `fullName ${instructions}` };
const EMAIL_INSTRUCTIONS = { message: `email ${instructions}` };

const DELETED_BOARD_FROM_LIST = { message: 'board was deleted from your list' };
const DELETED_BOARD = { message: 'board was deleted' };
const EMPTY_DATA = { message: 'empty data' };

module.exports = {
	USER_NOT_FOUND,
	BOARD_NOT_FOUND,
	SOMETHING_WENT_WRONG,
	INVALID_PASSWORD,
	PASSWORD_INSTRUCTIONS,
	FULL_NAME_INSTRUCTIONS,
	EMAIL_INSTRUCTIONS,
	INVALID_TOKEN,
	EMAIL_EXISTS,
	DELETED_BOARD_FROM_LIST,
	DELETED_BOARD,
	EMPTY_DATA,
	TASK_NOT_FOUND,
	COLUMN_NOT_FOUND,
	EXPIRED_TOKEN,
	ERROR_VALIDATE_TOKEN,
}