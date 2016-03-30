﻿this.cssLib.btnMakeSpell=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(def,typeIdx,x,y,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;

		var level,levelDef,res,num,resDef,url,picURL,lvPic,lvPicDef;
		var store,textColor,css,bad,maxLv,isMax;

		bad=0;
		level=window.aisGame.king.getSpellLevel(def.codeName);//TODO: 增加单位等级机制
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
		res=levelDef.cost.storage[0].type;
		num=levelDef.cost.storage[0].num;
		resDef=aisEnv.defLib.prdct[res];

		textColor=[255,255,255];
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
		url=imgLib.genIconPath(resDef.icon,64);//=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		picURL=imgLib.genIconPath(def.icon,128);//page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
		lvPicDef=imgLib.getImg("pic_lv1");
		lvPic=imgLib.getImg("pic_lv"+(level+1));
		css={
			type:"key",id:"BtnMakeSpell_"+(typeIdx+1),pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,key:keyid,ui_event:1,filter:1,down_scale:0.95,button:1,
			state_up:{css:imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:imgLib.box_shopitem,w:150,h:150},
			state_gray:{css:imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"SpellIcon",pos:[-64,-64,0],w:128,h:128,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,ui_event:1,
					items:[
						cssLib.btnInfo.createCSS([112,14,0],keyid-1),
						{type:"div3x3",id:"shape",pos:[-6.5,135,0],w:146-4,h:36,anchor_h:0,anchor_v:2,css:imgLib.getImg("box_dark")},//face_r:0,face_g:0,face_b:0,face_a:128
						{type:"icon",id:"ResIcon",pos:[128-25,128-28,0],w:32,h:32,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
						{type:"text",id:"ResNum",css:cssLib.textFineMid.createCSS([128-32+4,128-24,0],""+num,68,16,2,0,2,0,textColor)},
						{type:"icon",id:"LvIcon",pos:[lvPicDef.w/2-3,128-28-lvPicDef.h/2,0],css:lvPic,anchor_h:1,anchor_v:1,display:1}
					]
				},
				{
					type:"text",id:"TxtBldLvReq",css:cssLib.textFineSmall.createCSS([0,0,0],textLib.spellNeedBldLevel(def.bldLvReq),150,150,1,1,1,1),wrap:1,display:0
				}
			],
			badToBuild:bad,
			page:page,appEnv:appEnv,def:def,spellLevel:level,store:store,
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
	update:function(bld)
	{
		var def,level,levelDef,store,rmCap,tstore;
		def=this.def;
		level=this.spellLevel,
		levelDef=def.levels[level];
		store=this.store;
		if(store)
		{
			if(!store.checkTakeOut(levelDef.cost.storage[0]))
			{
				this.getItemById("ResNum").setColor(255,0,0,255);
				this.badToBuild=1;
			}
			else
			{
				this.getItemById("ResNum").setColor(255,255,255,255);
			}
		}
		//TODO: 检查兵营造兵容量
		if(bld)
		{
			tstore=bld.tgtStorage;
			rmCap=bld.getValue("mfcCap")-bld.slotCap;
			//DBOut("Free cap: "+tstore.getFreeCap()+", slotCap:"+bld.slotCap);
			if(bld.level<def.bldLvReq)
			{
				if(this.getEnabled())
				{
					this.setEnabled(0);
				}
				this.getItemById("SpellIcon").setColor([128,128,128,64]);
				this.getItemById("shape").setDisplay(0);
				this.getItemById("ResIcon").setDisplay(0);
				this.getItemById("ResNum").setDisplay(0);
				this.getItemById("LvIcon").setDisplay(0);
				this.getItemById("TxtBldLvReq").setDisplay(1);
				this.getItemById("TxtBldLvReq")._setText(this.appEnv.textLib["unitNeedBldLevel"](def.bldLvReq,bld));
				this.getItemById("LvIcon").setDisplay(0);
				this.badToBuild=1;
			}
			else if(rmCap<def.storageSize || tstore.getFreeCap()<(def.storageSize+bld.slotCap))
			{
				if(this.getEnabled())
				{
					this.setEnabled(0);
				}
				this.getItemById("SpellIcon").setColor([128,128,128,64]);
				this.getItemById("shape").setDisplay(0);
				this.getItemById("ResIcon").setDisplay(0);
				this.getItemById("ResNum").setDisplay(0);
				this.getItemById("LvIcon").setDisplay(0);
				//this.getItemById("TxtBldLvReq").setDisplay(1);
				this.badToBuild=3;
			}
			else
			{
				if(!this.getEnabled())
				{
					this.setEnabled(1);
				}
				this.getItemById("SpellIcon").setColor([255,255,255,255]);
				this.getItemById("shape").setDisplay(1);
				this.getItemById("ResIcon").setDisplay(1);
				this.getItemById("ResNum").setDisplay(1);
				this.getItemById("LvIcon").setDisplay(1);
				this.getItemById("TxtBldLvReq").setDisplay(0);
			}
		}
	},
};
