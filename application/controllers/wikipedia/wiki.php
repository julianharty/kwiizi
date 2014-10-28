<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Wiki extends CI_Controller 
{

public function __construct()
	{	  
	  // Call the Controller constructor
     parent::__construct();
	  
	  $this->load->helper('url');
	  	
		//on charge les sessions
	    $this->load->library('session');
			
		//on charge la librairie de parceage pour templeter la vue
	    $this->load->library('parser');
		
		$this->load->library('form_validation');
			
	  //le helper de texte pour limiter les chaines de caractère lors de certains l'affichages
	    $this->load->helper('text');
		
		//C'est cette ligne de code qui détecte la langue du navigateur et affiche le site dans la langue correspondante
		$this->lang->load('form', $this->config->item('language'));
		$this->lang->load('statu', $this->config->item('language'));
		$this->lang->load('bulle', $this->config->item('language'));
		$this->lang->load('note', $this->config->item('language'));

        //On appelle la fonction qui s'occuper de la messagerie
	    $this->load->model('msg/msgs');	
		
        //On appelle la fonction qui s'occuper des membres connectés
	    $this->load->model('user/connects');
		$this->load->model('user/users');
		
		//On appelle la fonction qui de la recherche
	    $this->load->model('wikis/wikis');
		$this->load->model('search/searchs');
	}

	
	 	 
public function hi()
	{ 
		
        if($this->session->userdata('logged_in'))//si on est connecté on va direct à la page d'accueil
	    {
	        redirect('','refresh');//et la redirection
		}
		else // si c'est pas le cas,on affiche le formulaire de connexion où on vérifie aussi la compatibilité du navigateur
		{ 
		 //On fait un array des données à transmettre aux entetes et corps de page
		 $data = array(
            'title'    => 'Kwiki',
		    'h1'       => 'Kwiki',
			'top'      => 'wikipedia',
			'nbre_user'=> $this->users->nbre_user()
                           );
			 
		 $this->parser->parse('page/all_pages_first',$data);
		 $this->parser->parse('wikipedia/first',$data);
		 $this->parser->parse('footer/footer_wiki',$data);
		}
	}
	
	
public function index()
	{ 

		$this->session->set_userdata('device', 'standart');

	    if(!$this->session->userdata('logged_in'))//si on est connecté on va direct à la page d'accueil
	    {
	        redirect('wikipedia/wiki/hi','refresh');//et la redirection
		}
		else
		{
	      //On fait un array des données à transmettre aux entetes et corps de page
		 $data = array(
            'title'    => 'Kwiki',
		    'h1'       => 'Kwiki',
			'top'      => 'wikipedia'
                           );
			 
		 $this->parser->parse('page/all_pages',$data);
		 $this->parser->parse('wikipedia/wikipedia',$data);
		 $this->parser->parse('footer/footer_wiki',$data);
		}
	}



	
	
//Ici on affiche le fichier js qui gère l'affichage du wiki
public function page_content()
    {
	   echo '<script type="text/javascript" src="'.base_url().'assets/js/wiki_content.js"></script>';
	}
	
	
	
	
//Ici on casse url pour ressortir le titre de la page qui va servir à consulter la page sur le wiki
public function explodeIt_and_FeelPAgeId()
    {
	   //on définit les règles de succès: 	      
	  $this->form_validation->set_rules('url_article','','required|trim|xss_clean');
		 	
	    if($this->form_validation->run())
		{				
		 echo $this->wikis->explodeIt_and_FeelPAgeId($this->input->post('url_article'));//terminé!
		}                     
	}
	


	
	
//Ici je demande qu'on me suive	
public function follow_me()
    {
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 
            echo $this->wikis->follow_me();
		}           
	}


//Ici je demande qu'on ne me suive plus
public function follow_me_over()
    {
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 		    
          $this->wikis->leader_del($this->session->userdata('user_id'));
		}         
	}


//Ici je demande à suivre un user
public function follow_him($user_id)
    {
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in') and $user_id!=$this->session->userdata('user_id'))
	    { 		    
          $result = $this->wikis->follow_him($user_id);
		  
		    if($result)
			{
			   echo 'yes';
			}
		}         
	}
	
	
//Ici je demande à ne plus suivre toute personne
public function stop_follow_him($user_id)
    {
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 		    
          $result = $this->wikis->stop_follow_him($user_id);
		  
		    if($result)
			{
			   echo 'yes';
			}
		}         
	}




//Ici un cherche à savoir si on a de nouveaux commentaires pour le chat en cours
public function if_new_com()
    {	   
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 
		    //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('last_com_time','','required|trim|xss_clean|numeric');
      
         	if($this->form_validation->run())
		    {
	   	     //on renvoi "1" s'il ya de nouveaux commentaires
		     echo $this->wikis->if_new_com($this->input->post('last_com_time'));             			
			}
		}
	}



//Ici on récupère les nouveaux commentaires
public function new_com()
    {	  
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 
		    //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('last_com_time','','required|trim|xss_clean|numeric');
          
         	if($this->form_validation->run())
		    {
		     $reponse = $this->wikis->new_com($this->input->post('last_com_time')); 
        
                if($reponse!==false)
                {
				    //on encode la réponse qui est un array
				  header('Content-Type: application/json');
                  echo json_encode($reponse);	                   					
                }				
			}
		}
	}



	
//Ici on renvoi juste le timestamp du serveur	
public function my_last_time()
    {	   
	   echo time();
    }




	
//je sélectionne les dernieres personnes qui veulent qu'on les suive
public function leader()
    {	   
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 
	   	  //J'envoi à l'usine à  gaz
		  $result = $this->wikis->leader();
		   
			if($result)
			{
			    foreach ($result as $row)
                {
				    ?>
                    
				        <a href="#" class="follow_him" user_id="<?php echo $row->follow_user ; ?>"  user_name="<?php echo $row->last_username ; ?>" url_user_id="<?php echo site_url().'/wikipedia/wiki/follow_him/'.$row->follow_user; ?>">
					       <?php echo $row->last_username ; ?>
						</a>
						<span class="divider">|</span>
				 
				    <?php 
				 
				}
			}
			else
			{?>
			   <span></span>
			 <?php
			}
        }	
	}



//je sélectionne les dernieres personnes qui veulent qu'on les suive dans la recherche
public function find_leader()
    {	   
	   //on vérifie si l'user est connecté 
        if($this->session->userdata('logged_in'))
	    { 
	   	   //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('chaine','','required|trim|xss_clean');
          
         	if($this->form_validation->run())
		    {	  
		     //J'envoi à l'usine à  gaz
		      $result = $this->wikis->find_leader($this->input->post('chaine'));
		    
			    if($result)
			    { ?>
				   <div class="bs-docs-example">
					  
					    <ul class="nav nav-list bs-docs-sidenav">
						
						<?php
			        foreach ($result as $row)
                    {?>						
						<li class="active_ceci">
						
							<a href="#" class="follow_him" user_id="<?php echo $row->follow_user ; ?>" user_name="<?php echo $row->last_username ; ?>" url_user_id="<?php echo site_url().'/wikipedia/wiki/follow_him/'.$row->follow_user; ?>">
						
								<i class="icon-chevron-right" style="float:right;"></i>
			
			                    <?php echo $row->last_username ; ?>
							
							</a>
					
						</li>
					
				     <?php
				    } ?>
				        </ul>
					</div>
					
					<?php
                }				
			}
        }	
	}


//CEtte fonction sélectionne un article au hasard
public function random()
   {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
		  	
	    if($this->form_validation->run())
		{  		            
		 $json_url = $this->input->post('url_api').'api.php?action=query&list=random&rnnamespace=0&format=json';
 
         echo file_get_contents($json_url);//on renvoi la réponse		  
		}   
   }


//CEtte fonction récupère l'id d'un article
public function get_id_title()
   {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
	 $this->form_validation->set_rules('page_title','','required|trim|xss_clean');
		  	
	    if($this->form_validation->run())
		{  		            
		 $json_url = $this->input->post('url_api').'api.php?action=query&prop=info&format=json&titles='.urlencode($this->input->post('page_title'));
 
         echo file_get_contents($json_url);//on renvoi la réponse		  
		}   
   } 





//CEtte fonction afficle le formulaire de recherche des catégories
public function category_form()
    {?>
     	 <h1><?php echo $this->lang->line('form_search_cat'); ?></h1> 	
	     
		    <div class="input-append">
		     <input class="input-xlarge string_cat" type="text"><button class="btn btn-info click_cat" type="button"><i class="icon-search icon-white"></i></button>            
            </div>

			<div class="alert alert-info">
                <?php echo $this->lang->line('form_loader'); ?>  
            </div>
			
			<div class="alert alert-error"> 
                <?php echo $this->lang->line('form_warning'); ?>  
            </div>
			
   <?php
   }   


//CEtte fonction liste les 	catégories d'article
public function all_category()
    {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
	 $this->form_validation->set_rules('chaine','','required|trim|xss_clean');
	 	  	
	    if($this->form_validation->run())
		{  		            
		 $json_url = $this->input->post('url_api').'api.php?action=query&list=allcategories&acprop=size&format=json&aclimit=50&acprefix='.urlencode($this->input->post('chaine'));
 
         echo file_get_contents($json_url);//on renvoi la réponse		  
		}   
   }
   
   
   
   
 //CEtte fonction liste toutes les pages d'une catégorie
public function all_page_category()
    {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
	 $this->form_validation->set_rules('category','','required|trim|xss_clean');
	 $this->form_validation->set_rules('continue','','required|trim|xss_clean');
	 	  	
	    if($this->form_validation->run())
		{
		  $continue = $this->input->post('continue');
            
			if($continue =='new_babi')//on fait la requête pour la première fois sur la catégorie		
		    {
    		 $json_url = $this->input->post('url_api').'api.php?action=query&list=categorymembers&format=json&cmlimit=500&cmtitle=Category:'.urlencode($this->input->post('category'));
            }
			else//On fait la requête pour une N ième fois
			{
			  $json_url = $this->input->post('url_api').'api.php?action=query&list=categorymembers&format=json&cmlimit=500&cmtitle=Category:'.urlencode($this->input->post('category')).'&cmcontinue='.urlencode($this->input->post('continue'));
			}
			
         echo file_get_contents($json_url);//on renvoi la réponse		  
		
		}   
   }
   
   
   
  //CEtte fonction liste plus de catégorie d'articles
public function plus_all_category()
    {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
	 $this->form_validation->set_rules('chaine','','required|trim|xss_clean');
	 $this->form_validation->set_rules('from','','required|trim|xss_clean');
	 	  	
	    if($this->form_validation->run())
		{  		            
		 $json_url = $this->input->post('url_api').'api.php?action=query&list=allcategories&acprop=size&format=json&aclimit=50&acprefix='.$this->input->post('chaine').'&acfrom='.urlencode($this->input->post('from'));
 
         echo file_get_contents($json_url);//on renvoi la réponse		  
		}   
   }



//CEtte fonction liste des articles au hasard
public function list_random()
    {
     //on définit les règles de succès: 	      
	 $this->form_validation->set_rules('url_api','','required|trim|xss_clean');
	 $this->form_validation->set_rules('nbre_article','','required|trim|xss_clean|numeric');
		  	
	    if($this->form_validation->run())
		{  		            
		 $json_url = $this->input->post('url_api').'api.php?action=query&list=random&rnnamespace=0&format=json&rnlimit='.$this->input->post('nbre_article');
 
         echo file_get_contents($json_url);//on renvoi la réponse		  
		}   
   } 
   
   
   
   
   //CEtte fonction sert de ping pour voir si la webapp est connecté au serveur
public function ping_it()
    {
     echo 'ok'; //c'est tout!
    } 



//CEtte fonction affiche le jeu
    public function game()
    { ?>
     <div id="slotMachine">
		<p id="slotCredits">15</p>
		<a href="#" id="slotTrigger">spin</a>
        <div id="wheel1" class="wheel">
            <img src="<?php echo base_url(); ?>assets/game/images/wheel1.gif" alt="" />
            <img src="<?php echo base_url(); ?>assets/game/images/ani.gif" alt="" class="slotSpinAnimation" />
        </div>
        <div id="wheel2" class="wheel">
            <img src="<?php echo base_url(); ?>assets/game/images/wheel2.gif" alt="" />
            <img src="<?php echo base_url(); ?>assets/game/images/ani.gif" alt="" class="slotSpinAnimation" />
        </div>
        <div id="wheel3" class="wheel">
            <img src="<?php echo base_url(); ?>assets/game/images/wheel3.gif" alt="" />
            <img src="<?php echo base_url(); ?>assets/game/images/ani.gif" alt="" class="slotSpinAnimation" />
        </div>
        <img src="<?php echo base_url(); ?>assets/game/images/over.png" alt="" id="wheelOverlay" />
		<p id="slotSplash">
			<a href="#">start</a>
		</p>
     </div>

     <?php	 
    }


    //Cette fonction va chercher les articles de wikipedia sur Kiwix
    public function get_article(){

    	 //on définit les règles de succès: 	      
	    $this->form_validation->set_rules('page_url','page_url','required|trim');
  	
	    if($this->form_validation->run()) 
		{ 	            
		   
            $response = file_get_contents(KIWIX.str_replace(" ","%20",str_replace("'","%27",$this->input->post("page_url"))));

            $response = mb_convert_encoding($response, 'HTML-ENTITIES', "UTF-8");

    	    $document = new DOMDocument();
    	    $document->preserveWhiteSpace = false;
            $document->formatOutput       = true;
       
            if($response)
            {
              libxml_use_internal_errors(true);
              $document->loadHTML($response);

              //On obtient le titre de la page
                $list = $document->getElementsByTagName("title");
                if ($list->length > 0) {

                    $title_text = $list->item(0)->textContent;
                }

                //On obtient le contenu de l'article
              $tags           = $document->getElementById('bodyContent');
         
              $full_text      = $this->DOMinnerHTML($tags);
            
              libxml_clear_errors();
            }		  
		}else{

			$response = file_get_contents(KIWIX.'/A/html/W/i/k/i/Wikipédia.html');
			$response = mb_convert_encoding($response, 'HTML-ENTITIES', "UTF-8");

    	    $document = new DOMDocument();
    	    $document->preserveWhiteSpace = false;
            $document->formatOutput       = true;
       
            if($response)
            {
            	
              libxml_use_internal_errors(true);
              $document->loadHTML($response);

                //On obtient le titre de la page
                $list = $document->getElementsByTagName("title");
                
                if($list->length > 0) {
                     $title_text = $list->item(0)->textContent;
                }

                //On obtient le contenu de l'article
              $tags        = $document->getElementById('bodyContent');
         
              $full_text   = $this->DOMinnerHTML($tags);
              
              libxml_clear_errors();
            }
		}

		$reponses['page_title']              = $title_text;
		$reponses['page_text']               = $full_text;
  
	    // on a notre objet $reponse (un array en fait)
        // reste juste à l'encoder en JSON et l'envoyer
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($reponses);  
    }


   


      //On extrait uniquement le contenu
    function DOMinnerHTML($element) 
    { 
       $innerHTML = ""; 
       $children = $element->childNodes; 
       
        foreach ($children as $child) 
        { 
           $tmp_dom = new DOMDocument(); 
           $tmp_dom->appendChild($tmp_dom->importNode($child, true)); 
           $innerHTML.=trim($tmp_dom->saveHTML()); 
        }

       return str_replace('/'.ZIM,KIWIX,$innerHTML);
    } 




    //Cette fonction exploite le moteur derecherche de Kiwix
    public function search(){

    	 //on définit les règles de succès: 	      
	    $this->form_validation->set_rules('string','string','required|trim');
  	
	    if($this->form_validation->run()) 
		{ 	          
		   $string = str_replace(' ','+',$this->input->post('string'));//On remplace les espaces par des +

		   $string = str_replace("'","%27",$string);//Des apostrophes par des %27

            $response = file_get_contents('http://'.HOSTER.':'.KIWIX_PORT.'/search?content='.ZIM.'&pattern='.$string);
       
            if($response)
            { 

               $header = $this->get_class_by_name($response,'header');

               $footer = $this->get_class_by_name($response,'footer');

               $result = $this->get_class_by_name($response,'results');

               $statu  = 'success';

            }else{

               $header = false;

               $footer = false;

               $result = $this->lang->line('form_error');

               $statu  = 'fail';
            }		  
		}else{

			$header = false;

			$footer = false;

            $result = validation_errors();

            $statu  = 'fail';
		}

		$reponses['header']              = $header;
		$reponses['footer']              = $footer;
		$reponses['result']              = $result;
		$reponses['statu']               = $statu;
  
	    // on a notre objet $reponse (un array en fait)
        // reste juste à l'encoder en JSON et l'envoyer
        header('Content-Type: application/json');
        echo json_encode($reponses);  
    }


    function get_class_by_name($text,$classname) //On prend le contenu dune class par son DOM
    {
	  $dom = new DomDocument();

      libxml_use_internal_errors(true);

      $dom->loadHTML($text);

      $finder = new DomXPath($dom);
      $nodes  = $finder->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]");


        foreach($nodes as $node) {

        	if($classname=='results'||$classname=='footer'){

        		return str_replace('/'.ZIM,KIWIX,$node->C14N());
        	}else{

        		return $node->nodeValue;
        	}
            
            
        }
     libxml_clear_errors();
    }



    public function search_plus(){

    	 //on définit les règles de succès: 	      
	    $this->form_validation->set_rules('url','url','required|trim');
  	
	    if($this->form_validation->run()) 
		{ 	          
		   
		   $url = str_replace('http://'.HOSTER,'http://'.HOSTER.':'.KIWIX_PORT,str_replace('http://'.DOMAINE_NAME,'http://'.HOSTER,str_replace("'","%27",str_replace(' ','+',$this->input->post('url')))));//Des apostrophes par des %27
		   
           $response = file_get_contents($url);
       
            if($response)
            { 

               $header = $this->get_class_by_name($response,'header');

               $footer = $this->get_class_by_name($response,'footer');

               $result = $this->get_class_by_name($response,'results');

               $statu  = 'success';

            }else{

               $header = false;

               $footer = false;

               $result = $this->lang->line('form_error');

               $statu  = 'fail';
            }		  
		}else{

			$header = false;

			$footer = false;

            $result = validation_errors();

            $statu  = 'fail';
		}

		$reponses['header']              = $header;
		$reponses['footer']              = $footer;
		$reponses['result']              = $result;
		$reponses['statu']               = $statu;
  
	    // on a notre objet $reponse (un array en fait)
        // reste juste à l'encoder en JSON et l'envoyer
        header('Content-Type: application/json');
        echo json_encode($reponses);  
    }



    //Cette fonction va chercher les catégories d'articles de wikipedia sur Kiwix
    public function get_category(){
  
        $response = file_get_contents(KIWIX.'/A/Catégorie:Accueil.html');

    	    $document = new DOMDocument();
    	    $document->preserveWhiteSpace = false;
            $document->formatOutput       = true;
       
            if($response)
            {
              libxml_use_internal_errors(true);
              $document->loadHTML($response);

              //On obtient le titre de la page
                $list = $document->getElementsByTagName("title");
                if ($list->length > 0) {
                     $title_text = $list->item(0)->textContent;
                }

                //On obtient le contenu de l'article
              $tags           = $document->getElementById('bodyContent');
         
              $full_text      = $this->DOMinnerHTML($tags);
            
              libxml_clear_errors();
            }		  
		

		$reponses['page_title']              = $title_text;
		$reponses['page_text']               = $full_text;
		$reponses['page_warning']            = $this->lang->line('form_warning');
  
	    // on a notre objet $reponse (un array en fait)
        // reste juste à l'encoder en JSON et l'envoyer
        header('Content-Type: application/json');
        echo json_encode($reponses);  
    }



    //Cette fonction va chercher les d'articles d'une catégorie dans wikipedia sur Kiwix
    public function list_article(){
  
        //on définit les règles de succès: 	      
	    $this->form_validation->set_rules('category','category','required|trim');
  	
	    if($this->form_validation->run()) 
		{ 	            
		   
            $response = file_get_contents(KIWIX.str_replace(" ","%20",str_replace("'","%27",$this->input->post("category"))));

    	    $document = new DOMDocument();
    	    $document->preserveWhiteSpace = false;
            $document->formatOutput       = true;
       
            if($response)
            {
              libxml_use_internal_errors(true);
              $document->loadHTML($response);

                //On obtient le contenu de l'article
              $tags           = $document->getElementById('bodyContent');
         
              $full_text      = $this->DOMinnerHTML($tags);
            
              libxml_clear_errors();
            }

		  $reponses['page_text']               = $full_text;
  
	      // on a notre objet $reponse (un array en fait)
          // reste juste à l'encoder en JSON et l'envoyer
          header('Content-Type: application/json');
          echo json_encode($reponses); 		  
		}	
    }


    //fait un test de ping de onnexion
    public function ping(){

    	echo 'on_line';
    }


      //Cette fonction va chercher les articles hasard de wikipedia sur Kiwix
    public function get_random_article(){ //http://library.kiwix.org/random?content=wiktionary_fr_all
	            
            $response = file_get_contents('http://'.HOSTER.':'.KIWIX_PORT.'/random?content='.ZIM);
            $response = mb_convert_encoding($response, 'HTML-ENTITIES', "UTF-8");

    	    $document = new DOMDocument();
    	    $document->preserveWhiteSpace = false;
            $document->formatOutput       = true;
       
            if($response)
            {
              libxml_use_internal_errors(true);
              $document->loadHTML($response);

              //On obtient le titre de la page
                $list = $document->getElementsByTagName("title");
                if ($list->length > 0) {
                     $title_text = $list->item(0)->textContent;
                }

                //On obtient le contenu de l'article
              $tags           = $document->getElementById('bodyContent');
         
              $full_text      = $this->DOMinnerHTML($tags);
            
              libxml_clear_errors();
            }		  
		

		$reponses['page_title']              = $title_text;
		$reponses['page_text']               = $full_text;
  
	    // on a notre objet $reponse (un array en fait)
        // reste juste à l'encoder en JSON et l'envoyer
        header('Content-Type: application/json');
        echo json_encode($reponses);  
    }



    public function test(){

    	echo site_url();
    }


	
}


?>