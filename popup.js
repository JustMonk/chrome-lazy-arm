//init for tabs
var instance = M.Tabs.init(document.querySelector('.tabs'), {});

document.addEventListener('click', function (e) {
   if (e.target.tagName != 'A') return;

   if (e.target.className == 'theme_color') {
      //передаем message в contentScript
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: e.target.id }, response => { });
      });
   }

   if (e.target.className == 'font_color') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { font: e.target.id }, response => { });
      });
   }

   if (e.target.id == 'confirm_user_color') {
      let colorInput = document.getElementById('user_color_picker');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: colorInput.value }, response => { });
      });
   }

});
