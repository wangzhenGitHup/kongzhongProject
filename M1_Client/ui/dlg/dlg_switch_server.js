if(!__Page.dlgServerList)
{
	__Page.dlgServerList=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgServerList;
	__Page.dlgServerList.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		
		var listX=this.dt*2;
		var listY=this.dt*4;
		var listW=this.contentW-this.dt*4;
		var listH=this.contentH-listY-80;
		var itemW=listW;
		var itemH=80;
		this.lbxServersCSS={type:"listbox",id:"lbx-servers",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var lineW=itemW;
		var lineH=70;
		var nameX=20;
		var nameY=0;
		var nameW=Math.floor(lineW/3);
		var userX=nameX+nameW;
		this.serverLineCSS={
			w:lineW,h:lineH,
			createCSS:function(vo)//diamond
			{
				var name,user,status,isSelf;
				name=vo.name;
				user=vo.user;
				isSelf=vo.isSelf;
				status=vo.status;
				var bgCSS=isSelf?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"text",id:"server-name",css:cssLib.textFineMid.createCSS([nameX,0,0],name,nameW,lineH,0,0,0,1)},
					{type:"text",id:"user-name",css:cssLib.textFineMid.createCSS([userX,0,0],user?user:textLib["None"],nameW,lineH,0,0,0,1)},
					{type:"text",id:"status",css:cssLib.textFineMid.createCSS([lineW-200,0,0],status,200,lineH,0,0,1,1)},
					///////////////测试用
					{id:"view",css:cssLib.normalBtn.createCSS([lineW-100,lineH/2,0],0,0,textLib["Switch"],96,42),display:0},
				]};
			}
		};
	};
	__Page.dlgServerList.init=function(appEnv)
	{
		this.name="dlgServerList";
		this.viewId="dlgServerList";
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};
	__Page.dlgServerList.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
		this.dlgTitle._setText(textLib["SwitchServer"]);
		//底部提示框
		this.tipBox=this.cntBox.appendNewChild({
			type:"icon",id:"tipBox",pos:[8,this.contentH-80+10,0],css:imgLib.box_green,w:this.contentW-16,h:70-8,ui_event:1,
		});
		//对话框提示:
		this.dlgTip=cssLib.textFineMid.create(this.tipBox,[0,0,0],textLib["SwitchServerTip"],this.tipBox.getW(),70,0,0,1,1);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onServersClk);
		this.lbxServers=this.cntBox.appendNewChild({css:this.lbxServersCSS,key:keyid});
		this.txtLoading=this.cntBox.appendNewChild({css:cssLib.textFineBig.createCSS([this.lbxServersCSS.w/2,this.lbxServersCSS.h/2,0],textLib["IsLoading"],200,30,1,1,1,1,[192,192,192,255]),display:0,flash:2});
		// this.txtLoading.setDisplay(1);
		setTimeout(0,function(){this.getServerVO();},this);
		// this.getServerVO();
	};
	__Page.dlgServerList.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		appEnv.clearDlgAniCall();
	};
	__Page.dlgServerList.getServerVO=function()
	{
		// this.txtLoading.setDisplay(0);
		var servers = this.appEnv.page.getCookie("Runtime","Servers");
		if(servers)
			servers = fromJSON(servers);
		var userServers = this.appEnv.page.getCookie("Runtime","UserServers");
		if(userServers)
			userServers = fromJSON(userServers);
		DBOut("servers+++"+toJSON(servers))
		DBOut("userServers+++"+toJSON(userServers))
		var i,n,svr,usvr;
		n=servers.length;
		for(var i=0;i<n;i++)
		{
			svr=servers[i];
			if(svr.id==this.appEnv.getServerID())
				svr.isSelf=1;
			for(var j=0;j<userServers.length;j++)
			{
				usvr=userServers[j];
				if(usvr.serverId==svr.id && usvr.userName)
					svr.user=usvr.userName;
			}
		}
		this.servers=servers;
		this.userServers=userServers;
		this.addServers(this.lbxServers,this.servers);
	};
	__Page.dlgServerList.addServers=function(lbx,vo)
	{
		lbx.clearItems();
		lbx.setDisplay(1);
		// this.txtLoading.setDisplay(0);
		if(vo)
		{
			var i,item,keyid;
			var textLib=this.appEnv.textLib;
			if(!this.viewKeys)
				this.viewKeys={};
			for(i=0; i<vo.length; i++)
			{
				item=this.serverLineCSS.createCSS(vo[i]);
				var idx=lbx.addItem(item);
				if(vo[i].status==0)//服务器正常
				{
					if(vo[i].isSelf)
					{
						lbx.itemAt(idx).getItemById("status")._setText(textLib["CurServer"]);
					}
					else
					{
					keyid=this.appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onViewClk);
					this.viewKeys[keyid+""]={id:vo[i].id,lbx:lbx,idx:i};
					lbx.itemAt(idx).getItemById("view").setKey(keyid);
					lbx.itemAt(idx).getItemById("view").setDisplay(1);
					}
				}else//维护中
				{
					lbx.itemAt(idx).getItemById("status")._setText(textLib["ServerDown"]);
					lbx.itemAt(idx).getItemById("status")._setColor(255,0,0,255);
				}
			}
		}
	};
	__Page.dlgServerList.initUI=function()
	{
		var appEnv=this.appEnv;
		var textLib=this.appEnv.textLib;
		
	};
	__Page.dlgServerList.aisUpdateView=function()
	{

	};
	__Page.dlgServerList.changeServer=function(vo)
	{
		DBOut("changeServer result "+toJSON(vo))
		this.appEnv.sureReloadGame();
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgServerList.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		__Page.dlgServerList.onViewClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onViewClk");
				var keyVO=this.viewKeys[key];
				var idx=keyVO.idx;
				var svr=this.servers[idx];
				// this.txtLoading.setDisplay(1);
				this.appEnv.newMsg(["UserBean","changeServer",window.USERID,svr.id],{cb:function(svrVO){
					this.changeServer(svrVO);
					},cbobj:this},window.UserDWRUrl);
			}
		};
	}
}
