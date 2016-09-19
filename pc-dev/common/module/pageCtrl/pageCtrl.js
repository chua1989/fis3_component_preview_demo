define('common/module/pageCtrl/pageCtrl', function(require, exports, module) {

  /**
   * @example 实例化：pageCtrl = new PageCtrl(dom, pageActionFn);
   * @param dom {Dom} 为分页组件父级节点，将根据情况append模版，生成分页节点；
   * @param pageActionFn {Function} 点击页码回调，返回cur(当前点击页码),pre(点击前页码)两个参数；
   *
   * @description 分页组件，依赖模版 pageCtrl.tpl
  
   * @example
      html:
      <div class="sort-page js-pagectrl"></div>
      
      js:
      var PageCtrl = require('/common/module/pageCtrl/pageCtrl.js'),
          pagectrl = new PageCtrl($('.js-pagectrl'), pageFn);
  
      pagectrl.init({
          'page': 10,
          'idx': 1,
          'max': 5,
          'total': 20
      });
  
      //点击分页标签响应事件
      function pageFn(cur, prev) {
          //响应处理
          pagectrl.reset({
              'page': 10,
              'idx': cur,
              'total': 20
          });
      }
  
      @example end  
  
   * @param page {Number} 总页码数；
   * @param idx {Number} 当前页码，默认从1开始
   * @param max {Number} 最多显示数，可为空默认为5；限制页码区域，超出部分用…代替
   * @param total {Number} 数据总条数
   */
  
  /*
   * @require 'common/module/pageCtrl/pageCtrl.scss';
  */
  
  
  var tpl_page = require('common/module/pageCtrl/pageCtrl.tpl');
  
  //做为pageFn回调的参数，标志点击的按钮类型（主要供业务做上报使用）
  //常规按钮-"def-clk";上一页按钮-"pre-clk";下一页按钮-"next-clk"
  var clickType = "defClk";
  
  // 旧版本IE(<9) 双击事件会变成 click doubleClick
  // 其他浏览器是 click click doubleClick
  var isOldIE = (navigator.userAgent.match(/\bMSIE\s+(\d+)\b/) || [0, 10])[1] < 9;
  
  // 将传入的内容转换成大于等于0的整数，分页不存在负数
  var toInt = function(value, def){
      value = parseInt(value) || parseInt(def) || 0;
      return value < 0 ? 0 : value;
  }
  
  var ctrl = function(container, pageFn, opt){
  
      this.$container = (container instanceof $) ? container : $(container);
      this.pageFn = pageFn;
  
      this.inited = false;
  
      if(opt && typeof(opt) == "object"){
          //console.log(ctrl);
          this.init(opt);
      }
  }
  
  ctrl.prototype.init = function(opt){
      var _this = this;
      if(_this.inited){
          _this.reset(opt);
          return;
      }
  
      opt = opt || {};
  
      _this.begin = opt.begin || 0;
      _this.page = toInt(opt.page !== undefined ? opt.page : _this.page, 0);
      _this.max = toInt(opt.max !== undefined ? opt.max : _this.max, 5);
      _this.idx = toInt(opt.idx !== undefined ? opt.idx : _this.idx, 1);
      _this.idx = toInt((opt.idx - _this.begin) || _this.idx, 0);
      _this.total = toInt(opt.total !== undefined ? opt.total : 0, 0);
  
      if(_this.idx > _this.page){
          _this.idx = Math.max(0, _this.page - 1);
      }
  
      //删除本页
      _this.delCurPage = function(){
          _this.reset({
              "page": _this.page - 1,
              "max": _this.max,
              "idx": _this.idx
          });
          return _this.idx;
      }
  
      _this.$container.html(tpl_page({
          page: _this.page,
          max: _this.max,
          idx: _this.idx,
          total: _this.total
      }));
  
      if(!this.inited){
          this.bindEvent();
          this.inited = true;
      }
  };
  
  ctrl.prototype.reset =function(opt){
      opt = opt || {};
  
      var new_idx = toInt(opt.idx, 0);
      var new_max = toInt(opt.max, 5);
      var new_page = toInt(opt.page, 0);
      var new_total = toInt(opt.total, 0);
      var _this = this;
  
      if(new_idx > new_page){
          new_idx = Math.max(0, new_page);
      }
  
      if(new_idx==this.idx && new_page==this.page) return;
  
      this.$container;
  
      this.$container.html(tpl_page({
          "page":new_page,
          "max":new_max,
          "idx":new_idx,
          "total": new_total
      }));
  
      this.page = new_page;
      this.idx = new_idx;
      this.max = new_max;
      this.total = new_total;
  
      if(!this.inited){
          this.bindEvent();
          this.inited = true;
      }
  };
  
  /**
   * 选中翻页组件的按钮
   * @param {Number} index 序号，从1开始
   * @param {Object} [options] 可选参数
  */
  ctrl.prototype.select = function(index, options){
      options = options || {};
  
      var _this = this;
      // var target = $(this);
      // var index = toInt(target.attr("data-index"));
      /*start:改变按钮样式*/
      var page = _this.page;
      var max = _this.max;
  
       _this.$container.html(tpl_page({
          "page": page,
          "max": max,
          "idx": index,
          total: _this.total
      }));
  
      var pre = _this.idx;
      _this.idx = index;
      if(!options.silent){
          _this.pageFn(index, pre , clickType);
      }
  };
  
  ctrl.prototype.bindEvent = function(){
  
      var _this = this;
  
      _this.$container.on("click",".page-btn", function () {
          var target = $(this);
          var index = toInt(target.attr("data-index"));
          /*start:改变按钮样式*/
          // var page = _this.page;
          // var max = _this.max;
  
          //  _this.$container.html(tpl_page({
          //     "page": page,
          //     "max": max,
          //     "idx": index
          // }));
  
          // var pre = _this.idx;
          // _this.idx = index;
          // _this.pageFn(index, pre , clickType);
  
          _this.select(index);
  
          //重置clickType
          clickType = "defClk";
      });
  
      isOldIE && _this.$container.on("dblclick", ".page-next-btn,page-prev-btn", function () {
          $(this).trigger("click");
      });
  
      _this.$container.on("click",".page-prev-btn", function () {
          var target = $(this);
          if(target.hasClass("page-btn-dis")){
              return;
          }
          clickType = "preClk";
          _this.$container.find(".page-btn.page-btn-cur").prev().trigger("click");
      });
  
      _this.$container.on("click",".page-next-btn", function () {
          var target = $(this);
          if(target.hasClass("page-btn-dis")){
              return;
          }
          // console.log(_this.$container.find(".page-btn.page-btn-cur").next())
          clickType = "nextClk";
          _this.$container.find(".page-btn.page-btn-cur").next().trigger("click");
      });
  };
  
  ctrl.prototype.getIdx = function(){
      return this.idx;
  };
  
  ctrl.prototype.getpage = function(){
      return this.page;
  };
  
  
  ctrl.prototype.destroy = function(){
      this.$container.unbind('click dblclick');
      this.$container.html('');
  };
  
  return ctrl;
  

});
