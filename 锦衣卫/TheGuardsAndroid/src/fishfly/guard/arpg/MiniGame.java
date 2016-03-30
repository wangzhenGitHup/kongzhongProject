/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package fishfly.guard.arpg;

import javax.microedition.lcdui.Graphics;

/**
 *
 * @author duanying
 */
public interface MiniGame {

    public void paint(Graphics g);

    public void keyReleased(int keyCode);

    public void keyPressed(int keyCode);

    public void setGameState(int kind);

    public void pointerPressed(int px, int py);

    public void pointerReleased(int px, int py);

    public void removeImage();

    public boolean pointerDragged(int startX, int startY, int endX, int endY);
}
