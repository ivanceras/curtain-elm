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


function alignScroll(event){

    console.log("target", event.target);
    console.log("scrollLeft", event.target.scrollLeft);
    var head_shadow = document.getElementById('head_shadow');
    head_shadow.scrollLeft = event.target.scrollLeft;
    var row_shadow = document.getElementById('row_shadow');
    row_shadow.scrollTop = event.target.scrollTop;
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



