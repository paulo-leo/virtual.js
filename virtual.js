const $v = {};
$v.objects = {};
$v.routes = [];
$v.objects_templates = {};
$v.watchs = {};
$v.el_ = "body";

$v.templateVirtual = null;
$v.templateView = null;
$v.startInit = false;
$v.el = function(el){ $v.el_ = el; };
$v.component = function(key,content)
{
    if(!$v.startInit) $v.start();
    $v.objects_templates[key] = content;
};

$v.watch = function(key,call){
   $v.watchs[key] = call;
};
$v.start = () =>{ 
    $v.startInit = true;
    $v.templateVirtual = document.querySelector($v.el_).innerHTML;
    $v.initVarTemplate();
};


$v.componentCall = function(key){
   
  let f = $v.objects_templates[key];
  return f($v.objects);
};

$v.initVarTemplate = function(){
    var html = $v.templateVirtual;
    var datas = html.match(/\${(\w+)}/g);
    if(datas != null && datas.length >= 1){
    for(var i=0; i < datas.length; i++)
    {
        let key = datas[i].replace('${','').replace('}','');
        $v.set(key);
    }
 }
};
$v.DOMRender = function(focus=null){

    var html = $v.templateVirtual;

    for (t in $v.objects_templates) 
    { 
        let regex = new RegExp(`(<${t}>)(</${t}>)`,'g');
        html = html.replaceAll(regex, $v.componentCall(t));
    }

    for (i in $v.objects) 
    { 
      html = html.replaceAll("${"+i+"}", $v.objects[i]);
    }

    //$vir.forLoop();

    document.querySelector($v.el_).innerHTML = html;
    $v.modelInput();
    if(focus)
    {
        focus.select();
        focus.focus();
    } 

    
};


$v.has = function(key){
    if(!$v.startInit) $v.start();
    return $v.objects.hasOwnProperty(key);
};
$v.set = function(key,val="undefined",focus=null){
    if(!$v.startInit) $v.start();

    let change = $v.get(key) != val ? true : false;
    if(change)
    {
    $v.objects[key] = val;
     
    if($v.watchs.hasOwnProperty(key))
    {
        $v.watchs[key](val,$v.objects);
    }
    $v.modelInput();
    $v.DOMRender(focus);
   }
};
$v.fill = function(response){
   if(typeof response == "object")
   {
     for(key in response)
     {
        $v.set(key,response[key]);
     }
   }
};

$v.update = function(response){
    if(typeof response == "object")
    {
      for(key in response)
      {
        if($v.has(key))
            $v.set(key,response[key]);
      }
    }
 };

$v.obj = function()
{
   return $v.objects;
};
$v.list = function(data,render){
    return data.map(render).join('');
};

$v.setI = function(key,val){
    val = isNaN(val) ? 0 : val;
    $v.set(key,parseFloat($v.get(key,0)) + parseFloat(val));
};
$v.setD = function(key,val){
    val = isNaN(val) ? 0 : val;
    $v.set(key,parseFloat($v.get(key,0)) - parseFloat(val));
};
$v.setM = function(key,val){
    val = isNaN(val) ? 0 : val;
    $v.set(key,parseFloat($v.get(key,0)) * parseFloat(val));
};

$v.get = function(key,def=null){
    if(!$v.startInit) $v.start();
    return $v.has(key) ? $v.objects[key] : def;
};
$v.hasTemplate = function(key){
    return $v.objects_templates.hasOwnProperty(key);
};

$v.gets = function(href){
     
    var gets = href.split('?');
    var ngets = [];

    if(gets.length < 2) return ngets;

    gets = gets[1];
    gets = gets.split('&');

    function isNumber(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
     
     for(let i =0; i < gets.length; i++)
     {
        let val = gets[i];
        let ind = val.indexOf('=');
        let value = val.substr(ind + 1);
        ngets[val.substr(0, ind)] = isNumber(value) ? parseFloat(value) : value;
     }

    return ngets;
};

$v.onlyNomeHash = function(name){
    name = name.split('?');
    name = name[0];
    name = name.split('&');
    name = name[0];
    return name.replace('#','');
};

$v.url = function(){

    let href = window.location.href;
    let gets = $v.gets(href);
    let hash =  $v.onlyNomeHash(window.location.hash);
    
    return {
        protocol: window.location.protocol + "//",
        host: window.location.host,
        pathname: window.location.pathname,
        href:  href,
        get : gets,
        hash: hash
    };
};

$v.route = function(route,call){

    if(route != '*')
    {
        route = route == '/' ? 'index' : route;
        $v.routes.push(route);
    } 
    
    function callRoute(){
        var url = $v.url();
        let hash = url.hash == '' ? 'index' : url.hash;
        if(hash == route)
        {
             call(url);
        }else{
           if(!$v.routes.includes(hash) && route == '*')
           {
             call(url);
           }
        }
    }
    callRoute();
    window.addEventListener('hashchange', function(e) { 
        callRoute();
    });
};

$v.modelInput = function(){

    var eventList = ['keydown','keypress','keyup','click'];

    function loopInputs(names,text=false){
    for(let n = 0; n < names.length; n++){
    var div = document.getElementsByTagName(names[i]);
    var tagName = names[i];
    for(var i = 0; i < div.length; i++)
    {
        if(div[i].hasAttribute('key'))
        {
           var key = div[i].getAttribute('key');
           if($v.has(key))
           {
             if(text)
             {
                div[i].innerText = $v.get(key);
             }else
             {
                div[i].setAttribute('value',$v.get(key));
             }
           }
        }
           
        if(div[i].hasAttribute('model'))
        {
           var key = div[i].getAttribute('model');
           for(var l =0 ; l < eventList.length; l++)
           {
            div[i].addEventListener(eventList[l], function(event) {
                let s = document.querySelector("input[model='"+key+"']");
                let v = s.value;
                $v.set(key,v,s);
              });
           }
          
        }
      }
    }

    }
    loopInputs(['div','h1','h2','h3','h4','h5','h6','p','span','b','i','title'],true);
    loopInputs(['input','textarea']);
    $v.forLoop();
   
    
};


$v.forLoop = function(){
    var div = document.getElementsByTagName('*');
    for(var i = 0; i < div.length; i++){
        

    if(div[i].hasAttribute('if'))
    {
            let key = div[i].getAttribute('if');
            let s = document.querySelector("*[if='"+key+"']");
    
            let test = s.getAttribute('if'); 
            test = test.replaceAll('this.', '$v.obj().');
    
            if(!eval(test))
            {
                s.innerHTML = '';
            } 
    }


    if(div[i].hasAttribute('show'))
    {
        let key = div[i].getAttribute('show');
        let s = document.querySelector("*[show='"+key+"']");

        let test = s.getAttribute('show'); 
        test = test.replaceAll('this.', '$v.obj().');

        if(eval(test))
        {
            s.setAttribute('style','display:block');
        }else
        {
            s.setAttribute('style','display:none');
        }
      
    }

    if(div[i].hasAttribute('for'))
    {
       var key = div[i].getAttribute('for');
       var s = document.querySelector("*[for='"+key+"']");
       var html = s.innerHTML;
       html = html.length > 3 ? html.trim() : false;
    
       key.trim();
       var keys = key.split(' in ');
       key = keys[1];
       keys = keys[0];

       var listLoop = $v.has(key) ? $v.get(key) : [];
       
       if(html)
       {
        //html = String.raw(html);
        s.innerHTML = listLoop.map(function(f){  

            html = html.replaceAll('${'+keys+'.', '${f.');

            return eval('`'+html+'`'); 
     
         }).join('');
       }           
    }
  }
};

$v.load = (call) =>
{
    window.addEventListener("load", function(event) 
    {
        $v.start();
        $v.DOMRender();
        call();
    });
};
