(function(root, factory){

    root['Act'] = factory();

})(window, function(){

    var Act = {

        /*_document : document,

        setDocument : function(_document) {
            this._document = _document;
        },*/

        validDOMAttrs : [
            'href',
            'title',
            'src',
            'type',
            'name',
            'placeholder'
        ],

        validDOMEvents : [
            'onsubmit'
        ],

        defineElement : function(elementDef) {
            return (function(_elementDef){
                return function(attrs, children) {
                    return _elementDef.render(attrs, children);
                };
            })(elementDef);
        },

        render : function(el, container) {
            if (container.firstChild) {
                Act._compareTree(container.firstChild, el, container);
            } else {
                container.appendChild(el);
            }
        },

        DOM : function(type) {
            return (function(_type, _self){
                return function(attributes, children) {
                    var elId = (attributes) ? JSON.stringify(attributes) : '';
                    var newEl = document.createElement(_type);
                    if (children && Array.isArray(children)) {
                        for (var i = 0; i < children.length; i++) {
                            newEl.appendChild(children[i]);
                        }
                    } else if (children && (children !== null && typeof children !== 'object')) {
                        newEl.appendChild(document.createTextNode(children));
                        elId += children;
                    }
                    newEl.setAttribute("data-adapt-id", elId);
                    if (attributes) {
                        if (attributes.className) {
                            newEl.setAttribute("class", attributes.className);
                        }
                        for (attrName in attributes) {
                            if (Act.validDOMAttrs.indexOf(attrName) > -1) {
                                newEl.setAttribute(attrName, attributes[attrName]);
                            } else if (Act.validDOMEvents.indexOf(attrName) > -1) {
                                newEl[attrName] = attributes[attrName];
                            }
                        }
                    }
                    return newEl;
                }
            })(type, Act);
        },

        _compareTree : function(originalEl, newEl, parentEl) {
            //TODO this is where the work goes
            if (originalEl.getAttribute("data-adapt-id") != newEl.getAttribute("data-adapt-id")) {
                //TODO don't need to replace, just change attrs?
                var dupNode = newEl.cloneNode(true);
                parentEl.replaceChild(dupNode, originalEl);
            } else if (newEl.childNodes.length === 0) {
                while (originalEl.firstChild) {
                    originalEl.removeChild(originalEl.firstChild);
                }
            } else if (newEl.childNodes.length > 1 || (newEl.childNodes.length === 1 && newEl.childNodes[0].nodeName != '#text')) {
                var oLen = originalEl.childNodes.length,
                    nLen = newEl.childNodes.length;
                if (nLen === oLen) {
                    for (var i = 0; i < nLen; i++) {
                        Act._compareTree(originalEl.childNodes[i], newEl.childNodes[i], originalEl);
                    }
                } else if (nLen > oLen) {
                    for (var i = 0; i < nLen; i++) {
                        if (i < oLen) {
                            Act._compareTree(originalEl.childNodes[i], newEl.childNodes[i], originalEl);
                        } else {
                            originalEl.appendChild(newEl.childNodes[i]);
                        }
                    }
                } else if (nLen < oLen) {
                    for (var i = 0; i < oLen; i++) {
                        if (i < nLen) {
                            Act._compareTree(originalEl.childNodes[i], newEl.childNodes[i], originalEl);
                        } else {
                            originalEl.removeChild(originalEl.childNodes[i]);
                        }
                    }
                }
            }
        },

        _isNode : function(o) {
            return (
                typeof Node === "object" ? o instanceof Node :
                o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
            );
        },

        _isElement : function(o) {
            return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
            );
        }

    };

    return Act;

});