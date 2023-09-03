function simulateEnter(inputElement) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  setTimeout(() => {
    inputElement.dispatchEvent(event);
  }, 10);  // Delay of 10 milliseconds
}

function replaceShortcutWithValue(inputValue, shortcuts) {
  for (const { shortcut, message } of shortcuts) {
    if (inputValue === shortcut) {
      return message;
    }
  }
  return inputValue;
}

function spanObserverCallback(shortcuts) {
  return (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'characterData') {
        const replacedValue = replaceShortcutWithValue(mutation.target.data, shortcuts);
        if (replacedValue !== mutation.target.data) {
          mutation.target.data = replacedValue;
          simulateEnter(mutation.target.parentNode);
        }
      }
    }
  };
}

function bodyObserverCallback(shortcuts) {
  return (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const addedNode = Array.from(mutation.addedNodes).find(node => 
          node.classList?.contains('selectable-text') && node.classList?.contains('copyable-text') && node.getAttribute('data-lexical-text') === 'true');
        if (addedNode) {
          const spanObserver = new MutationObserver(spanObserverCallback(shortcuts));
          const config = { characterData: true, subtree: true };
          spanObserver.observe(addedNode, config);
        }
      }
    }
  };
}

function init() {
  chrome.storage.sync.get(["shortcuts"], (data) => {
    if (data.shortcuts) {
      const bodyNode = document.querySelector('body');
      if (bodyNode) {
        const config = { childList: true, subtree: true };
        const bodyObserver = new MutationObserver(bodyObserverCallback(data.shortcuts));
        bodyObserver.observe(bodyNode, config);
      }
    }
  });
}

init();
