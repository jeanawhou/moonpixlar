<style type="text/css">
	.bookCanvasHolder{
		display: flex;
	}
	.bookCanvasHolder > div {
	    /*float: left;*/
	    margin: 0 1px;
	}
	.editor_window{
		position: relative;
	}
	#leftTools{
		z-index: 2;
	}
</style>
<?php
/**
 * Template Name: Project Page
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header('project');
$current_user = wp_get_current_user();
$user_key = $current_user->user_pass;
$user_id = $current_user->ID;
if (isset($_REQUEST) && !empty($_REQUEST['type'])) {
	$typeArr = explode("/", $_REQUEST['type']);
	$type =  $typeArr[0];
	$width = get_field('width','project-category_'.$type);
	$height = get_field('height','project-category_'.$type);
} else {
	$type =  '';
	$width = '';
	$height = '';
}
?>
<div id="main">
		<div id="leftTools" class="tools">
				<ul class="vertical-tab">

						<li data-tab="texts">
							<a href="#text-designs" aria-controls="text-designs" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/text_icon.png" alt="" />
								<span>Text</span>
							</a>
						</li>
						<li data-tab="shapes">
							<a href="#shapes" aria-controls="shapes" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/shape_icon.png" alt="" />
								<span>Objects</span>
							</a>
						</li>
						<li data-tab="images">
							<a href="#images" aria-controls="images" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/image_icon.png" alt="" />
								<span>Image</span>
							</a>
						</li>
						<li data-tab="backgrounds" class="active">
							<a href="#backgrounds" aria-controls="backgrounds" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/bg_icon.png" alt="" />
								<span>Background</span>
							</a>
						</li>

						<li data-tab="themes" class="">
							<a href="#themes" aria-controls="themes" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/theme_icon.png" alt="" />
								<span>Theme</span>
							</a>
						</li>
						<li data-tab="myProjects" class="">
							<a href="#myProjects" aria-controls="myProjects" role="tab" data-toggle="tab">
								<img src="<?php echo get_stylesheet_directory_uri();?>/images/theme_icon.png" alt="" />
								<span>My Projects</span>
							</a>
						</li>
						<li class="hidden"><a href="#" class=".btn hidden" id="saveDesignBtn">Save Design</a></li>
						<li class="hidden"><a href="#" class=".btn hidden" id="loadDesignBtn">Load Design</a></li>
				</ul>
				<!-- tab content -->
				<div id="leftToolsContent" class="tab-content">
						<div role="tabpanel" class="tab-pane designs templates" id="text-designs">
								<div data-texttype="big" data-text="BIG TEXT" class="big-text text">BIG TEXT</div>
								<div data-texttype="medium" data-text="MEDIUM TEXT" class="medium-text text">MEDIUM TEXT</div>
								<div data-texttype="small" data-text="SMALL TEXT" class="small-text text">SMALL TEXT</div>

						</div>
						<div role="tabpanel" class="tab-pane designs templates" id="shapes">
								<div class="btn-group">
									<button class="active shapes-btn" >Shapes</button>
									<button class="effects-btn">Effects</button>
									<button class="covers-btn">Covers</button>
									<button class="moukups-btn">Mock-ups</button>
								</div>
								<div data-listtype="shapes-list" class="shapes-list mCustomScrollbar">

								</div>
								<div class="covers-list mCustomScrollbar hidden">

								</div>
								<div class="effects-list mCustomScrollbar hidden">

								</div>
						</div>

						<div role="tabpanel" class="tab-pane designs templates" id="images">
							<div class="upload-image-form">
									<form method="post" enctype="multipart/form-data" action='upload.php'>
											<input type="file" name="imgUpload" id="imgUpload" class="hidden"/>
											<button type="submit" id="imgUploadbtn" class="hidden">Upload Files!</button>
									</form>
							</div>
							<div class="search-container">
									<div class="input-group fa fa-search">
											<i class="fa fa-long-arrow-left hidden"></i>
											<input  type="text" class="form-control search-key" placeholder="Search" aria-describedby="sizing-addon2">
									</div>
									<button type="button" name="button" class="btn primary-btn pull-right">GO</button>
							</div>
							<div class="masonry images-list">

							</div>
							<div data-page="1" data-listtype="images-list" class="search-images-list">

							</div>
						</div>

						<div role="tabpanel" class="tab-pane active designs templates" id="backgrounds">
								<div class="top-colors">
										<div class="predefined-colors"></div>
										<div class="color add-color"><i class="fa fa-plus"></i></div>
										<div class="clearfix"></div>
								</div>
								<div class="search-container">
										<div class="input-group fa fa-search">
												<i class="fa fa-long-arrow-left hidden"></i>
												<input  type="text" class="form-control search-key" placeholder="Search" aria-describedby="sizing-addon2">
										</div>
										<button type="button" name="button" class="btn primary-btn pull-right">GO</button>
								</div>
								<div class="backgrounds-list bg-list">

								</div>
								<div data-page="1" data-listtype="backgrounds-list" class="search-backgrounds-list bg-list">

								</div>
						</div>

						<div role="tabpanel" class="tab-pane designs templates" id="themes">
								<div class="themes-list mCustomScrollbar">

								</div>
						</div>

						<div role="tabpanel" class="tab-pane designs templates" id="myProjects">
								<div class="my-projects-list mCustomScrollbar">

								</div>
						</div>


						<div id="textSettings" class="hidden settings-panel">
								<label>Editing </label>
								<div class="editing-contols margin-15">
									<a href="#"><i class="fa fa-undo"></i></a>
									<a href="#"><i class="fa fa-repeat"></i></a>
									<a href="#" class="delete-item"><i class="fa fa-trash-o"></i></a>
									<a href="#" class="clone-item"><i class="fa fa-clone"></i></a>
								</div>
								<label for="">Layering</label>
								<div class="layering-controls margin-15">
									<a href="#" class="layering-icon-1 bring-to-front"></a>
									<a href="#" class="layering-icon-2 bring-forward"></a>
									<a href="#" class="layering-icon-3 send-to-back"></a>
									<a href="#" class="layering-icon-4 send-backward"></a>
								</div>

								<label for="font-family" style="display:inline-block">Font: </label>
								<select id="font-family" class="btn-object-action" bind-value-to="fontFamily">
										<option value="Open Sans" selected>Open Sans</option>
										<option value="Alfa Slab One">Alfa Slab One</option>
										<option value="Raleway">Raleway</option>
										<option value="Oswald">Oswald</option>
										<option value="Questrial">Questrial</option>
										<option value="Josefin Sans">Josefin Sans</option>
										<option value="Fjalla One">Fjalla One</option>
										<option value="PT Sans">PT Sans</option>
										<option value="Source Sans Pro">Source Sans Pro</option>
										<option value="Roboto">Roboto</option>
										<option value="Lato">Lato</option>
										<option value="Ubuntu">Ubuntu</option>
										<option value="Open Sans Condensed">Open Sans Condensed</option>
										<option value="Titillium Web">Titillium Web</option>
										<option value="Questrial">Questrial</option>
										<option value="Dancing Script" >Dancing Script</option>
										<option value="Gloria Hallelujah">Gloria Hallelujah</option>
										<option value="Great Vibes">Great Vibes</option>
										<option value="Sacramento">Sacramento</option>
										<option value="Black Ops One">Black Ops One</option>
										<option value="Syncopate">Syncopate</option>
										<option value="Julius Sans One">Julius Sans One</option>
										<option value="Cabin Sketch">Cabin Sketch</option>
										<option value="Rochester">Rochester</option>
										<option value="Tangerine">Tangerine</option>
										<option value="Poiret One">Poiret One</option>
										<option value="Nova Script">Nova Script</option>
										<option value="Aguafina Script">Aguafina Script</option>
										<option value="Euphoria Script">Euphoria Script</option>
										<option value="Clicker Script">Clicker Script</option>
										<option value="Bad Script">Bad Script</option>
										<option value="Marck Script">Marck Script</option>
										<option value="Alex Brush">Alex Brush</option>
										<option value="Calligraffitti">Calligraffitti</option>
								</select>

								<div class="text-options margin-15">
									<a href="#" class="formating bold" data-style="bold">
											<i class="fa fa-bold"></i>
									</a>
									<a href="#" class="formating italic" data-style="italic">
											<i class="fa fa-italic"></i>
									</a>
									<a href="#" class="formating underline" data-style="underline">
											<i class="fa fa-underline"></i>
									</a>
									<a href="#" class="align" data-align="left"><i class="fa fa-align-left"></i></a>
									<a href="#" class="align" data-align="center"><i class="fa fa-align-center"></i></a>
									<a href="#" class="align" data-align="right"><i class="fa fa-align-right"></i></a>
								</div>

								<label>Size: </label>
								<input
										type="text"
										name="somename"
										data-provide="slider"
										data-slider-min="12"
										data-slider-max="80"
										data-slider-step="1"
										data-slider-value="40"
										data-slider-tooltip="hide"
										id="fSizeControl"
										bind-value-to="fontSize"
								>


								<div class="shadow-controls margin-15">
									<label for="">Shadow</label>
									<input type="checkbox" name="name" value="" class="object-shadow hidden" id="t-shadow" >

									<label class="shadow-check-box" for="t-shadow"></label>
									<input type="color" class="shadowColorControl hidden" id="shadowColorControl" style="width:40px">
									<div class="shadow-distance-container hidden">
											<input
													type="text" data-provide="slider" data-slider-min="0" data-slider-max="25"
													data-slider-step="1" data-slider-value="10" data-slider-tooltip="hide" class="shadow-distance" id="shadow-distance-text"
											>
									</div>
								</div>

								<div class="opacity-controls margin-15">
									<label for="">Opacity</label>
									<div class="opacity-values">
										<a href="#" class="opacity-icon1 opacity-icon" data-opacity="100"></a>
										<a href="#" class="opacity-icon2 opacity-icon" data-opacity="60"></a>
										<a href="#" class="opacity-icon3 opacity-icon" data-opacity="30"></a>
									</div>
								</div>
								<label for="">Angle</label>
								<div class="rotation-controls margin-15">
									<a href="#" data-rotation="90" class="rotation-icon-1 rotation-icon"><i class="fa fa-caret-right"></i></a>
									<a href="#" data-rotation="-90" class="rotation-icon-2 rotation-icon"><i class="fa fa-caret-left"></i></a>
									<a href="#" data-rotation="180" class="rotation-icon-3 rotation-icon"><i class="fa fa-caret-down"></i></a>
									<a href="#" data-rotation="0" class="rotation-icon-4 rotation-icon"><i class="fa fa-caret-up"></i></a>
								</div>

								<label for="color">Color: </label>
								<input class="margin-15" type="color" id="colorControl" style="width:40px" bind-value-to="fill">

						</div>
						<div class="hidden settings-panel" id="image-settings">
							<label>Editing </label>
							<div class="editing-contols margin-15">
								<a href="#"><i class="fa fa-undo"></i></a>
								<a href="#"><i class="fa fa-repeat"></i></a>
								<a href="#" class="delete-item"><i class="fa fa-trash-o"></i></a>
								<a href="#" class="clone-item"><i class="fa fa-clone"></i></a>
							</div>
							<label for="">Layering</label>
							<div class="layering-controls margin-15">
								<a href="#" class="layering-icon-1 bring-to-front"></a>
								<a href="#" class="layering-icon-2 bring-forward"></a>
								<a href="#" class="layering-icon-3 send-to-back"></a>
								<a href="#" class="layering-icon-4 send-backward"></a>
							</div>
							<div class="shadow-controls margin-15">
								<label for="">Shadow</label>
								<input type="checkbox" name="name" value="" class="object-shadow hidden" id="img-shadow">

								<label class="shadow-check-box" for="img-shadow"></label>
								<input type="color" class="shadowColorControl hidden" id="shadowColorControlImage" style="width:40px">
								<div class="shadow-distance-container hidden">
										<input
												type="text" data-provide="slider" data-slider-min="0" data-slider-max="25"
												data-slider-step="1" data-slider-value="10" data-slider-tooltip="hide" class="shadow-distance" id="shadow-distance-image"
										>
								</div>
							</div>
							<label for="" class="block">X Position:</label>
							<div data-min-value="0" data-max-value="2000" data-position="left" data-value="" id="image-x-pos" class="inc-dec editable margin-15">
									<span title="Increase X" class="text-x-increase increase"><i class="fa fa-plus"></i></span>
									<input size="4" maxlength="4" value="0" id="object-x-position" class="object-position">
									<span title="Decrease X" class="text-x-decrease decrease"><i class="fa fa-minus"></i></span>
							</div>
							<label for="" class="block">Y Position:</label>
							<div data-min-value="0" data-max-value="2000" data-position="top" data-value="" id="image-y-pos" class="inc-dec editable margin-15">
									<span title="Increase Y" class="text-y-increase increase"><i class="fa fa-plus"></i></span>
									<input size="4" maxlength="4" value="0" id="object-y-position" class="object-position">
									<span title="Decrease Y" class="text-y-decrease decrease"><i class="fa fa-minus"></i></span>
							</div>
							<label>Opacity: </label>
							<input
									type="text" data-provide="slider" data-slider-min="0" data-slider-max="100"
									data-slider-step="1" data-slider-value="100" data-slider-tooltip="hide" id="img-opacity"
							>
							<label for="">Angle</label>
							<div class="rotation-controls margin-15">
								<a href="#" data-rotation="90" class="rotation-icon-1 rotation-icon"><i class="fa fa-caret-right"></i></a>
								<a href="#" data-rotation="-90" class="rotation-icon-2 rotation-icon"><i class="fa fa-caret-left"></i></a>
								<a href="#" data-rotation="180" class="rotation-icon-3 rotation-icon"><i class="fa fa-caret-down"></i></a>
								<a href="#" data-rotation="0" class="rotation-icon-4 rotation-icon"><i class="fa fa-caret-up"></i></a>
							</div>
							<label for="" class="hidden">Masks</label>
							<div class="mask-images hidden">
									<ul>
											<li><img width="80" height="80" src="<?php echo get_stylesheet_directory_uri();?>/mask-images/heart.svg" alt="" /></li>
											<li><img width="80" height="80" src="<?php echo get_stylesheet_directory_uri();?>/mask-images/circle.svg" alt="" /></li>
											<li><img width="80" height="80" src="<?php echo get_stylesheet_directory_uri();?>/mask-images/star.svg" alt="" /></li>
											<li><img width="80" height="80" src="<?php echo get_stylesheet_directory_uri();?>/mask-images/rectangle.svg" alt="" /></li>
											<li><img width="80" height="80" src="<?php echo get_stylesheet_directory_uri();?>/mask-images/polygon.svg" alt="" /></li>
									</ul>
							</div>
						</div>
						<div class="shape-edit-panel hidden settings-panel" >
								<label for="shape-colors">Colors</label>
								<div class="shape-colors"> </div>
								<div class="shape-settings">
										<label>Editing </label>
										<div class="editing-contols margin-15">
											<a href="#"><i class="fa fa-undo"></i></a>
											<a href="#"><i class="fa fa-repeat"></i></a>
											<a href="#" class="delete-item"><i class="fa fa-trash-o"></i></a>
											<a href="#" class="clone-item"><i class="fa fa-clone"></i></a>
										</div>
										<label for="">Layering</label>
										<div class="layering-controls margin-15">
											<a href="#" class="layering-icon-1 bring-to-front"></a>
											<a href="#" class="layering-icon-2 bring-forward"></a>
											<a href="#" class="layering-icon-3 send-to-back"></a>
											<a href="#" class="layering-icon-4 send-backward"></a>
										</div>
										<div class="shadow-controls margin-15">
											<label for="">Shadow</label>
											<input type="checkbox" name="name" value="" class="object-shadow hidden" id="img-shadow">

											<label class="shadow-check-box" for="img-shadow"></label>
											<input type="color" class="shadowColorControl hidden" id="shadowColorControlImage" style="width:40px">
											<div class="shadow-distance-container hidden">
													<input
															type="text" data-provide="slider" data-slider-min="0" data-slider-max="25"
															data-slider-step="1" data-slider-value="10" data-slider-tooltip="hide" class="shadow-distance" id="shadow-distance-image"
													>
											</div>
										</div>
										<label for="" class="block">X Position:</label>
										<div data-min-value="0" data-max-value="2000" data-position="left" data-value="" id="image-x-pos" class="inc-dec editable margin-15">
												<span title="Increase X" class="text-x-increase increase"><i class="fa fa-plus"></i></span>
												<input size="4" maxlength="4" value="0" id="object-x-position" class="object-position">
												<span title="Decrease X" class="text-x-decrease decrease"><i class="fa fa-minus"></i></span>
										</div>
										<label for="" class="block">Y Position:</label>
										<div data-min-value="0" data-max-value="2000" data-position="top" data-value="" id="image-y-pos" class="inc-dec editable margin-15">
												<span title="Increase Y" class="text-y-increase increase"><i class="fa fa-plus"></i></span>
												<input size="4" maxlength="4" value="0" id="object-y-position" class="object-position">
												<span title="Decrease Y" class="text-y-decrease decrease"><i class="fa fa-minus"></i></span>
										</div>
										<label>Opacity: </label>
										<input
												type="text" data-provide="slider" data-slider-min="0" data-slider-max="100"
												data-slider-step="1" data-slider-value="100" data-slider-tooltip="hide" id="shape-opacity"
										>
										<label for="">Angle</label>
										<div class="rotation-controls margin-15">
											<a href="#" data-rotation="90" class="rotation-icon-1 rotation-icon"><i class="fa fa-caret-right"></i></a>
											<a href="#" data-rotation="-90" class="rotation-icon-2 rotation-icon"><i class="fa fa-caret-left"></i></a>
											<a href="#" data-rotation="180" class="rotation-icon-3 rotation-icon"><i class="fa fa-caret-down"></i></a>
											<a href="#" data-rotation="0" class="rotation-icon-4 rotation-icon"><i class="fa fa-caret-up"></i></a>
										</div>
								</div>
						</div>

				</div>
		</div>
		<div class="editor_window">
			<div class="canvas_holder">
					<canvas id="canvas" width="500" height="500"></canvas>
			</div>
			<div class="bookCanvasHolder">
				<div class="input-container">
					<input type="text" name="backCoverW" class="backCoverW">
					<input type="text" name="spineW" class="spineW">
					<input type="text" name="frontCoverW" class="frontCoverW">
				</div>
				<canvas id="canvasBackCover" width="600" height="750"></canvas>
				<canvas id="canvasSpine" width="100" height="750"></canvas>
				<canvas id="canvasFrontCover" width="600" height="750"></canvas>
			</div>
		</div>
		<div id="workspace" class="hidden">
				<div class="wrapper">
						<div class="row height100">
								<div class="col-xs-12 height100 acenter">
										<div id="canvas-wrap">
												
										</div>
								</div>
						</div>
				</div>
		</div>



</div>
<!-- Modal -->
<div class="modal fade" id="saveProjectModal" role="dialog">
	<div class="modal-dialog">
	  <!-- Modal content-->
	  <div class="modal-content">
	    <div class="modal-header">
	      <button type="button" class="close" data-dismiss="modal">&times;</button>
	      <h4 class="modal-title">Save Project</h4>
	    </div>
	    <div class="modal-body">
			<div class="form-group">
		      <label for="projectName">Project Name</label>
		      <input type="text" class="form-control" id="projectName" placeholder="Project Name">
		    </div>
			<div class="form-group">
		      <label for="projectTag">Project Tag</label>
		      <input type="text" class="form-control" id="projectTag" placeholder="Project Tag">
		    </div>
	    </div>
	    <div class="modal-footer">
	      <button type="button" class="btn save-project-btn btn-default" data-dismiss="modal">Save Project</button>
	    </div>
	  </div>
	</div>
</div>
<?php
get_footer('project');
