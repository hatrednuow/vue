const utilNumber = {
  // 숫자를 length 자리로 패딩하는 함수
  pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
  }
}

export { utilNumber };