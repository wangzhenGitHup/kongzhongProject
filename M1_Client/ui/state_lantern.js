if(!__Page.stateLantern)
{
	__Page.stateLantern={
		page:__Page,
		name:"stateLantern",
		timer:null,
		viewId:"stateLantern",
		curStatus:0,
		msgs:[],
		STATUS_WORLD:1,
		STATUS_CLAN:2
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateLantern);

	//初始化State
	__Page.stateLantern.init=function(appEnv)
	{
		this.inited=1;
		this.appEnv=appEnv;
		appEnv.stateLantern=this;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		page.keyStateUtil.call(this);

		var keyid=0;

		var layer=this.appEnv.layer;
		var sw=appEnv.scrSize[0], sh=appEnv.scrSize[1];
		var stateHome=this.page.stateHome;
		this.hudBaseBox=stateHome.hudBaseBox;

		//创建State专署UI控件:
		{

			var img=imgLib.getImg("box_lantern");
			var dt=4, hudH=this.lanternH=img.h, hudX=appEnv.scrSize[0]/2, hudY=hudH/2+dt, hudW=appEnv.scrSize[0];
			this.hudLantern=this.hudBaseBox.appendNewChild({type:"icon",id:"lantern",pos:[hudX,hudY,0],w:hudW,h:hudH,anchor_h:1,anchor_v:1,css:img,ui_event:1,clip:1,display:0,//face_r:0,face_a:160,
				fade:1,fade_size:1,fade_alpha:0,fade_pos:[hudX,hudY,0],state:this,store:[],//viewId:"Lantern",aisUpdateView:this.showLantern,
				items:[{type:"shape",id:"box",w:hudW,h:hudH,anchor_h:1,anchor_v:1,clip:1,face_r:0,face_a:0}]//w:hudW-260
			});
			this.moveHuds=[stateHome.hudTLBox,stateHome.hudTCBox,stateHome.hudTRBox];
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onLantern);
			this.hudBaseBox.appendNewChild({type:"key",pos:[hudX,hudY+100,0],anchor_h:1,anchor_v:1,w:hudW,h:hudH,ui_event:1,key:keyid,css:imgLib.getImg("box_dlginner"),display:0});
		}
	//	this.msgObj.addUIView(this);
		this.liveTxt=0;
	};

	__Page.stateLantern.enter=function(preState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		DBOut("stateLantern: Enter");

	};

	__Page.stateLantern.leave=function(nextState)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		if(this.timer)
			appEnv.layer.clearTimeout(this.timer);
	};

	__Page.stateLantern.onLantern=function(msg,key,way,extra)
	{
		if(1==msg && 1==way)
		{
		//	this.hudLantern.aisUpdateView();
		//	this.showLantern();
			this.appEnv.addPMD("asdfasdfasdfasdfasdfsadfasdf");
		}
	};

	__Page.stateLantern.showLantern=function()
	{
		if(this.curMsg)
		{
			DBOut(" wait ****** ");
			return;
		}
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		//fade和startAniEx都可以实时得到真实坐标
		var upSpd=appEnv.layer.getTPF();

		var msg, i, text="", list;
		if(appEnv.getPMD)
		{
			msg=appEnv.getPMD();
		}
		
		if(!this.msgCnt)this.msgCnt=0;
		this.msgCnt++;
//		if(this.msgCnt<2)
//		//	msg=toJSON({r:200,g:50,b:50})+"$"+"sdfasdfasdfasdfasdfasdf - "+this.msgCnt;
//			msg=toJSON({r:255,g:255,b:255})+"$玩家$"+toJSON({r:200,g:50,b:50})+"$xxx$"+toJSON({r:255,g:255,b:255})+"$在多人模式中夺取了某位玩家$"+
//				toJSON({r:200,g:50,b:50})+"$888$"+toJSON({r:255,g:255,b:255})+"$金矿和$"+toJSON({r:200,g:50,b:50})+"$999$"+toJSON({r:255,g:255,b:255})+"$能源，恭喜他。";
	//	DBOut("msg = "+msg);
		
		this.curMsg=msg;
		if(!msg)
		{
			DBOut("no msg");
			return;
		}
		list=msg.split("$");
		if(list.length>1)
		{
			for(i=0; i<list.length; i+=2)
				text+=list[i+1];
		}
		else
		{
			text=msg;
		}
	//	DBOut("text = "+text);

		var hud=this.hudLantern;
		var box=hud.getItemById("box");
		var store=hud.store;
		var moves=this.moveHuds;
		var hudPos=[], txtPos, txtFadePos, txt, txtSize, css;
		var spd=2, dist, time;
		if(!hud.getDisplay())
		{
		//	hud.fadeIn(10,0);
			hud.setDisplay(1);
			for(i in moves)
			{
				moves[i].getPos(hudPos);
				hudPos=[hudPos[0],hudPos[1]+this.lanternH,hudPos[2]];
				moves[i].startAniEx(hudPos,1,1,0,3);
			}
			var self=this;
			moves[moves.length-1].onAniDone=function()
			{
				
			}
		}

		txtPos=[box.getW()/2+50,0,0];
		txtSize=appEnv.getTextSize(text,24);
		txtFadePos=[-box.getW()/2-txtSize.w-10,0,0];
		txt=box.appendNewChild({css:cssLib.textFineMid.createCSS(txtPos,text,txtSize.w,txtSize.h,0,1,0,1),fade:1,fade_pos:txtFadePos,fade_size:1,fade_alpha:1,state:this});

		msg=this.analyzingColor(msg);
		txt.setTextEx(this.getColorTextCSS(msg));

	//	txt.fadeOut(300,0);
		dist=txtPos[0]-txtFadePos[0];
		time=Math.ceil(dist/spd);
		txt.startAniEx(txtFadePos,1,1,time,0);
		this.liveTxt++;
		txt.onAniDone=function(){
			setTimeout(0,function(){
				this.getFather().removeChild(this);
			},this);
			this.state.liveTxt--;
			DBOut("************ 结束 "+this.state.liveTxt);
			if(!this.state.liveTxt)
				this.state.closeLantern();
		};

/**
		dist=txtPos[0]-(box.getW()/2-txtSize.w)+200;
	//	time=Math.ceil(dist/spd);
	//	this.timer=appEnv.layer.setTimeout(time*upSpd,function(){
		time=Math.ceil(dist/spd*1.6);
		this.timer=appEnv.layer.setFrameout(time,function(){
			this.curMsg=null;
			this.timer=null;
			this.showLantern();
		},this);
/**/

		var txt1, txtPos1, txtFadePos1, dist1;
		txtPos1=[txtPos[0],50,0];
		txtFadePos1=[-txtSize.w+50,50,0];
		txt1=box.appendNewChild({css:cssLib.textFineMid.createCSS(txtPos1,"",txtSize.w,txtSize.h,0,1,0,1),fade:1,fade_pos:txtFadePos1,fade_size:1,fade_alpha:1,state:this});
		dist1=txtPos1[0]-txtFadePos1[0];
		time=Math.ceil(dist1/spd);
		txt1.startAniEx(txtFadePos1,1,1,time,0);
		txt1.onAniDone=function(){
			setTimeout(0,function(){
				this.getFather().removeChild(this);
			},this);
			DBOut("show next");
			this.state.curMsg=null;
			this.state.timer=null;
			this.state.showLantern();
		}
	};

	__Page.stateLantern.closeLantern=function()
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var hud=this.hudLantern;
		var box=hud.getItemById("box");
		var store=hud.store;
		var moves=this.moveHuds;
		var hudPos=[], msg, i;

		if(this.timer)
			appEnv.layer.clearTimeout(this.timer);
		if(appEnv.getPMD)
		{
			msg=appEnv.getPMD();
		}
		if(!msg)//!store || !store.length
		{
		//	hud.fadeOut(10,0);
			hud.setDisplay(0);
			for(i in moves)
			{
				moves[i].getPos(hudPos);
				hudPos=[hudPos[0],hudPos[1]-this.lanternH,hudPos[2]];
				moves[i].startAniEx(hudPos,1,1,0,3);
			}
			var self=this;
			moves[moves.length-1].onAniDone=function()
			{
				self.msgCnt=0;
				self.showLantern();
			}
		}
	};

	__Page.stateLantern.analyzingColor=function(msg)
	{
		if(!msg)return [];
		return msg.split("$");
	};

	__Page.stateLantern.getColorTextCSS=function(msg)
	{
		if(!msg || !msg.length)return [];
		if(msg.length==1)return [{text:msg[0],r:255,g:255,b:255}];
		var i,color,vo=[];
		for(i=0;i<msg.length;i+=2)
		{
			if(!msg[i+1])break;
			vo.push({text:msg[i+1],css:fromJSON(msg[i])});
		}
		return vo;
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateLantern.onKey=function(msg,key,way,extra)
		{
			var ret, css;
			var page=this.page;
			var appEnv=this.appEnv;
			var imgLib=page.imgLib;
			if(1==msg && 1==way)
			{
			//	DBOut("stateLantern.onKey: "+msg+", "+key);
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
		};
	}
}
