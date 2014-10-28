<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Connects extends CI_Model {
    
function __construct()
	{
       parent::__construct();
	   
	   //on charge la librairie de la bdd
	    $this->load->database();
    }
  
  
 //Cette fonction enregistere un nouvel utilisateur s'il n'est pas déjà enregistré une fois
public function connect($pseudo,$numero)
    { 
	     //On cherche s'il s'est déjà connecté une fois
	     $this->db->select('*');
	     $this->db->from('begoo_user');
	     $this->db->where('user_number', $numero); 
	     $query = $this->db->get();
	  
		    if($query->num_rows() > 0)//si oui on crée ses sessions
	        {
		        foreach ($query->result() as $row)
                {
		         $user_data = array(
                   'username'         => $pseudo,
				   'last_username'    => $row->last_username,
				   'user_id'          => $row->user_id,
                   'numero'           => $numero,
                   'logged_in'        => TRUE,
				   'user_msg'         =>$row->user_msg,
				   'user_note'        =>$row->user_note,
				   'user_last_connect'=>$row->user_last_connect,
				   'user_bannis'      =>$row->user_bannis
                   );
		          $this->session->set_userdata($user_data);
                }
			
			    //On met à jour son dernier pseudonyme et sa derniere date de connexion
			
			     $data = array(
                  'last_username' => $pseudo,
			      'user_last_connect'=>time(),
                  );

                 $this->db->where('user_number', $numero);
                 $this->db->update('begoo_user', $data);
								 
		         return $user_data; //On dit que tout s'est bien passé :)
		    }
		    else //On l'inscrit dans la base de donnée
		    {
		     
		         $data = array(
                 'user_number'      => $numero,
                 'last_username'   => $pseudo,
                 'user_last_connect'=> time(),
                  );

                 $this->db->insert('begoo_user', $data); 
		
		         //On céée quant même sa session
		         $user_data = array(
                   'username'         => $pseudo,
				   'last_username'    => $pseudo,
				   'user_id'          => mysql_insert_id(),
                   'numero'           => $numero,
                   'logged_in'        => TRUE,
				   'user_msg'         => 0,
				   'user_note'        => 0,
				   'user_last_connect'=> time(),
				   'user_bannis'      => 0
                 );
		         $this->session->set_userdata($user_data);
			   
		       return $user_data;
			}		
	}
	
	
	//Cette fonction test si un membre est déjà inscrit si non l'inscrit
public function if_exist($numero)
    { 
	 //On cherche s'il s'est déjà connecté une fois
	  $this->db->select('user_id');
	  $this->db->from('begoo_user');
	  $this->db->where('user_number',$numero); 
	  $query = $this->db->get();
	  
		if($query->num_rows() > 0)//si oui on retourne le numéro pour laisser la transparence
	    {
		  return $numero;
		}
		else //On l'inscrit dans la base de donnée
		{
		   $data = array(
               'user_number'      => $numero,
               'last_username'   => 'inconnu'
            );

          $this->db->insert('begoo_user',$data); 
		   
		  return $numero;
		
		}	 
	}


//Ici je vérifie si un utilisateur lamda est connecté par son numéro.
public function if_connected($user)
    {
	 //On cherche s'il s'est déjà connecté une fois
	  $this->db->select('user_number');
	  $this->db->from('begoo_connected');
	  $this->db->where('user_number',$user); 
	  $query = $this->db->get();
	  
		if($query->num_rows() > 0)//si oui on renvoi true
	    {
		  return true;
		}
    }
	
	
	
//Ici je vérifie si un utilisateur lamda est connecté par son id.
public function if_connected_id($user)
    { 
	 //On cherche s'il s'est déjà connecté une fois
	  $this->db->select('connected_id');
	  $this->db->from('begoo_connected');
	  $this->db->where('user_id',$user); 
	  $query = $this->db->get();
	  
		if($query->num_rows() > 0)//si oui on retourne on renvoii true
	    {
		  return true;
		}
    }


//Ici je récupère le nom de connection d'un utilisateur afin ausi de savoir s'il est en ligne ou pas.
public function username($user_number,$type)
    {
	    switch($type)
	    {
		  case'0':		  		    
	         $this->db->select('last_username');
	         $this->db->from('begoo_user');
	         $this->db->where('user_number',$user_number); 
	         $query = $this->db->get();
			 $row = $query->row();
			 return $row->last_username; //On renvoi son nom seul
		  break;
		  
		  case'1':		     
	         $this->db->select('last_username');
	         $this->db->from('begoo_user');
	         $this->db->where('user_number',$user_number); 
	         $query_name = $this->db->get();
			 $row = $query_name->row();
			 $row->last_username;
			    
				if($this->if_connected($user_number))
				{
				 return $row->last_username.' <img class="bulle" title="'.$this->lang->line('bulle_connect').'" data-placement="top" src='.base_url().'/assets/css/images/inline.png />';
				}
				else
				{
				 return $row->last_username;
				}
		  break;
		}
    }	
	
}
?>	