//*********************************************************
//游戏界面环境*********************************************
//*********************************************************
if(!__Page.appEnv)
{
	<include check="0">"load_strings_cn.jml"</include>

	__Page.appEnv={
		page:__Page,form:null,bgLayer:null,edLayer:null,menuLayer:null,dlgLayer:null,pmtLayer:null,tipLayer:null,
		dlgBox:null,
		curState:null,nextState:null,stateParam:null,//States
		curDlg:null,nextDlg:null,dlgParam:null,pageDlgParam:null,//一级对话框
		curPmt:null,nextPmt:null,pmtParam:null,pagePmtParam:null,//二级对话框
		liveStates:[],//需要自动初始化的States
		dynaStates:[],//需要自动初始化的States,用途?
		subDlgPages:[],
		entryState:null,//启动进入的State
		pushMsgs:[],
		Rule:true, //禁手规则
		//键值、消息管理对象:
		hudKeys:{
			curValue:128,used:[],ref:{},
			getKey:function(obj) 
			{
				var key;
				if (this.used.length) {
					key = this.used.pop();
				}else {
					this.curValue++;
					key = this.curValue;
				}
				this.ref[key] = null;//obj;
				return key;
			},
			delKey:function(key){
			}
		},
		appKeys:
		{
			navBox:-1,
			//TODO: Add More:
		},
		
	};

	//初始化界面环境对象
	__Page.appEnv.init = function()
	{
		//TODO:Complete this!
		var i, n, list;
		var scrSize;
		var page = this.page;
		this.name = "appEnv";
		this.form = this.page.getElementById("ui-form");
		this.bgLayer = this.form.getLayer("background");
		this.edLayer = this.form.getLayer("target");
		this.menuLayer = this.form.getLayer("menu");
		this.dlgLayer = this.form.getLayer("dialog");
		this.pmtLayer = this.form.getLayer("dialog2");
		this.tipLayer = this.form.getLayer("tip");
		scrSize = this.scrSize = [__Page.getW(), __Page.getH()];

		this.dlgLayer.setDisplay(0);
		this.pmtLayer.setDisplay(0);

		DBOut("Init appEnv");
		
		//初始化app环境
		this.initApp();

		//Init game states:
		list = this.liveStates;
		n = list.length;
		
		for(i = 0; i < n; i++)
		{
			DBOut("Init live-state: " + list[i].name);
			list[i].init(this);
		}

		list = this.dynaStates;
		n = list.length;
		
		for(i = 0; i < n; i++)
		{
			DBOut("Init dynaStates-state: " + list[i].name);
			list[i].init(this);
		}

		list = this.liveStates;
		n = list.length;
		for(i = 0; i < n; i++)
		{
			if(list[i].postInit)
			{
				list[i].postInit(this);
			}
		}

		list = this.dynaStates;
		n = list.length;
		for(i = 0; i < n; i++)
		{
			if(list[i].postInit)
			{
				list[i].postInit(this);
			}
		}

		this.postInit();

		//在这里制定启动到什么状态去
		if(!this.entryState)
		{
			this.entryState = page.stateHome;
		}

		//Enter MainUI state
		DBOut("Will enter state: "+this.entryState);
		if(this.entryState)
		{
			this.switchState(this.entryState, 1, null);
		}
		this.form.setDisplay(1);
	};

	__Page.appEnv.free = function()
	{
		//TODO: Code this:
	};

	__Page.appEnv.initApp = function(vo)
	{
		//TODO: Code this:
	};

	__Page.appEnv.postInit = function()
	{
		//TODO: Code this:
	};

	//*******************************************************
	//切换当前界面状态
	//*******************************************************
	{
		//paramObj:{type:界面类型, dataObj:数据对象, name:名称, specialFlag:特定标志,},
		__Page.appEnv.switchState = function(state, now, paramObj)
		{
			DBOut("Will switch state: " + state.name);
			if(this.nextState == state)
			{
				return;
			}
			if(this.curState == state)
			{
				return;
			}
			this.nextState = state;
			
			if(now)
			{
				this._switchState();
			}
			else
			{
				this.form.setTimeout(0, this._switchState, this);
			}
		};

		//实际执行操作的切换当前界面状态的函数
		__Page.appEnv._switchState = function()
		{
			if(this.curState)
			{
				DBOut("SwitchState curState: "+this.curState.name);
			}
			DBOut("SwitchState nextState: "+this.nextState.name);

			var old = this.curState;
			var state = this.nextState;
			if(old)
			{
				old.leave(state);
			}
			this.curState = state;
			state.enter(old, this.stateParam);
			this.nextState = null;
		};
	}

	//--------------------------------------------------------------------------
	//与层级App相关
	//--------------------------------------------------------------------------
	{
		//打开一个以Page形式存在JML文件里的App
		__Page.appEnv.openPageApp = function(url, param)
		{
			var subpage;
			var page;
			if(this.curOverApp)//当前已经打开了一个对话框了……
			{
				//TODO: Code this...
				return;
			}
			page = this.page;
			subpage = jgx.UI.createItemByType("page");
			page.appendChild(subpage);
			subpage.appPage = page;
			subpage.appParam = param;
			this.curOverPage = subpage;
			this.form.setDisplay(0);
			subpage.openURL(url);
		};
		
		__Page.appEnv.closePageApp = function()
		{
			var subPage;
			subPage = this.curOverPage;
			if(subPage)
			{
				this.page.removeChild(subPage);
			}
			this.curOverPage = null;
			this.form.setDisplay(1);
			this.form.makeTop();
		};
	}
	
	//按键处理函数
	__Page.appEnv.onKey = function(msg, key, pass, extra)
	{
		if(this.curOverPage)
		{
			return 0;
		}
		//jgx.trap();
		if(this.curPmt)
		{
			return this.curPmt.onKey(msg, key, pass, extra);
		}
		if (this.curDlg)
		{
			return this.curDlg.onKey(msg, key, pass, extra);
		}
		if(this.curState)
		{
			if(this.curState.onKey(msg, key, pass, extra))
			{
				return 1;
			}
		}
		return 0;
	};
	
	//--------------------------------------------------------------------------
	//鼠标、触摸消息处理函数
	__Page.appEnv.onTouch = function(pen, msg, x, y, size, pass)
	{
		if(this.curOverPage)
		{
			return 0;
		}
		if(this.curPmt && this.curPmt.onTouch)
		{
			return this.curPmt.onTouch(pen, msg, x, y, pass);
		}
		if (this.curDlg && this.curDlg.onTouch)
		{
			return this.curDlg.onTouch(pen, msg, x, y, pass);
		}
		if(this.curState && this.curState.onTouch)
		{
			return this.curState.onTouch(pen, msg, x, y, pass);
		}
		return 0;
	};
	
	//格式化时间格式 
	__Page.appEnv.formatDate = function(val)
	{
		if (val != null) {
			var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
			//月份为0-11，所以+1，月份小于10时补个0
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			return date.getFullYear() + "-" + month + "-" + currentDate + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
		}

		return "";
	};
	
	/*__Page.appEnv.playAudio = function(item, vol)
	{
		if(this.saveInfo && this.saveInfo.audio_fx)
		{
			if(!vol)
				vol=256;
			audio.playItem(item, vol);
		}
	};*/

	
	__Page.appEnv.flashItem = function(timer, item)
	{
		if(item.f)
		{
			item.fadeOut(timer, 0);
		}
		else
		{
			item.fadeIn(timer, 0);
		}
		item.f = !item.f;
		item.flash = this.form.setFrameout(timer,function(){this.flashItem(timer, item);}, this);
	};
	
	__Page.appEnv.stopFlash = function(item)
	{
		if(item.flash)
		{
			this.form.clearTimeout(item.flash);
			item.flash = null;
		}
		if(item.f)
		{
			item.fadeOut(1, 0);
			item.f = !item.f;
		}
	};
}