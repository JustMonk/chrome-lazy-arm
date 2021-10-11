function queuePlace() {
   let queueTiming = [];
   let userTiming = 0;

   let user = document.querySelector('main > :last-child > :last-child > :first-child > :first-child > :first-child > :nth-child(1) span').textContent.split(/\(([^()]*)\)$/)[0].trim();

   Array.from(document.querySelector('table').rows).forEach(val => {
      if (val.cells[val.cells.length - 2].firstChild.innerHTML == 'ожидание') {
         if (val.cells[0].innerHTML.trim() == user) userTiming = +val.cells[val.cells.length - 1].innerHTML.split(':').join('');
         else +queueTiming.push(val.cells[val.cells.length - 1].innerHTML.split(':').join(''));
      }
   });

   return queueTiming.filter(val => val > userTiming).length + 1;
}

function createStatsNode() {
   let checkWrapper = document.getElementById('info-wrapper');
   if (checkWrapper) return;

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
}

function removeStatsNode() {
   let wrapper = document.getElementById('info-wrapper');
   if (wrapper) wrapper.remove();
}

setInterval(() => {
   let urlMatches = ['https://kats.kontur/cc-agent/#/', 'https://kats.kontur/cc-kontur/#/', 'https://kats.kontur/cc-kontur-v2/#/'];
   if (!urlMatches.includes(document.location.href)) return removeStatsNode();
   else createStatsNode();

   let tds = document.querySelectorAll('main td span');
   let queueSpans = document.querySelectorAll('main > :last-child > :last-child > :first-child span');

   let counter = 0;

   //свободных
   tds.forEach(val => {
      if (val.innerHTML == 'ожидание') counter++;
   })
   let lazyCounter = document.getElementById('lazy-counter');
   lazyCounter.innerHTML = counter;

   //в очереди (просто берется из готового счетчика 7-0-1 <--)
   let queueCounter = document.getElementById('queue-counter');
   queueSpans.forEach(val => {
      if (val.title == 'Вызов в очередях') queueCounter.innerHTML = val.innerHTML;
   })

   //место в очереди
   //приоритет на звонок
   let wait = document.getElementById('wait-wrapper');
   let currentStatus = document.querySelector('main > :last-child > :last-child > :first-child > :first-child > :first-child > :nth-child(2) > span');
   if (currentStatus != null && currentStatus.innerHTML.split(' ')[0].trim().toLowerCase() == 'ожидание') {
      wait.innerHTML = `Входящих до звонка: ${queuePlace()} <span class="beta">beta</span>`;
      //отрисовываем бадж
      if (typeof chrome.app.isInstalled !== 'undefined') chrome.runtime.sendMessage({ type: "queueBadge", options: { queue: queuePlace() } });
   } else {
      if (currentStatus != null) wait.innerHTML = '';
      if (typeof chrome.app.isInstalled !== 'undefined') chrome.runtime.sendMessage({ type: "queueBadge", options: { queue: 0 } });
   }

}, 1000)

