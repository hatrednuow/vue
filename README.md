# iems_kyungchang

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 경창
ui 로그인
iemsdev
12345

### TODO by SWS
 - [x] 컨트롤포인트그룹관리 화면에서 여러개 선택 후 그룹에 추가
 - [x] 그룹과 컨트롤포인트 각 선택에 따라 필요하지 않은 입력하지 못하도록 수정필요
 - [x] 컨트롤포인트그룹관리 화면에서 추가 후 선택했던 컨트롤포인트 선택 해제되도록 하기
 - [x] 그룹, CP 추가 후 자동으로 해당부분 펼쳐지기
 - [] 수집데몬관리(basa002) initNewRow 성서인지 현풍인지 선택 후 id 바인딩 되도록 수정 필요

 [mon1 관제점 통합감시화면]
 - [x] 타이머 적용 확인 필요
 - [x] 1시간 이전 데이터 확인 파라미터 확인

[공통]
- [] 차트에 로딩 상태 넣기
- [] 각 페이지 별로 가장 중요한 것들 눈에 확띄게 만들기 + 글자 크기 키우기
- [] dev grid에서 lookup 사용시 글자가 다보이지 않고 ...으로 표현되는 부분 (영어, 중국어 사용을 안해서 주석으로 일단 해결)


[백엔드]
- exception 발생 시 오라클 연결 종료로 인해 eof 오류 발생 => 임시방편으로 conn.close 처리 주석으로 막음, 지속적인 관찰 필요해보임
  => 오류 발생 시 self.release() 이 동작안하고 그로인해서 self.acquire()도 실행이 안되는것으로 보임
  => 관제점 통합감시에서 24시간을 초과하는경우 오류 발생 그대로 남겨둠
- 리포트 문제로 인해서 .net Core로 변경필요 할 수도 있음


[이찬원차장님 오시면 물어불 것]
- 높이 넓이 반응형 처리 어떻게 하였는지
- dev 디자인 처리 어떤식으로 하였는지
- 차트 속도 문제 물어보기