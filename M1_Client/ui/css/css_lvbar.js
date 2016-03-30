this.cssLib.boxLvBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,color)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var box=imgLib.getImg("box_resbox");
		var boxW=240;
		var resIcon=imgLib.getIcon("level",64);
		var css={
			type:"shape",id:"LvBar",pos:pos,w:boxW,h:40,anchor_h:0,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"icon",id:"Pic-Res",pos:[0,0,0],w:64,h:64,css:resIcon,anchor_h:1,anchor_v:1,
					items:[
						{type:"text",id:"Text-Lv",css:cssLib.textFineSmall.createCSS([0,0,0],"36",64,64,1,1,1,1)}
					]
				},
				{type:"text",id:"Text-User",css:cssLib.textFineMid.createCSS([32,0,0],"balabala",200,16,0,1,0,1)},//玩家昵称
			],setLvName:this.setLvName
		};
		return css;
	},
	create:function(box,pos,color)
	{
		var css,bar;
		css=this.createCSS(pos,color);
		bar=box.appendNewChild(css);
		bar.lvTxt=bar.getItemById("Text-Lv");
		bar.nameTxt=bar.getItemById("Text-User");
		return bar;
	},
	setLvName:function(lv,name)
	{
		this.lvTxt._setText(lv);
		this.nameTxt._setText(name);
	}
};
