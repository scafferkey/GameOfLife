"use strict"

window.onload = function () {
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("click", clickHandler, false)
}


class GameInstance {
  constructor(seedState, screen, rule = standardGameRule) {
    this.seed = writeCoordString(seedState);
    this.state = new Set(this.seed);
    this.history = [this.state,]
    this.changes = this.state;
    this.pointer = 0;
    this.speed = { "value": 10, "max": 30, "min": 1 }
    this.paused = true; 
    this.screen = screen;
    this.rule = rule;
    this.data = [this.state.size,]
  }
  static matrixToCoords(matrix) {
    let output = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] == 1) {
          output.push([x, y]);
        }
      }
    }
    return output
  }

  static match(element, searchSet) {
    return searchSet.has(element)
  }

  static generateSoup(sideLength, density = 0.6) {
    density = density > 0.99 ? 0.99 : density;
    density = density < 0.01 ? 0.01 : density;
    let length = sideLength ** 2;
    let ones = Math.floor(length * density);
    let orderedArray = []
    for (let i = 0; i < length; i++) {
      i < ones ? orderedArray.push(1) : orderedArray.push(0);
    }
    shuffleArray(orderedArray)
    let output = []
    while (orderedArray.length > 0) {
      output.push(orderedArray.splice(-sideLength))
    }
    return GameInstance.matrixToCoords(output)
  }
  timer() {
    this.tick()
    setTimeout(() => this.timer(), interval / focusedInstance.speed.value);
  }
  step() {
    function getEligible(list, xRange = 1, yRange = 1) {
      // list needs to be a numeric coordinate or converted into one
      let convList = readCoordString(list)
      let checkList = new Set();

      for (let coord of convList) {
        for (let x = -1 * xRange; x <= xRange; x++) {
          for (let y = -1 * yRange; y <= yRange; y++) {
            // console.log("before",coord)
            let newX = coord[0] + x;
            let newY = coord[1] + y;
            let newCoord = makeStringCoord(newX, newY);
            // console.log("after",coord)
            // console.log("new X and Y",newX,newY)
            // console.log("new",newCoord)
            checkList.add(newCoord)
            /* if (!(GameInstance.match(coord, checkList) != -1)) {
              checkList.push(coord);
            } */
          }
        }
      }
      return checkList;
    }
    function getNeighborCount(coord, list) {
      // console.log("inputs passed to getNeighborCount",coord,list)
      let numCoord = makeNumericCoord(coord)
      let x = numCoord[0];
      let y = numCoord[1];
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
      let stringNeighborList = writeCoordString(neighborList)
      let count = 0;
      for (let i = 0; i < stringNeighborList.length; i++) {
        // console.log("getNeighborCount:",i,neighborList[i],(GameInstance.match(neighborList[i], list)))
        if ((GameInstance.match(stringNeighborList[i], list))) {

          count += 1;
        }
      }
      return count;
    }
    function difference(setA, setB) {
      let difference = new Set(setA);
      for (let element of setB) {
        difference.delete(element)
      }
      return difference
    }

    function getNextState(eligibleList, liveList, difference, rule) {
      let newLiveList = new Set();
      let changes = new Set();
      for (let current of eligibleList) {
        let count = getNeighborCount(current, liveList);
        // console.log("getNextState",current,":",count);
        if (!(GameInstance.match(current, liveList))) { //not currently live
          if (rule.born.includes(count)) { //becomes live only with three neighbors
            newLiveList.add(current);
            changes.add(current) //born cell gets added to changes
          }
        } else {
          if (rule.survive.includes(count)) { //needs 2 or three neighbors to survive
            newLiveList.add(current);
          } else {
            changes.add(current) //dying cell gets added to changes.
          }
        }


      }
      for (let element of difference) {
        newLiveList.add(element)
      }

      return [newLiveList, changes];
    }
    // at this level, all variables should be string coords
    let eligibleList = getEligible(this.changes);
    let sleepingList = difference(this.state, eligibleList)
    let [nextState, changes] = getNextState(eligibleList, this.state, sleepingList, this.rule);
    this.state = nextState;
    this.changes = changes;
    this.drawState(this.state);
    this.history.push(this.state);
    this.data.push(this.state.size)
    
  }
  goTo(turnNumber) {
    
    if (turnNumber < this.history.length && turnNumber >= 0) {
      this.pointer = turnNumber
      this.drawState(this.history[this.pointer])
    } else if (turnNumber >= this.history.length) {
      this.step();
      this.pointer++;
    } else {
      //alert("Illegal jump attempted! \nPointer:",point)
    }
    updateGraph(this.data)
    updateCounters()
  }
  drawState(targetState = null) {
    function drawCells(canvas,targetState){
      for (let cell of targetState) {
        let x = cell[0] * pixelSize + xOffset
        let y = cell[1] * pixelSize + yOffset
        if((x > -pixelSize && x < width)&&(y > -pixelSize && y < width)){
        canvas.beginPath();
        canvas.rect(x, y, pixelSize - 1, pixelSize - 1);
        canvas.fillStyle = "#EEEEEE";
        canvas.fill();
        canvas.closePath();
      }
      }
    }
    function drawPause(canvas){
      canvas.beginPath();
      canvas.rect(width/3,height/3,width/9,height/3);
      canvas.rect((5/9)*width,height/3,width/9,height/3);
      canvas.fillStyle = "rgba(220, 100, 100, 0.4)"
      canvas.fill();
      canvas.closePath();

    }
      if (targetState == null) {
      if (this.pointer < this.history.length - 1) {
        targetState = (this.history[this.pointer]);
      } else {
        targetState = this.state;
      }
    }
    targetState = readCoordString(targetState)
    this.screen.fillStyle = "rgba(50, 50, 50, 1)";
    this.screen.fillRect(0, 0, width, height);
    drawCells(this.screen,targetState);
    if(this.paused) {
      drawPause(this.screen)
    }
    if (this.pointer < this.history.length - 1){
      this.screen.lineWidth = 5;
      this.screen.strokeStyle = "rgba(220, 100, 100, 0.4)";
      this.screen.strokeRect(5, 5, width-10, height-10);

    }
  }
  tick() {

    if (!this.paused) {
      if (this.pointer < this.history.length - 1) {
        this.drawState(this.history[this.pointer])
      } else {
        this.step();
      }
      this.pointer++;
      updateGraph(this.data)
      //console.log(pointer)
      updateCounters();
    }
  }
  pause_resume() {
    this.paused = !this.paused;
    this.drawState()
  }
  timer() {
    this.tick()
    setTimeout(() => this.timer(), interval / focusedInstance.speed.value);
  }

}



const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = 500);//window.innerWidth
const height = (canvas.height = 500);
let pixelSize = 10;
let xOffset = width / 2;
let yOffset = height / 2;
let panStep = width / 20;


//starting configurations
let standardSoup = GameInstance.generateSoup(50, 0.6)
let bHeptomino = {name: "B-heptonimo", data: GameInstance.matrixToCoords([[1, 0, 1,1], [1, 1, 1, 0], [0, 1, 0, 0]])};
let diehard = {name: "diehard", data: [[0, 1], [1, 1], [1, 0], [5, 0], [6, 0], [7, 0], [6, 2],]};
let rpent = {name: "r-pentomino", data:[[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]]};
let startArray = [rpent,bHeptomino,diehard]
//rules

let standardGameRule = {name:"Standard Game of Life", born: [3], survive: [2, 3] }
let lifeWithoutDeathRule = {name:"Life without Death", born: [3], survive: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
let seedsRule = {name:"Seeds", born: [2], survive: [] }
let twoByTwoRule = {name:"Two by Two", born: [3, 6], survive: [1, 2, 5] }
let highLifeRule = {name:"High Life", born: [3, 6], survive: [2, 3] }
let mazeRule = {name:"Maze", born: [3], survive: [1, 2, 3, 4, 5] }
let mazectricRule = {name:"Mazectric", born: [3], survive: [1, 2, 3, 4] }
let replicatorRule = {name:"Replicator", born: [1, 3, 5, 7], survive: [1, 3, 5, 7] }
let ruleArray = [standardGameRule,lifeWithoutDeathRule,seedsRule,twoByTwoRule,highLifeRule,mazeRule,mazectricRule,replicatorRule]

//building up selection lists
let instanceOptionsDiv = document.getElementById('instancing');

let startingRuleSelection = document.createElement('select');
instanceOptionsDiv.append(startingRuleSelection);
for(let rule of ruleArray){
  let ruleOption = document.createElement('option')
  ruleOption.value = rule.name;
  ruleOption.innerHTML = rule.name;
  startingRuleSelection.append(ruleOption)
}
let startingConfigSelection = document.createElement('select');
instanceOptionsDiv.append(startingConfigSelection);
for(let config of startArray){
  let configOption = document.createElement('option')
  configOption.value = config.name;
  configOption.innerHTML = config.name;
  startingConfigSelection.append(configOption)
}
let linebreak = document.createElement('br')
instanceOptionsDiv.append(linebreak);
let newInstanceButton = document.createElement('button')
newInstanceButton.innerHTML='New config'
instanceOptionsDiv.append(newInstanceButton)
newInstanceButton.onclick = function() {
  console.log("Selected rule:",startingRuleSelection.options[startingRuleSelection.selectedIndex].value);
  let selectedRule = startingRuleSelection.options[startingRuleSelection.selectedIndex].value;
  let ruleObj;
  for(let rule of ruleArray){
    //console.log(`Testing! is ${rule.name} equal to ${selectedRule}? Answer: ${rule.name == selectedRule}`)
    if(rule.name == selectedRule){
      
      ruleObj = rule;
      break;
    }
  }
  //console.log("Selected configuration:",startingConfigSelection.options[startingConfigSelection.selectedIndex].value);
  let selectedConfig = startingConfigSelection.options[startingConfigSelection.selectedIndex].value;
  let configData;
  for(let configObj of startArray){
    if(configObj.name == selectedConfig){
      configData = configObj.data;
      break;
    }
  }
  console.log("rule object:",ruleObj)
  //shut down old instance for a while
  focusedInstance.paused = true;
  let newInstance = new GameInstance(configData,ctx,ruleObj);
  focusedInstance = newInstance;
  focusedInstance.drawState()
  focusedInstance.timer()
  updateGraph(focusedInstance.data)
}

let defaultInstance = new GameInstance(rpent.data, ctx, standardGameRule);
let focusedInstance = defaultInstance;
focusedInstance.drawState();


const turnsGenerated = document.getElementById('turnsGenerated')
const turnCounter = document.getElementById('pointer')
const btn = document.getElementById('pause');
btn.onclick = function () {
  focusedInstance.pause_resume()
}
const gotoButton = document.getElementById('goto');
let turnNumberInput = document.getElementById('turnNumber').value;
gotoButton.onclick = function () {
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

const graphWidth = 300;
const graphHeight = 300;
const padding = 10;
const axisPadding = 30;
const svg = d3.select(".graph")
    .append("svg")
    .attr("width",graphWidth)
    .attr("height",graphHeight)
    
svg.append("g")
    .attr("transform","translate("+ axisPadding +", 0)")

updateGraph(focusedInstance.data)

function updateGraph(dataset){
  // console.log("updateGraph being fired!")
  // console.log("dataset:",dataset)
//let dataset = focusedInstance.data  //[1,2,3,4,5,8,9,10,30,25,12]
let max = d3.max(dataset)
let yScale = d3.scaleLinear()
               .domain([0,d3.max(dataset)])
               .range([0,graphHeight - 2* padding])
let yAxisScale = d3.scaleLinear()
                  .domain([0,d3.max(dataset)])
                  .range([graphHeight - padding,padding])
let xScale = d3.scaleLinear()
                .domain([0,(dataset.length - 1)+ 1 ]) //+1 leaves room for final bar at the end
                .range([axisPadding+5,graphWidth -padding])

let yAxis = d3.axisLeft(yAxisScale)              
              .tickValues(yScale.ticks(10))
              //console.log("yScale.ticks",yScale.ticks(10)) //need to use inverse y scale to avoid problems.
              
 svg.selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("width",(xScale(1)-xScale(0))+1)//(((graphWidth-(axisPadding+2*padding))/dataset.length) +1))
    .attr("height", d => yScale(d))
    .attr("x", (d, i) =>xScale(i))//(i*(((graphWidth/dataset.length)))))
    .attr("y", d => (graphHeight - padding - yScale(d)))
    .attr("fill",(d,i)=>i == focusedInstance.pointer ? "#FFF":"#EEE") ;
 svg.select("g")
    .call(yAxis) //Deal
}


function isOnCanvas(x, y) {
  if ((x > canvasX && x < canvasX + canvasWidth)
    && (y > canvasY && y < canvasY + canvasHeight)) {
    return true
  } else {
    return false
  }
}
function getGameCoords(x, y) {
  let relX = x - canvasX;
  let relY = y - canvasY;
  //console.log(relX,relY)
  let gameX = Math.floor((relX - xOffset) / pixelSize);
  let gameY = Math.floor((relY - yOffset) / pixelSize);
  return [gameX, gameY]
}

function clickHandler(event) {
  if (isOnCanvas(event.layerX, event.layerY) && focusedInstance.pointer == focusedInstance.history.length - 1) {
    let gameCoords = makeStringCoord(...getGameCoords(event.layerX, event.layerY))
    //console.log("Game coords:",gameX,",",gameY)
    focusedInstance.paused = true;
    let index = GameInstance.match(gameCoords, focusedInstance.state);
    {
      if (index) {
        //console.log("removing:",gameCoords)
        focusedInstance.state.delete(gameCoords) //remove cell from list
        focusedInstance.changes.add(gameCoords) //hold on, this can't be right
        focusedInstance.data[focusedInstance.pointer] -= 1;
        updateGraph(focusedInstance.data);
        focusedInstance.drawState()
      } else {
        //console.log("adding:",gameCoords)
        focusedInstance.state.add(gameCoords) //add cell to list
        focusedInstance.changes.add(gameCoords)
        focusedInstance.data[focusedInstance.pointer] += 1;
        updateGraph(focusedInstance.data);
        focusedInstance.drawState()
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
      focusedInstance.drawState();
      break;
    case "d":
      xOffset -= panStep;
      focusedInstance.drawState();
      break;
    case "w":
      yOffset += panStep;
      focusedInstance.drawState();
      break;
    case "s":
      yOffset -= panStep;
      focusedInstance.drawState();
      break;
    case "q":
      pixelSize = pixelSize <= 3 ? 3 : pixelSize - 1; //pixels seem to disappear below three - spacing issue?
      focusedInstance.drawState();
      break;
    case "e":
      pixelSize += 1;
      focusedInstance.drawState();
      break;
    case "z":
      console.log(focusedInstance.pointer,focusedInstance.history.length)

  }

}

function updateCounters() {
  turnCounter.textContent = focusedInstance.pointer;
  turnsGenerated.textContent = focusedInstance.history.length - 1;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function writeCoordString(coordList) {
  let output = []
  for (let coord of coordList) {
    output.push(coord[0].toString() + ":" + coord[1].toString())
  }
  return output
}

function readCoordString(stringCoordList) {
  let output = []
  for (let stringC of stringCoordList) {
    let nums = stringC.split(":")
    output.push([parseInt(nums[0]), parseInt(nums[1])])
  }
  return output
}

function makeStringCoord(x, y) {
  return x.toString() + ":" + y.toString()
}
function makeNumericCoord(stringCoord) {
  let nums = stringCoord.split(":")
  return [parseInt(nums[0]), parseInt(nums[1])]
}