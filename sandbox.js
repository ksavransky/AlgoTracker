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
        } else if (argsTypeArray[m] === "num"){
          var arg = document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value;
          if (arg == ""){missingInput = true;}
          argsArray.push(parseInt(arg));
        } else if (argsTypeArray[m] === "str"){
          var arg = document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value;
          if (arg == ""){missingInput = true;}
          argsArray.push(arg);
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
    array[i] = i + 1;
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
    //
    console.log("algorithm:");
    console.log(algo);
    console.log("arg1:");
    console.log(arg1);
    console.log("arg1:");
    console.log(arg2);

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
  // console.log(functionName);
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
  var lastBracket;
  while (cnt < algo.length){
    if(algo[cnt] === "}"){
      lastBracket = cnt;
    }
    cnt += 1;
  }

  var body = algo.substring(algo.indexOf("{") + 1, lastBracket);
  var exp = new RegExp(functionName, 'gi');
  body = body.replace(exp, 'arguments.callee');

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
  var emptyAlgos = 0;
  algos.forEach(function(algo, idx){
    if(algo === ""){
      emptyAlgos += 1;
    }
  });

  var actualAlgosLength = algos.length - emptyAlgos;
  dataset.forEach(function(circle, idx){
    if(dataset[idx + actualAlgosLength]){
      if(dataset[idx][2] == dataset[idx + actualAlgosLength][2]){
        coords.push([dataset[idx][0], dataset[idx][1],
          dataset[idx + actualAlgosLength][0], dataset[idx + actualAlgosLength][1], circle[3]]);
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

function clearInputs(){
  document.getElementById(`sandbox-algo-one`).value = "";
  document.getElementById(`sandbox-algo-two`).value = "";

  document.getElementById("sandbox-arg-type-one").value = "none";
  document.getElementById("sandbox-arg-type-two").value = "none";
  document.getElementById("sandbox-arg-type-three").value = "none";

  for(var i = 0; i < 5; i++){
    for(var m = 0; m < 3; m++){
       document.getElementById(`sandbox-input-arg-${i + 1}-${m + 1}`).value = "";
    }
  }



}

function setExampleInput(){
  clearInputs();
  var exampleInput = document.getElementById("sandbox-example").value;
  if (exampleInput === "bubblequick"){
    document.getElementById(`sandbox-algo-one`).value = `function bubbleSort(array){
      var sorted = false;

      while(!sorted){
        sorted= true;
        for(var i = 0; i < array.length - 1; i++){
          if(array[i] > array[i + 1]){
            var hld = array[i];
            array[i] = array[i + 1];
            array[i + 1] = hld;
            sorted = false;
          }
        }
      }
      return array;
    }`;

    document.getElementById(`sandbox-algo-two`).value = `function quickSort(array){
      if (array.length < 2) {
        return array;
      }

        const pivot = array[0];
        const left = [];
        const right = [];

        for(var i = 1; i < array.length; i++){
          if(array[i] <= pivot){
            left.push(array[i]);
          } else {
            right.push(array[i]);
          }
        }

        return quickSort(left).concat([pivot]).concat(quickSort(right));
    }`;

    document.getElementById("sandbox-arg-type-one").value = "random";

    document.getElementById(`sandbox-input-arg-1-1`).value = "1000";
    document.getElementById(`sandbox-input-arg-2-1`).value = "2500";
    document.getElementById(`sandbox-input-arg-3-1`).value = "5000";
    document.getElementById(`sandbox-input-arg-4-1`).value = "7500";
    document.getElementById(`sandbox-input-arg-5-1`).value = "10000";

    runSandbox();
  } else if(exampleInput === "clear"){
    clearInputs();
  } else if(exampleInput === "fibs"){
    document.getElementById(`sandbox-algo-one`).value = `function fibonacciIterative(n) {
      if (n === 0) {
        return [];
      } else if (n === 1) {
        return [0];
      } else if (n === 2) {
        return [0, 1];
      }

      let fibs = [0, 1];
      while (fibs.length < n) {
        fibs.push(fibs[fibs.length - 2] + fibs[fibs.length - 1]);
      }

      return fibs;
    }`;

    document.getElementById(`sandbox-algo-two`).value = `function fibonacciRecursive(n) {
      if (n === 0) {
        return [];
      } else if (n === 1) {
        return [0];
      } else if (n === 2) {
        return [0, 1];
      } else {
        let fibs = fibonacciRecursive(n - 1);
        fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);

        return fibs;
      }
    }`;

    document.getElementById("sandbox-arg-type-one").value = "num";

    document.getElementById(`sandbox-input-arg-1-1`).value = "10";
    document.getElementById(`sandbox-input-arg-2-1`).value = "100";
    document.getElementById(`sandbox-input-arg-3-1`).value = "1000";
    document.getElementById(`sandbox-input-arg-4-1`).value = "5000";
    document.getElementById(`sandbox-input-arg-5-1`).value = "10000";

    runSandbox();

  } else if(exampleInput === "binarySearch"){
    document.getElementById(`sandbox-algo-one`).value = `function binarySearch(numbers, target) {
      if (numbers.length === 0) {
        return -1;
      }

      const probeIdx = Math.floor(numbers.length / 2);
      const probe = numbers[probeIdx];
      if (target === probe) {
        return probeIdx;
      } else if (target < probe) {
        const left = numbers.slice(0, probeIdx);
        return binarySearch(left, target);
      } else {
        const right = numbers.slice(probeIdx + 1);
        const subproblem = binarySearch(right, target);

        return subproblem === -1 ? -1 : subproblem + (probeIdx + 1);
      }
    }`;

    document.getElementById("sandbox-arg-type-one").value = "sorted";
    document.getElementById("sandbox-arg-type-two").value = "num";

    document.getElementById(`sandbox-input-arg-1-1`).value = "100000";
    document.getElementById(`sandbox-input-arg-2-1`).value = "250000";
    document.getElementById(`sandbox-input-arg-3-1`).value = "500000";
    document.getElementById(`sandbox-input-arg-4-1`).value = "1000000";
    document.getElementById(`sandbox-input-arg-5-1`).value = "2000000";

    document.getElementById(`sandbox-input-arg-1-2`).value = 1;
    document.getElementById(`sandbox-input-arg-2-2`).value = 1;
    document.getElementById(`sandbox-input-arg-3-2`).value = 1;
    document.getElementById(`sandbox-input-arg-4-2`).value = 1;
    document.getElementById(`sandbox-input-arg-5-2`).value = 1;

    runSandbox();
  }
}

setExampleInput();
// runSandbox();
