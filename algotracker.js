
let test = [];

for(let i = 0; i < 40000; i++){
  test[i] = Math.floor(Math.random() * 1000000);
}



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

function timeTracker(algo, arg){
  let startTime = new Date();
  let result = algo(arg);
  let endTime = new Date();
  console.log(endTime - startTime); //this is in ms
  return result;
}

console.log(timeTracker(bubbleSort, test));
