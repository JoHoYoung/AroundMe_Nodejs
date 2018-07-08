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
var user = require('./user.js');

var popup = require('window-popup').windowPopup;


router.route('/login').post(function (req, res) {

    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if (req.session.user) {

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
                    res.render('main', {
                        uid: paramId,
                        uname: username
                    });

                    res.end();

                } else {
                    res.render('login', {
                        can: -1,
                    });
                }
            });

        } else {

            res.end();

        }
    }
});

router.route('/adduser').post(function (req, res) {
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

router.route('/post/create').post(function (req, res) {
    console.log("adduser호출 됨");

    var database = req.app.get('database');
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;
    var paramuser = req.session.user.id;
    if (database) {
        //var addContent = function(database, title, content,id,callback) 
        user.addPost(database, paramtitle, paramcontent, req.session.user.id, function (err, result) {

            if (err) {
                throw err;
            }
            if (result) {
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

router.route('/main').get(function (req, res) {

    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login.html');
    }
});


router.route('/logout').get(function (req, res) {

    console.log('로그아웃 시도');
    if (req.session.user) {
        console.log('로그아웃 합니다');

        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }

            res.render('login', {
                can: 0,
            });
        });
    } else {
        res.render('login', {
            can: -1,
        });
    }
});

router.route('/posts').get(function (req, res) {

    var database = req.app.get('database');

    if (database.db) {
        
        database.PostModel.find().sort('-created_at').skip(0).limit(10).exec(function(err,results){
             if (err) {
                return;
            }
            var numofposts=database.PostModel.count({});
            if (results) {
                res.render('posts', {
                    results: results,
                    NumberofPosts: numofposts,
                    num: 1,
                    req: req
                });
            }
            
        });
    }

});

router.route('/posts/:num').get(function (req, res) {

    var database = req.app.get('database');
    var skip = path.parse(req.params.num).base;
    var Postnum = database.PostModel..count();
    if (database.db) {

        database.PostModel.find().sort('-created_at').skip((skip-1)*10).limit(10).exec(function(err,results){
             if (err) {
                return;
            }
            
            console.log('이시발@@');
            console.log(Postnum);
            if (results) {
                res.render('posts', {
                    results: results,
                    num : skip,
                    req: req,
                    PostNum : Postnum
                });
            }
            
        });
    }

});

router.route('/post/comment/create/:ObjectId').post(function (req, res) {
    var database = req.app.get('database')
    var filterd = path.parse(req.params.ObjectId).base;
    database.PostModel.findOne({
        "_id": filterd
    }, function (err, rawContent) {
        if (err) throw err;

        rawContent.comments.push({
            content: req.body.content,
            writer: req.session.user.id
        });
        rawContent.save(function (err) {
            if (err) throw err;
        });
    });

    res.redirect(`/post/${filterd}`);
});

router.route('/post/comment/destroy/:postroot').post(function (req, res) {
    var database = req.app.get('database')
    var postroot = path.parse(req.params.postroot).base;
    var filterd = req.body.commentid;
    database.PostModel.find({
        "_id": postroot
    }, function (err, rawContent) {
        if (err) throw err;
        var idx;
        for (var i = 0; i < rawContent.comments.length; i++) {
            if (rawContent.comments[i]._id == filterd) {
                idx = i;
                break;
            }
        }
        rawContent.comments.splice(idx, 1);

        rawContent.save(function (err) {
            if (err) throw err;
        });
    });

    res.redirect(`/post/${postroot}`);
});

router.route('/post/:ObjectId').get(function (req, res) {

    var database = req.app.get('database');
    var filterd = path.parse(req.params.ObjectId).base;
    
    //왜 안되고 왜 되는지 모르겠는 의문의 부분....
    database.PostModel.findOne({
            "_id": filterd
        },function (err, results){
            
            if(err) throw err;
             
            if (results) {
                results.views +=1;
            results.save(function (err) {
            if (err) throw err;
        });
                res.render('post', {
                    results: results,
                    req: req
                });
           
                
            }
        });

});

router.route('/post/destroy').post(function (req, res) {

    var database = req.app.get('database');
    var filterd = req.body.postid;;

    if (database.db) {
        database.PostModel.remove({
            "_id": filterd
        }, function (err, results) {

            res.redirect('/posts/1');
        });

    }

});

router.route('/post/update').post(function (req, res) {

    var database = req.app.get('database');
    var filterd = req.body.postid;

    database.PostModel.findOne({
        "_id": filterd
    }, function (err, results) {

        if (results) {
            res.render('postupdate', {
                results: results,
                req: req
            });
        }
    });

});

router.route('/post/recommend').post(function (req, res) {

    var database = req.app.get('database');
    var filterd = req.body.postid;

    database.PostModel.findOne({
        "_id": filterd
    }, function (err, results) {
        var can=0;
        
        if (results) {
            
            for (var i = 0; i < results.recommender.length; i++) {
            if (results.recommender[i].recommender == req.session.user.id) {
                results.star -=1;
                results.recommender.splice(i, 1);
               
                can =-1;
                break;
            }
        }
        if(can==0)
          {  results.star++;
            results.recommender.push({recommender:req.session.user.id});
          }
            results.save(function(err){
                if(err) throw err;
            });
            
            res.redirect(`/post/${filterd}`);
        }
    });

});




router.route('/process/post/update/:postroot').post(function (req, res) {

    var database = req.app.get('database');
    var postroot = path.parse(req.params.postroot).base;
    var paramtitle = req.body.title || req.query.title;
    var paramcontent = req.body.content || req.query.content;

    database.PostModel.findOneAndUpdate({
        "_id": postroot
    }, {
        "title": paramtitle,
        "content": paramcontent
    }, function (err, results) {

        if (err) throw err;
    });

    res.redirect('/posts/1');
});

router.route('/').get(function (req, res) {

    console.log('로그아웃 시도');
    if (req.session.user) {
        res.render('main', {
            can: 0,
        });;
    } else {
        res.render('login', {
            can: 0,
        });;
    }
});

module.exports = router;
