this.initSoftInfoCSS = function(obj, sw)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	var y = 0;
	var boxH = 60 + (appEnv.scaleFactorY - 1) * 30;
	var sh = boxH * 9;//539;//660
	
	var itemParameter1 = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
		align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0, 0, 0.4], tSize:26, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
		align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter3 = {tColor:[0, 0, 0, 0.4], tSize:26, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var enterFlagImg = "enter";
	var enterFlagImgW = 31;
	var enterFlagImgH = 51;
	var params = {ah:1, av:1, scale:0.98};
	var phoneNum = SevicePhone;
	var len = phoneNum.length * 15;
	var versionTip = textLib.txtVersionTip + ClientVersion;
	var versionTipSize = appEnv.getTextSize(versionTip, 30, 0, sw);
	
	if(obj.isLoginState)
	{
		y = 31;
	}
	else
	{
		y = 40;
	}

	return{
		"type":"icon", "item":"softInfoItem","pos":[0, 10 + 10 * (appEnv.scaleFactorY - 1), 0], "w":sw,"h":sh,"ui_event":1,
		//obj:{"type":"box", "color":[0, 1, 1, 1]},
		items:[
			/*{
				"type":"icon", "id":"tip1", "pos":[0, y, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[{css:cssLib["stdText"]([30, 0, 0], "tip", [120, 30], textLib.txtShowPhoto, itemParameter1)},],
			},*/
			//{css:cssLib["my_custom_bar_key2"]([0, y + 61, 0], "clearCachePhoto", sw, 60, enterFlagImg, enterFlagImgW, enterFlagImgH, [textLib.txtClearCachePhoto, null], obj, obj.onClearCachePhotoClk)},
			
			{
				"type":"icon", "id":"tip1", "pos":[0, y, 0], "w":sw, "h":boxH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[{css:cssLib["stdText"]([30, 0, 0], "tip", [120, 30], textLib.txtHelpCenter, itemParameter1)},],
			},//61 122 183 244 305 366 427 488 549 610
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH + 2, 0], "useHelpItem", sw, boxH, enterFlagImg, enterFlagImgW,
				enterFlagImgH, [textLib.txtUseHelp, null], obj, obj.onUseHelpClk)},
				
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH * 2 + 2 + 2, 0], "adviseRetroactionItem", sw, boxH, enterFlagImg,
				enterFlagImgW, enterFlagImgH, [textLib.txtAdviseSubmit, null], obj, obj.onAdviseRetroactionClk)},
				
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH * 3 + 3 + 3, 0], "contactCustomServiceItem", sw, boxH, enterFlagImg,
				enterFlagImgW, enterFlagImgH, [textLib.txtContactCustomService, phoneNum], obj, obj.onContactCustomServiceClk)},
			
			{
				"type":"icon", "id":"tip2", "pos":[0, y + boxH * 4 + 4 + 4, 0], "w":sw, "h":boxH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[{css:cssLib["stdText"]([30, 0, 0], "tip", [60, 30], textLib.txtAbout, itemParameter1)},],
			},
			
			{
				"type":"icon", "id":"tip3", "pos":[0, y + boxH * 5 + 5 + 5, 0], "w":sw, "h":boxH, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[{css:cssLib["stdText"]([30, 0, 0], "updateVersion", [versionTipSize.w, versionTipSize.h],
					versionTip, itemParameter2)},],
			},
			//{css:cssLib["my_custom_bar_key2"]([0, y + 305, 0], "updateVersion", sw, 60, enterFlagImg, enterFlagImgW, enterFlagImgH, [textLib.txtVersionUpdate, null], obj, obj.onUpdateVersionClk)},
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH * 6 + 6 + 6, 0], "aboutOut", sw, boxH, enterFlagImg, enterFlagImgW,
				enterFlagImgH, [textLib.txtAboutOur, null], obj, obj.onAboutOurClk)},
				
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH * 7 + 7 + 7, 0], "customProtocol", sw, boxH, enterFlagImg,
				enterFlagImgW, enterFlagImgH, [textLib.txtCustomServiceProtocol, null], obj, obj.onCustomProtocolClk)},
				
			{css:cssLib["my_custom_bar_key2"]([0, y + boxH * 8 + 8 + 8, 0], "specialDes", sw, boxH, enterFlagImg, enterFlagImgW,
				enterFlagImgH, [textLib.txtSpecialDesTip, null], obj, obj.onSpecialVersionClk)},
		
		],
	};
};

//===========================关于我们===================================
this.loadAboutOurCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var logoImg = "logo";
	var logoImgW = sw - 408;
	var logoImgH = logoImgW;
	var qrCodeImg = "qr_code";
	var versionTxt = textLib.txtVersion + ClientVersion;
	var barTipTxt = textLib.txtAboutOur;
	var companyNameTxt = textLib.txtCompanyName;
	var txt1 = textLib.txtCustomServiceTime;
	var txt2 = textLib.txtOfficalWebsite;
	var itemParameter = {tColor:[0, 0, 0, 0.3], tSize:24, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, l_space:10, p_space:0};
	
	return{
		"type":"icon", "id":"loadAboutOur","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["modelTopBgFirst"]("loadAboutOurBar", sw, topH, barTipTxt, obj, obj.onBackClk)},
			{css:cssLib["logo_undeline_txt"]([sw >> 1, topH + 80 + (logoImgH >> 1), 0], "", logoImg,
				logoImgW, logoImgH, companyNameTxt, 26, [0, 0, 0, 0.3], 0, [0, 0, 0, 1])},
				
			{css:cssLib["logo_undeline_txt"]([sw >> 1, topH + 80 + (logoImgH << 1), 0], "", qrCodeImg,
				logoImgW, logoImgH, versionTxt, 26, [0, 0, 0, 0.3], 0, [0, 0, 0, 1])},

			//{css:cssLib["stdText"]([sw >> 1, topH + 80 + (logoImgH << 1) + (logoImgH >> 1) + 80, 0], "", [txt1.length * 24, 24], txt1 + "\n" + txt2, itemParameter)},
			{
				"type":"icon", "id":"bg", "pos":[sw >> 1, sh - 120, 0],
				"w":sw, "h":120, "ui_event":1, "anchor_h":1, "anchor_v":0,
				obj:{"type":"box", "color":[0, 0, 0, 0.1]},
				items:[
					{css:cssLib["stdText"]([0, 60, 0], "", [txt1.length * 24, 24], txt1 + "\n" + txt2, itemParameter)},
				],
			},
		],
	};
};

//=======================================使用帮助===================================
this.loadUseHelpCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var tip = textLib.txtUseHelp;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var leftBarImg = cssLib.genIconPath("left_select_bar");
	var rightBarImg = cssLib.genIconPath("right_unselect_bar");
	var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var leftBarX = 20;
	var barW = (sw - 40) >> 1
	var size = [barW, 50];
	
	return{
		"type":"icon", "id":"loadUseHelp","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["modelTopBgFirst"]("loadUseHelpBar", sw, topH, tip, obj, obj.onBackClk)},
			{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.1]},
				items:[
					{css:cssLib["stdBtn"]([leftBarX, 30, 0], "leftBar", size, leftBarImg, leftBarImg, textLib.txtHelpTip1,
						itemParameter1, obj.onHelpKindsClk, obj, 0)},
					{css:cssLib["stdBtn"]([sw - leftBarX - size[0] / 2, 30, 0], "rightBar", size, rightBarImg,
						rightBarImg, textLib.txtHelpTip2, itemParameter2, obj.onHelpKindsClk, obj, 1)},
				],
			}
		],
	};
};
//=============软件帮助说明=========================
this.loadSoftHelpCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 150 + (appEnv.scaleFactorY - 1) * 15;
	var itemParameter1 = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1};
		
	var itemParameter2 = {tColor:[0, 0, 0, 0.6], tSize:26, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1, p_space:0, l_space:20};
		
	return{
		"type":"item", "id":"loadSoftHelp","pos":[0, topH, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["stdText"]([15, 30, 0], "", [sw - 30, 26], textLib.txtSoftHelpTipTitle, itemParameter1)},
			{css:cssLib["stdText"]([15, 85, 0], "", [sw - 30, 26], textLib.txtSoftHelpTip1, itemParameter2)},
			
			{css:cssLib["stdText"]([15, 280, 0], "", [sw - 30, 26], textLib.txtCustomHelpTipTitle, itemParameter1)},
			{css:cssLib["stdText"]([15, 335, 0], "", [sw - 30, 26], textLib.txtSoftHelpTip2, itemParameter2)},
		],
	};
};

//=====================买家帮助说明=========================
this.loadCustomHelpCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 150 + (appEnv.scaleFactorY - 1) * 15;
	//var upOpenImg = "up_open";
	var downCloseImg = "down_close";
	var downCloseImgW = 50;
	var downCloseImgH = 50;
	var params= {anchor_h:0, anchor_v:0, ui_event:1, display:1};
	var itemParameter1 = {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1};
		
	var itemParameter2 = {tColor:[0, 0, 0, 0.6], tSize:26, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1, p_space:0, l_space:20};
		
	return{
		"type":"item", "id":"loadSoftHelp","pos":[0, topH, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["stdText"]([15, 30, 0], "openTipTxt1", [sw - 30, 26], textLib.txtCustomHelpSubTip1, itemParameter1)},
			
			{css:cssLib["stdPngIcon"]([sw - downCloseImgW - 2, 15, 0], "openTip1", [downCloseImgW, downCloseImgH],
				downCloseImg, params, obj.openCustomHelpPage, obj, 0)},
				
			{
				"type":"icon", "id":"grayLine1","pos":[0, 80, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
			
			{css:cssLib["stdText"]([15, 101, 0], "openTipDes1", [sw - 30, 26], textLib.txtCustomHelpSubDes1, itemParameter2)},
			
			{
				"type":"icon", "id":"grayLine1-1","pos":[0, 230, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
			
			{css:cssLib["stdText"]([15, 101, 0], "openTipTxt2", [sw - 30, 26], textLib.txtCustomHelpSubTip2, itemParameter1)},
			
			{css:cssLib["stdPngIcon"]([sw - downCloseImgW - 2, 91, 0], "openTip2", [downCloseImgW, downCloseImgH],
				downCloseImg, params, obj.openCustomHelpPage, obj, 1)},
				
			{
				"type":"icon", "id":"grayLine2","pos":[0, 151, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
			
			{css:cssLib["stdText"]([15, 182, 0], "openTipDes2", [sw - 30, 26], textLib.txtCustomHelpSubDes2, itemParameter2)},
			
			{
				"type":"icon", "id":"grayLine2-2","pos":[0, 310, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
			
			{css:cssLib["stdText"]([15, 182, 0], "openTipTxt3", [sw - 30, 26], textLib.txtCustomHelpSubTip3, itemParameter1)},
			
			{css:cssLib["stdPngIcon"]([sw - downCloseImgW - 2, 172, 0], "openTip3", [downCloseImgW, downCloseImgH],
				downCloseImg, params, obj.openCustomHelpPage, obj, 2)},
				
			{
				"type":"icon", "id":"grayLine3","pos":[0, 232, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
			
			{css:cssLib["stdText"]([15, 263, 0], "openTipDes3", [sw - 30, 26], textLib.txtCustomHelpSubDes3, itemParameter2)},
			
			{
				"type":"icon", "id":"grayLine3-3","pos":[0, 430, 0], "w":sw, "h":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.3]},
			},
		],
	};
};

//=====================特别说明==================================
this.loadSpecialDesCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var txt = textLib.txtSpecialDes;
	var tip = textLib.txtSpecialDesTip;
	var itemParameter = {tColor:[0, 0, 0, 0.5], tSize:26, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1, p_space:0, l_space:20};
	
	return{
		"type":"icon", "id":"specialDes","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["modelTopBgFirst"]("specialDesBar", sw, topH, tip, obj, obj.onBackClk)},
			{css:cssLib["stdText"]([15, topH + 50, 0], "des", [sw - 30, 26], txt, itemParameter)},
		],
	};
};

//===================意见反馈=================================
this.adviseRetroaction = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var inputBoxW = sw - 20;
	var inputBoxH = 300;
	var btnOneImg = "advise1";
	var btnTwoImg = "advise2";
	var btnThreeImg = "advise3";
	var downPullImg = "down_pull_arrow";
	var btnSubmitImg = "btn_checkcode";
	var btnImgW = 230;
	var btnImgH = 50;
	var downPullImgW = 50;
	var downPullImgH = 50;
	var btnSubmitImgW = 150;
	var btnSubmitImgH = 50;
	var btnImgY = topH + 20 + inputBoxH;
	var params1 = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var params2 = {ah:0, av:0, scale:1};
	var params3 = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		
	var itemParameter = {tColor:[0, 0, 0, 0.8], tSize:16, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:1};
		
	var cb = obj.adviseRestroactionInputFrame;
	var cbobj = obj;
	
	return{
		"type":"icon", "id":"adviseRetroaction","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["modelTopBgFirst"]("adviseRetroactionTop", sw, topH, textLib.txtAdviseSubmit, obj, obj.onBackClk, 0)},
			
			{
				"type":"icon", "id":"","pos":[9, topH + 9, 0], "w":inputBoxW, "h":inputBoxH,
				"anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[0, 0, 0, 0.4]},
			},
			
			{
				"type":"icon", "id":"inputBoxBg","pos":[10, topH + 10, 0], "w":inputBoxW - 2, "h":inputBoxH - 2,
				"anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				
				items:[
					/*{
						"type":"edit", "id":"adviseInputFrame", "pos":[1, 1, 0],"w":inputBoxW - 4,"h":inputBoxH - 32,
						"text":"", "font_size":24, 
						"color":[0, 0, 0, 0.8],"anchor_h":0, "ui_event":1,"anchor_h":0,"anchor_v":0, state:obj,
						OnEditUpdate:function()
						{
							var txt = this.getText();
							cb.call(cbobj, txt);
							this.setText("");
						},
						
						OnCloseEdit:function()
						{
							this.endEdit();
						},
						_setText:function(txt)
						{
							this.setText(txt);
						},
						
						OnEditEnd:function()
						{
							var txt = this.getText();
							//this.state.adviseTextDesItem._setText("");
							cb.call(cbobj, txt);
						},
						
						OnEdit:function(msg, extra)
						{
							var text = this.getText();
							//this.state.adviseTextDesItem._setText("gggggggggggggggggggg");
							//this.state.adviseEditItem.setDisplay(0);
							//this.state.testBox.setDisplay(1);
							//this.state.testTxt._setText(text);
						},
					},*/
					{css:cssLib["showTextEdit"]([1, 1, 0], "adviseInputFrame", inputBoxW - 4, inputBoxH - 32,
						"", "", 24, 0, cb, cbobj, 0, 0, true, 0)},
					
					{css:cssLib["stdText"]([5, 10, 0], "adviseTxt", [inputBoxW - 12, inputBoxH - 22],
						textLib.txtAdviseInitTip, itemParameter)},
					
					{
						"type":"icon", "pos":[inputBoxW - 122, inputBoxH - 23, 0], "w":120, "h":20,
						obj:{"type":"box", "color":[1, 1, 1, 1]},
						items:[
							{
								"type":"icon", "pos":[0, 0, 0], "w":120, "h":20,
								obj:{
									"type":"text", "text":textLib.txtLimitWordsTip, "font_size":16, "color":[0, 0, 0, 0.8],
									"align_h":0, "align_v":0,
								},
							}
						],
					},
				],
			},
			
			{css:cssLib["key_icon_txt"]([10 + (btnImgW >> 1), btnImgY  + (btnImgH >> 1), 0], "btn1",
				btnOneImg, btnOneImg, textLib.txtDoBestAdviseTip, btnImgW, btnImgH, params1,
				obj, obj.onAdviseRetroactionTypeClk, 0)},
				
			{css:cssLib["key_icon"]([7 + btnImgW, btnImgY, 0], "pulldown", downPullImg, downPullImg,
				downPullImgW, downPullImgH, params2, obj, obj.onSelectAdviseTypeClk)},
			
			{css:cssLib["key_icon_txt"]([10 + ((btnImgW + 47) >> 1), btnImgY  + (btnImgH >> 1) + btnImgH, 0], "btn2",
				btnTwoImg, btnTwoImg, textLib.txtQuestionErrorTip, btnImgW + 47, btnImgH, params1,
				obj, obj.onAdviseRetroactionTypeClk, 1)},
			
			{css:cssLib["key_icon_txt"]([10 + ((btnImgW + 47) >> 1), btnImgY  + (btnImgH << 1) + (btnImgH >> 1), 0], "btn3",
				btnThreeImg, btnThreeImg, textLib.txtQuestionRestroactionTip, btnImgW + 47, btnImgH, params1,
				obj, obj.onAdviseRetroactionTypeClk, 2)},
			
			{css:cssLib["key_icon_txt"]([sw - 10 - btnSubmitImgW + (btnSubmitImgW >> 1), btnImgY  + (btnSubmitImgH >> 1), 0],
				"submitBtn", btnSubmitImg, btnSubmitImg, textLib.txtSubmitRestroactionTip, btnSubmitImgW, btnSubmitImgH,
				params3, obj, obj.onSubmitPwdClk, 4)},
		],
	};
};