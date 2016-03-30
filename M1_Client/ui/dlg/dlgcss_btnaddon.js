__Page.btnBuyAddOn=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(page,appEnv,def,typeIdx,x,y,keyid)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib;
		var picURL;
		var textColor,css,bad;
		var textLib;
		var resIconURL,resNum;

		textLib=appEnv.textLib;

		bad=0;
		textColor=[255,255,255];
		if(def)
		{
			picURL=page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
		}
		else
		{
			picURL="";
		}
		var cost=def.cost;
		if(cost.cash)
		{
			resNum=cost.cash;
			resIconURL=page.genPageURL(window.imgPath+"/icon/icon_res_chip64_32.png");
		}
		else if(cost.gem)
		{
			resNum=cost.gem;
			resIconURL=page.genPageURL(window.imgPath+"/icon/icon_res_gem64_32.png");
		}
		else
		{
			resNum=cost.storage[0].num;
			resIconURL=imgLib.genIconPath("res_"+cost.storage[0].store.toLowerCase(),64);
		}
		var pic;
		if(def.discount && def.discount<100)
		{
			pic=imgLib.getImg("icon_discount80m");
		}
		else
		{
			pic=imgLib.getImg("pic_limitsell");
		}
		css={
			type:"key",id:"BtnBuyAddon_"+(typeIdx+1),"pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:150,h:150},//audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:150,h:150},
			state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"SpellIcon",pos:[-75,-75,0],w:150,h:150,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					items:[
						cssLib.btnInfo.createCSS([150-24,24,0],keyid-1),
						{type:"div3x3",id:"shape",pos:[2,147,0],w:150-4,h:36,anchor_h:0,anchor_v:2,css:imgLib.getImg("box_dark")},
						{type:"icon",id:"ResIcon",pos:[150-32,150-34,0],w:32,h:32,tex:resIconURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
						{type:"text",id:"ResNum",css:cssLib.textFineMid.createCSS([150-32,150-28,0],""+resNum,68,16,2,0,2,0,textColor)},
						{type:"text",id:"Name",css:cssLib.textFineMid.createCSS([3,3,0],def.name,150,150,0,0,0,0),font_size:FS.L},
						{type:"icon",id:"ExIcon",pos:[2,150>>1,0],anchor_v:1,css:pic,display:(def &&def.isOnSale)?1:0},
					]
				},
			],
			page:page,appEnv:appEnv,def:def,
		};
		return css;
	},
};

__Page.btnAddOnQ=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(page,appEnv,slot,x,y,keyid)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib;
		var def,level,levelDef,res,num,url,picURL;
		var store,textColor,css;
		def=slot.def;
		picURL=page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
		css={
			type:"key",id:"BtnAddOnQ","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:100,h:100},//audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:100,h:100},
			state_gray:{"css":imgLib.box_shopitem,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:128},
			display:1,fade:1,fade_alpha:0,fade_size:1,
			items:[
				{
					type:"icon",id:"UnitIcon",pos:[-50,-50,0],w:100,h:100,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,
					items:[
						{type:"icon",pos:[80,20,0],w:30,h:30,anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_sub")},//减少按钮
						{type:"text",id:"TXT_Num",css:cssLib.textFineMid.createCSS([3,95,0],"10x",68,16,0,2,0,2)},//数量
					],
				},
			],
			page:page,appEnv:appEnv,slot:slot,
			update:this.update,
			onFadeDone:this.onFadeDone,
			delSelf:this.delSelf,
		};
		return css;
	},
	create:function(page,appEnv,box,slot,x,y,keyid)
	{
		var css,btn;
		css=this.createCSS(page,appEnv,slot,x,y,keyid);
		btn=box.appendNewChild(css);
		btn.txtNum=btn.getItemById("TXT_Num");
		btn.slot=slot;
		btn.def=slot.def;
		slot.btn=btn;
		//TODO: Set progress bar value:
		btn.update();
		return btn;
	},
	update:function()
	{
		var slot=this.slot;
		var num,time,fullTime;

		num=slot.num;
		if(num>0)
		{
			//设置数量
			this.txtNum._setText(""+num+"x");
		}
		else
		{
			var pos=[0,0,0];
			//DBOut("Delete training button!");
			this.getPos(pos);
			if(slot.aborted)
			{
				pos[1]-=50;
			}
			else
			{
				pos[0]+=150;
			}
			this.setFadePos(pos);
			this.appEnv.hudOut(this,5);
		}
	},
	onFadeDone:function()
	{
		this.appEnv.layer.setFrameout(0,this.delSelf,this);
	},
	delSelf:function()
	{
		this.getFather().removeChild(this);
	},
};

__Page.btnAddOnJoin=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(page,appEnv,x,y,keyid,text)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textColor,css;

		textColor=[255,255,255];
		css={
			type:"key",id:"BtnAddonJoin","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:255},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:255},
			state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:255},
			items:[
				{type:"icon",pos:[47,24,0],display:1,css:imgLib.getImg("pic_mech_add"),anchor_h:1,anchor_v:1,filter:1,ui_event:1,flash:2},
				{
					type:"icon",id:"Icon",pos:[0,0,0],w:150,h:150,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
					items:[
						{type:"text",id:"QTip",css:cssLib.textFineMid.createCSS([0,75-24,0],text,128,16,1,0,1,2,textColor)},
					]
				}
			],
			page:page,appEnv:appEnv,def:null,initText:text,
			update:this.update
		};
		return css;
	},
	update:function(def)
	{
		var icon,tip,q;
		var picURL="";
		icon=this.getItemById("Icon");
		tip=this.getItemById("QTip");
		this.def=def;
		DBOut("=== "+def+" "+this.initText);
		if(def)
		{
			picURL=this.page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
			icon.setTexURL(picURL);
			icon.setDisplay(1);
			q=def.quality>0?def.quality:1;
			tip._setText(this.appEnv.getAddOnLv(q));
		}
		else
		{
		//	icon.setDisplay(0);
			icon.setTexURL("");
			tip._setText(this.initText);
		}
		icon.setTexURL(picURL);
	}
};

__Page.btnAddOnList=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(page,appEnv,x,y,keyid)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var css;

		css={
			type:"key",id:"BtnAddonList","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:72,h:72},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:72,h:72},
			state_gray:{"css":imgLib.box_shopitem_g,w:72,h:72,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"Icon",pos:[-32,-32,0],w:64,h:64,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					items:[
						{type:"text",id:"QTip",css:cssLib.textFineSmall.createCSS([2,2,0],"=",128,16,0,0,0,0)},
						{type:"text",id:"NTip",css:cssLib.textFineSmall.createCSS([60,72-26,0],"=",64,16,2,0,2,2)},
					]
				},
			],
			page:page,appEnv:appEnv,def:null,
			update:this.update
		};
		return css;
	},
	update:function(def,tq,num)
	{
		var icon,tip,q,ntip;
		var picURL="";
		icon=this.getItemById("Icon");
		tip=this.getItemById("QTip");
		ntip=this.getItemById("NTip");
		if(def)
		{
			picURL=this.page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
			icon.setDisplay(1);
			if(!tq)
			{
				q=def.quality>0?def.quality:1;
				tip._setText(this.appEnv.getAddOnLv(q));
			}
			else
			{
				if(tq==def.quality)
				{
					tip._setText("=");
				}
				else if(tq>def.quality)
				{
					tip._setText("<");
				}
				else
				{
					tip._setText(">");
				}
			}
			if(num)
			{
				ntip._setText("x"+num);
			}
			else
			{
				ntip._setText("");
			}
		}
		else
		{
			icon.setDisplay(0);
			tip._setText("");
			ntip._setText("");
		}
		icon.setTexURL(picURL);
	}
};

__Page.boxCash=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(page,appEnv,pos,city)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var css,def,url;
		url=page.genPageURL(window.imgPath+"/icon/icon_res_chip64_32.png");
		css={
			type:"shape",id:"CashBox",pos:pos,w:150,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"icon",id:"BarBox","pos":[75,0,0],w:150,h:40,"css":cssLib.resBox,"anchor_h":2,"anchor_v":1,
				},
				{type:"icon",id:"Pic-Res",pos:[60,0,0],w:64,h:64,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1},//资源图标
				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([30,0,0],"2d 11h",240,30,2,1,2,1)},//当前数量
			],
			page:page,appEnv:appEnv,city:city,
			update:this.update,
		};
		return css;
	},
	create:function(page,appEnv,box,pos,city)
	{
		var css,bar;
		css=this.createCSS(page,appEnv,pos,city);
		bar=box.appendNewChild(css);
		bar.picRes=bar.getItemById("Pic-Res");
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.update();
		return bar;
	},
	update:function()
	{
		var num;
		num=this.city.king.cashNum;
		DBOut("this.txtCur: "+this.txtCur);
		this.txtCur._setText(""+num);
	}
};

__Page.dlgCSSBtnFuseOil={
	createCSS:function(page,appEnv,x,y,keyid,text)
	{
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var page=cssLib.page;
		var textLib;
		var textColor,css;

		textLib=appEnv.textLib;
		textColor=[255,255,255];
		css={
			type:"key",id:"BtnFuseOil","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:255},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:255},
			state_gray:{"css":imgLib.box_shopitem_g,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:255},
			items:[
				{type:"icon",pos:[30,5,0],display:1,css:imgLib.getImg("pic_mech_add"),anchor_h:1,anchor_v:1,filter:1,ui_event:1,w:22,h:22,flash:2},
				{
					type:"icon",id:"PartIcon",pos:[0,0,0],w:96,h:96,display:1,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
					items:[
						{type:"text",id:"QTip",css:cssLib.textFineMid.createCSS([0,50-24,0],text,128,16,1,0,1,2,textColor)},
					]
				},
			],
			page:page,appEnv:appEnv,part:null,subType:null,initText:text,
			update:this.update
		};
		return css;
	},
	update:function(def)
	{
		var picURL="";
		var icon;
		icon=this.getItemById("PartIcon");
		tip=this.getItemById("QTip");
		this.def=def;
		if(def)
		{
			picURL=this.page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_32.png");
			icon.setTexURL(picURL);
			icon.setDisplay(1);
			q=def.quality>0?def.quality:1;
			tip._setText(this.appEnv.getAddOnLv(q));
		}
		else
		{
		//	icon.setDisplay(0);
			icon.setTexURL("");
			tip._setText(this.initText);
		}
	},
};
