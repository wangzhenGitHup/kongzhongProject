/*
 * Copyright(c) 2011 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package javax.wireless.messaging;

/**
 *
 * @author huyang
 */
public interface MessageListener
{
    public abstract void notifyIncomingMessage(MessageConnection paramMessageConnection);
}
