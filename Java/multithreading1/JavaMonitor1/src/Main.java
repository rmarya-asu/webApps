/**
 * Created by ruthar on 9/11/17.
 */
class Account {
    int numTransactions = 0;
    int balance = 0;
    public synchronized void deposit(int amount){
        balance+=amount;
        numTransactions++;
    }
    public synchronized int getBalance(){
    return balance;
    }

    public synchronized int getNumTransactions(){
        return numTransactions;
    }
}

class Transaction extends Thread{
    Account account;
    int id;
    public Transaction(int id,Account account){
        super("Transaction#"+id);
        this.account = account;
        this.id = id;
    }
    public void run(){
        System.out.println("Transaction Started #"+id);
        for(int i =0;i<=3;i++){
            account.deposit(id*i);
        }
    }
    public static void main(String args[]) throws Exception{
     Account account = new Account();
     for (int i =0;i<=3;i++){
         Transaction trans = new Transaction(i,account);
         trans.start();

     }
     //Thread.sleep(1000);
        System.out.println("balance in account : " +account.getBalance());
    }
}

