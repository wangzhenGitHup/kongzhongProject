if(!__Page.stateCityEdit)
{
	__Page.stateCityEdit={
		page:__Page,
		name:"EditCityState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		pushMsgs:[],
		/*unitTypes:[
			{type:"chr_Marine",idx:-1,icon:"unit1",num:0},
			{type:"chr_Sniper",idx:-1,icon:"unit2",num:0},
		],*/
		curNewBldIdx:-1,
		curNewBldDefIdx:-1
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateCityEdit);

	//初始化State
	__Page.stateCityEdit.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateCityEdit=this;
		appEnv.entryState=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		page.keyStateUtil.call(this);
		page.vwCityEdit.initStage();

		//创建State专署UI控件:
		{
			layer=this.appEnv.layer;
			appEnv.hudBaseBox=this.hudBaseBox=layer.addHudItem({type:"shape",pos:[0,0,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTLBox=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0
			});
			this.hudTCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[appEnv.scrSize[0]-300,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBLBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[0,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300),appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			this.hudBldBox=this.hudBaseBox.appendNewChild({
				type:"shape",pos:[appEnv.scrSize[0]-200,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				display:1,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_size:1,fade_alpha:0,
			});

			//调试控件底盘:
			this.hudDBDock=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[-200,0,0],w:200,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0
			});
			this.hudDBBox=this.hudDBDock.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,
				display:0,fade:1,fade_size:1,fade_alpha:0
			});

		}
		//DBOut("stateCityEdit.init: "+appEnv);
	};

	__Page.stateCityEdit.enter=function(preState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var cssLib;
		var saveTxt,gameVO,list,i,n,css,keyId,items;
		DBOut("stateCityEdit: Enter");

		cssLib=this.page.cssLib;
		savedTxt=page.getCookie("COC","BattleUnits");
		DBOut("Saved Snap: "+savedTxt);
		if(!savedTxt)
		{
			return;
		}
		gameVO=fromJSON(savedTxt);
		if(!gameVO)
		{
			return;
		}
	};

	__Page.stateCityEdit.leave=function(nextState)
	{
		//TODO:code this:
	};

	__Page.stateCityEdit.createBldBtn=function(idx,name)
	{
		var btn,cssLib;
		cssLib=this.page.cssLib;
		btn={
			type:"shape",pos:[5,3,0],w:190,h:60,face_r:0,face_g:0,face_b:0,face_a:128,
			items:[
				cssLib.textMid.createCSS([0,0,0],name,190,60,0,0,1,1)
			],
			objIdx:idx,objName:name
		};
		return btn;
	};

	__Page.stateCityEdit.onGameLoaded=function()
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var list,i,n,items,keyid;
		//增加建筑物列表
		this.hudLBBlds=this.hudBldBox.appendNewChild({
			"type":"listbox","pos":[0,0,0],"w":200.00,"h":this.hudBldBox.getH(),"show_align":0,"show_fx":2,
			"item_w":200,"item_h":66,"hot_item":-1,"item_alpha_down":1.0,"item_alpha_dimmed":1.00,
			"item_size_down":0.95,"item_size_check":0.9,"move_gap":20,"fast_scroll":1,hot_check:1,
			ui_event:1,key:appEnv.appKeys.editBlds,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		});
		list=page.vwCityEdit.objDefs;
		items=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].type==1)//这个是建筑
			{
				DBOut("Will add: "+toJSON(list[i]));
				items.push(this.createBldBtn(i,list[i].def_name));
			}
		}
		this.hudLBBlds.addItems(items);
		this.regKeyVO(appEnv.appKeys.editBlds,this,this.onBldType);

		//增加底部功能按钮:
		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[80,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_sel_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeSel);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[150,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_new_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeNew);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[220,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_del_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeDel);

		//当前按钮指示:
		this.hudCurMark=this.hudBCBox.appendNewChild({
			type:"icon",key:keyid,pos:[150,230],tex:page.genPageURL(window.imgPath+"/ui/mark_edit_cur_32.png"),w:32,h:32,tex_u:0,tex_v:0,tex_w:1,tex_h:1,
			anchor_h:1,anchor_v:2,
		});
		this.hudCurMark.adMov=this.hudCurMark.addAdTMFirst("move");
		this.hudCurMark.adMov.setFilter(1);
		this.hudCurMark.adMov.setMaxLimit(0,[0.0,3.0,0.0]);
		this.hudCurMark.adMov.setMinLimit(0,[0.0,-3.0,0.0]);
		this.hudCurMark.adMov.startAni(2,[0,0.2,0],0);

		this.curEditMode=1;//New

		//下面这些按钮是为调试增加的:
		this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

		this.edBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Save",[100,50,0],180,appEnv.appKeys.editSave);

		this.edBtnSaveCookie=cssLib.btnDebug.create(this.hudDBBox,"SaveCookie",[100,100,0],180,appEnv.appKeys.editSaveCookie);
		this.edBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Load",[100,150,0],180,appEnv.appKeys.editLoad);

		cssLib.btnDebug.create(this.hudDBBox,"LoadLevel",[100,250,0],180,appEnv.appKeys.editLoadLevel);

		this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
		this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);

		this.edBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.editExit);

		this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);

	};

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateCityEdit.showBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudIn(list[i],5+Math.abs((i-hotId)*1));
			}
		};

		__Page.stateCityEdit.hideBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudOut(list[i],5+Math.abs((i-hotId)*1));
			}
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateCityEdit.onKey=function(msg,key,way,extra)
		{
			var ret,appEnv,url;
			appEnv=this.appEnv;
			if(key==-1)
			{
				if(msg==2)//Start move
				{
					this.hudBaseBox.fadeOut(3,0);
				}
				else if(msg==1)//End move
				{
					appEnv.hudIn(this.hudBaseBox,3);
				}
				return;
			}
			if(msg==0 && way==1 && key==17)//Ctrl down!
			{
				this.page.vwCityEdit.multiSelect=1;
				return 1;
			}
			if(msg==1 && way==1 && key==17)//Ctrl down!
			{
				this.page.vwCityEdit.multiSelect=0;
				return 1;
			}
			if(msg==1 && way==1 && key<0)
			{
				//持久化存盘
				if(key==appEnv.appKeys.debugSave)
				{
					return 1;
				}
				//开关调试面板:
				if(key==appEnv.appKeys.debugSwitch)
				{
					if(this.hudDBBox.getDisplay())
					{
						appEnv.hudOut(this.hudDBBox,10);
						this.hudDBDock.startAniEx([-200,0,0],1,1,0,3);
						this.dbBtnOpen.setText(">");
					}
					else
					{
						appEnv.hudIn(this.hudDBBox,10);
						this.hudDBDock.startAniEx([0,0,0],1,1,0,3);
						this.dbBtnOpen.setText("<");
					}
					return 1;
				}
				{
					if(key==appEnv.appKeys.debugScaleU)
					{
						var scale;
						scale=this.page.vwCityEdit.gameHud.getScale();
						this.page.vwCityEdit.gameHud.setScale(scale+0.1);
						return 1;
					}
					if(key==appEnv.appKeys.debugScaleD)
					{
						var scale;
						scale=this.page.vwCityEdit.gameHud.getScale();
						this.page.vwCityEdit.gameHud.setScale(scale-0.1);
						return 1;
					}
				}
				//退出
				if(key==appEnv.appKeys.editExit)
				{
					switchApp(this.page.genPageURL("ui_debug.jml"));
					return 1;
				}
				if(key==appEnv.appKeys.editSave)
				{
					var saveVO,saveText;
					saveVO=this.page.vwCityEdit.genSaveVO();
					saveText=toJSON(saveVO);
					Dialogs.saveToFile(saveText,"*.js");
					return 1;
				}
				if(key==appEnv.appKeys.editSaveCookie)
				{
					var saveVO,saveText;
					saveVO=this.page.vwCityEdit.genSaveVO();
					saveText=toJSON(saveVO);
					this.page.setCookie("COC","SaveStage",saveText,0);
					return 1;
				}
				if(key==appEnv.appKeys.editLoad)
				{
					Dialogs.openFile("Open saved scene",["*.js"],this.onSavedFile,this);
					return 1;
				}
				if(key==appEnv.appKeys.editLoadLevel)
				{
					var text=Dialogs.getText("Input Level:");
					this.loadLevel(parseInt(text,10));
					return 1;
				}
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			DBOut("stateCityEdit.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateCityEdit.onSavedFile=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			DBOut("Will open: "+path);
			stub=this.page.loadFileText(path);
			stub.onLoad=this.onSavedText;
			stub.onError=this.onSavedTextError;
			stub.state=this;
		};

		__Page.stateCityEdit.onSavedText=function()
		{
			var self=this.state;
			var text,savedVO;
			text="__saved=("+this.getText()+");__saved;";
			DBOut("Text: "+text);
			savedVO=eval(text);
			DBOut("VO: "+savedVO);
			self.page.vwCityEdit.loadSavedVO(savedVO);
		};

		__Page.stateCityEdit.onSavedTextError=function()
		{
		};

		__Page.stateCityEdit.loadLevel=function(lv)
		{
			if(this.page.vwCityEdit.level)this.page.vwCityEdit.level.reset();
			var defLib,i,j,k,list,n,num,townhall,def,bld,name,levels,features,_lv,stage,idx;
			defLib=window.aisEnv.defLib.bld;
			stage=this.page.vwCityEdit;

			if(!defLib["TownHall"])return;
			if(lv>=defLib["TownHall"].levels.length)return;

			bld=[];
			townhall=defLib["TownHall"].levels[lv];
			list=townhall.factors;
			n=list.length;
			for(i=0;i<n;i++)
			{
				num=list[i].add;
				name=list[i].name;
				if(name.indexOf("NumCap")==-1)continue;
				name=name.substr(6);
				def=defLib[name];
				if(!def)continue;
				levels=def.levels;
				_lv=this.getMaxLvByTownHalLv(lv,levels);
				if(_lv)
				{
					idx=stage.level.getObjDefIdx(name+_lv);
					if(idx!=-1)
					{
						for(j=0;j<num;j++)
							bld.push({"defName": name+_lv, "def": idx, "group": 2, "x": Math.floor(Math.random()*40), "y": Math.floor(Math.random()*40)});
					}
				}
			}
			DBOut("---bld="+toJSON(bld));
			stage.loadSavedVO({"bunkerunits": [], "objs": bld});

		};
		__Page.stateCityEdit.getMaxLvByTownHalLv=function(lv,levels)
		{
			var j,k,_lv=0,features;
			for(j=levels.length-1;j>=0;j--)
			{
				features=levels[j].req.features;
				for(k=0;k<features.length;k++)
				{
					_lv=parseInt(features[k].substr(11),10);
					if(_lv<=lv)
					{
						return levels[j].level;
					}
				}
			}
			return 0;
		};

		__Page.stateCityEdit.onItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1)
			{
				DBOut("Item Selected: "+extra);
				if(this.curUnitLBIdx!=extra)
				{
					this.curUnitLBIdx=extra;
					this.page.vwCityEdit.curUnitIdx=this.curUnitDefIdx=this.lbItems.itemAt(extra).unitDefIdx;
					DBOut("Unit defIdx: "+this.curUnitDefIdx);
				}
			}
		};

		__Page.stateCityEdit.onBldType=function(msg,key,way,extra)
		{
			var item;
			if(msg==2 && way==1)
			{
				DBOut("Click: "+extra);
				if(this.curNewBldIdx>=0)
				{
					item=this.hudLBBlds.itemAt(this.curNewBldIdx);
					if(item)
					{
						item.setFaceColor([0,0,0,128]);
					}
				}
				this.curNewBldIdx=extra;
				if(this.curNewBldIdx>=0)
				{
					item=this.hudLBBlds.itemAt(this.curNewBldIdx);
					if(item)
					{
						item.setFaceColor([128,128,128,128]);
						this.curNewBldDefIdx=item.objIdx;
					}
				}
			}
		};

		__Page.stateCityEdit.onModeSel=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=0;
				this.page.vwCityEdit.clearSelBld();
				this.hudCurMark.startAniEx([80,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
			}
		};

		__Page.stateCityEdit.onModeNew=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=1;
				this.page.vwCityEdit.clearSelBld();
				this.hudCurMark.startAniEx([150,230,0],1,1,3,0);
				this.appEnv.hudIn(this.hudBldBox,10);
			}
		};

		__Page.stateCityEdit.onModeDel=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=2;
				this.page.vwCityEdit.clearSelBld();
				this.hudCurMark.startAniEx([220,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
			}
		};

		__Page.stateCityEdit.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.stateCityEdit.onPowerClk=function(msg,key,way,extra)
		{
		};

		//管理库存，目前暂时用作测试建造建筑
		__Page.stateCityEdit.onStoreClk=function(msg,key,way,extra)
		{
		};

		__Page.stateCityEdit.onCaravanClk=function(msg,key,way,extra)
		{
		};
	}
}
