this.cssLib.btnShopGemItem=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,def,keyid,boxh)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,numCap,bldNum;
		var priceVO,price,priceType,priceIcon,reward,rewardIcon,pic,priceColor,priceStr="";
		var time,timetxt,numTip;
		var css,hfboxh,bad,boxw;
		var misList;
		
		var needPay=0;
		var payVO=null;
		boxw=280;
		boxh=boxh>400?boxh:400;
		hfboxh=Math.floor(boxh/2);
		var codeName=def.codeName;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		priceIcon=imgLib.getIcon("res_gem",64);
		price=def.costValue;
		reward=def.rewardValue;
		if("Gem"==def.costRes)//gem
		{
		//	pic=imgLib.getIcon("res_"+def.icon,64);
		//	pic.w=pic.h=180;
			priceColor=[255,255,255];
			if(window.aisGame.king.gemNum<def.costValue)
				priceColor=[255,0,0];
			priceIcon=imgLib.getIcon("res_gem",64);
			priceStr=""+price;
		}
		else if("Web"==def.costRes)
		{
			needPay=2;
		}
		else//cash
		{
		//	pic=imgLib.getIcon(def.icon,128);
		//	pic.w=pic.h=180;
			priceIcon=imgLib.getIcon("money",64);
			needPay=1;
			payVO=def.payVO;
			priceStr=window.PriceStr+price;
			if("91"==window.ChannelType)
			{
				priceStr=price+"（91豆）";
			}
		}
	//	DBOut(toJSON(def));
		pic=imgLib.getIcon(def.icon,256);
		rewardIcon=imgLib.getIcon("res_gold",64);
		rewardIcon="";
		if(def.rewardRes)
		{
			if("Gem"==def.rewardRes)rewardIcon=imgLib.getIcon("res_gem",64);
			else if("Gold"==def.rewardRes)rewardIcon=imgLib.getIcon("res_gold",64);
			else if("Oil"==def.rewardRes)rewardIcon=imgLib.getIcon("res_oil",64);
			else if("Cube"==def.rewardRes)rewardIcon=imgLib.getIcon("res_cube",64);
			else if("cash"==def.rewardRes)rewardIcon=imgLib.getIcon("res_chip",64);
			rewardIcon.w=rewardIcon.h=48;
		}
		bad=def.bad;
		css={
			type:"icon",pos:pos,w:boxw,h:boxh,css:(!bad)?imgLib.getImg("box_shopitem"):imgLib.getImg("box_shopitem_g"),mode3x3:1,key:0,anchor_h:1,anchor_v:1,id:"ShopFolder",ui_event:1,
			items:[
				{id:"name",css:cssLib.textFineMid.createCSS([-130,-hfboxh+24,0],def.name,280,30,0,1,0,1)},//建筑名称
				{type:"icon",id:"back_light",pos:[0,-10,0],css:imgLib.getImg("pic_backlight"),anchor_h:1,anchor_v:1,w:280,h:220,color_a:!bad?150:88},
				{type:"icon",id:"item_pic",pos:[0,-10,0],css:pic,anchor_h:1,anchor_v:1,color_a:!bad?255:128},
				{type:"icon",id:"label",pos:[0,hfboxh-38,0],css:imgLib.getImg("box_dark"),w:270,h:60,mode3x3:1,anchor_h:1,anchor_v:1,color_a:120},
				{type:"icon",id:"res_pic",pos:[-100,hfboxh-38,0],css:priceIcon,w:64,h:64,anchor_h:1,anchor_v:1,display:2==needPay?0:1},//价格图片
				{id:"price",css:cssLib.textFineBig.createCSS([0,hfboxh-38,0],priceStr,280,30,1,1,("91"==window.ChannelType && 1==needPay)?2:1,1,priceColor),display:2==needPay?0:1},//价格
				{id:"exDesc",css:cssLib.textFineBig.createCSS([0,hfboxh-34,0],textLib["SpecialItem"],280,30,1,1,1,1,priceColor),display:2==needPay?1:0},//特别说明
				{type:"icon",id:"pic_get",pos:[boxw/2-60,-hfboxh+64,0],css:rewardIcon,anchor_h:1,anchor_v:1,color_a:!bad?255:128,display:(2==needPay || def.monthCard || def.msgCard || def.thCard || def.resCard)?0:1},//得到资源图片
				{id:"gain",css:cssLib.textFineMid.createCSS([boxw/2-60-26,-hfboxh+64,0],reward+"",280,30,2,1,2,1,[255,255,255]),display:(2==needPay || def.monthCard || def.msgCard || def.thCard || def.resCard)?0:1},//得到资源数量
				{id:"cd",css:cssLib.textFineMid.createCSS([0,hfboxh-86,0],textLib["GetCDTime"](def.cd),boxw,20,1,1,1,1,[255,255,255,255]),display:def.cd?1:0},
				// {id:"vipDesc",css:cssLib.textFineMid.createCSS([-10,hfboxh-100,0],textLib[/* def.giftCard?"Once4NewYear": */"VipResDesc"],boxw,20,1,1,2,1,/* def.giftCard?[255,0,0,255]: */[255,255,255,255]),display:(def.vip || def.giftCard)?1:0},
				{id:"vipDesc",css:cssLib.textFineMid.createCSS([-10,hfboxh-100,0],textLib["VipResDesc"],boxw,20,1,1,2,1,[255,255,255,255]),display:def.vip?1:0},

				{id:"InfoBtn",css:cssLib.btnInfo.createCSS([116,-hfboxh+24,0],keyid),display:(def.monthCard || def.msgCard || def.thCard || def.resCard || def.giftCard)?1:0},
				{id:"monthGain",css:cssLib.textFineMid.createCSS([boxw/2-60+24,-hfboxh+64,0],textLib[def.monthCard?"MonthReward":"WeekResCardReward"],boxw,20,2,1,2,1,[255,255,255,255]),display:(def.monthCard || def.resCard)?1:0},
				{id:"monthRemain",css:cssLib.textFineMid.createCSS([0,hfboxh-86,0],textLib[def.monthCard?"GetMonthCardTime":"GetCardTime"](def.cardRemain),boxw,20,1,1,1,1,
					def.cardRemain>1000*60*60*24?[255,255,255,255]:[255,255,255,255]),display:def.cardRemain?1:0},
			],bad:def.bad,needPay:needPay,payVO:payVO,vip:def.vip,vipBad:def.vipBad,
			monthCard:def.monthCard,msgCard:def.msgCard,thCard:def.thCard,resCard:def.resCard,giftCard:def.giftCard,def:def,
			update:this.update,appEnv:appEnv,
			onClick:this.onClick
		};
//		if(bad!=2)
//		{
//			css.items=css.items.concat([
//				{type:"icon",id:"pic_clock",pos:[-100,hfboxh-84,0],css:imgLib.pic_clock,anchor_h:2,anchor_v:1,filter:1},
//				cssLib.textFineMid.createCSS([-100,hfboxh-84,0],timetxt,280,30,0,1,0,1,[255,255,100]),//建造时间
//				cssLib.textSmall.createCSS([125,hfboxh-104,0],numTip,280,30,2,1,2,1,[0,0,0]),//建造限制标记
//				cssLib.textFineMid.createCSS([125,hfboxh-84,0],""+bldNum+"/"+numCap,280,30,2,1,2,1,bldNum<numCap?[181,251,255]:[255,0,0]),//建造限制数量
//			]);
//		}
//		else
//		{
//			css.items.push(cssLib.textFineSmall.createCSS([0,hfboxh-120,0],numTip,280,30,1,1,1,1,[255,255,255]));//缺少Feature的提示
//		}
		return css;
	},
	create:function(box,pos,def,keyid,boxh)
	{
		var css;
		css=this.createCSS(pos,def,keyid,boxh);
		return box.appendNewChild(css);
	},
	update:function(def)
	{
		var appEnv=this.appEnv;
		var imgLib=this.appEnv.page.imgLib;
		var textLib=appEnv.textLib;

		var pic=imgLib.getIcon(def.icon,256), rewardIcon=imgLib.getIcon("res_gold",64);
		if("Gem"==def.rewardRes)rewardIcon=imgLib.getIcon("res_gem",64);
		else if("Gold"==def.rewardRes)rewardIcon=imgLib.getIcon("res_gold",64);
		else if("Oil"==def.rewardRes)rewardIcon=imgLib.getIcon("res_oil",64);
		else if("Cube"==def.rewardRes)rewardIcon=imgLib.getIcon("res_cube",64);
		else if("cash"==def.rewardRes)rewardIcon=imgLib.getIcon("res_chip",64);

		var priceIcon=imgLib.getIcon("res_gem",64),needPay,payVO,priceStr;
		var bad=def.bad;
		var price=def.costValue;
		var reward=def.rewardValue;
		if("Gem"==def.costRes)//gem
		{
			priceIcon=imgLib.getIcon("res_gem",64);
			needPay=0;
			priceStr=""+price;
		}
		else if("Web"==def.costRes)
		{
			needPay=2;
		}
		else//cash
		{
			priceIcon=imgLib.getIcon("money",64);
			needPay=1;
			payVO=def.payVO;
			priceStr=window.PriceStr+price;
			if("91"==window.ChannelType)
			{
				priceStr=price+"（91豆）";
			}
		}

//		DBOut("****************");
//		DBOut("name:"+def.name);
//		DBOut("bad:"+bad);
//		DBOut("item_pic:"+pic.tex);
//		DBOut("res_pic:"+priceIcon.tex);
//		DBOut("price:"+def.costValue);
//		DBOut("pic_get:"+rewardIcon.tex);
//		DBOut("gain:"+def.rewardValue);
//		DBOut("needPay:"+needPay);
//		DBOut("payVO:"+payVO);
		var bg=(!bad)?imgLib.getImg("box_shopitem"):imgLib.getImg("box_shopitem_g");
		this.setTexUV([bg.tex_u,bg.tex_v,bg.tex_w,bg.tex_h]);
		this.getItemById("name")._setText(def.name);
		this.getItemById("back_light").setColor([255,255,255,!bad?150:88]);
		this.getItemById("item_pic").setTexURL(pic.tex);
		this.getItemById("item_pic").setColor([255,255,255,!bad?255:128]);
		this.getItemById("res_pic").setTexURL(priceIcon.tex);
		this.getItemById("price")._setText(priceStr);
		this.getItemById("pic_get").setTexURL(rewardIcon.tex);
		this.getItemById("pic_get").setColor([255,255,255,!bad?255:128]);
		this.getItemById("gain")._setText(reward);

		// this.getItemById("vipDesc").setDisplay((def.vip || def.giftCard)?1:0);
		this.getItemById("vipDesc").setDisplay(def.vip?1:0);
		if(def.giftCard)
		{
			// this.getItemById("vipDesc")._setText(textLib["Once4NewYear"]);
			// this.getItemById("vipDesc")._setColor(255,0,0,255);
		}
		else if(def.vip)
		{
			this.getItemById("vipDesc")._setText(textLib["VipResDesc"]);
			this.getItemById("vipDesc")._setColor(255,255,255,255);
		}

		this.getItemById("res_pic").setDisplay(2==needPay?0:1);
		this.getItemById("price").setDisplay(2==needPay?0:1);
		this.getItemById("pic_get").setDisplay(2==needPay?0:1);
		this.getItemById("gain").setDisplay(2==needPay?0:1);
		this.getItemById("exDesc").setDisplay(2==needPay?1:0);

		this.bad=bad;
		this.needPay=needPay;
		this.payVO=payVO;
		this.vip=def.vip;
		this.vipBad=def.vipBad;
		this.monthCard=def.monthCard;
		this.msgCard=def.msgCard;
		this.thCard=def.thCard;
		this.resCard=def.card;
		this.giftCard=def.giftCard;
		this.def=def;

		if(def.monthCard || def.thCard || def.resCard)
		{
			this.getItemById("InfoBtn").setDisplay(1);
			this.getItemById("monthGain")._setText(textLib[def.monthCard?"MonthReward":"WeekResCardReward"]);
			if(def.monthCard || def.resCard)
				this.getItemById("monthGain").setDisplay(1);
			else
				this.getItemById("monthGain").setDisplay(0);
			if(def.cardRemain)
			{
				this.getItemById("monthRemain").setDisplay(1);
				this.getItemById("monthRemain")._setText(textLib[def.monthCard?"GetMonthCardTime":"GetCardTime"](def.cardRemain));
				if(def.cardRemain>1000*60*60*24)
				{
					this.getItemById("monthRemain")._setColor(255,255,255,255);
				}
				else
				{
					this.getItemById("monthRemain")._setColor(255,255,255,255);
				}
			}
			else
			{
				this.getItemById("monthRemain").setDisplay(0);
			}
			this.getItemById("pic_get").setDisplay(0);
			this.getItemById("gain").setDisplay(0);
		}
		else if(def.msgCard)
		{
			this.getItemById("InfoBtn").setDisplay(1);
			this.getItemById("monthGain").setDisplay(0);
			this.getItemById("monthRemain").setDisplay(0);
			this.getItemById("pic_get").setDisplay(0);
			this.getItemById("gain").setDisplay(0);
		}
		else
		{
			this.getItemById("InfoBtn").setDisplay(0);
			this.getItemById("monthGain").setDisplay(0);
			this.getItemById("monthRemain").setDisplay(0);
			if(2!=needPay)
			{
				this.getItemById("pic_get").setDisplay(1);
				this.getItemById("gain").setDisplay(1);
			}
		}
	},
	onClick:function(msg,way)
	{
		return 0;
		if(way==1)
		{
			if(msg==0)
			{
				//TODO: StartAni
				var pos=[0,0,0];
				this.getPos(pos);
				this.startAniEx(pos,0.9,1,0,3);
			}
			else if(msg==1)
			{
				//TODO: StartAni
				var pos=[0,0,0];
				this.getPos(pos);
				this.startAniEx(pos,1.0,1,0,3);
			}
		}
		return 0;
	}
};
