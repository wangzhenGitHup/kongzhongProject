/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package share;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.view.View;
import android.widget.RelativeLayout;
import com.tencent.webnet.PreSMSReturn;
import com.tencent.webnet.WebNetInterface;
import fishfly.guard.arpg.GameContext;
import fishfly.guard.arpg.MainCanvas;
import fishfly.guard.arpg.Page;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 *
 * @author huyang
 */
public class GameNetWork{

    private ArrayList<Share> gameShare = new ArrayList();
    private boolean isMainHaveRequirements;
    private Image img;
    private Activity activity;
    private View view;
    private String[] name;
    private int[] nameIdx;
    public EgameShare egameShare;
    public QQShare qqShare;
    public PreSMSReturn preSmsReturn;
    public GameNetWork(Display disPlay, Canvas canvas)
    {
        this.view = canvas;
        activity = disPlay;

        if (GameContext.version == 2) {
            qqShare = new QQShare(disPlay);
            gameShare.add(qqShare);
        }
        if (GameContext.version == 48)
        {
            egameShare = new EgameShare(disPlay);
            gameShare.add(egameShare);
        }

        name = new String[gameShare.size()];
        nameIdx = new int[gameShare.size()];
        for(int index = 0,cnt = name.length; index < cnt; index++)
        {
            name[index] = ((Share)gameShare.get(index)).getShareName();
            nameIdx[index] = index;
        }
        isMainHaveRequirements = !gameShare.isEmpty();
        if(!isMainHaveRequirements)
        {
            return;
        }
        try {
            img = Image.createImage(MainCanvas.assertMgr.open("fenxiangtubiao.png"));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

     /**
     * 浏览页面
     * @param url
     */
    public void startUrl(String url)
    {
        final Uri uri = Uri.parse(url);
        final Intent it = new Intent(Intent.ACTION_VIEW, uri);
        GameContext.display.startActivity(it);
    }
    

    public boolean isMainHaveRequirements() {
        return isMainHaveRequirements;
    }

    public void drawMainScreen(Graphics g)
    {
        if(isMainHaveRequirements)
        {
            g.drawImage(img, (Page.SCREEN_WIDTH - img.getWidth()), (Page.SCREEN_HEIGHT - img.getHeight()), 0);
        }
    }

    private RelativeLayout lay;
    public boolean doMainScreenPointerPressed(int x, int y)
    {
        if(!isMainHaveRequirements)
        {
            return false;
        }

        if (GameContext.point(x, y, (Page.SCREEN_WIDTH - img.getWidth()), (Page.SCREEN_HEIGHT - img.getHeight()), img.getWidth(), img.getHeight()))
        {
            if (GameContext.version == 2)
            {
                WebNetInterface.StartWeb(GameContext.display);
/////////                  WebNetInterface.UpdateScore(10, 1000000);
                return true;
            }
            if (GameContext.version == 48)
            {
                String url = "http://wapgame.189.cn";
                startUrl(url);
                return true;
            }

            return true;
        }
        return false;
    }

    public List<HashMap<String,Object>> getListData()
    {
        List<HashMap<String,Object>> list = new ArrayList<HashMap<String,Object>>();
        HashMap<String,Object> map = null;
        for(int index = 0,cnt = gameShare.size(); index < cnt; index++)
        {
            map = new HashMap<String, Object>();
            map.put("img", gameShare.get(index).getIcon());
            map.put("title", gameShare.get(index).getShareName());
            list.add(map);
        }
        return list;
    }

    public boolean isNeedUpdataAchievements() {
        return false;
    }

}
