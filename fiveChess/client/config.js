<include check="0">
window.App = jgx.App;
window.UIBody = jgx.App.UIBody;
window.UI = jgx.UI;
window.System = jgx.System;
window.Security = jgx.Security;
window.Dialogs = jgx.Dialogs;
window.Screen = jgx.Screen;
window.setTimeout = jgx.setTimeout;
window.setFrameout = jgx.setFrameout;
window.toJSON = jgx.toJSON;
window.fromJSON = jgx.fromJSON;
window.switchApp = jgx.App.switchApp;
window.exitApp = jgx.exitApp;
null
</include>
//jgx.trap();
//--------------------------------------------------------------------------
//=====================保存的相关标志=============================
window.CookieFlag = "wangzhenApp";
window.userInfoObj = "userInfo"; //用户信息对象 
window.isLogin = "isLogin"; //是否登录了 
window.isAutoLogin = "isAutoLogin"; //是否是自动登录状态 
window.collectGameObj = "collectGameObj"; //收藏的游戏对象  
window.lastSearchKey = "lastSearchKey"; //最近搜索的关键字数组 
//======================================================
//--------------------------------------------------------------------------
window.mainPath = "http://appfile.yooek.net/m1/door.jml"; //启动程序文件
window.FilesURL = "http://appfile.yooek.net/m1/"; //更新文件地址  
window.Redirecturl = "http://m.yooek.net/Order/OrderCallBack"; //支付跳转的路径 
window.Website = "http://www.yooek.com";//"http://m.yooek.com";
window.Language = "cn";
window.Platform = 2;
window.SeviceURL = "http://openapi.yooek.net/open.api"; //连接服务器地址 
window.payMethodSysno = [1, 3, 5];//现有的支付方式的sysno 
window.SevicePhone = "400-820-570";
﻿window.appName = "yooek";
﻿window.cookieDomain = "YOOEK-1";
//------------------------------------需要恢复的--------------------------------------
window.ClientVersion = "1.0";//API文档协议版本号
window.ChannelID = 2;//System.getProperty("ChannelID");
//--------------------------------------------------------------------------

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
window.FPS = 25;
window.countryDefalut = "CHN";
window.ChannelType = System.getProperty("ChannelType");
window.DeviceType = System.getProperty("DeviceType");
window.DeviceID = System.getProperty("DeviceID");
window.Desktop = System.getProperty("Desktop");

window.Imei = System.getProperty("IMEI");
window.AppVersion = System.getProperty("AppVersion");
window.Reference = Security.getProperty("Reference");
window.Identifier = System.getProperty("Identifier")?System.getProperty("Identifier"):"YOOEK-1";
window.Macaddress = System.getProperty("MACADDR");
window.OpenUdid = System.getProperty("OpenUDID");
if(window.PushService && window.PushService.registerRemote)
{
	PushService.registerRemote();
}
window.AppUdid = (window.PushService && window.PushService.getRemoteToken) ? PushService.getRemoteToken() : "";
window.KernelVersion = System.getProperty("KernelVersion");
window.ChannelSign = "";//渠道登录后的token
window.ChannelUid = "";//渠道登录用户名
window.AppID = "";
window.AppExInfo = "";
window.Locality = UIBody.getCookie("Runtime", "Locality");

if("IPHONE"==window.DeviceType)
{
	if(window.DeviceID<"7.0")
	{
		UIBody.setCookie("M1MAC","mac",window.Macaddress,0);
		if(System.setSecurity)
		{
			System.setSecurity("MACADDR",window.Macaddress);
		}
	}
	window.Macaddress = UIBody.getCookie("M1MAC","mac");
	if(!window.Macaddress && System.getSecurity)
	{
		window.Macaddress = System.getSecurity("MACADDR");
	}
}

window.Macaddress = window.Macaddress?window.Macaddress:"";
if(System.getSecurity)
{
	window.AppToken = System.getSecurity("AppUDID");
}
if(!window.AppToken)
{
	window.AppToken = System.getProperty("AppUDID");
	if(System.setSecurity)
	{
		System.setSecurity("AppUDID",window.AppToken);
	}
}
window.AdUdid = System.getProperty("IDFA");
if("IPHONE"==window.DeviceType)
{
	if(!window.AdUdid)
	{
		window.AdUdid = "";
	}
}
else
{
	window.AdUdid = "";
}

//config def:
window.DelayLoad = 30;

window.ScnW = Screen.w;
window.ScnH = Screen.h;
window.NameLen = 8;//名字长度
window.screenType = "hd";
window.scaleTimes = 1;//缩放倍数
window.imgPath = "assets";
window.scale_times = 1;
window.ScreenW = Screen.w;
window.ScreenH = Screen.h;
window.ScreenW_ = Screen.w;
window.ScreenH_ = Screen.h;
<include check="0">
null
</include>

//--------------------------------------------------------------------------
//config settings:

	window.scr2hud = function(pos)
	{
		return [pos[0]/Screen.w*ScreenW,pos[1]/Screen.h*ScreenH,pos[2]];
	};
	
	window.hud2scr=function(pos)
	{
		return [pos[0]/ScreenW*Screen.w,pos[1]/ScreenH*Screen.h,pos[2]];
	};
	
	window.normalTokenType = "Token_1";
	window.normalMoneyType = "Token_2";
	window.normalSpeed = 1;
	window.normalFadeInTime = Math.floor(12/window.normalSpeed);
	window.normalFadeInTime = window.normalFadeInTime<1?1:window.normalFadeInTime;
	window.normalFadeOutTime = Math.floor(5/window.normalSpeed);
	window.normalFadeOutTime = window.normalFadeOutTime<1?1:window.normalFadeOutTime;
	window.keyConfig = {
		"env":{base:0},
		"list":{base:90,inc:100},
		"ui":{base:1000},
		"logic":{base:2000},
		"city":{base:2000},
		"module":{base:10000,inc:10000},
		"board":{base:100000,inc:100000},
		"subpage":{base:10000,inc:10000},
		"labor":{base:0,inc:100},
		"block":{base:2000,inc:500},
		"mapunit":{base:2000}
	};
	window.jmlList = [

	];
	window.defList = [
	];
	window.coreList = ["main.jml", "config.jml", "app_env.js", "app_env_algorithm.js", 
		"import_language.js", "img_lib.jml", "csslib.js", "load_strings_cn.jml", "app_env_net.js",
		"app_env_check.js", "app_env_game.js", "app_env_load.js", "app_env_login.js", "app_env_md5.js"];
	window.coreList2 = [];
	window.relevantList = {};
	window.loacationList = {
		CHN:[
			"北京","上海","天津","重庆","河北","山西","辽宁","吉林","黑龙江",
			"江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东",
			"海南","四川","贵州","云南","陕西","甘肃","青海","台湾","内蒙古",
			"宁夏","新疆","西藏","广西","香港","澳门"
		],
		TWN:["台湾"],
		MAC:["澳门"],
		HKG:["香港"]
	};
	
	function loader(texs, path, loadfunction)
	{
		var imglib, i, tex;
		imglib = {
			genPath:function(file) {
				return UIBody.genPageURL(path + file);
			}
		};
		loadfunction.call(imglib);
		for (i in imglib.imgInfos)
		{
			texs.imgInfos[i]=imglib.imgInfos[i];
		}
		delete imglib.imgInfos;
		delete imglib.imgList;
		delete imglib.genPath;
		for (i in imglib) {
			if (texs[i]) DBOut("Warning! texs.[" + i + "] exist.");
			texs[i] = imglib[i];
			texs[i].w = texs[i].w/scale_times;
			texs[i].h = texs[i].h/scale_times;
		}
	};
	//对象克隆，单层
	window.cloneToObj=function(other,obj)
	{
		if(!obj)obj={};
		for(var i in other)
		{
		//	if(!obj[i])
				obj[i]=other[i];
		}
		return obj;
	};
	
	//多位数字转换为带逗号的字符串
	window.num2str=function(num,chr)
	{
		if(!chr)chr=",";
		var comp=function(x)
		{
			x+="";
			for(var k=x.length; k<3; k++){
				x = "0"+x;
			}
			return x;
		}
		var i=0, j=0, v=0, str="";
		//999,999,999,999
		var list=[1000*1000*1000, 1000*1000, 1000];
		for(i=0; i<list.length; i++)
		{
			v = Math.floor(num/list[i]);
			num = num%list[i];
			if(str.length){
				v=comp(v);
			}
			if(v){
				str += v+chr;
			}
			if(i==list.length-1)
			{
				num=comp(num);
				str += num;
			}
		}
		return str;
	};
//	DBOut("test="+num2str(1000000));
	//毫秒数转换为字符串
	window.minMS=60*1000;//1分钟毫秒数
	window.hourMS=60*minMS;//1小时毫秒数
	window.dayMS=24*hourMS;//1天毫秒数
	window.sec2str=function(num)//milliseconds
	{
		var i=0, v=0, str="";
		var list=[dayMS, hourMS, minMS];

		var sList=["天","小时","分钟"];
		for(i=0; i<list.length; i++)
		{
			v = Math.floor(num/list[i]);
			num = num%list[i];
			if(v){
				str += v+sList[i];
			}
		}
		return str;
	};

	window.isArray = function(obj)
	{
		if(!obj)
		{
			return false;
		}
		if("[object Array]" === toString.apply(obj))
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	
	window.getSignNum = function(num)
	{
		if(num > 0)
		{
			return "+"+num;
		}
		else if(num < 0)
		{
			return ""+num;
		}
		else
		{
			return "--";
		}
	}
	
	window.nameFormat = function(name)
	{
		if(!name)
		{
			return "";
		}
		return name.charAt(0).toLowerCase() + name.substring(1);
	};
	
	window.fromjson = function(str)
	{
		try {
			var code = "var __jsoncode123;__jsoncode123="+str+";__jsoncode123;";
			return eval(code);
		} catch (e) {
			DBOut("can't do fromjson: "+e.toString());
			return null;
		}
		return null;
	};

