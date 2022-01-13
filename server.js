// express 라이브러리 첨부와 사용
const express = require('express');
const app = express();

// bodyParser 라이브러리 
// 데이터들 처리가 쉽게 가능하게 한다
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// MongoDB
const MongoClient = require('mongodb').MongoClient;

// MongoDB
MongoClient.connect('mongodb+srv://chyb627:!cha159632@chabiri.r7lh7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러);
    //서버띄우는 코드 여기로 옮기기
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
  })


// app.listen()은 원하는 포트에 서버를 오픈하는 문법
// listen() 함수 안엔 두개의 파라미터가 필요
// listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
// app.listen(8080, function() {
//     console.log('listening on 8080')
// })

// /경로로 접속시 server.js랑 같은 경로에 있는 /main.html 이라는 파일을 보내준다.
// sendFile() 함수를 쓰면 파일을 보낼 수 있다.
// __dirname은 현재 파일의 경로를 뜻한다. (dirname 왼쪽에 언더바 두개)
app.get('/', function(요청, 응답) { 
    응답.sendFile(__dirname +'/main.html')
  })

// write페이지 보여주는 코드
app.get('/write', function(요청, 응답) { 
응답.sendFile(__dirname +'/write.html')
});

app.post('/add', function(요청, 응답){
    console.log(요청.body);
    응답.send('전송완료')
  });
