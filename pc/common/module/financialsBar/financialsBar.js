/**
 * @author 陈桦
 * @date 2016-5-8
 * @description 首页理财块状组件，依赖模版 financialsBar.tpl，financialsBar.scss

 * @实例化：financialsBar = new financialsBar(dom, datas);
 * @param dom {Dom} 为理财块组件父级节点，将根据情况append模版，生成理财块节点；
 * @param datas {json} 初始化组件的数据，数据格式如下

 * @example
    html:
    <!-- 新手 -->
    <div class="js-financialsBar1"></div>
    <!-- 活期 -->
    <div class="js-financialsBar2"></div>
    <!-- 定期 -->
    <div class="js-financialsBar3"></div>

    js:
    var financialsBar = require('/common/module/financialsBar/financialsBar.js');
    new financialsBar($('.js-financialsBar1'), {
        "type": "novice",
        "bdid": 1,
        "name": "农优宝A1231213",
        "title": "新手专享",
        "term": 1,
        "annualrate": 0.09,
        "interestRaise": 0.005,
        "surplusAmount": 30000,
        "projectScale": 50000,
        "status": "RZZ",
        "packStatus": "QGZ",
        "releaseDate": 425132121,
        "nowDate": 45641231321,
        "surplusBuyCount":1,
        'productType': 'NYB',
        'delayTime': 0
    });
    
    new financialsBar($('.js-financialsBar2'), {
        "type": "current",
        annualrate:0.058,
        content:{
            bdid: 329, 
            name: "HQB20160630-0002", 
            title: "零钱包",
            status: "YME", 
            surplusAmount: 0,
            projectScale:1215300,
            releaseDate:1467336600000,
        },
        endTime:1467356400000,
        hoursPoints:"1467336600000#1467345600000#1467352800000",
        interestRaise:0,
        maxAmount:100000,
        millionProfit:1.61,
        nowDate:1467342302000,
        openHoursInterval:1,
        startTime:1467336600000,
        vip:false,
        'delayTime': 0
    });
    
    new financialsBar($('.js-financialsBar3'), {
        "type": "regular",
        annualrate:0.07,
        bdid:5690,
        bidType:3,
        fullDate:0,
        interestRaise:0,
        isDefault:0,
        name:"种植贷D160701-005",
        nowDate:1467342302220,
        packStatus:"WKS",
        packStatusName:"未开始",
        projectScale:500000,
        releaseDate:1467352800000,
        status:"YFB",
        surplusAmount:500000,
        term:1,
        title:"D01-005",
        'productType': 'NYB',
        'delayTime': 0
    });

    @example end  

 * @param type {String} 理财类型：新手（novice）、活期（current）、定期(regular)；
 * @param bdid {Number} 标的id
 * @param name {String} 标的名称
 * @param title {String} 理财块状组件标题
 * @param term {Number} 投资期限（月）
 * @param annualrate {Number} 投资年利率
 * @param interestRaise {Number} 加息利率
 * @param surplusAmount {Number} 剩余可投金额
 * @param projectScale {Number} 项目规模
 * @param status {String} 状态，（新手和定期的状态为）SQZ:申请中;DSH:待审核;DFB:待发布;YFB:预发布;RZZ:融资中;DFP:待分配;HKZ:还款中;YJQ:已结清;YLB:已流宝;YDF:已垫付;YZF:已作废;YFP已分配
 	（活期的状态为）SQZ:申请中;DSH:待审核;DFB:待发布;YFB:预发布;MJZ：募集中；YME：已满额； YZF:已作废;YFP:已分配
 * @param packStatus {String} 后台包裹后的状态，新手和定期使用这个状态来做判断；WKS:未开始，QGZ：抢购中，YQW：已抢完，HKZ：收益中，YJQ：已结束
 * @param releaseDate {Number} 发布时间（毫秒）


 * @param number {Number} 零钱包编号
 * @param millionProfit {Number} ******
 * @param startTime {Number} 开始时间(毫秒)
 * @param endTime {Number} 结束时间(毫秒)
 * @param hoursPoints{String} 时间段
 * @param openHoursInterval{Number} 零钱包T+0开放时间间隔(分)
 * @param vip {Boolean} 是否是vip
 * @param maxAmount {Number} 用户零钱包购买上限
 * @param releaseDate {Number} 发布时间

 * @param bidType {Number} 1:表示农优宝，2：表示新手标 3表示种植贷 4渠道 5分期乐
 */

/*
 * @require './financialsBar.scss';
 */

var tpl_financialsBar = require('./financialsBar.tpl');

function financialsBar(cont, datas) {
    this.cont = $(cont);
    if (datas["type"] == "current" && datas.content) { //零钱包将contentDto的数据拿出来放到上一层
        for (var i in datas.content) {
            datas[i] = datas.content[i];
        }
    }
    for (var i in datas) {
        this[i] = datas[i];
    }

    if (this["annualrate"]) {
        this["annualrate"] = (datas["annualrate"] * 100).nfdFixed();
    }
    if (this["interestRaise"]) {
        this["interestRaise"] = (datas["interestRaise"] * 100).nfdFixed();
    }

    datas["surplusAmount"] = datas["surplusAmount"] || 0;
    datas['projectScale'] = datas['projectScale'] || 0;
    this["surplusAmount"] = datas["surplusAmount"];
    if (datas["surplusAmount"] >= 10000) {
        this["surplusAmountStr"] = (datas["surplusAmount"] / 10000).nfdFixed() + "万";
    } else {
        this["surplusAmountStr"] = parseInt(datas["surplusAmount"]) + "元";
    }
    this['projectScale'] = (datas['projectScale'] / 10000).nfdFixed();


    if (datas["type"] == "novice" || datas["type"] == "regular") {
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

financialsBar.prototype.renderHTML = function() {
    this.cont.append(tpl_financialsBar(this));
};

financialsBar.prototype.bindEvent = function() {
    var _this = this;
    this.cont.on('click', '.yqw', function() {
        _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-已抢完', 'click']);

    }).on('click', '.qgz', function() {
        _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-抢购中', 'click']);

    }).on('click', '.yfb', function() {
        _hmt.push(['_trackEvent', 'PC-点击卡片进入定期项目详情-预发布', 'click']);

    });
};

financialsBar.prototype.init = function() {
    this.renderHTML();
    this.bindEvent();
}

return financialsBar;