this.cssLib.boxMedal=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,city)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var def;
		var box=imgLib.getImg("box_resbox");
		var boxW=150;
		var boxH=box.h;
		var resIcon=imgLib.getIcon("medal",64);
		resIcon.w=resIcon.h=60;
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,ui_event:1,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
					]
				},
				{type:"text",id:"Title",css:cssLib.textFineMid.createCSS([-5,-15,0],textLib.MedalTitle,200,16,1,2,1,2),font_size:18},//提示
				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([0,0,0],"453",240,30,1,1,1,1)},//当前数量
			],
			page:page,appEnv:appEnv,city:city,
			update:this.update,viewId:"UIMedalBar",
			aisUpdateView:this.update,updateMeth:this.updateMeth,
		};

		return css;
	},
	create:function(box,pos,city)
	{
		var css,bar;
		css=this.createCSS(pos,city);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.picRes=bar.getItemById("Pic-Res");
		city.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var maxCap,curCap,size;
		DBOut("boxMedal Bar Update!!==="+this.city.honor);
//		maxCap=this.city.bldWorkers.length;
//		curCap=this.city.freeBldWorkerNum;
		this.txtCur._setText(""+this.city.honor);
	},
	updateMeth:function()
	{
		if(!this.getItemById("atk") && this.appEnv.bMech2Attack()==0)
		{
			var appEnv=this.appEnv;
			var url=this.page.genPageURL(window.imgPath+"/icon/icon_noATK64_32.png");
			var box=this.page.imgLib.getImg("box_resbox");
			var img_css={pos:[box.mgL+20,0,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64};
			this.appendNewChild({
				type:"key",id:"atk","pos":[0,0,0],key:appEnv.appKeys.btnMechNo2Atk,ui_event:1,button:1,down_scale:0.95,fliter:1,
				pos:[box.mgL+20,0,0],tex:url,tex_w:1,tex_h:1,tex_u:0,tex_v:0,w:64,h:64,"anchor_h":1,"anchor_v":1,flash:2,
				state_up:{"css":img_css},audio:this.page.audioObject.genFileURL("btn_click"),
				state_down:{"css":img_css,w:img_css.w,h:img_css.h},
			});
		}
	}
};
