var authUser = function(database, id, password, callback){
    console.log('authUser 호출 됨');
    
    database.UserModel.find({"id" : id, "password":password},function(err, results){
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
    
    var user = new database.UserModel({"id":id,"password":password,"name":name});
    
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
    
    var post = new database.PostModel({"title":title,"content":content,"writer":id});
 
    post.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('데이터 추가 함');
        callback(null,content);
    });
    
}

module.exports.authUser=authUser;
module.exports.addUser=addUser;
module.exports.addPost=addpost;