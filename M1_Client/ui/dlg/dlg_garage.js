if(!__Page.dlgGarage)
{
	__Page.dlgGarage=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgGarage;
	__Page.dlgGarage.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		var leftW=this.leftW=420;
		var leftH=this.leftH=510;
		var leftX=this.leftX=15;
		var leftY=this.leftY=15;
		//兵种状态条区域
		pic=imgLib.getImg("pic_backlight");
		var statusX=this.statusX=cntInner[0]+leftX+leftW;
		var statusY=this.statusY=cntInner[1];
		var statusW=this.statusW=cntW-cntInner[0]-statusX;
		var statusH=this.statusH=pic.h;
		this.statusFieldCSS={id:"statusField",type:"icon",pos:[statusX,statusY-10,0],w:statusW,h:statusH};
		//兵种属性说明区域
		var attrW=this.attrW=statusW;
		var attrH=this.attrH=cntH-cntInner[1]*2-statusH;
		var attrX=this.attrX=statusX;
		var attrY=this.attrY=statusY+statusH;
		this.attrFieldCSS={id:"attrField",type:"icon",pos:[attrX,attrY-30,0],w:attrW,h:attrH};
		//底部区域
		var btmBoxW=this.btmBoxW=cntW-20;
		var btmBoxH=this.btmBoxH=66-4;
		var btmBoxX=this.btmBoxX=cntW/2;
		var btmBoxY=this.btmBoxY=cntH-cntInner[1]/2-btmBoxH/2;
		this.btmBoxCSS={id:"btmBox",type:"div3x3",pos:[btmBoxX,btmBoxY+2,0],w:btmBoxW,h:btmBoxH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),
			color_r:184,color_g:189,color_b:115,color_a:180,
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],textLib["ChoosePart"],btmBoxW,btmBoxH,1,1,1,1)}]
		};
	};
	__Page.dlgGarage.init=function(appEnv)
	{
		this.name="dlgGarage";
		this.viewId="dlgGarage";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;
		DBOut("dlgGarage.init: "+appEnv);

		boxw=this.boxW;
		boxh=this.boxH;
		var cntW=this.contentW;

		this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
		this.attrField=this.cntBox.appendNewChild({css:[this.attrFieldCSS]});
		this.btmBox=this.cntBox.appendNewChild({css:this.btmBoxCSS});

		this.leftBox=this.cntBox.appendNewChild({
			type:"icon",pos:[20,20,0],css:cssLib.boxSolid,w:420,h:510,color_r:220,color_g:220,color_b:180,color_a:0,"ui_event":1,
		});

		//拼装的Box：
		var pic=imgLib.getImg("pic_mech_bg1"), picW=pic.w, picH=pic.h;
		this.assembleBox=this.leftBox.appendNewChild({
			type:"icon",pos:[0,0,0],display:0,ui_event:1,css:pic,//w:420,h:510,
			fade_pos:[0,0,0],fade_size:1,fade_alpha:0,fade:1,items:[
				{type:"icon",pos:[0,0,0],css:imgLib.getImg("pic_mech_bg2")}//w:420,h:510,
			]
		});
		{
			//上半身按钮
			keyid=appEnv.hudKeys.getKey(this);
			this.btnBodyPart=this.assembleBox.appendNewChild(
				{css:this.dlgPage.dlgCSSBtnPrt.createCSS(page,appEnv,95,96,keyid),w:140,h:140}
			);
			this.regKeyVO(keyid,this,this.onBodyPrtClk);

			this.bodyName=cssLib.textFineMid.create(this.assembleBox,[200,54,0],textLib["Name"]+":",200,32,0,1,0,1);
			this.bodyTire=cssLib.textFineMid.create(this.assembleBox,[200,94,0],textLib["Level"]+":",200,32,0,1,0,1);
			this.bodyWeight=cssLib.textFineMid.create(this.assembleBox,[200,132,0],textLib["Weight"]+":",200,32,0,1,0,1,[128,128,128]);

			//下半身按钮
			keyid=appEnv.hudKeys.getKey(this);
			this.btnLegPart=this.assembleBox.appendNewChild(
				{css:this.dlgPage.dlgCSSBtnPrt.createCSS(page,appEnv,95,276,keyid),w:140,h:140}
			);
			this.regKeyVO(keyid,this,this.onLegPrtClk);

			this.legName=cssLib.textFineMid.create(this.assembleBox,[200,54+176,0],textLib["Name"]+":",180,40,0,1,0,1);
			this.legTire=cssLib.textFineMid.create(this.assembleBox,[200,94+176,0],textLib["Level"]+":",200,32,0,1,0,1);
			this.legWeight=cssLib.textFineMid.create(this.assembleBox,[200,132+176,0],textLib["WeightCap"]+":",200,32,0,1,0,1,[128,128,128]);

			//组装按钮
			keyid=appEnv.hudKeys.getKey(this);
			this.btnAssemble=this.assembleBox.appendNewChild(
				cssLib.normalBtn.createCSS([207,397,0],keyid,0,textLib["Assemble"],146,66)
			);
			this.regKeyVO(keyid,this,this.onAssembleClk);
		}

		//展示机甲的Box：
		this.mechBox=this.leftBox.appendNewChild({
			type:"icon",pos:[0,0,0],css:cssLib.boxSolid,display:0,ui_event:1,css:pic,//w:420,h:510,
			fade_pos:[0,0,0],fade_size:1,fade_alpha:0,fade:1
		});
		{
			//组件信息
			this.partTxt=this.mechBox.appendNewChild({css:cssLib.textFineMid.createCSS([6,6,0],textLib["MechPart"],picW,picH,0,0,0,0)});
			//魔法图标
			this.spellIcon=this.mechBox.appendNewChild({type:"icon",pos:[380,40,0],anchor_h:1,anchor_v:1,w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,filter:1,items:[
				{type:"icon",id:"lv",pos:[-30,30,0],anchor_h:0,anchor_v:2,css:imgLib.getImg("pic_lv1")}
			]});
			this.spellLv=this.spellIcon.getItemById("lv");
			//维修时间
			this.repqirTxt=this.mechBox.appendNewChild({css:cssLib.textFineMid.createCSS([picW/2,336,0],textLib["MaxRepairTime"],picW,30,1,1,1,1)});
			//拆除按钮
			keyid=appEnv.hudKeys.getKey(this);
			this.btnDemolish=this.mechBox.appendNewChild(
				cssLib.normalBtn.createCSS([207,397,0],keyid,1,textLib["Demolish"],146,66)
			);
			this.regKeyVO(keyid,this,this.onDemolishClk);
		}

		//模块按钮外框
		this.addOnBox=this.cntBox.appendNewChild({
			type:"icon",pos:[547,403,0],css:cssLib.boxSolid,w:100,h:100,color_r:220,color_g:220,color_b:180,color_a:255,anchor_h:1,anchor_v:1,display:0,items:[
				{type:"icon",pos:[0,3,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_mech_no")}
			]
		});
		keyid=appEnv.hudKeys.getKey(this);
		this.addOnBtn=this.cntBox.appendNewChild(
			{css:this.dlgPage.dlgCSSBtnAddon.createCSS(page,appEnv,547,403,keyid),w:100,h:100,display:0}
		);
		this.regKeyVO(keyid,this,this.onAddOnClk);
		this.addOnInfo=this.cntBox.appendNewChild({type:"text",pos:[613,403,0],w:226,h:120,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L,wrap:1,display:0,
			color_r:10,color_g:10,color_b:10,color_a:200,text:textLib["AssembleDesc"]});

		btnw=200;
		//初始化单位按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;

		this.dlgPage.dlgChoosePart.init(appEnv);
		this.dlgPage.dlgChooseAddOn.init(appEnv);
	};

	__Page.dlgGarage.updateAllBtn=function()
	{
		this._init=1;
		if(!this.uiInited)
			this.initUI();
		this.updateMechInfo();
		this.updatePartInfo();
		this.addOnBox.setDisplay(1);
		this.addOnInfo.setDisplay(1);
		if(this.aisBld)
		{
			var bld=this.aisBld;
			if(bld.craft)
			{
			//	for(i in bld.craft)DBOut(i+":"+bld.craft[i]);
				this.mechBox.setDisplay(1);
				this.assembleBox.setDisplay(0);
			}
			else
			{
				this.mechBox.setDisplay(0);
				this.assembleBox.setDisplay(1);
			}
		}
		this.updateInfoBar();
	};

	__Page.dlgGarage.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;

		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
			appEnv.setDlgAniCall(function(){
				if(!this._init)
					this.updateAllBtn();
				this.timer=null;
			},this);
		}
		else
		{
			if(this.aisBld)
			{
				this.updateAllBtn();
			}
		}
		if(this.aisBld)
		{
			bld=this.aisBld;
			title=textLib.partDlgTitle(bld);
			this.dlgTitle._setText(textLib["AssembleMech"]);
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgGarage.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgGarage.initUI=function()
	{
		this.uiInited=1;
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var vo=this.infoVO;
		var curLv=vo;
		var maxLv=curLv;
		var dmg=curLv["power"];
		this.infos=[];
		this.infos.push({name:"DmgPerSec", icon:"cap_dmg", cur:0, max:1});
		this.infos.push({name:"HP", icon:"cap_hp", cur:0, max:1, next:-1});
		this.infos.push({name:"MovementSpeed", icon:"cap_speed", cur:0, max:1});

		this.initInfoBar();
		this.attr={};

		this.attr["DmgFavor"]="";
		this.attr["DmgType"]="";
		this.attr["DmgTarget"]="";
		this.attr["DmgRange"]="";

		this.initAttrText();
	};
	__Page.dlgGarage.initInfoBar=function()
	{
		this.barList=[];
		var i, bar, list=this.infos;
		var x, y, gap=2, barCSS, iconH=48;
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
	};
	__Page.dlgGarage.initAttrText=function()
	{
		var i, j=0, list=this.attr, textLib=this.appEnv.textLib;
		var gap=2, iconH=64, cnt=6;
		var w=this.page.cssLib.boxStatusBar.w, h=20;
		var by=6;
		var x=this.attrW-w, y;
		this.attrList=[];
		for(i in list)
		{
			y=by+h*j;
			this.attrList.push(this.attrField.appendNewChild({
				type:"icon",id:"attr-"+i,pos:[x,y,0],w:w,h:h,
				items:[
					{type:"text",id:"attr-name",pos:[0,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:2,align_v:1,text:textLib[i]+": ",font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:255},
					{type:"text",id:"attr-info",pos:[w/2,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:0,align_v:1,text:list[i]+"",font_size:FS.FM,color_r:0,color_g:0,color_b:0,color_a:255},
					{type:"div3x3",pos:[w/2,y+30-6,0],w:w-100,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green_line")}
				]
			}));
			j++;
		}
	};
	__Page.dlgGarage.updateInfoBar=function()
	{
		var body, leg, addOn, defLib, craft=this.aisBld.craft;
		var storage=this.aisBld.city.partStorage;
		var slots=storage.slots;
		var bodyLv,legLv;
		if(!craft)
		{
			body=this.btnBodyPart.part;
			bodyLv=this.btnBodyPart.level;
			leg=this.btnLegPart.part;
			legLv=this.btnLegPart.level;
			addOn=this.addOnBtn.def;
			DBOut("this.addOnBtn.def="+this.addOnBtn.def);
		}
		else
		{
			defLib=window.aisEnv.defLib.part;
			if(craft.slots && craft.slots.body)
			{
			//	body=defLib[craft.slots.body.type];
				body=slots[craft.slots.body.subType+"@"+craft.slots.body.type];
				bodyLv=body.subInfo.level;
				body=body.def;
			}
			if(craft.slots && craft.slots.leg)
			{
			//	leg=defLib[craft.slots.leg.type];
				leg=slots[craft.slots.leg.subType+"@"+craft.slots.leg.type];
				legLv=leg.subInfo.level;
				leg=leg.def;
			}
			if(craft.addOn)
			{
				DBOut("craft.addOn="+craft.addOn);
				defLib=window.aisEnv.defLib.addon;
				addOn=defLib[craft.addOn.type];
			}
		}
		DBOut("bodyLv:"+bodyLv+", legLv:"+legLv);
		var textLib=this.appEnv.textLib;
//		this.infos.push({name:"DmgPerSec", icon:"cap_dmg", cur:0, max:1});
//		this.infos.push({name:"HP", icon:"cap_hp", cur:0, max:1, next:-1});
//		this.infos.push({name:"MovementSpeed", icon:"cap_spd", cur:0, max:1});
		var dmg={cur:0,next:0,max:0}, hp={cur:0,next:-1,max:0}, spd={cur:0,next:0,max:0};
		var cur, next, max, lv, maxLv;
		var avo=[{name:"DmgFavor",val:""},{name:"DmgType",val:""},{name:"DmgTarget",val:""},{name:"DmgRange",val:""}];//{name:"DmgFavor",val:0},
		if(body)
		{
			cur=body.levels[bodyLv+1]["factor"];
			max=body.levels[body.levels.length-1]["factor"];
			dmg.cur+=cur["power"];
			dmg.max+=max["power"];
			hp.cur+=cur["hp"];
			hp.max+=max["hp"];

			avo=[{name:"DmgFavor",val:body["favor"]},{name:"DmgType",val:body["dmg_type"]},{name:"DmgTarget",val:body["target"]},{name:"DmgRange",val:cur["range"]/100+textLib["Tiles"]}];
		}
		var textLib=this.appEnv.textLib;
		var attr, i, j;
		if(leg)
		{
			cur=leg.levels[legLv+1]["factor"];
			max=leg.levels[leg.levels.length-1]["factor"];
			hp.cur+=cur["hp"];
			hp.max+=max["hp"];
			spd.cur+=cur["move_speed"];
			spd.max+=max["move_speed"];
		}
		if(addOn)
		{
			cur=addOn;
			max=addOn;
		//	this.addOnInfo.setDisplay(1);
			this.addOnInfo.setText(addOn.name+"\n"+addOn.desc);
			var effect,spell;
			if(addOn["effect"])
			{
				effect=addOn["effect"];
				for(j in effect)
				{
					DBOut(j+":"+effect[j]);
					if("hp"==j)
					{
						hp.cur=Math.round(hp.cur*(1+effect[j]));
						hp.max=(hp.cur>hp.max?hp.cur:hp.max);
					}
					else if("damage"==j)
					{
						dmg.cur=Math.round(dmg.cur*(1+effect[j]));
						dmg.max=(dmg.cur>dmg.max?dmg.cur:dmg.max);
					}
					else if("speed"==j)
					{
						spd.cur=Math.round(spd.cur+(effect[j]*100*40));
						spd.max=(spd.cur>spd.max?spd.cur:spd.max);
					}
					else if("skill"==j)
					{
						spell=effect[j];//{codename:"Lightning",level:5}
					}
					else if("jump"==j)
					{

					}
					else if("perfer_target"==j)
					{
						avo[0].val=effect["favor"];
					}
				}
			}
		}
		else
		{
		//	this.addOnInfo.setDisplay(0);
			this.addOnInfo.setText(textLib["AssembleDesc"]);
		}
		if(spell)
		{
		//	var def=window.aisEnv.defLib.spell[spell["codename"]];
			this.spellIcon.setTexURL(this.page.imgLib.genIconPath("spell_"+spell["codename"],128));
			var lvPic=this.page.imgLib.getImg("pic_lv"+spell["level"]);
			this.spellLv.getItemById("lv").setTexUV([lvPic.tex_u,lvPic.tex_v,lvPic.tex_w,lvPic.tex_h]);
			this.spellLv.setDisplay(1);
		}
		else
		{
			this.spellIcon.setTexURL("");
			this.spellLv.setDisplay(0);
		}
		for(i=0; i<this.attrList.length; i++)
		{
			DBOut(avo[i].name+":"+avo[i].val);
			this.attrList[i].getItemById("attr-name").setText(textLib[avo[i].name]+": ");
			this.attrList[i].getItemById("attr-info").setText(avo[i].val);
		}
		var vos=[dmg, hp, spd];
		var bar;
		for(i=0; i<this.barList.length; i++)
		{
			bar=this.barList[i];
			bar.cur=vos[i].cur;
			bar.next=vos[i].next;
			bar.max=vos[i].max?vos[i].max:1;
			bar.update();
		}
	};
	__Page.dlgGarage.updateAttrText=function()
	{

	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgGarage.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgGarage.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//上半身选择按钮被点击
		__Page.dlgGarage.onBodyPrtClk=function(msg,key,way,extra)
		{
			var def;
			var list,i,n,btn,bld;
			if(msg==1 && way==1)
			{
				def=this.def;
				this.appEnv.switchDlg(this.dlgPage.dlgChoosePart,0,{title:this.appEnv.textLib["ChooseBody"],bodyPart:1,def:this.btnBodyPart.part,subType:this.btnBodyPart.subType,
					level:this.btnBodyPart.level});
			}
		};

		//下半身选择按钮被点击
		__Page.dlgGarage.onLegPrtClk=function(msg,key,way,extra)
		{
			var def;
			var list,i,n,btn,bld;
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgChoosePart,0,{title:this.appEnv.textLib["ChooseLeg"],bodyPart:0,def:this.btnLegPart.part,subType:this.btnLegPart.subType,
					level:this.btnLegPart.level});
			}
		};

		//上半身选择按钮被点击
		__Page.dlgGarage.onAddOnClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgChooseAddOn,0,{title:this.appEnv.textLib["ChooseAddOn"],def:this.addOnBtn.def});
			}
		};

		//关闭按钮被点击
		__Page.dlgGarage.onCloseClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.closeDlg(null,null,0);
			}
		};

		//返回按钮被点击
		__Page.dlgGarage.onBackClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this,0,null);
			}
		};

		__Page.dlgGarage.onAssembleClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(!this.btnBodyPart.part)
				{
					appEnv.stateLogs.showLog(textLib["NeedBody"]);
					return;
				}
				else if(!this.btnLegPart.part)
				{
					appEnv.stateLogs.showLog(textLib["NeedLeg"]);
					return;
				}
				else if(1==this.bad)
				{
					appEnv.stateLogs.showLog(textLib["WeightNotMatch"]);
					return;
				}
				if(this.btnBodyPart.part && this.btnLegPart.part)
				{
					window.aisGame.king.execCmd(this.aisBld,"NewMac",
						{
							body:{type:this.btnBodyPart.part.codeName,subType:this.btnBodyPart.subType,level:this.btnBodyPart.level},
							leg:{type:this.btnLegPart.part.codeName,subType:this.btnLegPart.subType,level:this.btnLegPart.level},
						}
					,this.aisBld);
					this.assembleBox.fadeOut(10,1);
					this.mechBox.fadeIn(20,1);
					this.updateMechInfo();
					this.updateInfoBar();
					this.aisBld.homeBld.addCraft(this.btnBodyPart.part.coc_ani,this.btnLegPart.part.coc_ani,0);
				}
			}
		};
		__Page.dlgGarage.onDemolishClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				aisGame.king.execCmd(this.aisBld,"DismissMac",{},this.aisBld);
				this.btnBodyPart.update(null,null);
				this.btnLegPart.update(null,null);
				this.updateMechInfo();
				this.updatePartInfo();
				this.updateMechInfo();
				this.updateInfoBar();
				this.assembleBox.fadeIn(20,1);
				this.mechBox.fadeOut(10,1);
				this.aisBld.homeBld.delCraft();
			}
		};
	}
	//--------------------------------------------------------------------------
	//面向其它对话框的函数
	//--------------------------------------------------------------------------
	{
		//选择上半身:
		__Page.dlgGarage.dlgChooseBody=function(def,subid,level)
		{
			DBOut("上半身等级："+level);
			this.btnBodyPart.update(def,subid,level);
			//TODO: 检查重量
			this.updatePartInfo();
			this.updateMechInfo();
			this.updateInfoBar();
		};
		//选择上半身:
		__Page.dlgGarage.dlgChooseLeg=function(def,subid,level)
		{
			DBOut("下半身等级："+level);
			this.btnLegPart.update(def,subid,level);
			//TODO: 检查重量
			this.updatePartInfo();
			this.updateMechInfo();
			this.updateInfoBar();
		};
		//选择上半身:
		__Page.dlgGarage.dlgChooseAddOn=function(def)
		{
			DBOut("Will change add-on to: "+(def?def.codeName:"None"));
			//TODO: Send command to change addon!
			aisGame.king.execCmd(this.aisBld,"ChangeMac",
				{
					addOn:def?{type:def.codeName}:{},
				}
			,this.aisBld);
			this.updatePartInfo();
			this.updateMechInfo();
			this.updateInfoBar();
		};

		__Page.dlgGarage.updatePartInfo=function()
		{
			var textLib=this.appEnv.textLib;
			var bad=0;
			if(this.aisBld && !this.aisBld.craft)
			{
				this.addOnBtn.setDisplay(0);
			//	this.addOnInfo.setDisplay(0);
				this.addOnInfo.setText(textLib["AssembleDesc"]);
			}
			if(this.btnBodyPart.part && this.btnLegPart.part)
			{
			//	this.btnBodyPart.part.weight=40;
			//	this.btnLegPart.part.load=30;
				if(this.btnBodyPart.part.weight>this.btnLegPart.part.load)
				{
					bad=1;//重量不符
				}
			}
			else
			{
				bad=2;//部件不全
			}
			this.bad=bad;
			if(bad)
			{
				this.btnAssemble._setEnabled(0);
			}
			else
			{
				this.btnAssemble._setEnabled(1);
			}

			if(this.btnBodyPart.part)
			{
				this.bodyName._setText(textLib["Name"]+":"+this.btnBodyPart.part.name);
				this.bodyTire._setText(textLib["Level"]+":"+(this.btnBodyPart.level+1));
				this.bodyWeight._setText(textLib["Weight"]+":"+this.btnBodyPart.part.weight+textLib["WeightUnit"]);
				if(bad==1)
				{
					this.bodyWeight._setColor(255,0,0,255);
				}
				else if(bad==2)
				{
					this.bodyWeight._setColor(128,128,128,255);
				}
				else
				{
					this.bodyWeight._setColor(0,180,0,255);
				}
			}
			else
			{
				this.bodyName._setText(textLib["Name"]+":");
				this.bodyTire._setText(textLib["Level"]+":");
				this.bodyWeight._setText(textLib["Weight"]+":");
				this.bodyWeight._setColor(255,255,255,255);
			}
			if(this.btnLegPart.part)
			{
				this.legName._setText(textLib["Name"]+":"+this.btnLegPart.part.name);
				this.legTire._setText(textLib["Level"]+":"+(this.btnLegPart.level+1));
				this.legWeight._setText(textLib["WeightCap"]+":"+this.btnLegPart.part.load+textLib["WeightUnit"]);
				if(bad)
				{
					this.legWeight._setColor(255,0,0,255);
				}
				else if(bad==2)
				{
					this.bodyWeight._setColor(128,128,128,255);
				}
				else
				{
					this.legWeight._setColor(0,180,0,255);
				}
			}
			else
			{
				this.legName._setText(textLib["Name"]+":");
				this.legTire._setText(textLib["Level"]+":");
				this.legWeight._setText(textLib["WeightCap"]+":");
				this.legWeight._setColor(128,128,128,255);
			}
		};

		__Page.dlgGarage.updateMechInfo=function()
		{
			var craft,def,body,leg,storage,slots,bodyLv,legLv,bodyLevel,legLevel;
			//TODO: Code this:
		//	this.updateInfoBar();
			var textLib=this.appEnv.textLib;
			if(this.aisBld && this.aisBld.craft)
			{
				storage=this.aisBld.city.partStorage;
				slots=storage.slots;
				craft=this.aisBld.craft;
				def=null;
				if(craft.addOn)
				{
					def=aisEnv.defLib.addon[craft.addOn.type];
				//	this.addOnInfo.setDisplay(1);
					this.addOnInfo.setText(def.name+"\n"+def.desc);
				}
				else
				{
				//	this.addOnInfo.setDisplay(0);
					this.addOnInfo.setText(textLib["AssembleDesc"]);
				}
				this.addOnBtn.update(def);
				this.addOnBtn.setDisplay(1);
				defLib=window.aisEnv.defLib.part;
				if(craft.slots && craft.slots.body)
				{
				//	body=defLib[craft.slots.body.type];
					body=slots[craft.slots.body.subType+"@"+craft.slots.body.type];
					bodyLv=body.subInfo.level;
					bodyLevel=body.def["levels"][bodyLv+1];
				}
				if(craft.slots && craft.slots.leg)
				{
				//	leg=defLib[craft.slots.leg.type];
					leg=slots[craft.slots.leg.subType+"@"+craft.slots.leg.type];
					legLv=leg.subInfo.level;
					legLevel=leg.def["levels"][legLv+1];
				}
				var w=this.mechBox.getW(), h=this.mechBox.getH(), sprite;
				var rdm=Math.floor(Math.random()*3);
				if(0==rdm){
					sprite="_walk001";
				}else if(1==rdm){
					sprite="_stay001";
				}else if(2==rdm){
					sprite="_attack1001";
				}
				DBOut("RepairSec: body="+bodyLevel["RepairSec"]+", leg="+legLevel["RepairSec"]);
				this.repqirTxt._setText(textLib["MaxRepairTime"]+textLib.getTimeText((bodyLevel["RepairSec"]+legLevel["RepairSec"])*1000));
				this.partTxt._setText(textLib["MechPart"]+"\n"+body.def.name+" Lv."+(bodyLv+1)+"\n"+leg.def.name+" Lv."+(legLv+1));
				if(!this.spBox)
				{
					this.spBox=this.mechBox.appendNewChild({type:"icon",pos:[w/2,h/2,0],w:w,h:h,anchor_h:1,anchor_v:1});
					this.spAni=this.spBox.addAdTMFirst("scale");
				}
				this.spAni.startAni(4,[1.0,1.0,1],1);
				this.spBox.removeAllChild();
				this.spBox.appendNewChild({type:"coc_sp",id:"body_sp",pos:[0,0,0],game:this.appEnv.cocGameMode,sprite:"bld_bg_2x2"});
				this.legSp=this.spBox.appendNewChild({type:"coc_sp",id:"leg_sp",pos:[0,0,0],game:this.appEnv.cocGameMode,sprite:leg.def.codeName+sprite});
				this.headSp=this.spBox.appendNewChild({type:"coc_sp",id:"body_sp",pos:[0,0,0],game:this.appEnv.cocGameMode,sprite:body.def.codeName+sprite});
				this.spAni.startAni(4,[1.5,1.5,1],1);
			}
			else
			{
				this.addOnBtn.update();
			//	this.addOnInfo.setDisplay(0);
				this.addOnInfo.setText(textLib["AssembleDesc"]);
				if(this.spBox)
				{
					this.mechBox.removeChild(this.spBox);
					this.spBox=null;
				}
			}
		}
	}
}
