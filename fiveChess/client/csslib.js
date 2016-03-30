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

	
	//图片文本控件
	cssLib["icon"] = function(pos, id, img, imgW, imgH, params)
	{
		var cssLib = this;
		img = cssLib.genIconPath(img);
		return{
			"type":"icon", "id":id,"pos":pos,"w":imgW,"h":imgH,"anchor_h":params.ah,"anchor_v":params.av, "ui_event":1,
			obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
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
			"state_down":{"type":"image", "id":"downSpl", "tex":downImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1, },
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
		
			"state_down":{
				"type":"smart", 
				objs:[
					{
						"smtx":0, "smty":0, "smtw":"FW", "smth":"FH", 
						obj:{"type":"image","tex":downImg, "id":"upSpl","tex_u":0, "tex_v":0, "tex_uw":1, "tex_vh":1,},
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
	cssLib["key_box"] = function(pos, sw, sh, param, cbobj, cb, btnMsg)
	{
		return{
			"type":"key", "id":"boxkey", "pos":pos, "w":sw, "h":sh, "ui_event":1, "anchor_h":param.ah,"anchor_v":param.av, "down_scale":param.scale,
			"state_up":{"type":"box", "color":param.upcolor, "w":sw, "h":sh},
			"state_down":{"type":"box",  "color":param.downcolor, "w":sw, "h":sh, },
			OnClick:function(msg, extra)
			{
				if(!cb)
				{
					return;
				}
				cb.call(cbobj, msg, extra, btnMsg);
			},
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