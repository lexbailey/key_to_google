var results=[];
var pointer;

function getPosition(el) {
    // Get the absolute position of an element
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

function is_alt_search(el){
    console.log(el.parentElement);
    var p = el.parentElement;
    if (p.nodeName == 'HTML'){
        return false;
    }
    if (p.classList.contains('kno-kp')){
        return true;
    }
    return is_alt_search(p);
}

function isHidden(el) {
    return (el.offsetParent === null)
}

function ensure_pointer(){
    // Ensure the pointer exists if we are on the "all" tab
    // (Other tabs someimtes have issues if the pointer is present)
    var url = new URL(location);
    var tab = url.searchParams.get("tbm");
    pointer = document.getElementById("key_to_google_result_pointer");
    if (tab == null){
        // We are on the "all" tab, ensure the pointer exists
        if (pointer == undefined){
            document.body.innerHTML += "<div id='key_to_google_result_pointer' style='position:absolute;top:0;left:0;z-index:9999999;color:blue;opacity:0;'>&#9658;</div>"
            pointer = document.getElementById("key_to_google_result_pointer");
        }
    }
    else{
        // Not on "all" tab, remove pointer
        if (pointer != undefined){
            pointer.parent.removeChild(pointer);
        }
    }
}

function get_focussed_id(){
    // Returns the index into 'results' of the focussed result
    // or -1 if no result is focussed
    for (var i = 0; i<= results.length-1; i++){
        if (results[i] === document.activeElement){
            return i;
        }
    }
    return -1;
}

function hide_pointer(event){
    if (pointer == undefined){return}
    pointer.style.opacity="0";
    event.srcElement.removeEventListener("blur", hide_pointer);
}

function focus_element(element){
    // Focus the result element specified
    // there sometimes is a doc type label before it, use
    // that to determine the position if needed
    // also show the pointer and set the blur listener
    if (element == -1){return;}
    element.focus();
    if (pointer == undefined){return}
    var pos = getPosition(element);
    var prevSib = element.previousSibling;
    if (prevSib && prevSib.tagName == "SPAN") {
        pos = getPosition(prevSib)
        pointer.style.left = "" + pos.x-60 + "px";
    }
    pointer.style.left = "" + pos.x-30 + "px";
    pointer.style.top = "" + pos.y + "px";
    pointer.style.opacity="1";
    element.addEventListener("blur", hide_pointer, false);
}

function focus_result(step){
    // Focus a result relative to the focussed result
    // or the first result if there is no focussed result
    var fid = get_focussed_id();
    if (fid == -1){
        focus_element(results[0]);
        return;
    }

    fid = (fid+step+results.length)%results.length;
    focus_element(results[fid]);
}

function get_a_element(heading){
    // Find the 'a' tag for a result heading
    var children = heading.children;
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
    // Scan the page for results
    ensure_pointer();
    var result_headings = document.getElementsByClassName("r");
    results = []
    for (var i = 0; i<= result_headings.length-1; i++){
        el = get_a_element(result_headings[i]);
        if (!isHidden(el) && !is_alt_search(el)){
            results.push(el);
        }
    }
    if (results.length > 0){
        focus_result(0);
    }
}

function keyup(event){
    // Focus the search box and select all text if there
    // is a '/' press
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
    // Handle jogging up and down the results
    var up=38
    var down=40
    if (results.length > 0){
        if (event.keyCode == up){focus_result(-1); event.preventDefault();}
        if (event.keyCode == down){focus_result(1); event.preventDefault();}
    }
}

// A bit of maddness to scan for results when the page has loaded
window.addEventListener("DOMContentLoaded", function () {
    document.documentelement.addEventListener('DOMSubtreeModified', function() {refreshResults();}, false);
});
document.onkeydown = keydown
document.onkeyup = keyup
if(document.readyState === "complete" || document.readyState === "interactive") {
    refreshResults()
}

