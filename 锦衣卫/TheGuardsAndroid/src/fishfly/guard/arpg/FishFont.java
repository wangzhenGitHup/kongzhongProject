/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.util.Vector;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class FishFont {
    //字间距
    public static final int CHAR_MARGIN = 2;

    //行间距
    public static final int LINE_MARGIN = 5;

    //#if N5800
//#     //字体像素点大小
//#     public static final int FONT_SIZE = 16;
//#
//#     //字体高度
//#     public static final int FONT_HEIGHT = FONT_SIZE;
    //#else
    //字体像素点大小
//    public static final int FONT_SIZE = 12;
//
//    //字体高度
//    public static final int FONT_HEIGHT = 11;
    public static final int FONT_SIZE = 16;
    public static final int FONT_HEIGHT = FONT_SIZE;
    //#endif

    //行高
    public static final int LINE_HEIGHT = FONT_HEIGHT + LINE_MARGIN;

    public static final Font FONT_SMALL = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_SMALL);
//    public static final Font FONT_MEDIUM = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_MEDIUM);
//    public static final Font FONT_LARGE = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_LARGE);
    int chCnt;
    //中文宽高
    public int chineseWidth;
    public int chineseHeight;
    //每个中文字的位数
    int chineseBits;
    //中文需要的字节数
    int chineseBytes;

    //英文宽高
    int ascWidth;
    int ascHeight;

    //每个英文字的位数
    int ascBits;

    //英文需要的字节数
    int ascBytes;

    char[] chs;
    byte[] models;
    int[] offsets;

    //绘制带边文字的时候
    //上下左右绘制这几个字
    final int[] OFFSET_X = {
        1, 1, -1 , -1
    };

    final int[] OFFSET_Y = {
        1, -1, 1, -1
    };
    private static FishFont instance;

    int[] rgb;
    //字的透明度
    int alpha = 0xff;

    public static FishFont getInstance() {
        if(instance == null) {
            instance = new FishFont();
        }
        return instance;
    }

    //滚动条
    static Image scrollBarHead;
    static Image scrollBarMid;
    static Image scrollCursor;
    private FishFont() {
        //#if N7370
//#         load("/font_cut.dat");
        //#else
        load("/font.dat");
        //#endif
        rgb = new int[FONT_SIZE * FONT_SIZE];
        
        scrollBarHead = ImageManager.getInstance().getImage((short)151);
        scrollBarMid = ImageManager.getInstance().getImage((short)152);
        scrollCursor = ImageManager.getInstance().getImage((short)100);
    }

    public void init() {
    }

    public void resetAlpha() {
        alpha = 0xff;
    }

    /**
     * 获取每个字间距
     * @return
     */
    public int getWordWidth()
    {
        return chineseWidth + CHAR_MARGIN;
    }

    private void load(String fontPath) {
        try {
            DataInputStream dataIn = Util.open(fontPath);
            chCnt = dataIn.readShort();
            //#if PRINTDEBUG == 1
            System.out.println("字库中字的个数:" + chCnt);
            //#endif
            chs = new char[chCnt];

            offsets = new int[chCnt];
            chineseWidth = dataIn.read();
            chineseHeight = dataIn.read();
            chineseBits = chineseWidth * chineseHeight;
            chineseBytes = dataIn.readShort();

            ascWidth = dataIn.read();
            ascHeight = dataIn.read();
            ascBits = ascWidth * ascHeight;

            ascBytes = dataIn.readShort();
            byte[] datas = new byte[chCnt * chineseBytes];

            //忽略总长度
            dataIn.readInt();
            int offset = 0;

            for(int ich = 0; ich < chCnt; ich++) {
                chs[ich] = (char)dataIn.readShort();
                int modelSize = ascBytes;

                if(isChinese(chs[ich])) {
                    modelSize = chineseBytes;
                }
                try{
                dataIn.readFully(datas, offset, modelSize);
                }catch(Exception e)
                {

                }
                offsets[ich] = offset;
                offset += modelSize;
            }
            try
            {
                dataIn.close();
            }
            catch (Exception e)
            {
                //#if PRINTDEBUG == 1
                e.printStackTrace();
                //#endif
            }
            models = new byte[offset];
            System.arraycopy(datas, 0, models, 0, offset);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    private final boolean isChinese(char ch) {
        return ch > 127;
    }

    public void drawChars(Graphics g, char[] c, int offset, int length, int x, int y, int colorWord, int colorOther)
    {
        int charX = x;
        int charWidth = 0;
        g.setColor(colorWord);
        int color = colorWord;
        for (int index = offset, cnt = offset + length; index < cnt; index++)
        {
            char ch = c[index];
            if (ch == '{')
            {
                color = colorOther;
//                charX += charWidth(ch);
//                charWidth += charWidth(ch);
                continue;
            }
            if (ch == '}')
            {
                color = colorWord;
//                charX += charWidth(ch);
//                charWidth += charWidth(ch);
                continue;
            }
            g.setColor(color);
            drawChar(g, ch, charX, y);
            charX += charWidth(ch);
            charWidth += charWidth(ch);
        }
    }

    public void drawChars(Graphics g, char[] chs, int offset, int length, int x, int y) {
        int leftX = x;
        char ch = 0;
        for(int ich = 0; ich < length; ich++) {
            ch = chs[ich + offset];
            drawChar(g, ch, leftX, y);
            if(ch >= '0' && ch <= '9') {
                leftX += ascWidth + CHAR_MARGIN;
                continue;
            }

            if(isChinese(ch)) {
                leftX += chineseWidth + CHAR_MARGIN;
            } else {
                leftX += ascWidth + CHAR_MARGIN;
            }
        }
    }

    public void drawChars(Graphics g, char[] chs, int x, int y) {
        drawChars(g, chs, 0, chs.length, x, y);
    }

    public void drawCharsAlignCenter(Graphics g, char[] chs, int offset, int len, int centerx, int topY) {
        int strWidth = charsWidth(chs, offset, len);
        drawChars(g, chs, offset, len, centerx - (strWidth >> 1), topY);
    }

    public void drawCharsAlignCenter(Graphics g, char[] chs, int centerx, int topY) {
        int strWidth = charsWidth(chs);
        drawChars(g, chs, 0, chs.length, centerx - (strWidth >> 1), topY);
    }

    public int getCharsHeight(char[] chs, int width)
    {
        int wordWidth = 0;
        int wordY = 0;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|') {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
                continue;
            }
            if(ch == '{' || ch == '}')
            {
                continue;
            }

            int chWidth = charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
            }
            wordWidth += chWidth;
        }

        if (wordWidth > 0) {
            wordY += LINE_HEIGHT;
        }
        return wordY;
    }

    public int getCharsWithoutFontHeight(char[] chs, int width)
    {
        int wordWidth = 0;
        int wordY = 0;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if (ch == '&' || ch == '|' || ch == '\n') {
                wordWidth = 0;
                wordY += FONT_SMALL.getHeight();
                continue;
            }
            if(ch == '{' || ch == '}')
            {
                continue;
            }

            int chWidth = FONT_SMALL.charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += FONT_SMALL.getHeight();
            }
            wordWidth += chWidth;
        }

        return wordY + FONT_SMALL.getHeight();
    }

    private int offsetX = 0;
    private int offsetY = 0;
    private int offsetCount = 0;

    public void initOffset()
    {
        offsetX = 0;
        offsetY = 0;
        offsetCount = 0;
    }

    /**
     * 滚动字幕
     * @param g
     * @param chs
     * @param x
     * @param y
     * @param width
     * @param height
     * @param speed
     */
    public int drawCharsScollAlignLeft(Graphics g, char[] chs, int x, int y, int width, int height, int speed)
    {
        g.setClip(0, y, Page.SCREEN_WIDTH, height);
        int wordH = drawCharsAlignLeft(g, chs, x, y + offsetY, width);
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
        if (wordH <= height)
        {
            return wordH;
        }
        offsetY -= speed;
        if (offsetY <= -wordH)
        {
            offsetY = height;
        }
        return height;
    }

    public int drawCharsScollAlignLeft(Graphics g, char[] chs, int x, int y, int width, int height)
    {
        return drawCharsScollAlignLeft(g, chs, x, y, width, height, 1);
    }

    public int drawCharsAlignLeft(Graphics g, char[] chs, int x, int y, int width)
    {
        int wordWidth = 0;
        int wordX = x;
        int wordY = y;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|') {
                wordWidth = 0;
                wordX = x;
                wordY += LINE_HEIGHT;
                continue;
            }

            int chWidth = charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
                wordX = x;
            }
            drawChar(g, ch, wordX, wordY);
            wordWidth += chWidth;
            wordX += chWidth;
        }

        return wordY + LINE_HEIGHT - y;
    }

    private char[] curDrawChs;
    private Vector curDrawString;
    public int drawCharsAlignLeftWithoutFont(Graphics g, char[] chs, int x, int y, int width)
    {
        int wordWidth = 0;
        int wordX = x;
        int wordY = y;
        //#if N7370 || N7370small
//#         if(curDrawChs != chs)
//#         {
//#             curDrawChs = chs;
//#             curDrawString = new Vector();
//#             int curWidth = 0;
//#             StringBuffer str = new StringBuffer();
//#             for(int index = 0,cnt = chs.length; index < cnt; index++)
//#             {
//#                 char ch = chs[index];
//#                 if (ch == '&' || ch == '|')
//#                 {
//#                     curWidth = 0;
//#                     curDrawString.addElement(str.toString());
//#                     str = new StringBuffer();
//#                     continue;
//#                 }
//#
//#                 int chWidth = FONT_SMALL.charWidth(ch);
//#                 if (curWidth + chWidth > width)
//#                 {
//#                     curWidth = 0;
//#                     curDrawString.addElement(str.toString());
//#                     str = new StringBuffer();
//#                 }
//#                 str.append(ch);
//#                 curWidth += chWidth;
//#             }
//#             curDrawString.addElement(str.toString());
//#         }
//#         int clipX = g.getClipX();
//#         int clipY = g.getClipY();
//#         int clipWidth = g.getClipWidth();
//#         int clipHeight = g.getClipHeight();
//#
//#         for (int index = 0, cnt = curDrawString.size(); index < cnt; index++)
//#         {
//#             String s = (String) curDrawString.elementAt(index);
//#             if(wordY > clipY + clipHeight || wordY < clipY)
//#             {
//#                 wordY += FONT_SMALL.getHeight();
//#                 continue;
//#             }
//#             g.drawString(s, x, wordY, 0);
//#             wordY += FONT_SMALL.getHeight();
//#         }
//#         return wordY + FONT_SMALL.getHeight() - y;
        //#else
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|'|| ch == '\n') {
                wordWidth = 0;
                wordX = x;
                wordY += FONT_SMALL.getHeight();
                continue;
            }

            int chWidth = FONT_SMALL.charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += FONT_SMALL.getHeight();
                wordX = x;
            }
            g.drawChar(ch, wordX, wordY, 0);
            wordWidth += chWidth;
            wordX += chWidth;
        }

        return wordY + FONT_SMALL.getHeight() - y;
        //#endif
    }
    
    /**
     * 按一定宽度绘制并换行
     * @param g
     * @param chs
     * @param x
     * @param y
     * @param width
     * @return 绘制的高度
     */
    public int drawCharsAlignLeftWithoutFont(Graphics g, char[] chs, int x, int posY, int wordHeight, int y, int width, int clr, int borderClr, boolean  isH)
    {
        width -= 20;
        wordHeight = wordHeight / FONT_SMALL.getHeight() * FONT_SMALL.getHeight();
        g.setClip(0, posY, Page.SCREEN_WIDTH, wordHeight);
        int wordWidth = 0;
        int wordX = x;
        int wordY = y;
        //#if N7370
//#         g.setColor(clr);
//#         int height = drawCharsAlignLeftWithoutFont(g, chs, wordX, wordY, width);
//#         g.setClip(0, 0, MainCanvas.SCREEN_WIDTH, MainCanvas.SCREEN_HEIGHT);
//#         return height;
        //#else
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|'|| ch == '\n') {
                wordWidth = 0;
                wordX = x;
                wordY += FONT_SMALL.getHeight();
                continue;
            }

            int chWidth = FONT_SMALL.charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += FONT_SMALL.getHeight();
                wordX = x;
            }
            drawCharWithBorderWithoutFont(g, ch, wordX, wordY, clr, borderClr);
            wordWidth += chWidth;
            wordX += chWidth;
        }
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
        int height = wordY + FONT_SMALL.getHeight() - y;
        return height;
        //#endif
    }

    /**
     * 按一定宽度绘制并换行
     * @param g
     * @param chs
     * @param x
     * @param y
     * @param width
     * @return 绘制的高度
     */
    public int drawCharsAlignLeft(Graphics g, char[] chs, int x, int y, int width, int clr, int borderClr)
    {
        int wordWidth = 0;
        int wordX = x;
        int wordY = y;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|') {
                wordWidth = 0;
                wordX = x;
                wordY += LINE_HEIGHT;
                continue;
            }

            int chWidth = charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
                wordX = x;
            }
            drawCharWithBorder(g, ch, wordX, wordY, clr, borderClr);
            wordWidth += chWidth;
            wordX += chWidth;
        }

        return wordY + LINE_HEIGHT - y;
    }

    /**
     * 按一定宽度绘制并换行
     * @param g
     * @param chs
     * @param startX 从哪里开始画
     * @param x
     * @param y
     * @param width
     * @return 绘制的高度
     */
    public int drawCharsAlignLeftWithStartX(Graphics g, char[] chs, int startX, int x, int y, int width)
    {
        int wordX = startX;
        int wordY = y;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&') {
                wordX = x;
                wordY += LINE_HEIGHT;
                continue;
            }

            int chWidth = charWidth(ch);
            if((wordX - x) + chWidth > width)
            {
                wordY += LINE_HEIGHT;
                wordX = x;
            }

            drawChar(g, ch, wordX, wordY);
            wordX += chWidth;
        }

        return wordY + LINE_HEIGHT;
    }

    void drawTextWithBorder(Graphics g, char[] chs, int x, int y, int clr, int borderClr) {
        final int DIR = OFFSET_X.length;
        g.setColor(borderClr);
        for(int idir = 0; idir < DIR; idir++) {
            drawChars(g, chs, 0, chs.length, x + OFFSET_X[idir], y + OFFSET_Y[idir]);
        }

        g.setColor(clr);
        drawChars(g, chs, 0, chs.length, x, y);
    }

    void drawCharWithBorder(Graphics g, char ch, int x, int y, int clr, int borderClr) {
        final int DIR = OFFSET_X.length;
        g.setColor(borderClr);
        for(int idir = 0; idir < DIR; idir++) {
            drawChar(g, ch, x + OFFSET_X[idir], y + OFFSET_Y[idir]);
        }

        g.setColor(clr);
        drawChar(g, ch, x, y);
    }

    void drawCharWithBorderWithoutFont(Graphics g, char ch, int x, int y, int clr, int borderClr) {
        final int DIR = OFFSET_X.length;
        //#if !N7370
        if (borderClr >= 0) {
            g.setColor(borderClr);
            for(int idir = 0; idir < DIR; idir++) {
                g.drawChar(ch, x + OFFSET_X[idir], y + OFFSET_Y[idir], 0);
            }
        }
        //#endif

        g.setColor(clr);
        g.drawChar(ch, x, y, 0);
    }

    /**
     * 在特定的位置画特定的字
     * @param g
     * @param ch
     * @param x
     * @param y
     */
    //#if K790
//#     /**
//#      * 在特定的位置画特定的字
//#      * @param g
//#      * @param ch
//#      * @param x
//#      * @param y
//#      */
//#     public void drawChar(Graphics g, char ch, int x, int y) {
//#         int offset = getModel(ch);
//#         if(offset < 0) {
//#             g.drawChar(ch, x, y, Graphics.LEFT | Graphics.TOP);
//#             return;
//#         }
//#
//#         //开始绘制模型
//#         int chWidth = ascWidth;
//#
//#         int chBits = ascBits;
//#         int chSize = ascBytes;
//#         if(isChinese(ch)) {
//#             chWidth = chineseWidth;
//#             chBits = chineseBits;
//#             chSize = chineseBytes;
//#         }
//#
//#         //绘制点坐标
//#         int startX = 0;
//#         int offsetX = 0;
//#         int curX = 0;
//#         int py = y;
//#
//#         boolean startLine = false;
//#         int totalBits = 0;
//#
//#         for(int ibyte = 0; ibyte < chSize; ibyte++) {
//#             //当前字节放入一个整数中
//#             int curByte = models[offset + ibyte] & 0xFF;
//#             if (curByte == 0)
//#             {
//#                 if(startLine) {
//#                     //上一个点是该画的点
//#                     g.drawLine(startX + x, py, startX + offsetX + x, py);
//#                     startLine = false;
//#                     offsetX = 0;
//#                 }
//#
//#                 curX += 8;
//#                 totalBits += 8;
//#                 while (curX >= chWidth)
//#                 {
//#                     curX -= chWidth;
//#                     py++;
//#                 }
//#
//#                 continue;
//#             }
//#             //依次查看每一位
//#             for(int ibit = 7; ibit >= 0; ibit--) {
//#                 //绘制结束
//#                 totalBits++;
//#                 if(totalBits > chBits) {
//#                     if(startLine) {
//#                         g.drawLine(startX + x, py, startX + offsetX + x, py);
//#                     }
//#                     return;
//#                 }
//#                 curX++;
//#
//#                 boolean bitFlag = ((curByte >> ibit) & 0x01) != 0;
//#                 if(bitFlag) {
//#                     //是一个点
//#                     //如果已经开始一行
//#                     if(startLine) {
//#                         offsetX++;
//#                         int endX = startX + offsetX;
//#
//#                         if(curX == chWidth) {
//#                             //该换行了
//#                             g.drawLine(startX + x, py, endX + x, py);
//#                             startX = 0;
//#                             offsetX = 0;
//#                             startLine = false;
//#                             py++;
//#                             curX = 0;
//#                         }
//#                         continue;
//#                     }
//#                     startLine = true;
//#                     startX = curX - 1;
//#                     offsetX = 0;
//#                     if(curX == chWidth) {
//#                         //需要换行
//#                         g.drawLine(startX + x, py, startX + x, py);
//#                         startLine = false;
//#                         py++;
//#                         curX = 0;
//#                     }
//#                     continue;
//#                 }
//#
//#                 //不是该画的点
//#                 if(startLine) {
//#                     //上一个点是该画的点
//#                     g.drawLine(startX + x, py, startX + offsetX + x, py);
//#                     startLine = false;
//#                     offsetX = 0;
//#                 }
//#
//#                 //如果是最后一个点
//#                 if(curX == chWidth) {
//#                     py++;
//#                     curX = 0;
//#                 }
//#             }
//#         }
//#     }
    //#else
    public void drawChar(Graphics g, char ch, int x, int y) {
        if(ch == ' ') {
            return;
        }
        int offset = getModel(ch);
        if(offset < 0) {
            g.drawChar(ch, x, y, Graphics.LEFT | Graphics.TOP);
            return;
        }

        //开始绘制模型
        int chWidth = ascWidth;
        int chSize = ascBytes;
        if(isChinese(ch)) {
            chWidth = chineseWidth;
            chSize = chineseBytes;
        }

        int clr = g.getColor() | (alpha << 24);
        int curX = 0;
        int lineStart = 0;
        //数据区的索引
        int irgb = 0;
        for(int ibyte = 0; ibyte < chSize; ibyte++) {
            //当前字节放入一个整数中
            int curByte = models[offset + ibyte] & 0xFF;
            //依次查看每一位
            for(int ibit = 7; ibit >= 0; ibit--) {
                boolean bitFlag = ((curByte >> ibit) & 0x01) != 0;
                if(bitFlag) {
                    rgb[irgb] = clr;
                } else {
                    //全透明
                    rgb[irgb] = 0x00ffffff;
                }
                irgb++;
                curX++;
                if(curX >= chWidth) {
                    curX = 0;
                    //光标直接跳到下一行
                    lineStart += FONT_SIZE;
                    for(int i = irgb; i < lineStart; i++) {
                        rgb[i] = 0x00ffffff;
                    }
                    irgb = lineStart;
                }
            }
        }

        Util.drawRGB(g, rgb, 0, FONT_SIZE, x, y, FONT_SIZE, FONT_SIZE, true);
    }
     //#endif

    public int charWidth(char ch) {
        if(isChinese(ch)) {
            return chineseWidth + CHAR_MARGIN;
        }
        switch(ch) {
            case '\\':
            case '+':
                return 6;
        }
        return ascWidth + CHAR_MARGIN;
    }

    public void drawChars(Graphics g, char[] chars, int x, int y, int pos)
    {
        int wordWidth = charsWidth(chars, 0, chars.length);
        switch(pos)
        {
            case Graphics.LEFT | Graphics.BOTTOM:
                y -= getHeight();
                break;
            case Graphics.HCENTER | Graphics.TOP:
                x -= wordWidth >> 1;
                break;
            case Graphics.HCENTER | Graphics.BOTTOM:
                x -= wordWidth >> 1;
                y -= getHeight();
                break;
            case Graphics.RIGHT | Graphics.TOP:
                x -= wordWidth;
                break;
            case Graphics.RIGHT | Graphics.BOTTOM:
                x -= wordWidth;
                y -= getHeight();
                break;
        }
        drawChars(g, chars, 0, chars.length, x, y);
    }

    public void drawString(Graphics g, String str, int x, int y, int pos, int colorIn, int colorOut)
    {
        char[] c = str.toCharArray();
        int wordWidth = charsWidth(str.toCharArray(), 0, c.length);
        switch(pos)
        {
            case Graphics.LEFT | Graphics.BOTTOM:
                y -= getHeight();
                break;
            case Graphics.HCENTER | Graphics.TOP:
                x -= wordWidth >> 1;
                break;
            case Graphics.HCENTER | Graphics.BOTTOM:
                x -= wordWidth >> 1;
                y -= getHeight();
                break;
            case Graphics.RIGHT | Graphics.TOP:
                x -= wordWidth;
                break;
            case Graphics.RIGHT | Graphics.BOTTOM:
                x -= wordWidth;
                y -= getHeight();
                break;
        }
        drawTextWithBorder(g, c, x, y, colorIn, colorOut);
    }

    public void drawString(Graphics g, String str, int x, int y, int pos)
    {
        char[] c = str.toCharArray();
        int wordWidth = charsWidth(str.toCharArray(), 0, c.length);
        switch(pos)
        {
            case Graphics.LEFT | Graphics.BOTTOM:
                y -= getHeight();
                break;
            case Graphics.HCENTER | Graphics.TOP:
                x -= wordWidth >> 1;
                break;
            case Graphics.HCENTER | Graphics.BOTTOM:
                x -= wordWidth >> 1;
                y -= getHeight();
                break;
            case Graphics.RIGHT | Graphics.TOP:
                x -= wordWidth;
                break;
            case Graphics.RIGHT | Graphics.BOTTOM:
                x -= wordWidth;
                y -= getHeight();
                break;
        }
        drawChars(g, c, 0, c.length, x, y);
    }

    public int charsWidth(String s)
    {
        char[] c = s.toCharArray();
        return charsWidth(c, 0, c.length);
    }

    public int charsWidth(char[] chs) {
        return charsWidth(chs, 0, chs.length);
    }

    public int charsWidth(char[] chs, int offset, int length) {
        int totalWidth = 0;
        for(int ich = 0; ich < length; ich++) {
            char ch = chs[ich + offset];
            if (ch == '{' || ch == '}')
            {
                continue;
            }
            int chWidth = CHAR_MARGIN;
            if(ch > 127) {
                chWidth += chineseWidth;
            } else {
                chWidth += ascWidth;
            }
            totalWidth += chWidth;
        }
        return totalWidth;
    }

    private int getModel(char ch) {
        int start = 0;
        int end = chCnt - 1;

        while(start <= end) {
            if(chs[start] == ch) {
                return offsets[start];
            }

            if(chs[end] == ch) {
                return offsets[end];
            }

            int mid = (start + end) >> 1;
            if(chs[mid] == ch) {
                return offsets[mid];
            }

            if(chs[mid] > ch) {
                start = start + 1;
                end = mid - 1;
                continue;
            }

            start = mid + 1;
            end = end - 1;
        }

        return -1;
    }

    public int getHeight() {
        return LINE_HEIGHT;
    }

    public int getCharHeight(char ch) {
        return isChinese(ch) ? chineseHeight : ascHeight;
    }

    public void drawNumberAlignLeft(Graphics g, int num, int leftX, int topY) {
        int numCnt = Util.getNumberSize(num);
        drawNumberAlignRight(g, num, leftX + numCnt * 6, topY);
    }

    public void drawNumberAlignH(Graphics g, int num, int leftX, int topY) {
        int numCnt = Util.getNumberSize(num);
        drawNumberAlignRight(g, num, leftX + numCnt * 3, topY);
    }

    public void drawNumberAlignRight(Graphics g, int num, int rightX, int topY) {
        int inum = 0;
        int x = rightX - ascWidth;
        if(num == 0) {
            drawChar(g, '0', x, topY);
            return;
        }

        for(int tmp = num; tmp != 0; inum++) {
            int reminder = tmp % 10;
            char ch = (char)('0' + reminder);
            drawChar(g, ch, x, topY);

            tmp /= 10;
            x -= ascWidth;
        }
    }

    /**
     *
     * @param g 画笔
     * @param c 字符数组
     * @param startIndex 开始索引
     * @param length 渲染长度
     * @param width 可以渲染的宽度
     * @param height 可以渲染的高度
     * @param x 渲染的起始X坐标
     * @param y 渲染的起始Y坐标
     * @param colorWord 字的颜色
     * @param colorOther 特殊字颜色
     * @param BORDER_CLR 字描边
     * @param eachWidth 每个字再加多少富余
     * @return
     */
    public int drawTxtWithColor(Graphics g, char[] c, int startIndex, int length, int width, int height, int x, int y, int colorWord, int colorOther, int BORDER_CLR, int eachWidth)
    {
        return drawTxtWithColor(g, c, startIndex, length, width, height, x, y, colorWord, colorOther, BORDER_CLR, eachWidth, LINE_HEIGHT);
    }

    public int drawTxtWithColor(Graphics g, char[] c, int startIndex, int length, int width, int height, int x, int y, int colorWord, int colorOther, int BORDER_CLR, int eachWidth, int eachHeight)
    {
        int color = colorWord;
        for(int index = startIndex; index >= 0; index--)
        {
            char ch = c[index];
            if(ch == '{')
            {
                color = colorOther;
                break;
            }
            if(ch == '}')
            {
                color = colorWord;
                break;
            }
        }
        int charX = x;
        int charY = y;
        int charWidth = 0;
        g.setColor(colorWord);
        for (int index = startIndex, cnt = startIndex + length; index <= cnt; index++)
        {
            if(index >= c.length)
            {
                return index;
            }
            char ch = c[index];
            if(ch == '&')
            {
                charY += eachHeight;
                charX = x;
                charWidth = 0;
                continue;
            }
            if(ch == '{')
            {
                color = colorOther;
                continue;
            }
            if(ch == '}')
            {
                color = colorWord;
                continue;
            }
            if(ch == '$')
            {
                return index;
            }
            g.setColor(color);
            if(charWidth + charWidth(ch) + eachWidth > width)
            {
                charY += eachHeight;
                charX = x;
                charWidth = 0;
            }
            //如果超过高度了就不渲染了啊
            if(charY - y > height)
            {
                return index;
            }
            if(BORDER_CLR < 0)
            {
                drawChar(g, ch, charX, charY);
            }
            else
            {
                drawCharWithBorder(g, ch, charX, charY, color, BORDER_CLR);
            }
            charX += charWidth(ch) + eachWidth;
            charWidth += charWidth(ch) + eachWidth;
        }
        return charY - y;
    }

    public int getCharsHeightWithDifferentColor(char[] chs, int width)
    {
        int wordWidth = 0;
        int wordY = 0;
        for(int index = 0; index < chs.length; index++)
        {
            char ch = chs[index];
            if(ch == '&' || ch == '|') {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
                continue;
            }
            if(ch == '{')
            {
                final int LENGTH = 8;
                index += LENGTH;
                continue;
            }
            if(ch == '}')
            {
                continue;
            }

            int chWidth = charWidth(ch);
            if(wordWidth + chWidth > width)
            {
                wordWidth = 0;
                wordY += LINE_HEIGHT;
            }
            wordWidth += chWidth;
        }

        if (wordWidth > 0) {
            wordY += LINE_HEIGHT;
        }
        return wordY;
    }

    /**
     * 渲染文字，使用不同的颜色
     * @param g
     * @param c
     * @param width
     * @param x
     * @param y
     * @param colorWord
     * @return
     */
    public int drawTxtWithDifferentColor(Graphics g, char[] c,int x, int y, int width, int colorWord)
    {
        //#if N7370
//#         final int fontHeight = FONT_SMALL.getHeight();
//#         final int charCntOnceLen = (width / FONT_SMALL.charWidth(',')) + 1;
//#         char[] tempChar = new char[charCntOnceLen];
//#         int tempCharCnt = 0;
//#         int tempCharX = x;
        //#else
        final int fontHeight = LINE_HEIGHT;
        //#endif
        int charX = x;
        int charY = y;
        int charWidth = 0;
        g.setColor(colorWord);
        int color = colorWord;
        for (int index = 0, cnt = c.length; index < cnt; index++)
        {
            char ch = c[index];
            if(ch == '&' || ch == '|')
            {
                //#if N7370
//#                 g.setColor(color);
//#                 g.drawChars(tempChar, 0, tempCharCnt, tempCharX, charY, 0);
//#                 tempCharCnt = 0;
//#                 tempCharX = x;
                //#endif
                charY += fontHeight;
                charX = x;
                charWidth = 0;
                continue;
            }
            if(ch == '{')
            {
                final int LENGTH = 8;
                StringBuffer s = new StringBuffer();
                s.append(c, index + 3, LENGTH - 2);
                color = Integer.parseInt(s.toString(), 16);
                index += LENGTH;
                continue;
            }
            if(ch == '}')
            {
                //#if N7370
//#                 g.setColor(color);
//#                 g.drawChars(tempChar, 0, tempCharCnt, tempCharX, charY, 0);
//#                 tempCharCnt = 0;
//#                 tempCharX = charX;
                //#endif
                color = colorWord;
                continue;
            }
            //#if N7370
//#             if(charWidth + FONT_SMALL.charWidth(ch) > width)
//#             {
//#                 g.setColor(color);
//#                 g.drawChars(tempChar, 0, tempCharCnt, tempCharX, charY, 0);
//#                 tempCharCnt = 0;
//#                 tempCharX = x;
//#
//#                 charY += fontHeight;
//#                 charX = x;
//#                 charWidth = 0;
//#             }
//#             tempChar[tempCharCnt] = ch;
//#             tempCharCnt++;
//#             charX += FONT_SMALL.charWidth(ch);
//#             charWidth += FONT_SMALL.charWidth(ch);
            //#else
            g.setColor(color);
            if(charWidth + charWidth(ch) > width)
            {
                charY += fontHeight;
                charX = x;
                charWidth = 0;
            }
            drawChar(g, ch, charX, charY);
            charX += charWidth(ch);
            charWidth += charWidth(ch);
            //#endif
        }
        return charY - y + fontHeight;
    }

    public int drawTxtWithDifferentColor(Graphics g, char[] c, int x, int y, int width, int height, int colorWord, int speed) {
        g.setClip(0, y, Page.SCREEN_WIDTH, height);
        int wordH = drawTxtWithDifferentColor(g, c, x, y + offsetY, width, colorWord);
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
        if (wordH <= height)
        {
            return wordH;
        }
        offsetCount++;
        if (offsetCount > 15) {
            offsetY -= speed;
            if (offsetY <= -wordH)
            {
                offsetY = height;
            }
        }
        return height;
    }

    public int drawTxtWithDifferentColor(Graphics g, char[] c, int x, int y, int width, int height, int colorWord) {
        return drawTxtWithDifferentColor(g, c, x, y, width, height, colorWord, 1);
    }

    /**
     * 简单说下思路不然一会忘了
     * 先将字符串或者字符数组按照宽度和换行标示&切分成一个字符串数组
     * @param g 画笔
     * @param c 字符数组
     * @param width 可以渲染的宽度
     * @param x 渲染起始X坐标
     * @param y 渲染起始Y坐标
     * @param colorWord 字的颜色
     * @param colorOther 特殊字的颜色
     * @param BORDER_CLR 字描边的颜色
     * @return
     */
    public int drawTxtWithColor(Graphics g, char[] c, int width, int x, int y, int colorWord, int colorOther, int BORDER_CLR)
    {
        int charX = x;
        int charY = y;
        int charWidth = 0;
        g.setColor(colorWord);
        int color = colorWord;
        for (int index = 0, cnt = c.length; index < cnt; index++)
        {
            char ch = c[index];
            if(ch == '&' || ch == '|')
            {
                charY += LINE_HEIGHT;
                charX = x;
                charWidth = 0;
                continue;
            }
            if(ch == '{')
            {
                color = colorOther;
                continue;
            }
            if(ch == '}')
            {
                color = colorWord;
                continue;
            }
            g.setColor(color);
            if(charWidth + charWidth(ch) > width)
            {
                charY += LINE_HEIGHT;
                charX = x;
                charWidth = 0;
            }
            if(BORDER_CLR < 0)
            {
                drawChar(g, ch, charX, charY);
            }
            else
            {
                drawCharWithBorder(g, ch, charX, charY, color, BORDER_CLR);
            }
            charX += charWidth(ch);
            charWidth += charWidth(ch);
        }
        return charY - y;
    }

    public int drawTxtWithColorWithoutFont(Graphics g, char[] c, int startIndex, int length, int width, int height, int x, int y, int colorWord, int colorOther, int BORDER_CLR, int eachWidth)
    {
        int color = colorWord;
        for(int index = startIndex; index >= 0; index--)
        {
            char ch = c[index];
            if(ch == '{')
            {
                color = colorOther;
                break;
            }
            if(ch == '}')
            {
                color = colorWord;
                break;
            }
        }
        int charX = x;
        int charY = y;
        int charWidth = 0;
        g.setColor(colorWord);
        for (int index = startIndex, cnt = startIndex + length; index <= cnt; index++)
        {
            if(index >= c.length)
            {
                return index;
            }
            char ch = c[index];
            if(ch == '&')
            {
                charY += FishFont.FONT_SMALL.getHeight();
                charX = x;
                charWidth = 0;
                continue;
            }
            if(ch == '{')
            {
                color = colorOther;
                continue;
            }
            if(ch == '}')
            {
                color = colorWord;
                continue;
            }
            if(ch == '$')
            {
                return index;
            }
            g.setColor(color);
            if(charWidth + FishFont.FONT_SMALL.charWidth(ch) + eachWidth > width)
            {
                charY += FishFont.FONT_SMALL.getHeight();
                charX = x;
                charWidth = 0;
            }
            //如果超过高度了就不渲染了啊
            if(height != 0 && charY - y >= height)
            {
                return index;
            }
            if(BORDER_CLR < 0)
            {
                g.drawChar(ch, charX, charY, 0);
            }
            else
            {
                drawCharWithBorderWithoutFont(g, ch, charX, charY, color, BORDER_CLR);
            }
            charX += FishFont.FONT_SMALL.charWidth(ch) + eachWidth;
            charWidth += FishFont.FONT_SMALL.charWidth(ch) + eachWidth;
        }
        return charY - y;
    }

    public void drawSelectTalkLine(Graphics g, char[] c, int x, int y, int width, int height, int colorWord, int colorOther, int BORDER_CLR, int eachWidth)
    {
        int wordWidth = charsWidth(c);
        if(wordWidth < width)
        {
            drawTxtWithColor(g, c, 0, c.length, width, height, x, y, colorWord, colorOther, BORDER_CLR, eachWidth);
            return;
        }
        g.setClip(x, y - 2, width, height + 4);
        drawTxtWithColor(g, c, 0, c.length, width + offsetX, height, x - offsetX, y, colorWord, colorOther, BORDER_CLR, eachWidth);
        offsetCount++;
        if(offsetCount < 10)
        {
            g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
            return;
        }
        offsetX += 3;
        if(offsetX >= wordWidth)
        {
            offsetX = -(x + (width >> 1));
        }
        g.setClip(0, 0, Page.SCREEN_WIDTH, Page.SCREEN_HEIGHT);
    }



    /**
     * 绘制滚动条
     * @param g
     * @param x
     * @param y
     * @param len
     * @param curPos
     */
    public static void drawScrollBar(Graphics g, int x, int y, int height, int curCount, int maxCount) {
        final int BAR_W = scrollBarHead.getWidth();
        final int BAR_HEAD_H = scrollBarHead.getHeight();
        final int BAR_MID_H = scrollBarMid.getHeight();
        if (height > BAR_HEAD_H << 1) {
            int barMidCnt = (height - (BAR_HEAD_H << 1)) / BAR_MID_H;
            for (int index = 0; index < barMidCnt; index++) {
                g.drawImage(scrollBarMid, x, y + BAR_HEAD_H + BAR_MID_H * index, 0);
            }
            if (barMidCnt * BAR_MID_H + (BAR_HEAD_H << 1) < height) {
                g.drawImage(scrollBarMid, x, y + height - BAR_HEAD_H, Graphics.LEFT | Graphics.BOTTOM);
            }
        }
        g.drawImage(scrollBarHead, x, y, 0);
        Util.drawRegion(g, scrollBarHead, 0, 0, BAR_W, BAR_HEAD_H, Sprite.TRANS_ROT180, x, y + height, Graphics.LEFT | Graphics.BOTTOM);

        if (maxCount == 0) {
            return;
        }
        final int CURSOR_W = scrollCursor.getWidth();
        final int CURSOR_H = scrollCursor.getHeight();
        final int CURSOR_H_DIS = 4;
        final int CURSOR_X = x + (BAR_W >> 1);
        int cursorY = curCount * (height - CURSOR_H - CURSOR_H_DIS) / maxCount;
        cursorY += y;
        g.drawImage(scrollCursor, CURSOR_X, cursorY, Graphics.RIGHT | Graphics.TOP);
        Util.drawRegion(g, scrollCursor, 0, 0, CURSOR_W, CURSOR_H, Sprite.TRANS_MIRROR, CURSOR_X, cursorY, 0);
    }
}
