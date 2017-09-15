package edu.asupoly.ser421;
import java.net.*;
import java.io.*;

public class SimpleGrabURL {
    URL url;

    URLConnection conn = null;
    BufferedReader instream = null;
    OutputStream os = null;

    public SimpleGrabURL(String urlString){
        System.out.println("Grabbing for "+urlString);
        try {
            URL url = new URL("http://"+ urlString);
            conn = url.openConnection();
            conn.connect();
            os = new FileOutputStream(url.getHost()+".txt");
            instream = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = null;
            while ((line = instream.readLine()) != null) {
                os.write(line.getBytes());
                System.out.println(line);
            }
        }
        catch (IOException exc) {
            exc.printStackTrace();
        }
        finally {
            try {
                if (instream != null) instream.close();
                if(os!=null) os.close();
            }
            catch (Throwable t) {
                t.printStackTrace();
            }
        }

    }

 }
