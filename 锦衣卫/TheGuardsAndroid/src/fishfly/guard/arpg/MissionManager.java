/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class MissionManager {
    
    private static MissionManager instance = null;
    
    HashtableShort missionMap;

    public static MissionManager getInstance() {
        if(instance == null) {
            instance = new MissionManager();
        }
        return instance;
    }
    
    private MissionManager() {
        load();
    }
    
    /**
     * 保存任务数据
     * @param out
     * @throws java.lang.Exception
     */
    public void saveMission(DataOutputStream out) throws Exception
    {
        for(int index = 0, count = missionMap.size(); index < count; index++)
        {
            Mission m = (Mission) missionMap.value(index);
            m.saveMission(out);
        }
    }
    
    /**
     * 读取任务数据
     * @param in
     * @throws java.lang.Exception
     */
    public void readMission(DataInputStream in) throws Exception
    {
        for(int index = 0, count = missionMap.size(); index < count; index++)
        {
            Mission m = (Mission) missionMap.value(index);
            m.readMission(in);
        }        
    }
    
    public Mission getMission(short id) {
        Object o = missionMap.get(id);
        if(o == null)
        {
            return null;
        }
        return (Mission)missionMap.get(id);
    }
    
    public int size() {
        return missionMap.size();
    }
    
    /**
     * 初始化任务
     */
    public void init()
    {
        Mission mission = null;
        int size = missionMap.size();
        for(int index = 0; index < size; index++)
        {
            mission = (Mission) missionMap.value(index);
            mission.init();
        }
    }    
    
    private void load() {
        try
        {
            final String MISSION_PATH = "/m.mission";
            DataInputStream dataIn = Util.open(MISSION_PATH);
            
            int missionCount = dataIn.readInt();
            missionMap = new HashtableShort(missionCount);
                
            for (int index = 0; index < missionCount; index++)
            {                
                Mission m = new Mission();
                m.load(dataIn);
                missionMap.put((short) m.id, m);
            }
        } catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }
    
    /**
     * 获取当前主线任务的地图ID
     * @return
     */
    public int[] getMainMissionMapID()
    {
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(mission.isMain && mission.getMissionState() == Mission.STATE_ACCEPT)
            {
                return mission.mapId;
            }
        }  
        return null;
    }

    /**
     * 获得当前接受未完成的所有支线地图id
     * @return
     */
    public int[][] getSubMissionMapId()
    {
        int missionCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(!mission.isMain && mission.getMissionState() == Mission.STATE_ACCEPT)
            {
                missionCnt++;
            }
        }
        if (missionCnt == 0) {
            return null;
        }
        int[][] subId = new int[missionCnt][];
        missionCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(!mission.isMain && mission.getMissionState() == Mission.STATE_ACCEPT)
            {
                subId[missionCnt] = mission.mapId;
            }
        }
        return subId;
    }

    /**
     * 获得当前主线任务
     * @return
     */
    public Mission getCurMainMission() {
        Mission m = null;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            m = (Mission) missionMap.value(index);
            if(m.isMain && m.getMissionState() == Mission.STATE_ACCEPT)
            {
                return m;
            }
        }
        return m;
    }
    
    /**
     * 获取所有主线
     * @return
     */
    public Mission[] getMainMission() {
        int missionCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(mission.isMain) 
            {
                missionCnt++;
            }
        }
        Mission[] m = new Mission[missionCnt];
        missionCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(mission.isMain) 
            {
                m[missionCnt] = mission;
                missionCnt++;
            }
        }        
        return m;
    }
    
    /**
     * 获取所有支线
     * @return
     */
    public Mission[] getSubMissions() {
        int cnt = 0;
        int finishCnt = 0;
//        int failCnt = 0;
        int curCnt = 0;
//        int noCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(!mission.isMain && mission.visible) {
                cnt++;
                if(mission.getMissionState() == Mission.STATE_FINISH)
                {
                    finishCnt++;
                }
//                else if(mission.getMissionState() == Mission.STATE_FAIL)
//                {
//                    failCnt++;
//                }
                else if(mission.getMissionState() == Mission.STATE_ACCEPT)
                {
                    curCnt++;
                }
//                else
//                {
//                    noCnt++;
//                }
            }
        }
        if(cnt == 0) {
            return null;
        }
        Mission[] finishMission = new Mission[finishCnt];
//        Mission[] failMission = new Mission[failCnt];
        Mission[] curMission = new Mission[curCnt];
//        Mission[] noMission = new Mission[noCnt];

        cnt = 0;
        finishCnt = 0;
//        failCnt = 0;
        curCnt = 0;
//        noCnt = 0;
        for(int index = 0, size = missionMap.size(); index < size; index++)
        {
            Mission mission = (Mission) missionMap.value(index);
            if(!mission.isMain && mission.visible) {
                cnt++;
                if(mission.getMissionState() == Mission.STATE_FINISH)
                {
                    finishMission[finishCnt] = mission;
                    finishCnt++;
                }
//                else if(mission.getMissionState() == Mission.STATE_FAIL)
//                {
//                    failMission[failCnt] = mission;
//                    failCnt++;
//                }
                else if(mission.getMissionState() == Mission.STATE_ACCEPT)
                {
                    curMission[curCnt] = mission;
                    curCnt++;
                }
//                else
//                {
//                    noMission[noCnt] = mission;
//                    noCnt++;
//                }
            }
        }
        Mission[] ms = new Mission[cnt];
        cnt = 0;
        System.arraycopy(curMission, 0, ms, cnt, curMission.length);
        cnt += curMission.length;
        System.arraycopy(finishMission, 0, ms, cnt, finishMission.length);
//        cnt += finishMission.length;
//        System.arraycopy(failMission, 0, ms, cnt, failMission.length);
//        cnt += failMission.length;
//        System.arraycopy(noMission, 0, ms, cnt, noMission.length);
        return ms;
    }
}
