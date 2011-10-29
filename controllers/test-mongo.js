var assert = require('assert');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

module.exports = function(req, res, next){
    var startTime = new Date();
    var db = new Db("test-big", new Server("127.0.0.1", 27017, {}))
    db.open(function(err, db){
      db.collection("test", function(err, collection){
        var singleAvgTime = 0;
        var savesCount = initialSavesCount = parseInt(req.param("count"));
        var renderOutput = function(){
          return "Total:"+((new Date()).getTime() - startTime.getTime())+"\n"+
                  "SingleAvg:"+(singleAvgTime/initialSavesCount);
        }
        var handleSave = function(err, r) {
          var singleTime = new Date();
          return function (err, r) {
            var singleEndTime = ((new Date()).getTime() - singleTime.getTime());
            singleAvgTime += singleEndTime;
            savesCount -= 1;
            console.log(savesCount,r);
            console.log("Single:"+singleEndTime);
            if (err)  throw new Error(err);
            if(savesCount == 0) 
              res.send(renderOutput());
          }
        }
        for(var i = 0; i<initialSavesCount;i++)
          collection.insert({
              _id: 'skywalker'+i,
              time: new Date(),
              name: ('Luke Skywalker N' + i)
          }, handleSave());
      });
    });

    
}