// THE SORTING ALGORITHMS

function bubbleSort(array){
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
    var nextItem = (left[0] < right[0]) ? left.shift() : right.shift();
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

    for(var i = 1; i < array.length; i++){
      if(array[i] <= pivot){
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }

    return quickSort(left).concat([pivot]).concat(quickSort(right));
}


function insertionSort(array) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
        var tmp = array[i]; //Copy of the current element.
        /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
        for (var j = i - 1; j >= 0 && (array[j] > tmp); j--) {
            //Shift the number
            array[j + 1] = array[j];
        }
        //Insert the copied number at the correct position
        //in sorted part.
        array[j + 1] = tmp;
    }
    return array;
}


function selectionSort(array) {
    var length = array.length;
    for (var i = 0; i < length - 1; i++) {
        //Number of passes
        var min = i; //min holds the current minimum number position for each pass; i holds the Initial min number
        for (var j = i + 1; j < length; j++) { //Note that j = i + 1 as we only need to go through unsorted array
            if (array[j] < array[min]) { //Compare the numbers
                min = j; //Change the current min number position if a smaller num is found
            }
        }
        if (min != i) {
            //After each pass, if the current min num != initial min num, exchange the position.
            //Swap the numbers
            var tmp = array[i];
            array[i] = array[min];
            array[min] = tmp;
        }
    }
    return array;
}


// HEAP SORT
var arrayLength;

function buildHeap(input) {
    arrayLength = input.length;

    for (var i = Math.floor(arrayLength / 2); i >= 0; i -= 1) {
        heapify(input, i);
    }
}

function heapify(input, i) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var largest = i;

    if (left < arrayLength && input[left] > input[largest]) {
        largest = left;
    }

    if (right < arrayLength && input[right] > input[largest]) {
        largest = right;
    }

    if (largest != i) {
        swap(input, i, largest);
        heapify(input, largest);
    }
}

function swap(input, index_A, index_B) {
    var temp = input[index_A];

    input[index_A] = input[index_B];
    input[index_B] = temp;
}

function heapSort(input) {
    buildHeap(input);

    for (var i = input.length - 1; i > 0; i--) {
        swap(input, 0, i);
        arrayLength--;
        heapify(input, 0);
    }
    return input;
}
