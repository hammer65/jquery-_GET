function showDrop(){
	if(_GET['page']['dishes']){
		var sel = $('<select name="' + _GET['page']['type'] + '"></select>');
		$.each(_GET['page']['dishes']['meat'],function(idx,itm){
			op = $('<option></option>').html(itm);
			sel.append(op)
		});
		$('#testdisplay2').append(sel);
	}
}