/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package javax.microedition.midlet;

/**
 *
 * @author huyang
 */
public class MIDlet{

    public void startApp()
    {

    }
    
    public void pauseApp()
    {

    }

    public void destroyApp(boolean b) {
        
    }

    public void notifyDestroyed() {
        System.exit(0);
    }

    public String getAppProperty(String title) {
        if(title.equals("Term"))
        {
            return "HTC";
        }
        return "2.0.0";
    }

    public void platformRequest(String url) {
        
    }

}
