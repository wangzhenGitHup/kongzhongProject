/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 *
 * @author 何召卫@fishfly.com
 */
public interface BoxListener {
    
    int SELECT_OK = 200;
    int SELECT_RETURN = 400;
    
    public void doOkButtonFire();
    public void doReturnButtonFire();
    public ScriptEngine getScript();
}
