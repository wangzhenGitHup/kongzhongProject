this.cssLib.btnShopSpecialItem=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,def,keyid,boxh)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,numCap,bldNum;
		var priceVO,price,priceType,priceIcon,pic,priceColor,priceStr="";
		var personalTimes,personalDailyTimes,globalTimes;
		var curTimes,curDailyTimes,curGlobalTimes;
		var timesColor;
		var times=[],curTimes;
		var css,hfboxh,bad,boxw;
		var misList;
		
		var needPay=0;
		var enable=1;
		var globalIsMax=0;
		var personalDailyIsMax=0;
		var personalIsMax=0;
		var payVO=null;
		boxw=280;
		boxh=boxh>400?boxh:400;
		hfboxh=Math.floor(boxh/2);
		var codeName=def.codeName;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		priceIcon=imgLib.getIcon("res_gem");
		
	//	DBOut(toJSON(def));
		// DBOut("def::"+toJSON(def))
		//全服次数
		globalTimes=def.globalTimes;
		curGlobalTimes=def.curGlobalTimes;
		var offTimes=0;//剩余次数
		if(globalTimes>0)
		{
			timesColor=curGlobalTimes>=globalTimes?[255,0,0,0]:[255,255,0,255];
			offTimes=globalTimes-curGlobalTimes;
			offTimes=offTimes<0?0:offTimes;
			globalIsMax=offTimes>0?0:1;
			times.push({str:textLib["GlobalTimes"],color:[255,255,0,255]});
			times.push({str:offTimes+"/"+globalTimes,color:timesColor});
		}
		//每日次数
		personalDailyTimes=def.personalDailyTimes;
		curDaliyTimes=def.curDaliyTimes;
		if(personalDailyTimes>0)
		{
			timesColor=curDaliyTimes>=personalDailyTimes?[255,0,0,0]:[255,255,0,255];
			offTimes=personalDailyTimes-curDaliyTimes;
			offTimes=offTimes<0?0:offTimes;
			personalDailyIsMax=offTimes>0?0:1;
			times.push({str:textLib["PersonalDailyTimes"],color:[255,255,0,255]});
			times.push({str:offTimes+"/"+personalDailyTimes,color:timesColor});
		}
		//个人次数
		personalTimes=def.personalTimes;
		curTimes=def.curTimes;
		if(personalTimes>0)
		{
			timesColor=curTimes>=personalTimes?[255,0,0,0]:[255,255,0,255];
			offTimes=personalTimes-curTimes;
			offTimes=offTimes<0?0:offTimes;
			personalIsMax=offTimes>0?0:1;
			times.push({str:textLib["PersonalTimes"],color:[255,255,0,255]});
			times.push({str:offTimes+"/"+personalTimes,color:timesColor});
		}
		var timesTxtCSS={type:"shape",id:"times",pos:[-130,-hfboxh+40,0],w:260,h:100,items:[]};
		var side,index,txtColor;
		for(var i=0;i<times.length;i++)
		{
			side=i%2;
			index=Math.floor(i/2);
			txtColor=times[i].color;
			css=cssLib.textFineMid.createCSS([0+260*side,0+30*index,0],times[i].str,130,30,side*2,0,side*2,1,txtColor);
			timesTxtCSS.items.push(css);
		}
		
		pic=imgLib.getIcon(def.icon);
		bad=def.bad;
		var priceLineCSS,i,linew;
		var reqs=def.reqs.storage;
		var storage;//=window.aisGame.curCity.itemStorage;
		var defLib,curNum;//=window.aisEnv.defLib.item;
		// DBOut("items:"+toJSON(store.slots))
		var item;
		var needGem=def.needGem;
		if(1==reqs.length)
		{
			DBOut("	TYPE "+reqs[0].store)
			if("Item"==reqs[0].store)
			{
				defLib=window.aisEnv.defLib.item;
				priceIcon=imgLib.getIcon(defLib[reqs[0].type].Icon);
			}
			else
			{
				defLib=window.aisEnv.defLib.prdct;
				priceIcon=imgLib.getIcon(defLib[reqs[0].type].icon,64);
			}
			storage=window.aisGame.curCity.allStorages[reqs[0].store];
			item=storage.slots[reqs[0].type];
			if(item && item.num)
				curNum=item.num;
			else
				curNum=0;
			// if("ResGem"==reqs[0].type)
				// curNum=window.aisGame.king.gemNum;
			priceStr=reqs[0].num;
			if(curNum>=reqs[0].num)
			{
				priceColor=[255,255,255,255];
			}
			else
			{
				enable=0;
				priceColor=[255,0,0,255];
			}
			priceLineCSS={type:"icon",id:"price-line",pos:[0,hfboxh-38,0],w:270,h:60,anchor_v:1,anchor_h:1,
				items:[
					{type:"icon",id:"res_pic",pos:[-100,0,0],css:priceIcon,w:36,h:36,anchor_h:1,anchor_v:1},//价格图片
					{id:"price",css:cssLib.textFineBig.createCSS([0,0,0],priceStr,280,24,1,1,1,1,priceColor),font_size:24},//价格
				]
			};
		}else
		{
			priceLineCSS={type:"icon",id:"price-line",pos:[0,hfboxh-38,0],w:270,h:60,anchor_v:1,anchor_h:1,items:[]}
			linew=Math.floor(270/reqs.length);
			for(i=0;i<reqs.length;i++)
			{
				if("Item"==reqs[i].store)
				{
					defLib=window.aisEnv.defLib.item;
					priceIcon=imgLib.getIcon(defLib[reqs[i].type].Icon);
				}
				else
				{
					defLib=window.aisEnv.defLib.prdct;
					priceIcon=imgLib.getIcon(defLib[reqs[i].type].icon,64);
				}
				priceIcon.w=36;
				priceIcon.h=36;
				storage=window.aisGame.curCity.allStorages[reqs[i].store];
				item=storage.slots[reqs[i].type];
				priceStr=reqs[i].num;
				if(item && item.num)
					curNum=item.num;
				else
					curNum=0;
				// if("ResGem"==reqs[i].type)
					// curNum=window.aisGame.king.gemNum;
				
				if(curNum>=reqs[i].num)
					priceColor=[255,255,255,255];
				else
				{
					enable=0;
					priceColor=[255,0,0,255];
				}
				// (pos,pic,text,type,color,font,offsetY)//文字位置type:0右，1中，2左
				css=cssLib.iconText.createCSS([-135+linew*i,0,0],priceIcon,priceStr,1,priceColor,24);
				css.items[1].pos=[40,0,0];
				css.items[1].align_h=0;
				css.items[1].anchor_h=0;
				priceLineCSS.items.push(css);
				
			}
		}
		if(needGem)
		{
			priceStr=needGem;
			priceIcon=imgLib.getIcon("res_gem",64);
			curNum=window.aisGame.king.gemNum;
			if(curNum>=needGem)
			{
				priceColor=[255,255,255,255];
			}
			else
			{
				enable=0;
				priceColor=[255,0,0,255];
			}
			priceLineCSS={type:"icon",id:"price-line",pos:[0,hfboxh-38,0],w:270,h:60,anchor_v:1,anchor_h:1,
				items:[
					{type:"icon",id:"res_pic",pos:[-100,0,0],css:priceIcon,w:36,h:36,anchor_h:1,anchor_v:1},//价格图片
					{id:"price",css:cssLib.textFineBig.createCSS([0,0,0],priceStr,280,24,1,1,1,1,priceColor),font_size:24},//价格
				]
			};
		}
		css={
			type:"icon",pos:pos,w:boxw,h:boxh,css:(!bad)?imgLib.getImg("box_shopitem"):imgLib.getImg("box_shopitem_g"),mode3x3:1,key:0,anchor_h:1,anchor_v:1,id:"ShopFolder",ui_event:1,
			items:[
				{id:"name",css:cssLib.textFineMid.createCSS([-130,-hfboxh+24,0],def.name,280,30,0,1,0,1)},//建筑名称
				{type:"icon",id:"back_light",pos:[0,-10,0],css:imgLib.getImg("pic_backlight"),anchor_h:1,anchor_v:1,w:280,h:220,color_a:!bad?150:88},
				{type:"icon",id:"item_pic",pos:[0,-10,0],css:pic,w:128,h:128,anchor_h:1,anchor_v:1,color_a:!bad?255:128},
				timesTxtCSS,
				{type:"icon",id:"label",pos:[0,hfboxh-38,0],css:imgLib.getImg("box_dark"),w:270,h:60,mode3x3:1,anchor_h:1,anchor_v:1,color_a:120},
				priceLineCSS,
				{id:"InfoBtn",css:cssLib.btnInfo.createCSS([116,-hfboxh+24,0],keyid),display:1},
			],
			enable:enable,
			personalIsMax:personalIsMax,personalDailyIsMax:personalDailyIsMax,globalIsMax:globalIsMax,
			update:this.update,appEnv:appEnv,
			onClick:this.onClick
		};
		return css;
	},
	create:function(box,pos,def,keyid,boxh)
	{
		var css;
		css=this.createCSS(pos,def,keyid,boxh);
		return box.appendNewChild(css);
	},
	update:function(def)
	{
	},
	onClick:function(msg,way)
	{
		return 0;
		if(way==1)
		{
			if(msg==0)
			{
				//TODO: StartAni
				var pos=[0,0,0];
				this.getPos(pos);
				this.startAniEx(pos,0.9,1,0,3);
			}
			else if(msg==1)
			{
				//TODO: StartAni
				var pos=[0,0,0];
				this.getPos(pos);
				this.startAniEx(pos,1.0,1,0,3);
			}
		}
		return 0;
	}
};
