import authApi, { AuthValidationError } from '../api/auth/auth.client-api.js';

// Register
const signUpEmailInput = document.getElementById('su-email-input') as HTMLInputElement;
const signUpUsernameInput = document.getElementById('username-input') as HTMLInputElement;
const signUpPasswordInput = document.getElementById('su-password-input') as HTMLInputElement;
const signUpConfirmPasswordInput = document.getElementById(
	'confirm-password-input',
) as HTMLInputElement;

const signUpEmailInputErrorBox = document.getElementById('su-email-input-errors');
const signUpEmailInputErrorBoxText = document.getElementById('su-email-input-error-content');

const signUpUsernameInputErrorBox = document.getElementById('username-input-errors');
const signUpUsernameInputErrorBoxText = document.getElementById('username-input-error-content');

const signUpPasswordInputErrorBox = document.getElementById('su-password-input-errors');
const signUpPasswordInputErrorBoxText = document.getElementById('su-password-input-error-content');

const signUpConfirmPasswordInputErrorBox = document.getElementById('confirm-password-input-errors');
const signUpConfirmPasswordInputErrorBoxText = document.getElementById(
	'confirm-password-input-error-content',
);

const signUpButton = document.getElementById('sign-up-input');

const signUpFieldToErrorContainerMap = {
	email: [signUpEmailInputErrorBox, signUpEmailInputErrorBoxText],
	username: [signUpUsernameInputErrorBox, signUpUsernameInputErrorBoxText],
	password: [signUpPasswordInputErrorBox, signUpPasswordInputErrorBoxText],
	confirmPassword: [signUpConfirmPasswordInputErrorBox, signUpConfirmPasswordInputErrorBoxText],
} as const;

function isSignUpFieldErrorMapKey(key: string): key is keyof typeof signUpFieldToErrorContainerMap {
	return key in signUpFieldToErrorContainerMap;
}

function clearSignUpErrors() {
	for (const key in signUpFieldToErrorContainerMap) {
		if (!isSignUpFieldErrorMapKey(key)) continue;
		const [container, text] = signUpFieldToErrorContainerMap[key];
		if (!container || !text) continue;

		container.classList.add('invisible');
		text.textContent = '';
	}
}

function showSignUpErrors(err: AuthValidationError) {
	for (const fieldError of err.errors) {
		if (!isSignUpFieldErrorMapKey(fieldError.field)) continue;
		const [container, text] = signUpFieldToErrorContainerMap[fieldError.field];
		if (!container || !text) continue;

		container.classList.remove('invisible');
		text.textContent = fieldError.message;
	}
}

if (
	!signUpUsernameInput ||
	!signUpButton ||
	!signUpEmailInput ||
	!signUpPasswordInput ||
	!signUpConfirmPasswordInput
)
	throw new Error('undefined element');

signUpButton.addEventListener('click', async (e) => {
	clearSignUpErrors();
	const email = signUpEmailInput.value;
	const username = signUpUsernameInput.value;
	const password = signUpPasswordInput.value;
	const confirmPassword = signUpConfirmPasswordInput.value;

	try {
		await authApi.register(email, username, password, confirmPassword);
		window.location.href = '/';
	} catch (err: any) {
		if (err instanceof AuthValidationError) showSignUpErrors(err);
		throw err;
	}
});

// Login
const logInEmailInput = document.getElementById('email-input') as HTMLInputElement;
const logInPasswordInput = document.getElementById('password-input') as HTMLInputElement;

const logInButton = document.getElementById('log-in-input');

const logInEmailInputErrorBox = document.getElementById('email-input-errors');
const logInEmailInputErrorBoxText = document.getElementById('email-input-error-content');

if (!logInEmailInput || !logInPasswordInput || !logInButton) throw new Error('undefined element');

logInButton.addEventListener('click', async (e) => {
	const email = logInEmailInput.value;
	const password = logInPasswordInput.value;
	try {
		await authApi.login(email, password);
		window.location.href = '/';
	} catch (err: any) {
		if (err instanceof Error) {
			if (!logInEmailInputErrorBox || !logInEmailInputErrorBoxText) return;
			logInEmailInputErrorBox.classList.remove('invisible');
			logInEmailInputErrorBoxText.textContent = 'Invalid credentials';
		}
	}
});
