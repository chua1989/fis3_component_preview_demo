var fs = require('fs');

var datas = '';//保存wrap.html文件内容
var writerStream = fs.createWriteStream('v_components.html');

// //使用utf8编码写入数据
// writerStream.write(datas.join(''), 'UTF8');

// //标记文件结尾
// writerStream.end();

//处理流事件
writerStream.on('finish', function(){
	console.log('写入完成');
});
writerStream.on('error', function(err){
	console.log(err.stack);
})
var regs = {
	'wraphtml': /^([\s\S]*<(body)>[\s\S]*)(<\/\2>[\s\S]*)$/,
	//懒惰匹配到第一个*/
	'example': /\/\*\*([\s\S]*)@example[\s\S]*?html:([\s\S]*?)js:([\s\S]*?)@example end([\s|\S]*?)\*\//,//懒惰匹配第一个*/
	'jsfile': /^\S+.js$/,
	'author': /@\s*author\s*(.*?)(\r|\n)/,
	'date': /@\s*date\s*(.*?)(\r|\n)/,
	'description': /@\s*description\s*(.*?)(\r|\n)/,
	'enter': /\s*(\r|\n)\s*/
};
var root = '../common/module/';//模块文件所在目录
var unDomoduleLength = 0;//还没有处理的模块文件夹个数
var innerLeftWrap = ['<div class="left-side">', '</div>'],
	innerRightWrap = ['<div class="right-side">', '</div>'],
	innerRightTWrap = ['<div class="right-side-top">', '</div>'],
	innerRightBWrap = ['<div class="right-side-bottom">', '</div>'],
	jsWrap = ['<script type="text/javascript">', '</script>'], 
	innerLeft = '',
	innerRightT = '',
	innerRightB = '',
	innerJs = '',
	count = 0;//统计所有模块数量

fs.readFile('config.json', function(err, data){
	if (err) {
	   return console.error(err);
	}
	var obj = JSON.parse(data.toString());
	console.log("obj = " + obj )
	for(var i in obj){
		console.log(i + " = " + obj[i]);
	}
	root = obj.modulePath;
	console.log("root = " + root)
	if(datas){
		loopModule();
	}	
})
fs.readFile('wrap.html', function(err, data){						
	if (err) {
	   return console.error(err);
	}
	datas = data.toString();
	if(root){
		loopModule();
	}	
});
//遍历所有模块文件
function loopModule(){
	fs.readdir(root, function(err, ffiles){
		if(err){
			return console.error(err);
		}
		console.log('展示模块列表：');
		unDomoduleLength = ffiles.length;
		ffiles.forEach(function(ffile){
			var moduleFolder = ffile;
			// console.log(ffile);
			//处理每一个模块文件中的模块
			fs.readdir(root + ffile, function (err, files){
				if(err){
					return console.error(err);
				}
				
				var subModLeng = 0;
				files.forEach(function(file){
					//找到模块文件【可能一个大模块中有几个小模块】
					if(regs.jsfile.test(file)){
						subModLeng++;
						console.log(moduleFolder + '模块文件夹: ' + file + " subModLeng = " + subModLeng);
						var pa = root + moduleFolder + '/' + file;
						fs.readFile(pa, function(err, data){
							subModLeng--;
							if (err) {
							   return console.error(err);
							}
							//console.log(pa + "异步读取: " + data);
							var match;
							if(match = data.toString().match(regs.example)){
								var content = match[0].replace(regs.example,'$1$4')
									.replace(/((\r|\n)\s*)(\*)/g, '$1')
									.replace(regs.author, '\n')
									.replace(regs.date, '\n')
									.replace(regs.description, '\n')
									.replace(regs.enter, '\n');

								innerLeft += '<div class="left-side-item' + (count == 0? ' visible': '') + '" data-mod="'+ file +'">' + file + '</div>';
								innerRightT += '<div class="right-side-top-item' + (count == 0? ' visible': '') + '" data-mod="'+ file +'">' + match[2] + '</div>';
								innerRightB += '<div class="right-side-bottom-item' + (count == 0? ' visible': '') + '" data-mod="'+ file +'">' 
									+ '<div class="right-side-bottom-item-author">作者：' + (regs.author.test(match[0])? match[0].match(regs.author)[1]: '') + '</div>'
									+ '<div class="right-side-bottom-item-date">日期：' + (regs.date.test(match[0])? match[0].match(regs.date)[1]: '') + '</div>'
									+ '<div class="right-side-bottom-item-description">描述：' + (regs.description.test(match[0])? match[0].match(regs.description)[1]: '') + '</div>'
									+ '<div class="right-side-bottom-item-code">样例：<div>html:<br>' + transToHtml(match[2].replace(regs.enter, '\n')) + '<br>js:<br>' + transToHtml(match[3].replace(regs.enter, '\n')) + '</div></div>'
									//去掉代码用例区域，去掉每一行之前的*符号
									+ '<div class="right-side-bottom-item-content">其他：<div>' + transToHtml(content) + '</div></div></div>';
								innerJs += match[3] + ";";
								count++;
							}
							// console.log('file:' + file + " before unDomoduleLength = " + unDomoduleLength + " subModLeng = " + subModLeng);
							if(subModLeng == 0){//处理完所有子模块才能说明处理完了整个模块文件夹
								unDomoduleLength--;
							}
							// console.log('file:' + file + " after unDomoduleLength = " + unDomoduleLength + '  subModLeng = ' + subModLeng);
							//处理完所有的模块后，最后写入文件
							if(unDomoduleLength == 0){
								// console.log("innerLeft = " + innerLeft);
								var innerBody = warpText(innerLeftWrap, innerLeft) 
									+ warpText(innerRightWrap, warpText(innerRightTWrap, innerRightT) + warpText(innerRightBWrap, innerRightB))
									+ warpText(jsWrap, innerJs);

								//使用utf8编码写入数据
								writerStream.write(datas.replace(regs.wraphtml, '$1' + innerBody + '$3'), 'UTF8');

								//标记文件结尾
								writerStream.end();
							}								
						});
					}
					
				})
			});
		})
	})
}
//用数组wrapArr包裹inner并返回包裹结果
function warpText(wrapArr, inner){
	return '' + wrapArr[0] + inner + wrapArr[1];
}
//将str字符串转换成HTML格式
function transToHtml(str){
	var tran = [/&/g, />/g, /</g, /\n/g, / /g],//先要处理'&'才能处理其他标签，否则其他标签生成的‘&’会被处理
		to = ['&amp;', '&gt;', '&lt;', '<br>', '&nbsp;'];
	for(var i = 0; i < tran.length; i++){
		str = str.replace(tran[i], to[i]);
	}
	return str;
}