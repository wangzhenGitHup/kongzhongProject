if(!__Page.dlgItem)
{
	__Page.dlgItem=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.pageDialog=__Page.dlgItem;
	__Page.dlgItem.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var pic, dt=10, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//信息区域
		var topX=this.topX=dt;
		var topY=this.topY=dt;
		var topW=this.topW=cntW-topX*2;
		var topH=this.topH=Math.floor(cntH/3);
		var iconX=dt+64;
		var iconY=topH>>1;
		var iconBg=imgLib.getIcon("bg_tier1_32");
		pic=imgLib.box_green;
		var nameX=128+dt*2;
		var nameY=dt;
		var nameW=100;
		var nameH=24;
		var topFieldCSS=this.topFieldCSS=
		{
			w:topW,
			h:topH,
			page:this.page,
			imgLib:this.imgLib,
			createCSS:function()
			{
				var css;
				css={type:"icon",id:"top",pos:[topX,topY,0],css:pic,w:topW,h:topH,ui_event:1,
					items:[
						{type:"icon",id:"icon-bg",pos:[iconX,iconY,0],css:iconBg,anchor_h:1,anchor_v:1,w:128,h:128},
						{type:"icon",id:"icon",pos:[iconX,iconY,0],css:imgLib.getIcon(""),anchor_h:1,anchor_v:1,w:128,h:128},
						{type:"text",css:cssLib.textFineMid.createCSS([nameX,nameY,0],textLib["ItemName"]+":",nameW,nameH,0,0,0,0)},
						{type:"text",id:"name",css:cssLib.textFineMid.createCSS([nameX+nameW,nameY,0],"----",nameW,nameH,0,0,0,0)},
						{type:"text",css:cssLib.textFineMid.createCSS([nameX,nameY+nameH+dt,0],textLib["ItemDesc"]+":",nameW,nameH,0,0,0,0)},
						{type:"text",id:"info",css:cssLib.textFineMid.createCSS([nameX+nameW,nameY+nameH+dt,0],"-------",nameW*4,nameH*4,0,0,0,0,[255,255,255,255],1)},
					],
					update:this.update
				};
				return css;
			},
			update:function(appEnv,def)
			{
				var nameTxt=this.getItemById("name");
				if(nameTxt && def.ItemName)
					nameTxt.setText(def.ItemName);
				var infoTxt=this.getItemById("info");
				if(infoTxt && def.ItemDesc)
					infoTxt.setText(def.ItemDesc);
				var icon=this.getItemById("icon");
				if(icon && def.Icon)
				{
					this.removeChild(icon);
					this.appendNewChild({type:"icon",id:"icon",pos:[iconX,iconY,0],css:appEnv.page.imgLib.getIcon(def.Icon),anchor_h:1,anchor_v:1,w:128,h:128});
				}
			},
		};
		this.allTxtCSS={type:"text",css:cssLib.textFineMid.createCSS([this.topX,this.topY+this.topH,0],textLib["AllItems"]+":",this.topW,30,0,0,0,1)};
		//物品列表
		var listX=topX;
		var listY=this.topY+this.topH+30;
		var listW=topW;
		var listH=cntH-listY-dt;
		var itemW=listW;
		var itemH=Math.floor(listH/3);
		this.lbxItemsCSS={type:"listbox",id:"lbx-items",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,//dlg:state,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.lbxItemsLineCSS={type:"icon",id:"lbx-line",pos:[0,0,0],w:itemW,h:itemH,ui_event:1,items:[]};
		
		this.itemCSS={
			createCSS:function(pos,w,h,vo,keyid){
				var css;
				css={
					type:"key",id:"item",pos:pos,w:w,h:h,ui_event:1,key:keyid,button:1,down_scale:0.9,
					items:[
						{type:"icon",id:"icon-bg",pos:[w>>1,h>>1,0],css:iconBg,w:w-14,h:h-14,anchor_h:1,anchor_v:1},
						{type:"icon",id:"item-icon",pos:[w>>1,h>>1,0],css:imgLib.getIcon(vo.Icon),w:w-14,h:h-14,anchor_h:1,anchor_v:1},
						{type:"text",id:"num",css:cssLib.textFineSmall.createCSS([w-10,h-4,0],"x"+vo.num,w-10,14,2,2,2,1),font_size:18},
						{type:"text",id:"name",css:cssLib.textFineSmall.createCSS([w>>1,h-4,0],vo.ItemName,w,14,1,0,1,0),font_size:18},
						{type:"icon",id:"sel",pos:[w>>1,h>>1,0],css:imgLib.getImg("box_sel"),w:w+dt,h:h+dt,anchor_h:1,anchor_v:1,flash:2,display:0}
					],
					update:this.update,def:vo,
					isSel:0,
				};
				return css;
			},
			update:function(){
				
			}
		};
	};
	__Page.dlgItem.init=function(appEnv)
	{
		this.name="dlgItem";
		this.viewId="dlgItem";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		this.dlgTitle.setText(textLib["ItemStorage"]);
		var keyid=0;
		var boxw,boxh,btn,slots,slotName,list,i,n,x,y,css,btnw,btnh,listn,lbxLine;

		DBOut("dlgItem.init: "+appEnv);
		var cntW=this.contentW;
		// this.cntBox=this.dlgFrame.appendNewChild({id:"contentField-info",css:[this.contentFieldCSS],display:0});

		this.topField=this.contentField.appendNewChild(this.topFieldCSS.createCSS());
		this.contentField.appendNewChild(this.allTxtCSS);
		this.lbxItems=this.contentField.appendNewChild(this.lbxItemsCSS);		
	};

	__Page.dlgItem.enter=function(preState,vo)
	{
		//TODO:code this:
		this.page.dlgBase.prototype.enter.call(this,appEnv);
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;
		//根据VO初始化界面:
		// this.infoVO=vo;
		
		this.aisBld=this.aisBld;
	//	this.aisBld.addUIView(this);
		//初始化单位按钮
		this.initAllBtns();
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
		}
	};

	__Page.dlgItem.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
	//	bld.removeUIView(this);
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(nextState)
		{
			appEnv.hudOut(this.cntBox,10);
		}
		else
		{
			// this.removeUIView();
		}
	};
	__Page.dlgItem.initAllBtns=function()
	{
		//list=??
		var storage=window.aisGame.curCity.itemStorage;
		DBOut("storage.slots+"+toJSON(storage.slots))
		this.infosVO=storage.slots;
		if(this.lbxItems)
			this.lbxItems.clearItems();
		var appEnv=this.appEnv;
		var vo,list=[],n,btnw,btnh,i,lbxLine,linen,x,y,btn;
		vo=this.infosVO;
		var def;
		for(i in vo)
		{
			def=vo[i].def;
			def.num=vo[i].num;
			def.perSize=vo[i].perSize;
			if(def.num>0)
				list.push(vo[i].def);
		}
		this.itemBtns=[];
		// DBOut("storage.slots+"+toJSON(list))
		var keyid=0;
		n=list.length;
		btnw=Math.floor((this.contentW-20)/8);
		// btnw=86;
		btnh=this.lbxItemsLineCSS.h;
		linen=Math.ceil(n/8);
		for(i=0;i<linen;i++)
		{
			this.lbxItems.addItem(this.lbxItemsLineCSS);
		}
		for(i=0;i<n;i++)
		{
			x=(i%8)*btnw;
			y=0;//Math.floor(i/8)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-i;
			lbxLine=this.lbxItems.itemAt(Math.floor(i/8));
			btn=lbxLine.appendNewChild(this.itemCSS.createCSS([x,y,0],btnw,btnh,list[i],keyid));
			btn.dlg=this;
			this.itemBtns.push(btn);
			this.regKeyVO(keyid,this,this.onItemClk);
		}
		if(this.itemBtns.length>0)
		{
			if(this.itemIdx)
			{
				if(!this.itemBtns[this.itemIdx])
					this.itemIdx=0;
			}else
				this.itemIdx=0;
			keyid=appEnv.appKeys.bldTrainUnit_1-this.itemIdx;
			this.onItemClk(1,keyid,1);
		}
		
	};
	__Page.dlgItem.clearSel=function(def)
	{
		var btn,sel,i;
		if(this.itemBtns)
		{
			for(i=0;i<this.itemBtns.length;i++)
			{
				btn=this.itemBtns[i];
				sel=btn.getItemById("sel");
				if(sel.getDisplay())
					sel.setDisplay(0);
			}
		}
	};
	__Page.dlgItem.showItemInfo=function(def)
	{
		this.topField.update(this.appEnv,def);
		this.def=def;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var keyid=0;
		var useType= def.UseType;
		if(this.useBtn)
		{
			this.topField.removeChild(this.useBtn);
			this.useBtn=null;
		}
		if(useType)
		{
			keyid=this.appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onUseClk);
			// createCSS:function(pos,key,btn,text,w,h,fs,uvInfo)
			this.useBtn=this.topField.appendNewChild(cssLib.normalBtn.createCSS([740,140,0],keyid,0,textLib["UseItem"]));
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgItem.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgItem.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//建造按钮被点击
		__Page.dlgItem.onItemClk=function(msg,key,way,extra)
		{
			var def,preBtn,btn,itemIdx;
			var appEnv=this.appEnv;
			// self=this.dlg;
			if(msg==1 && way==1)
			{
				//self.clearSel();
				preBtn=this.itemBtns[this.itemIdx];
				if(preBtn)
					preBtn.getItemById("sel").setDisplay(0);
				itemIdx=appEnv.appKeys.bldTrainUnit_1-key;
				this.itemIdx=itemIdx;
				btn=this.itemBtns[itemIdx];
				btn.getItemById("sel").setDisplay(1);
				def=btn.def;
				this.showItemInfo(def);
			}
		};
		__Page.dlgItem.onUseClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				//
				var city,king,itemId,store,list=[],i,item,enough;
				city=window.aisGame.curCity;
				king=window.aisGame.king;
				itemId=this.def.codeName;
				store=city.itemStorage;
				enough=1;
				//判断消耗是否满足
				if(this.def.cost)
				{
					list=this.def.cost.storage;
					for(i=0;i<list.length;i++)
					{
						item=store.slots[list[i].type];
						if(list[i].num>item.num)
						{
							enough=0;
							break;
						}
					}
				}
				if(enough)
				{
					king.execFakeCmd(city,"PackageOpenBox",{itemId:itemId,callBack:function(data){
						city.com_PackageOpenBox_PS({itemId:itemId});
						DBOut("data="+toJSON(data))
						this.initAllBtns();
					},callObj:this},city);
				}else
				{
					this.appEnv.stateLogs.showLogs(this.appEnv.textLib["ConditionNotEnough"]);
				}
			};
		};
	}
}
