define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"./Tooltip",
	"./Overlay"
], function(declare, lang, win, domClass, domConstruct, domStyle, domGeometry, Tooltip, Overlay){

	/*=====
		Tooltip = dojox.mobile.Tooltip;
		Overlay = dojox.mobile.Overlay;
	=====*/
	var isOverlay = domClass.contains(win.doc.documentElement, "dj_phone");
	var cls = declare("dojox.mobile.Opener", isOverlay ? Overlay : Tooltip, {
		// summary:
		//		A non-templated popup widget that will use either Tooltip or Overlay depending on screen size
		//
		buildRendering: function(){
			this.inherited(arguments);
			this.cover = domConstruct.create('div', { onclick: lang.hitch(this, '_onBlur'), 'class': 'mblOpenerUnderlay', style: { top:'0px', left:'0px', width:'0px', height:'0px', position: isOverlay ? 'absolute' : 'fixed', backgroundColor:'transparent', overflow:'hidden' }}, this.domNode, 'first');
		},

		onShow: function(/*DomNode*/node){},
		onHide: function(/*DomNode*/node, /*Anything*/v){},

		show: function(node, positions){
			this.node = node;
			this.onShow(node);
			if(isOverlay){
				setTimeout(lang.hitch(this, function(){ // show cover after positioning popup
					var pos = domGeometry.position(this.domNode, false);
					var size = Math.max(pos.w+pos.x, pos.h+pos.y); // largest size in case of rotation
					domStyle.set(this.cover, { top:-pos.y+'px', left:-pos.x+'px', width:size+'px', height:size+'px' });
				}), 0);
			}else{
				var size = Math.max(win.doc.documentElement.scrollHeight, win.body().scrollHeight, win.doc.documentElement.clientHeight,
							win.doc.documentElement.scrollWidth, win.body().scrollWidth, win.doc.documentElement.clientWidth); // largest size in case of rotation
				domStyle.set(this.cover, { width:size+'px', height:size+'px' });
			}
			return this.inherited(arguments);
		},

		hide: function(/*Anything*/ val){
			this.inherited(arguments);
			domStyle.set(this.cover, { height:'0px' });
			this.onHide(this.node, val);
		},

		_onBlur: function(e){
			var ret = this.onBlur(e);
			if(ret !== false){ // only exactly false prevents hide()
			        this.hide(e);
			}
			return ret;
		}
	});
	cls.prototype.baseClass += " mblOpener"; // add to either mblOverlay or mblTooltip
	return cls;
});
