const utilArray = {
  ascSort(arr, key) {
    let result;
    if(key) {
      result = arr.sort((a, b) => {
        if (a[key] > b[key]) {
          return 1;
        }
        if (a[key] < b[key]) {
          return -1;
        }
        return 0;
      });
    } else {
      result = arr.sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      });
    }
    return result;
  },
}

export { utilArray };