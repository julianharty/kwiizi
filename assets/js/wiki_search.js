$(document).ready(function(){

     //ce fichier s'occupe de la recherche

        $('.watermark_search_valid').unbind('click');

        $('.watermark_search').unbind('focus');

		//C'est ici qu'on lis le contenu de rechercher en appuyant sur la touche "entré" pour traiter
		$('.watermark_search').focus(function() {

		    $(document).unbind('keyup');

		    //On fait le focus sur la vrai recherche 
           $('.begoo').val($('watermark_search').val());			
			
			$(document).keyup(function(evenement){
			
			// Si evenement.which existe, codeTouche vaut celui-ci.
				 // Sinon codeTouche vaut evenement.keyCode.
                var codeTouche = evenement.which || evenement.keyCode;
               
			    if(codeTouche==13)//On lance la recherche si on appui sur la touche Entré
				{	
                  $('.watermark_search_valid').click();		   
			    }
            });
			
	     return false;	 
        });



          //Pour le focus sur Begoo
    $('.begoo').focus(function(){

        $('.begoo').keyup(function(evenement){
 
           //On fait le focus sur la vrai recherche 
           $('.watermark_search').val($('.begoo').val());

           // Si evenement.which existe, codeTouche vaut celui-ci.
				 // Sinon codeTouche vaut evenement.keyCode.
                var codeTouche = evenement.which || evenement.keyCode;

                if(codeTouche==13)//On lance la recherche si on appui sur la touche Entré
				{	
                  $('.watermark_search_valid').click();	  
			    }   
        })  
    })


    $('.begoo_click').click(function(){

    	$('.watermark_search_valid').click();
    })
		
		
		
		//C'est ici qu'on lit contenu de rechercher en appuyant sur recherche pour traiter
		$('.watermark_search_valid').click(function() {	 

						    
			if($.trim($('.watermark_search').val())!=='')
			{
				var chaine = $(".watermark_search").val().toLowerCase();

				if(chaine.length <= 2 ){

                    window.notificate_it($('.notif_search').attr('short'),'error','bottomRight');//ON affiche le msg d'échec
				}
				else{

					//On affiche certains menu cachés
					$('.install').fadeIn();

					$('.begoo').blur();

                        var form_data = {string: chaine};

						//On affiche la box pour patienter
                        $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
					   
				        $.ajax({ 

                         url: $('#get_API').attr('api_search'),

                         type: 'POST',

                         async : true,

						 dataType:"json",

						 error: function(e){

						 	           $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter

						 	           console.log(e);},

                         data: form_data,

                         success: function(papi) {

                         	            if(window.device=='mobile'){

                         	            	window.hide_page();
                         	            }

									  //regardons si on a un résultat
										//sinon
										    if(papi.statu =='fail')
											{
										      //on affiche le message d'erreur
											  $('.liste').html('<div class="alert alert-block"> '+papi.result+' </div>');
											}
											
										//si oui
										    if(papi.statu =='success')
											{
												//le bouttons "plus" dabord
												var plus_boutton = '<button class="btn btn-info plus_wiki_b" type="button"><i class="icon-plus icon-white"></i></button>';
											   
												$('.liste').html('<ul class="nav nav-list bs-docs-sidenav liste_click" counter="50"><li class="nav-header"><i class="icon-globe icon-white"></i> '+$('.resultat').attr('message')+': <span class="badge badge-success header_result">'+papi.header+'</span></li></ul>'+plus_boutton);
										
										        $('.stock_engine').html(papi.result);//ON met le résultal dans un div

												$('.liste_click').append($('.results ul').html()).fadeIn('slow');//On extrait du résultat ce qui nous interesse

												$('.stock_engine').html('');//On efface le contenu de ce div pour économiser la mémoire de l'user


                                                  //Debut gestion de pagination
												$('.stock_engine').html(papi.footer);//ON met les pagination des resultats

												var page_resultat = $('.footer li a').length;

												//Stockage des url des pages de resultat
												window.nbre_page_resultat = new Array();
												
												for(i=0;i<page_resultat;i++){

                                                    window.nbre_page_resultat.push($('.footer li a')[i].href);

                                                    if(i==page_resultat-1){
                                                    	
                                                    	$('.stock_engine').html('');//O efface le contenu de ce div pour économiser la mémoire de l'user

                                                    	window.nbre_page_resultat_actuel = 2;
                                                    }
												}

												$(document).ready(function(){

                                                    window.click_by_url();//Gestion des clicks des articles
                                                    //$(window).scrollTop($(document).height());	
												});						                         						                         
											}
                                 
                                 $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 		 
								}
                            });
                    }
			}			
            return false;
        });
		
});

	