//init for tabs
var instance = M.Tabs.init(document.querySelector('.tabs'), {});

//проверяем toggle при открытии
window.onload = function () {
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { checkNight: '1' }, response => {
         if (response === undefined) return;
         if (!response.isNight) {
            document.getElementById('night').removeAttribute('checked');
         } else {
            document.getElementById('night').setAttribute('checked', 'true');
         }
      });
   });


   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { getBackgroundURL: '1' }, response => {
         //if (response === undefined) return;
         if (response.backgroundURL) {
            document.getElementById('image_url').value = response.backgroundURL;
         }
      });
   });

}

document.addEventListener('click', function (e) {
   if (e.target.tagName != 'A') return;
   if (e.target.href != 'https://github.com/JustMonk/chrome-lazy-arm') e.preventDefault();

   if (e.target.className == 'theme_color') {
      //передаем message в contentScript
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: e.target.id }, response => { });
      });
   }

   if (e.target.className == 'font_color') {
      let requestObj = {};

      requestObj[e.target.getAttribute('data-target')] = e.target.getAttribute('data-color');

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { font: requestObj }, response => { });
      });
   }

   if (e.target.id == 'confirm_user_color') {
      let colorInput = document.getElementById('user_color_picker');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: colorInput.value }, response => { });
      });
   }

   if (e.target.id == 'save_background') {
      //текущий введенный URL (валидаций никаких нет)
      let requestObj = {background: `background: center/cover url('${document.getElementById('image_url').value}') !important`, fade: document.getElementById('fade_table').checked ? true : false};
      console.log(requestObj);


      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { background: requestObj, isImage: true }, response => { });
      });
   }

   if (e.target.id == 'clear_background') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { isImage: false }, response => { });
      });
   }

});

//switch
//night=[true/false]
document.addEventListener('change', function (e) {
   if (e.target.tagName != 'INPUT') return;

   if (e.target.id == 'night') {
      //checked
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { night: document.getElementById('night').checked }, response => { });
      });
   }
});