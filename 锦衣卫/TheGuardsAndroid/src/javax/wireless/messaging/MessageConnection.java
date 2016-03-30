/*
 * Copyright(c) 2011 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package javax.wireless.messaging;

import java.io.IOException;
import java.io.InterruptedIOException;
import javax.microedition.io.Connection;

/**
 *
 * @author huyang
 */
public interface MessageConnection extends Connection
{

    public static final String TEXT_MESSAGE = "text";
    public static final String BINARY_MESSAGE = "binary";
    public static final String MULTIPART_MESSAGE = "multipart";

    public Message newMessage(String string);

    public Message newMessage(String string, String string1);

    public void send(Message msg) throws Exception;

    public Message receive() throws IOException, InterruptedIOException;

    public void setMessageListener(MessageListener ml) throws IOException;

    public int numberOfSegments(Message msg);
}
