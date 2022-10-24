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
  const ball1 = document.createElement('div');
  const ball2 = document.createElement('div');
  const ball3 = document.createElement('div');
  ball1.classList.add('ball');
  ball2.classList.add('ball');
  ball3.classList.add('ball');
  start.classList.add('start-field');
  //   end.classList.add('end-field');
  document.getElementById('20').appendChild(start);
  //   document.getElementById('4').appendChild(end);
  //   ----------------------------------------- //
  document.getElementById('3').appendChild(ball1);
  document.getElementById('8').appendChild(ball2);
  document.getElementById('9').appendChild(ball3);
}

createBoard(5);

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

  console.log(list);
  return list;
}

// makeList();
// console.log();
// const hasPath = (graph, src, dst) => {
//    const queue = [src];

//    while (queue.length) {
//      const current = queue.shift();
//      if (current === dst) return true;

//      for (let neighbor of graph[current]) {
//        queue.push(neighbor);
//      }
//    }

//    return false;
//  };
const isPath = function (start, end) {
  const adjacencyList = makeList();
  const queue = [start];
  const visited = new Set();
  const parentArray = [];
  while (queue.length > 0) {
    const current = queue.shift();
    // document.getElementById(current).classList.add('visited-field');
    if (visited.has(current)) continue;
    visited.add(current);
    console.log(visited);
    if (current === end) {
      document.getElementById(current).classList.add('goal');
      return true;
    }

    // for (let i = 0; i < adjacencyList[current].length; i++) {
    //   setTimeout(function timer() {
    //     console.log(
    //       'parent: ',
    //       current,
    //       'neighbor: ',
    //       adjacencyList[current][i]
    //     );
    //     queue.push(adjacencyList[current][i]);
    //     parentArray.push([
    //       `Parent: ${current} - Neighbors:${adjacencyList[current][i]}`,
    //     ]);
    //     document
    //       .getElementById(adjacencyList[current][i])
    //       .classList.add('visited-field');
    //   }, i * 1000);
    // }
    for (let neighbor of adjacencyList[current]) {
      console.log('parent: ', current, 'neighbor: ', neighbor);
      queue.push(neighbor);
      parentArray.push([`Parent: ${current} - Neighbors:${neighbor}`]);
      document.getElementById(neighbor).classList.add('visited-field');
    }
  }
  console.log(parentArray);
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
  console.log(isPath(20, Number(id)));
});
