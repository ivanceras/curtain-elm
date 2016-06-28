var app;


function init(){
    app = Elm.Main.fullscreen();
    app.ports.getScrollbarWidth.subscribe(function(){
        sendScrollBarWidth();
    });
    sendScrollBarWidth();
}
window.onload = init

function sendScrollBarWidth(){
    var width = getScrollbarWidth();
    console.log("sending scrollbar width", width);
    app.ports.receiveScrollBarWidth.send(width);
}

function scrollListener(event){
    console.log("scroll", event);
    console.log("target", event.target);
    console.log("scrollTop", event.target.scrollTop);
    console.log("top", event.target.top);
    console.log("offsetHeight", event.target.offsetHeight);
    console.log("firstChild offsetHeight", event.target.firstChild.offsetHeight);

}

var prevScrollTop;
var prevScrollLeft;

function isScrolledBottom(el, table){
    scrollAllowance = 200;
    //console.log("el scrolltop", el.scrollTop);
    //console.log("el Height", el.offsetHeight);
    //console.log("el.firstChild Height", el.firstChild.offsetHeight);
    var totalScrollHeight = el.scrollTop + el.offsetHeight + scrollAllowance; 
    //console.log("total scroll height", totalScrollHeight);
    //console.log(totalScrollHeight +" >= "+ el.firstChild.offsetHeight +" ?")
    if ( event.target.scrollTop > prevScrollTop){
        if (totalScrollHeight >= el.firstChild.offsetHeight){
            console.log("Reach bottom")
            app.ports.receivedScrollBottomEvent.send(table);
        }
    }
    prevScrollLeft = el.scrollLeft;
    prevScrollTop = el.scrollTop;
}


function alignScroll(event, table, column_shadow_id, row_shadow_id){
    // console.log("column_shadow_id", column_shadow_id);
    // console.log("row_shadow_id", row_shadow_id);
    //throttle(
    //    function(){
            isScrolledBottom(event.target, table);
    //    }, 50);

    alignScrollElements(event, table, column_shadow_id, row_shadow_id);

}


function alignScrollElements(event, table, column_shadow_id, row_shadow_id){
    if (column_shadow_id && row_shadow_id){
        // console.log("target", event.target);
        // console.log("scrollLeft", event.target.scrollLeft);
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
/// throttle http://sampsonblog.com/749/simple-throttle-function
function throttle (callback, limit) {
    //return function () {              // We return a throttled function
        if (!wait) {                  // If we're not waiting
            console.log("executing...");
            callback.call();          // Execute users function
            wait = true;              // Prevent future invocations
            setTimeout(function () {  // After a period of time
                wait = false;         // And allow future invocations
            }, limit);
        }else{
            console.log("not executing");
        }
    //}
}

