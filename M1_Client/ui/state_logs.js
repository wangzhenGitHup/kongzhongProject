if(!__Page.stateLogs)
{
	__Page.stateLogs={
		page:__Page,
		name:"LogsState",
		logMsgs:[],
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateLogs);

	//初始化State
	__Page.stateLogs.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateLogs=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		this.fadeTimer=null;
		//创建State专署UI控件:
		{
			layer=this.layer=this.appEnv.pmtLayer;
			this.hudLogBox=layer.addHudItem({
				type:"shape",id:"logBox",pos:[appEnv.scrSize[0]/2,80+40,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0
			});
		}
		DBOut("stateLogs.init: "+appEnv);
	};

	__Page.stateLogs.enter=function(preState)
	{
	};

	__Page.stateLogs.leave=function(nextState)
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
		__Page.stateLogs.showLog=function(msg,color)
		{
			var i,n,list,log,pos,css,idx;
			var cssLib;

			cssLib=this.page.cssLib;
			pos=[0,0,0];
			list=this.logMsgs;
			n=list.length;
			for(i=0;i<n;i++)
			{
				log=list[i];
				idx=n-i;
			//	DBOut("Log in list: "+log);
				if(idx<3)
				{
				//	log.getPos(pos);
				//	pos[1]+=30;
					pos[1]=30*(n-i);
					log.startAniEx(pos,1,(8-idx)/8,0,3);
				}
				else
				{
					log.fadeOut(10,0);
					list.splice(i,1);
					i--;n--;
				}
			}

			css=cssLib.textMid.createCSS([0,0,0],msg,100,30,1,1,1,1,color?color:[255,0,0]);
			log=this.hudLogBox.appendNewChild({
				type:"text",css:css,font_size:30,display:1,fade:1,fade_pos:[0,200,0],fade_size:1,fade_alpha:0,edge:1,edge_a:255,//,this.appEnv.scrSize[1]-200
				logBox:this,
				onFadeDone:this.onLogFade,
			});
			list.push(log);
			if(this.fadeTimer)
			{
				this.layer.clearTimeout(this.fadeTimer);
				this.fadeTimer=null;
			}
			else
			{
				//this.hudLogBox.setDisplay(1);
			}
			this.fadeTimer=this.layer.setTimeout((10-list.length)*500,this.onFadeTimer,this);
		};

		__Page.stateLogs.clearLogs=function()
		{
			//TODO: Code this:
		};

		__Page.stateLogs.onFadeTimer=function()
		{
			var log,n;
			this.fadeTimer=null;
			DBOut("LOGS: onFadeTimer");
			log=this.logMsgs.shift();
			if(log)
			{
				log.fadeOut(10,0);
			}
			n=this.logMsgs.length;
			if(n)
			{
				this.fadeTimer=this.layer.setTimeout((10-n)*500,this.onFadeTimer,this);
			}
			else
			{
				//this.hudLogBox.setDisplay(0);
			}
		};

		__Page.stateLogs.onLogFade=function()
		{
			var self;
			self=this.logBox;
			self.layer.setFrameout(0,self.delLog,this);
		};

		__Page.stateLogs.delLog=function()
		{
			this.getFather().removeChild(this);
		};

		__Page.stateLogs.clearLogs=function()
		{
			for(var i=0; i<this.logMsgs.length; i++)
			{
				this.logMsgs[i].onFadeDone();
			}
			if(this.fadeTimer)
			{
				this.layer.clearTimeout(this.fadeTimer);
				this.fadeTimer=null;
			}
		};
	}
}
