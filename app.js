//Express 기본 모듈
var express = require('express');
var http = require('http');
var path = require('path');

//Express 미들웨어
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

// 오류 핸들러
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어
var expressSession = require('express-session');

var app=express();

//DB
var mongoose = require('mongoose');

//기본 속성
app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


//----------------------- 라우트 설정.---------------------//
var router = express.Router();

router.route('/process/login').post(function(req, res) {
	console.log('/process/login 처리함.');

    var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
	
    if(req.session.user)
     {   
         console.log('로그인 된 상태');
     }
    else {
        
        if(database)
            {
                authUser(database,paramId,paramPassword,function(err,docs){
                    if(err) {throw err;}
                    
                    if(docs)
                        {
                            console.dir(docs);
                            var username=docs[0].name;
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h1>로그인 성공</h1>');
                        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
                        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
                        res.write("<br><br><a href='/public/login.html'>다시 로그인 하기</a>"); 
                        res.write("<br><br><a href='/process/product'>상품 보러가기</a>"); 
                            
                        req.session.user={
                                        id: paramId,
                                        name: '소녀시대',
                                        authorized: true
                                            };
                                console.log('로그인 정보 저장');
                            res.end();
            
                        }
                    else{
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h1>로그인 실패</h1>');
                        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
                        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
                        res.write("<br><br><a href='/public/login.html'>다시 로그인 하기</a>"); 
                        res.end();
                    }
                });
                
            }
        else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h1>데이터 베이스 연결 실패</h1>');
                        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
                        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
                        res.write("<br><br><a href='/public/login.html'>다시 로그인 하기</a>");
            res.end();
            
        }
    }
});

router.route('/process/adduser').post(function(req,res){
    console.log("adduser호출 됨");
    
    var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
    var paramName=req.body.name||req.query.name;
    if(database)
        {
            addUser(database,paramId,paramPassword,paramName,function(err,result){
                
                if(err) {throw err;}
                console.log('왜 에러?');
                if(result)
                    {
                        console.log('여기서 에러났니?');
                       // res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                        //res.write('<h2>사용자 추가 성공</h2>');
                        res.redirect('/public/login.html')
                        res.end();
                        console.log('여기서 에러났니?');
                        
                    }
                else {
                    
                    res.write('<h2>사용자 추가 실패</h2>');
                    res.redirect('/public/signin.html');
                    res.end();
                }
                
            });
        }
    else {
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.end();
        
    }
});

router.route('/process/product').get(function(req,res){
    
    console.log('로그인 되어 프로덕트 접근');
    if(req.session.user)
       { res.redirect('/public/product.html');
       }
    else{ res.redirect('/public/login.html');
    }
});

router.route('/process/logout').get(function(req,res){
    
    console.log('로그아웃 시도');
    if(req.session.user)
    {
        console.log('로그아웃 합니다');
    
        req.session.destroy(function(err){
        if(err){ throw err;}
        
        console.log('로그아웃 성공,세션삭제 완료')
        res.redirect('/public/login.html');
    });
    } else {
         console.log('로그인 되어있지 않습니다');
         res.redirect('/public/login.html');
     }
});

//router.route('/process/signin').get(function(req,res){
//    res.redirect('/pubilc/signin.html');
//})
app.use('/',router);
//-----------------------------------------------------//

//--------------DB연결---------------------//
var MongoClient=require('mongodb').MongoClient;

var database;
var UserSchema;
var UserModel;

function connectDB()
{
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    console.log('데이터 베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error',console.error.bind(console, 'mongoose connection error'));
    database.on('open',function(){
        
        console.log('데이터 베이스에 연결되었습니다.');
        
        UserSchema=mongoose.Schema({
            id : {type : String, required : true, unique : true},
            name : {type : String, required : true},
            password: {type : String, required : true}
        });
        console.log('스키마 정의함');
        
        UserModel=mongoose.model("users",UserSchema);
        console.log('모델 정의 함');
    });
    database.on('disconnected',function(){
        
        console.log('연결 끊어짐');
        setInterval(connectDB,5000);
    });

}

var authUser = function(database, id, password, callback){
    console.log('authUser 호출 됨');
    
    UserModel.find({"id" : id, "password":password},function(err, results){
        if(err){
            callback(err,null);
            return;
        }
        
        if(results.length>0){
            console.log('아이디 %s 비번%s 일치하는 이용자 찾음',id,password);
            callback(null,results);
        }else {
            console.log('일치하는 사용자 찾지 못함');
            callback(null,null);
        }
    });
}

var addUser = function(database, id, password, name, callback){
    console.log("회원가입 진행");
    
    var user = new UserModel({"id":id,"password":password,"name":name});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,user);
    });
    
}
         
http.createServer(app).listen(app.get('port'),function(){
    console.log('서버 시작');
    connectDB();
});