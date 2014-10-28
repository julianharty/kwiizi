<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller 
{

public function __construct()
	{	  
	  // Call the Controller constructor
     parent::__construct();
	  
	  $this->load->helper('url');
		
		//on charge les sessions
	    $this->load->library('session');
			
	  //le helper de texte pour limiter les chaines de caractère lors de certains l'affichages
	    $this->load->helper('text');
		
		//C'est cette ligne de code qui détecte la langue du navigateur et affiche le site dans la langue correspondante
		$this->lang->load('form', $this->config->item('language'));
		$this->lang->load('statu', $this->config->item('language'));
		$this->lang->load('bulle', $this->config->item('language'));


        $this->load->model('user/users');

        $this->load->library('form_validation');	

        //On appelle la fonction qui s'occuper des membres connectés
	    $this->load->model('user/connects');		 
    }


public function index()
    {
	   redirect('','refresh'); 
    }  	
	
	
//ICi on affiche la liste des préférences de l'utilisateur	
public function list_prefer()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if($this->session->userdata('logged_in'))
	    { 
	   	 //Je prend dabord la liste de toutes les préférences
		 $reponse_all = $this->users->liste_prefer_all(); //C'est un tableau qui est renvoyé
		 
		 //Je prend la liste de toutes les préférence de l'utilisateur
         $reponse_user = $this->users->liste_prefer_user();  
			
			if($reponse_all)
			{ ?>
			    <div class="alert alert-info">
				    <?php echo $this->lang->line('statu_prefer'); ?> <i class="icon-edit"></i>  
				</div>
				
				
			   <div class="alert alert-info">
                    			   
				 <?php
		            foreach($reponse_all as $all)//On affiche les cases à cocher de la liste des préférences
			        {?>			 
                      <label class="checkbox inline my_choice" value="<?php echo $all->id_preference; ?>">
                        <input type="checkbox" class="inlineCheckbox1" value=""> <?php echo $all->preference; ?>
                     </label>

					  <?php
					} ?>
					
               </div>
			  <?php
			}
			else
			{?>
			    <div class="alert alert-info">
			        <?php echo $this->lang->line('statu_error'); ?> <i class="icon-thumbs-down"></i>
				</div>
				
				<?php
			}
			
			echo '<br><br>';
			
			if($reponse_user)
			{
			  ?>
			    <div class="alert alert-info"> 
				    
					<span class="label label-info"><?php echo $this->lang->line('bulle_preference'); ?>  <i class="icon-ok icon-white"></i></span> <?php
			        
					foreach($reponse_user as $user)//On affiche la liste des préférences de l'user
			        {
			           echo $this->users->name_prefer_user($user->id_preference).',';
			        } ?>
					
				</div>
			 <?php
			}
			else
			{?>
			    <div class="alert alert-info">
			       <?php echo $this->lang->line('statu_not_prefer'); ?> <i class="icon-wrench"></i>
				</div>
				
				<?php
			}?>
			  <script type="text/javascript" src="<?php echo base_url();?>assets/js/preference.js"></script>
			  
			 <!-- Ici on stoque tous les choix cochés de l'user -->
	         <div id="all_my_choice" style="display:none;"></div>
			 
			 <!-- Ici on stoque tous les choix cochés de l'user -->
	         <div class="submit_prefer"><button class="btn btn-mini btn-primary" type="button"><?php echo $this->lang->line('form_maj'); ?></button></div>
			 <br>
			 <div class="submit_cancel"><button class="btn btn-mini btn-info" type="button"><?php echo $this->lang->line('form_cancel'); ?></button></div>
			
			<?php 
		}     
	}



public function list_prefer_trait()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if($this->session->userdata('logged_in'))
	    { 
          //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('prefer','','required|trim|xss_clean');
	  
	        if($this->form_validation->run())
		    {
	   	     //J'envoi à l'usine à  gaz
		     $this->users->mon_fil($this->input->post('prefer')); 

             echo $this->lang->line('statu_preference_ok');	
			}
			else
			{
             echo  form_error('prefer');	
			}
		}
		else
		{
          echo $this->lang->line('statu_not_connected');	
		}      
	}
	
	
	
	
//ICi on affiche la liste des amis de l'utilisateur	
public function List_friends()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if($this->session->userdata('logged_in'))
	    { 
	   	 //je prend la liste de tous ces amis
		 $reponse_friends = $this->users->all_contact($this->session->userdata('numero')); //C'est un tableau qui est renvoyé
		 	
			if($reponse_friends!==false)// s'il a des amis on affiche la liste
			{ 
			  // on a notre objet $reponse (un array en fait)
             // reste juste à l'encoder en JSON et l'envoyer
             
	          header('Content-Type: application/json');
             echo json_encode($reponse_friends);
			}
		}
	}
	
	
	
	//cette fonction renvoi les données de l'user connecté	
public function my_info()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if($this->session->userdata('logged_in'))
	    { 
		  $reponse_finale = array('statu'=>'connected','username'=>$this->session->userdata('username'),'user_id'=>$this->session->userdata('user_id'),'numero'=>$this->session->userdata('numero'));
		}
		else
		{
		   $reponse_finale = array('statu'=>'deconnected');
		}
	 // on a notre objet $reponse (un array en fait)
     // reste juste à l'encoder en JSON et l'envoyer
             
	  header('Content-Type: application/json');
      echo json_encode($reponse_finale);	
	}
	
	
//cette fonction vérifie si le téléphone tapé fait parti de ma liste d'amis.Sinon je l'inscrit et je renvoi en réponse s'il est connecté et je renvoi aussi son usernane		
public function verif_friend()
    {
	  //je regarde s'il est dans la liste de mes amis et je l'inscrit si cest pas le cas
	    if($this->session->userdata('logged_in'))
	    { 
          //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('numero','','required|trim|xss_clean|min_length[3]|max_length[12]|integer');
	  
	        if($this->form_validation->run())
		    {
			 $numero = $this->input->post('numero');
			 
		     $reponse = $this->users->if_my_friend($this->session->userdata('numero'),$numero);
			 
			 //On vérifie s'il est connecté
			 $connect = $this->connects->if_connected($numero);
			    
				if($connect)
				{
				  $connected = 1;//oui il est connecté
				}
				else
				{
				  $connected = 0;//non il n'est pas connecté
				}
			 
			 //on regarde son nom
			  $reponse_name = $reponse[0];
				
				if($reponse_name==0)//il ya pas son nom
				{
				  //on part donc chercher dans la liste des inscrits
			      $username = $numero;
				}
				else
				{
				 $username = $reponse[1];
				}
				
			 $reponse_finale = array('statu'=>$connected,'username'=>$username);
			
	         // on a notre objet $reponse (un array en fait)
             // reste juste à l'encoder en JSON et l'envoyer
             
			 header('Content-Type: application/json');
             echo json_encode($reponse_finale);			 
			}
		}   
	}


	//ICi on affiche la liste des numéros detéléphone de tous les utilisateurs
public function all_number_user()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if($this->session->userdata('logged_in'))
	    { 
		 $reponse_num = $this->users->all_user_num(); //C'est un tableau qui est renvoyé
		 	
			if($reponse_num!==false)// s'il a des amis on affiche la liste
			{ 
			  // on a notre objet $reponse (un array en fait)
             // reste juste à l'encoder en JSON et l'envoyer
             
	         header('Content-Type: application/json');
             echo json_encode($reponse_num);
			}
		}
	}



	//ICi on enregistre les critiques
public function critik()
    {
	  //je regarde s'il est dans la liste de mes amis et je l'inscrit si cest pas le cas
	    if($this->session->userdata('logged_in'))
	    { 
          //on définit les règles de succès: 	      
	      $this->form_validation->set_rules('text','','required|trim|xss_clean');
	  
	        if($this->form_validation->run())
		    {
			 $text = $this->input->post('text');
			 
		     $reponse = $this->users->critik($text);
		    }
		}   
	}


}


?>