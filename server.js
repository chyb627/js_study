// express 라이브러리 첨부와 사용
const express = require('express');
const app = express();

// bodyParser 라이브러리 
// 데이터들 처리가 쉽게 가능하게 한다
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// MongoDB
const MongoClient = require('mongodb').MongoClient;

//ejs
app.set('view engine', 'ejs');

let db; //페이지 전체에서 쓸 수 있는 전역변수

// MongoDB + 서버띄우는 코드
// { useUnifiedTopology: true }는 워닝메세지를 제거해준다.
MongoClient.connect('mongodb+srv://chyb627:!cha159632@chabiri.r7lh7.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true }, function(에러, client){
    if (에러) return console.log(에러);

    //client.db('shop')이라는 함수로 shop이라는 database에 접속해달라는 명령어.
    db = client.db('shop');
    console.log('client.db : ',client.db);
    console.log('client.db(shop) : ',db);

    // db.collection('post').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){
	//     console.log('저장완료'); 
	// });

    // app.listen()은 원하는 포트에 서버를 오픈하는 문법
    // listen() 함수 안엔 두개의 파라미터가 필요
    // listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
})

// /경로로 접속시 server.js랑 같은 경로에 있는 /main.html 이라는 파일을 보내준다.
// sendFile() 함수를 쓰면 파일을 보낼 수 있다.
// __dirname은 현재 파일의 경로를 뜻한다. (dirname 왼쪽에 언더바 두개)
app.get('/', function (요청, 응답) {
    응답.render('main.ejs')
});

// write페이지 보여주는 코드
app.get('/write', function (요청, 응답) {
    응답.render('write.ejs')
});

// /add로 POST요청시 DB에 저장
app.post('/add', function(요청, 응답){
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
      
        var 총게시물갯수 = 결과.totalPost;

      db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function (에러, 결과) {
          db.collection('counter').updateOne({name:'게시물갯수'},{ $inc: {totalPost:1} },function(에러, 결과){
              if(에러){return console.log(에러)}
              // 응답.send 부분은 항상 존재해야함. 전송이 성공하든 실패하든 서버에 보내주어야 안멈춘다.
              응답.send('전송완료');
          });
      }); 
    });
});

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과)
        응답.render('list.ejs', { posts : 결과 })
    });
});

app.delete('/delete', function(요청, 응답){
    요청.body._id = parseInt(요청.body._id)
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
      console.log('삭제완료')
    })
    응답.send('삭제완료')
});
  