this.cssLib.boxTH=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,city,keyid,ctype)
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
		var imgname="";
		if(ctype=="TH")
			imgname="goldcard";
		else if(ctype=="CubeCard")
			imgname="cubecard";
		var resIcon=imgLib.getIcon(imgname,64);
		resIcon.w=resIcon.h=60;
		var btnSize=40,bcSize=btnSize+24;
		var css={
			type:"key",id:"Pic-Res",pos:pos,css:resIcon,anchor_h:1,anchor_v:1,button:1,key:keyid,fliter:1,
			ui_event:1,state_up:{w:64,h:64,},state_down:{w:60,h:60},
			items:[
				{
					type:"txt_score",id:"Score-Cur",pos:[0,13,0],font_size:20,w:100,h:50,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				}
			],
			page:page,appEnv:appEnv,city:city,
			update:this.update,viewId:"UIBar_"+ctype,
			aisUpdateView:this.update,ctype:ctype,
		};
		return css;
	},
	create:function(box,pos,city,keyid,ctype)
	{
		var css,bar;
		css=this.createCSS(pos,city,keyid,ctype);
		bar=box.appendNewChild(css);
		bar.scoreCur=bar.getItemById("Score-Cur");
		bar.scoreCur.owner=bar;
		city.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var bname=this.ctype;
		var buff=this.city.getBuff(bname);
		if(buff)
		{
			this.setDisplay(1);
			buff=this.city.buffs[bname];
			var dt=buff.endTime-this.city.env.dateTime();
			if(dt>0)
			{
				this.scoreCur.setTime(dt);
				this.scoreCur.onTimer=function(){
					this.owner.update();
				};
				return;
			}
		}
		this.setDisplay(0);
	}
};
