this.cssLib.boxBtMedal=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,title)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var def;
		var box=imgLib.getImg("box_resbox");
		var boxW=150;
		var boxH=box.h;
		var resIcon=imgLib.getIcon("medal",64);
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:0,anchor_v:1,border_a:0,face_a:0,
			items:[
				{type:"icon",id:"Pic-Res",pos:[0,0,0],w:64,h:64,css:resIcon,anchor_h:1,anchor_v:1},//资源图标
				{type:"text",id:"Title",css:cssLib.textFineSmall.createCSS([64,-5,0],title?title:"",200,16,1,2,1,2)},//提示
				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([64,5,0],"",200,30,1,0,1,0)},//当前数量
			],
			page:page,appEnv:appEnv,setHonor:this.setHonor
		};
		return css;
	},
	create:function(box,pos,title)
	{
		var css,bar;
		css=this.createCSS(pos,title);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		return bar;
	},
	setHonor:function(honor)
	{
		this.txtCur._setText(honor+"");
	}
};
