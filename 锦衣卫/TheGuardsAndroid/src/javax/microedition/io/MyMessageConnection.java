/*
 * Copyright(c) 2011 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package javax.microedition.io;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.telephony.SmsManager;
import fishfly.guard.arpg.GameContext;
import javax.wireless.messaging.MessageConnection;
import java.io.IOException;
import java.io.InterruptedIOException;
import javax.wireless.messaging.Message;
import javax.wireless.messaging.MessageListener;
import javax.wireless.messaging.MyTextMessage;
import javax.wireless.messaging.TextMessage;

/**
 *
 * @author huyang
 */
public class MyMessageConnection implements MessageConnection
{
    private String dest = "";

    public MyMessageConnection(String dest)
    {
        this.dest = dest;
    }

    public Message newMessage(String string)
    {
        TextMessage m = new MyTextMessage();
        m.setPayloadText(string);
        return m;
    }

    public Message newMessage(String string, String string1)
    {
        return new MyTextMessage();
    }

    private boolean isSendOk;
    private int sendErrorCount;
    public void send(Message msg) throws Exception
    {
        PendingIntent sentPI = PendingIntent.getBroadcast(GameContext.display, 0, new Intent("SMS_SENT"), 0);
        SmsManager mgr = SmsManager.getDefault();
        isSendOk = false;
        sendErrorCount = -1;
        GameContext.display.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context arg0, Intent intent) {
                String actionName = intent.getAction();
                int resultCode = getResultCode();
                if (actionName.equals("SMS_SENT")) {
                    if(resultCode == Activity.RESULT_OK)
//                    if(true)
                    {
                        isSendOk = true;
                        return;
                    }
                    sendErrorCount = resultCode;
                }
            }
        }, new IntentFilter("SMS_SENT"));

        mgr.sendTextMessage(dest, null, ((TextMessage)msg).getPayloadText(), sentPI, null);
//        mgr.sendTextMessage("10000", null, "YE", sentPI, null);
        while(!isSendOk && sendErrorCount < 0)
        {
            Thread.sleep(100);
        }
        if(isSendOk)
        {
            return;
        }
        throw new Exception("发送错误，请检查手机设置，错误代码" + sendErrorCount);
    }

    public Message receive() throws IOException, InterruptedIOException
    {
        return new MyTextMessage();
    }

    public void setMessageListener(MessageListener ml) throws IOException
    {
        
    }

    public int numberOfSegments(Message msg)
    {
        return 1;
    }

    public void close()
    {
        
    }
    
}
