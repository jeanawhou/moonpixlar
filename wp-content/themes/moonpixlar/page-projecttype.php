<?php
/**
 * Template Name: Project Type Page
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */

get_header('projecttype');
$current_user = wp_get_current_user();
$user_key = $current_user->user_pass;
$user_id = $current_user->ID;
$userProjects = getAllUsersProjects($user_id);
if (count($userProjects) > 0 ) {
?>
<div class="latestProjects">
    <div class="projects-row user-projects">
        <h4>User Projects <button class="pull-right show-all-btn" title="Show all user's projects"><i class="fa fa-plus"></i></button></h4>
        <ul class="design-types">
            <?php for ($m=0; $m <count($userProjects); $m++) { //pr($userProjects);
                    if ($userProjects[$m]['image']){
                      $p_image = $userProjects[$m]['image'];
                    } else{
                      $p_image = 'http://placehold.it/300?text=ProjectImage';
                    }

                    $pwidth = $userProjects[$m]['width'];
                    $pheight = $userProjects[$m]['height'];
                    $projectType = $userProjects[$m]['project_type'];
                    $link_proj = home_url("/project/?ttype=user&pid=".$userProjects[$m]['project_id']."&cw=".$pwidth."&ch=".$pheight."&type=".$projectType)
              ?>
                <li>
                    <a title="Created 2016-07-17 00:48:21" href="<?php echo $link_proj;?>">
                      <figure class="project-image"><img src="<?php echo $p_image; ?>" alt="<?php echo $userProjects[$m]['title']?>" width="350" height="150" /><figcaption class="project-caption"><p><?php echo $userProjects[$m]['title']?></p></figcaption></figure></a>

                    </a>
                </li>
            <?php } ?>
        </ul>
    </div>
</div>
<?php } ?>
<div class="projects-type">
            <?php
                    $terms = get_terms('project-category', array('hide_empty' => false, 'parent' => 0 ));
                      if ( !empty($terms) ) {
                          for($k=0; $k < count($terms); $k++) {
							  $catImg = get_field('category_image','project-category_'.$terms[$k]->term_id);
							  $width = get_field('width','project-category_'.$terms[$k]->term_id);
							  $height = get_field('height','project-category_'.$terms[$k]->term_id);

                          ?>
                                  <div class="projects-row <?php echo $terms[$k]->slug; ?>">
                                  <div class="wrapper">
                                      <?php
                                      if ( $catImg ) {
                                          echo '<img src="'.$catImg.'" alt="'.$terms[$k]->name.'" />';
                                      }
                                      ?>
                                  </div>
                                  <h4><?php echo $terms[$k]->name; ?></h4>

                                    <?php
									$child_terms = get_terms('project-category', array('hide_empty' => false, 'parent' => $terms[$k]->term_id ));
										if ( !empty($child_terms) ) {
                                            if ($aria_expanded) {
                                                $class_inner = 'collapse in';
                                            } else {
                                                $class_inner = 'collapse';
                                            }
                                    ?>   <ul class="design-types">

                                        <?php    for($j=0; $j < count($child_terms); $j++) {
											  $catImg = get_field('category_image','project-category_'.$child_terms[$j]->term_id);
											  $width = get_field('width','project-category_'.$child_terms[$j]->term_id);
											  $height = get_field('height','project-category_'.$child_terms[$j]->term_id);
                        $projecttype = get_field('project_type','project-category_'.$child_terms[$j]->term_id);
                                              $title = $width.'x'.$height;


echo '<li><a title="'.$title.'" class="new_project_link" data-ptype="'.$projecttype.'" data-width="'.$width.'" data-height="'.$height.'" href="'.home_url("/project/?pid=".$child_terms[$j]->term_id."&cw=".$width."&ch=".$height."&type=".$projecttype).'"><figure class="project-image"><img src="'.$catImg.'" alt="'.$child_terms[$j]->name.'" /><figcaption class="project-caption"><p>'.$child_terms[$j]->name.'</p></figcaption></figure></a></li>';

                                            } ?>

                                        </ul>
                                        <?php } ?>

                              </div>

                          <?php
                          }
                      }
            ?>
</div>

<script type="text/javascript">
  jQuery(document).ready(function() {

      jQuery('.show-all-btn').on('click',function(){
        jQuery('.user-projects ul').toggleClass('open')
      })
  });
</script>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
