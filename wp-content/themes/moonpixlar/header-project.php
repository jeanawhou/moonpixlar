<?php
$current_user = wp_get_current_user();
if ( 0 == $current_user->ID ) {
    wp_redirect( home_url() );
    exit;
} else {
    // Not logged in.
    $user_key = $current_user->user_pass;
    $user_id = $current_user->ID;
    // Logged in.
}
?>
<!DOCTYPE html>
<html lang="en" class="">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MoonPixlar</title>
		<?php
			//wp_enqueue_style( 'bootstrap', get_stylesheet_directory_uri() . '/css/bootstrap.min.css','','');
			//wp_enqueue_style( 'font-awesome', get_stylesheet_directory_uri() . '/css/font-awesome.min.css','','');
		?>
    <!-- Bootstrap -->
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/icon-style.css" rel="stylesheet">

    <link href="<?php echo get_stylesheet_directory_uri();?>/css/jquery.fancybox.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/jquery-filestyle.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/bootstrap-colorpicker.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/bootstrap-slider.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Vast+Shadow">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/jquery.mCustomScrollbar.min.css" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri();?>/css/style.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
		<?php global $post; ?>
		<script type="text/javascript">
        var BASE_URL = '<?php echo get_permalink($post->ID);?>';
    </script>
	<script type="text/javascript">
      		var globalarr = <?php echo json_encode( array( 'user_key' => $user_key, 'user_id' => $user_id, 'site_url' => home_url()));?>;
    	</script>
</head>
<body class="editor-page">
    <div class="loading-container hidden">
        <div class="loading"></div>
    </div>
    <header>
        <h1 class="logo"><img src="<?php echo get_stylesheet_directory_uri();?>/images/logo.png"/></h1>
        <div class="nav-controls">
            <div id="optimizeDD" class="custom-dropdown" tabindex="1">
                <span>Optimize for</span>
                <ul class="dropdown">
                    <li><a href="#">Facebook Post</a></li>
                    <li><a href="#">Facebook Cover</a></li>
                    <li><a href="#">Twitter Post</a></li>
                </ul>
            </div>
            <div class="push-button">
                <label for="snap-btn">Snap</label>
                <button  type="button" id="snap-btn" name="button"><i class="fa fa-circle"></i></button>
            </div>
            <div class="push-button">
                <label for="grid-btn">Grid</label><input type="text" id="grid-size" value="40" /><label for="grid-btn">pixel</label>
                <button type="button" id="grid-btn" name="button"><i class="fa fa-circle"></i></button>
            </div>
            <div id="downlodDD" class="custom-dropdown" tabindex="1">
                <span>Download</span>
                <ul class="dropdown">
                    <li><a href="#" id="download-png" data-type="png">PNG Image</a></li>
                    <li><a href="#" id="download-jpg" data-type="jpeg">JPEG Image</a></li>
                </ul>
            </div>
        </div>
        <div class="profile-controls">
            <button type="button" id="save-theme-btn">Save Theme</button>
            <button type="button" data-toggle="modal" data-target="#saveProjectModal" name="same">Save</button>
            <button type="button" name="preview" id="preview-btn">Preview</button>
            <div class="profile-img img-circle">
                <img src="<?php echo get_stylesheet_directory_uri();?>/images/default-img.png" class="" alt="" />
            </div>
        </div>
    </header>
