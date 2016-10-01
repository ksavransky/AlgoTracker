var axisScale = "sqrt";

var dataset = [];
var algos = [];
var algoColors = [];
var coords = [];

function runSort(){
  if(sizeCheck()){
    dataset = [];
    algos = [];
    algoColors = [];
    setAlgos();
    var inputArrays = [];

    for(var i = 0; i < 5; i++){
      var inputLength = document.getElementById(`sort-input-${i + 1}`).value;
      inputArrays.push(createRandArray(inputLength));
    }

    inputArrays.sort(function(a,b){
      return b.length - a.length;
    });

    inputArrays.forEach(function(inputArray){
      for(var j = 0; j < algos.length; j++){
        var color = algoColors[j];
        timeTracker(algos[j], inputArray.slice(), color);
      }
    });

    draw();
  }
}

function sizeCheck(){
  var okToRun = true;

  var oneOver = false;
  var overOneHundredK = false;
  var overFortyK = false;
  var quadraticSortSelected = false;

  if(document.getElementById("sort-algo-one").value === "bubbleSort" ||
      document.getElementById("sort-algo-one").value === "selectionSort" ||
      document.getElementById("sort-algo-one").value === "insertionSort"){
        quadraticSortSelected = true;
        for(var i = 1; i < 6; i++){
          if (document.getElementById(`sort-input-${i}`).value > 30000){
            oneOver= true;
          }
        }
      }
  if(document.getElementById("sort-algo-two").value === "bubbleSort" ||
      document.getElementById("sort-algo-two").value === "selectionSort" ||
      document.getElementById("sort-algo-two").value === "insertionSort"){
        quadraticSortSelected = true;
        for(var i = 1; i < 6; i++){
          if (document.getElementById(`sort-input-${i}`).value > 30000){
            oneOver= true;
          }
        }
      }
  if(document.getElementById("sort-algo-three").value === "bubbleSort" ||
      document.getElementById("sort-algo-three").value === "selectionSort" ||
      document.getElementById("sort-algo-three").value === "insertionSort"){
        quadraticSortSelected = true;
        for(var i = 1; i < 6; i++){
          if (document.getElementById(`sort-input-${i}`).value > 30000){
            oneOver= true;
          }
        }
      }
  if(document.getElementById("sort-algo-four").value === "bubbleSort" ||
      document.getElementById("sort-algo-four").value === "selectionSort" ||
      document.getElementById("sort-algo-four").value === "insertionSort"){
        quadraticSortSelected = true;
        for(var i = 1; i < 6; i++){
          if (document.getElementById(`sort-input-${i}`).value > 30000){
            oneOver= true;
          }
        }
      }
  if(document.getElementById("sort-algo-five").value === "bubbleSort" ||
      document.getElementById("sort-algo-five").value === "selectionSort" ||
      document.getElementById("sort-algo-five").value === "insertionSort"){
        quadraticSortSelected = true;
        for(var i = 1; i < 6; i++){
          if (document.getElementById(`sort-input-${i}`).value > 30000){
            oneOver= true;
          }
        }
      }

  for(var i = 1; i < 6; i++){
    if (document.getElementById(`sort-input-${i}`).value > 150000){
      overOneHundredK= true;
    }
  }

  for(var i = 1; i < 6; i++){
    if (document.getElementById(`sort-input-${i}`).value > 40000){
      overFortyK= true;
    }
  }

  if(overOneHundredK){
    window.alert("You have at least one input array that has a length over 150,000. The input is too large to run because it will cause a substantial wait time for the algorithms to finish running and the new graph to appear. Please select inputs smaller than 150,000.");
    okToRun = false;
  } else if (overFortyK && quadraticSortSelected){
    window.alert("You have at least one input array that has a length over 40,000 and a sorting algorithm that runs in quadratic big-O time (i.e. Bubble Sort, Insertion Sort, or Selection Sort). Therefore, the input is too large to run because it will cause a substantial wait time for the quadratic algorithm(s) to finish running. Please select inputs smaller than 40,000 or non-quadratic-time algorithms.");
    okToRun = false;
  } else if (oneOver){
    window.alert("You have at least one input array that has a length over 30,000 and a sorting algorithm that runs in quadratic big-O time (i.e. Bubble Sort, Insertion Sort, or Selection Sort). This may cause a wait time of a few seconds for the algorithms to finish running and the new graph to appear. Please wait a few seconds while the algorithms finish running.");
  }

  return okToRun;
}

function setAlgos(){
  var input = [document.getElementById(`sort-algo-one`).value,
                document.getElementById(`sort-algo-two`).value,
                document.getElementById(`sort-algo-three`).value,
                document.getElementById(`sort-algo-four`).value,
                document.getElementById(`sort-algo-five`).value];

  var colors = [document.getElementById(`sort-algo-one-color`).value,
                document.getElementById(`sort-algo-two-color`).value,
                document.getElementById(`sort-algo-three-color`).value,
                document.getElementById(`sort-algo-four-color`).value,
                document.getElementById(`sort-algo-five-color`).value];

  input.forEach(function(str ,idx) {
    if(str === "bubbleSort"){
      algos.push(bubbleSort);
      algoColors.push(colors[idx]);
    } else if(str === "mergeSort"){
      algos.push(mergeSort);
      algoColors.push(colors[idx]);
    } else if(str === "quickSort"){
      algos.push(quickSort);
      algoColors.push(colors[idx]);
    } else if(str === "heapSort"){
      algos.push(heapSort);
      algoColors.push(colors[idx]);
    } else if(str === "selectionSort"){
      algos.push(selectionSort);
      algoColors.push(colors[idx]);
    } else if(str === "insertionSort"){
      algos.push(insertionSort);
      algoColors.push(colors[idx]);
    }
  });
}


function createRandArray(n){
  var array= [];
  for(var i = 0; i < n; i++){
    array[i] = Math.floor(Math.random() * 1000000);
  }
  return array;
}

function setLabelColor(){
  var colorLabel = event.currentTarget;
  colorLabel.style.background = colorLabel.value;
}


function timeTracker(algo, arg, color){
  if(algo.name !== "none"){
    var startTime = new Date();
    var result = algo(arg);
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    dataset.push([arg.length, timeElapsed, algo.name, color]);
  }
}


function setCoords(){
  coords = [];
  dataset.forEach(function(circle, idx){
    if(dataset[idx + algos.length]){
      if(dataset[idx][2] == dataset[idx + algos.length][2]){
        coords.push([dataset[idx][0], dataset[idx][1],
          dataset[idx + algos.length][0], dataset[idx + algos.length][1], circle[3]]);
      }
    }
  });
}
// drawing

function draw(){
  setCoords();
  d3.select("div.sort-graph").html("");

  if(document.getElementById("axis-scale").value === "sqrt"){
    axisScale = "sqrt";
  } else {
    axisScale = "linear";
  }

  var w = 650;
  var h = 550;
  var padding = 50;

  var svg = d3.select("div.sort-graph")
              .append("svg")
              .attr("width", w)
              .attr("height", h);


  var xScale = d3.scale.linear()
  var yScale = d3.scale.linear()
  var rScale = d3.scale.linear()

  if(axisScale === "sqrt"){
    xScale = d3.scale.sqrt()
    yScale = d3.scale.sqrt()
    rScale = d3.scale.sqrt()
  }
  xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })])
         .range([padding, w - padding * 2]);

  yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })])
        .range([h - padding, padding]);

  rScale.domain([0, d3.max(dataset, function(d) { return d[1]; })])
        .range([2, 5]);

  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return xScale(d[0]);
     })
     .attr("cy", function(d) {
       return yScale(d[1]);
     })
     .attr("r", 6)
     .attr("opacity", 0.75)
     .attr("fill", function(d) {
       return d[3];
     });

  svg.selectAll("line")
     .data(coords)
     .enter()
     .append("line")
     .attr("x1", function(d) {
       return xScale(d[0]);
     })
     .attr("y1", function(d) {
       return yScale(d[1]);
     })
     .attr("x2", function(d) {
       return xScale(d[2]);
     })
     .attr("y2", function(d) {
       return yScale(d[3]);
     })
     .attr("stroke-width", 1)
     .attr("stroke", function(d) {
       return d[4];
     });

  svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0," + (h - padding) + ")")
         .call(d3.svg.axis()
                     .scale(xScale)
                     .orient("bottom")
                     .ticks(6));

  var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(6);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + padding + ",0)")
     .call(yAxis);

}

runSort();

function changeToSandbox(){
  window.location.href = "sandbox.html";
}

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
       document.getElementById('sort-container').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('sort-container').style.visibility="visible";
      },1000);
  }
};
