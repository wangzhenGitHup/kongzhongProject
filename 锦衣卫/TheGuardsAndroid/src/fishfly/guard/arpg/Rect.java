/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */
package fishfly.guard.arpg;


/**
 *
 * @author 何召卫@fishfly.com
 */
public class Rect {
    public int xmin;
    public int ymin;
    public int xmax;
    public int ymax;
    
    //xmin == 0x80000000表示这个Rect是空的
    static final int RECT_EMPTY_FLAG = 0x80000000;

    public Rect()
    {
        setEmpty();
    }

    public Rect(Rect rect)
    {
        set(rect);
    }

    public Rect(int i, int j, int k, int l)
    {
        set(i, j, k, l);
    }

    public void set(Rect rect)
    {
        xmin = rect.xmin;
        ymin = rect.ymin;
        xmax = rect.xmax;
        ymax = rect.ymax;
    }

    public void set(int i, int j, int k, int l)
    {
        if (i < k)
        {
            xmin = i;
            xmax = k;
        } else
        {
            xmin = k;
            xmax = i;
        }
        if (j < l)
        {
            ymin = j;
            ymax = l;
            return;
        } else
        {
            ymin = l;
            ymax = j;
            return;
        }
    }

    public void setEmpty()
    {
        xmin = RECT_EMPTY_FLAG;
        xmax = RECT_EMPTY_FLAG;
        ymin = RECT_EMPTY_FLAG;
        ymax = RECT_EMPTY_FLAG;
    }

    public boolean isEmpty()
    {
        return xmin == RECT_EMPTY_FLAG;
    }

    public Rect getNewRect(int offX, int offY)
    {
        Rect r = new Rect(this);
        r.xmax += offX;
        r.xmin += offX;
        r.ymax += offY;
        r.ymin += offY;
        return r;
    }
    
    public void offset(int i, int j)
    {
        if (xmin != RECT_EMPTY_FLAG)
        {
            xmin += i;
            xmax += i;
            ymin += j;
            ymax += j;
        }
    }

    /**
     * 将两个矩形区域合并成一个，那么就去最小的左上点和最大的右下点即可
     * @param rect
     */
    public void union(Rect rect)
    {
        if (rect.xmin == RECT_EMPTY_FLAG)
        {
            return;
        }

        if (xmin == RECT_EMPTY_FLAG)
        {
            xmin = rect.xmin;
            xmax = rect.xmax;
            ymin = rect.ymin;
            ymax = rect.ymax;
            return;
        }

        xmin = Math.min(xmin, rect.xmin);
        xmax = Math.max(xmax, rect.xmax);
        ymin = Math.min(ymin, rect.ymin);
        ymax = Math.max(ymax, rect.ymax);
    }

    /**
     * 把一个点与一个矩形合并
     * @param x 点的坐标
     * @param y
     */
    public void union(int x, int y)
    {
        if (xmin == RECT_EMPTY_FLAG)
        {
            xmin = xmax = x;
            ymin = ymax = y;
            return;
        }

        if (x < xmin)
        {
            xmin = x;
        } else if (x > xmax)
        {
            xmax = x;
        }

        if (y < ymin)
        {
            ymin = y;
            return;
        }

        if (y > ymax)
        {
            ymax = y;
        }
    }

    /**
     * 计算两个矩形是否有交集
     * @param rect
     * @return
     */
    public boolean testIntersect(Rect rect)
    {
        if (this.isEmpty() || rect.isEmpty())
        {
            return false;
        }

        return xmin <= rect.xmax && rect.xmin <= xmax && ymin <= rect.ymax && rect.ymin <= ymax;
    }
    
    /**
     * 获得相交的宽度
     * @param rect 
     * @return
     */
    public int getIntersectWidth(Rect rect)
    {
        if(!testIntersect(rect))
        {
            return 0;
        }
        if(xmin < rect.xmin)
        {
            return xmax - rect.xmin;
        }
        return rect.xmax - xmin;
    }
    
    /**
     * 获得相交的高度
     * @param rect 
     * @return
     */
    public int getIntersectHeight(Rect rect)
    {
        if(!testIntersect(rect))
        {
            return 0;
        }        
        if(ymin < rect.ymin)
        {
            return ymax - rect.ymin;
        }
        return rect.ymax - ymin;        
    }

    /**
     * 计算一个点是否在矩形内
     * @param x
     * @param y
     * @return
     */
    public boolean pointIn(int x, int y)
    {
        return xmin <= x && x <= xmax && ymin <= y && y <= ymax;
    }

    /**
     * 放大
     * @param times
     */
    public void zoomOut(int times)
    {
        xmin *= times;
        ymin *= times;
        xmax *= times;
        ymax *= times;
    }

    public void zoomIn(int times)
    {
        if (times == 0)
        {
            return;
        }

        xmin /= times;
        ymin /= times;
        xmax /= times;
        ymax /= times;
    }

    public int getWidth()
    {
        return xmax - xmin;
    }

    public int getHeight()
    {
        return ymax - ymin;
    }

    public int getLeftX()
    {
        return xmin;
    }

    public int getTopY()
    {
        return ymin;
    }

    public int getBottomY()
    {
        return ymax;
    }

    public int getRightX()
    {
        return xmax;
    }

    //得到原点坐标，下中为原点
    public int getOriginX()
    {
        if (isEmpty())
        {
            return 0;
        }

        return (xmin + xmax) >> 1;
    }

    public int getHy()
    {
        if (isEmpty())
        {
            return 0;
        }

        return (ymin + ymax) >> 1;        
    }
    
    public int getOriginY()
    {
        if (isEmpty())
        {
            return 0;
        }
        return ymax;
    }
}
