this.initFindPwdFirstCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var phoneFlagImg = "phone_flag";
	var phoneFlagImgW = 70;
	var phoneFlagImgH = 70;
	var phoneFlagBgW = 90;
	
	var btnImg = cssLib.genIconPath("btn");
	var nextBtnW = sw - 40;
	var nextBtnH = 70;
	var nextBtnBgH = 150;
	var nextBtnY = phoneFlagImgH + nextBtnBgH / 2 + 21;

	var itemParameter1 = {
		tColor:[1, 1, 1, 1], tSize: 36,
		edge: 0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v: 1,
		anchor_h:1, anchor_v:1,
	};
	
	var tip1 = "若无法通过该方式重置密码，请登录";
	var tip1Size = appEnv.getTextSize(tip1, 30, 0, sw - 20);
	var keyTip = "yooek.com";
	var keyTipSize = appEnv.getTextSize(keyTip, 30, 0, sw - 20);
	var tip2 = ",使用其他验证方式找回密码。";
	var tip2Size = appEnv.getTextSize(tip2, 30, 0, sw - 20 - tip1Size.w - keyTipSize.w);
	var tip2X = 0;
	var tip2Y = 0;
	var tip2_1 = "";
	var tip2_2 = "";
	var count = 0;
	var tip2_1X = 10 + tip1Size.w + keyTipSize.w;
	var tip2_1Y = 20;
	var tip2_2X = 10;
	var tip2_2Y = 20 + tip1Size.h + 2;
	var tip2_1Size = [0, 0];
	var tip2_2Size = [0, 0];
	var left = sw - 20 - tip1Size.w - keyTipSize.w;
	
	if(left >= tip2Size.w)
	{
		tip2X = 10 + tip1Size.w + keyTipSize.w;
		tip2Y = 20;
	}
	else
	{
		count = Math.floor(left / 30);
		tip2_1 = tip2.substring(0, count + 1);
		tip2_1Size = appEnv.getTextSize(tip2_1, 30, sw, 0);
		
		tip2_2 = tip2.substring(count + 1, tip2.length);
		tip2_2Size = appEnv.getTextSize(tip2_2, 30, sw, 0);
	}
	var params = {fs:30, scale:0.98, upclr:[0.99, 0.51, 0.03, 1], downclr:[0.99, 0.51, 0.03, 1], edgeclr:[], edge:0, align_h:0,
		align_v:0, anchor_v:0, anchor_h:0};
	
	return {
		"type":"item", "id":"findPwdFirstItem","pos":[0, topH, 0], "w":sw,"h":sh,"ui_event":1, "anchor_h":0, "anchor_v":0,
		items:[
			{
				"type":"icon", "id":"userflag", "pos":[0, 0, 0],"w":phoneFlagBgW, "h":phoneFlagImgH+20,
				"anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{css:cssLib["simpleIcon"]([20, (phoneFlagImgH + 20) >> 1, 0], "", phoneFlagImg, phoneFlagImgW, phoneFlagImgH, 0, 1)},
					
					{css:cssLib["showTextEdit"]([phoneFlagBgW + 1, 0, 0], "inputPhone", sw - phoneFlagBgW - 3, 90,
						"", textLib.txtInputBoxTip3, 28, 0, this.getInputBoxContent, this, 0)},
				],
			},
			
			{
				"type":"icon", "pos":[sw >> 1, phoneFlagImgH + nextBtnBgH / 2 + 21, 0], "w":sw, "h":nextBtnBgH, "anchor_h":1, "anchor_v":1,
				"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdBtn"]([0, 0, 0], "nextBtn", [nextBtnW, nextBtnH, 0], btnImg, btnImg, textLib.txtNextStepTip, itemParameter1,
						this.onNextStepInClk, this, 0)},
				],
			},
		
			{
				"type":"icon", "pos":[0, nextBtnY + nextBtnH + 6, 0], "w":sw, "h": 200, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{css:cssLib["stdText"]([10, 20, 0], "tip1", [tip1Size.w, tip1Size.h], tip1, {tColor:[0, 0, 0, 0.4], tSize:30,
						edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
						
					{css:cssLib["key_txt"]([10 + tip1Size.w, 15, 0], this, this.onLoginWebSite,keyTipSize.w, keyTipSize.h,
						keyTip, params)},
						
					{
						"type":"icon", "pos":[10 + tip1Size.w, 50, 0], "w":keyTipSize.w, "h":1,
						obj:{"type":"box", "color":[0, 0, 1, 1]},
					},
					
					{css:cssLib["stdText"]([tip2X, tip2Y, 0], "tip2", [tip2Size.w, tip2Size.h], tip2, {tColor:[0, 0, 0, 0.4],
						tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0}),
							display:(left >= tip2Size.w) ? 1 : 0},
							
					{css:cssLib["stdText"]([tip2_1X, tip2_1Y, 0], "tip2_1", [tip2_1Size.w, tip2_1Size.h], tip2_1,
						{tColor:[0, 0, 0, 0.4], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:0}), display:(left >= tip2Size.w) ? 0 : 1},
							
					{css:cssLib["stdText"]([tip2_2X, tip2_2Y, 0], "tip2_2", [tip2_2Size.w, tip2_2Size.h], tip2_2,
						{tColor:[0, 0, 0, 0.4], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:0}), display:(left >= tip2Size.w) ? 0 : 1},
				],
			},
			
		],//End of: items
	};
};

this.initFindPwdTopCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return {
		"type":"item", "id":"findPwdTopItem", "pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("findPwd", sw, topH, textLib.txtResetPwdTip, this, this.onBackClk)},
		],//End of: items
	};
};

this.initFindPwdSecondCSS = function(sw, sh, phoneNum){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var imgH = 70;
	var phoneNumTipY = imgH >> 1;
	
	var btnCheckCodeImg = "btn_checkcode";
	var btnCheckCodeImgW = 191;
	var btnCheckCodeImgH = 61;
	
	var checkCodeImg = cssLib.genIconPath("check_code");
	var checkCodeImgW = 50;
	var checkCodeImgH = 50;
	var checkCodeX = 81;
	var checkCodeY = imgH + phoneNumTipY + 1;
	var checkCodeW = sw - btnCheckCodeImgW - 83;
	var checkCodeH = 60;
	
	var inputImg = cssLib.genIconPath("input");
	var confirmInputImg = cssLib.genIconPath("confirm_input");
	
	var inputImgY = checkCodeY + imgH;
	var confirmImgY = inputImgY + imgH;

	var submitX = sw >> 1;
	var submitY = confirmImgY + imgH / 2 + 1;
	var submitW = sw - 60;
	var submitH = 150;
	var submitBtnImg = cssLib.genIconPath("btn");
	
	var tip1 = textLib.txtPhoneNumTip + ":" + phoneNum;
	var tip1Size = appEnv.getTextSize(tip1, 30, 0, sw - 20);
	
	return {
		"type":"item", "id":"findPwdSecondItem", "pos":[0, topH, 0], "w":sw, "h":sh, "ui_event":1,
		items:[
			{
				"type":"icon", "pos":[0, 0, 0], "w":sw, "h": sh,
				obj:{"type":"box", "color":[0.8, 0.8, 0.8, 1],},
			},
			
			{
				"type":"icon", "id":"", "pos":[0, phoneNumTipY, 0], "w":sw, "h":imgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{css:cssLib["stdText"]([30, 0, 0], "phoneNum", [tip1Size.w, tip1Size.h], tip1, {tColor:[0, 0, 0, 1],
						tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0, align_v:1, anchor_h:0, anchor_v:1,})},
				],
			},
			
			{
				"type":"icon", "pos":[40, checkCodeY, 0], "w":80, "h":imgH, "anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{
						"type":"icon", "id":"userflagIcon", "pos":[10, 0, 0], "w":checkCodeImgW, "h":checkCodeImgH,
						"anchor_h":1, "anchor_v":1,
						obj:{"type":"image", "tex":checkCodeImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
					},
				],
			},

			{css:cssLib["showTextEdit"]([checkCodeX, checkCodeY - imgH / 2, 0], "codeNum", checkCodeW, imgH,
						"", textLib.txtCheckCodeTip, 28, 1, this.getInputBoxContent, this, 0)},
			
			{
				"type":"icon", "pos":[sw - btnCheckCodeImgW / 2, checkCodeY], "w":btnCheckCodeImgW, "h":imgH,
				"anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],}, "ui_event":1,
				items:[
					{css:cssLib["key_icon_txt"]([0, 0, 0], "getCheckCode", btnCheckCodeImg, btnCheckCodeImg,
						textLib.txtGetCheckCode, btnCheckCodeImgW - 50, btnCheckCodeImgH - 10,
						{tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[1, 1, 1, 0.2], align_h:1, align_v:1, anchor_h:1,
							anchor_v:1,}, this, this.onGetCheckCodeClk)},
				],
			},
			
			{
				"type":"icon", "pos":[40, inputImgY + 1, 0], "w":80, "h":imgH, "anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{
						"type":"icon", "id":"inputPwd", "pos":[10, 0, 0], "w":checkCodeImgW, "h":checkCodeImgH, 
						"anchor_h":1, "anchor_v":1,
						obj:{"type":"image", "tex":inputImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
					},
				],
			},
			
			{css:cssLib["showTextEdit"]([checkCodeX, inputImgY - imgH / 2 + 1, 0], "pwd1", sw - 83, imgH,
						"", textLib.txtInputBoxTip5, 28, 2, this.getInputBoxContent, this, 1, 0, false, 1, this.editWarning)},
			
			{
				"type":"icon", "pos":[40, confirmImgY + 2, 0], "w":80, "h":imgH, "anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{
						"type":"icon", "id":"confirmPwd", "pos":[10, 0, 0], "w":checkCodeImgW, "h":checkCodeImgH, 
						"anchor_h":1, "anchor_v":1,
						obj:{"type":"image", "tex":confirmInputImg, "tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
					},
				],
			},
			
			{css:cssLib["showTextEdit"]([checkCodeX, confirmImgY - imgH / 2 + 2, 0], "pwd2", sw - 83, imgH,
						"", textLib.txtInputBoxTip4, 28, 3, this.getInputBoxContent, this, 1, 0, false, 1, this.editWarning)},
			
				
			{
				"type":"icon", "pos":[sw >> 1, submitY + 3 + submitH / 2, 0], "w":sw, "h":submitH, "anchor_h":1, 
				"anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{css:cssLib["stdBtn"]([0, 0, 0], "submitBtn", [submitW, 80], submitBtnImg, submitBtnImg, textLib.txtSubmit,
						{tColor:[1, 1, 1, 1], tSize: 36, edge: 0, edgeColor:[0, 0, 0, 1], align_h:1, align_v: 1, anchor_h:1,
						anchor_v:1,}, this.onSubmitClk, this, 0)},
				],
			},
		],//End of: items
	};
};

