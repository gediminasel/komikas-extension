function save_options() {
  const ignoreUrls = document.getElementById('ignoreUrls').value.split('\n');

  chrome.storage.sync.set({
    ignoreUrls: ignoreUrls,
  }, function () {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () { status.textContent = ''; }, 750);
    chrome.runtime.sendMessage({ type: "OPTIONS_CHANGED" });
  });
}

function restore_options() {
  chrome.storage.sync.get({
    ignoreUrls: [],
  }, function (items) {
    document.getElementById('ignoreUrls').value = items.ignoreUrls.join('\n');
  });
}

restore_options();

document.getElementById('save').addEventListener('click', save_options);