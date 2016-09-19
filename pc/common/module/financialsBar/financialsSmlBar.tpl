<%
//毫秒转化为hh:mm:ss
function toTimeString(ms){
	var s = parseInt(ms/1000),
		t = [],tmp;
	t.push('0' + parseInt(s/60));
	t.push(((tmp = s%60) > 9) ?tmp : ('0' + tmp));
	return t.join(':');
}

var opt = {
	'tTitle': '', //标题显示文本
	'tTitleExtra': '', //标题显示文本下面的描述
	'extra': '', //中部额外描述显示文本
	'topRightTag': '', //右上角新手图标显示
	'annualrateText': '', //利率显示文本
	'bdText': '', //标的名称显示
};
if(type == "regular"/*定期理财*/){
	//判断是否是新手标且未结束购买
	var isNewerNotEnd = (bidType == 2/*新手标*/  && (packStatus == "WKS"/*未开始*/ || packStatus == "QGZ"/*抢购中*/));
	if(isNewerNotEnd){
		opt.tTitle = '<span class="newer">新手专享</span>';
		opt.tTitleExtra = '<i class="orange">' + term + '</i>个月期限';
		opt.topRightTag = '<img class="financials-item-tag" src="' + __uri('/common/module/financialsBar/financials_newer.png') + '">';
	}else{
		opt.tTitle = '<i>' + term + '</i>个月';
	}

	//普通标有加息则显示加息，新手标未结束购买前有加息则显示加息
	if(Number(interestRaise) > 0 && (bidType != "2" || isNewerNotEnd)){
		opt.annualrateText = '<b>' + (Number(annualrate) - Number(interestRaise)).nfdFixed() + '</b>%<i>+' + interestRaise + '</i>%';
	}else{
		opt.annualrateText = '<b>' + annualrate + '</b>%';
	}
	opt.bdText = title;
	if(bidType == "2"/*新手标*/ && !isNewerNotEnd){//新手标且已经结束
		opt.bdText += '<i class="newer"></i>';
	}else if(bidType == "4"/*渠道*/){
		opt.bdText += '<i class="channel"></i>';
	}

}else if(type == "creditTransfer"/*债权转让*/){
	opt.tTitle = '' + remainTerm + '期';
	opt.tTitleExtra = '剩余期数';
	opt.annualrateText = '<b>' + annualrate + '</b>%';
	opt.bdText = '<a href="/product.html?id=' + bdid + '" class="wbtn wtbn-nothing">' + title + '</a>';
}
%>
<div class="financials-item small" data-id="<%=bdid%>">
	<%=opt.topRightTag%>
	<h3><%=opt.tTitle%></h3>
	<div class="financials-item-timelimit"><%=opt.tTitleExtra%></div>
	<div class="financials-item-interestrate"><%=opt.annualrateText%></div>
	<div class="financials-item-interestrate-a">预期年化收益率</div>
	<div class="financials-item-intro-title"><%=opt.bdText%></div>

<% if(type == "regular"){ 
	var timeInfo = {
		nowDate: nowDate,
		startDate: releaseDate
	};
	var curInfos = {
		offset: 0, //离开始购买还有多少时间
		showDate: 0, //下一批开放购买显示用的时间
		startDate: 0, //下一批开放购买时间
		finanTimer: '', //计时器变量
		isWaiting: false, //是否需要倒计时，不需要倒计时说明是明天才能购买
		buyAble: false, //是否可以购买
		tipText: '', //提示文本，抢光了、即将开放、项目规模、可购金额
		progressDom: '', //进度条进度节点
		linkUrl: '', //链接地址
		btnText: '' //下方按钮文本
	}
	if(packStatus == "WKS"/*未开始*/){
		curInfos.tipText = '项目规模：<i>'+ projectScale + '万</i>';
		curInfos.progressDom = '<div class="financials-item-progress"><i style="width:0%;"></i></div>';

		curInfos.showDate = releaseDate;
		curInfos.startDate = releaseDate;
		curInfos.offset = releaseDate - nowDate;
		curInfos.isWaiting = true;
		curInfos.finanTimer = 'finanTimer' + bdid;
		addOneFinancialTimer(curInfos.finanTimer,timeInfo);

		if(curInfos.offset > 300000){ 
			curInfos.btnText = '' + new Date(curInfos.showDate).Format("hh:mm") + '开放购买';
		}else if(curInfos.offset <= 0){
			curInfos.btnText = '发标异常，请重新刷新页面';
		}else{
			curInfos.btnText = '' + toTimeString(curInfos.offset) + '后开放购买';
		}
	}else if(packStatus == "QGZ"/*抢购中*/){
		curInfos.tipText = '可购金额：<i>'+ surplusAmountStr + '</i>';
		curInfos.progressDom = '<div class="financials-item-progress"><i style="width:' + progress +'%;"></i></div>';
		curInfos.buyAble = true;
		curInfos.btnText = '立即购买';
	}else{
		curInfos.tipText = '项目规模：<i>'+ projectScale + '万</i>';
		curInfos.progressDom = '';

		if(packStatus == "YQW"/*已抢完*/){
			curInfos.btnText = '抢光了';
		}else if(packStatus == "HKZ"/*还款中*/){
			curInfos.btnText = '还款中';
		}else{
			curInfos.btnText = '已结束';
		}
	}	

	var dqUrl = {
		'NYB': '/nyb.html?id=',
		'ZZD': '/product.html?id=',
		'FQL': '/fql.html?id='
	}

	curInfos.linkUrl = (dqUrl[productType] || '/nyb.html?id=') + bdid;
%>
	<div class="financials-item-intro"><%=curInfos.tipText%></div>
	<%=curInfos.progressDom%>
	<div class="financials-item-operate">
		<% if(curInfos.isWaiting){ %>
			<a href="<%=curInfos.linkUrl%>" class="yfb wbtn wbtn-big-transparent <%=curInfos.finanTimer%>">
				<img src="<%=__uri('/common/module/financialsBar/financials_clock.png')%>">
				<span><%=curInfos.btnText%></span>
			</a>
		<% }else if(curInfos.buyAble){ %>
			<a href="<%=curInfos.linkUrl%>" class="qgz wbtn wbtn-big-green"><%=curInfos.btnText%></a>
		<% }else{ %>
			<a href="<%=curInfos.linkUrl%>" class="yqw wbtn wbtn-financial-gray"><%=curInfos.btnText%></a>
		<% } %>
	</div>

<% }else{ /*债权*/ %>		
		<div class="financials-item-intro">待收本息：<i><%=remainAmount%></i>元</div>
		<div class="financials-item-intro2">转让价格：
			<% if(packStatus == "ZRZ"/*转让中*/){ %>	
			<i class="orange">
			<% }else if(packStatus == "YJS"/*已转让*/){ %>
			<i class="black">
			<% } %>
			<%=zrAmount%></i>元
		</div>	
		<div class="financials-item-operate">
			<% if(packStatus == "ZRZ"/*转让中*/){ %>	
			<a href="javascript:void(0)" class="wbtn wbtn-big-green zqrg"  data-zqid="<%=zrid%>" >立即认购</a>
			<% }else if(packStatus == "YJS"/*已转让*/){ %>
			<a href="javascript:void(0)" class="wbtn wbtn-financial-gray" style="line-height: 1.5;cursor: default;">转让时间<br><i><%=zrTime%></i></a>
			<% } %>
		</div>
<% } %>	
</div>