this.cssLib.tokenGem=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,city,resIcon,resNum,keyid,viewId)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var def, viewId;
		var box=imgLib.getImg("box_resboxMirror");
		var boxW=150;
		var boxH=box.h;
		if(city)
		{
			viewId="UITokenBar";
			if(resIcon)
				viewId+=("-"+resIcon);
		}else
			viewId="";
		DBOut("*********** tokenbox viewId="+viewId);
		if(!resIcon)
			resIcon=imgLib.getIcon("res_chip",64);
		else
			resIcon=imgLib.getIcon("res_"+resIcon,64);
		resIcon.w=resIcon.h=60;
		var btnSize=40,bcSize=btnSize+24;
		//DBOut("========== "+keyid+" "+(keyid?1:0));
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,ui_event:1,
			items:[
				{
					type:"icon",id:"BarBox",pos:[boxW/2,0,0],w:boxW,h:boxH,css:cssLib.resBox,anchor_h:2,anchor_v:1,
					items:[
						{type:"icon",id:"Pic-Res",pos:[-box.mgR/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
					]
				},
			//	{type:"text",id:"Title",css:cssLib.textFineSmall.createCSS([0,-15,0],"Builder:",200,16,1,2,1,2)},//提示
				{type:"key",id:"btn",pos:[-boxW/2-btnSize/2+15,0],anchor_h:1,anchor_v:1,w:bcSize,h:bcSize,ui_event:1,button:1,key:keyid,down_scale:0.9,audio:page.audioObject.genFileURL("btn_click"),
					state_up:{w:bcSize,h:bcSize,},state_down:{w:bcSize,h:bcSize},display:keyid?1:0,items:[
					{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_add"),w:btnSize,h:btnSize}
				]},
				{id:"Text-Cur",num:-1,css:cssLib.textScoreMid.createCSS([-19,0,0],(resNum+"")?(resNum+""):"???",240,30,1,1,1,1)},//当前数量
			],fade:1,fade_pos:pos,fade_size:1,fade_alpha:0,
			page:page,appEnv:appEnv,city:city,
			update:this.update,viewId:viewId,
			aisUpdateView:this.update,
			onFadeDone:function(v)
			{
				if(!v)
				{
					this.appEnv.layer.setFrameout(0,this.delSelf,this);
				}
			},
			delSelf:function()//删除当前按钮
			{
				DBOut("************ del tokenbox "+this.viewId);
				this.deadOut=1;
				this.getFather().removeChild(this);
			}
		};
		return css;
	},
	create:function(box,pos,city,resIcon,resNum,keyid)
	{
		var css,bar;
		css=this.createCSS(pos,city,resIcon,resNum,keyid);
		bar=box.appendNewChild(css);
		bar.picRes=bar.getItemById("Pic-Res");
		bar.txtCur=bar.getItemById("Text-Cur");
		if(city)
			city.addUIView(bar);
		return bar;
	},
	update:function()
	{
		if(!this.city)
		{
			DBOut("error update, tokenbar!");
			return;
		}
		var num=this.city.king.cashNum;
		if(num>28256363)
			this.txtCur._setText(""+num);
		else
			this.txtCur._setScore(num);
		if(this.txtCur.num>=0 && num>this.txtCur.num && "UITokenBar"==this.viewId)
		{
		//	this.page.stateLogs.showLog(this.appEnv.textLib.getText(this.appEnv.textLib.getGemTip,{number:num-this.txtCur.num}));
			this.page.audioObject.playSound("diamonds_collect");
		}
		if(this.txtCur.num>=0 && num<this.txtCur.num && "UITokenBar"==this.viewId)
		{
			this.page.audioObject.playSound("coin_collect");
		}
		if(this.txtCur.num>=0 && num!=this.txtCur.num)
		{
			this.page.appEnv.addZoomScale(this.picRes,[1,1,1],[1.5,1.5,1],0.3);
		}
		this.txtCur.num=num;
	}
};
