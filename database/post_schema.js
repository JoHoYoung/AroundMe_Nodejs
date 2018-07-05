var crpyto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose)
{
  var PostSchema = mongoose.Schema({
        title : {type : String, required : true},
        content : {type : String, required : true},
        writer : {type : String, required : true},
        star : {type : Number, require: false, 'default': 0},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now},
        comments : [{
            content : {type : String, trim : true, 'default' : ''},
            writer : {type : String , 'default' : ''},
            created_at : {type : Date, 'default' : Date.now}
        }]
  });
    console.log('값 값값::');
    console.log(mongoose.Schema.ObjectId);
    //console.dir(PostSchema);
  
    return PostSchema;
};

module.exports = Schema;