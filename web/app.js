var app;



function sendScrollBarWidth(){
    var width = getScrollbarWidth();
    console.log("sending scrollbar width", width);
    app.ports.receiveScrollBarWidth.send(width);
}


var prevScrollTop;
var prevScrollLeft;

function isScrolledBottom(el, table){
    scrollAllowance = 200;
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


function alignScroll(event, table, column_shadow_id, row_shadow_id){
    isScrolledBottom(event.target, table);
    alignScrollElements(event, table, column_shadow_id, row_shadow_id);

}

function sendSettingsDbUrl(){
    var dbUrl = localStorage.getItem("db_url");
    if (!dbUrl){
        dbUrl = "";
    }
    console.log("sending db_url", dbUrl);
    app.ports.receiveSettingsDbUrl.send(dbUrl.toString());
}

function saveSettingsDbUrl(dbUrl){
   localStorage.setItem("db_url", dbUrl);
}

function sendSettingsApiServer(){
    var apiServer = localStorage.getItem("api_server");
    if (!apiServer){
        apiServer = ""
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
