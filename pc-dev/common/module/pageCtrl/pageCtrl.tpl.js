define('common/module/pageCtrl/pageCtrl.tpl', function(require, exports, module) {

  return  function (it, opt) {
      it = it || {};
      with(it) {
          var _$out_= [];
          
        if(page > 1){
        _$out_.push(' ');
        
          var index = (typeof idx) !== 'undefined' ? idx : 1;
          var isFirst = (index==1)?true:false;
          var isLast = (index==page)?true:false;
          var from = parseInt(index-max/2);
          var to = parseInt(index+max/2);
          if(from == 2 || to == page-2){
              max = max+2;
          }
          var pager_id = "pager_id_" + Math.random().toString().replace(/\D/g, "");
      
        _$out_.push(' <div class="page-box"> <span class="page-recored">第', index, '页/共', page, '页（共', total, '条记录）</span> ');
        if(page-2 <= max){
        _$out_.push(' <a href="javascript:void(0);" class="page-prev-btn ');
        if(isFirst){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class=""></i></a> ');
         for(var i=1,len=page;i<=len;i++){ 
        _$out_.push(' <a href="javascript:void(0);" data-index="', i, '" class="page-btn');
        if(i == 1){ 
        _$out_.push(' page-first');
        }
        
        if(i == len){ 
        _$out_.push(' page-last');
        }
        
        if(i == index){ 
        _$out_.push(' page-btn-cur');
        }
        _$out_.push('">', i, '</a> ');
        }
        _$out_.push(' <a href="javascript:void(0);" class="page-next-btn ');
        if(isLast){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class=""></i></a> ');
        }else{
        _$out_.push(' ');
        if((from > 2) && (to < page-2)){
        _$out_.push(' <a href="javascript:void(0);" class="page-prev-btn ');
        if(isFirst){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class=""></i></a> <a href="javascript:void(0);" data-index="1" class="page-btn page-first">1</a> <a href="javascript:void(0);" data-index="2" class="page-btn">2</a> <span>…</span> ');
         for(var i=from,len=page;i<to;i++){ 
        _$out_.push(' <a href="javascript:void(0);" data-index="', i+1, '" class="page-btn');
        if(i+1 == index){ 
        _$out_.push(' page-btn-cur');
        }
        _$out_.push('">', i+1, '</a> ');
        }
        _$out_.push(' <span>…</span> <a href="javascript:void(0);" data-index="', len-1, '" class="page-btn">', len-1, '</a> <a href="javascript:void(0);" data-index="', len, '" class="page-btn page-last">', len, '</a> <a href="javascript:void(0);" class="page-next-btn"><i class=""></i></a> ');
        }else{
        _$out_.push(' ');
        if(from <= 2){
        _$out_.push(' <a href="javascript:void(0);" class="page-prev-btn ');
        if(isFirst){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class=""></i></a> ');
         for(var i=1,len=page;i<=Math.max(max, to);i++){ 
        _$out_.push(' <a href="javascript:void(0);" data-index="', i, '" class="page-btn');
        if(i == 1){ 
        _$out_.push(' page-first');
        }
        
        if(i == len){ 
        _$out_.push(' page-last');
        }
        
        if(i == index){ 
        _$out_.push(' page-btn-cur');
        }
        _$out_.push('">', i, '</a> ');
        }
        _$out_.push(' <span>…</span> <a href="javascript:void(0);" data-index="', len-1, '" class="page-btn">', len-1, '</a> <a href="javascript:void(0);" data-index="', len, '" class="page-btn page-last">', len, '</a> <a href="javascript:void(0);" class="page-next-btn"><i class=""></i></a> ');
        }
        _$out_.push(' ');
        if(to >= page-2){
        _$out_.push(' <a href="javascript:void(0);" class="page-prev-btn ');
        if(isFirst){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class="icon-font i-v-left"></i></a> <a href="javascript:void(0);" data-index="1" class="page-btn page-first">1</a> <a href="javascript:void(0);" data-index="2" class="page-btn">2</a> <span>…</span> ');
         for(var i=Math.min(from , page-max),len=page;i<page;i++){ 
        _$out_.push(' <a href="javascript:void(0);" data-index="', i+1, '" class="page-btn');
        if(i == index-1){ 
        _$out_.push(' page-btn-cur');
        }
        
        if(i == page-1){ 
        _$out_.push(' page-last');
        }
        _$out_.push('">', i+1, '</a> ');
        }
        _$out_.push(' <a href="javascript:void(0);" class="page-next-btn ');
        if(isLast){
        _$out_.push('page-btn-dis');
        }
        _$out_.push('"><i class="icon-font i-v-right"></i></a> ');
        }
        _$out_.push(' ');
        }
        _$out_.push(' ');
        }
        _$out_.push(' </div>');
        }
        
        return _$out_.join('');
      }
  }

});
