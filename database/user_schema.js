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
    
//    UserSchema.path('id').validate(function (id) {
//		return id.length;
//	}, 'id 칼럼의 값이 없습니다.');
//	
//	UserSchema.path('name').validate(function (name) {
//		return name.length;
//	}, 'name 칼럼의 값이 없습니다.');
//	
//	UserSchema.path('hashed_password').validate(function (hashed_password) {
//		return hashed_password.length;
//	}, 'hashed_password 칼럼의 값이 없습니다.');
//	
	   
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