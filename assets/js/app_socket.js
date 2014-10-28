$(document).ready(function(){
				
		//Appending HTML5 Audio Tag in HTML Body
		
            $('<audio id="chatAudio"><source src="'+$('#song').attr('url_chat')+'.ogg" type="audio/ogg"><source src="'+$('#song').attr('url_chat')+'.wav" type="audio/wav"><source src="'+$('#song').attr('url_chat')+'.mp3" type="audio/mpeg"></audio>').appendTo('body');
		
		    $('<audio id="bellAudio" loop><source src="'+$('#song').attr('url_bell')+'.ogg" type="audio/ogg"><source src="'+$('#song').attr('url_bell')+'.wav" type="audio/wav"><source src="'+$('#song').attr('url_bell')+'.mp3" type="audio/mpeg"></audio>').appendTo('body');
		
		var unread = 0;//le nombre de message non lus
		
		var time_waiting_call = 10000 //temps d'attente du lancement d'un appel

		var delay_search_connected = 3000;
		
		var all_messenger = display_my_message();

		
		var all_message = [];//ce tableau garde les conversations
		
		window.all_interloc = [];//ce tableau garde la liste des numéros avec qui je suis en conversation array numero(username,nbre_unread)
		
		window.all_interloc_tab = [];//ce tableau garde tous les interlocuteurs sous forme de taleau permettant une boucle
		
		
		var my_infos = my_info();
		
		var my_username,my_numero,my_user_id;
						
	//On enregistre les données de l'utilisateur en local(téléphone,username,userid,rtc_id)	
	function my_info()
	{
	    $.ajax({ 
    
		    url: $('.my_info').attr('url_info'),
                                        
		    type: 'POST',
							                            
			async : false,
							
			dataType:"json",
					                    
			error: function(data){
                                   my_username = $.jStorage.get('username');
                                   my_numero   = $.jStorage.get('numero');
                                   my_user_id  = $.jStorage.get('user_id');	
								   },
                                        
			success:function(data) {
			
			            if(data.statu =='connected')
						{					             
						
                            my_username = $.trim(data.username);
                            my_numero   = $.trim(data.numero);
                            my_user_id  = $.trim(data.user_id);			 
	                    }
					}
		});
	}
 
		
		//url de node js
		var socket  = io.connect($('#url_node').attr('url'));
		
		//On créee la room avec le numéro de téléphone
		socket.emit('welcome',{'my_numero':my_numero,'my_user_id':my_user_id});
		
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		
		var peer = new Peer(my_numero+'_pot', {host:$('#url_peer').attr('host'), port:$('#url_peer').attr('port'),debug: 3});
		
		
		peer.on('open', function(id) {
          console.log('My peer ID is: ' + id);
		 
        });
		
		
		
		
		/////////////////////////////////////////////DUO  chat/webrtc//////////////////////////////////////////////
 
		   //Cette fonction détecte les nouveaux messages de notification personnelle
		    socket.on('toc_toc',function(data){

             	toc_toc(data,'new')	;	
		    });
			
			
			//Cette fonction détecte les nouvelles photos envoyées
		    socket.on('da_tof',function(data){
             	
                humane.clickToClose = true;
                humane.timeout = 0;
				humane('<img src="'+data.image+'" /><br>'+data.sender_name);

                 //we play song
				$('#chatAudio')[0].play();				
		    });
			
			
			
			//on traite les nouveau message qui arrive
			function toc_toc(data,form)
			{
			   //S'il n'est pas en communication avec l'expéditeur
             var sender_num = $.trim(data.sender_num);
			 
			 var actual_friend = $.trim($('#interloc').attr('number'));
                
				if(sender_num !==actual_friend)
                {               
				  var user_name = '<br> <strong>'+$.trim(data.sender_name)+'</strong>';
				  
				  var message_text = $.trim(data.message);
				  
				  var notify = message_text + user_name;
				  
				  window.notificate_it(notify,'information','centerLeft');//j'affiche le message en notification
				  
				  window.unread_msg('add',1,data.sender_num,data.sender_name);//On ajoute +1 au nombre de message non lu
				  
				  //on ajoute dans la liste des messages si le my_pace est ouvert et qu'il n'est pas dans la liste qui est affiché
                }
                else
                {				
		          player_message(data.sender_name,data.message); //Affiche les message de mon interlocuteur en direct			  
				}
				
			 tab_recorder(data.sender_name,data.message,data.sender_num);

               //On enregistre le message en local
			   recorder_msg(data);


              //Ici on ajoute une nouvelle entré dans la liste qui s'affiche au my_space si c'est ouvert
			  push_number_to_my_space(data,'');

               //we play that song
               $('#chatAudio')[0].play();			   
			}
			
			
			//on regarde qui écrit le message actuellement
			socket.on('is_typing',function(data){
			
			  $('.pencil_'+data.sender_num).html($('#fade_pencil').html());				  		     
			});
			
			
			//on regarde qui écrit le message actuellement
			socket.on('not_typing',function(data){
			
			  $('.pencil_'+data.sender_num).html('');
			});
		   
		   
		   //cette socket demande mon numéro
		    socket.on('your_number', function (data) {
            
                socket.emit('my_number',{'interloc_num':my_numero,'interloc_name':my_username,'sender':data.sender});
			});
			
			
			
			//cette prend la socket contenant le numéro qui confirme que mon interlocuteur est en ligne
		    socket.on('his_number', function (data) {
			
			    if($.trim(data.interloc_name)!==$.trim($('#interloc').html()))
				{
				   $('#interloc').html(data.interloc_name);
				   
				   $('.username_'+data.interloc_num).html(data.interloc_name);
				}
            
                $('#interloc').attr('statu','on');
				
				$('#statu').html($('#statu_user').attr('connected'));

				window.memory_statu ='connected';
			});
		   
		   
       

        socket.on('disconnect', function () { //On fermet sa room
            
			socket.emit('bye',my_numero);
			
			//alert('disconnected');
        });
	
	    /////////////////////////////////////////////DUO  chat/webrtc  FIN//////////////////////////////////////////////
			
		 var incommer = incomming();
		 
		 //Cette fonction cherche les nouveaux message à la bdd dès la connection
		    function incomming()
			{
			   var this_data;
			   
			    $.getJSON($('#reader_msg').attr('url'), function(data) {
      
                    $.each(data, function(entryIndex, entry) {
					
					  this_data =  {'interloc_num':entry['interloc_num'],'sender_num':entry['sender_num'],'sender_name':entry['sender_name'],'message':entry['message']};
                    
					  toc_toc(this_data,'bdd');					
					});
	  
	            });
			}
		   
		   
		    function contact_memory(name,numero,nbre_msg)//cette fonction enregistre un contact en mémoire morte
		    { 
			  var interloc_num = window.all_interloc[numero];
			   
			    if(interloc_num == null)//son adresse n'existe pas
				{
				  var new_commer = [name,nbre_msg];
					   
				  window.all_interloc[numero] = [];//on l'inscrit donc
						
				  var this_interloc = window.all_interloc[numero];
						
				  this_interloc.push(new_commer);//et on garde le contact dans la mémoire
					   
				  window.all_interloc_tab.push(numero);//Et aussi dans le tableau numéroté
				}		       
		    }
		
		    

            window.my_space = 'off';
			
			window.open_my_space = function()
			{
				$('.follow_me').parent().fadeOut();
			
			    //on affiche l'espace de chat
	            var a = '<div class="yard_chat">';

	            var b ='<p id="statu" class="text-warning"></p><video id="caller" style="display:none;" class="facetime" src="" autoplay></video>';

	            var g='';

	            if(navigator.getUserMedia){

	            	console.log('woopii! support call');
	            }else{
	            	
	            	g = '<div class="alert no_video_call"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Warning!</strong> '+$('#alert').attr('no_call')+'<br>'+$('.browser').html()+'</div>';
	            }

	            var e = '<div id="texto" class="ui-widget"></div>';
                
	            var c = '<textarea autofocus class="typing_chat" rows="2" placeholder="...'+ $('.form_u_msg').attr('msg')+'"></textarea><br/>';

	            var d = '<button class="m-btn blue" type="button" id="make_call" make_call="'+$('.form_u_msg').attr('form_call') +'" end_call="'+$('.form_u_msg').attr('form_end_call') +'" ><i class="icon-facetime-video icon-white"></i>'+$('.form_u_msg').attr('form_call') +'</button>';


	            
				if(window.device=='mobile'){

					window.show_page();

	             a = '<div class="yard_chat_mobile">';

				}

                var f = '</div>';

	          $('.wiki_content').html(a+b+e+c+g+d+f);
	          $('.wiki_title').html($('<h1 id="interloc" number="'+window.sender_num+'" statu="" php="'+$('.form_u_msg').attr('php') +'">'+window.interloc_user+'</h1>').fadeIn());
			  $('#texto').html('');
			  $('#statu').html('');	

			    $(document).ready(function(){

                     //Ici on suis la conversation tchat
                    $('.typing_chat').focus(function() {

                        $('.typing_chat').keypress(function(){

			             //on précise qu'il est entrain d'écrire
				         socket.emit('im_typing',{'sender_num':my_numero,'interloc':$('#interloc').attr('number')});
                        });			
		
                         window.ready_com();   
                    });
                });		
			}


		window.ready_com = function(){

            $(document).unbind('keyup');

			$(document).keyup(function(evenement){
			
			                //on précise qu'il n'est plus entrain d'écrire
				            socket.emit('im_not_typing',{'sender_num':my_numero,'interloc':$('#interloc').attr('number')});
			
                            var message = $.trim($('.typing_chat').val());
	 
			                // Si evenement.which existe, codeTouche vaut celui-ci.
				            // Sinon codeTouche vaut evenement.keyCode.
                            var codeTouche = evenement.which || evenement.keyCode;
               
			                if(codeTouche==13)//Si le gars appui sur la touche entré du clavier
				            { 
				                if(message!=='')
					            {
					                message = $.trim(htmlspecialchars(message,'ENT_QUOTES'));
					  
					                //on l'ajoute dans la liste des conversations
					                contact_memory($('#interloc').text(),$('#interloc').attr('number'),0);					  
					  
					                var statu = $('#interloc').attr('statu');
						
						            tab_recorder(my_username,message,$('#interloc').attr('number'));
						
                                    //Donnée à envoyer						
						            var data_sender = {'interloc_num':$('#interloc').attr('number'),'sender_name':my_username,'sender_num':my_numero,'message':message};
						
						            if(statu=='on')//si la personne est connecté on envoi le message via node js
						            {
						                socket.emit('new_message_duo',data_sender);
						            }
						            else //si la personne est déconnectée on envoi le message via php pour la bdd
						            {
                                        $.ajax({

				                            type: 'post',

				                            url:  $('#interloc').attr('php'),
					
					                        async : true,
				
					                        data :data_sender,
									
					                        success:  function(data){	
										 
										        if($.trim(data)!=='done')//s'il ya une erreur on l'affiche en notification
                                                {
											       window.notificate_it(data,'error','bottomRight');
											    }											
				                            }
			                            });
                                    }
						
					                //On efface le formulaire
				                    $('.typing_chat').val('');
					  
					                player_message(my_username,message);
					  
					               //we play song
					               $('#chatAudio')[0].play();
                                }
                            }					
			            });
                
                $('#make_call').unbind('click');

                $('#make_call').click(function () {

                        	if(window.calling!==true){

                        		bell($.trim($('#interloc').attr('number')));//appel de la camera
            
			                    setTimeout(function () {
			
			                        if(window.calling!==true)
				                    {
		                              able_call();
				                    }
				
                                }, time_waiting_call)

                        	}else{

                        		if(window.existingCall)
			                    {
			                        window.existingCall.close();
			  
			                        socket.emit('end_call',{'interloc_num':$('#interloc').attr('number'),'sender_name':my_username,'sender_num':my_numero});
			  
			                        window.existingCall = null;
                                }else{

                                	//On stoppe la sonerie de l'aure coté
                                	socket.emit('stop_belling',{'interloc_num':$('#interloc').attr('number'),'sender_name':my_username,'sender_num':my_numero})
                                }         
		     
			                    able_call();
                        	}      
            });
		}



        socket.on('stop_belling',function(data){

        	abord_call()
        })
		


		window.calling = false;

		
		socket.on('call_ended',function(data){
		    
			window.notificate_it('<b>'+data.sender_name+'</b> '+$('#alert').attr('end_call'),'end_call','bottomRight');
			
			able_call();
			 
			window.existingCall = null;
		});
		
		

		function disable_call()
		{
            $('#make_call').attr('class','m-btn red');

		    $('#make_call').html('<i class="icon-facetime-video icon-white"></i> '+$('#make_call').attr('end_call'));

		    window.calling = true;
		}
		
		

		function able_call()
		{
			$('#make_call').attr('class','m-btn blue');

		    window.calling = false;

		    $('#make_call').html('<i class="icon-facetime-video icon-white"></i> '+$('#make_call').attr('make_call'));
		   
		  
		    $('#caller').fadeOut();
		    $('#caller').attr('src','');

		    window.close_my_space();

		    stop_bell();
		}
		

			
		window.close_my_space = function()
		{
			if(window.localStream)
			{
			    window.localStream.stop(); 
                window.localStream = null;
			}


			if($('#my_self').mozSrcObject) {
                $('#my_self').mozSrcObject.stop();
                $('#my_self').attr('src',null);
            } else {
                $('#my_self').attr('src','');
                $('#my_self').stop();
            }

				
			streamed = false;
				
			if(window.calling)
			{
				$('#end_call').click();
			}
		}

			
			
		function push_number_to_my_space(data,type)
		{
			if($('#interloc').attr('number')!==undefined){

				var this_interloc = $('.username_'+data.sender_num).html();

				if($.trim($('.list_unread').text())==''){

					$('.liste').html('<ul class="nav nav-list bs-docs-sidenav list_unread"><li class="nav-header"> '+$('.my_msg').html()+'</li></ul>');		
				}

				if(this_interloc==null)//si le sender n'est pas dans la liste
				{
					  //j'affiche le tout
					  var a ='<li class="active_ceci">';
											
					  var b ='<a href="#" class="see_msg" numero="'+data.sender_num+'">';
											
					  var c ='<i class="icon-chevron-right" style="float:right;"></i>';
					  
					    if(type=='new')
						{
                          $('#end_call').click();//on ferme tout appel éventuel	
						  
					     var d = '<span class="pencil_'+data.sender_num+'"></span>&nbsp;&nbsp;'
					    }
						else
						{
						 var d = '<span class="pencil_'+data.sender_num+'"></span><span class="label label-warning unread_user_'+data.sender_num+' "> 1 </span>&nbsp;&nbsp;'
						}
					  var e = '<span class="username_'+data.sender_num+'">'+data.sender_name+'</span>';
					  
					  var f = '</a></li>';
				    
                      $('.list_unread').append(a+b+c+d+e+f).fadeIn('slow');					 
					    
					  $.getScript($('#url_js_chat').attr('action')); //et on charge le fichier js qui prend en charge les nouveaux éléments
					  
					   //$(".liste").animate({"scrollTop": $('#texto')[0].scrollHeight}, "slow");//on scroll la liste tout en bas
				}
				else
				{
					//j'ajoute 1+ sur le nombre de message recu en direct
					if(data.sender_num !== $.trim($('#interloc').attr('number')))
					{
						var this_unread_num = $.trim($('.unread_user_'+data.sender_num).html())*1;
					   
					    if(this_unread_num ==0)//s'il il ny avait pas le nombre de message non lu je le créé
						{ 
						    if(type!=='new'){

						    	$('.pencil_'+data.sender_num).after('<span class="label label-warning unread_user_'+data.sender_num+'"> 1 </span>');
						    } 
						    					  
							$.getScript($('#url_js_chat').attr('action')); //et on charge le fichier js qui prend en charge les nouveaux éléments
						}
						else
						{
						  //on fait apparaitre le compteur de message
		                    $('.unread_user_'+data.sender_num).fadeIn();
						 
					        $('.unread_user_'+data.sender_num).html($.trim($('.unread_user_'+data.sender_num).html())*1+1);
					    }
					}
				}

				 window.ready_com();
			}				
		}
		
		//Compteur de message non lu
		    window.unread_msg = function (type,nbre,numero,name)
		    {
			  numero = $.trim(numero)*1;//forcon à ce que ce soit un entier
			  
			  //On défini exactement quel est le message que l'on veut traiter
			  var interloc_num = window.all_interloc[numero];
			  
		        if(type =='add')
				{
		          unread = ($.trim(unread)*1) + nbre; //ajoute +1 au nombre de message non lus  
					
				 //on affiche le nombre de message non lu
				  display_my_message();					
				    
					if(interloc_num == null)//son adresse n'existe pas
					{
					   contact_memory(name,numero,nbre);
					}
					else
					{
					   window.all_interloc[numero][0][1] = window.all_interloc[numero][0][1] + nbre;//on ajoute +1 sur le nombr ede message du sender
					}
				}
				
				

                if(type =='less')//si on veut diminuer le nombre de message non lus
				{	          
                    if(unread > 0)
                    {
					  unread = unread - nbre;//on diminue le nombre de message non lus
					  
					  display_my_message();//on affiche le nombre de message restant
					  
					    if(interloc_num!==null)
						{
						   var verification = window.all_interloc[numero][0][1];
						    
							if(verification >=0)
							{
                             window.all_interloc[numero][0][1] = window.all_interloc[numero][0][1] - nbre;
                            }							 
					    }						                     				  
                    }
                }				
		    }	
		   
		   
		   
		   
		   //Enregistreur de message
		    function recorder_msg(data)
		    {
		      //On regarde sil est dans la liste des conversations si non on l'inscrit			  
			  var contact_exist = window.contact_list(data.sender_name,data.sender_num);
			  
                if(contact_exist==true)
                { 
				  //regardons s'il a déjà recu une message de celui ci
				  var recu_num = $.jStorage.get('recu_'+data.sender_num,'nada');
				  
					if(recu_num=='nada')
					{
				      //si on a jamais recu ce numéro on l'enregistre
				      var msg_recu = [data.message];
				  
				      var recu = [data.sender_name,msg_recu];//on met le pseudo et on met le message
				   
				      $.jStorage.set('recu_'+data.sender_num,recu);//Et on garde tout
                      				  
					}
					else
					{
				       var msg_recu = recu_num[1];
					   		  
				       var nbre_msg = msg_recu.length;
				   
				        if(nbre_msg > 10)//alors on supprime le 1er des messages
					    {
					      msg_recu.shift();
					    }  
				   
				      msg_recu.push(data.message);//ajoutons le nouveau message dans le tableau
				   
				     var recu = [data.sender_name,msg_recu];//on met le pseudo et on met le message
				   
				     $.jStorage.set('recu_'+data.sender_num,recu);//Et on garde tout
					}
				}				
		    }
			
		

            
	        //C'est ici qu'on compte le nombre de message nons lu pour afficher
		    function display_my_message()
		    {
		      //On récupère en local le nombre de message non lu
		      var message = unread;
											
			    if(message > 0)  //Si oui
			    { 
			     $(".mes_msg").html(message);//On Donne le  nouveau nombre de message
			     $('.menu_msg').remove();//On le fait aussi sur le menu de haut
			     $('.menu_user').append('<span class="badge badge-warning menu_msg">'+message+'</span>');//On le fait aussi sur le menu de haut
			     $(".mes_msg").attr('class','badge badge-warning mes_msg');//on applique les nouveaux styles

			        function callback(){
			           $("#new_msger").effect('pulsate',1000,callback);
		            }
											
			     $("#new_msger").effect('pulsate',1000,callback);	//On fait clignoter les nouveaux messages
	
	                											  											   
			    }
											
			    if(message==0)//s'il nya  aucun nouveau msg
			    {
			      $(".mes_msg").attr('class','mes_msg');
			      $(".mes_msg").html('');
			      $('.menu_msg').remove();
				  $(".mes_msg").fadeOut();
			    }		
		    }

		
			

			//cette fonction enregistre un nouveau contact
			window.contact_list = function(username,numero)
			{ 
			  var contact_num = $.jStorage.get('contact_'+numero,'nada');//on essai d'obtenir le contact en local
			
			    if(contact_num =='nada')//ca n'a pas trouvé son contact
				{
				  //on enregistre le contact dans la liste des contacts
				  
				  var all_contact = $.jStorage.get('all_contact','nada');
				  
				    if(all_contact=='nada')//s'il ny avait jamais eu de liste de contact
					{
					  var new_all_contact = [numero];
					  
					  $.jStorage.set('all_contact',new_all_contact);//on enregistre le contact					  
					}
					else
					{
					   all_contact.push(numero);
					   
					   $.jStorage.set('all_contact',all_contact);//on enregistre le contact
					}
				
				 var contact_detail = [numero,username];
					
				 $.jStorage.set('contact_'+numero,contact_detail);//on enregistre le contact			 
                }
                else
                {
  				  var user_name = contact_num[1];//on extrait son username
				  
				    if(user_name==numero)//si on ne connait que son numéro de téléphone
					{
					  var contact_detail = [numero,username];					  
					}
					else
					{
					    if(username!==user_name)
						{
						  //On l'ajoute dans la liste des contacts	les détails de cet user pour question de mise à jour			  
			             var contact_detail = [numero,username];
						}
                        else
                        {
						  var contact_detail = [numero,user_name];
						}						
                    }
					
				 $.jStorage.set('contact_'+numero,contact_detail);//on enregistre le contact    				 
				}				
			    
			   return true;
			}
		
		
		
		
		  //cette fonction affiche les message en direct
		    function player_message(username,message)
			{
			   $('#texto').append('<div class="ui-chatbox-msg"><span class="text-info chat_name">'+$.trim(htmlspecialchars(username,'ENT_QUOTES'))+': </span><span class="muted">'+$.trim(htmlspecialchars(message,'ENT_QUOTES'))+'</span></div>');
			   
			   $("#texto").animate({"scrollTop": $('#texto')[0].scrollHeight}, "slow");
			}
			
			
		  //cette fonction enregistre les conversations dans un tableau
		    function tab_recorder(username,message,interloc)
			{
			   //on vérifie si la conversation vers l'interlocuteur existe
			   var tab_interloc = all_message[interloc];
			   
			   var tab_insert = [username,message];
			   
			    if(tab_interloc == null)//si elle n'existe pas on la crée donc
				{
				   all_message[interloc] = [];
				   
				   var new_tab = all_message[interloc];
				   
				   new_tab.push(tab_insert);
				}
				else //elle existe
				{
				   tab_interloc.push(tab_insert);
				}
			}	
			
			
		    
		//Lecteur de nouveaux messages dans la bdd
		   function lecteur_msg_bdd()
		    {
		       $.getJSON($('.my_info').attr('url_new_message'), function(data) {
									
					if(data.statu=='success')
					{
					  //On affiche les messages en notification
					}
                });
		    }
		
		
		//on ferme le myspace en cas en cas de besoin de l'utilisateur
		$('.close_my_space').click(function() {
		
		   window.close_my_space();
			 
		});
		
		
		
		
		//Ici on regarde le numéro écrit au cas où il clique sur le bouton de validation
		$('.call_number').click(function() { 
			    
				var numero = parseInt($('.number_phone').val());
				
				if(numero)
			    {
			    	//On ouvre la liste des contacts si ce n'est as ouvert
			    	if($('.list_unread').html()==null){

					    $('.contact').click();
				    }
				  numero = $.trim(htmlspecialchars(numero,'ENT_QUOTES'));
				  
				    if(numero==$.trim(my_numero))//si cest mon propre numéro
					{
					  window.notificate_it($('#alert').attr('form_u_number'),'error','bottomRight');
					}
					else
					{
				     $('#my_person').modal('hide');//on cache la fenêtre modal
				  
				     window.open_my_space();
					 
					 var data = {'sender_num':numero,'sender_name':numero};
					 
					 push_number_to_my_space(data,'new');
				  
				     $('#texto').html('');//je vide le chat			 
				  
				     make_call(numero);
                    }					 
				
				}else{

					window.notificate_it($('#alert').attr('form_none_number'),'error','bottomRight');

					$('#my_person').modal('hide');
				}		
		});
		
		
		//cette fonction lance une conversation
		function make_call(numero)
		{
		  var username = numero;
		  
		  window.contact_list(username,numero);//on enregistre le contact
	
		  //ToDo On ferme le formulaire d'user name
					  
		  //on vérifie s'il est dans la liste d'amie et on renvoi s'il est connecté
			$.ajax({

				    type: 'post',

				    url:  $('.number_phone').attr('verif_friend'),
					
					async : true,
					
					dataType:"json",
								
					data :{'numero':numero},
									
					success: function(data){
					                        $('#interloc').attr('statu','off');//on dit dabord qu'il n'est pas en ligne
										
										    //ces 2 lignes de code suivantes confirment s'il est en ligne ou pas
			                                window.online(numero);
			  			          
										     //on affiche son nom
											 $('#interloc').html($.trim(data.username));
											 
											 //on affiche son nom dans la lise aussi
											 $('.username_'+numero).html($.trim(data.username));
											 
											 //on sélectionne cette liste
											 //On désactive tout les boutons actifs
                                             $('.active').attr('class','active_ceci');
		 
		                                      //Et on active le bouton 
                                              $('.username_'+numero).parent().parent().attr('class','active');				
											 											 
											 window.contact_list(data.username,numero);

                                             $('#interloc').attr('number',numero);

                                            }

			});
			 
		 //ToDO n'oublion pas que s'il est n'est pas connecté le message va quand même parti quand il sera connecté(à revoir)
		}
		


		

		
		
		
		
		

		
        //cette fonction déclanche les notifications		
        window.notificate_it = function(text_msg,type,position) {
      
	     text_msg = text_msg.substr(0,150);//100 est le nombre limite de caractère
		 
		    switch(type)
			{
			    case 'information':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            timeout: 5000,
			            maxVisible: 3
                    });
				break;
				
				case 'error':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            maxVisible: 3,
						buttons: [
                        {    addClass: 'btn btn-warning', text: 'Ok', onClick: function($noty) {
                              $noty.close();
                            }							
                        }]
                    });
				break;
				
				case 'end_call':
				    noty({
                        text: text_msg,
                        type: 'warning',
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
						timeout: 3000,
			            maxVisible: 3,
						
                    });
				break;
				
				case 'notification':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            timeout: 5000,
			            maxVisible: 5,
                        buttons: [
                           {  addClass: 'btn btn-success', text: 'Prendre', onClick: function($noty) {
                                $noty.close();
							    accept_call();
					          }
                            },
							{
							    addClass: 'btn btn-warning', text: 'Rejeter', onClick: function($noty) {
                                    $noty.close();
							        reject_call();
                                }
							
							}]
                    });
				break;

                case 'error':
				    noty({
                        text: $('#alert').attr('error'),
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            maxVisible: 3,
						buttons: [
                        {    addClass: 'btn btn-warning', text: 'Ok', onClick: function($noty) {
                              $noty.close();
                            }							
                        }]
                    });
				break;				
			}
		}
		
		
		var lancement_verif_online;
		
		//On vérifie si mon interlocuteur est en ligne
		window.online = function(numero_interloc) {
		
		 //met son statu
		 $('#interloc').attr('statu','off');//on met dabord son statu à off avant de demander s'il est ligne
		 
		 $('#statu').html($('#statu_user').attr('disconnected'));
		  
		  //on demande si le numéro est connecté
		  is_online(numero_interloc);

		    if(lancement_verif_online!==true){

		    	var setIntervalAskOnline = setInterval(askOnline, 5000);

		    	lancement_verif_online=true;
		    }	  
		  
		  play_all_conversation(numero_interloc);
		  
		  able_call();		  	  
		}


		function askOnline(){

            if($('#interloc').attr('number')!==null){

            	is_online($.trim($('#interloc').attr('number')));

            	window.memory_statu ='disconnected';

            	setTimeout(change_statu,3000);
            }
		}

		function change_statu(){

			if(window.memory_statu=='disconnected'){

				$('#interloc').attr('statu','off');
				
				$('#statu').html($('#statu_user').attr('disconnected'));
			}
		}

         //on demande si le numéro est connecté
		function is_online(numero_interloc){

		  socket.emit('is_online',{'sender':my_numero,'receiver':numero_interloc});
		}
		
		
		//On récupère toutes les conversation
        function play_all_conversation(numero) {
		 	    
			var tab_conv = all_message[numero];//on a la conversation yipi
			
			if(tab_conv !== undefined)
			{			   
			   var nbre_tab_conv = tab_conv.length;
			   
			   var nbre_tab_interne;
			   
			    for(i=0;i < nbre_tab_conv;i++)
				{
				    tab_interne = tab_conv[i];
				   
				   $('#texto').append('<div class="ui-chatbox-msg"><span class="text-info chat_name">'+$.trim(tab_interne[0])+': </span><span class="muted">'+tab_interne[1]+'</span></div>'); 
				}
			}
		}
	
	//////////////////////////////////////////webrtc/////////////////////////////////////////////////

    var connected = false;
	
	var mediaStream;
		

       //Ici on envoi une photo à son interlocuteur
        $('#takePhoto').click(function() {
		
             var canvas = document.getElementById('photo_ready'); 
             
			 canvas.getContext('2d').drawImage(document.getElementById('my_self'),0,0,320,240);
              
			 var data = canvas.toDataURL('image/png');
              
			 $('#picture').attr('src', data);
			 
			 $('#my_space').fadeOut();//on ferme le my_space
		   		   
             $('#my_tof').modal('show');//on fait appataitre la photo
        });

  
    var streamed = false;//false si on déjà accès à sa caméra et true au cas contraire
	var person_on_stream = false;//false s'il n'est connecté à personne et un numéro de téléphone pour savoir à qui il est connecté
  
       
	    function bell(numero) // lancemant d'un appel
        {
		    if($('#interloc').attr('statu')=='on')//si mon interlocuteur est connecté
		    {
		    	if(navigator.getUserMedia){
		    		
		    		send_call(numero);
 
		            disable_call();
		    	}else{

                    $('.no_video_call').effect('pulsate');
		    	}    		  
		    }
		    else
		    {
		     able_call();
			 
		     window.notificate_it($('#alert').attr('nobody'),'error','bottomRight');              
		    }
		}
	   
	   
	   //Ceci est pour webRTC
        function send_call(numero)  
        {
		    if(streamed==false)
			{
		        navigator.getUserMedia({video: true, audio: true}, function(stream) {
		   
		             //mon mirroir
                     $('#my_self').attr('src', window.URL.createObjectURL(stream));
					 
					 window.localStream = stream;
					 
					 streamed = true;
					 
					call_this_number(numero);
                },
                function(err){console.log(err.name);
				    
				  /*var err_msg;
				  
				    switch (err.code) {
	               
				      case 1:
					    err_msg = 'Votre caméra n\'est pas accessible';
	                  break;
	
	                  case 2:
	                    err_msg = 'wat';
	                  break;
	
	                }*/
					 					
                  window.notificate_it(err.name,'error','bottomRight');

                  able_call();				  
			    });
			}
			else
			{
			   //mon mirroir
               $('#my_self').attr('src', window.URL.createObjectURL(window.localStream));
			   
			   call_this_number(numero);
			}
		}
		
		
		function call_this_number(numero){
		
		   play_bell();
		   
		   //on envoi l'invitation
		    socket.emit('dring_dring',{'interloc_num':numero,'sender_name':my_username,'sender_num':my_numero});
		}
		
		
		socket.on('allo',function(data){

			if(window.calling==true){

				socket.emit('busy',data);
			}else{

				window.caller = data;
			 
			    var content_msg = $('#alert').attr('new_call')+' <b>'+ data.sender_name+'</b>'; 
			 
			    play_bell();
			 
		        window.notificate_it(content_msg,'notification','topCenter');
			}
		});


		socket.on('busy',function(data){

			window.notificate_it($('#alert').attr('busy'),'error','bottomRight');
			
			able_call();

		})
		
		function play_bell()
		{
		   //we play song
			  var my_bell = $('#bellAudio')[0];
			  
			  my_bell.play();
		}
		
		function stop_bell()
		{
		   var my_bell = $('#bellAudio')[0];
               my_bell.pause();
               my_bell.currentTime = 0;
		}
		
		
		function accept_call()
		{
          stop_bell();

          window.calling = true;
		 
		  push_number_to_my_space(window.caller,'new');
		  
		  window.open_my_space();
		  
		    //je clique ensuite sur ce menu
			$('#interloc').html(window.caller.sender_name);//son nom
			
			$('#interloc').attr('number',window.caller.sender_num);//son numéro
			  
			$('#texto').html('');//On efface les message l'espace de texto s'il yen avait
			  
			  //on voit s'il est en ligne
			  window.online(window.caller.sender_num);
			 
			  
			   //On désactive tout les boutons actifs
              $('.active').attr('class','active_ceci');
		 
		     //Et on active le bouton 
              $('.username_'+window.caller.sender_num).parent().parent().attr('class','active');
			  
			  socket.emit('call_accepted',window.caller);
			   
			    if(navigator.getUserMedia==undefined)
				{
				  socket.emit('zut',{'interloc_num':$.trim(window.caller.sender_num),'sender_num':my_numero,'sender_name':my_username});
				
				  window.notificate_it($('#alert').attr('incompatible'),'error','bottomRight');
				}
				
                				
		}

		function abord_call()
		{
		  stop_bell();
		  $.noty.closeAll();;
		}
		
		function reject_call()
		{
		  stop_bell();
		  
		   socket.emit('call_rejected',window.caller);		
		}
		
		socket.on('he_rejected',function(data){
		
		    stop_bell();
		    
		    window.notificate_it($('#alert').attr('reject_call'),'error','bottomRight');

            able_call();			
		});
		
		
		socket.on('he_accepted',function(data){
		
		    stop_bell();
			
		    var call = peer.call(data.interloc_num+'_pot',window.localStream);//je lui donne mon flux
			
			window.existingCall = call;
  
            call.on('stream', function(remoteStream) {
			
			 disable_call();//je rend le bouton d'appel indisponible	
    
	           // je recoit son flux
	          $('#caller').fadeIn();
			  $('#caller').attr('src',window.URL.createObjectURL(remoteStream));
            });
				
		    call.on('error', function(err) {
				
			   window.notificate_it(err.type,'error','bottomRight');            		   
		    });	
		});
		
		
			
        peer.on('call', function(call) {
		
		  window.existingCall = call;
		   
		    if(streamed==true)
			{
			   call.answer(window.localStream); // Answer the call with an A/V stream.
			}
			else
			{
			    navigator.getUserMedia({video: true, audio: true}, function(stream) {
				
				     //mon mirroir
                     $('#my_self').attr('src', window.URL.createObjectURL(stream));
					 
					 window.localStream = stream;
					 
					 streamed==true;
                     
					 call.answer(stream); // Answer the call with an A/V stream.

                    },function(err) {
                  
				       /*var err_msg;
				  
				        switch (err.code) {
	               
				           case 1:
					        err_msg = 'Votre caméra n\'est pas accessible';
	                       break;
	
	                       case 2:
	                        err_msg = 'wat';
	                       break;	
	                    }*/
						
						var my_interloc_peer = call.peer;
						
						var my_interloc_num = my_interloc_peer.replace('_pot','');
						
					 socket.emit('zut',{'interloc_num':$.trim(my_interloc_num),'sender_num':my_numero,'sender_name':my_username});
								
                     window.notificate_it(err.name,'error','bottomRight');
                    }
			    );					 
			}
           
		    call.on('stream', function(remoteStream) {
                          
		      // je recoit son flux
		      $('#caller').fadeIn();
			  $('#caller').attr('src',window.URL.createObjectURL(remoteStream));
            });

            disable_call();//je rend le bouton d'appel indisponible			
    
        });
		
		
		
		socket.on('wat',function(data) {
                          
		      // son interlocuteur n'arrive pas a se connecté
			   window.notificate_it('<b>'+$.trim(data.sender_name)+'</b> '+$('#alert').attr('wat'),'error','bottomRight');	

               able_call();			   
        });

		
		
		
		//Ici on envoi une photo à son interlocuteur
        $('#sendPhoto').click(function() {
		
		   socket.emit('my_tof',{'interloc_num':$('#interloc').attr('number'),'sender_name':my_username,'image':$('#picture').attr('src')});
		  
		  window.open_my_space();//on reouvre le my_space
		  
		  var notify = 'Photo envoyée';
		  window.notificate_it(notify,'information','centerLeft');//j'affiche le message en notification		
        });


        //Ici on annule l'envoi une photo à son interlocuteur
        $('#Cancel_sendPhoto').click(function() {
		
		   window.open_my_space();//on reouvre le my_space		
        }); 



        /////////////////////easyrtc//////////////////////////////////////
		

        
        function htmlspecialchars (string, quote_style, charset, double_encode) {
           // http://kevin.vanzonneveld.net
 
           var optTemp = 0,
           i = 0,
           noquotes = false;
            
			if (typeof quote_style === 'undefined' || quote_style === null) {
                      quote_style = 2;
            }
           string = string.toString();
  
            if (double_encode !== false) { // Put this first to avoid double-encoding
                   string = string.replace(/&/g, '&amp;');
            }
           string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

           var OPTS = {
              'ENT_NOQUOTES': 0,
              'ENT_HTML_QUOTE_SINGLE': 1,
              'ENT_HTML_QUOTE_DOUBLE': 2,
              'ENT_COMPAT': 2,
              'ENT_QUOTES': 3,
              'ENT_IGNORE': 4
              };
            if (quote_style === 0) {
               noquotes = true;
            }
            if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
               quote_style = [].concat(quote_style);
                for (i = 0; i < quote_style.length; i++) {
                  // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                    if (OPTS[quote_style[i]] === 0) {
                       noquotes = true;
                    }
                    else if (OPTS[quote_style[i]]) {
                       optTemp = optTemp | OPTS[quote_style[i]];
                    }
                }
              quote_style = optTemp;
            }
            if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
               // string = string.replace(/'/g, '&#039;');
            }
            if (!noquotes) {
              // string = string.replace(/"/g, '&quot;');
            }

           return string;
        }


        
        $('.hello_world').click(function(){

        	get_number_all_user();
        })


        function get_number_all_user(){

        	$('.liste').html('<ul class="nav nav-list bs-docs-sidenav list_unread"><li class="nav-header"> '+$('.hello_world').html()+' '+$('.hello_world').attr('data-original-title')+'</li><li class="waiting_hello_world"> '+$('#Please_wait').html()+'</li></ul>');
            
            socket.emit('guest',my_numero);

            window.spy_user = true;//Cett variable permet de savoir si personne n'est affiché avant de de faire arreter d'attendre l'utilisateur

            setTimeout(function(){

            	if(window.spy_user==true){

        	        $('.liste').html('<ul class="nav nav-list bs-docs-sidenav list_unread"><li class="nav-header"> '+$('.hello_world').html()+' '+$('.hello_world').attr('data-original-title')+'</li><li class="waiting_hello_world"> <span class="label label-info karma">'+$('.no_connected').attr('no_connected')+'</span></li></ul>');

            	}
            },delay_search_connected);
        }

        socket.on('guest',function(sender){

        	socket.emit('guest_response',{'my_numero':my_numero,'my_username':my_username,'my_user_id':my_user_id,'sender':sender});
        })


        socket.on('guest_response',function(data){

        	if($('.list_unread').html()!==null){

        		$('.waiting_hello_world').fadeOut();

        		window.spy_user = false;

                window.all_contact_list(data.my_numero,data.my_username);

                $.getScript($('#url_js_chat').attr('action')); //et on charge le fichier js qui prend en charge les nouveaux éléments
        	}
        })


         // Requesting to Database every 2 seconds
        var auto_refresher = setInterval(function ()
        { 
                  
				    $.ajax({

				            type: 'post',

				            url: $("#url_session").html(),

				            async : true,

				            error: function(){  //On dit kil est offline
											  $('.attente').html('<img style="width:50%;" class="bulle" title="'+$('#url_image_logo').attr('nothing')+'" data-placement="bottom" src="'+$('#url_image_logo').attr('url')+'begoo.png"> <br><br><br> <div class="alert alert-info">'+$('#url_image_logo').attr('mode_out')+' </div>');  
											
											   window.all_my_notification();//On affiche le nombre de notification en local

											   
											   ////////////////////////Manage the menu top///////////////////////////
											   $('.off_hider').fadeOut();//Hide all menu on top
											   $('sub_hide').fadeOut(); 
											   $('.off_hist_caracter').text($('.off_hist').attr('data-original-title')); 
											   $('.off_note_caracter').text($('.off_note').attr('data-original-title'));
											   ////////////////////////Manage the menu top///////////////////////////

                                               
											   window.kwiki_inline ='off';
											},
							
				            success: function(data){
							
							            if($.trim(data)!=='connected')//s'il n'est pas connecté
										{
										   window.location.href = $('.already_used').attr('redirect');
									    }

									    $('.attente').html('');//on efface l'attente

									    window.kwiki_inline ='on';


									    ////////////////////////Manage the menu top///////////////////////////
											   $('.off_hider').fadeIn();//Hide all menu on top 
											   $('sub_hide').fadeIn(); 
											   $('.off_hist_caracter').text(''); 
											   $('.off_note_caracter').text('');
									    ////////////////////////Manage the menu top///////////////////////////

									}
										 
			        });
        }, 5000);


        //C'est ici qu'on compte le nombre de notification
		window.all_my_notification = function()
		{
		    $.ajax({

				            type: 'post',

				            url: $("#url_maj").html(),

				            async : true,

				            error : function(){ //En cas d'erreur j'affice le nombre de notification en local
                                       
                                        if($.jStorage.get('note_nbre','nada')!=='nada'){

                                        	affiche_nbre_note(0);
                                        }                                    
				                   },
							
				            success: function(data){
		     
			                            if($.trim(data)!=='connect_him')
										{
										 
				                         var message = $.trim(data)*1;
										 
										 	///////////////////////////////Regardons s'il a des nouvelles notifications
										 	affiche_nbre_note(message);
											
				                        }
										else
										{
										  $(".mes_notes").attr('class','mes_notes');
										  $(".mes_notes").html('0');
										}										
									}
			});
		}

         //Lançon le chargement du nombre de notification
		var nbre_notification = window.all_my_notification();

         //Cette fonction affiche le nombre de notification
        function affiche_nbre_note(message){

        	    if(message > 0)  //Si oui
				{ 
				  $(".mes_notes").html(message);//On Donne le  nouveau nombre de message
				  $(".mes_notes").attr('class','badge badge-info mes_notes');//on applique les nouveaux styles											  											   
				}
											
				if(message == 0)//s'il nya  aucun nouveau msg
				{
				  $(".mes_notes").attr('class','mes_notes');
				  $(".mes_notes").html('');
				}
        }
		

    });