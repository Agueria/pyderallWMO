// URL Constants
const WHATSAPP_URL = "https://web.whatsapp.com/";

// Information about the currently active tab
const QUERY_INFO = { active: true, currentWindow: true };

// Listener for Chrome commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "copy-title") return;

  const tabs = await chrome.tabs.query(QUERY_INFO);
  if (!tabs.length) {
    console.error("Failed to copy title: no tabs found");
    return;
  }

  const { id: activeTabId, url: activeTabUrl } = tabs[0];

  if (activeTabUrl.startsWith(WHATSAPP_URL)) {
    handleWhatsAppTab(activeTabId);
  }
});

async function handleWhatsAppTab(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: handleWhatsAppScript,
    });
  } catch (error) {
    console.error(error);
  }
}

function handleWhatsAppScript() {
  const observer = new MutationObserver(() => {
    let titleElement = document.querySelector('span[data-testid="conversation-info-header-chat-title"]');
    
    if (titleElement) {
      observer.disconnect();  // Stop the observer once the titleElement is found
      
      let title = titleElement.textContent;
      
      if (!title.includes("+")) {
      } else {
        title = title.replace(/\+/g, "");
        title = title.replace(/\s/g, "");
        chrome.storage.local.set({ title }, () => {
          chrome.runtime.sendMessage({ action: "switchToOpenTabOrCreateNewOne" });
        });
      }
    }
  });
  
  observer.observe(document, { childList: true, subtree: true });
}
