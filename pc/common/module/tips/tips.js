/**
 * @example
 	html:
 	<style>.relative{position:relative;}</style>
 	<div class="js-tips relative"></div>
 	
 	js:
 	var Tips = require('/common/module/tips/tips.js'),
 		$tips = $('.js-tips');

 	new Tips($tips, 'tips测试文本', '链接文本', '/pcapi/xxx.htm','tips','_self');

	@example end  
*/

/*
 * @require './tips.scss';
*/

var tpl_tips = require('./tips.tpl');

function Tips(cont, content, linkTxt, linkUrl, type, target) {
	this.cont = $(cont);
	this.content = content || 'tips'; 
	this.linkTxt = linkTxt || 'tips';
	this.linkUrl = linkUrl || 'tips';
	this.type = type || 'tips';
	this.target = target || '_blank';

	this.init();
};

Tips.prototype.renderHTML = function() {
	this.cont.append(tpl_tips({
		content: this.content,
		linkTxt: this.linkTxt, 
		linkUrl: this.linkUrl,
		target: this.target
	}));
};

Tips.prototype.bindEvent = function() {
	$('.tips').on('click','.close',function(){
		$(this).parents('.tips').hide();
		return false;
	})
};

Tips.prototype.init = function () {
	this.renderHTML();
	this.bindEvent();
}

return Tips;