/*
 * Copyright(c) 2009 北京飞思畅想科技有限责任公司
 * All rights reserved.
 */

package fishfly.guard.arpg;

/**
 *
 * @author 何召卫@fishfly.com
 */
public class Condition implements Operand {
    //相等
    public final int EQ = 0;

    //不相等
    public final int NEQ = 1;

    //小于
    public final int LT = 2;

    //小于等于
    public final int LET = 3;

    //大于
    public final int GT = 4;

    //大于等于
    public final int GET = 5;

    //逻辑与
    public final int AND = 6;

    //逻辑或
    public final int OR = 7;
    
    Operand leftOp;
    Operand rightOp;
    int op;
    
    public void load(FishStream dataIn) {
        leftOp = getOperand(dataIn);
        
        op = dataIn.readShort();
        
        rightOp = getOperand(dataIn);
    }
    
    public int getValue() {
        switch(op) {
            case EQ:
                return doEq();
                
            case NEQ:
                return doNeq();
                
            case LT:
                return doLt();
             
            case LET:
                return doLet();
                
            case GT:
                return doGt();
            
            case GET:
                return doGet();
            
            case AND:
                return doAnd();
                
            case OR:
                return doOr();
        }
        return 0;
    }
    
    public Operand getOperand(FishStream dataIn) {
        int type = dataIn.readShort();
        Operand operand = null;
        if(type == COND_OP)
        {
            operand = new Condition();
        }
        else
        {
            operand = new AllOperand(type);
        }
        operand.load(dataIn);
        return operand;
    }
    
    public int doEq() {
        //#if PRINTDEBUG == 1
        System.out.println("Condition:" + leftOp.getValue() + ":" + rightOp.getValue());
        //#endif
        boolean equal = leftOp.getValue() == rightOp.getValue();
        int a = equal ? 1 : 0;
        return a;
    }
    
    public int doNeq() {
        boolean equal = leftOp.getValue() != rightOp.getValue();
        return equal ? 1 : 0;
    }
    
    public int doLt() {
        boolean equal = leftOp.getValue() < rightOp.getValue();
        return equal ? 1 : 0;
    }
    
    public int doLet() {
        boolean equal = leftOp.getValue() <= rightOp.getValue();
        return equal ? 1 : 0;
    }
    
    public int doGt() {
        boolean equal = leftOp.getValue() > rightOp.getValue();
        return equal ? 1 : 0;
    }
    
    public int doGet() {
        boolean equal = leftOp.getValue() >= rightOp.getValue();
        return equal ? 1 : 0;
    }
    
    public int doAnd() {
        boolean equal = leftOp.getValue() > 0 && rightOp.getValue() > 0;
        return equal ? 1 : 0;
    }
    
    public int doOr() {
        boolean equal = leftOp.getValue() > 0 || rightOp.getValue() > 0;
        return equal ? 1 : 0;
    }
    
    //#if PRINTDEBUG == 1
    public String toString() {
        StringBuffer buf = new StringBuffer();
        buf.append(leftOp.toString());
        buf.append(' ');
        switch(op) {
            case NEQ:
                buf.append("!=");
                break;
                
            case EQ:
                buf.append("==");
                break;
            case GT:
                buf.append(">");
                break;
            case GET:
                buf.append(">=");
                break;
            default:
                buf.append("OP(" + op + ")");
                break;
        }
        
        buf.append(' ');
        buf.append(rightOp.toString());
        return buf.toString();
    }
    //#endif
}
