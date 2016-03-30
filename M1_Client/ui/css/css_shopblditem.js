this.cssLib.btnShopBldItem=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,codeName,keyid,boxh,hudId)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,numCap,bldNum;
		var priceVO,price,priceType,priceDef,priceIcon,pic,priceColor,store;
		var time,timetxt,numTip;
		var css,hfboxh,bad=0,special=0;
		var misList;

		boxh=boxh>400?boxh:400;
		hfboxh=Math.floor(boxh/2);
		def=window.aisEnv.defLib.bld[codeName];
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		if(!def)
		{
			DBOut("Can't find building def: "+codeName);
		}
		DBOut("codeName="+codeName);

		//得到数量和数量限制:
		numCap=window.aisGame.curCity.getValue("maxCap"+codeName);
		bldNum=window.aisGame.curCity.getValue("numBld"+codeName);

		if("Hangar"==codeName)
		{
			priceVO={gem:0,cash:0,storage:[]};
		//	var exNum=window.aisGame.curCity["bldAll"+codeName];
			var exNum=window.aisGame.curCity.getValue("numBld"+codeName);
			DBOut("exNum="+exNum);
			if(exNum<numCap)
			{
				var global=window.aisEnv.defLib.globals;
				var cvo=global["HANGAR_COST_"+(exNum+1)];
				cvo=cvo.split("#");
				DBOut("HANGAR_COST_"+(exNum+1)+":"+cvo);
				price=cvo[1];
				priceType="Elixir"==cvo[0]?"Oil":cvo[0];
				priceIcon=priceType.toLowerCase();
				priceIcon=imgLib.genIconPath("icon_res_"+priceIcon+"64_32");
				priceColor=[255,255,255];
				if("Oil"==priceType){
					priceVO={storage:[{store:"Oil",type:"ResOil",num:price}]};
				}else if("Gold"==priceType){
					priceVO={storage:[{store:"Gold",type:"ResGold",num:price}]};
				}else if("Cube"==priceType){
					priceVO={storage:[{store:"Cube",type:"ResCube",num:price}]};
				}else if("Gem"==priceType){
					priceVO={gem:price,storage:[]};
				}
				if(!window.aisGame.curCity.checkCost(priceVO,1,{}))
				{
					priceColor=[255,0,0];
				}
			}
			else
				bad=7;
		}
		else
		{
			priceVO=def.levels[0].cost.storage[0];
			if(priceVO)//是用资源的
			{
				price=priceVO.num;
				priceType=priceVO.type;
				priceDef=window.aisEnv.defLib.prdct[priceType];
				priceIcon=page.genPageURL(window.imgPath+"/icon/icon_"+priceDef.icon+"64_32.png");
				priceColor=[255,255,255];
				store=window.aisGame.curCity.allStorages[priceVO.store];
				if(store)
				{
					if(!store.checkTakeOut(priceVO))
					{
						priceColor=[255,0,0];
					}
				}
			}
			else if(def.levels[0].cost.cash)//能量块
			{
				price=def.levels[0].cost.cash;
				priceType="Cash";
				priceDef=null;
				priceIcon=imgLib.genIconPath("res_chip",64);
				priceColor=[255,255,255];
				{
					if(!window.aisGame.curCity.checkCost({cash:price,storage:[]},1,{}))
					{
						priceColor=[255,0,0];
					}
				}
			}
			else if(def.levels[0].cost.gem)//钻石
			{
				price=def.levels[0].cost.gem;
				if("WorkerHut"==def.codeName)
				{
					var cnt=window.aisGame.curCity.bldWorkers.length;
					if(cnt<5)
						price=window.aisEnv.defLib.globals["WORKER_COST_"+(cnt+1)];
					else
						bad=3;
				}
				priceType="Gem";
				priceDef=null;
				priceIcon=page.genPageURL(window.imgPath+"/icon/icon_res_gem64_32.png");
				priceColor=[255,255,255];
				{
					if(!window.aisGame.curCity.checkCost({gem:price,storage:[]},1,{}))
					{
						priceColor=[255,0,0];
					}
				}
			}
		}

		//vip特权数量:
		var vipCap,vipNum;
		vipCap=appEnv.getVipBldNum(codeName);
		vipNum=bldNum-(numCap-vipCap);
		vipNum=vipNum<0?0:vipNum;

		var maxCap,isMax;
		var cityLvs=window.aisEnv.defLib.bld["TownHall"]["levels"];
		var factors=cityLvs[cityLvs.length-1]["factors"];
		for(var i=0; i<factors.length; i++)
		{
			if("MaxCap"+codeName == factors[i].name)
				maxCap=factors[i]["add"];
		}
	//	DBOut(codeName+" "+maxCap);
		if(bldNum>=(maxCap+vipCap))
		{
			isMax=1;
		}

		time=def.levels[0].cost.time;
	//	DBOut("def.name: "+def.name+", time:"+time);
		timetxt=time?textLib.getTimeText(time):textLib["Time_NONE"];
		pic=page.genPageURL(window.imgPath+"/icon/icon_bld_"+def.codeName+"128_32.png");
	//	DBOut("Bld pic"+pic);
		numTip=textLib["Built"];
		misList=aisGame.curCity.getMissingFeatures(def.levels[0].req.features,1);
		if(!bad)
		{
			if(bldNum>=numCap)
			{
				bad=1;
			}
			if(misList)
			{
				bad=2;
				numTip=textLib["BldNeedFeature"](misList);
			}
		}
		var sprite;
	//	if("Mine"==def.codeName || "Ejector"==def.codeName || "Superbomb"==def.codeName || "Halloweenbomb"==def.codeName || "Airbomb"==def.codeName)
		if("Traps"==def["groupId"])
			sprite=def.sprite?def.sprite:("trap_"+def.codeName+"_01_stay001");
		else if("Decorate"==def["groupId"])
			sprite=def.sprite?def.sprite:("dec_"+def.codeName+"_01_stay001");
		else if("FakeOilTank"==def.codeName)
			sprite=def.sprite?def.sprite:("bld_OilTank_01_stay001");
		else if("FakeGoldVault"==def.codeName)
			sprite=def.sprite?def.sprite:("bld_GoldVault_01_stay001");
		else if("InfernoMechTower"==def.codeName)
			sprite=def.sprite?def.sprite:("bld_InfernoTower_01_stay001");
		else
			sprite=def.sprite?def.sprite:("bld_"+def.codeName+"_01_stay001");
		DBOut("sprite="+sprite);
		if(def.codeName=="DiamondMine")
		{
			special=1;
			bad=0;
		}
		css={
			type:"icon",id:hudId,"pos":pos,w:280,h:boxh,"css":(!bad)?imgLib.box_shopitem:imgLib.box_shopitem_g,mode3x3:1,key:keyid,"anchor_h":1,"anchor_v":1,"ui_event":1,filter:1,
			items:[
				cssLib.textFineMid.createCSS([-130,-hfboxh+24,0],def.name,280,30,0,1,0,1),//建筑名称
				{type:"icon",id:"back_light",pos:[0,-10,0],css:imgLib.pic_backlight,anchor_h:1,anchor_v:1,w:280,h:220,filter:1,color_a:(bldNum<numCap)?150:88},
				//{type:"icon",id:"item_pic",pos:[0,-10,0],tex:pic,tex_u:0,tex_v:0,tex_w:1,tex_h:1,w:180,h:180,anchor_h:1,anchor_v:1,filter:1,color_a:(bldNum<numCap)?255:128},
				{type:"coc_sp",id:"item_sp",pos:[0,-10,0],game:appEnv.cocGameMode,sprite:sprite,color_a:(bldNum<numCap || special)?255:128},
				{type:"icon",id:"label",pos:[0,hfboxh-38,0],css:cssLib.boxDark,w:270,h:60,mode3x3:1,anchor_h:1,anchor_v:1,color_a:120},
				{type:"icon",id:"res_pic",pos:[-100,hfboxh-34,0],tex:priceIcon,tex_u:0,tex_v:0,tex_w:1,tex_h:1,w:64,h:64,anchor_h:1,anchor_v:1,filter:1,display:(3==bad || 7==bad || special)?0:1},
				{css:cssLib.textFineBig.createCSS([0,hfboxh-34,0],""+price,280,30,1,1,1,1,priceColor),display:(3==bad || 7==bad || special)?0:1},//价格
				{css:cssLib.textFineBig.createCSS([0,hfboxh-34,0],textLib["SpecialItem"],280,30,1,1,1,1,priceColor),display:special?1:0},//特别说明
				{css:cssLib.btnInfo.createCSS([116,-hfboxh+24,0],0),display:"Decorate"==def["groupId"]?0:1},//"Traps"==def["groupId"] ||
				{type:"icon",id:"label",pos:[0,hfboxh-150,0],css:imgLib.getImg("icon_discount80m"),anchor_h:1,anchor_v:1,display:(def.discount && def.discount<100)?1:0},
			],
			badToBld:bad,special:special,isMax:isMax,
			onClick:this.onClick
		};
		if(bad!=2)
		{
			css.items=css.items.concat([
				{type:"icon",id:"pic_clock",pos:[-86,hfboxh-94,0],css:imgLib.pic_clock,anchor_h:2,anchor_v:1,filter:1},
				cssLib.textFineMid.createCSS([-86,hfboxh-94,0],timetxt,280,30,0,1,0,1,[255,255,100]),//建造时间
				cssLib.textSmall.createCSS([125,hfboxh-104,0],numTip,280,30,2,1,2,1,[0,0,0]),//建造限制标记
				cssLib.textFineMid.createCSS([125,hfboxh-84,0],(bldNum-vipNum)+"/"+(numCap-vipCap),280,30,2,1,2,1,(bldNum-vipNum)<(numCap-vipCap)?[181,251,255]:[255,0,0]),//建造限制数量
			]);

			if(vipCap)
			{
				css.items=css.items.concat([
					cssLib.textSmall.createCSS([125,hfboxh-144,0],textLib["VipOnly"],280,30,2,1,2,1,[0,0,0]),//建造限制标记
					cssLib.textFineMid.createCSS([125,hfboxh-124,0],vipNum+"/"+vipCap,280,30,2,1,2,1,vipNum<vipCap?[181,251,255]:[255,0,0]),//建造限制数量
				]);
			}
		}
		else
		{
			css.numTip=numTip;
			css.items.push({css:cssLib.textFineSmall.createCSS([0,hfboxh-100,0],numTip,280,30,1,1,1,1,[255,255,255]),font_size:18});//缺少Feature的提示
		}
		return css;
	},
	create:function(box,pos,codeName,keyid,boxh,hudId)
	{
		var css;
		css=this.createCSS(pos,codeName,keyid,boxh,hudId);
		return box.appendNewChild(css);
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
