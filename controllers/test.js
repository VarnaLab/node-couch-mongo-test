var assert = require('assert');
var cradle = require('cradle');

module.exports = function(req, res, next){
    var startTime = new Date();
    var db = new(cradle.Connection)().database('test');

    db.get('skywalker', function (err, doc) {
        console.log(doc); // 
        assert.equal(doc.force, 'light');
    });

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
      db.save('skywalker'+i, {
          time: new Date(),
          name: ('Luke Skywalker N' + i)
      }, handleSave());
}