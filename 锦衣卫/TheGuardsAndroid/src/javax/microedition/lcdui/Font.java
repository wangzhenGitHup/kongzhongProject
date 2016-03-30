package javax.microedition.lcdui;

import android.graphics.Paint;
import android.graphics.Typeface;

public class Font {
	public static final int FACE_SYSTEM = 0;
	public static final int STYLE_PLAIN = Typeface.NORMAL;
	public static final int SIZE_SMALL = 25;
	public static final int SIZE_MEDIUM = 44;
	public static final int SIZE_LARGE = 46;
	
	int size = 0;
	char[] txt = new char[1];
	Paint p = null;
	
	private Font() {
		
	}
	
	public static Font getFont(int face, int style, int size) {
		Font f = new Font();
		Typeface font = Typeface.create(Typeface.DEFAULT, style);
		f.p = new Paint();
		f.p.setTypeface(font);
		f.p.setTextSize(size);
		f.size = size;
		return f;
	}
	
	public int getHeight() {
		return (int)p.getFontSpacing();
	}
	
	public int charWidth(char ch) {
		txt[0] = ch;
		return (int)p.measureText(txt, 0, 1);
	}

        public int charsWidth(char[] chs, int startIndex, int len) {
            return (int)p.measureText(chs, startIndex, len);
        }

    public int stringWidth(String string) {
        char[] c = string.toCharArray();
        return (int)p.measureText(c, 0, c.length);
    }
}
