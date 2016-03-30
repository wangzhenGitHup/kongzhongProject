this.cssLib.menuBox=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(box,closeKey,pos,menuInfo,menuW,menuH)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;

		menuW=menuW?menuW:118, menuH=menuH?menuH:50;
		var dtX=13, dtY=20, dtItem=8;
		var i, cnt=menuInfo.length;
		var menuBoxW=dtX*2+menuW, menuBoxH=dtY*2+menuH*cnt+dtItem*(cnt-1);
		var pic=imgLib.getImg("pic_menu_arrow"), arrowScale=0.9, arrowW=Math.floor(pic.w*arrowScale), arrowH=Math.floor(pic.h*arrowScale);
		var menuBoxX=pos[0]+arrowW, menuBoxY=pos[1]-menuBoxH/2;
		var arrowX=menuBoxX+3.5, arrowY=pos[1];

		var items=[
			{id:"blocker",type:"icon",pos:[0,0,0],w:menuBoxW,h:menuBoxH,ui_event:1,block_touch:1},
		];
		var x=dtX+menuW/2, y=0, mvo;
		for(i=0; i<cnt; i++)
		{
			y=dtY+menuH/2+(dtItem+menuH)*i;
			mvo=menuInfo[i];
			items.push({id:mvo.id?mvo.id:mvo.text,
				css:cssLib.normalBtn.createCSS([x,y,0],mvo.key,0,textLib[mvo.text],menuW,menuH,0,{uv3x3:[25/1024,20/1024,22/1024,24/1024],size3x3:[18,15,18,15]})
			});
		}

		var by=0, ey=box.getH();
		if(menuBoxY<by)menuBoxY+=(by-menuBoxY);
		else if(menuBoxY+menuBoxH>ey)menuBoxY-=(menuBoxY+menuBoxH-ey);
		if(arrowY+arrowH/2>ey)arrowY-=(arrowY+arrowH/2-ey);
		if(menuBoxY+menuBoxH<arrowY+menuH/2+6)menuBoxY+=(arrowY+menuH/2+6-(menuBoxY+menuBoxH));
		var css={id:"close-menu",type:"key",pos:[0,0,0],w:box.getW(),h:box.getH(),ui_event:1,key:closeKey,state_up:{w:box.getW(),h:box.getH()},items:[
			{id:"menuBox",type:"div3x3",pos:[menuBoxX,menuBoxY,0],w:menuBoxW,h:menuBoxH,ui_event:1,css:imgLib.getImg("box_menu"),size3x3:[15,15,15,18],items:items,},
			{id:"arrow",type:"icon",pos:[arrowX,arrowY,0],w:arrowW,h:arrowH,css:pic,anchor_h:2,anchor_v:1}
		]};
		return css;
	},
	create:function(box,closeKey,pos,menuInfo,menuW,menuH)//menuInfo:[{key:0, text:"", id:""}]
	{
		var css,bar;
		css=this.createCSS(box,closeKey,pos,menuInfo,menuW,menuH);
		bar=box.appendNewChild(css);
		return bar;
	},
	setMenuShow:function()
	{
	},
	setMenuEnable:function()
	{
	},
	update:function()
	{
	}
};
