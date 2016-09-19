define('common/module/financialsBar/financialsSmlBar', function(require, exports, module) {

  /**
   * @author 陈桦
   * @date 2016-5-17
   * @description 理财列表块状组件，依赖模版 financialsSmlBar.tpl，financialsSmlBar.scss
  
   * @实例化 financialsSmlBar = new financialsSmlBar(dom, datas);
   * @param dom {Dom} 为理财块组件父级节点，将根据情况append模版，生成理财块节点；
   * @param datas {json} 初始化组件的数据，数据格式如下
  
   * @example
      html:
      <!-- 定期理财 -->
      <div class="js-financialsSmlBar1"></div>
      <!-- 债权转让 -->
      <div class="js-financialsSmlBar2"></div>
      js:
      var financialsSmlBar = require('/common/module/financialsBar/financialsSmlBar.js');
      new financialsSmlBar($('.js-financialsSmlBar1'),{
          "type": "regular",
          "bdid": 1,
          "title": "农优宝A1231213",
          "term": 1,
          "annualrate": 0.09,
          "interestRaise": 0.01,
          "surplusAmount": 30000,
          "projectScale": 50000,
          "packStatus": "RZZ",
          "releaseDate": 425132121,
          "bidType": 2,
          "nowDate": 45641231321,
          "isDefault":0,
          'productType': 'NYB',
          'delayTime': 0
      });
  
      new financialsSmlBar($('.js-financialsSmlBar2'),{
          "type": "creditTransfer",
          annualrate:0.11,
          bdid:4005,
          packStatus:"ZRZ",
          remainAmount:0,
          remainTerm:6,
          title:"种植贷D31-002",
          totalTerm:9,
          zqid:132044,
          zrAmount:100,
          zrDate:"2016-07-01 09:04:29",
          zrTime:1467335069000,
          zrid:545,
          'productType': 'NYB',
          'delayTime': 0
      });
  
      @example end
      
   * @param type {String} 理财类型：定期(regular)；债权转让(creditTransfer)
   * @param bdid {Number} 标的id
   * @param title {String} 标的名称
   * @param term {Number} 投资期限（月）
   * @param annualrate {Number} 投资年利率
   * @param interestRaise {Number} 加息利率
   * @param surplusAmount {Number} 剩余可投金额
   * @param projectScale {Number} 项目规模
   * @param packStatus {String} 状态，（新手和定期的状态为）SQZ:申请中;DSH:待审核;DFB:待发布;YFB:预发布;RZZ:融资中;DFP:待分配;YFP:已分配；HKZ:还款中;YJQ:已结清;YLB:已流宝;YDF:已垫付;YZF:已作废;YFP已分配
   	（债权的状态为）ZRZ:转让中;YJS:已结束;
   * @param releaseDate {Number} 发布时间（毫秒）
   * @param nowDate {Number} 系统当前时间(毫秒)
   * @param bidType {Number} 1:表示农优宝，2：表示新手标 3表示种植贷 4：债权转让 5:分期乐
   */
  
  /*
   * @require 'common/module/financialsBar/financialsSmlBar.scss';
   */
  
  var tpl_financialsSmlBar = require('common/module/financialsBar/financialsSmlBar.tpl');
  
  function financialsSmlBar(cont, datas) {
      this.cont = $(cont);
      for (var i in datas) {
          this[i] = datas[i];
      }
  
      if (this["zrTime"]) {
          this["zrTime"] = new Date(parseInt(datas["zrTime"])).Format("yyyy-MM-dd hh:mm");
      }
      if (this["interestRaise"]) {
          this["interestRaise"] = (datas["interestRaise"] * 100).nfdFixed();
      }
      if (this["annualrate"]) {
          this["annualrate"] = (datas["annualrate"] * 100).nfdFixed();
      }
      if (datas["surplusAmount"] >= 10000) {
          this["surplusAmountStr"] = (datas["surplusAmount"] / 10000).nfdFixed() + "万";
      } else {
          this["surplusAmountStr"] = parseInt(datas["surplusAmount"]) + "元";
      }
      this['projectScale'] = (datas['projectScale'] / 10000).nfdFixed();
  
  
      if (datas["type"] == "regular") {
          this["progress"] = parseInt((datas["projectScale"] - datas["surplusAmount"]) * 100 / datas["projectScale"]); //融资进度0-100
          //活期
      } else {
          this["progress"] = parseInt((datas["projectScale"] - datas["surplusAmount"]) * 100 / datas["projectScale"]); //融资进度0-100
      }
  
      this.addOneFinancialTimer = function(finanClass, finanInfo) { //finanClass:计时容器class
          var _5m = 300000,
              waitTime = 0;
  
          //毫秒转化为hh:mm:ss
          function toTimeString(ms) {
              var s = parseInt(ms / 1000),
                  t = [],
                  tmp;
              t.push('0' + parseInt(s / 60));
              t.push(((tmp = s % 60) > 9) ? tmp : ('0' + tmp));
              return t.join(':');
          }
          //5分钟以内的计时
          function in5mTimer(pClass, lastTime) {
              var timer = $.util.acInterval(function() {
                  if (lastTime > 1000) {
                      lastTime = lastTime - 1000;
                      $('.' + pClass).find(">span").html(toTimeString(lastTime) + '后开放购买');
                  } else {
                      $.util.clearAcInterval(timer);
                      $('.' + pClass).removeClass('wbtn-big-transparent').addClass('wbtn-big-green').html('立即购买');
                  }
              }, 1000);
  
          }
  
          if ((waitTime = finanInfo.startDate - finanInfo.nowDate) <= 0) { //标的已发布，不用计时
              return;
          }
  
          if (waitTime > _5m) {
              //倒计时
              setTimeout(function() {
                  in5mTimer(finanClass, _5m);
              }, waitTime - _5m)
          } else {
              in5mTimer(finanClass, waitTime);
          }
      }
      this.init();
  };
  
  financialsSmlBar.prototype.renderHTML = function() {
      this.cont.append(tpl_financialsSmlBar(this));
  };
  
  financialsSmlBar.prototype.bindEvent = function() {
      var _this = this;
      this.cont.on('click', '.yqw', function() {
          _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-已抢完', 'click']);
  
      }).on('click', '.qgz', function() {
          _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-抢购中', 'click']);
  
      }).on('click', '.yfb', function() {
          _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-预发布', 'click']);
  
      });
  };
  
  financialsSmlBar.prototype.init = function() {
      this.renderHTML();
      this.bindEvent();
  }
  
  return financialsSmlBar;

});
