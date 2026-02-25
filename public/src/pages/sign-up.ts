import authApi from '../api/auth.client-api.js';

// Register
const signUpEmailInput = document.getElementById('su-email-input') as HTMLInputElement;
const signUpUsernameInput = document.getElementById('username-input') as HTMLInputElement;
const signUpPasswordInput = document.getElementById('su-password-input') as HTMLInputElement;
const signUpConfirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;

const signUpButton = document.getElementById('sign-up-input');

if (!signUpUsernameInput || !signUpButton || !signUpEmailInput || !signUpPasswordInput || !signUpConfirmPasswordInput) 
    throw new Error('undefined element');

signUpButton.addEventListener('click', async (e) => {
    const email = signUpEmailInput.value;
    const username = signUpUsernameInput.value;
    const password = signUpPasswordInput.value;
    const confirmPassword = signUpConfirmPasswordInput.value;
    try {
        const data = await authApi.register(email, username, password, confirmPassword);
        window.location.href = '/';
    } catch (err: any) { 
        console.log(err);
    }
   
});

// Login
const logInEmailInput = document.getElementById('email-input') as HTMLInputElement;
const logInPasswordInput = document.getElementById('password-input') as HTMLInputElement;

const logInButton = document.getElementById('log-in-input');

if (!logInEmailInput || !logInPasswordInput  || !logInButton) 
    throw new Error('undefined element');

logInButton.addEventListener('click', async (e) => {
    const email = logInEmailInput.value;
    const password = logInPasswordInput.value;
    try {
        const data = await authApi.login(email, password);
        window.location.href = '/';
    } catch (err: any) { 
        console.log(err);
    }
});