kwiizi
======

Kwiki allows educational institutions to obtain millions of articles, books and videos for education while providing a communication platform where you can even make video calls. All without internet connection.

Kwiizi is a server-client application whose purpose is to bring digital contents in school without internet coverage.
It also allows different connected users to chat and launch video calls, all without internet connection in a local network.

We are going to show you how to install it on a Linux server.

You can use a Raspberry Pi as a server without any problem if you wish because the project is originally developed to run on the Raspberry PI.

Installation Procedure
======================


What follows requires that you have a fairly good level on Linux servers because we'll just list the packages to install and configure, and in last place, the installation of the application itself Kwiizi.

Install the package normally needed
===================================
Packages to install on your seveur are:
- Apache (for running PHP and MySQL);
- NodeJS;

Now install the application
===========================
- Download and unzip the deposit of kwiizi on Github
- Send the file contents unziped the root directory of your server;
- Now among these files you must specify the IP adress of your server in a configuration file located in the following path
    application / config / constatnts.php
   search this line
   define ('Hoster', 'localhost');
   Replace 'localhost' with the IP address of your server
- Create a database with a name of your choice and install the tables my_database.sql file located in the directory /use_this_database at the root of your server.
- Enter the name of your database and all information relating to his connection in the application/config/database.php file
  Be sure you have filled database informations corresponding to your server in the following line on this file;
  $db['default']['hostname'] = 'localhost';
  $db['default']['username'] = 'root';
  $db['default']['password'] = '';
  $db['default']['database'] = 'kwiki';
  
- Now download the zim file of wikipedia of your choice at: http://download.kiwix.org/zim/wikipedia/;
- Put it in a directory of your choice in your serveur.Be sure that the zim file have been indexed before.Follow the step index your zim file on this page http://www.kiwix.org/wiki/Kiwix-index.
  This file indexing can take SEVERAL hours , sometimes even several days.
- Assuming you have your zim file with its index file, now we create a script at startup that will automatically start the database wikipedia when your server starts.For this, create a startup script under linux with the following line:
cd /var/www/kiwix-serve
./kiwix-server --port=8100 --daemon --index=/path_to_your_indexed_file/wikipedia.zim.idx /path_to_your_zim_file/wikipedia.zim
Beware: wikipedia.zim.idx and wikipedia.zim are exemple name of yours file.Remplace it with the right name of these files that you get.

- Now on va faire aussi demarrer le serveur NodeJS au démarrage.Pour cela créez un script de démarrage avec les étapes suivantes:
   First cd into /etc/init.d/ and create a new file called node-server.sh
   $ cd /etc/init.d
   $ sudo nano node-server.sh

   Next copy the following into it:
   Note to change the path_to_node_app variable to wherever your app lives.

   #! /bin/sh
# /etc/init.d/node-server
 
### BEGIN INIT INFO
# Provides:          node-server
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
### END INIT INFO
 
# I suppoz that www is your server root # 
path_to_node_app=/var/www/assets/node/server.js 
 
# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "* starting node-server * "
    echo "* starting node-server * [`date`]" >> /var/log/node-server.log
    /usr/local/bin/node $path_to_node_app >> /var/log/node-server.log 2>&1&
    ;;
  stop)
    echo "* stopping node-server * "
    echo "* stopping node-server * [`date`]" >> /var/log/node-server.log
    killall /usr/local/bin/node
    ;;
  *)
    echo "Usage: /etc/init.d/node-server {start|stop}"
    exit 1
    ;;
esac
 
exit 0


Next we need to make this file executable via :

$ chmod 755 ./node-server.sh
Now let’s tell the PI to execute this script and start the server on reboot:

$ update-rc.d node-server.sh defaults

Now it's finally over.You can now connect you via same network to your new server browser by typing the IP address of your server as url on your browser.

It's better for you to implement a DNS service on your server like the Kwiizi project in order facilitate the connecction of any user.

Voila! :)