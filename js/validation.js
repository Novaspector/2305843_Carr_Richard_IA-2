//Richard Carr- 2305843
/**
 * validation.js - Checks the registration form on login.html.
 * If every rule passes, the data is saved to localStorage and the user
 * is sent to ticket.html. Otherwise errors are shown next to each field.
 */

/* ---- Settings ---- */
const STORAGE_KEY = "codingConfTicket";
const MAX_AVATAR_BYTES = 500 * 1024; // 500KB limit
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // user@domain.com
const GITHUB_PATTERN = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/; // @ followed by a handle

/* ---- Page elements ---- */
const form = document.getElementById("registration-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github");
const avatarInput = document.getElementById("avatar");
const avatarText = document.getElementById("avatar-text");

/**
 * Shows an error message under a field, or clears it when message is empty.
 * @param {HTMLInputElement} input - the field being checked
 * @param {string} message - error text ("" clears the error)
 * @returns {boolean} true when the field is valid
 */
function setError(input, message) {
  const errorBox = document.getElementById(input.id + "-error");
  errorBox.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

/* Each validator returns true (valid) or false (and shows an error) */
function validateName() {
  if (nameInput.value.trim() === "") {
    return setError(nameInput, "Enter your full name. Spaces alone are not accepted.");
  }
  return setError(nameInput, "");
}

function validateEmail() {
  if (!EMAIL_PATTERN.test(emailInput.value.trim())) {
    return setError(emailInput, "Enter a valid email address, like user@domain.com.");
  }
  return setError(emailInput, "");
}

function validateGithub() {
  if (!GITHUB_PATTERN.test(githubInput.value.trim())) {
    return setError(githubInput, "Enter your GitHub username starting with @, like @yourusername.");
  }
  return setError(githubInput, "");
}

function validateAvatar() {
  const file = avatarInput.files[0];
  if (!file) {
    return setError(avatarInput, "Upload a profile picture.");
  }
  // indexOf returns -1 when the file type is not in the allowed list
  if (ALLOWED_TYPES.indexOf(file.type) === -1) {
    return setError(avatarInput, "The file must be a JPG or PNG image.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return setError(avatarInput, "The image is too large. Choose one under 500KB.");
  }
  return setError(avatarInput, "");
}

/**
 * Builds a 5 digit serial number such as #01609.
 * @returns {string}
 */
function makeSerial() {
  let number = String(Math.floor(Math.random() * 99999) + 1);
  while (number.length < 5) {
    number = "0" + number;
  }
  return "#" + number;
}

/**
 * Reads the avatar file, saves everything to localStorage and opens the ticket.
 */
function saveAndContinue() {
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    const ticket = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      github: githubInput.value.trim(),
      avatar: reader.result, // image stored as a data URL string
      serial: makeSerial()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
      window.location.href = "ticket.html";
    } catch (error) {
      setError(avatarInput, "Your browser could not save the ticket. Try a smaller image.");
    }
  });

  reader.readAsDataURL(avatarInput.files[0]);
}

/* ---- Event listeners ---- */

// Check the whole form when it is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Run every check (no early exit) so all errors show at once
  const nameOk = validateName();
  const emailOk = validateEmail();
  const githubOk = validateGithub();
  const avatarOk = validateAvatar();

  if (nameOk && emailOk && githubOk && avatarOk) {
    saveAndContinue();
  } else {
    // Move focus to the first field with a problem
    form.querySelector('[aria-invalid="true"]').focus();
  }
});

// Check each field again as the user fixes it
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
githubInput.addEventListener("input", validateGithub);

// Update the upload box text and check the chosen file
avatarInput.addEventListener("change", function () {
  const file = avatarInput.files[0];
  avatarText.textContent = file ? file.name : "Click or press Enter to choose an image";
  validateAvatar();
});