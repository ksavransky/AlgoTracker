var axisScale = "sqrt";

var dataset = [];
var algos = [];
var algoColors = [];

function runSort(){
  dataset = [];
  algos = [];
  algoColors = [];
  setAlgos();
  for(var i = 0; i < 5; i++){
    var inputLength = document.getElementById(`sort-input-${i + 1}`).value;
    // console.log(inputLength);
    var inputArray = createRandArray(inputLength);
    for(var j = 0; j < algos.length; j++){
      var color = algoColors[j];
      timeTracker(algos[j], inputArray.slice(), color);
    }
  }
  draw();
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


function timeTracker(algo, arg, color){
  if(algo.name !== "none"){
    var startTime = new Date();
    var result = algo(arg);
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    // console.log(algo);
    // console.log(timeElapsed); //this is in ms
    dataset.push([arg.length, timeElapsed, algo.name, color]);
    // console.log(result);
  }
}

// drawing

function draw(){

  d3.select("div.sort-graph").html("");

  if(document.getElementById("axis-scale").value === "sqrt"){
    axisScale = "sqrt";
  } else {
    axisScale = "linear";
  }

  var w = 700;
  var h = 700;
  var padding = 50;

  var svg = d3.select("div.sort-graph")
              .append("svg")
              .attr("width", w)
              .attr("height", h);


  var xScale = d3.scale.linear()
  if(axisScale === "sqrt"){
    xScale = d3.scale.sqrt()
  }
  xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })])
         .range([padding, w - padding * 2]);

  var yScale = d3.scale.linear()
  if(axisScale === "sqrt"){
    yScale = d3.scale.sqrt()
  }
  yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })])
        .range([h - padding, padding]);

  var rScale = d3.scale.linear()
  if(axisScale === "sqrt"){
    rScale = d3.scale.sqrt()
  }
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
