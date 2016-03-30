//*********************************************************
//应用状态的基类*******************************************
//*********************************************************
if(!__Page.gameState)
{
	__Page.gameState = function(game)
	{
		if(game)
		{
			this.game = game;
			this.page = game.page;
		}
	};
	
	__Page.gameState.prototype.enter = function(prestate)
	{
		this.preState = prestate;
	};
	
	__Page.gameState.prototype.leave = function(nextstate)
	{
	};
	
	__Page.gameState.prototype.onFree = function()
	{
	};
	
	__Page.gameState.prototype.onTough = function(pen, msg, x, y, way)
	{
		return 0;//Key not handled.
	};
}

//*********************************************************
//记录游戏键盘状态的辅助基类*******************************
//*********************************************************
if(!__Page.keyStateUtil)
{
	__Page.keyStateUtil = function()
	{
		this.mapNumToDit = 1;
		this.keyFlags = [0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0];
		this.KEY_UP = 0;
		this.KEY_DOWN = 1;
		this.KEY_LEFT = 2;
		this.KEY_RIGHT = 3;
		this.KEY_USE = 4;
		this.KEY_TWRUP = 5;
		this.KEY_TWRDOWN = 6;
		this.KEY_TWRLEFT = 7;
		this.KEY_TWRRIGHT = 8;
		this.KEY_ACCUP = 9;
		this.KEY_ACCDOWN = 10;

		this.keyMaps = [];
		this.clearKeys = this.page.keyStateUtil.clearKeys;
		this.autoOnKey = this.page.keyStateUtil.onKey;
		this.regKeyVO = this.page.keyStateUtil.regKeyVO;
		this.delKeyVO = this.page.keyStateUtil.delKeyVO;
	};
	
	
	__Page.keyStateUtil.regKeyVO = function(key, obj, func)
	{
		this.keyMaps[key] = {obj:obj, func:func};
	};
	
	__Page.keyStateUtil.delKeyVO = function(key, obj)
	{
		if(this.keyMaps[key].obj == obj)
		{
			this.keyMaps[key] = null;
		}
	};

	__Page.keyStateUtil.clearKeys = function()
	{
		var i;
		//Clear key states
		for(i in this.keyFlags)
		{
			this.keyFlags[i] = 0;
		}
	};
	
	__Page.keyStateUtil.onKey = function(msg, key, way, extra)
	{
		var keyvo, item;
		//msg=(msg==1)?1:0;
		keyvo = this.keyMaps[key];
		if(keyvo && keyvo.func)
		{
			return keyvo.func.call(keyvo.obj, msg, key, way, extra);
		}
		if(way == 1)
		{
			//For PC:
			if(key == 87)
			{
				key = -11;
			}
			else if(key == 83)
			{
				key = -12;
			}
			else if(key == 65)
			{
				key = -13;
			}
			else if(key == 68)
			{
				key = -14;
			}
			if(key >= -4 && key <= -1)//Dir key
			{
				this.keyFlags[(-key) - 1 + 5] = msg
				return 0;
			}
			if(key >= -14 && key <= -11)//Dir key
			{
				this.keyFlags[(-key) - 11] = msg
				return 1;
			}
			else if(key == -3001)//Acc Left
			{
				this.keyFlags[5] = msg
				return 1;
			}
			else if(key == -3002)//Acc Right
			{
				this.keyFlags[6] = msg
				return 1;
			}
			else if(key == -3003)//Acc mini-Left
			{
				this.keyFlags[7] = msg
				return 1;
			}
			else if(key == -3004)//Acc mini-Right
			{
				this.keyFlags[8] = msg
				return 1;
			}
			else if(key == -3005)//Acc Up
			{
				this.keyFlags[9] = msg
				return 1;
			}
			else if(key == -3006)//Acc Down
			{
				this.keyFlags[10] = msg
				return 1;
			}
			else if(key == -5)
			{
				this.keyFlags[4] = msg;
				return 1;
			}
			else if(this.mapNumToDit)//If we want map number keys to nav keys
			{
				if(key == 49)
				{
					this.keyFlags[0] = msg;
					return 1;
				}
				else if(key == 50)
				{
					this.keyFlags[2] = msg;
					return 1;
				}
				else if(key == 51)
				{
					this.keyFlags[3] = msg;
					return 1;
				}
				else if(key == 52)
				{
					this.keyFlags[1] = msg;
					return 1;
				}
			}
		}
		return 0;
	};
}

//*********************************************************
//记录游戏触屏状态的辅助基类*******************************
//*********************************************************
if(!__Page.touchStateUtil)
{
	__Page.touchStateUtil = function()
	{
		this.mapNumToDit = 1;
		this.touchs = [
			{down:0, downX:0, downY:0, curX:0, curY:0, upX:0, upY:0},
			{down:0, downX:0, downY:0, curX:0, curY:0, upX:0, upY:0}
		];
		this.touchNum = 0;
	};
	
	__Page.touchStateUtil.clearTouchs = function()
	{
		var i;
		for(i in this.touchs)
		{
			this.touchs[i].down = 0;
			this.touchs[i].upX = 0;
			this.touchs[i].upY = 0;
		}
	};
	__Page.touchStateUtil.onTouch=function(pen,msg,x,y,way)
	{
		if(pass==1)
		{
			//TODO: record touches!
		}
		return 0;
	};
}
