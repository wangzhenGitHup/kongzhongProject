this.cssLib.boxAchBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,cur,max,txtHide)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var bar=imgLib.getImg("box_achieveBar");
		var barBG=imgLib.getImg("box_achieveBar_bg");
		var barLight=imgLib.getImg("box_resbox_light");
		var barW=286;
		var barH=bar.h;
		var css={
			type:"shape",id:"AchBar",pos:pos,w:barW,h:barH,anchor_h:0,anchor_v:1,border_a:0,face_a:0,
			items:[
				{type:"div3x3",id:"bar-bg",pos:[0,0,0],css:barBG,w:barW,h:barH,anchor_h:0,anchor_v:1},
				{type:"div3x3",id:"bar",pos:[0,0,0],css:bar,w:Math.floor(cur/max*barW),h:barH,anchor_h:0,anchor_v:1},
			//	{type:"div3x3",id:"bar-light",pos:[0,0,0],css:barLight,w:barW,h:boxH,anchor_h:0,anchor_v:1},
				{type:"text",id:"Text-Val",css:cssLib.textFineMid.createCSS([barW/2,0,0],cur+"/"+max,240,30,1,1,1,1),display:txtHide?0:1},//当前值
			],
			barW:barW,barH:barH,
			page:page,appEnv:appEnv,//achvmnts:aisGame.king.achvmnts,
			update:this.update,//viewId:"ExpBar",
		//	aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,cur,max,txtHide)
	{
		var css,bar;
		css=this.createCSS(pos,cur,max);
		bar=box.appendNewChild(css);
		bar.txtVal=bar.getItemById("Text-Val");
		bar.valBar=bar.getItemById("bar");
		bar.cur=cur;
		bar.max=max;
		bar.txtHide=txtHide;
		if(bar.cur)
			bar.update();
	//	aisGame.king.achvmnts.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var maxCap,curCap,size;
		maxCap=this.max;
		curCap=this.cur;
		if(!this.txtHide)
			this.txtVal._setText(curCap+"/"+maxCap);
		if(maxCap>0)
		{
			size=Math.floor(curCap/maxCap*this.barW);
			this.valBar.startSzAni(size,this.barH-1,0,3);
		}
	}
};
