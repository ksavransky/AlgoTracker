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
