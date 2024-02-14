// 사용되는 모든 곳에서 공유되는 방식
let inactivityTimer = null;
let timepause = false;
let timeperiod = 60; // 상수 
let remainingTime = timeperiod; // 변수
let callbackFunction = null;

const utilTimer = {
  // 콜백함수
  setCallback(callback) {
    callbackFunction = callback;
  },

  // 타이머 시작
  backTimer(ptime = remainingTime) {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
      if (ptime == 0) {
        ptime = timeperiod;
      }
      if (ptime > 0 && !timepause) {
        ptime = ptime - 1;
        remainingTime = ptime; // remainingTime 업데이트
        if (callbackFunction) {
          callbackFunction(ptime);
        }
        this.backTimer(ptime); // 다음 호출을 예약하여 카운트 다운을 유지
      } else {
        //
      }
    }, 1000); // 1초 마다 체크
  },

  // 타이머 완전 종료
  clearTimer() {
    clearTimeout(this.inactivityTimer);
  },

  // 타이머 일시정지
  pauseTimer() {
    timepause = true;
  },

  // 타이머 재시작
  resumeTimer() {
    timepause = false;
    this.backTimer(remainingTime); // remainingTime 전달
  },

  // 타이머 재설정
  resetTimer(ptime) {
    remainingTime = ptime;
    timepause = false;
    clearTimeout(inactivityTimer);
    this.backTimer(ptime); // remainingTime 전달
  },

  // 타이머 남은시간 확인
  getRemainingTime() {
    return remainingTime;
  },

  // timeperiod 값 외부에서 변경
  updateTimeperiod(time) {
    timeperiod = time;
    remainingTime = timeperiod;
  }
};

export { utilTimer };
