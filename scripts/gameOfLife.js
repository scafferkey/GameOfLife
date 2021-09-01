
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = 480);//window.innerWidth
const height = (canvas.height = 480);
const pixel_size = 10;
const chunks = 480/pixel_size;
const xOffset = 240;
const yOffset = 240;


function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
function match(element,list) {
  for (let i = 0; i < list.length; i++) {
    if(element[0] == list[i][0] 
      && element[1] == list[i][1]
      && element.length == list[i].length) {
      return true
    }
  }
  return false
}


function getNeighbors(coord, list) {
  let x= coord[0];
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
    if (match(neighborList[i],list)) {
      
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
        if (!(match(coord,checkList))) {
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
  for(let i = 0; i < liveList.length; i++) {
    
    ctx.beginPath();
    ctx.rect(liveList[i][0]*pixel_size +xOffset, liveList[i][1]*pixel_size +yOffset, pixel_size-1, pixel_size-1);
    ctx.fillStyle = "#EEEEEE";
    ctx.fill();
    ctx.closePath();
  }
}

function update(eligibleList,liveList) {
  let newLiveList = [];
  for(let i = 0; i < eligibleList.length; i++) {
    let current = eligibleList[i];
    let count = getNeighbors(current,liveList);
    //console.log(current,":",count);
    if(!(match(current,liveList))) { //not currently live
      if(count == 3) { //becomes live only with three neighbors
        newLiveList.push(current);
      }
    } else {
      if(count == 2 || count == 3) { //needs 2 or three neighbors to survive
        newLiveList.push(current);
      }
    }
    
  }
  return newLiveList;
}

let startState = [[0,0],[0,1],[1,0],[1,1],[0,2]]
let diehard = [[0,1],[1,1],[1,0],[5,0],[6,0],[7,0],[6,2],]
let rpent = [[0,1],[1,0],[1,1],[1,2],[2,2]]
//basic loop:
function step(newState) {
  let currentState = newState;
  drawCells(currentState)
  //console.log(currentState)
  let eligibleList = getEligible(currentState);
  //console.log("eligibe List: ",eligibleList)
  let nextState = update(eligibleList,currentState);
  //console.log("Next state: ",nextState)
  
  state = nextState;
} 
function tick(){
  step(state);
}
var nIntervId = setInterval(tick, 100)
let steps = 0;
var state = rpent;

//drawCells(rpent)
for(let i = 0; i < 0; i++) {
  state = step(state);
  steps ++;
  
  console.log("step:",steps,":",state.length)
}
//for(let i = 0; i < 10; i++) {
//let next = step(startState)
//console.log("start",startState,"next",next)
//console.log("next Length",next.length)

//get start state
//get eligible squares
//run an update
//push state to a history?

//console.log(getEligible([[2, 2],[2,3]])); 
//console.log("Neightbor count:",getNeighbors([0,0],startState));
//console.log("fish in barrel",match([0,0],[[0,0]]))
//console.log("strict",[0,0]===[0,0]);
