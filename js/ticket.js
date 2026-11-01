//Richard Carr- 2305843
//If no saved data exists, the visitor is sent back to index.html.

const STORAGE_KEY = "codingConfTicket";

/**
 * Reads the saved ticket from localStorage.
 * @returns {object|null} ticket data, or null when missing or unreadable
 */
function loadTicket() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.name && saved.avatar ? saved : null;
  } catch (error) {
    return null;
  }
}

/**
 * Writes the ticket values into the page.
 * textContent is used so user input can never be run as HTML.
 * @param {object} ticket
 */
function showTicket(ticket) {
  document.getElementById("out-name-heading").textContent = ticket.name;
  document.getElementById("out-name").textContent = ticket.name;
  document.getElementById("out-email").textContent = ticket.email;
  document.getElementById("out-serial").textContent = ticket.serial;
  document.getElementById("out-github-text").textContent = ticket.github;

  // Link to the profile, without the leading @
  const githubLink = document.getElementById("out-github");
  githubLink.href = `https://github.com/${encodeURIComponent(ticket.github.slice(1))}`;

  const avatar = document.getElementById("out-avatar");
  avatar.src = ticket.avatar;
  avatar.alt = `Profile picture of ${ticket.name}`;
}

/* ---- Run on page load ---- */
const ticketData = loadTicket();

if (ticketData) {
  showTicket(ticketData);
} else {
  // Direct visit without registering: go back to the landing page
  window.location.replace("index.html");
}
// Open the browser print dialog so the ticket can be printed or saved as PDF
document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});