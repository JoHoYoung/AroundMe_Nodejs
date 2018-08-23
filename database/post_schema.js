var crpyto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose)
{
  var PostSchema = mongoose.Schema({
        title : {type : String},
        content : {type : String},
        writer : {type : String, required : true},
        star : {type : Number, require: false, 'default': 0},
        created_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
	    updated_at: {type: Date, index: {unique: false}, 'default': new Date().getTime() + 1000 * 60 * 60 * 9},
        comments : [{
            content : {type : String, trim : true, 'default' : ''},
            writer : {type : String , 'default' : ''},
            created_at : {type : Date, 'default' : new Date().getTime() + 1000 * 60 * 60 * 9}
        }],
        commentcount:{type: Number, 'default':0},
        views : {type : Number, 'default':0},
        recommender : [{ recommender :{type : String}}],
        area : {type : String,'default' : ''},
        areagroup:{type:Number, 'default':-1},
        images : [{images : {type :String}}]
  });
  
    return PostSchema;
};

module.exports = Schema;