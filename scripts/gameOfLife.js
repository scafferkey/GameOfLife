window.onload = function () {
  document.addEventListener("keydown", keyDownHandler, false);

}



const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = 480);//window.innerWidth
const height = (canvas.height = 480);
const pixel_size = 10;
const chunks = 480 / pixel_size;
const xOffset = 240;
const yOffset = 240;



function match(element, list) {
  for (let i = 0; i < list.length; i++) {
    if (element[0] == list[i][0]
      && element[1] == list[i][1]
      && element.length == list[i].length) {
      return true
    }
  }
  return false
}

function getNeighbors(coord, list) {
  let x = coord[0];
  let y = coord[1];
  let neighborList = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
  ];

  //console.log(neighborList.length);
  let count = 0;
  for (let i = 0; i < neighborList.length; i++) {
    //
    if (match(neighborList[i], list)) {

      count += 1;
    }
  }
  return count;
}

function getEligible(list) {
  let checkList = [];
  let xRange = 1; //both must be positive integers
  let yRange = 1;
  for (let i = 0; i < list.length; i++) {
    for (let x = -1 * xRange; x <= xRange; x++) {
      for (let y = -1 * yRange; y <= yRange; y++) {
        let coord = [...list[i]];
        coord[0] += x;
        coord[1] += y;
        if (!(match(coord, checkList))) {
          checkList.push(coord);
        }
      }
    }
  }

  return checkList;
}

function drawCells(liveList) {
  //ctx.clearRect(0,0,0,0)
  ctx.fillStyle = "rgba(50, 50, 50, 1)";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < liveList.length; i++) {

    ctx.beginPath();
    ctx.rect(liveList[i][0] * pixel_size + xOffset, liveList[i][1] * pixel_size + yOffset, pixel_size - 1, pixel_size - 1);
    ctx.fillStyle = "#EEEEEE";
    ctx.fill();
    ctx.closePath();
  }
}

function update(eligibleList, liveList) {
  let newLiveList = [];
  for (let i = 0; i < eligibleList.length; i++) {
    let current = eligibleList[i];
    let count = getNeighbors(current, liveList);
    //console.log(current,":",count);
    if (!(match(current, liveList))) { //not currently live
      if (count == 3) { //becomes live only with three neighbors
        newLiveList.push(current);
      }
    } else {
      if (count == 2 || count == 3) { //needs 2 or three neighbors to survive
        newLiveList.push(current);
      }
    }

  }
  return newLiveList;
}

function goTo(turnNumber) {
  //turnNumber = document.getElementById('turnNumber').value;
  point = turnNumber
  if(point < history.length && point >= 0){
    pointer = point
    drawCells(history[pointer])
  }else if(point >= history.length){
    step(state);
    pointer ++;
  } else {
    //alert("Illegal jump attempted! \nPointer:",point)
  }
  updateCounters()
}


let pointer = 0;

let startState = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 2]]
let diehard = [[0, 1], [1, 1], [1, 0], [5, 0], [6, 0], [7, 0], [6, 2],]
let rpent = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]]

function step(newState) {
  let currentState = newState;
  drawCells(currentState)
  //console.log(currentState)
  let eligibleList = getEligible(currentState);
  //console.log("eligibe List: ",eligibleList)
  let nextState = update(eligibleList, currentState);
  //console.log("Next state: ",nextState)

  state = nextState;
  history.push(state)
}
function tick() {
  if (!paused) {
    if(pointer < history.length - 1) {
      drawCells(history[pointer])
    }else {
    step(state);
    }
    pointer ++;
    //console.log(pointer)
    updateCounters();
  }
}


//let nIntervId = setInterval(tick, 100);
let interval = 1000
let speed = 10;
let minSpeed = 1;
let maxSpeed = 30;
let paused = true;
let steps = 0;
let state = diehard;
let history = [];
history.push(state);
drawCells(state);

document.addEventListener("keydown", keyDownHandler, false);

timer()
function timer(){

  tick();
  setTimeout(timer,interval/speed);
}

function keyDownHandler(e) {
  console.log(e.key)
  //console.log(e.key.toString())
  switch(e.key){
    case "p":
    case " ":
      pause_resume()
      break;
    case ",":
      paused = true;
      goTo(pointer-1)
      break;
    case ".":
      paused = true;
      goTo(pointer+1)
      break;
    case "ArrowRight":
      speed = speed >= maxSpeed ? maxSpeed : speed + 1;
      console.log("speed:",speed)
      break;
    case "ArrowLeft":
      speed = speed <= minSpeed ? minSpeed : speed - 1;
      console.log("speed:",speed)
      break;
    
  }
  
}

function pause_resume() {
  paused = !paused;
}

function updateCounters(){
  turnCounter.textContent = pointer;
  turnsGenerated.textContent = history.length -1;
}
//drawCells(rpent)

const turnsGenerated = document.getElementById('turnsGenerated')
const turnCounter = document.getElementById('pointer')
const btn = document.getElementById('pause');
btn.onclick = pause_resume
const gotoButton = document.getElementById('goto');
let turnNumber = document.getElementById('turnNumber').value;
gotoButton.onclick = goTo
