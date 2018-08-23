var authUser = function(database, id, password, callback) {
	console.log('authUser 호출됨 : ' + id + ', ' + password);
	
    // 1. 아이디를 이용해 검색
	database.UserModel.find({"id":id,"auth":{$ne: 0}}, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');
			
			// 2. 패스워드 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출
			var user = new database.UserModel({id:id});
			var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
			if (authenticated) {
				console.log('비밀번호 일치함');
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
}

var addUser = function(database, id, password, name,sex ,birth,phone,tokken,nickname,email,callback){
    console.log("회원가입 진행");
    
    var user = new database.UserModel({"id":id,"password":password,"name":name, "sex":sex,"birth":birth, "phone":phone, "tokken":tokken,"nickname":nickname,"email":email});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,user);
    });
    
}

var facebookaddUser = function(database, id, name,nickname,callback){
    console.log("회원가입 진행");
    
    var user = new database.UserModel({"id":id,"name":name,"nickname":nickname,"provider":"facebook"});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,user);
    });
    
}

var addpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"star":15});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}

var addAreapost = function(database, title, content,id,area,areagroup,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"area":area,"areagroup":areagroup,"star":15});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}

var addResolvepost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":100,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
};

var addReportpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":10,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}

var addworrypost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":-2,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addonelinepost = function(database, title,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"writer":id,"areagroup":-3,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addaccidentpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":-4,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addnoticepost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":-5,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addclubpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":11,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addfestivalpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":12,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addpicturepost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":13,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}
var addpromotionpost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":14,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}

var addanonymouspost = function(database, title, content,id,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"areagroup":-6,"star":0});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('데이터 추가 함');
        callback(null,post);
    });
    
}


module.exports.authUser=authUser;
module.exports.addUser=addUser;
module.exports.addPost=addpost;
module.exports.addAreaPost=addAreapost;
module.exports.addResolvePost=addResolvepost;
module.exports.addReportPost=addReportpost;

module.exports.addWorryPost=addworrypost;
module.exports.addOnelinePost=addonelinepost;
module.exports.addAccidentPost=addaccidentpost;
module.exports.addNoticePost=addnoticepost;
module.exports.addClubPost=addclubpost;
module.exports.addFestivalPost=addfestivalpost;
module.exports.addPicturePost=addpicturepost;
module.exports.addPromotionPost=addpromotionpost;
module.exports.addAnonymousPost=addanonymouspost;

module.exports.facebookaddUser=facebookaddUser;