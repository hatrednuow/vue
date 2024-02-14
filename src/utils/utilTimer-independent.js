class UtilTimerIndepenent {
  constructor() {
    this.inactivityTimer = null;
    this.timepause = false;
    this.remainingTime = 60;
    this.callbackFunction = null;
  }

  // 콜백함수
  setCallback(callback) {
    this.callbackFunction = callback;
  }

  // 타이머 시작
  backTimer(ptime = this.remainingTime) {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      if (ptime > 0 && !this.timepause) {
        ptime = ptime - 1;
        this.remainingTime = ptime; // remainingTime 업데이트
        if (this.callbackFunction) {
          this.callbackFunction(ptime);
        }
        this.backTimer(ptime); // 다음 호출을 예약하여 카운트 다운을 유지
      } else {
        console.log('타이머 종료');
      }
    }, 1000 * 60); // 1초 * 60 마다 체크
  }

  // 타이머 완전 종료
  clearTimer() {
    clearTimeout(this.inactivityTimer);
  }

  // 타이머 일시정지
  pauseTimer() {
    this.timepause = true;
  }

  // 타이머 재시작
  resumeTimer() {
    this.timepause = false;
    this.backTimer(this.remainingTime); // remainingTime 전달
  }

  // 타이머 재설정
  resetTimer(ptime) {
    this.timepause = false;
    clearTimeout(this.inactivityTimer);
    this.backTimer(ptime); // remainingTime 전달
  }

  // 타이머 남은시간 확인
  getRemainingTime() {
    return this.remainingTime;
  }
}

export { UtilTimerIndepenent };