//Express 기본 모듈
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
//Express 미들웨어
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

// 오류 핸들러
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어
var expressSession = require('express-session');

var app = express();

//DB
var mongoose = require('mongoose');

//기본 속성
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cookieParser());

//-----------------------------------------------------//

var addranking = function(database, nickname, score,callback){
    console.log("왜 안돼");
    
    var unity = new database.UnityModel({"nickname":nickname,"score":score});
 
    unity.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,unity);
    });
    
}
//--------------DB연결---------------------//
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function () {

        createUnitySchema(database);

    });

    database.on('disconnected', function () {

        console.log('연결 끊어짐');
        setInterval(connectDB, 5000);
    });

    app.set('database', database);

}

app.get('/ranking',function(req,res){
    
    console.log("개같은");
    var database=req.app.get('database');
    database.UnityModel.find({}).sort('-score').limit(3).exec(function(err, results){
        
       res.writeHead('200',{'Content-Type':'application/json;charset=utf8'});
       res.write(JSON.stringify({results}));
        res.end();
    }); 
    
});

app.post('/rankup',function(req,res){
    
    console.log("시발");
    console.log(req.body);
    console.log(req.body.score);
    var nickname=req.body.nickname;
    var score=req.body.score;
    var database=req.app.get('database');
    database.UnityModel.find({"nickname":nickname},function(err, results){
        
        if(results){
            if(results.length>0)
            {console.log(results);
            if(results._doc.score>score)
            {    results._doc.score=score;
            }
            }
            else{
                addranking(database,nickname,score,function(err,results){
                    
                });
            }
        }else
            {
                
                
                

        
    }); 
});

function createUnitySchema(database) {

    database.UnitySchema = require('./database/unity_schema').createSchema(mongoose);

    database.UnityModel = mongoose.model("unity", database.UnitySchema);
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('서버 시작');
    connectDB();
});
