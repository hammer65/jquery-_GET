# jquery-_GET
This jQuery plugin will add a _GET() function to jQuery which will return an object with the query string values of the current page and all script linked to javascript files.
 
#Data Structure
 A Javascript object is returned with keys representing data for the page and for each script tag with query string values
 
 The key for the page will always be "page"
 
 If a script tag has an "id" attribute the values will be available in a property which matches the id. So a script tag with an id attribute of "ui_control"
 ```
 <script type="text/javascript" id="ui_control" src="js/ui_control.js?account_id=5&user_id=16" />
 ```
 will give you
 ```
 {ui_control:{account_id:1,user_id:16}}
 ```
 If an id is not present, the file name (without the extension) will be used as the property name. An example output might look something like this
 ```
 {page:{id:2},ui_control{account_id:1,user_id:16},tracking:{api_key:k2s66idifl6d5s5sd6f5s}}

 ```
 
 jquery-_GET will do it's best to turn data with numerical keys into arrays. For results like that below.
 ```
 ?user[]=Bob&user[]=Frank&user[]Sarah
 or
 ?user[0]=Bob&user[1]=Frank&user[2]=Sarah
 
 {page:{user:[Bob,Frank,Sarah]}}
 
 ```
 
#Testing and Documentation 
 The test directory contains an index.html file with tests for every type of query string name/value pair variety and examples of how to use these values in your code. 
 
 All types of key/value pairs used in URLs are supported
 
 ```
 name=value
 ```
 
 ```
 name[]=value
 ```
 ```
 name[key]=value
 ```
 
 Include jQuery-_GET after the inclusion of the jQuery library.
 ```
 <script type="text/javascript" src="js/jquery.js"></script>
 <script type="text/javascript" src="js/jquery-_GET-min-1.0.js"></script>
 ```
 Possible use case
 ```
 <script type="text/javascript">
   $(document).ready(function(){
     _GET = $._GET();
   });
 </script>
 ```
 
 Some inspiration for this code came from the [jquery-querystring](https://github.com/kylefox/jquery-querystring) plugin.
 
 A function from the [PHP.js](http://phpjs.org) project was also used.
 
 When trying to transfer values from server side code to client side javascript code one usually needs to either
 dynamically generate the javascript within a template/view file, or use AJAX. Using jQuery-_GET eliminates the need for 
 messy server side code which generates some of your javascript or network intensive data retrieval via AJAX. jQuery-_GET
 pulls from the page URL or individual script tag URLs all of which can contain different data. As always care should be
 taken as to what values are put in URLs but this is also true of dynamically produced Javascript and AJAX.
 
 Any bug fixes or ideas for improvement are welcome.
