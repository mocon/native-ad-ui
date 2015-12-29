chrome.browserAction.onClicked.addListener(function(tab){// listen for click on extension icon
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log('Response received');
      console.log(response);
    });
  });
});
