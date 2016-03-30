﻿if(!__Page.defGuides)
{
	var textLib=__Page.appEnv.textLib.guidesText;
	__Page.defGuides={};
	__Page.defGuides["Greeting1"]={
		codeName:"Greeting1",desc:"问候1",
		showGirl:1,girlFace:0,mask:1,talk:textLib.Greeting1,music:"sfx/fem_talk.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"Greeting2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["Greeting2"]={
		codeName:"Greeting2",desc:"问候2",
		showGirl:1,girlFace:0,mask:1,talk:textLib.Greeting2,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildGoldMine",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["BuildGoldMine"]={
		codeName:"BuildGoldMine",desc:"建造金矿",
		showGirl:0,mask:0,shop:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnShop},
			{key:__Page.appEnv.appKeys.bldShopType_2},
			{key:__Page.appEnv.appKeys.btnClose},
			{key:__Page.appEnv.appKeys.btnNext},
			{key:__Page.appEnv.appKeys.lbShopItems,checkExtra:3,extra:2},
			/*{key:__Page.appEnv.appKeys.confirmNewBld},
			{key:__Page.appEnv.appKeys.abortNewBld},*/
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
			{id:"BtnBld_GoldMine",dit:2,pos:[50,0,0]},
			{id:"Btn_ShopResources",dit:4,pos:[0,0,0]},
			{id:"BtnShop",dit:7,pos:[-20,-15,0]}
		],
		trigerKeyMsg:2,trigerKey:__Page.appEnv.appKeys.lbShopItems,nextGuide:"BuildGoldMine2",
	};
	__Page.defGuides["BuildGoldMine2"]={
		codeName:"BuildGoldMine2",desc:"讲解位置",
		showGirl:1,girlFace:0,mask:1,talk:textLib.BuildGoldMine2,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildGoldMine3",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["BuildGoldMine3"]={
		codeName:"BuildGoldMine2",desc:"建造金矿2",
		showGirl:0,mask:0,shop:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.confirmNewBld},
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewBuilding")
			{
				return 1;
			}
		},
		nextGuide:"GemBuildGoldMine1",
	};
	__Page.defGuides["GemBuildGoldMine1"]={
		codeName:"GemBuildGoldMine1",desc:"提示加速建造金矿",
		showGirl:1,mask:1,talk:textLib.GemBuildGoldMine1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"GemBuildGoldMine2",saveGuide:0,
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone")
			{
				this.nextGuide="WarAlert1";
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["GemBuildGoldMine2"]={
		codeName:"GemBuildGoldMine2",desc:"加速金矿建造",
		showGirl:0,mask:0,
		nextGuide:"WarAlert1",saveGuide:1,shop:0,lockSelBld:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.bldGemDone},
			{key:__Page.appEnv.appKeys.pmtOk},
		],
		hotHud:[
			{id:"BtnPmt_OK",dit:0,pos:[0,-30,0]},
			{id:"BtmBtnGemDone",dit:0,pos:[0,-30,0]},
			{bldType:"GoldMine",bldLevel:0,dit:0,pos:[0,-30,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone" || com=="GemConstructDone")
			{
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["WarAlert1"]={
		codeName:"WarAlert1",desc:"战斗警报1",
		showGirl:1,girlFace:0,mask:1,talk:textLib.WarAlert1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"WarAlert2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["WarAlert2"]={
		codeName:"WarAlert2",desc:"战斗警报2",
		showPirate:1,pirateFace:5,mask:1,talk:textLib.WarAlert2,music:"sfx/gob_attack.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"WarAlert3",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["WarAlert3"]={
		codeName:"WarAlert3",desc:"战斗警报3",
		showGirl:1,girlFace:1,mask:1,talk:textLib.WarAlert3,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildCannon1",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};

	__Page.defGuides["BuildCannon1"]={
		codeName:"BuildCannon1",desc:"建造炮塔",
		showGirl:0,mask:0,shop:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnShop},
			{key:__Page.appEnv.appKeys.bldShopType_5},
			{key:__Page.appEnv.appKeys.btnClose},
			{key:__Page.appEnv.appKeys.btnNext},
			{key:__Page.appEnv.appKeys.lbShopItems,checkExtra:1,extra:0},
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
			{id:"BtnBld_Cannon",dit:2,pos:[50,0,0]},
			{id:"Btn_ShopDefenses",dit:4,pos:[0,0,0]},
			{id:"BtnShop",dit:7,pos:[-20,-15,0]}
		],
		trigerKeyMsg:2,trigerKey:__Page.appEnv.appKeys.lbShopItems,nextGuide:"BuildCannon2",
	};
	__Page.defGuides["BuildCannon2"]={
		codeName:"BuildCannon2",desc:"建造炮塔2",
		showGirl:0,mask:0,shop:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.confirmNewBld},
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewBuilding")
			{
				return 1;
			}
		},
		nextGuide:"BuildCannon3",
	};
	__Page.defGuides["BuildCannon3"]={
		codeName:"BuildCannon3",desc:"提示加速",
		showGirl:1,girlFace:1,mask:1,talk:textLib.BuildCannon3,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildCannon4",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone")
			{
				this.nextGuide="WarStart";
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["BuildCannon4"]={
		codeName:"BuildCannon4",desc:"加速炮塔建造",
		showGirl:0,mask:0,
		nextGuide:"WarStart",saveGuide:1,shop:0,lockSelBld:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.bldGemDone},
			{key:__Page.appEnv.appKeys.pmtOk},
		],
		hotHud:[
			{id:"BtnPmt_OK",dit:0,pos:[0,-30,0]},
			{id:"BtmBtnGemDone",dit:0,pos:[0,-30,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone" || com=="GemConstructDone")
			{
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["WarStart"]={
		codeName:"WarStart",desc:"战斗开始",
		showPirate:1,pirateFace:5,mask:1,talk:textLib.WarStart,music:"sfx/gob_attack.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"WarStart2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["WarStart2"]={
		codeName:"WarStart2",desc:"战斗开始",nextGuide:"TrainUnit1",saveGuide:1,
		keyFilter:[	],
		startGuide:function(state,level)
		{
			var idx,hotObj;
			DBOut("Start !!!!");
			idx=level.getObjDefIdx("chr_Pirate");
			this.state=state;
			this.unitToDie=3;
			hotObj=level.addObjectJS(idx,-1,0,[5.7,0.7,0],0);
			hotObj.onDead=this.onUnitDead;
			hotObj.guide=this;
			hotObj.state=state;

			hotObj=level.addObjectJS(idx,-1,0,[0.6,5.1,0],0);
			hotObj.onDead=this.onUnitDead;
			hotObj.guide=this;
			hotObj.state=state;

			idx=level.getObjDefIdx("Test_Tank");
			hotObj=level.addObjectJS(idx,-1,0,[0,0.3,0],0);
			hotObj.onDead=this.onUnitDead;
			hotObj.guide=this;
			hotObj.state=state;

			state.page.vwHomeStage.gameHud.focusObj(hotObj);
			state.page.vwHomeStage.callbackActors();
			state.page.vwHomeStage.navBox.setNavItem(null);
		},
		onUnitDead:function()
		{
			this.guide.unitToDie--;
			if(this.guide.unitToDie<=0)
			{
				this.state.page.vwHomeStage.navBox.setNavItem(this.state.page.vwHomeStage.gameHud);
				this.guide.state.nextGuide();
			}
		}
	};
	__Page.defGuides["TrainUnit1"]={
		codeName:"TrainUnit1",desc:"训练士兵1",
		showGirl:1,girlFace:0,mask:1,talk:textLib.TrainUnit1,music:"sfx/fem_talk_scared.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"TrainUnit2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["TrainUnit2"]={
		codeName:"TrainUnit2",desc:"训练士兵2",
		showGirl:0,mask:0,
		nextGuide:"TrainUnit3",saveGuide:0,shop:0,lockSelBld:0,
		trainNum:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnClose},
			{key:__Page.appEnv.appKeys.bldTrain},
			{key:__Page.appEnv.appKeys.bldTrainUnit_1},
		],
		hotHud:[
			{id:"BtnTrainUnit_1",dit:0,pos:[0,-30,0],text:textLib.TrainUnit1_Btn},
			{id:"BtmBtnTrain",dit:0,pos:[0,-30,0]},
			{bldType:"Barrack",bldLevel:1,dit:0,pos:[0,-30,0]},
		],
		startGuide:function(state,level)
		{
			//this.trainNum=0;
		},
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewMfc")
			{
				this.trainNum++;
				if(this.trainNum>=20){
					return 1;
				}
			}
			return 0;
		}
	};
	__Page.defGuides["TrainUnit3"]={
		page:__Page,
		codeName:"TrainUnit3",desc:"加速士兵建造",
		showGirl:0,mask:0,
		nextGuide:"TrainUnit4",saveGuide:0,shop:0,lockSelBld:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnGemFin},
		],
		hotHud:[
			{id:"BtnResGO",dit:4,pos:[0,20,0],text:textLib.TrainUnit3_Btn},
		],
		startGuide:function(state,level)
		{
			this.nextGuide="TrainUnit4";
		},
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewMfc")
			{
				this.page.defGuides["TrainUnit5"].trainNum++;
				this.nextGuide="TrainUnit5";
				return 1;
			}
			if(com=="GemMfcDone")
			{
				return 1;
			}
			else if(com=="MfcDone" && comObj.mfcSlots[0].num<=1)
			{
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["TrainUnit4"]={
		codeName:"TrainUnit4",desc:"关闭训练对话框",
		showGirl:0,mask:0,shop:1,saveGuide:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnClose},
		],
		hotHud:[
			{id:"BtnClose",dit:5,pos:[-20,20,0],text:textLib.TrainUnit4_Btn},
		],
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.btnClose,nextGuide:"Attack1",
	};
	__Page.defGuides["TrainUnit5"]={
		codeName:"TrainUnit5",desc:"取消兵建造",
		showGirl:0,mask:0,
		nextGuide:"TrainUnit3",saveGuide:0,shop:0,lockSelBld:1,
		trainNum:20,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnTraining_1},
		],
		hotHud:[
			{id:"BtnTraining",dit:4,pos:[0,20,0],text:textLib.TrainUnit5_Btn},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewMfc")
			{
				this.trainNum++;
			}else if(com=="AbortMfc")
			{
				this.trainNum--;
				if(this.trainNum==20)
				{
					this.nextGuide="TrainUnit3";
					return 1;
				}else if(this.trainNum<20){
					this.nextGuide="TrainUnit2";
					return 1;
				}
			}
			else if(com=="MfcDone" && comObj.mfcSlots[0].num<=1)
			{
				this.nextGuide="TrainUnit4";
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["Attack1"]={
		codeName:"Attack1",desc:"准备攻击敌人基地",
		showGirl:1,girlFace:1,mask:1,talk:textLib.Attack1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"Attack2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["Attack2"]={
		codeName:"Attack2",desc:"指引打仗",
		showGirl:0,mask:0,atk:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnAttack},
			{key:__Page.appEnv.appKeys.btnClose},
			{key:__Page.appEnv.appKeys.btnNext},
			{key:__Page.appEnv.appKeys.btnPve1},
			{key:__Page.appEnv.appKeys.btnPve},
			{key:__Page.appEnv.appKeys.btnAttackPve},
		],
		hotHud:[
			{id:"btn-pve1",dit:5,pos:[0,0,0]},
			{id:"pve1",dit:5,pos:[0,0,0]},
			{id:"btnPveMode",dit:3,pos:[0,0,0]},
			{id:"BtnAttack",dit:1,pos:[10,-15,0]},
		],
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.btnAttackPve,nextGuide:"Attack3",startBattle:1,
	};
	__Page.defGuides["Attack3"]={
		codeName:"Attack3",desc:"第二仗提示语",
		showGirl:1,girlFace:0,mask:1,talk:textLib.Attack2,music:"sfx/fem_talk_scared.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"Attack3_1",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["Attack3_1"]={
		codeName:"Attack3_1",desc:"第二仗提示语2_1",
		showGirl:1,girlFace:0,mask:1,talk:textLib.Attack2_1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"Attack4",startBattle:1,npcName:"NPC15",units:{"UntCyber":{num:10},"UntTank":{num:8},"UntAvenger":{num:3}},
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["Attack4"]={
		codeName:"Attack4",desc:"战斗结束语",
		showGirl:1,girlFace:0,mask:1,talk:textLib.Attack3,music:"sfx/city_01.mp3",
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildOilWell1",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["BuildOilWell1"]={
		codeName:"BuildOilWell1",desc:"建造气矿",
		showGirl:1,girlFace:0,mask:1,talk:textLib.BuildOilWell1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"BuildOilWell2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["BuildOilWell2"]={
		codeName:"BuildOilWell2",desc:"建造气矿2",
		showGirl:0,mask:0,shop:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnShop},
			{key:__Page.appEnv.appKeys.bldShopType_2},
			{key:__Page.appEnv.appKeys.btnClose},
			{key:__Page.appEnv.appKeys.btnNext},
			{key:__Page.appEnv.appKeys.lbShopItems,checkExtra:1,extra:0},
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
			{id:"BtnBld_OilWell",dit:2,pos:[50,0,0]},
			{id:"Btn_ShopResources",dit:4,pos:[0,0,0]},
			{id:"BtnShop",dit:7,pos:[-20,-15,0]}
		],
		trigerKeyMsg:2,trigerKey:__Page.appEnv.appKeys.lbShopItems,nextGuide:"BuildOilWell3",
	};
	__Page.defGuides["BuildOilWell3"]={
		codeName:"BuildOilWell3",desc:"建造气矿3",
		showGirl:0,mask:0,shop:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.confirmNewBld},
		],
		hotHud:[
			{id:"BtnBldOK",dit:0,pos:[0,-10,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="NewBuilding")
			{
				return 1;
			}
		},
		nextGuide:"GemBuildOilWell",
	};
	__Page.defGuides["GemBuildOilWell"]={
		codeName:"GemBuildOilWell",desc:"加速气矿建造",
		showGirl:0,mask:0,
		nextGuide:"UpgradeTownHall1",saveGuide:1,shop:0,lockSelBld:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.bldGemDone},
			{key:__Page.appEnv.appKeys.pmtOk},
		],
		hotHud:[
			{id:"BtnPmt_OK",dit:0,pos:[0,-30,0]},
			{id:"BtmBtnGemDone",dit:0,pos:[0,-30,0]},
			{bldType:"OilWell",bldLevel:0,dit:0,pos:[0,-30,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone" || com=="GemConstructDone")
			{
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["UpgradeTownHall1"]={
		codeName:"UpgradeTownHall1",desc:"升级主城",
		showGirl:1,girlFace:0,mask:1,talk:textLib.UpgradeTownHall1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"UpgradeTownHall2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["UpgradeTownHall2"]={
		codeName:"UpgradeTownHall2",desc:"升级主城2",
		showGirl:0,mask:0,shop:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.bldUpgrade},
		],
		hotHud:[
			{id:"BtmBtnUpgrade",dit:0,pos:[0,-30,0]},
			{bldType:"TownHall",bldLevel:0,dit:0,pos:[0,-80,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="Upgrade")
			{
				return 1;
			}
		},
		nextGuide:"GemUpgradeTownHall1",
	};
	__Page.defGuides["GemUpgradeTownHall1"]={
		codeName:"GemUpgradeTownHall1",desc:"加速主城升级",
		showGirl:0,mask:0,
		nextGuide:"AchvmntView",saveGuide:1,shop:0,lockSelBld:0,
		keyFilter:[
			{key:__Page.appEnv.appKeys.bldGemDone},
			{key:__Page.appEnv.appKeys.pmtOk},
		],
		hotHud:[
			{id:"BtnPmt_OK",dit:0,pos:[0,-30,0]},
			{id:"BtmBtnGemDone",dit:0,pos:[0,-30,0]},
			{bldType:"TownHall",bldLevel:0,dit:0,pos:[0,-80,0]},
		],
		triggerCom:function(comObj,com,comVO,caller)
		{
			if(com=="ConstructDone" || com=="GemConstructDone")
			{
				return 1;
			}
			return 0;
		}
	};
	__Page.defGuides["AchvmntView"]={
		codeName:"AchvmntView",desc:"指引看成就介绍语言",
		showGirl:1,girlFace:0,mask:1,talk:textLib.AchvmntView,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"AchvmntView2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["AchvmntView2"]={
		codeName:"AchvmntView2",desc:"指引看成就",
		showGirl:0,mask:0,achvmnt:1,
		keyFilter:[
			{key:__Page.appEnv.appKeys.btnAchievement},
			{key:__Page.appEnv.appKeys.btnClose},
		],
		hotHud:[
			{id:"BtnClose",dit:5,pos:[-20,20,0]},
			{id:"BtnAchvmnt",dit:1,pos:[0,-10,0]},
		],
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.btnClose,nextGuide:"InputName1",
	};
	__Page.defGuides["InputName1"]={
		codeName:"InputName1",desc:"给基地命名",
		showGirl:1,girlFace:0,mask:1,talk:textLib.InputName1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"InputName2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["InputName2"]={
		codeName:"InputName2",desc:"给基地命名",
		showGirl:0,girlFace:0,mask:1,talk:"",
		trigerKeyMsg:1,trigerKey:-100000000,
		nextGuide:"GuideEnd1",inputName:1,
	};
	__Page.defGuides["GuideEnd1"]={
		codeName:"GuideEnd1",desc:"指引结束语",
		showGirl:1,girlFace:0,mask:1,talk:textLib.GuideEnd1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,endGuide:1,
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	//---------------------------------------
	//----------guides battle----------------
	__Page.defGuides["GuideBattle1"]={
		codeName:"GuideBattle1",desc:"指引打仗1",
		showGirl:1,girlFace:0,mask:1,talk:textLib.GuideBattle1,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"GuideBattle2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["GuideBattle2"]={
		codeName:"GuideBattle2",desc:"指引打仗2",
		showGirl:1,girlFace:0,mask:1,talk:textLib.GuideBattle2,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"putDownUnit1",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["putDownUnit1"]={
		codeName:"GuideBattle1",desc:"放兵1",
		putDownUnit:1,nextGuide:"GuideBattle3",
		units:[

	{wave:1,delaytime:1000,edge:0,type:"UntMarine",level:5,num:3,pos:[12,35]},
	{wave:1,delaytime:1200,edge:0,type:"UntMarine",level:5,num:3,pos:[27,35]},
	{wave:1,delaytime:1400,edge:0,type:"UntMarine",level:5,num:3,pos:[22,35],focus:1},
	{wave:1,delaytime:1600,edge:0,type:"UntMarine",level:5,num:3,pos:[15,35]},
	{wave:1,delaytime:1800,edge:0,type:"UntMarine",level:5,num:3,pos:[20,35]},
	{wave:1,delaytime:2000,edge:0,type:"UntMarine",level:5,num:3,pos:[25,35]},
	{wave:1,delaytime:2200,edge:0,type:"UntMarine",level:5,num:3,pos:[14,35]},
	{wave:1,delaytime:2400,edge:0,type:"UntMarine",level:5,num:3,pos:[29,35]},
	{wave:1,delaytime:2600,edge:0,type:"UntMarine",level:5,num:3,pos:[24,35]},
	{wave:1,delaytime:2800,edge:0,type:"UntMarine",level:5,num:3,pos:[13,35]},
	{wave:1,delaytime:3000,edge:0,type:"UntMarine",level:5,num:3,pos:[18,35]},
	{wave:1,delaytime:3200,edge:0,type:"UntMarine",level:5,num:3,pos:[23,35]},

	{wave:1,delaytime:2200,edge:0,type:"UntSniper",level:5,num:3,pos:[12,40]},
	{wave:1,delaytime:2300,edge:0,type:"UntSniper",level:5,num:3,pos:[27,40]},
	{wave:1,delaytime:2400,edge:0,type:"UntSniper",level:5,num:3,pos:[22,40]},
	{wave:1,delaytime:2500,edge:0,type:"UntSniper",level:5,num:3,pos:[15,40]},
	{wave:1,delaytime:2600,edge:0,type:"UntSniper",level:5,num:3,pos:[20,40]},
	{wave:1,delaytime:2700,edge:0,type:"UntSniper",level:5,num:3,pos:[25,40]},
	{wave:1,delaytime:3000,edge:0,type:"UntSniper",level:5,num:3,pos:[14,40]},
	{wave:1,delaytime:3200,edge:0,type:"UntSniper",level:5,num:3,pos:[29,40]},
	{wave:1,delaytime:3400,edge:0,type:"UntSniper",level:5,num:3,pos:[22,40]},
	{wave:1,delaytime:3600,edge:0,type:"UntSniper",level:5,num:3,pos:[15,40]},
	{wave:1,delaytime:3800,edge:0,type:"UntSniper",level:5,num:3,pos:[20,40]},
	{wave:1,delaytime:4000,edge:0,type:"UntSniper",level:5,num:3,pos:[22,40]},
	{wave:1,delaytime:4200,edge:0,type:"UntSniper",level:5,num:3,pos:[8,40]},
	{wave:1,delaytime:4600,edge:0,type:"UntSniper",level:5,num:3,pos:[23,40]},
	{wave:1,delaytime:3600,edge:0,type:"UntSniper",level:5,num:2,pos:[18,40]},
	{wave:1,delaytime:3700,edge:0,type:"UntSniper",level:5,num:2,pos:[11,40]},
	{wave:1,delaytime:3800,edge:0,type:"UntSniper",level:5,num:2,pos:[16,40]},
	{wave:1,delaytime:3900,edge:0,type:"UntSniper",level:5,num:2,pos:[30,40]},
	{wave:1,delaytime:4000,edge:0,type:"UntSniper",level:5,num:2,pos:[8,40]},
	{wave:1,delaytime:4100,edge:0,type:"UntSniper",level:5,num:2,pos:[23,40]},
	{wave:1,delaytime:4200,edge:0,type:"UntSniper",level:5,num:2,pos:[18,40]},
	{wave:1,delaytime:4300,edge:0,type:"UntSniper",level:5,num:2,pos:[11,40]},
	//{wave:1,delaytime:4400,edge:0,type:"UntSniper",level:5,num:2,pos:[16,40]},
	{wave:1,delaytime:4500,edge:0,type:"UntSniper",level:5,num:2,pos:[30,40]},

	{wave:1,delaytime:6000,edge:0,type:"UntCyber",level:5,num:1,pos:[20,33]},
	{wave:1,delaytime:6500,edge:0,type:"UntCyber",level:5,num:1,pos:[18,33]},
	{wave:1,delaytime:6700,edge:0,type:"UntCyber",level:5,num:1,pos:[19,33]},

	{wave:1,delaytime:9000,edge:0,type:"UntHacker",level:5,num:8,pos:[18,35],focus:1},
	{wave:1,delaytime:9100,edge:0,type:"UntHacker",level:5,num:5,pos:[11,35]},
	{wave:1,delaytime:9200,edge:0,type:"UntHacker",level:5,num:5,pos:[13,35]},
	{wave:1,delaytime:9300,edge:0,type:"UntHacker",level:5,num:8,pos:[15,35]},
	{wave:1,delaytime:9400,edge:0,type:"UntHacker",level:5,num:5,pos:[20,35]},
	{wave:1,delaytime:9500,edge:0,type:"UntHacker",level:5,num:8,pos:[22,35]},

		]
	};
	__Page.defGuides["GuideBattle3"]={
		codeName:"GuideBattle3",desc:"指引打仗3",
		showGirl:1,girlFace:1,mask:1,talk:textLib.GuideBattle3,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,nextGuide:"putDownUnit2",
		keyFilter:[{key:__Page.appEnv.appKeys.uiGuideMask}],
	};
	__Page.defGuides["putDownUnit2"]={
		codeName:"putDownUnit2",desc:"放兵2",
		putDownUnit:1,nextGuide:"putDownUnit3",focusOrigin:1,
		units:[
				{wave:1,delaytime:800,edge:0,type:"Lightning",level:4,num:1,pos:[18,15],group:4,focus:1},
				{wave:1,delaytime:1000,edge:0,type:"Lightning",level:4,num:1,pos:[14,20],group:4},
				{wave:1,delaytime:1200,edge:0,type:"Lightning",level:4,num:1,pos:[22,20],group:4},
				{wave:1,delaytime:800,edge:0,type:"Lightning",level:4,num:1,pos:[18,15],group:4},
				{wave:1,delaytime:1000,edge:0,type:"Lightning",level:4,num:1,pos:[14,20],group:4},
				{wave:1,delaytime:1200,edge:0,type:"Lightning",level:4,num:1,pos:[22,20],group:4},

				{wave:1,delaytime:3000,edge:0,type:"UntPEKKA",level:1,num:1,pos:[19,33]},

				{wave:1,delaytime:3000,edge:0,type:"UntTank",level:5,num:1,pos:[8,33]},
				{wave:1,delaytime:3200,edge:0,type:"UntTank",level:4,num:1,pos:[12,33],},
				{wave:1,delaytime:3400,edge:0,type:"UntTank",level:5,num:1,pos:[13,35]},
				{wave:1,delaytime:3600,edge:0,type:"UntTank",level:2,num:1,pos:[22,35]},
				//{wave:1,delaytime:4000,edge:0,type:"UntTank",level:4,num:1,pos:[13,35]},
				{wave:1,delaytime:4200,edge:0,type:"UntTank",level:4,num:1,pos:[18,35]},
				//{wave:1,delaytime:4400,edge:0,type:"UntTank",level:5,num:1,pos:[20,35]},
				{wave:1,delaytime:4600,edge:0,type:"UntTank",level:5,num:1,pos:[16,32]},
				//{wave:1,delaytime:4800,edge:0,type:"UntTank",level:5,num:1,pos:[18,32]},
				{wave:1,delaytime:5000,edge:0,type:"UntTank",level:4,num:1,pos:[20,31]},
				{wave:1,delaytime:5200,edge:0,type:"UntTank",level:5,num:1,pos:[26,35]},
				{wave:1,delaytime:5400,edge:0,type:"UntTank",level:2,num:1,pos:[30,32]},
				{wave:1,delaytime:5600,edge:0,type:"UntTank",level:2,num:1,pos:[11,35]},
				{wave:1,delaytime:5800,edge:0,type:"UntTank",level:2,num:1,pos:[28,35]},
				//{wave:1,delaytime:6000,edge:0,type:"UntTank",level:5,num:1,pos:[17,33]},
				//{wave:1,delaytime:3800,edge:0,type:"UntTank",level:5,num:1,pos:[21,35]},

				/*{wave:1,delaytime:3000,edge:0,type:"UntTank",level:5,num:1,pos:[15,40]},
				{wave:1,delaytime:3200,edge:0,type:"UntTank",level:5,num:1,pos:[13,40]},
				{wave:1,delaytime:3800,edge:0,type:"UntTank",level:5,num:1,pos:[10,40]},
				{wave:1,delaytime:4000,edge:0,type:"UntTank",level:5,num:1,pos:[20,40]},*/
		]
	};
	__Page.defGuides["putDownUnit3"]={
		codeName:"putDownUnit3",desc:"放兵3",
		putDownUnit:1,nextGuide:"GuideBattle4",focusOrigin:1,
		units:[

				{wave:1,delaytime:200,edge:0,type:"UntAvenger",level:3,num:1,pos:[20,33,2],focus:1},
				{wave:1,delaytime:400,edge:0,type:"UntAvenger",level:3,num:1,pos:[19,33,2]},
				{wave:1,delaytime:500,edge:0,type:"UntAvenger",level:3,num:1,pos:[20,33,2]},
				{wave:1,delaytime:550,edge:0,type:"UntAvenger",level:3,num:1,pos:[19,32,2]},

				{wave:1,delaytime:600,edge:0,type:"UntAvenger",level:3,num:1,pos:[8,29,2]},
				{wave:1,delaytime:800,edge:0,type:"UntAvenger",level:3,num:1,pos:[7,29,2]},
				//{wave:1,delaytime:1000,edge:0,type:"UntAvenger",level:3,num:1,pos:[30,29,2]},
				{wave:1,delaytime:4000,edge:0,type:"UntAvenger",level:3,num:1,pos:[8,10,2]},
				{wave:1,delaytime:4000,edge:0,type:"UntAvenger",level:3,num:1,pos:[30,10,2]},
				{wave:1,delaytime:4200,edge:0,type:"UntAvenger",level:3,num:1,pos:[8,10,2]},
				{wave:1,delaytime:4200,edge:0,type:"UntAvenger",level:3,num:1,pos:[30,10,2]},

		]
	};
	__Page.defGuides["GuideBattle4"]={
		codeName:"GuideBattle4",desc:"指引打仗4",
		showGirl:1,girlFace:0,mask:1,talk:textLib.GuideBattle4,
		trigerKeyMsg:1,trigerKey:__Page.appEnv.appKeys.uiGuideMask,endGuide:2,
		keyFilter:[
		{key:__Page.appEnv.appKeys.uiGuideMask},
		{key:__Page.appEnv.appKeys.pmtCancel},
		{key:__Page.appEnv.appKeys.pmtOk},
		],
	};
	__Page.defGuides["JumpInputName"]={
		codeName:"JumpInputName",desc:"给基地命名",
		showGirl:0,girlFace:0,mask:1,talk:"",
		trigerKeyMsg:1,trigerKey:-100000000,
		nextGuide:"GuideEnd1",inputName:1,
	};
}