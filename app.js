var app;


function init(){
    app = Elm.Tab.fullscreen();
        console.log("subscribing to focus");
    app.ports.focus_row.subscribe(function(which) {
        console.log("received event from focus_row")
        set_focus_row(which);
    });
    app.ports.focus_field.subscribe(function(which) {
        console.log("received event from focus_field")
        set_focus_field(which);
    });
}
window.onload = init

function set_focus_row(which){
    console.log("row focused on", which);
}

function set_focus_field(which){
    console.log("field focused on", which);
}

function send_something(){
    console.log("sending something...",app)
    app.ports.suggestions.send("Go fuck yourself")
}

setTimeout(send_something, 1000);
