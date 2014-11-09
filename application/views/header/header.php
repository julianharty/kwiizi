
<!DOCTYPE html>
<html lang="fr" manifest="<?php echo base_url();?>manifest/hi.manifest">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<title>{title}</title>
	
	<link rel="icon" href="<?php echo base_url(); ?>assets/img/favo_icon.png" />
	
	<link href="<?php echo base_url();?>assets/css/bootstrap.min.css" rel="stylesheet">   
	<link href="<?php echo base_url();?>assets/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/jquery-ui.css" rel="stylesheet">
	
    <link type="text/css" href="<?php echo base_url();?>assets/css/jquery.classynotty.css" rel="stylesheet"/>
	
	<link type="text/css" href="<?php echo base_url();?>assets/css/scrollToTop.css" rel="stylesheet"/>
	
	<link type="text/css" href="<?php echo base_url();?>assets/css/boldlight.css" rel="stylesheet"/>	
	
    <link href="<?php echo base_url();?>assets/css/begoo.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/jquery.ui.chatbox.css" rel="stylesheet">
	
	
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jstorage.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/json2.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/node/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/node/peer.js"></script>
	
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/app_socket.js"></script>
	
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery.noty.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/default.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/bottomRight.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/centerLeft.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/topCenter.js"></script>
	
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/humane.min.js"></script>
	
	

</head>


<body>

<!-- Navbar   
    ================================================== -->
    <div class="navbar navbar-inverse">
    
        <div class="navbar-inner">
            <a class="brand listing one" href="#"><i class="icon-chevron-left"></i>Kwiki v1.0</a>
            <a class="brand two" href="#"></i>Kwiki v1.0</a>
            <ul class="nav pull-right">

            	<li class="">
                      <a href="<?php echo site_url().'/wikipedia/wiki'; ?>" class="bulle off_hider" data-placement="bottom" title="home"><i class="icon-home icon-white"></i>  <!-- <span class="lang"><?php echo $this->lang->line('form_home'); ?></span> --></a>
		            </li>
					
					<li class="">
                      <a href="#myModal" data-toggle="modal" data-target="#myModal_form_msg" class="off_hider" rel="<?php echo site_url().'/msg/messenger/FormMsg' ;?>" ><i class="icon-pencil icon-white"></i> <!-- <?php echo $this->lang->line('statu_send'); ?>--></a>
		            </li>
					
					<!--
					<li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_aspire_note'); ?>" data-placement="bottom" class="bulle all_category"><i class="icon-download-alt icon-white"></i> <span class="lang"><?php echo $this->lang->line('form_aspire'); ?></span></a>
		            </li>
					-->

					<li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_call_note'); ?>" data-placement="bottom" class="bulle sender_message off_hider"><i class="icon-facetime-video icon-white"></i> <!-- <span class="lang"><?php echo $this->lang->line('form_call'); ?></span>--></a>
		            </li>
					
					<li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_contact_note'); ?>" data-placement="bottom" class="bulle contact off_hider"><i class="icon-user icon-white"></i>  <!--<span class="lang"><?php echo $this->lang->line('form_contact'); ?></span>--></a>
		            </li>

		            <li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_hello_w'); ?>" data-placement="bottom" class="bulle hello_world off_hider"><i class="icon-comments-alt icon-white"></i>  <!--<span class="lang"><?php echo $this->lang->line('form_hello'); ?></span>--></a>
		            </li>

		            <li class="">
                      <a href="<?php echo site_url().'/search/search_wiki/historic/'; ?>" data-placement="bottom" class=" bulle historic off_hist" title="<?php echo $this->lang->line('form_historic');?> !"><i class="icon-time icon-white sub_hide"></i><span class="off_hist_caracter"></span></a>
		            </li>
                    
                    <!--
		            <li class="">
                      <a href="#" class="aspirated view" category="<?php echo $this->lang->line('form_category');?>" back="<?php echo $this->lang->line('form_back');?>"><span class="label label-important"> <i class="icon-download-alt icon-white"></i> <?php echo $this->lang->line('form_cat_aspire');?> </span></a>
		            </li>
					-->

                    <!--
				    <li class="input-append">
					     <input class="user_search input-small" data-source="["yann","coco"]" data-provide="typeahead" url="<?php echo site_url().'/wikipedia/wiki/find_leader'; ?>"  type="text" placeholder="...!">
					     <span class="label label-inverse"> <?php echo $this->lang->line('statu_follow_us'); ?> <i class="icon-user icon-white"></i></span> 				         
				    </li>
                    -->

					<?php 
						    if($this->session->userdata('logged_in'))
							{ ?>
					
					<li class="">
					   <a href="#" class="bulle my_msg off_hider" title="<?php echo $this->lang->line('bulle_msg'); ?>" data-placement="bottom"><span id="new_msger" class="badge badge-warning mes_msg"></span><i class="icon-envelope icon-white"></i>  <!--<?php echo $this->lang->line('bulle_msg'); ?>--></a>
                    </li>

                    <li class="">
					   <a href="#" class="bulle my_note off_note" title="<?php echo $this->lang->line('bulle_notification'); ?>" data-placement="bottom"><span class="badge badge-info mes_notes sub_hide"></span><i class="icon-bell icon-white sub_hide"></i> <span class="off_note_caracter"></span><!--<?php echo $this->lang->line('bulle_notification'); ?>--></a>
                    </li>					
					
					
					<?php } ;?>
					<li class="">
					    <?php 
						    if($this->session->userdata('logged_in'))
							{ ?>
			           <a href="<?php echo site_url().'/user/deconnexions'; ?>" url_new_message="<?php echo site_url(); ?>/msg/messenger/ListeMsg" numero="<?php echo $this->session->userdata('numero'); ?>" rtc_id="" username="<?php echo $this->session->userdata('username'); ?>" user_id="<?php echo $this->session->userdata('user_id'); ?>" url_info="<?php echo site_url(); ?>/user/user/my_info" class="bulle my_info off_hider" title="<?php echo $this->lang->line('bulle_deconnect'); ?>" data-placement="bottom"><small><b><span class="my_name" url="<?php echo site_url(); ?>/user/maj"><?php echo $this->session->userdata('username'); ?></span>  <!--<?php echo $this->lang->line('form_disconnection'); ?>--></b></small> <i class="icon-off icon-white"></i></a>
				       <?php }
						    else
                            { ?>
						<a href="<?php echo site_url(); ?>" class="bulle off_hider" title="<?php echo $this->lang->line('not_connected'); ?>" data-placement="bottom"> <!--<small><b><?php echo $this->lang->line('not_connected'); ?></b></small> --><i class="icon-off icon-white"></i></a>
				       <?php } ?>                         							
					</li>

            </ul>
        </div>

    </div>
   
						 
		
		<div id="statuMessage" class="alert alert-info ">
		    <button type="button" class="close" data-dismiss="alert">×</button>
			<div id="Message">
			</div>
			
		</div>
		<div id="yann" style="display:none">		
		</div>

	