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

function isHidden(el) {
    return (el.offsetParent === null)
}

function ensure_pointer(){

    pointer = document.getElementById("key_to_google_result_pointer");
    if (pointer == undefined){
        document.body.innerHTML += "<div id='key_to_google_result_pointer' style='position:absolute;top:0;left:0;z-index:9999999;color:blue;opacity:0;'>&#9658;</div>"
        pointer = document.getElementById("key_to_google_result_pointer");
    }
}

function get_focussed_id(){
    for (var i = 0; i<= results.length-1; i++){
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
    if (element == -1){return;}
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

function get_a_element(heading){
    children = heading.children;
    for (var i = 0; i<= children.length-1; i++){
        child = children[i];
        if (child.tagName == "A"){
            return child;
        }
        sub_a = get_a_element(child);
        if (sub_a != -1){
            return sub_a
        }
    }
    return -1;
}

function refreshResults(){
    ensure_pointer();
    result_headings = document.getElementsByClassName("r");
    results = []
    for (var i = 0; i<= result_headings.length-1; i++){
        el = get_a_element(result_headings[i]);
        if (!isHidden(el)){
            results.push(el);
        }
    }
    if (results.length > 0){
        focus_result(0);
    }
}

function keyup(event){
    if (event.keyCode == 191){
        searchbox = document.getElementById("lst-ib");
        if (searchbox != document.activeElement){
            searchbox.scrollIntoView();
            searchbox.select();
            event.preventDefault();
        }
    }
}

function keydown(event){
    up=38
    down=40
    if (results.length > 0){
        if (event.keyCode == up){focus_result(-1); event.preventDefault();}
        if (event.keyCode == down){focus_result(1); event.preventDefault();}
    }
}

window.addEventListener("DOMContentLoaded", function () {
    document.documentelement.addEventListener('DOMSubtreeModified', function() {refreshResults();}, false);
});
document.onkeydown = keydown
document.onkeyup = keyup
if(document.readyState === "complete" || document.readyState === "interactive") {
    refreshResults()
}

