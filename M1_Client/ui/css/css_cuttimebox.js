this.cssLib.boxCutTime=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,storage,resDef,color)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var storage, def;
		var box=imgLib.getImg("box_resbox");
		var bar, barBG=imgLib.getImg("box_resBar_bg");

		bar=imgLib.getImg("box_resBar_gold");

		var barLight=imgLib.getImg("box_resbox_lightMirror");
		var boxW=150;
		var boxH=box.h;
		var barW=boxW-box.mgW;
		var barH=bar.h;
		var resIcon=imgLib.getIcon(resDef.icon,64);
		resIcon.w=resIcon.h=60;
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"div3x3",id:"bar-bg",pos:[box.mgL,0,0],css:barBG,w:barW,h:barH,anchor_h:0,anchor_v:1},

						{type:"div3x3",id:"ValueBar",pos:[box.mgL,0,0],css:bar,w:0,h:barH,anchor_h:0,anchor_v:1},
						{type:"div3x3",id:"bar-light",pos:[box.mgL,0,0],css:barLight,w:boxW,h:boxH,anchor_h:0,anchor_v:1},
						{type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
						{id:"Text-Max",css:cssLib.textFineMid.createCSS([box.mgL,-15,0],textLib.CutTimeTitle,200,16,0,2,0,2),font_size:18},//最大数量
					]
				},
				{id:"Text-Cur",num:-1,css:cssLib.scoreFineMid.createCSS([0,0,0],"0",240,30,1,1,1,1)},//当前数量
			],
			barW:barW,barH:barH,
			page:page,appEnv:appEnv,storage:storage,res:resDef,
			update:this.update,viewId:"ResBar",
			aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,storage,resDef,color)
	{
		var css,bar;
		css=this.createCSS(pos,storage,resDef,color);
		bar=box.appendNewChild(css);
		bar.txtMax=bar.getItemById("Text-Max");
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.picRes=bar.getItemById("Pic-Res");
		bar.valBar=bar.getItemById("ValueBar");
		storage.addUIView(bar);
		bar.txtCur.setDigitNum(0);
		return bar;
	},
	update:function()
	{
		var textLib=this.appEnv.textLib;
		var maxCap,curCap,size;
		maxCap=Math.floor(this.storage.getTotalCap()/60);
		curCap=Math.floor(this.storage.getUsedCap()/60);

		this.txtCur.setScore(curCap);
		this.txtCur._setModifer(0,1);
		//this.txtCur._setPrefix(""+curCap);
		this.txtCur._setPostfix("/"+maxCap);
		if(maxCap>0)
		{
			size=Math.floor(curCap/maxCap*this.barW);
			this.valBar.startSzAni(size,this.barH-1,0,3);
			this.page.appEnv.addZoomScale(this.picRes,[1,1,1],[1.5,1.5,1],0.3);
		}
	}
};
