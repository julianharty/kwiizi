
$(document).ready(function(){ 


	var hoster = $('.hoster').attr('url');
	var port_kiwix = $('.hoster').attr('port_kiwix');
	var zim = $('.hoster').attr('zim');

	var all_zim_file = [];
	all_zim_file = $('.hoster').attr('zim_list').split(',');
	window.all_zim_file = all_zim_file;

 
  $(function(){$('.bulle').tooltip();});//ca c'est la class des infobulle

  $(function() {
		$("#toTop").scrollToTop(1000);
	});
    
    var largeur_mobile = 800;
    window.device = 'derre';
    window.list_open = 'no';
    var nombre_followed = 10;


    if($(window).width()<=largeur_mobile){

    	$('.liste').fadeOut();
    }


 
    var resise = tailleur();

    function tailleur(){ 

    	var largeur = $(window).width();

        if(largeur<=largeur_mobile){

        	window.device ='mobile';

        	

        		$('.one').show();$('.two').hide();

		        $('.dance_for_me').fadeOut();//On retire l'historique de navigation

		        //$('.chizer').fadeOut();//On retire le moteur de recher des suivis

		        $('#nottys').fadeOut();//On retire la publicité en nofication

		        $('.cacher').fadeOut();

		        $('.view').parent().attr('style','');
		    
		        $('.favorite_wiki').parent().fadeOut();
		    
		        $('.print_it').parent().fadeOut();

		        $('.tiler').fadeOut();
		        

		        window.already_mobile = true;

        }else{

        	window.device ='standart';

        	$('.chizer').fadeIn();//On remet le moteur de recher des suivis

        	$('.cacher').fadeIn();

        	$('.tiler').fadeIn();

            $('.one').hide();$('.two').show();

        	$('#nottys').fadeIn();//On remet la publicité en nofication

        	$('.contenu_liste').fadeIn();

        	$('.liste').attr('class','liste span5').attr('ref','yes');
            $('.contenu_liste').attr('class','contenu_liste span7');

            if($('.liste').attr('ref')=='yes' && window.device=='standart' && window.list_open=='no'){

    	        window.list_open = 'yes';
            }

            //Ici on affiche de nouveau la liste et le contenu au cas ou l'un des deux était caché
            if(window.page_open =='no' && window.both!==true){

            	$('.contenu_liste').show("slide", { direction: "left" }, 500)

            	window.page_open ='yes';

            	window.both = true;
            }

            $('.liste').fadeIn();        
        }
    }

 
    $(window).resize(function() {

        tailleur();

        console.log(window.device);

    });

    window.page_open='yes';

     //Cete fonction affiche la page centrale
    window.show_page =  function(){

    	if(window.page_open=='no'){

    		$('.liste').hide("slide", { direction: "left" }, 500)

            $('.contenu_liste').show("slide", { direction: "left" }, 500)

            $('.liste').attr('class','liste span1');
            $('.contenu_liste').attr('class','contenu_liste span11');

            $('.hide_list_mobil').parent().fadeIn();

            window.page_open ='yes';
    	}   
    }

     //Cette fonction cahche la page centrale
    window.hide_page = function(){

    	if(window.page_open=='yes'){

    		$('.contenu_liste').hide("slide", { direction: "left" }, 500)
        
            $('.liste').show("slide", { direction: "left" }, 500);

            $('.liste').attr('class','liste span11');
            $('.contenu_liste').attr('class','contenu_liste span1');

            $('.hide_list_mobil').parent().fadeOut();

            window.page_open ='no';
    	}   
    }

  
 //$.jStorage.flush(); //décommenter pour supprimer les données téléchargés dans le cache
  
 
 var dbName = $('#get_API').attr('local_db');
  // $.indexedDB(dbName).deleteDatabase();
    if(window.indexedDB || window.openDatabase){
	
	 var dbOpenPromise = $.indexedDB(dbName, {
		"version":1,
		"upgrade" :function(transaction){
             transaction.createObjectStore("article", {
            }).createIndex("title" , /*Optional*/ {
                           "unique" : false, // Uniqueness of Index, defaults to false
                       
						}, /* Optional */ "title")
						
		     transaction.createObjectStore("all_article");
			 
			 transaction.createObjectStore("category");
        }
	 });
	}
	

 	//console.log(($.jStorage.storageSize()/1024)/1024+' mo de capacité utilisée');//j'affiche dans le log mes capacité en charge(debbugeur)

        var article_max = 100; //nombre maximal d'articles à télécharger
		
		var historique_complet = 100;
		
		var historique_simple = 6;//historique qui s'affiche au menu de navigation

        
        var page_content_js = $('#js_wiki_click').attr('page_content'); 
		
		var url_api = $('#get_API').attr('api');
		
		//var deletePromise = $.indexedDB("begoo_wiki_store").deleteDatabase(); 
		
		
        //On met une veilleuse pour socket.IO timer
		//url de node js 
		var socket  = io.connect($('#url_node').attr('url'));

		var lastTime = (new Date()).getTime();

        setInterval(function() {

            var currentTime = (new Date()).getTime();
            if (currentTime > (lastTime + 2000*2)) {  // ignore small delays
                // Probably just woke up!
                socket  = io.connect($('#url_node').attr('url'));
            }
         lastTime = currentTime;
        }, 2000);
		
	
	///////////////////////////////////////follow me//////////////////////////////////////////////////////	
        //Dès la connexion on obtient la liste les leader qui demandent à être suivis
        socket.emit('get_leader');


		//S'il ya quelque qui vien de cliquer sur le boutton follow me on le dit à tous le monde
		socket.on('follow_him', function (result){

			//On enregistre les followed en local
			$.jStorage.set('followed_list',result);
            
            last_leader(result);
        });
		
		
		//Si on recoit un changement d'article
		socket.on('change_article', function(article){
		
		    //On affiche la box pour patienter
            $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
           
		    retrieve_article_text(article.full,article.page_url);
        })


    $('.listing').click(function(){

        window.hide_page();
    })


    //ON récupère la page d'accueil de WIKIpedia
    var get_welcome = get_welcome();

    function get_welcome(){

    	$.getJSON($('#get_API').attr('api_category') , function(data) {
        
            $('.get_category').html(data.page_text);

            $('.firstHeading').fadeOut();

            $(document).ready(function(){ 

               //action à effectuer sur les liens qui sont dans l'article.
                $('.get_category a:not(.new,.toc a,.internal)').unbind('click');
                $('.get_category a:not(.new,.toc a,.internal)').click(function() { 

                    	$('#info_msg_wait').html($('#Please_wait').html()).fadeIn();//on affiche le message pour patienter
			         
			            var page_url = $(this).attr('href').replace($('.hoster').attr('kiwix'),'');

				  		retrieve_article_url(page_url);
				
					    return false;                    
		        });
		    });
        });
    }
		
	
	function retrieve_article_text(full_article,page_url) {
			
		  window.full_text = full_article;
			
            //On apprete le titre et le texte
		  var title_push = full_article.page_title;
											  
		  var text_push  = full_article.page_text;

		  $('.wiki_title').html('<h1>'+title_push+'</h1>');
							     						
		  $('.wiki_content').html(text_push);

		  //On affiche l'article à l'histocque vertical
		    var data_historic = {page_url:page_url,page_title:title_push}
		    
		    if(window.list_historic){
                 
                if(window.list_historic.length>historique_simple){

                	window.list_historic.shift();
                }   
		    }else{

		    	window.list_historic = new Array();
		    }

		    window.list_historic.push(data_historic);
		    
		    retrieve_historic(data_historic);
									   
		  $('.look_wiki').html(page_url);//relève la page qu'il consulte
		  $('.look_wiki').attr('page_title',title_push);//relève la page qu'il consulte
										
										
		//On enregistre en local l'article en local
		window.recording_all_article(full_article,page_url,title_push);
                                    
	    article_ready();//On applique des actions sur le texte                               
	}


	window.recording_all_article = function(full_article,page_url,title_push){

		//on enregistre l'article en local
		if(window.indexedDB || window.openDatabase){
										   
		    //maintenant regardons si la page_url existe en local
			var objectStore = $.indexedDB(dbName).objectStore("article");
											
			var promise_article = objectStore.get(page_url);
                                          
            promise_article.done(function(result, event){
										 
                if(result == undefined)
				{
				  var promise_add = objectStore.add(full_article,page_url); // Adds data to the objectStore    
                                                    
				    promise_add.done(function(result, event){
												
                        var objectStore_all_art = $.indexedDB(dbName).objectStore("all_article");	
												 
				        var promise_all_page_url = objectStore_all_art.get('table_article_url');// tableau des pageurl
														 
                        //On soccupe des urls des pages "page_url"														 
				        promise_all_page_url.done(function(result_all_page_url, event){
													
				          var table_article_url = result_all_page_url;
										 
                            if(result_all_page_url==undefined)
					        {
				             //on créée le tableau
				             var table_article_url = new Array();
																  
					         objectStore_all_art.add(table_article_url,'table_article_url');//et on enregistre ce tableau
					        }
				           //on ajoute le dernier article dans la liste du tableau
														
			                table_article_url.unshift(page_url);//on ajoute le nouvel id
														 
				            objectStore_all_art.put(table_article_url,'table_article_url');//et on enregistre ce tableau d'id
														      
                        });
														
			            //ON s'occupe des titre
				        var promise_all_page_title = objectStore_all_art.get('table_article_title');// tableau des articles
													
					    promise_all_page_title.done(function(result_all_page_title, event){
													
						    var table_article_title = result_all_page_title;
										 
                            if(result_all_page_title==undefined)
						    {
				             //on créée le tableau
				                var table_article_title = new Array();
																  
							    objectStore_all_art.add(table_article_title,'table_article_title');//et on enregistre ce tableau
						    }
			           
					        //on ajoute le dernier article dans la liste du tableau
														
			                table_article_title.unshift(title_push);//on ajoute le nouveau titre
											   
						    objectStore_all_art.put(table_article_title,'table_article_title');//et on enregistre ce tableau de titre
			                                                  
                        });
				    });									
			    }
												
            });										  
		}
	    else
		{
			if($.jStorage.storageAvailable())//est ce que le navigateur supporte le webstorage?
            {
			 // on enregistre en local le texte
			 var total_storage = ($.jStorage.storageSize()/1024)/1024;//la taille est en méga
                                         
				if(total_storage < 4.5)//si la taille maxi est inférieur à 4,5 Mo
				{
	              //on met en local
				  put_article(page_url,title_push,text_push);
				}
				else //on supprime le dernier article
				{
				 //console.log('stokage plein.Suppression du dernier article');
											 
				 //on vérifie si le tableau des articles existe
				 var all_article = $.jStorage.get('all_article');
											  
					if(all_article)
					{
					 //prennons ce tableau
					 //comptons son nombre d'entré
					 nbre_artcles = all_article.length;
												  
					 //console.log(nbre_artcles+' articles au total dont le premier va être supprimé');
												  
					 //suppression du premier article
					 //sélection au préable du dernier élément du tableau
					 var last_article = nbre_artcles-1;
												   
					 var old_article = all_article[last_article];
													  
					   //console.log('Suppression de "'+$.jStorage.get('title_'+old_article)+'"');
													   
					   //et on supprime cette article
					   $.jStorage.deleteKey('title_'+old_article);
					   $.jStorage.deleteKey('text_'+old_article);
												       
					   all_article.pop();//.pop() supprime le dernier élément du tableau
													
					    //je met à jour dans le cache le tableau des derniers articles
						$.jStorage.set('all_article',all_article)
													 
						 //on met en local
						 put_article(page_url,title_push,text_push);
												  
				    }
				}
			}
		}
	}


	
		
		//S'il on me demande qu'elle article je consulte actuellement
		socket.on('get_article', function (follower_id) {
		
           var wiki_follow = $('.wiki_follow').html();				
			//je répond en donnant l'id de l'article que je consulte actuellement	
			socket.emit('this_article',{'page_url':$('.look_wiki').html(),'follower_id':follower_id});
			
        });
		
		
		//je met +1 au nombre de personnes qui me suivent
		socket.on('more_person', function () {
		
           var wiki_follow = $('.wiki_follow').html();				
			//si je  suis suivi je met +1 sur le nombre de personne qui me suivent	
			if(wiki_follow=='me')
			{
			  $('.followers').html(1 + parseInt($('.followers').html()));//on affiche ce nombre
			}
        });
		
		
		//je met -1 au nombre de personnes qui me suivent
		socket.on('less_person', function () {
		
           var wiki_follow = $('.wiki_follow').html();				
			//si je  suis suivi je met +1 sur le nombre de personne qui me suivent	
			if(wiki_follow=='me' && $('.wiki_title').html()!=='')
			{
			    var nbre_followers = parseInt($('.followers').html());
				
				if(nbre_followers > 0)
				{
				 $('.followers').html(nbre_followers-1);//on affiche ce nombre
				}
			}
        });
		
		//Ici j'affiche l'article qui st suivi actuellement dans la room où je vient d'entrer
		socket.on('this_page', function (page_url) {
		  
		  //On affiche la box pour patienter
          $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
			
		  retrieve_article_url(page_url);
		
		});
		
		
		//Si on me dit que le followed est sorti de la room
		socket.on('end_follow', function (followed_id) { 

			if($('.wiki_follow_user').html()==followed_id && $('.followed_user_id').attr('user_id')==followed_id){
				
		      //j'efface et je cache son nom
			      $('.wiki_follow').html('');
				  $('.wiki_follow_user').html(''); //on efface son id							
				  $('.followed_user_id').attr('user_id','');
				  $('.info_followed').fadeOut();
				  $('.note_follow').fadeIn();

                  $("#chat_div").chatbox("option", "boxManager").addMsg($('.name_followed').html(),$('#chat_conv').attr('bye'));//on affiche le message	

				  $('.name_followed').html('');//on efface son nom

				  $('.stop_follow_him').click();

				  $('a').remove('#followed_'+followed_id);//On retire le lien de celui qui arrete d'etre suivi
				  $('span').remove('#divider_'+followed_id);//On retire le lien de celui qui arrete d'etre suivi
			}
		   
		  //je sort moi aussi
		  socket.emit('leave_it',my_user_id);
		});
		
		
		
		//Ici on recoit les message tchat
		socket.on('new_message', function (data) {
		  
		    $("#chat_div").chatbox("option", "boxManager").addMsg(data.user,data.message);//on affiche le message	
		});
			
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		  
										
		
		//Cette évènement permet aux autres utilisateurs de suivre ou pas l'utilisateur présent
		    $('.follow_me').toggle(
				
				//suivez moi
				function(){
				
				   $('.statu_link').html('...');//on le fait patienter
				   
				   
				    //socket.emit('leave_it_follower',$('.followed_user_id').attr('user_id'));//on laisse toute personne qu'on suivait si c'est le cas
						   
					// on change le statu du bouton et d'autre action
						   
					//on change le statu du bouton
						    $('.statu_link').html($('.follow_me').attr('follow_no'));							
							
							$('.wiki_follow').html('me');						
							
							$('#link_add').click();//on affiche la fenêtre de chat
							$('.followers_number').fadeIn();
							$('.info_followed').fadeOut();
							$('.note_follow').fadeIn();							
							
						//on envoi un emit qui le signale à tous les autres connectés     
                        socket.emit('follow_me',{'user_id':my_user_id,'username':my_username});

                        if(window.kwiki_inline=='off'){ //Si l'user n'est pas en ligne

                            // on change le statu du bouton et d'autre action
                           $('.statu_link').html($('.follow_me').attr('follow_me')); 
                        }				
				 return false;	
				},
				 
				 //ne me suivez pas
				function(){

                    $('.statu_link').html('...');//on le fait patienter
					 		    
					      // on change le statu du bouton et d'autre action
                            $('.statu_link').html($('.follow_me').attr('follow_me'));
							
							if($('.wiki_follow').html()=='me')
							{
							  $('.wiki_follow').html('');//s'il ne suivait personne avant,on initialise son statu
							}
													
							$('.followers_number').fadeOut();

                            $('#chat_statu').attr('statu','no');//on désative le chat

                           //oon envoi un emit qui le signale à tous les autres connectés     
                           socket.emit('follow_no',my_user_id);							
				  
					
					    if(window.kwiki_inline=='off'){	//Si on est pas en ligne			
				    	
						    // on change le statu du bouton et d'autre action
                            $('.statu_link').html($('.follow_me').attr('follow_me'));  
						
				        }
					
				 return false;			
				}
			);
			
			
		function follow_him(){

			$(document).ready(function(){

				 //ceci est pour suivre quelqu'un
		    $('.follow_him').click(function() {
			
			    //Si je suivais une autre personne
			    var wiki_follow = $('.wiki_follow').html();
				/* 
			    if(wiki_follow!=='me' || $('.wiki_title').html()=='')
				{												 
	              socket.emit('leave_it',$('.followed_user_id').attr('user_id'));//je sort de cette room
			    }
				else //Si on me suivait
				{
				   socket.emit('leave_it_follower',my_user_id);//je sort de ma room
				}*/
				
				if($(this).attr('user_id')!==$('.my_info').attr('user_id'))
				{ 
			        socket.emit('jointe',{'followed_id':$(this).attr('user_id'),'follower_id':$('.my_info').attr('user_id')});//on le fait joindre le groupe

                  // on change le statu du bouton et d'autre action
			            var user_id_followed = $(this).attr('user_id');
			
			            var user_id_name = $(this).attr('user_name');
			
						  $('.wiki_follow').html('follower');//on met à jour sonstatu sur wikipedia
						  $('.wiki_follow_user').html(user_id_followed);//on prend son id
						  $('.name_followed').html(user_id_name);//on prend son nom
						  $('.followed_user_id').attr('user_id',user_id_followed);//on prend son id
						  $('.info_followed').fadeIn();
                          $('.note_follow').fadeOut();						  
                          $('#link_add').click();//on affiche la fenêtre de chat
						  $('.look_wiki').attr('if_article','yes');//signale que le navigo est tout ouvert

                          // on change le statu du bouton et d'autre action
                          $('.statu_link').html($('.follow_me').attr('follow_me'));
							
							if($('.wiki_follow').html()=='me')
							{
							  $('.wiki_follow').html('');//s'il ne suivait personne avant,on initialise son statu
							}
													
							$('.followers_number').fadeOut();
                }							
					
				 return false;
		    });
			});
		}	
	       
			
			
			
			//ceci est pour arreter de suivre quelqu'un
		    $('.stop_follow_him').click(function() {
			
			  socket.emit('leave_it',my_user_id);
			
			  // on change le statu du bouton et d'autre action
				if($('.wiki_follow').html()=='follower')
			    {
				  $('.wiki_follow').html('');
				  $('.wiki_follow_user').html(''); //on efface son id							
				  $('.name_followed').html('');//on efface son nom
				  $('.followed_user_id').attr('user_id','');
				  $('.info_followed').fadeOut();
				  $('.note_follow').fadeIn();
				  $('#chat_statu').attr('statu','no');//on désative le chat
                }      					
				 
			  return false;
		    })
			
			
			//j'affiche la liste de ceux qui veulent être suivis
	function last_leader(leader){

				if(leader.followedIds.length>0){

					$('.leader').html('');//on efface toute la liste

                    //On restreint le nombre de followed dans la liste qui s'affiche
					if(leader.followedIds.length<=nombre_followed){

						var increment = leader.followedIds.length;
					}else{

						var increment = nombre_followed;
					}

					for(i=0;i<increment;i++)
                    {

                    	if(leader.followedIds[i]!==my_user_id){

                    		var a = '<a href="#" class="follow_him" id="followed_'+leader.followedIds[i]+'" user_id="'+leader.followedIds[i]+'"  user_name="'+leader.followedName[i]+'">';

				            var b = leader.followedName[i]+'</a><span class="divider" id="divider_'+leader.followedIds[i]+'">|</span>'; 

				            $('.leader').append(a+b);

				            if(i==leader.followedIds.length-1){

				    	        if(window.device =='standart'){

				    	    	    $('.leader').fadeIn();

					    	        $('.leader').effect('pulsate');
					            }
					            
					            follow_him();
				            }
                    	} 
				    }
				}		
	}


    socket.on('verif_connected',function(){

        socket.emit('response_verif_connected',my_user_id);
    });

	//à l'accuei on supprime cet user de a lste de suivis et de ceux qui suivent
    function goodbye(user_id){

    	socket.emit('leave_my_room',user_id); 
    }

    var liste_leader = $.jStorage.get('followed_list');
     
    /*
    var list_leader_id   = liste_leader.followedIds;
    var list_leader_name = liste_leader.followedName;//{'source':list_leader_name}
    */

    $('.typeahead').typeahead();
			//c'est ici qu'on perform la recherche
            $('.user_searchs').keyup(function(){
                  
			  var user_search = $(this);
				
				if(user_search.val().length > 0)
				{	
				  //On affiche la box pour patienter                  
		          $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
				  
				    //on fait la requete ajax
					var jqXHRsearch = $.post(user_search.attr('url'),{'chaine':user_search.val()});
					  
			        jqXHRsearch.done(function( data, textStatus, jqXHR ){				
				    
					    response = $.trim(data);
						
						if(response!=="")//sion a une réponse,on affiche la liste
						{
					      $('.liste').html(response);

					      follow_him();
                        }						  						
				    }); 
					
				  $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
				}
            });
			
			
			
			
		    //ceci mettre un article en favoris
		    $('.favorite_wiki').click(function() {
			
			   var fav = $(this);
			
		       var url_fav = fav.attr('url_fav');//url de l'action
			
			   var jqXHRFav = $.post(url_fav+$('.look_wiki').html(),'');
					  
			        jqXHRFav.done( function(data, textStatus, jqXHR ){				
				    
					  response = $.trim(data);
						
					  // on change le statu du bouton et d'autre action
					  $('.fav_count').html(response);//on met à jour le nombre de personne qui on kifé 					
				    });
					
			      return false;
		    })
			
			
			//ceci est pour afficher un article au hazard
			$('.random').unbind('click');
			
		    $('.random').click(function() {
			
			 //On affiche la box pour patienter                  
		     $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();

		        if(window.device=='mobile'){

		        	window.show_page();
		        }
			 
			 $.blockUI();//onblock le navigateur
			 
			 //on prend l'url pour générer l'article au hazard
			   $.ajax({

				    url: $('#get_API').attr('get_random_article'),
                                        
				    async : true,

				    type: 'GET',

				    dataType:"json",
	                    
			        error: function(e){

			                   console.log(e);

			                   $('#info_msg_wait').fadeOut();

			                   $.unblockUI();//on débloque le navigateur

			                },//On efface la box qui fait patienter
                                        
				    success: function(random_page){ 
				            //console.log(random_page); 
							 //c'est bon je récupère l'id de larticle généré
							//var page_id = random_page.query.random[0].id;
                            
							$('.wiki_title').html('<h1>'+random_page.page_title+'</h1>');
							$('.wiki_content').html(random_page.page_text);	
							article_ready();
							$.unblockUI();//on débloque le navigateur	

						}
				}); 
			
			 return false;			
			
			});



            $('.accueil').unbind('click');
			
		    $('.accueil').click(function() {

		    	//On affiche la box pour patienter                  
		       $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();

		       if(window.device=='mobile'){

		       	   window.show_page();
		       }
			
			   $.ajax({

				    url: $('#get_API').attr('api'),
                                        
				    async : true,

				    type: 'GET',

				    dataType:"json",

				    data: {},
					                    
			        error: function(e){console.log(e); $('#info_msg_wait').fadeOut();},//On efface la box qui fait patienter
                                        
				    success:function(wikipedia){ 
				    	    $('.wiki_title').html('<h1>'+wikipedia.page_title+'</h1>');
							$('.wiki_content').html(wikipedia.page_text);	
							article_ready();	
						}
				}); 
			
			 return false;			
			
			});
		
			

            
			//on affiche l'article en passanrt par la base de donnée 
            function retrieve_article_server(page_url,recorder) {
			
			       //on récupère l'article
				    $.ajax({ 
    
							url: $('#get_API').attr('api'),
                                        
							type: 'POST',
							
							data: {'page_url':page_url},
                                        
							async : true,

							dataType:"json",
								            
							error: function(e){ console.log(e)
							                  $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
											},
                                        
							success:function(page_aff) {

	                                   retrieve_article_text(page_aff,page_url); 
									}
					}); 
            }

			
		    function retrieve_article_url(page_url){
	    
				if(window.indexedDB || window.openDatabase) //s'il le navigateur supporte indexeddb
			    {
					
					$.indexedDB(dbName).objectStore("article").get(page_url).done(function(result, event){
                       
						if(result==undefined)//sil ya pas l'article,on le prend  au serveur
						{ 
						
						    var recorder = 'yes';
					     
					        retrieve_article_server(page_url,recorder);//on prend l'article au serveur
						}
						else
						{ 
						  //On apprete le titre et le texte
						  var title_push = result.page_title;
											  
						  var text_push = result.page_text;
						  
						  window.full_text = result;

						  $('.wiki_title').html('<h1>'+title_push+'</h1>');		     		
						  $('.wiki_content').html(text_push);
									  
									   
						  $('.look_wiki').html(page_url);//relève la page qu'il consulte
						  $('.look_wiki').attr('page_title',title_push);//relève la page qu'il consulté
							
                                      
	                        $(function(){article_ready()});//On applique des actions sur le texte
						}
                        event; // Success Event
                    });
					
					$.indexedDB(dbName).objectStore("article").get(page_url).fail(function(error, event){ 
					    var recorder = 'yes';
					    //console.log('deviation'); 
					    retrieve_article_server(page_url,recorder);//on prend l'article au serveur	
                    });
				}
				else
				{
					if($.jStorage.storageAvailable())//est ce que navigateur supporte le webstorage?
                    { 
					   //si oui...
					   //on regarde s'il a le texte
					    var article_title = $.jStorage.get('title_'+page_url);
					   
					    if(!article_title)
					    {
						 var recorder ='yes';
						 
						 retrieve_article_server(page_url,recorder);//on prend l'article au serveur	   
                        }
						else
						{
						  $('.wiki_title').html('<h1>'+$.jStorage.get('title_'+page_url)+'</h1>');									  
						
						      
                              $('.look_wiki').html(page_url);//relève la page qu'il consulte
						      $('.look_wiki').attr('page_title',$.jStorage.get('title_'+page_url));//relève la page qu'il consulte
   	   
                              //on affiche le texte
							   
							     $('.wiki_content').html($.jStorage.get('text_'+page_url));
								 
								 article_ready();//On applique des actions sur le texte	
						}
                    }
                    else
                    {
					   var recorder = 'yes';
					     
					   retrieve_article_server(page_url,recorder);//on prend l'article au serveur	
                    }
                }					
			}
			
			
			
			function put_article(page_url,title_push,text_push)
			{
			 //console.log('article chargé');								   									  
									  
			 //j'enregistre l'article
                                             
				 //le titre
              $.jStorage.set('title_'+page_url,title_push);
											 
			  //le texte
              $.jStorage.set('text_'+page_url,text_push);
                                             
			 //son ordre 
              //on récupère le tableau qui garde les articles
              var all_articles = $.jStorage.get('all_article'); //qui renvoie le tableau des articles												 
											    
				if(!all_articles)//si ce tableau n'existe pas
				{
				 //on créée le tableau
				 var all_articles = new Array();
													   
				 $.jStorage.set('all_article',all_articles);//et on enregistre ce tableau
				}
													
			 //console.log(all_articles.length);
			 //console.log(all_articles.join());											 
												
			 //on ajoute le dernier article dans la liste du tableau
			 all_articles.unshift(page_url);//tableau.unshift() Cette méthode permet dajouter un ou plusieurs élément au début du tableau
											  
			 $.jStorage.set('all_article', all_articles);//et on enregistre ce tableau
			}


       

            //actions à faire à l'affichage d'un article
            function article_ready(){
			
			    //faire un unbind des évènement dans la page 
                //$('.extiw,.new,.external,.toc a,.internal,mw-magiclink-isbn,.mw-redirect').unbind('click');//on détache le click s'il était présent avant				
			    
				$(document).ready(function(){

					//On load de javascript file of the video
		            $.getScript($('.ted_video').attr('js'));
					
					$('.wiki_content').html($('.wiki_content').html().replace('REDIRECT','<i class="icon-refresh"></i> '));
					
					
					//on cha,ge le titre de la page
					$('title').html($('.wiki_title').text());
			
		   
		            //On met une axtérisque sur la distinction des pages non rédigées
		   	        $('.new').append('<sup>(Page not found)</sup>');
		   	        //Et on met un signal sur les liens externes
		   	        $('.extiw').append('<i class="icon-info-sign"></i><sup>*</sup>');
					
			
			        //On affiche l'url des pages externes
		   	        $('.external').html($('.external').html()+' <i class="icon-info-sign"></i><sup>*</sup>');
	               

                    //action à effectuer sur les liens qui sont dans l'article.
                    $('.wiki_content a:not(.new,.toc a,.internal),area').unbind('click');
                    $('.wiki_content a:not(.new,.toc a,.internal),area').click(function() { 

                    	$('#info_msg_wait').html($('#Please_wait').html()).fadeIn();//on affiche le message pour patienter
			         
			            var page_url = $(this).attr('href').replace($('.hoster').attr('host_wiki'),'').replace($('.hoster').attr('host'),'');
			            

				  		retrieve_article_url(page_url);
				
					    return false;                    
			        });


			        $('.wiki_content img').addClass('image');

			        //Ceci est pour les images cliquable pour agrandissement
					$('.image').unbind('click');//ON détaches les clicks précédents

					
					$('.image').click(function() {
                        //On récupère l'images
                       var chiizz = '<img src="'+$(this).attr('src')+'" />';

                       $('.click_download').attr('href',$(this).attr('src'));//On fait le lien de téléchargement de l'image
					   
					   //je vide l'image précédent si il en avait
					   $('.my_place').html($('#Please_wait').html());
					   $('.my_title').html('');
					   
					   //et on met la nouvelle image
					   $('.my_place').html(chiizz);
					   $('.my_title').html($('.my_place > img').attr('alt'));
					   
                        $('.big_tof').click();	

                        $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter						
			         	return false;	            
                    });

                });
				
				
				//on donne la position de l'utilisateur aux autres followers s'il est suivi	
                var wiki_follow = $('.wiki_follow').html();

				if(wiki_follow=='me')
				{ 
					socket.emit('fellow',{'room':my_user_id,'page_url': $('.look_wiki').html(),'full':window.full_text}); //emit to 'room' except this socket	
				}
				
				$('.special_nav').fadeIn();//on affiche le boutons cachés du navigo
				   
				//$('.look_wiki').attr('if_article','yes');//signale que le navigo est tout ouvert

                $.unblockUI();//on débloque le navigateur				
		        
		        //We wipe the double Title
		        $('#firstHeading').fadeOut();
		        $('#title').fadeOut();
				                      
				$('body').animate({scrollTop : '0px'},1000);//on te scroll au debut de la page

				$('#toTop').click();

				$('#info_msg_wait').fadeOut();//On efface la box qui fait patienter		
			}

			
		
			
			//cette fonction permet d'afficher l'historique
			$('.historic').click(function() { 

				if(window.device=='mobile'){

					window.hide_page();
				}

                //On affiche la box pour patienter                  
		        $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
                
				if(window.indexedDB || window.openDatabase) //s'il le navigateur supporte indexeddb
			    {
				    //On initialise les variable qui vont porter les id et les titres 
				  //Connexion
				  var my_connect = $.indexedDB(dbName).objectStore("all_article");
				  
				      //On récupère les id
				     my_connect.get('table_article_url').done(function(result_url, event_url){
                  
				        if(event_url.type=="success")
						{
					      //on récupère le tableau qui garde les articles
                         var all_url = result_url; //qui renvoie le tableau des id des articles
					
					        if(result_url==undefined)//si ce tableau existe				
					        {
						     window.notificate_it($('.msg_historic').attr('no_historic'),'error','bottomRight');//ON affiche le msg d'échec
				             $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter		
						    }
						    else
						    {
						      //On récupère des titres maintenant
						        my_connect.get('table_article_title').done(function(result_title,event_title){
						       
						            if(event_title.type=="success")
									{
                    				   var  all_title = result_title; //qui renvoie le tableau des titres des articles
									   
									   affiche_hist(all_url,all_title);//on envoi à la fonction qui affiche tout
									}
							    });
						    }
						}
					});
				}				  
			    else 
			    { 
				    if($.jStorage.storageAvailable()) //si le navigateur supporte le web storage, on récupère l'historique dans son pc
					{
                     //on récupère le tableau qui garde les articles
                     var all_article_hist = $.jStorage.get('all_article'); //qui renvoie le tableau des articles												 
											 
		                if(all_article_hist)//si ce tableau existe				
					    { 
					     //on affiche ces articles là
					  
					     //on compte le nombre d'élément du tableau
					     var nbre_article = parseInt(all_article_hist.length);
						
					        if(nbre_article > 0)//si on a assurément des articles
						    { 
					         //affiche les chevrons de la liste
					         $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_click"><li class="nav-header"><i class="icon-globe icon-white"></i>'+$('.historic').html()+' '+$('.historic').attr('title') +'</li></ul>');
								
					            for(i=0; i < nbre_article; i++) 
						        {
	                             var start = '<li class="active_ceci">';
							 
							     var list_title = $.jStorage.get('title_'+all_article_hist[i]);	
															
						         var b = '<a href="#" page_url="'+all_article_hist[i]+'" class="hist_wiki">';
															
							     var c = '<i class="icon-chevron-right" style="float:right;"></i>';
																
							     var e = list_title;
															
							     var f = '<span style="float:right;"><span  class="label label-info">&nbsp;&nbsp;&nbsp;</span></span>';//span du rien du tout
															
							     var end = '</a></li>';
															   
								 //on affiche
                                 $('.liste_click').append(start+b+c+e+f+end).fadeIn('slow');
                 				               
                                 //on affiche le fichier js qui gère le résulatat affiché
                                    if(i==(nbre_article-1))
                                    {
								      window.click_by_url();
								    }												
                                }
						    }
						
						    if(nbre_article == 0)//si on n'a pas des articles
						    {
						      window.notificate_it($('.msg_historic').attr('no_historic'),'error','bottomRight');//ON affiche le msg d'échec
				             $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
						    }
					    }
					    else
					    {
					     //on fait la requete à la base de donnée
					     window.notificate_it($('.msg_historic').attr('no_historic'),'error','bottomRight');//ON affiche le msg d'échec
				         $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
					    }
					}
                }				
               return false;		            
            });
			
			
			$('.aspirated').click(function() {

                 aspirated();
			});
			
			//cette fonction permet d'afficher les catégories aspirées
			function aspirated() {

				if(window.device=="mobile"){

					window.hide_page();
				}

              //On affiche la box pour patienter                  
		     $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
			 
			  //affiche les chevrons de la liste
			  $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_cat"><li class="nav-header"><i class="icon-folder-open icon-white"></i>'+$('.aspirated').attr('category')+'</li></ul>');
							
			 //je récupère la liste des catégories
			   var objectStore_cat = $.indexedDB(dbName).objectStore("category");
		   
		       var promise_cat = objectStore_cat.get("cat_list");
			
			    promise_cat.done(function(cat_list, event){
			
			        if(cat_list==undefined)//s'il ya pas la catégorie,on affiche le message d'échec
				    {
				     $('.liste_cat').append('<div class="alert"><button type="button" class="close" data-dismiss="alert">×</button> '+$('.resultat').attr('no_article')+'</div></li>');
					                    
					 $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
				    }
					if(event.type=="success" && cat_list!==undefined) //On affiche les catégories listées
					{ 
					   nbre_cat = cat_list.length;
					   
					    if(nbre_cat > 0)//si on a assurément des articles
						{ 	
					        for(i=0; i < nbre_cat; i++) 
						    {
	                         var start = '<li class="active_ceci">';
							 
							 var list_title = cat_list[i];	
															
						     var b = '<a href="#" cat_url="cat_art_'+list_title+'_url" cat_title="'+cat_list[i]+'"class="this_cat">';
															
							 var c = '<i class="icon-chevron-right" style="float:right;"></i>';
																
							 var e = list_title;
															
							 var f = '<span style="float:right;"><span  class="label label-info">&nbsp;&nbsp;&nbsp;</span></span>';//span du rien du tout
															
							 var end = '</a></li>';
															   
							 //on affiche
                             $('.liste_cat').append(start+b+c+e+f+end).fadeIn('slow');
                 				               
                              //on affiche le fichier js qui gère le résultat affiché
                                if(i==(nbre_cat-1))
                                {
								  click_by_cat();
								}												
                            }
						}
						else
					    { 
						  $('.liste_cat').append('<div class="alert"><button type="button" class="close" data-dismiss="alert">×</button> '+$('.resultat').attr('no_article')+'</div></li>');
					                    
						  $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
					    }
					}
			    });
			}
			
			
			
			//cette fonction affiche les articles d'une catégorie
			function retrieve_all_article_cat(cat_url,cat_title)
			{
			    //On affiche la box pour patienter                  
		     $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
			 
			  //affiche les chevrons de la liste
			  $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_click"><li class="nav-header"><span class="back">(<i class="icon-backward icon-white"></i> '+$('.aspirated').attr('back')+' ) </span>'+cat_title+'</li></ul>');
							
			 //je récupère la liste des catégories
			   var objectStore_cat_try = $.indexedDB(dbName).objectStore("category");
		    
		       var promise_cat_title = objectStore_cat_try.get("cat_art_"+cat_title+"_title");
			
			    promise_cat_title.done(function(cat_list_title,event_title){
			     
			        if(cat_list_title==undefined)//s'il ya pas la catégorie,on affiche le message d'échec
				    {
				        $('.liste_click').append('<div class="alert"><button type="button" class="close" data-dismiss="alert">×</button> '+$('.resultat').attr('no_article')+'</div></li>');
					                    
					    $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
				    }
					else //On affiche les articles de la catégorie clicquée
					{
					   nbre_art_cat = cat_list_title.length;
					   
					   //on prend les id des articles
					    objectStore_cat_try.get(cat_url).done(function(cat_list_url,event_url){
			                
							if(event_url.type=="success")
					        {
					            if(nbre_art_cat > 0)//si on a assurément des articles
						        { 	
					                for(i=0; i < nbre_art_cat; i++) 
						            {
	                                  var start = '<li class="active_ceci">';
							 
							          var list_title = cat_list_title[i];	
													
						              var b = '<a href="'+$('.hoster').attr('kiwix')+cat_list_url[i]+'"  class="click_list">';
															
							          var c = '<i class="icon-chevron-right" style="float:right;"></i>';
																
							          var e = list_title;
															
							          var f = '<span style="float:right;"><span  class="label label-info">&nbsp;&nbsp;&nbsp;</span></span>';//span du rien du tout
															
							          var end = '</a></li>';
															   
							          //on affiche
                                      $('.liste_click').append(start+b+c+e+f+end).fadeIn('slow');
                 				               
                                      //on affiche le fichier js qui gère le résultat affiché
                                        if(i==(nbre_art_cat-1))
                                        {
								            window.click_by_url();
								        }												
                                    }
								}
							}
						});
				    }
				});
			    
			}
			
			
			//cette fonction affiche l'hitorique venant de la bdd indexeddb
			function affiche_hist(all_url,all_title)
			{
			 //on affiche ces articles là
				 //on compte le nombre d'élément des tableaux
				 var nbre_article_url = parseInt(all_url.length);
							 
			     var nbre_article_title = parseInt(all_title.length);
						
					if(nbre_article_url > 0 && nbre_article_title > 0)//si on a assurément des articles
					{ 
					 //affiche les chevrons de la liste
					 $('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_click"><li class="nav-header"><i class="icon-globe icon-white"></i>'+$('.historic').html()+'</li></ul>');
								
					  //on parcour le tableau qui affiche alors tous les articles visités du plus rescent au plus ancien
					       
					 //et on parcours notre tableauen unverse
					    for(i=0; i < nbre_article_url; i++) 
						{
						  var start = '<li class="active_ceci">';
							 
						  var list_title = all_title[i];	
															
						  var b = '<a href="'+$('.hoster').attr('kiwix')+all_url[i]+'" class="click_list">';
															
						  var c = '<i class="icon-chevron-right" style="float:right;"></i>';
																
						  var e = list_title;
															
						  var f = '<span style="float:right;"><span  class="label label-info">&nbsp;&nbsp;&nbsp;</span></span>';//span du rien du tout
															
						  var end = '</a></li>';
															   
						  //on affiche
                          $('.liste_click').append(start+b+c+e+f+end).fadeIn('slow');
                 				               
                          //on affiche le fichier js qui gère le résulatat affiché
                            if(i==(nbre_article_url-1))
                            {
							  window.click_by_url();
							}
						}
					}
					else
					{
					 window.notificate_it($('.msg_historic').attr('no_historic'),'error','bottomRight');//ON affiche le msg d'échec
				     $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter
					}
						
			}
			
			
	  //ceci affiche l'historique dans le menu de haut
        function retrieve_historic(){
        
		    //on efface les anciens liens
		    $('.push_liste').html('');

		    for(i=0;i<window.list_historic.length;i++){

		    	var data = window.list_historic[i];

			    $('.push_liste').prepend('<li><a href="'+data.page_url+'" class="hist_wiki">'+data.page_title+'</a> <span class="divider">|</span></li>');
		   
                if(i==window.list_historic.length-1){

                	window.click_by_url();
                }
		    }

			if(window.device=='standart'){

				$('.dance_for_me').fadeIn();

				$(".dance_for_me").effect('shake',{},500);//O'oooh! yes baby shake it! heuuu...on attitre l'attention sur les historiques de navigation
			}	
        }


        
		
		//ceci est pour faire défiler les notification en page d'accueil

            //si le navigateur supporte le webstorage et que j'ai des articles téléchargés en local
			var cool = defile_note();
			
			function defile_note(){
			    
				if($('.wiki_title').html()=='')//si il n'est pas sur une autre page autre que la page d'accueil
				{
				  
				  $('.wait_it').html($('#Please_wait').html());//on affiche le message pour patienter
                
				 //////////////////////////
				  //on fait un ping pour voir si le serveur on est online
			        $.ajax({ 
    
						    url: $('#site_url').attr('url')+'/ping_it',
                                        
							type: 'POST',
							
							async : true,
							
							statusCode: {
                                         404: function() {
                                                    if($.jStorage.storageAvailable() && $.jStorage.get('counter_note'))
                                                    {
			                                         //j'affiche les notification en local
			                                         defile_note_local();
													 
													  //on déclanche le défilement
                                                     let_go();
			                                        }
                                            }
                                        },
							            
							error: function(){ 
							                   //j'affiche les notification en local
			                                         defile_note_local();
													 
													  //on déclanche le défilement
                                                     let_go();
											},
                                        
							success:function() {
							                     //je télécharge les notification au serveur
				                               
												}
				    });
				
                }				 
			}
			
			
			//fait défiler lesnotification en local
			function defile_note_local()
			{ 
			    if($.jStorage.storageAvailable() && $.jStorage.get('counter_note') )
                {
				   var titres = new Array();var contenus = new Array();var photos = new Array();
				   
				   var nbre_pub = $.jStorage.get('counter_note');
				   
				   var all_note = $.jStorage.get('all_note');
				   
				    for(i=0;i < nbre_pub;i++)
					{
				      var note_indiv = all_note[i];
					  
					  var a ='<div> <h5><i class="icon-envelope icon-white"></i> <span class="label label-info"> Enjoy </span> </h5>';
					  
					  var b = note_indiv[0]+'<br><br>';
					     
					  var c = '<b>'+note_indiv[1]+'</b> </div><br><br>';//slogan
					  
					  var d = '<span style="float:right;"><i class="icon-time icon-white"></i> <span class="user_post">'+note_indiv[2]+'</span></span>';
						
					  
					   
					        titres.push(note_indiv[1]);
							contenus.push(note_indiv[0]);
							photos.push(note_indiv[3]);
							chariot = 0;
					}
					
					// My_notty(titres,contenus,photos,chariot);//on enregistre les notification sous forme de tableau le Nottify

                     $('.wait_it').html('');//on efface me message de patience					
				}
			}
			
			
			

			
			
			//cette fonction s'occupe de tous les articles dont on peut générer par l'appel de son url
			window.click_by_url =  function(){
			      //on détache les évènements précédents
	                                $('.hist_wiki,.back,.plus_wiki_b,.liste_click a,.click_list,.cat_wiki').unbind('click');//Ne pas enlever unbind sur .cat_wiki
	
		                            //pour les articles de wikipedia
			                        $('.click_list,.liste_click a').click(function() { 

			                            if(window.device=='mobile'){ 

			                          	    window.show_page();
			                            }

			                            if($(this).parent().parent().attr('type')=='gutenberg') { //If it's a result of gutenberg library,we open the book in a new window
                                           
                                            window.open($('.hoster').attr('host_wiki')+$(this).attr("href"), "popupWindow", "width=600,height=600,scrollbars=yes");
                                    
			                            }else{
                                            
                                            //On affiche la box pour patienter                  
		                                    $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
			
			                                var page_url = $(this).attr('href').replace($('.hoster').attr('host_wiki'),'').replace($('.hoster').attr('host'),'');

				                            //On désactive tous les boutons actifs
                                            $('.liste_click .active').attr('class','active_ceci');
			
				                            //Et on active le bouton sur le quel on vient de cliquer	
                                            $(this).parent().attr('class','active');
								      
								            retrieve_article_url(page_url);
			                            }     
									  
                                      return false;		            
                                    });

                                    $('.hist_wiki').click(function(){ 

                                    	$('#info_msg_wait').html($('#Please_wait').html()).fadeIn();//on affiche le message pour patienter
			         
			                            var page_url = $(this).attr('href').replace($('.hoster').attr('kiwix'),'');

				  		                retrieve_article_url(page_url);
				
					                    return false;                   
                                    }); 

                                     //Gestion du bouton pour afficher plus d'articles
                                    $('.plus_wiki_b').click(function(){

                                        //On affiche la box pour patienter
                                        $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();

                                        //ON récupère l'url actuel
                                        var form_data = {url: window.nbre_page_resultat[window.nbre_page_resultat_actuel]};

                                        //On remplace par l'url suivant s'il y en a
                                        if(window.nbre_page_resultat.length>=window.nbre_page_resultat_actuel){

        	                                window.nbre_page_resultat_actuel = window.nbre_page_resultat_actuel+1;
                                        }else{

                                        	$('.plus_wiki_b').fadeOut();//On cache le bouton plus s'il n y a plus de résultats
                                        }
					   
	                                    $.ajax({ 

                                            url: $('#get_API').attr('api_search_plus'),

                                            type: 'POST',

                                            async : true,

			                                dataType:"json",

			                                error: function(e){

						 	                    $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter

						 	                    console.log(e);},

                                            data: form_data,

                                            success: function(papi) {
							                    //regardons si on a un résultat
							                    //si oui
							                    if(papi.statu =='success')
							                    {
												
								                    $('.stock_engine').html(papi.result);//ON met le résultal dans un div

								                    $('.liste_click').append($('.results ul').html()).fadeIn('slow');//On extrait du résultat ce qui nous interesse

								                    $('.stock_engine').html('');//O efface le contenu de ce div pour économiser la mémoire de l'user

								                    $(document).ready(function(){

                                                        window.click_by_url();//Gestion des clicks des articles
								                    });						                         						                         
							                    
							                        //On cache le bouton plus s'il nya plus de rsultat
                                                    if(window.nbre_page_resultat.length==window.nbre_page_resultat_actuel){

                                        	            $('.plus_wiki_b').fadeOut();
                                                    }
							                    
                                                    $('.header_result').html(papi.header);//On affiche l'avancement des résultats
							                    }	 
						                        
                                                $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 		 
					                        }
                                        });
				   			
                                        return false;   
                                    });

                $('.back').click(function() { 
                	aspirated();
                }); 									
                                
			    $('#info_msg_wait').fadeOut();
			}

				
				
				//cette fonction s'occupe de toutes les catégories dont on peut générer par l'appel de son titre
			function click_by_cat(){
			      //on détache les évènements précédents
	                                $('.this_cat').unbind('click');
	
		                            //pour les articles de wikipedia
			                        $('.this_cat').click(function() { 
									
									   //On affiche la box pour patienter                  
		                              $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
			
			                          var cat_url = $(this).attr('cat_url');
									  var cat_title = $(this).attr('cat_title');
				
				                      //On désactive tout les boutons actifs
                                      $('.liste_cat .active').attr('class','active_ceci');
			
				                      //Et on active le bouton sur le quel on vien de cliquer	
                                      $(this).parent().attr('class','active');
				              	
								      retrieve_all_article_cat(cat_url,cat_title);
									  
                                      return false;		            
                                    }); //et on charge le fichier js qui prend en charge les nouveaux éléments											  
                                
			    $('#info_msg_wait').fadeOut();
			}
			
			
			
			//cette fonction fait apparaitre le formulaire de recherche	 des catégories		 
			$('.all_category').click(function() {

				
				//on affiche le formulaire
			 $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();//On affiche la box pour patienter
			
			    $.ajax({
    
				    url: $('#get_API').attr('api_category'),
					
					type: 'POST',
					
					async : true,
							
				    error: function(e){

                            console.log(e);

				            $('#info_msg_wait').fadeOut();},//On efface la box qui fait patienter
                                        
				    success:function(list){

				    	    if(window.device=='mobile'){

				    	    	window.page_open='no';

					            window.show_page();
				            }
			    			            
							$('.wiki_title').html('');

							//On stoke temporairement le html pour sélection dans le dom
							$('.stock_engine').html(list.page_text);//ON met le résultal dans un div
		                    
							$('.wiki_content').html($('.stock_engine div')[8]).fadeIn();
							$('.wiki_content').prepend('<div class="alert alert-info">'+list.page_warning+'</div>');           

							$('.stock_engine').html(''); 
							
							$.getScript($('#url_search_cat').attr('url'));
							
							$('#info_msg_wait').fadeOut();
						}
				});
				
			 return false;
			   
			});
			
			
			
			
			
	var my_infos = my_info();
	var my_username,my_numero,my_user_id;
			
			
	//On enregistre les données de l'utilisateur en local(téléphone,username,userid,rtc_id)	
	function my_info()
	{
	    $.ajax({ 
    
		    url: $('.my_info').attr('url_info'),
                                        
		    type: 'POST',
							                            
			async : true,
							
			dataType:"json",
					                    
			error: function(data){ 
                                   my_username = $.jStorage.get('username');
                                   my_numero   = $.jStorage.get('numero');
                                   my_user_id  = $.jStorage.get('user_id');
                                   goodbye(my_user_id);
								   },
                                        
			success:function(data) {
			
			            if(data.statu =='connected')
						{
			
			             //S'il ya suffisamene d'espace en localstorage on enregistre ses données
                         var taille_actuel = $.jStorage.storageSize();
						
						 var taille_max = 37600; //taille en octet
                        
                            if(taille_actuel > taille_max)//on vidange tout
                            {
						     $.jStorage.flush();
                            }
                        
                         //de toute facon en registre les données de l'user
                         $.jStorage.set('username',$.trim(data.username));
                         $.jStorage.set('numero',$.trim(data.numero));
                         $.jStorage.set('user_id',$.trim(data.user_id));
						 
						
                            my_username = $.trim(data.username);
                            my_numero   = $.trim(data.numero);
                            my_user_id  = $.trim(data.user_id);
                            goodbye(my_user_id);

                         //completion des choses
                         $('.my_name').html($.jStorage.get('username'));
						 $('.my_info').attr('username',$.jStorage.get('username'));
						 $('.my_info').attr('numero',$.jStorage.get('numero'));
						 $('.my_info').attr('user_id',$.jStorage.get('user_id'));
						}
						else
						{
						  //console.log(data.statu);
						}

                     //console.log($.jStorage.index());					 
	                }
		});
	}


	function redirection_connect(){

		if(window.confirm_connected!==true){ //C'est bon les indentifiants sont libres
      
			$.ajax({
    
				    url: $('.already_used').attr('connexion_trait'),
					
					type: 'POST',
					
					async : true,

					dataType:"json",

					data : {'pseudo':window.pseudo_con,'number':window.number_con},
							
				    error: function(e){console.log(e)},//On efface la box qui fait patienter
                                        
				    success:function(data){

				    	    if(data.statu=='yep'){

				    	    	window.location.href = $('.already_used').attr('redirect');
				            }else{

				            	$('#erreurs').html(data.erreurs);
				            }
						}
			}); 
		}
	}


    $('.click_me').unbind('click');

	$('.click_me').click(function(){

		window.confirm_connected = false;

		 window.pseudo_con = $.trim($('.pseudo_user').val());

		 window.number_con = $.trim($('.number_user').val());

		if(window.pseudo_con!=='' && window.number_con!==''){

			socket.emit('verif_connexion',{'number':window.number_con,'pseudo':window.pseudo_con,'sender':my_numero});

			$('.loader_connect').fadeIn();
			$('.loader').fadeIn();
			$('.loaderdotconnect').loadingDots();
    		$('.loaderdotconnect').toggleLoadingDots();
		}

		window.setIntervalAsk = setTimeout(redirection_connect,6000);

		return false;
	})

	
	socket.on('im_connected',function(){

		clearTimeout(window.setIntervalAsk);

		$('#erreurs').html($('.already_used').attr('msg'));

		window.confirm_connected = true;

		$('.loader_connect').fadeOut();//ON ferme le loader
		$('.loader').fadeOut();
		$('.loaderdotconnect').toggleLoadingDots();
	});



	socket.on('echo',function(sender){

		socket.emit('im_connected',sender);
	});




    $('.critika').click(function(){

        $('.critik').val('');
    })


	$('.send_critik').click(function(){ 

		var critik_text = $.trim($('.critik').val());

        if(critik_text!==''){

        	var form_data = {'text':critik_text};

        	$.ajax({
                    url: $("#url_critik").attr('action'),
                    type: 'POST',
                    async : true,
				    error: function(){$('.critik').val('Pas de réseau');},
                    data: form_data,
                    success: function() {

                    	$('.critik').val('Envoyé!');
                    }
            }); 
        }
			    
				   

		return false;
	});




     //Affichage du nombre de message au hazard à la page d'accueil
    $('.random_message').html(Math.floor(Math.random()*101));


    //Gestion de l'apparition des deux moteur de recherhe
    $(function(){

        setInterval(function(){

        	if($('.begoo_click').attr('response')==undefined){

        		if( window.device=='standart'){ //Si ce n'est pas un mobile j'affiche le moteu de recherche

        			$('.show_me_search').fadeIn();
        		}else{ //Si s'en est un j'affiche si le menu liste est ouvert

                    if(window.page_open =='no'){ 

                       $('.show_me_search').fadeIn();  
                    }else{

                       $('.show_me_search').fadeOut();
                    }
        		}		
        	}
        },1000);
    });


    /*

    var lastTime = (new Date()).getTime();

    setInterval(function() {
  var currentTime = (new Date()).getTime();
  if (currentTime > (lastTime + 2000*2)) {  // ignore small delays
    // Probably just woke up!
  }
  lastTime = currentTime;
}, 2000);

    */
			
			
	
});	