define('common/module/tips/tips.tpl', function(require, exports, module) {

  return  function (it, opt) {
      it = it || {};
      with(it) {
          var _$out_= [];
          _$out_.push('<div class="tips"><em> <i class="triangle"></i> <a class="close" href="javascript:void(0)" title="关闭"></a></em><strong>', content, '</strong><a href=', linkUrl, ' title=', linkTxt, ' target="', target, '"> ', linkTxt, ' ></a></div>');
        return _$out_.join('');
      }
  }

});
