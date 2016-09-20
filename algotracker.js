var axisScale = "linear";

var dataset = [];
var algos = [];
var algoColors = [];

function runSort(){
  dataset = [];
  algos = [];
  algoColors = [];
  setAlgos();
  // setAlgoColors();
  for(let i = 0; i < 5; i++){
    let inputLength = document.getElementById(`sort-input-${i + 1}`).value;
    console.log(inputLength);
    let inputArray = createRandArray(inputLength);
    for(let j = 0; j < algos.length; j++){
      let color = algoColors[j];
      timeTracker(algos[j], inputArray.slice(), color);
    }
  }
  draw();
}

function setAlgos(){
  let input = [document.getElementById(`sort-algo-one`).value,
  document.getElementById(`sort-algo-two`).value,
  document.getElementById(`sort-algo-three`).value];

  let colors = [document.getElementById(`sort-algo-one-color`).value,
  document.getElementById(`sort-algo-two-color`).value,
  document.getElementById(`sort-algo-three-color`).value];

  input.forEach((str ,idx) =>{
    if(str === "bubbleSort"){
      algos.push(bubbleSort);
      algoColors.push(colors[idx]);
    } else if(str === "mergeSort"){
      algos.push(mergeSort);
      algoColors.push(colors[idx]);
    } else if(str === "quickSort"){
      algos.push(quickSort);
      algoColors.push(colors[idx]);
    }
  });
}
// function setAlgoColors(){
//   let colors = [document.getElementById(`sort-algo-one-color`).value,
//   document.getElementById(`sort-algo-two-color`).value,
//   document.getElementById(`sort-algo-three-color`).value];
//
//   colors.forEach(str =>{
//     algoColors.push(str);
//   });
// }

function createRandArray(n){
  let array= [];
  for(let i = 0; i < n; i++){
    array[i] = Math.floor(Math.random() * 1000000);
  }
  return array;
}


function timeTracker(algo, arg, color){
  if(algo.name !== "none"){
    let startTime = new Date();
    let result = algo(arg);
    let endTime = new Date();
    let timeElapsed = endTime - startTime;
    // console.log(algo);
    // console.log(timeElapsed); //this is in ms
    dataset.push([arg.length, timeElapsed, algo.name, color]);
    // console.log(result);
  }
}


// THE SORTING ALGORITHMS


function bubbleSort(array){
  let sorted = false;

  while(!sorted){
    sorted= true;
    for(let i = 0; i < array.length - 1; i++){
      if(array[i] > array[i + 1]){
        let hld = array[i];
        array[i] = array[i + 1];
        array[i + 1] = hld;
        sorted = false;
      }
    }
  }
  return array;
}

function mergeSort(array) {
  if (array.length < 2) {
    return array;
  } else {
    const middle = Math.floor(array.length / 2);

    const left = mergeSort(array.slice(0, middle));
    const right = mergeSort(array.slice(middle));

    return merge(left, right);
  }
}

function merge(left, right) {
  const merged = [];

  while (left.length > 0 && right.length > 0) {
    let nextItem = (left[0] < right[0]) ? left.shift() : right.shift();
    merged.push(nextItem);
  }

  return merged.concat(left, right);
}


function quickSort(array){
  if (array.length < 2) {
    return array;
  }

    const pivot = array[0];
    const left = [];
    const right = [];

    for(let i = 1; i < array.length; i++){
      if(array[i] <= pivot){
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }

    return quickSort(left).concat([pivot]).concat(quickSort(right));
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
