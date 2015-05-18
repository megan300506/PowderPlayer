$(function() {
	$('.easy-modal').easyModal({
		top: 200,
		overlay: 0.2
	});

	$('.easy-modal-open').click(function(e) {
		var target = $(this).attr('href');
		$(target).trigger('openModal');
		e.preventDefault();
	});

	$('.easy-modal-close').click(function(e) {
		$('.easy-modal').trigger('closeModal');
	});

	$('.easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.animated-close'
	});
	
	$('.second-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.second-animated-close'
	});
	
	$('.third-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.third-animated-close'
	});
	$('.forth-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.forth-animated-close'
	});
	
	$('.history-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.history-animated-close'
	});
	
	$('.update-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.update-animated-close'
	});
});