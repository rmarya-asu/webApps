package com.ruthar;


class Worker implements Runnable{
    protected int id;
    public Worker(int assignedId){
        id = assignedId;
    }
    @Override
    public void run() {
    for (int loop=0;loop<5;loop++){
        System.out.println("Hello from "+id+" loop = "+loop);
    }
    }
}
public class Main {

    public static void main(String[] args) {
	// write your code here
        //int times = Integer.parseInt(args[0]);
        int times = 10;
        for(int loop = 0;loop<times;loop++){
            Runnable worker = new Worker(loop);
            Thread task = new Thread(worker,"Task#"+loop);
            task.start();
        }
    }
}
