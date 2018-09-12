var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');

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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy({

    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, id, password, callback) {
    var database = req.app.get('database');
    database.UserModel.find({
        "id": id,
        "auth": {
            $ne: 0
        }
    }, function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색결과', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');

            var user = new database.UserModel({
                id: id
            });
            console.log(results[0]._doc);
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            if (authenticated) {
                req.session.user = {
                    id: results[0]._doc.id,
                    nickname: results[0]._doc.nickname,
                    name: results[0]._doc.name,
                    authorized: true
                };
                console.log('비밀번호 일치함');
                console.log(req.session.user);
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }

        } else {
            console.log("아이디와 일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }

    });
}));

passport.serializeUser(function (user, done){

    console.log('serilaize');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserialize');
    done(null, user)
});

passport.use(new FacebookStrategy({
        clientID: '982849978562138',
        clientSecret: '669c4090e46462b987db27c1153d81b8',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);
    }
));

function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');

}

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

//일반적인 요청 파라미터를 파싱 하게 된다.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.user(cors());
// application/json 형식으로 전달된 요청 파라미터를 파싱 하게 된다.
app.use(bodyParser.json());
// --> 이 과정들을 거치면 미들웨어 안에서 요청 객체의 body객체 안에 요청 파라미터들이 들어가게 된다.

//public폴더안에 있는 파일들을 사이트의 /public 패스로 접근 할 수 있게 함.
app.use('/public', static(path.join(__dirname, 'public')));
//upload폴더안에 있는 파일들을 사이트의 /upload 패스로 접근 할 수 있게 함
app.use('/uploads', static(path.join(__dirname, 'uploads')));


app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use('/', router);

app.use(passport.initialize());

app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', './views')
//----------------------------------------------------//
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/login_success',

    failureRedirect: '/login_fail'
}));

app.get('/login_success', ensureAuthenticated, function (req, res) {

    var database = req.app.get('database');
    //res.render('main', {islogin:1});
    database.UserModel.findOne({
        "id": req.user.id,
        "provider": "facebook"
    }, function (err, results) {
        if (results) {
            req.session.user = {
                id: req.user.id,
                name: results.name,
                nickname: results.nickname,
                authorized: true
            };
            if (req.session.returnTo) {
                res.redirect(req.session.returnTo);
                res.end();
            } else {
                res.redirect('/');
                res.end();
            }
        } else {
            console.log("결과없음");
            res.render('facebooksignup', {
                id: req.user.id,
                name: req.user.username
            });
        }
    });

});


//-----------------------------------------------------//
app.get('/upload', function (req, res) {
    res.render('uploadform');
});
//uploads.single.avater : 미들웨어, 뒤에 펑션이 실행되기전에 얘가먼저 실행되고, 얘의 역할은 사용자가 전송한 데이터에서 파일이 포함되어있다면 파일을 가공해서 req객체에 file이라는 속성을 추가 하게됨. req객체 안에 파일이라는 속성이 포함되어 있게 된다. 폼에서 제출하는 파일의 네임값이 싱글의 인자로 되어야함.
app.post('/upload', upload.array('userfile', 12), function (req, res) {
    res.send('uploaded : ' + req.file);
});

app.post('/process/areacreate', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var paramuser = req.session.user.nickname;
    var area = req.body.area;
    var areagroup = req.body.areagroup;
    //area.splice(1, 1);
    console.log("지역은!?");
    console.log(area);
    if (database) {
        user.addAreaPost(database, paramtitle, paramcontent, req.session.user.nickname, area, areagroup, function (err, result) {

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
                res.redirect(`/areaposts/1/${areagroup}`);
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

app.post('/process/areapost/update/:postroot', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var postroot = path.parse(req.params.postroot).base;
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var todelete = req.body.todelete;
    var area = req.body.area;
    console.log(todelete);
    database.PostModel.findOneAndUpdate({
        "_id": postroot
    }, {
        "title": paramtitle,
        "content": paramcontent,
        "area": area
    }, function (err, results) {
        if (err) throw err;
        console.log(todelete);
        todelete = todelete.split(',');
        todelete = todelete.sort().reverse();

        for (var i = 0; i < todelete.length; i++) {
            console.log("지울것은1?");
            if (todelete[i] != '') {
                fs.unlink(`./uploads/${results.images[todelete[i]].images}`, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
            results.images.splice(todelete[i], 1);

        }
        for (var i = 0; i < req.files.length; i++) {
            results.images.push({
                images: req.files[i].filename
            });
        }
        results.save(function (err) {
            if (err) throw err;
        });

    });
    res.redirect(`/post/${postroot}`);
});

app.post('/process/create', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;

    if (type != "oneline")
        var paramcontent = req.body.content || req.query.content;

    var paramuser = req.session.user.nickname;
    var type = req.body.type;

    if (type == "resolve") {

        user.addResolvePost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${rsesult._id}/resolveposts`);
                res.end();
            }
        });
    } else if (type == "report") {
        user.addReportPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/reportposts`);
                res.end();
            }
        });
    } else if (type == "worryposts") {
        user.addWorryPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/worryposts`);
                res.end();
            }
        });
    } else if (type == "oneline") {
        user.addOnelinePost(database, paramtitle, req.session.user.nickname, function (err, result) {
            if (err) {
                throw err;
            }
            if (result) {

                result.save(function (err) {
                    if (err) throw err;
                });
                res.redirect(`/oneline/1`);
                res.end();
            }
        });
    } else if (type == "accident") {
        user.addAccidentPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/accident`);
                res.end();
            }
        });
    } else if (type == "notice") {
        user.addNoticePost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/notice`);
                res.end();
            }
        });
    } else if (type == "club") {
        user.addClubPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/club`);
                res.end();
            }
        });
    } else if (type == "festival") {
        user.addFestivalPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/festival`);
                res.end();
            }
        });
    } else if (type == "picture") {
        user.addPicturePost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/picture`);
                res.end();
            }
        });
    } else if (type == "promotion") {
        user.addPromotionPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/promotion`);
                res.end();
            }
        });
    } else if (type == "anonymous") {
        user.addAnonymousPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/anonymous`);
                res.end();
            }
        });
    } else {
        user.addPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/posts`);
                res.end();
            }
        });
    }
});

app.post('/process/create', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var paramuser = req.session.user.nickname;
    var type = req.body.type;

    if (type == "resolve") {

        user.addResolvePost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${rsesult._id}/resolveposts`);
                res.end();
            }
        });
    } else if (type == "report") {
        user.addReportPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/reportposts`);
                res.end();
            }
        });
    } else {
        user.addPost(database, paramtitle, paramcontent, req.session.user.nickname, function (err, result) {
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
                res.redirect(`/post/${result._id}/posts`);
                res.end();
            }
        });
    }
});

app.post('/process/post/update/:postroot', upload.array('userimage', 12), function (req, res) {
    var database = req.app.get('database');
    var postroot = path.parse(req.params.postroot).base;
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var todelete = req.body.todelete;
    database.PostModel.findOneAndUpdate({
        "_id": postroot
    }, {
        "title": paramtitle,
        "content": paramcontent,
    }, function (err, results) {
        if (err) throw err;
        todelete = todelete.split(',');
        todelete = todelete.sort().reverse();
        if (todelete != '') {
            console.log(results);
            for (var i = 0; i < todelete.length; i++) {
                console.log(todelete.length);
                console.log(todelete);
                if (todelete[i] != '') {
                    fs.unlink(`./uploads/${results.images[todelete[i]].images}`, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
                results.images.splice(todelete[i], 1);

            }

            
        }
        
        for (var i = 0; i < req.files.length; i++) {
                results.images.push({
                    images: req.files[i].filename
                });
            }
        results.save(function (err) {
            if (err) throw err;
        });

    });
    res.redirect(req.session.returnTo);
});

app.post('/process/login', passport.authenticate('local', {
    failureRedirect: '/loginfail',
    successRedirect: '/loginsuccess'
}), (req, res) => {

    console.log("응답값은?");
    //console.log(res);
    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log(req.session.returnTo);

    if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        res.end();
    } else {
        res.redirect('/');
        res.end();
    }
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
