/**
 * CHATBOT WIDGET CONTROLLER
 * Injects a floating AI Chatbot orb and dialogue panel onto all pages.
 * Queries the OpenRouter Gemini API using the client's global API Key.
 * Inject dynamic inventory catalog context into system prompt.
 */

const CHATBOT_CONFIG = {
  apiKey: localStorage.getItem("sterling_chatbot_api_key") || "",
  model: "google/gemini-2.5-flash",
  systemPrompt: `You are 'Sterling', the official AI Commercial Logistics Assistant for Sterling Technology.
Your goal is to answer buyers' wholesale, shipping, and technical product questions, helping convert inquiries into registered partners.

KEY STANDARDS:
- Speak professionally, politely, and commercially.
- Keep answers concise (under 3-4 sentences where possible) unless technical details are requested.
- Explain the rigorous 4-step refurbishment process when clients ask about quality (Intake diagnostic, medical UV-C sanitize, OEM chip/battery replacement, 72h burn-in testing).
- Always refer buyers to the 'Company Portal' page to register commercial trade accounts, and the 'Products' page catalog to check MOQ specifications.
- Do NOT make up products. Only talk about products in the catalog provided.

LIVE CATALOG STOCK CONTEXT:
`
};

let conversationHistory = [];

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Load dynamic products to inject as context to AI chatbot
  let catalogContext = "No inventory currently loaded.";
  try {
    if (typeof fetchProducts === "function") {
      const items = await fetchProducts();
      catalogContext = items.map(p => 
        `- ID: ${p.id}\n  Name: ${p.name}\n  Category: ${p.category}\n  Condition: ${p.condition}\n  MOQ: ${p.moq}\n  Price Range: ${p.price_wholesale_range}\n  Specs: ${JSON.stringify(p.specs)}`
      ).join("\n\n");
    }
  } catch (err) {
    console.warn("[Chatbot Service] Failed to retrieve products for system context fallback:", err);
  }

  CHATBOT_CONFIG.systemPrompt += catalogContext;

  // Initialize history with system prompt
  conversationHistory.push({
    role: "system",
    content: CHATBOT_CONFIG.systemPrompt
  });

  // 2. Inject Chat UI Elements into Body
  injectChatUI();

  // 3. Bind UI Events
  setupChatHandlers();
});

/**
 * Injects floating Orb button and hidden dialog panel
 */
function injectChatUI() {
  // Floating Orb Button
  const orb = document.createElement("div");
  orb.className = "chatbot-orb";
  orb.id = "site-chatbot-orb";
  orb.title = "Ask Sterling - AI Assistant";
  orb.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `;

  const needsKey = !CHATBOT_CONFIG.apiKey;
  const setupHtml = needsKey ? `
      <div class="chat-msg bot api-setup-msg" id="api-key-setup-box" style="background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.25); border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 0.9rem;">
        <strong style="color: #ea580c; display: flex; align-items: center; gap: 6px; font-size: 0.9rem;">🔑 Sourcing Desk API Offline</strong>
        <p style="margin: 6px 0; color: #4b5563; font-size: 0.8rem; line-height: 1.4;">
          To chat with the sourcing desk, please save your OpenRouter API Key. It is cached 100% locally in your browser.
        </p>
        <div style="margin-top: 10px; display: flex; gap: 8px;">
          <input type="password" id="sterling-api-input" placeholder="sk-or-v1-..." style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db; font-size: 0.8rem; background: #ffffff;">
          <button id="save-api-key-btn" style="background: #eab308; color: #000; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">Save</button>
        </div>
      </div>
  ` : '';

  // Chat Panel Window
  const panel = document.createElement("div");
  panel.className = "chat-panel glass-panel";
  panel.id = "site-chat-panel";
  panel.style.background = "white";
  panel.innerHTML = `
    <div class="chat-header">
      <div class="chat-title-wrap">
        <span class="chat-status-dot"></span>
        <span class="chat-title">Ask Sterling / Sourcing Desk</span>
      </div>
      <button class="chat-close-btn" id="close-chat-btn">&times;</button>
    </div>
    <div class="chat-body" id="chat-messages-container">
      <div class="chat-msg bot">
        Greetings. I am Sterling, your Wholesale Sourcing Assistant. Ask me about our refurbished testing, stock availability, bulk discounts, or shipping terms.
      </div>
      ${setupHtml}
    </div>
    <div class="chat-footer">
      <input type="text" class="chat-input" id="chat-user-input" placeholder="Inquire about MOQ, warranty, or BTC miners...">
      <button class="chat-send-btn" id="chat-send-btn">
        <svg viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(orb);
  document.body.appendChild(panel);
}

/**
 * Setup toggles and submit button hooks
 */
function setupChatHandlers() {
  const orb = document.getElementById("site-chatbot-orb");
  const panel = document.getElementById("site-chat-panel");
  const closeBtn = document.getElementById("close-chat-btn");
  
  const chatInput = document.getElementById("chat-user-input");
  const sendBtn = document.getElementById("chat-send-btn");

  // Toggle open
  orb.addEventListener("click", () => {
    panel.classList.add("active");
    chatInput.focus();
  });

  // Toggle close
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !orb.contains(e.target) && panel.classList.contains("active")) {
      panel.classList.remove("active");
    }
  });

  // Save API Key Action
  const saveKeyBtn = document.getElementById("save-api-key-btn");
  const apiInput = document.getElementById("sterling-api-input");
  if (saveKeyBtn && apiInput) {
    saveKeyBtn.addEventListener("click", () => {
      const keyVal = apiInput.value.trim();
      if (keyVal) {
        localStorage.setItem("sterling_chatbot_api_key", keyVal);
        CHATBOT_CONFIG.apiKey = keyVal;
        const setupBox = document.getElementById("api-key-setup-box");
        if (setupBox) {
          setupBox.innerHTML = `<strong>✅ Key Configured Successfully</strong><br>Connected to sourcing assistant desk.`;
          setTimeout(() => setupBox.remove(), 2500);
        }
      }
    });
  }

  // Send Actions
  sendBtn.addEventListener("click", handleUserSend);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserSend();
  });
}

/**
 * Processes message transmission and API response rendering
 */
async function handleUserSend() {
  const chatInput = document.getElementById("chat-user-input");
  const query = chatInput.value.trim();
  if (!query) return;

  chatInput.value = ""; // Clear input
  
  // Render user bubble
  appendMessage("user", query);

  // Render bouncing loader bubble
  const loader = showTypingIndicator();

  // Call AI Service
  try {
    const reply = await queryOpenRouter(query);
    loader.remove(); // Remove bouncing dots
    appendMessage("bot", reply);
  } catch (err) {
    console.error("[Chatbot Service] API completion failover:", err);
    loader.remove();
    if (err.message === "API_KEY_REQUIRED") {
      appendMessage("bot", "Sourcing Desk API is offline. Please enter your OpenRouter API Key in the settings prompt above to resume live assistance.");
    } else {
      appendMessage("bot", "Apologies. I encountered a pipeline sync error. Sourcing inquiries can always be submitted directly on our Company page form.");
    }
  }
}

/**
 * Append chat text bubbles to scroll frame
 */
function appendMessage(role, text) {
  const container = document.getElementById("chat-messages-container");
  const bubble = document.createElement("div");
  bubble.className = `chat-msg ${role}`;
  bubble.innerText = text;
  container.appendChild(bubble);
  
  // Auto Scroll
  container.scrollTop = container.scrollHeight;
}

/**
 * Displays typing dots anim
 */
function showTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  const loader = document.createElement("div");
  loader.className = "typing-bubble";
  loader.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  container.appendChild(loader);
  container.scrollTop = container.scrollHeight;
  return loader;
}

/**
 * POST request to OpenRouter completion endpoint
 */
async function queryOpenRouter(userMessage) {
  // Resolve key from local storage dynamically
  if (!CHATBOT_CONFIG.apiKey) {
    CHATBOT_CONFIG.apiKey = localStorage.getItem("sterling_chatbot_api_key") || "";
  }
  
  if (!CHATBOT_CONFIG.apiKey) {
    throw new Error("API_KEY_REQUIRED");
  }

  // Push user prompt into history
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHATBOT_CONFIG.apiKey}`,
      "HTTP-Referer": window.location.origin, // Site URL for OpenRouter ranking
      "X-Title": "Sterling Technology Commercial Assistant"
    },
    body: JSON.stringify({
      model: CHATBOT_CONFIG.model,
      messages: conversationHistory
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter completed with status ${response.status}`);
  }

  const result = await response.json();
  const botReply = result.choices[0].message.content;

  // Push bot reply into history
  conversationHistory.push({
    role: "assistant",
    content: botReply
  });

  // Limit conversation history to prevent huge payload bounds
  if (conversationHistory.length > 15) {
    // Keep system prompt (index 0) and slide the rest
    conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-10)];
  }

  return botReply;
}
