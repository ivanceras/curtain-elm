var app;



function sendScrollBarWidth(){
    var width = getScrollbarWidth();
    console.log("sending scrollbar width", width);
    app.ports.receiveScrollBarWidth.send(width);
}


var prevScrollTop;
var prevScrollLeft;
function isScrolledBottom(el, table){
    var scrollAllowance = 200;
    var totalScrollHeight = el.scrollTop + el.offsetHeight + scrollAllowance; 
    if ( el.scrollTop > prevScrollTop){
        if (totalScrollHeight >= el.firstChild.offsetHeight){
            console.log("Reach bottom")
            app.ports.receiveScrollBottomEvent.send(table);
        }
    }
    prevScrollLeft = el.scrollLeft;
    prevScrollTop = el.scrollTop;
}


var ticking = false;
//https://developer.mozilla.org/en-US/docs/Web/Events/scroll
function alignScroll(event, table, column_shadow_id, row_shadow_id){
    if(!ticking){
        window.requestAnimationFrame(function(){
            isScrolledBottom(event.target, table);
            alignScrollElements(event, table, column_shadow_id, row_shadow_id);
            ticking = false;
        });
        ticking = true;
    }
}


/// To hackers: If you are attempting to hack the hardcoded db_url
/// nevermind doing it, this is just a mock database generated from mockaroo.com
/// using the free tier of heroku db
/// and a 5$ docker container in digitalocean.com

function sendSettingsDbUrl(){
    var dbUrl = localStorage.getItem("db_url");
    console.log("db url", dbUrl);
    if (!dbUrl){
        if (window.location.hostname == "curtain-elm.herokuapp.com"){ // the heroku app demo 
            dbUrl = "postgres://atperknxxnjadk:jpasCIjuPd3MW48DUnb579-imU@ec2-23-21-140-156.compute-1.amazonaws.com:5432/dd2fbo2kj0q9l";
        }else if(inElectron()){ 
            dbUrl = "postgres://user:pwd@localhost:5432/db";// in electron stub
        }else{
            dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/mock"; //self hosted demo
        }
    }
    console.log("sending db_url", dbUrl);
    app.ports.receiveSettingsDbUrl.send(dbUrl.toString());
}

function saveSettingsDbUrl(dbUrl){
   localStorage.setItem("db_url", dbUrl);
}

//http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
function inElectron(){
    if(typeof process === 'object' && process + '' === '[object process]'){
       return true; 
    }else{
       return false;
    }
}

function sendSettingsApiServer(){
    var apiServer = localStorage.getItem("api_server");
    console.log("api server", apiServer);
    if (!apiServer){
        if (window.location.hostname == "curtain-elm.herokuapp.com"){ 
            apiServer = "https://iron-curtain.herokuapp.com"
        }else if (inElectron()){
            console.log("in electron");
            apiServer = "http://localhost:3224";// in electron
        }else{
            console.log("assembling the url");
            var port = 3224;
            var apiUrl = window.location.protocol+"//"+window.location.hostname+":"+port;
            apiServer = apiUrl;//assemble the url and use the default port
        }
    }
    console.log("sending api_server", apiServer)
    app.ports.receiveSettingsApiServer.send(apiServer.toString());
}

function saveSettingsApiServer(apiServer){
    localStorage.setItem("api_server", apiServer);
}


function alignScrollElements(event, table, column_shadow_id, row_shadow_id){
    if (column_shadow_id && row_shadow_id){
        var column_shadow = document.getElementById(column_shadow_id);
        var row_shadow = document.getElementById(row_shadow_id);
        if (column_shadow){
            column_shadow.scrollLeft = event.target.scrollLeft;
        }else{
            console.log("unable to find column_shadow", column_shadow_id);
        }
        if (row_shadow){
            row_shadow.scrollTop = event.target.scrollTop;
        }else{
            console.log("unable to find row_shadow", row_shadow_id);
        }
    }else{
        console.log("column_shadow and row_shadow id not specified");
    }
}

//a hack to get scrollbar with for autoscrolling of row controls
//http://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);
    
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    
    var widthWithScroll = inner.offsetWidth;
    
    // remove divs
    outer.parentNode.removeChild(outer);
    
    return widthNoScroll - widthWithScroll;
}

var wait = false;                 // Initially, we're not waiting

function init(){
    app = Elm.Main.fullscreen();
    app.ports.getScrollbarWidth.subscribe(function(){
        setTimeout(function(){
            sendScrollBarWidth();
        },4);
    });

    app.ports.saveSettingsDbUrl.subscribe(function(dbUrl){
        saveSettingsDbUrl(dbUrl);
    });
    app.ports.saveSettingsApiServer.subscribe(function(apiServer){
        saveSettingsApiServer(apiServer);
    });
    app.ports.getSettingsDbUrl.subscribe(function(){
        setTimeout(function(){//TODO: had to put timeout, seems curtain.js ports calls are not received
             sendSettingsDbUrl();
        }, 4);
    });
    app.ports.getSettingsApiServer.subscribe(function(){
        setTimeout(function(){//TODO: had to put timeout, seems curtain.js ports calls are not received
            sendSettingsApiServer();
        }, 4);
    });
}
window.onload = init
