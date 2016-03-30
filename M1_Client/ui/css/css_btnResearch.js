this.cssLib.btnResearch=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(def,x,y,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;

		var level,levelDef,res,num,resDef,url,picURL,lvPic,lvPicDef;
		var store,textColor,css,bad,maxLv,isMax,tech,miss;

		bad=0;
		tech=window.aisGame.king.getTech(def.codeName);
		if(tech)
		{
			level=tech.level;
		}
		else
		{
			level=0;
		}
		maxLv=def.levels.length-1;
	//	DBOut("tech:"+def.codeName+", lv:"+level+", max:"+maxLv);
		if(level<maxLv)
		{
			levelDef=def.levels[level];
			res=levelDef.cost.storage[0].type;
			num=levelDef.cost.storage[0].num;
			resDef=aisEnv.defLib.prdct[res];
		}
		else
		{
			levelDef=null;
			res="";
			num=0;
			resDef={icon:"oil"};
			isMax=1;
			bad=2;
		}

		textColor=[255,255,255];

		url=imgLib.genIconPath(resDef.icon,64);//page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		picURL=imgLib.genIconPath(def.icon,128);//page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(level+1));
		if(!isMax)
		{
			if(!window.aisGame.curCity.checkReq(levelDef))
			{
				miss=window.aisGame.curCity.getMissingFeatures(def.levels[level].req.features,1);
				miss=window.aisEnv.defLib.feature[miss[0]];
			//	textLib["ReqNotMeet"](miss.name)
			}
			//检查资源
			store=window.aisGame.curCity.allStorages[levelDef.cost.storage[0].store];
			if(store)
			{
				if(!store.checkTakeOut(levelDef.cost.storage[0]))
				{
					textColor=[255,0,0];
					bad=1;
				}
			}
		}
		css={
			type:"key",id:"BtnResearch_"+(keyid),pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,key:keyid,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{css:imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:imgLib.box_shopitem,w:150,h:150},
			state_gray:{css:imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"TechIcon",pos:[-64,-64,0],w:128,h:128,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					items:[
						{type:"div3x3",id:"shape",pos:[-6.5,135,0],w:146-4,h:36,anchor_h:0,anchor_v:2,css:imgLib.getImg("box_dark"),display:miss?1:0},//face_r:0,face_g:0,face_b:0,face_a:128
						{type:"icon",id:"ResIcon",pos:[128-25,128-28,0],w:32,h:32,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,display:miss?1:0},
						{type:"text",id:"ResNum",css:cssLib.textFineMid.createCSS([128-32+4,128-24,0],""+num,68,16,2,0,2,0,textColor),display:miss?1:0},
					//	{type:"text",id:"Level",css:cssLib.textFineMid.createCSS([10,0,0],"Lv"+(level+1),68,16,0,0,0,0)},
						{type:"icon",id:"LvIcon",pos:[lvPicDef.w/2,128-28-lvPicDef.h/2,0],css:lvPic,anchor_h:1,anchor_v:1,display:1,display:miss?1:0}
					]
				},
				{
					//TODO: 纠正文本:
					type:"text",id:"TxtBldLvReq",css:cssLib.textFineSmall.createCSS([0,0,0],"",150,150,1,1,1,1),wrap:1,display:0
				}
			],
			badToStart:bad,isMax:isMax,
			page:page,appEnv:appEnv,def:def,techLevel:level,maxLevel:maxLv,store:store,
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
	update:function(bld,def)
	{
		if(!def)
		{
			this.setEnabled(0);
			this.getItemById("TechIcon").setDisplay(0);
			this.getItemById("TxtBldLvReq").setDisplay(0);
			return;
		}
	//	def=this.def;
	//	level=this.techLevel,
	//	store=this.store;
		var level,levelDef,res,num,resDef,url,picURL,lvPic,lvPicDef;
		var store,textColor,css,bad,maxLv,isMax,tech,miss;
		bad=0;
		tech=window.aisGame.king.getTech(def.codeName);
		if(tech)
		{
			level=tech.level;
		}
		else
		{
			level=0;
		}
		maxLv=def.levels.length-1;
		if(level<maxLv)
		{
			levelDef=def.levels[level];
			res=levelDef.cost.storage[0].type;
			num=levelDef.cost.storage[0].num;
			resDef=aisEnv.defLib.prdct[res];
		}
		else
		{
			levelDef=null;
			res="";
			num=0;
			resDef={icon:"oil"};
			isMax=1;
			bad=2;
		}
		textColor=[255,255,255,255];
		url=imgLib.genIconPath(resDef.icon,64);//page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		picURL=imgLib.genIconPath(def.icon,128);//page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(level+1));
		this.getItemById("TechIcon").setTexURL(picURL);
		this.getItemById("ResIcon").setTexURL(url);
		if(lvPic)
		{
			this.getItemById("LvIcon").setTexURL(lvPic.tex);
			this.getItemById("LvIcon").setTexUV([lvPic.tex_u,lvPic.tex_v,lvPic.tex_w,lvPic.tex_h]);
		}
		if(!isMax)
		{
			this.getItemById("ResNum")._setText(num);
			if(!window.aisGame.curCity.checkReq(levelDef))
			{
				miss=window.aisGame.curCity.getMissingFeatures(def.levels[level].req.features,1);
				miss=window.aisEnv.defLib.feature[miss[0]];
			//	textLib["ReqNotMeet"](miss.name)
			}
			//检查资源
			store=window.aisGame.curCity.allStorages[levelDef.cost.storage[0].store];
			if(store)
			{
				if(!store.checkTakeOut(levelDef.cost.storage[0]))
				{
					textColor=[255,0,0,255];
					bad=1;
				}
			}
		}
		this.badToStart=bad;
		this.isMax=isMax;
		this.def=def;
		this.techLevel=level;
		this.maxLevel=maxLv;
		this.store=store;

		this.getItemById("TechIcon").setDisplay(1);
		if((!this.isMax && bld.level<def.levels[this.techLevel].req.bldLv) || this.isMax || miss)
		{
			this.badToStart=2;
			this.setEnabled(0);
			this.getItemById("TechIcon").setColor([128,128,128,128]);
			this.getItemById("shape").setDisplay(0);
			this.getItemById("ResIcon").setDisplay(0);
			this.getItemById("ResNum").setDisplay(0);
			this.getItemById("LvIcon").setDisplay(0);
			this.getItemById("TxtBldLvReq").setDisplay(1);
			if(this.isMax)
				this.getItemById("TxtBldLvReq")._setText(this.appEnv.textLib["IsMaxLv"]);
			else if(miss)
				this.getItemById("TxtBldLvReq")._setText(this.appEnv.textLib["ReqNotMeet"](miss.name));
			else
				this.getItemById("TxtBldLvReq")._setText(this.appEnv.textLib["researchNeedBldLevel"](def.levels[this.techLevel].req.bldLv,bld));
		}
		else
		{
			this.setEnabled(1);
			this.getItemById("TechIcon").setColor([255,255,255,255]);
			this.getItemById("shape").setDisplay(1);
			this.getItemById("ResIcon").setDisplay(1);
			this.getItemById("ResNum").setDisplay(1);
			this.getItemById("ResNum").__setColor(textColor);
			this.getItemById("LvIcon").setDisplay(1);
			this.getItemById("TxtBldLvReq").setDisplay(0);
		}
	},
};
