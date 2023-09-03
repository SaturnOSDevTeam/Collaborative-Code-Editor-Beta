// DOM elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerFeedback = document.getElementById('register-feedback');
const loginFeedback = document.getElementById('login-feedback');

// Handle successful login
function handleLoginSuccess() {
  // Hide both forms
  registerForm.style.display = 'none';
  loginForm.style.display = 'none';

  // Clear feedback messages
  registerFeedback.textContent = '';
  loginFeedback.textContent = '';

  // Now the user can focus on coding
}

// Handle registration
function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  // ... Your previous registration code ...

  // Handle successful registration
  registerFeedback.textContent = 'Registration successful. You can now log in.';
}

// Handle login
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // ... Your previous login code ...

  // Handle successful login
  handleLoginSuccess();
}

// Add event listeners to the buttons
document.getElementById('register-button').addEventListener('click', register);
document.getElementById('login-button').addEventListener('click', login);
