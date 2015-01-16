;(function($){
  function extractQuery(string) {
    if(string.indexOf('?') >= 0) {
      return string.split('?')[1];
    } else if(string.indexOf('=') >= 0) {
      return string;
    } else {
      return '';
    }
  };
  
  function parseValue(value) {
    value = decodeURIComponent(value);
    try {
      return JSON.parse(value);
    } catch(e) {
      return value;
    }
  }
  
  function parse(str){
    var params = {}, query = extractQuery(str);
    
    if(!query){
      return params;
    }
    
    $.each(query.split('&'),function(idx,pair){
      process(pair);
    });
    
    function process(pair){
      var k, subK, value, oldValue;
      var isArr = false;
      var reg = /(\w+?)\[(\w*?)\]/;
      var parts = pair.split('=');
      value = parseValue(parts[1] || '');
      // if the key string matches either key[] or key[subkey]
      if(reg.test(parts[0])){
        var kparts = parts[0].match(reg);
        k = kparts[1];
        subK = kparts[2];
        // empty square brackets give you an empty string which means 
        // numerical array not hash
        if(subK == ''){
          subK = $.type(params[k]) == 'array' ? params[k].length : 0;
        }
        // do we have a number now?
        isArr = !isNaN(subK);
      }else{
    	// straignt ahead string key no array or object
        k = parts[0];
      }
      // if we have seen the key before
      if(params.hasOwnProperty(k)){
        // is params[k] something other than an array? Like an object or scaler value
        if(!params[k].push){
          // do we have a subkey that is either a string or a number
          if(subK != null || isArr	){
            // if so does that subkey exist under this key yet?
            if(params[k][subK]){
              // first value won't be an array but a single value
              // we now have another value to add make it an array if it isn't one
              if(!params[k][subK].push){
                oldValue = params[k][subK];
                params[k][subK] = [oldValue];
              }
              params[k][subK].push(value);
            }else{
              // if this subkey does not yet exist for this key 
              // (object or array)
              // create it and fill it with the value
              params[k][subK] = value;
            }
              
          }else{
        	// we have no subkey of any kind but a repeating key
        	// default behavior is to overwrite with last value
        	//****** default *******
        	params[k] = value;
        	// Alternate behavior is to let it be an array
        	// ****** alternate *****//
        	/*
            oldValue = params[k];
            params[k] = [oldValue];
            params[k].push(value);
            */
          }
        }else{
          // key was found and we definitely have an array
          params[k][subK] = value;
        }
      }else{
    	//first time for this key
        if(subK != null || isArr){
          // we have a subkey either string or number
          params[k] = isArr ? []:{};
          params[k][subK] = value;
        }else{
          //we have no subkey
          params[k] = value;
        }
      }
    };
    return params;
  }
  
  $._GET = function(){
    var params = {};
    var str = extractQuery(window.location.search);
    if(str != ''){
      params['page'] = parse(str);
    }
    
    // script tags
    var label = '';
    $('script').each(function(){
      label = this.id ? this.id : this.src.replace('.js','');
      search = $('<a></a>').attr('href',this.src)[0].search
      if(search != ''){
        params[label] = parse(search);
      }
    });
    return params;
  };
  
})(jQuery);