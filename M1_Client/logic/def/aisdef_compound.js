if(window.aisEnv.defLib && window.aisEnv.defLib.compound && !window.aisEnv.defLib.compound.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.compound;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["SameLevel"]=[0.8,0.6,0.5,0.4,0.3,0.25,0.2,0.15];
		defLib["DiffLevel"]=[1,0.8,0.8,0.7,0.7,0.6,0.55,0.5];
	})();
}
