function heapSort(arr){
        let last = arr.length - 1;
        function parent(idx){
          if(idx > 0 && idx <= last){return ~~((idx -1) / 2);}
        }
        function children(idx){
          let children = {l: undefined, r: undefined}
          if(2 * idx + 1 <= last){children.l = 2 * idx + 1;}
          if(2 * idx + 2 <= last){children.r = 2 * idx + 2;}
          return children
        }
        function swap(idx1, idx2){
          let temp = arr[idx1];
          arr[idx1] = arr[idx2];
          arr[idx2] = temp;
        }
        function pair(idx){
          if(idx < 1){return undefined}
          return children(parent(idx));
        }

        function heapStep(idx){
          let l = pair(idx).l;
          let r = pair(idx).r;
          let par = parent(idx);
          let max = arr[l];
          let maxi = l;
          if(r && l && arr[r] > arr[l]){
            max = arr[r];
            maxi = r;
          }
          if(max > arr[par]){swap(maxi, par);}
          if(children(maxi).l){heapStep(children(maxi).l);}
        }

        function makeHeap(n){
          for (let i = n; i > 0; i-=2) {
            last = n;
            heapStep(i);
          }
        }

        makeHeap(last)

        for (let i = last; i > 0; i--) {
          swap(0, i);
          last--;
          heapStep(1);
        }
      }
