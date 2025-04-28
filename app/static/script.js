const form = document.getElementById("qa-form");
const questionInput = document.getElementById("question");
const chatWindow = document.getElementById("chat-window");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  const typingEl = addTyping();

  try {
    const askRes = await fetch("/ask", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const askData = await askRes.json();
    const taskId = askData.task_id;

    if (taskId === "cached") {
      removeTyping(typingEl);
      addMessage("⚡ Answer was cached. Try again for new task!", "bot");
      return;
    }

    let result;
    while (true) {
      const res = await fetch(`/result/${taskId}`); 
      const data = await res.json();
      if (data.status === "COMPLETED") {
        result = data.result;
        break;
      }
      await new Promise((r) => setTimeout(r, 1000)); 
    }

    removeTyping(typingEl);
    addMessage(result, "bot");
  } catch (err) {
    removeTyping(typingEl);
    addMessage("Oops! Something went wrong.", "bot");
  } finally {
    questionInput.value = "";
    scrollToBottom();
  }
});

function addMessage(text, sender) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message", sender);
  msgEl.innerText = text;
  chatWindow.appendChild(msgEl);
  scrollToBottom();
}

function addTyping() {
  const typingEl = document.createElement("div");
  typingEl.classList.add("message", "typing");
  typingEl.innerText = "Gemini is typing...";
  chatWindow.appendChild(typingEl);
  scrollToBottom();
  return typingEl;
}

function removeTyping(el) {
  if (el) chatWindow.removeChild(el);
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}