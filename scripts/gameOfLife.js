"use strict"

window.onload = function () {
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("click",clickHandler,false)
}


class GameInstance {
  constructor(seedState, screen) {
    this.seed = seedState;
    this.history = [this.seed,]
    this.state = this.seed;
    this.pointer = 0;
    this.speed = { "value": 10, "max": 30, "min": 1 }
    this.paused = true; //change to true when not debugging!
    this.screen = screen;
  }
  static matrixToCoords(matrix){
    let output = [];
    for(let y = 0; y < matrix.length; y++){
      for(let x = 0; x < matrix[y].length; x++){
        if(matrix[y][x] == 1){
          output.push([x,y]);
        }
      }
    }
    return output
  }
  
  static match(element, list) {
    for (let i = 0; i < list.length; i++) {
      if (element[0] == list[i][0]
        && element[1] == list[i][1]
        && element.length == list[i].length) {
        return i
      }
    }
    return -1
  }
  timer() {
    this.tick()
    setTimeout(() => this.timer(), interval / focusedInstance.speed.value);
  }
  step() {
    
    function getNeighborCount(coord, list) {
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
      let count = 0;
      for (let i = 0; i < neighborList.length; i++) {
        //
        if ((GameInstance.match(neighborList[i], list)) != -1 ) {

          count += 1;
        }
      }
      return count;
    }
    function getEligible(list, xRange = 1, yRange = 1) {
      let checkList = [];
      for (let i = 0; i < list.length; i++) {
        for (let x = -1 * xRange; x <= xRange; x++) {
          for (let y = -1 * yRange; y <= yRange; y++) {
            let coord = [...list[i]];
            coord[0] += x;
            coord[1] += y;
            if (!(GameInstance.match(coord, checkList) != -1)) {
              checkList.push(coord);
            }
          }
        }
      }
      return checkList;
    }
    function getNextState(eligibleList, liveList) {
      let newLiveList = [];
      for (let i = 0; i < eligibleList.length; i++) {
        let current = eligibleList[i];
        let count = getNeighborCount(current, liveList);
        //console.log(current,":",count);
        if ((GameInstance.match(current, liveList) == -1)) { //not currently live
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
    let currentState = this.state;
    //console.log("beginning state",currentState)
    let eligibleList = getEligible(currentState);
    //console.log("eligibile",eligibleList)
    let nextState = getNextState(eligibleList, currentState);
    //console.log("updated state:",nextState)
    this.state = nextState;
    this.drawCells(this.state);
    this.history.push(this.state);
  }
  goTo(turnNumber) {
    //turnNumber = document.getElementById('turnNumber').value;
    //console.log("Goto: ",turnNumber)
    if (turnNumber < this.history.length && turnNumber >= 0) {
      this.pointer = turnNumber
      this.drawCells(this.history[this.pointer])
    } else if (turnNumber >= this.history.length) {
      this.step();
      this.pointer++;
    } else {
      //alert("Illegal jump attempted! \nPointer:",point)
    }
    updateCounters()
  }
  drawCells(drawState = null) {
    if(drawState == null){
      if(this.pointer < this.history.length - 1){
        drawState = this.history[this.pointer];
      }else{
        drawState = this.state;
      }
    }
    this.screen.fillStyle = "rgba(50, 50, 50, 1)";
    this.screen.fillRect(0, 0, width, height);
    for (let i = 0; i < drawState.length; i++) {

      this.screen.beginPath();
      this.screen.rect(drawState[i][0] * pixelSize + xOffset, drawState[i][1] * pixelSize + yOffset, pixelSize - 1, pixelSize - 1);
      this.screen.fillStyle = "#EEEEEE";
      this.screen.fill();
      this.screen.closePath();
    }
  }
  tick() {
    if (!this.paused) {
      if (this.pointer < this.history.length - 1) {
        this.drawCells(this.history[this.pointer])
      } else {
        this.step();
      }
      this.pointer++;
      //console.log(pointer)
      updateCounters();
    }
  }
  pause_resume() {
    this.paused = !this.paused;
  }
  timer() {
    this.tick()
    setTimeout(() => this.timer(), interval / focusedInstance.speed.value);
  }
  
}


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = 480);//window.innerWidth
const height = (canvas.height = 480);
let pixelSize = 10;
let xOffset = width/2;
let yOffset = height/2;
let panStep = width/20;

//let pointer = 0;
let bPentomino = GameInstance.matrixToCoords([[1,0,1],[1,0,1],[1,1,1]])
let startState = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 2]]
let diehard = [[0, 1], [1, 1], [1, 0], [5, 0], [6, 0], [7, 0], [6, 2],]
let rpent = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]]
let coordTest = [[0,0],[1,1],[-1,-1]];
let focusedInstance = new GameInstance(rpent, ctx);
focusedInstance.drawCells();

const turnsGenerated = document.getElementById('turnsGenerated')
const turnCounter = document.getElementById('pointer')
const btn = document.getElementById('pause');
btn.onclick = function () {
  //alert("Button clicked!")
  focusedInstance.pause_resume()
}
const gotoButton = document.getElementById('goto');
let turnNumberInput = document.getElementById('turnNumber').value;
gotoButton.onclick = function(){
  //alert("function called!")
  turnNumberInput = document.getElementById('turnNumber').value; //update turnnumber
  focusedInstance.goTo(turnNumberInput)
}

const interval = 1000
let speed = 10;

focusedInstance.timer()

let canvasX = canvas.getBoundingClientRect().x;
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasY = canvas.getBoundingClientRect().y;
let canvasHeight = canvas.getBoundingClientRect().height;

function isOnScreen(x,y){
  if((x > canvasX && x < canvasX + canvasWidth)
  && (y > canvasY && y < canvasY + canvasHeight)){
    return true
  }else {
    return false
  }
}

function clickHandler(event){
  if(isOnScreen(event.layerX,event.layerY)){
  let relX = event.layerX - canvasX;
  let relY = event.layerY - canvasY;
  //console.log(relX,relY)
  let gameX = Math.floor((relX - xOffset)/pixelSize);
  let gameY = Math.floor((relY - yOffset)/pixelSize);
  //console.log("Game coords:",gameX,",",gameY)
  focusedInstance.paused = true;
  {
    if(GameInstance.match([gameX,gameY],focusedInstance.state) != -1){
      //console.log("removing:",[gameX,gameY])
      let index = GameInstance.match([gameX,gameY],focusedInstance.state);
      //console.log("index:",index)
      focusedInstance.state.splice(index,1)
      focusedInstance.drawCells()
    }else{
      focusedInstance.state.push([gameX,gameY])
      focusedInstance.drawCells()
    }
  }
}
  //console.log(event)
}

function keyUpHandler(e) {
  //console.log(e.key)

  switch (e.key) {
    case "p":
    case " ":
      focusedInstance.pause_resume()
      break;
    case ",":
      focusedInstance.paused = true;
      focusedInstance.goTo(focusedInstance.pointer - 1)
      break;
    case ".":
      focusedInstance.paused = true;
      focusedInstance.goTo(focusedInstance.pointer + 1)
      break;
    case "ArrowRight":
      focusedInstance.speed.value = focusedInstance.speed.value >= focusedInstance.speed.max ? focusedInstance.speed.max : focusedInstance.speed.value + 1;
      break;
    case "ArrowLeft":
      focusedInstance.speed.value = focusedInstance.speed.value <= focusedInstance.speed.min ? focusedInstance.speed.min : focusedInstance.speed.value - 1;
      break;
    case "a":
      xOffset += panStep;
      focusedInstance.drawCells();
      break;
    case "d":
      xOffset -= panStep;
      focusedInstance.drawCells();
      break;
    case "w":
      yOffset += panStep;
      focusedInstance.drawCells();
      break;
    case "s":
      yOffset -= panStep;
      focusedInstance.drawCells();
      break;
    case "q":
      pixelSize = pixelSize <= 3? 3 : pixelSize - 1; //pixels seem to disappear below three - spacing issue?
      focusedInstance.drawCells();
      break;
    case "e":
      pixelSize += 1;
      focusedInstance.drawCells();
      break;

  }

}

function updateCounters() {
  turnCounter.textContent = focusedInstance.pointer;
  turnsGenerated.textContent = focusedInstance.history.length - 1;
}