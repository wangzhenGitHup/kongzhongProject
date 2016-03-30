/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 * 观察者
 * @author 何召卫@fishfly.com
 */
public interface Observer {
    void remind(int evtId, int param1, Object param2);
}
