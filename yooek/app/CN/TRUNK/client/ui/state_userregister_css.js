this.initRegisterTopCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return {
		"type":"item", "id":"registerItemTop","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("register", sw, topH, textLib.txtUserRegisterTip, this, this.onBackClk)},
		],//End of: items
	};
};

this.initRegisterCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var inputPhoneNumImg = cssLib.genIconPath("phone_flag");
	var inputPhoneNumImgW = 90;
	var inputPhoneImgH = 90;
	var txtLoginNameTipSize = appEnv.getTextSize(textLib.txtLoginNameTip, 30, 0, sw);
	var txtLoginPasswordSize = appEnv.getTextSize(textLib.txtLoginPassword, 30, 0, sw);
	
	var loginNameImg = cssLib.genIconPath("user_flag");
	var loginNameImgY = inputPhoneImgH / 2 + inputPhoneImgH;
	var loginPwdImg = cssLib.genIconPath("password_flag");
	var loginPwdImgY = loginNameImgY + inputPhoneImgH + 2;
	
	var confirmPwdImgY = loginPwdImgY + inputPhoneImgH + 1;
	
	var checkCodeImg = cssLib.genIconPath("check_code");
	var checkCodeImgY = confirmPwdImgY + inputPhoneImgH + 1;
	
	var btnCheckCodeImg = "btn_checkcode";
	var btnCheckCodeImgW = 127;
	var btnCheckCodeImgH = 60;
	
	var registerBtnImgW = sw - 60;
	var registerBtnImgH = 170;
	var registerBtnImg = cssLib.genIconPath("btn");
	var registerBtnImgY = checkCodeImgY + inputPhoneImgH / 2 + registerBtnImgH / 2 + 1;
	
	var tip1 = textLib.txtRegisterTip1;
	var tip1Size = appEnv.getTextSize(tip1, 24, 0, sw - 20);
	
	var tip2 = textLib.txtRegisterTip2;
	var tip2Size = appEnv.getTextSize(tip2, 24, 0, sw - 20 - tip1Size.w);
	
	var tip3 = textLib.txtRegisterTip3;
	var tip3Size = appEnv.getTextSize(tip3, 24, 0, sw - 20 - tip1Size.w - tip2Size.w);
	
	var tip3X = -(sw >> 1) + 10 + tip1Size.w + tip2Size.w;
	var tip3Y = 0;
	var tip3_1 = "";
	var tip3_2 = "";
	var count = 0;
	var tip3_1X = -(sw >> 1) + 10 + tip1Size.w + tip2Size.w;
	var tip3_1Y = 0;
	var tip3_2X = -(sw >> 1) + 10;
	var tip3_2Y = 20 + tip1Size.h + 2;
	var tip3_1Size = [0, 0];
	var tip3_2Size = [0, 0];
	var left = sw - 20 - tip1Size.w - tip2Size.w;
	
	if(left < tip3Size.w)
	{
		count = Math.floor(left / 24);
		tip3_1 = tip3.substring(0, count + 1);
		tip3_1Size = appEnv.getTextSize(tip3_1, 24, sw, 0);
		
		tip3_2 = tip3.substring(count + 1, tip3.length);
		tip3_2Size = appEnv.getTextSize(tip3_2, 24, sw, 0);
	}
	
	var params = {fs:24, scale:0.98, upclr:[0.99, 0.51, 0.03, 1], downclr:[0.99, 0.51, 0.03, 1], edgeclr:[], edge:0, align_h:0,
		align_v:1, anchor_v:0, anchor_h:0};
		
	return {
		"type":"item", "id":"registerItem","pos":[0, topH, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{
				"type":"icon", "id":"userflag", "pos":[0, inputPhoneImgH >> 1,0], "w":inputPhoneNumImgW,
				"h":inputPhoneImgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{
						"type":"icon", "id":"userflagIcon", "pos":[10, 0, 0], "w":inputPhoneNumImgW - 20,
						"h":inputPhoneImgH - 20, "anchor_h":0, "anchor_v":1,
						obj:{"type":"image", "tex":inputPhoneNumImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
					},
				],
			},
			
			{css:cssLib["showTextEdit"]([inputPhoneNumImgW + 1, 0, 0], "registerPhoneNum", sw - inputPhoneNumImgW - 3, inputPhoneImgH,
						"", textLib.txtInputPhoneNumberTip, 24, 0, this.getInputBoxContent, this, 0)},
			
			{
				"type":"icon", "id":"userflag", "pos":[0, loginNameImgY + 1,0], "w":inputPhoneNumImgW + txtLoginNameTipSize.w,
				"h":inputPhoneImgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{
						"type":"icon", "id":"userflagIcon", "pos":[10, 0, 0], "w":inputPhoneNumImgW - 20,
						"h":inputPhoneImgH - 20, "anchor_h":0, "anchor_v":1,
						obj:{"type":"image", "tex":loginNameImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
						items:[
							{css:cssLib["stdText"]([20 + inputPhoneNumImgW - 40, 0, 0], "loginName",
								[txtLoginNameTipSize.w, txtLoginNameTipSize.h], textLib.txtLoginNameTip,
								{
									tColor:[0, 0.71, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
									anchor_v:1, wrap:0
								}),
							},
							
						],
					},
				],
			},

			{css:cssLib["showTextEdit"]([inputPhoneNumImgW + txtLoginNameTipSize.w + 1, loginNameImgY - (inputPhoneImgH) / 2 + 1 , 0], 
				"registerLoginName", sw - txtLoginNameTipSize.w - inputPhoneNumImgW - 3, inputPhoneImgH, "", textLib.txtFillOutTip1, 24, 2, 
				this.getInputBoxContent, this, 0, 0, false, 1, this.editWarning)},
			
			{
				"type":"icon", "id":"userflag", "pos":[0, loginPwdImgY, 0], "w":inputPhoneNumImgW + txtLoginPasswordSize.w,
				"h":inputPhoneImgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{
						"type":"icon", "id":"userflagIcon", "pos":[10, 0, 0], "w":inputPhoneNumImgW - 20,
						"h":inputPhoneImgH - 20, "anchor_h":0, "anchor_v":1,
						obj:{"type":"image", "tex":loginPwdImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
						items:[
							{css:cssLib["stdText"]([20 + inputPhoneNumImgW - 40, 0, 0], "loginPwd",
								[txtLoginPasswordSize.w, txtLoginPasswordSize.h], textLib.txtLoginPassword,
								{tColor:[0, 0.71, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
									anchor_h:0, anchor_v:1, wrap:0})},
						],
					},
				],
			},
			
			{css:cssLib["showTextEdit"]([inputPhoneNumImgW + txtLoginPasswordSize.w + 1, loginPwdImgY - (inputPhoneImgH) / 2, 0], 
				"registerLoginPwd", sw - inputPhoneNumImgW - txtLoginPasswordSize.w - 3, inputPhoneImgH, "", textLib.txtFillOutTip2, 24, 3, 
				this.getInputBoxContent, this, 1, 0, false, 1, this.editWarning)},
			
			{
				"type":"icon", "id":"userflag", "pos":[0, confirmPwdImgY, 0], "w":inputPhoneNumImgW + txtLoginPasswordSize.w,
				"h":inputPhoneImgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1], },
				items:[
					{
						"type":"icon", "id":"userflagIcon", "pos":[10, 0, 0], "w":inputPhoneNumImgW - 20,
						"h":inputPhoneImgH - 20, "anchor_h":0, "anchor_v":1,
						obj:{"type":"image", "tex":loginPwdImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
						items:[
							{css:cssLib["stdText"]([20 + inputPhoneNumImgW - 40, 0, 0], "tradeFailedTitle",
								[txtLoginPasswordSize.w, txtLoginPasswordSize.h], textLib.txtConfirmPwdTip,
								{tColor:[0, 0.71, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
									align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						],
					},
				],
			},
			
			{css:cssLib["showTextEdit"]([inputPhoneNumImgW + txtLoginPasswordSize.w + 1, confirmPwdImgY - (inputPhoneImgH) / 2, 0], 
				"registerConfirmLoginPwd", sw - inputPhoneNumImgW - txtLoginPasswordSize.w - 3, inputPhoneImgH, "", textLib.txtFillOutTip3, 24, 4, 
				this.getInputBoxContent, this, 1, 0, false, 1, this.editWarning)},
			
			{
				"type":"icon", "pos":[0, checkCodeImgY, 0], "w":inputPhoneNumImgW,"h":inputPhoneImgH,
				"anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{
						"type":"icon","id":"userflagIcon", "pos":[10, 0, 0], "w":inputPhoneNumImgW - 20,
						"h":inputPhoneImgH - 20, "anchor_h":0, "anchor_v":1,
						obj:{"type":"image", "tex":checkCodeImg, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
					},
				],
			},

			{css:cssLib["showTextEdit"]([inputPhoneNumImgW + 1, checkCodeImgY - (inputPhoneImgH) / 2, 0], 
				"codeNum", sw - inputPhoneNumImgW - 152, inputPhoneImgH, "", textLib.txtCheckCodeTip, 24, 1, 
				this.getInputBoxContent, this, 0)},
		
			{
				"type":"icon", "pos":[sw - 150, checkCodeImgY, 0], "w":170, "h":inputPhoneImgH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],}, "ui_event":1,
				items:[
					{css:cssLib["key_icon_txt"]([10, 0, 0], "getCheckCode", btnCheckCodeImg,
						btnCheckCodeImg, textLib.txtGetCheckCode, btnCheckCodeImgW, btnCheckCodeImgH, 
						{tColor:[1, 1, 1, 1], tSize:24, edge:1, edgeColor:[1, 0.51, 0.03, 1], align_h:1, align_v:1,
							anchor_h:0, anchor_v:1,}, this, this.onGetCheckCodeClk)},
				],
			},
			
			{
				"type":"icon", "pos":[sw >> 1, registerBtnImgY, 0], "w":sw, "h":registerBtnImgH,
				"anchor_h":1, "anchor_v":1,"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1],},
				items:[
					{css:cssLib["stdBtn"]([0, 0, 0], "submitBtn", [registerBtnImgW, 80], registerBtnImg, registerBtnImg,
						textLib.txtImmediatelyRegisterTip, {tColor:[1, 1, 1, 1], tSize: 36, edge: 0,
							edgeColor:[0, 0, 0, 1], align_h:1, align_v: 1, anchor_h:1, anchor_v:1,}, this.onRegisterClk, this, 0)},
				],
			},
			
			{
				"type":"icon", "pos":[sw >> 1, registerBtnImgY + registerBtnImgH / 2 + 76, 0],
				"w":sw, "h": 150, "anchor_h":1, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					
					/*{css:cssLib["multi_text_three"]([0, 0, 0], sw - 80, 40, textLib.txtRegisterTip1, textLib.txtRegisterTip2, 
						textLib.txtRegisterTip3, {r:0, g:0, b:0, a:0.6}, {r:0.99, g:0.51, b:0.03, a:1}, {r:0, g:0, b:0, a:0.6}, 24, 24, 24, 
						{anchor_h:1, anchor_v:1, align_h:0, align_v:1, wrap:1})},*/
						{css:cssLib["stdText"]([-(sw >> 1) + 10, 0, 0], "tip1", tip1Size, tip1, {tColor:[0, 0, 0, 0.6], tSize:24,
							edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:0, wrap:0})},
						
						{css:cssLib["key_txt"]([-(sw >> 1) + 10 + tip1Size.w, -10, 0], this, this.onEnterServiceProtocal, tip2Size.w + 20, tip2Size.h,
							tip2, params)},
							
						{css:cssLib["stdText"]([tip3X, tip3Y, 0], "tip3", tip3Size, tip3, {tColor:[0, 0, 0, 0.6],
							tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:0, wrap:0}),
							display:(left >= tip3Size.w) ? 1 : 0},
							
						{css:cssLib["stdText"]([tip3_1X, tip3_1Y, 0], "tip3_1", tip3_1Size, tip3_1,
							{tColor:[0, 0, 0, 0.6], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
								anchor_v:0, wrap:0}), display:(left >= tip3Size.w) ? 0 : 1},
							
						{css:cssLib["stdText"]([tip3_2X, tip3_2Y, 0], "tip3_2", tip3_2Size, tip3_2,
							{tColor:[0, 0, 0, 0.6], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
								anchor_v:0, wrap:0}), display:(left >= tip3Size.w) ? 0 : 1},
				],
			},
		],//End of: items
	};
};





