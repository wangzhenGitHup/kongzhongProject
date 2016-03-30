this.cssLib.boxWorkers=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,city,keyid)
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
		var resIcon=imgLib.getIcon("worker",64);
		resIcon.w=resIcon.h=60;
		var btnSize=40,bcSize=btnSize+24;
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,ui_event:1,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
					]
				},
				{type:"text",id:"Title",css:cssLib.textFineMid.createCSS([0,-15,0],textLib["_Builder"],200,16,1,2,1,2),font_size:18},//提示
				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([0,0,0],"1/1",240,30,1,1,1,1)},//当前数量
				{type:"key",id:"btn",pos:[boxW/2+btnSize/2-15,0],anchor_h:1,anchor_v:1,w:bcSize,h:bcSize,ui_event:1,button:1,key:keyid,down_scale:0.9,audio:page.audioObject.genFileURL("btn_click"),
					state_up:{w:bcSize,h:bcSize,},state_down:{w:bcSize,h:bcSize},display:keyid?1:0,items:[
					{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_add"),w:btnSize,h:btnSize}
				]},
			],
			page:page,appEnv:appEnv,city:city,
			update:this.update,viewId:"UIBar",
			aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,city,keyid)
	{
		var css,bar;
		css=this.createCSS(pos,city,keyid);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.picRes=bar.getItemById("Pic-Res");
		city.bldWorkerHub.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var maxCap,curCap,size;
		DBOut("Worker Bar Update!!");
		maxCap=this.city.bldWorkers.length;
		curCap=this.city.freeBldWorkerNum;
		this.txtCur._setText(""+curCap+"/"+maxCap);
	}
};
