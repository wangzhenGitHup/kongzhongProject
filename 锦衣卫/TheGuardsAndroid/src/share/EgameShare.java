/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package share;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.widget.Toast;
import cn.game189.sms.SMS;
import cn.game189.sms.SMSListener;
import cost.CostListener;
import fishfly.guard.arpg.GameContext;
import fishfly.guard.arpg.MainCanvas;
import java.io.IOException;
import javax.microedition.lcdui.Display;

/**
 * QQ分享
 * @author huyang
 */
public class EgameShare implements Share, SMSListener {

    private Bitmap imgIcon;
    private Activity activity;

    public EgameShare(Activity activity) {
        try {
            this.activity = activity;
            imgIcon = BitmapFactory.decodeStream(MainCanvas.assertMgr.open("fenxiangtubiao.png"));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void show() {
    }

    public Bitmap getIcon() {
        return imgIcon;
    }

    public String getShareName() {
        return "更多游戏";
    }

    public void show(String str) {
    }

    public void destroy() {
    }
    private String reLifeFeeName = "";

    /**
     * 在弹出计费提供框后，用户点击确定并计费成功后的处理
     * @param feeName 对应当计费标识值
     * @see cn.game189.sms.SMSListener#smsOK(java.lang.String)
     */
    public void smsOK(String feeName) {
        //关卡打开后续代码
        GameContext.sms.remindResult(CostListener.COST_OK, "");
        Log.i("SMSListener", "模式" + feeName + "已计费完成,关卡已打开.");
        Toast.makeText(Display.dis, "发送成功，请及时存档，以免数据丢失。", Toast.LENGTH_SHORT).show();
    }

    /**
     * 短代发送失败,错误码含义如下:
     * <pre>
     * 0.初始值或取消发送
     * 1.已计过费
     * 2.发送短信成功
     * -1.发送失败
     * -2.无卡
     * -3.非电信卡
     * -4.获取终端码失败
     * -5.保存计费点失败
     * -6.获取存档数据有误
     * -7.获取存档时读终端码失败
     * -8.获取存档时feeName不匹配
     * -9.获取存档时终端码不匹配
     * -10.获取存档发生异常
     * -11.feeName不合法
     * </pre>
     * @param feeName 对应当前的SMS.STR_CHECK值
     * @param errorCode 错误码
     * @see cn.game189.sms.SMSListener#smsFail(int)
     */
    public void smsFail(String feeName, int errorCode) {
        GameContext.sms.remindResult(CostListener.COST_FAIL, "");
        Log.e("SMSListener", "计费失败!计费点:" + feeName + " 错误码:" + errorCode);
        //其他错误处理操作,不给道具或不放行关卡
    }

    public void smsCancel(String feeName, int errorCode) {
        GameContext.sms.remindResult(CostListener.COST_FAIL, "");
        Log.e("SMSListener", "用户点击取消!计费点:" + feeName + " 错误码:" + errorCode);
    }

    /*
     * 验证计费点核心静态方法,自动完成全部短代过程
     * @param feeName 计费点标识符,不可包含#号,不同计费点此值必须不同
     * @param activity Activity 不能为null
     * @param listener SMSListener接口,处理发送成功和失败的操作,不能为null 
     * @param feeCode 短代代码,请登录平台查询产品计费信息并完整复制对应的计费点!!费用按平台上此计费点的对应费用计!
     * @param tip 短代提示语
     * @param okInfo 短代发送成功的提示语
     * @return 返回是否已计过费
     */
    public void send(String code, String dest) {
        reLifeFeeName = reLifeFeeName + System.currentTimeMillis();
        //不需要判断是否已计费
        if (SMS.checkFee(reLifeFeeName, Display.dis, this, code, dest, "发送成功，请及时存档，以免数据丢失。")) {
            //在这里处理该计费点已扣过费后的处理
            Toast.makeText(Display.dis, "已计过费。", Toast.LENGTH_SHORT).show();
        }
    }
}
