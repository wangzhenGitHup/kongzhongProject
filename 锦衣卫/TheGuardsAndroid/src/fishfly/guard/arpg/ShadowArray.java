/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fishfly.guard.arpg;
//#if NOKIAUI == 1
//# import com.nokia.mid.ui.DirectGraphics;
//# import com.nokia.mid.ui.DirectUtils;
//#endif
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 * 实现一个影序列的工作
 * 每个影子按照加入的顺序，其显示强度依次衰减，越来越透明
 * @author hezhaowei
 */
public class ShadowArray {
    int[][] imgs;
    //数组大小
    int arraySize;
    
    int head;
    //指向下一个插入的位置
    int tail;
    
    //图片宽度
    int[] ws;

    //图片高度
    int[] hs;

    //图片坐标, 在当前场景的整个区域
    int[] xs;
    int[] ys;

    int mem = 0;
    
    public ShadowArray(int size) {
        imgs = new int[size][];
        arraySize = size;
        ws = new int[size];
        hs = new int[size];
        xs = new int[size];
        ys = new int[size];
    }

    public void paint(Graphics g, int offsetX, int offsetY) {
        int alpha = 0xFF;
        if(imgs[head] == null) {
            return;
        }
        
        //最后添加的最先显示，并且最不透明
        int i = tail - 1, idx = 0;
        
        do {
            if(i < 0) {
                i = arraySize - 1;
            }

            int[] data = imgs[i];

            if(data == null) {
                break;
            }
//            for(int j = 0; j < data.length; j++) {
//                if(data[j] != 0) {
//                    System.out.println("good");
//                }
//            }
            if(idx > 0) {
                int size = data.length;
                int mask = alpha << 24;
                for(int j = 0; j < size; j++) {
                    //先清空原来的状态，然后设置新状态
                    if(data[j] != 0) {
                        data[j] &= 0xFFFFFF;
                        data[j] |= mask;
                    }
                }
            }
            //#if NOKIAUI == 1
//#             DirectGraphics dg = DirectUtils.getDirectGraphics(g);
//#             dg.drawPixels(data, true, 0, ws[i], xs[i] - offsetX, ys[i] - offsetY, ws[i], hs[i], 0, DirectGraphics.TYPE_INT_8888_ARGB);
            //#elif K790
//#             g.drawRGB(data, 0, ws[i], xs[i] - offsetX, ys[i] - offsetY + g.getTranslateY(), ws[i], hs[i], true);
            //#else
            g.drawRGB(data, 0, ws[i], xs[i] - offsetX, ys[i] - offsetY, ws[i], hs[i], true);
            //#endif
            //后面的透明度依次衰减
            alpha -= 60;
            if(alpha == 0) {
                break;
            }
            if(i == head) {
                break;
            }
            i--;
            idx++;
        } while(true);
    }
    
    public void paintAnimation(PaintUnit unit, int x, int y) {
        Rect box = new Rect();
        unit.getPaintBox(box);
        int w = box.getWidth();
        int h = box.getHeight();
        int leftX = box.xmin;
        int topY = box.ymin;
        box = null;
        
        int cnt = w * h;
        int[] rgb = new int[cnt];

        Image bufImg = Image.createImage(w, h);
        Graphics bg = bufImg.getGraphics();

        //#if E2 || E6 || V8
//#         bg.setColor(0);
        //#else
        bg.setColor(0xff00ff);
        //#endif
        bg.fillRect(0, 0, w, h);
        int bakX = unit.x;
        int bakY = unit.y;
        unit.x = 0;
        unit.y = 0;
        unit.paintAnimation(bg, leftX, topY);
        unit.x = bakX;
        unit.y = bakY;
        
        bufImg.getRGB(rgb, 0, w, 0, 0, w, h);
        for(int i = 0; i < cnt; i++) {
            //#if E2 || E6 || V8
//#             if((rgb[i] & 0xffffff) == 0) {
                //#else
            if(rgb[i] == 0xffff00ff) {
                //#endif
                rgb[i] = 0;
            }
        }

        //请求垃圾回收
        bufImg = null;
        //插入队列
        if(imgs[tail] != null) {
            //释放已用的这个
            imgs[tail] = null;
            if(tail == head) {
                head++;
                if(head >= arraySize) {
                    head = 0;
                }
            }
        }
        imgs[tail] = rgb;
        ws[tail] = w;
        hs[tail] = h;
        xs[tail] = x + leftX;
        ys[tail] = y + topY;
        mem += rgb.length * 4;
        //#if PRINTDEBUG == 1
        System.out.println("内存消耗:" + (mem / 1000) + "KB");
        //#endif

        rgb = null;
        tail++;
        if(tail >= arraySize) {
            tail = 0;
        }
    }

    public void clear() {
        head = tail = 0;
        for(int i = 0; i < arraySize; i++) {
            imgs[i] = null;
        }
        mem = 0;
    }
}
