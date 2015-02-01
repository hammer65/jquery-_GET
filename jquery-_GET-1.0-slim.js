/*
 * Copyright (c) 2015 Chris C. Root
 * 
 * MIT License see https://github.com/hammer65/jquery-_GET
 */

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
  
  function stripQuery(string){
	  var ret = string;
	  if(string.indexOf('?') >= 0){
		  ret = string.split('?')[0];
	  }
	  return ret;
  }
  
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
      b = b.substr(0, b.length - (suffix.length + 1));
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
    var params = new Object;
    
    if(!str){
      return null;
    }
    
    $.each(str.split('&'),function(idx,pair){
      process(pair);
    });
    
    function process(pair){
      var k, subK, value, oldValue;
      var isArr = false;
      var reg = /(\w+?)\[(\w*?)\]/;
      var parts = pair.split('=');
      value = parseValue(parts[1] || '');
      parts[0] = decodeURIComponent(parts[0]);
      if(reg.test(parts[0])){
        var kparts = parts[0].match(reg);
        k = kparts[1];
        subK = kparts[2];
        if(subK == ''){
          subK = $.type(params[k]) == 'array' ? params[k].length : 0;
        }
        isArr = !isNaN(subK);
      }else{
        k = parts[0];
      }
      if(params.hasOwnProperty(k)){
        if(!params[k].push){
          if(subK != null || isArr	){
            if(params[k][subK]){
              if(!params[k][subK].push){
                oldValue = params[k][subK];
                params[k][subK] = [oldValue];
              }
              params[k][subK].push(value);
            }else{
              params[k][subK] = value;
            }
              
          }else{
        	 params[k] = value;
          }
        }else{
          params[k][subK] = value;
        }
      }else{
    	  if(subK != null || isArr){
          params[k] = isArr ? []:{};
          params[k][subK] = value;
        }else{
          params[k] = value;
        }
      }
      return params;
    }
    return params;
  }
  
  $._GET = function(){
    var p = new Object;
    var str = extractQuery(window.location.search);
    if(str != ''){
      p['page'] = parse(str);
    }
    
    var label = '';
    $('script').each(function(){
      label = this.id ? this.id : basename(stripQuery(this.src),'js').split('?')[0];
      search = $('<a></a>').attr('href',this.src)[0].search
      if(search != '' && label != ''){
        p[label] = parse(extractQuery(search));
      }
    });
    return p;
  };
  
})(jQuery);