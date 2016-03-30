this.cssLib.boxResBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,storage,resDef,color)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var storage, def;
		var box=imgLib.getImg("box_resboxMirror");
		var bar, barBG=imgLib.getImg("box_resBar_bg");
		if("ResGold"==resDef.codeName){
			bar=imgLib.getImg("box_resBar_gold");
		}else if("ResOil"==resDef.codeName){
			bar=imgLib.getImg("box_resBar_gas");
		}else if("ResCube"==resDef.codeName){
			bar=imgLib.getImg("box_resBar_gas");
		}
		var barLight=imgLib.getImg("box_resbox_lightMirror");
		var boxW=240;
		var boxH=box.h;
		var barW=boxW-box.mgW;
		var barH=bar.h;
		var resIcon=imgLib.getIcon(resDef.icon,64);
		resIcon.w=resIcon.h=60;
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"icon",id:"BarBox",pos:[boxW/2,0,0],w:boxW,h:boxH,css:cssLib.resBox,anchor_h:2,anchor_v:1,
					items:[
						{type:"div3x3",id:"bar-bg",pos:[-box.mgR,0,0],css:barBG,w:barW,h:barH,anchor_h:2,anchor_v:1},
//						{type:"shape",id:"ValueBar",pos:[-box.mgR,0,0],w:barW,h:barH,anchor_h:2,anchor_v:1,
//							border_a:0,face_r:color[0],face_g:color[1],face_b:color[2],face_a:255},
						{type:"div3x3",id:"ValueBar",pos:[-box.mgR,0,0],css:bar,w:0,h:barH,anchor_h:2,anchor_v:1},
						{type:"div3x3",id:"bar-light",pos:[0,0,0],css:barLight,w:boxW,h:boxH,anchor_h:2,anchor_v:1},
						{type:"icon",id:"Pic-Res",pos:[-box.mgR/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
					]
				},
				{id:"Text-Max",css:cssLib.textFineMid.createCSS([-120,-15,0],"Max:10000",200,16,0,2,0,2),font_size:18},//最大数量
				{id:"Text-Cur",num:-1,css:cssLib.textScoreMid.createCSS([0,0,0],"3000",240,30,1,1,1,1)},//当前数量
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
		return bar;
	},
	update:function()
	{
		var textLib=this.appEnv.textLib;
		var maxCap,curCap,size;
		maxCap=this.storage.getTotalCap();
		curCap=this.storage.getUsedCap();
		this.txtMax._setText(textLib["_Max"]+" "+maxCap);
//		this.txtCur._setText(""+curCap);
		this.txtCur._setScore(curCap);
		if(maxCap>0)
		{
			size=Math.floor(curCap/maxCap*this.barW);
			this.valBar.startSzAni(size,this.barH-1,0,3);
			this.page.appEnv.addZoomScale(this.picRes,[1,1,1],[1.5,1.5,1],0.3);
		}
	}
};
