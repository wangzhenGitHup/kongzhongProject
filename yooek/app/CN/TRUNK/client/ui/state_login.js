/*
	 登录界面
*/
if(!__Page.stateLogin)
{
	__Page.stateLogin = {
		page:__Page,
		name:"JGXUI_stateLogin",
		prjFilePath:null,
		process:0,
	};
	
	__Page.appEnv.dynaStates.push(__Page.stateLogin);
	__Page.appEnv.entryState = __Page.stateLogin;
	
	__Page.stateLogin.init = function(appEnv, state)
	{
		var page,layer,stateMain,i,item,leftTag,centerTag,rightTag;
		this.appEnv = appEnv;
		page = this.page;
		var cssLib = page.cssLib;
		stateMain = page.stateMain;
		page.keyStateUtil.call(this);
		
		this.stateLoginLayer = layer = stateMain.getEditorLayer();
		
		<include check="0">"ui/state_login_css.js"</include>
		this.stateLoginItem = layer.appendNewChild(this.initLoginCSS(appEnv.scrSize[0], appEnv.scrSize[1]));
		this.processTextTipItem = this.stateLoginItem.findItemById("processTip");
		this.processAni = this.processTextTipItem.getAni(0);
		appEnv.flashItem(30, this.processAni);
	
		layer.setUIEvent(1);
	};
	
	__Page.stateLogin.enter = function(preState)
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideBottomRect();
		stateMain.hideTopRect();
		
		/*this.test();
		this.appEnv.form.setTimeout(5000, function(){
			appEnv.switchState(this.page.stateHome, 1, null);
		}, this);*/
		appEnv.startLogin();
	};
	
	//目前只是模拟下载
	/*__Page.stateLogin.test = function()
	{
		this.test1 = this.appEnv.form.setTimeout(1000, function(){
			this.process += 20;
			this.processTextTipItem._setText(this.process + "%");
			this.test();
		}, this);
		
	};*/
	
	__Page.stateLogin.leave = function(nextState)
	{
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showBottomRect();
		stateMain.showTopRect();
		
		this.appEnv.form.clearTimeout(this.test1);
		this.test1 = null;
		
		this.stateLoginLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};
	
	__Page.stateLogin.onKey = function(msg,key,way,extra)
	{
		var ret;
		ret = this.autoOnKey(msg,key,way,extra);
		if(ret)
		{
			return ret;
		}
		return 0;
	};
	__Page.stateLogin.onTouch = function(pen,msg,x,y,pass)
	{
		if(1 == msg && 1 == pass)
		{
			return 1;
		}
		return 0;
	};
	
	__Page.stateLogin.loading = function(data)
	{
		this.data = data;
		if(this.data.list)
		{
			this.clearNum = -1;
			this.appEnv.form.setFrameout(0, this.stepIn, this);
		}
		else
		{
			this.clearNum = 0;
		}
	};

	__Page.stateLogin.stepIn = function()
	{
		this.clearNum++;
		var percent;
		if(this.data.list)
		{
			if(this.data.list.length)
			{
				percent = this.clearNum * 100 / this.data.list.length;
			}
			else
			{
				percent = 100;
			}
		}
		else
		{
			percent = this.clearNum * 100 / this.data.steps;
		}
		//var percent2 = percent * (this.data.maxpercent - this.data.minpercent) / 100 + this.data.minpercent;
		this.processTextTipItem._setText(this.data.preTxt + Math.floor(percent) + "%");
		
		//有回调函数
		if(this.data.cb)
		{
			var args = [];
			var i;
			for(i = 0; i < arguments.length; i++)
			{
				args.push(arguments[i]);
			}
			
			//有文件
			if(this.data.list)
			{
				//清除的文件数小于文件的总数
				//那么将要清除的那个文件压入到数组的头部 
				if(this.clearNum < this.data.list.length)
				{
					args.unshift(this.data.list[this.clearNum]);
				}
			}
			else
			{
				args.unshift(this.clearNum== this.data.steps);
			}
			//执行回调函数 
			this.data.cb.apply(this.data.cbobj?this.data.cbobj:this, args);
		}
	};
}