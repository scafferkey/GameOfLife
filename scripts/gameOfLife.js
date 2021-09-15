"use strict"

window.onload = function () {
  document.addEventListener("keydown", keyDownHandler, false);

}



class GameInstance {
  constructor(seedState, screen) {
    this.seed = seedState;
    this.state = this.seed;
    this.pointer = 0;
    this.speed = { "value": 10, "max": 30, "min": 1 }
    this.history = [this.seed,]
    this.paused = true; //change to true when not debugging!
    this.screen = screen;
  }
  //keeping timer out of it for now - need to bind, IIRC? sounds like trouble
  step() {
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
        if (match(neighborList[i], list)) {

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
            if (!(match(coord, checkList))) {
              checkList.push(coord);
            }
          }
        }
      }
      return checkList;
    }
    function update(eligibleList, liveList) {
      let newLiveList = [];
      for (let i = 0; i < eligibleList.length; i++) {
        let current = eligibleList[i];
        let count = getNeighborCount(current, liveList);
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
    let currentState = this.state;
    //console.log("beginning state",currentState)
    this.drawCells(currentState);
    let eligibleList = getEligible(currentState);
    //console.log("eligibile",eligibleList)
    let nextState = update(eligibleList, currentState);
    //console.log("updated state:",nextState)
    this.state = nextState;
    this.history.push(this.state);

  }
  goTo(turnNumber) {
    //turnNumber = document.getElementById('turnNumber').value;
    console.log("Going!")

    if (turnNumber < this.history.length && turnNumber >= 0) {
      console.log("Stepping back")
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
  drawCells(drawState = this.state) {
    this.screen.fillStyle = "rgba(50, 50, 50, 1)";
    this.screen.fillRect(0, 0, width, height);
    for (let i = 0; i < drawState.length; i++) {

      this.screen.beginPath();
      this.screen.rect(drawState[i][0] * pixel_size + xOffset, drawState[i][1] * pixel_size + yOffset, pixel_size - 1, pixel_size - 1);
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
}


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = 480);//window.innerWidth
const height = (canvas.height = 480);
const pixel_size = 10;
const chunks = 480 / pixel_size;
const xOffset = 240;
const yOffset = 240;


//let pointer = 0;
let startState = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 2]]
let diehard = [[0, 1], [1, 1], [1, 0], [5, 0], [6, 0], [7, 0], [6, 2],]
let rpent = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]]

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
let turnNumber = document.getElementById('turnNumber').value;
gotoButton.onclick = focusedInstance.goTo

const interval = 1000
let speed = 10;

timer()


function timer() {
  focusedInstance.tick()
  //tick();
  setTimeout(timer, interval / focusedInstance.speed.value);
}

function keyDownHandler(e) {
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

  }

}

function updateCounters() {
  turnCounter.textContent = focusedInstance.pointer;
  turnsGenerated.textContent = focusedInstance.history.length - 1;
}