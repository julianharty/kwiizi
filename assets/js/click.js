
$(document).ready(function(){

         var socket  = io.connect($('#url_node').attr('url'));
		 
         var messageDelay = 4000; //durée d'apprition du message e milliseconde

         var delay_notif = 12000;

         var timeout_notty = 10000.  
	
			//Ici on s'occupe dela validation du formulaire
			function updateTips(t) {

			   $("#validateTips").text(t).effect("bounce",{},1500);
		    }

		   	
		
		    function checkMessage(o,n) {

			    if ( o.length <= 0 ) {

				    $("#inputSlogan_msg").addClass('ui-state-error');
				    
				    updateTips($('#erreur_message').text());
				   
				    return false;
			    } else {
				    return true;
			    }

		    }
			
			
			//on fait apparaitre le compteur de caractère
			$("#inputNumber_msg_contain").keyup(function()
            {
			    var max_char = 160;
			  
                var box=$(this).val();
                var main = box.length *100;
                var valeur= (main / max_char);
                var count= max_char - box.length;

                if(box.length <= max_char)
                {
				  //progressbar
				    $("#bar_note").progressbar({
					   value: valeur
				    }).width(100);//
				
				 //compteur incrémenté
                   $('#counter_msg').html(count);
                   
                }
                else
                {
                  alert('OoooooH! STOP! ');
                }
              return false;
            });
			
		//Cette fonction fait des requêtes ajax par click et affiche la réponse en json
			$('.submit_msg').click(function() {

			     var message   = $("#inputNumber_msg_contain").val(),
			
			                    allFields = $([]).add($("#inputNumber_msg_contain")),
					            bValid = true;
					            allFields.removeClass('ui-state-error');
					
                               bValid = bValid && checkMessage(message,"message");         				
						
					            if(bValid){ 
	  
					               var form_data = {message:message};
								   								   
								    $('#myModal_form_msg').modal('hide');
								   
								     //effacons les entrées du formulaire
									$("#inputNumber_msg_contain").val('');
									
								    socket.emit('to_all_family',form_data);//On envoit le message à tout le monde
	         			          
                                  return false;
					            }
            });


            socket.on('to_all_family',function(final_form){

            	send_to_familly(final_form);
            });


            socket.on('forbid',function(){

            	$('.messenger').html($('.not_allow_family').attr('message'));
	            $('#bad_msg').fadeIn().delay(messageDelay).fadeOut();
            })

            

            //Envoi une annonce à tout le monde
            function send_to_familly(form_data){

                $.ajax({
                                        
						url: $('#url_traitMsgForm').html(),
                                        
						type: 'POST',
                                        
						async : false,
                                        
						data: form_data,
										
						error: function(){alert("theres an error with AJAX");},
                                        
						success:function(data_msg) {
										          
									data = $.trim(data_msg); 
								                
								    $('.messenger').html('CoOl.Done !');//On met le message dans le conteneur #messenger et on l'affiche dans le switch suivant
									
									switch (data) {
	                                                     
										                case 'succes':
														  socket.emit('news');//on le dit à tout le monde
														  $('.messenger').html('CoOl.Done !');//On met le message dans le conteneur #messenger et on l'affiche dans le switch suivant
	                                                      $('#good_msg').fadeIn().delay(messageDelay).fadeOut();
	                                                     break;
														 
	                                                     case 'fail':
														   $('.messenger').html('Houston! we have a problem...');//On met le message dans le conteneur #messenger et on l'affiche dans le switch suivant
	                                                       $('#bad_msg').fadeIn().delay(messageDelay).fadeOut();
	                                                     break;
	                                                }	
                        }
				});
            }

           
           //On recoit tous les messages publiques
            socket.on('famille',function(data){ //(titre,message,image)

            	//cette fonction déclanche l'apparition de la notification
            	 notty_it(data.message);

            	//On enregistre le message
            	var note_nbre = $.jStorage.get('note_nbre','nada');

            	if(note_nbre=='nada'){//S'il nya aucune notification

                    //On en crée
                    $.jStorage.set('note_nbre',1);
                    $.jStorage.set('note',[data.message,' ']);
            	}else{

            		$.jStorage.set('note_nbre',$.jStorage.set('note_nbre')*1+1);

            		var note =  $.jStorage.get('note');

            		var new_note = [data.message,' '];

                    note.push(new_note);

                    $.jStorage.set('note',note);

                    My_notty($.jStorage.get('note'),0);//On fait défiler
            	}   
            })



        //cette fonction déclanche l'apparition de la notification
			function notty_it(message)
			{
			    $.ClassyNotty({
                    content: message,
                    img:$('#url_image').attr('url')+'logo_begoo.jpg',
                    showTime: true,
	                timeout: timeout_notty                                             
                });    
            } 
	
			
			
			
			//Cette fonction affiche les onglets des notification et prérempli les nouveaux messages avec un Onclick
			$('.my_note').click(function() {

				if(window.device=='mobile'){

					window.hide_page();
				}
			        //On affiche la box pour patienter
                  
				   $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
				   
					  //on télécharge les notifications
					  last_notify(false);	

                return false;		            
            });


            function affiche_list_note(data){

				//affiche les chevrons de la liste
			    $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_notes"><li class="nav-header"> notifications <span class="badge badge-info">'+data.counter+'</span></li></ul>');
											   
                $.each(data.notification, function(entryIndex, entry) {
				    //ne pas oublier de télécharger les pubs
											
						    var a ='<li class="active_ceci">';
											
							var b ='<a href="#">';
											
							var c ='<div class="talk_post">';
											
							var d ='<h5><i class="icon-bell"></i> <span class="label label-info">  </span> </h5>';
											
							var e = entry['message'];

							var f = '<ul class="nav nav-pills"><li><i class="icon-time"></i><span class="user_post">'+entry['timestamp']+'</span> </li></ul>';
											
							var g = '</div></a></li>';
											
							//on affiche
                            $('.liste_notes').append(a+b+c+d+e+f+g).fadeIn('slow');

						    $.getScript($('#url_js_note').attr('action')); //et on charge le fichier js qui prend en charge les nouveaux éléments				 											
                });

                $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter	 		
            }



        
    //Je télécharge les noifications dernières
    function last_notify(statu){

	    $.ajax({  //On affiche tout dabord les onglets avec cette requete ajax
    
				url: $('.my_msg_pub').attr('action')+50,
                                        
				type: 'POST',
                                        
				async : true,
							
				dataType:"json",
					                    
				error:  function(){ 
                                        
                            if($.jStorage.storageAvailable() && $.jStorage.get('note')){

                                if(statu==true){

                                    //On fait défiler les notification qui sot en local
                                    My_notty($.jStorage.get('note'),0);
                                 
                                }else{

                                    //On affiche en liste
                                    see_note();
                                }
                            }else{

                                    if(statu==false){

                                        //On dit qu'il nya aucune notication
                                        window.notificate_it($('.not_news').attr('not_news'),'error','bottomRight');
                                    }
                            }							        
					    },
                                        
			    success:function(data) {						          												 
								     
                                        if(data.statu =='succes')
                                        {

                                        	if(statu==true){
                                        		//On télécharge dabord
                                        		download_note(data);
                 
                                        	}else{
                                        		//On affiche sous forme de liste
                                        		 //On affiche en liste
                                                see_note();
                                        	}
									       
									       $('#info_msg_wait').fadeOut();//On efface la box qui fait patiente									 
                                        }else{

                                            if(statu==false){

                                                //On dit qu'il nya aucune notication
                                                window.notificate_it($('.not_news').attr('not_news'),'error','bottomRight');
                                            }                                        	
                                        }                  
									}
					    });
    }

    var get_note = last_notify(true);

    function download_note(data){

    	$.jStorage.set('note_nbre',data.counter);//On garde le nombre de notification

    	var all_notes = [];

    	var i =0;

    	var nbre_note = data.counter * 1;//On converti en réel

    	$.each(data.notification, function(entryIndex, entry) {
		    
		    var each_note = [entry['message'],entry['timestamp']];

		    all_notes.push(each_note);

		    i=i+1;

		    if(i==nbre_note - 1){

		    	$.jStorage.set('note',all_notes);

		    	//Et on déclanche le défilement
		    	defile_note();
		    }	 											
        });
    }
    

    //Cette fonction déclenche le défilement des messages
    function defile_note(){

    	 My_notty($.jStorage.get('note'),0);  	
    }
    //Dès que je récupère la denire notif,jenregistre en local
    //Jarrenge de bug de nombre de notication


			
			

        
 /////////pour la chat box///////////////////////////////
		
        $("#link_add").click(function(event, ui) {
		
		  //on fait ce qui se passe au chargement du chat TODO
		  var wikip = $('#chat_statu');
		  
		  wikip.attr('statu','yes');//on active le chat pour que les requetes ajax soient toutes faites
         
		    $("#chat_div").chatbox({id : "chat_div",
                                  title : '<span class="label label-info">WiK\'s :)</span>',
                                  user : "can be anything",
								  hidden: false, // show or hide the chatbox
                                  offset:0,
								  width: 230, // width of the chatbox
                                  messageSent: function(id,user,msg){ 
								                  
												  $("#chat_div").chatbox("option", "boxManager").addMsg($('.my_info').attr('username'), msg);//on écrit son message en local
												 
                                                   var wiki_follow = $('.wiki_follow').html();

                                                    //Si je suis suivi,j'envoi le message vers ma room												   
				                                 
												    if(wiki_follow=='me')
				                                    {												 
												      socket.emit('send_message',{'room':$('.my_info').attr('user_id'),'user':$('.my_info').attr('username'),'message':msg});//on envoit aussi le message dans la room
									                }
													else //on alors j'envoi vers celui que je suis
													{
													    if($('.followed_user_id').attr('user_id')!=='')//S'il suit forcément quelqu'un
														{
													     socket.emit('send_message',{'room':$('.followed_user_id').attr('user_id'),'user':$('.my_info').attr('username'),'message':msg});//on envoit aussi le message dans la room
													    }
														else
														{
														  $("#chat_div").chatbox("option", "boxManager").addMsg($('#chat_conv').attr('kwiki'),$('#chat_conv').attr('alone'));//on écrit son message en local
														}
													}
											   }
			});
			
		  
		  return false;
        });
		
		
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	    
		
		//cette fonction liste les pubs téléchargés
		function see_note(){
		  //je récupère cette fameuse liste en local
		    
			if($.jStorage.storageAvailable() && $.jStorage.get('note_nbre'))
			{
			   //affiche les chevrons de la liste
			   $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_notes"><li class="nav-header"> notifications <span class="badge badge-info">'+$.jStorage.get('note_nbre')+'</span></li></ul>');
										
		        var all_note = $.jStorage.get('note');

		       var note_nbre = all_note.length;
		      
				for(i=0; i < note_nbre; i++){ 
	               
				        var note_indiv = all_note[i];
				  
					    var a ='<li class="active_ceci">';
											
						var b ='<a href="#" class="see_note" action="'+note_indiv[1]+'">';
											
					    var c ='<div class="talk_post">';
											
						var d ='<h5><i class="icon-bell"></i> <span class="label label-info">  </span> </h5>';
											
						var e = note_indiv[0];

						var f = '<ul class="nav nav-pills"><li><i class="icon-time"></i><span class="user_post">'+note_indiv[1]+'</span> </li></ul>';
											
						var g = '</div></a></li>';
											
						   //on affiche
                        $('.liste_notes').append(a+b+c+d+e+f+g).fadeIn('slow');
						
						if(i==note_nbre-1)
						{ 
						   //on détache les évènements précédents
	                        $('.see_note').unbind('click');
				
							$('#info_msg_wait').fadeOut();//On efface la box qui fait patienter	 
						}					
                }
			}
		}


		function My_notty(contenus,chariot) 
		{
			if(window.device=='standart'){

			    setInterval(function()
                {
                	if($('.begoo').attr('id')!==undefined){
			           //si on est au début du tableau ou en cour de lecture,
				       niveau = contenus.length - chariot;
				 
				        if(niveau == contenus.length || chariot < contenus.length)
				        {					
					      //on apprete tout
					      message = contenus[chariot][0];
					      //on envoi à la fonction de lecture
					      notty_it(message);
                          chariot = chariot + 1;
					
					      //et on recommence le processus après un temps x			        
				        }
				        else
				        {
				          chariot = 0;
				        }
				    } 
                }, delay_notif);
            }	 
        }


			
});	