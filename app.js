var app;


function init(){
    app = Elm.Main.fullscreen();
}
window.onload = init

function scrollListener(event){
    console.log("scroll", event);
    console.log("target", event.target);
    console.log("scrollTop", event.target.scrollTop);
    console.log("top", event.target.top);
    console.log("offsetHeight", event.target.offsetHeight);
    console.log("firstChild offsetHeight", event.target.firstChild.offsetHeight);

}


