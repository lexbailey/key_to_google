var results=[];
var pointer;

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    xPos += (el.offsetLeft  + el.clientLeft);
    yPos += (el.offsetTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

function ensure_pointer(){

    pointer = document.getElementById("key_to_google_result_pointer");
    if (pointer == undefined){
        document.body.innerHTML += "<div id='key_to_google_result_pointer' style='position:absolute;top:0;left:0;z-index:9999999;color:blue;opacity:0;'>&#9658;</div>"
        pointer = document.getElementById("key_to_google_result_pointer");
    }
}

function get_focussed_id(){
    for (i = 0; i<= results.length-1; i++){
        if (results[i] === document.activeElement){
            return i;
        }
    }
    return -1;
}

function hide_pointer(event){
    pointer.style.opacity="0";
    event.srcElement.removeEventListener("blur", hide_pointer);
}

function focus_element(element){
    element.focus();
    pos = getPosition(element);
    pointer.style.top = "" + pos.y + "px";
    pointer.style.left = "" + pos.x-30 + "px";
    pointer.style.opacity="1";
    element.addEventListener("blur", hide_pointer, false);
}

function focus_result(step){
    fid = get_focussed_id();
    if (fid == -1){
        focus_element(results[0]);
        return;
    }

    fid = (fid+step+results.length)%results.length;
    focus_element(results[fid]);
}

function refreshResults(){
    ensure_pointer();
    result_headings = document.getElementsByClassName("r");
    results = []
    for (i = 0; i<= result_headings.length-1; i++){
        results.push(result_headings[i].childNodes[0]);
    }
    focus_result(0);
}

function keyup(event){
    if (event.keyCode == 191){
        searchbox = document.getElementById("lst-ib");
        if (searchbox != document.activeElement){
            searchbox.select();
        }
    }
}

function keydown(event){
    up=38
    down=40
    if (event.keyCode == up){focus_result(-1)}
    if (event.keyCode == down){focus_result(1)}
}

window.addEventListener("DOMContentLoaded", function () {
    document.documentelement.addEventListener('DOMSubtreeModified', function() {refreshResults();}, false);
});
document.onkeydown = keydown
document.onkeyup = keyup
if(document.readyState === "complete" || document.readyState === "interactive") {
    refreshResults()
}
