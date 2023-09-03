document.addEventListener("DOMContentLoaded", () => {
  // Load existing shortcuts
  chrome.storage.sync.get(['shortcuts'], (data) => {
    if (data.shortcuts) {
      populateFields(data.shortcuts);
    }
  });

  // Save shortcuts when the 'Save' button is clicked
  document.getElementById('save').addEventListener('click', saveShortcuts);
});

function populateFields(shortcuts) {
  shortcuts.forEach(({ shortcut, message }, index) => {
    document.getElementById(`shortcut${index + 1}`).value = shortcut;
    document.getElementById(`message${index + 1}`).value = message;
  });
}

function saveShortcuts() {
  const shortcuts = [];

  for (let i = 1; i <= 10; i++) {
    const shortcut = document.getElementById(`shortcut${i}`).value;
    const message = document.getElementById(`message${i}`).value;
    if (shortcut && message) {
      shortcuts.push({ shortcut, message });
    }
  }

  chrome.storage.sync.set({ shortcuts }, () => {
    window.close();
  });
}
