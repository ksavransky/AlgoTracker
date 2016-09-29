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

// function buildHeap(input) {
//     arrayLength = input.length;
//
//     for (var i = Math.floor(arrayLength / 2); i >= 0; i -= 1) {
//         heapify(input, i);
//     }
// }
//
// function heapify(input, i) {
//     var left = 2 * i + 1;
//     var right = 2 * i + 2;
//     var largest = i;
//
//     if (left < arrayLength && input[left] > input[largest]) {
//         largest = left;
//     }
//
//     if (right < arrayLength && input[right] > input[largest]) {
//         largest = right;
//     }
//
//     if (largest != i) {
//         swap(input, i, largest);
//         heapify(input, largest);
//     }
// }
//
// function swap(input, index_A, index_B) {
//     var temp = input[index_A];
//
//     input[index_A] = input[index_B];
//     input[index_B] = temp;
// }
//
// function heapSort(input) {
//     buildHeap(input);
//
//     for (var i = input.length - 1; i > 0; i--) {
//         swap(input, 0, i);
//         arrayLength--;
//         heapify(input, 0);
//     }
//     return input;
// }


// MORE Algos


function binarySearch(numbers, target) {
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
}

function fibonacciRecursive(n) {
  if (n === 0) {
    return [];
  } else if (n === 1) {
    return [0];
  } else if (n === 2) {
    return [0, 1];
  } else {
    var fibs = fibonacciRecursive(n - 1);
    fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);

    return fibs;
  }
}

function fibonacciIterative(n) {
  if (n === 0) {
    return [];
  } else if (n === 1) {
    return [0];
  } else if (n === 2) {
    return [0, 1];
  }

  var fibs = [0, 1];
  while (fibs.length < n) {
    fibs.push(fibs[fibs.length - 2] + fibs[fibs.length - 1]);
  }

  return fibs;
}

function subsets(array) {
  if (array.length === 0) {
    return [[]];
  }

  const lastElement = array.slice(-1)[0];
  const subs = subsets(array.slice(0, array.length - 1));
  return subs.concat(subs.map(function(sb) {
    sb.concat([lastElement]);
  }
));
}

function heapSort(arr){
        var last = arr.length - 1;
        function parent(idx){
          if(idx > 0 && idx <= last){return ~~((idx -1) / 2);}
        }
        function children(idx){
          var children = {l: undefined, r: undefined}
          if(2 * idx + 1 <= last){children.l = 2 * idx + 1;}
          if(2 * idx + 2 <= last){children.r = 2 * idx + 2;}
          return children
        }
        function swap(idx1, idx2){
          var temp = arr[idx1];
          arr[idx1] = arr[idx2];
          arr[idx2] = temp;
        }
        function pair(idx){
          if(idx < 1){return undefined}
          return children(parent(idx));
        }

        function heapStep(idx){
          var l = pair(idx).l;
          var r = pair(idx).r;
          var par = parent(idx);
          var max = arr[l];
          var maxi = l;
          if(r && l && arr[r] > arr[l]){
            max = arr[r];
            maxi = r;
          }
          if(max > arr[par]){swap(maxi, par);}
          if(children(maxi).l){heapStep(children(maxi).l);}
        }

        function makeHeap(n){
          for (var i = n; i > 0; i-=2) {
            last = n;
            heapStep(i);
          }
        }

        makeHeap(last)

        for (var i = last; i > 0; i--) {
          swap(0, i);
          last--;
          heapStep(1);
        }
return arr;
      }
