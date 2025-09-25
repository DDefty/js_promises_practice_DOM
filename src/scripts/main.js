'use strict';

function showMessage(text) {
  const msgDiv = document.createElement('div');

  msgDiv.setAttribute('data-qa', 'notification');
  msgDiv.classList.add('success');
  msgDiv.textContent = text;
  document.body.appendChild(msgDiv);
}

function showError(error) {
  const msgDiv = document.createElement('div');

  msgDiv.setAttribute('data-qa', 'notification');
  msgDiv.classList.add('error');
  msgDiv.textContent = error instanceof Error ? error.message : String(error);
  document.body.appendChild(msgDiv);
}

const firstPromise = new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    reject(new Error('First promise was rejected in 3 seconds if not clicked'));
  }, 3000);

  document.addEventListener(
    'click',
    () => {
      clearTimeout(timeoutId);
      resolve('First promise was resolved');
    },
    { once: true },
  );
});

const secondPromise = new Promise((resolve) => {
  const finish = () => {
    resolve('Second promise was resolved');
    document.removeEventListener('click', onLeft);
    document.removeEventListener('contextmenu', onRight);
  };

  const onLeft = () => finish();
  const onRight = () => finish();

  document.addEventListener('click', onLeft, { once: true });
  document.addEventListener('contextmenu', onRight, { once: true });
});

const leftClickPromise = new Promise((resolve) => {
  document.addEventListener('click', () => resolve(), { once: true });
});

const rightClickPromise = new Promise((resolve) => {
  document.addEventListener('contextmenu', () => resolve(), { once: true });
});

const thirdPromise = Promise.all([leftClickPromise, rightClickPromise]).then(
  () => 'Third promise was resolved',
);

firstPromise.then(showMessage).catch(showError);
secondPromise.then(showMessage).catch(showError);
thirdPromise.then(showMessage).catch(showError);
