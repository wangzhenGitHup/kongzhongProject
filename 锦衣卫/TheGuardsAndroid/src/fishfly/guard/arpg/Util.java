/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

//#if NOKIAUI == 1
//# import com.nokia.mid.ui.DirectGraphics;
//# import com.nokia.mid.ui.DirectUtils;
//#endif
import android.graphics.ColorMatrixColorFilter;
import javax.microedition.lcdui.Canvas;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class Util {
    static final Util instance = new Util();
    
    ///////////////////////////////////////////////////////////////////////////
    //绘制相关
    public static final void drawClipImage(
            Graphics g, 
            Image image, 
            int x, 
            int y, 
            int clip_x, 
            int clip_y, 
            int width, 
            int hight)
    {
        g.setClip(x, y, width, hight);
        g.drawImage(image, x - clip_x, y - clip_y, 0);
        g.resetClip();
    }   

    /**
     * 这个是一边计算一边画数字，先画右边的位
     * @param g
     * @param num
     * @param numImg
     * @param numWidth
     * @param rightX
     * @param topY
     */
    public static final void drawNumbersAlignRight(Graphics g, int num, Image numImg, int numWidth, int interval, int rightX, int topY) {
        int inum = 0;
        int x = rightX - numWidth;
        int numHeight = numImg.getHeight();
        if(num == 0) {
            Util.drawClipImage(g, numImg, x, topY, 0, 0, numWidth, numHeight);
            return;
        }

        for(int tmp = num; tmp != 0; inum++) {
            int reminder = tmp % 10;
            Util.drawClipImage(g, numImg, x, topY, numWidth * reminder, 0, numWidth, numHeight);
            tmp /= 10;
            x -= numWidth + interval;
        }
    }

    public static final void drawNumbersAlignCenter(Graphics g, int num, Image numImg, int numWidth, int interval, int centerX, int topY) {
        int numSize = getNumberSize(num);
        int numW = (numWidth + interval) * numSize - interval;
        int rightX = centerX + (numW >> 1);
        drawNumbersAlignRight(g, num, numImg, numWidth, interval, rightX, topY);
    }

    public static final void drawNumbersAlignRight(Graphics g, int num, Image numImg, int numWidth, int numHeight, int interval, int rightX, int topY) {
        int inum = 0;
        int x = rightX - numWidth;
        if(num == 0) {
            Util.drawClipImage(g, numImg, x, topY, 0, 0, numWidth, numHeight);
            return;
        }

        for(int tmp = num; tmp != 0; inum++) {
            int reminder = tmp % 10;
            Util.drawClipImage(g, numImg, x, topY, 0, numHeight * reminder, numWidth, numHeight);
            tmp /= 10;
            x -= numWidth + interval;
        }
    }

    public static final void drawClipImageRgb(
            Graphics g, 
            int[] img, 
            int imgWidth, 
            int imgHeight, 
            int x, 
            int y, 
            int clip_x, 
            int clip_y, 
            int width, 
            int hight)
    {
        g.setClip(x, y, width, hight);        
        Util.drawRGB(g, img, 0, imgWidth, x - clip_x, y - clip_y, imgWidth, imgHeight, true);
//        g.drawRGB(img, 0, imgWidth, x - clip_x, y - clip_y, imgWidth, imgHeight, true);
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
    }
    
    public static void drawRGB(Graphics g, int[] data, int start, int width, int x, int y, int imgWidth, int imgHeight, boolean isA)
    {
        //#if NOKIAUI == 1
//#         DirectGraphics dg = DirectUtils.getDirectGraphics(g);
//#         dg.drawPixels(data, isA, start, width, x, y, imgWidth, imgHeight, 0, DirectGraphics.TYPE_INT_8888_ARGB);
        //#else
        g.drawRGB(data, start, width, x, y, imgWidth, imgHeight, isA);
        //#endif
    }

    /**
     * 渲染选项
     * @param g
     * @param x
     * @param y
     * @param width
     * @param height
     * @param color
     */
    public static void drawSelectRect(Graphics g, int x, int y, int width, int height, int color)
    {
        g.setColor(color);
        g.drawRect(x, y, width, height);
        fillTriangle(g, x, y, x, y + height, x + (height >> 1), y + (height >> 1));
        fillTriangle(g, x + width, y, x + width, y + height, x + width - (height >> 1), y + (height >> 1));
    }
    
    public static Image getImageTransparent(Image img, int trueColor)
    {
        int imgWidth = img.getWidth();
        int imgHeight = img.getHeight();
        int[] data = new int[imgWidth * imgHeight];
        img.getRGB(data, 0, imgWidth, 0, 0, imgWidth, imgHeight);
        for (int index = 0, count = data.length; index < count; index++)
        {
            //获取原来图片的透明色
            int ar = (data[index] >> 24) & 0xff;
            int color = data[index] & 0xff;
            //纯透明就直接返回
            if (ar == 0)
            {
                continue;
            }
            //#if N73 || E62
//#             if(color == 0xff)
//#             {
//#                 data[index] &= 0xffffff;
//#                 continue;
//#             }
            //#endif
            data[index] = 0;
            data[index] = (color << 24) | trueColor;
        }
        return Image.createRGBImage(data, imgWidth, imgHeight, true);     
    }    
    public static final void drawRegion(
            Graphics g, 
            Image img, 
            int x_src, 
            int y_src, 
            int width, 
            int height, 
            int transform, 
            int x_dest, 
            int y_dest, 
            int anchor)
    {
        if(x_src < 0)
        {
            width -= -x_src;
            x_src = 0;
        }
        if(y_src < 0)
        {
            height -= -y_src;
            y_src = 0;
        }
        int disX = x_src + width - img.getWidth();
        int disY = y_src + height - img.getHeight();
        if(disX > 0)
        {
            width -= disX;
        }
        if(disY > 0)
        {
            height -= disY;
        }
        if(width <= 0 || height <= 0)
        {
//            System.out.println("width = " + width);
//            System.out.println("height = " + height);
//            System.out.println("x_src = " + x_src);
//            System.out.println("y_src = " + y_src);
//            System.out.println("img.getWidth() = " + img.getWidth());
//            System.out.println("img.getHeight() = " + img.getHeight());
            return;
        }
        //#if NOKIAUI == 0
        if(transform == Sprite.TRANS_NONE)
        {
//            g.drawRegion(img, x_src, y_src, width, height, transform, x_dest, y_dest, anchor);
            drawClipImage(g, img, x_dest, y_dest, x_src, y_src, width, height);
            return;
        }
        //#if K700
//#         if (transform == 6 && anchor == (Graphics.LEFT | Graphics.BOTTOM))
//#         {
//#             y_dest -= width;
//#             anchor = Graphics.LEFT | Graphics.TOP;
//#         }
//#         if (transform == 7 && anchor == (Graphics.RIGHT | Graphics.BOTTOM))
//#         {
//#             y_dest -= width;
//#             x_dest -= height;
//#             anchor = Graphics.LEFT | Graphics.TOP;
//#         }
//#         if (transform == 5 && anchor == (Graphics.RIGHT | Graphics.TOP))
//#         {
//#             x_dest -= height;
//#             anchor = Graphics.LEFT | Graphics.TOP;
//#         }
//#         
        //#endif
        g.drawRegion(img, x_src, y_src, width, height, transform, x_dest, y_dest, anchor);   
        //#elif NOKIAUI == 1
//#         DirectGraphics gh = DirectUtils.getDirectGraphics(g);
//#         if (anchor == (Graphics.HCENTER | Graphics.TOP))
//#         {
//#             x_dest -= width >> 1;
//#             g.setClip(x_dest, y_dest, width, height);
//#         }
//#         else if (anchor == (Graphics.RIGHT | Graphics.TOP))
//#         {
//#             if(transform == 2)
//#             {
//#                 x_dest -= width;
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#             else if(transform == 5)
//#             {
//#                 x_dest -= height;
//#                 g.setClip(x_dest, y_dest, height, width);
//#             }
//#             else
//#             {
//#                 x_dest -= width;
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#         }
//#         else if (anchor == (Graphics.LEFT | Graphics.BOTTOM))
//#         {
//#             if(transform == 1)
//#             {
//#                 y_dest -= height;
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#             else if(transform == 6)
//#             {
//#                 y_dest -= width;
//#                 g.setClip(x_dest, y_dest, height, width);
//#             }
//#             else
//#             {
//#                 y_dest -= height - 1;
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#         }
//#         else if (anchor == (Graphics.HCENTER | Graphics.BOTTOM))
//#         {
//#             y_dest -= height;
//#             x_dest -= width >> 1;
//#             g.setClip(x_dest, y_dest, width, height);
//#         }
//#         else if (anchor == (Graphics.RIGHT | Graphics.BOTTOM))
//#         {
//#             if(transform == 3)
//#             {
//#                 x_dest -= width;
//#                 y_dest -= height;
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#             else if(transform == 7)
//#             {
//#                 x_dest -= height;
//#                 y_dest -= width;
//#                 g.setClip(x_dest, y_dest, height, width);                
//#             }
//#             else
//#             {        
//#                 x_dest -= width;
//#                 y_dest -= height - 1;                
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#         }
//#         else if(anchor == (Graphics.LEFT | Graphics.TOP) || anchor == 0)
//#         {
//#             if(transform == 0)
//#             {
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#             else if(transform == 4)
//#             {
//#                 g.setClip(x_dest, y_dest, height, width);
//#             }
//#             else
//#             {
//#                 g.setClip(x_dest, y_dest, width, height);
//#             }
//#         }
//#         
//#         if (transform == 2)
//#         {                            //左右镜像
//#             gh.drawImage(img, x_dest - (img.getWidth() - x_src - width), y_dest - y_src, 0, 8192);
//#         }
//#         if (transform == 1)//左下
//#         {                            //上下镜像
//#             gh.drawImage(img, x_dest - x_src, y_dest - (img.getHeight() - y_src - height), 0, DirectGraphics.FLIP_HORIZONTAL | DirectGraphics.ROTATE_180);
//#         }
//#         if (transform == 6)//左下
//#         {
//#             gh.drawImage(img, x_dest - y_src, y_dest - (img.getWidth() - x_src - width), 0, 90);   //左转90度
//#         }
//#         if (transform == 5)//右上
//#         {
//#             gh.drawImage(img, x_dest - (img.getHeight() - y_src - height), y_dest - x_src, 0, 270);   //右转90度
//#         }
//#         if (transform == 3)//右下
//#         {                                         //180度翻转
//#             gh.drawImage(img, x_dest - (img.getWidth() - x_src - width), y_dest - (img.getHeight() - y_src - height), 0, DirectGraphics.ROTATE_180);
//#         }
//#         if (transform == 0)//坐上
//#         {
//#             g.drawImage(img, x_dest - x_src, y_dest - y_src, 0);
//#         }
//#         if (transform == 4)//左上
//#         {                            //TRANS_MIRROR_ROT270 右转90度镜像
//#             gh.drawImage(img, x_dest - y_src, y_dest - x_src, 0, DirectGraphics.FLIP_HORIZONTAL | DirectGraphics.ROTATE_270);
//#         }
//#         if (transform == 7)//右下
//#         {                            //TRANS_MIRROR_ROT90 左转90度镜像
//#             gh.drawImage(img, x_dest - (img.getHeight() - y_src - height), y_dest - (img.getWidth() - x_src - width), 0, DirectGraphics.FLIP_HORIZONTAL | DirectGraphics.ROTATE_90);
//#         }
//#         g.setClip(0, 0, MainCanvas.SCREEN_WIDTH, MainCanvas.SCREEN_HEIGHT);     
        //#endif
        //#if V8 || E2 || E6
//#         if(transform == Sprite.TRANS_MIRROR_ROT180)
//#         {
//#             if (anchor == 0 || anchor == (Graphics.LEFT | Graphics.TOP))
//#             {
//#                 drawClipImage(g, img, x_dest, y_dest, x_src, y_src + height - 1, width, 1);
//#             }
//#             if (anchor == (Graphics.RIGHT | Graphics.TOP))
//#             {
//#                 drawClipImage(g, img, x_dest - width, y_dest, x_src, y_src + height - 1, width, 1);
//#             }
//#             if (anchor == (Graphics.LEFT | Graphics.BOTTOM))
//#             {
//#                 drawClipImage(g, img, x_dest, y_dest - height, x_src, y_src + height - 1, width, 1);
//#             }
//#             if (anchor == (Graphics.RIGHT | Graphics.BOTTOM))
//#             {
//#                 drawClipImage(g, img, x_dest - width, y_dest - height - 1, x_src, y_src + height - 1, width, 1);
//#             }
//#         }
        //#endif        
    } 
    
    public static final void clearScreen(Graphics g, int color) {
        g.setColor(color);
        g.fillRect(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
    }
    
    public static final int makeColor(int red, int green, int blue) {
        return ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
    }
    
    /**
     * 在一定宽度范围内绘制文本，自动换行，遇到&符号也自动换行
     * 同时，文本居中
     * @param g
     * @param chs
     * @param leftX 坐标点
     * @param topY
     * @param width 宽度
     */
    public static final void drawTextAlignCenter(Graphics g, char[] chs, int topY, int width) {
        FishFont font = FishFont.getInstance();
        
        //*
        int ich = 0;
        int chCnt = chs.length;
        
        //不包含结束字符
        int lineWidth = 0;
        int chWidth = 0;
        char ch = 0;
        
        int curCh = 0;//当前第几个char
        int leftX = (Page.SCREEN_WIDTH - width) >> 1;
        int x = 0;
        int y = topY;
        int drawCh = 0;
        for(; ich < chCnt; ) {
            //计算当前行的字符数
            curCh = ich;
            lineWidth = 0;
            for(; curCh < chCnt; curCh++) {
                ch = chs[curCh];
                if(ch == '&') {
                    break;
                }
                
                chWidth = font.charWidth(ch);
                if(lineWidth + chWidth > width) {
                    //找到换行的点了
                    break;
                }
                
                lineWidth += chWidth;//这一行现在的总长
            }
            
            x = leftX + ((width - lineWidth) >> 1); //这是新一行开头的X
            
            for(drawCh = ich; drawCh < curCh; drawCh++) {
                ch = chs[drawCh];
                font.drawChar(g, ch, x, y);
                x += font.charWidth(ch);
            }
            
            y += FishFont.LINE_HEIGHT;
            
            ich = curCh;
            if(ch == '&') {
                ich++;
            }
        }
        /**/
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////
    //解密数据
    private static final int KEY_LENGTH = 8;  
    private static final long key = 8572394572934872345L;
    
    public static byte[] decryptImage(String path)
    {
//        System.out.println("解密文件:" + path);
        try
        {
            InputStream is = openFile(path);
            return decryptFile(is, true);
        } catch (Exception e) {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        return null;
    }

    /**
     * 对数据进行处理
     * @param data 原始数据
     * @param isEncrypt 是否是加密 true代表进行加密 false代表解密
     * @return 处理之后的数据
     */
    private static byte[] changeData(byte[] data, boolean isImg)
    {
        byte[] overData = new byte[data.length];

        try
        {
            final int BUF_LEN = 4;
            byte[] buf = new byte[BUF_LEN];
            final int HALF_KEY_LENGTH = KEY_LENGTH >> 1;
            int leftData = 0;
            int rightData = 0;
            for (int index = 0; index < data.length; index += KEY_LENGTH)
            {
                leftData = byteArrayToInt(data, index);
                rightData = byteArrayToInt(data, index + HALF_KEY_LENGTH);
                if(isImg) {
                    leftData ^= rightData;
                } else {
                    rightData ^= leftData;
                }
                
                //左半边数据
                leftData ^= ((int) (key >> 32) & 0xffffffff);
                //右半边数据
                rightData ^= (int) (key & 0xffffffff);
                intToByteArray(leftData, buf);
                System.arraycopy(buf, 0, overData, index, BUF_LEN);
                intToByteArray(rightData, buf);
                System.arraycopy(buf, 0, overData, index + HALF_KEY_LENGTH, BUF_LEN);
            }
        }
        catch (Exception e)
        {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        return overData;
    }    
    
    private static void intToByteArray(int data, byte[] buf)
    {
        buf[0] = (byte)((data >> 24) & 0xff);
        buf[1] = (byte)((data >> 16) & 0xff);
        buf[2] = (byte)((data >> 8) & 0xff);
        buf[3] = (byte)((data) & 0xff);
    } 
    
    /**
     * byte数组 变 INT
     * @param buf
     * @param index
     * @return
     */
    private static int byteArrayToInt(byte[] buf, int index)
    {
        return ((buf[index] & 0xff) << 24) | ((buf[index + 1] & 0xff) << 16) | ((buf[index + 2] & 0xff) << 8) | (buf[index + 3] & 0xff);
    }
    
    private static byte[] decryptFile(InputStream is, boolean isImg) throws IOException {
        int length = 0;
        if (isImg) {
            length = (is.read() & 0xff) | ((is.read() & 0xff) << 8) | ((is.read() & 0xff) << 16) | ((is.read() & 0xff) << 24);
        } else {
            length = (is.read() & 0xff) | ((is.read() & 0xff) << 8);
        }
        byte[] buf = new byte[length];
        int leftLen = length % KEY_LENGTH;
        if (leftLen != 0)
        {
            buf = new byte[length + (KEY_LENGTH - leftLen)];
        }
        is.read(buf);
        byte[] dataOver = changeData(buf, isImg);
        
        //过滤掉尾部的0
        buf = new byte[length];
        System.arraycopy(dataOver, 0, buf, 0, length);
        return buf;
    }
    
    public static String decryptText(String path)
    {   
        try
        {
            InputStream is = openFile(path);
            if(is == null) {
                return null;
            }
            is.skip(2);

            byte[] dataOver = decryptFile(is, false);
            
            if(testMd5(is, dataOver)) {
                return new String(dataOver, "UTF-8");
            }
        } catch (Exception e) {
            //#if PRINTDEBUG == 1
            e.printStackTrace();
            //#endif
        }
        return null;
    } 
    
    public static boolean testMd5(InputStream is, byte[] dataOver) throws IOException {
        byte[] md5Array = new byte[32];
        is.read(md5Array);
        String md5Str = new String(md5Array, "UTF-8");
        char[] c = md5Str.toCharArray();
        char cBuf = c[0];
        c[0] = c[c.length - 1];
        c[c.length - 1] = cBuf;
        md5Str = new String(c);
        return md5Str.equals(MD5.getInstance().encryptBytes(dataOver));
    } 
    
    public static byte[] decryptData(byte[] data) throws IOException {
        ByteArrayInputStream byteIn = new ByteArrayInputStream(data);
        DataInputStream dataIn = new DataInputStream(byteIn);
        byte[] dataOver = decryptFile(dataIn, false);
        
        return dataOver;
    }
    
    public static byte[] decryptDataWithMd5(byte[] data) throws IOException {
        ByteArrayInputStream byteIn = new ByteArrayInputStream(data);
        DataInputStream dataIn = new DataInputStream(byteIn);
        int dataLen = dataIn.readShort();
        byte[] dataOver = decryptFile(dataIn, false);
        
        return dataOver;
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //PNG颜色处理
    public static Image changePalette(byte[] imageArray, byte[] colorArray) {
        byte[] imageBuffer = new byte[imageArray.length];
        System.arraycopy(imageArray, 0, imageBuffer, 0, imageArray.length);
        //颜色索引
        int colorIndex = 0;
        //颜色个数
        int colorCount = 0;
        for (int index = 0; index < imageBuffer.length; index++) {
            if (imageBuffer[index] == 0x50 
                    && imageBuffer[index + 1] == 0x4c 
                    && imageBuffer[index + 2] == 0x54 
                    && imageBuffer[index + 3] == 0x45) {
                colorIndex = index + 4;
                colorCount = ((imageBuffer[index - 4] & 0xff) << 24) | ((imageBuffer[index - 4 + 1] & 0xff) << 16) | ((imageBuffer[index - 4 + 2] & 0xff) << 8) | ((imageBuffer[index - 4 + 3] & 0xff));
                break;
            }
        }
        for (int index = colorIndex; index < colorIndex + colorCount; index++) {
            imageBuffer[index] = colorArray[index - colorIndex];
        }
        byte[] colorData = new byte[4 + colorCount];
        for (int index = 0; index < colorCount + 4; index++) {
            colorData[index] = imageBuffer[colorIndex - 4 + index];
        }

        long crcValue = crc(colorData, colorData.length);
        int crc_idx = colorIndex + colorCount;
        imageBuffer[crc_idx] = (byte) ((crcValue & 0xFF000000) >> 24);
        imageBuffer[crc_idx + 1] = (byte) ((crcValue & 0x00FF0000) >> 16);
        imageBuffer[crc_idx + 2] = (byte) ((crcValue & 0x0000FF00) >> 8);
        imageBuffer[crc_idx + 3] = (byte) (crcValue & 0x000000FF);
        return Image.createImage(imageBuffer, 0, imageBuffer.length);
    }

    /**
     * CRC校验
     * @param buf
     * @param len
     * @return
     */
    private static long crc(byte[] buf, int len) {
        int n;
        int k;
        long c;
        if (crc_table_computed == 0) {
            for (n = 0; n < 256; n++) {
                c = (long) n;
                for (k = 0; k < 8; k++) {
                    if ((int) (c & 1) != 0) {
                        c = 0xedb88320L ^ (c >> 1);
                    } else {
                        c = c >> 1;
                    }
                }
                crc_table[n] = c;
            }
            crc_table_computed = 1;
        }

        c = 0xffffffffL;
        for (n = 0; n < len; n++) {
            c = (crc_table[(int) (c ^ buf[n]) & 0xff]) ^ (c >> 8);
        }

        return c ^ 0xffffffffL;
    }
    
    private static long[] crc_table = new long[256];
    private static int crc_table_computed = 0;
    ///////////////////////////////////////////////////////////////////////
    //IO
    public static byte[] readFully(InputStream dataIn) throws IOException {
        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        byte[] buf = new byte[10 * 1024];
        int readed = dataIn.read(buf);
        while(readed >= 0) {
            if(readed > 0) {
                byteOut.write(buf, 0, readed);
            }
            readed = dataIn.read(buf);
        }
        
        return byteOut.toByteArray();
    }
    
    public static byte[] readFully(String fileName){
        //#if PRINTDEBUG == 1
        System.out.println("fileName="+fileName);
        //#endif
        byte[] bytes = null;
        try
        {
            InputStream in = openFile(fileName);
            bytes = readFully(in);
            in.close();
            return bytes;
        }
        catch (Exception ex)
        {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
        return null;
    }
    
    /**
     * 先读入缓冲，然后再形成一个DataInputStream, 可以减少实际IO的次数
     * @param fileName
     * @return
     * @throws java.io.IOException
     */
    public static DataInputStream open(String fileName) throws IOException {
//        byte[] bytes = readFully(fileName);
//        DataInputStream dataIn = new DataInputStream(new ByteArrayInputStream(bytes));
        InputStream in = openFile(fileName);
        DataInputStream dataIn = new DataInputStream(in);
        return dataIn;
    }
    
    public static Image readImage(DataInputStream dataIn) throws IOException {
        int picLen = dataIn.readInt();
        byte[] picBytes = new byte[picLen];
        dataIn.readFully(picBytes);
        
        ByteArrayInputStream picIn = new ByteArrayInputStream(picBytes);
        Image img = Image.createImage(picIn);
        picIn.close();
        return img;
    }
    
    public static InputStream openFile(String fileName) throws IOException {
         if (fileName.startsWith("/"));
        {
            fileName = fileName.substring(1);
        }
        return Canvas.assertMgr.open(fileName);
//        return instance.getClass().getResourceAsStream(fileName);
    }

    
    /**
     * 根据某个字符切割字符串
     * @param str
     * @param c
     * @return
     */
    public static String[] getString(String str, char c)
    {
        if(str == null)
        {
            return null;
        }
        char[] buf = str.toCharArray();
        if(buf.length == 0)
        {
            return null;
        }
        int count = 0;
        for (int index = 0; index < buf.length; index++)
        {
            if(c == buf[index])
            {
                count ++;
            }
        }
        if (buf[buf.length - 1] != c)
        {
            count ++;
        }
        if(count == 0)
        {
            return null;
        }
        int Index = -1;
        String strOver[] = new String[count];
        for (int i = 0; i < strOver.length; i++)
        {
            int IndexStart = Index + 1;
            Index = str.indexOf(c, Index + 1);
            if(Index == -1)
            {
                strOver[i] = str.substring(IndexStart).trim();
            }
            else
            {
                strOver[i] = str.substring(IndexStart, Index).trim();
            }
        }
        return strOver;
    }     
    
    public static int getNumberSize(int num) {
        int numCnt = 0;
        if(num < 10) {
            numCnt = 1;
        } else if(num < 100) {
            numCnt = 2;
        } else if(num < 1000) {
            numCnt = 3;
        } else if(num < 10000) {
            numCnt = 4;
        } else if(num < 100000) {
            numCnt = 5;
        } else if(num < 1000000) {
            numCnt = 6;
        } else if(num < 10000000) {
            numCnt = 7;
        } else {
            numCnt = 10;
        }
        return numCnt;
    }
    
    public static void drawTriangle(Graphics g, int x1, int y1, int x2, int y2, int x3, int y3)
    {
        g.drawLine(x1, y1, x2, y2);
        g.drawLine(x1, y1, x3, y3);
        g.drawLine(x2, y2, x3, y3);
    } 
    
    public static void fillTriangle(Graphics g, int x1, int y1, int x2, int y2, int x3, int y3)
    {
        //#if NOKIAUI == 1
//#         drawTriangle(g, x1, y1, x2, y2, x3, y3);
        //#else
        g.fillTriangle(x1, y1, x2, y2, x3, y3);
        //#endif
    }

    /**
     * 字符串替换
     * @param data
     * @param key
     * @param value
     */
    static String replace(String data, String key, String value)
    {
        StringBuffer buffer = new StringBuffer();
        int startIndex = 0;
        int endIndex = data.indexOf(key);
        int valueLength = key.length();
        while(endIndex != -1)
        {
            buffer.append(data.substring(startIndex, endIndex));
            startIndex = endIndex + valueLength;
            endIndex = data.indexOf(key, startIndex);
            buffer.append(value);
        }
        buffer.append(data.substring(startIndex, data.length()));
        return buffer.toString();
    }

    public static float[] colorTrans = {//透明色
        //  R  G  B  A
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0.1f, 0
    };

    public static void setTransparentColor(Graphics g, boolean isTransparent) {
        if (isTransparent) {
            g.cm.set(colorTrans);
            g.paint.setColorFilter(new ColorMatrixColorFilter(g.cm));
            return;
        }
        g.paint.setColorFilter(null);
    }

    public static void fillColor(Graphics g , int color){
        g.canvas.drawColor(color);
    }
}
