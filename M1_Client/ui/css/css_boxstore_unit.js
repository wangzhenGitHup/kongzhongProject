this.cssLib.boxStorageUnit=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,w,storage)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var css;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		css={
			type:"listbox",id:"boxStorageUnit","pos":pos,w:w,h:100,"anchor_h":0,"anchor_v":0,ui_event:1,clip:1,
			"arrange":1,item_w:80,item_h:100,"end_gap":1,"move_gap":20,"fast_scroll":1,show_fx:0,
			"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,
			page:page,appEnv:appEnv,
			viewId:"StorageInfoBox",
			cssLib:cssLib,update:this.update,
			aisUpdateView:this.update,
			storage:storage,
			onFree:this.onFree,
		};
		return css;
	},
	create:function(box,pos,w,storage)
	{
		var lbBox;
		lbBox=box.appendNewChild(this.createCSS(pos,w,storage));
		if(storage)
		{
			lbBox.update(storage);
		}
		return lbBox;
	},
	update:function(storage)
	{
		var list,i,n,slot,items,item,num;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var imgLib=page.imgLib;
		var def,url,num,hud;
		var tech,level,lvPicDef,lvPic;

		if(!this.inited)
		{
			this.inited=1;
			lvPicDef=imgLib.getImg("pic_lv1");
			item={
				type:"div3x3",pos:[5,0,0],w:76,h:100,//css:imgLib["box_shopitem"],size3x3:[16,16,16,16],//color_r:100,color_g:100,color_b:150,
				items:[
					{type:"div3x3",id:"BgNormal",pos:[0,0,0],w:76,h:100,css:imgLib["box_shopitem"],size3x3:[16,16,16,16],display:0},
					{type:"div3x3",id:"BgEmpty",pos:[0,0,0],w:76,h:100,css:imgLib["box_solid"],display:0},
					{type:"icon",id:"UnitIcon",pos:[6,6,0],w:64,h:64,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1},//图标
					{type:"text",id:"TxtNum","css":cssLib.textFineMid.createCSS([70,72,0],"x"+0,60,30,2,0,2,0)},
					{type:"icon",id:"LvIcon",pos:[lvPicDef.w/2,64-lvPicDef.h/2,0],css:lvPicDef,anchor_h:1,anchor_v:1}
				],
				update:function(vo)
				{
					if(vo)
					{
						slot=vo;
						def=slot.def;
						//for(x in slot)DBOut(x+":"+slot[x])
						level=0;
						if(slot.subType)
						{
							level=parseInt(slot.subType,10);
						}
						else if(def.levelTech)
						{
							tech=window.aisGame.king.getTech(def.levelTech);
							if(tech)
							{
								level=tech.level;
							}
						}
						lvPic=imgLib.getImg("pic_lv"+(level+1));
						url=page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
						num=slot.num;

						this.getItemById("BgNormal").setDisplay(1);
						this.getItemById("BgEmpty").setDisplay(0);
						this.getItemById("UnitIcon").setTexURL(url);
						this.getItemById("TxtNum")._setText("x"+num);
						this.getItemById("LvIcon").setTexURL(lvPic.tex);
						this.getItemById("LvIcon").setTexUV([lvPic.tex_u,lvPic.tex_v,lvPic.tex_w,lvPic.tex_h]);
						this.getItemById("LvIcon").setDisplay(def.levelTech?1:0);
					}
					else
					{
						this.getItemById("BgNormal").setDisplay(0);
						this.getItemById("BgEmpty").setDisplay(1);
						this.getItemById("UnitIcon").setTexURL("");
						this.getItemById("TxtNum")._setText("");
						this.getItemById("LvIcon").setDisplay(0);
					}
				}
			};
			for(i=0; i<10; i++)
			{
				this.addItem(item);
			}
		}
		if(storage)
		{
			this.storage=storage;
			storage.addUIView(this);
		}
		if(this.storage)
		{
			n=0;
			list=this.storage.slots;
			items=[];
			for(i in list)
			{
				slot=list[i];
				if(!slot.num)
					continue;
				this.itemAt(n).update(slot);
				n++;
			}
			for(i=n;i<10;i++)
			{
				this.itemAt(i).update();
			}
		}
	},
	onFree:function()
	{
		DBOut("Storage Box will remove view connection!!");
		if(this.storage)
		{
			this.storage.removeUIView(this);
		}
	}
};
