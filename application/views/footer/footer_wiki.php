
	    </div>     
	    
	</div>

</div>


            <!-- Block qui la box qui fait patienter pendans le chargement ajax -->
	        <div id="Please_wait"style="display:none;"> <img src="<?php echo base_url().'assets/css/images/ajax-load.gif'; ?>" > <?php echo $this->lang->line('statu_wait'); ?></div>	
              
			<div id="info_msg_wait" style="display:none;" class="alert alert-info">
               
            </div>
	
	

    <!-- url de MAJ ajax du statu du compte du membre connecté -->
	<div id="url_maj" style="display:none;"><?php echo site_url();?>/msg/notification/CountPub</div>
	
	
	<!-- url de MAJ ajax pour savoir si l'user à toujours une session ouverte -->
	<div id="url_session" style="display:none;"><?php echo site_url();?>/user/connect/session</div>
    
	<!-- Url du controlleur de connexion pour ajax -->
	<div id="url_connect" style="display:none;"><?php echo site_url();?>/user/connect/connexion</div>
    
	<!-- Block qui affiche le petit box de signalement de nouveau message et qui après,explose après -->
	<div id="new" style="display:none;">
	    <div class="new_messsage alert alert-info">
            <?php echo $this->lang->line('statu_newMsg'); ?>.
	    </div>
    </div>
	

	<!-- Block qui affiche les box de succes d'un action -->
    <div id="good_msg" style="display:none;" class="alert alert-success">
			<p><i class="icon-ok"></i> <span class="messenger"></span></p>           
    </div>

    <!-- Block qui affiche le box d'echec d'une action -->
    <div id="bad_msg" style="display:none;" class="alert alert-error">
            <p><i class="icon-minus-sign"></i> <span class="messenger"></span></p> 
    </div>
	
	<!-- Block qui affiche le box d'information action -->
    <div id="info_msg" style="display:none;" class="alert alert-info">
            <p><i class="icon-info-sign"></i> <span class="messenger"></span></p> 
    </div>
	
	
	
	<!-- Le savez-vous? -->
    <div class="modal" id="do_you_nknowLabel" tabindex="-1" style="display:none;" role="dialog" aria-labelledby="do_you_nknow" aria-hidden="true">
	    
        <!-- le corps de la fenêtre modal -->
		<div class="modal-body">
		
	        <p class="text-info"><?php echo $this->lang->line('form_do_you_text'); ?> </p>
	        <p><textarea class="critik" placeholder="...critiques"></textarea></p>
	        <a class="m-btn purple-stripe send_critik">Send (Envoyer) <i class="icon-envelope-alt"></i></a>       
        
		</div>
				
		<!-- le footer de la fenêtre modal -->
        <div class="modal-footer">
                   
	        <button class="btn submit_closer" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i>OK</button>  
        
		</div> 
           
    </div>


    <!-- pour les photos d'agrandissement -->
	<div id="big_kiss" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h3 id="myModalLabel"><i class="icon-fullscreen"></i><span class="my_title"></span></h3>
            </div>
            <div class="modal-body">
			<span class="my_place"></span>
            </div>
            <div class="modal-footer">
              <a class="btn btn-mini btn-success click_download" target="_blank" href="" download><?php echo $this->lang->line('form_download_img'); ?></a>
              <button class="btn btn-mini btn-info" data-dismiss="modal"><b>X</b></button>
            </div>
    </div>
         
    <span style="display:none;"><a data-toggle="modal" href="#big_kiss" class="big_tof">this</a></span>


     
       
    <!-- Pour l'aspiration des caégories -->   
    <div id="Modal_loader" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="Modal_loaderLabel" aria-hidden="true">
            
                <div class="modal-body body_loader">
				    <p class="text-info"><span class="wait_load_msg"></span></p>
					<div id="hide_progress" style="display:none;"><div id="progressbar_loader" style="width:50%;" level="0"></div></div>
                </div>
              
			    <div class="modal-footer">
                    <button class="btn btn-info unblock" data-dismiss="modal"><span class="load_msg"></span> (<span class="num_level">0</span>%)</button>
                </div>
    </div>
			
         
			
			
    <div class="confirm_loader" msg="<?php echo $this->lang->line('form_downloader'); ?>" close="<?php echo $this->lang->line('form_close'); ?>" stop="<?php echo $this->lang->line('form_stop'); ?>" style="display:none;"><?php echo $this->lang->line('form_sorry'); ?></div>
	<div class="loader_wait" local="<?php echo $this->lang->line('statu_load_local'); ?>" collect="<?php echo $this->lang->line('statu_load_collect'); ?>" download="<?php echo $this->lang->line('statu_load_down'); ?>"  over="<?php echo $this->lang->line('statu_load_over'); ?>" no_article ="<?php echo $this->lang->line('statu_load_no_article'); ?>"></div>



	
	
	<!-- pour la prise de photo-->		
	<div class="modal hide fade" id="my_tof" aria-labelledby="my_tofLabel" aria-hidden="false">
        
        <div class="modal-body">
            <img src="" id="picture" />    
        </div>
		
		<div class="modal-footer">
		    <button class="btn btn-primary" id="sendPhoto" data-dismiss="modal" aria-hidden="true"> <i class="icon-chevron-right icon-white"></i> <?php echo $this->lang->line('form_sendIt'); ?></button>
            <button class="btn" data-dismiss="modal" id="Cancel_sendPhoto" aria-hidden="true"><?php echo $this->lang->line('form_cancel'); ?></button>
        </div>        
    </div>
	
	
	
	<div id="canvas" style="display:none;">
	    <canvas id="photo_ready"  height="240">  
        </canvas>
	</div>
	

    <div class="form_u_msg" msg="<?php echo $this->lang->line('form_u_msg'); ?>" php="<?php echo site_url().'/msg/messenger/incomingMessage'; ?>" form_call="<?php echo $this->lang->line('form_call'); ?>" form_end_call="<?php echo $this->lang->line('form_end_call'); ?>"></div>
	
	
	
	
	<div id="statu_user" connected="<?php echo $this->lang->line('form_statu_connect'); ?>" disconnected="<?php echo $this->lang->line('form_statu_disconnect'); ?>"></div>
	
	
	<!-- Modal -->
    <div class="modal hide fade" id="myModal_form_msg" tabindex="-1" style="display:none;" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <!-- Modal -->
		<div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="myModalLabel"><?php echo $this->lang->line('form_message'); ?></h3>
        </div>
		        <!-- Affichage des erreurs -->
        <div id="validateTips" style="display:none; width:75%;" class="alert alert-error"></div>
		<div id="erreur_message" style="display:none;"><?php echo $this->lang->line('form_err_Msg'); ?></div>
           
                <!-- le corps de la fenêtre modal -->
				
		    <form class="form-horizontal">
			    
                <div class="modal-body">
	                <div class="alert alert-info">
                        <i class="icon-plus"></i> <?php echo $this->lang->line('bulle_number'); ?>
                    </div>
     
	                <div ><b>- <span id="counter_msg">145 </span></div>
                    <div id="bar_note"></div>
					
                    <div class="control-group">
					 <label class="control-label" for="inputNumber_msg_contain" ><?php echo $this->lang->line('form_message'); ?>*</label>
                        <div class="controls">
						    <span class="w">
		                        <textarea id="inputNumber_msg_contain" name="messages" placeholder="<?php echo $this->lang->line('form_message'); ?>"  rows="6"></textarea>
		                    </span>
                        </div>
                    </div> 
                    					
                </div>
				
				<!-- le footer de la fenêtre modal -->
                <div class="modal-footer"><a href="#" class="btn btn-primary submit_msg"><i class="icon-pencil icon-white"></i> <?php echo $this->lang->line('form_sendIt'); ?></a>
                   
	                <button class="btn submit_closer" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i> <?php echo $this->lang->line('form_cancel'); ?></button>  
                </div> 
            </form>
           <div id="url_traitMsgForm" style="display:none;"><?php echo site_url().'/msg/notification/new_pub'; ?></div>
    </div>

    <div class="not_news" not_news ="<?php echo $this->lang->line('form_not_news'); ?>"></div>
	
	
			
			
	<!-- pour le numéro de téléphone-->		
	<div class="modal hide fade" id="my_person" aria-labelledby="my_personLabel" aria-hidden="false">
        
        <div class="modal-body">
		    
			<div class="alert alert-block">
                <h4>Warning!</h4>
                <?php echo $this->lang->line('form_advice_call'); ?>
            </div>
			
            <p>		
			   <form class="form-horizontal">
                    <div class="control-group">
                        <label class="control-label" for="telephone"><?php echo $this->lang->line('form_number'); ?></label>
                        <div class="controls">
						    
                                <input class="span2 number_phone" verif_friend="<?php echo site_url().'/user/user/verif_friend'; ?>" placeholder="Téléphone" id="telephone" size="16" type="text" autofocus>
				                <button class="btn btn-primary call_number" type="button"><i class="icon-play icon-white"> </i>&nbsp;&nbsp;Joindre cette personne</button>
					            <button class="btn btn-warning" type="button" data-dismiss="modal" aria-hidden="true"> <i class="icon-remove icon-white"> </i></button>
                           
                        </div>
                    </div>
                </form>			
			</p>
        </div>    
    </div>
	

    <div id="alert" no_call="<?php echo $this->lang->line('form_no_call'); ?>" no_active_conv="<?php echo $this->lang->line('form_no_activ_speak'); ?>" form_u_number="<?php echo $this->lang->line('form_u_number'); ?>" form_none_number="<?php echo $this->lang->line('form_none_number'); ?>" error="<?php echo $this->lang->line('form_error'); ?>" nobody="<?php echo $this->lang->line('form_nobody'); ?>" new_call="<?php echo $this->lang->line('form_new_call'); ?>" reject_call="<?php echo $this->lang->line('form_reject_call'); ?>" end_call="<?php echo $this->lang->line('form_call_ended'); ?>"  wat="<?php echo $this->lang->line('form_wat'); ?>" no_contact="<?php echo $this->lang->line('form_no_contact'); ?>" incompatible="<?php echo $this->lang->line('form_incompatible'); ?>" busy="<?php echo $this->lang->line('form_busy'); ?>"></div>
		
    <div id="friends_liste" url="<?php echo site_url().'/user/user/List_friends'; ?>"></div>
	
	
    <div class="msg_historic" no_historic="<?php echo $this->lang->line('form_no_historic'); ?>" ></div>

    <div class="no_connected" no_connected="<?php echo $this->lang->line('form_no_connected'); ?>" ></div>


    <div class="modal hide fade" id="facetimer" aria-labelledby="facetimerLabel" aria-hidden="false">
        
        <div class="modal-body">
			
            <video id="caller" class="facetime" src="" autoplay></video>
        </div>

        <div class="modal-footer">                
	        <button class="btn btn-danger" id="end_this_call" data-dismiss="modal" aria-hidden="true">
	            <i class="icon-facetime-video icon-white"></i> <?php echo $this->lang->line('form_end_call'); ?>
	        </button>  
        </div> 
    </div>

	
	
	
	    <?php if($this->session->flashdata('statu_wonder'))
		    { ?>
	         <!-- la box de notification -->
	         <div id="statuMessage_yann" class="alert draggable">
		        <button type="button" class="close" data-dismiss="alert">×</button>
			   <?php echo $this->session->flashdata('statu_wonder'); ?>
		     </div>
			 
		     <?php 
		    }
		?>



    <!-- Pour le téléchargement des navigateurs -->
	<div class="browser" style="display:none;">
		           <a href="<?php echo base_url(); ?>/assets/logi/chrome.exe"><span class="label label-info"><i class="icon-windows icon-white"></i> Chrome (windows XP,7,8)</span></a>  
		           <a href="<?php echo base_url(); ?>/assets/logi/firefox.exe"><span class="label label-info"><i class="icon-windows icon-white"></i> Firefox (windows XP,7,8)</span></a>  
		           
		           <a href="<?php echo base_url(); ?>/assets/logi/com.android.chrome.apk"><span class="label label-info"><i class="icon-windows icon-android"></i> Chrome (Android)</span></a>
    </div>
	
	
	

	<!-- url pour les critiques -->
	<div id="url_critik" action="<?php echo site_url().'/user/user/critik'; ?>" ></div>
	
	<!-- url pour afficher la liste des préférences et traite la mise à jour-->
	<div class="my_prefer_liste" action="<?php echo site_url().'/user/user/list_prefer'; ?>" rel="<?php echo site_url().'/user/user/list_prefer_trait'; ?>"></div>
	
	
	<div class="confirm" style="display:none;"><i class="icon-ok"></i></div>
	
	<div id="fade_pencil" style="display:none;"><i class="icon-pencil"></i></div>
	
	<!-- url le javascript des notifications -->
	<div id="url_js_note" action="<?php echo base_url().'assets/js/last_notes.js'; ?>" ></div>
	
	
	<!-- url le javascript des messages chat -->
	<div id="url_js_chat" action="<?php echo base_url().'assets/js/chat_seeMessage.js'; ?>" ></div>

	
	
	<!-- ceci est pour la lecture des messages en bdd -->
	<div id="reader_msg" url="<?php echo site_url().'/msg/messenger/ListeMsg'; ?>"></div>
	
	
	<!-- url lpour le son du tchat -->
	<div id="song" url_chat="<?php echo base_url().'assets/song/beep'; ?>" url_bell="<?php echo base_url().'assets/song/bell'; ?>" ></div>
	
	
	
	
	<!-- pour provoquer vérification si l'interlocuteur chat est en ligne -->
	<div id="online" numero=""></div>
		
	<!-- pour provoquer la lecture des conversations en local -->
	<div id="all_conversation" numero=""></div>
	
	<!-- pour provoquer la prise de photo -->
	<div id="capture"></div>


	<!-- pour le moteur de recherche -->
	<div class="stock_engine" style="display:none;"></div>


	<div class="all_number_user" href="<?php echo site_url().'/user/user/all_number_user'; ?>"></div>
	
	
	<!-- ceci est pour le chat en instantané -->
	<div id="js_chat" statu="no" live="<?php echo site_url().'/msg/messenger/js_chat'; ?>"></div>
	<span style="display:none;" id="link_add"></span>
	
     <!-- ceci est pour le click d'affichage du wiki_text -->
	<div id="retriever"  page_content="<?php echo site_url().'/wikipedia/wiki/page_content'; ?>" url_explode="<?php echo site_url().'/wikipedia/wiki/explode_padeId/'; ?>"></div>
	
	
	<div id="url_search_cat" url="<?php echo base_url().'assets/js/wiki_category_search.js'; ?>"></div>
	<div id="wiki_cat_download" url="<?php echo base_url().'assets/js/wiki_category_download.js'; ?>"></div>
	<span action="<?php echo site_url().'/msg/notification/ListePub/'; ?>" class="my_msg_pub" ></span>
	<span action="<?php echo site_url().'/msg/notification/ListePub_out/'; ?>" class=" my_msg_pub_out" ></span>
	
	<span class="article_cat" article="<?php echo $this->lang->line('form_cat_art'); ?>"> </span>  

	<span class="already_used" msg="<?php echo $this->lang->line('form_already_used'); ?>" redirect="<?php echo site_url(); ?>" connexion_trait ="<?php echo site_url().'/user/connect/connexion_trait'; ?>"> </span>
	 
	<span class="notif_search" short="<?php echo $this->lang->line('form_short'); ?>"></span>

	<span class="not_allow_family" message="<?php echo $this->lang->line('form_not_allow_family'); ?>"></span>
	
	   
		<div id="get_API" get_random_article="<?php echo site_url().'/wikipedia/wiki/get_random_article'; ?>" ping="<?php echo site_url().'/wikipedia/wiki/ping' ; ?>" local_db="<?php echo WEB_STORAGE_NAME ; ?>" api_category_list="<?php echo site_url().'/wikipedia/wiki/list_article' ; ?>" api_category="<?php echo site_url().'/wikipedia/wiki/get_category' ; ?>" api="<?php echo site_url().'/wikipedia/wiki/get_article' ; ?>" api_search="<?php echo site_url().'/wikipedia/wiki/search' ; ?>" api_search_plus="<?php echo site_url().'/wikipedia/wiki/search_plus' ; ?>"></div>

		<div class="hoster" url="<?php echo HOSTER ; ?>" port_kiwix="<?php echo KIWIX_PORT ; ?>" zim="<?php echo ZIM ; ?>" kiwix="<?php echo KIWIX ; ?>"></div>
		
	    <div id="site_url"  url="<?php echo site_url().'/wikipedia/wiki'; ?>"></div>
		
		<div id="site_url_base" url="<?php echo site_url(); ?>"> </div>
		
		<div class="followed_user_id" user_id=""> </div>
		
		
		<div id="chat_conv" alone="<?php echo $this->lang->line('form_alone'); ?>" bye="<?php echo $this->lang->line('form_bye'); ?>" kwiki="Begoo"></div>
		
		
		<div id="url_image" url="<?php echo base_url().'assets/image_notif/' ; ?>"></div>
		<div id="url_image_logo" nothing="<?php echo $this->lang->line('bulle_begoo'); ?>" mode_out="<?php echo $this->lang->line('bulle_outline'); ?>" url="<?php echo base_url().'assets/img/' ; ?>"></div>
		
		
	<div id="url_node" url="<?php echo NODE; ?>"> </div>
	<div id="url_peer" host="<?php echo PEER_HOST; ?>" port="<?php echo PEER_PORT; ?>"> </div>




	
	

	
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery.blockUI.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery.indexeddb.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/IndexedDBShim.min.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/header.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/click.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery.classynotty.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/wiki_contact.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/wiki_search.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery.scrollToTop.min.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery.loadingdots.js"></script>
    

	<script type="text/javascript" src="<?php echo base_url();?>assets/js/wiki_navigo.js"></script>
	

	
</body>

</html>
