this.cssLib.boxExpBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,color,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var box=imgLib.getImg("box_resbox");
		var bar, barBG=imgLib.getImg("box_resBar_bg");
		bar=imgLib.getImg("box_resBar_exp");
		var barLight=imgLib.getImg("box_resbox_light");
		var boxW=240;
		var boxH=box.h;
		var barW=boxW-box.mgW;
		var barH=bar.h;
		var resIcon=imgLib.getIcon("level",64);
		resIcon.w=resIcon.h=60;
		var btnSize=40,bcSize=btnSize+24;
		var css={
			type:"shape",id:"ExpBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,ui_event:1,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"div3x3",id:"bar-bg",pos:[box.mgL,0,0],css:barBG,w:barW,h:barH,anchor_h:0,anchor_v:1},
//						{type:"shape",id:"ValueBar",pos:[box.mgL,0,0],w:barW,h:barH,anchor_h:0,anchor_v:1,
//							border_a:0,face_r:color[0],face_g:color[1],face_b:color[2],face_a:255},
						{type:"div3x3",id:"ValueBar",pos:[box.mgL,0,0],css:bar,w:0,h:barH,anchor_h:0,anchor_v:1},
						{type:"div3x3",id:"bar-light",pos:[0,0,0],css:barLight,w:boxW,h:boxH,anchor_h:0,anchor_v:1},
						{
							type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],css:resIcon,anchor_h:1,anchor_v:1,
							items:[
								{type:"text",id:"Text-Lv",num:-1,css:cssLib.textFineMid.createCSS([0,0,0],"36",64,64,1,1,1,1)}
							]
						},//资源图标
					]
				},
				{id:"Text-User",css:cssLib.textFineMid.createCSS([-80,-15,0],aisGame.king.name?aisGame.king.name:"???",200,16,0,2,0,2),font_size:18},//玩家昵称
				{id:"Text-Cur",css:cssLib.textScoreMid.createCSS([0,0,0],"3000",240,30,1,1,1,1)},//当前值
				{type:"key",id:"btn",pos:[boxW/2+btnSize/2-15,0],anchor_h:1,anchor_v:1,w:bcSize,h:bcSize,ui_event:1,button:1,key:keyid,down_scale:0.9,audio:page.audioObject.genFileURL("btn_click"),
					state_up:{w:bcSize,h:bcSize,},state_down:{w:bcSize,h:bcSize},display:keyid?1:0,items:[
					{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_info"),w:btnSize,h:btnSize}
				]},
			],
			barW:barW,barH:barH,
			page:page,appEnv:appEnv,achvmnts:aisGame.king.achvmnts,
			update:this.update,viewId:"ExpBar",
			aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,color,keyid)
	{
		var css,bar;
		css=this.createCSS(pos,color,keyid);
		bar=box.appendNewChild(css);
		bar.txtMax=bar.getItemById("Text-Max");
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.txtLev=bar.getItemById("Text-Lv");
		bar.picRes=bar.getItemById("Pic-Res");
		bar.valBar=bar.getItemById("ValueBar");
		aisGame.king.achvmnts.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var maxCap,curCap,size;
		DBOut("Update Exp: cur="+this.achvmnts.exp+", tgt="+this.achvmnts.tgtExp+", init="+this.achvmnts.initExp);
		var tgtExp=this.achvmnts.tgtExp;
		var curExp=this.achvmnts.exp;
		var initExp=this.achvmnts.initExp;
	//	curExp=tgtExp?curExp:initExp;
		tgtExp=tgtExp?tgtExp:this.achvmnts.exp;
		DBOut("Update Exp: cur="+curExp+", tgt="+tgtExp+", init="+initExp);

		maxCap=tgtExp-initExp;
		curCap=curExp-initExp;
		curCap=curCap<maxCap?curCap:maxCap;
		DBOut("Update Exp: curCap="+curCap+", maxCap="+maxCap);

//		this.txtCur._setText(""+curCap);
		this.txtCur._setScore(curCap);
	//	this.txtCur._setText(""+curExp);
		this.txtLev._setText(""+this.achvmnts.expLevel);
		if(this.txtLev.num>=0 && this.achvmnts.expLevel>this.txtLev.num)
			this.page.audioObject.playSound("exp_levelup");
		this.txtLev.num=this.achvmnts.expLevel;
		if(maxCap>0)
		{
			size=Math.floor(curCap/maxCap*this.barW);
			this.valBar.startSzAni(size,this.barH-1,0,3);
		}
		this.page.appEnv.addZoomScale(this.picRes,[1,1,1],[1.5,1.5,1],0.3);
	}
};
