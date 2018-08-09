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
        }],
        commentcount:{type: Number, 'default':0},
        views : {type : Number, 'default':0},
        recommender : [{ recommender :{type : String}}],
        area : {type : String,'default' : ''},
        areagroup:{type:Number, 'default':-1},
        images : [{images : {type :String}}]
  });
    //console.dir(PostSchema);
  
    return PostSchema;
};

module.exports = Schema;