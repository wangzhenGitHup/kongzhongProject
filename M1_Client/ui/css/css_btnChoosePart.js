this.cssLib.btnChoosePart=
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
		
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		
		bad=0;
		textColor=[255,255,255];
		if(def)
		{
			picURL=page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_m_32.png");
		}
		else
		{
			picURL="";
		}
		css={
			type:"key",id:"btnChoosePart_"+(typeIdx+1),pos:[x,y,0],css:imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,ui_event:1,key:keyid,filter:1,button:1,down_scale:0.9,
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
				{type:"text",id:"Part",css:cssLib.textFineMid.createCSS([5,-5,0],textLib[(def&&def.weight)?"AtkPart":"MovePart"],150,150,1,1,0,2),wrap:1,font_size:FS.L},
				{type:"text",id:"Lv",css:cssLib.textFineMid.createCSS([-5,-5,0],"Lv."+(level>=0?(level+1):1),150,150,1,1,2,2),wrap:1,font_size:FS.L},
			],
			badToBuild:bad,level:level,
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
			return;
		}

		var def,store,tstore;
		def=this.def;
		store=this.store;
		var level=this.level;
		if(bld && def)
		{
		//	DBOut(" == "+def.codeName);
			tstore=bld.tgtStorage;
		//	DBOut("Free cap: "+tstore.getFreeCap()+", slotCap:"+bld.slotCap);
			this.getItemById("SpellIcon").setTexURL(imgLib.genIconPath(def.codeName+"_m_32"));
			this.getItemById("Name")._setText(def.name);
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
