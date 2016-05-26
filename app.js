var app;


function init(){
    if(Elm.Tab){
        app = Elm.Tab.fullscreen();
    }
    if(Elm.Row){
        app = Elm.Row.fullscreen();
    }
}
window.onload = init
