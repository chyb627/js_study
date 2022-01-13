// express 라이브러리 첨부와 사용
const express = require('express');
const app = express();

// app.listen()은 원하는 포트에 서버를 오픈하는 문법
// listen() 함수 안엔 두개의 파라미터가 필요
// listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
app.listen(8080, function() {
    console.log('listening on 8080')
})

app.get('/pet', function(요청, 응답) { 
    응답.send('펫용품 사시오')
  })