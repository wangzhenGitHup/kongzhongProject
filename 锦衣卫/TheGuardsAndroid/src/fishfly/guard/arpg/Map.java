/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Hashtable;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/**
 * 游戏地图
 * @author 何召卫@fishfly.com
 */
public class Map implements RoleConst {
    
    public static final int TILE_SIZE = 16;
    public static final int HALF_TILE = 8;
    public static final int DIC = 4;
    /**
     * 物理层数据
     */
    public static final int PHYSICAL_DATA = 3;
    
    /**
     * 水波纹
     */
    public static final int DIMPLE_DATA = 10;
    
    //地图归属ID
    public int id;
    //是否在房间内部
    public boolean isRoom;
    public int rows = 0;
    public int cols = 0;
    int tiles = 0;
    Image bgImg;
    int[] bgData;
    Image fgImg;
    int[] fgData;
    
    //物理层数据
    byte[] phyData;
    //可瞬移坐标
    int[] instants;
    
    int width;
    int height;
    //当前地图上可以触发的脚本引擎
    public HashtableShort engines;
    //地图脚本缓冲
    public HashtableShort enginesBuffer;
    //NPC死亡之后掉落在地图上面的物品
    public HashtableShort itemMap;
    //卡马克相关
    //图片缓冲
    static boolean cacheReady = false;
    static Graphics cacheGra;
    public static Image cache;
    static int cacheRow;
    static int cacheCol;
    static int cacheWidth;
    static int cacheHeight;
    //卡马克坐标
    int carX;
    int carY;
    //地图在缓冲中的相对坐标
    int mapX;
    int mapY;
    //上次地图缓冲相对与整张地图的偏移量
    int lastOffsetX;
    int lastOffsetY;
    
    //地图列偏移
    short[] offsets;
    
    //寻路相关数据
    //是否找寻到了
    boolean isFindPath;
    //其实位置
    final byte START_POS = -100;
    //目的地
    final byte END_POS = -101;
    //运算步数
    final int MAX_SEARCH_STEPS = 20;
    //写入索引
    final int WRITE_ID = 50;
    //头指针索引
    int headIndex;
    //写入索引
    int writeIndex;
    //寻路矩阵用来存放链表数据里面的索引的
    byte[] pathMat;
    //数组链表
    int[] headData;
    int[] head;
    int endCol;
    int endRow;
    //寻路数据结束
    String fileName;
    
    //#if PKG == 1
//#     public static PackageReader mapPack = new PackageReader("/map.idx", "/map.pkg");
    //#endif
    
    //是否是漂浮的
    boolean haveBack;

    //地图007的背景图片
    Image imgBack;
    
    final int MAX_MAP_ITEM_COUNT = 50;
    /**
     * 地图上掉落物品图标
     */
    static Image imgMapItem;
    final int IMG_ITEM_CNT = 11;
    /**
     * 地图上面的物品
     * 8位物品的X偏移
     * 8位物品的Y偏移
     * 8位的总时间
     * 8位的当前时间
     */
    private int[] mapItem = new int[MAX_MAP_ITEM_COUNT];
    
    /**
     * 16位物品的地图x坐标
     * 16位物品的地图y坐标
     */
    private int[] mapItemPos = new int[MAX_MAP_ITEM_COUNT];
    
    /**
     * 8位X速度
     * 8位Y速度
     */
    private int[] mapItemSpeed = new int[MAX_MAP_ITEM_COUNT];
    
    /**
     * 个数
     */
    private int mapItemSize;
    
    /**
     * 开始索引
     */
    private int mapItemStart;
    
    //箭头
    public long[] channelMarkPos = new long[20];
    public PaintUnit[] channelMarkPaintUnit = new PaintUnit[20];
    public int channelMarkCnt;

    int minOffsetX;
    int minOffsetY;
    
    public Map() {
        imgMapItem = ImageManager.getInstance().getImage((short) 243);
    }
    
    public Map(String fileName) {
        this.fileName = fileName;
        id = Integer.parseInt(fileName);
//        GameContext.page.refreshMapName();
        load(fileName);
        minOffsetX = width < GameContext.page.showWidth ? (width - Page.SCREEN_WIDTH) / 2 : 0;
        minOffsetY = height < GameContext.page.showHeight ? (height - Page.SCREEN_HEIGHT) / 2 : 0;
        //#if PRINTDEBUG
//        printPhysicalLayer();
        //#endif
    }
    
    public void addChannelMark(short x, short y, byte dir) {
        //#if PRINTDEBUG == 1
        System.out.println("脚本写入,x=" + x + ",y=" + y + ",dir=" + dir);
        //#endif
        channelMarkPos[channelMarkCnt] = (long)(x << 16) | y | ((long)(dir & 0xff) << 32);
        final short ROAD_SIGN = 126;
        PaintUnit unit = new PaintUnit();
        AnimationManager.getInstance().getAnimation(ROAD_SIGN, unit);
        unit.actId = dir;
        unit.x = x;
        unit.y = y;
        unit.resetFrame();
        channelMarkPaintUnit[channelMarkCnt] = unit;
        channelMarkCnt++;
    }

    public void drawChannelMark(Graphics g, int offsetX, int offsetY)
    {
        if(GameContext.script != null && !GameContext.script.isEnd())
        {
            return;
        }
        if (enginesBuffer != null)
        {
            return;
        }
        for(int index = 0; index < channelMarkCnt; index++)
        {
            channelMarkPaintUnit[index].paint(g, offsetX, offsetY);
            channelMarkPaintUnit[index].update();
        }

    }
    
    private void saveChannelMarks(DataOutputStream dataOut) throws IOException {
        dataOut.writeShort(channelMarkCnt);
        //#if PRINTDEBUG == 1
        System.out.println("写通道标记个数:" + channelMarkCnt);
        //#endif
        for(int i = 0; i < channelMarkCnt; i++) {
            dataOut.writeLong(channelMarkPos[i]);
            //#if PRINTDEBUG == 1
            long pos = channelMarkPos[i];
            int x = (int) ((pos >> 16) & 0xffff);
            int y = (int) (pos & 0xffff);
            int dir = (int) ((pos >> 32) & 0xffff);
            System.out.println("图标:" + x + "," + y+",dir="+dir);
            //#endif
        }
    }
    
    private void loadChannelMarks(DataInputStream dataIn) throws IOException {
        channelMarkPos = new long[20];
        int cnt = dataIn.readShort();
        //#if PRINTDEBUG == 1
        System.out.println("读取通道标记个数:" + channelMarkCnt);
        //#endif
        for(int i = 0; i < cnt; i++) {
            long pos = dataIn.readLong();
            short x = (short) ((pos >> 16) & 0xffff);
            short y = (short) (pos & 0xffff);
            byte dir = (byte) ((pos >> 32) & 0xffff);
            //#if PRINTDEBUG == 1
            System.out.println("图标:" + x + "," + y+" ,dir="+dir);
            //#endif
            addChannelMark(x, y, dir);
        }
    }
    
    /**
     * 地图上添加物品
     * @param itemIndex 物品id
     * @param mapX 地图位置
     * @param mapY
     * @param offX 物品ICON图标便宜
     * @param offY 
     */
    public void addMapItem(short itemIndex, int mapX, int mapY, int offX, int offY)
    {
        if(mapItemSize >= MAX_MAP_ITEM_COUNT)
        {
            return;
        }
        int allTime = GameContext.getRand(4, 6);
        byte speedX = (byte) GameContext.getRand(-8, 8);
        byte speedY = (byte) GameContext.getRand(-20, -20);
        int addIndex = (mapItemStart + mapItemSize) % MAX_MAP_ITEM_COUNT;
        mapItem[addIndex] = 0;
        mapItemPos[addIndex] = 0;
        mapItemSpeed[addIndex] = 0;
        mapItem[addIndex] = (offX << 24) | (offY << 16) | (allTime << 8);
        mapItemPos[addIndex] = (mapX << 16) | (mapY);
        mapItemSpeed[addIndex] = (itemIndex << 16) | ((((speedX & 0xff) << 8) | (speedY & 0xff)) & 0xffff);
        mapItemSize++;
    }
    
    public void drawMapItem(Graphics g, int mapOffX, int mapOffY)
    {
        if(mapItemSize == 0)
        {
            return;
        }
        final int EACH_WH = 16;
        int posX = 0;
        int posY = 0;
        int offX = 0;
        int offY = 0;
        byte speedX = 0;
        byte speedY = 0;
        int allTime = 0;
        int curTime = 0;
        int a = 8;
        Actor actor = GameContext.actor;
        GamePage page = GameContext.page;
        for(int index = mapItemStart, size = mapItemStart + mapItemSize; index < size; index++)
        {
            int selectIndex = index % MAX_MAP_ITEM_COUNT;
            offX = (mapItem[selectIndex] >> 24) & 0xff;
            offY = (mapItem[selectIndex] >> 16) & 0xff;
            allTime = (mapItem[selectIndex] >> 8) & 0xff;
            curTime = mapItem[selectIndex] & 0xff;
            posX = (mapItemPos[selectIndex] >> 16) & 0xffff;
            posY = mapItemPos[selectIndex] & 0xffff;
            speedX =  (byte) ((mapItemSpeed[selectIndex] >> 8) & 0xff);
            speedY =  (byte) (mapItemSpeed[selectIndex] & 0xff);
            short itemId = (short) ((mapItemSpeed[selectIndex] >> 16) & 0xffff);

            Item item = GameContext.getItem(itemId);
            int itemIconId = item.extra[Item.EXTRA_TYPE_DROP_ICON];
            if (itemIconId < IMG_ITEM_CNT) {
                Util.drawClipImage(g, imgMapItem, posX - mapOffX, posY - mapOffY, EACH_WH * itemIconId, 0, EACH_WH, EACH_WH);
            }

            if (curTime < allTime)
            {
                posX += speedX;
                posY += speedY + a * curTime + (a >> 1);
                mapItemPos[selectIndex] = 0;
                mapItem[selectIndex] = 0;                
                mapItemPos[selectIndex] = (posX << 16) | posY;
            }
            else
            {
                if(curTime > allTime)
                {
                    posX += (actor.x - posX - (TILE_SIZE >> 1)) >> 1;
                    posY += (actor.y - posY) >> 1;
                    mapItemPos[selectIndex] = 0;
                    mapItemPos[selectIndex] = (posX << 16) | posY;
                    if(Math.abs(actor.x - posX) < 11 && Math.abs(actor.y - posY) < 6)
                    {
                        curTime = allTime + 20;                        
                    }
                }
            }
            curTime ++;
            mapItem[selectIndex] = (offX << 24) | (offY << 16) | (allTime << 8) | (curTime & 0xff);
        }
        int curMapItem = mapItem[mapItemStart];
        StringManager strMgr = StringManager.getInstance();
        StringBuffer buf = null;
        while((curMapItem & 0xff) > ((allTime = (curMapItem >> 8) & 0xff) + 20))
        {
            short itemId = (short) ((mapItemSpeed[mapItemStart] >> 16) & 0xffff);
            Item item = GameContext.getItem(itemId);
            actor.addItem(itemId);
            buf = new StringBuffer();
            strMgr.copyString((short) 24, buf);
            buf.append(item.name);
            page.showFlashNote(buf.toString().toCharArray());
            mapItem[mapItemStart] = 0;
            mapItemStart ++;
            if(mapItemStart >= MAX_MAP_ITEM_COUNT)
            {
                mapItemStart = 0;
            }
            curMapItem = mapItem[mapItemStart];
            mapItemSize --;
        }
    }
    
    
    //#if PRINTDEBUG
//    void printPhysicalLayer() {
//        StringBuffer buf = new StringBuffer();
//        buf.append("{");
//        for(int icol = 0; icol < cols; icol++) {
//            buf.append("{");
//            for(int irow = 0; irow < rows; irow++) {
//                buf.append(phyData[offsets[icol] + irow]);
//                if(irow != rows - 1) {
//                    buf.append(",");
//                }
//            }
//            buf.append("}");
//            if(icol != cols - 1) {
//                buf.append(",");
//            }
//            buf.append("\n");
//        }
//        buf.append("}");
//        System.out.println(buf.toString());
//    }
    //#endif
    /**
     * 向地图脚本矩阵里面添加脚本
     * @param script
     * @param x 格数
     * @param y 格数
     */
    public void addEventScript(ScriptEngine script, int x, int y)
    {        
        short hashcode = position2Short(x, y);
        if(enginesBuffer != null)
        {
            enginesBuffer.put(hashcode, script);
            return;
        }
        engines.put(hashcode, script);      
    }
    
    private static short position2Short(int x, int y) {
        return (short) ((x << 8) | y);
    }
    
    /**
     * 物品的添加，这里需要注意需要比较所有地图物品的Y坐标，
     * 根据Y坐标的大小进行添加这样可以减少排序的工作量
     * 物品添加的目的只是为了绘制方便，这里只要存储需要绘制的物品的相关参数就可以啦
     * 
     * @param item
     * @param p
     */
    public void addItem(Item item, int x, int y)
    {
       //TODO 
    }
    
    /**
     * 主角在地图移动是否启动脚本
     * 如果正在攻击，不判断是否踩在地雷上
     * @return
     */
    public ScriptEngine getEvent(int x, int y)
    {
        //TODO如果正在攻击，不判断是否踩在地雷上
        
        //TODO如果场景脚本正在执行中，不执行
        
        int curCol = x >> 4;
        int curRow = y >> 4;
        short pos = position2Short(curCol, curRow);
        ScriptEngine e = (ScriptEngine)engines.get(pos);
        return e;
    }

    public void closeMapEvent()
    {
        final int SCRIPT_COUNT = 20;
        enginesBuffer = engines;
        engines = new HashtableShort(SCRIPT_COUNT);
    }

    public void openMapEvent()
    {
        engines.clear();
        engines = enginesBuffer;
        enginesBuffer = null;
    }
    
    private void load(String fileName) {
        try {
            //#if PKG == 0
            DataInputStream dataIn = Util.open("/map/" + fileName);
            //#else 
//#             DataInputStream dataIn = mapPack.openFile(fileName);
            //#endif
//            DataInputStream dataIn = Util.open("/map/" + fileName);
            //地图名称，无用，抛弃
            dataIn.readUTF();
            //TILE_SIZE 无用 抛弃
            dataIn.read();
            
            cols = dataIn.read() & 0xFF;
            rows = dataIn.read() & 0xFF;
            
            //创建列索引
            offsets = new short[cols];
            for (int index = 0; index < cols; index++)
            {
                offsets[index] = (short) (rows * index);
            }
            
            tiles = cols * rows;
            width = cols << 4;
            height = rows << 4;
            short imgId = dataIn.readShort();
            ImageManager imgMgr = ImageManager.getInstance();
            bgImg = imgMgr.getImage(imgId);
        
            bgData = new int[tiles];
            loadTileLayer(dataIn, bgData);
        
            imgId = dataIn.readShort();
            fgImg = imgMgr.getImage(imgId);
        
            fgData = new int[tiles];
            loadTileLayer(dataIn, fgData);
            
            loadAnimationLayer(dataIn);
            
            loadPhysicalLayer(dataIn);
            
            final int SCRIPT_COUNT = 20;
            engines = new HashtableShort(SCRIPT_COUNT);
            //抛弃mapId
            dataIn.read();
            haveBack = dataIn.readBoolean();
            if(haveBack) {
                final short SKY_BACK_IMG = 279;
                imgBack = imgMgr.getImage(SKY_BACK_IMG);
            }
            
            try
            {
                dataIn.close();
            }
            catch (Exception e)
            {
            }
            
            //下面创建地图缓冲
            if(cache == null) {
                cacheCol = Page.SCREEN_WIDTH >> 4;
                if((cacheCol << 4) < Page.SCREEN_WIDTH) {
                    cacheCol++;
                }
                
                cacheRow = Page.SCREEN_HEIGHT >> 4;
                if((cacheRow << 4) < Page.SCREEN_HEIGHT) {
                    cacheRow++;
                }
                
                //每边扩展一个
                cacheRow += 1;
                cacheCol += 1;
                
                cacheWidth = cacheCol << 4;
                cacheHeight = cacheRow << 4;
                cache = Image.createImage(cacheWidth, cacheHeight);
                
                cacheGra = cache.getGraphics();
            }
            cacheGra.setColor(0);
            cacheGra.fillRect(0, 0, cacheWidth, cacheHeight);
            cacheReady = false;
            carX = 0; 
            carY = 0;
            
            initPath();
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            ex.printStackTrace();
            //#endif
        }
    }

    /**
     * 删除地图数据
     */
    void releaseDatas()
    {
        if (imgBack != null) {
            ImageManager.getInstance().removeImage(imgBack);
            imgBack = null;
        }
        ImageManager.getInstance().removeImage(bgImg);
        ImageManager.getInstance().removeImage(fgImg);
        bgImg = null;
        bgData = null;
        fgImg = null;
        fgData = null;
    }

    /**
     * 删除缓存
     */
    void releaseCache() {
        cache = null;
    }

    /**
     * 删除所有相关数据
     */
    void release() {
        releaseDatas();
        releaseCache();
    }
    
    boolean isCanFly()
    {
        int col = GameContext.actor.x >> 4;
        int row = GameContext.actor.y >> 4;
        int dir = GameContext.actor.dir;
        if (col < 0 || row < 0)
        {
            return false;
        }

        if (col >= cols || row >= rows)
        {
            return false;
        }
        //飞行逻辑地图块
        final int FLY_ID = 11;
        return phyData[offsets[col] + row] >= FLY_ID && ((dir + FLY_ID) == phyData[offsets[col] + row]);
    }
    
    private void loadTileLayer(DataInputStream dataIn, int[] data) throws IOException {
        for(int icol = 0; icol < cols; icol++) {
            for(int irow = 0; irow < rows; irow++) {
                data[offsets[icol] + irow] = ((dataIn.read() & 0xff) << 16) | ((dataIn.read() & 0xff) << 8) | (dataIn.read() & 0xff);
            }
        }
    }
    
    public void paintBlock(Graphics g, int col, int row, int x, int y, Image img, int[] data) {
        if(col < 0 || row < 0 || col >= cols || row >= rows) {
            //#if PRINTDEBUG == 1
//            System.out.println("绘制地图越界 col:" + col + " row:" + row + " x:" + x + " y:" + y + " mapCols:" + cols + " mapRows:" + rows);
            //#endif 
            return;
        }
        try {
            int mapData = data[offsets[col] + row];
            int tileCol = (mapData >> 16) & 0xff;
            int tileRow = (mapData >> 8) & 0xff;
            if (tileCol == 0xff || tileRow == 0xff)
            {
//                if(data == bgData)
//                {
//                    g.setColor(0);
//                    g.fillRect(x, y, TILE_SIZE, TILE_SIZE);
//                }
                return;
            }

            int tileFlip = mapData & 0xff;
            int srcX = tileCol << 4;
            int srcY = tileRow << 4;
            Util.drawRegion(g, img, srcX, srcY, Map.TILE_SIZE, Map.TILE_SIZE, tileFlip, x, y, Graphics.LEFT | Graphics.TOP);
            g.setClip(0, 0, cacheWidth, cacheHeight);
        }catch(Exception ex) {
            //#if PRINTDEBUG == 1
            System.out.println("col:" + col + " row:" + row + " x:" + x + " y:" + y + "");
            //#endif
        }
    }
    
    /**
     * 在x,y的位置，把cache按照卡马克的方式绘制
     * @param g
     */
    private void drawCarmack(Graphics g) {
        // | A  B |
        // |      |
        // | C  D |
        //先绘制右下->左上，然后是右上->左下，然后是左下->右上 然后是左上->右下
        //右下 标记为D
        int dleftX = carX + mapX;
        int dtopY = carY + mapY;
        int dwidth = cacheWidth - dleftX;
        if(dwidth > Page.SCREEN_WIDTH) {
            dwidth = Page.SCREEN_WIDTH;
        }
        
        int dheight = cacheHeight - dtopY;
        if(dheight > Page.SCREEN_HEIGHT) {
            dheight = Page.SCREEN_HEIGHT;
        }
        
        if(dwidth > 0 && dheight > 0) {
            Util.drawClipImage(g, cache, 0, 0, dleftX, dtopY, dwidth, dheight);
        }
        
        //右上B
        int bleftX = dleftX;
        int btopY = 0;
        int bwidth = dwidth;
        int bheight = Page.SCREEN_HEIGHT - dheight;
        
        //绘制右上
        if(bwidth > 0 && bheight > 0) {
            Util.drawClipImage(g, cache, 0, dheight, bleftX, btopY, bwidth, bheight);
        }
        
        //左下C
        int cleftX = 0;
        int ctopY = dtopY;
        int cwidth = Page.SCREEN_WIDTH - dwidth;
        int cheight = dheight;
        
        if(cwidth > 0 && cheight > 0) {
            Util.drawClipImage(g, cache, dwidth, 0, cleftX, ctopY, cwidth, cheight);
        }
        
        //左上A
        int aleftX = 0;
        int atopY = 0;
        int awidth = cwidth;
        int aheight = Page.SCREEN_HEIGHT - cheight;
        if(awidth > 0 && aheight > 0) {
            Util.drawClipImage(g, cache, dwidth, cheight, aleftX, atopY, awidth, aheight);
        }
    }
    
    /**
     * 在最小的范围内，改动缓冲区的内容，使其支持地图的滚动
     * @param offsetX
     * @param offsetY
     */
    public void updateCache(int offsetX, int offsetY) {
//        System.out.println("开始刷新时");
//        System.out.println("updateCache:(" + lastOffsetX + "," + lastOffsetY + ") -> (" + offsetX + ", " + offsetY + ")");
//        System.out.println("carX=" + carX + ";carY=" + carY + ";mapX=" + mapX + ";mapY=" + mapY);
        //上下左右
        int offsetCol = offsetX >> 4;
        int offsetRow = offsetY >> 4;
        
        int lastCol = (offsetX + Page.SCREEN_WIDTH) >> 4;
        int lastRow = (offsetY + Page.SCREEN_HEIGHT) >> 4;
        
        //右
        if(offsetX > lastOffsetX) {
            int moveX = offsetX - lastOffsetX;
            if(mapX + moveX < TILE_SIZE) {
                mapX += moveX;
                //不需要更新地图
                return;
            }
            
//            System.out.println("现在向右滚动卡马克坐标了");
            //卡马克坐标右移两个tile，并把新的地图绘制在移出来的部分
            //注意把卡马克坐标归零,如果超出边界
            int carMoveX = TILE_SIZE;

            int nextCarX = carX + carMoveX;
            if(nextCarX >= cacheWidth) {
                nextCarX -= cacheWidth;
            }
            
            //绘制两列
            int x = carX;
            int paintRow = mapY >> 4;
            
            int carRow = (carY >> 4);
            
            int y = 0;
            //先画左上块 B
            int rowCnt = carRow;
            int startRow = offsetRow - paintRow + cacheRow - carRow;

            for(int irow = 0; irow < rowCnt; irow++) {
                paintBlock(cacheGra, lastCol, irow + startRow, x, y);
                
                y += TILE_SIZE;
            }

            //再画左下块 D
            rowCnt = cacheRow - carRow;
            startRow = offsetRow - paintRow;
            for(int irow = 0; irow < rowCnt; irow++) {
                paintBlock(cacheGra, lastCol, irow + startRow, x, y);
                
                y += TILE_SIZE;
            }
            
            //调整地图在缓冲中的相对坐标
            mapX = mapX + moveX - carMoveX;
            carX = nextCarX;
            return;
        }
        
        //左
        if(offsetX < lastOffsetX) {
            int moveX = lastOffsetX - offsetX;
            if(mapX - moveX >= 0) {
                //边上还有地
                mapX -= moveX;
                return;
            }
//            System.out.println("现在向左滚动卡马克坐标了");
            int carMoveX = TILE_SIZE;
            
            int nextCarX = carX - carMoveX;
            if(nextCarX < 0) {
                nextCarX += cacheWidth;
            }
            
            int paintRow = mapY >> 4;
            int x = nextCarX;
            int carRow = (carY >> 4);

            int y = 0;
            //先画左上块 B
            int rowCnt = carRow;
            int startRow = offsetRow - paintRow + cacheRow - carRow;

            for(int irow = 0; irow < rowCnt; irow++) {
                paintBlock(cacheGra, offsetCol, irow + startRow, x, y);
                
                y += TILE_SIZE;
            }

            //再画左下块 D
            rowCnt = cacheRow - carRow;
            startRow = offsetRow - paintRow;
            for(int irow = 0; irow < rowCnt; irow++) {
                if(irow + startRow >= rows) {
                    break;
                }

                paintBlock(cacheGra, offsetCol, irow + startRow, x, y);

                y += TILE_SIZE;
            }
            
            mapX = mapX - moveX + carMoveX;
            carX = nextCarX;
            return;
        }
        
        //上
        if(offsetY < lastOffsetY) {
            int moveY = lastOffsetY - offsetY;
            if(mapY - moveY >= 0) {
                //边上还有地
                mapY -= moveY;
                return;
            }
            
//            System.out.println("现在向上滚动卡马克坐标了");
            
            int carMoveY = TILE_SIZE;
            
            int nextCarY = carY - carMoveY;
            if(nextCarY < 0) {
                nextCarY += cacheHeight;
            }
            
            int paintCol = mapX >> 4;
            
            int y = nextCarY;
            
            int carCol = (carX >> 4);
            
            int x = 0;
            //先画左下块 C
            int colCnt = carCol;
            int startCol = offsetCol - paintCol + cacheCol -carCol;

            for(int icol = 0; icol < colCnt; icol++) {
                paintBlock(cacheGra, icol + startCol, offsetRow, x, y);
                
                x += TILE_SIZE;
            }

            //再画右下块 D
            colCnt = cacheCol - carCol;
            startCol = offsetCol - paintCol;
            for(int icol = 0; icol < colCnt; icol++) {
                paintBlock(cacheGra, icol + startCol, offsetRow, x, y);

                x += TILE_SIZE;
            }
            
            mapY = mapY - moveY + carMoveY;
            carY = nextCarY;
            return;
        }
        
        //下
        if(offsetY > lastOffsetY) {
            int moveY = offsetY - lastOffsetY;
            if(mapY + moveY < TILE_SIZE) {
                mapY += moveY;
                //不需要更新地图
                return;
            }
            
//            System.out.println("向下移动卡马克坐标");
            
            //卡马克坐标右移两个tile，并把新的地图绘制在移出来的部分
            //注意把卡马克坐标归零,如果超出边界
            int carMoveY = TILE_SIZE;
              
            int nextCarY = carY + carMoveY;
            if(nextCarY >= cacheHeight) {
                nextCarY -= cacheHeight;
            }
            
            //绘制两列
            int y = carY;
            int paintCol = mapX >> 4;
            int carCol = (carX >> 4);
            
            int x = 0;
            //先画左上A
            int colCnt = carCol;
            int startCol = offsetCol - paintCol + cacheCol - carCol;

            for(int icol = 0; icol < colCnt; icol++) {
                paintBlock(cacheGra, icol + startCol, lastRow, x, y);

                x += TILE_SIZE;
            }

            //再画右上 B
            colCnt = cacheCol - carCol;
            startCol = offsetCol - paintCol;
            for(int icol = 0; icol < colCnt; icol++) {
                paintBlock(cacheGra, icol + startCol, lastRow,  x, y);

                x += TILE_SIZE;
            }
            
            //调整地图在缓冲中的相对坐标
            mapY = mapY + moveY - carMoveY;
            carY = nextCarY;
            return;
        }
    }
    
    private void paintBlock(Graphics g, int col, int row, int x, int y) {
        if (imgBack != null && row * TILE_SIZE < imgBack.getHeight()) {
            return;
        }
        paintBlock(g, col, row, x, y, bgImg, bgData);
        paintBlock(g, col, row, x, y, fgImg, fgData);
    }
    
    /**
     * 在缓冲区绘制地图，不需计算，直接绘制整个缓冲区
     * @param offsetX
     * @param offsetY
     */
    private void paintCache(int offsetX, int offsetY) {
        //#if PRINTDEBUG == 1
        System.out.println("paint full cache:" + offsetX + ", " + offsetY);
        //#endif
        //获得offsetX所在的块
        int offsetCol = offsetX >> 4;
        int offsetRow = offsetY >> 4;
        int x = 0;
        int y = 0;
        for(int icol = 0; icol < cacheCol; icol++) {
            y = 0;
            int curCol = icol + offsetCol;
            if(curCol >= cols) {
                break;
            }
            
            for(int irow = 0; irow < cacheRow; irow++) {
                int curRow = irow + offsetRow;
                if(curRow >= rows) {
                    break;
                }
                paintBlock(cacheGra, curCol, irow + offsetRow, x, y);
                
                y += TILE_SIZE;
            }

            x += TILE_SIZE;
        }
        //地图在缓冲区中的偏移
        mapX = offsetX - (offsetCol << 4);
        mapY = offsetY - (offsetRow << 4);
        carX = 0;
        carY = 0;
    }

    /**
     * 不用卡马克，绘制地图
     * @param g
     * @param offsetX
     * @param offsetY
     */
    private void paintCache(Graphics g, int offsetX, int offsetY) {
        //#if PRINTDEBUG == 1
        //System.out.println("paint full cache:" + offsetX + ", " + offsetY);
        //#endif
        int offsetCol = offsetX >> 4;
        int offsetRow = offsetY >> 4;
        int offsetMapX = offsetX - (offsetCol << 4);
        int offsetMapY = offsetY - (offsetRow << 4);
        int x = -offsetMapX;
        int y = -offsetMapY;
        for(int icol = 0; icol < cols; icol++) {
            y = -offsetMapY;
            int curCol = icol + offsetCol;
            if(curCol >= cols) {
                break;
            }

            for(int irow = 0; irow < rows; irow++) {
                int curRow = irow + offsetRow;
                if(curRow >= rows) {
                    break;
                }
                if (imgBack == null || curRow * TILE_SIZE > imgBack.getHeight()) {
                    break;
                }
                paintBlock(g, curCol, irow + offsetRow, x, y, bgImg, bgData);
                paintBlock(g, curCol, irow + offsetRow, x, y, fgImg, fgData);
                y += TILE_SIZE;
            }

            x += TILE_SIZE;
        }
    }
    
    /**
     * 地图刷新效率优化
     * @param offsetX
     * @param offsetY
     */
    private void updateOtherMoveCamera(int offsetX, int offsetY)
    {
        int moveX = Math.abs(offsetX - lastOffsetX);
        int moveY = Math.abs(offsetY - lastOffsetY);
        int bufLastOffsetX = lastOffsetX;
        int bufLastOffsetY = lastOffsetY;
        if (moveX != 0)
        {
            int moveXSpeed = offsetX - bufLastOffsetX > 0 ? TILE_SIZE : -TILE_SIZE;
            while ((offsetX - bufLastOffsetX) != 0)
            {
                if (moveX < TILE_SIZE)
                {
                    bufLastOffsetX = offsetX;
                }
                else
                {
                    bufLastOffsetX += moveXSpeed;
                }
                updateCache(bufLastOffsetX, bufLastOffsetY);
                lastOffsetX = bufLastOffsetX;
                moveX = Math.abs(offsetX - bufLastOffsetX);
            }
        }
        if (moveY != 0)
        {
            int moveYSpeed = offsetY - bufLastOffsetY > 0 ? TILE_SIZE : -TILE_SIZE;
            while ((offsetY - bufLastOffsetY) != 0)
            {
                if (moveY < TILE_SIZE)
                {
                    bufLastOffsetY = offsetY;
                } else
                {
                    bufLastOffsetY += moveYSpeed;
                }
                updateCache(bufLastOffsetX, bufLastOffsetY);
                lastOffsetY = bufLastOffsetY;
                moveY = Math.abs(offsetY - bufLastOffsetY);
            }
        }
    }

    /**
     * 准备缓冲，根据绘制点决定是全部重绘缓冲区还是部分更新
     * @param offsetX
     * @param offsetY
     */
    private void prepareCache(int offsetX, int offsetY) {
        if(!cacheReady) {
            paintCache(offsetX, offsetY);
            
            cacheReady = true;
            return;
        }
        int moveX = Math.abs(offsetX - lastOffsetX);
        int moveY = Math.abs(offsetY - lastOffsetY);
        if(moveX != 0 && moveY != 0) {
            //两个方向移动，不考虑，直接刷新全图
//            paintCache(offsetX, offsetY);
            //做一个优化利用update的方法逐个刷新。
            updateOtherMoveCamera(offsetX, offsetY);
            return;
        }
        
        //不是滚屏了，是跳屏
        if(moveX > TILE_SIZE || moveY > TILE_SIZE) {
//            paintCache(offsetX, offsetY);
            updateOtherMoveCamera(offsetX, offsetY);
            return;
        }
        
        //不是第一次，仅仅更新就可以啦
        if(moveX != 0 || moveY != 0) {
            updateCache(offsetX, offsetY);
        }
    }
    
    public void paint(Graphics g, int offsetX, int offsetY) {
        //绘制缓冲
        prepareCache(offsetX, offsetY);        
        drawCarmack(g);
        if (haveBack) {
            g.drawImage(imgBack, -offsetX, -offsetY, 0);
            paintCache(g, offsetX, offsetY);
        }
        lastOffsetX = offsetX;
        lastOffsetY = offsetY;
    }

    /**
     * 渲染地图上面的NPC掉落的物品
     * @param g
     * @param offsetX
     * @param offsetY 
     */
    public void paintItems(Graphics g, int offsetX, int offsetY)
    {
        //TODO
    }
    
    /**
     * 只负责简单的移动，如大招等的移动不在这个范围
     * 因为那需要更复杂的判断
     * 当实在移动不过去的时候，可以少移几个像素
     * @param role
     * @param dir
     * @param x
     * @param y
     * @param nextX
     * @param nextY
     * @param isFly
     * @param isFlood 
     */
    public void moveRole(Role role, int dir, int x, int y, int nextX, int nextY, boolean isFly, boolean isFlood) {
        //#if PRINTDEBUG == 1
        //System.out.println("move" + role.name + ":" + x + "," + y + "," + nextX + ", " + nextY);
        //#endif
        int nextCol = nextX >> 4;
        int nextRow = nextY >> 4;
        if(nextCol < 0 || nextCol >= cols || nextRow < 0 || nextRow >= rows) {
            //那个位置根本不可以,已经超越边界了，不提供挪到边界的功能
            return;
        }
        int realDir = dir;
        if(role.speed < 0) {
            switch(dir) {
                case PaintUnit.UP:
                    realDir = PaintUnit.DOWN;
                    break;
                    
                case PaintUnit.DOWN:
                    realDir = PaintUnit.UP;
                    break;
                    
                case PaintUnit.LEFT:
                    realDir = PaintUnit.RIGHT;
                    break;
                case PaintUnit.RIGHT:
                    realDir = PaintUnit.LEFT;
                    break;
            }
        }
        
        //放弃角探测
        //直接在这条路上找移动的块
        switch(realDir) {
            case PaintUnit.UP:
                moveUp(role, x, y, nextX, nextY);
                break;
                
            case PaintUnit.DOWN:
                moveDown(role, x, y, nextX, nextY);
                break;
                
            case PaintUnit.LEFT:
                //先计算其可移动范围
                moveLeft(role, x, y, nextX, nextY);
                break;
                
            case PaintUnit.RIGHT:
                //先计算其可移动范围
                moveRight(role, x, y, nextX, nextY);
                break;
        }
        
        nextX = role.nextX;
        nextY = role.nextY;
        //#if PRINTDEBUG == 1
        //System.out.println("调整后的位置:" + nextX + ", " + nextY);
        //#endif
        nextCol = nextX >> 4;
        nextRow = nextY >> 4;
        role.setPosition(nextX, nextY);
        //#if PRINTDEBUG == 1
        //System.out.println("最终更新坐标:" + nextX + "," + nextY);
        try {
            if(!canMoveTile(nextX >> 4, nextY >> 4)) {
                throw new RuntimeException("名字="+role.name);
            }
        }catch(Exception ex) {
            ex.printStackTrace();
        }
        //#endif
    }
    
    private boolean isActorMoveToEvent(Role role, int x, int y)
    {
        if (role == GameContext.actor && getEvent(x, y) != null && ((GameContext.script == null || GameContext.script.isEnd())))
        {
            return true;
        }        
        return false;
    }
    
    private void moveUp(Role role, int x, int y, int nextX, int nextY) {
        int col = x >> 4;
        int row = y >> 4;
        int nextRow = nextY >> 4;
        //处理在可以整除地块的逻辑
        if((x - ((x >> 4) << 4) == 0) && (!canMoveTile((x - 1) >> 4, nextRow) || !canMoveTile(col, nextRow)))
        {
            role.nextX = x;
            role.nextY = y;
            lookUpPath(role);
            return;
        }
        
        int rowCnt = Math.abs(row - nextRow) + 1;
        int irow = 0;
        
        irow = row;
        for(int i = 0; i < rowCnt; i++) {
            if(!canMoveTile(col, irow - 1)) {
                break;
            }
            if(isActorMoveToEvent(role, col << 4, (irow) << 4))
            {
                break;
            }
            irow--;
        }

        int testY = (irow << 4) + BOX_HEIGHT;
        if(nextY < testY) {
            nextY = testY;
        }

        //主角没动
        if(nextY != y || role.status != MOVE_STATUS) {
            role.nextX = nextX;
            role.nextY = nextY;
            return;
        }
        role.nextX = nextX;
        role.nextY = nextY;
        lookUpPath(role);
    }
    
    private void moveDown(Role role, int x, int y, int nextX, int nextY) {
        int col = x >> 4;
        int row = y >> 4;
        int nextRow = nextY >> 4;

        if((x - ((x >> 4) << 4) == 0) && (!canMoveTile((x - 1) >> 4, nextRow) || !canMoveTile(col, nextRow)))
        {
            role.nextX = x;
            role.nextY = y;
//            System.out.println("x=" + x + "; y=" + y + "; nextX=" + nextX + "; nextY=" + nextY);
            lookUpPath(role);
            return;
        }

        int rowCnt = Math.abs(row - nextRow) + 1;
        int irow = 0;
        
        irow = row + 1;
        for(int i = 0; i < rowCnt; i++) {
            if(!canMoveTile(col, irow)) {
                break;
            } 
            if(isActorMoveToEvent(role, col << 4, (irow - 1) << 4))
            {
                break;
            }
            irow++;
        }

        int testY = (irow << 4) - 1;
        if(nextY > testY) {
            nextY = testY;
        }

        //主角没动
        if(nextY != y || role.status != MOVE_STATUS) {
            role.nextX = nextX;
            role.nextY = nextY;
            return;
        }
        role.nextX = nextX;
        role.nextY = nextY;
        lookUpPath(role);
    }
    
    private void moveLeft(Role role, int x, int y, int nextX, int nextY) {
        int col = x >> 4;
        int row = y >> 4;
        int nextCol = nextX >> 4;

        if((y - ((y >> 4) << 4) == 0) && (!canMoveTile(nextCol, (y - 1) >> 4) || !canMoveTile(nextCol, row)))
        {
            role.nextX = x;
            role.nextY = y;
            lookUpPath(role);
            return;
        }

        int colCnt = Math.abs(col - nextCol) + 1;
        int icol = 0;
        int testX = 0;
        
        icol = col;
        for(int i = 0; i < colCnt; i++) {
            if(!canMoveTile(icol - 1, row)) {
                break;
            }
            if(isActorMoveToEvent(role, (icol) << 4, row << 4))
            {
                break;
            }
            icol--;
        }

        testX = (icol << 4) + HALF_BOX;
        if(nextX < testX) {
            nextX = testX;
        }

        //主角没动
        if(nextX != x || role.status != MOVE_STATUS) {
            role.nextX = nextX;
            role.nextY = nextY;
            return;
        }
        role.nextX = nextX;
        role.nextY = nextY;
        lookUpPath(role);
    }
    
    /**
     * 向右移动
     * @param role
     * @param x
     * @param y
     * @param nextX
     * @param nextY
     * @param testNext 是否向右探测
     */
    private void moveRight(Role role, int x, int y, int nextX, int nextY) {
        int col = x >> 4;
        int row = y >> 4;
        int nextCol = nextX >> 4;

        if((y - ((y >> 4) << 4) == 0) && (!canMoveTile(nextCol, (y - 1) >> 4) || !canMoveTile(nextCol, row)))
        {
            role.nextX = x;
            role.nextY = y;
            lookUpPath(role);
            return;
        }        

        int colCnt = Math.abs(col - nextCol) + 1;
        int icol = 0;
        int testX = 0;
        
        icol = col + 1;
        for(int i = 0; i < colCnt; i++) {
            if(!canMoveTile(icol, row)) {
                break;
            } 
            if(isActorMoveToEvent(role, (icol - 1) << 4, row << 4))
            {
                break;
            }
            icol++;
        }

        testX = (icol << 4) - HALF_BOX;
        if(nextX > testX) {
            nextX = testX;
        }

        //主角没动
        if(nextX != x || role.status != MOVE_STATUS) {
            role.nextX = nextX;
            role.nextY = nextY;
            return;
        }
        role.nextX = nextX;
        role.nextY = nextY;
        lookUpPath(role);
    }
    
    private void lookUpPath(Role role) {
        int nextPos = getNext(role);
        if(nextPos == 0) {
            return;
        }
        role.nextX = nextPos >> 16;
        role.nextY = nextPos & 0xffff;
    }
    
    private boolean isCanMove(int x, int y, int nextX, int nextY, int dir)
    {
        //判断是否可以移动
        //计算移动方向上两个角的点
        int roleStartCol = x >> 4;
        int roleStartRow = y >> 4;
        int roleEndCol = nextX >> 4;
        int roleEndRow = nextY >> 4;
        switch(dir) {
            case PaintUnit.UP:
                for(int index = roleEndRow; index <= roleStartRow; index++)
                {
                    if(!canMoveTile(roleStartCol, index))
                    {
                        return false;
                    }
                }
                break;
                
            case PaintUnit.DOWN:
                for(int index = roleStartRow; index <= roleEndRow; index++)
                {
                    if(!canMoveTile(roleStartCol, index))
                    {
                        return false;
                    }
                }
                break;
                
            case PaintUnit.LEFT:
                for(int index = roleEndCol; index <= roleStartCol; index++)
                {
                    if(!canMoveTile(index, roleStartRow))
                    {
                        return false;
                    }
                }
                break;
                
            case PaintUnit.RIGHT:
                for(int index = roleStartCol; index <= roleEndCol; index++)
                {
                    if(!canMoveTile(index, roleStartRow))
                    {
                        return false;
                    }
                }
                break;
        }       
        return true;
    }
    
    /**
     * 查找周围那个位置可以行走
     * 012
     * 3X4
     * 567
     * @param role
     * @return
     */
    private int getNext(Role role)
    {
        if(role.status != Role.MOVE_STATUS)
        {
            return 0;
        }
        if(role.x != role.nextX && (role.dir == Role.LEFT || role.dir == Role.RIGHT))
        {
            return 0;
        }
        if(role.y != role.nextY && (role.dir == Role.UP || role.dir == Role.DOWN))
        {
            return 0;
        }
        
        int x = role.x;
        int y = role.y;
        int col = x >> 4;
        int row = y >> 4;
        if(col < 1 || row < 1 || col >= cols - 1 || row >= rows - 1)
        {
            return 0;
        }
        boolean isUpPosCanMove = false;
        boolean isDownPosCanMove = false;
        boolean isLeftPosCanMove = false;
        boolean isRightPosCanMove = false;
        int upY = y - role.speed;
        if(upY < 0)
        {
            upY = 0;
        }
        int downY = y + role.speed;
        if(downY > height)
        {
            downY = height;
        }
        int leftX = x - role.speed;
        if (leftX < 0)
        {
            leftX = 0;
        }
        int rightX = x + role.speed;
        if(rightX > width)
        {
            rightX = width;
        }                     
        isUpPosCanMove = isCanMove(role.x, role.y, x, upY, Role.UP) && RoleManager.getInstance().canMove(x, upY);
        isDownPosCanMove = isCanMove(role.x, role.y, x, downY, Role.DOWN) && RoleManager.getInstance().canMove(x, downY);
        isLeftPosCanMove = isCanMove(role.x, role.y, leftX, y, Role.LEFT) && RoleManager.getInstance().canMove(leftX, y);
        isRightPosCanMove = isCanMove(role.x, role.y, rightX, y, Role.RIGHT) && RoleManager.getInstance().canMove(rightX, y);
        
        boolean isLeftUpCanMove = false;
        boolean isRightUpCanMove = false;
        boolean isLeftDownCanMove = false;
        boolean isRightDownCanMove = false;
        x = 0;
        y = 0;
        switch(role.dir)
        {
            case PaintUnit.UP:
                isLeftUpCanMove = canMoveTile(col - 1, row - 1);
                isRightUpCanMove = canMoveTile(col + 1, row - 1);
                if(isLeftPosCanMove && isLeftUpCanMove)
                {
                    x = role.x - role.speed;
                    y = role.y;
                }
                if(isRightPosCanMove && isRightUpCanMove)
                {
                    x = role.x + role.speed;
                    y = role.y;
                }
                break;
            case PaintUnit.DOWN:
                isLeftDownCanMove = canMoveTile(col - 1, row + 1);
                isRightDownCanMove = canMoveTile(col + 1, row + 1);
                if(isLeftPosCanMove && isLeftDownCanMove)
                {
                    x = role.x - role.speed;
                    y = role.y;
                }
                if(isRightPosCanMove && isRightDownCanMove)
                {
                    x = role.x + role.speed;
                    y = role.y;
                }                
                break;
            case PaintUnit.LEFT:
                isLeftDownCanMove = canMoveTile(col - 1, row + 1);
                isLeftUpCanMove = canMoveTile(col - 1, row - 1);
                if(isDownPosCanMove && isLeftDownCanMove)
                {
                    y = role.y + role.speed;
                    x = role.x;
                }
                if(isUpPosCanMove && isLeftUpCanMove)
                {
                    y = role.y - role.speed;
                    x = role.x;
                }
                break;
            case PaintUnit.RIGHT:
                isRightUpCanMove = canMoveTile(col + 1, row - 1);
                isRightDownCanMove = canMoveTile(col + 1, row + 1);
                if(isDownPosCanMove && isRightDownCanMove)
                {
                    y = role.y + role.speed;
                    x = role.x;
                }
                if(isUpPosCanMove && isRightUpCanMove)
                {
                    y = role.y - role.speed;
                    x = role.x;
                }
                break;         
        }
        return (x << 16) | y;
    }
    
    /**
     * 检查主角身体框的一个角是否位于可移动的Tile里面
     * 如果不是，那么就表明这一步迈的距离太大，就适当缩减步长
     * 举例来说：本来一步迈6个点远，可是距离前面的块有4个点
     * 就只迈4个点就好了
     * @param actor
     * @param ptx 角坐标
     * @param pty 
     * @param nextX 期望的主角移动坐标
     * @param nextY
     * @return
     */
    private boolean checkBoxAngle(Role role, int dir, int ptx, int pty) {
        int ptCol = ptx >> 4;
        int ptRow = pty >> 4;
        if(!canMoveTile(ptCol, ptRow)) {
            if(!canMoveTile(role.x >> 4, role.y >> 4))
            {
                return true;
            }
            switch(dir) {
                case PaintUnit.UP:
                    role.nextY += (TILE_SIZE - (pty & 0x0F));
                    break;
                case PaintUnit.DOWN:
                    role.nextY -= (pty & 0x0F) + 1;
                    break;
                    
                case PaintUnit.LEFT:
                    role.nextX += (TILE_SIZE - (ptx & 0x0F));
                    break;
                    
                case PaintUnit.RIGHT:
                    role.nextX -= (ptx & 0x0F) + 1;
                    break;
            }
//            GameContext.groundMat.updateUnit(role, nextX, nextY);
            return true;
        }
        return false;
    }
        
    /**
     * 是否可以跳跃
     * @return
     */
    public boolean isCanJump()
    {
        int col = GameContext.actor.x >> 4;
        int row = GameContext.actor.y >> 4;
        int dir = GameContext.actor.dir;
        if(col < 0 || row < 0) {
            return false;
        }
        
        if(col >= cols || row >= rows) {
            return false;
        }
        final int JUMP_ID = 5;
        return phyData[offsets[col] + row] >= JUMP_ID && ((dir + JUMP_ID) == phyData[offsets[col] + row]);
    }
    
    /**
     * 返回飞行到位置的
     * @return 高16位col数低16位行数
     */
    public int getFlyPosition()
    {
        final int CAN_NOT_MOVE = 3;
        int col = GameContext.actor.x >> 4;
        int row = GameContext.actor.y >> 4;
        int dir = GameContext.actor.dir;
        do
        {
            if (dir == PaintUnit.UP)
            {
                row--;
            }
            if (dir == PaintUnit.DOWN)
            {
                row++;
            }
            if (dir == PaintUnit.LEFT)
            {
                col --;
            }
            if (dir == PaintUnit.RIGHT)
            {
                col ++;
            }
        }
        while (phyData[offsets[col] + row] == CAN_NOT_MOVE);
        switch(dir)
        {
            case PaintUnit.UP:
                row--;
                break;
            case PaintUnit.DOWN:
                row++;
                break;
            case PaintUnit.LEFT:
                col --;
                break;
            case PaintUnit.RIGHT:
                col ++;
                break;                
        }
        return (col << 16) | row;
    }
    
    public int getJumpLength()
    {
        final int CAN_NOT_MOVE = 3;
        int col = GameContext.actor.x >> 4;
        int row = GameContext.actor.y >> 4;
        int dir = GameContext.actor.dir;
        int count = 0;
        do
        {
            if (dir == PaintUnit.UP)
            {
                row--;
            }
            if (dir == PaintUnit.DOWN)
            {
                row++;
            }
            if (dir == PaintUnit.LEFT)
            {
                col --;
            }
            if (dir == PaintUnit.RIGHT)
            {
                col ++;
            }
            count++;
        }
        while (phyData[offsets[col] + row] == CAN_NOT_MOVE);
        switch(dir)
        {
            case PaintUnit.UP:
                row--;
                break;
            case PaintUnit.DOWN:
                row++;
                break;
            case PaintUnit.LEFT:
                col --;
                break;
            case PaintUnit.RIGHT:
                col ++;
                break;
        }
        if(phyData[offsets[col] + row] == CAN_NOT_MOVE)
        {
        }
        else
        {
            count ++;            
        }
        return (count << 4);
    }
    
    /**
     * 判断这个格子是否可站立
     * @param col
     * @param row
     * @return
     */
    public boolean canMoveTile(int col, int row)
    {
        if(col < 0 || row < 0) {
            return false;
        }
        
        if(col >= cols || row >= rows) {
            return false;
        }
        final int CAN_NOT_MOVE = 3;
        return phyData[offsets[col] + row] != CAN_NOT_MOVE;
    }
    
    public void loadPhysicalLayer(DataInputStream dataIn) throws IOException {
        phyData = new byte[tiles];
        int eleCnt = dataIn.readShort();
        final int CACHE = 20;
        int icache = 0;
        int[] instantCache = new int[CACHE];
        final int CAN_INSTANT = 4;
        for(int iele = 0; iele < eleCnt; iele++) {
            int col = dataIn.read() & 0xFF;
            int row = dataIn.read() & 0xFF;
            int offset = offsets[col]+row;
            phyData[offset] = (byte)(dataIn.read() & 0xFF);
            if(phyData[offset] == CAN_INSTANT)
            {
                instantCache[icache] = (col << 16) | (row);
                icache++;
            }   
        }
        
        instants = new int[icache];
        System.arraycopy(instantCache, 0, instants, 0, icache);
    }

    /**
     * 计算在此方向上是否可以直接到达会通过多个块
     * @param dir
     * @param curCol
     * @param curRow
     * @param nextCol
     * @param nextRow
     * @return
     */
    public boolean canMoveMoreTile(int dir, int curCol, int curRow, int nextCol, int nextRow)
    {   
        if(!(canMoveTile(curCol, curRow) && canMoveTile(nextCol, nextRow))) {
            //起点或者终点不可达
            return false;
        }
        
        if(curCol == nextCol)
        {
            if(nextRow < curRow)
            {
                int a = nextRow;
                nextRow = curRow;
                curRow = a;
            }
            
            for(int index = curRow; index <= nextRow; index++)
            {
                if(phyData[offsets[curCol] + index] == PHYSICAL_DATA)
                {
                    return false;
                }
            }
            return true;
        }
        
        if (nextCol < curCol)
        {
            int a = nextCol;
            nextCol = curCol;
            curCol = a;
        }
        
        for (int index = curCol; index <= nextCol; index++)
        {
            if (phyData[offsets[index] + curRow] == PHYSICAL_DATA)
            {
                return false;
            }
        }
        return true;
    }
    
    private static void loadAnimationLayer(DataInputStream dataIn) throws IOException {
        final int FLY_UNIT = 1;
        final int GROUND_UNIT = 0;
        final int FLOOT_UNIT = 2;
    
        //抛弃动画列表文件名，目前暂时不用，只在地图编辑器里被采用
        int aniCnt = dataIn.readShort();
        AnimationManager aniMgr = AnimationManager.getInstance();
        
        for(int iani = 0; iani < aniCnt; iani++) {
            PaintUnit unit = new PaintUnit();
            short grpId = dataIn.readShort();
            aniMgr.getAnimation(grpId, unit);
            unit.actId = dataIn.readShort();
            
            unit.resetFrame();
            
            int col = dataIn.read() & 0xFF;
            int row = dataIn.read() & 0xFF;
            unit.x = (short)((col << 4) + (TILE_SIZE >> 1));
            unit.y = (short)((row + 1) << 4);          
            
            byte flyFlag = dataIn.readByte();
            switch(flyFlag)
            {
                //飞行的漂浮物
                case FLY_UNIT:
                    GameContext.flyMat.addUnit(unit);
                    break;
                    
                //和人物有遮挡逻辑的
                case GROUND_UNIT:
                    GameContext.groundMat.addUnit(unit);
                    break;
                    
                //一定被主角遮挡的
                case FLOOT_UNIT:
                    GameContext.undergroundMat.addUnit(unit);
                    break;                   
            }
        }
    }
    
    public void saveScene(DataOutputStream dataOut) throws IOException {
        dataOut.writeUTF(fileName);
        dataOut.writeShort(id);
        int engineCnt = engines.size();
        dataOut.writeShort(engineCnt);
        for(int i = 0; i < engineCnt; i++) {
            dataOut.writeShort(engines.key(i));
            ScriptEngine script = (ScriptEngine)engines.value(i);
            
            dataOut.writeUTF(script.fileName);
        }
        if(enginesBuffer == null)
        {
            dataOut.writeShort(0);
        }
        else
        {
            int engineBufferCnt = enginesBuffer.size();
            dataOut.writeShort(engineBufferCnt);
            for (int i = 0; i < engineBufferCnt; i++)
            {
                dataOut.writeShort(enginesBuffer.key(i));
                ScriptEngine script = (ScriptEngine) enginesBuffer.value(i);
                dataOut.writeUTF(script.fileName);
            }
        }
        saveChannelMarks(dataOut);
    }
    
    public void loadScene(DataInputStream dataIn) throws IOException {
        channelMarkPos = new long[20];
        channelMarkPaintUnit = new PaintUnit[20];
        channelMarkCnt = 0;
        fileName = dataIn.readUTF();
        id = dataIn.readShort();
        load(fileName);
        engines.clear();
        enginesBuffer = null;
        Hashtable scriptMap = new Hashtable();
        
        int engineCnt = dataIn.readShort();
        for(int i = 0; i < engineCnt; i++) {
            short pos = dataIn.readShort();
            String scriptFile = dataIn.readUTF();
            ScriptEngine script = (ScriptEngine)scriptMap.get(scriptFile);
            if(script == null) {
                script = new ScriptEngine(scriptFile);
                scriptMap.put(scriptFile, script);
            }
            
            engines.put(pos, script);
        }
        scriptMap.clear();
        int bufferCount = dataIn.readShort();
        if(bufferCount != 0)
        {
            enginesBuffer = new HashtableShort();
            for (int index = 0; index < bufferCount; index++)
            {
                short pos = dataIn.readShort();
                String scriptFile = dataIn.readUTF();
                ScriptEngine script = (ScriptEngine) scriptMap.get(scriptFile);
                if (script == null)
                {
                    script = new ScriptEngine(scriptFile);
                    scriptMap.put(scriptFile, script);
                }
                enginesBuffer.put(pos, script);
            }
        }
        loadChannelMarks(dataIn);
    }
    
    /////////////////////////////////////////////////////////////////////////////
    //寻路相关代码
    /**
     * 初始化寻路数据
     * @param width 列数
     * @param height 行数
     * @param moveSpace 物理层数据
     */
    public void initPath()
    {
        pathMat = new byte[tiles];
        head = new int[MAX_SEARCH_STEPS * PaintUnit.DIR_CNT];
        headData = new int[MAX_SEARCH_STEPS * PaintUnit.DIR_CNT];
    }
    
    /**
     * 在飞行单位上指引方向
     * @param npc 
     * @param x
     * @param y
     * @param dstX
     * @param dstY
     * @return
     */
    public int findFlyWayDir(Npc npc, int x, int y, int dstX, int dstY) {
        int col = x;
        int row = y;
        int dstCol = dstX;
        int dstRow = dstY;
        
        int xDir = PaintUnit.NO_DIR;
        if(col != dstCol) {
            if(col < dstCol) {
                xDir = PaintUnit.RIGHT;
            } else {
                xDir = PaintUnit.LEFT;
            }
        }
        int yDir = PaintUnit.NO_DIR;
        if(row != dstRow) {
            if(row < dstRow) {
                yDir = PaintUnit.DOWN;
            } else {
                yDir = PaintUnit.UP;
            }
        }
        //如果原方向可以的话 就继续吧
        if(npc.dir == xDir || npc.dir == yDir)
        {
            return npc.dir;
        }
        
        if(xDir == PaintUnit.NO_DIR) {
            if(yDir == PaintUnit.NO_DIR) {
                return PaintUnit.NO_DIR;
            }
            
            return yDir;
        }
        
        if(yDir == PaintUnit.NO_DIR) {
            return xDir;
        }
        
        if(xDir == npc.dir) {
            return yDir;
        }
        
        return xDir;
    }    
    
    public int findWayDir(Npc npc, int startCol, int startRow, int endCol, int endRow, boolean isFlying)
    {
        if((startCol == endCol) && (endRow == startRow))
        {
            return PaintUnit.NO_DIR;
        }
        if(isFlying)
        {
            return findFlyWayDir(npc, startCol, startRow, endCol, endRow);
        }
        this.endCol = endCol;
        this.endRow = endRow;
        
        setMapData(endCol, endRow, END_POS);
        setMapData(startCol, startRow, START_POS);
        
        isFindPath = false;
        int x = startCol;
        int y = startRow;
        //中间件
        int doX;
        int doY;
        int next = 0;
        for(int index = 0; index < MAX_SEARCH_STEPS; index++)
        {            
            int father = 0;
            if(isFindPath)
            {
                break;
            }
            if(index == 0)
            {
                father = -1;
            }
            else
            {
                father = headIndex;
                next = getNext(headIndex);
                x = getX(headIndex);
                y = getY(headIndex);
                setPrevious(headIndex, -1);
                setNext(headIndex, -1);
                //标志
//                setFlag(headIndex, 1);
                if(next >= 0)
                {
                    setPrevious(next, -1);
                    headIndex = next;
                }
                else
                {
                    headIndex = 0;
                }
            }
            //处理上面
            doX = x;
            doY = y - 1;
            logicPos(doX, doY, father);
            //处理下面
            doX = x;
            doY = y + 1;
            logicPos(doX, doY, father);
            //处理左边
            doX = x - 1;
            doY = y;
            logicPos(doX, doY, father);
            //处理右边
            doX = x + 1;
            doY = y;
            logicPos(doX, doY, father);
//            log();
        }
        //看看有多少个
        int count = 0;
        int countIndex = headIndex;
        int endX = 0;
        int endY = 0;
        while(countIndex != -1)
        {
            endX = getX(countIndex);
            endY = getY(countIndex);
            countIndex = getFather(countIndex);
            count++;
        }
        
        //数据清零
        setMapData(startCol, startRow, 0);
        setMapData(endCol, endRow, 0);
        for(int index =0; index < head.length; index++)
        {
            setMapData(getX(index), getY(index), 0);
        }
        
        headIndex = 0;
        writeIndex = 0;
        
        if(endX == 0 && endY == 0)
        {
            return PaintUnit.NO_DIR;
        }
        if(startCol > endX)
        {
            return PaintUnit.LEFT;
        }
        else if(startCol < endX)
        {
            return PaintUnit.RIGHT;
        }
        else if(startRow > endY)
        {
            return PaintUnit.UP;
        }
        else if(startRow < endY)
        {
            return PaintUnit.DOWN;
        }
        return PaintUnit.NO_DIR;        
    }    
    
    /**
     * 处理每一个节点，吸入链表
     * @param x
     * @param y
     */
    private boolean logicPos(int x, int y, int father)
    {
        //找寻到了不处理
        if(isFindPath)
        {
            return true;
        }
        if(x < 0 || x >= cols || y < 0 || y >= rows)
        {
            return false;
        }
        //物理层
        if(phyData[offsets[x] + y] == PHYSICAL_DATA)
        {
            return false;
        }
        //如果找到了目的地
        if(getMapData(x, y) == END_POS)
        {
            isFindPath = true;
        }
        //当前节点运算过了
//        if(getMapData(x, y) - WRITE_ID > 0 && getFlag(getMapData(x, y) - WRITE_ID) != 0)
        if(getMapData(x, y) != 0 && getMapData(x, y) != END_POS)
        {
            return false;
        }
        int next = -1;
        int previous = -1;
        int weigh = getWeight(x, y);
        int flag = 0;
        writeNode(x, y, father, next, previous, weigh, flag);
        return false;
    }
    
    /**
     * 获取地图上节点的索引
     */
    private byte getMapData(int col, int row)
    {
        int num = offsets[col] + row;
        return pathMat[num];
    }
    
    /**
     * 设置地图上节点的索引
     * @param col
     * @param row
     * @param data
     */
    private void setMapData(int col, int row, int data)
    {
        int num = offsets[col] + row;
        pathMat[num] = (byte) (data & 0xff);
    }    
    
    /**
     * 计算权重
     * @param col
     * @param row
     * @return
     */
    private int getWeight(int col, int row)
    {
        return Math.abs(col - endCol) + Math.abs(row - endRow);
    }
    
    /**
     * 写入节点
     */
    private void writeNode(int x, int y, int father, int next, int previous, int weigh, int flag)
    {
        setMapData(x, y, writeIndex + WRITE_ID);
        headData[writeIndex] = ((x & 0xff) << 16) | ((y & 0xff) << 8) | (father & 0xff);
        head[writeIndex] = ((next & 0xff) << 24) | ((previous & 0xff) << 16) | ((weigh & 0xff) << 8) | (flag & 0xff);
        compareWeightAndSet(writeIndex, weigh);
//        if(isFind)
//        {
//            headIndex = writeIndex;
//        }
        writeIndex++;
    }
    
    /**
     * 比较权重并且设置
     * @param curIndex 比较的索引
     * @param previous 比较的权重
     */
    private void compareWeightAndSet(int curIndex, int weigh)
    {
        /**
         * 第一次写入无需比较
         */
        if(headIndex == 0 && writeIndex == headIndex)
        {
            return;
        }
        /**
         * 获取第一个权重
         */
        int nextIndex = headIndex;
        //找寻下一个权重
        int getWeigh = getWeight(nextIndex);
        //插入链表最前面
        if(getWeigh >= weigh)
        {
            setNext(curIndex, nextIndex);
            setPrevious(nextIndex, curIndex);
            headIndex = curIndex;
            return;
        }
        //是否在结尾插入
        boolean isEnd = false;
        while(getWeigh <= weigh)
        {
            int getNextIndex = getNext(nextIndex);
            if(getNextIndex < 0)
            {
                //到尾巴了
                isEnd = true;
                break;
            }
            getWeigh = getWeight(getNextIndex);
            nextIndex = getNextIndex;
        }       
        //上一个节点的next
        int prevousNext = 0;
                
        //将上一个节点的next设置成当前节点
        if(!isEnd && getPrevious(nextIndex) != -1 && getNext(getPrevious(nextIndex)) != -1)
        {
//            prevousNext = getNext(getPrevious(nextIndex));
            prevousNext = getPrevious(nextIndex);
        }
        if(isEnd)
        {
            prevousNext = nextIndex;
        }        
        setNext(prevousNext, curIndex);
        
        //把权重较小的节点previous设置
        setPrevious(curIndex, prevousNext);
        if (!isEnd)
        {
            //把权重较大的节点的previous设置
            setPrevious(nextIndex, curIndex);
            //把权重较小的节点next设置
            setNext(curIndex, nextIndex);
        }
        //如果插在最前面的话，头指针改变
        if(!isEnd && nextIndex == headIndex)
        {
            headIndex = curIndex;
        }
    }
   
    /**
     * 获取x轴索引
     * @param index
     */
    private byte getX(int index)
    {        
        return (byte) ((headData[index] >> 16) & 0xff);
    }

    /**
     * 获取y轴索引
     * @param index
     */    
    private byte getY(int index)
    {
        return (byte) ((headData[index] >> 8) & 0xff);
    }
    
    /**
     * 获取父节点
     * @param index
     * @return
     */
    private byte getFather(int index)
    {
        return (byte) (headData[index] & 0xff);
    }
    
    /**
     * 设置下一个的节点数据
     */
    private void setNext(int index , int next)
    {
        head[index] &= 0xffffff;
        head[index] |= (next & 0xff) << 24;
    }
    
    /**
     * 获取下一个节点索引
     * @param index
     * @return
     */
    private byte getNext(int index)
    {
        return (byte) ((head[index] >> 24) & 0xff);
    }
    
    /**
     * 获取上一个的节点数据
     * @param index
     * @return
     */
    private byte getPrevious(int index)
    {
        return (byte) ((head[index] >> 16) & 0xff);
    }

    /**
     * 设置上一个的节点数据
     */    
    private void setPrevious(int index, int previous)
    {
        head[index] &= 0xff00ffff;
        head[index] |= (previous & 0xff) << 16;        
    }
    
    /**
     * 获取链表里面的权限
     * @param index
     */
    private byte getWeight(int index)
    {
        return (byte) ((head[index] >> 8) & 0xff);
    }
    //寻路相关代码结束
    ///////////////////////////////////////////////////////////////////////////
}
