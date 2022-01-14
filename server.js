// express 라이브러리 첨부와 사용
const express = require('express');
const app = express();

// bodyParser 라이브러리 
// 데이터들 처리가 쉽게 가능하게 한다
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))

// MongoDB
const MongoClient = require('mongodb').MongoClient;

//ejs
app.set('view engine', 'ejs');

// public 위치에 있는 폴더를 사용하겠다.
app.use('/public', express.static('public'))

// method-override (POST로 PUT, DELETE 요청을 할 수 있다)
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// passport passport-local express-session, 대소문자 틀리면 코딩인생 끝날 수 있으니 구분할 것
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({
    secret: '비밀코드',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// dotenv
require('dotenv').config()

//--------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------//


let db; //페이지 전체에서 쓸 수 있는 전역변수

// MongoDB + 서버띄우는 코드
// { useUnifiedTopology: true }는 워닝메세지를 제거해준다.
MongoClient.connect(process.env.DB_URL, {
    useUnifiedTopology: true
}, function (에러, client) {
    if (에러) return console.log(에러);

    //client.db('shop')이라는 함수로 shop이라는 database에 접속해달라는 명령어.
    db = client.db('shop');
    console.log('client.db : ', client.db);
    console.log('client.db(shop) : ', db);

    // db.collection('post').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){
    //     console.log('저장완료'); 
    // });

    // app.listen()은 원하는 포트에 서버를 오픈하는 문법
    // listen() 함수 안엔 두개의 파라미터가 필요
    // listen(서버를 오픈할 포트번호, function(){서버 오픈시 실행할 코드})
    app.listen(process.env.PORT, function () {
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
app.post('/add', function (요청, 응답) {
    db.collection('counter').findOne({
        name: '게시물갯수'
    }, function (에러, 결과) {

        var 총게시물갯수 = 결과.totalPost;

        db.collection('post').insertOne({
            _id: 총게시물갯수 + 1,
            제목: 요청.body.title,
            날짜: 요청.body.date
        }, function (에러, 결과) {
            db.collection('counter').updateOne({
                name: '게시물갯수'
            }, {
                $inc: {
                    totalPost: 1
                }
            }, function (에러, 결과) {
                if (에러) {
                    return console.log(에러)
                }
                // 응답.send 부분은 항상 존재해야함. 전송이 성공하든 실패하든 서버에 보내주어야 안멈춘다.
                응답.send('전송완료');
            });
        });
    });
});

app.get('/list', function (요청, 응답) {
    db.collection('post').find().toArray(function (에러, 결과) {
        console.log(결과)
        응답.render('list.ejs', {
            posts: 결과
        })
    });
});

// app.delete('/delete', function (요청, 응답) {
//     //parseInt라는 함수는 '1'이라는 문자를 정수 1로 바꿔주는 고마운 함수이다.
//     // list 페이지를 새로고침해서 AJAX 요청해보면 데이터가 삭제된다.
//     요청.body._id = parseInt(요청.body._id);
//     // 요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 "이승기-삭제"
//     // deleteOne 함수를 쓰면 원하는 데이터를 삭제 가능하다
//     // deleteOne(삭제원하는 데이터이름, function(){}) 이렇게 쓰면 된다.
//     // 그리고 AJAX 요청시 삭제원하는 데이터이름은 요청.body라는 곳에 담겨온다.
//     // 그래서 그 정보를 deleteOne에 집어넣으면 삭제원하는 데이터 게시물을 삭제할 수 있다.
//     // { _id : 요청.body._id }인 경우 글번호만 확인하고 삭제.
//     // { 작성자 : 지금로그인한사용자의_id } 이것도 가지고 있으면 삭제하라고 업글. 이제 사용자1,2가 발행한 게시물 삭제가 불가능하다.
//     db.collection('post').deleteOne({ _id: 요청.body._id, 작성자: 요청.user._id }, function (에러, 결과) {
//       console.log('삭제완료');
//       console.log('에러', 에러)
//       응답.status(200).send({ message: '성공했습니다' });
//     })
//   });

app.delete('/delete', function (요청, 응답) {
    요청.body._id = parseInt(요청.body._id)
    db.collection('post').deleteOne(요청.body, function (에러, 결과) {
        console.log('삭제완료')
    })
    응답.send('삭제완료')
});

// /edit로 접속하면 edit.ejs 파일을 랜더링하고 보내준다.
app.get('/edit/:id', function (요청, 응답) {
    db.collection('post').findOne({
        _id: parseInt(요청.params.id)
    }, function (에러, 결과) {
        응답.render('edit.ejs', {
            post: 결과
        })
    })
});

// 서버로 PUT 요청 들어오면 게시물 수정 처리하기
app.put('/edit', function (요청, 응답) {
    db.collection('post').updateOne({
        _id: parseInt(요청.body.id)
    }, {
        $set: {
            제목: 요청.body.title,
            날짜: 요청.body.date
        }
    }, function (에러, 결과) {
        console.log('수정완료')
        응답.redirect('/list')
    });
});

// 로그인 화면
app.get('/login', function (요청, 응답) {
    응답.render('login.ejs')
});

// 로그인 시 아이디,비번이 맞는지 검사후 맞으면 홈으로 가줘
// passport 라는 라이브러리가 제공하는 '아이디 비번 인증도와주는 코드'
// failureRedirect라는 부분은 로그인 인증 실패시 이동시켜줄 경로
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail'
}), function (요청, 응답) {
    응답.redirect('/')
});

// 로그인 실패시 다시 로그인 화면으로 넘겨줌
app.get('/fail', function (요청, 응답) {
    응답.render('login.ejs')
  })


// 아이디, 비번을 검사해주는 코드  
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
        if (에러) return done(에러)
        if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
        if (입력한비번 == 결과.pw) {
          return done(null, 결과)
        } else {
          return done(null, false, { message: '비번틀렸어요' })
        }
      })
    }));

// 세션데이터를 만들고 세션아이디를 보내주는 것 (serializeUser함수)
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// deserializeUser 라는 부분은 고객의 세션아이디를 바탕으로 이 유저의 정보를 DB에서 찾는 역할을 하는 함수
passport.deserializeUser(function (아이디, done) {
    db.collection('login').findOne({
        id: 아이디
    }, function (에러, 결과) {
        done(null, 결과)
    })
});

// 마이페이지 라우팅
app.get('/mypage', 로그인했니, function (요청, 응답) {
    console.log('요청.user ::: ',요청.user);
    응답.render('mypage.ejs', { 사용자: 요청.user })
})
// 로그인 확인, 요청.user가 있으면 next()로 통과시키고 없으면 에러메시지를 응답.send() 해줘
// 요청.user는 deserializeUser가 보내준 그냥 로그인한 유저의 DB 데이터
function 로그인했니(요청, 응답, next) {
    if (요청.user) {
        next()
    } else {
        // 응답.send('로그인해주세요')
        응답.render('login.ejs')
        alert('로그인 먼저 해주세요');
    }
}

// 회원가입 페이지 랜더링
app.get('/signup', function (요청, 응답) {
    응답.render('signup.ejs')
  });

// /user로 POST요청시 DB에 저장
app.post('/user', function (요청, 응답) {
db.collection('counter').findOne({
    user: '회원수',
}, function (에러, 결과) {

    var 회원수 = 결과.totalUser;

    db.collection('login').insertOne({
        _id: 회원수 + 1,
        id: 요청.body.id,
        pw: 요청.body.pw
    }, function (에러, 결과) {
        db.collection('counter').updateOne({
            user: '회원수'
        }, {
            $inc: {
                totalUser: 1
            }
        }, function (에러, 결과) {
            if (에러) {
                return console.log(에러)
            }
            // 응답.send 부분은 항상 존재해야함. 전송이 성공하든 실패하든 서버에 보내주어야 안멈춘다.
            응답.send('전송완료');
        });
    });

});
});
