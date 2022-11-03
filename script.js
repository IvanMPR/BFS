// helper function for array shuffling
// Fisher - Yates shuffle
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const tempObject = {
  currentBall: '',
  shortestPathFields: [],
  parseClassName(str) {
    if (str === '') return null;
    const ball = str.split(' ')[0];
    return ball === 'green' ? this.greenBall : this.redBall;
  },
};

// random initial placement of start and end fields
function generateInitialRandomStartEndPositions(arr) {
  const shuffled = shuffle(arr);
  const start = shuffled[0];
  const end = shuffled[shuffled.length - 1];
  return [Number(start), Number(end)];
}
// create board and start/end fields
const container = document.querySelector('.container');
const button = document.querySelector('.generate-path');
const resetButton = document.querySelector('.reset-board');
const infoButton = document.querySelector('.info');
const body = document.querySelector('body');
// ---------------------------------------- //
function createBoard(length) {
  // board creation
  let markup = '';
  for (let i = 0; i < Math.pow(length, 2); i++) {
    markup += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
  }
  // attach board to parent element('container')
  container.insertAdjacentHTML('beforeend', markup.trim());
  // Creating and randomly placing start/end fields
  // get all board fields
  const allFields = Array.from(document.querySelectorAll('.field')).map(
    field => field.id
  );
  // pick two random positions from the board
  const positions = generateInitialRandomStartEndPositions(allFields);
  // create start ball, pass it to temp object, attach it to first random position
  const start = document.createElement('div');
  start.classList.add('green', 'ball', 'ball-start');
  start.setAttribute('draggable', true);
  tempObject.greenBall = start;
  document.getElementById(`${positions[0]}`).appendChild(start);
  // create end ball, pass it to temp object, attach it to second random position
  const end = document.createElement('div');
  end.setAttribute('draggable', true);
  end.classList.add('red', 'ball', 'ball-end');
  tempObject.redBall = end;
  document.getElementById(`${positions[1]}`).appendChild(end);
}

createBoard(10);
// helper function, returning boolean, depending if the passed divId is empty or includes the end field
function div(divId) {
  const div = document.getElementById(`${divId}`);
  return div.innerHTML === '' || div.querySelector('.red') !== null;
}
// makeList function creates adjacency list for traversing for shortest path
function makeList() {
  const list = {};
  const gameFields = Array.from(document.querySelectorAll('.field'));
  gameFields.forEach(field => {
    const id = Number(field.getAttribute('id'));

    const up = id < 10 || id - 10 < 0 || !div(id - 10) ? false : id - 10;
    const down = id >= 90 || id + 10 > 99 || !div(id + 10) ? false : id + 10;
    const left = id % 10 === 0 || id - 1 < 0 || !div(id - 1) ? false : id - 1;
    const right = id % 10 === 9 || id + 1 > 99 || !div(id + 1) ? false : id + 1;

    const values = [up, down, left, right].filter(el => el !== false);
    list[id] = values;
  });

  // console.log(list);
  return list;
}
// function is path is main BFS function for traversing the adjacency list
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
      // function retrace gets the shortest path if path is possible and the traversal is finished
      const retrace = arr => {
        tempObject.shortestPathFields.push(end);
        const shortestPath = [end];
        while (!shortestPath.includes(start)) {
          const previous = shortestPath[shortestPath.length - 1];
          for (let i = 0; i < arr.length; i++) {
            if (
              arr[i].neighbor.includes(previous) &&
              arr[i].parent !== previous
            ) {
              tempObject.shortestPathFields.push(arr[i].parent);
              shortestPath.push(arr[i].parent);
              break;
            }
          }
        }
        console.log('Shortest path:', shortestPath);
        return shortestPath;
      };
      const path = retrace(parentArray);
      // retrace(parentArray);
      setTimeout(() => {
        drawShortestPath(path);
      }, 500);
      // document.getElementById(end).classList.add('goal');
      console.log('path yes');
      return true;
    }

    for (let neighbor of adjacencyList[current]) {
      parentArray[parentArray.length - 1].neighbor.push(neighbor);
      queue.push(neighbor);
      // document.getElementById(neighbor).classList.add('visited-field');
    }
  }
  alert('It is not possible to create a path');
  return false;
};

function drawShortestPath(arr) {
  const reversed = arr.reverse();
  for (let i = 0; i < reversed.length; i++) {
    setTimeout(function colorFields() {
      document.getElementById(reversed[i]).classList.add('shortest-path');
    }, i * 100);
  }
}

function removeActiveClass() {
  const fields = Array.from(document.querySelectorAll('.field'));
  return fields.forEach(field => field.classList.remove('active'));
}

function addActiveClass(fieldId) {
  document.getElementById(fieldId).classList.add('active');
}

button.addEventListener('click', () => {
  const startFieldId = Number(
    document.querySelector('.green').closest('.field').id
  );
  const endFieldId = Number(
    document.querySelector('.red').closest('.field').id
  );

  isPath(startFieldId, endFieldId);
});
function makeWall(e) {
  // create wall element
  const wall = document.createElement('div');
  wall.classList.add('wall');
  // gard clause, if dblclick happen anywhere out of field class
  if (!e.target.classList.contains('field')) return;
  // gard clause to prevent making of double wall elements in same field
  if (e.target.classList.contains('field') && e.target.innerHTML !== '') return;
  // if field is empty, dblclick will create the wall element
  if (e.target.classList.contains('field')) e.target.append(wall);
}

function removeWall(e) {
  if (!e.target.classList.contains('wall')) return;

  const parent = e.target.closest('.field');

  const child = parent.firstChild;

  parent.removeChild(child);
}

container.addEventListener('dblclick', function (e) {
  // console.log(e.target);
  makeWall(e);
});
container.addEventListener('dblclick', function (e) {
  removeWall(e);
});

resetButton.addEventListener('click', () => {
  location.reload();
});

const startEndFields = document.querySelectorAll('.ball');
const allEmptyFields = Array.from(document.querySelectorAll('.field')).filter(
  field => field.innerHTML === ''
);
function dragStart() {
  const getClass = this.getAttribute('class');
  tempObject.currentBall = getClass;
  this.classList.add('hold');

  setTimeout(() => (this.className = 'invisible'), 100);
}

startEndFields.forEach(field => {
  field.addEventListener('dragstart', dragStart);
  field.addEventListener('dragend', dragEnd);
});
function dragEnd() {
  const currentClassName = tempObject.currentBall;
  this.className = currentClassName;
}

function dragOver(e) {
  e.preventDefault();
}
function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hovered');
}
function dragLeave(e) {
  e.preventDefault();
  this.classList.remove('hovered');
}
function dragDrop(e) {
  if (e.target.innerHTML === '') {
    this.append(tempObject.parseClassName(tempObject.currentBall));
    this.classList.remove('hovered');
  }
}

for (let field of allEmptyFields) {
  field.addEventListener('dragover', dragOver);
  field.addEventListener('dragenter', dragEnter);
  field.addEventListener('dragleave', dragLeave);
  field.addEventListener('drop', dragDrop);
}
