if(!__Page.cssLib)
{
	__Page.cssLib = {page:__Page,path:""}
	__Page.cssLib.genSplPath = function(splName)
	{
		return this.page.genPageURL(this.path + "assets/"+splName+".spl");
	};
	__Page.cssLib.genPngPath = function(pngName)
	{
		return this.page.genPageURL(this.path + "assets/"+pngName+"_32.png");
	};
	__Page.cssLib.genIconPath = function(iconName)
	{
		return this.page.genPageURL(this.path + "assets/icon/"+iconName+"_32.png");
	};
}
__Page.initCSSLib=function()
{
	var page = this;
	var imgLib = this.imgLib;
	var cssLib = this.cssLib;
	
	<include check="0">"ui/css/css_myorder.js"</include>
	<include check="0">"ui/css/css_mysoft_info.js"</include>
	<include check="0">"ui/css/css_mygame.js"</include>
	<include check="0">"ui/css/css_pmt.js"</include>
	<include check="0">"ui/css/css_scrollbox_pulldown.js"</include>
	
	//主界面登录前的顶部
	cssLib["mainTopBarBeforeLogin"] = function(sw, sh, cbobj, cbArr, text, fontSize)
	{
		var cssLib = this;
		var searchW = 60 + (page.appEnv.scaleFactorY - 1) * 15;
		var searchH = 58 + (page.appEnv.scaleFactorY - 1) * 15;
		var loginW = 114  + (page.appEnv.scaleFactorY - 1) * 15;
		var loginH = 43 + (page.appEnv.scaleFactorY - 1) * 15;
		var pos2 = [sw - searchW / 2 - 20, 0, 0];
		var topBarImg = cssLib.genIconPath("topbar");
		var loginFlagImg = cssLib.genIconPath("loginflag");
		var loginFlagImgW = 61 + (page.appEnv.scaleFactorY - 1) * 15;
		var loginFlagImgH = 61 + (page.appEnv.scaleFactorY - 1) * 15;
		var pos1 = [(loginW >> 1) + loginFlagImgW + 50, 0, 0];
		
		fontSize = fontSize + (page.appEnv.scaleFactorY - 1) * 2;
		var params = {scale:0.98, upclr:[1, 1, 1, 1], downclr:[1, 1, 1, 1], fs:fontSize, edgeclr:[1, 1, 1, 0.5], edge:0, align_h:1, 
			align_v:1, anchor_v:1, anchor_h:1};
		
		return {
			"type":"icon", "id":"topbg","pos":[0, sh >> 1, 0],"w":sw,"h":sh,"ui_event":1,"anchor_h":0,"anchor_v":1, 
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			items:[
				{
					"type":"icon","id":"","w":loginFlagImgW, "h":loginFlagImgH,"pos":[20, 0, 0],"anchor_h":0,"anchor_v":1,
					obj:{"type":"image", "tex":loginFlagImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
				},
				{css:cssLib["key_txt"](pos1, cbobj, cbArr[0], loginW, loginH, text, params)},
				{css:cssLib["search"](pos2, cbobj, cbArr[1], searchW, searchH, 0, {ah:1, av:1})},
			],
		};
	};
	
	//主界面登录后的顶部
	cssLib["mainTopBarAfterLogin"] = function(sw, sh, cbobj, cbArr, txt1, txt2, fontSize)
	{
		var cssLib = this;
		var searchW = 60 + (page.appEnv.scaleFactorY - 1) * 15;
		var searchH = 58 + (page.appEnv.scaleFactorY - 1) * 15;

		var loginFlagImg = "loginflag";
		var loginFlagImgW = 61 + (page.appEnv.scaleFactorY - 1) * 15;
		var loginFlagImgH = 61 + (page.appEnv.scaleFactorY - 1) * 15;
		
		var pos1 = [loginFlagImgW  + 40, 0, 0];
		var pos2 = [sw - (searchW >> 1) - 20, 0, 0];
		var topBarImg = cssLib.genIconPath("topbar");
		
		var loginAfterImg = "loginafter";
		var params = {ah:0, av:1, scale:0.98};
		
		return {
			"type":"icon", "id":"topbg","pos":[0, sh >> 1, 0],"w":sw,"h":sh,"ui_event":1,"anchor_h":0,"anchor_v":1, 
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			items:[

				{css:cssLib["key_icon"]([20, 0, 0], "mygameFlag", loginFlagImg, loginFlagImg, loginFlagImgW, loginFlagImgH, params, cbobj, cbArr[0])},
				{css:cssLib["key_icon"](pos1, "mygameFlag", loginAfterImg, loginAfterImg, loginFlagImgW, loginFlagImgH, params, cbobj, cbArr[1])},
				{css:cssLib["search"](pos2, cbobj, cbArr[2], searchW, searchH, 0, {ah:1, av:1})},
			],
		};
	};
	
	//底部按钮lib
	cssLib["mainBottom"] = function(pos, sw, sh, cbobj, cb, btnId, btnImgUrl, fs, text)
	{
		var cssLib = this;
		var btnUpImgUrl = cssLib.genIconPath(btnImgUrl + "_up");
		var btnDownImgUrl = cssLib.genIconPath(btnImgUrl + "_down");
		var textSize = page.appEnv.getTextSize(text, fs, 0, sw);
		var itemParameter = {
			tColor:[0, 0, 0, 0.6],
			tSize: fs,
			edge: 0,
			edgeColor:[0, 0, 0, 0.1],
			align_h: 1,
			align_v: 1,
			anchor_h: 1,
			anchor_v: 1,
		};
		return{
			"type":"key", "id":"bottom" + btnId,"pos":pos,"w":sw,"h":sh,"ui_event":1,"key":0, "anchor_h":0,"anchor_v":1,"down_scale":0.98,
			"state_up":{"type":"image", "tex":btnUpImgUrl, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh,"tex_vh":1,},
			"state_down":{"type":"image", "tex":btnDownImgUrl, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh,"tex_vh":1,},
			state_disabled:{"type":"image", "tex":btnDownImgUrl, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh,"tex_vh":1,},
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra, btnId);
			},
			items:[
				{css:cssLib["stdText"]([sw >> 1, (sh >> 1) + 18, 0], "tip" + btnId, textSize, text, itemParameter)},
			],
		};
	};
	
	//广告lib
	cssLib["mainAds"] = function(pos, sw, sh, arrange, listBoxSize, itemSize, cbobj, cbArr)
	{
		var cssLib = this;
		var rollSelectY = listBoxSize[1];
		var rollSelectW = 19;
		var rollSelectH = 19;
		var gap = 15;
		//var rollSelectTotalW = (rollSelectW * 4 + gap * 3);
		//var rollSelectX = (sw - rollSelectTotalW) >> 1;
		var rollSelectX = 30;
		
		return{
			"type":"icon", "id":"mainAdsItem","pos":pos, "w":sw,"h":sh,"ui_event":1,
			obj:{"type":"box", "color":[0, 0, 0, 1], "ui_event": 1,},
			items:[
				{css:cssLib["css_listbox"]([0, 0, 0], "mainAds", arrange, listBoxSize, itemSize, 1, cbobj, cbArr)},//广告列表
				
				{css:cssLib["stdPngIcon"]([rollSelectX, rollSelectY, 0], "selectCircle0", [rollSelectW, rollSelectH], "roll_select", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap + rollSelectW , rollSelectY, 0], "selectCircle1", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 2 + rollSelectW * 2, rollSelectY, 0], "selectCircle2", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 3 + rollSelectW * 3, rollSelectY, 0], "selectCircle3", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 4 + rollSelectW * 4 , rollSelectY, 0], "selectCircle4", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 5 + rollSelectW * 5, rollSelectY, 0], "selectCircle5", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 6 + rollSelectW * 6, rollSelectY, 0], "selectCircle6", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 7 + rollSelectW * 7, rollSelectY, 0], "selectCircle7", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 8 + rollSelectW * 8 , rollSelectY, 0], "selectCircle8", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 9 + rollSelectW * 9 , rollSelectY, 0], "selectCircle9", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				/*{css:cssLib["stdPngIcon"]([rollSelectX + 200, rollSelectY, 0], "selectCircle0", [rollSelectW, rollSelectH], "roll_select", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX +  + gap + rollSelectW + 200, rollSelectY, 0], "selectCircle1", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + (gap << 1) + (rollSelectW << 1) + 200, rollSelectY, 0], "selectCircle2", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([rollSelectX + gap * 3 + rollSelectW * 3 + 200, rollSelectY, 0], "selectCircle3", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				*/
			
			],
			
			showCircleIcon:function(id)
			{
				this.findItemById("selectCircle" + id).setDisplay(0);
			},
			
			setCirclePos:function(pos, id)
			{
				this.findItemById("selectCircle" + id).setPos(pos);
			},
			
			setSelectIcon:function(id)
			{
				var cssLib = cbobj.page.cssLib;
				var iconImg1 = cssLib.genIconPath("roll_select");
				this.findItemById("selectCircle" + id).getGraphicObj().setTexURL(iconImg1);
			},
			
			updateSelectIcon: function(id1, id2)
			{
				var cssLib = cbobj.page.cssLib;
				var iconImg1 = cssLib.genIconPath("roll_select");
				this.findItemById("selectCircle" + id1).getGraphicObj().setTexURL(iconImg1);
				if(id1 == id2)
				{
					return;
				}
				if(id2 < 0)
				{
					return;
				}
				var iconImg2 = cssLib.genIconPath("roll_unselect");
				this.findItemById("selectCircle" + id2).getGraphicObj().setTexURL(iconImg2);
			},
		};
	};
	
	//支付方式lib
	cssLib["main_pay"] = function(pos, sw, sh, arrange, listBoxSize, itemSize, cbobj, cb)
	{
		var cssLib = this;
		
		return{
			"type":"icon", "id":"mainPayItem","pos":pos, "w":sw,"h":sh,"ui_event":1,
			obj:{"type":"box", "color":[1, 1, 1, 1], "ui_event": 1,"w":sw,"h":sh,},
			items: [
				{css:cssLib["css_listbox"]([(sw - listBoxSize[0]) >> 1, 0, 0], "mainPay", arrange, listBoxSize, itemSize, 1, cbobj, cb)},
			],
		};
	};
	
	cssLib["main_payItemIcon"] = function(id , imgUrl, text, isLocal)
	{
		var cssLib = this;
		if(isLocal)
		{
			imgUrl = cssLib.genIconPath(imgUrl);
		}
		var imgW = 104 + (page.appEnv.scaleFactorX - 1) * 15;
		var imgH = 104 + (page.appEnv.scaleFactorX - 1) * 15;
	
		return{
			"type":"icon","id":id, "w":imgW, "h":imgH, "ui_event":1, "pos":[0, 10, 0], "anchor_h":0, "anchor_v":0,
			obj:{"type":"image", "tex":imgUrl, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
			items: [
				{
					"type":"icon", "id":"txt", "auto_size":1, "anchor_h":1, "anchor_v":0,"pos":[imgW >> 1,imgH + 5,0],
					obj:{"type":"text", "text":text, "color":[0, 0, 0, 1], "align_h":1, "align_v":1,"font_size":26,},
				},
			],
		};
	};
	
	//主页游戏lib
	cssLib["main_game"] = function(pos, sw, sh, cbobj, cb, barClr)
	{
		var cssLib = this;
		return{
			"type":"item", "id":"mainGameItem","pos":pos, "w":sw,"h":sh,"ui_event":1,
			items: [
				{css:cssLib["scrollBox"]([0, 0, 0], sw, sh, cbobj)},
			],
		};
	};
	
	cssLib["main_gameItem"] = function(offset, id, gameImgUrl, isCollect, gameNameTxt, detailTxt, sellCnt, cbobj, cbArr, btnMsg)
	{
		var cssLib = this;
		var sw = page.appEnv.scrSize[0];
		var sh = 140;
		var gameImgW = sh - 30;
		var gameImgH = sh - 30;
		var gap = page.appEnv.appEnvGap;
		var flagImgUrl;
		if(!isCollect)
		{
			flagImgUrl = ("add_yellow");
		}
		else
		{
			flagImgUrl = ("green_select");
		}
			
		var flagImgW = 73;
		var flagImgH = 73;
		
		var itemParameter1 = {
			tColor:[0, 0, 0, 0.8],
			tSize: 24,
			edge: 0,
			edgeColor:[0, 0, 0, 0.1],
			align_h: 0,
			align_v: 0,
			anchor_h: 0,
			anchor_v: 0,
		};
		var gameNameSize = page.appEnv.getTextSize(gameNameTxt, 24, 0, sw);
		var itemParameter2 = {
			tColor:[0, 0, 0, 1],
			tSize: 18,
			edge: 0,
			edgeColor:[0, 0, 0, 1],
			align_h: 0,
			align_v: 0,
			anchor_h: 0,
			anchor_v: 0,
			wrap:1,
		};
		var detailSize = page.appEnv.getTextSize(detailTxt, 18, 1, 220);
		var flagImgParam = {
			anchor_h:0, 
			anchor_v: 1, 
			ui_event:1,
		};
		var params = {anchor_h:0, anchor_v:1, align_v:1, align_h:0, wrap:0};
		
		return{
			"type":"key", "id":"maingameItem" + id, "pos":[0, offset * gap, 0], "w":sw, "h":sh, "ui_event":1, "anchor_h":0,"anchor_v":0, "down_scale":1,
			"state_up":{"type":"box", "color":[1, 1, 1, 1], "w":sw, "h":sh},
			"state_down":{"type":"box",  "color":[0, 0.71, 1, 0.8], "w":sw, "h":sh, },
			OnClick:function(msg, extra)
			{
				if(!cbArr[0])
				{
					return;
				}
				cbArr[0].call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{css:cssLib["url_icon"]([10, sh >> 1, 0], "", gameImgUrl, gameImgW, gameImgH, 0, 1)},
				{css:cssLib["stdText"]([30 + gameImgW, 20, 0], "txt" + id, [gameNameSize.w, gameNameSize.h], gameNameTxt, itemParameter1)},
				{css:cssLib["stdText"]([30 + gameImgW, gameNameSize.h + 30, 0], "detailedTxt" + id, [sw - 100 - gameImgW - flagImgW, detailSize.h], detailTxt, itemParameter2)},
				{css:cssLib["multi_text_three"]([30 + gameImgW, 118, 0], sw, sh, "共", sellCnt, "人购买", {r:0, g:0, b:0, a:0.6}, {r:1, g:0.78, b:0.03, a:1}, {r:0, g:0, b:0, a:0.6}, 18, 20, 18, params)},
				{css:cssLib["stdDisBtn"]([sw - flagImgW - 50, 64, 0], "flagBtn" + id, [flagImgW, flagImgH], flagImgUrl, flagImgUrl, "", flagImgParam, !isCollect ? cbArr[1] : null, cbobj, btnMsg)},
			],
		};
	};

	//一个文字提示 
	cssLib["modelTopBgZero"] = function(id, sw, sh, txt)
	{
		var itemParameter = {
			tColor:[1, 1, 1, 1],
			tSize:36,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0,
		};
		var topBarImg = cssLib.genIconPath("topbar");
		
		return {
			"type":"icon","id":id + "topbg", "pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["stdText"]([0, 0, 0], "", [144, 58], txt, itemParameter)},
			],//End of: items
		};
	};
	
	//一个返回，一个文字提示 
	cssLib["modelTopBgFirst"] = function(id, sw, sh, txt, cbobj, cb, wrap)
	{
		var itemParameter = {
			tColor:[1, 1, 1, 1],
			tSize:40 + (page.appEnv.scaleFactorY - 1) * 2,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:wrap,
		};
		var topBarImg = cssLib.genIconPath("topbar");
		var txtSize = page.appEnv.getTextSize(txt, 40 + (page.appEnv.scaleFactorY - 1) * 2, 0, sw);
		
		return {
			"type":"icon","id":id+"topbg","pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["back_btn"]([-sw / 2 + 20 + (70 + (page.appEnv.scaleFactorY - 1) * 15) / 2, 0, 0], "", cbobj, cb)},
				{css:cssLib["stdText"]([0, 0, 0], "", txtSize, txt, itemParameter)},
			],//End of: items
		};
	};
	
	//一个返回，一个文字提示，再一个文字key
	cssLib["modelTopBgSecond"] = function(id, sw, sh, txt, keyTxt, keyTxtW, keyTxtH, fs, cbobj, cbArr)
	{
		var itemParameter = {
			tColor:[1, 1, 1, 1],
			tSize:40 + (page.appEnv.scaleFactorY - 1) * 2,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
		};
		
		fs = fs + (page.appEnv.scaleFactorY - 1) * 2;
		var txtSize = page.appEnv.getTextSize(txt, 40 + (page.appEnv.scaleFactorY - 1) * 2, 0, sw);
		keyTxtW = keyTxtW + (page.appEnv.scaleFactorY - 1) * 15;
		keyTxtH = keyTxtH + (page.appEnv.scaleFactorY - 1) * 15;
		
		var params = {fs:fs, scale:0.98, upclr:[1, 1, 1, 1], downclr:[1, 1, 1, 1], edgeclr:[1, 1, 1, 0.3], edge:0, align_h:1, align_v:1, anchor_v:1, anchor_h:1};
		var topBarImg = cssLib.genIconPath("topbar");
		
		return {
			"type":"icon","id":id+"topbg","pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["back_btn"]([-sw / 2 + 20 + (70 + (page.appEnv.scaleFactorY - 1) * 15) / 2, 0, 0], "", cbobj, cbArr[0])},
				{css:cssLib["stdText"]([0, 0, 0], "", txtSize, txt, itemParameter)},
				{css:cssLib["key_txt"]([(sw - keyTxtW) / 2 - 20, 0, 0], cbobj, cbArr[1], keyTxtW, keyTxtH, keyTxt, params)},
			],//End of: items
		};
	};
	
	//一个返回，一个文字提示，再一个图片key
	cssLib["modelTopBgThrid"] = function(id, sw, sh, txt, upImg, downImg, imgW, imgH, params, cbobj, cbArr)
	{
		var itemParameter = {
			tColor:[1, 1, 1, 1],
			tSize:40 + (page.appEnv.scaleFactorY - 1) * 2,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0
		};
		var topBarImg = cssLib.genIconPath("topbar");
		var txtSize = page.appEnv.getTextSize(txt, 40 + (page.appEnv.scaleFactorY - 1) * 2, 0, sw);
		
		imgW = imgW + (page.appEnv.scaleFactorY - 1) * 15;
		imgH = imgH + (page.appEnv.scaleFactorY - 1) * 15;
		
		return {
			"type":"icon","id":id+"topbg","pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["back_btn"]([-sw / 2 + 20 + (70 + (page.appEnv.scaleFactorY - 1) * 15) / 2, 0, 0], "", cbobj, cbArr[0])},
				{css:cssLib["stdText"]([0, 0, 0], "", txtSize, txt, itemParameter)},
				{css:cssLib["key_icon"]([(sw >> 1) - imgW - 20, 0, 0], id, upImg, downImg, imgW, imgH, params, cbobj, cbArr[1])},
			],//End of: items
		};
	};
	
	//一个返回，一个文字提示，再一个图片加文字key
	cssLib["modelTopBgFour"] = function(id, sw, sh, txtArr, upImg, downImg, imgW, imgH, cbobj, cbArr)
	{
		var itemParameter1 = {
			tColor:[1, 1, 1, 1],
			tSize:40 + (page.appEnv.scaleFactorY - 1) * 2,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0,
		};
		
		var itemParameter2 = {
			tColor:[1, 1, 1, 1],
			tSize:40 + (page.appEnv.scaleFactorY - 1) * 2,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0,
			scale:0.98,
		};
		var topBarImg = cssLib.genIconPath("topbar");
		var txtSize = page.appEnv.getTextSize(txtArr[0], 40 + (page.appEnv.scaleFactorY - 1) * 2, 0, sw);
		
		imgW = imgW + (page.appEnv.scaleFactorY - 1) * 15;
		imgH = imgH + (page.appEnv.scaleFactorY - 1) * 15;
		
		return {
			"type":"icon","id":id+"topbg","pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["back_btn"]([-sw / 2 + 20 + (70 + (page.appEnv.scaleFactorY - 1) * 15) / 2, 0, 0], id + "back", cbobj, cbArr[0])},
				{css:cssLib["stdText"]([0, 0, 0], "title", txtSize, txtArr[0], itemParameter1)},
				{css:cssLib["key_icon_txt"]([(sw - imgW) / 2 - 20, 0, 0], id + "key", upImg, downImg, txtArr[1], imgW, imgH, itemParameter2, cbobj, cbArr[1])},
			],//End of: items
		};
	};
	
	//一个返回，一个文字提示，再2个图片key
	cssLib["modelTopBgFifth"] = function(id, sw, sh, txt, img1, img2, imgW, imgH, params, cbobj, cbArr)
	{
		var itemParameter = {
			tColor:[1, 1, 1, 1],
			tSize:36,
			edge:1,
			edgeColor:[1, 1, 1, 0.3],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0
		};
		var topBarImg = cssLib.genIconPath("topbar");
		
		imgW = imgW + (page.appEnv.scaleFactorY - 1) * 15;
		imgH = imgH + (page.appEnv.scaleFactorY - 1) * 15;
		
		return {
			"type":"icon","id":id+"topbg","pos":[sw >> 1, sh >> 1, 0],"w":sw,"h":sh,
			obj:{"type":"image", "tex":topBarImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			"ui_event":1,"anchor_h":1,"anchor_v":1,
			items:[
				{css:cssLib["back_btn"]([-sw/2 + 20 + (70 + (page.appEnv.scaleFactorY - 1) * 15) / 2, 0, 0], "", cbobj, cbArr[0])},
				{css:cssLib["stdText"]([0, 0, 0], "", [180, 58], txt, itemParameter)},
				{css:cssLib["key_icon"]([sw/2 - imgW - 10, 0, 0], id, img1, img1, imgW, imgH, params, cbobj, cbArr[1])},
				{css:cssLib["key_icon"]([sw/2 - imgW * 2 - 20, 0, 0], id, img2, img2, imgW, imgH, params, cbobj, cbArr[2])},
			],//End of: items
		};
	};
	
	//搜索模块控件 
	cssLib["search_model"] = function(pos, sw, sh, param, cbobj, cbArr)
	{
		var cssLib = this;
		var inputBoxW = sw - 140;
		var inputBoxH = 80;
		var textLib = page.appEnv.textLib;
		
		return{
			"type":"icon", "id":"searchModelItemBg","pos":pos, "w":sw,"h":sh,"ui_event":1, "anchor_h":0, "anchor_v":1,
			obj:{"type":"box", "color":[1, 1, 1, 0],},
			items:[
				{
					"type":"icon", "id":"searchModelItem","pos":[20, 0, 0], "w":sw - 40,"h":sh - 10, "ui_event":1, "anchor_h":0, "anchor_v":1,
					obj:{"type":"box", "color":[1, 1, 1, 1], "coner":10},
					items: [
						{css:cssLib["search"]([5, 0, 0], cbobj, cbArr[0], 40, 40, 1, {ah:0, av:1})},
						//{css:cssLib["inputBox"]([50, -inputBoxH/2, 0], "register", inputBoxW, inputBoxH, textLib.txtKeyTip, cbobj, cbArr[1], 0, 30, param.anchor_h, 0)},
						{css:cssLib["showTextEdit"]([50, -inputBoxH/2, 0], "searchEdit", inputBoxW, inputBoxH,
						"", textLib.txtKeyTip, 30, 0, cbArr[1], cbobj, 0, 10, true)},
						{css:cssLib["cancel"]([sw - 70, 0, 0], cbobj, cbArr[2], 40, 40, {ah:1, av:1})},
					],
				}
			],
		};
	};
	
	//最近搜索模块 
	cssLib["last_search"] = function(posY, id, txt, cbobj, cb, btnMsg)
	{
		var sw = page.appEnv.scrSize[0];
		var sh = 80;
		var textLib = page.appEnv.textLib;
		var tip = textLib.txtLastSeareachTip;
		var tipSize = page.appEnv.getTextSize(tip, 36, 0, sw);
		var txtSize = page.appEnv.getTextSize(txt, 30, 0, sw);
		
		return{
			"type":"key", "id":id,"pos":[0, posY, 0], "ui_event":1,"key":0,"anchor_h":0,"anchor_v":0,"down_scale":1,"w":sw,"h":sh,
			"state_up":{"type":"box", "w":sw, "h":sh, "ui_event":1, "color":[1, 1, 1, 1]},
			"state_down":{"type":"box", "w":sw, "h":sh, "ui_event":1, "color":[0, 0.71, 1, 0.8]},
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{css:cssLib["stdText"]([10, 30, 0], "tip", [txtSize.w, txtSize.h], txt, {tColor:[0, 0, 0, 0.4], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
			],
		};
	};
	
	//滚动条控件 
	cssLib["scrollBar"] = function(pos, sw, sh, barClr)
	{
		var cssLib = this;
		return{
			"type":"icon","id":"scrollBarBgDrak","pos":pos,"w":sw,"h":sh,
			obj:{"type":"box", "color":[0, 0, 0, 0.1], "ui_event": 1,"coner":3},
			items:[
				{
					"type":"icon","id":"scrollBarBgWhite","pos":[2, 2, 0],"w":sw - 4,"h":sh - 4,
					obj:{"type":"box", "color":[1, 1, 1, 1], "ui_event": 1,"coner":3},
					items:[
						{
							"type":"icon","id":"scrollBar","pos":[0,0,0],"w":sw - 4,"h":20,
							obj:{"type":"box", "color":barClr, "ui_event": 1,"coner":3},
						},
					],
					setBgPos:function(pos)
					{
						this.findItemById("scrollBar").setPos(pos);
					},
					
					setBarH:function(h)
					{
						this.findItemById("scrollBar").setH(h);
					},
				},
				
			],
			setCurPos:function(pos)
			{
				this.findItemById("scrollBarBgWhite").setBgPos(pos);
			},
			
			setCurH:function(h)
			{
				this.findItemById("scrollBarBgWhite").setBarH(h);
			},
		};
	};
	
	//listbox控件 
	cssLib["css_listbox"] = function(pos, id, arrange, listBoxSize, itemSize, isEnable, cbobj, cbArr)
	{
		var cssLib = this;
		return {
			"type":"listbox", "id":"listBox" + id, "pos":pos, "w":listBoxSize[0], "h":listBoxSize[1], "arrange":arrange,
			"item_w":itemSize[0], "item_h":itemSize[1],"show_align":1,"show_fx":1,"clip":1,"ui_event":1,"anchor_h":0,"anchor_v":0,
			"item_align": 0,"tick_event":1,"key":0,"sub_event":2,"enable": isEnable,
			line_items:[],
			isTicketEvent: true,
			
			//移动事件
			"onMoveTick": function(idx, msg, extra)
			{
				if(!this.isTicketEvent)
				{
					this.isTicketEvent = true;
					return;
				}
				DBOut("^^^^^^^^^^^^^onMoveTick^^^^^^^^^^^^^: " + idx);	
				
				if(!cbArr[1])
				{
					return;
				}
				cbArr[1].call(cbobj, idx);
			},
			
			showListBoxItem: function(idx, isTicketEvent)
			{
				this.isTicketEvent = isTicketEvent;
				this.showItem(idx);
			},
			
			//单击事件
			OnClick: function(msg, extra)
			{
				if(!cbArr[0])
				{
					return;
				}
				var subItem = this.itemAt(extra);
				cbArr[0].call(cbobj, msg, extra, subItem);
			},
		
			//更改列表里面的控件
			update: function(itemsArr)
			{
				this.clearItems();
				this.addItems(itemsArr);
			},
			
			insertItem:function(item)
			{
				this.addItem(item);
			},
		};
	};
	
	//取消key控件
	cssLib["cancel"] = function(pos, cbobj, cb, sw, sh, params)
	{
		var cssLib = this;
		var imgUrl = cssLib.genIconPath("cancel");
		return{
			"type":"key", "id":"cancel", "pos":pos, "w":sw, "h":sh, "ui_event":1, "key":0,  "anchor_h":params.ah, "anchor_v":params.av, "down_scale":0.98,
			"state_up":{"type":"image", "tex":imgUrl, "tex_u":0, "tex_v":0, "tex_uw":1, "pos":[0, 0, 0], "w":sw, "h":sh, "tex_vh":1,},
			"state_down":{"type":"image", "tex":imgUrl, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh, "tex_vh":1, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra);
			},
		};
		
	};
	
	//搜索key控件 
	cssLib["search"] = function(pos, cbobj, cb, sw, sh, type, param)
	{
		var cssLib = this;
		var imgUrlUp;
		var imgUrlDown;
		if(type == 1)
		{
			imgUrlUp = cssLib.genIconPath("sereach_gray");
			imgUrlDown = cssLib.genIconPath("sereach_gray");
		}
		else
		{
			imgUrlUp = cssLib.genIconPath("sereach_unselect");
			imgUrlDown = cssLib.genIconPath("sereach_select");
		}

		return{
			"type":"key", "id":"search","pos":pos,"w":sw,"h":sh,"ui_event":1,"key":0, "anchor_h":param.ah,"anchor_v":param.av,"down_scale":0.98,
			"state_up":{"type":"image", "tex":imgUrlUp, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh,"tex_vh":1,},
			"state_down":{"type":"image", "tex":imgUrlDown, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":sw,"h":sh,"tex_vh":1, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra);
			},
		};
	};
	
	//有背景色的文字key控件 
	cssLib["key_box_txt"] = function(pos, id, cbobj, cb, sw, sh, text, fs, bgclr, txtclr, edgclr, btnMsg, coner)
	{
		var params = {fs:fs, scale:1, upclr:txtclr, downclr:txtclr, edgeclr:edgclr, edge:0, align_h:1, align_v:1, anchor_v:0, anchor_h:0};
		return{
			"type":"icon", "id":id,"pos":pos,"auto_size":0,"w":sw,"h":sh,"ui_event":1,
			"anchor_h":0,"anchor_v":0,
			obj:{"type":"box", "color":bgclr, "coner":coner?coner:0},
			items:[
				{css:cssLib["key_txt"]([0, 0, 0], cbobj, cb, sw, sh, text, params, btnMsg)},
			],
		};
	};
	
	//文字key控件 
	cssLib["key_txt"] = function(pos, cbobj, cb, sw, sh, text, params, btnMsg)
	{
		return{
			"type":"key", "id":"","pos":pos, "ui_event":1,"key":0,"anchor_h":params.anchor_h,"anchor_v":params.anchor_h,"down_scale":params.scale,"w":sw,"h":sh,
			"state_up":{"type":"text", "text":text, "color":params.upclr,"font_size":params.fs, "w":sw,"h":sh,"align_h":params.align_h, "align_v":params.align_v,"edge":params.edge, "edge_color":params.edgeclr, },
			"state_down":{"type":"text", "text":text, "color":params.downclr,"font_size":params.fs, "w":sw,"h":sh,"align_h":params.align_h, "align_v":params.align_v,"edge":params.edge, "edge_color":params.edgeclr, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra, btnMsg);
			},
		};
	};
	
	
	//用于我中的用户数据等各项key事件
	cssLib["my_custom_bar_key1"] = function(pos, id, sw, sh, imgArr, imgwArr, imghArr, textArr, cbobj, cb)
	{
		var text1_size = 0;
		var text2_size = 0;
		if(textArr[1])
		{
			text1_size = page.appEnv.getTextSize(textArr[1], 30, 0, sw);
		}
		
		if(textArr[2])
		{
			text2_size = page.appEnv.getTextSize(textArr[2], 30, 0, sw);
		}
		
		var len1 = textArr[1] ? text1_size.w : 0;
		var len2 = textArr[2] ? text2_size.w : 0;
		
		return{
			"type":"key", "id":id,"pos":pos, "ui_event":1,"key":0,"anchor_h":0,"anchor_v":1,"down_scale":1,"w":sw,"h":sh,
			"state_up":{"type":"box", "w":sw, "h":sh, "ui_event":1, "color":[1, 1, 1, 1]},
			"state_down":{"type":"box", "w":sw, "h":sh, "ui_event":1, "color":[0, 0.71, 1, 0.8]},
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra);
			},
			items:[
				{css:cssLib["simpleIcon"]([30, 0, 0], "flag", imgArr[0], imgwArr[0], imghArr[0], 0, 1)},
				{css:cssLib["stdText"]([imgwArr[0] + 50, 0, 0], "tip", [180, 30], textArr[0], {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				{css:cssLib["stdText"]([imgwArr[0] + 50 + len1 + 50, 0, 0], "phoneNumTip", [len1, 30], textArr[1], {tColor:[0, 0, 0, 0.3], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0}), display:textArr[1] ? 1 : 0},
				{css:cssLib["stdText"]([sw - imgwArr[1] - len2 - 20, 0, 0], "statusTip", [len2, 30], textArr[2], {tColor:[0.51, 0.76, 0.07, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0}), display:textArr[2] ? 1 : 0},
				{css:cssLib["simpleIcon"]([sw - imgwArr[1] - 10, 0, 0], "arrow", imgArr[1], imgwArr[1], imghArr[1], 0, 1)},
			],
		};
	};
	
	//用于我中的软件信息等各项key事件
	cssLib["my_custom_bar_key2"] = function(pos, id, sw, sh, img, imgW, imgH, textArr, cbobj, cb)
	{
		var len = textArr[1] ? textArr[1].length * 15 : 0;
		
		return{
			"type":"key", "id":id,"pos":pos, "ui_event":1,"key":0,"anchor_h":0,"anchor_v":1,"down_scale":1,"w":sw,"h":sh,
			"state_up":{"type":"box", "w":sw, "h":sh, "color":[1, 1, 1, 1]},
			"state_down":{"type":"box", "w":sw, "h":sh, "color":[0, 0.71, 1, 0.8]},
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra);
			},
			items:[
				{css:cssLib["stdText"]([30, 0, 0], "tip", [180, 28], textArr[0], {tColor:[0, 0, 0, 0.4], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				{css:cssLib["stdText"]([(sw - len) >> 1, 0, 0], "phoneNumTip", [180, 28], textArr[1], {tColor:[0, 0, 0, 0.4], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:0, anchor_v:1, wrap:0}), display:textArr[1] ? 1 : 0},
				{css:cssLib["simpleIcon"]([sw - imgW - 10, 0, 0], "arrow", img, imgW, imgH, 0, 1)},
			],
		};
	};
	
	//图片文本控件
	cssLib["icon_txt"] = function(pos, id, img, imgW, imgH, text, fs, txtClr)
	{
		var cssLib = this;
		var itemParameter = {tColor:txtClr, tSize:fs, align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap: 0,};
		var  txt = "" + text;
		img = cssLib.genIconPath(img);
		
		return{
			"type":"icon", "id":id,"pos":pos,"w":imgW,"h":imgH,"anchor_h":1,"anchor_v":1,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
			items:[
				{
					"type":"icon", "id":"iconTxt", "pos":[0, 0, 0], "auto_size":0,"anchor_h":1, "anchor_v":1, 
					obj:{
						"type":"text", "text":txt, "color":txtClr, "font_size":fs, 
						"align_h":1, "align_v":1, "wrap":0, 
					},
					_setText:function(text)
					{
						if(!this.txtFace)
						{
							this.txtFace = this.getGraphicObj();
						}
						this.txtFace.setText(text);
					},
				},
			],
		};
	};
	
	//图片数字显示控件 
	cssLib["icon_number"] = function(pos, id, img, imgW, imgH, text, fs, txtClr, isEdg, edgClr)
	{
		var cssLib = this;
		var itemParameter = {tColor:txtClr, tSize:fs, edge:isEdg, edgeColor:edgClr, align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap: 0,};
		var  txt = "" + text;
		img = cssLib.genIconPath(img);
		
		return{
			"type":"icon", "id":id,"pos":pos,"w":imgW,"h":imgH,"anchor_h":1,"anchor_v":1,
			"display":text > 0 ? 1:0,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
			items:[
				{
					"type":"icon", "id":"iconTxt", "pos":[0, 0, 0], "auto_size":0,"anchor_h":1, "anchor_v":1, 
					obj:{
						"type":"text", "text":txt, "color":txtClr, "font_size":fs, 
						"edge":isEdg, "edge_color":edgClr, "align_h":1, "align_v":1, "wrap":0, 
					},
					setText:function(text)
					{
						if(!this.txtFace)
						{
							this.txtFace=this.getGraphicObj();
						}
						this.txtFace.setText(text);
					},
				},
			],
			_setIconW:function(w)
			{
				this.setW(w);
			},
		};
	};
	
	//图标下面一行文字说明 
	cssLib["logo_undeline_txt"] = function(pos, id, img, imgW, imgH, text, fs, txtClr, isEdg, edgClr)
	{
		var cssLib = this;
		var  txt = "" + text;
		img = cssLib.genIconPath(img);
		
		return{
			"type":"icon", "id":id,"pos":pos,"w":imgW,"h":imgH,"anchor_h":1,"anchor_v":1,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
			items:[
				{
					"type":"icon", "id":"iconTxt", "pos":[0, (imgH >> 1) + fs, 0], "auto_size":0,"anchor_h":1, "anchor_v":1, 
					obj:{
						"type":"text", "text":txt, "color":txtClr, "font_size":fs, 
						"edge":isEdg, "edge_color":edgClr, "align_h":1, "align_v":1, "wrap":0, 
					},
					setText:function(text)
					{
						if(!this.txtFace)
						{
							this.txtFace = this.getGraphicObj();
						}
						this.txtFace.setText(text);
					},
					
					setColor:function(clr)
					{
						if(!this.txtFace)
						{
							this.txtFace = this.getGraphicObj();
						}
						this.txtFace.setColor(clr);
					},
				},
			],
		};
	};
	
	//返回按钮 
	cssLib["back_btn"] = function(pos, id, cbobj, cb)
	{
		var cssLib = this;
		var imgUrlUp = cssLib.genIconPath("back_unselect");
		var imgUrlDown = cssLib.genIconPath("back_select");
		var imgW = 70 + (page.appEnv.scaleFactorY - 1) * 15;
		var imgH = 70 + (page.appEnv.scaleFactorY - 1) * 15;
		return{
			"type":"key", "id":"backkey","pos":pos,"w":imgW,"h":imgH,"ui_event":1,"key":0, "anchor_h":1,"anchor_v":1,"down_scale":0.98,
			"state_up":{"type":"image", "tex":imgUrlUp, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":imgW,"h":imgH,"tex_vh":1,},
			"state_down":{"type":"image", "tex":imgUrlDown, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":imgW,"h":imgH,"tex_vh":1, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra);
			},
		};
	};
	
	//图片的key 
	cssLib["key_icon"] = function(pos, id, upImg, downImg, imgW, imgH, params, cbobj, cb, btnMsg)
	{
		var cssLib = this;

		upImg = cssLib.genIconPath(upImg);
		downImg = cssLib.genIconPath(downImg);
		
		return{
			"type":"key", "id":id,"pos":pos,"w":imgW,"h":imgH,"ui_event":1,"key":0, "anchor_h":params.ah,"anchor_v":params.av,"down_scale":params.scale,
			"state_up":{"type":"image", "id":"upSpl", "tex":upImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
			//"state_down":{"type":"image", "id":"downSpl", "tex":downImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1, },
			state_disabled:{"type":"image", "id":"downSpl", "tex":downImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1, },
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
			_setPos:function(pos)
			{
				this.setPos(pos);
			}
		};
	};
	
	cssLib["key_icon_txt"] = function(pos, id, upImg, downImg, txt, imgW, imgH, params, cbobj, cb, btnMsg, state)
	{
		var cssLib = this;
		upImg = cssLib.genIconPath(upImg);
		downImg = cssLib.genIconPath(downImg);
	
		return{
			"type":"key", "id":id,"pos":pos,"w":imgW,"h":imgH,"ui_event":1,"key":0, "anchor_h":params.anchor_h ? params.anchor_h : 0,"anchor_v":params.anchor_v ? params.anchor_v : 1,"down_scale":params.scale ? params.scale : 1,
			"state_up":{
				"type":"smart", 
				objs:[
					{
						"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
						obj:{"type":"image","tex":upImg, "id":"upSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
					},
					{
						"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
						obj:{
							"type":"text", "text":txt, "color":params.tColor, 
							"font_size":params.tSize, "align_h":params.align_h, 
							"align_v":params.align_v, "edge":params.edge, 
							"edge_color":params.edgeColor, "id":"upText", 
						},
					},
				],
			},
		
			"state_down":null,
			
			_setText:function(text)
			{
				if (this.upText==null)
				{
					this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
					//this.downText = this.getGraphicObj(1).getObj(1).findObjById("downText");
				}
				this.upText.setText(text);
				//this.downText.setText(text);
			},
			
			_getText:function()
			{
				if (this.upText==null)
				{
					this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
				}
				return this.upText.getText();
			},
			
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg, state);
			},
		};
	};
	
	//充值类型key事件 
	cssLib["recharge_type_key"] = function(id, img, text, txtClr, isLocal)
	{
		var cssLib = this;
		var appEnv = page.appEnv;
		var imgW = 104 + (page.appEnv.scaleFactorX - 1) * 15;
		var imgH = 104 + (page.appEnv.scaleFactorX - 1) * 15;

		if(isLocal)
		{
			img = cssLib.genIconPath(img);
		}

		return{
			"type":"icon","id":id + "_icon", "w":imgW, "h":imgH, "ui_event":1, "pos":[0, 10, 0], "anchor_h":0, "anchor_v":0,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
			items: [
				{
					"type":"icon", "id":id, "pos":[imgW >> 1, imgH + 15, 0], "anchor_h":1, "anchor_v":0, 
					obj:{
						"type":"text", "text":text, "color":txtClr, "font_size":26, 
						"edge":0, "edge_color":[1, 1, 1, 1], "align_h":1, "align_v":1, "wrap":0, 
					},
					setText:function(text)
					{
						if(!this.txtFace)
						{
							this.txtFace = this.getGraphicObj();
						}
						this.txtFace.setText(text);
					},

					setColor:function(clr)
					{
						if(!this.txtFace)
						{
							this.txtFace = this.getGraphicObj();
						}
						this.txtFace.setColor(clr);
					},
				},
			],
		};
	};
	
	//充值类型的工具条 
	cssLib["recharge_type_toolbar"] = function(pos, id, sw, sh, img, imgW, imgH, text, cbobj, cb, btnMsg)
	{
		var cssLib = this;

		return{
			"type":"key", "id":id + "key","pos":pos,"w":sw,"h":sh,"ui_event":1,"key":0, "anchor_h":1,"anchor_v":1,"down_scale":1,
			"state_up":{"type":"box", "color":[1, 1, 1, 0.4], "w":sw, "h":sh,},
			"state_down":{"type":"box", "color":[1, 1, 1, 0.4], "w":sw, "h":sh, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{
					"type":"icon", "id":id + "txt", "pos":[-20, 0, 0], "anchor_h":1, "anchor_v":1, 
					obj:{
						"type":"text", "text":text, "color":[0, 0, 0, 0.3], "font_size":28, 
						"edge":0, "edge_color":[], "align_h":1, "align_v":1, "wrap":0, 
					},
					items:[
						{css:cssLib["simpleIcon"]([56, 0, 0], id, img, imgW, imgH, 1, 1)},
					],
				},
			],
		};
	};
	
	//文字key控件 
	cssLib["key_txt"] = function(pos, cbobj, cb, sw, sh, text, params, btnMsg)
	{
		return{
			"type":"key", "id":"","pos":pos, "ui_event":1,"key":0,"anchor_h":params.anchor_h,"anchor_v":params.anchor_h,"down_scale":params.scale,"w":sw,"h":sh,
			"state_up":{"type":"text", "text":text, "color":params.upclr,"font_size":params.fs, "w":sw,"h":sh,"align_h":params.align_h, "align_v":params.align_v,"edge":params.edge, "edge_color":params.edgeclr, },
			"state_down":{"type":"text", "text":text, "color":params.downclr,"font_size":params.fs, "w":sw,"h":sh,"align_h":params.align_h, "align_v":params.align_v,"edge":params.edge, "edge_color":params.edgeclr, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra, btnMsg);
			},
		};
	};
	
	//按下时背景色变灰的key事件
	cssLib["key_boxgray_txt"] = function(sw, sh, text, textSize, cbobj, cb, btnMsg)
	{
		var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1};
		
		return{
			"type":"key", "id":"boxkey", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1, "anchor_h":0,"anchor_v":1, "down_scale":1,
			"state_up":{"type":"box", "color":[1, 1, 1, 1], "w":sw, "h":sh},
			"state_down":{"type":"box",  "color":[0, 0.71, 1, 0.8], "w":sw, "h":sh, },
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{css:cssLib["stdText"]([30, 0, 0], "", [textSize.w, textSize.h], text, itemParameter)},
			],
		};
	};
	
	//输入控件
	cssLib["showTextEdit"]=function(pos, id, w, h, text, hint, fs, btnMsg, cb, cbobj, type, coner, isNotShowEdge, align_v, warnObj)
	{
		var cssLib = this;
		if(0 == align_v)
		{
			align_v = 0;
		}
		else if(!align_v)
		{
			align_v = 1;
		}
		else{}
		
		return {
			"type":"icon", "id":"inputBoxBg" + id, "pos":pos, "w":w, "h":h,
			obj:{
				"type":"smart", 
				objs:[
					{
						"smtx":0, "smty":0, "smtw":w, "smth":h, 
						obj:{"type":"box", "color":[1, 1, 1, 1], "edge":isNotShowEdge?0:1, "edge_color":[0.8, 0.8, 0.8, 1], "coner": coner?coner:0},
					},
					{"smtx":0, "smty":0, "smtw":w, "smth":isNotShowEdge?0:1, obj:{"type":"box", "color":[0.5, 0.5, 0.5, 1], "coner": coner?coner:0}},
					{
						"smtx":0, "smty":0, "smtw":w - 12, "smth":h, 
						obj:{
							"type":"text", "text":hint, "color":[0, 0, 0, 0.2], "font_size":fs, 
							"align_v":align_v, "id":"Hint", 
						},
					},
				],
			},
			"ui_event":1,"objHint":null, "objText":null, "appEnv":page.appEnv, "editW":w, "fontSize":fs, "editH":h,
			//"objEvent":null,
			items:[
				{
					"type":"edit", "id":"Text","pos":[0, 0, 0],"w":w,"h":h,"text":text, "wrap":1,
					"font_size":fs, "color":[0, 0, 0, 1], "align_h":0, "align_v":align_v, "password":type,
					OnEdit:function(msg, extra)
					{
						text = this.getText();
						if(text.length > 20)
						{
							if(warnObj)
							{
								warnObj.call(cbobj);
								return;
							}
						}
						
						if(text.length)
						{
							this.edBox.objHint.setDisplay(0);
						}
						else
						{
							this.edBox.objHint.setDisplay(1);
						}
						if(this.edBox.OnEdit)
						{
							this.edBox.OnEdit();
						}
					},
					
					OnEditUpdate:function()
					{
						var txt = this.getText();
						cb.call(cbobj, txt, btnMsg);
						//this.OnEditEnd();
						this.endEdit();
					},
					
					OnEditEnd:function()
					{
						var txt = this.getText();
						cb.call(cbobj, txt, btnMsg);
					},
					
					_setText:function(txt)
					{
						this.setText(txt);
					},
				},
			],//End of: items
					
			OnCloseEdit:function()
			{
				this.findObjById("Text").endEdit();
			},
					
			OnCreate:function()
			{
				this.objHint = this.findObjById("Hint");
				this.objText = this.findObjById("Text");
				//this.objEvent = this.findObjById("Event");
				this.objText.edBox=this;
			},

			OnClearClk:function(msg)
			{
				if(msg == 0)
				{
					this.getFather().setText("");
				}
			},
			
			setText:function(text)
			{
				var otext = this.objText;
				text = text?(""+text):"";
				otext.setText(text);
				this.objHint.setDisplay(text.length > 0 ? 0 : 1);
				if(this.OnEdit)
				{
					this.OnEdit();
				}
			},
			
			getText:function()
			{
				var otext = this.objText;
				return otext.getText();
			},
			setDisplayHint:function(f)
			{
				this.objHint.setDisplay(f);
			},
		};
	};
	
	//a-z字母状态栏 
	cssLib["word_state_bar"] = function(pos, sw, sh, bgclr, fs, cbobj, cb)
	{
		var words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];
		var startY = 2;
		var wordW = 20;
		var wordH = 20;
		var gap = (sh - 4 - wordH * 27) / 27; 
		var css = [];
		
		for(var i = 0; i < 27; i++)
		{
			css[i] = {
				"type":"key", "id":"wordKey" + i,"pos":[0, startY + i * wordH + i * gap, 0],"w":wordW,"h":wordH,"ui_event":1,"key":0, "anchor_h":1,
				"anchor_v":0, "down_scale":1,
				"state_up":{
					"type":"smart", 
					objs:[
						{
							"smtx":0, "smty":0, "smtw":wordW, "smth":wordH, 
							obj:{
								"type":"text", "text":words[i], "color":[0, 0.71, 1, 1], 
								"font_size":fs ? fs : 16, "align_h":1, "align_v":1,
							},
						},
					],
				},
			
				"state_down":null, "which":i,
			
				OnClick:function(msg, extra)
				{
					if(!cb)
					{
						return;
					}
					cb.call(cbobj, msg, extra, this.which);
				},
			};
		}
		return{
			"type":"icon", "id":"wordstatebar","pos":pos,"w":sw,"h":sh,"anchor_h":1,"anchor_v":0,"ui_event":1,
			"obj":{"type":"box", "color":[1, 1, 1, 0],"coner":2,},
			items:css,
		};
	};
	
	//下划线 
	cssLib["under_line"] = function(pos, sw)
	{
		return{
			"type":"icon", "pos":pos, "w": sw, "h":1,
			obj:{"type":"box", "color":[0, 0, 0, 1]},
		};
	};
	
	
	//订单模块
	cssLib["order_icon"] = function(pos, id, img, imgW, imgH, tipTxt, cbobj, cb, btnMsg)
	{
		var cssLib = this;
		img = cssLib.genIconPath(img);
		var tipTxtSize = page.appEnv.getTextSize(tipTxt, 24, 0, imgW);
		
		return {
			"type":"key", "id":id, "pos":pos, "w":imgW, "h":imgH, "ui_event":1, "key":0,  "anchor_h":1, "anchor_v":0, "down_scale":0.98,
			"state_up":{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1, "pos":[0, 0, 0], "w":imgW, "h":imgH, "tex_vh":1,},
			"state_down":{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"w":imgW,"h":imgH, "tex_vh":1, },
			OnClick:function(msg, extra)
			{
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[

				{css:cssLib["stdText"]([0, imgH + 5, 0], "title", [tipTxtSize.w, tipTxtSize.h], tipTxt, {tColor:[0, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:0, anchor_h:1, anchor_v:0, wrap:0})},
				{css:cssLib["stdText"]([20 + (tipTxtSize.w >> 1), imgH + 5, 0], "numTip", [imgW, 24], "(0)", {tColor:[1, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:0, anchor_h:1, anchor_v:0, wrap:0})},
			],
		};
	};
	
	//订单详细信息
	cssLib["order_detail_info"] = function(y, id, textArr, imgArr, cbobj, cbArr, btnMsg, state, btnTxt1, btnEvent1, btnTxt2, btnEvent2, btnTxt3, btnEvent3)
	{
		var cssLib = this;
		var sw = page.appEnv.scrSize[0];
		var sh = 330;
		var textLib = page.appEnv.textLib;
		var btnCopyIcon = "btn1";
		
		var text0_size  = page.appEnv.getTextSize(textArr[0], 30, 0, sw);
		var text1_size  = page.appEnv.getTextSize(textArr[1], 30, 1, sw - 190);
		var text2_size  = page.appEnv.getTextSize(textArr[2], 20, 0, sw);
		var text3_size  = page.appEnv.getTextSize(textArr[3], 20, 0, sw);
		var text4_size  = page.appEnv.getTextSize(textArr[4], 30, 0, sw);
		var text5_size  = page.appEnv.getTextSize(textArr[5], 30, 0, sw);
		var text6_size  = page.appEnv.getTextSize(textArr[6], 30, 0, sw);
		var text7_size  = page.appEnv.getTextSize(textArr[7], 30, 0, sw);

		var itemParameter = {tColor:[1, 1, 1, 1], tSize:24, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		var css3 = null;
		var css4 = null;
		if(imgArr[2])
		{
			css3 = {css:cssLib["key_icon_txt"]([sw - 220, 295, 0], "delOrder", imgArr[2], imgArr[2], btnTxt2, 100, 50, itemParameter, cbobj, btnEvent2, btnMsg, state)};
		}
		
		if(imgArr[3])
		{
			css4 = {css:cssLib["key_icon_txt"]([sw - 350, 295, 0], "agentPay", imgArr[3], imgArr[3], btnTxt3, 100, 50, itemParameter, cbobj, btnEvent3, btnMsg, state)};
		}
		//0=订单号, 1=商品名, 2=服务器, 3=卖家名, 4=购买的总数, 5=当前价格, 6=原价
		return {
			"type":"icon", "pos":[0, y, 0], "id":id, "w":sw, "h":sh, "ui_event":1,
			obj:{"type":"box", "color":[1, 1, 1, 1]},
			items:[
				{
					"type":"icon", "pos":[0, 0, 0], "id":id, "w":sw, "h":60,
					obj:{"type":"box", "color":[0, 0, 0, 0.1]},
					items:[
						{css:cssLib["stdText"]([30, 15, 0], "title", [text0_size.w, text0_size.h], textArr[0], {tColor:[0, 0, 0, 0.5], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					],
				},
			
				{css:cssLib["key_icon_txt"]([sw - 90, 30, 0], "btnCopy", btnCopyIcon, btnCopyIcon, textLib.txtCopyTip, 70, 40, itemParameter, cbobj, cbArr[0], btnMsg, state)},
				{
					"type":"icon", "pos":[0, 60, 0], "w":sw, "h":1,
					obj:{"type":"box", "color":[0, 0, 0, 0.2]},
				},
				
				{
					"type":"key", "id":id, "pos":[0, 61, 0], "w":sw, "h":130, "ui_event":1, "key":0,  "anchor_h":0, "anchor_v":0, "down_scale":1,
					"state_up":{"type":"box", "color":[1, 1, 1, 1]},
					"state_down":{"type":"box", "color":[0, 0.71, 1, 0.8],},
					OnClick:function(msg, extra)
					{
						cbArr[1].call(cbobj, msg, extra, btnMsg, state);
					},
					items:[
						{css:cssLib["url_icon"]([30, 15, 0], "icon", imgArr[0], 100, 100, 0, 0)},
						{css:cssLib["stdText"]([150, 5, 0], "productName", [sw - 190, text1_size.h], textArr[1], {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 0.3], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
						{css:cssLib["stdText"]([150, 70, 0], "useServer", [text2_size.w, text2_size.h], textArr[2], {tColor:[0, 0, 0, 0.6], tSize:22, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
						{css:cssLib["stdText"]([150, 100, 0], "sellname", [text3_size.w, text3_size.h], textArr[3], {tColor:[0, 0, 0, 1], tSize:22, edge:0, edgeColor:[0, 0, 0, 0.3], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					],
					
				},
			
				{
					"type":"icon", "pos":[0, 190, 0], "w":sw, "h":1,
					obj:{"type":"box", "color":[0, 0, 0, 0.2]},
				},
				{css:cssLib["stdText"]([30, 210, 0], "accountType", [text4_size.w, text4_size.h], textArr[4], {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				{css:cssLib["stdText"]([350, 210, 0], "count", [text5_size.w, text5_size.h], textArr[5], {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				{css:cssLib["stdText"]([460, 210, 0], "tipPrice", [textLib.txtTotalPriceTip.length * 30, 30], textLib.txtTotalPriceTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				{css:cssLib["stdText"]([535, 210, 0], "priceTip", [text6_size.w, text6_size.h], textArr[6], {tColor:[0.99, 0.51, 0.03, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				{
					"type":"icon", "pos":[0, 260, 0], "w":sw, "h":1,
					obj:{"type":"box", "color":[0, 0, 0, 0.2]},
				},
				
				{css:cssLib["stdText"]([30, 280, 0], "count", [text7_size.w, text7_size.h], textArr[7], {tColor:[0.99, 0.51, 0.03, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				css4,
				css3,
				
				{css:cssLib["key_icon_txt"]([sw - 90, 295, 0], "payFor", imgArr[1], imgArr[1], btnTxt1, 100, 50, itemParameter, cbobj, btnEvent1, btnMsg, state)},
			],
		};
	};
	
	//商品信息 
	cssLib["goods_information"] = function(pos, sw, sh, imgArr, imgWArr, imgHArr, textArr, starCnt, cbobj, cb)
	{
		var textLib = page.appEnv.textLib;
		var itemParameter = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1,
			anchor_v:1, wrap:0, scale:0.98};
		var itemParameter2 = {tColor:[1, 1, 1, 1], tSize:26, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:1, align_v:1,
			anchor_h:1, anchor_v:1, wrap:0};
		var starImg;;
		var imgUrl;
		var starImgW = 30;
		var starImgH = 30;
		var creditType = page.appEnv.computerSellerLevel(starCnt);
		imgUrl = page.appEnv.getSellerCreditIcon(creditType);
		starImg = this.genIconPath(imgUrl);

		var gap = starImgW * creditType + (creditType - 1) * 2;
		var starImgX = 0;
		var starCSS = [];
		for(var i = 0; i < creditType; i++)
		{
			starCSS[i] = {"type":"icon", "id":"star", "pos":[starImgX, 0, 0], "w":starImgW, "h":starImgH, "anchor_h":0,"anchor_v":0,
				obj:{"type":"image", "tex":starImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
			};
			starImgX += starImgW + 2;
		}
	
		var text2_y = 0;
		var text3_y = 0;
		var tip1 = textLib.txtGoodsDetailTip;
		var tip1Size = page.appEnv.getTextSize(tip1, 28, 0, sw);
		var text0_size = page.appEnv.getTextSize(textArr[0] + "", 40, 0, sw);
		var text1_size = page.appEnv.getTextSize(textArr[1], 30, 0, sw);
		var text2_size = page.appEnv.getTextSize(textArr[2], 30, 0, sw - 40 - imgWArr[1]);
		if(text2_size.w > (sw - 30 - imgWArr[1]))
		{
			text2_size = page.appEnv.getTextSize(textArr[2], 30, 1, sw - 40 - imgWArr[1]);
			text2_y = 20;
			text3_y = 90;
		}
		else
		{
			text2_y = 20;
			text3_y = 80;
		}
		
		var text3_size = page.appEnv.getTextSize(textArr[3], 24, 0, sw);
		var text4_size = page.appEnv.getTextSize(textArr[4], 30, 0, sw);
		var text6_size = page.appEnv.getTextSize(textArr[6], 30, 0, sw);
		//var text8_size = page.appEnv.getTextSize(textArr[8], 28, 0, sw);
		var text9_size = page.appEnv.getTextSize(textArr[9], 28, 0, sw);
		var text10_size = page.appEnv.getTextSize(textArr[10], 20, 0, sw);
		var text11_size = page.appEnv.getTextSize(textArr[11], 28, 0, sw);
		
		return{
			"type":"item", "pos":pos, "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
			items:[
				{
					"type":"icon", "pos":[0, 80, 0], "id":"saleManInfo", "w":sw, "h":40, "anchor_h":0, "anchor_v":1,
					obj:{"type":"box", "color":[1, 1, 1, 0.6]},
					items:[
						{css:cssLib["stdText"]([20, 0, 0], "goodsInfo", [tip1Size.w, tip1Size.h], tip1, {tColor:[0, 0, 0, 0.3], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					],
				},
				
				{
					"type":"icon", "id":"priceDetail", "pos":[0, 140], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
					obj:{"type":"box", "color":[1, 1, 1, 1]},
					items:[
						{css:cssLib["stdText"]([10, 0, 0], "curPrice", [text0_size.w, text0_size.h], textArr[0] + "", {tColor:[0.50, 0.75, 0.06, 1], tSize:40, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						{css:cssLib["stdText"]([10 + text0_size.w, 0, 0], "curPrice", [30, 30], textLib.txtYuanTip, {tColor:[0.50, 0.75, 0.06, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						{css:cssLib["stdText"]([text0_size.w + 80, 0, 0], "prePrice", [text1_size.w, text1_size.h], textArr[1], {tColor:[0, 0, 0, 0.3], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						{
							"type":"icon", "id":"line", "pos":[text0_size.w + 60, 0, 0], "w":text0_size.w + 40, "h":1, "anchor_h":0, "anchor_v":1,
							obj:{"type":"box", "color":[0, 0, 0, 0.3]},
						},
					],
				},
				
				{
					"type":"icon", "id":"goodsDetailBg", "pos":[0, 171], "w":sw, "h":130, "anchor_h":0, "anchor_v":0,
					obj:{"type":"box", "color":[1, 1, 1, 1]},
					items:[
						{css:cssLib["url_icon"]([20, (130 - imgHArr[1]) >> 1, 0], "icon", imgArr[1], imgWArr[1], imgHArr[1], 0, 0)},
						{css:cssLib["stdText"]([30 + imgWArr[1], text2_y, 0], "goodsName", [sw - 30 - imgWArr[1], text2_size.h], textArr[2], {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:0, wrap:1})},
						{css:cssLib["stdText"]([30 + imgWArr[1], text3_y, 0], "goodsType", [text3_size.w, text3_size.h], textArr[3], {tColor:[0, 0, 0, 0.4], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:0, wrap:0})},
					],
				},
				
				{
					"type":"icon", "pos":[0, 332], "id":"goodsNumber", "w":sw, "h":60, "anchor_h":0, "anchor_v":1, "ui_event":1,
					obj:{"type":"box", "color":[1, 1, 1, 0.6]},
					items:[
						{css:cssLib["stdText"]([30, 0, 0], "title", [text4_size.w, text4_size.h], textArr[4], {tColor:[0, 0, 0, 0.5], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						{css:cssLib["key_icon_txt"]([sw - imgWArr[2] / 2 - 20, 0, 0], "btnCopy", imgArr[2], imgArr[2], textArr[5], imgWArr[2], imgHArr[2], itemParameter, cbobj, cb, 0)},
					],
				},
				
				{
					"type":"icon", "pos":[0, 393], "id":"gameSer", "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
					obj:{"type":"box", "color":[1, 1, 1, 1]},
					items:[
						{css:cssLib["stdText"]([30, 0, 0], "title", [text6_size.w, text6_size.h], textArr[6], {tColor:[0, 0, 0, 0.7], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					],
				},
				
				{
					"type":"icon", "pos":[0, 430], "id":"payTypeDes", "w":sw, "h":150, "anchor_h":0, "anchor_v":0,
					obj:{"type":"box", "color":[1, 1, 1, 1]},
					items:[
						{css:cssLib["stdBtn"] ([20 + imgWArr[3] / 2, 10 + imgHArr[3] / 2, 0], "titleBg", [imgWArr[3], imgHArr[3]], imgArr[3], imgArr[3], textArr[7], itemParameter2, null, null)},
						{css:cssLib["stdText"]([20, 40 + imgHArr[2] / 2, 0], "title", [sw - 40, 28], textArr[8], {tColor:[0, 0, 0, 0.6], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
					],
				},
				
				{
					"type":"icon", "pos":[0, 590], "id":"saleManInfo", "w":sw, "h":90, "anchor_h":0, "anchor_v":0,
					obj:{"type":"box", "color":[1, 1, 1, 1]},
					items:[
						{css:cssLib["stdText"]([20, 10, 0], "saleManName", [text9_size.w, text9_size.h], textArr[9], {tColor:[0, 0, 0, 0.6], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
						{css:cssLib["simpleIcon"]([30 + text9_size.w, 10, 0], "flag", imgArr[4], imgWArr[4], imgHArr[4], 0, 0)},
						{css:cssLib["stdText"]([55 + text9_size.w, 17, 0], "identiTxt", [text10_size.w, text10_size.h], textArr[10], {tColor:[1, 1, 1, 1], tSize:20, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
						{css:cssLib["stdText"]([20, 50, 0], "credit", [text11_size.w, text11_size.h], textArr[11], {tColor:[0, 0, 0, 0.6], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
						{
							"type":"icon", "id":"star", "pos":[20 + text11_size.w, 50, 0], "w":starImgW, "h":starImgH, "anchor_h":0,"anchor_v":0,
							items:starCSS,
						},
					],
				},
			],
		};
	};
	
	//卖家商品信息  
	cssLib["sales_goods_info"] = function(icon, textArr, cbobj, cb, btnMsg)
	{
		var sw = page.appEnv.scrSize[0];
		var sh = 170;
		var iconW = 130;
		var iconH = 130;
		var textLib = page.appEnv.textLib;
		var discountIcon = "discount_flag";
		var discountIconW = 67;
		var discountIconH = 23;
		var salesManIcon = "salesman_flag";
		var salesManIconW = 82;
		var salesManIconH = 76;
		var salesManIconX = sw - salesManIconW;
		var gap = page.appEnv.appEnvGap;
		var text0_y = 10;
		var leftW = sw - 30 - iconW - salesManIconW - discountIconW;
		var text0_size = page.appEnv.getTextSize(textArr[0], 26, 0, leftW);
		if(text0_size.w <= leftW)
		{
			text0_y = 30;
		}
		else
		{
			text0_y = 10;
			text0_size = page.appEnv.getTextSize(textArr[0], 26, 1, leftW);
		}
		var text1_size = page.appEnv.getTextSize(textArr[1], 24, 0, sw);
		var text2_size = page.appEnv.getTextSize(textArr[2] + "", 24, 0, sw);
		var text4_size = page.appEnv.getTextSize(textArr[4], 40, 0, sw);
		var textYuanSize = page.appEnv.getTextSize(textLib.txtYuanTip, 30, 0, sw);
		var text5_size = page.appEnv.getTextSize(textArr[5], 24, 0, sw);
		
		var discountIconX = 40 + iconW + text0_size.w + discountIconW / 2;
		var discountIconY = 20;
		var salesManIconX = sw - salesManIconW;
		
		return{
			"type":"key", "pos":[0, btnMsg * gap, 0], "w":sw, "h":sh, "ui_event":1, "key":0,  "anchor_h":0, "anchor_v":0, "down_scale":1,
			"state_up":{"type":"box", "color":[1, 1, 1, 1]},
			"state_down":{"type":"box", "color":[0, 0.71, 1, 0.8]},
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{css:cssLib["url_icon"]([30, sh >> 1, 0], "", icon, iconW, iconH, 0, 1)},
				//商品类型 
				{css:cssLib["stdText"]([40 + iconW, text0_y, 0], "goodsDes", [text0_size.w, text0_size.h], textArr[0], {tColor:[0, 0, 0, 1], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
				//服务器 
				{css:cssLib["stdText"]([40 + iconW, 82, 0], "goodsUseSer", [text1_size.w, text1_size.h], textArr[1], {tColor:[0, 0, 0, 0.6], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				//卖家名称 
				//{css:cssLib["stdText"]([48 + iconW, 80, 0], "buycounts", [text2_size.w, text2_size.h], textArr[2], {tColor:[0, 0, 0, 0.6], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				//多少人购买了
				{css:cssLib["multi_text_three"]([40 + iconW, 130, 0], sw, sh, textLib.txtTotalTip, textArr[2] + "", textLib.txtBuyPersonTip, {r:0, g:0, b:0, a:0.6}, {r:1, g:0.71, b:0.03, a:1}, {r:0, g:0, b:0, a:0.6}, 24, 24, 24, {anchor_h:0, anchor_v:0, align_v:0, align_h:0, wrap:0})},
				
				//打折 
				{css:cssLib["icon_txt"]([discountIconX, discountIconY, 0], "discountFlag", discountIcon, discountIconW, discountIconH, textArr[3], 20, [1, 1, 1, 1]), display:!textArr[3]?0:1},
				{css:cssLib["simpleIcon"]([salesManIconX, 0, 0], "", salesManIcon, salesManIconW, salesManIconH, 0, 0)},
				//当前价格 
				{css:cssLib["stdText"]([sw - textYuanSize.w - 20 - text4_size.w, 50, 0], "curPrice", [text4_size.w, text4_size.h], textArr[4], {tColor:[0.51, 0.75, 0.05, 1], tSize:40, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				{css:cssLib["stdText"]([sw - textYuanSize.w - 20, 55, 0], "", [textYuanSize.w, textYuanSize.h], textLib.txtYuanTip, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				//原价 
				{css:cssLib["stdText"]([sw - text5_size.w - 20, 90, 0], "previousPrice", [text5_size.w, text5_size.h], textArr[5], {tColor:[0, 0, 0, 0.2], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
				
				{
					"type":"icon", "pos":[sw - text5_size.w - 30, 100, 0], "w":text5_size.w + 20, "h":1, "anchor_h":0, "anchor_v":0, 
					obj:{"type":"box", "color":[0, 0, 0, 0.2]},
				},
			],
		}
	};
	
	//格子控件 
	cssLib["gird_box"] = function(pos, sw, sh, itemW, itemH)
	{
		return{
			"type":"icon", "id":"girdBoxBg", "pos":pos, "w":sw, "h":sh, "ui_event":1, "anchor_h":0, "anchor_v":0,
			obj:{"type":"box", "color":[1, 1, 1, 1]},
			items:[
				{
					"type":"gridbox", "id":"gridBox","pos":[-10, 0, 0], "w":sw,"h":sh,"item_w":itemW, "item_h":itemH, 
					"anchor_h":0, "anchor_v":0,"enable":0,"clip":1,
					"sub_event":2,
					grid_items: [],
					OnClick: function(msg, extra)
					{
						if(1 == msg)
						{
							DBOut("***************格子控件触摸事件: " + (extra + 1));
							//var item = this.itemAt(extra);
							//cb.call(cbobj, msg, extra, item);
						}
					},

					//更新新的内部控件数据
					updateNewList: function(itemsArr)
					{
						this.clearItems();
						if(!itemsArr)
						{
							return;
						}
						this.addItems(itemsArr);
					},	
				},
			],
		};
	};
	
	//我的游戏特色图标控件  
	cssLib["my_game_icon"] = function(id, img, text, fs, txtClr, cbobj, cbArr, isDelete, isPushTop)
	{
		var cssLib = this;
		var txt = "" + text;
		var deleteIcon = "delete_game";
		var deleteIconW = 46;
		var deleteIconH = 41;
		//img = cssLib.genIconPath(img);
		var imgW = 112;
		var imgH = 112;
		var y = 0;
		//if(page.appEnv.scaleFactorY < 1)
		{
			y = 21;
		}
		
		return{
			"type":"icon", "pos":[imgW >> 1, y, 0], "id":"gameicon" + id,"w":imgW,"h":imgH,"anchor_h":0,"anchor_v":0, "ui_event":1,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
			ani:[
					{"type": "std", "fade":1, "fade_pos": [imgW >> 1, imgH >> 1, 0], "fade_alpha": 0.6, "fade_size":1}, 
					{type:"scale", mode:"rotate",filter:0},
					{type:"shade", color1:[1.0,1.0,1.0,1.0], color2:[0.5,0.5,0.5,1.0], start:1, gap:0.5},
				],
			
			items:[
				{
					"type":"icon", "id":"iconTxt", "pos":[imgW >> 1, imgH + 10, 0], "auto_size":0,"anchor_h":0, "anchor_v":0, 
					obj:{
						"type":"text", "text":txt, "color":txtClr, "font_size":fs, 
						"align_h":1, "align_v":1, "wrap":0, 
					},
					setText:function(text)
					{
						if(!this.txtFace)
						{
							this.txtFace=this.getGraphicObj();
						}
						this.txtFace.setText(text);
					},
				},
				{css:cssLib["key_icon"]([-5, -15, 0], "deleteBtn", deleteIcon, deleteIcon, deleteIconW, deleteIconH, {ah:0, av:0, scale:0.98}, cbobj, cbArr[0], id), display:isDelete},
				{css:cssLib["key_box_txt"]([0, 50, 0], "pullTopKey", cbobj, cbArr[1], 106, 50, "置顶", 24, [0, 0, 0, 0.4], [1, 1, 1, 1], [], id), display:isPushTop},
			],
		};
	};
	
	//类似苹果的那种项目排列列表控件 
	cssLib["view_arrange_listbox"] = function(sh, serialNum, detailTxts, cbobj, cb, isCollects, btnMsg)
	{
		var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1};
		var img;//= "btn_add_game";
		var imgW = 49;
		var imgH = 49;
		var innerBoxH = 80;
		var css = [];
		var y = 70;
		var len = detailTxts.length;
		var textSize = [];
		var sw = page.appEnv.scrSize[0] - 30;
		for(var i = 0; i < len; i++)
		{
			if(!isCollects[i])
			{
				img = ("btn_add_game");
			}
			else
			{
				img = ("green_select");
			}
			textSize[i] = page.appEnv.getTextSize(detailTxts[i], 30, 0, sw);
			css[i] = {"type":"icon", "id":"bg","pos":[0, y, 0], "w":sw, "h":innerBoxH, "anchor_h":0, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([30, 0, 0], "detailTxt" + (i + btnMsg), [textSize[i].w, textSize[i].h], detailTxts[i], itemParameter)},
					{css:cssLib["key_icon"]([sw - 50 - imgW, 0, 0], "collectBtn", img, img, imgW, imgH, {ah:0, av:1, scale:0.98}, cbobj, cb, i + btnMsg)},
					{
						"type":"icon", "id":"bg","pos":[0, innerBoxH >> 1, 0], "w":sw, "h":1, "anchor_h":0, "anchor_v":0, "ui_event":1,
						obj:{"type":"box", "color":[0, 0, 0, 0.3]},
					},
				],
			};
			y += innerBoxH + 1;
		}
		
		return{
			"type":"icon", "id":"gamelist","pos":[0, 20, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
			obj:{"type":"box", "color":[1, 1, 1, 0]},
			items:[
				{
					"type":"icon", "id":"titleBg","pos":[0, 0, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1, "ui_event":1,
					obj:{"type":"box", "color":[0, 0, 0, 0.1]},
					items:[
						{
							"type":"obj", "id":"", "pos":[30, 0, 0], "w":30, "h":50, "anchor_h":0, "anchor_v":1, "ui_event":1,
							obj:{
								"type":"text", "text":serialNum, "color":[0, 0, 0, 1], "font_size":30, 
								"align_h":0, "align_v":1, "wrap":0, 
							},
						},
					],
				},
				css,
			],
		};
	};	
	
	//类似苹果的那种项目排列列表控件2 
	cssLib["view_arrange_listbox2"] = function(sh, serialNum, detailTxts, cbobj, cb, btnMsg)
	{
		var itemParameter = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1};
		var innerBoxH = 80;
		var css = [];
		var y = 70;
		var len = detailTxts.length;
		var textSize = [];
		var sw = page.appEnv.scrSize[0] - 30;
		
		for(var i = 0; i < len; i++)
		{
			textSize[i] = page.appEnv.getTextSize(detailTxts[i], 30, 0, sw);
			css[i] = {
				"type":"icon", "id":"bg","pos":[0, y, 0], "w":sw, "h":innerBoxH, "anchor_h":0, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_boxgray_txt"](sw, innerBoxH, detailTxts[i], textSize[i], cbobj, cb, i + btnMsg)},
					
					{
						"type":"icon", "id":"bg","pos":[0, innerBoxH >> 1, 0], "w":sw, "h":1, "anchor_h":0, "anchor_v":0, "ui_event":1,
						obj:{"type":"box", "color":[0, 0, 0, 0.3]},
					},
				],
			};
			y += innerBoxH + 1;
		}
		
		return{
			"type":"icon", "id":"gamelist","pos":[0, 20, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
			obj:{"type":"box", "color":[1, 1, 1, 0]},
			
			items:[
				{
					"type":"icon", "id":"titleBg","pos":[0, 0, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1, "ui_event":1,
					obj:{"type":"box", "color":[0, 0, 0, 0.1]},
					items:[
						{
							"type":"obj", "id":"", "pos":[30, 0, 0], "w":30, "h":50, "anchor_h":0, "anchor_v":1, "ui_event":1,
							obj:{
								"type":"text", "text":serialNum, "color":[0, 0, 0, 1], "font_size":30, 
								"align_h":0, "align_v":1, "wrap":0, 
							},
						},
					],
				},
				css,
			],
		};
	};	
	
	//滚动框 
	cssLib["scrollBox"] = function(pos, sw, sh, cbobj, layout)
	{
		return{
			"type":"item", "id":"", "pos":pos, "w":sw, "h":sh, "ui_event":1,
			//obj:{"type":"box", "color":[1, 1, 1, 1]},
			items:[
				{
					"type":"scrollbox", "id":"scrollBox", "pos":[0, 0, 0], "w":sw, "h":sh, "key":-1, "always_drag":1,
					"ui_event":1, "layout":layout?1:0,
					line_items:[],
					OnTrigger:function(tag, dit, touch)
					{
						DBOut("Trigger: " + tag + ", " + dit + ", " + touch);
						if(!cbobj)
						{
							return;
						}
						cbobj.OnTrigger(tag, dit, touch);
					},
					
					insertItem:function(css)
					{
						this.addItem(css);
					},
				
					updateScrollBox:function(css)
					{
						this.clearItems();
						this.addItem(css);
					},
					
					insertItems:function(cssArr)
					{
						this.clearItems();
						this.addItems(cssArr);
					},
					
					clearItems:function()
					{
						this.clearItems();
					},
					
					setShowItem:function(idx)
					{
						this.showItem(idx);
					},

				},
			],
		};
	};
	
	//自己的聊天框
	cssLib["owner_talk_frame"] = function(frameW, frameH, txt)
	{
		var cssLib = this;
		var sw = page.appEnv.scrSize[0];
		var sh = 0;
		var img = cssLib.genIconPath("my_message_bar");
		var imgX = sw - frameW - 120; 
		var talkActorIcon = cssLib.genIconPath("owner_icon");
		var talkActorIconW = 80;
		var talkActorIconH = 80;
		if(frameH < talkActorIconH)
		{
			sh = talkActorIconH + 20;
		}
		else
		{
			sh = frameH + 40;
		}
		
		return{
			"type":"item", "pos":[imgX, 0, 0], "id":"myTalkFrame", "w":frameW, "h":sh,
			items:[
				{
					"type":"item", "pos":[0, 0, 0], "w":frameW, "h":frameH,
					items:[
						{
							"type":"icon", "pos":[0, 0, 0], "id":"myTalkFrame", "w":frameW, "h":frameH,
							obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1, "pos":[0, 0, 0], "w":frameW, "h":frameH, "tex_vh":1,},
						},
					],
					
				},
				
				{
					"type":"icon", "pos":[frameW + 30, -10, 0], "w":talkActorIconW, "h":talkActorIconH,
					obj:{"type":"image", "tex":talkActorIcon, "tex_u":0, "tex_uw":1, "tex_vh":1,},
				},
				
				{css:cssLib["stdText"]([10, 10, 0], "serverName", [frameW - 20, 24], txt, {tColor:[0, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
			],
		};
	};
	
	//对方聊天框
	cssLib["opponent_talk_frame"] = function(frameW, frameH, txt)
	{
		var cssLib = this;
		var sw = page.appEnv.scrSize[0];
		var sh = 0;
		var img = cssLib.genIconPath("saleman_message_bar");
		var imgX = sw - frameW - 120; 
		var talkActorIcon = cssLib.genIconPath("message_icon1");
		var talkActorIconW = 80;
		var talkActorIconH = 80;
		
		if(frameH < talkActorIconH)
		{
			sh = talkActorIconH + 20;
		}
		else
		{
			sh = frameH + 40;
		}

		return{
			"type":"item", "pos":[30 + talkActorIconW, 0, 0], "id":"otherTalkFrame", "w":frameW, "h":sh,
			items:[
				{
					"type":"item", "pos":[0, 0, 0], "w":frameW, "h":frameH,
					items:[
						{
							"type":"icon", "pos":[0, 0, 0], "id":"myTalkFrame", "w":frameW, "h":frameH,
							obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1, "pos":[0, 0, 0], "w":frameW, "h":frameH, "tex_vh":1,},
						},
					],
					
				},
				
				{
					"type":"icon", "pos":[-20 - talkActorIconW, -10, 0], "w":talkActorIconW, "h":talkActorIconH,
					obj:{"type":"image", "tex":talkActorIcon, "tex_u":0, "tex_uw":1, "tex_vh":1,},
				},
				
				{css:cssLib["stdText"]([10, 10, 0], "serverName", [frameW - 20, 24], txt, {tColor:[0, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1})},
			],
		};
	};
	
	//输入支付密码模块
	cssLib["input_paypwd"] = function(pos, cbobj, cbArr)
	{
		var cssLib = this;
		var textLib = page.appEnv.textLib;
		var sw = 300;
		var sh = 150;
		var inputBoxW = sw - 40;
		var inputBoxH = 40;
		var textLib = page.appEnv.textLib;

		return{
			"type":"icon", "id":"searchModelItemBg","pos":[(pos[0] - sw) / 2, (pos[1] - sh) / 2], "w":sw,"h":sh,"ui_event":1, "anchor_h":0, "anchor_v":0,
			obj:{"type":"box", "color":[0, 0.71, 1, 0.8], "coner":18},
			items:[
				{css:cssLib["stdText"]([sw >> 1, 10, 0], "tip", [210, 30], textLib.txtPayPasswordTip, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:0, anchor_h:1, anchor_v:0, wrap:0})},
				//{css:cssLib["inputBox"]([20, 50, 0], "register", inputBoxW, inputBoxH, "", cbobj, cbArr[0], 1, 30, 0, 0, 0, 8, true)},
				{css:cssLib["showTextEdit"]([20, 50, 0], "payFrame", inputBoxW, inputBoxH,
						"", "", 30, 0, cbArr[0], cbobj, 1, 8, true)},
						
				{css:cssLib["key_box_txt"]([(sw - 100) / 2, 100, 0], "", cbobj,  cbArr[1], 100, 40, textLib.OK, 30, [1, 0.71, 0.03, 1], [0, 0, 0, 1], [0, 0, 0, 0], 0, 8)},
			],
		};
	};
	
	//交易等候界面
	cssLib["trade_wait"] = function(cbobj, cb)
	{
		var cssLib = this;
		var textLib = page.appEnv.textLib;
		var sw = page.appEnv.scrSize[0];
		var sh = page.appEnv.scrSize[1];
		var btnImgW = 150;
		var btnImgH = 50;
		var rollSelectW = 19;
		var rollSelectH = 19;
		var startX = (sw - 224) >> 1;
		var size = page.appEnv.getTextSize(textLib.txtCheckingTradeResultTip, 40, 0, sw);
		return{
			"type":"icon", "id":"searchModelItemBg","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1, "anchor_h":0, "anchor_v":0,
			obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			items:[
				{
					"type":"icon", "id":"tip", "pos":[(sw - size.w) / 2, (sh - size.h) / 2 - 60, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "display":0,
					obj:{
						"type":"text", "pos":[0, 0, 0], "font_size":40, "anchor_h":0, "anchor_v":0, "align_h":0, "align_v":0, "w":size.w, "h":size.h,
						"edge":1, "edge_color":[0, 0, 0, 0.4],
						"color":[0, 0.71, 1, 1], "text": textLib.txtCheckingTradeResultTip, "wrap":0,
						"display":1,"fade":1, "fade_size":1, "fade_alpha":0,
					},
					ani:{"type":"flash", color1:[0, 0.71, 1.0, 1.0], color2:[1.0, 1.0, 1.0, 1], start:1, speed:5.0},
				},
				{css:cssLib["key_box_txt"]([(sw - btnImgW) >> 1, sh - btnImgH - 200, 0], "", cbobj,  cb, btnImgW, btnImgH, textLib.txtPayFinishTip, 30, [0, 0.71, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], 0)},
				{css:cssLib["stdPngIcon"]([startX, (sh - rollSelectH) >> 1, 0], "circle0", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([startX + 29, (sh - rollSelectH) >> 1, 0], "circle1", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([startX + 58, (sh - rollSelectH) >> 1, 0], "circle2", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([startX + 87, (sh - rollSelectH) >> 1, 0], "circle3", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([startX + 116, (sh - rollSelectH) >> 1, 0], "circle4", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
				{css:cssLib["stdPngIcon"]([startX + 145, (sh - rollSelectH) >> 1, 0], "circle5", [rollSelectW, rollSelectH], "roll_unselect", {anchor_h:0, anchor_v:0, ui_event:0,}, null, null, null),},
			],
		};
	};
	
	
	//按下时背景色变灰的key事件
	cssLib["key_boxgray_txt2"] = function(id, pos, sw, sh, cbobj, cb, btnMsg)
	{
		return{
			"type":"key", "id":id, "pos":pos, "w":sw, "h":sh, "ui_event":1, "anchor_h":0,"anchor_v":1, "down_scale":1, "display":0,
			"state_up":{"type":"box", "color":[1, 1, 1, 1], "w":sw, "h":sh},
			"state_down":{"type":"box",  "color":[0, 0.71, 1, 0.8], "w":sw, "h":sh, },
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
			items:[
				{css:cssLib["key_icon"]([sw - 31 / 2 - 30, 0, 0], id + "key", "arrow3", "arrow3", 31, 51, {ah:1, av:1, scale:1}, cbobj, null, 0)},
			],
		};
	};
//===================================================================================================================
//===================================================================================================================
//===================================================================================================================
	
/***************************/
	var SIZE=24;
	var cssLib=this.cssLib;
	
	var get3x3TypeTable=function(index)
	{
		var table={
			box_normal:[8,8,8,8],
			box_name:[12,12,12,12],
			box_exp:[8,0,8,0],
			box_barbg:[10,0,10,0],
			box_userexp:[10,0,10,0],
			box_power:[10,0,10,0],
			box_buddytime:[8,8,8,8],
			box_teaminfo:[50,50,50,50],
			box_btn_y:[56,30,56,30],
			box_btn_b:[56,30,56,30],
			box_itemlist:[36,36,36,46],

			box_listbg:[18,18,18,18],
			box_dungeonbg:[20,66,66,66],
			box_marquee:[24,0,36,0],
			box_teambg:[0,70,0,80]
		}
		return table[index];
	}
	var tableValue=function(a,b)
	{
		if (a==null)
		{
			return b;
		}
		return a;
	}
	//=========================TEXT===============================================================================
	{	
		//2种形式的字体混合
		cssLib["multi_text"] = function(pos, sw, sh, txt1, txt2, clr1, clr2, size1, size2, params)
		{
			return{
				"type":"icon", "pos":pos, "w":sw, "h":sh, "anchor_h":params.anchor_h, "anchor_v":params.anchor_v,
				obj:{"type":"box","color":[0, 0, 0, 0]},
				items:[
					{
						"type":"obj", "pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":params.anchor_h, "anchor_v":params.anchor_v,
						obj:{
							"type":"text",
							"js_text":[{text:txt1, size:size1,r:clr1.r, g:clr1.g, b:clr1.b, a:clr1.a},{text:txt2, size:size2, r:clr2.r, g:clr2.g, b:clr2.b, a:clr2.a}],
							wrap:params.wrap, align_h:params.align_h, align_v:params.align_v,
						},
					},
				]
			};
		};
		
		//3种形式的字体混合
		cssLib["multi_text_three"] = function(pos, sw, sh, txt1, txt2, txt3, clr1, clr2, clr3, size1, size2, size3, params)
		{
			return{
				"type":"icon", "pos":pos, "w":sw, "h":sh, "anchor_h":params.anchor_h, "anchor_v":params.anchor_v,
				obj:{type:"box","color":[0, 0, 0, 0]},
				items:[
					{
						"type":"obj", "pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":params.anchor_h, "anchor_v":params.anchor_v,
						obj:{
							"type":"text",
							"js_text":[{text:txt1, size:size1,r:clr1.r, g:clr1.g, b:clr1.b, a:clr1.a},{text:txt2, size:size2, r:clr2.r, g:clr2.g, b:clr2.b, a:clr2.a}, {text:txt3, size:size3, r:clr3.r, g:clr3.g, b:clr3.b, a:clr3.a}],
							wrap:params.wrap, align_h:params.align_h, align_v:params.align_v,
						},
					},
				]
			};
		};
		
		cssLib["stdText"] = function(pos, id, size, text, itemParameter){
			//itemParameter = this.stdText.itemparameterInit(itemParameter);
			if(itemParameter.wrap == 0 || itemParameter.wrap == 1)
			{
				itemParameter.wrap = itemParameter.wrap;
			}
			else
			{
				itemParameter.wrap = 0;
			}

			return {
				"type":"icon", "id":id, "pos":pos, "auto_size":0,"w":size[0], "h":size[1], 
				obj:{
					"type":"text", "text":text, "color":itemParameter.tColor, "font_size":itemParameter.tSize, 
					"edge":itemParameter.edge, "edge_color":itemParameter.edgeColor, "p_space":itemParameter.p_space?itemParameter.p_space:0, "l_space":itemParameter.l_space?itemParameter.l_space:0,
					"align_h":itemParameter.align_h, "align_v":itemParameter.align_v, "wrap":itemParameter.wrap, 
				},
				"anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, 
				_setText:function(text)
				{
					if(!this.txtFace)
					{
						this.txtFace=this.getGraphicObj();
					}
					this.txtFace.setText(text);
				},
				_getText:function()
				{
					if(!this.txtFace)
					{
						this.txtFace=this.getGraphicObj();
					}
					return this.txtFace.getText();
				},
				_setColor:function(colors)
				{
					if(!this.txtFace)
					{
						this.txtFace=this.getGraphicObj();
					}
					this.txtFace.setColor(colors);
				},
				_setPos:function(pos)
				{
					this.setPos(pos);
				},
			};
		}
		cssLib.stdText.create=function(box,pos,id,size,text,itemParameter)
		{
			var item;
			item=box.appendNewChild(cssLib.stdText(pos,id,size,text,itemParameter));
			return item;
		}
		cssLib.stdText.itemparameterInit=function(table)
		{
			table=table?table:{};
			var itemParameter={
			tColor:table.tColor?table.tColor:[1,1,1,1],
			tSize:table.tSize?table.tSize:SIZE,
			edge:tableValue(table.edge,1),
			edgeColor:table.edgeColor?table.edgeColor:[0,0,0,1],
			anchor_h:table.anchor_h?table.anchor_h:0,
			anchor_v:table.anchor_v?table.anchor_v:0,
			align_h:table.align_h?table.align_h:0,
			align_v:table.align_v?table.align_v:0
			}
			return itemParameter;
		};
		
		cssLib["textFineBig"] = function(text, kh, kv, ah, av, color)
		{
			var sw = page.appEnv.scrSize[0];
			var sh = page.appEnv.scrSize[1];

			return {
				"type":"icon", "w":sw, "h":sh, "pos":[sw >> 1, sh >> 1, 0], "anchor_h":kh, "anchor_v":kv,
				obj:{
					"type":"box", "color":[0, 0.71, 1, 1],//[0, 0.71, 1, 1]
				},
				items:[
					{
						"type":"icon", "w":sw, "h":sh, "anchor_h":1, "anchor_v":1,
						obj:{
							"type":"text", "pos":[0, 0, 0], "font_size":40, "anchor_h":kh, "anchor_v":kv, "align_h":ah, "align_v":av, "w":sw, "h":sh,
							"edge":1, "edge_color":[0, 0, 0, 0.4],
							"color":[0, 0, 0, 0.4], "text": text + "", "wrap":0,
							"display":1,"fade":1, "fade_size":1, "fade_alpha":0,
						},
						ani:{"type":"flash", color1:[1.0, 1.0, 1.0, 1.0], color2:[1.0, 1.0, 1.0, 0.5], start:1, speed:5.0},
					},
					
				],
				
			};
		};
		
		cssLib["loading"] = function()
		{
			var icon = "roll_select";
			var iconW = 26;
			var iconH = 26;
			var sw = page.appEnv.scrSize[0];
			var sh = page.appEnv.scrSize[1];
			var radiu = 100;
			var factor = 71;
			var load1X = (radiu * 2 - iconW) >> 1;
			var load1Y = -iconH;
			var load2X = load1X - factor - iconW / 2;
			var load2Y = radiu - factor + load1Y;
			
			var load3X = -iconW;
			var load3Y = (radiu * 2 - iconH) >> 1;
			
			var load4X = load3X + (radiu - factor);
			var load4Y = load3Y + factor;
			
			var load5X = load1X;
			var load5Y = radiu * 2;
			
			var load6X = load4X + factor * 2 + iconH;
			var load6Y = load4Y;
			
			var load7X = radiu * 2;
			var load7Y = load3Y;
			
			var load8X = load4X + factor * 2 + iconH;
			var load8Y = load2Y;
			
			return{
				"type":"item", "id":"loading", "pos":[(sw - radiu * 2)>> 1, (sh - radiu * 2) >> 1, 0], "w":radiu * 2, "h":radiu * 2,
				/*obj:{
					"type":"box", "color":[1, 0, 0, 1],
				},*/
				items:[
					{css:cssLib["simpleIcon"]([load1X, load1Y, 0], "load1", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load2X, load2Y, 0], "load2", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load3X, load3Y, 0], "load3", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load4X, load4Y, 0], "load4", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load5X, load5Y, 0], "load5", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load6X, load6Y, 0], "load6", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load7X, load7Y, 0], "load7", icon, iconW, iconH, 0, 0)},
					{css:cssLib["simpleIcon"]([load8X, load8Y, 0], "load8", icon, iconW, iconH, 0, 0)},
					{
						"type":"icon", "w":180, "h":180, "pos":[radiu, radiu, 0], "anchor_h":1, "anchor_v":1,
						obj:{
							"type":"box", "color":[1, 1, 1, 0],//[0, 0.71, 1, 1]
						},
						items:[
							{
								"type":"icon", "pos":[60, 40, 0], "w":100, "h":100, "anchor_h":1, "anchor_v":1,
								obj:{
									"type":"text", "pos":[0, 0, 0], "font_size":30, "anchor_h":1, "anchor_v":1, "align_h":1, "align_v":1, "w":1, "h":1,
									"edge":1, "edge_color":[0, 0, 0, 0.4],
									"color":[0, 0.71, 1, 1], "text":"loading...", "wrap":0,
									"display":1,"fade":1, "fade_size":1, "fade_alpha":0,
								},
								ani:{"type":"flash", color1:[1.0, 1.0, 1.0, 1.0], color2:[1.0, 1.0, 1.0, 0.5], start:1, speed:5.0},
							},
							
						],
						
					},
				],
			};
		};
		//=============================================
		cssLib["shadowText"] = function(pos,id,size,text,itemParameter){
			itemParameter = this.shadowText.itemparameterInit(itemParameter);
			return {
				"type":"icon", "id":id, "pos":pos, "auto_size":0,"w":size[0], "h":size[1], 
				obj:{
					"type":"text", "text":text, "color":[0, 0, 0, 1], "font_size":itemParameter.tSize, "edge":1, 
					"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
					"align_v":itemParameter.align_v, "wrap":1, 
				},
				"anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, "display":1,
				items:[
					{
						"type":"icon", "id":"","pos":[0, -2, 0],"auto_size":0,"w":"FW","h":"FH",
						obj:{
							"type":"text", "text":text, "color":itemParameter.tColor, 
							"font_size":itemParameter.tSize, "edge":itemParameter.edge, 
							"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
							"align_v":itemParameter.align_v, "wrap":1, 
						},
						"anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, "display":1,
					},
				],//End of: items

				_setText:function(text)
				{
					if(!this.txtShadow)
					{
						this.txtShadow=this.getGraphicObj();
						this.txtFace=this.firstChild().getGraphicObj();
					}
					this.txtShadow.setText(text);
					this.txtFace.setText(text);
				}
			};
		};
		cssLib.shadowText.create = function(box, pos, id, size, text, itemParameter)
		{
			var item;
			item = box.appendNewChild(cssLib.shadowText(pos, id, size, text, itemParameter));
			return item;
		};
		cssLib.shadowText.itemparameterInit = function(table)
		{
			table = table ? table : {};
			var itemParameter = {
				tColor:table.tColor?table.tColor:[1, 1, 1, 1],
				tSize:table.tSize?table.tSize:SIZE,
				edge:tableValue(table.edge, 1),
				edgeColor:table.edgeColor?table.edgeColor:[0, 0, 0, 1],
				anchor_h:table.anchor_h?table.anchor_h:0,
				anchor_v:table.anchor_v?table.anchor_v:0,
				align_h:table.align_h?table.align_h:0,
				align_v:table.align_v?table.align_v:0
			}
			return itemParameter;
		};
	}
	//=========================================ICON=============================================================================================
	{
		cssLib["simpleIcon"] = function(pos, id, imgUrl, imgW, imgH, ah, av)
		{
			var cssLib = this;
			imgUrl = cssLib.genIconPath(imgUrl);
			if(ah == 0 || ah == 1)
			{
				ah = ah;
			}
			else
			{
				ah = 0;
			}
			
			if(av == 0 || av == 1)
			{
				av = av;
			}
			else
			{
				av = 0;
			}
			return {
				"type":"icon","id":id, "w":imgW,"h":imgH,"ui_event":1,"pos":pos,"anchor_h":ah,"anchor_v":av,
				obj:{"type":"image", "tex":imgUrl,"tex_u":0,"tex_v":0,"tex_uw":1,"tex_vh":1,},
				
				_setIcon:function(image)
				{
					if (this.iconSpl == null)
					{
						this.iconSpl=this.getGraphicObj();
					}
					image = cssLib.genIconPath(image);
					this.iconSpl.setTexURL(image);
				},
				_setIconWH:function(w, h)
				{
					/*if (this.iconSpl == null)
					{
						this.iconSpl=this.getGraphicObj();
					}*/
					this.setW(w);
					this.setH(h);
				},
			};
		};
		
		//=====================直接用url地址绘图的lib==========================
		cssLib["url_icon"] = function(pos, id, imgUrl, imgW, imgH, ah, av)
		{
			var cssLib = this;
			//imgUrl = cssLib.genIconPath(imgUrl);
			if(ah == 0 || ah == 1)
			{
				ah = ah;
			}
			else
			{
				ah = 0;
			}
			
			if(av == 0 || av == 1)
			{
				av = av;
			}
			else
			{
				av = 0;
			}
			return {
				"type":"icon","id":id, "w":imgW,"h":imgH,"ui_event":1,"pos":pos,"anchor_h":ah,"anchor_v":av,
				obj:{"type":"image", "tex":imgUrl,"tex_u":0,"tex_v":0,"tex_uw":1,"tex_vh":1,},
			};
		};
		//=============================
		cssLib["stdPngIcon"] = function(pos, id, size, image, itemParameter, cb, cbobj, btnMsg){
			itemParameter = this.stdPngIcon.itemparameterInit(itemParameter);
			image = this.genIconPath(image);

			return {
				"type":"icon", "id":id, "pos":pos, "auto_size":0,"w":size[0], "h":size[1], 
				obj:{
					"type":"image", "tex":image, "tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1, 
					"id":"", 
				},
				"anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, 
				"ui_event":itemParameter.ui_event, "display":itemParameter.display, 

				OnClick:function(msg, extra)
				{
					if (cb != null)
					{
						cb.call(cbobj, msg, extra, btnMsg);
					}
				},
				_setIcon:function(image)
				{
					if (this.iconSpl == null)
					{
						this.iconSpl = this.getGraphicObj();
					}
					image = cssLib.genIconPath(image);
					this.iconSpl.setTexURL(image);
				},
			};
		};

		cssLib.stdPngIcon.create = function(box, pos, id, size, image, itemParameter, cb, cbobj, btnMsg)
		{
			var item;
			item = box.appendNewChild(cssLib.stdPngIcon(pos, id, size, image, itemParameter, cb, cbobj, btnMsg));
			return item;
		};
		cssLib.stdPngIcon.itemparameterInit = function(table)
		{
			table = table ? table:{};
			var itemParameter = {
				anchor_h:tableValue(table.anchor_h, 1),
				anchor_v:tableValue(table.anchor_v, 1),
				ui_event:tableValue(table.ui_event, 1),
				display:tableValue(table.display, 1),
			}
			return itemParameter;
		};
			
		//================================================	
		cssLib["stdBtn"] = function(pos, id, size, upImage, downImage, text, itemParameter, cb, cbobj, btnMsg){
				itemParameter = this.stdBtn.itemparameterInit(itemParameter);
				return {
					"type":"key", "id":id, "pos":pos, "w":size[0], "h":size[1], 
					state_up:{
						"type":"smart", 
						objs:[
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{"type":"image","tex":upImage, "id":"upSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
							},
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{
									"type":"text", "text":text, "color":itemParameter.tColor, 
									"font_size":itemParameter.tSize, "align_h":itemParameter.align_h, 
									"align_v":itemParameter.align_v, "edge":itemParameter.edge, 
									"edge_color":itemParameter.edgeColor, "id":"upText", 
								},
							},
						],
					},
					state_down:{
						"type":"smart", 
						objs:[
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{"type":"image","tex":downImage, "id":"downSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
							},
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{
									"type":"text", "text":text, "color":itemParameter.tColor, 
									"font_size":itemParameter.tSize, "align_h":itemParameter.align_h, 
									"align_v":itemParameter.align_v, "edge":itemParameter.edge, 
									"edge_color":itemParameter.edgeColor, "id":"downText", 
								},
							},
						],
					},
					"key":itemParameter.key, "display":1,"anchor_h":itemParameter.anchor_h, 
					"anchor_v":itemParameter.anchor_v, "ui_event":1,

					OnClick:function(msg, extra)
					{
						if(!cb)
						{
							return;
						}
						cb.call(cbobj, msg, extra, btnMsg);
					},
					
					_setIcon:function(upImage, downImage)
					{
						if (this.upSpl == null)
						{
							this.upSpl = this.getGraphicObj(0).getObj(0).findObjById("upSpl");
							this.downSpl = this.getGraphicObj(1).getObj(0).findObjById("downSpl");
						}
				
						if (upImage != null)
						{
							upImage = cssLib.genIconPath(upImage);
							this.upSpl.setTexURL(upImage);
						}
						if (downImage != null)
						{
							downImage = cssLib.genIconPath(downImage);
							this.downSpl.setTexURL(downImage);
						}
					},
					_setText:function(text)
					{
						if (this.upText == null)
						{
							this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
							this.downText = this.getGraphicObj(1).getObj(1).findObjById("downText");
						}
						this.upText.setText(text);
						this.downText.setText(text);
					},
					_setTextColor:function(color)
					{
						if (this.upText == null)
						{
							this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
							//this.downText = this.getGraphicObj(1).getObj(1).findObjById("downText");
						}
						this.upText.setColor(color);
						//this.downText.setText(text);
					},
				};
			};
			
			cssLib.stdBtn.create = function(box, pos, id, size, spl, upImage, downImage, text, itemParameter, cb, cbobj, btnMsg)
			{
				var item;
				item = box.appendNewChild(cssLib.stdBtn(pos,id,size,spl,upImage,downImage,text,itemParameter,cb,cbobj,btnMsg));
				return item;
			};
			cssLib.stdBtn.itemparameterInit=function( table)
			{
				table = table?table:{};
				var itemParameter = {
					key:table.key?table.key:0,
					tColor:table.tColor?table.tColor:[1,1,1,1],
					tSize:table.tSize?table.tSize:SIZE,
					edge:tableValue(table.edge,1),
					edgeColor:table.edgeColor?table.edgeColor:[0,0,0,1],
					anchor_h:tableValue(table.anchor_h,1),
					anchor_v:tableValue(table.anchor_v,1),
					align_h:tableValue(table.align_h,1),
					align_v:tableValue(table.align_v,1),
				}
				return itemParameter;
			};
			
			//====================================
			cssLib["stdDisBtn"] = function(pos, id, size, upImage, downImage, text, itemParameter, cb, cbobj, btnMsg){
			itemParameter = cssLib.stdDisBtn.itemparameterInit(itemParameter);
			upImage = this.genIconPath(upImage);
			downImage = this.genIconPath(downImage);
			
			return {
				"type":"key", "id":id, "pos":pos, "w":size[0], "h":size[1], 
				state_up:{
					"type":"smart", 
					objs:[
						{
							"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
							obj:{"type":"image","tex":upImage, "id":"upSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
						},
						{
							"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
							obj:{
								"type":"text", "text":text, "color":itemParameter.tColor, 
								"font_size":itemParameter.tSize, "edge":itemParameter.edge, 
								"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
								"align_v":itemParameter.align_v, "id":"upText", 
							},
						},
					],
				},
				"state_down":null,
				state_disabled:{
					"type":"smart", 
					objs:[
						{
							"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
							obj:{"type":"image","tex":downImage, "id":"disSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
						},
						{
							"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
							obj:{
								"type":"text", "text":text, "color":itemParameter.tColor, 
								"font_size":itemParameter.tSize, "edge":itemParameter.edge, 
								"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
								"align_v":itemParameter.align_v, "id":"disText", 
							},
						},
					],
				},
				"key":itemParameter.key, "anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, 

				OnClick:function(msg,extra)
				{
					if(!cb)
					{
						return;
					}
					cb.call(cbobj, msg, extra, btnMsg);
				},
				_setIcon:function( upImage,disImage,spl)
				{
					if (this.upSpl==null)
					{
						this.upSpl = this.getGraphicObj(0).getObj(0).findObjById("upSpl");
						this.disSpl = this.getGraphicObj(2).getObj(0).findObjById("disSpl");
					}
	
					if (upImage!=null)
					{
						//this.upSpl.setSplImage(spl,upImage);
					}
					if (disImage!=null)
					{
						//this.disSpl.setSplImage(spl,disImage);
					}
				},
				_setText:function( text)
				{
					if (this.upText==null)
					{
						this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
						this.disText = this.getGraphicObj(2).getObj(1).findObjById("disText");
					}
					this.upText.setText(text);
					this.disText.setText(text);
				}
			};
		};
		
		cssLib.stdDisBtn.create = function(box,pos,id,size,spl,upImage,disImage,text,itemParameter,cb,cbobj,btnMsg)
		{
			var item;
			item = box.appendNewChild(cssLib.stdDisBtn(pos,id,size,spl,upImage,disImage,text,itemParameter,cb,cbobj,btnMsg));
			return item;
		};
		cssLib.stdDisBtn.itemparameterInit=function( table)
		{
			table=table?table:{};
			var itemParameter={
			key:table.key?table.key:0,
			tColor:table.tColor?table.tColor:[1,1,1,1],
			tSize:table.tSize?table.tSize:SIZE,
			edge:tableValue(table.edge,1),
			edgeColor:table.edgeColor?table.edgeColor:[0,0,0,1],
			anchor_h:tableValue(table.anchor_h,1),
			anchor_v:tableValue(table.anchor_v,1),
			align_h:tableValue(table.align_h,1),
			align_v:tableValue(table.align_v,1),
			}
			return itemParameter;
		};
		
		//================================
		cssLib["stdScaBtn"] = function(pos,id,size,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg){
				itemParameter = cssLib.stdScaBtn.itemparameterInit(itemParameter);
				return {
					"type":"key", "id":id, "pos":pos, "w":size[0], "h":size[1], 
					state_up:{
						"type":"smart", 
						objs:[
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{"type":"image","tex":upImage,"id":"upSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
							},
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{
									"type":"text", "text":text, "color":itemParameter.tColor, 
									"font_size":itemParameter.tSize, "edge":itemParameter.edge, 
									"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
									"align_v":itemParameter.align_v, "id":"upText", 
								},
							},
						],
					},
					"state_down":null,"key":itemParameter.key, "down_scale":dScale, "anchor_h":itemParameter.anchor_h, 
					"anchor_v":itemParameter.anchor_v, 
					
					OnClick:function(msg,extra)
					{
						cb.call(cbobj,msg,btnMsg);
					},
					_setIcon:function( upImage,spl)
					{
						if (this.upSpl==null)
						{
							this.upSpl = this.getGraphicObj(0).getObj(0).findObjById("upSpl");
						}
						
						//this.upSpl.setSplImage(spl,upImage);
					},
					_setText:function( text)
					{
						if (this.upText==null)
						{
							this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
						}
						this.upText.setText(text);
					}
				};
			};
			
			cssLib.stdScaBtn.create=function(box,pos,id,size,spl,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg)
			{
				var item;
				item=box.appendNewChild(cssLib.stdScaBtn(pos,id,size,spl,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg));
				return item;
			};
			cssLib.stdScaBtn.itemparameterInit=function( table)
			{
				table=table?table:{};
				var itemParameter={
				key:table.key?table.key:0,
				tColor:table.tColor?table.tColor:[1,1,1,1],
				tSize:table.tSize?table.tSize:SIZE,
				edge:tableValue(table.edge,1),
				edgeColor:table.edgeColor?table.edgeColor:[0,0,0,1],
				anchor_h:tableValue(table.anchor_h,1),
				anchor_v:tableValue(table.anchor_v,1),
				align_h:tableValue(table.align_h,1),
				align_v:tableValue(table.align_v,1),
				}
				return itemParameter;
			};
			
			//===========================================
			cssLib["stdScaBtn3"] = function(pos,id,size,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg){
				itemParameter = cssLib.stdScaBtn3.itemparameterInit(itemParameter,upImage);
				return {
					"type":"key", "id":id, "pos":pos, "w":size[0], "h":size[1], 
					state_up:{
						"type":"smart", 
						objs:[
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{
									"type":"image", "tex":upImage, 
									"tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,"id":"upSpl", 
								},
							},
							{
								"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
								obj:{
									"type":"text", "text":text, "color":itemParameter.tColor, 
									"font_size":itemParameter.tSize, "edge":itemParameter.edge, 
									"edge_color":itemParameter.edgeColor, "align_h":itemParameter.align_h, 
									"align_v":itemParameter.align_v, "id":"upText", 
								},
							},
						],
					},
					"state_down":null,"key":itemParameter.key, "down_scale":dScale, "anchor_h":itemParameter.anchor_h, 
					"anchor_v":itemParameter.anchor_v, 

					OnClick:function(msg,extra)
					{
						cb.call(cbobj,msg,btnMsg);
					},
					_setIcon:function( upImage,spl)
					{
						if (this.upSpl==null)
						{
							this.upSpl = this.getGraphicObj(0).getObj(0).findObjById("upSpl");
						}
						
						//this.upSpl.setSplImage(spl,upImage);
					},
					_setText:function( text)
					{
						if (this.upText==null)
						{
							this.upText = this.getGraphicObj(0).getObj(1).findObjById("upText");
						}
						this.upText.setText(text);
					}
				};
			};
			
			cssLib.stdScaBtn3.create=function(box,pos,id,size,spl,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg)
			{
				var item;
				item=box.appendNewChild(cssLib.stdScaBtn3(pos,id,size,spl,upImage,dScale,text,itemParameter,cb,cbobj,btnMsg));
				return item;
			};
			
			cssLib.stdScaBtn3.itemparameterInit=function( table,upImage)
			{
				table = table?table:{};
				var itemParameter={
					key:table.key?table.key:0,
					upSize3x3:get3x3TypeTable(upImage)?get3x3TypeTable(upImage):[0,0,0,0],
					tColor:table.tColor?table.tColor:[1,1,1,1],
					tSize:table.tSize?table.tSize:SIZE,
					edge:tableValue(table.edge,1),
					edgeColor:table.edgeColor?table.edgeColor:[0,0,0,1],
					anchor_h:tableValue(table.anchor_h,1),
					anchor_v:tableValue(table.anchor_v,1),
					align_h:tableValue(table.align_h,1),
					align_v:tableValue(table.align_v,1),
				}
				return itemParameter;
			};
			
			//==============================
			cssLib["stdIcon3"] = function(pos,id,size,spl,image,itemParameter,cb,cbobj,btnMsg){
				itemParameter=this.stdIcon3.itemparameterInit(itemParameter,image);
				spl=this.genSplPath(spl);
	
				return {
					"type":"icon", "id":id, "pos":pos, "auto_size":0,"w":size[0], "h":size[1], 
					obj:{"type":"3x3", "spl":spl, "image":image, "size3x3":itemParameter.size3x3, },
					"anchor_h":itemParameter.anchor_h, "anchor_v":itemParameter.anchor_v, "display":1,
					"ui_event":itemParameter.ui_event, 
		
					OnClick:function(msg,extra)
					{
						if (cb != null)
						{
							cb.call(cbobj,msg,btnMsg);
						}
					},
					_setIcon:function( image,spl)
					{
						if (this.iconSpl==null)
						{
							this.iconSpl=this.getGraphicObj();
						}
						if (spl==null)
						{
							spl=this.iconSpl.getSplURL();
						}
						else
						{
							spl=cssLib.genSplPath(spl);
						}
						this.iconSpl.setSplImage(spl,image);
						this.iconSpl.set3x3Size(get3x3TypeTable(image)?get3x3TypeTable(image):[0,0,0,0]);
					}
				};
			};
			
			cssLib.stdIcon3.create=function(box,pos,id,size,spl,image,itemParameter,cb,cbobj,btnMsg)
			{
				var item;
				item=box.appendNewChild(cssLib.stdIcon3(pos,id,size,spl,image,itemParameter,cb,cbobj,btnMsg));
				return item;
			};
			cssLib.stdIcon3.itemparameterInit=function( table,image)
			{
				table=table?table:{};
				var itemParameter={
				size3x3:get3x3TypeTable(image)?get3x3TypeTable(image):[0,0,0,0],
				anchor_h:tableValue(table.anchor_h,1),
				anchor_v:tableValue(table.anchor_v,1),
				ui_event:tableValue(table.ui_event,1),
				}
				return itemParameter;
			};
	}

}