define('common/module/rightsideBar/rightsideBar', function(require, exports, module) {

  /**
   * @author 陈桦
   * @date 2016-5-9
   * @description 首页右侧导航栏组件，依赖模版 rightsideBar.tpl，rightsideBar.scss;
  
   * @实例化：rightsideBar = new rightsideBar(dom, datas);
   * @param dom {Dom} 为头部组件父级节点，将根据情况append模版，生成头部节点；
   * @param datas {json} 初始化组件的数据，数据格式如下
  
   *
   * @example
   	html:
   	<div class="js-rightsideBar"></div>
  
  	js:
   	var rightsideBar = require('/common/module/rightsideBar/rightsideBar.js');
  	new rightsideBar($('.js-rightsideBar'));
  
  	@example end
   */
  
  /*
   * @require 'common/module/rightsideBar/rightsideBar.scss';
   */
  
  var tpl_rightsideBar = require('common/module/rightsideBar/rightsideBar.tpl');
  
  function rightsideBar(cont) {
      this.cont = $(cont);
      this.pathname = window.location.pathname;
      this.init();
  };
  
  rightsideBar.prototype.renderHTML = function() {
      var opt = {
              isLogin: false
          };
  
      this.cont.empty().append(tpl_rightsideBar(opt));
  };
  
  rightsideBar.prototype.bindEvent = function() {
      var _this = this;
      this.cont.on('click', '.right-sidebar-unregistered-close', function() {
          $(".right-sidebar").addClass('noreg');
          $(this).remove();
          $(".right-sidebar-unregistered").remove();
  
      }).on('click', '#rsidereg', function() {
          _hmt.push(['_trackEvent', 'PC-侧边广告位-点击注册领红包-' + _this.pathname, 'register']);
  
      });
  };
  
  rightsideBar.prototype.init = function() {
      this.renderHTML();
      this.bindEvent();
  }
  
  return rightsideBar;

});
