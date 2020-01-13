chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type == "queueBadge") {
      if (request.options.queue > 0) {
         //отображаем бадж с очередью
         chrome.browserAction.setBadgeBackgroundColor({ color: [250, 0, 0, 230] });
         chrome.browserAction.setBadgeText({ text: `${request.options.queue}` });
      } else {
         //скрываем если нет необходимости
         chrome.browserAction.setBadgeBackgroundColor({ color: [0, 250, 0, 230] });
         chrome.browserAction.setBadgeText({ text: `` });
      }
   }
   sendResponse();
});