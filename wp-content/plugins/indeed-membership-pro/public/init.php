<?php 
function ihc_init(){
	/*
	 * RUN EVERYTIME ON PUBLIC
	 * @param none
	 * @return none
	 */
	
	//========== REGISTER SOCIAL MEDIA COOKIE 
	if (isset($_COOKIE['ihc_register'])){
		global $ihc_stored_form_values;
		$data = unserialize(stripslashes($_COOKIE['ihc_register']));
		if (is_array($data) && count($data)){
			foreach ($data as $k=>$v){
				$ihc_stored_form_values[$k] = $v;
			}
		}
		setcookie("ihc_register", "", time()-3600, COOKIEPATH, COOKIE_DOMAIN, false);//delete the cookie
	}
	
	$postid = -1;	
	$url = IHC_PROTOCOL . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
	$current_user = false;
	
	if (!empty($_POST['ihcaction'])){
		/// FORM ACTIONS : REGISTER/LOGIN/UPDATE/ RESET PASS/ DELETE LEVEL FROM ACCOUNT PAGE/CANCEL LEVEL FROM ACCOUNT PAGE/ RENEW LEVEL 
		ihc_init_form_action($url); 
	} else {
		/// LOGOUT / PAY NEW LEVEL
		if (!empty($_GET['ihcdologout'])){
			include_once IHC_PATH . 'public/functions/logout.php';
			ihc_do_logout($url);
		} else if (!empty($_GET['ihcnewlevel'])){
			ihc_do_pay_new_level();
		}
		
		/// REDIRECT / REPLACE CONTENT
		$postid = url_to_postid( $url );//getting post id

		if ($postid==0){
			$cpt_arr = ihc_get_all_post_types();
			$the_cpt = FALSE;
			$post_name = FALSE;
			if (count($cpt_arr)){
				foreach ($cpt_arr as $cpt){
					if (!empty($_GET[$cpt])){
						$the_cpt = $cpt;
						$post_name = $_GET[$cpt];
						break;
					}
				}				
			}
			if ($the_cpt && $post_name){
				$cpt_id = ihc_get_post_id_by_cpt_name($the_cpt, $post_name);
				if ($cpt_id){
					$postid = $cpt_id;			
				}
			} else {
				//test if its homepage
				$homepage = get_option('page_on_front');
				if($url==get_permalink($homepage)) $postid = $homepage;				
			}
		}
		ihc_if_register_url($url);//test if is register page
		ihc_block_page_content($postid, $url);//block page
	}
	
	/////////////BLOCK BY URL
	ihc_block_url($url, $current_user, $postid);//function available in public/functions.php
	
	//remove admin bar
	if (!current_user_can('administrator')){
		show_admin_bar(false);
	}
}