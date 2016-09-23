$(function(){
	$('.left-side>div:first').addClass('visible');
	$('.right-side-top>div:first').addClass('visible');
	$('.right-side-bottom>div:first').addClass('visible');
});
$(document).on('click', '.left-side>div', function(){
	var modName = $(this).attr('data-mod');
	$('.visible').removeClass('visible');
	$('[data-mod="'+ modName +'"]').addClass('visible');

});