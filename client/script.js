function _changeIframeSize(w, h){
    _messageIframe.width = w;
    _messageIframe.height = h;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
  return null;
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getValidJSON (str) {
    try {
        var o = JSON.parse(str);
        return o;
    } catch (e) {
        return null;
    }
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

window._ceWin = null;

window.addEventListener("load", function _onload(event){
    window.removeEventListener("load", _onload, false);
    window.addEventListener('message', function(e){
        var chatInfo;
        if(e.data == "onPanelHeaderClick"){
            _changeIframeSize(72,24);
        }else if(e.data == "onButtonClick"){
            _changeIframeSize(370, document.body.clientHeight);
        }else if(e.data == "debugTest"){
            alert("cross-domain test");
        }else if(chatInfo = getValidJSON(e.data)){
            var fn = chatInfo.fn;
            if(fn){
                eval("var _tmpFn = " + fn);
                _tmpFn.apply(chatInfo.scope || this, chatInfo.args);
                window._tmpFn = null;
            }
        }
    }, false);

    var dom = window._messageIframe =  document.createElement('iframe');
    dom.style.cssText = "position: fixed; right: 0px; bottom: 0px;margin: 0px;padding: 0px; border: 0px;background: transparent;";
    dom.style['zIndex'] = _getMaxZindex() + 1;
    dom.width = 72;
    dom.height = 24;
    dom.addEventListener('load', function(){ window._ceWin = dom.contentWindow; });
    dom.src = window._debugUrl || "http://52.68.126.89/client/index.html";
    document.body.appendChild(dom);
},false);

// for test
// $(window).focus(function() { console.log("focus"); });
// $(window).blur(function() { console.log("blur"); });
// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// Set the name of the hidden property and the change event for visibility
// var _visibilityChange, _visibilityState;
// if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
//   _visibilityChange = "visibilitychange";
//   _visibilityState = "visibilityState";
// } else if (typeof document.mozHidden !== "undefined") {
//   _visibilityChange = "mozvisibilitychange";
//   _visibilityState = "mozVisibilityState";
// } else if (typeof document.msHidden !== "undefined") {
//   _visibilityChange = "msvisibilitychange";
//   _visibilityState = "msVisibilityState";
// } else if (typeof document.webkitHidden !== "undefined") {
//   _visibilityChange = "webkitvisibilitychange";
//   _visibilityState = "webkitVisibilityState";
// }
// document.addEventListener(_visibilityChange, function(e){
//     console.log(document[_visibilityState]);
// }, false);
