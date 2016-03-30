this.cssLib.boxUnlock=//【zz】添加，修改基于boxStorage
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
		css={//98*123
			type:"listbox",id:"boxUnlock","pos":pos,w:w,h:125,"anchor_h":0,"anchor_v":0,ui_event:1,clip:1,
			"arrange":1,item_w:102,item_h:125,"end_gap":1,"move_gap":20,"fast_scroll":1,show_fx:0,
			"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,
			page:page,appEnv:appEnv,
			cssLib:cssLib,update:this.update,
			storage:storage,
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
		var list,i,n,slot,items,item,num,txt;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var def,url,num,sprite,css;
		if(this.storage)
		{
			this.clearItems();
			list=this.storage.slots;
			items=[];
			for(i in list)
			{
				slot=list[i];//{def:aisDef, num:1}
				def=slot.def;
				if("Halloweenbomb"==def.codeName)
					continue;
				url=page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
				css={type:"icon",pos:[49,50,0],w:64,h:64,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1};
				num=slot.num;
				if(0==num)continue;
				txt=num?("+"+num):"";
				txt=slot.isNew?"new":txt;
				txt=-1==num?this.appEnv.textLib["Unlock"]:txt;
				if(slot.isSp)
				{
					if(def.sprite)
					{
						sprite=def.sprite;
					}
					else
					{
						if("Traps"==def.groupId)
							sprite="trap_"+def.codeName+"_01_stay001";
						else if("Decorate"==def.groupId)
							sprite="dec_"+def.codeName+"_01_stay001";
						else if("FakeOilTank"==def.codeName)
							sprite="bld_OilTank_01_stay001";
						else if("FakeGoldVault"==def.codeName)
							sprite="bld_GoldVault_01_stay001";
						else
							sprite="bld_"+def.codeName+"_01_stay001";
					}
					css={type:"coc_sp",id:"item_sp",pos:[53,76,0],game:this.appEnv.cocGameMode,sprite:sprite};
				}
				item={
					type:"div3x3",pos:[2,0,0],w:98,h:123,css:imgLib["box_shopitem"],size3x3:[22,22,22,22],filter:0,//color_r:100,color_g:100,color_b:150,
					items:[
					//	{type:"icon",pos:[6,6,0],w:64,h:64,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1},//图标
					//	{type:"coc_sp",id:"item_sp",pos:[42,56,0],game:this.appEnv.cocGameMode,sprite:sprite},
						css,
						{type:"text",id:"TxtNum","css":cssLib.textFineMid.createCSS([49,95,0],txt,60,30,1,0,1,0)},
					]
				};
				items.push(item);
			}
			this.addItems(items);
			var hud,ani;
			for(i=0; i<this.getItemNum(); i++)
			{
				hud=this.itemAt(i).getItemById("item_sp");
				if(hud)
				{
					ani=hud.addAdTMFirst("scale");
					ani.startAni(4,[0.6,0.6,0],1);
				}
			}
		}
	}
};
