package javax.microedition.lcdui;

import javax.microedition.lcdui.game.Sprite;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Region;
import android.graphics.Region.Op;
import fishfly.guard.arpg.GameContext;

public final class Graphics {

    public static final int HCENTER = 1;
    public static final int VCENTER = 2;
    public static final int LEFT = 4;
    public static final int RIGHT = 8;
    public static final int TOP = 16;
    public static final int BOTTOM = 32;
    public static final int BASELINE = 64;
//    public ColorMatrix cm = new ColorMatrix();
    public ColorMatrix cm = new ColorMatrix();;
    public Canvas canvas = null;
    public Paint paint = null;
    //一些中间变量
    RectF rect = null;
    Path path = null;
    Matrix mat = null;
    float vals[] = null;
    char txt[] = null;
    private int WIDTH;
    private int HEIGHT;

    public static final float[] COLOR_RED = {
        //  R  G  B  A
        1, 0, 0, 0, 200,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    };

    public static final float[] COLOR_GREEN = {
        //  R  G  B  A
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 50,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    };

    public static final float[] COLOR_BLUE = {
        //  R  G  B  A
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 200,
        0, 0, 0, 1, 0
    };
    
    private static final float ROT90_MAT[] = {
        0, -1, 0,
        1, 0, 0,
        0, 0, 1
    };
    private static final float ROT180_MAT[] = {
        -1, 0, 0,
        0, -1, 0,
        0, 0, 1
    };
    private static final float ROT270_MAT[] = {
        0, 1, 0,
        -1, 0, 0,
        0, 0, 1
    };
    private static final float[] MIRROR_MAT = {
        -1, 0, 0,
        0, 1, 0,
        0, 0, 1
    };
    private static final float[] MIRROR_ROT90_MAT = {
        0, -1, 0,
        -1, 0, 0,
        0, 0, 1
    };
    private static final float[] MIRROR_ROT180_MAT = {
        1, 0, 0,
        0, -1, 0,
        0, 0, 1
    };
    private static final float[] MIRROR_ROT270_MAT = {
        0, 1, 0,
        1, 0, 0,
        0, 0, 1
    };

    public Graphics(Canvas canvas) {
        this.canvas = canvas;
        paint = new Paint();
        if(canvas != null)
        {
            WIDTH = canvas.getWidth();
            HEIGHT = canvas.getHeight();
        }
        //缺省设置白色为颜色
        paint.setColor(0xFFFFFFFF);
        paint.setAntiAlias(true);
        rect = new RectF();
        path = new Path();
        mat = new Matrix();
        mat.reset();
        vals = new float[9];
        txt = new char[1];
        setFont(FONT_SMALL);
    }

    private static final Font FONT_SMALL = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_PLAIN, Font.SIZE_SMALL);

    public void setCanvas(Canvas canvas)
    {
        this.canvas = canvas;
        if(canvas != null)
        {
            WIDTH = canvas.getWidth();
            HEIGHT = canvas.getHeight();
        }
    }

    public void drawImage(Image img, int x, int y, int achor, float[] colorMatrix) {
        cm.set(colorMatrix);
        paint.setColorFilter(new ColorMatrixColorFilter(cm));
        drawImage(img, x, y, achor);
        paint.setColorFilter(null);
    }

    public void drawImage(Image img, int x, int y, int anchor) {
        if ((anchor & BOTTOM) != 0) {
            y -= img.getHeight();
        }
        if ((anchor & RIGHT) != 0) {
            x -= img.getWidth();
        }
        if ((anchor & HCENTER) != 0) {
            x -= img.getWidth() >> 1;
        }
        if ((anchor & VCENTER) != 0) {
            y -= img.getHeight() >> 1;
        }
        canvas.drawBitmap(img.bmp, x, y, paint);
    }

    public void drawBitmap(Bitmap bmp, int x, int y) {
        canvas.drawBitmap(bmp, x, y, paint);
    }

    public void setColor(int clr) {
        paint.setColor(clr | 0xFF000000);
    }

    public void drawLine(int x1, int y1, int x2, int y2) {
        canvas.drawLine(x1, y1, x2, y2, paint);
    }

    public void fillRect(int x, int y, int w, int h) {
        paint.setStyle(Paint.Style.FILL);
        canvas.drawRect(x, y, x + w, y + h, paint);
        paint.setStyle(Paint.Style.STROKE);
    }

    public void drawRect(int x, int y, int w, int h) {
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawRect(x, y, x + w, y + h, paint);
    }

    public void drawRoundRect(int x, int y, int width, int height, int rx, int ry) {
        rect.left = x;
        rect.top = y;
        rect.right = x + width;
        rect.bottom = y + height;
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawRoundRect(rect, rx, ry, paint);
    }

    public void fillRoundRect(int x, int y, int width, int height, int rx, int ry) {
        rect.left = x;
        rect.top = y;
        rect.right = x + width;
        rect.bottom = y + height;
        paint.setStyle(Paint.Style.FILL);
        canvas.drawRoundRect(rect, rx, ry, paint);
        paint.setStyle(Paint.Style.STROKE);
    }

    public void drawArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        rect.left = x;
        rect.top = y;
        rect.right = x + width;
        rect.bottom = y + height;
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawArc(rect, startAngle, arcAngle, true, paint);
    }

    public void fillArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        rect.left = x;
        rect.top = y;
        rect.right = x + width;
        rect.bottom = y + height;
        paint.setStyle(Paint.Style.FILL);
        canvas.drawArc(rect, startAngle, arcAngle, true, paint);
        paint.setStyle(Paint.Style.STROKE);
    }

    public void fillTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
        path.reset();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        path.lineTo(x3, y3);
        path.lineTo(x1, y1);

        paint.setStyle(Paint.Style.FILL);
        canvas.drawPath(path, paint);
        paint.setStyle(Paint.Style.STROKE);
    }

    public void setClip(int x, int y, int width, int height) {
        canvas.clipRect(x, y, x + width, y + height, Op.REPLACE);
    }

    public void resetClip()
    {
        canvas.clipRect(0, 0, WIDTH, HEIGHT, Op.REPLACE);
    }

    public void translate(int x, int y) {
        canvas.translate(x, y);
    }

    public void setFont(Font font) {
        paint.setTypeface(font.p.getTypeface());
        paint.setTextSize(font.size);
    }

    public void drawChar(char ch, int x, int y, int anchor) {
        txt[0] = ch;
        canvas.drawText(txt, 0, 1, x, y + paint.getTextSize(), paint);
    }

    public void drawChars(char[] data, int offset, int length, int x, int y, int anchor) {
        canvas.drawText(data, offset, length, x, y + paint.getTextSize(), paint);
    }

    //去掉透明色
    public int getColor() {
        return paint.getColor() & 0xFFFFFF;
    }

    public int getTranslateX() {
        mat.reset();
        canvas.getMatrix(mat);
        mat.getValues(vals);
        return (int) vals[Matrix.MTRANS_X];
    }

    public int getTranslateY() {
        mat.reset();
        canvas.getMatrix(mat);
        mat.getValues(vals);
        return (int) vals[Matrix.MTRANS_Y];
    }

    public void drawString(String str, int x, int y, int anchor) {
        //支持Anchor
        if ((anchor & VCENTER) != 0) {
            y -= (paint.getTextSize() / 2);
        } else if ((anchor & BOTTOM) != 0) {
            y -= paint.getTextSize();
        }

        if ((anchor & RIGHT) != 0) {
            x -= (paint.measureText(str));
        } else if ((anchor & HCENTER) != 0) {
            x -= (paint.measureText(str) / 2);
        }
        canvas.drawText(str, x, y, paint);
    }

    public void drawRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height, boolean processAlpha) {
        canvas.drawBitmap(rgbData, offset, scanlength, x, y, width, height, processAlpha, paint);
    }

    public void drawRegion(Image img, int x_src, int y_src, int w_src,
            int h_src, int transform, int x_dest, int y_dest, int anchor) {
        int dst_w = 0;
        int dst_h = 0;

        if (w_src <= 0 || h_src <= 0) {
            return;
        }

        dst_w = w_src;
        dst_h = h_src;
        if (transform == Sprite.TRANS_MIRROR_ROT270
                || transform == Sprite.TRANS_MIRROR_ROT90
                || transform == Sprite.TRANS_ROT90
                || transform == Sprite.TRANS_ROT270) {
            dst_w = h_src;
            dst_h = w_src;
        }

        //支持Anchor
        if ((anchor & VCENTER) != 0) {
            y_dest -= dst_h >> 1;
        } else if ((anchor & BOTTOM) != 0) {
            y_dest -= dst_h;
        }

        if ((anchor & RIGHT) != 0) {
            x_dest -= dst_w;
        } else if ((anchor & HCENTER) != 0) {
            x_dest -= dst_w >> 1;
        }
        if (transform == Sprite.TRANS_NONE) {
            drawClipImage(img, x_dest, y_dest, x_src, y_src, w_src, h_src);
            return;
        }
        mat.reset();
        canvas.save();

        switch (transform) {
            case Sprite.TRANS_NONE:
                mat.setTranslate(x_dest - x_src, y_dest - y_src);
                break;

            case Sprite.TRANS_ROT90:
                mat.setValues(ROT90_MAT);
                mat.postTranslate(x_dest + y_src + h_src, y_dest - x_src);
                break;

            case Sprite.TRANS_ROT180:
                mat.setValues(ROT180_MAT);
                mat.postTranslate(x_dest + x_src + w_src, y_dest + y_src + h_src);
                break;

            case Sprite.TRANS_ROT270:
                mat.setValues(ROT270_MAT);
                mat.postTranslate(x_dest - y_src, y_dest + x_src + w_src);
                break;

            case Sprite.TRANS_MIRROR:
                mat.setValues(MIRROR_MAT);
                mat.postTranslate(x_dest + x_src + w_src, y_dest - y_src);
                break;

            case Sprite.TRANS_MIRROR_ROT90:
                mat.setValues(MIRROR_ROT90_MAT);
                mat.postTranslate(x_dest + y_src + h_src, y_dest + x_src + w_src);
                break;

            case Sprite.TRANS_MIRROR_ROT180:
                mat.setValues(MIRROR_ROT180_MAT);
                mat.postTranslate(x_dest - x_src, y_dest + y_src + h_src);
                break;

            case Sprite.TRANS_MIRROR_ROT270:
                mat.setValues(MIRROR_ROT270_MAT);
                mat.postTranslate(x_dest - y_src, y_dest - x_src);
                break;
        }
        //测试用
//	    int oldClr = getColor();
//	    setColor(0);
//	    fillRect(x_dest - 1, y_dest - 1, dst_w + 2, dst_h + 2);
//	    setColor(oldClr);

        canvas.clipRect(x_dest, y_dest, x_dest + dst_w, y_dest + dst_h, Region.Op.REPLACE);
        canvas.drawBitmap(img.bmp, mat, paint);
        canvas.restore();
    }

    ///////////////////////////////////////////////////////////////////////////
    //绘制相关
    public void drawClipImage(
            Image image,
            int x,
            int y,
            int clip_x,
            int clip_y,
            int width,
            int height) {
	setClip(x, y, width, height);
        canvas.clipRect(x, y, x + width, y + height);
        canvas.drawBitmap(image.bmp, x - clip_x, y - clip_y, paint);
	setClip(0, 0, WIDTH, HEIGHT);
    }

    /**
     * 渲染
     * @param src
     * @param dis
     */
    public void drawImageZoom(Image src, int x, int y, int anchor, float dis) {
        int desW = (int) (src.getWidth() * dis);
        int desH = (int) (src.getHeight() * dis);
        if (desW == 0 || desH == 0) {
            return;
        }
        if (BOTTOM == (anchor & BOTTOM)) {
            y -= desH;
        }
        if (RIGHT == (anchor & RIGHT)) {
            x -= desW;
        }
        if (HCENTER == (anchor & HCENTER)) {
            x -= desW >> 1;
        }
        if (VCENTER == (anchor & VCENTER)) {
            y -= desH >> 1;
        }
        mat.reset();
        mat.postScale(dis, dis);
        mat.postTranslate(x, y);
        canvas.drawBitmap(src.bmp, mat, paint);
    }
    /**
     * 渲染
     * @param src
     * @param dis
     */
    public void drawImageZoom(Image src, int x, int y, int anchor, float disW, float disH) {
        int desW = (int) (src.getWidth() * disW);
        int desH = (int) (src.getHeight() * disH);
        if (desW == 0 || desH == 0) {
            return;
        }
        if (BOTTOM == (anchor & BOTTOM)) {
            y -= desH;
        }
        if (RIGHT == (anchor & RIGHT)) {
            x -= desW;
        }
        if (HCENTER == (anchor & HCENTER)) {
            x -= desW >> 1;
        }
        if (VCENTER == (anchor & VCENTER)) {
            y -= desH >> 1;
        }
        mat.reset();
        mat.postScale(disW, disH);
        mat.postTranslate(x, y);
        canvas.drawBitmap(src.bmp, mat, paint);
    }

    public void drawImageZoom(Image src, int anchor) {
//        float disX = GameContext.canvas.getWidth() * 1.0f / src.getWidth();
//        float disY = GameContext.canvas.getHeight() * 1.0f / src.getHeight();
//        int desW = (int) (src.getWidth() * disX);
//        int desH = (int) (src.getHeight() * disY);
//        if (desW == 0 || desH == 0) {
//            return;
//        }
        mat.reset();
        mat.postScale(GameContext.canvas.changeWidthF, GameContext.canvas.changeHeightF);
        canvas.drawBitmap(src.bmp, mat, paint);
    }

    public void drawImageZoomRotate(Image src, int x, int y, int anchor, float dis, int angle)
    {
        int desW = (int) (src.getWidth() * dis);
        int desH = (int) (src.getHeight() * dis);

        if (BOTTOM == (anchor & BOTTOM))
        {
            y -= desH;
        }
        if (RIGHT == (anchor & RIGHT))
        {
            x -= desW;
        }
        if (HCENTER == (anchor & HCENTER))
        {
            x -= desW >> 1;
        }
        if(VCENTER == (anchor & VCENTER))
        {
            y -= desH >> 1;
        }
        mat.reset();
        mat.postRotate(-(angle >> 2));
        mat.postScale(dis, dis);
        mat.postTranslate(x, y);
        canvas.drawBitmap(src.bmp, mat, paint);
    }

    public void setColor(int r, int g, int b) {
        paint.setColor((r << 16) | (g << 8) | (b & 0xff) | 0xFF000000);
    }

    public int getClipX() {
        Rect clipRect = canvas.getClipBounds();
        return clipRect.centerX() - (clipRect.width() >> 1);
    }

    public int getClipY() {
        Rect clipRect = canvas.getClipBounds();
        return clipRect.centerY() - (clipRect.height() >> 1);
    }

    public int getClipWidth() {
        Rect clipRect = canvas.getClipBounds();
        return clipRect.width();
    }

    public int getClipHeight() {
        Rect clipRect = canvas.getClipBounds();
        return clipRect.height();
    }
}
