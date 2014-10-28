<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
class Connect extends CI_Controller 
{

function __construct()
	{	  
	  // Call the Controller constructor
     parent::__construct();
	  
	  $this->load->helper('url');
		
		//on charge les sessions
	    $this->load->library('session');
		
		//on charge la librairie de parceage pour templeter la vue
	    $this->load->library('parser');
	  
	  //le helper de formulaire
	    $this->load->helper('form');
	  
	  //on charge la validation de formulaires
        $this->load->library('form_validation');
		
	  //le helper de texte pour limiter les chaines de caractère lors de certains l'affichages
	    $this->load->helper('text');
		
		//C'est cette ligne de code qui détecte la langue du navigateur et affiche le site dans la langue correspondante
		$this->lang->load('form', $this->config->item('language'));
		$this->lang->load('statu', $this->config->item('language'));
		$this->lang->load('bulle', $this->config->item('language'));

        //On appelle la fonction qui s'occuper des membres connectés
	    $this->load->model('user/connects');		
    }
	
	 	 
function index()
    {
	    //on vérifie si l'user est connecté si oui,on le redirige vers une page qui lui dit qu'il est déja connecté
        if(!$this->session->userdata('logged_in'))
	    { 
          echo connexion();
        } 
    }
	 
	 



//Ici on traite le  formulaire de traitement.
function connexion_trait()
    { 
        if($this->session->userdata('logged_in'))
		{ 
		  redirect('/wikipedia/wiki','refresh');//et la redirection
        } 
		else 
		{
		   //on définit les règles de succès: 
		  $this->form_validation->set_rules('pseudo','Pseudo/Nom','trim|required|xss_clean|max_length[30]');
          $this->form_validation->set_rules('number','Numéro','trim|required|xss_clean|numeric|min_length[3]');
		    
		  //si la validation du formulaire a échouée on redirige vers le formulaire d'inscription
            if(!$this->form_validation->run())
			{ 
			    $resultat = array(
		                   'erreurs'  => form_error('pseudo').form_error('number'),
						   'statu'    => 'fail',
						   );
		
               // reste juste à l'encoder en JSON et l'envoyer
               header('Content-Type: application/json');
               echo json_encode($resultat);
            } 
			else 
			{
                //je détruit toute session avant de le connecter
                $this->session->sess_destroy();	
				
                if(!$this->connects->connect($this->input->post('pseudo'),$this->input->post('number')))
			    {
			     
				 $resultat = array(
		                   'erreurs'  => $this->lang->line('form_use_yet'),
						   'statu'    => 'fail',
						   );
		
                  // reste juste à l'encoder en JSON et l'envoyer
                  header('Content-Type: application/json');
                  echo json_encode($resultat);
			    }
			    else
			    {
			      $resultat = array(
		                   'erreurs'  => 'none',
						   'statu'    => 'yep'
						   );
		
                  // reste juste à l'encoder en JSON et l'envoyer
                  header('Content-Type: application/json');
                  echo json_encode($resultat);
			    }
			}
        }
	}


	
	//Ici on traite le  formulaire de traitement.
function session()
    {
        if($this->session->userdata('logged_in'))
		{
		 echo 'connected';
		}
	}

//Ici on obtient le nom d'un utilisateur avec possibilité de savoir s'il est en ligne oupas.
function username($user_number,$type)
    {	
        return $this->connects->username($user_number,$type);
	}	
}


?>