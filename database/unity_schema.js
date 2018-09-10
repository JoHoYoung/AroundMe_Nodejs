var Schema = {};

Schema.createSchema = function(mongoose)
{
  var UnitySchema = mongoose.Schema({
        nickname : {type : String, required : true},
        score : {type : Number, require: false, 'default': 0},
        created_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
	    updated_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
        
  });
  
    return UnitySchema;
};

module.exports = Schema;