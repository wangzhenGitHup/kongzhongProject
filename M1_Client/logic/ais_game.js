if(!window.aisGame)
{
window.aisGame={
	env:aisEnv,
	appEnv:null,
	king:null,
	curCity:null,
};

//---------------------------------------------------------------------------
//初始化游戏逻辑
window.aisGame.init=function(appEnv)
{
	this.appEnv=appEnv;
	this.king=aisKing.newInstance(aisEnv,1);
};

//---------------------------------------------------------------------------
//更新游戏逻辑
window.aisGame.update=function(nowTime)
{
	DBOut("Will update aisGame!");
	if(!nowTime)
		nowTime=aisEnv.dateTime();
	this.testKing.update(nowTime);
	aisEnv.updateViews();
};

//---------------------------------------------------------------------------
//生成存盘JSON对象VO
window.aisGame.loadFromVO=function(vo,resume)
{
	var king,city;
	king=this.king;
	this.king.readFmVO(vo,resume);
	city=this.curCity=king.citys[0];
	return 0;
};

//---------------------------------------------------------------------------
//生成存盘JSON对象VO
window.aisGame.genSaveVO=function()
{
	return null;
};

//---------------------------------------------------------------------------
//初始化一个全新king
window.aisGame.initNewKing=function()
{
	var cityVO,king,city;
	king=this.king;
	cityVO={
		createTime:0,
		bldWorkers:[{hashId:"Obj2",busy:0,owner:"Obj1"},{hashId:"Obj4",busy:0,owner:"Obj3"}],
		buildings:[
			{codeName:"SmallStone",pos:[5,20,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[32,14,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[9,17,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[26,9,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[24,34,0],level:3,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[10,29,0],level:3,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[4,31,0],level:3,working:0,constructing:0,tasks:[]},
			{codeName:"SmallStone",pos:[30,29,0],level:4,working:0,constructing:0,tasks:[]},
			{codeName:"TownHall",pos:[19,18,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"WorkerHut",pos:[16,22,0],level:1,working:0,constructing:0,tasks:[],hashId:"Obj1"},
			{codeName:"WorkerHut",pos:[16,24,0],level:1,working:0,constructing:0,tasks:[],hashId:"Obj3"},
			{codeName:"GoldVault",pos:[23,15,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Camp",pos:[17,11,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"OilTank",pos:[23,22,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Barrack",pos:[14,17,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Bush",pos:[5,35,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Bush",pos:[29,14,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Bush",pos:[19,6,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Tree",pos:[25,28,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"Tree",pos:[14,5,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Trunk",pos:[5,13,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"Trunk",pos:[15,34,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"Trunk",pos:[32,19,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[8,10,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[5,28,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[21,29,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[29,22,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[34,12,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"RoundTree",pos:[24,4,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Megalithic",pos:[9,4,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Megalithic",pos:[34,38,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"Megalithic",pos:[28,4,0],level:2,working:0,constructing:0,tasks:[]},
			{codeName:"Conifers",pos:[9,22,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Conifers",pos:[36,27,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Pillars",pos:[28,32,0],level:1,working:0,constructing:0,tasks:[]},
			{codeName:"Pillars",pos:[16,8,0],level:1,working:0,constructing:0,tasks:[]},
			],
		fleets:[],events:[],buffs:{},
	};
	king.initNewKing(cityVO);
	city=this.curCity=king.citys[0];
	city.goldStorage.putIn({type:"ResGold",num:1500});
	city.oilStorage.putIn({type:"ResOil",num:1500});
	//TODO: Add initial resources and units into city:
	/*city.genStorage.putIn({type:"resC60",num:100});
	city.genStorage.putIn({type:"resTi",num:100});
	city.fuelStorage.putIn({type:"resHe3",num:2000});
	//放一些零件用来调试
	city.genStorage.putIn({type:"cftMadCat",num:2});
	city.genStorage.putIn({type:"cftSpeedo",num:2});
	city.genStorage.putIn({type:"cftBlckWolf",num:2});
	city.genStorage.putIn({type:"cftLegEmu",num:2});
	city.genStorage.putIn({type:"cftLegOstrich",num:2});*/
};

}