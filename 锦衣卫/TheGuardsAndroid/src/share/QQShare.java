/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package share;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.tencent.webnet.WebNetEvent;
import com.tencent.webnet.WebNetInterface;
import fishfly.guard.arpg.GameContext;
import fishfly.guard.arpg.MainCanvas;
import cost.CostListener;
import java.io.IOException;

/**
 * QQ分享
 * @author huyang
 */
public class QQShare implements Share {

    private Bitmap imgIcon;

    public QQShare(Activity activity) {
        try {
            WebNetInterface.Init(activity, new MyWebNetEvent());
            imgIcon = BitmapFactory.decodeStream(MainCanvas.assertMgr.open("fenxiangtubiao.png"));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void show() {
//        WebNetInterface.StartWeb(activity);
    }

    public Bitmap getIcon() {
        return imgIcon;
    }

    public String getShareName() {
        return "QQ游戏中心";
    }

    public void show(String str) {
    }

    public void destroy() {
        if (GameContext.version == 2) {
            WebNetInterface.Destroy();
        }
    }

    public String PreSMSBillingPoint(int id) {
        return WebNetInterface.PreSMSBillingPoint(id).m_contents;
    }

    public void SMSBillingPoint(int id, String mark) {
        WebNetInterface.SMSBillingPoint(id, mark);
    }

    public class MyWebNetEvent implements WebNetEvent {

        public boolean SendSMSCB(int i, String string) {
            if (i == SendSMS_Event_OK) {
                GameContext.sms.remindResult(CostListener.COST_OK, "");
            } else {
                GameContext.sms.remindResult(CostListener.COST_FAIL, "");
            }
            return false;
        }

        public boolean SyncMicBlogCB(int i, String string) {
            throw new UnsupportedOperationException("Not supported yet.");
        }
    }
}
