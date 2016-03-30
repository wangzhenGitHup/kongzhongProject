this.cssLib.boxLootBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,res)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv;
		var css,def;
		var res_icon;
		appEnv=page.appEnv;
		res_icon=imgLib.getIcon(res,64);
		css={
			type:"shape",id:"LootBar",pos:pos,w:240,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{
					type:"txt_score",id:"Score",css:cssLib.scoreFineMid.createCSS([0,0,0],0,240,30,0,1,0,1)
				},//当前数量的影子
				{type:"icon",id:"Pic-Res",pos:[-24,0,0],w:48,h:48,css:res_icon,anchor_h:1,anchor_v:1},//资源图标
			],
			page:page,appEnv:appEnv,
			update:this.update,viewId:"ExpBar",
			aisUpdateView:this.update,
			bindValue:this.bindValue,
			_getScore:this._getScore,
			_setScore:this._setScore,
		};
		return css;
	},
	create:function(box,pos,res)
	{
		var css,bar;
		css=this.createCSS(pos,res);
		bar=box.appendNewChild(css);
		bar.txtScore=bar.getItemById("Score");
		bar.picRes=bar.getItemById("Pic-Res");
		return bar;
	},
	bindValue:function(obj,chn,base,factor,prefix,postfix)
	{
		this.txtScore.bindToValue(obj,chn);
		this.txtScore._setModifer(base,factor);
		this.txtScore._setPrefix(prefix);
		this.txtScore._setPostfix(postfix);
	},
	_getScore:function()
	{
		return this.txtScore._getScore();
	},
	_setScore:function(s)
	{
		return this.txtScore.setScore(s);
	},
	update:function()
	{

	}
};
