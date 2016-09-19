define('common/module/hovertips/hovertips.tpl', function(require, exports, module) {

  return  function (it, opt) {
      it = it || {};
      with(it) {
          var _$out_= [];
          _$out_.push('<span class="hovertips"><span class="hovertips-content"><span class="hovertips-text">', content, '</span><span class="hovertips-arrow"><span class="hovertips-arrow-inner"></span></span></span></span>');
        return _$out_.join('');
      }
  }

});
