package com.example.yu810.new_project.dummy;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Helper class for providing sample content for user interfaces created by
 * Android template wizards.
 * <p>
 * TODO: Replace all uses of this class before publishing your app.
 */
public class DummyContent {

    /**
     * An array of sample (dummy) items.
     */
    public static final List<DummyItem> ITEMS = new ArrayList<DummyItem>();

    /**
     * A map of sample (dummy) items, by ID.
     */
    public static final Map<String, DummyItem> ITEM_MAP = new HashMap<String, DummyItem>();

    private static final int COUNT = 25;

    static {
        // Add some sample items.
//        for (int i = 1; i <= COUNT; i++) {
//            addItem(createDummyItem(i));
//        }
    }

    public static void addItem(DummyItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);
    }

    public static DummyItem createDummyItem(String id,String Column1, String Column2, String Column3
            ,String Column4,String Column5,String Column6,String Column7) {
        return new DummyItem(id,Column1, Column2
                , Column3, Column4
                ,String.valueOf(Column5),Column6,Column7);
    }

    //转账记录栏位太多，所以单独写一个
    public static DummyItem DummyItemDeposit(String id,String Column1, String Column2, String Column3
            ,String Column4,String Column5,String Column6,String Column7,String Column8,String Column9,String Column10,String Column11
            ,String Column12,String Column13,String Column14,String Column15
            ,String Column16,String Column17,String Column18,String Column19,String Column20,String Column21, String Column22) {
        return new DummyItem(id,Column1, Column2
                , Column3, Column4
                ,String.valueOf(Column5),Column6,Column7,Column8,Column9,Column10,Column11
                ,Column12,Column13,Column14,Column15
                ,Column16,Column17,Column18,Column19,Column20,Column21,Column22);
    }

    /**
     * A dummy item representing a piece of content.
     * Grid Item 显示的栏位，api返回值没有key，命名按照显示顺序排列
     */
    public static class DummyItem {
        public final String id;
        public final String Column1;
        public final String Column2;
        public final String Column3;
        public final String Column4;
        public final String Column5;
        public final String Column6;
        public final String Column7;
        public String Column8;
        public String Column9;
        public String Column10;
        public String Column11;
        public String Column12;
        public String Column13;
        public String Column14;
        public String Column15;
        public String Column16;
        public String Column17;
        public String Column18;
        public String Column19;
        public String Column20;
        public String Column21;
        public String Column22;

        public DummyItem(String id,String Column1,String Column2,String Column3
                ,String Column4,String Column5,String Column6,String Column7) {
            this.id = id;
            this.Column1 = Column1;
            this.Column2 = Column2;
            this.Column3 = Column3;
            this.Column4 = Column4;
            this.Column5 = Column5;
            this.Column6 = Column6;
            this.Column7 = Column7;
        }

        public DummyItem(String id,String Column1,String Column2,String Column3
                ,String Column4,String Column5,String Column6,String Column7
                ,String Column8,String Column9,String Column10,String Column11
                ,String Column12,String Column13,String Column14,String Column15
                ,String Column16,String Column17,String Column18,String Column19,String Column20
                ,String Column21, String Column22) {
            this.id = id;
            this.Column1 = Column1;
            this.Column2 = Column2;
            this.Column3 = Column3;
            this.Column4 = Column4;
            this.Column5 = Column5;
            this.Column6 = Column6;
            this.Column7 = Column7;
            this.Column8 = Column8;
            this.Column9 = Column9;
            this.Column10 = Column10;
            this.Column11 = Column11;
            this.Column12 = Column12;
            this.Column13 = Column13;
            this.Column14 = Column14;
            this.Column15 = Column15;
            this.Column16 = Column16;
            this.Column17 = Column17;
            this.Column18 = Column18;
            this.Column19 = Column19;
            this.Column20 = Column20;
            this.Column21 = Column21;
            this.Column22 = Column22;
        }

        @Override
        public String toString() {
            return Column1;
        }
    }
}
