/*
	
*/
if(!__Page.stateGame)
{
	__Page.stateGame = {
		page:__Page,
		name:"JGXUI_stateGame",
		prjFilePath:null,
		
		SPACE_GAP:31.2, //格子之间的间隔
		RANK:0, //值为0 则难度最高
		BLACK_CHESS:-1, //黑棋 //暂定为人
		WHITE_CHESS:1, //白棋  //暂定为电脑
		NO_CHESS:0, //没有棋子
		CHESS_LEN:15, //棋盘尺寸
		DIRECTION_NUMBER:4,//方向
		RAND_MAX:327677,
		SUCCESS_VAR:5, //五子连珠
		WIN_SCORE:36000,//要赢的分数
		
		//禁手类型
		HAND_CUT_33:1,//	三三禁手	
		HAND_CUT_44:2,//	四四禁手	
		LONG_LONG_HAND_CUT:3,//	长连禁手	

		//棋型标号
		LIFE_4_LIFE_4:1, //活四活四
		LIFE_4_DIE_4:2, //活四死四
		LIFE_4_LIFE_3:3, //活四活三
		DIE_4_DIE_4:4, //死四死四
		LIFE_4:5, //活四
		BAN5:6,
		DIE_4_LIFE_3:7, //死四活三
		JUMP_LIFE_4_LIFE_3:8, //跳活四活三
		JUMP_DIE_4_LIFE_3:9, //跳死四活三
		LIFE_3_LIFE_3:10, //活三活三

		//棋型分值
		MAX_VALUE:1000000, //当连成5子时返回无限大值
		LIFE_4_LIFE_4F:750000, //	8192 8184(单跳) 8176(双跳)	双活四
		LIFE_4_DIE_4F:700000, //	6144 6140 6136 6132	 活四死四
		LIFE_4_LIFE_3F:650000, //	4608 4600 4592	活四活三
		DIE_4_DIE_4F:600000,	//	4096 4092 4088
		LIFE_4F:550000,	    //	4096  活四
		JUMP_LIFE_4_LIFE_3F:500000,
		DIE_4_LIFE_3F:450000,	//	2560 2552(跳三) 2556(跳四) 2548(跳三跳四)
		JUMP_DIE_4_LIFE_3F:400000,
		LIFE_3_LIFE_3F:350000,	//	1024 1016(单跳活三) 1008(双跳活三)
		BASEF:10, //得分基数	
		BORDLEN:1, //边界扩展宽度
		G_depth:2, //全递归深度
		ATTACK:3,
		
		totalAttackCount:0, //总共下了几局
		winAttackCount:0, //赢了几局
		failedAttackCount:0, //输了几局
		robotChessLocation:[],//电脑下棋的坐标
		saveChessStep:[], //保存棋子的步骤
		recordChessPosition:[15], //用于记录棋盘上的哪些点已经下子了
		recordChessObjOfHuman:[], //人的棋子对象
		recordChessObjRobot:[], //机器人的棋子对象
		isRobotThink:false, //是否是电脑在思考下棋 
		recordRobotPositionObj:{flag:0, pos_x:7, pos_y:7}, //机器下棋的对象
		TOTAL_SPACES:225, //总共的格子数
		directionObj:[[[1, 0], [-1, 0]], [[1, 1], [-1, -1]], [[0, 1], [0, -1]], [[-1, 1], [1, -1]]],
		//一些数据结构体模式样例
		Matrix:{up:0, down:0, left:0, right:0}, //矩形框架
		
		//         x,   y坐标  棋子颜色
		//M_point:{x:0, y:0, player:0}, //棋步
		//now_step:{x:7, y:7}, //如今的坐标
		//M_score:{point:{x:0, y:0, player:0}, score:0}, //棋步和得分
	
		/*
		Single_form:{
			player:0, //棋子颜色
			chessCount:0, //相同棋子的数量
			space:0, //空位数量
			left_wall:false, //左堵
			right_wall:false, //右堵
			score:0, //得分
			rival_ban:false, //对方是否用禁手
		}, //单向棋形
		*/

		/*
		Form_score:{
			type:0, //综合棋形
			score:0, //综合得分
		},//综合 棋形和得分
		*/

		//Point:{x:0, y:0},//用于输出坐标
	};

	__Page.stateGame.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.vo = appEnv.stateDataObj;
		
		page.keyStateUtil.call(this);

		this.stateGameLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_game_css.js"</include>
		
		this.stateGameItem = this.stateGameLayer.appendNewChild(this.initCSS(appEnv.scrSize[0], appEnv.scrSize[1]));
		this.tipItem = this.stateGameItem.findItemById("tip");
		this.stateGameLayer.setUIEvent(1);

		this.initData();
	};

	//生成随机数函数
	__Page.stateGame.rand = function()
	{
		var seed = Math.random() * this.RAND_MAX;
		return parseInt(seed);
	};
	
	//初始化数据
	__Page.stateGame.initData = function()
	{
		var i, j, k;
		
		//初始化棋盘数组
		for(i = 0; i < this.CHESS_LEN; i++)
		{
			this.recordChessPosition[i] = [];
			for(j = 0; j < this.CHESS_LEN; j++)
			{
				this.recordChessPosition[i][j] = this.NO_CHESS;
			}
		}	

		this.Matrix.up = this.CHESS_LEN;
		this.Matrix.down = -1;
		this.Matrix.left = this.CHESS_LEN;
		this.Matrix.right = -1;
	};
	
	//清楚数据
	__Page.stateGame.clearData = function()
	{
		var i, j;
		
		for(i = 0; i < this.CHESS_LEN; i++)
		{
			for(j = 0; j < this.CHESS_LEN; j++)
			{
				this.recordChessPosition[i][j] = this.NO_CHESS;
			}
		}

		var len = this.recordChessObjOfHuman.length;
		
		for(i = 0; i < len; i++)
		{
			this.stateGameLayer.removeChild(this.recordChessObjOfHuman[i]);
		}
		this.recordChessObjOfHuman.splice(0, len);
		
		len = this.recordChessObjRobot.length;
		for(i = 0; i < len; i++)
		{
			this.stateGameLayer.removeChild(this.recordChessObjRobot[i]);
		}
		this.recordChessObjRobot.splice(0, len);
		
		len = this.saveChessStep.length;
		this.saveChessStep.splice(0, len);
		
		len = this.robotChessLocation.length;
		this.robotChessLocation.splice(0, len);
		
		this.Matrix.up = this.CHESS_LEN;
		this.Matrix.down = -1;
		this.Matrix.left = this.CHESS_LEN;
		this.Matrix.right = -1;
		
		this.isRobotThink = false;
		this.TOTAL_SPACES = 225;
	};
	
	//界面被激活的响应函数:
	__Page.stateGame.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateGame enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
	};

	//界面被切走的响应函数:
	__Page.stateGame.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		
		this.clearData();
		this.totalAttackCount = 0;
		this.winAttackCount = 0;
		this.failedAttackCount = 0;
		
		this.stateGameLayer.removeAllChild();
		nextState.init(page.appEnv);
	};

	__Page.stateGame.onTouch = function(pen, msg, pos_x, pos_y, pass)
	{
		var downObj;
		//DBOut("***********msg : " + msg + ", pass: " + pass + ", pen: " + pen);
		if(this.isRobotThink)
		{
			return;
		}
		if(0 == msg && 0 == pass)
		{
			//DBOut("=====pos_x: " + pos_x + ", pos_y: " + pos_y + "=========");
			var x = pos_x;
			var y = pos_y;
			if(x >= 16 && x <= 462 && y >= 170 && y <= 642)
			{
			  var tempX, tempY;
			  var gapX, gapY;
			  var divX = Math.floor((x - 20) / this.SPACE_GAP);
			  var divY = Math.floor((y - 180) / this.SPACE_GAP);
			  
			  tempX = ((x - 20) / this.SPACE_GAP).toFixed(1);
			  tempY = ((y - 180) / this.SPACE_GAP).toFixed(1);
			  
			  gapX = tempX - divX;
			  gapY = tempY - divY;
			 // DBOut("****gapX: " + gapX + ", gapY: " + gapY);
			  if(parseFloat(gapX) >= parseFloat(0.5) && parseFloat(gapX) <= parseFloat(1.0))
			  {
				 tempX = Math.floor((x - 20) / this.SPACE_GAP) + 1;

				 if(parseFloat(gapY) >= parseFloat(0.5) && parseFloat(gapY) <= parseFloat(1.0))
				 {
					tempY = Math.floor((y - 180) / this.SPACE_GAP) + 1;
				 }
				 else if(parseFloat(gapY) >= parseFloat(0.0) && parseFloat(gapY) < parseFloat(0.6))
				 {
					tempY = Math.floor((y - 180) / this.SPACE_GAP);
				 }
			  }
			  else if(parseFloat(gapX) >= parseFloat(0.0) && parseFloat(gapX) < parseFloat(0.5))
			  {
				 tempX = Math.floor((x - 20) / this.SPACE_GAP);
				 if(parseFloat(gapY) >= parseFloat(0.5) && parseFloat(gapY) <= parseFloat(1.0))
				 {
					tempY = Math.floor((y - 180) / this.SPACE_GAP) + 1;
				 }
				 else if(parseFloat(gapY) >= parseFloat(0.0) && parseFloat(gapY) < parseFloat(0.5))
				 {
					tempY = Math.floor((y - 180) / this.SPACE_GAP);
				 }
			  }
			  else
			  {
				  return;
			  }
			 
			  if(this.recordChessPosition[tempX][tempY] != this.NO_CHESS)
			  {
				  Dialogs.alert("该位置已有棋子！");
				  return;
			  }
			 // DBOut("fffffff-----x: " + tempX + ", y: " + tempY);
			  this.createChessCss(this.BLACK_CHESS, tempX, tempY);
			  this.recordChessPosition[tempX][tempY] = this.BLACK_CHESS;
			  this.TOTAL_SPACES--;
			  this.saveChessStep.push({x:tempX, y:tempY});
			  
			  if(this.TOTAL_SPACES <= 0)
			  {
			     Dialogs.alert("游戏平局！");
				 this.totalAttackCount++;
				 this.appEnv.form.setTimeout(30, function(){ this.clearData();}, this);
				 return;
			  }
			  
			  len = this.saveChessStep.length;
			  if(this.isGameWin(this.recordChessPosition, this.saveChessStep[len - 1], this.BLACK_CHESS))
			  {
				 Dialogs.alert("游戏胜利！");
				 this.totalAttackCount++;
				 this.winAttackCount++;
				 this.showResult();
				 this.appEnv.form.setTimeout(30, function(){ this.clearData();}, this);
				 return;
			  }
			  
			  var step = {x:tempX, y:tempY, player:this.BLACK_CHESS};
			  if(this.is_handCut(this.recordChessPosition, step) != 0)
			  {
				   Dialogs.alert("违反禁手规则！游戏失败");
				   this.appEnv.form.setTimeout(30, function(){ this.clearData();}, this);
				   return;
			  }
			  
			  //======电脑下========
			  this.computerAI(this.recordChessPosition, this.Matrix, this.WHITE_CHESS, this.saveChessStep[len - 1], this.RANK, 3);
			  if(0 >= this.TOTAL_SPACES)
			  {
				 Dialogs.alert("游戏平局！");
				 this.totalAttackCount++;
				 this.appEnv.form.setTimeout(30, function(){ this.clearData();}, this);
				 return;
			  }
			  
			  len = this.saveChessStep.length;
			  if(this.isGameWin(this.recordChessPosition, this.saveChessStep[len - 1], this.WHITE_CHESS))
			  {
			     Dialogs.alert("游戏失败！"); 
				 this.totalAttackCount++;
				 this.failedAttackCount++;
				 this.showResult();
				 this.appEnv.form.setTimeout(30, function(){this.clearData();}, this);
				 return;
			  }
			}
		}
	};
	
	//显示每局的结果
	__Page.stateGame.showResult = function()
	{
		this.tipItem._setText("总共下了" + this.totalAttackCount + "局，您赢了" + this.winAttackCount + "局，输了" + this.failedAttackCount + "局");
	};
	
	__Page.stateGame.onKey = function(msg, key, way, extra)
	{
		var ret, appEnv, url;
		appEnv = this.appEnv;
		ret = this.autoOnKey(msg, key, way, extra);
		if(ret)
		{
			return ret;
		}
		return 0;
	};
	
	//在相应位置创建棋子
	__Page.stateGame.createChessCss = function(who, x, y)
	{
		var img = "white";
		var imgW = 16;
		var imgH = 16;
		var page = this.page;
		var cssLib = page.cssLib;
		var item;
		
		var endX = 20 + x * this.SPACE_GAP - 8;
		var endY = 180 + y * this.SPACE_GAP - 8;
		var pos = [endX, endY, 0];
		if(this.BLACK_CHESS == who)
		{
			img = "black";
			item = this.stateGameLayer.appendNewChild({css:cssLib["icon"](pos, "chessBlack", img, imgW, imgH, {av:0, ah:0})});
			this.recordChessObjRobot.push(item);
		}
		else
		{
			item = this.stateGameLayer.appendNewChild({css:cssLib["icon"](pos, "chessWhite", img, imgW, imgH, {av:0, ah:0})});
			this.recordChessObjOfHuman.push(item);
		}
	};
	
	//重新开始
	__Page.stateGame.resetGameClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.clearData();
		}
	};
	
	//退出游戏
	__Page.stateGame.exitGameClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.appEnv.switchState(this.page.stateHome, 1, null);
		}
	};
	
	//悔棋
	__Page.stateGame.recallPreStepClk = function(msg, extra)
	{
		if(1 == msg)
		{
			//DBOut("悔棋!!");
			Dialogs.alert("暂未开通！");
		}
	};
	
	//判断下棋范围有没有超过
	__Page.stateGame.isOverRange = function(x, y)
	{
		if(x < 0 || y < 0 || x > this.CHESS_LEN - 1 || y > this.CHESS_LEN - 1)
		{
			return true;
		}
		return false;
	};
	
//===================================================AI部分====================================================//
	//计算每个方向的棋型和得分
	__Page.stateGame.calEveryDirectionChessTypeScore = function(map, step, left, up)
	{
		var i, x, y;
		var count = 0; //计数
		var	score = 0; //分数
		var num = 1; //棋子数
		var xa, ya; //临时坐标
		var space = 0; //空格数
		var left_wall = false; //左堵
		var right_wall = false; //右堵
		var rival_step = {}; //对方棋步
		var is_break = false; //是否跳出
		var rival_ban = false; //对方是否有禁手

		rival_step.player = -1 * step.player;
		
		//纵向计算向上，横向计算向左，左斜右斜计算向左
		for(i = 1; i <= this.DIRECTION_NUMBER; i++)
		{
			is_break = true;
			count++;
			x = step.x - i * left;
			y = step.y - i * up;

			//超出了左边范围 路已堵住
			if(this.isOverRange(x, y))
			{
				left_wall = true;
				break;	
			}
			
			//该坐标是自己的棋子num加1
			if(map[x][y] == step.player)
			{
				num++;
			}
			else if(map[x][y] == (-1 * step.player))//该坐标是对方的棋子 路已堵住
			{
				left_wall = true;
				break;
			}//if
			
			//如果当前棋子为空，则判断下一个棋子
			if(map[x][y] == this.NO_CHESS)
			{
				rival_step.x = x;
				rival_step.y = y;
				
				if(this.is_handCut(map, rival_step) != 0)
				{
					rival_ban = true;
				}
				xa = x - left;
				ya = y - up;
				
				if(this.isOverRange(xa, ya))
				{
					left_wall = true;
					break;
				}

				//如果下一个棋子也为空，则左堵为假
				if(map[xa][ya] == this.NO_CHESS)
				{
					left_wall = false;
					break;
				}//if

				//如果下一个棋子与棋步的类型相同，则将空格数加一
				if(map[xa][ya] == step.player)
				{
					space++;
				}
				
				//如果下一个棋子是对方棋子，则左堵
				if(map[xa][ya] == (-1 * step.player))
				{
					left_wall = false;
					break;
				}
			}//if 
			
			is_break = false;
		}// for

		//如果正常退出循环，还要判断最左边一子
		if(!is_break)
		{
			xa = x - left;
			ya = y - up;
			if(this.isOverRange(xa, ya))
			{
				left_wall = true;
			}
			else
			{
				if(map[xa][ya] == this.NO_CHESS)
				{
					left_wall = false;
				}
				
				if(map[xa][ya] == (-1 * step.player))
				{
					left_wall = true;
				}
			}
		}
		else
		{
			count--;
		}
		
		//如果左边或是上边都已经有活四了，即count=4时，另一方向的你还计算个啥
		//纵向计算向下，横向计算向右，左斜右斜计算向右
		for(i = 1; i <= this.DIRECTION_NUMBER - count; i++)
		{
			is_break = true;
			x = step.x + i * left;
			y = step.y + i * up;
			
			//超出了右边范围 路已堵住
			if(this.isOverRange(x, y))
			{
				right_wall = true;
				break;
			}
			else if(map[x][y] == step.player)
			{
				num++;
			}
			else if(map[x][y] == (-1 * step.player))
			{
				right_wall = true;
				break;	
			}
			else if(map[x][y] == this.NO_CHESS)
			{
				rival_step.x = x;
				rival_step.y = y;
				
				if(this.is_handCut(map, rival_step) != 0)
				{
					rival_ban = true;
				}
				
				xa = x + left;
				ya = y + up;
				
				//超出范围 右路堵住
				if(this.isOverRange(xa, ya))
				{
					right_wall = true;//false;
					break;
				}

				//如果下一个棋子也为空，则左堵为假
				if(map[xa][ya] == this.NO_CHESS)
				{
					right_wall = false;
					break;
				}
				
				//如果下一个棋子与棋步的类型相同，则将空格数加一
				if(map[xa][ya] == step.player)
				{
					space++;
				}
				
				//如果下一个是对方棋子 则右路堵住
				if(map[xa][ya] == (-1 * step.player))
				{
					right_wall = true;//false;
					break;
				}
			}
			
			is_break = false;
		}//for

		//如果正常退出循环，还要判断最右边一子
		if(!is_break)
		{
			xa = x + left;
			ya = y + up;
			
			if(this.isOverRange(xa, ya))
			{
				right_wall = true;
			}
			else if(map[xa][xa] == this.NO_CHESS)
			{
				right_wall = false;
			}
			else if(map[xa][xa] == (-1 * step.player))
			{
				right_wall = true;
			}
		}//if

		if(rival_ban)
		{
			num++;
			space--;
		}

		score = Math.pow(this.BASEF, num);
		
		if(space != 0)
		{
			score -= Math.pow(this.BASEF, space);
		}
		
		if(left_wall || right_wall)
		{
			score >>= 1;
		}
		if(left_wall && right_wall)
		{
			score = 1;
		}
		
		if(num == this.SUCCESS_VAR)
		{
			score = this.MAX_VALUE;
		}
		//DBOut("!!!!!!!!!!!!!!!!!: " + score);
		var chessTypeObj = {}; //单向棋型
		chessTypeObj.left_wall = left_wall;
		chessTypeObj.right_wall = right_wall;
		chessTypeObj.score = score;
		chessTypeObj.player = step.player;
		chessTypeObj.chessCount = num;
		chessTypeObj.space = space;
		chessTypeObj.rival_ban = rival_ban;
		return chessTypeObj;
	};
	
	//计算综合单向棋型和得分
	__Page.stateGame.calComplexChessTypeScore = function(map, step)
	{
		var score_1, score_2;
		var directionScoreArray = [];
		var complexChessTypeObj = {type:0, score:0};

		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 0)); //纵向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 0, 1)); //横向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 1)); //左斜
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, -1, 1)); //右斜
		this.insertSort(directionScoreArray, directionScoreArray.length); //根据分数由大到小排序
		
		score_1 = directionScoreArray[0];
		score_2 = directionScoreArray[1];
		
		//活四活四
		if(!score_1.left_wall && !score_1.right_wall && score_1.chessCount == this.SUCCESS_VAR - 1 && 
			!score_2.left_wall && !score_2.right_wall && score_2.chessCount == this.SUCCESS_VAR - 1)
		{
			complexChessTypeObj.type = this.LIFE_4_LIFE_4;		
			complexChessTypeObj.score = this.LIFE_4_LIFE_4F;	
			return complexChessTypeObj;
		}//if

		//活四死四
		if(score_1.chessCount == this.SUCCESS_VAR - 1 && score_2.chessCount == this.SUCCESS_VAR - 1)
		{
			if(!score_1.left_wall && !score_1.right_wall && (score_2.left_wall || score_2.right_wall))
			{
				complexChessTypeObj.type = this.LIFE_4_DIE_4;		
				complexChessTypeObj.score = this.LIFE_4_DIE_4F;	
				return complexChessTypeObj;
			}//if
		}//if

		//活四活三
		if(!score_1.left_wall && !score_1.right_wall && score_1.chessCount == this.SUCCESS_VAR - 1 && score_1.space == 0 &&
			!score_2.left_wall && !score_2.right_wall && score_2.chessCount == this.SUCCESS_VAR - 2 && score_2.space < 2)
		{

			complexChessTypeObj.type = this.LIFE_4_LIFE_3;		
			complexChessTypeObj.score = this.LIFE_4_LIFE_3F;	
			return complexChessTypeObj;
		}//if

		//死四死四
		if(score_1.chessCount == this.SUCCESS_VAR - 1 && score_2.chessCount == this.SUCCESS_VAR - 1)
		{
			if((score_1.left_wall || score_1.right_wall) && (score_2.left_wall || score_2.right_wall))
			{
				complexChessTypeObj.type = this.DIE_4_DIE_4;	
				complexChessTypeObj.score = this.DIE_4_DIE_4F;
				return complexChessTypeObj;
			}//if
		}
		
		//单活四
		if(!score_1.left_wall && !score_1.right_wall && score_1.chessCount == this.SUCCESS_VAR - 1 && score_1.space == 0)
		{
			complexChessTypeObj.type = this.LIFE_4;	
			complexChessTypeObj.score = this.LIFE_4F;
			return complexChessTypeObj;
		}//if

		//死四活三
		if(score_1.chessCount == this.SUCCESS_VAR - 1 && score_1.space == 0 && score_2.chessCount == this.SUCCESS_VAR - 2 && score_2.space < 2)
		{
			if((score_1.left_wall || score_1.right_wall) && !score_2.left_wall && !score_2.right_wall)
			{
				complexChessTypeObj.type = this.DIE_4_LIFE_3;	
				complexChessTypeObj.score = this.DIE_4_LIFE_3F;
				return complexChessTypeObj;
			}//if
		}
		
		//活三活三
		if(score_1.chessCount == this.SUCCESS_VAR - 2 && score_2.chessCount == this.SUCCESS_VAR - 2 && !score_1.left_wall && 
			!score_1.right_wall && !score_2.left_wall && !score_2.right_wall && score_1.space < 2 && score_2.space < 2)
		{
			complexChessTypeObj.type = this.LIFE_3_LIFE_3;		
			complexChessTypeObj.score = this.LIFE_3_LIFE_3F;
			return complexChessTypeObj;
		}//if

		//跳活四活三 
		if(score_1.chessCount == this.SUCCESS_VAR - 1 && score_1.space != 0 && !score_1.left_wall && !score_1.right_wall  
			&& score_2.chessCount == this.SUCCESS_VAR - 2 && !score_2.left_wall && !score_2.right_wall && score_2.space)
		{
			complexChessTypeObj.type = this.JUMP_LIFE_4_LIFE_3;		
			complexChessTypeObj.score = this.JUMP_LIFE_4_LIFE_3F;
			return complexChessTypeObj;
		}//if

		//跳死四活三
		if(score_1.chessCount == this.SUCCESS_VAR - 1 && score_1.space != 0 && score_2.chessCount == this.SUCCESS_VAR - 2 && 
			score_2.space < 2)
		{
			if(score_1.left_wall  || score_2.right_wall)
			{
				complexChessTypeObj.type = this.JUMP_DIE_4_LIFE_3;		
				complexChessTypeObj.score = this.JUMP_DIE_4_LIFE_3F;
				return complexChessTypeObj;
			}// if
		}
		
		//其他情况
		complexChessTypeObj.type = 0;
		complexChessTypeObj.score = score_1.score + score_2.score;
		//DBOut("#############: " + complexChessTypeObj.score);
		return complexChessTypeObj;
	};
	
	//计算当前最佳落子位置
	__Page.stateGame.calCurrentBestChessPosition = function(map, mat, player)
	{
		var i, j;
		var get_score; //得分
		var itemCount; //项数
		var nextIndex; //待下步索引
		var bord_mat = {}; //边界矩形
		var self_maxScore; //己方最高分
		var	chessStep_score; //棋步和得分
		var opponent_maxScore; //对方最高分
		var	return_step_score; //返回棋步和得分
		var	complex_chessType_score; //综合棋形和得分
		var self_chessStep_scores = []; //己方棋步和得分数组
		var opponent_chessStep_scores = []; //对方棋步和得分数组
		var self_maxScore_chessSteps = []; //己方最高得分棋步数组
		var opponent_maxScore_chessSteps = []; //对方最高得分棋步数组
		var intersect_maxScore_chessSteps = []; //相交最高得分棋步数组
		
		self_maxScore = opponent_maxScore = -1 * (this.MAX_VALUE); //赋值
		bord_mat.up = mat.up;
		bord_mat.left = mat.left;
		bord_mat.down = mat.down;
		bord_mat.right = mat.right;
		
		this.expandMatrix(bord_mat, this.BORDLEN);
		chessStep_score = this.calCurrentImportantChessStep(map, bord_mat, player);

		if(chessStep_score.score != 0)
		{
			return chessStep_score;
		}
		
		//其他情况
		for(i = bord_mat.left; i <= bord_mat.right; i++)
		{
			for(j = bord_mat.up; j <= bord_mat.down; j++)
			{
				if(map[i][j] != this.NO_CHESS)
				{
					continue;
				}
				
				var step = {};
				step.x = i;
				step.y = j;
				step.player = player;
				if(this.is_handCut(map, step) != 0)
				{
					continue;
				}
				
				//DBOut("============================");
				//计算综合棋形和得分
				complex_chessType_score = this.calComplexChessTypeScore(map, step); 
				get_score = complex_chessType_score.score;
				
				var score1 = {};
				score1.point = step;
				score1.score = get_score;
				self_maxScore = get_score > self_maxScore ? get_score : self_maxScore;
				self_chessStep_scores.push(score1);

				//置换成对手
				step.player *= -1;
				
				//计算综合单向棋型和得分
				complex_chessType_score = this.calComplexChessTypeScore(map, step); 
				
				//得分
				get_score = complex_chessType_score.score;
		
				if(this.is_handCut(map, step) != 0)
				{
					continue;
				}
	
				var score2 = {};
				score2.point = step;
				score2.score = get_score;
				opponent_maxScore = get_score > opponent_maxScore ? get_score : opponent_maxScore;
				opponent_chessStep_scores.push(score2);
			}//for
		}
		
		//求出己方最高棋步和得分数组
		for(i = 0; i < self_chessStep_scores.length; i++)
		{
			if(self_chessStep_scores[i].score == self_maxScore || (self_chessStep_scores[i].score > this.MAX_VALUE - 500))
			{//DBOut("5555555555555555555: " + self_chessStep_scores[i].point.x + ", y: " + self_chessStep_scores[i].point.y);
				self_maxScore_chessSteps.push(self_chessStep_scores[i]);
			}
		}

		//求出对方最高棋步和得分数组
		for(i = 0; i < opponent_chessStep_scores.length; i++)
		{
			if(opponent_chessStep_scores[i].score == opponent_maxScore || 
				(opponent_chessStep_scores[i].score > this.MAX_VALUE - 500))
			{
				opponent_maxScore_chessSteps.push(opponent_chessStep_scores[i]);
			}
		}
		
		//求相交棋步和得分数组
		for(i = 0; i < self_maxScore_chessSteps.length; i++)
		{
			for(j = 0; j < opponent_maxScore_chessSteps.length; j++)
			{
				if(self_maxScore_chessSteps[i].point.x == opponent_maxScore_chessSteps[j].point.x && 
					self_maxScore_chessSteps[i].point.y == opponent_maxScore_chessSteps[j].point.y)
				{
					//DBOut("222222222222222: " + self_maxScore_chessSteps[i].point.x + ",y: " + self_maxScore_chessSteps[i].point.y);
					var score3 = self_maxScore_chessSteps[i];
					score3.score = (self_maxScore_chessSteps[i].score + opponent_maxScore_chessSteps[j].score ) >> 1;
					intersect_maxScore_chessSteps.push(score3);
				}// for for if
			}
		}
			
		//如果有相交的部分，则相交部分最好
		itemCount = intersect_maxScore_chessSteps.length;
		if(itemCount >= 1)
		{
			nextIndex = this.rand() % itemCount;
			return_step_score = intersect_maxScore_chessSteps[nextIndex];
			return_step_score.point.player = player;
			//DBOut("111111111111111111111111111: " + return_step_score.point.x + ", y: " + return_step_score.point.y);
			return return_step_score;
		}//if
			
		//如果己方要赢了
		if(self_maxScore > this.WIN_SCORE)
		{
			itemCount = self_maxScore_chessSteps.length;
			nextIndex = this.rand() % itemCount;
			return_step_score = self_maxScore_chessSteps[nextIndex];
			return_step_score.point.player = player;
			return return_step_score;
		}//if

		//如果对方要赢了
		if(opponent_maxScore > this.WIN_SCORE)
		{
			itemCount = opponent_maxScore_chessSteps.length;
			nextIndex = this.rand() % itemCount;
			return_step_score = opponent_maxScore_chessSteps[nextIndex];
			return_step_score.point.player = player;
			return return_step_score;
		}//if

		//如果为白棋
		if(player == this.WHITE_CHESS)
		{
			if(self_maxScore * this.ATTACK > opponent_maxScore)
			{
				itemCount = self_maxScore_chessSteps.length;
				nextIndex = this.rand() % itemCount;
				return_step_score = self_maxScore_chessSteps[nextIndex];
				return_step_score.point.player = player;
			}
			else
			{
				itemCount = opponent_maxScore_chessSteps.length;
				nextIndex = this.rand() % itemCount;
				//DBOut("aaaaaaaaaaaaaa: " + itemCount);
				return_step_score = opponent_maxScore_chessSteps[nextIndex];
				//DBOut("bbbbbbb: " + return_step_score);
				return_step_score.point.player = player;
			}
			
			return_step_score.point.player = player;
			return return_step_score;
		}

		//如果为黑棋
		if(self_maxScore > opponent_maxScore * this.ATTACK)
		{
			itemCount = self_maxScore_chessSteps.length;
			nextIndex = this.rand() % itemCount;
			return_step_score = self_maxScore_chessSteps[nextIndex];
			return_step_score.point.player = player;
		}
		else
		{
			itemCount = opponent_maxScore_chessSteps.length;
			nextIndex = this.rand() % itemCount;
			return_step_score = opponent_maxScore_chessSteps[nextIndex];
			return_step_score.point.player = player;
		}
		
		return_step_score.point.player = player;
		return return_step_score;
	};

	//计算当前最重要棋步 没有找到返回为0	
	__Page.stateGame.calCurrentImportantChessStep = function(map, mat, player)
	{
		var i, j;
		var type; //综合棋型
		var	g_chessStep_score = {}; //棋步和得分
		var	complex_chessType_score; //综合棋形和得分

		//首先判断双方是否有能获胜的位置
		//己方是否赢棋
		for(i = mat.left; i <= mat.right; i++)
		{
			for(j = mat.up; j <= mat.down; j++)
			{
				if(map[i][j] != this.NO_CHESS)
				{
					continue; //进入下一次
				}
				
				var	step = {}; //棋步
				step.x = i;
				step.y = j;
				step.player = player;
				if(this.is_handCut(map, step) != 0)
				{
					continue;
				}
				
				if(this.calAllScore(map, step) != 0)
				{
					var	chessStep_score = {}; //棋步和得分
					chessStep_score.point = step;
					chessStep_score.score = this.MAX_VALUE;
					return chessStep_score;
				}//if
			}// for for
		}

		//对方是否赢棋
		for(i = mat.left; i <= mat.right; i++)
		{
			for(j = mat.up; j <= mat.down; j++)
			{
				if(map[i][j] != this.NO_CHESS)
				{
					continue;//进入下一次
				}
				
				var	step = {}; //棋步
				step.x = i;
				step.y = j;
				step.player = -1 * player;
				if(this.is_handCut(map, step) != 0)
				{
					continue;
				}
				
				if(this.calAllScore(map, step) != 0)
				{
					var	chessStep_score = {}; //棋步和得分
					chessStep_score.point = step;
					chessStep_score.score = this.MAX_VALUE;
					return chessStep_score;
				}//if
			}// for for
		}
		
		//己方其他棋型
		for(i = mat.left; i <= mat.right; i++)
		{
			for(j = mat.up;j <= mat.down; j++)
			{
				if(map[i][j] != this.NO_CHESS)
				{
					continue;//进入下一次
				}
				
				var	step = {}; //棋步
				step.x = i;
				step.y = j;
				step.player = player;
				if(this.is_handCut(map,step) != 0)
				{
					continue;
				}
				
				complex_chessType_score = this.calComplexChessTypeScore(map, step);
				type = complex_chessType_score.type;
				
				if(type == this.LIFE_4_LIFE_4 || type == this.LIFE_4_DIE_4 ||type == this.LIFE_4_LIFE_3 || 
					type == this.DIE_4_DIE_4 || type == this.DIE_4_LIFE_3 || type == this.LIFE_4 || 
					type == this.JUMP_LIFE_4_LIFE_3 || type == this.JUMP_DIE_4_LIFE_3 || type == this.LIFE_3_LIFE_3)
				{
					var	chessStep_score = {}; //棋步和得分
					chessStep_score.point = step;
					chessStep_score.score = complex_chessType_score.score;
					return chessStep_score;
				}
			}//for for
		}

		//对方其他棋型
		for(i = mat.left; i <= mat.right; i++)
		{
			for(j = mat.up; j <= mat.down; j++)
			{
				if(map[i][j] != this.NO_CHESS)
				{
					continue;//进入下一次
				}
				
				var	step = {}; //棋步
				step.x = i;
				step.y = j;
				step.player = -1 * player;
				if(this.is_handCut(map, step) != 0)
				{
					continue;
				}
				
				complex_chessType_score = this.calComplexChessTypeScore(map, step);
				type = complex_chessType_score.type;
				
				if(type == this.LIFE_4_LIFE_4 || type == this.LIFE_4_DIE_4 || type == this.LIFE_4_LIFE_3 || 
					type == this.DIE_4_DIE_4 || type == this.DIE_4_LIFE_3 || type == this.LIFE_4 || 
					type == this.JUMP_LIFE_4_LIFE_3 || type == this.JUMP_DIE_4_LIFE_3 || type == this.LIFE_3_LIFE_3)
				{
					var	chessStep_score = {}; //棋步和得分
					chessStep_score.point = step;
					chessStep_score.score = complex_chessType_score.score;
					return chessStep_score;
				}
			}//for for
		}
		g_chessStep_score.score = 0;
		return g_chessStep_score;
	};

	//延展边界
	__Page.stateGame.expandMatrix = function(mat, len)
	{
		mat.up -= len;
		mat.down += len;
		mat.left -= len;
		mat.right += len;
		if(mat.up < 0)
		{
			mat.up = 0;
		}
		
		if(mat.left < 0)
		{
			mat.left = 0;
		}
		
		if(mat.right > this.CHESS_LEN - 1)
		{
			mat.right = this.CHESS_LEN - 1;
		}
		if(mat.down  > this.CHESS_LEN - 1)
		{
			mat.down = this.CHESS_LEN - 1;
		}
	};

	//修改边界
	__Page.stateGame.changeMatrix = function(mat, x, y)
	{
		mat.left = x < mat.left ? x : mat.left;
		mat.right = x > mat.right ? x : mat.right;
		mat.up = y < mat.up ? y : mat.up;
		mat.down = y > mat.down ? y : mat.down;
	};

	//禁手判断 false 不是禁手	
	__Page.stateGame.is_handCut = function(map, step)
	{
		// 禁手对 黑棋用的.
		if(!this.appEnv.Rule || step.player == this.WHITE_CHESS)
		{//DBOut("==============无禁手： " + step.player + ", : " + this.Rule);
			return 0;
		}
		
		var FS = this.calComplexChessTypeScore(map, step);

		if(FS.type == this.LIFE_3_LIFE_3)
		{//DBOut("==============三三禁手===========: " + step.player);
			return this.HAND_CUT_33;
		}
		
		if(FS.type == this.LIFE_4_LIFE_4 || FS.type == this.LIFE_4_DIE_4 || FS.type == this.DIE_4_DIE_4)
		{//DBOut("=============四四禁手========: " + step.player);
			return this.HAND_CUT_44;
		}

		if(this.is_LongLongHandCut(map, step))
		{//DBOut("==============长连禁手===========");
			return this.LONG_LONG_HAND_CUT;
		}
		return 0;
	};

	//是否是长连
	__Page.stateGame.is_LongLongHandCut = function(map, step)
	{
		var directionScoreArray = [];
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 0)); //纵向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 0, 1)); //横向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 1)); //左斜
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, -1, 1)); //右斜
		
		for(var i = 0; i < this.DIRECTION_NUMBER; i++)
		{
			if(directionScoreArray[i].chessCount > this.SUCCESS_VAR)
			{
				return true;
			}
		}
		return false;
	};
	
	//计算4个方向上的得分和棋型
	__Page.stateGame.calAllScore = function(map, step)
	{
		var directionScoreArray = [];
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 0)); //纵向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 0, 1)); //横向
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, 1, 1)); //左斜
		directionScoreArray.push(this.calEveryDirectionChessTypeScore(map, step, -1, 1)); //右斜

		this.insertSort(directionScoreArray, directionScoreArray.length); //排序分数
		
		if(directionScoreArray[0].chessCount >= this.SUCCESS_VAR && directionScoreArray[0].space < 2 && !directionScoreArray[0].rival_ban)
		{
			return directionScoreArray[0].player;
		}
		return 0;
	};

	//更改棋盘相应坐标的状态为某棋子
	__Page.stateGame.move_chess = function(map, step)
	{
		map[step.x][step.y] = step.player;
	};
	
	/*
		attack = 3; //AI需要的参数,表示电脑是偏向攻击还是偏向防守
		rank = 0;	//电脑等级 通过测试 0是最强   rank到4之后会用明显的停顿.
	*/
	__Page.stateGame.computerAI = function(map, mat, player, last_step, rank, attack)
	{
		//棋步
		var	chess_step;	
		var robot_step = null;
		this.ATTACK = attack;
		this.changeMatrix(mat, last_step.x, last_step.y);
		
		if(rank < 1)
		{
			chess_step = this.calCurrentBestChessPosition(map, mat, player).point ;
		}
		else
		{
			chess_step = this.calRecursionBestChessPosition(map, mat, player, rank);
		}

		this.TOTAL_SPACES--;
		this.saveChessStep.push(chess_step);
		
		/*
			解释下为嘛补上robot_step吧。因为之前的程序有一个问题，就是当电脑成活四的时候，人下棋成活三或者死四时，
			电脑不知道自己可以先五连，一个劲的堵人的棋子。
			现在增加这个变量以及以下的一些判断了，主要是让程序先由人下的棋子的位置进行估值评判和最佳位置后，
			再对电脑自己先前下的棋子位置做一次估值评判和最佳位置分析，如果发现有活四了，电脑则直接成五连，而
			不是根据人的棋步去堵
		*/
		var len = this.robotChessLocation.length;
		if(len > 0)
		{
			this.changeMatrix(mat, this.robotChessLocation[len - 1].x, this.robotChessLocation[len - 1].y);
			if(rank < 1)
			{
				robot_step = this.calCurrentBestChessPosition(map, mat, player).point ;
			}
			else
			{
				robot_step = this.calRecursionBestChessPosition(map, mat, player, rank);
			}
		}
		
		if(len > 0)
		{
			
			this.robotChessLocation.push(robot_step);
			var len2 = this.saveChessStep.length;
			this.saveChessStep[len2 - 1] = robot_step;
		}
		else
		{
			this.robotChessLocation.push(chess_step);
		}
		
		if(robot_step)
		{
			if(chess_step.score > robot_step.score)
			{
				this.recordChessPosition[chess_step.x][chess_step.y] = player;
				this.createChessCss(this.WHITE_CHESS, chess_step.x, chess_step.y);
			}
			else
			{
				this.recordChessPosition[robot_step.x][robot_step.y] = player;
				this.createChessCss(this.WHITE_CHESS, robot_step.x, robot_step.y);
			}
			return;
		}
		
		this.recordChessPosition[chess_step.x][chess_step.y] = player;
		this.createChessCss(this.WHITE_CHESS, chess_step.x, chess_step.y);
	};
	
	//递归计算最佳落子位置
	__Page.stateGame.calRecursionBestChessPosition = function(map, mat, player, depth)
	{
		var i, j;
		var score; //得分
		var SC_MAX; //最高分
        var	SC_MIN; //最低分
		var _mat = {}; //边界矩形
		var t_mat = {}; //临时边界矩形
		var	max_index; //最高分棋步索引
		var min_index; //最低分棋步索引
		var recall_step; //将要返回的棋步
		var chessStep_score; //棋步和得分
		var t_map = [this.CHESS_LEN]; //临时棋盘数组
		var chessStep_scores = []; //棋步和得分数组   存储棋步和得分数组，以得到最高分的棋步
		
		for(var k = 0; k < this.CHESS_LEN; k++)
		{
			t_map[k] = [];
		}

		SC_MAX = (-this.G_depth) * this.MAX_VALUE * 2;
		SC_MIN = -SC_MAX;
		_mat.up = mat.up;
		_mat.left = mat.left;
		_mat.down = mat.down;
		_mat.right = mat.right;
		
		this.expandMatrix(_mat, this.BORDLEN);

		chessStep_score = this.calCurrentImportantChessStep(map, _mat, player);
		if(chessStep_score.score != 0)
		{
			return chessStep_score.point;
		}

		for(i = _mat.left; i <= _mat.right; i++)
		{
			for(j = _mat.up; j <= _mat.down; j++)
			{
				var step = {}; //棋步
				step.x = i;
				step.y = j;
				step.player = player;
				
				if(map[i][j] != this.NO_CHESS || this.is_handCut(map, step) != 0)
				{
					continue;
				}
				
				var complexChessTypeAndScoreObj = this.calComplexChessTypeScore(map, step); //综合棋形和得分
				score = complexChessTypeAndScoreObj.score * step.player;
				t_mat.up = mat.up;
				t_mat.down = mat.down;
				t_mat.left = mat.left;
				t_mat.right = mat.right;

				for(var i = 0; i < this.CHESS_LEN; i++)
				{
					for(var j = 0; j < this.CHESS_LEN; j++)
					{
						t_map[i][j] = map[i][j];
					}
				}
				this.move_chess(t_map, step);
				this.changeMatrix(t_mat, step.x, step.y);
				
				score += this.calRecursionScore(t_map, t_mat, -player, depth - 1);
				var score1 = {};
				var tmp = step.x;
				step.x = step.y;
				step.y = tmp;
				score1.point = step;
				score1.score = score;
				chessStep_scores.push(score1);

				if(score > SC_MAX)
				{
					SC_MAX = score;
					max_index = chessStep_scores.length - 1;
				}

				if(score < SC_MIN)
				{
					SC_MIN = score;
					min_index = chessStep_scores.length - 1;
				}
				
			}//for for
		}

		recall_step = chessStep_scores[max_index].point;
		return recall_step;
	};

	//递归计算得分
	__Page.stateGame.calRecursionScore = function(map, mat, player, depth)
	{
		var score = 0; //得分
		var now_score = 0; //本次得分
		var chessStep_score; //棋步和得分
		
		chessStep_score = this.calCurrentImportantChessStep(map, mat, player);
		if(chessStep_score.score != 0)
		{
			return chessStep_score.score * player;
		}

		if(depth <= 0)
		{
			return 0; //处理递归
		}
		else if(depth == 1)
		{
			chessStep_score = this.calCurrentBestChessPosition(map, mat, player);
			score = chessStep_score.score * 10 * player;
			return score;
		}
		else
		{
			chessStep_score = this.calCurrentBestChessPosition(map, mat, player);
			if(chessStep_score.score == this.MAX_VALUE)
			{
				score = chessStep_score.score * player * depth;
				depth = 1;
				return score;
			}
			this.move_chess(map, chessStep_score.point);
			this.changeMatrix(mat, chessStep_score.point.x, chessStep_score.point.y);
			now_score = chessStep_score.score * player;
			score += this.calRecursionScore(map, mat, -player, depth - 1) + now_score * depth;
			return score;
		}
	};
	
//================================================================================//

	//检查游戏是否胜利
	__Page.stateGame.isGameWin = function(map, step, player)
	{	
		var i, j;
		//DBOut("$$$$$$$$$$--x: " + step.x + ", y: " + step.y);
		for(i = 0; i < this.DIRECTION_NUMBER; i++)
		{
			var max = 0;
			for(j = 0; j < 2; j++)
			{
				var tempx = step.x + this.directionObj[i][j][0];
				var tempy = step.y + this.directionObj[i][j][1];
				while(!this.isOverRange(tempx, tempy) && map[tempx][tempy] == map[step.x][step.y])
				{
					++max;
					tempx += this.directionObj[i][j][0];
					tempy += this.directionObj[i][j][1];
				}
			}
			if(max >= 4)
			{
				return true;
			}
		}
		return false;
	};

	//插入排序
	__Page.stateGame.insertSort = function(obj, len)
	{
		var i, j, tmp;
		
		for(i = 1; i < len; i++)
		{
			j = i - 1;
			tmp = obj[i];
			while(j >= 0 && tmp.score > obj[j].score)
			{
				obj[j + 1] = obj[j];
				j--;
			}
			obj[j + 1] = tmp;
		}
	}
}
