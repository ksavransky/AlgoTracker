
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
    // set the three arguments to pass in
    var arg1;
    var arg1Type = document.getElementById("sandbox-arg-type-one").value;
    var arg2;
    var arg2Type = document.getElementById("sandbox-arg-type-two").value;
    var arg3;
    var arg3Type = document.getElementById("sandbox-arg-type-three").value;
    var inputLength;

    if (arg1Type === "random"){
      inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-1`).value;
      arg1 = createRandArray(inputLength);
    } else if (arg1Type === "sorted"){
     inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-1`).value;
      arg1 = createSortedArray(inputLength);
    } else if (arg1Type === "other"){
      arg1 = document.getElementById(`sandbox-input-arg-${i + 1}-1`).value;
    }

    if (arg2Type === "random"){
      inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-2`).value;
      arg2 = createRandArray(inputLength);
    } else if (arg2Type === "sorted"){
     inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-2`).value;
      arg2 = createSortedArray(inputLength);
    } else if (arg2Type === "other"){
      arg2 = document.getElementById(`sandbox-input-arg-${i + 1}-2`).value;
    }

    if (arg3Type === "random"){
      inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-3`).value;
      arg3 = createRandArray(inputLength);
    } else if (arg3Type === "sorted"){
     inputLength = document.getElementById(`sandbox-input-arg-${i + 1}-3`).value;
      arg3 = createSortedArray(inputLength);
    } else if (arg3Type === "other"){
      arg3 = document.getElementById(`sandbox-input-arg-${i + 1}-3`).value;
    }

    for(var j = 0; j < algos.length; j++){
      var color = algoColors[j];
      if(arg1 instanceof Array){
        arg1 = arg1.slice();
      }
      if(arg2 instanceof Array){
        arg2 = arg2.slice();
      }
      if(arg3 instanceof Array){
        arg3 = arg3.slice();
      }
      timeTracker(algos[j], arg1, arg2, arg3, color);
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



function timeTracker(algo, arg1, arg2, arg3, color){
  if(algo !== ""){
    var startTime = new Date();
    console.log(algo);
    console.log(parseAlgo(algo));
    algo = parseAlgo(algo);
    var result = algo(arg1, arg2, arg3);
    var endTime = new Date();
    var timeElapsed = endTime - startTime;
    // console.log(algo);
    // console.log(timeElapsed); //this is in ms
    dataset.push([1, timeElapsed, algo.name, color]);
    // console.log(result);
  }
}

function parseAlgo(algo){
  var args = algo.substring(algo.indexOf("(") + 1, algo.indexOf(")"));
  var argsArray = args.split(", ");
  console.log(argsArray);

  var cnt = 0;
  var lastSemi;
  while (cnt < algo.length){
    if(algo[cnt] === "}"){
      lastSemi = cnt;
    }
    cnt += 1;
  }

  var body = algo.substring(algo.indexOf("{") + 1, lastSemi);
  console.log(body);

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