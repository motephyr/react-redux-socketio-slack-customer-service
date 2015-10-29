function _changeIframeSize(w, h){
    _messageIframe.width = w;
    _messageIframe.height = h;
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
    window.addEventListener('message', function(e){
        if(e.data == "onPanelHeaderClick"){
            _changeIframeSize(60,22);
        }else if(e.data == "onButtonClick"){
            _changeIframeSize(370, document.body.clientHeight);
        }else if(e.data == "debugTest"){
            alert("cross-domain test");
        }
    }, false);

    var dom = window._messageIframe =  document.createElement('iframe');
    dom.style.cssText = "z-index: 16000002;position: fixed; right: 0px; bottom: 0px;margin: 0px;padding: 0px; border: 0px;background: transparent;";
    dom.style['zIndex'] = _getMaxZindex() + 1;
    dom.width = 60;
    dom.height = 22;
    dom.src = "http://52.68.126.89/client/index.html";
    document.body.appendChild(dom);
},false);