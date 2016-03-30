/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package fishfly.guard.arpg;

import android.content.Context;
import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import android.content.res.AssetFileDescriptor;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileDescriptor;
import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.microedition.lcdui.Canvas;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class MusicPlayer {
    public static final String BACK_MUSIC_KIND_MIDI = "audio/midi";

    private static MusicPlayer instance;
    //总共的音量
    public static final int ALL_SOUND_LV = 5;
    
    //是否打开音乐了
    public boolean isOpenMusic = true;
    private MediaPlayer player;
    //定义SoundPool对象
    private SoundPool soundPool;
    
    //在音乐路径改变的时候，标注音乐路径改变
    private boolean isReload;
    private String reloadPath;

    boolean isPause;
//    VolumeControl vc;
    //当前音乐等级
    public int curSoundLv = 3;
    public boolean isStart;

    //音效等级
    public float volume = 0.5f;

    //背景音乐的名字
    public String musicPath;
    
    private PackageReader musicPkg;
    
    int sleepTime;
//    HashMap soundPoolMap  = new HashMap();

      //音效的名字
    public String[] soundPath = SoundConst.SOUND_NAME;
    public int recentId;
    private int[] soundAll = new int[SoundConst.SOUND_NAME.length];

    private MusicPlayer() {
//        musicPkg = new PackageReader("/music.idx", "/music.mp3");
        soundPool = new SoundPool(5, AudioManager.STREAM_MUSIC, 100);
        for (int idx = 0, longest = soundPath.length; idx < longest; idx++) {
            StringBuilder fileName = new StringBuilder("music/");
            fileName.append(soundPath[idx]);
            fileName.append(".ogg");
            soundAll[idx] = load(fileName.toString());
        }
    }

    public static synchronized  MusicPlayer getInstance() {
        if (instance == null) {
            instance = new MusicPlayer();
        }
        return instance;
    }

    void sleep()
    {
        sleepTime = 60;
    }
    
    private String getBackKind()
    {
        return BACK_MUSIC_KIND_MIDI;
    }

    void load(DataInputStream in)
    {
        try
        {
            isReload = true;
            reloadPath = in.readUTF();
        }
        catch (Exception ex)
        {
            
        }
    }

    void save(DataOutputStream out)
    {
        try
        {
            if(reloadPath == null)
            {
                out.writeUTF("");
                return;
            }
            out.writeUTF(reloadPath);
        }
        catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
//    private int getPlayerState() {
//        if(player != null) {
//            return player.getState();
//        }
//
//        return UNKNOWN_STATE;
//    }
    
    public void delMusic() {
        stop();      
        if(player != null)
        {
            player.stop();
            player = null;
        }
        musicPath = null;
    }

    
    /**
     * 增加音量
     */
    public void upSoundLevel()
    {
        //#if SOUND == 1
//#         curSoundLv = 3;
//#         isOpenMusic = true;
//#         setSoundLevel(curSoundLv);
        //#else
        if(curSoundLv < ALL_SOUND_LV)
        {
            curSoundLv++;
            if(curSoundLv > 0)
            {
                isOpenMusic = true;
            }
        }
        else 
        {
            curSoundLv = 0;
            isOpenMusic = false;
            stop();     
        }
        
        setSoundLevel(curSoundLv);
        //#endif
    }
    
    /**
     * 减少音量
     */
    public void downSoundLevel()
    {
        //#if SOUND == 1
//#         curSoundLv = 0;
//#         isOpenMusic = false;
//#         stop();
//#         setSoundLevel(curSoundLv);
        //#else
        if(curSoundLv > 0)
        {
            curSoundLv --;
            if(curSoundLv == 0)
            {
                isOpenMusic = false;
                stop();
            }
        }
        else
        {
            curSoundLv = ALL_SOUND_LV;
            isOpenMusic = true;
        }
        
        setSoundLevel(curSoundLv);
        //#endif
    }
    
    

    /**
     * 为了让歌的音效不卡，在音乐开始之前先播放一下
     * @param lv 
     */
    public void setSoundLevel(int lv) {
        if (player == null) {
            isOpenMusic = true;
            updateOpenMusic();
        }
        curSoundLv = lv;
        if (lv == 0) {
            volume = (20 * lv / 100.0f);
            float v = (20 * lv / 100.0f);
            player.setVolume(v, v);
        } else {
            isOpenMusic = true;
            volume = (20 * lv / 100.0f);
            float v = (20 * lv / 100.0f);
            player.setVolume(v, v);
        }

    }

    private void setLoopCount(int loopCount)
    {
        //#if NOKIAUI == 1
//#         if(true)
//#         {
//#             return;
//#         }
        //#endif
        if(player == null) {
            return;
        }
        
        if(loopCount == 0) {
            loopCount = -1;
        }
        try {
            player.setLooping(loopCount == -1);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }
    
    private void initPlayer(String path, String musicKind, int loopCount)
    {
        if(player != null && path != null && path.equals(musicPath)) {
            //已经初始化了
            return;
        }
        initPlayer(path, musicKind);
        setLoopCount(loopCount);
    }
    
    /**
     * 初始化
     * @param path
     * @param musicKind
     */
    private void initPlayer(String path, String musicKind)
    {
        musicPath = path;
        if (path.indexOf(".ogg") == -1) {
            path += ".ogg";
        }
        musicKind = getBackKind();

        try
        {
            //#if PRINTDEBUG == 1
            System.out.println("初始化音乐 = " + path);
            //#endif
            stop();
            player = new MediaPlayer();
//          AssetFileDescriptor asFileD = Canvas.assertMgr.openFd("music.mp3");
            AssetFileDescriptor asFileD = Canvas.assertMgr.openFd(path);
            FileDescriptor fileD = asFileD.getFileDescriptor();
//            player.setDataSource(fileD, asFileD.getStartOffset() + musicPkg.getOffsetStart(path), musicPkg.getLength(path));
            player.setDataSource(fileD, asFileD.getStartOffset(), asFileD.getLength());
            System.out.println("声音初始化");
            player.prepare();
            player.setLooping(true);
            Thread.sleep(20);
            Thread.sleep(20);
            setSoundLevel(curSoundLv);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            isOpenMusic = false;
        }
    }

    private int load(String fileName) {
        int id = 0;
        try {
            id = soundPool.load(Canvas.assertMgr.openFd(fileName), 0);
        } catch (IOException ex) {
            Logger.getLogger(MusicPlayer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return id;
    }

    private void start()
    {
        if(!isOpenMusic)
        {
            return;
        }
        if(player == null) {
            return;
        }
        if(isStart) {
            return;
        }
        try
        {
            if(isPause)
            {
                return;
            }            
            player.start();
//            if(player.getState() == Player.PREFETCHED) {
//                //#if PRINTDEBUG == 1
//                System.out.println("音乐启动:" + musicPath);
//                //#endif
//                player.start();
//            }
            isStart = true;
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }
    
    /**
     * 强令停止
     */
    public void kill() {
        stop();
    }    
    
    private void stop()
    {
        if(player == null) {
            return;
        }
        
        try
        {
            isStart = false;
            player.stop();
//            if(player.getState() != Player.CLOSED) {
//                player.stop();
//                //#if PRINTDEBUG == 1
//                System.out.println("音乐停止:" + musicPath);
//                //#endif
//            }

            player = null;

        } catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
    }
    
    public void close() {
        isOpenMusic = false;
        stop();
        curSoundLv = 0;
    }

    int musicCnt;
    public void update() {
//        //暂停期间不处理音乐更新:如界面载入
        musicCnt++;
        if(isPause) {
            return;
        }
        if(sleepTime > 0)
        {
            sleepTime --;
            return;
        }

        if(isReload) {
            updateReloadMusic();
            return;
        }
        
        if(isOpenMusic) {
            updateOpenMusic();
            return;
        }
//
//        if(player != null)
//        {
//            stop();
//            return;
//        }
    }
    
    private void updateOpenMusic() {
        //#if E2
//#         if((musicCnt & 0xf) != 0)
//#         {
//#             return;
//#         }
        //#endif
        //音乐路径为空
        if(musicPath == null) {
            return;
        }
        if (player == null)
        {
            //#if PRINTDEBUG == 1
            //#endif
            initPlayer(musicPath, MusicPlayer.BACK_MUSIC_KIND_MIDI, -1);
            isStart = false;
            start();
            return;
        }
        if(!isStart)
        {
            start();
        }
        //#if NOKIAUI == 1
//#         if (getPlayerState() == Player.PREFETCHED)
//#         {
//#             isStart = false;
//#             start();
//#             return;
//#         }
        //#endif
        //#if E2 || V8
//#         if (getPlayerState() != Player.STARTED)
//#         {
//#             isStart = false;
//#             start();
//#             return;
//#         }
        //#endif
    }
    
    private void updateReloadMusic() {
        //状态时一定要改变的
        isReload = false;
        
        //如果没有开始播音乐
        if(!isOpenMusic) {
            //直接替换路径就ok啦
            musicPath = reloadPath;
            return;
        }
        
        //当前没有播放音乐
        if(player == null) {
            //下一个回合自动开始这个音乐
            musicPath = reloadPath;
            return;
        }
        
        //player != null
        //reloadPath路径为空
        if(reloadPath == null) {
            return;
        }
        
        //两次的音乐相同，不用改变
        if(reloadPath.equals(musicPath)) {
            return;
        }
        
        //停止当前的音乐
        stop();
        
        musicPath = reloadPath;
    }
    
    public void reload(String musicPath, boolean isRepeat) {
        if(musicPath == null) {
            return;
        }
        
        isReload = true;
        reloadPath = musicPath;
        initPlayer(musicPath, BACK_MUSIC_KIND_MIDI, -1);
//        if(isRepeat && getBackKind().equals(BACK_MUSIC_KIND_MIDI))
//        {
//            isStart = false;
//            start();
//        }
        //#if PRINTDEBUG == 1
        System.out.println("重新载入音乐:" + musicPath);
        //#endif
    }
    
    public void pause() {
        isPause = true;
        //#if PRINTDEBUG == 1
        System.out.println("音乐暂停：" + musicPath);
        //#endif
    }

    public void playSound(int soundId) {
        recentId = soundPool.play(soundAll[soundId], volume, volume, 0, 0, 1.0f);
    }
    
    public void resume() {
        isPause = false;
        isStart = false;
        //#if PRINTDEBUG == 1
        System.out.println("音乐恢复: " + musicPath);
        //#endif
    }
}
