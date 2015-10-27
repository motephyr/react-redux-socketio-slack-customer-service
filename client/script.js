function _changeIframeSize(w, h){
    var f =document.getElementById('iframe');
    f.width = w
    f.height = h
}

var _getMaxZindex = function(dom){
    dom = dom || document.body;
    var maxZindex = -1;
    var items = dom.querySelectorAll('*');
    for(var i = 0, len = items.length; i< len; i++){
        var item = items[i];
        var styles = getComputedStyle(item);
        var zIndex = styles["zIndex"];
        var getIt = zIndex != 'auto';
        if(getIt){
            maxZindex = Math.max(parseInt(zIndex), maxZindex);
        }
    }
    return maxZindex;
};

window.addEventListener("load", function _onload(event){
    window.removeEventListener("load", _onload, false);
    var dom = document.createElement('iframe');
    dom.id = "iframe";
    dom.src = "http://52.68.126.89/client/index.html";
    dom.style.cssText = "z-index: 16000002;position: fixed; right: 0px; bottom: 0px;margin: 0px;padding: 0px; border: 0px;background: transparent;";
    dom.style['zIndex'] = _getMaxZindex() + 1;
    dom.width = 60;
    dom.height = 22;
    document.body.appendChild(dom);
},false);