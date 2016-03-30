if(!__Page.stateFxView)
{
	__Page.stateFxView={
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
		curNewBldDefIdx:-1,
		curFxIdx:-1,
		curFxDefIdx:-1,
		curPrjIdx:-1,
		curPrjDefIdx:-1,
		defFxFilePath:null,
		defPrjFilePath:null,
	};
	
	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateFxView);
	
	//初始化State
	__Page.stateFxView.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;
		
		this.appEnv=appEnv;
		appEnv.stateFxView=this;
		appEnv.entryState=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		page.keyStateUtil.call(this);
		page.vwFxView.initStage();
		
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
			this.hudBCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2+70,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300),appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			this.hudBldBox=this.hudBaseBox.appendNewChild({
				type:"shape",id:"BldBox",pos:[appEnv.scrSize[0]-200,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				display:1,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_size:1,fade_alpha:0,
			});

			this.hudFxBox=this.hudBaseBox.appendNewChild({
				type:"shape",id:"FxBox",pos:[appEnv.scrSize[0]-200,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				display:0,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_size:1,fade_alpha:0,
			});

			this.hudPrjBox=this.hudBaseBox.appendNewChild({
				type:"shape",id:"PrjBox",pos:[appEnv.scrSize[0]-200,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				display:0,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_size:1,fade_alpha:0,
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
		DBOut("stateFxView.init: "+appEnv);
	};
	
	__Page.stateFxView.enter=function(preState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var cssLib;
		var saveTxt,gameVO,list,i,n,css,keyId,items;
		DBOut("stateFxView: Enter");
		
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

	__Page.stateFxView.leave=function(nextState)
	{
		//TODO:code this:
	};

	__Page.stateFxView.createBldBtn=function(idx,name)
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
	
	__Page.stateFxView.onGameLoaded=function()
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
		list=page.vwFxView.objDefs;
		items=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].type==1)//这个是建筑
			{
				items.push(this.createBldBtn(i,list[i].def_name));
			}
		}
		this.hudLBBlds.addItems(items);
		this.regKeyVO(appEnv.appKeys.editBlds,this,this.onBldType);
		
		//增加特效列表
		this.hudLBFxs=this.hudFxBox.appendNewChild({
			"type":"listbox","pos":[0,0,0],"w":200.00,"h":this.hudBldBox.getH(),"show_align":0,"show_fx":2,
			"item_w":200,"item_h":66,"hot_item":-1,"item_alpha_down":1.0,"item_alpha_dimmed":1.00,
			"item_size_down":0.95,"item_size_check":0.9,"move_gap":20,"fast_scroll":1,hot_check:1,
			ui_event:1,key:appEnv.appKeys.editFxs,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		});
		list=page.vwFxView.fxDefs;
		items=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			items.push(this.createBldBtn(i,list[i].name));
		}
		this.hudLBFxs.addItems(items);
		this.regKeyVO(appEnv.appKeys.editFxs,this,this.onFxType);

		//增加特效列表
		this.hudLBPrjs=this.hudPrjBox.appendNewChild({
			"type":"listbox","pos":[0,0,0],"w":200.00,"h":this.hudBldBox.getH(),"show_align":0,"show_fx":2,
			"item_w":200,"item_h":66,"hot_item":-1,"item_alpha_down":1.0,"item_alpha_dimmed":1.00,
			"item_size_down":0.95,"item_size_check":0.9,"move_gap":20,"fast_scroll":1,hot_check:1,
			ui_event:1,key:appEnv.appKeys.editPrjs,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		});
		list=page.vwFxView.prjDefs;
		items=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			items.push(this.createBldBtn(i,list[i].def_name));
		}
		this.hudLBPrjs.addItems(items);
		this.regKeyVO(appEnv.appKeys.editPrjs,this,this.onPrjType);

		//增加底部功能按钮:
		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[-130,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_fx_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onFxFire);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[-60,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_prj_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onPrjFire);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[10,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_sel_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeSel);


		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[80,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_fxorg_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onFxOrg);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[150,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_fxtgt_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onFxTgt);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[220,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_new_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeNew);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudBCBox.appendNewChild({
			type:"key",key:keyid,pos:[290,250],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_del_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onModeDel);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudFxBox.appendNewChild({
			type:"key",key:keyid,pos:[-32,appEnv.scrSize[1]/2,0],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_reload_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onReloadFX);

		keyid=appEnv.hudKeys.getKey(this);
		this.hudPrjBox.appendNewChild({
			type:"key",key:keyid,pos:[-32,appEnv.scrSize[1]/2,0],tex:page.genPageURL(window.imgPath+"/ui/btn_edit_reload_32.png"),w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,ui_event:1,filter:1,
			anchor_h:1,anchor_v:1,
			state_up:{w:64,h:64},
			state_down:{w:70,h:70},
			state_gray:{w:64,h:64},
		});
		this.regKeyVO(keyid,this,this.onReloadPrj);

		//当前按钮指示:
		this.hudCurMark=this.hudBCBox.appendNewChild({
			type:"icon",key:keyid,pos:[220,230],tex:page.genPageURL(window.imgPath+"/ui/mark_edit_cur_32.png"),w:32,h:32,tex_u:0,tex_v:0,tex_w:1,tex_h:1,
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
		this.edBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Load",[100,100,0],180,appEnv.appKeys.editLoad);

		this.edBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.editExit);

		this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);

	};
	
	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateFxView.showBldMenu=function(hotId)
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
		
		__Page.stateFxView.hideBldMenu=function(hotId)
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
		__Page.stateFxView.onKey=function(msg,key,way,extra)
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
				this.page.vwFxView.multiSelect=1;
				return 1;
			}
			if(msg==1 && way==1 && key==17)//Ctrl down!
			{
				this.page.vwFxView.multiSelect=0;
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
				//退出
				if(key==appEnv.appKeys.editExit)
				{
					switchApp(this.page.genPageURL("ui_debug.jml"));
					return 1;
				}
				if(key==appEnv.appKeys.editSave)
				{
					var saveVO,saveText;
					saveVO=this.page.vwFxView.genSaveVO();
					saveText=toJSON(saveVO);
					Dialogs.saveToFile(saveText,"*.js");
					return 1;
				}
				if(key==appEnv.appKeys.editLoad)
				{
					Dialogs.openFile("Open saved scene",["*.js"],this.onSavedFile,this);
					return 1;
				}
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			DBOut("stateFxView.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};
		
		__Page.stateFxView.onSavedFile=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			DBOut("Will open: "+path);
			stub=this.page.loadFileText(path);
			stub.onLoad=this.onSavedText;
			stub.onError=this.onSavedTextError;
			stub.state=this;
		};
		
		__Page.stateFxView.onSavedText=function()
		{
			var self=this.state;
			var text,savedVO;
			text="__saved=("+this.getText()+");__saved;";
			DBOut("Text: "+text);
			savedVO=eval(text);
			DBOut("VO: "+savedVO);
			self.page.vwFxView.loadSavedVO(savedVO);
		};
		
		__Page.stateFxView.onSavedTextError=function()
		{
		};
		
		__Page.stateFxView.onItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1)
			{
				DBOut("Item Selected: "+extra);
				if(this.curUnitLBIdx!=extra)
				{
					this.curUnitLBIdx=extra;
					this.page.vwFxView.curUnitIdx=this.curUnitDefIdx=this.lbItems.itemAt(extra).unitDefIdx;
					DBOut("Unit defIdx: "+this.curUnitDefIdx);
				}
			}
		};
		
		__Page.stateFxView.onBldType=function(msg,key,way,extra)
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
		
		__Page.stateFxView.onFxType=function(msg,key,way,extra)
		{
			var item;
			if(msg==2 && way==1)
			{
				if(this.curFxIdx>=0)
				{
					item=this.hudLBFxs.itemAt(this.curFxIdx);
					if(item)
					{
						item.setFaceColor([0,0,0,128]);
					}
					this.curFxDefIdx=-1;
				}
				this.curFxIdx=extra;
				if(this.curFxIdx>=0)
				{
					item=this.hudLBFxs.itemAt(this.curFxIdx);
					if(item)
					{
						item.setFaceColor([128,128,128,128]);
						this.curFxDefIdx=item.objIdx;
					}
				}
			}
		};
		
		__Page.stateFxView.onPrjType=function(msg,key,way,extra)
		{
			var item;
			if(msg==2 && way==1)
			{
				DBOut("XXX: "+extra);
				if(this.curPrjIdx>=0)
				{
					item=this.hudLBPrjs.itemAt(this.curPrjIdx);
					DBOut("XXXX");
					if(item)
					{
						item.setFaceColor([0,0,0,128]);
					}
					this.curPrjDefIdx=-1;
				}
				this.curPrjIdx=extra;
				if(this.curPrjIdx>=0)
				{
					item=this.hudLBPrjs.itemAt(this.curPrjIdx);
					if(item)
					{
						item.setFaceColor([128,128,128,128]);
						this.curPrjDefIdx=item.objIdx;
					}
				}
			}
		};
		
		__Page.stateFxView.onFxFire=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=3;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([-130,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudIn(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};
		
		__Page.stateFxView.onPrjFire=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=6;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([-60,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudIn(this.hudPrjBox,10);
			}
		};
		
		__Page.stateFxView.onFxOrg=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=4;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([80,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};
		
		__Page.stateFxView.onFxTgt=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=5;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([150,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};
		
		__Page.stateFxView.onModeSel=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=0;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([10,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};

		__Page.stateFxView.onModeNew=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=1;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([220,230,0],1,1,3,0);
				this.appEnv.hudIn(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};

		__Page.stateFxView.onModeDel=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				this.curEditMode=2;
				this.page.vwFxView.clearSelBld();
				this.hudCurMark.startAniEx([290,230,0],1,1,3,0);
				this.appEnv.hudOut(this.hudBldBox,10);
				this.appEnv.hudOut(this.hudFxBox,10);
				this.appEnv.hudOut(this.hudPrjBox,10);
			}
		};
		
		__Page.stateFxView.onReloadFX=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				if(!this.defFxFilePath)
				{
					Dialogs.openFile("Open saved def",["*.js"],this.onSavedFxFile,this);
				}
				else
				{
					var stub;
					stub=this.page.loadFileText(this.defFxFilePath);
					stub.onLoad=this.onSavedFxText;
					stub.onError=this.onSavedFxTextError;
					stub.state=this;
				}
			}
		};

		__Page.stateFxView.onSavedFxFile=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			stub=this.page.loadFileText(path);
			stub.onLoad=this.onSavedFxText;
			stub.onError=this.onSavedFxTextError;
			stub.state=this;
			this.defFxFilePath=path;
		};
		
		__Page.stateFxView.onSavedFxText=function()
		{
			var self=this.state;
			var text,savedVO,list;
			text="(function(page){return ["+this.getText()+"];})";
			savedVO=eval(text);
			list=savedVO(self.page);
			self.page.vwFxView.game.effects.reloadEffectDef(list);
		};
		
		__Page.stateFxView.onSavedFxTextError=function()
		{
		};

		__Page.stateFxView.onReloadPrj=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				if(!this.defPrjFilePath)
				{
					Dialogs.openFile("Open saved def",["*.js"],this.onSavedPrjFile,this);
				}
				else
				{
					var stub;
					stub=this.page.loadFileText(this.defPrjFilePath);
					stub.onLoad=this.onSavedPrjText;
					stub.onError=this.onSavedPrjTextError;
					stub.state=this;
				}
			}
		};

		__Page.stateFxView.onSavedPrjFile=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			stub=this.page.loadFileText(path);
			stub.onLoad=this.onSavedPrjText;
			stub.onError=this.onSavedPrjTextError;
			stub.state=this;
			this.defPrjFilePath=path;
		};
		
		__Page.stateFxView.onSavedPrjText=function()
		{
			var self=this.state;
			var text,savedVO,list;
			text="(function(page){return ["+this.getText()+"];})";
			savedVO=eval(text);
			list=savedVO(self.page);
			self.page.vwFxView.game.level.reloadPrjtls(list);
		};
		
		__Page.stateFxView.onSavedPrjTextError=function()
		{
		};

		__Page.stateFxView.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.stateFxView.onPowerClk=function(msg,key,way,extra)
		{
		};
		
		//管理库存，目前暂时用作测试建造建筑
		__Page.stateFxView.onStoreClk=function(msg,key,way,extra)
		{
		};
		
		__Page.stateFxView.onCaravanClk=function(msg,key,way,extra)
		{
		};
	}
}
