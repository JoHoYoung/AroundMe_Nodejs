var crypto = require('crypto');

var Schema = {};
 
Schema.createSchema = function(mongoose)
{
    
    var UserSchema = mongoose.Schema(
    {
        id : {type: String,unique: true, 'default':''},
        hashed_password : {type: String, 'default':''},
        salt: {type:String},
        name: {type:String, index:'hashed','default': ''},
        age : {type:Number, 'default':-1},
        created_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
	    updated_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
        sex : {type:String, 'default':"남"},
        birth : {type:String, 'default':'0'},
        phone : {type:String, 'default':'0'},
        tokken : {type:String, 'defulat':'0'},
        auth : {type:String, 'default':'0'},
        provider : { type:String, 'default':"soso"},
        email : {type:String, 'default':''},
        nickname: {type:String},
        point : {type:Number, 'default':0}
     });
    
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
    //내생각에... encryptPassword나 authenticate 를 static이 아니라 method로 하는이유는..
    // static으로 하면 모델에서 쓸 수있고 method로 하면 객체 에서 쓸 수 있는거지.
    // encryptPassword나 authenticate는 인스턴스 객체의 비밀번호를 암호화, 인스턴스 객체의 
    // 비밀번호 비교.. 라서 method()로 하는거고, findById 같은거는.. 모델? 에서 정보를 찾는거니까
    // static으로 하는게 아닐까... 잘은 모르겠다.
    UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
    
    	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});
    
    var validatePresenceOf = function(value) {
		return value && value.length;
	};
    
	// 스키마에 static 메소드 추가
	UserSchema.static('findById', function(id, callback) {
		return this.find({id:id}, callback);
	});
	
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	console.log('UserSchema 정의함.');

	return UserSchema;
    
    
};

module.exports = Schema;