
var axisScale = "sqrt";

var dataset = [];
var algos = [];
var algoColors = [];
var coords = [];

function runSandbox(){
  dataset = [];
  algos = [];
  algoColors = [];
  setAlgos();
  for(var i = 0; i < 5; i++){

    var argsArray = [];
    var argsTypeArray =[document.getElementById("sandbox-arg-type-one").value,
                        document.getElementById("sandbox-arg-type-two").value,
                        document.getElementById("sandbox-arg-type-three").value
                        ];
    var inputLength;
    var missingInput = false;

    for(var m = 0; m < 3; m++){
        if (argsTypeArray[m] === "random"){
          inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value;
          if (!(inputLength > 0)){missingInput = true;}
          argsArray.push(createRandArray(inputLength));
        } else if (argsTypeArray[m]  === "sorted"){
          inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value;
          if (!(inputLength > 0)){missingInput = true;}
          argsArray.push(createSortedArray(inputLength));
        } else if (argsTypeArray[m] === "other"){
          argsArray.push(document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value);
          if (arg1 == ""){missingInput = true;}
        }
      }

    if (!missingInput){
      for(var j = 0; j < algos.length; j++){
        var color = algoColors[j];
        timeTracker(algos[j], argsArray[0], argsArray[1], argsArray[2], color);
      }
    }

  }
  draw();
}

function setAlgos(){
  var input = [document.getElementById(`sandbox-algo-one`).value,
                document.getElementById(`sandbox-algo-two`).value];

  var colors = [document.getElementById(`sandbox-algo-one-color`).value,
                document.getElementById(`sandbox-algo-two-color`).value];

  input.forEach(function(algo ,idx) {
    algos.push(algo);
    algoColors.push(colors[idx]);
  });
}


function createRandArray(n){
  var array= [];
  for(var i = 0; i < n; i++){
    array[i] = Math.floor(Math.random() * 1000000);
  }
  return array;
}

function createSortedArray(n){
  var array= [];
  for(var i = 0; i < n; i++){
    array[i] = n;
  }
  return array;
}


var inputArgCount;
var functionArgCount;

function timeTracker(algo, arg1, arg2, arg3, color){
  if(algo.includes("function")){
    var startTime = new Date();
    // console.log(arg1);
    // console.log(arg2);
    // console.log(arg3);
    inputArgCount = 0;
    [arg1, arg2, arg3].forEach(function(arg){
      if(typeof arg !== "undefined")
      inputArgCount += 1;
    });
    // console.log("input argument count");
    // console.log(inputArgCount);
    algo = parseAlgo(algo);
    // console.log(algo);

    console.log("algorithm:");
    console.log(algo);
    console.log("arg1:");
    console.log(arg1);

    if(arg1 instanceof Array){
      arg1 = arg1.slice();
    }
    if(arg2 instanceof Array){
      arg2 = arg2.slice();
    }
    if(arg3 instanceof Array){
      arg3 = arg3.slice();
    }

    var result = algo(arg1, arg2, arg3);
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    console.log("time elapsed");
    console.log(timeElapsed); //this is in ms
    dataset.push([arg1.length, timeElapsed, algo.name, color]);
    console.log("result");
    console.log(result);
  }
}

function parseAlgo(algo){
  var args = algo.substring(algo.indexOf("(") + 1, algo.indexOf(")"));
  var argsArray = args.split(", ");
  var functionName = algo.substring(algo.indexOf("n ") + 2, algo.indexOf("("));
  console.log(functionName);
  functionArgCount = argsArray.length;
  if (argsArray[0] == ""){
    functionArgCount = 0;
  }

  if(functionArgCount !== inputArgCount){
    console.log(`Error: your function takes ${functionArgCount} arguments
      but you have inputed ${inputArgCount} arguments.`);
  }
  // console.log(argsArray);
  // console.log("functionArgCount:");
  // console.log(functionArgCount);
  // console.log(argsArray);

  var cnt = 0;
  var lastSemi;
  while (cnt < algo.length){
    if(algo[cnt] === "}"){
      lastSemi = cnt;
    }
    cnt += 1;
  }

  var body = algo.substring(algo.indexOf("{") + 1, lastSemi);
  var exp = new RegExp(functionName, 'gi');
  // console.log(exp);
  body = body.replace(exp, 'arguments.callee');
  // console.log(body);


  if (argsArray[0] === ""){
    return new Function(body);
  } else if (argsArray.length === 1){
    return new Function(argsArray[0], body);
  } else if (argsArray.length === 2){
    return new Function(argsArray[0], argsArray[1], body);
  } else if (argsArray.length === 3){
    return new Function(argsArray[0], argsArray[1], argsArray[2], body);
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

  if(document.getElementById("sandbox-axis-scale").value === "sqrt"){
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

function changeToSorting(){
  window.location.href = "index.html";
}
