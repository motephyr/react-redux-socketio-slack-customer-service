window._ceWin = null;

window._ceEnableCollect = false;

window._ceCount = 0;
window._collectStamp = {};
window._ceRecordInterval = 100;
window._collectEvents = ['mousemove', 'scroll', 'click'];
window._windowEvents = ['focus','blur'];
window._ceCollectAction = function(eventArg){
    // Avoid bubble event triggers.

    if(window._ceWin && window._ceEnableCollect && eventArg._ceHasTriggered !== true){
        // to do send event name
        // console.log(eventArg);
        var stamps = window._collectStamp;
        var curTime = (new Date()).getTime();
        var isBubble = eventArg.bubbles;
        var storeTime = stamps[eventArg.type] || eventArg.target._lastScrollStamp || 0;
        if( curTime - storeTime >= window._ceRecordInterval){
            var target = eventArg.target;
            // var type = (_visibilityChange == eventArg.type)
            var actionObj = {
                target_id: target._ceSerial,
                event: eventArg.type,
                stamp: curTime,
                scrollTop: target.scrollTop,
                scrollLeft: target.scrollLeft,
                x: eventArg.x,
                y: eventArg.y
            };
            if(actionObj.event == _visibilityChange) actionObj.status = document[_visibilityState];
            var o = {
                event: 'update_user_action',
                actionInfo: JSON.stringify(actionObj)
            };
            window._ceWin.postMessage(JSON.stringify(o), "*");

            if(isBubble) stamps[eventArg.type] = curTime;
            else target._lastScrollStamp = curTime;
            // console.log("event:[" + eventArg.type + "] Record!");
        }

        eventArg._ceHasTriggered = true;
    }
};

(function() {
    // events of window and document should doing something other.
    Element.prototype._addEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(name,eventFn,capture) {
        var combinedFn = eventFn;
        if(_collectEvents.indexOf(name) != -1){
            combinedFn = function(){
                eventFn.apply(this, arguments);
                var eventArg = null,
                    i = 0, len = arguments.length;
                for(; i < len; i++){
                    if(arguments[i].toString().substr(-6) == 'Event]'){
                        eventArg = arguments[i];
                        break;
                    }
                }
                if(eventArg) window._ceCollectAction.call(this, eventArg);
            };
        }
        this._addEventListener(name, combinedFn, capture);
    };
    
})();

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

function getValidJSON(str) {
    try {
        var o = JSON.parse(str);
        return o;
    } catch (e) {
        return null;
    }
}

function _getMaxZindex(dom){
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
}

function _hookWindowEvents(){
    window._windowEvents.forEach(function(name){
        window.addEventListener(name, _ceCollectAction);
    });
}

function _hookDocumentEvents(){
    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    // Set the name of the hidden property and the change event for visibility
    window._visibilityChange = "";
    window._visibilityState = "";
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      _visibilityChange = "visibilitychange";
      _visibilityState = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
      _visibilityChange = "mozvisibilitychange";
      _visibilityState = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
      _visibilityChange = "msvisibilitychange";
      _visibilityState = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
      _visibilityChange = "webkitvisibilitychange";
      _visibilityState = "webkitVisibilityState";
    }

    _collectEvents.concat([_visibilityChange]).forEach(function(name){
        document.addEventListener(name, _ceCollectAction);
    });
}

function _hookElementsEvent(elList){
    var i = 0, len = elList.length;
    for(; i < len; i++){
        var el = elList[i];
        el._ceSerial = ++_ceCount;
        // scroll
        if(el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth){
            el.addEventListener('scroll', function(){});
        }

    }
}

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
                _tmpFn.apply(chatInfo.scope || this, chatInfo.args || []);
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
    
    _hookWindowEvents();
    _hookDocumentEvents();
    _hookElementsEvent(document.querySelectorAll('*'));

},false);

