/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package share;

import android.graphics.Bitmap;

/**
 * 不同渠道的发布
 * @author huyang
 */
public interface Share {

    public String imgUrl = "http://sms.51fishfly.cn/portal/xiyou.jpg";
    public String downLoadUrl = "http://game.189.cn/hd/2012qs";

    public void show();
    public Bitmap getIcon();
    public String getShareName();
    public void show(String str);
}
