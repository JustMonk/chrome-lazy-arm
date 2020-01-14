chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type == "queueBadge") {
      if (request.options.queue > 0) {
         let red = [250, 0, 0, 230];
         let orange = [196, 128, 0, 230];
         let green = [66, 137, 39, 230];
         //отображаем бадж с очередью
         if (request.options.queue <= 3) {
            chrome.browserAction.setBadgeBackgroundColor({ color: red });
         } else if (request.options.queue > 3 && request.options.queue <= 6) {
            chrome.browserAction.setBadgeBackgroundColor({ color: orange });
         } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: green });
         }
         chrome.browserAction.setBadgeText({ text: `${request.options.queue}` });
      } else {
         //скрываем если нет необходимости
         chrome.browserAction.setBadgeBackgroundColor({ color: [0, 250, 0, 230] });
         chrome.browserAction.setBadgeText({ text: `` });
      }
   }
   sendResponse();
});