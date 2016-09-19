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
	'extra': '', //额外描述显示文本
	'topRightTag': '', //右上角新手图标显示
	'annualrateText': ''//利率显示文本
};
if(type == 'novice'){
	opt.tTitle = '<span class="newer">新手专享</span>';
	opt.tTitleExtra = '<i class="orange">' + term + '</i>个月期限';
	opt.extra = '专享高息';
	opt.topRightTag = '<img class="financials-item-tag" src="' + __uri('/common/module/financialsBar/financials_newer.png') + '">';
}else if(type == 'regular'){
	opt.tTitle = '定期理财';
	opt.tTitleExtra =  '<i class="blue">' + term + '</i>个月期限';
	opt.extra = '省心理财';
}else{
	opt.tTitle =  '零钱包';
	opt.extra =  '期限灵活';
}
if((type == 'novice' || type == 'regular') && Number(interestRaise) > 0){
	opt.annualrateText = '<b>' + (Number(annualrate) - Number(interestRaise)).nfdFixed() + '</b>%<i>+' + interestRaise + '</i>%';
}else{
	opt.annualrateText = '<b>' + annualrate + '</b>%';
}
%>
<div class="financials-item">
	<%=opt.topRightTag%>	
	<h3><%=opt.tTitle%></h3>
	<div class="financials-item-timelimit"><%=opt.tTitleExtra%></div>
	<div class="financials-item-interestrate"><%=opt.annualrateText%></div>
	<div class="financials-item-interestrate-a">预期年化收益率</div>
	<div class="financials-item-intro-extra"><%=opt.extra%></div>
<% if(type == "novice" || type == "regular"){ 
	var timeInfo = {
		nowDate: nowDate,
		startDate: releaseDate
	};
	var curInfos = {
		offset: 0, //离开始购买还有多少时间
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
		curInfos.startDate = releaseDate;
		curInfos.offset = releaseDate - nowDate;
		curInfos.isWaiting = true;
		curInfos.finanTimer = 'finanTimer' + bdid;
		addOneFinancialTimer(curInfos.finanTimer,timeInfo);

		if(curInfos.offset > 300000){ 
			curInfos.btnText = '' + new Date(curInfos.startDate).Format("hh:mm") + '开放购买';
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
		curInfos.btnText = '抢光了！查看详情';
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

<% }else{ /*活期*/
	var tArr = hoursPoints.split('#');
	var timeArr = [],//真实发布时间
		timeArrHM = [];//显示的发布时间
	var bufferTime = parseInt(delayTime) * 1000;
	for(var i = 0, len = tArr.length; i < len; i++) {		
		timeArr[i] = parseInt(tArr[i]) + bufferTime;
		timeArrHM[i] = new Date(parseInt(tArr[i])).Format("hh:mm");
	}
	
	timeArr[3] = endTime || (new Date(timeArr[0]).setNfdTime(15,0,0).getTime());

 	var timeInfo = {
		nowDate: nowDate
	};
	var curInfos = {
		isAble: true, //标是否可用（有没有发标）
		offset: 0, //离开始购买还有多少时间
		showDateIndex: 0, //下一批开放购买显示用的时间在TimeArr和timeArrHM上的索引
		finanTimer: '', //计时器变量
		isWaiting: false, //是否需要倒计时，不需要倒计时说明是明天才能购买
		buyAble: false, //是否可以购买
		tipText: '', //提示文本，抢光了、即将开放、可购金额
		progressDom: '', //进度条进度节点
		btnText: '' //下方按钮文本
	}

	if(!content){
		curInfos.isAble = false;
		if(nowDate >= timeArr[0]){
			curInfos.tipText = '抢光了';
			curInfos.progressDom = '';
		}else{
			curInfos.tipText = '即将开放';
			curInfos.progressDom = '<div class="financials-item-progress"><i style="width:0%;"></i></div>';
		}

		if(nowDate >= timeArr[2]){ 
			curInfos.btnText = '明日'+timeArrHM[0]+'开放购买';
		}else if(nowDate >= timeArr[1]){
			curInfos.btnText = timeArrHM[2]+'开放购买';
		}else if(nowDate >= timeArr[0]){
			curInfos.btnText = timeArrHM[1]+'开放购买';
		}else{	
			curInfos.btnText = timeArrHM[0]+'开放购买';
		}			

	}else{
		if(status == "YFB"/*预发布*/){				
			curInfos.tipText = surplusAmount > 0? ('可购金额：<i>' + surplusAmountStr + '</i>'): '即将开放';
			curInfos.progressDom = '<div class="financials-item-progress"><i style="width:0%;"></i></div>';
			curInfos.showDateIndex = 0;
			curInfos.offset = timeArr[0] - nowDate;
			curInfos.isWaiting = true;
			curInfos.finanTimer = 'finanTimer' + bdid;
			timeInfo.startDate = timeArr[curInfos.showDateIndex];
			addOneFinancialTimer(curInfos.finanTimer,timeInfo);

		}else if(status == "MJZ"/*募集中*/){ 
			if(nowDate > timeArr[3]){
				curInfos.tipText = '抢光了';
				curInfos.progressDom = '';					
			}else{
				curInfos.tipText = '可购金额：<i>' + surplusAmountStr + '</i>';
				curInfos.buyAble = true;
				curInfos.progressDom = '<div class="financials-item-progress"><i style="width:' + progress +'%;"></i></div>';
			}

		}else{//已满额status === 'YME' 
			if( nowDate >= timeArr[2]){ //最有一次发标被买完
				curInfos.tipText = '抢光了';
				curInfos.progressDom = '';
			}else{
				if(surplusAmount > 0){
					curInfos.tipText = '可购金额：<i>' + surplusAmountStr + '</i>';
					curInfos.progressDom = '<div class="financials-item-progress"><i style="width:0%;"></i></div>';
				}else{
					curInfos.tipText = '抢光了';
					curInfos.progressDom = '';
				}
				if( nowDate >= timeArr[1]){
					curInfos.showDateIndex = 2;
					curInfos.offset = timeArr[2] - nowDate;
				}else if(nowDate >= timeArr[0]){
					curInfos.showDateIndex = 1;
					curInfos.offset = timeArr[1] - nowDate;
				}

				curInfos.isWaiting = true;
				curInfos.finanTimer = 'finanTimer' + bdid;
				timeInfo.startDate = timeArr[curInfos.showDateIndex];
				addOneFinancialTimer(curInfos.finanTimer,timeInfo);
			} 
		}

		if(curInfos.isWaiting){
			if(curInfos.offset > 300000){
				curInfos.btnText = timeArrHM[curInfos.showDateIndex] + '开放购买';
			}else if(curInfos.offset <= 0){
				curInfos.btnText = '发标异常，请重新刷新页面';
			}else{
				curInfos.btnText = '' + toTimeString(curInfos.offset) + '后开放购买';
			}
		}else if(!curInfos.buyAble){
			curInfos.btnText = '明日'+timeArrHM[0]+'开放购买';
		}else{
			curInfos.btnText = '立即购买';
		}
	} %>
	<div class="financials-item-intro"><%=curInfos.tipText%></div>
	<%=curInfos.progressDom%>
	<div class="financials-item-operate">
	<% if(curInfos.buyAble){ %>
		<a href="/hqb.html" class="wbtn wbtn-big-green"><%=curInfos.btnText%></a>
	<% }else{ %>
		<a href="/hqb.html" class="wbtn wbtn-big-transparent <%=curInfos.finanTimer%>">
			<img src="<%=__uri('/common/module/financialsBar/financials_clock.png')%>">
			<span><%=curInfos.btnText%></span>
		</a>			
	<%}%>
	</div>
<% } %>	
</div>