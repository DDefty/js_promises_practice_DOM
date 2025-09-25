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
  const onClick = (e) => {
    if (e.button === 0) {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', onClick);
      resolve('First promise was resolved');
    }
  };

  document.addEventListener('mousedown', onClick);

  const timeoutId = setTimeout(() => {
    document.removeEventListener('mousedown', onClick);
    reject(new Error('First promise was rejected'));
  }, 3000);
});

const secondPromise = new Promise((resolve) => {
  const onMouseDown = (e) => {
    if (e.button === 0 || e.button === 2) {
      document.removeEventListener('mousedown', onMouseDown);
      resolve('Second promise was resolved');
    }
  };

  document.addEventListener('mousedown', onMouseDown);
});

const thirdPromise = new Promise((resolve) => {
  let leftSeen = false;
  let rightSeen = false;
  let done = false;

  const onMouseDown = (e) => {
    if (done) {
      return;
    }

    if (e.button === 0) {
      leftSeen = true;
    }

    if (e.button === 2) {
      rightSeen = true;
    }

    if (leftSeen && rightSeen) {
      done = true;
      document.removeEventListener('mousedown', onMouseDown);
      resolve('Third promise was resolved');
    }
  };

  document.addEventListener('mousedown', onMouseDown);
});

firstPromise.then(showMessage).catch(showError);
secondPromise.then(showMessage).catch(showError);
thirdPromise.then(showMessage).catch(showError);
