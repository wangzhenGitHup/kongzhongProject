/*
 * Copyright(c) 2011 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package javax.wireless.messaging;

import java.util.Date;
/**
 *
 * @author huyang
 */
public interface Message
{
  public abstract String getAddress();

  public abstract void setAddress(String paramString);

  public abstract Date getTimestamp();
}
