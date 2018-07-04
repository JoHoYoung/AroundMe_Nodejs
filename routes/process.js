var express = require('express');
var router = express.Router();

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
var user = require('./user.js')



router.route('/process/login').post(function (req, res) {
    console.log('/process/login 처리함.');

    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if (req.session.user) {
        console.log('로그인 된 상태');
    } else {

        if (database) {
            user.authUser(database, paramId, paramPassword, function (err, docs) {
                if (err) {
                    throw err;
                }

                if (docs) {
                    var username = docs[0].name;
                    req.session.user = {
                        id: paramId,
                        name: '소녀시대',
                        authorized: true
                    };
                    res.render('success', {
                        uid: paramId,
                        uname: username
                    });
                    console.dir(docs);


                    console.log('로그인 정보 저장');
                    res.end();

                } else {
                    res.writeHead('200', {
                        'Content-Type': 'text/html;charset=utf8'
                    });
                    res.write('<h1>로그인 실패</h1>');
                    res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                    res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                    res.write("<br><br><a href='/process/product'>상품 보러가기</a>");
                    res.end();
                }
            });

        } else {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.write('<h1>데이터 베이스 연결 실패</h1>');
            res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
            res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
            res.write("<br><br><a href='/public/login.html'>다시 로그인 하기</a>");
            res.end();

        }
    }
});

router.route('/process/adduser').post(function (req, res) {
    console.log("adduser호출 됨");

    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    if (database) {
        user.addUser(database, paramId, paramPassword, paramName, function (err, result) {

            if (err) {
                throw err;
            }
            console.log('왜 에러?');
            if (result) {
                res.redirect('/public/login.html')
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

router.route('/process/create').post(function (req, res) {
    console.log("adduser호출 됨");

    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var paramuser = req.session.user.id;
    if (database) {
        //var addContent = function(database, title, content,id,callback) 
        user.addContent(database, paramtitle, paramcontent, req.session.user.id, function (err, result) {

            if (err) {
                throw err;
            }
            console.log('왜 에러?');
            if (result) {
                res.redirect('/process/post')
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

router.route('/process/product').get(function (req, res) {

    console.log('로그인 되어 프로덕트 접근');
    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login.html');
    }
});


router.route('/process/logout').get(function (req, res) {

    console.log('로그아웃 시도');
    if (req.session.user) {
        console.log('로그아웃 합니다');

        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }

            console.log('로그아웃 성공,세션삭제 완료')
            res.redirect('/public/login.html');
        });
    } else {
        console.log('로그인 되어있지 않습니다');
        res.redirect('/public/login.html');
    }
});

router.route('/process/post').get(function (req, res) {

    var database = req.app.get('database');

    if (database.db) {

        database.ContentModel.find({}, function (err, results) {
            if (err) {
                return;
            }

            if (results) {
                res.render('post', {
                    results: results
                });
            }
        });
    }

});


router.route('/').get(function (req, res) {

    console.log('로그아웃 시도');
    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login.html');
    }
});

module.exports = router;