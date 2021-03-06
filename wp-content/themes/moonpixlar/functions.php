<?php

function my_js_variables(){
  $current_user = wp_get_current_user();
  //echo "<pre>";
  //print_r($current_user);
  if ( 0 == $current_user->ID ) {
    $user_key = '';
    $user_id = '';
  } else {
      // Not logged in.
      $user_key = $current_user->user_pass;
      $user_id = $current_user->ID;
      // Logged in.
  }
  ?>
      <script type="text/javascript">
        var globalarr = <?php echo json_encode( array(
         'user_key' => $user_key,
         'user_id' => $user_id,
         'site_url' => home_url(),
       ) ); ?>
      </script><?php
}
add_action ( 'wp_head', 'my_js_variables' );

function my_theme_enqueue_styles() {

    $parent_style = 'parent-style'; // This is 'twentyfifteen-style' for the Twenty Fifteen theme.

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

add_action('rest_api_init', 'wpc_register_wp_api_endpoints');

function wpc_register_wp_api_endpoints() {

    register_rest_route('get-shapes', '/get', array(
        'methods' => 'GET',
        'callback' => 'getShapes',
    ));
    register_rest_route('get-effects', '/get', array(
        'methods' => 'GET',
        'callback' => 'getEffects',
    ));

    register_rest_route('get-themes', '/get', array(
        'methods' => 'GET',
        'callback' => 'getThemes',
    ));

    register_rest_route('get-theme', '/get', array(
        'methods' => 'GET',
        'callback' => 'getTheme',
    ));

    register_rest_route('save-theme', '/post', array(
        'methods' => 'POST',
        'callback' => 'saveTheme',
    ));

    register_rest_route('update-theme', '/post', array(
        'methods' => 'POST',
        'callback' => 'updateTheme',
    ));

    register_rest_route('get-pixabay-images', '/get', array(
        'methods' => 'GET',
        'callback' => 'getPixabayImages',
    ));

    register_rest_route('get-projects', '/post', array(
        'methods' => 'POST',
        'callback' => 'getAllUserProjects',
    ));

    register_rest_route('save-project', '/post', array(
        'methods' => 'POST',
        'callback' => 'saveUserProject',
    ));

    register_rest_route('update-project', '/post', array(
        'methods' => 'POST',
        'callback' => 'updateUserProject',
    ));

    register_rest_route('get-project', '/post', array(
        'methods' => 'POST',
        'callback' => 'getSpecificProjectById',
    ));
}
// function add_query_vars($aVars) {
//     $aVars[] = "type"; // represents the name of the product category as shown in the URL
//     return $aVars;
// }
//
// // hook add_query_vars function into query_vars
// add_filter('query_vars', 'add_query_vars');

// function add_rewrite_rules($aRules) {
//     //$collection_page = get_field('collection_page_url', 'option');
//     //$collection_slug = $collection_page->post_name;
//     $aNewRules = array('project/([^/]+)/?$' => 'index.php?pagename=project&type=$matches[1]');
//     $aRules = $aNewRules + $aRules;
//     return $aRules;
// }
//
// // hook add_rewrite_rules function into rewrite_rules_array
// add_filter('rewrite_rules_array', 'add_rewrite_rules');
function getEffects(){
    wp_reset_query();
    $args = array(
        'post_type' => 'attachment',
        'post_status' => 'any',
        'posts_per_page' => -1,
        'tax_query' => array(
            array(
                'taxonomy' => 'media_category',
                'terms' => 'effects',
                'field' => 'slug',
                'include_children' => true,
                'operator' => 'IN'
            )
        ),
     );

     $loop = new WP_Query($args);
     $res = array();
     $res['data'] = array();
     $res['msg'] = '';
     if($loop->have_posts()) {
        $k =0;
        while($loop->have_posts()) : $loop->the_post();
            $res['data'][$k]['title'] = get_the_title();
            $res['data'][$k]['id'] = get_the_ID();
            $post = get_post(get_the_ID());
            $res['data'][$k]['guid'] = $post->guid;
            $k++;
        endwhile;
     }
     wp_reset_query();
     if(count($res['data']) > 0) {
         $res['msg'] = 'sucess';
     } else{
         $res['msg'] = 'error';
     }
     return json_encode($res);
}
function getShapes(){
    wp_reset_query();
    $args = array(
        'post_type' => 'attachment',
        'post_status' => 'any',
        'posts_per_page' => -1,
        'tax_query' => array(
            array(
                'taxonomy' => 'media_category',
                'terms' => 'shapes',
                'field' => 'slug',
                'include_children' => true,
                'operator' => 'IN'
            )
        ),
     );

     $loop = new WP_Query($args);
     $res = array();
     $res['data'] = array();
     $res['msg'] = '';
     if($loop->have_posts()) {
        $k =0;
        while($loop->have_posts()) : $loop->the_post();
            $res['data'][$k]['title'] = get_the_title();
            $res['data'][$k]['id'] = get_the_ID();
            $post = get_post(get_the_ID());
            $res['data'][$k]['guid'] = $post->guid;
            $k++;
        endwhile;
     }
     wp_reset_query();
     if(count($res['data']) > 0) {
         $res['msg'] = 'sucess';
     } else{
         $res['msg'] = 'error';
     }
     return json_encode($res);

}

function getThemes(){
    wp_reset_query();
    $args = array(
        'post_type' => 'theme',
        'post_status' => 'publish',
        'posts_per_page' => -1
     );

     $loop = new WP_Query($args);
     $res = array();
     $res['data'] = array();
     $res['msg'] = '';
     if($loop->have_posts()) {
        $k =0;
        while($loop->have_posts()) : $loop->the_post();
            $res['data'][$k]['title'] = get_the_title();
	        $res['data'][$k]['theme_id'] = get_the_ID();
            $res['data'][$k]['width'] = get_field('theme_width');
            $res['data'][$k]['height'] = get_field('theme_height');
            $res['data'][$k]['tag'] = get_field('theme_tag');
            $res['data'][$k]['image'] = get_field('theme_image');
            //$res['data'][$k]['json_object'] = json_decode(get_field('json_object'));
            $res['data'][$k]['json_object'] = getJsonObject('theme', get_the_ID(),'');
            $k++;
        endwhile;
     }
     wp_reset_query();
     if(count($res['data']) > 0) {
         $res['msg'] = 'sucess';
     } else{
         $res['msg'] = 'error';
     }
     return json_encode($res);

}

function getTheme(){
    wp_reset_query();
    $theme_id = $_REQUEST['theme_id'];
    $args = array(
        'p' => $theme_id,
        'post_type' => 'theme',
        'post_status' => 'publish',
        'posts_per_page' => -1
     );

     $loop = new WP_Query($args);
     $res = array();
     $res['data'] = array();
     $res['msg'] = '';
     if($loop->have_posts()) {
        while($loop->have_posts()) : $loop->the_post();
            $res['data']['title'] = get_the_title();
	        $res['data']['theme_id'] = get_the_ID();
            $res['data']['width'] = get_field('theme_width');
            $res['data']['height'] = get_field('theme_height');
            $res['data']['tag'] = get_field('theme_tag');
            $res['data']['image'] = get_field('theme_image');
            //$res['data']['json_object'] = json_decode(get_field('json_object'));
            $res['data']['json_object'] = getJsonObject('theme', get_the_ID(),'');
        endwhile;
     }
     wp_reset_query();
     if(count($res['data']) > 0) {
         $res['msg'] = 'sucess';
     } else{
         $res['msg'] = 'error';
     }
     return json_encode($res);

}


function saveTheme(){
    global $wpdb;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create post object
        $my_post = array(
          'post_title'  => wp_strip_all_tags( $_REQUEST['theme_name'] ),
          'post_status' => 'publish',
          'post_type'   => 'theme',
          'post_author' => 1
        );

        // Insert the post into the database
        $theme_id = wp_insert_post( $my_post );
        if ( $theme_id ) {
                add_post_meta( $theme_id, 'theme_width', $_REQUEST['theme_width'] );
                add_post_meta( $theme_id, 'theme_height',$_REQUEST['theme_height'] );
                add_post_meta( $theme_id, 'theme_tag', $_REQUEST['theme_tag'] );
                add_post_meta( $theme_id, 'theme_image', $_REQUEST['theme_image'] );
                $upload_dir = wp_upload_dir();
                $basedir = $upload_dir['basedir'];
                $baseurl = $upload_dir['baseurl'];
                //$json_obj = $basedir.'/testjson_url.json';
                //$json_object = file_get_contents($json_obj);
                $json_object = stripslashes($_REQUEST['json_object']) ;
                $jsonArr = json_decode( $json_object, true );
                $themedir = $basedir.'/themes/'.$theme_id;
                $themeurl = $baseurl.'/themes/'.$theme_id;

                if (!file_exists($themedir)) {
                    mkdir( $themedir, 0777, true);
                }
                chmod($themedir, 0777);
                foreach ($jsonArr as $key => $value) {
                    # code...
                    if ($key =='objects'){
                        foreach ($value as $key2 => $value2) {
                            foreach ($value2 as $key3 => $value3) {
                                if($key3=='src'){
                                    $imgurl = $value3;
                                    $imagename= basename($imgurl);
                                    $contents=file_get_contents($imgurl);
                                    //$save_path="/path/to/the/dir/and/image.jpg";
                                    file_put_contents($themedir."/".$imagename,$contents);
                                    chmod($themedir."/".$imagename, 0777);
                                    //echo $image = getimg($imgurl); die;
                                    //file_put_contents($themedir."/".$imagename,$image);
                                    $jsonArr['objects'][$key2]['src'] = $themeurl."/".$imagename;
                                }
                            }
                        }
                    } else if ($key =='background') {

                    } else{
                        foreach ($value as $key4 => $value4) {
                            if($key4=='src'){
                                $imgurl = $value4;
                                $imagename= basename($imgurl);
                                $contents=file_get_contents($imgurl);
                                //$save_path="/path/to/the/dir/and/image.jpg";
                                file_put_contents($themedir."/".$imagename,$contents);
                                chmod($themedir."/".$imagename, 0777);
                                //echo $image = getimg($imgurl); die;
                                //file_put_contents($themedir."/".$imagename,$image);
                                $jsonArr['backgroundImage']['src'] = $themeurl."/".$imagename;

                            }
                        }
                    }
                }
                $json_object_updated = json_encode($jsonArr,true);
                $wpdb->insert('wp_theme_json', array(
                    'theme_id' => $theme_id,
                    'json_object' => $json_object_updated
                ));
                //add_post_meta( $theme_id, 'json_object', $_REQUEST['json_object'] );
                $status = array('status' => "success", "msg" => "save theme");
        } else {
            $status = array('status' => "Failed", "msg" => "theme is not save");
        }
    }

    return json_encode($status);

}

function updateTheme(){
    global $wpdb;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create post object
        $my_post = array(
          'ID'  =>  $_REQUEST['theme_id'] ,
          'post_title'  => wp_strip_all_tags( $_REQUEST['theme_name'] ),
          'post_status' => 'publish',
          'post_type'   => 'theme',
          'post_author' => 1
        );

        // Insert the post into the database
        $theme_id = wp_update_post( $my_post );
        if ( $theme_id ) {
                update_post_meta( $theme_id, 'theme_width', $_REQUEST['theme_width'] );
                update_post_meta( $theme_id, 'theme_height',$_REQUEST['theme_height'] );
                update_post_meta( $theme_id, 'theme_tag', $_REQUEST['theme_tag'] );
                update_post_meta( $theme_id, 'theme_image', $_REQUEST['theme_image'] );
                //update_post_meta( $theme_id, 'json_object', $_REQUEST['json_object'] );

                $results = $wpdb->get_results(
                            $wpdb->prepare("SELECT ID FROM {$wpdb->prefix}theme_json WHERE theme_id=%d", $theme_id)
                         );
                if (count($results) > 0) {

                    $upload_dir = wp_upload_dir();
                    $basedir = $upload_dir['basedir'];
                    $baseurl = $upload_dir['baseurl'];
                    //$json_obj = $basedir.'/testjson_url.json';
                    //$json_object = file_get_contents($json_obj);
                    $json_object = stripslashes($_REQUEST['json_object']) ;
                    $jsonArr = json_decode( $json_object, true );
                    $themedir = $basedir.'/themes/'.$theme_id;
                    $themeurl = $baseurl.'/themes/'.$theme_id;

                    if (!file_exists($themedir)) {
                        mkdir( $themedir, 0777, true);
                    }
                    chmod($themedir, 0777);

                    $files = glob($themedir.'/*'); // get all file names
                    foreach($files as $file){ // iterate files
                      if(is_file($file))
                        unlink($file); // delete file
                    }

                    foreach ($jsonArr as $key => $value) {
                        # code...
                        if ($key =='objects'){
                            foreach ($value as $key2 => $value2) {
                                foreach ($value2 as $key3 => $value3) {
                                    if($key3=='src'){
                                        $imgurl = $value3;
                                        $imagename= basename($imgurl);
                                        $contents=file_get_contents($imgurl);
                                        //$save_path="/path/to/the/dir/and/image.jpg";
                                        file_put_contents($themedir."/".$imagename,$contents);
                                        chmod($themedir."/".$imagename, 0777);
                                        //echo $image = getimg($imgurl); die;
                                        //file_put_contents($themedir."/".$imagename,$image);
                                        $jsonArr['objects'][$key2]['src'] = $themeurl."/".$imagename;
                                    }
                                }
                            }
                        } else if ($key =='background') {

                        } else{
                            foreach ($value as $key4 => $value4) {
                                if($key4=='src'){
                                    $imgurl = $value4;
                                    $imagename= basename($imgurl);
                                    $contents=file_get_contents($imgurl);
                                    //$save_path="/path/to/the/dir/and/image.jpg";
                                    file_put_contents($themedir."/".$imagename,$contents);
                                    chmod($themedir."/".$imagename, 0777);
                                    //echo $image = getimg($imgurl); die;
                                    //file_put_contents($themedir."/".$imagename,$image);
                                    $jsonArr['backgroundImage']['src'] = $themeurl."/".$imagename;

                                }
                            }
                        }
                    }
                    $json_object_updated = json_encode($jsonArr,true);

                    $id =  $results[0]->ID;
                    $wpdb->update(
                        'wp_theme_json',
                        array(
                            'theme_id' => $theme_id,
                            'json_object' => $json_object_updated //$_REQUEST['json_object']
                        ),
                        array( 'ID' => $id )
                    );

                }

                $status = array('status' => "success", "msg" => "Theme updated");
        } else {
            $status = array('status' => "Failed", "msg" => "theme is not updated");
        }
    }

    return json_encode($status);

}

function getJsonObject($type, $pid, $user_id){
    global $wpdb;
    if ($type =='theme') {
        $results = $wpdb->get_results(
                    $wpdb->prepare("SELECT json_object FROM {$wpdb->prefix}theme_json WHERE theme_id=%d", $pid)
                 );
        if (count($results) > 0) {
            return $results[0]->json_object;
        } else {
            return '';
        }
    } else {

        $results = $wpdb->get_results("SELECT json_object FROM {$wpdb->prefix}user_project_json WHERE project_id='".$pid."' AND user_id='".$user_id."'");
        if (count($results) > 0) {
            return $results[0]->json_object;
        } else {
            return '';
        }
    }
}
function getAllUserProjects(){
    global $wpdb;
    $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}users WHERE ID =".$_REQUEST['user_id']."
        AND user_pass = '".$_REQUEST['user_key']."'");
    $res = array();
    if (count($rows) > 0) {
        wp_reset_query();
        $args = array(
            'post_type' => 'user-project',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query'        => array(
                array(
                    'key'       => 'project_user',
                    'value'     => $_REQUEST['user_id'],
                    'compare'   => '='
                )
            )
         );

         $loop = new WP_Query($args);
         if($loop->have_posts()) {
            $k =0;
            while($loop->have_posts()) : $loop->the_post();
                $res[$k]['project_id'] = get_the_ID();
                $res[$k]['title'] = get_the_title();
                $res[$k]['width'] = get_field('project_width');
                $res[$k]['height'] = get_field('project_height');
                $res[$k]['tag'] = get_field('project_tag');
                $res[$k]['image'] = get_field('project_image');
                $puser = get_field('project_user');
                //$res[$k]['project_user'] = $puser['ID'];
                
                $res[$k]['project_user'] = $_REQUEST['user_id'];
                //$res[$k]['json_object'] = json_decode(get_field('json_object'));
                $res[$k]['json_object'] = getJsonObject('project', get_the_ID(), $_REQUEST['user_id']);

                $terms = wp_get_post_terms( get_the_ID(), 'project-category', 'false' );
                $type_width = get_field('width', 'project-category_'.$terms[0]->term_id);
                $type_height = get_field('height', 'project-category_'.$terms[0]->term_id);
                $type_prj = get_field('project_type', 'project-category_'.$terms[0]->term_id);
                $type = $terms[0]->name;
                $type_id = $terms[0]->term_id;
                $type_slug = $terms[0]->slug;
                $res[$k]['type'] = array(
                        'type_id'=> $type_id,
                		'type' => $type,
                		'slug' => $type_slug,
                		'width' => $type_width,
                		'height' => $type_height,
                    'project_type' => $type_prj
                );
                $k++;
            endwhile;
         }
         wp_reset_query();

        $status = array('status' => "sucess", "msg" => "sucess" ,"data" => $res );
    } else {
        $status = array('status' => "Failed", "msg" => "Un-Authenitcated Request");
    }
    return json_encode($status);
}

function saveUserProject(){
    global $wpdb;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}users WHERE ID =".$_REQUEST['user_id']."
            AND user_pass = '".$_REQUEST['user_key']."'");
        if (count($rows) > 0) {

            //$user_info = get_user_by( 'ID', $_REQUEST['user_id'] );//get_userdata($_REQUEST['user_id']);
            $project_user = $_REQUEST['user_id'];

            $p_user = array();
            $user_info = get_userdata($project_user);
            $user_data =  $user_info->data;
                foreach ($user_data as $key => $value) {
                    if ($key == 'ID') {
                        $p_user['ID'] = $value;
                    }
                    if ($key == 'user_login') {
                        $p_user['nickname'] = $value;
                    }
                    if ($key == 'user_nicename') {
                        $p_user['user_nicename'] = $value;
                    }
                    if ($key == 'user_email') {
                        $p_user['user_email'] = $value;
                    }
                    if ($key == 'user_url') {
                        $p_user['user_url'] = $value;
                    }
                    if ($key == 'display_name') {
                        $p_user['display_name'] = $value;
                    }
                    if ($key == 'user_registered') {
                        $p_user['user_registered'] = $value;
                    }
                    # code...
                }
                $all_meta_for_user = get_user_meta( $project_user );
                $p_user['nickname'] = $all_meta_for_user['nickname'][0];
                $p_user['user_firstname'] = $all_meta_for_user['first_name'][0];
                $p_user['user_lastname'] = $all_meta_for_user['last_name'][0];
                $p_user['user_description'] = $all_meta_for_user['description'][0];
                $p_user['user_avatar'] = '';
            // Create post object
            $my_post = array(
              'post_title'  => wp_strip_all_tags( $_REQUEST['project_name'] ),
              'post_status' => 'publish',
              'post_type'   => 'user-project',
              'post_author' => 1
            );
            // Insert the post into the database
            $project_id = wp_insert_post( $my_post );
            if ( $project_id ) {
                    add_post_meta( $project_id, 'project_width', $_REQUEST['project_width'] );
                    add_post_meta( $project_id, 'project_height',$_REQUEST['project_height'] );
                    add_post_meta( $project_id, 'project_tag', $_REQUEST['project_tag'] );
                    add_post_meta( $project_id, 'project_image', $_REQUEST['project_image'] );
                    //add_post_meta( $project_id, 'json_object', $_REQUEST['json_object'] );

                    $upload_dir = wp_upload_dir();
                    $basedir = $upload_dir['basedir'];
                    $baseurl = $upload_dir['baseurl'];
                    //$json_obj = $basedir.'/testjson_url.json';
                    //$json_object = file_get_contents($json_obj);
                    $json_object = stripslashes($_REQUEST['json_object']) ;
                    $jsonArr = json_decode( $json_object, true );
                    $themedir = $basedir.'/projects/'.$project_user.'/'.$project_id;
                    $themeurl = $baseurl.'/projects/'.$project_user.'/'.$project_id;
                    //chmod($basedir.'/projects/', 0777);
                    if (!file_exists($themedir)) {
                        mkdir( $themedir, 0777, true);
                    }

                    chmod($themedir, 0777);
                    foreach ($jsonArr as $key => $value) {
                        # code...
                        if ($key =='objects'){
                            foreach ($value as $key2 => $value2) {
                                foreach ($value2 as $key3 => $value3) {
                                    if($key3=='src'){
                                        $imgurl = $value3;
                                        $imagename= basename($imgurl);
                                        $contents=file_get_contents($imgurl);
                                        //$save_path="/path/to/the/dir/and/image.jpg";
                                        file_put_contents($themedir."/".$imagename,$contents);
                                        chmod($themedir."/".$imagename, 0777);
                                        //echo $image = getimg($imgurl); die;
                                        //file_put_contents($themedir."/".$imagename,$image);
                                        $jsonArr['objects'][$key2]['src'] = $themeurl."/".$imagename;
                                    }
                                }
                            }
                        } else if ($key =='background') {

                        } else{
                            foreach ($value as $key4 => $value4) {
                                if($key4=='src'){
                                    $imgurl = $value4;
                                    $imagename= basename($imgurl);
                                    $contents=file_get_contents($imgurl);
                                    //$save_path="/path/to/the/dir/and/image.jpg";
                                    file_put_contents($themedir."/".$imagename,$contents);
                                    chmod($themedir."/".$imagename, 0777);
                                    //echo $image = getimg($imgurl); die;
                                    //file_put_contents($themedir."/".$imagename,$image);
                                    $jsonArr['backgroundImage']['src'] = $themeurl."/".$imagename;

                                }
                            }
                        }
                    }
                    //-----------New update json with new urls-------
                    $json_object_updated = json_encode($jsonArr,true);

                    $wpdb->insert('wp_user_project_json', array(
                        'project_id' => $project_id,
                        'user_id' => $project_user,
                        'json_object' => $json_object_updated //$_REQUEST['json_object']
                    ));
                    add_post_meta( $project_id, 'project_user', $project_user );
                    $type = array($_REQUEST['type']);
                    if ( !empty($type) ){
                        wp_set_post_terms( $project_id, $type, 'project-category' );
                    }


                    $status = array('status' => "success", "msg" => "Project saved.");
            } else {
                $status = array('status' => "Failed", "msg" => "Project is not saved.");
            }
        } else {
            $status = array('status' => "Failed", "msg" => "Un-Authenitcated Request");
        }
    }

    return json_encode($status);
}

function updateUserProject(){
    global $wpdb;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}users WHERE ID =".$_REQUEST['user_id']."
            AND user_pass = '".$_REQUEST['user_key']."'");
        if (count($rows) > 0) {
            //$user_info = get_user_by( 'ID', $_REQUEST['user_id'] );//get_userdata($_REQUEST['user_id']);
            $project_user = $_REQUEST['user_id'];

            $before_puser = get_post_meta($_REQUEST['project_id'],'project_user',true);//get_field('project_user',$_REQUEST['project_id']);

            if ($project_user ==  $before_puser) {
                // Create post object
                $my_post = array(
                  'ID' => $_REQUEST['project_id'],
                  'post_title'  => wp_strip_all_tags( $_REQUEST['project_name'] ),
                  'post_status' => 'publish',
                  'post_type'   => 'user-project',
                  'post_author' => 1
                );

                $terms = wp_get_post_terms( $_REQUEST['project_id'], 'project-category', 'false' );
                $o_type = array($terms[0]->term_id);
                // Insert the post into the database
                $project_id = wp_update_post( $my_post );
                if ( $project_id ) {
                        update_post_meta( $project_id, 'project_width', $_REQUEST['project_width'] );
                        update_post_meta( $project_id, 'project_height',$_REQUEST['project_height'] );
                        update_post_meta( $project_id, 'project_tag', $_REQUEST['project_tag'] );
                        update_post_meta( $project_id, 'project_image', $_REQUEST['project_image'] );
                        //update_post_meta( $project_id, 'json_object', $_REQUEST['json_object'] );
                        $results = $wpdb->get_results(
                                    $wpdb->prepare("SELECT ID FROM {$wpdb->prefix}user_project_json WHERE project_id=%d AND  user_id =%d", $project_id,$before_puser)
                                 );
                        if (count($results) > 0) {
                            $id =  $results[0]->ID;

                            $upload_dir = wp_upload_dir();
                            $basedir = $upload_dir['basedir'];
                            $baseurl = $upload_dir['baseurl'];
                            //$json_obj = $basedir.'/testjson_url.json';
                            //$json_object = file_get_contents($json_obj);
                            $json_object = stripslashes($_REQUEST['json_object']) ;
                            $jsonArr = json_decode( $json_object, true );
                            $themedir = $basedir.'/projects/'.$project_user.'/'.$project_id;
                            $themeurl = $baseurl.'/projects/'.$project_user.'/'.$project_id;
                            //chmod($basedir.'/projects/', 0777);
                            if (!file_exists($themedir)) {
                                mkdir( $themedir, 0777, true);
                            }

                            chmod($themedir, 0777);

                            $files = glob($themedir.'/*'); // get all file names
                            foreach($files as $file){ // iterate files
                              if(is_file($file))
                                unlink($file); // delete file
                            }

                            foreach ($jsonArr as $key => $value) {
                                # code...
                                if ($key =='objects'){
                                    foreach ($value as $key2 => $value2) {
                                        foreach ($value2 as $key3 => $value3) {
                                            if($key3=='src'){
                                                $imgurl = $value3;
                                                $imagename= basename($imgurl);
                                                $contents=file_get_contents($imgurl);
                                                //$save_path="/path/to/the/dir/and/image.jpg";
                                                file_put_contents($themedir."/".$imagename,$contents);
                                                chmod($themedir."/".$imagename, 0777);
                                                //echo $image = getimg($imgurl); die;
                                                //file_put_contents($themedir."/".$imagename,$image);
                                                $jsonArr['objects'][$key2]['src'] = $themeurl."/".$imagename;
                                            }
                                        }
                                    }
                                } else if ($key =='background') {

                                } else{
                                    foreach ($value as $key4 => $value4) {
                                        if($key4=='src'){
                                            $imgurl = $value4;
                                            $imagename= basename($imgurl);
                                            $contents=file_get_contents($imgurl);
                                            //$save_path="/path/to/the/dir/and/image.jpg";
                                            file_put_contents($themedir."/".$imagename,$contents);
                                            chmod($themedir."/".$imagename, 0777);
                                            //echo $image = getimg($imgurl); die;
                                            //file_put_contents($themedir."/".$imagename,$image);
                                            $jsonArr['backgroundImage']['src'] = $themeurl."/".$imagename;

                                        }
                                    }
                                }
                            }
                            $json_object_updated = json_encode($jsonArr,true);

                            $wpdb->update(
                                'wp_user_project_json',
                                array(
                                    'project_id' => $project_id,
                                    'user_id' => $project_user,
                                    'json_object' => $json_object_updated //$_REQUEST['json_object']
                                ),
                                array( 'ID' => $id )
                            );

                        }

                        update_post_meta( $project_id, 'project_user', $project_user );

                        if ( isset($_REQUEST['type']) && !empty($_REQUEST['type']) ){
                            $type = array($_REQUEST['type']);
                            wp_set_post_terms( $project_id, $type, 'project-category' );
                        } else {
                            $terms = wp_get_post_terms( $project_id, 'project-category', 'false' );
                            $type = array($terms[0]->term_id);
                            wp_set_post_terms( $project_id, $type, 'project-category' );
                        }
                        $status = array('status' => "success", "msg" => "Project updated.");
                } else {
                    $status = array('status' => "Failed", "msg" => "project is not updated.");
                }
            } else {
                $status = array('status' => "Failed", "msg" => "project is not associated with the current user.");
            }
        } else {
            $status = array('status' => "Failed", "msg" => "Un-Authenitcated Request");
        }
    }

    return json_encode($status);
}

function getSpecificProjectById(){
    global $wpdb;
    $project_id = $_REQUEST['project_id'];
    $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}users WHERE ID =".$_REQUEST['user_id']."
        AND user_pass = '".$_REQUEST['user_key']."'");
    $res = array();
    if (count($rows) > 0) {
        //$projectData = get_posts($project_id);
        $res['title'] = get_the_title($project_id);
        $res['width'] = get_field('project_width', $project_id);
        $res['height'] = get_field('project_height', $project_id);
        $res['tag'] = get_field('project_tag', $project_id);
        $res['image'] = get_field('project_image', $project_id);
        //$res['json_object'] = get_field('json_object', $project_id);
        if (isset($user['ID'])) {
            $user = get_field('project_user', $project_id);
            $res['user'] = $user['ID'];
        } else {
            $res['user'] = $_REQUEST['user_id'];
        }
        $res['json_object'] = getJsonObject('project', $project_id ,$_REQUEST['user_id']);

        $terms = wp_get_post_terms( $project_id, 'project-category', 'false' );
        $type_width = get_field('width', 'project-category_'.$terms[0]->term_id);
        $type_height = get_field('height', 'project-category_'.$terms[0]->term_id);
        $type = $terms[0]->name;
        $type_id = $terms[0]->term_id;
        $type_slug = $terms[0]->slug;
        $res['type'] = array(
            'type_id'=>$type_id,
            'type' => $type,
            'slug' => $type_slug,
            'width' => $type_width,
            'height' => $type_height
        );

	if ($res['user'] == $_REQUEST['user_id'] ) {
		$status = array('status' => "sucess", "msg" => "sucess" ,"data" => $res );
	} else {
		$status = array('status' => "Failed", "msg" => "User not belongs to this project.");
	}


    } else {
        $status = array('status' => "Failed", "msg" => "Un-Authenitcated Request");
    }
    return json_encode($status);
}

function getPixabayImages(){
    $pixabay_api_key = get_field('pixabay_api_key','option');

    if($_REQUEST['search_type'] != ""){
        if ($_REQUEST['search_type']=="background") {
            $imgSearchQuery = "&response_group=high_resolution&cat=backgrounds&order=popular&per_page=60&page=".$_REQUEST['current_page'];
        } else {
            $imgSearchQuery = "&min_height=&image_type=photo&cat=".$_REQUEST['search_type']."&min_width=&order=popular&per_page=60&page=".$_REQUEST['current_page'];
        }
        $URL = "https://pixabay.com/api/?key=".$pixabay_api_key."&q=".$_REQUEST['search_string'].$imgSearchQuery;
        $result = CallAPI("GET",$URL,false);


        return $result;
    } else {
      $imgSearchQuery = "&min_height=&image_type=photo&cat=&min_width=&order=popular&per_page=60&page=".$_REQUEST['current_page'];
      $URL = "https://pixabay.com/api/?key=".$pixabay_api_key."&q=".$_REQUEST['search_string'].$imgSearchQuery;
      $result = CallAPI("GET",$URL,false);
      return $result;

    }
}

function CallAPI($method, $url, $data = false)
{
  $curl = curl_init();

  switch ($method)
  {
      case "POST":
          curl_setopt($curl, CURLOPT_POST, 1);

          if ($data)
              curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
          break;
      case "PUT":
          curl_setopt($curl, CURLOPT_PUT, 1);
          break;
      default:
          if ($data)
              $url = sprintf("%s?%s", $url, http_build_query($data));
  }


  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
  $result = curl_exec($curl);

  // Check for errors and display the error message
  if($result === false)
  {
      echo 'Curl error: ' . curl_error($curl);
  }

  curl_close($curl);

  return $result;
}



if( function_exists('acf_add_options_page') ) {

	acf_add_options_page(array(
		'page_title' 	=> 'Common General Settings',
		'menu_title'	=> 'Common Settings',
		'menu_slug' 	=> 'common-general-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
}

function pr($arr){
    echo "<pre>";
    print_r($arr);
    echo "</pre>";
    die;
}

add_action('admin_menu', 'my_admin_menu');

function my_admin_menu() {
    add_submenu_page('edit.php?post_type=user-project', 'All Projects List', 'All Projects List', 'manage_options', 'getProjectsListWithFIlter', 'getProjectsListWithFIlter');
    add_submenu_page('edit.php?post_type=theme', 'Add Theme', 'Add Theme', 'manage_options', 'addThemeFromAdmin', 'addThemeFromAdmin');
    //add_submenu_page( string $parent_slug, string $page_title, string $menu_title, string $capability, string $menu_slug, callable $function = '' )
}

function addThemeFromAdmin (){
    $theme_root = get_theme_root();
    //echo get_stylesheet_directory_uri();
    load_template( $theme_root. '/moonpixlar/page-project.php' );
}

function getProjectsListWithFIlter() {
    global $wpdb;

    $blogusers = get_users( array( 'role__not_in' => array('administrator') ) );
    // Array of WP_User objects.
    $user_options = '<option value="">Project User</option>';
    foreach ( $blogusers as $user ) {
    	$user_options .='<option value="'.esc_html( $user->display_name ).'">' . esc_html( $user->display_name ) . '</option>';
    }
    $type_options = '<option value="">Project Type</option>';
    $terms = get_terms('project-category', array('hide_empty' => false, 'parent' => 0 ));
    if ( !empty($terms) ) {
        for($k=0; $k < count($terms); $k++) {
            $child_terms = get_terms('project-category', array('hide_empty' => false, 'parent' => $terms[$k]->term_id ));
                if ( !empty($child_terms) ) {
                    for($j=0; $j < count($child_terms); $j++) {
                        $type_options .='<option value="'.esc_html( $child_terms[$j]->name ).'">' . esc_html( $child_terms[$j]->name ) . '</option>';
                    }
                }

        }
    }

    $add_link = '<a href="' . admin_url() . 'post-new.php?post_type=event" class="page-title-action">Add New Event</a>';
    echo "<div id='wpbody' role='main'>
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
    <div class='wrap'>
    <h1>Themes With Filter " . $add_link . "</h1>";
    echo "<script src='https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js'></script>";
    ?>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
    <script>
        jQuery(document).ready(function () {
            // Setup - add a text input to each footer cell
            jQuery('#example tfoot th').each(function () {
                var title = jQuery(this).text();
                //console.log(title)
                if (title == 'Porject User') {
                    jQuery(this).html('<select style="width:100%;"><?php echo $user_options; ?></select>');
                }
                if (title == 'Porject Type') {
                    jQuery(this).html('<select style="width:100%;"><?php echo $type_options; ?></select>');
                }
                if ( title == 'Project Name' ) {
                    jQuery(this).html(title + '<br/><br/><input style="width:100%;" type="text" placeholder="Search ' + title + '" />');
                }

                if ( title == 'Project Tag'  ) {
                    jQuery(this).html(title + '<br/><br/><input style="width:100%;" type="text" placeholder="Search ' + title + '" />');
                }
            });

            jQuery('#example thead th').each(function () {
                var title = jQuery(this).text();

                if (title == 'Porject User') {
                    jQuery(this).html('<select style="width:100%;"><?php echo $user_options; ?></select>');
                }
                if (title == 'Porject Type') {
                    jQuery(this).html('<select style="width:100%;"><?php echo $type_options; ?></select>');
                }
                if ( title == 'Project Name' ) {
                    jQuery(this).html(title + '<br/><br/><input style="width:100%;" type="text" placeholder="Search ' + title + '" />');
                }

                if ( title == 'Project Tag'  ) {
                    jQuery(this).html(title + '<br/><br/><input style="width:100%;" type="text" placeholder="Search ' + title + '" />');
                }
                //jQuery(this).html( title+'<br/><br/><input type="text" placeholder="Search '+title+'" />' );
            });

            // DataTable
            var table = jQuery('#example').DataTable();

            // Apply the search
            table.columns().every(function () {
                var that = this;

                jQuery('input', this.header()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                                .search(this.value)
                                .draw();
                    }
                });

                jQuery('select', this.header()).on('change', function () {
                    if (that.search() !== this.value) {
                        that
                                .search(this.value)
                                .draw();
                    }
                });

                jQuery('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                                .search(this.value)
                                .draw();
                    }
                });

                jQuery('select', this.footer()).on('change', function () {
                    if (that.search() !== this.value) {
                        that
                                .search(this.value)
                                .draw();
                    }
                });

            });
        });
    </script>
    <style>
        tfoot input {
            width: 100%;
            padding: 3px;
            box-sizing: border-box;
        }
        a { text-decoration: none; }
    </style>
    <?php
    wp_reset_postdata();
    $args = array(
        'post_type' => 'user-project',
        'post_status' => 'any',
        'posts_per_page' => -1
    );
    $loop = new WP_Query($args);
    if ($loop->have_posts()) {
        ?>
        <table  id="example" class="display wp-list-table widefat fixed striped posts" cellspacing="0" width="100%" >
            <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Project Width</th>
                    <th>Project Height</th>
                    <th>Project Tag</th>
                    <th>Porject User</th>
                    <th>Porject Type</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Project Name</th>
                    <th>Project Width</th>
                    <th>Project Height</th>
                    <th>Project Tag</th>
                    <th>Porject User</th>
                    <th>Porject Type</th>
                </tr>
            </tfoot>
            <?php
            while ($loop->have_posts()) {
                $loop->the_post();
                $event_id = get_the_ID();


                $url = admin_url();
                $edit_url = "<div class='row-actions'><span class='edit'><a href='" . admin_url() . "post.php?post=" . get_the_ID() . "&action=edit' >Edit</a> | </span> <span class='View'><a href='" . get_permalink(get_the_ID()) . "'>View</a></span></div>";


                echo "<tr>";
                if (get_the_title()) {
                    echo "<td><strong><a class='row-title' href='" . admin_url() . "post.php?post=" . get_the_ID() . "&action=edit' >" . get_the_title() . "</a></strong><br/>" . $edit_url . "</td>";
                } else {
                    echo "<td><strong><a class='row-title' href='" . admin_url() . "post.php?post=" . get_the_ID() . "&action=edit' >(no title) — Draft</a></strong><br/>" . $edit_url . "</td>";
                }
                $puser = get_field('project_user',get_the_ID()) ;
                $terms = wp_get_post_terms( get_the_ID(), 'project-category', 'false' );
                echo "<td>" . get_field('project_width',get_the_ID()) . "</td>";
                echo "<td>" . get_field('project_height',get_the_ID()) . "</td>";
                echo "<td>" . get_field('project_tag',get_the_ID()) . "</td>";
                echo "<td>" . $puser['display_name'] . "</td>";
                echo "<td>" . $terms[0]->name . "</td>";

                echo "</tr>";
            }
            ?>
        </table>
        <?php
        echo "</div></div></div>";
    }
}

function getAllUsersProjects($userid){
    global $wpdb;

    $res = array();
        wp_reset_query();
        $args = array(
            'post_type' => 'user-project',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query'        => array(
                array(
                    'key'       => 'project_user',
                    'value'     => $userid,
                    'compare'   => '='
                )
            )
         );

         $loop = new WP_Query($args);
         if($loop->have_posts()) {
            $k =0;
            while($loop->have_posts()) : $loop->the_post();
                $res[$k]['project_id'] = get_the_ID();
                $res[$k]['title'] = get_the_title();
                $res[$k]['width'] = get_field('project_width');
                $res[$k]['height'] = get_field('project_height');
                $res[$k]['tag'] = get_field('project_tag');
                $res[$k]['image'] = get_field('project_image');
                $puser = get_field('project_user');
                if (isset($puser['ID'])) {
                  $res[$k]['project_user'] = $puser['ID'];
                } else {
                  $res[$k]['project_user'] = $userid;
                }

                $res[$k]['json_object'] = json_decode(get_field('json_object'));

                $terms = wp_get_post_terms( get_the_ID(), 'project-category', 'false' );
                $type_width = get_field('width', 'project-category_'.$terms[0]->term_id);
                $type_height = get_field('height', 'project-category_'.$terms[0]->term_id);
                $type_prj = get_field('project_type', 'project-category_'.$terms[0]->term_id);
                $type = $terms[0]->name;
                $type_id = $terms[0]->term_id;
                $type_slug = $terms[0]->slug;
                $res[$k]['type'] = array(
                        'type_id' => $type_id,
                		'type' => $type,
                		'slug' => $type_slug,
                		'width' => $type_width,
                		'height' => $type_height,
                    'project_type' => $type_prj
                );
                $k++;
            endwhile;
         }
         wp_reset_query();

    return $res;
}

/*
*  Get Image copy from URL
*/
function getimg($url) {
    $headers[] = 'Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg, image/png';
    $headers[] = 'Connection: Keep-Alive';
    $headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';
    $user_agent = 'php';
    $process = curl_init($url);
    curl_setopt($process, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($process, CURLOPT_HEADER, 0);
    curl_setopt($process, CURLOPT_USERAGENT, $useragent);
    curl_setopt($process, CURLOPT_TIMEOUT, 30);
    curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);
    $return = curl_exec($process);
    curl_close($process);
    return $return;
}


/*
*  Image copy from binary code
*/
function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen($output_file, "wb");

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1]));
    fclose($ifp);

    return $output_file;
}
?>
