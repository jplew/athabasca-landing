const forms = document.querySelectorAll(".waitlist-form");
const statusNote = document.querySelector("#form-note");

function setStatus(message, isError = false) {
  if (!statusNote) return;
  statusNote.textContent = message;
  statusNote.style.color = isError ? "#9b2f24" : "";
}

async function submitWaitlist(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const email = new FormData(form).get("email");
  const button = form.querySelector("button");
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Requesting...";
  setStatus("Sending your request...");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    form.reset();
    setStatus("You are on the list. I will follow up when early access opens.");
  } catch (error) {
    const fallback = `mailto:hello@wheretoaccess.com?subject=Athabasca%20waitlist&body=Please%20add%20${encodeURIComponent(
      email
    )}%20to%20the%20Athabasca%20waitlist.`;
    setStatus("The form could not submit yet. Opening an email fallback.", true);
    window.location.href = fallback;
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

forms.forEach((form) => form.addEventListener("submit", submitWaitlist));
