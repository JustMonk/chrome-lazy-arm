//init
colorFromCookie();
//global
var nightStyle;

function colorFromCookie() {
   let currentCookie = document.cookie.split(';');
   currentCookie.forEach(val => {

      if (val.split('=')[0].trim() == 'bg') {
         if (checkNight() == 'false') {
            document.querySelectorAll('header').forEach(header => {
               //header.style.setProperty('background', val.split('=')[1], 'important');
               //добавляем новый inline-стиль, чтобы избежать асинхронщины
               let style = document.createElement('style');
               style.innerHTML = `header { background: ${val.split('=')[1]} !important; }`;
               document.getElementsByTagName('head')[0].appendChild(style);
            })
         }
      }

      if (val.split('=')[0].trim() == 'font') {
         if (checkNight() == 'false') {
            document.querySelectorAll('header').forEach(header => {
               let style = document.createElement('style');
               style.innerHTML = `header { color: ${val.split('=')[1]} !important; } header span { color: ${val.split('=')[1]} !important; }`;
               document.getElementsByTagName('head')[0].appendChild(style);
            })
         }
      }

      if (val.split('=')[0].trim() == 'night') {
         if (nightStyle === undefined) nightStyle = document.createElement('style');
         
         if (val.split('=')[1].trim() == 'true') {
            document.querySelectorAll('header').forEach(header => {
               nightStyle.innerHTML = `
               .layout {
                  color: #fff;
                  background: #121212 !important;
               }
               
               main> :last-child> :last-child> :first-child> :first-child {
                  background: #383838 !important;
               }
               
               table {
                  background: #383838 !important;
               }
               
               td {
                  color: #fff !important;
                  border-bottom: 1px solid rgb(115, 115, 115) !important;
               }
               
               td span {
                  color: #fff !important;
               }
               
               th {
                  color: #fff !important;
               }
               
               th > div > input {
                  color: #fff !important;
               }
               
               
               header {
                  background: #2c2c2c !important;
               }
               
               header span {
                  color: #fff !important;
               }
               
               /*main last last first first first*/
               main> :last-child> :last-child> :first-child> :first-child > :first-child {
                  background: #2c2c2c !important;
               }
               /*main last last first first first*/
               main> :last-child> :last-child> :first-child> :first-child > :first-child p, span {
                  color: #fff !important;
               }
               
               /*main last last first last*/
               main> :last-child> :last-child> :first-child> :last-child {
                  background: #383838 !important;
               }
               
               /*main last last first last first first*/
               main> :last-child> :last-child> :first-child> :last-child > :first-child > :first-child {
                  background: #2c2c2c !important;
               }
               
               /*side*/
               main> :first-child> :first-child a, span, p, svg {
                  color: #fff !important;
               }
               `;
               document.getElementsByTagName('head')[0].appendChild(nightStyle);
            })
         } else {
            nightStyle.remove();
         }
         
      }
   })
}

function checkNight() {
   let currentCookie = document.cookie.split(';');
   let result;
   currentCookie.forEach(val => {
      if (val.split('=')[0].trim() == 'night') {
         result = val.split('=')[1];
      }
   })
   if (result === undefined) result = false;
   return result;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.bg) {
      document.cookie = `bg=${request.bg}; expires=${new Date('2040')}`;
      colorFromCookie();
   }
   if (request.font) {
      document.cookie = `font=${request.font}; expires=${new Date('2040')}`;
      colorFromCookie();
   }
   if (request.checkNight) {
      sendResponse({ isNight: checkNight() });
   }
   if (request.night !== undefined) {
      document.cookie = `night=${request.night}; expires=${new Date('2040')}`;
      colorFromCookie();
   }

});


//пушим выше шапки
let targetNode = document.getElementsByTagName('main')[0].lastChild;
//внутрь флекс контейнера
let infoWrapper = document.createElement('div');
infoWrapper.id = 'info-wrapper';
targetNode.insertAdjacentElement('afterbegin', infoWrapper);

//контейнер "бездельников"
let lazy = document.createElement('div');
lazy.id = 'lazy-wrapper';
lazy.innerHTML = 'Свободно операторов: ';
let lazyCounter = document.createElement('span');
lazyCounter.id = 'lazy-counter';
lazy.appendChild(lazyCounter);
infoWrapper.insertAdjacentElement('beforeend', lazy);

//контейнер очередей
let queue = document.createElement('div');
queue.id = 'queue-wrapper';
queue.innerHTML = 'В очереди: ';
let queueCounter = document.createElement('span');
queueCounter.id = 'queue-counter';
queue.appendChild(queueCounter);
infoWrapper.insertAdjacentElement('beforeend', queue);

setInterval(() => {
   let tds = document.querySelectorAll('main td span');
   let queueSpans = document.querySelectorAll('main > :last-child > :last-child > :first-child span');

   let counter = 0;

   //свободных
   tds.forEach(val => {
      if (val.innerHTML == 'ожидание') counter++;
   })
   lazyCounter.innerHTML = counter;
   
   //в очереди
   queueSpans.forEach(val => {
      if (val.title == 'Вызов в очередях')  queueCounter.innerHTML = val.innerHTML;
   })

}, 1000)

