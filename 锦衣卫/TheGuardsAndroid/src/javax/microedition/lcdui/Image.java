package javax.microedition.lcdui;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;

import fishfly.guard.arpg.Util;
import java.io.IOException;

public class Image {

    public static Image createImage(Image img, int x, int y, int w, int h, int trane) {
        Bitmap bit = Bitmap.createBitmap(img.bmp, x, y, w, h, null, true);
        return new Image(bit);
    }

    Bitmap bmp = null;
    Graphics g = null;

    public static int imageMemoryCount = 0;

    private Image() {
    }

    private Image(Bitmap bitMap)
    {
        this.bmp = bitMap;
    }

    public void clearColor(int color)
    {
        if(bmp == null)
        {
            return;
        }
        
        bmp.eraseColor(0);
    }

    public int getWidth() {
        return bmp.getWidth();
    }

    public int getHeight() {
        return bmp.getHeight();
    }

    public static Image createImage(String path) {
        try {
            return createImage(Util.openFile(path));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static Image createImage(byte[] data, int offset, int length) {
        Image img = new Image();
        Bitmap bmp = BitmapFactory.decodeByteArray(data, offset, length);
        img.bmp = bmp;

        return img;
    }

    public void getRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height) {
        bmp.getPixels(rgbData, offset, scanlength, x, y, width, height);
    }

    public static Image createRGBImage(int[] rgb, int width, int height, boolean processAlpha) {
        Image img = new Image();
        if (!processAlpha) {
            //不处理透明色，因此，所有透明值失效
            for (int i = 0; i < rgb.length; i++) {
                rgb[i] |= 0xFF000000;
            }
        }
        img.bmp = Bitmap.createBitmap(rgb, width, height, Bitmap.Config.ARGB_8888);
//        img.bmp = Bitmap.createBitmap(rgb, width, height, Bitmap.Config.ARGB_4444);
        return img;
    }

    public static Image createImage(int width, int height) {
        Image img = new Image();
        img.bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
//        img.bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        return img;
    }

    public static Image createImageAlpha(int width, int height) {
        Image img = new Image();
//        img.bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
        img.bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        return img;
    }
    public Graphics getGraphics() {
//        if (g == null) {
            Canvas canvas = new Canvas(bmp);
            g = new Graphics(canvas);
//        }
        return g;
    }

    private static BitmapFactory.Options op = new BitmapFactory.Options();
    static
    {
        op.inPreferredConfig = Bitmap.Config.ARGB_8888;
    }

    public static Image createImage(java.io.InputStream stream) throws IOException {
        Image img = new Image();
//        BitmapFactory.Options opt = new BitmapFactory.Options();
//        opt.inPreferredConfig = Bitmap.Config.RGB_565;
//        Bitmap bmp = BitmapFactory.decodeStream(stream, null, opt);
//        BitmapFactory.Options options = new BitmapFactory.Options();
//        options.inJustDecodeBounds = true;
        Bitmap bmp = BitmapFactory.decodeStream(stream);
        img.bmp = bmp;
        imageMemoryCount += bmp.getWidth() * bmp.getHeight() * 4;
        stream.close();
        return img;
    }

    public Image zoomImage(float widthZoom, float heightZoom) {
        Matrix mat = new Matrix();
        mat.postScale(widthZoom, heightZoom);
        bmp = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), mat, true);
        return this;
    }
}
