//init
colorFromCookie();
//global
var nightStyle;
var longTimer;
setRetailStats();

function colorFromCookie() {
   //список для проверки дефолтных значений
   let defaultState = {
      bg: false,
      font: false,
      night: false,
      backgroundImage: false
   };

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
         defaultState.bg = true;
      }

      if (val.split('=')[0].trim() == 'font') {
         if (!checkNight()) {
            let fontSettings;

            try {
               fontSettings = JSON.parse(val.split('=')[1]);
            } catch (e) {
               fontSettings = { header: '#fff', side: '#000', info: '#000' } //default value
            }

            document.querySelectorAll('header').forEach(header => {
               let style = document.createElement('style');
               style.innerHTML = `
               /*head*/
               header { color: ${fontSettings.header !== undefined ? fontSettings.header : ''} !important; } header span { color: ${fontSettings.header !== undefined ? fontSettings.header : ''} !important; }
               /*side*/
               main > :first-child > :first-child * { color: ${fontSettings.side !== undefined ? fontSettings.side : ''} !important }
               /*info*/
               #info-wrapper { color: ${fontSettings.info !== undefined ? fontSettings.info : ''} !important }
               `;
               document.getElementsByTagName('head')[0].appendChild(style);
            })
         }
         defaultState.font = true;
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

               /*freeze head*/
               header { color: #fff !important; } header span { color: #fff !important; }
               /*freeze side*/
               main > :first-child > :first-child * { color: #fff !important }
               /*freeze info*/
               #info-wrapper { color: #fff !important }
               `;
               document.getElementsByTagName('head')[0].appendChild(nightStyle);
            })
         } else {
            nightStyle.remove();
         }
         defaultState.night = true;
      }

      if (val.split('=')[0].trim() == 'backgroundImage') {
         let backgroundSettings;

         try {
            backgroundSettings = JSON.parse(val.split('=')[1]);
         } catch (e) {
            backgroundSettings = { background: `background: inherit !important;`, fade: false } //default value
         }

         let style = document.createElement('style');
         if (!checkNight() && checkBackground()) {
            style.innerHTML = `
            .layout { ${backgroundSettings.background} }
            main > :last-child > :last-child > :last-child > :first-child  { background: ${backgroundSettings.fade ? "rgba(255, 255, 255, 0.80)" : "rgba(255, 255, 255, 1)"} !important; }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
         } else {
            style.innerHTML = `
            .layout { background: inherit !important }
            main > :last-child > :last-child > :last-child > :first-child  { background: rgba(255, 255, 255, 1) !important; }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
         }
         defaultState.backgroundImage = true;
      }

   });

   //set default state
   if (!defaultState.bg) {/*default css value*/};
   if (!defaultState.font) document.cookie = `font={"header":"#fff","side":"#000","info":"#000"}`;
   if (!defaultState.night) document.cookie = `night=false`;
   if (!defaultState.backgroundImage) {
      document.cookie = `backgroundImage={"background":"background:  center/cover url('') !important","fade":false}`;
      document.cookie = `isImage=false`;
   }
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

function getBackgroundProps() {
   /*backgroundProps = {
         url: '...',
         fade: '...',
         isFixed: '...'
   }*/
   let currentCookie = document.cookie.split(';');
   let result = {};

   currentCookie.forEach(val => {
      if (val.split('=')[0].trim() == 'backgroundImage') {
         try {
            let settings = JSON.parse(val.slice(val.indexOf('=') + 1));
            result = { url: val.slice(val.indexOf('=') + 1).split(`'`)[1], fade: settings.fade, isFixed: settings.background.indexOf('fixed') != -1 ? true : false }
         } catch (e) {
            result = { url: "", fade: false, isFixed: false }
         }
      }
   })

   return result;
}

function getCurrentFont() {
   let currentCookie = document.cookie.split(';');
   //fontObj = [header="", side="", info=""]
   let fontObj;
   currentCookie.forEach(val => {
      if (val.split('=')[0].trim() == 'font') {
         try {
            fontObj = JSON.parse(val.split('=')[1]);
         } catch (e) {
            fontObj = { header: "#fff", side: "#000", info: "#000" }
         }
      }
   })
   return fontObj;
}

/*отображение статистики ритейл (по большей части для дебага)*/
function getRetailStats() {
   //вовзращает true/false если статистика отображается
   let currentCookie = document.cookie.split(';');
   let result;
   currentCookie.forEach(val => {
      if (val.split('=')[0].trim() == 'showRetailStats') {
         result = val.split('=')[1];
      }
   })
   return result == 'true' ? true : false;
}
function setRetailStats() {
   clearInterval(longTimer);
   if (getRetailStats()) {
      if (!document.getElementById('stats-wrapper')) {
         let statsWrapper = document.createElement('div');
         statsWrapper.id = 'stats-wrapper';
         statsWrapper.innerHTML = 'Загрузка...'
         document.querySelector('main > :first-child > :first-child').appendChild(statsWrapper);
      }
      longTimer = setInterval(() => {
         let socket = new WebSocket("wss://kats.kontur/ws");
         socket.onmessage = function (event) {
            let respObj = JSON.parse(event.data);
            socket.close();

            //add stats
            document.getElementById('stats-wrapper').innerHTML = `
            <p>[EDI] Принято: ${respObj.queues['20555'].answered} | Потеряно: ${respObj.queues['20555'].abandoned}</p>
            <p>[Merc] Принято: ${respObj.queues['20577'].answered} | Потеряно: ${respObj.queues['20577'].abandoned}</p>
            <p>[Sverka] Принято: ${respObj.queues['20575'].answered} | Потеряно: ${respObj.queues['20575'].abandoned}</p>
            <p>[Postavki] Принято: ${respObj.queues['20569'].answered} | Потеряно: ${respObj.queues['20569'].abandoned}</p>
            <p>[Factor] Принято: ${respObj.queues['20571'].answered} | Потеряно: ${respObj.queues['20571'].abandoned}</p>
            <p style="border-top: 1px solid #cccccc; margin-top: 10px; padding-top: 5px;">Всего принято: ${respObj.queues['20555'].answered + respObj.queues['20577'].answered + respObj.queues['20575'].answered + respObj.queues['20569'].answered + respObj.queues['20571'].answered} | Потеряно: ${respObj.queues['20555'].abandoned + respObj.queues['20577'].abandoned + respObj.queues['20575'].abandoned + respObj.queues['20569'].abandoned + respObj.queues['20571'].abandoned}
            `;
         };
      }, 5000);
   } else {
      if (document.getElementById('stats-wrapper')) document.getElementById('stats-wrapper').remove();
      clearInterval(longTimer);
   }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.bg) {
      document.cookie = `bg=${request.bg}; expires=${new Date('2040')}`;
      colorFromCookie();
   }
   if (request.font) {
      let mergeFont = Object.assign(getCurrentFont(), request.font)
      document.cookie = `font=${JSON.stringify(mergeFont)}; expires=${new Date('2040')}`;
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
         document.cookie = `backgroundImage=${JSON.stringify(request.background)}; expires=${new Date('2040')}`;
         document.cookie = `isImage=${request.isImage}; expires=${new Date('2040')}`;
         colorFromCookie();
      } else {
         document.cookie = `isImage=false; expires=${new Date('2040')}`;
         colorFromCookie();
      }
   }
   if (request.getBackgroundProps) {
      sendResponse({ backgroundProps: getBackgroundProps() });
   }
   if (request.showRetailStats !== undefined) {
      if (request.showRetailStats == true) {
         document.cookie = `showRetailStats=${request.showRetailStats}; expires=${new Date('2040')}`;
      } else {
         document.cookie = `showRetailStats=false; expires=${new Date('2040')}`;
      }
      setRetailStats();
   }
   if (request.checkRetailStats) {
      sendResponse({ checkRetailStats: getRetailStats() });
   }

   return true; //fix unchecked runtime error in callback
});


function queuePlace() {
   let queueTiming = [];
   let userTiming = 0;

   let user = `${document.querySelector('[aria-label="Профиль"] img').alt.split(' ')[0]} ${document.querySelector('[aria-label="Профиль"] img').alt.split(' ')[1]}`;

   Array.from(document.querySelector('table').rows).forEach(val => {
      if (val.cells[val.cells.length - 2].firstChild.innerHTML == 'ожидание') {
         if (val.cells[0].innerHTML.trim() == user) userTiming = +val.cells[val.cells.length - 1].innerHTML.split(':').join('');
         else +queueTiming.push(val.cells[val.cells.length - 1].innerHTML.split(':').join(''));
      }
   });

   return queueTiming.filter(val => val > userTiming).length + 1;
}

//пушим выше шапки
let targetNode = document.getElementsByTagName('main')[0].lastChild;
//внутрь флекс контейнера
let infoWrapper = document.createElement('div');
infoWrapper.id = 'info-wrapper';
targetNode.insertAdjacentElement('afterbegin', infoWrapper);

//контейнер свободных
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
queueCounter.innerHTML = 'offline';
queue.appendChild(queueCounter);
infoWrapper.insertAdjacentElement('beforeend', queue);

//в очереди на звонок
let wait = document.createElement('div');
wait.id = 'wait-wrapper';
wait.innerHTML = '';
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
   let currentStatus = document.querySelector('main > :last-child > :last-child > :first-child > :first-child > :first-child > :nth-child(2) > span');
   if (currentStatus != null && currentStatus.innerHTML.split(' ')[0].trim().toLowerCase() == 'ожидание') {
      wait.innerHTML = `Входящих до звонка: ${queuePlace()} <span class="beta">beta</span>`;
      //отрисовываем бадж
      chrome.runtime.sendMessage({type: "queueBadge", options: {queue: queuePlace()}});
   } else {
      if (currentStatus != null) wait.innerHTML = '';
      chrome.runtime.sendMessage({type: "queueBadge", options: {queue: 0}});
   }

}, 1000)