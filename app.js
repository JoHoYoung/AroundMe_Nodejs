//Express 기본 모듈
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user.id + '-' + Date.now())
    }
})

var upload = multer({
    storage: storage
})
var user = require('./routes/user.js');
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


var router = require('./routes/process.js')

//DB
var mongoose = require('mongoose');

//기본 속성
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use('/uploads', static(path.join(__dirname, 'uploads')));


app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use('/', router);

app.set('view engine', 'ejs');
app.set('views', './views')
//-----------------------------------------------------//
app.get('/upload', function (req, res) {
    res.render('uploadform');
});
//uploads.single.avater : 미들웨어, 뒤에 펑션이 실행되기전에 얘가먼저 실행되고, 얘의 역할은 사용자가 전송한 데이터에서 파일이 포함되어있다면 파일을 가공해서 req객체에 file이라는 속성을 추가 하게됨. req객체 안에 파일이라는 속성이 포함되어 있게 된다. 폼에서 제출하는 파일의 네임값이 싱글의 인자로 되어야함.
app.post('/upload', upload.array('userfile', 12), function (req, res) {
    res.send('uploaded : ' + req.file);
});

app.post('/process/create', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var paramuser = req.session.user.id;
    if (database) {
        user.addPost(database, paramtitle, paramcontent, req.session.user.id, function (err, result) {

            if (err) {
                throw err;
            }
            if (result) {

                for (var i = 0; i < req.files.length; i++) {
                    result.images.push({
                        images: req.files[i].filename
                    });
                }
                result.save(function (err) {
                    if (err) throw err;
                });
                res.redirect('/posts/1')
                res.end();
            } else {
                res.write('<h2>사용자 추가 실패</h2>');
                res.redirect('/public/signin.html');
                res.end();
            }
        });

    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.end();
    }
});

app.post('/process/post/update/:postroot',upload.array('userimage',12),function (req, res) {
    var database = req.app.get('database');
    var postroot = path.parse(req.params.postroot).base;
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var todelete= req.body.todelete;
    console.log(todelete);
    database.PostModel.findOneAndUpdate({
        "_id": postroot
    }, {
        "title": paramtitle,
        "content": paramcontent
    }, function (err, results) {
        if (err) throw err;
       console.log(todelete);
        todelete = todelete.split(',');
        todelete = todelete.sort().reverse();
        console.log(todelete.length);
        
        for(var i=0;i<todelete.length;i++)
            {
                console.log("지울것은1?");
           console.log(todelete[i]); fs.unlink(`./uploads/${results.images[todelete[i]].images}`,function(err){
                         if(err){throw err;}});
                results.images.splice(todelete[i],1);
    
            }
      // var idx=results.images.length; results.images.splice(0,idx);
        for (var i = 0; i < req.files.length; i++) {
                    results.images.push({
                        images: req.files[i].filename
                    });
                }
                results.save(function (err) {
                    if (err) throw err;
                });
                
    });
    res.redirect('/posts/1');
});

//--------------DB연결---------------------//
var MongoClient = require('mongodb').MongoClient;

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function () {

        createUserSchema(database);
        createPostSchema(database);

    });

    database.on('disconnected', function () {

        console.log('연결 끊어짐');
        setInterval(connectDB, 5000);
    });

    app.set('database', database);

}

function createUserSchema(database) {

    database.UserSchema = require('./database/user_schema').createSchema(mongoose);

    database.UserModel = mongoose.model("users", database.UserSchema);
}

function createPostSchema(database) {
    database.PostSchema = require('./database/post_schema').createSchema(mongoose);

    database.PostModel = mongoose.model("post", database.PostSchema);

}

http.createServer(app).listen(app.get('port'), function () {
    console.log('서버 시작');
    connectDB();
});
