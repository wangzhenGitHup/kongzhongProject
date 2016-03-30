this.cssLib.btnStoreUnit=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(def,typeIdx,x,y,keyid,exInfo)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;

		var level,levelDef,res,num,resDef,url,picURL,lvPic,lvPicDef;
		var store,textColor,css,bad,maxLv,isMax;
		var gemNum, price;

		bad=0;
		level=window.aisGame.king.getUnitLevel(def.codeName);//TODO: 增加单位等级机制
		maxLv=def.levels.length-1;
	//	DBOut("unit:"+def.codeName+", lv:"+level);
		if(level<maxLv)
		{
		}
		else
		{
			isMax=1;
		}
		levelDef=def.levels[level];

		textColor=[255,255,255];
		//检查资源
		price=levelDef["CostGem"];
		if("fort"==exInfo)
			price=0;
		gemNum=window.aisGame.king.gemNum;
		if(gemNum<price)
		{
			textColor=[255,0,0];
			bad=1;
		}
		url=imgLib.getIcon("res_gem",64);
		picURL=imgLib.getIcon(def.icon,128);
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(level+1));
		css={
			type:"key",id:"btnStoreUnit_"+(typeIdx+1),pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,key:keyid,ui_event:1,filter:1,down_scale:0.95,
			state_up:{"css":imgLib.box_shopitem,w:150,h:150},//audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:150,h:150},
			state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"UnitIcon",pos:[-64,-64,0],w:128,h:128,css:picURL,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					items:[
						{type:"div3x3",id:"shape",pos:[-6.5,135,0],w:146-4,h:36,anchor_h:0,anchor_v:2,css:imgLib.getImg("box_dark")},//face_r:0,face_g:0,face_b:0,face_a:128
						{type:"icon",id:"ResIcon",pos:[128-25,128-28,0],w:32,h:32,css:url,anchor_h:0,anchor_v:0,filter:1},
						{type:"text",id:"ResNum",css:cssLib.textFineMid.createCSS([128-32+4,128-24,0],""+price,68,16,2,0,2,0,textColor)},
						{type:"icon",id:"LvIcon",pos:[lvPicDef.w/2-3,128-28-lvPicDef.h/2,0],css:lvPic,anchor_h:1,anchor_v:1,display:1},
						{type:"icon",id:"LvIcon1",pos:[lvPicDef.w/2-3,128-28-lvPicDef.h/2+20,0],css:lvPic,anchor_h:1,anchor_v:1,display:0}
					]
				},
				{type:"text",id:"UnitNum",css:cssLib.textFineMid.createCSS([0,0,0],textLib["getRemainNum"](0),140,140,1,1,0,0),wrap:1,display:1},
				{type:"text",id:"NotEnough",css:cssLib.textFineSmall.createCSS([0,0,0],textLib["NotEnoughSpace"],150,150,1,1,1,1),wrap:1,display:0}
			],
			page:page,appEnv:appEnv,def:def,unitLevel:level,price:price,
			update:this.update,
			onFadeDone:function(v)
			{
				if(!v)
				{
					this.appEnv.layer.setFrameout(0,this.delSelf,this);
				}
			},
			delSelf:function()//删除当前按钮
			{
				this.deadOut=1;
				this.getFather().removeChild(this);
			}
		};
		return css;
	},
	update:function(storage,exStorage,exInfo,def)
	{
		var level,levelDef,lvPicDef,lvPic,store,rmCap,resBad,num,picURL;
		if(!def)
		{
			this.setEnabled(0);
			this.getItemById("UnitIcon").setDisplay(0);
			this.getItemById("UnitNum").setDisplay(0);
			this.getItemById("NotEnough").setDisplay(0);
			return;
		}

		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var def,level,levelDef,store,rmCap,resBad;
		var gemNum, price;
	//	def=this.def;
	//	level=this.unitLevel,
		level=window.aisGame.king.getUnitLevel(def.codeName);
		levelDef=def.levels[level];
		price=levelDef["CostGem"];
		if("fort"==exInfo)
			price=0;
		this.def=def;
		this.unitLevel=level;
		this.price=price;
		gemNum=window.aisGame.king.gemNum;
		resBad=0;
		if(gemNum<this.price)
		{
			this.getItemById("ResNum").setColor(255,0,0,255);
			resBad=this.resBad=1;
		}
		else
		{
			this.getItemById("ResNum").setColor(255,255,255,255);
			resBad=this.resBad=0;
		}
		picURL=imgLib.genIconPath(def.icon,128);
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(level+1));
		this.getItemById("UnitIcon").setTexURL(picURL);
	//	this.getItemById("ResIcon").setTexURL(url);
		if(lvPic)
		{
			this.getItemById("LvIcon").setTexURL(lvPic.tex);
			this.getItemById("LvIcon").setTexUV([lvPic.tex_u,lvPic.tex_v,lvPic.tex_w,lvPic.tex_h]);
			this.getItemById("LvIcon1").setTexURL(lvPic.tex);
			this.getItemById("LvIcon1").setTexUV([lvPic.tex_u,lvPic.tex_v,lvPic.tex_w,lvPic.tex_h]);
		}
		this.getItemById("ResNum")._setText(price);
	//	exStorage=window.aisGame.curCity.clanStorage;
		rmCap=exStorage.getFreeCap();
		this.getItemById("UnitIcon").setDisplay(1);
		this.getItemById("UnitNum").setDisplay(1);
		//TODO: 检查兵营造兵容量
		if(storage)
		{
			var i, unitNum=0, levelTech=0;
			var list=storage.slots;
			var slot=list[def.codeName];
			if(slot)
			{
			//	for(i in slot)DBOut(i+":"+slot[i]);
				unitNum=slot.num;
				levelTech=slot.def.levelTech;
			}
			this.numBad=0;
			this.getItemById("UnitNum")._setText(textLib["getRemainNum"](unitNum));
			if(!unitNum)
			{
				this.numBad=1;
				this.setEnabled(0);
				this.getItemById("UnitIcon").setColor([128,128,128,64]);
				this.getItemById("shape").setDisplay(0);
				this.getItemById("ResIcon").setDisplay(0);
				this.getItemById("ResNum").setDisplay(0);
				this.getItemById("LvIcon").setDisplay(0);
			//	this.getItemById("UnitNum").setDisplay(0);
				this.getItemById("UnitNum")._setColor(255,0,0,255);
				this.getItemById("NotEnough").setDisplay(0);
			}
			else if(rmCap<def.storageSize)
			{
				this.setEnabled(0);
				this.getItemById("UnitIcon").setColor([128,128,128,64]);
				this.getItemById("shape").setDisplay(0);
				this.getItemById("ResIcon").setDisplay(0);
				this.getItemById("ResNum").setDisplay(0);
				this.getItemById("LvIcon").setDisplay(0);
			//	this.getItemById("UnitNum").setDisplay(0);
				this.getItemById("UnitNum")._setColor(255,255,255,255);
				this.getItemById("NotEnough").setDisplay(1);
			}
			else
			{
				this.setEnabled(1);
				this.getItemById("UnitIcon").setColor([255,255,255,255]);
				this.getItemById("shape").setDisplay(1);
				this.getItemById("ResIcon").setDisplay(1);
				this.getItemById("ResNum").setDisplay(1);
				this.getItemById("LvIcon").setDisplay(1);
			//	this.getItemById("UnitNum").setDisplay(1);
				this.getItemById("UnitNum")._setColor(255,255,255,255);
				this.getItemById("NotEnough").setDisplay(0);
			}
		}
		if("fort"==exInfo)
		{
			this.getItemById("shape").setDisplay(0);
			this.getItemById("ResIcon").setDisplay(0);
			this.getItemById("ResNum").setDisplay(0);
			this.getItemById("LvIcon").setDisplay(0);
			if(this.getEnabled())
				this.getItemById("LvIcon1").setDisplay(1);
			else
				this.getItemById("LvIcon1").setDisplay(0);
		}
	//	this.getItemById("LvIcon").setDisplay(levelTech?1:0);
	//	this.getItemById("LvIcon1").setDisplay(levelTech?1:0);
	},
};
