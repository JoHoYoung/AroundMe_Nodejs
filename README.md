# Proj_SoSo
#### 예비창업팀 '소소'(지역안전 커뮤니티 서비스). 팀 '소소' :  Society Solution라는 뜻, 사회문제 해결을 목적으로 결성한 창업 팀. 안전사고가 만연한 현 상황에서도 여전히 국민들의 안전불감증이 만연하고 있는 현실에서 그를 해결하기 위한 누구나 쉽게 접근할 수 있는 지역 안전 커뮤니티 서비스
- 중앙대 창업창직동아리 선정
- K-ICT 창업멘토링 대학생팀선정
- SVCA 최종 대회 출전팀
- 생활안전지도 활용 아이디어 공모전 우수상

https://qkraudghgh.github.io/node/2016/10/23/node-async.html
### Server : Nodejs(Express)

### Database : Mongodb + mongoose

### View : EJS(Embeded JavaScript)

## 2018.07.04 Developing Note
* * *

#### 1. 로그인 기능의 추가 . -> 몽고디비를 활용하여 저장, 비교하는 기능 구현
> 추가할점) 비밀번호를 암호화 하여 db에 저장해야함.

#### 2. 게시판 기능의 추가 . -> 글 작성, 저장하되 글 스키마에 유저아이디 속성을 두어 작성자를 비교함.
> 추가할점) 추천수 기능이 필요할지도 모름, 또는 여러가지 기능이 필요할지도모름. 일단은 스키마를 간단하게 설정하되 나중에 추가사항에 따라 스키마를 변경하여야함.

#### 3. 게시판 글들의 목록 -> 글을 눌렀을때 그 글들만의 각각 페이지로 구현해야함. 거기에 들어가야함. 동적으로 EJS가 필요할듯.

#### 4. EJS 템플릿 공부 -> EJS를 어느정도 사용하여 동적인 뷰파일, 게시판 글 목록들을 구현하는 것을 공부하였다. 좀더 공부하여 여러가지 기능을 구현할 수 있을 수준이 되어야함.

* * *
## 2018.07.05 Developing Note

#### 1. 회원가입의 비밀번호를 암호화하여 db에 저장하는 기능 구현.
```
 UserSchema
    .virtual('password')
    .set(function(password){
        this._password=password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){return this._password});
    
    UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
    UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});    
```
#### 2. 글 목록에서 제목을 눌렀을때 글만의 페이지로 이동하는 기능 구현.

#### 3. 댓글기능 구현.
```
 database.PostModel.findOne({
            "_id": filterd
        }, function (err, rawContent) {
            if (err) throw err;
            rawContent.commentcount += 1;
            rawContent.comments.unshift({
                content: req.body.content,
                writer: req.session.user.nickname
            });
            rawContent.save(function (err) {
                if (err) throw err;
            });
        });
```
#### 4. 댓글, 글들의 삭제기능 구현. 현재 세션의 사용자와 비교하여, 작성자만 삭제, 수정 할 수 있게끔 구현 완료.
> 추가할점) 게시판글 ,제목, 댓글의 수정기능 구현.

#### 5. 게시판 글들의 스키마 수정, 다듬음 추천수 기능 구현을 위해 스키마 수정. 추후 구현 예정.

#### 6. EJS 템플릿사용 동적으로 게시판을 보여주는 페이지 구현, 그리고 하나의 EJS파일로 모든 게시글의 자체 페이지 구현 완료하였음.

#### 7. 라우트 정리, 코드정리 할 필요 있음.

* * *

## 2018.07.06 Developing Note

#### 1. 작성자가 게시글 제목, 내용 수정하는 기능 추가.

#### 2. 댓글 수정기능 실패
> 작은 창을 띄워 거기에 적은내용으로 수정하는 기능을 구현하려 하는데 데이터 전달하는..?방법이 난처해서 실패하였다.. 다음주 안에 구현하자.

#### 3. 대부분의 html 파일을 ejs로 바꾸었다. ejs에 대한 이해가 조금씩 생기는 중.
> ejs는 정말 편한것 같다. html을 동적으로 구현할 수 있다니. 대단함.
* * *
## 2018.07.08 Developing Note

#### 1. 조회수 기능 추가.
> view의 숫자를 늘린후 save를 하는 과정이 find로 하면 실패하고 findOne을 한후 save를 하면 되었다. 진짜 몇시간 동안 했는데 도대체 왜 안되는지 모르겠다. 힘들었다 몇시간동안 실패했다.

#### 2. 게시글 추천기능 추가.
> 같은 사용자는 해당게시물에 한번밖에 추천 못하고, 한번더 누를시 추천이 취소되는 기능 구현.. 힘들었다.

#### 3. 페이지를 10개씩 나누어서 보여주는 기능 구현
> 이것도 정말 힘들었다.. 현재는 모든 게시물 수를 받아서 게시글 페이지의 Max범위를 산출하여야 하는데 도대체 왜 전체 데이터의 갯수를 받아오는 count가 작동 안하는지 모르겠다. 이것도 몇시간 했는데 진짜 해결할 수 있긴 한걸까???

#### 4. ejs에서 계속 에러나서 힘들었다. brace가 잘못된건지 ..계속 같은부분 뚫어져라 봤을때 못찾았는데 다지우고 처음부터 하니 작동하였다 왜 안되는지 모르는 에러, 왜 되는지 모르는 상황 이런상황이 제일 힘든것 같다.

#### 5. 댓글 수정기능, 10개씩 나눠서 보여주는 기능의 Max 페이지 범위를 더 만들 필요가 있다.

* * *

## 2018.07.11 Developing Note

#### 1. 사진 업로드 기능 추가.
> multer모듈을 이용해 사진을 업로드 기능을 구현 하였다. 업로드된 사진 파일은 db에 저장되며 각 사진들은 파일명으로 각 게시글에 귀속된다. 게시글을 열었을때 귀속된 파일명을 참조하여 게시물에 같이 올린 사진이 나타나게 하였다. -> 사진업로드시 미리보기, 그리고 글 삭제, 수정시 이미지파일의 삭제, 수정 하는 기능을 추가하여야 한다. 사진업로드 미리보기는 정말 오래걸릴것 같은 예감이 든다.
```
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
```

#### 2. 글작성자가 글삭제, 수정을 눌렀을때 바로 실행하지 않고 사용자에게 중요한 작업이니 만큼 한번더 묻는 팝업이 뜨는 기능 추가.
> mordal을 이용하여 한번 더 묻도록 구현하였다. 낯선 작업이라 오래 걸린것 같다. bootstrap없이 자체적으로 mordal을 디자인 하여 사용해보고 싶다. 아직은 backend쪽 공부중이라 어느정도 되면.. 10월쯤? 이면 front를 공부할 여유가 생겨 시작할것 같다. 잘은 모르지만 vue.js를 배워보고 싶다.

#### 3. 모든 html파일 ejs화.
> 처음에 기초를 구현할때는 html로 충분하지만 점점 개발한 것들이 쌓여가다 보니 html로는 한계가 있는것 같다. ejs는 정말 좋은 템플릿 인것 같다. 아직도 brace닫는 부분에서는 실수가 나서 10분씩 눈을 치켜뜨고 찾곤 한다.

#### 4. 게시글 카운트를 정상적으로 받아와서 게시글을 10개단위로 페이징 하는것에 성공하였다.
```
database.PostModel.find({
            "areagroup": -1
        }).sort('-created_at').skip((skip - 1) * 10).limit(10).exec(function (err, results) {..
```
* * *

## 2018.07.13 Developing Note

#### 1. 사진 업로드 기능 보수작업 ) 다중 업로드 기능 추가.
> multer 모듈을 활용해 사진을 여러장 올리게끔 구현 하였다. 사진을 올리기전에 미리 보여주는 작업은 너무 어려운것 같다. 몇시간을 투자했으나 아직 구현하지 못하였다. 반드시 구현하고 말것이다.
```
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
```

#### 2. 글 작성 보수작업.  
> 지금 진행하는 soso 창업팀 프로젝트에 따라 게시글을 작성할때 작성자의 지역을 입력하는 것이 필요해 보였다. button dropdown 식으로 구현하였다. 그리고 글작성을 보수하였다. 지금까지는 글제목, 내용이 비어있어도 작성이 가능했는데 글제목 또는 내용이 비어있으면 작성이 불가능하여 error 메세지가 뜨도록 구현하였다. 지금은 InnerHTML로 에러메세지를 해당 위치에 추가하는 낮은 수준이지만 곧 css로 입력되지 않은 부분의 바깥박스가 옅은 붉은색으로 바뀐다던가 하는 기능으로 바꿀것이다. 알고리즘은 모두 작성해 놓았으니 css만 익혀 바꾸면 되는 것이다.

#### 3. 모든 html파일 ejs화.
> 처음에 기초를 구현할때는 html로 충분하지만 점점 개발한 것들이 쌓여가다 보니 html로는 한계가 있는것 같다. ejs는 정말 좋은 템플릿 인것 같다. 아직도 brace닫는 부분에서는 실수가 나서 10분씩 눈을 치켜뜨고 찾곤 한다.

#### 4. 이것 저것 혼자서 backend쪽을 구현하다 보니 정신이 없다. 까먹고 불가능하다고 생각하던 댓글 수정 기능은 Mordal을 활용하면 가능할 것 같다. 개발한게 쌓이다보니 점점 해답을 찾는 능력이 향상되는것 같다.

* * *

## 2018.07.15 Developing Note

#### 1. 드디어 사진 올리기전 미리보기 구현에 성공하였다. 이것때문에 몇일 몇시간을 고생했는지 모르겠다.
> 사진을 올리기전에 미리보기 기능을 구현하느라 정말 며칠간 애먹었는데 드디어 성공했다. 한술 더떠 게시글을 작성하기전 올린 사진을 클릭하면 업로드 취소 기능까지 만들었다. 휴.. 정말 기나긴 여정이었다. 이제 남은것은 사진을 올려 이미 작성한 게시글 수정을 눌렀을때 올렸던 사진들이 사진 올리기 미리보기처럼 뜨고 그것또한 삭제, 할 수 있어야한다. 그리고 이미 업로드 되었던 사진을 삭제 하려고 하면.. 무엇을 삭제할지 정보를 받아서 db 및 사진저장소 에서 삭제해야 하는데 어떻게 해야하는지 정말 고민이다.. 큰일이다..
```
    <script type="text/javascript">
        $(document).ready(function() {
            if (window.File && window.FileList && window.FileReader) {
                $("#files").on("change", function(e) {
                    var files = e.target.files,
                        filesLength = files.length;
                    for (var i = 0; i < filesLength; i++) {
                        var f = files[i]
                        var fileReader = new FileReader();
                        fileReader.onload = (function(e) {
                            var file = e.target;
                            $("<div id=\"preview\">"+"<span class=\"pip\">" +
                                "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + "목록에서 제거" + "\"/>" +
                                "</span>"+"<span class=\"cover\">"+"</span>"+"</div>").insertAfter("#uptarget");
                            $("#preview").click(function() {
                                $(this).remove();
                            });
                        });
                        fileReader.readAsDataURL(f);
                    }
                });
            } else {
                alert("Your browser doesn't support to File API")
            }
        });

    </script>
```

#### 2. 핫 게시판 구현.  
> 게시글들 중 추천수가 10개 이상인 것들을 모아놓은 핫 게시판을 구현하였다. 몽고db 쿼리 $gt를 이용해서 하였다. 나중에는 mysql로도 구현해보고 싶은데... 정말 막막하다. 언어가 너무많고 프레임워크도 너무많은데 db도 너무 많으니 .. 이걸 어떻게 다 알고 해보지? 정말 큰일이다. 일단 지금 공부하는 Node js , Mongodb가 익숙해 지고 나면 Spring, Mysql을 공부해 보고 싶다.

* * *

## 2018.07.17 Developing Note

#### 1. 게시글 수정시, 업로드한 사진 보기, 해당 사진 클릭시 삭제기능 구현.
> 이미 업로드한 사진들을 업로드할때 사진 미리보기 하는것과 같은 모양으로 보여주고, 클릭시 삭제 기능을 구현하였다. 클릭하면 index를 받고, 여러개일 경우 그때마다 push하여 서버로 배열을 전달, 그 index들에 해당하는 사진파일 삭제, 게시글 스키마에서 사진 이름을 저장하는 배열 splice를 해주었다. 이때 큰 문제가 생겼는데 splice를 하니 배열들이 앞으로 당겨지고, 비어있는 index의 사진을 제거하자니 에러가 났다. 방법을 한참 고민하다 인덱스들을 내림차순으로 sorting한 후 splice를 진행하니 문제가 해결 되었다. 이 아이디어를 떠올리고 나니 뿌듯했다. 아무튼 정말 오래걸린 작업이었다. 3일내내 노트북 앞에서 머리를 잡아 뜯었다.
```
프론트단 (삭제할 사진들의 정보들을 전달)
      $(".cover").click(function(){
              todelete.push((this).id);
              console.log((this).id);
              console.log(todelete);
                 $(this).parent("#preview").remove();
            $(this).remove();
    document.getElementById("delimg").value = todelete;     
    });

서버단 (Sort 한후 삭제)
 todelete = todelete.split(',');
        todelete = todelete.sort().reverse();

        for (var i = 0; i < todelete.length; i++) {
            if (todelete[i] != '') {
                fs.unlink(`./uploads/${results.images[todelete[i]].images}`, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
            results.images.splice(todelete[i], 1);

        }
```

* * *

## 2018.07.19 Developing Note

#### 1. view파일들 최소화.
> 게시판과, 핫게시판 두개를 만들었었는데 개발을 하다 문득 떠오른 생각이 이 파일들이 따로 필요한가 였다. 차이는 내용의 차이 뿐이었다. 그래서 핫 게시판의 ejs파일을 지우고 게시판 ejs파일로 통합하였다.

#### 2. 게시글 검색기능 구현.  
> 몽고db의 쿼리 $regex를 사용하여 검색기능을 구현하였다. 검색결과 게시글들도 하나의 ejs파일에 다 렌더링 하니, 코드가 길고 복잡해졌다. view파일을 최소화 하는건 잘하는것 같은데 내용만 다른 페이지 라면 현업에서는 어떻게 하고 있는지 궁금하다. 현업에서는 코드가 훨씬 길텐데 내용만 다르더라도 여러개의 ejs파일로 관리하는지 아니면 나처럼 하나로 하는지.. 아직 공부단계라 잘 모르지만 나중엔 현업에서는 어떻게 하는지 알고싶다. if문이 많은데 if문은 느리다고 알고있다. 이게 나중에 문제가 되지는 않을까 걱정이다.

#### 3. 회원가입 과정, user 스키마 추가 수정.
> 아이디, 비밀번호, 이름만 입력하면 회원가입이 가능했었다. 하지만 더 추가할 필요가 있을것 같아 성별, 휴대폰 번호, 이메일 등 여러가지를 추가하였다. 휴대폰 인증도 하고싶은데... 방법이 잘 찾아지질 않는다. 일단 이메일 인증으로 가입하는 방법을 찾아보고 있다. 이메일 인증 정도는 7월 안에 구현할 생각이다. 이메일 인증으로 일단 구현하고 나중에 휴대폰 인증을 추가해야 겠다.

* * *

## 2018.07.21 Developing Note

#### 1. 회원가입 과정, nodemailer 를 사용하여 이메일인증 구현.
> nodemailer 모듈을 사용하여 회원가입시, 이메일인증을 하기 전까진 가입은 되었으나 로그인 불가, 이메일로 보낸 링크를 타면 임시저장할때 생성한 토큰과 비교(비정상적인 경로로의 접근을 차단하기 위해 토큰 랜덤생성), 일치하면 회원가입승인, 로그인가능 하게 만들었다. nodemailer 모듈을 처음 접하다보니 익숙하지 않아 사용법을 익히는데 오래걸렸다. 몇시간은 걸린듯 하다.
```
프론트 단에서의 토큰 생성 과정
var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 8; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

nodemailer 메일 발송 과정
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '******',
            pass: '****'
        }
    });

    let mailOptions = {
        from: 'whghdud17@gmail.com',
        to: email,
        subject: '소소에서 본인 확인인증 메일 보내드립니다',
        html: '<p>아래의 링크를 클릭해주세요 !</p>' +
            "<a href='http://localhost:3000/auth/?id=" + paramId + "&token=" + tokken + "'>여기를 눌러 인증해주세요</a>"
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
서버단에서의 인증과정
router.route('/auth').get(function (req, res) {

    var database = req.app.get('database');
    var paramid = req.query.id;
    var tokken = req.query.token;
    console.log(paramid);

    database.UserModel.findOneAndUpdate({
        "id": paramid,
        "tokken": tokken
    }, {
        "auth": 1
    }, function (err, results) {

        if (err) throw err;
    });
    res.redirect('/main');
    res.end();

});
```
#### 2. 스키마 변경
> 개발이 쌓여갈수록 스키마가 계속 바뀌고, 라우트가 계속 바뀌고있다. 애초에 개발을 시작하기 전에 스키마, 라우트 부터 세우고 시작했어야 했는데 아무것도 모르는 상태라서 일단 뭐라도 만들면서 해보자 라고 시작했던 것이 지금 일이 커졌다. 점점 바뀌는 스키마, 추가되는 기능, 그에따라 라우트 수정등등 점점 복잡해지고 있다. 프로젝트가 작았을때는 기능 하나 추가하는것이 그렇게 힘든일이 아니었는데 점점 커지면 커질수록 기능하나 추가, 조금 바꾸는 것이 복잡해 지고 있다. 한달후에 개발이 쌓여서 프로젝트가 더 커지면 나 혼자서 이것들을 감당할 수 있을까? 기능을 하나 추가하는데 나 혼자 힘으로 가능할까? 혼자서 백엔드 개발 하는것은 쉬운일이 아니며 사람들이 하나 추가해달라는것이 개발자 입장에서 정말 골치아픈일이라고 말하는것을 조금씩 알것 같다.

#### 3. 앞으로 추가할것에 대해.
> 아직 큰 틀을 잡지 않아 무엇을 추가해야할지 모르겠다. 프로젝트가 더 커지기 전에 무슨무슨 기능을 추가할지, 구성, 흐름등을 세워야 겠다. 이대로 가다가 나중에 추가하자고 그러면 너무 힘들것 같다. 아니면 백앤드 개발자를 한명 더 구하던지.. 일단은 Facebook 계정을 통해 로그인 하는것을 구현하고 그 후에 Naver , kakao 등도 추가할 생각이다.

* * *

## 2018.07.22 Developing Note

#### 1. OAuth(FaceBook)구현.
> passport-facebook 모듈을 활용하여  Facebook계정으로 로그인 하는것을 구현하였다. 페이스북에서 제공하는 정보는 이름, id 값 등이었는데 id값은 231213123같은 숫자로 되어있었다. 때문에 지금껏 만들어왔던 스키마를 또 변경하였다. 지금까지는 글 작성자, 이용자의 아이덴티티를 아이디로 정하였는데 페이스북 계정 로그인을 추가함으로서 닉네임 이라는것을 사용해야했다. 일단 페이스북으로 인증이 되면, 사용자에게 닉네임을 입력하고 그것으로 모든 이용자의 음.. 말하자면 데이터베이스의 기본키 같은 개념으로 설정하기로 하였다. 스키마를 계속 변경하게된다.. 내일도.. 모레도.. 언제쯤 틀이 딱 잡힐까. 8월안으로는 어느정도 서비스가 가능하게 안정적이면 좋겠다. 이또한 처음 써보는 모듈이라 너무 힘들었으며 추후에 kakao, naver 로그인도 구현해야겠다. 이것도 4시간은 걸린듯 하다..
```
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: '****',
        clientSecret: '***',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);
    }
));

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
```
> OAuth를 통해 넘겨주는 값을 그대로 유저들이 사용하기엔 문제점이 많았다. 페이스북에서 제공하는 아이디는 숫자로 길게 이루어져있어 사용하기에는 난처했다. 따라서 페이스북으로 최초 로그인시 닉네임을 설정하게했다. 그리고 두번째 페이스북 로그인 부터는 설정 없이, 로그인이 가능하게끔 구현하였다. 닉네임을 설정하게 한 이유는 닉네임은 중복될수 없는 유일성을 충족하는 값이기 때문이다.
* * *

## 2018.07.23 Developing Note

#### 1. 게시판 세분화 복잡한 작업.(지역별 게시판 추가)
> 지금껏 게시판이 하나만 있었다. 게시판의 갯수를 늘리는것은 문제가 아니지만 다른 성격의 게시판을 추가해야 했다. 글을 작성할때 화제, 이슈의 지역을 반드시 선택 해야하는 게시판을 만들어야 했다. 글을 쓸때 지역(서울시 내 구)을 반드시 선택해야 하며 게시판에 표시되는 글들도 구 별로 분류 할 수 있어야 했다. 버튼 드랍다운을 통해 토글식으로 지역을 선택하면 그 지역을 선택하여 작성한 글들만 보여주는 작업을 하였다. 기존 게시판과는 다른 성격이기 때문에 스키마를 변경하고, 새로운 ejs파일 두개를 만들었다. 게시글들을 보여주는 게시판과 글을 작성하는 ejs. 함수, 라우트도 하나하나 추가하였다. 지금까지 쌓아놓은게 있어서 거기에 어떤 한 기능을 추가하려니 정말 오래걸렸다. 게시판과 비슷한 기능에 조금만 추가하면 되는거라 방법은 머리속으로 알았지만 구현하는 과정에서 실수, 놓친것들이 너무 많아 디버깅에 수많은 시간을 쏟았다. console.log만 300번정도 적은것 같다. 몇번의 디버깅으로 오류를 잡아낼 수 있는 실력을 갖고싶다. 그리고 프로젝트가 더 커지기전에 기능, 컨텐츠를 세우고 작업을 해야겠다. 나중에 추가하려면.. 정말 대참사가 일어날지도 모른다.

#### 2. 내일 할것
> 게시판 기능 다듬기, 글수정, 삭제, 기능 다듬기, route정리, 코드정리(코드가 너무 중구난방이다. 정리해야겠다. 진짜 코드정리해야지. 진짜). 지금까지 만든것 오류체크, 다듬기.. 진짜 많이 부족하다 오류안나게 잘 다듬어야 겠다 (세션, 권한 관련).

* * *

## 2018.07.25 Developing Note

#### 1. 해결게시판 추가.
> 지역주민들의 제보를 받아 우리가 해결한 것들을 게시하는 게시판을 추가하였다. 해결한것은 직관적으로 보기 좋아야 하므로 다른 게시판처럼 제목으로 List가 표시되는것과 달리 사진으로 띄워서 직관성이 있게 구현하였다.

#### 2. 메인화면 컨텐츠 추가
> 회의를 통해 메인화면에 핫게시물의 일부, 우리가 해결게시판 내용의 일부를 표시하기로 하였다. 핫게시물의 일부는 텍스트 제목으로, 해결게시판의 일부는 사진으로 띄우기로 하였다. 이에따라 메인화면에 rendering  할 데이터를 추가, 수정하였다.

#### 2. header.ejs, footer.ejs 추가.
> 보통의 홈페이지를 보면 다른 페이지로 이동하여도 맨위의 헤더는 여러 목록들, 밑에는 우리의 위치, 번호등이 뜨도록 되어있다. Around Me 홈페이지도 그 방식을 채택하여 홈페이지가 바뀌어도 똑같은 헤더, 푸터가 뜨도록 하기위해 ejs를 추가하여 구현 하였다.

#### 3. 회원가입시 내용의 유효성체크 및 수정, 스키마추가, 글작성시 내용의 유효성체크
> 회원가입시 입력된 정보가 양식에 맞지 않거나 글 작성시 제목, 내용이 없는등 양식에 맞지 않는 데이터를 제출 하였을때 제출이 되지 않고, 에러메세지가 뜨도록 하였다. 일단은 태그를 하나 선언해놓고 InnerHTML만 수정하는 식으로 했는데 나중에는 style을 바꾸어서 색깔이 바뀐다던지 하는 방향으로 갈 것이다. 형태는 다 잡아놨으니 구상, 디자인을 손보면 될것이다.

* * *

## 2018.07.26 Developing Note

#### 1. 검색기능 수정
> 게시판 마다 검색되는 정보가 다를 것이기 때문에 여러 라우트들을 추가, 수정 및 달라지는 정보 렌더링을 위한 라우트 추가 등, 여러가지 작업을 하였다. 핫게시판에서 검색했는데 해결게시판의 내용이 나오면 안되기 때문이다. 구현완료.

#### 2. 개인정보 페이지 구현
> 회원가입시 입력받은 개인정보를 보는 페이지를 추가하였다. 곧 수정도 할 수 있게 만들것이다. 비밀번호를 잊어버렸을때 재발급을 위한 tokken및 메일인증을 통한 접근권한 설정..등을 추가 해야한다. 번거로운 작업일것 같다.

#### 3. 렌더링 되는 정보 구체화.
> 글작성일자에 너무많은 정보를 보여주고 있어 보기 좋지 않았다. 문자열을 편집하여 2018년일경우 2018은 제거, 초단위를 제거하여 보여지도록 구현하였다.

* * *

## 2018.07.27 Developing Note

#### 1. 제보게시판 추가.
> 지역구민들의 제보를 받는 게시판을 추가하였다. 여러사람들이 여러 제보를 할 것이기 때문에 모든 정보를 사용자들에게 보여줄 수 없다. 따라서 추천수가 일정수 이상 넘는 게시물들을 우선적으로 보여주되 그 구역을 분할하여 맨위에 따로 표시하도록 하였다. 밑에는 다른 게시판들 처럼 작성일자 순으로 표시된다. 추천수가 일정 수 이상인 것들은 그 글들의 정보를 모두 받아 슬라이더형태로 넘어가고, 버튼클릭을 통해 넘길 수 있게끔 구현하였다.

#### 2. 글 작성시 글 데이터베이스에 저장되는 작성자를 id에서 닉네임으로 변경.
> 페이스북의 경우 id가 숫자로 되어있고 보기에 안좋기 때문에 글작성 시 저장되는 writer를 닉네임으로 변경하였다. 페이스북 사용자가 최초 로그인 할때 닉네임을 받고, 닉네임은 중복이 되지 않기때문에 문제없을거라 판단, 수정 하였다.

* * *

## 2018.07.29 Developing Note

#### 1. CSS 공부.
> 서버쪽을 끝낸것도, nodejs를 잘 다루는것도 아니지만 요즘 효율이 안좋고, 나중에 혼자 다른 backend공부를 할때도 필요할것 같아 조금씩 하고있던 html,css를 공부하고, 몇가지를 디자인 해 보았다. 검색창을 디자인 해 보았는데 마음에 든다. 프론트를 작업하고 있는 팀원을 도와 같이 css작업을 할 수준이 될 정도로 공부를 하려 한다.

#### 2. 사진 자세히보기 구현.
> 게시글에 첨부되어 보여지는 사진을 클릭하였을때 확대하여 보여주는 모달을 구현하였다. 게시글에서 사진을 볼 수 있지만 자세히 보기에는 무리가 있다. 사진을 클릭하면 자세히 볼 수 있게끔 모달을 띄워 볼 수 있도록 구현하였다.

* * *

## 2018.08.01 Developing Note

#### 1. 지역별게시판 지역선택 버튼을 버튼드롭에서 svg로 대체
> 지역별 게시판에서 지역을 선택할때 버튼드롭으로 선택하던것을 직관성, 디자인을 고려하여 지도 svg파일로 지도에서 지역을 선택하면 바뀌는 것으로 수정 하였다.

#### 2. 라우트 수정, 다듬음
> 프로젝트 파일의 코드길이가 너무 커져서 알아보기 힘들어 졌다. 수정, 다듬었다.

#### 3. 컨텐츠 회의.
> 컨텐츠가 많이 부족한거 같아 회의.

* * *

## 2018.08.02 Developing Note

#### 1. 메인화면 및 여러 화면 css 작업.
> 메인화면 디자인 작업. 크게 보여줄 사진이 넘어가는 슬라이더 추가, 게시판, 글쓰기 등 수많은 css 작업..

* * *

## 2018.08.03 Developing Note

#### 1. 부트스트랩을 쓰지 않고 모달 구현.
> 부트스트랩을 사용한 모달은 디자인등의 커스텀하기가 좋지 않아 부트스트랩을 빼고 자체 모달을 제작, 구현 ,적용 하였다. 일단은 게시글 삭제, 댓글 삭제 등등 에 적용하였고 추후에 댓글 수정 기능을 구현하여 모달에서 입력을 받아 그 값으로 수정하도록 구현 예정.

#### 2. 댓글 수정기능 구현.
> 저번에 실패하였던 댓글 수정기능을 구현하였다. 삭제기능을 만들면서는 도저히 방법이 떠오르지 않아 실패 했었는데 한달동안 공부가 좀 되었는지 금방 구현하였다.

#### 3. 검색기능 다듬기.
> 검색기능이 중구난방으로 되어 있었다. 핫게시판 검색창에서 검색하면 자유게시판이 나오는 둥 제대로 사용할 수 없었는데 ejs 파일로 render할때 변수 하나를 전달하는 방식을 사용하여 사용할수 있게 되었다.

* * *

## 2018.08.05 Developing Note

#### 1. 스키마 등, 나중에 까먹을 만한 설정사항 정리
> 스키마의 값을 이용하여 데이터를 불러올때 내가 정한 임의의 값으로 불러오게 되어있는 것들이 너무 많다. 프로젝트가 쌓이면 나중에 까먹거나 혼동이 생기면 아주 곤란한 상황이 될 것 같아 txt파일에 정리 하였다.

* * *

## 2018.08.08 Developing Note

#### 1. 게시글에서 목록으로를 눌렀을때 모두 같은 게시판으로 가게되는 현상 해결
> 각 게시글에서 목록으로를 누르면 모두 자유게시판으로 가졌다. 하나의 post.ejs 파일로 모든 게시판의 모든글들을 데이터만 바꾸어서 보여주기 때문에 이런 문제가 생기는 것이었다. url정보를 더 추가하기 싫었는데 방법이 없어 url에 어느 게시판에서 왔는지 정보를 추가하여 해결하였다.

#### 2. 모달을 사용해 댓글 수정기능 구현
> 작성자가 댓글 수정을 누르면 모달이 나타나며 모달의 textbox에 입력한 값으로 댓글의 내용이 변경된다.

* * *

## 2018.08.09 Developing Note

#### 1. 몽고DB Date.now 사용시 한국시간과 맞지 않는 현상.
> 게시글 작성 일자를 Date.now 값을 주었을때 한국시간보다 9시간이 빨랐다. 왜그런가 알아보니 국제표준시를 사용하며, 지역별 시간은 지원하지 않는다고 한다. 그래서 저장할때 9시간을 더해서 저장해 주었다. 
```
Date.now => new Date().getTime() + 1000 * 60 * 60 * 9
```

#### 2. 글쓴후, 로그인 한 후 즉, 사용자가 어떤작업을 한 후의 경로 동적으로 변경.
> 어떤 작업 이전의 path를 받아오는 법을 몰라서 로그인, 글쓰기 등 의 작업을 하면 메인, 어떤 특정한 게시판 등으로 경로설정을 해놓았었다. 로그인 하지 않은 사용자가 글을보다 댓글을 달고자 로그인을 하면 메인으로 돌아가게 되어있었는데 사용자 입장에서 불편할 것 같아 언젠가 수정해야지 하다 오늘 공부를 하여 수정했다. db를 바꾸는 route를 제외하고 단순히 보기만 하는 작업은 path를 session에 저장해 둔다. 그리고 로그인을 하면 저장된 route로 돌아가고 글을 쓰고 난 후에는 자신이 쓴 글로 이동한다. 
```
req.session.returnTo=req.path;
```
* * *

## 2018.08.10 Developing Note

#### 1. 팀을 이루어 작업한다는 것.
> 의사소통이 잘 되지 않아 팀원들이 한 프론트작업, 내가 한 서버작업을 합치는 와중에 날아간 코드들이 많았다. script태그가 날아가고... 설정해 놓았던 form tag의 id값이 날아가고.. 바뀌고.. 검색이 안되고... 정말 고생을 했다. 의사소통이 제대로 되지 않은채로 작업을 맡기고, 하니 이렇게 되는구나.. 큰 깨달음을 얻었다. 앞으로는 .. 날아갈일이 없진 않겠지만 최대한 덜 날아가는 방향으로 되도록 작업을 해야겠다.

#### 2. 굳이 모달이 아니어도 되는것 제거 -> window popup으로 대체.
> 사실 댓글수정 기능을 제외하고는 모달을 쓸 필요가 없는것 같았다. 모달을 제거하고 popup으로 대체하였다. document.getElementById(todel).submit();기능을 유용하게 써서 가능했다. 댓글 수정기능은 저번에 모달로 구현하였는데 정말 유용한것 같다.

* * *

## 2018.08.12 Developing Note

#### 1. 메인화면 사진 넘어가는 부분 slider 구현
> js를 활용해 버튼을 눌러 다음사진, 2초마다 한번씩 다음사진 으로 넘어가게끔 슬라이더를 구현하였다.

#### 2. 여러가지 기능들 호환을 위한 라우트, 변수 수정
> 기능을 수정, 개선하였으나 파일이 너무 많아 적용이 안된 페이지가 많았다. 수정하여 적용 하였다.

* * *

## 2018.08.13 Developing Note

#### 1. cookie에 대하여 공부
> cookie 모듈을 설치 하긴했으나 사용하지 않고 있었다. 사용법을 모르기도 하고 어디에 쓰는지도 몰랐기 때문이다. 공부를 하여 무엇인지, 어떻게 쓰는것인지 알게 되었으나 왜 쿠키를 써야하는지 어떤 상황에서 써야하는지는 잘 모르겠다... 대부분은 지금 사용하고 있는 session을 쓰는 방법으로 다 가능하기 때문인데.. 잘 모르겠다.

* * *

## 2018.08.14 Developing Note

#### 1. passport모듈에 대하여 공부
> 페이스북 로그인 기능같은 경우는 passport로 구현 하였는데 기능을 구현하는 시점에는 어느정도 코드를 알아 볼 수 있어 구현이 가능하였던 거였고 처음에 로그인 기능을 만들때 passport로 구현을 하려 했으나 너무 어렵고 뭔말인지 모르겠어서 실패했다. passport를 사용하지 않아도 지금 잘 돌아가는 상태고, 문제가 없어보이는데 다들 이 모듈로 구현을 하는것 같길래 나도 공부를 하였다. 내일 구현을 해봐야겠다. 공부를 했으나 아직도 내가만든 로그인, 인증 기능이 passport에 비해 어떤점이 부족한지 잘 모르겠다.

* * *

## 2018.08.15 Developing Note

#### 1. 로그인, 인증기능 passport로 재구현.
> 예전에 구현해놨던 기능을 passport모듈을 사용하는 것으로 바꾸었다. 공부한 부분에서는 내가 원하는 기능까지 자세하게 알려주지 않아 바꾸는데 아주 고생하였다. 수많은 구글링..  어렵게 어렵게 성공하였다. 이미 만들어 놓은것을 다른것으로 바꾸는 것이 정말 어려움을 알게 되었고 차라리 다 지우고 처음부터 다시 만드는것이 더 쉬울것 같다는 생각을 하였다. 구조같은것을 잡지 않고 무조건 만들고 보자는 식으로 마음먹고 시작해서 그런지 복잡했다. passport로 바꾸기는 했으나 원래 되어있던 기능보다 부족한 부분을 잘 모르겠다. passport의 장점을 잘 모르겠다. 원래 했던 방식은 복잡했으나 passport도 충분히 복잡했으며 속도가 더 빠른지? 도 모르겠고 어렵기만 엄청 어려웠다. 나중에 실력이 오르면 뭐가 좋은지 알 날이 오겠지..
```
LocalStrategy 정의
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

정의 후, 라우트의 Parameter로 passport 전달
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

정의한 방침으로 자동으로 인증해준다.
```
* * *

## 2018.08.16 Developing Note

#### 1. svg에 링크 걸기
> svg 지도파일에 지역별 게시판 링크를 걸어 정상적으로 작동하도록 구현하였다.

#### 2. 지역별 게시판 정적인 부분 동적으로 변환
> 지역별게시판에 들어가면 어딜가든 전제게시판 이라고 표시되었는데 지역에 맞게 표시되도록 바꾸었다. 다른 여러 정적인 부분도 동적으로 바뀔 수 있게끔 ejs를 활용해 바꾸었다.

#### 3. 모든 게시판에 컨텐츠가 추가되었음  -> 렌더링 해줄 데이터 추가.
> 게시판에 추천수가 제일 높은 상위 5개 게시물을 보여주도록 컨텐츠를 추가하였다. 이에따라 DB에서 데이터를 끌어와 랜더링 하는 항목도 추가 하여 뷰템플릿에 적용했다.

#### 4. 검색 라우트 수정
> 또 검색이 고장났다. 수정, 구현 하였음

#### 5. 지역별 글쓰기 방식 변경
> 버튼 드랍다운으로 지역을 골라 쓰자니 25개의 구가 있어 곤란했다. 25개나 되는 구를 드랍다운으로 구현하면 직관성이 많이 떨어질거라는 생각이 들었기 때문인데 이에따라 svg로 대체하여 구현 할 예정이다.

#### 6. 메인화면등의 여러 컨텐츠 문제.
> 회의를 통해 결정을 해야될 부분이다. 많이 부족하다.

#### 7. 글쓰기, 추천, 삭제 등을 진행했을때 redirect 되는 경로 설정, 변경.
> 글쓰기나 추천 같은것을 하고 난 후 돌아가게 되는 페이지가 왠지 사용자에게 좋지 않은것 같다는 생각이 들어 좋다고 생각이 드는 방향으로 바꾸어 구현하였다.

#### 8. 오늘의 느낀점
> 프로젝트가 커지고 코드가 점점 쌓이니까 힘들다... 하나바꾸는것도 하루종일 여러개.. 뭐오류나도 찾는데 반나절.. 힘내자

* * *

## 2018.08.17 Developing Note

#### 1. 제보게시판 추천수 많은 게시물 css.
> 추천수가 높은 게시물을 보여주는 박스를 css 작업 하였다. css를 아직 능숙하게 다루지 못하여 오래 걸렸으며 꾸며도 마음에 안들고 촌스럽고.... 디자인이 이상해서 바꾸고 고치고 수정하고 구글링하고 .. 엄청 오래걸렸다 꾸민건 하나뿐인데 허탈하기도 하다. 디자인을 조금 공부해야하나 라는 생각도 했지만 일단 css부터 능숙하게 다룰 수 있어야 할 것 같다.

* * *

## 2018.08.19 Developing Note

#### 1. 네이버 지도 API 사용, 적용
> 처음에는 구글지도를 사용하려 했으나 돈이 드는것 같다 네이버지도 API로 구현하였다. 한번도 써본적이 없어 많이 낯설어 헤메기도 했지만 어찌어찌 해냈다. 주변에 사고난 지역에 Maker를 표시하며 마크를 클릭하면 간단한 정보, 위치 등을 보여주게끔 구현하였고 좋은 경험이었다. 지도 API를 사용하는것이 거의 처음이라 두려웠지만 막상 사용해보니 별로 어렵지는 않았다. 나중에 다른 여러 API를 사용할때 두려움 없이 접근할 수 있을것 같다.
```
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=*****&submodules=geocoder"></script>

 var position = new naver.maps.LatLng(37.503804, 126.955782);

        var map = new naver.maps.Map('map', {
            center: position,
            zoom: 12, //지도의 초기 줌 레벨
            minZoom: 5, //지도의 최소 줌 레벨
            zoomControl: true, //줌 컨트롤의 표시 여부
            zoomControlOptions: { //줌 컨트롤의 옵션
                position: naver.maps.Position.TOP_RIGHT
            }
        });

마커의 위치정보.
        var soso = new naver.maps.Marker({
            position: new naver.maps.LatLng(37.503804, 126.955782),
            map: map
        });

창에 표시될 정보 내용
        var SoSoString = [
            '<div class="iw_inner">',
            '   <h3>Society Solution</h3>',
            '   <p>서울특별시 동작구 흑석동 흑석로 84<br />',
            '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
            '   </p>',
            '</div>'
        ].join('');

클릭 리스너로 전달해줄 윈도우 창.
        var sosowindow = new naver.maps.InfoWindow({
            content: SoSoString
        });

리스너 등록.
        naver.maps.Event.addListener(soso, "click", function(e) {
            if (sosowindow.getMap()) {
                sosowindow.close();
            } else {
                sosowindow.open(map, soso);
            }
        });
```

#### 2. 게시판별 서브게시판 컨텐츠 구상, 적용
> 자유게시판, 지역별 게시판 안에 어떤 서브게시판이 있을까를 고민한 후 자유게시판에는 고민상담, 한줄글, 사건사고, 공지사항등을 추가, 지역별 게시판에는 동호회, 축제정보, 사진자랑, 홍보 게시판을 추가하였다. 한번에 8개나 추가하게 되어 글생성, 글수정, 게시판 표시 등 작업을 하는데 많은 시간이 걸릴것 같다. 예전에 했던 작업의 반복이라 기술적인 어려움은 없을것 같고 많은 노가다(?) 노동의 과정이 필요할 것 같다.

#### 3. 구상한 서브게시판 스키마, 라우트, 글 추가 함수 구현
> 필요한 노동시간의 일부를 오늘 사용하였다. 8개의 추가된 서브게시판내용의 스키마를 정하였고 라우트를 추가, 또 각 게시판에 글을쓸때 사용할 함수들을 구현하였다. 이제 필요한건 각각 view파일... 업데이트용 view 파일, 라우트... 같은 작업의 반복이지만 8개나 추가하게 되다보니 파일을 한 20개?? 20개이상은 더 만들지 않을까... 어려운 작업이 아니지만 시간이 엄청 많이 들 것 같다. 25일까지 다 완료해야겠다.. 각각게시판의 검색기능도 추가해야되서 더 만들어야할 라우트가 몇개...................... 함수가 몇개.... ejs파일이 몇개.... 프로젝트가 커지다 보니 혼자 하기 정말 힘들고 머리아픈것 같다. 양이 많다보니 헷갈리는것도 많고. 힘내자. 빠른 시간안에 25일안에 검색기능, 수정기능, 추천, 등등 오류없이 잘 돌아가게 만들자!

* * *

## 2018.08.23 Developing Note

#### 1. 사진자랑 게시판빼고 나머지 세부게시판 다 만들었음
> 사진자랑 게시판은 디자인적인 부분의 회의가 이루어지지 않아 구현하지 않았으나 서버적인 부분은 5분이면 구현할 수준임. 디자인만 정해지면 금방 구현이 가능한 상태이다. 세부게시판 8개를 만드는게 정말 힘들었다.... 진짜 너무오래걸리고 코드가 너무 길고 복잡하고 실수나고 아....!!!! 너무 고통스러웠으나 빠르게 해낸거 같아 뿌듯하다.

#### 2. 익명게시판
> 익명게시판을 새로운 ejs를 만드는것이 아니라 기존에 있던 ejs에 데이터만 다르게 하여 보여주는 방식으로 하려다 보니 조건문을 작성할때 실수가 많았으며 코드가 길어 알아보기 힘들어서 오래걸렸다. 하지만 익명게시판을 잘 만들었다.

#### 3. 하나의 ejs파일에 데이터만 다르게 표시할때의 문제.
> 아무래도 하나의 ejs파일로 구현하다 보니 다른 분류의 게시글, 게시판 임에도 불가하고 똑같이 보여지는 내용이 많았다. 게시판 분류 라던지 큰 제목 이라던지. 전부 조건문을 사용해 동적으로 변경되게 구현하였다.

#### 4. 한줄 글 쓰기 게시판
> 원래 추천, 수정, 삭제 기능은 글만의 화면인 post.ejs에서 들어있는 기능이였다. 차이점을 인지못하고 금방 할것이라고 생각했으나 여러개의 글을 보여주는 게시판 화면에서 그 기능을 가능하게 하려고 하니 쉬운일이 아니었다. onclick을 많이 추가하였고 데이터를 전달하는데 오류가 많았다. 특히..... 이미 추천을 한 게시물을 중복추천 불가, 한번더 시도할 시 취소 할때 전체 탐색을 하는것이 마음에 들지 않아 전체탐색 하지 않는 방법을 고민하다가 실패하였으나... 흠.. 내가 아는 지식으로는 아직 구현하기 힘든 부분인것 같다. 이 프로젝트를 어느정도 진행한 후 Ajax라던지.. 다른 기술을 공부 해야할 것 같다.

#### 5. 게시판이 여러개로 늘어남에 따라 검색, 페이지네이션 하나하나 수정.
> 검색기능이 다른게시판의 게시글을 검색하기도 하고... 페이지네이션도 오류가 많고... 오늘 날잡고 다 수정하였다. 여러번 테스트 해보았는데.. 일단은 문제가 없는것 같다. 시간을 오래 쏟은 만큼 잘 돌아가고 있는것이라 믿는다.

#### 6. 혼자하려니 힘들다..
> 코드가 너무 긴데... 데이터 내가 지정한것도 너무 많고... 내가만들어놓고 내가 까먹어서 뭐였지? 하고 찾아보면 찾아보려는 코드가 천줄이 넘어가고 ... 컨트롤F로 찾는것도 오래걸리고... 하지만 힘내자 혼자서 하는 만큼 큰 발전이 있을것이다.

* * *

## 2018.08.25 Developing Note

#### 1. 지역별게시판 글쓰기 지역선택 svg UI를 사용자에게 편하게 시각화.
> 지역이 선택하면 선택한 지역의 지도는 다른것은 회색인 반면 파란색으로 표시되게 하였다. url값을 이용하여 짧은코드로 구현하였다. 뭔가.. 착착 맞아떨어져서 그리 고생하진 않았다.

#### 2. 지역별 글쓰기 게시판 버튼 드랍다운 svg로 대체.
> 서울시에 구가 25개나 있어 드랍다운으로 25개중에 하나의 지역을 선택하기란 내가 사용자라면 정말 .... 짜증날거같다 절대로 사용안할것 같다. 드랍다운을 svg로 대체하여 지도에서 선택하게 만들었다. 특정구를 선택하면 지역선택 버튼에 있는 HTML은 선택한 지역명으로 바뀌게 되고 미리 묶어놓은 지역분류에 맞게 DB에 저장된다. 정말 마음에 드는 기능중 하나. 16일부터 목표로 한것을 25일에 해냈다. 그동안 다른것을 했을뿐 게으른것이 아니니 문제는 없는것.

#### 3. 메인화면 컨텐츠 추가에 따라 데이터 토글 버튼.
> 공지사항만 보여주던 것을 공지사항, 사건사고, 핫게시물, 축제정보들을 사용자가 눌러서 토글할 수 있게 하였다. css에 hover를 이용하여 누를 수 있는 것처럼 보여주고 있고 눌러진 것은 style에 background색을 다르게 주어 처음보는 사용자라도 한번쯤 눌러보고 싶게 디자인 하였다. css지식이 점점 많아지는것 같다. 이번프로젝트가 끝나고 동아리에 들어가서 다른 프로젝트를 시작하면 헤메지 않고 많은 일을 할 능력을 갖춘것 같다 정말 뿌듯하다. 누군가에게 도움이 될 수 있겠다.

* * *

## 2018.08.26 Developing Note

#### 1. 모바일서버 개발을 위해 간단히 수정후 모바일에 데이터 전송하는 법 공부
> 모바일서버도 공부 하고싶어서 공부했다. 알아보니 Json형태로 전송하면 된다고 한다. 안드로이드 스튜디오는 거의 처음써봐서 많은 시간을 썼다. 하루종일 잡고 공부하고 안돼서 찾아보고 질문하고... JSON으로 받은데이터를 Parsing 하는것이 처음이라 어려웠지만 어떻게어떻게 해냈었는데 두개의 JSON파일을 보내는 것에서 많이 헤맸다. 두개를 각각 따로보냈을때 Parsing하는 법은 도저히 알아낼 수가 없었고 합치자니 각각 JSON파일에 key가 없어서 방법을 도저히 찾지 못하다가 stackoverflow를 통해 알아냈다.
res.write(Json.stringify({result,hot})) 이런식으로 보내면 키값이 추가되어 전송되는데 받는쪽에서 어떻게 해야할지 몰랐다. 구조가 각각 1차원 배열인것은 쉽게 해냈는데 각각 json의 구조가 2차원 배열이라 많이 헷갈렸다. volley를 사용하였고 JSONObject obj = new JSONObject(response);
후 JSONArray arr = obj.getJSONArray("key"); 이런식으로 받은 후 String title=arr.getJSONObject(i).getString("title")의 루틴.... 안드로이드 스튜디오에서 JSON관련 변수, 함수의 사용법을 몰라 많이 헤맸지만.. 이정도 루틴을 알고 있으니.. 나머지는 찾아보면서 한다면 앱개발할때 서버도 문제없이 개발할 수 있을것 같다. 한가지 고민은 웹서버를 모바일서버로 사용하여도 되는지.. 보통은 어떻게하는지... 흠.. 곧 있을 관광공사 앱개발 공모전에 서버개발자로 참여하기에 충분한것 같다. 아이디어는 있으니 팀원을 모집 해 봐야겠다.

* * *

## 2018.08.29 Developing Note

#### 1. 메인화면 Css작업.
> 메인화면에 hover를 이용하여 보여주는 내용 토글화 + 보여주는 내용들에 대한 css작업

#### 2. 댓글 수정 모달 css작업
> 댓글 수정 모달 css작업. 기능에 맞게 크기 줄임, 디자인 적용

#### 3. 컨텐츠 추가, 수정, 분류 수정
> 컨텐츠추가, 수정, 분류 수정에 따른 route수정, header, leftside배너 수정

* * *

## 2018.08.30 Developing Note

#### 1. 글 수정 페이지 수정
> css가 전혀 입혀져있지 않던 글 수정페이지 css 입힘 -> 그에따라 글 수정기능 중 사진수정 기능에 오류가 생김 -> 해결 input이 아닌 textarea는 value의 값을 보여주지 않았다. 이때문에 글 수정시 원래 입력되어있던 내용이 보이지 않았는데 수정 하였다. textarea는 value를 보여주지 않는다는걸 처음 알았다.

#### 2. 전날 한 route수정 때문에 생기는 여러가지 문제.
> route를 수정하니 검색기능도 조금 오류가 생기고, 보여주는 내용에도 오류가 생겼다. 해결 완료

* * *

## 2018.08.31 Developing Note

#### 1. Jquery 공부
> 그동안 다른 공부와 프로젝트를 수행하느라 모르면서도 넘어가고, 필요해도 javascript로 꾸역꾸역 구현했던 jquery에 대해 공부하였다. 막상 공부하고 나니 그렇게 어렵지도 않았고 정말 편리한 기능 이었다. jquery를 쓸 줄 몰라 javascript로 대채했던 코드들을 조금씩 jquery로 바꿔야 겠다. 당장 프로젝트에는 필요없지만 공부하는겸..

#### 2. Ajax 공부
> Ajax는 정말 알아야 될 것 같았던 기능이다. 회원가입시 아이디, 닉네임의 중복체크를 진행할때 Ajax 쓰는법을 몰라 회원가입경로로 이동시 유저데이터를 모두 넘겨주고 javascript로 비교하는 식으로 구현했었다. 다른 방법으로 하고 싶었는데 Ajax를 몰라서.. 꾸역꾸역 구현했던 기능이다. Ajax를 공부하고 나니 내가 원래 생각했던 방법과 딱 맞아 떨어진다. 중복체크 기능을 Ajax로 바꿔봐야겠다. 간단한 html, 서버를 만들어 Ajax로 서로 통신하는 것을 성공했다. 구현중 곤란했던 점은 'res.setHeader("Access-Control-Allow-Origin", "*");' 이 코드가 없으니 작동하지 않았던 것이다. 저 코드가 무엇을 의미하기에 있어야 하는 코드인지 공부해서 알아봐야겠다.
```
서버단
router.route("/ajax").post(function(req,res){

    //console.log(req.msg);
    var result="성공인가";
    //res.writeHead('200',{'Content-Type':'text/json;charset=utf8'});
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req.body.msg);
      var responseData = {'result' : 'ok', 'email' : req.body.email}
    res.json(responseData);
    
});
프론트단
<script>
$('#okbtn').click(function(e){
    $('#result').html('');
    $.ajax({
        
        url:'http://localhost:3000/ajax',
        dataType:'json',
        type:'POST',
        data:{'msg':$('#msg').val()},
        success:function(result)
        {
            console.log(result['result']);
            $('#result').html(result['result']);
        }
              
    });
    console.log("왜 안됨");
});
</script>
```
