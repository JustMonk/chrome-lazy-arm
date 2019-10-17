//init for tabs
var instance = M.Tabs.init(document.querySelector('.tabs'), {});

//проверяем toggle при открытии
window.onload = function () {
   console.log('onload')
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { checkNight: '1' }, response => {
         console.log(response);
         if (response.isNight == 'false') {
            document.getElementById('night').removeAttribute('checked');
         }
         if (response.isNight == 'true') {
            document.getElementById('night').setAttribute('checked', 'true');
         } 
         //document.getElementById('night').checked = true;
      });
   });
}

document.addEventListener('click', function (e) {
   if (e.target.tagName != 'A') return;
   e.preventDefault();

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