//init
colorFromCookie();
//global
var nightStyle;

function colorFromCookie() {
   let currentCookie = document.cookie.split(';');
   currentCookie.forEach(val => {

      if (val.split('=')[0].trim() == 'bg') {
         if (!checkNight()) {
            document.querySelectorAll('header').forEach(header => {
               //добавляем новый inline-стиль, чтобы избежать асинхронщины
               let style = document.createElement('style');
               style.innerHTML = `header { background: ${val.split('=')[1]} !important; }`;
               document.getElementsByTagName('head')[0].appendChild(style);
            })
         }
      }

      if (val.split('=')[0].trim() == 'font') {
         if (!checkNight()) {
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
               
               main> :last-child> :last-child> :first-child> :first-child > :first-child {
                  background: #2c2c2c !important;
               }

               main> :last-child> :last-child> :first-child> :first-child > :first-child p, span {
                  color: #fff !important;
               }
               
               main> :last-child> :last-child> :first-child> :last-child {
                  background: #383838 !important;
               }
               
               main> :last-child> :last-child> :first-child> :last-child > :first-child > :first-child {
                  background: #2c2c2c !important;
               }
               
               /*side*/
               main> :first-child> :first-child a, span, p, svg {
                  color: #fff !important;
               }

               div[role="dialog"] span, div[role="dialog"] svg {
                  color: black !important;
               }

               input {
                  color: #fff !important;
               }

               div[role="document"] span, div[role="document"] svg{
                  color: black !important;
               }
               `;
               document.getElementsByTagName('head')[0].appendChild(nightStyle);
            })
         } else {
            nightStyle.remove();
         }
      }

      if (val.split('=')[0].trim() == 'backgroundImage') {
         let style = document.createElement('style');
         if (!checkNight() && checkBackground()) {
            style.innerHTML = `.layout { ${val.slice(val.indexOf('=')+1)} }`;
            document.getElementsByTagName('head')[0].appendChild(style);
         } else {
            style.innerHTML = `.layout { background: inherit !important }`;
            document.getElementsByTagName('head')[0].appendChild(style);
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
   return (result == 'true') ? true : false;
}

function checkBackground() {
   let currentCookie = document.cookie.split(';');
   let result;
   currentCookie.forEach(val => {
      
      if (val.split('=')[0].trim() == 'isImage') {
         result = val.split('=')[1];
      }
   })
   return (result == 'true') ? true : false;
}

function getBackgroundURL() {
   let currentCookie = document.cookie.split(';');
   let result;
   currentCookie.forEach(val => {
      if (val.split('=')[0].trim() == 'backgroundImage') {
         result = val.slice(val.indexOf('=')+1);
         result = result.split(`'`)[1];
      }
   })
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
   if (request.isImage !== undefined) {
      if (request.isImage == true) {
         document.cookie = `backgroundImage=${request.backgroundImage}; expires=${new Date('2040')}`;
         document.cookie = `isImage=${request.isImage}; expires=${new Date('2040')}`;
         colorFromCookie();
      } else {
         document.cookie = `isImage=false; expires=${new Date('2040')}`;
         colorFromCookie();
      }
   }
   if (request.getBackgroundURL) {
      sendResponse({ backgroundURL: getBackgroundURL() });
   }

});


function queuePlace() {
   //УСЛОВИЕ == ЮЗЕР В САМ В ОЖИДАНИИ!!
   //fxd в таймере

   let queueTiming = [];
   let userTiming = 0;

   let user = `${document.querySelector('[aria-label="Профиль"] img').alt.split(' ')[0]} ${document.querySelector('[aria-label="Профиль"] img').alt.split(' ')[1]}`;
   
   //за 1 проход
   Array.from(document.querySelector('table').rows).forEach(val => {
      if (val.cells[val.cells.length-2].firstChild.innerHTML == 'ожидание') {
         if (val.cells[0].innerHTML == user) userTiming = +val.cells[val.cells.length-1].innerHTML.split(':').join('');
         else +queueTiming.push(val.cells[val.cells.length-1].innerHTML.split(':').join(''));
      }
   });
   
   return queueTiming.filter(val => val > userTiming).length;
}

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

//в очереди на звонок
let wait = document.createElement('div');
wait.id = 'wait-wrapper';
wait.innerHTML = 'В очереди: ';
infoWrapper.insertAdjacentElement('beforeend', wait);

setInterval(() => {
   let tds = document.querySelectorAll('main td span');
   let queueSpans = document.querySelectorAll('main > :last-child > :last-child > :first-child span');

   let counter = 0;

   //свободных
   tds.forEach(val => {
      if (val.innerHTML == 'ожидание') counter++;
   })
   lazyCounter.innerHTML = counter;

   //в очереди (просто берется из готового счетчика 7-0-1 <--)
   queueSpans.forEach(val => {
      if (val.title == 'Вызов в очередях') queueCounter.innerHTML = val.innerHTML;
   })

   //место в очереди
   //приоритет на звонок
   if (document.querySelector('main > :last-child > :last-child > :first-child > :first-child > :first-child > :nth-child(2) > span').innerHTML.split(' ')[0].trim().toLowerCase() == 'ожидание') {
      wait.innerHTML = `В очереди на звонок: ${queuePlace()}`
   } else {
      wait.innerHTML = '';
   }
   

}, 1000)

