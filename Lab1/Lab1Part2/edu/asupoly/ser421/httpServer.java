/**
 * Created by ruthar on 9/12/17.
 */
package edu.asupoly.ser421;
import java.io.*;
import java.net.*;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.StringTokenizer;

public class httpServer {

    //
    public static void main(String args[]) {
        if (args.length != 1) {
            System.out.println("Usage: SimpleWebServer <port>");
            System.exit(1);
        }

        httpServer server = new httpServer(Integer.parseInt(args[0]));

    }
    public httpServer(int port){

        ServerSocket server = null;
        Socket sock = null;

        try {

            //*** Open the server socket on the specified port
            //*** Loop forever accepting socket requests
            //***   Get the response bytes from createResponse
            //***   Write the bytes to the socket's output stream
            //***   close streams and socket appropriately

            server = new ServerSocket(port);

        } catch (IOException ex) {
            ex.printStackTrace();
        }

        while (server.isBound() && !server.isClosed()) {
            System.out.println("Ready...");
            try {
                sock = server.accept();
                createClientThread(sock);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * Take the newly accepted socket and make it a thread by passing it to
     * inner class ClientHandler which implements Runnable; subsequently start
     * the thread up so it can be processed.
     *
     * @param sock
     */
    private void createClientThread(Socket sock) {
        Thread thread = new Thread(new ClientHandler(sock));
        thread.start();
    }

    class ClientHandler implements Runnable {

        //establish a new socket to read client input from (via BufferedReader)
        InputStream in = null;
        OutputStream out = null;
        private String
                OK = "HTTP/1.0 200 OK",
                NOT_FOUND = "HTTP/1.0 404 Not Found",
                BAD_REQUEST = "HTTP/1.0 400 Bad Request",
                FORBIDDEN = "HTTP/1.0 403 Forbidden",
                SERVER_ERROR = "HTTP/1.0 500 Internal Server Error";
        /**
         * ClientHandler is the constructor that accepts a client socket & chains it
         * to an input and output stream. These are used by the run method to create
         * a response for the client.
         *
         * @param clientSocket
         */
        public ClientHandler(Socket clientSocket) {

            try {
                //Set local socket to clientSocket received via constructor
                in = clientSocket.getInputStream();
                out = clientSocket.getOutputStream();

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }//end constructor

        public byte[] createResponse(InputStream inStream) {
            final String CRLF = "\r\n";
            byte[] response = null;
            BufferedReader in = null;
            try {
                in = new BufferedReader(new InputStreamReader(inStream, "UTF-8"));
                // Get header and save the filename from the GET line:
                //    example GET format: GET /index.html HTTP/1.1
                String filename = null;
                String line = in.readLine();
                System.out.println("Received: " + line);
                if (line != null && !line.trim().equals("")) {
                    StringTokenizer st = new StringTokenizer(line);
                    if (st.nextToken().equals("GET") && st.hasMoreTokens()) {
                        filename = st.nextToken();
                        if (filename.startsWith("/")) {
                            filename = filename.substring(1);
                            //filename+=".txt";
                            System.out.println("filename :"+filename);
                        }
                    }
                }
                System.out.println("FINISHED REQUEST, STARTING RESPONSE for filename  = "+filename);
                //if URL.hostname -> is the filename used for cache is not present, then call the graburl and serve the data.
                //else, just read the data from the file and serve it.
                FileInputStream fis = null;
                boolean fileExists = true;
                try {
                    fis = new FileInputStream(filename+".txt");
                } catch (FileNotFoundException e) {
                    fileExists = false;
                    System.out.println("file not found nf");
                    //if file is not found
                    SimpleGrabURL urlgrabber = new SimpleGrabURL(filename);
                    //got the file and saved, now serve it.
                    fileExists = true;
                }
                String serverLine = "Server: Simple Java Http Server";
                String statusLine = null;
                String contentTypeLine = null;
                String entityBody = null;
                String contentLengthLine = "error";
                if (fileExists) {
                    System.out.println("FILE ECISTSSS");
                    statusLine = "HTTP/1.0 200 OK" + CRLF;
                    contentTypeLine = "Content-type: " + "text/html"
                            + CRLF;
                    contentLengthLine = "Content-Length: "
                            + (new Integer(fis.available())).toString() + CRLF;
                } else {
                    statusLine = "HTTP/1.0 404 Not Found" + CRLF;
                    contentTypeLine = "text/html";
                    entityBody = "<HTML>"
                            + "<HEAD><TITLE>404 Not Found</TITLE></HEAD>"
                            + "<BODY>404 Not Found"
                            + "<br>usage:http://yourHostName:port/"
                            + "fileName.html</BODY></HTML>";
                }

                // Send the status line.
                out.write(statusLine.getBytes());
                System.out.println(statusLine);

                // Send the server line.
                out.write(serverLine.getBytes());
                System.out.println(serverLine);

                // Send the content type line.
                out.write(contentTypeLine.getBytes());
                System.out.println(contentTypeLine);

                // Send the Content-Length
                out.write(contentLengthLine.getBytes());
                System.out.println(contentLengthLine);

                // Send a blank line to indicate the end of the header lines.
                out.write(CRLF.getBytes());
                System.out.println(CRLF);

                // Send the entity body.
                if (fileExists) {
                    sendBytes(fis, out);
                    fis.close();
                } else {

                    out.write(entityBody.getBytes());
                }

            } catch (Exception e) {
                e.printStackTrace();
                response = ("<html>ERROR: " + e.getMessage() + "</html").getBytes();
                response = "HELLO".getBytes();
            }
            System.out.println("RESPONSE GENERATED!");
            return response;
        }

        /**
         * Read bytes from a file and return them in the byte array. We read in
         * blocks of 512 bytes for efficiency.
         */
        public byte[] readFileInBytes(File f)
                throws IOException {

            byte[] result = new byte[(int) f.length()];

            try {
                new FileInputStream(f).read(result);
            } catch (Exception ex) {
                ex.printStackTrace();
            }

            return result;
        }

        private void sendBytes(FileInputStream fis, OutputStream os)
                throws Exception {

            byte[] buffer = new byte[1024];
            int bytes = 0;

            while ((bytes = fis.read(buffer)) != -1) {
                System.out.println("whats in the buffer?");
                System.out.println(buffer);
                os.write(buffer, 0, bytes);
            }
        }

        @Override
        public void run() {
            SimpleGrabURL urlGrabber = new SimpleGrabURL("Http://www.google.com");
            System.out.println("Starting thread");
            try {
                createResponse(in);
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                try {
                    in.close();
                    out.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }

            System.out.println("Ending thread");
        }
    }
}