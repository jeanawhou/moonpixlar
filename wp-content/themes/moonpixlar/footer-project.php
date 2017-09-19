<script src="http://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js">    </script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery-ui.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="<?php echo get_stylesheet_directory_uri();?>/js/bootstrap.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery.ui.touch-punch.min.js"></script>

<script src="<?php echo get_stylesheet_directory_uri();?>/js/tinymce.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery.fancybox.pack.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/imagesloaded.pkgd.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/masonry.pkgd.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/bootstrap-slider.js"></script>

<script src="<?php echo get_stylesheet_directory_uri();?>/lib/fabric.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/lib/prism.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery-filestyle.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/bootstrap-colorpicker.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/spectrum.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/lib/FileSaver.min.js"></script>

<script src="<?php echo get_stylesheet_directory_uri();?>/js/editor.js"></script>

<script type="text/javascript">

window.addEventListener('load', function onLoad() {
	window.canvasApplication = new window.canvaApp({
		container : 'main'
	})
});

jQuery(document).ready(function() {
		wHeight = $(window).height();
		//$('#main').css('min-height', wHeight-53);
		$(".shapes-list,.covers-list,.effects-list ,.themes-list, .my-projects-list").mCustomScrollbar({
				updateOnImageLoad: true,
				callbacks:{
			        onTotalScroll: function(){
			        	window.canvasApplication.loadContentOnScroll(jQuery(this).attr('data-listtype'))
			        }
			    }
		});

		tinymce.init({ selector:'.wysiwyg', menubar: false });

		$(".import-link").fancybox({
				maxWidth    : 800,
				maxHeight   : 600,
				fitToView   : false,
				width       : '75%',
				height      : '75%',
				autoSize    : true,
				closeClick  : false,
				padding     : 0
		});

		var $grid = $('.masonry').imagesLoaded( function() {
				$grid.masonry({
						itemSelector: '.thumbnail'
				});
		});
		// $('.tools a').click(function(){
		//     $grid.masonry('layout');
		// });
		$('.tools a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				var tab = $(this).attr('aria-controls');
				var $grid = $('#'+tab+' .masonry').imagesLoaded( function() {
						$grid.masonry({
								itemSelector: '.thumbnail'
						});
				});
		})
		$('#imgUpload').jfilestyle({
				input : false
		});
});
function DropDown(el) {
		this.dd = el;
		this.placeholder = this.dd.children('span');
		this.opts = this.dd.find('ul.dropdown > li');
		this.val = '';
		this.index = -1;
		this.initEvents();
}
DropDown.prototype = {
		initEvents : function() {
				var obj = this;
				obj.dd.on('click', function(event){
						$(this).toggleClass('active');
						return false;
				});
				obj.opts.on('click',function(){
						var opt = $(this);
						console.log(opt)
						obj.val = opt.text();
						obj.index = opt.index();
						obj.placeholder.text(obj.val);
						if($(this).parents('#downlodDD').length > 0){
							saveFormat = opt.find('a').attr('data-type');
							window.canvasApplication.saveCanvasAsImage(saveFormat)
						}
						
				});
		},
		getValue : function() {
				return this.val;
		},
		getIndex : function() {
				return this.index;
		}
}
/*
document.getElementById('download-png').addEventListener('click', function() {
		window.canvasApplication.saveCanvasAsImage(this, 'png')
}, false);
document.getElementById('download-jpg').addEventListener('click', function() {
		window.canvasApplication.saveCanvasAsImage(this, 'jpeg')
}, false);
*/
$(function() {
		var download_dd = new DropDown( $('#downlodDD') );
		var optimize_dd = new DropDown( $('#optimizeDD') );
		$(document).click(function() {
				// all dropdowns
				$('.custom-dropdown').removeClass('active');
		});
});
</script>

</body>
</html>
