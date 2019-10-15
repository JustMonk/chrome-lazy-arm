//init
colorFromCookie();

function colorFromCookie() {
   let currentCookie = document.cookie.split(';');
   console.log(currentCookie);
   currentCookie.forEach(val => {

      if (val.split('=')[0].trim() == 'bg') {
         document.querySelectorAll('header').forEach(header => {
            //header.style.setProperty('background', val.split('=')[1], 'important');
            //добавляем новый inline-стиль, чтобы избежать асинхронщины
            let style = document.createElement('style');
            style.innerHTML = `header { background: ${val.split('=')[1]} !important; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
         })
      }

      if (val.split('=')[0].trim() == 'font') {
         document.querySelectorAll('header').forEach(header => {
            let style = document.createElement('style');
            style.innerHTML = `header { color: ${val.split('=')[1]} !important; } header span { color: ${val.split('=')[1]} !important; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
         })
      }
   })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.bg) document.cookie = `bg=${request.bg}; expires=${new Date('2040')}`;
   if (request.font) document.cookie = `font=${request.font}; expires=${new Date('2040')}`;
   //if (request.userColor) {
   colorFromCookie();
});


//куда вставляем
let targetNode = document.getElementsByTagName('main')[0].lastChild;

//наш контейнер "бездельников"
let lazy = document.createElement('div');
lazy.id = 'lazy-wrapper'
lazy.innerHTML = 'Свободно операторов: ';

let lazyCounter = document.createElement('span');
lazyCounter.id = 'lazy-counter';

lazy.appendChild(lazyCounter);

targetNode.insertAdjacentElement('afterbegin', lazy);

setInterval(() => {
   let tds = document.querySelectorAll('main td span');
   let counter = 0;
   tds.forEach(val => {
      if (val.innerHTML == 'ожидание') {
         counter++;
         //val.style.color = '#000'
      }
      /*else if (val == val.parentElement.children[4]) {
         val.style.color = '#5f5fc4';
      }*/ //больше не нужно, уже реализовано
   })
   lazyCounter.innerHTML = counter;
}, 1000)

