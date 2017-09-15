/**
 * Created by ruthar on 9/12/17.
 * //this is a proxy server.
 */
package edu.asupoly.ser421;
import java.net.*;
import java.io.*;

public class Lab1Part2 {
    /**
     * java edu.asupoly.ser421.Lab1Part2 8000 www.asu.edu 80 1024 5000
     * java edu.asupoly.ser421.Lab1Part2 8989 http://localhostq 80 1024 5000*
     * client class main function -> used to make request to the local server.
     * @param args :
     *             local_port: the port number
     *             url: the second is the url to the server
     *             httpPort :the port number http is running on
     *             cacheSize: the size of cache to be used in kbs
     *             delay : a value in milliseconds representing an artificial delay to introduce on each request
     *
     */
    public static void main(String [] args){
        int local_port = Integer.parseInt(args[0]);
        String urll = args[1];
        int httpPort = Integer.parseInt(args[2]);
        int cacheSize = Integer.parseInt(args[3]);
        int delay = Integer.parseInt(args[4]);
        HttpURLConnection connection = null;
        BufferedReader instream = null;

        try {
            //Create connection
            URL url = new URL("http://localhost:" + local_port+"/"+urll);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            System.out.println("\nSending 'GET' request to URL : " + "http://localhost:"+local_port+"/" +urll);
//            System.out.println("Response Code : " + responseCode);
            instream = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line = null;
            while ((line = instream.readLine()) != null) {
                System.out.println(line);
            }

        } catch (Exception e) {
            e.printStackTrace();
           // return null;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }


    }
}
