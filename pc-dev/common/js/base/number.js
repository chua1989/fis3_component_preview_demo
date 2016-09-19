define('common/js/base/number', function(require, exports, module) {

  /**
   * @description 保留小数位后两位，当最后一位为0时只展示第一位即可
   * @author 陈桦
   * @date "2016-05-18"
   *
   * @param {Number} point 默认为1，表示至少保留几位小数
   * @return {String} search值
   * @example
   *      (11).nfdFixed() ==> "11.0"
   *		(11.00).nfdFixed() ==>"11.0"
   *		(11.01).nfdFixed() ==>"11.01"
    *		(11.001).nfdFixed() ==>"11.0"
   */
  Number.prototype.nfdFixed = function(point){
      var fixed2 = this.toFixed(2);
      var fixed1 = this.toFixed(1);
  
      if(point === undefined) {
          point = 1;
      }
  
      if(point === 0) {
          if(this == Number(fixed1)) {
              return this;
          }
      }
  
      if(Number(fixed2) == Number(fixed1)){
          return fixed1;
      }
  
      return fixed2;
  }
  /*
  string必须是数字字符串
   *      ('11').nfdFixed() ==> "11.0"
   *		('11.00').nfdFixed() ==>"11.0"
   *		('11.01').nfdFixed() ==>"11.01"
   *		('11.001').nfdFixed() ==>"11.0"
  */
  String.prototype.nfdFixed = function(){
  	var _this = Number(this);
  	return _this.nfdFixed();
  }
  
  
  /*
  去除小数后面无用的0，返回数值对应的字符串
  如果小数位都为0则只显示整数即可
  */
  Number.prototype.killEndZero = function(){
      if(this == 0){//this是一个数值对象
          return '' + 0;
      }
      var t = '' + this;
      return t.replace(/\.0+?$/, "").replace(/[.]$/, "");
  }
  String.prototype.killEndZero = function(){
      var _this = Number(this);
      return _this.killEndZero();
  }

});
