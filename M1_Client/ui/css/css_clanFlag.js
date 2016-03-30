this.cssLib.clanFlag=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var css;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		css={
			type:"icon","pos":pos,id:"ClanFlag","anchor_h":1,"anchor_v":1,tex:"",w:64,h:64,tex_u:0,tex_v:0,tex_w:1,tex_h:1,
			page:page,appEnv:appEnv,
			update:this.update,
			setFalg:this.setFalg,
		};
		return css;
	},
	setFalg:function(flag)
	{
		this.setTexURL(this.page.genPageURL(window.imgPath+"/icon/icon_badge"+flag+"64_32.png"));
	},
	update:function()
	{
		var city,page=this.page,state;
		city=aisGame.curCity;
		if(!city)return;
		if(!city.allianceId)return;
		state=page.stateHome;

		if(city.allianceFlag)
		{
			this.setFalg(city.allianceFlag);
		}else
			this.setFalg(0);
	}
};
