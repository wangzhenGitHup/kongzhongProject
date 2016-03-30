if(!__Page.stateDebug)
{
	__Page.stateDebug={
		page:__Page,
		name:"LogsState",
		logMsgs:[],
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateDebug);
	__Page.appEnv.entryState=__Page.stateDebug;
	//初始化State
	__Page.stateDebug.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateDebug=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		page.keyStateUtil.call(this);

		//创建State专署UI控件:
		layer=this.layer=this.appEnv.layer;

		keyid=appEnv.hudKeys.getKey(this);
		this.btnCleanStart=layer.addHudItem(cssLib.btnDebug.createCSS("Clean Start",[appEnv.scrSize[0]/2,100,0],240,keyid));
		this.regKeyVO(keyid,this,this.onCleanStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Load Start",[appEnv.scrSize[0]/2,160,0],240,keyid));
		this.regKeyVO(keyid,this,this.onLoadStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Resume Start",[appEnv.scrSize[0]/2,220,0],240,keyid));
		this.regKeyVO(keyid,this,this.onResumeStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Battle Start",[appEnv.scrSize[0]/2,280,0],240,keyid));
		this.regKeyVO(keyid,this,this.onBattleStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Editor Start",[appEnv.scrSize[0]/2,340,0],240,keyid));
		this.regKeyVO(keyid,this,this.onEditorStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("FX Viwer Start",[appEnv.scrSize[0]/2,400,0],240,keyid));
		this.regKeyVO(keyid,this,this.onFxViewStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Guide Start",[appEnv.scrSize[0]/2,460,0],240,keyid));
		this.regKeyVO(keyid,this,this.onGuideStart);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Guide Load",[appEnv.scrSize[0]/2,520,0],240,keyid));
		this.regKeyVO(keyid,this,this.onGuideLoad);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Onslaught Start",[appEnv.scrSize[0]/2,520+60,0],240,keyid));
		this.regKeyVO(keyid,this,this.onOnslaught);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnLoadStart=layer.addHudItem(cssLib.btnDebug.createCSS("Guide Battle",[(appEnv.scrSize[0]/2)+250,100,0],240,keyid));
		this.regKeyVO(keyid,this,this.onGuideBattle);

		DBOut("stateDebug.init: "+appEnv);
	};

	__Page.stateDebug.enter=function(preState)
	{
	};

	__Page.stateDebug.leave=function(nextState)
	{
		//TODO:code this:
	};

	//--------------------------------------------------------------------------
	//逻辑更新相关的函数
	//--------------------------------------------------------------------------
	{
	}

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateDebug.onKey=function(msg,key,way,extra)
		{
			ret=this.autoOnKey(msg,key,way,extra);
			DBOut("stateDebug.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateDebug.onCleanStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.page.setCookie("Runtime","StartGame","Clean",0);
				switchApp(this.page.genPageURL("ui_single_ais.jml"));
			}
		};

		__Page.stateDebug.onLoadStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.page.setCookie("Runtime","StartGame","Load",0);
				switchApp(this.page.genPageURL("ui_single_ais.jml"));
			}
		};

		__Page.stateDebug.onResumeStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.page.setCookie("Runtime","StartGame","Resume",0);
				switchApp(this.page.genPageURL("ui_single_ais.jml"));
			}
		};

		__Page.stateDebug.onBattleStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				//this.page.setCookie("Runtime","StartGame","Resume",0);
				switchApp(this.page.genPageURL("ui_single_battle.jml"));
			}
		};

		__Page.stateDebug.onEditorStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				//this.page.setCookie("Runtime","StartGame","Resume",0);
				switchApp(this.page.genPageURL("ui_cityeditor.jml"));
			}
		};

		__Page.stateDebug.onFxViewStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				//this.page.setCookie("Runtime","StartGame","Resume",0);
				switchApp(this.page.genPageURL("ui_fxview.jml"));
			}
		};

		__Page.stateDebug.onGuideStart=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.page.setCookie("Runtime","StartGame","Clean",0);
				switchApp(this.page.genPageURL("ui_single_guide.jml"));
			}
		};
		__Page.stateDebug.onGuideLoad=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.page.setCookie("Runtime","StartGame","GuideLoad",0);
				switchApp(this.page.genPageURL("ui_single_guide.jml"));
			}
		};

		__Page.stateDebug.onOnslaught=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				UIBody.setCookie("Runtime","bLocal","1",0)
				switchApp(this.page.genPageURL("ui_single_onslaught.jml"));
			}
		};

		__Page.stateDebug.onGuideBattle=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				//switchApp(this.page.genPageURL("ui_guideBattle.jml"));
				var data={};
				this.page.appEnv.loadFile(UIBody.genPageURL("levels/guideBattle.json"),function(levelVO){
						data.oppCity={Gold:100,Oil:100,level:1,name:"Mark",instances:levelVO};
						this.page.setCookie("Runtime","BattleStage",toJSON(data),0);
						this.page.setCookie("Runtime","StartGame","GuideBattle",0);

						switchApp(this.page.genPageURL("ui_single_guideBattle.jml"));
					},this);
			}
		};

	}
}
