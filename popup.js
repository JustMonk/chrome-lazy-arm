//init for tabs
var instance = M.Tabs.init(document.querySelector('.tabs'), {});

//проверяем toggle при открытии
window.onload = function () {
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { checkNight: '1' }, response => {
         if (response === undefined) return false;
         if (!response.isNight) {
            document.getElementById('night').removeAttribute('checked');
         } else {
            document.getElementById('night').setAttribute('checked', 'true');
         }

         void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
      });
   });

   //получаем параметры фона
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { getBackgroundProps: '1' }, response => {
         if (response === undefined) return false;
         if (response.backgroundProps) {
            document.getElementById('image_url').value = response.backgroundProps.url;
            document.getElementById('fade_table').checked = response.backgroundProps.fade ? true : false;
            document.getElementById('fixed_bg').checked = response.backgroundProps.isFixed ? true : false;
         }

         void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
      });
   });

   //check aditional settings (пока только одна)
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { checkRetailStats: '1' }, response => {
         if (response === undefined) return false;
         if (response.checkRetailStats) {
            if (!response.checkRetailStats) {
               document.getElementById('retail_stats').removeAttribute('checked');
            } else {
               document.getElementById('retail_stats').setAttribute('checked', 'true');
            }
         }

         void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
      });
   });

}

document.addEventListener('click', function (e) {
   if (e.target.tagName != 'A') return;
   if (e.target.href != 'https://github.com/JustMonk/chrome-lazy-arm') e.preventDefault();

   if (e.target.className == 'theme_color') {
      //передаем message в contentScript
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: e.target.id }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

   if (e.target.className == 'font_color') {
      let requestObj = {};

      requestObj[e.target.getAttribute('data-target')] = e.target.getAttribute('data-color');

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { font: requestObj }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

   if (e.target.id == 'confirm_user_color') {
      let colorInput = document.getElementById('user_color_picker');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { bg: colorInput.value }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

   if (e.target.id == 'save_background') {
      //текущий введенный URL (валидаций никаких нет)
      let requestObj = { background: `background: ${document.getElementById('fixed_bg').checked ? 'fixed' : ''} center/cover url('${document.getElementById('image_url').value}') !important`, fade: document.getElementById('fade_table').checked ? true : false };

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { background: requestObj, isImage: true }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

   if (e.target.id == 'clear_background') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { isImage: false }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
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
         chrome.tabs.sendMessage(tabs[0].id, { night: document.getElementById('night').checked }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

   if (e.target.id == 'retail_stats') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { showRetailStats: document.getElementById('retail_stats').checked }, response => {
            void chrome.runtime.lastError; //fix callback connection stackoverflow/869327
         });
      });
   }

});