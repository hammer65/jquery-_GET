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
  
  function basename(path, suffix) {
    //  discuss at: http://phpjs.org/functions/basename/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Lincoln Ramsay
    // improved by: djmix
    // improved by: Dmitry Gorelenkov
    //   example 1: basename('/www/site/home.htm', '.htm');
    //   returns 1: 'home'
    //   example 2: basename('ecra.php?p=1');
    //   returns 2: 'ecra.php?p=1'
    //   example 3: basename('/some/path/');
    //   returns 3: 'path'
    //   example 4: basename('/some/path_ext.ext/','.ext');
    //   returns 4: 'path_ext'
  
    var b = path;
    var lastChar = b.charAt(b.length - 1);
  
    if (lastChar === '/' || lastChar === '\\') {
      b = b.slice(0, -1);
    }
  
    b = b.replace(/^.*[\/\\]/g, '');
  
    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
      b = b.substr(0, b.length - suffix.length);
    }
  
    return b;
  }
    
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
      label = this.id ? this.id : basename(this.src);
      search = $('<a></a>').attr('href',this.src)[0].search
      if(search != ''){
        params[label] = parse(search);
      }
    });
    return params;
  };
  
})(jQuery);