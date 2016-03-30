if(!__Page.dlgPartInfo)
{
	__Page.dlgPartInfo=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgPartInfo.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		var keyid=0;
		//兵种图标区域
		pic=imgLib.getIcon("chr_UntMarine",128);
		var picW=this.picW=pic.w*2;
		picW=260;
		var picH=this.picH=pic.h*2;
		picH=260;
		var picX=this.picX=cntInner[0]+357/2+15;
		var picY=this.picY=cntInner[1]+357/2;
	//	pic=imgLib.getImg("bld_TownHall_b");
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],w:picW,h:picH,anchor_h:1,anchor_v:1,
			items:[
				{id:"pic-obj",type:"icon",pos:[0,-50,0],anchor_h:1,anchor_v:1,css:pic,w:picW,h:picH,filter:0},
				{type:"text",id:"cap",pos:[-80,110,0],anchor_h:1,anchor_v:1,align_h:1,align_v:1,text:textLib["Weight"],font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:200},
				{type:"div3x3",pos:[-80,110+30,0],anchor_h:1,anchor_v:1,w:108,h:32,css:imgLib.getImg("box_dark")},
				{type:"text",id:"weight",pos:[-80,110+30,0],anchor_h:1,anchor_v:1,align_h:1,align_v:1,text:"20吨",font_size:FS.FM,color_r:255,color_g:255,color_b:255,color_a:255},
				{type:"text",pos:[80,110,0],anchor_h:1,anchor_v:1,align_h:1,align_v:1,text:textLib["TierLevel"],font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:200},
				{type:"div3x3",pos:[80,110+30,0],anchor_h:1,anchor_v:1,w:108,h:32,css:imgLib.getImg("box_dark")},
				{type:"text",id:"tier",pos:[80,110+30,0],anchor_h:1,anchor_v:1,align_h:1,align_v:1,text:textLib["Tier"],font_size:FS.FM,color_r:255,color_g:255,color_b:255,color_a:255},
			]
		};
		//兵种状态条区域
		pic=imgLib.getImg("pic_backlight");
		var statusX=this.statusX=cntInner[0]+picW+dt-35;
		var statusY=this.statusY=cntInner[1];
		var statusW=this.statusW=cntW-cntInner[0]*2-picW-dt;
		var statusH=this.statusH=pic.h;
		this.statusFieldCSS={id:"statusField",type:"icon",pos:[statusX,statusY,0],w:statusW,h:statusH};
		//底部区域
		var btnMakeW=230;
		this.btnMakeW=btnMakeW, this.makeScale=0.8;
		var btnW=this.btnMakeW*this.makeScale;
		var btmBoxW=this.btmBoxW=cntW-20;
		var btmBoxH=this.btmBoxH=66-4;
		var btmBoxX=this.btmBoxX=cntW/2;
		var btmBoxY=this.btmBoxY=cntH-cntInner[1]/2-btmBoxH/2;
		this.btmBoxCSS={id:"btmBox",type:"div3x3",pos:[btmBoxX,btmBoxY+2,0],w:btmBoxW,h:btmBoxH+6,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),ui_event:1,
			color_r:184,color_g:189,color_b:115,color_a:180,
			items:[
				{id:"txt",css:cssLib.textFineMid.createCSS([0,0,0],textLib["PartInfo"],btmBoxW,btmBoxH,1,1,1,1),display:0},
				{id:"mis",css:cssLib.textFineMid.createCSS([btnW/2+10,0,0],"===缺少说明===",btmBoxW/2-btnW/2-30,btmBoxH,0,1,1,1,[211,211,211,255],1),display:0},
				{id:"btn",css:cssLib.btnResListGo.createCSS([0,0,0],btnMakeW,"oil",99999,1,keyid),display:0}
			],
			setState:function(state,misTxt)//0:生产  1:查看  2:强化
			{
				var txt=this.getItemById("txt");
				var mis=this.getItemById("mis");
				var btn=this.getItemById("btn");
				this.setMis(misTxt);
				if(0==state)//0:生产
				{
					txt.setDisplay(0);
					btn.setDisplay(1);
				}
				else if(1==state)//1:查看
				{
					txt.setDisplay(1);
					btn.setDisplay(0);
				}
				else if(2==state)//2:强化
				{
					txt.setDisplay(0);
					btn.setDisplay(1);
				}
			},
			setMis:function(misTxt)
			{
				var mis=this.getItemById("mis");
				mis.setDisplay(1);
				if(misTxt)
				{
					mis._setText(misTxt);
					this.setColor([255,0,0,255]);
				}else
				{
					mis._setText("");
					this.setColor([255,255,255,255]);
				}
			}
		};
		//兵种描述区域
		var descW=this.descW=picW+10;
		var descH=this.descH=cntH-picY-picH/2-cntInner[1]-100;
		var descX=this.descX=picX;
		var descY=this.descY=btmBoxY-btmBoxH/2-descH/2-10;
		this.descCSS={id:"descTxt",type:"text",pos:[descX,descY,0],w:descW,h:descH,anchor_h:1,anchor_v:1,align_h:0,align_v:0,font_size:FS.L,wrap:1,color_r:10,color_g:10,color_b:10,color_a:200};
		//兵种属性说明区域
		var attrW=this.attrW=statusW;
		var attrH=this.attrH=cntH-cntInner[1]*2-statusH-descH;
		var attrX=this.attrX=statusX;
		var attrY=this.attrY=statusY+statusH;
		this.attrFieldCSS={id:"attrField",type:"icon",pos:[attrX,attrY,0],w:attrW,h:attrH};
		//额外消耗区域
		this.reqSize=110;
		var reqX=460, reqY=335, reqW=335, reqH=125, txtH=25, listH=reqH-txtH, rw=110, rh=110;
		this.reqFieldCSS={id:"reqField",type:"shape",pos:[reqX,reqY,0],w:reqW,h:reqH,face_r:255,face_g:255,face_b:255,face_a:0,display:0,items:[
			{type:"text",pos:[0,0,0],w:reqW,h:txtH,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:textLib["ExNeed"],font_size:FS.FM,color_r:0,color_g:0,color_b:0,color_a:255},
			{type:"shape",pos:[0,txtH,0],w:reqW,h:listH,face_r:0,face_g:0,face_b:0,face_a:0},
			{type:"listbox",id:"lbx-req",pos:[0,txtH+5,0],w:reqW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
				arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:1,//hot_check:1,
				item_w:rw,item_h:rh,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
				display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
			}
		]};
	};
	__Page.dlgPartInfo.init=function(appEnv)
	{
		this.name="dlgPartInfo";
		this.viewId="dlgPartInfo";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgPart;

		var keyid;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});

		this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
		this.picObj=this.picField.getItemById("pic-obj");
		this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
		this.attrField=this.cntBox.appendNewChild({css:[this.attrFieldCSS]});
		this.descTxt=this.cntBox.appendNewChild({css:[this.descCSS]});
		// this.reqField=this.cntBox.appendNewChild({css:this.reqFieldCSS});
		// this.lbxReq=this.reqField.getItemById("lbx-req");
		this.btmBox=this.cntBox.appendNewChild({css:this.btmBoxCSS});
		this.btmInfo=this.btmBox.getItemById("txt");
		this.btmMis=this.btmBox.getItemById("mis");
		this.btnMake=this.btmBox.getItemById("btn");
		var scrSize=appEnv.scrSize, w=scrSize[0], h=scrSize[1];
		this.shapeBox=this.dlgBox.appendNewChild({type:"shape",id:"dlgMask",pos:[0,0,0],w:w,h:h,border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,
			display:0,fade_pos:[0,0,0],fade_size:1,fade:1,fade_alpha:0,fade:1,fade_size:1,fade_alpha:0,fade_pos:[0,0,0],ui_event:1,items:[
			{type:"icon",id:"blocker",pos:[0,0,0],w:w,h:h,block_touch:1,ui_event:1},
			{type:"icon",id:"pic",pos:[w/2,h/2,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_enhance"),fade:1,fade_size:0,fade_alpha:0,fade_pos:[w/2,h/2,0],display:0}
		]});
		this.ehPic=this.shapeBox.getItemById("pic");
		this.ehPic.onFadeDone=function(fade)
		{
			if(fade)
			{
				appEnv.addZoomScale(this,[1.0,1.0,1.0],[1.2,1.2,1.0],0.3);
			}
		};

		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMakeClk);
		this.btnMake.setKey(keyid);
		var scale=this.btnMake.addAdTMFirst("scale");
		scale.startAni(4,[this.makeScale,this.makeScale,1],1);
	};
	__Page.dlgPartInfo.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=vo.dlg;
		this.missReq=[];

		var mainDlg=this.dlgPage.dlgPart;
		var keyid=0;
		//制定关闭/返回按钮的行为
		this.regKeyVO(mainDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(mainDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);
		//生产入口按钮
		keyid=mainDlg.menuPart.getKey();
		this.regKeyVO(keyid,this,this.onProductionClk);
		//仓库入口按钮
		keyid=mainDlg.menuStorage.getKey();
		this.regKeyVO(keyid,this,this.onStorageClk);

		var list,i,n,btn,css;
		var items,itemx,itemy,item;

		itemx=150;itemy=(appEnv.scrSize[1]-220)/2+10;
		//根据VO初始化界面:
		this.infoVO=vo;
	//	DBOut(toJSON(this.infoVO.def));
		DBOut("show info:"+this.infoVO.def.codeName);
		if(vo)
		{
			this.btmBox.setState(vo.type);
			this.aisBld=homeDlg.aisBld;
			mainDlg.dlgTitle.setDisplay(1);
			mainDlg.menuPart.setDisplay(0);
			mainDlg.menuStorage.setDisplay(0);
			mainDlg.menuEnhance.setDisplay(0);
			this.descTxt.setText(vo.def["desc"]);

			this.barList=[];
			this.picObj.setTexURL(imgLib.genIconPath(vo.def.codeName+"_b_32"));
			this.getPartInfo();
			this.initUI();
		}
		appEnv.hudIn(mainDlg.btnBack,10);
		appEnv.hudIn(this.cntBox,5);
	};
	__Page.dlgPartInfo.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;

		var mainDlg=this.dlgPage.dlgPart;
		mainDlg.dlgTitle.setDisplay(0);
		mainDlg.menuPart.setDisplay(1);
		mainDlg.menuStorage.setDisplay(1);
		mainDlg.menuEnhance.setDisplay(1);

		appEnv.hudOut(mainDlg.btnBack,5);
		appEnv.hudOut(this.cntBox,5);
		this.statusField.removeAllChild();
		this.attrField.removeAllChild();
		// this.lbxReq.clearItems();
		this.attrInited=0;
		this.attrHuds=null;
		if(this.ehTimer)
		{
			clearTimeout(this.ehTimer);
			this.ehTimer=null;
		}
		if(nextState)
		{
			
		}
		else
		{
			this.dlgPage.dlgPart.removeUIView();
		}
	};
	__Page.dlgPartInfo.updateView=function()
	{
		this.getPartInfo();
		this.initUI();
	};
	__Page.dlgPartInfo.getPartInfo=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var vo=this.infoVO;
		var mainDlg=this.dlgPage.dlgPart;
		mainDlg.dlgTitle._setText(vo.def.name+textLib.getTextEx("GetLevel",{lv:vo.level+1}));
		vo=this.infoVO.def;

		this.picField.getItemById("cap").setText(vo.weight?textLib["Weight"]:textLib["WeightCap"]);
		this.picField.getItemById("weight").setText((vo.weight?vo.weight:vo.load)+textLib["WeightUnit"]);
		this.picField.getItemById("tier").setText(textLib["Tier"+vo.part_tier]);

		var level=this.infoVO.level;
		//this.infoVO.type --- 0:生产  1:查看  2:强化
		if(1==this.infoVO.type || 2==this.infoVO.type)
			level+=1;
		this.level=level;
		DBOut("=== lv:"+level);
		var lvVO=vo.levels[level];
		var curLv=vo.levels[level].factor;
		var nextLv={power:0,hp:0,move_speed:0};
		this.isMax=0;
		if(2==this.infoVO.type)
		{
			if(level<vo.levels.length-1)
			{
				nextLv=vo.levels[level+1].factor;
			}
			else
				this.isMax=1;
		}
		var maxLv=vo.levels[vo.levels.length-1].factor;
		var costTime=textLib.getTimeText(vo.levels[0].cost.time);
		var resCost={ResOil:"oil",ResGold:"gold",ResGem:"gem",ResCube:"cube"};
		var dmg=curLv["power"];
		this.infos=[];
		if(dmg){
			this.infos.push({name:dmg>0?"DmgPerSec":"HealPerSec", icon:"cap_dmg", cur:Math.abs(curLv["power"]), next:Math.abs(nextLv["power"]), max:Math.abs(maxLv["power"])});
		}else{
			this.infos.push({name:"MovementSpeed", icon:"cap_speed", cur:curLv["move_speed"], next:nextLv["move_speed"], max:maxLv["move_speed"]});
		}
		this.infos.push({name:"HP", icon:"cap_hp", cur:curLv["hp"], next:2==this.infoVO.type?nextLv["hp"]:-1, max:maxLv["hp"]});

		//若造兵需要消耗多种资源，则需要修改此处
		DBOut("=== lv:"+level);
		var resType, resNum, cost, storage, store, reqList=[], i;
		if(level<vo["levels"].length-1)
		{
			cost=vo["levels"][level]["cost"];
			storage=cost["storage"];
			if(storage && storage.length)
			{
				store=storage[0];
				if("Oil"==store.store || "Gold"==store.store || "Cube"==store.store)
					reqList.push({type:store.store.toLowerCase(),num:store.num});
			}
			if(cost.gem)
			{
				reqList.push({type:"gem",num:cost.gem}); 
			}
			if(cost.cash)
			{
				reqList.push({type:"chip",num:cost.cash});
			}
			if(storage && storage.length)
			{
				store=storage[0];
				i=0;
				if("Oil"==store.store || "Gold"==store.store || "Cube"==store.store)
					i=1;
				for(; i<storage.length; i++)
				{
					store=storage[i];
					reqList.push({type:store.type,num:store.num});
				}
			}
			if("oil"==reqList[0].type || "gold"==reqList[0].type || "gem"==reqList[0].type || "chip"==reqList[0].type || "cube"==reqList[0].type)
			{
				resType=reqList[0].type;
				resNum=reqList[0].num;
			}
			else
			{
				Dialogs.alert("mech cost error: "+vo.codeName);
				DBOut(toJSON(vo));
				throw "";
			}
			DBOut("===== reqVO:"+toJSON(reqList));
			reqList.shift();
			// if(reqList.length)
			// {
				// this.reqField.setDisplay(1);
			// }
			// else
			// {
				// this.reqField.setDisplay(0);
			// }
			this.infos.push({name:0==this.infoVO.type?"MakeCost":"EnhanceCost", icon:"res_"+resType, cur:resNum, max:resNum});
		}
		var resVo=this.resVo={res:resType,num:resNum};
		var reqVo=this.reqVo=reqList;

		this.attr={};
		if(dmg){
			this.attr["DmgFavor"]=vo["favor"];
			this.attr["DmgType"]=vo["dmg_type"];
			this.attr["DmgTarget"]=vo["target"];
			this.attr["DmgRange"]=lvVO["factor"]["range"]/100+textLib["Tiles"];
		}
		if(0==this.infoVO.type)
		{
			this.attr["MakeTime"]=costTime;
		}
		this.attr["RepairTime"]=textLib.getTimeText(lvVO["RepairSec"]*1000);
	};
	__Page.dlgPartInfo.initUI=function()
	{
		this.initInfoBar();
		this.initAttrText();
		this.checkReq();
		if(0==this.infoVO.type || 2==this.infoVO.type)//生产制造 || 强化
		{
			var resVo=this.resVo;
			this.btnMake.setResNum(resVo.res,resVo.num,1==this.resBad?1:0,this.reqVo);
		}
		else if(1==this.infoVO.type)//查看信息
		{
		}
	};
	__Page.dlgPartInfo.initInfoBar=function()
	{
		var i, list=this.infos, vo, bar, barList;
		if(!this.barList.length)
		{
			var x, y, gap=2, barCSS, iconH=64;
			var h=iconH+gap*2;
			var by=(this.statusH-h*list.length)/2+h/2;
			var barW=this.page.cssLib.boxStatusBar.w;
			x=this.statusW-(barW/2+10);
			for(i=0; i<list.length; i++)
			{
				y=by+h*i;
				bar=this.page.cssLib.boxStatusBar.create(this.statusField,[x,y,0],list[i].name,list[i].icon,list[i].cur,list[i].max,list[i].next,list[i].spd);
				this.barList.push(bar);
			}
		}
		else
		{
			barList=this.barList;
			for(i=0; i<barList.length; i++)
			{
				bar=barList[i];
				vo=list[i];
				if(vo)
				{
					bar.cur=vo.cur;
					bar.next=vo.next;
					bar.max=vo.max;
					bar.update();
				}
			}
		}
	};
	__Page.dlgPartInfo.initAttrText=function()
	{
	//	if(this.attrInited)return;
		this.attrInited=1;
		var i, j=0, list=this.attr, textLib=this.appEnv.textLib;
		if(this.attrHuds)
		{
			for(i in list)
			{
				this.attrHuds[i].getItemById("attr-info").setText(list[i]+"");
			}
			return;
		}
		var gap=2, iconH=64, cnt=6;
		var w=this.page.cssLib.boxStatusBar.w, h=20;
		var by=6;
		var x=this.attrW-w, y;
		this.attrHuds={};
		for(i in list)
		{
			y=by+h*j;
			this.attrHuds[i]=this.attrField.appendNewChild({
				type:"icon",id:"attr-"+i,pos:[x,y,0],w:w,h:h,
				items:[
					{type:"text",id:"attr-name",pos:[0,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:2,align_v:1,text:textLib[i]+": ",font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:255},
					{type:"text",id:"attr-info",pos:[w/2,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:0,align_v:1,text:list[i]+"",font_size:FS.FM,color_r:0,color_g:0,color_b:0,color_a:255},
					{type:"div3x3",pos:[w/2,y+30-6,0],w:w-100,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green_line")}
				]
			});
			j++;
		}
	};
	__Page.dlgPartInfo.checkReq=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		this.resBad=0;

		var bad=0, resVo=this.resVo, cvo={cash:0,gem:0,storage:[]};
		DBOut("resVo: "+toJSON(resVo));
		if("gem"==resVo.res)cvo.gem=resVo.num;
		else if("oil"==resVo.res)cvo.storage.push({store:"Oil",type:"ResOil",num:resVo.num});
		else if("gold"==resVo.res)cvo.storage.push({store:"Gold",type:"ResGold",num:resVo.num});
		else if("cube"==resVo.res)cvo.storage.push({store:"Cube",type:"ResCube",num:resVo.num});
		else if("chip"==resVo.res)cvo.cash=resVo.num;
		var def=this.infoVO.def, bld=this.aisBld, tstore=bld.tgtStorage;
		var misList;
		if(def.levels[this.level].req)
			misList=window.aisGame.curCity.getMissingFeatures(def.levels[this.level].req.features,1);
		this.misList=misList;
		if(0==this.infoVO.type && this.dlgPage.dlgPart.seqFull)
		{
			bad=6;//生产队列已满
			this.btmBox.setMis(textLib["SeqFull"]);
			this.btnMake.setEnabled(0);
		}
		else if(bld.level<def.bldLvReq)
		{
			bad=2;//机甲工厂等级不够 --- 生产
			this.btmBox.setMis(textLib["mechNeedBldLevel"](def.bldLvReq,this.aisBld));//"机甲工厂等级不够"
			this.btnMake.setEnabled(0);
		}
		else if(2==this.infoVO.type && misList && misList.length)
		{
			bad=5;//研究所等级不够  ---  强化
			DBOut("misList: "+misList);
		//	numTip=textLib["BldNeedFeature"](misList);
			this.btmBox.setMis(textLib["ReqNotMeet"](window.aisEnv.defLib.feature[misList[0]].name));//"研究所等级不够"
			this.btnMake.setEnabled(0);
		}
		else if(0==this.infoVO.type && !this.dlgPage.dlgPart.rmCap)//(!tstore.getFreeCap() || tstore.getFreeCap()<(def.storageSize+bld.slotCap))
		{
			bad=3;//仓库剩余空间不足 --- 生产
			this.btmBox.setMis(textLib["StorageNotEnough"]);
			this.btnMake.setEnabled(0);
		}
		else
		{
			this.btnMake.setEnabled(1);
		}
		DBOut("======== rmCap:"+this.dlgPage.dlgPart.rmCap);
		DBOut("======== type:"+this.infoVO.type);

		// this.lbxReq.clearItems();
		var aisBld=this.homeDlg.aisBld, storage=window.aisGame.curCity.partStorage;
		var rvo, css, color, size=this.reqSize-10, icon, name, def, num=0;
		for(var i=0; i<this.reqVo.length; i++)
		{
			rvo=this.reqVo[i];
			if("oil"==rvo.type || "gold"==rvo.type || "gem"==rvo.type || "chip"==rvo.typ || "cube"==rvo.typ)
			{
				def="";
				icon="icon_res_"+rvo.type+"_32";
				name="";
			}
			else if(rvo.type.indexOf("plu")>-1)
			{
				def=window.aisEnv.defLib.addon[rvo.type];
				num=aisBld.city.addOnStorage.getItemNum(def.codeName);
				icon=def.codeName+"_32";
				name=def.name;
			}
			else if(rvo.type.indexOf("par")>-1)
			{
				def=window.aisEnv.defLib.part[rvo.type];
				for(var j in storage.slots)
				{
					if(storage.slots[j].def.codeName==def.codeName)
					{
						num++;
					}
				}
				icon=def.codeName+"_32";
				name=def.name;
			}else if(rvo.type.indexOf("itm")>-1)
			{
				def=window.aisEnv.defLib.item[rvo.type];
				icon=def.Icon;
				storage=window.aisGame.curCity.itemStorage;
				num=storage.getItemNum(rvo.type);
				
			}
			color={color_r:10,color_g:10,color_b:10,color_a:200};
			if(num<rvo.num)
			{
				color={color_r:200,color_g:10,color_b:10,color_a:200};
				this.missReq.push({codeName:rvo.type,num:rvo.num-num,def:def});
				if(!bad)
				{
					bad=4;//额外需求不满足
				}
				this.reqVo[i].bad=bad;
			}
			DBOut("have "+num + ", need " + rvo.num);
			css={type:"icon",pos:[5,0,0],css:imgLib.getImg("box_shopitem"),w:size,h:size,items:[
				{type:"icon",pos:[0,0,0],w:size,h:size,css:imgLib.getIcon(icon)},
				{type:"text",pos:[0,0,0],w:size,h:size,text:name,font_size:FS.FM,css:color},
				{type:"text",pos:[0,0,0],w:size,h:size,align_h:2,align_v:2,text:"x"+rvo.num,font_size:FS.FM,css:color},
			]};
			// this.lbxReq.addItem(css);
		}
		DBOut("cvo: "+toJSON(cvo));
		if(!this.page.vwHomeStage.checkCost(cvo,0))
		{
			this.resBad=1;//钱不够
			if(!bad)
				bad=1;
		}
		this.cost=cvo;

		this.bad=bad;
		DBOut("checkReq: bad="+bad+", resBad:"+this.resBad);
	//	this.reqField.setDisplay(1);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgPartInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgPartInfo.onCloseClk=function(msg,key,way,extra)
		{
			return this.homeDlg.onCloseClk(msg,key,way,extra);
		};

		__Page.dlgPartInfo.onMakeClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var appEnv=this.appEnv;
				var page=this.page;
				var imgLib=page.imgLib;
				var cssLib=page.cssLib;
				var textLib=appEnv.textLib;
				var homeDlg=this.homeDlg;
				var bld=homeDlg.aisBld;
				if(9==extra)this.bad=0;
				//发送开始制造的消息
				if(!this.bad)
				{
					var def=this.infoVO.def;
					if(0==this.infoVO.type)//生产
					{
						DBOut("Will MFC: "+def.codeName);
						window.aisGame.king.execCmd(bld,"NewMfc",{codeName:def.codeName,num:1},bld);
						this.appEnv.switchDlg(this.dlgPage.dlgPart,0,null);
					}
					else if(2==this.infoVO.type)//强化
					{
						window.aisGame.king.execCmd(bld,"EnhancePart",{codeName:def.codeName,subType:this.infoVO.instance},bld);
					//	this.appEnv.stateLogs.showLog(textLib["EnhanceSuccess"]);
						this.page.audioObject.playSound("par_level_up");
						this.infoVO.level+=1;
						this.shapeBox.fadeIn(1,0);
						this.ehPic.fadeIn(5,0);
						this.ehTimer=setTimeout(1000*1.5,function(){
							this.ehTimer=null;
							this.shapeBox.fadeOut(5,0);
							this.ehPic.fadeOut(5,0);
							if(def.levels.length-1==this.infoVO.level+1)
							{
								this.appEnv.switchDlg(this.dlgPage.dlgPartEnhance,0,null);
							}
							else
							{
								this.updateView();
							}
						},this);
					}
				}
				else if(2==this.bad)//机甲工厂等级不够
				{
					appEnv.stateLogs.showLog(appEnv.textLib["MechLevelNotMatch"]);
				}
				else if(5==this.bad)//研究所等级不够
				{
					appEnv.stateLogs.showLog(appEnv.textLib["ReserchLevelNotMatch"]);
				}
				else if(3==this.bad)//剩余空间不足
				{
					appEnv.stateLogs.showLog(appEnv.textLib["NotEnough"]);
				}
				else if(4==this.bad)//额外消耗不足
				{
					appEnv.stateLogs.showLog(appEnv.textLib["NotEnoughItem"]);
					DBOut("missReq:"+toJSON(this.missReq));
				}
				else if(1==this.resBad)//资源不足
				{
					if(!this.page.vwHomeStage.checkCost(this.cost,1,this.onMakeClk,this,[msg,key,way,9]))
					{
						return;
					}
				}
			}
		};

		__Page.dlgPartInfo.onStorageClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgPartStorage,0,null);
			}
		};

		__Page.dlgPartInfo.onProductionClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgPart,0,null);
			}
		};
	}
}
