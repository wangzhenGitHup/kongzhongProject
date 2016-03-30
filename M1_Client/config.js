//--------------------------------------------------------------------------
//config sys:
window.ChannelID = System.getProperty("ChannelID");
window.ChannelType = System.getProperty("ChannelType");
window.DeviceType = System.getProperty("DeviceType");
window.DeviceID = System.getProperty("DeviceID");
window.Desktop = System.getProperty("Desktop");
window.ClientVersion = System.getProperty("Version");
window.Imei = System.getProperty("IMEI");
window.AppVersion = System.getProperty("AppVersion");
window.Reference = Security.getProperty("Reference");
window.Identifier = System.getProperty("Identifier")?System.getProperty("Identifier"):"M1";
window.Macaddress = System.getProperty("MACADDR");
window.OpenUdid=System.getProperty("OpenUDID");
if(window.PushService && window.PushService.registerRemote)PushService.registerRemote();
window.AppUdid=(window.PushService && window.PushService.getRemoteToken)?PushService.getRemoteToken():"";
window.NeedRegCode = System.getProperty("NeedRegCode");
window.KernelVersion = System.getProperty("KernelVersion");
window.ChannelSign="";//渠道登录后的token
window.ChannelUid="";//渠道登录用户名
window.ChannelType_byZFZX="";//支付中心的ChannelType
window.AppID="";
window.AppExInfo="";
window.Locality=UIBody.getCookie("Runtime","Locality");
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

//--------------------------------------------------------------------------
//config server:
window.mainPath = "http://m1cnup.ko.cn/m1/door.jml";
window.GameSocketUrl=__Page.getCookie("Runtime","GameSocketUrl");
window.GameDWRUrl=__Page.getCookie("Runtime","GameDWRUrl")?__Page.getCookie("Runtime","GameDWRUrl"):"http://host:port/game/dwr";//程序中动态就修改
window.UserCenter=__Page.getCookie("Runtime","UserCenter")?__Page.getCookie("Runtime","UserCenter"):"http://m1cnuc.ko.cn:7001/UserCenter/dwr";
window.UserDWRUrl = "http://m1cnup.ko.cn/UserServer/dwr/";
window.ClanDWRUrl = __Page.getCookie("Runtime","ClanDWRUrl")?__Page.getCookie("Runtime","ClanDWRUrl"):"http://118.26.202.110:7111/clan/dwr";
window.ReplayDWRUrl="http://118.26.202.116:9201/game/dwr/";
window.NoticeDWRUrl="http://m1cnup.ko.cn/UserServer/dwr";
window.PurchaseUrl=__Page.getCookie("Runtime","PurchaseUrl")?__Page.getCookie("Runtime","PurchaseUrl"):"http://m1cnuc.ko.cn:7001/UserCenter/action/pay.jsp";

window.ChatDWRUrl = ["http://211.100.96.79:9101/cn1xolchat/dwr","http://118.26.202.93:9101/cn1xolchat/dwr","http://118.26.202.94:9101/cn1xolchat/dwr"];

window.DachengCbURL = ["http://211.100.96.79:9211/xol/servlet/dachengcharge","http://118.26.202.93:9211/xol/servlet/dachengcharge","http://118.26.202.94:9211/xol/servlet/dachengcharge"];
window.BankDWRUrl = "http://bank.handmo.cn/bank/dwr";
window.SZXCbURL = ["http://211.100.96.79:9211/xol/servlet/szxcharge","http://118.26.202.93:9211/xol/servlet/szxcharge","http://118.26.202.94:9211/xol/servlet/szxcharge"];
window.JUNCbURL = ["http://211.100.96.79:9211/xol/servlet/juncharge","http://118.26.202.93:9211/xol/servlet/juncharge","http://118.26.202.94:9211/xol/servlet/juncharge"];
window.ndpayCbURL = ["http://211.100.96.79:9211/xol/servlet/ndpaycharge","http://118.26.202.93:9221/xol/servlet/ndpaycharge","http://118.26.202.94:9231/xol/servlet/ndpaycharge"];
window.ndpayOrderURL = "http://bank.handmo.cn/bank/orderBy91.jsp";
window.taobaoCbURL = ["http://211.100.96.79:9211/xol/servlet/taobaocharge","http://118.26.202.93:9221/xol/servlet/taobaocharge","http://118.26.202.94:9231/xol/servlet/taobaocharge"];
window.taobaoDWRUrl = "http://bank.handmo.cn/bank/dwr";
window.DLCbURL = ["http://211.100.96.79:9211/xol/servlet/danglecharge","http://118.26.202.93:9221/xol/servlet/danglecharge","http://118.26.202.94:9231/xol/servlet/danglecharge"];
window.Language = "cn";
window.Platform = 2;
window.DEBUGMODE=__Page.getCookie("Runtime","DEBUGMODE")?parseInt(__Page.getCookie("Runtime","DEBUGMODE"),10):0;
window.CUTTIMESW=0;//时间碎片功能开关
//--------------------------------------------------------------------------
//config game:
﻿window.appName = "M1-game";
﻿window.cookieDomain = "M1";
window.FPS = 25;
window.countryDefalut = "CHN";
window.ServiceMail = "kdzz_kefu@kongzhong.com";
window.Website = "http://kdzz.kongzhong.com";
window.ActDef={};
window.ActDef.bld={
	ACT_STAY:        0,
	ACT_CRASHED:     1,
	ACT_CONSTRUCTING:2,
	ACT_WORKING:     3,
	ACT_ATTACK:      4,

	ACT_STORE1:      5,
	ACT_STORE2:      6,
	ACT_STORE3:      7,
};
window.ActDef.chr={
	ACT_STAY:        0,
	ACT_CRASHED:     1,
	ACT_MOVE:        2,
	ACT_ATTACK:      3,
	ACT_WORK:        4,

	ACT_CHEER:       5,
};
window.DelayLoad=30;
//--------------------------------------------------------------------------
//config def:
window.ScnW = Screen.w;
window.ScnH = Screen.h;
<include check="0">
window.NameLen=8;//名字长度
window.screenType = "hd";
window.scaleTimes = 1;//缩放倍数
window.imgPath = "assets_hd";
window.scale_times=1;
window.ScreenW=Screen.w;
window.ScreenH=Screen.h;
window.ScreenW_=Screen.w;
window.ScreenH_=Screen.h;
null
</include>
window.FS = {
	XXXL:40,
	XXL:30,
	XL:26,
	L:20,
	M:18,
	S:16,
	SM:12,

	FB:40,
	FM:24,
	FS:14,
};
window.c_black=[0,0,0,255];
window.c_black2=[32,24,15,255];
window.c_black3=[45,28,2,255];
window.c_black4=[25,20,14,255];
window.c_white=[255,255,255,255];
window.c_red=[255,0,0,255];
window.c_red2=[254,39,2,255];
window.c_gold=[255,186,59,255];
window.c_purple=[216,133,251,255];//紫色
window.c_yellow=[255,237,189,255];
window.c_yellow2=[254,244,0,255];
window.c_yellow3=[255,182,47];
window.c_brown=[95,42,1,255];//棕色
window.c_blue=[46,110,194,255];
window.c_orange=[239,102,21,255];
window.c_pink=[249,158,173,255];//粉红色
window.c_green=[59,255,86,255];
window.c_green1=[18,255,0,255];
//--------------------------------------------------------------------------
//config settings:

	window.scr2hud=function(pos)
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
	window.coreList = ["main.jml","important.jml","config.jml","logic/logic_loading.jml","app_env.jml","dwr.jml"];
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
	//	var sList=[__Page.STR.DaysS, __Page.STR.HoursS, __Page.STR.MinutesS];
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
//	DBOut("test="+sec2str(1*dayMS+10*hourMS+10*minMS));
	window.isArray=function(obj)
	{
		if(!obj)
			return false;
	//	if(obj instanceof Array)
	//	if(arr.constructor == Array)
	//	if(Object.prototype.toString.call(o) === '[object Array]')
		if("[object Array]" === toString.apply(obj))
			return true;
		else
			return false;
	};
	window.getSignNum=function(num)
	{
		if(num>0)return "+"+num;
		else if(num<0) return ""+num;
		else return "--";
	}
	window.nameFormat=function(name)
	{
		if(!name)return "";
		return name.charAt(0).toLowerCase()+name.substring(1);
	//	return name.charAt(0).toUpperCase()+name.substring(1);
	};
	window.fromjson=function(str)
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
	window.sendHttp=function(url, param, callback)
	{
		var key, uri = [];
		for(key in param) {
			uri.push(encodeURIComponent(key) + "=" + encodeURIComponent(param[key]));
		}
		if (uri.length) {
			if (url.indexOf("?") < 0) {
				url += "?" + uri.join("&");
			} else {
				url += "&" + uri.join("&");
			}
		}
		var xhr = new XMLHttpRequest();
		DBOut("sendHttp url:"+url);
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function(){
			DBOut("xhr.readyState:" + xhr.readyState + ", xhr.status:" + xhr.status + ", xhr.responseText:" + toJSON(xhr.responseText) + ".");
			callback(4 == xhr.readyState && 200 == xhr.status, xhr.responseText);
		};
		xhr.send();
	}

