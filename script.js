// create board
const container = document.querySelector('.container');
function createBoard(length) {
  let markup = '';
  for (let i = 0; i < Math.pow(length, 2); i++) {
    markup += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
  }

  container.insertAdjacentHTML('beforeend', markup.trim());
  const start = document.createElement('div');
  const end = document.createElement('div');
  // const ball1 = document.createElement('div');
  const ball2 = document.createElement('div');
  const ball3 = document.createElement('div');
  // ball1.classList.add('ball');
  ball2.classList.add('ball');
  ball3.classList.add('ball');
  start.classList.add('start-field');
  //   end.classList.add('end-field');
  document.getElementById('12').appendChild(start);
  //   document.getElementById('4').appendChild(end);
  //   ----------------------------------------- //
  // document.getElementById('3').appendChild(ball1);
  document.getElementById('6').appendChild(ball2);
  document.getElementById('9').appendChild(ball3);
}

createBoard(10);

function div(divId) {
  return document.getElementById(`${divId}`).innerHTML !== '';
}

function makeList() {
  const list = {};
  const gameFields = Array.from(document.querySelectorAll('.field'));
  gameFields.forEach(field => {
    const id = Number(field.getAttribute('id'));

    const up = id < 5 || id - 5 < 0 || div(id - 5) ? false : id - 5;
    const down = id >= 20 || id + 5 > 24 || div(id + 5) ? false : id + 5;
    const left = id % 5 === 0 || id - 1 < 0 || div(id - 1) ? false : id - 1;
    const right = id % 5 === 4 || id + 1 > 24 || div(id + 1) ? false : id + 1;

    const values = [up, down, left, right].filter(el => el !== false);
    list[id] = values;
  });

  // console.log(list);
  return list;
}

const isPath = function (start, end) {
  const parentArray = [];
  const adjacencyList = makeList();
  const queue = [start];
  const visited = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    parentArray.push({ parent: current, neighbor: [] });
    document.getElementById(current).classList.add('visited-field');
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) {
      const retrace = arr => {
        const shortestPath = [end];
        while (!shortestPath.includes(start)) {
          const previous = shortestPath[shortestPath.length - 1];
          for (let i = 0; i < arr.length; i++) {
            if (
              arr[i].neighbor.includes(previous) &&
              arr[i].parent !== previous
            ) {
              shortestPath.push(arr[i].parent);
              break;
            }
          }
        }
        console.log('Shortest path:', shortestPath);
      };
      retrace(parentArray);
      document.getElementById(end).classList.add('goal');
      return true;
    }

    // for(let i = 0; i < adjacencyList[current].length; i++){

    // }

    for (let neighbor of adjacencyList[current]) {
      parentArray[parentArray.length - 1].neighbor.push(neighbor);
      queue.push(neighbor);
      // document.getElementById(neighbor).classList.add('visited-field');
    }
  }
  return false;
};

// console.log(isPath(20, 3));

function removeActiveClass() {
  const fields = Array.from(document.querySelectorAll('.field'));
  return fields.forEach(field => field.classList.remove('active'));
}

function addActiveClass(fieldId) {
  document.getElementById(fieldId).classList.add('active');
}

container.addEventListener('click', e => {
  if (e.target.closest('.field').innerHTML !== '') return;
  removeActiveClass();
  const id = e.target.getAttribute('id');
  addActiveClass(id);
  console.log(id);
  console.log(isPath(12, Number(id)));
});
// //   // Delay functionality for ball movement
//   const interval = setInterval(() => {
//     let i = 0;
//     document.getElementById(`${array[i]}`).innerHTML = '';
//     document.getElementById(`${array[i + 1]}`).appendChild(ball);
//     document.getElementById(`${array[i]}`).classList.remove('path');
//     i++;

//     array = array.slice(1);

//     if (i === array.length) {
//       removePathClass();
//       removeActiveClass();
//       clearInterval(interval);
//     }
//   }, 150);
// const interval = setInterval(() => {
//   let i = 0;
//   let max = adjacencyList[current].length;

//   parentArray[parentArray.length - 1].neighbor.push(
//     adjacencyList[current][i]
//   );
//   queue.push(adjacencyList[current][i]);
//   document
//     .getElementById(adjacencyList[current][i])
//     .classList.add('visited-field');

//   i++;

//   if (i === max) clearInterval(interval);
// }, 1000);
