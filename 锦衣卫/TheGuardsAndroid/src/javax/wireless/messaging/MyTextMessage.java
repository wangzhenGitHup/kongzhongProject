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
public class MyTextMessage implements TextMessage
{

    private String paramString = "";

    public String getPayloadText()
    {
        return paramString;
    }

    public void setPayloadText(String paramString)
    {
        this.paramString = paramString;
    }

    public String getAddress()
    {
        return "";
    }

    public void setAddress(String paramString)
    {
        
    }

    public Date getTimestamp()
    {
        return new Date();
    }
    
}
