this.cssLib.btnMakePart=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(def,typeIdx,x,y,keyid,level)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var picURL;
		var store,textColor,css,bad;
		var textLib;
		var resIconURL,resNum;
		var storage,slot,haveNum,i;

		appEnv=page.appEnv;
		textLib=appEnv.textLib;

		bad=0;
		textColor=[255,255,255];
		storage=window.aisGame.curCity.partStorage;
		slots=storage.slots;
		if(def)
		{
			haveNum=0;
			for(i in slots)
			{
				if(i.indexOf(def.codeName)>-1)
				{
					if(haveNum)
					{
						haveNum=slots[i].num;
					}
				}
			}
			picURL=page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_m_32.png");
			var cost=def["levels"][0].cost;
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
			else if(cost.storage && cost.storage[0])
			{
				resNum=cost.storage[0].num;
				var res=cost.storage[0].store;
				resIconURL=page.genPageURL(window.imgPath+"/icon/icon_res_"+res.toLowerCase()+"64_32.png");
			}
			if(!page.vwHomeStage.checkCost(cost,0))
			{
				textColor=[255,0,0];
			}
		}
		else
		{
			picURL="";
		}
		css={
			type:"key",id:"BtnMakePart_"+(typeIdx+1),pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,ui_event:1,key:keyid,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:150,h:150},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:150,h:150},
			state_gray:{"css":imgLib.box_shopitem_g,w:150,h:150,color_r:128,color_g:128,color_b:128,color_a:128},
			items:[
				{
					type:"icon",id:"SpellIcon",pos:[0,0,0],w:150,h:150,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,
				},
				{
					type:"text",id:"Name",css:cssLib.textFineMid.createCSS([-68,-68,0],def?def.name:"",150,150,0,0,0,0),wrap:1,font_size:FS.L
				},
				{
					type:"text",id:"TxtBldLvReq",css:cssLib.textFineSmall.createCSS([0,0,0],def?textLib.spellNeedBldLevel(def.bldLvReq):"None",150,150,1,1,1,1),wrap:1,display:0
				},
				{type:"text",id:"Part",css:cssLib.textFineMid.createCSS([5,-5,0],textLib[(def&&def.weight)?"AtkPart":"MovePart"],150,150,1,1,0,2),wrap:1,font_size:FS.L,display:0},
				{type:"text",id:"Lv",css:cssLib.textFineMid.createCSS([-5,-5,0],"Lv."+(level>=0?(level+1):1),150,150,1,1,2,2),wrap:1,font_size:FS.L,display:0},

				{type:"div3x3",id:"shape",pos:[-73,75,0],w:150-4,h:36,anchor_h:0,anchor_v:2,css:imgLib.getImg("box_dark")},
				{type:"icon",id:"ResIcon",pos:[75-32,75-34,0],w:32,h:32,tex:resIconURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				{type:"text",id:"ResNum",css:cssLib.textFineMid.createCSS([75-32,75-28,0],""+resNum,68,16,2,0,2,0,textColor)},
				{type:"icon",id:"ExIcon",pos:[-73,0,0],anchor_v:1,css:imgLib.getImg("pic_limitsell"),display:(def &&def.isOnSale)?1:0},
			],
			badToBuild:bad,level:level,haveNum:haveNum,
			page:page,appEnv:appEnv,def:def,store:store,
			update:this.update
		};
		return css;
	},
	update:function(bld)
	{
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		this.setEnabled(1);
		this.setStateStyle(2,{css:imgLib.getImg("box_shopitem_g"),w:150,h:150});
		this.getItemById("SpellIcon").setTexURL("");
		if(!this.def)
		{
			this.setEnabled(0);
			this.setStateStyle(2,{css:imgLib.getImg("box_solid"),w:150,h:150});
			this.getItemById("Name")._setText("");
			this.getItemById("TxtBldLvReq")._setText("");
			this.getItemById("Part")._setText("");
			this.getItemById("Lv")._setText("");
			this.getItemById("shape").setDisplay(0);
			this.getItemById("ResIcon").setDisplay(0);
			this.getItemById("ResNum").setDisplay(0);
			this.getItemById("ExIcon").setDisplay(0);
			return;
		}

		var def,store,tstore;
		var resIconURL,resNum;
		var storage,slot,haveNum,i;
		def=this.def;
		store=this.store;
		var level=this.level;
		if(bld && def)
		{
			storage=window.aisGame.curCity.partStorage;
			slots=storage.slots;
			this.getItemById("SpellIcon").setTexURL(imgLib.genIconPath(def.codeName+"_m_32"));
			this.getItemById("Name")._setText(def.name);
			haveNum=0;
			for(i in slots)
			{
				if(i.indexOf(def.codeName)>-1)
				{
					if(!haveNum)
					{
						haveNum=slots[i].num;
					}
				}
			}
			if(def.isOnSale)
			{
				var pic,hud=this.getItemById("ExIcon");
				hud.setDisplay(1);
				if(def.discount && def.discount<100)
				{
					pic=imgLib.icon_discount80m;
				}else{
					pic=imgLib.pic_limitsell;
				}
				hud.setTexURL(pic.tex);
				hud.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
				hud.setW(pic.w);
				hud.setH(pic.h);
			}else
				this.getItemById("ExIcon").setDisplay(0);
			this.haveNum=haveNum;
			DBOut("== haveNum:"+haveNum+", codeName:"+def.codeName+", weight:"+def.weight);
			/*
			if(haveNum && def.weight)
			{
				this.getItemById("TxtBldLvReq").setDisplay(1);
				this.getItemById("TxtBldLvReq")._setText(textLib["Owned"]);
				this.getItemById("Part")._setText("");
				this.getItemById("Lv")._setText("");
				this.getItemById("shape").setDisplay(0);
				this.getItemById("ResIcon").setDisplay(0);
				this.getItemById("ResNum").setDisplay(0);
			//	this.setEnabled(0);
				this.getItemById("SpellIcon").setColor([255,255,255,128]);
				this.getItemById("ExIcon").setDisplay(0);
				return;
			}*/
			this.getItemById("TxtBldLvReq").setDisplay(0);
			this.getItemById("SpellIcon").setColor([255,255,255,255]);
			this.getItemById("shape").setDisplay(1);
			this.getItemById("ResIcon").setDisplay(1);
			this.getItemById("ResNum").setDisplay(1);
			var cost=def["levels"][0].cost;
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
			else if(cost.storage && cost.storage[0])
			{
				resNum=cost.storage[0].num;
				var res=cost.storage[0].store;
				resIconURL=page.genPageURL(window.imgPath+"/icon/icon_res_"+res.toLowerCase()+"64_32.png");
			}
			this.getItemById("ResIcon").setTexURL(resIconURL);
			this.getItemById("ResNum")._setText(resNum);
			if(!page.vwHomeStage.checkCost(cost,0))
			{
				this.getItemById("ResNum")._setColor(255,0,0,255);
			}
			else
			{
				this.getItemById("ResNum")._setColor(255,255,255,255);
			}
		//	DBOut(" == "+def.codeName);
			tstore=bld.tgtStorage;
		//	DBOut("Free cap: "+tstore.getFreeCap()+", slotCap:"+bld.slotCap);
			this.getItemById("Part")._setText(textLib[(def&&def.weight)?"AtkPart":"MovePart"]);
			this.getItemById("Lv")._setText("Lv."+(level>=0?(level+1):1));
			if(bld.level<def.bldLvReq)
			{
				if(this.getEnabled())
				{
				//	this.setEnabled(0);
				}
			//	this.getItemById("TxtBldLvReq").setDisplay(1);
				this.getItemById("TxtBldLvReq")._setText(textLib.spellNeedBldLevel(def.bldLvReq));
				this.badToBuild=1;
			}
			else if(tstore.getFreeCap()<(def.storageSize+bld.slotCap))
			{
				if(this.getEnabled())
				{
				//	this.setEnabled(0);
				}
				this.badToBuild=3;
			}
			else
			{
				if(!this.getEnabled())
				{
					this.setEnabled(1);
				}
				this.getItemById("TxtBldLvReq").setDisplay(0);
			}
		}
	},
};
