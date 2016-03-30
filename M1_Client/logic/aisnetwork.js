if(!window.aisNTEngine)
{
	window.aisNTEngine={
		page:__Page,
		king:null,
		comBuf:[],
		comCallBack:{},
		comCallObj:{},
		dwrURL:null,
		curDWR:null,
		isConnected:null,
		MAXTIMES:10,
		times:0
	};

	//初始化:
	window.aisNTEngine.init=function(king,url)
	{
		this.king=king;
		this.dwrURL=url;
		pxyCommand.init(king,king.citys[0]);
		this._init();
	};
	window.aisNTEngine.initBattleCom=function(stage,url)
	{
		this.stage=stage;
		this.dwrURL=url;
		pxyCommand.init(stage);
		this._init();
	};
	window.aisNTEngine._init = function()
	{
		this.curDWR=System.createDataChannel("M1"+this.dwrURL);
		this.curDWR.setEventHandler(this.dcEvent,this);
		this.curDWR.setCallback(this.dcCallbak,this);
		DBOut("---aisNTEngine connect url="+this.dwrURL);
		this.curDWR.connect(this.dwrURL);
	};

	//向服务器发送一条Com消息, 需要通过Proxy矫正:
	window.aisNTEngine.execCmd=function(comObj,comId,comVO,caller,time)
	{
		var i,comMsg,msgType;
		comMsg=pxyCommand.convert({comObj:comObj,com:comId,comVO:comVO,time:time});
		msgType=pxyCommand.getMsgType();
		if(!comMsg)return;
		this.comBuf.push(comMsg);

		if(comVO.callBack){
			this.comCallBack[msgType]=comVO.callBack;
			this.comCallObj[msgType]=comVO.callObj;
		}

		if(this.isConnected)
		{
			this.send();
		}
	};

	//向服务器发送一条虚拟Com消息, 需要通过Proxy矫正:
	window.aisNTEngine.execFakeCmd=function(comObj,comId,comVO,caller,time)
	{
		var i,comMsg,msgType;
		comMsg=pxyCommand.convert({comObj:comObj,com:comId,comVO:comVO,time:time});
		msgType=pxyCommand.getMsgType();
		if(!comMsg)return;
		this.comBuf.push(comMsg);

		if(comVO.callBack){
			this.comCallBack[msgType]=comVO.callBack;
			this.comCallObj[msgType]=comVO.callObj;
		}

		if(this.isConnected)
		{
			this.send();
		}
	};

	window.aisNTEngine.send = function()
	{
		for(var i=0;i<this.comBuf.length;i++)
		{
			DBOut("---aisNTEngine send="+this.comBuf[i]);
			if(this.isConnected)
			{
				this.curDWR.packStr(this.comBuf[i]);
				this.curDWR.send();
			}else{
				this.comBuf.splice(0,i+1);
				return;
			}
		}
		this.comBuf=[];
	};

	window.aisNTEngine.onFree = function(bClose)
	{
		if(this.curDWR)
		{
			if(bClose){
				DBOut("++++aisnetwork file socket colose++++");
				this.curDWR.close();
				this.curDWR=null;
			}else{
				this.curDWR.setEventHandler();
				this.curDWR.setCallback();
			}
				this.isConnected=0;
		}
	};
	window.aisNTEngine.dcReconnect = function()
	{
		this.curDWR.close();
		/*
		if(this.times<this.MAXTIMES)
		{
			this._init();
			this.times++;
		}else{
			*/
			if(this.page &&this.page.appEnv)
				this.page.appEnv.reStartGame(0);
			else
				Dialogs.alert("disconnect!");
		//}
	};
	window.aisNTEngine.dcEvent = function(status)
	{
		if (-1 == status)
		{
			this.isConnected=0;
			this.dcReconnect();
		}
		else if (1 == status)
		{
			this.isConnected=1;
			this.times=0;
			this.send();
		}
	};

	window.aisNTEngine.dcCallbak = function()
	{
		var dc=this.curDWR;
		var vo = (dc.readStr());//fromJSON
		DBOut("++++dcCallbak="+vo);
		vo=fromJSON(vo);
		if(vo.error==-1 || vo.error==3)
		{
			this.isConnected=0;
			if(this.page &&this.page.appEnv)
			{
				this.page.appEnv.reStartGame(vo.error);
				return;
			}else
				Dialogs.alert("disconnect!");
			//setTimeout(0,function(){
			//	this.dcReconnect();
			//},this);
		}
		if(this.comCallBack[vo.messageType])
		{
			this.comCallBack[vo.messageType].call(this.comCallObj[vo.messageType],vo.data,vo.error,vo.exInfo);
			this.comCallBack[vo.messageType]=null;
		}else{
			if(this.page && this.page.appEnv && this.page.appEnv.handleMessage)
			{
				this.page.appEnv.handleMessage(vo.messageType,vo.data,vo.error,vo.exInfo);
			}
		}
	};

}