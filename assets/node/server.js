
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({ port: 9000 });


var pass_family ='#school';//Mot de passe pour envoyer un message à tout le monde

var followed_list = [];//Ceci garde la lste des personnes qui veulent être suivies
var followed_list_name = [];//Ceci garde le nom des persommes suivis
var follower_list = [];//Ceci garde la liste des suiveurs de chaque suivi
var follower_list_followed = [];//Ceci garde la liste général des followers par followed
    //follower_list et follower_list_followed son de même dimenssion

var tab_verif_connected = [];//Ce tableau verifi les followed qui son connectés

var io = require('socket.io').listen(8089,{ log: false }) ;

console.log('kwiki Ready');

// Upon a socket connection, a socket is created for the life of the connection
io.sockets.on('connection', function (socket) {

	/////////////////////////////////////////////////////////////////////////////////
	
	//ici l'user veut être suivi
    socket.on('follow_me', function (data) {

    	//Je le retire de la liste des suiveurs s'il est présent
    	var index_follower =  follower_list.indexOf(data.user_id);

    	if(index_follower!==-1){//S'il est dans la liste des follower on le retire

    		//On le fait laisser la room de l'acien followed
    	    socket.leave('page_url_'+follower_list_followed[index_follower]);
            
            follower_list.splice(index_follower, 1);

            follower_list_followed.splice(index_follower, 1);
    	}

		socket.join('page_url_'+data.user_id);//On créé la room qui servirra à dire quel est l'article qui est lu en temps actuel

		var index_followed = followed_list.indexOf(data.user_id); //On regarde aussi s'il est dans la liste des suivis

		if(index_followed==-1){ //S'il n'est pas dedans on l'inscrit
		    followed_list.push(data.user_id);//On ajoute cette personne dans la liste des suivies
		    followed_list_name.push(data.username);
		}

	    socket.broadcast.emit('follow_him',{'followedIds':followed_list,'followedName':followed_list_name});//On dit à tout le monde dans l'application que cet user veut être suivi(user_id et username)
    });


    //On obtien la liste des followers dès la première conexion
    socket.on('get_leader',function(){

	    socket.emit('follow_him',{'followedIds':followed_list,'followedName':followed_list_name});//On dit à tout le monde dans l'application que cet user veut être suivi(user_id et username)
    })
	
	
	//Ici on suit de près les articles d'un followed
	socket.on('fellow', function (data) {
	   
	    socket.broadcast.to('page_url_'+data.room).emit('change_article',data); //emit to 'room' except this socket
	});
	
	
	
	//Ici on joint un followed en s'inscrivant dans son canal
	socket.on('jointe',function (data) { //(user_id,followed_id)

		//Si on le suivait
		 //je le sort de la liste des suivies
            var index_followed = followed_list.indexOf(data.follower_id);

            if(index_followed!==-1){
 
                followed_list.splice(index_followed, 1);
                followed_list_name.splice(index_followed, 1);

                //On le sort de sa prpre room
                socket.leave('page_url_'+data.follower_id);
		        socket.broadcast.to('page_url_'+data.follower_id).emit('end_follow',data);//On le dit à tout le monde

		        socket.broadcast.emit('follow_him',{'followedIds':followed_list,'followedName':followed_list_name});//on met à jour la liste des suivis
            }

        leave_other_room(data.follower_id);//Je le sort des suiveurs ailleurs

	    socket.join('page_url_'+data.followed_id);//on le fait joindre la room

	    follower_list.push(data.follower_id);
	    follower_list_followed.push(data.followed_id);   

		//On fait plus un dans le nombre de personne suivant le followed
		socket.broadcast.to(data.followed_id).emit('more_person');

		//On prend l'article actuellement lu
		socket.broadcast.to(data.followed_id).emit('get_article',data.follower_id);			
    });
	
	
	
	//Ici on récupère en réponse larticle actuellement consulté
	socket.on('this_article',function(result) {
	
	    socket.broadcast.to(result.follower_id).emit('this_page',result.page_url);       	
	});
	
	
	
	//On demande si un user et en ligne
	socket.on('is_online',function(data) {
	
	    socket.broadcast.to(data.receiver).emit('your_number',data);
     	
	});
	
	
	//On récupère le numéro d'un user
	socket.on('my_number',function(data) {
	
	    socket.broadcast.to(data.sender).emit('his_number',data);    	
	});
	
	//On récupère le numéro d'un user
	socket.on('my_tof',function(data) {
	
	    socket.broadcast.to(data.interloc_num).emit('da_tof',data);    	
	});
	
	
	
	
	//Ici le followed ne veut plus être suivi
	socket.on('follow_no', function (user_id) {

	    leave_my_room(user_id);
    });
		 
	
	//Ici je sort le followed de la room
	socket.on('leave_it', function(user_id) {
	   
	   leave_other_room(user_id);
	})
	


	function leave_other_room(user_id){//POur sortir de la room d'une autre personne

        //On regarde s'il suit quelqu'un
		var follower_index = follower_list.indexOf(user_id);

		if(follower_index!==-1){ //S'il suit quelqu'un

            //On le fait laisser la room l'ancien followed
            socket.leave('page_url_'+follower_list_followed[follower_index]);

            //On fait fait -1 dans le nombre de personne suivant le followed
		    socket.broadcast.to('page_url_'+follower_list_followed[follower_index]).emit('less_person');

		    //je retire son id du tableau des suiveurs
		        var longueur = follower_list_followed.length;

		        for(i=0;i<=longueur;i++){

		        	var follower_id = follower_list[i];

		        	if(follower_id == user_id){

		        		follower_list_followed.splice(i,1);
		        		follower_list.splice(i,1);
		        	}
		        }
		}
	}


	socket.on('leave_my_room',function(user_id){

		leave_my_room(user_id);
	})


	function leave_my_room(user_id){ //Fonction pour laisser sa propre room

        //je sort de mon groupe créé en envoyant un emit qui marque la fin du follow
		socket.broadcast.to('page_url_'+user_id).emit('end_follow',user_id);
		 
		 socket.leave('page_url_'+user_id);//Je sort en beauté

		 //Je le retire de la liste des followed
		  var followed_index = followed_list.indexOf(user_id);
		    
		    if(followed_index!==-1){ //S'il fesait parti des suivis

                //Je retire son id du tableau des suivis
		        followed_list.splice(followed_index, 1);
		        followed_list_name.splice(followed_index, 1);

		        //je retire son id du tableau des suiveurs
		        var longueur = follower_list_followed.length;

		        for(i=0;i<=longueur;i++){

		        	var followed_id = follower_list_followed[i];

		        	if(followed_id == user_id){

		        		var index_to_move = follower_list_followed.indexOf(followed_id);

		        		follower_list_followed.splice(index_to_move,1);
		        		follower_list.splice(index_to_move,1);
		        	}
		        }
		    }
		     
		 socket.broadcast.emit('follow_him',{'followedIds':followed_list,'followedName':followed_list_name});//on met à jour la liste des suivis
	}


	//Ici on vérifie tout le temps si les suivies sont connectées.Si ce n'est pas le cas on les supprime
	
    socket.on('disconnect',function(){

    	setIntervalFollowed();
    })

	function setIntervalFollowed(){

           //On envoi un message à tous les followed
            for(i=0;i<=followed_list.length;i++){

        	    socket.broadcast.to(followed_list[i]).emit('verif_connected');

        	    tab_verif_connected = [];//On efface les anciennes données de ce tableau

        	    verif_connected();
            }  
	}

	socket.on('response_verif_connected',function(user_id){

        tab_verif_connected.push(user_id);
	})
	

    function verif_connected(){

    	setTimeout(function(){

    		if(tab_verif_connected.length>0){

    			for(i=0;i<=followed_list.length;i++){

    				var index_to_move = tab_verif_connected.indexOf(followed_list[i]);

    				if(index_to_move==-1){//Si il ya un followed qui n'a pas répondu je le supprime

                        followed_list.splice(i,1);
                        followed_list_name.splice(i,1);

		                socket.broadcast.emit('follow_him',{'followedIds':followed_list,'followedName':followed_list_name});//on met à jour la liste des suivis
    				}
    			}
    		}

    	},10000);
    }
	
	
	//C'est ici qu'on gère tchat dans les rooms lors des following
	socket.on('send_message', function (data) {
	   
	    //On envoi ce message à tout le monde dans a room
		socket.broadcast.to('page_url_'+data.room).emit('new_message',data);   
	})
	
	
	//mise à jours des notifications
	socket.on('news', function () {
	
	    socket.broadcast.emit('new_note');

    });
	
	//on signal ici qu'on rédige un message à son interlocuteur
	socket.on('im_typing',function(data){
	
	    socket.broadcast.to(data.interloc).emit('is_typing',data);
	});
	
	
	//on signal ici qu'on ne rédige plus un message à son interlocuteur
	socket.on('im_not_typing',function(data){
	
	    socket.broadcast.to(data.interloc).emit('not_typing',data);
	});
	
	
	/////////////////////////////////////////////DUO  chat/webrtc//////////////////////////////////////////////
    
	//Si l'user vient de se connecter j'ouvre une nouvelle room avec son numéro de téléphone
	socket.on('welcome', function (data) { 
	   
	   socket.join(data.my_numero);
	   socket.join(data.my_user_id);
		
    });


	//Si l'user se déconnecte je ferme sa room
    socket.on('bye', function (numero_room) {

	    socket.leave(numero_room);
    });


    //Si l'user recoit un nouveau message dans sa room personnel
    socket.on('new_message_duo', function (data) {

	    socket.broadcast.to(data.interloc_num).emit('toc_toc',data);
    });
	
	
	socket.on('dring_dring',function(data){//on recoit un nouvel appel chat video
	
       	socket.broadcast.to(data.interloc_num).emit('allo',data);
	});

	
	socket.on('busy',function(data){

		socket.broadcast.to(data.sender_num).emit('busy',data);
	})
	
	
	socket.on('call_accepted',function(data){
	
       	socket.broadcast.to(data.sender_num).emit('he_accepted',data);
	});
	
	
	socket.on('call_rejected',function(data){
	
       	socket.broadcast.to(data.sender_num).emit('he_rejected',data);
	});
	
	
	socket.on('end_call',function(data){
	
       	socket.broadcast.to(data.interloc_num).emit('call_ended',data);
	});

	socket.on('zut',function(data){
	
       	socket.broadcast.to(data.interloc_num).emit('wat',data);
	});
    

    socket.on('stop_belling',function(data){

    	socket.broadcast.to(data.interloc_num).emit('stop_belling',data);
    })


    socket.on('guest',function(sender){

    	socket.broadcast.emit('guest',sender);
    })

    socket.on('guest_response',function(data){

    	socket.broadcast.to(data.sender).emit('guest_response',data);
    })
	
	/////////////////////////////////////////////DUO  chat/webrtc Fin//////////////////////////////////////////////




	/////////////////////////////////////////////Connexion//////////////////////////////////////////////
	socket.on('verif_connexion',function(data){

		socket.join(data.number+'_room');

		socket.broadcast.to(data.number).emit('echo',data.number);
	})

	socket.on('im_connected',function(sender){

		socket.broadcast.to(sender+'_room').emit('im_connected');

		socket.leave(sender+'_room');
	})
	/////////////////////////////////////////////Connexion//////////////////////////////////////////////

    


    //Reception du message par tout le monde//////////////////////////////////////////////////////////////
    socket.on('to_all_family',function(form_data){

    	//On regarde si l'utilisteur à les droits de passer le messag à tout le monde.
    	//Pour cela on regarde juste si il à mis le mot de passe dans le message à la fin "#school"
    	var message = form_data.message;//On prend le message
        
        var temp = new Array();
        
        temp = message.split(' ');//On le découpe en utilisant [espace] comme délimiteur

        var last_string_id = temp.length-1;

        var last_string = temp[last_string_id];

        if(last_string == pass_family){

            var message_finale = form_data.message.replace(pass_family,' ');

            var final_form = {message:message_finale,slogan:form_data.slogan,out_line:form_data.out_line};

            socket.emit('to_all_family',final_form);

            //On envoi le message en socket à tout le monde
			socket.emit('famille',final_form);

			socket.broadcast.emit('famille',final_form);
        }else{

        	socket.emit('forbid');
        }
    })
    //Reception du message par tout le monde//////////////////////////////////////////////////////////////


    //Ici on supprime la liste de ceux qui e sont pas connecté mais qui sont la liste des personnes désirantes d'être suivies


});
