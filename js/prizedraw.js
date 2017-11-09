var browser = {version:''};

function inputFocus(element,defaultMsg){
	if(element.value == defaultMsg){
		element.value = '';
	}
}

function inputBlur(element,defaultMsg){
	if(element.value == ''){
		element.value = defaultMsg;
	}
}

function validateForm(element){
	if(
		(document.getElementById('nameInput').value != 'Name' && document.getElementById('nameInput').value != '') 
		&& (document.getElementById('emailInput').value != 'Email' && document.getElementById('emailInput').value != '')
		)
	{
		element.submit();	
	} else {
		alert('Please enter your name and email');
		return false;
	}
}

$(window).on('load',function(){
	$('#entryForm').on('submit',function(e){
		e.preventDefault();
	});
});

$(window).on('resize', function(){
	$('#videoInner').height($('#videoInner').width()*400/650);
});