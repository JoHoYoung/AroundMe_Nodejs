var authUser = function(database, id, password, callback) {
	console.log('authUser 호출됨 : ' + id + ', ' + password);
	
    // 1. 아이디를 이용해 검색
	database.UserModel.find({"id":id}, function(err, results) {
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
var addUser = function(database, id, password, name,sex ,birth,phone,callback){
    console.log("회원가입 진행");
    
    var user = new database.UserModel({"id":id,"password":password,"name":name, "sex":sex,"birth":birth, "phone":phone});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,user);
    });
    
}

var addpost = function(database, title, content,id,area,callback){
    console.log("왜 안돼");
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id,"area":area,"star":15});
 
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