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
      console.log('pair is ' + pair);
      var k, subK, value, oldValue;
      var reg = /(\w+?)\[(\w*?)\]/;
      var parts = pair.split('=');
      value = parseValue(parts[1] || '');
      if(reg.test(parts[0])){
        var kparts = parts[0].match(reg);
        k = kparts[1];
        subK = kparts[2];
        console.log('****** type ******');
        console.log($.type(params[k]));
        if(subK == ''){
          subk = $.type(params[k]) == 'array' ? params[k][subK].length : 0;
        }
        console.log('subK = ' + subK);
      }else{
        k = parts[0];
      }
      if(params.hasOwnProperty(k)){
        console.log('key ' + k + ' is there');
        if(!params[k].push){
          if(subK != null){
            console.log('subK = ' + subK);
            if(params[k][subK]){
              if(!params[k][subK].push){
                oldValue = params[k][subK];
                params[k][subK] = [oldValue];
              }
              params[k][subK].push(value);
            }else{
              params[k][subK] = [value];
            }
              
          }else{
            console.log('no subK ');
            oldValue = params[k];
            params[k] = [oldValue];
            params[k].push(value);
          }
        }
      }else{
        if(subK != null){
          params[k] = {};
          params[k][subK] = value;
        }else{
          params[k] = value;
          console.log('k = ' + k);
        }
      }
      console.log('**** end ****');
      return params;
    };
    return params;
  }
  
  $._GET = function(){
    var params = {};
    var str = extractQuery(window.location.search);
    if(str != ''){
      params['page'] = parse(str);
    }
    return params;
  };
  
})(jQuery);