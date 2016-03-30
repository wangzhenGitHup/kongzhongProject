if(!__Page.dlgScoreCompete)
{
	__Page.dlgScoreCompete=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgScoreCompete;
	__Page.dlgScoreCompete.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner, dt=this.dt, self=this;

		var boxX=16, boxY=8, boxW=326, boxH=136, iconSize=38;
		this.getTextLineCSS=function(css,txt,num,end)
		{
			var lineX=22, lineH=32, lineY=css.curY+lineH/2, lineW=boxW-lineX*2, textW=lineW-76;
			css.items.push({type:"text",pos:[lineX,lineY+3,0],text:txt,w:textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			css.items.push({type:"text",pos:[textW,lineY+3,0],text:num+"",w:lineW-textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			if(!end)
				css.items.push({type:"div3x3",pos:[lineX,lineY+lineH/2,0],w:lineW,css:imgLib.getImg("box_blue_line")});
			css.curY+=lineH;
		};
		this.nameBoxCSS={
			createCSS:function(vo)
			{
				var lvX=10, lvY=20, icon=imgLib.getIcon("level",64);
				icon.w=icon.h=iconSize;
				var nameX=lvX+iconSize+6, nameY=lvY, nameW=appEnv.getTextSize(vo.name,FS.FM).w, nameH=iconSize;
				var vipX=nameX+nameW+6, vipY=nameY, vipPic=imgLib.getImg("pic_VIP"+vo.vip), vipW=vipPic.w/2, vipH=vipPic.h/2;
				var css={id:"box-name",type:"div3x3",pos:[boxX,boxY,0],w:boxW,h:boxH,css:imgLib.getImg("box_achieve"),items:[
					{id:"lv",css:cssLib.iconText.createCSS([lvX,lvY,0],icon,appEnv.getLevelByExp(vo.exp),1,null,0,0)},
					{id:"name",css:cssLib.textFineMid.createCSS([nameX,nameY,0],vo.name,nameW,nameH,0,1,0,1)},
					{id:"vip",type:"icon",pos:[vipX,vipY,0],anchor_h:0,anchor_v:1,css:vipPic,w:vipW,h:vipH},
				]};
				css.curY=nameY+nameH/2-6;
				self.getTextLineCSS(css,textLib["CurScore"],vo.score,0);
				self.getTextLineCSS(css,textLib["CurRank"],vo.rank,0);
				self.getTextLineCSS(css,textLib["ContinueWin"],vo.winTimes,1);
				return css;
			},
		};

		boxX=boxX+boxW+8, boxW=494;
		this.scoreBoxCSS={
			createCSS:function(vo)
			{
				var scoreX=15, scoreY=6, scoreW=286, scoreH=42;
				//cssLib.boxAchBar.create(box,pos,cur,max,txtHide)
			}
		};
	};
	__Page.dlgScoreCompete.init=function(appEnv)
	{
		this.name="dlgScoreCompete";
		this.viewId="dlgScoreCompete";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
//		keyid=appEnv.hudKeys.getKey(this);
//		this.regKeyVO(keyid,this,this.onAchClk);
	};

	__Page.dlgScoreCompete.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.infoVO=vo;
		//根据VO初始化界面:
	//	if(vo)
		{
			appEnv.setDlgAniCall(function(){
				this.nameBox=this.cntBox.appendNewChild({css:this.nameBoxCSS.createCSS({name:"xxx",exp:999,vip:9,score:100,rank:23,winTimes:89})});
			},this);
		}
		this.dlgTitle._setText(textLib["TechCount"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgScoreCompete.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgScoreCompete.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
