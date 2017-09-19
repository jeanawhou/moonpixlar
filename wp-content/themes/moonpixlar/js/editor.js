var canvas;
var imageObj = new Image();
var textarea = null;
var selectedFont = null;
var imageWidth;
var imageHeight;
var canvasWidth = 600;
var canvasHeight = 600;
var grid = 40;
var saveFormat = 'png';
var selectedThemeId = -1;
var projectID;
var selectedBookCanvas;
var projectType = "other";

//$('#leftTools').height($(document).height())
var queries = {};
$.each(document.location.search.substr(1).split('&'),function(c,q){
    var i = q.split('=');
  //  console.log(i.length);
    if(i.length>1){
        queries[i[0].toString()] = i[1].toString();
    }
});

if(queries.cw) canvasWidth = queries.cw;
if(queries.ch) canvasHeight = queries.ch;
if(queries.pid) projectID = queries.pid;
if(queries.type) projectType = queries.type;

console.log("....... "+projectType);

//canvasWidth = queries.cw;
//canvasHeight = queries.ch;
window.addEventListener('load', function onLoad() {
    var selectedColor = '#ffff00';
    var textShadowColor = '#000000';
    var API_KEY = '2514829-69a8422361a1b4a8073fe1981';
    var formData = false;
    
    if (window.FormData) {
  		formdata = new FormData();
  		$('#imgUpload').removeClass('hidden');
  		document.getElementById("imgUploadbtn").style.display = "none";
	}

    window.canvaApp = function(options){
        if(!options.container){
            throw new Error('Container not defined.');
        }

        var that = this,
        container = $('#main'),
        $leftTools = container.find('#leftTools'),
        $workSpace = container.find('#workspace'),
        $leftToolsContent = container.find('#leftToolsContent');

        Object.defineProperties(this,{
            $container:{
                value: container,
                writable: false
            },
            $leftTools:{
                value: $leftTools,
                writable: false
            },
            $workSpace:{
                value: $workSpace,
                writable: false
            },
            $leftToolsContent: {
                value: $leftToolsContent,
                writable: false
            },
        });
        that.setSelectedColor = function($color){
            selectedColor = $color;
        }
        that.getSelectedColor = function(){
            return selectedColor;
        }
        that.setTextShadowColor = function($color){
            textShadowColor = $color;
        }
        that.getTextShadowColor = function(){
            return textShadowColor;
        }
        that.setItemShadow = function(){
            var shadow = {
                color: '#000000',
                blur: 20,
                offsetX: 10,
                offsetY: 10,
                opacity: 1,
                fillShadow: true,
                strokeShadow: true
            }
            return shadow;
        }
        if(projectType=="bookCover"){
            that.initBookCanvas();
            $('.canvas_holder').hide();
            $('.book_canvas_holder').show();
            that.manageBookCoverWindow();
        }else{
            that.init();
            $('.book_canvas_holder').hide();
            $('.canvas_holder').show();
            that.manageEditorWindow();
        }
        
    }
    canvaApp.prototype.manageBookCoverWindow = function(){
        var that = this;
        var __editorW = parseInt($('.editor_window').width());
        var __editorH = parseInt($('.editor_window').height());
        var bookCoverWidth = 1300;
        var bookCoverHeight = 750;
        var __bookCoverContainer = $(".bookCanvasHolder");
        var __bookCoverContainerW = parseInt($('.bookCanvasHolder').width())
        console.log($('.bookCanvasHolder').width())
        
        var ratio;

        /*if(bookCoverWidth > (__editorW - 30)){
            //ratio = (__editorW - 30)/bookCoverWidth;
        }else 
        */
        if(bookCoverHeight > (__editorH - 60)){
            ratio = (__editorH - 30)/bookCoverHeight;
        }
        else{
            ratio = 1;
        }

        console.log('ratio   '+ ratio)

        var ratio = 1;

        var leftPos = parseInt((__editorW - bookCoverWidth)/2 + 170)
        var topPos = parseInt((__editorH - bookCoverHeight)/2)

        return;

        //__bookCoverContainer.css({ transform: "scale(" + ratio + ")" });
        
        /*var __bookCoverContainerW = parseInt(bookCoverWidth*ratio);
        var __bookCoverContainerH = parseInt(bookCoverHeight*ratio);

        console.log(__bookCoverContainerW +"    "+__bookCoverContainerH);

        var mLeft = (__editorW - __bookCoverContainerW)/2;
        var mTop = (__editorH - __bookCoverContainerH)/2*/
        
        
        __bookCoverContainer.css({ zoom: ratio, position: "absolute", left: leftPos, top: topPos });
        //__bookCoverContainer.css({ marginLeft: - mLeft, top: mTop });

        if(bookCoverHeight > (__editorH - 30)){
            var ratio = (__editorH - 30)/bookCoverHeight;
        }else{
            ratio = 1;
        }
        var __bookCoverContainerW = parseInt($(".bookCanvasHolder").width())*ratio;
        var __bookCoverContainerH = parseInt($(".bookCanvasHolder").height())*ratio;
        //__bookCoverContainer.css({ zoom: ratio, position: "absolute", left: "50%", top: "50%" });
        //__bookCoverContainer.css({ marginLeft: - parseInt(__bookCoverContainerW)/2, marginTop: - parseInt(__bookCoverContainerH)/2 });

    }
    canvaApp.prototype.manageEditorWindow = function(){
        var that = this;
        var __editorW = $('.editor_window').width();
        var __editorH = $('.editor_window').height();
        var __canvasW = that.$canvas.width;
        var __canvasH = that.$canvas.height;
        var _cContainer = $(".canvas-container");
        
        //$('#backgrounds').on('scroll',function(event){ console.log($(this).scrollTop()+"     "+$(this).height()+"  "+$('#backgrounds').prop("scrollHeight"))})
        var ratio;
        if(__canvasW > (__editorW - 30)){
            ratio = (__editorW - 30)/__canvasW;
        }else{
            ratio = 1;
        }
        _cContainer.css({ transform: "scale(" + ratio + ")" });
        if(__canvasH > (__editorH - 30)){
            var ratio = (__editorH - 30)/__canvasH;
        }else{
            ratio = 1;
        }
        _cContainer.css({ transform: "scale(" + ratio + ")", position: "absolute" });

        var _cContainerW = $(".canvas-container")[0].getBoundingClientRect().width;
        var _cContainerH = $(".canvas-container")[0].getBoundingClientRect().height;
        var leftPos = parseInt(__editorW)/2 - parseInt(_cContainerW)/2;
        var topPos = parseInt(__editorH)/2 - parseInt(_cContainerH)/2;

        _cContainer.css({ left: leftPos, top: topPos });
    }
    canvaApp.prototype._configure = function(){
        var that = this;
        $bgColorSelectionList = that.$container.find('.predefined-colors');
        $.each(['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'], function () {
            $bgColorSelectionList.append("<div class='color' data-color='" + this + "' style='background: " + this + "; color: " + this + ";' ></div>");
        });

        that.bindEvents();
        if(queries.ttype=="user"){
            that.getProject();
        }
    }
    canvaApp.prototype._configureBookCanvas = function(){
        var that = this;
        $bgColorSelectionList = that.$container.find('.predefined-colors');
        $.each(['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'], function () {
            $bgColorSelectionList.append("<div class='color' data-color='" + this + "' style='background: " + this + "; color: " + this + ";' ></div>");
        });
        that.bindEvents();
        if(queries.ttype=="user"){
           // that.getProject();
        }
    }
    
    canvaApp.prototype.bindEvents = function(){
        var that = this, $container = that.$container;
        $container.find('.predefined-colors').on('click','.color',function(e){
            that.setBackgroundColor($(this).attr('data-color'));
        })
        $container.find('.add-color').colorpicker({
            container: true,
            align: 'left'
        }).on('changeColor', function(e) {
            $container.find('.add-color').css('background',e.color.toHex())
            that.setBackgroundColor(e.color.toHex());
        });
        $container.find('.bg-list').on('click','a',function(e){
            e.preventDefault();
            that.setBackgroundImage($(this).attr('data-image'));
        })
        $container.find('#text-designs').on('click','.text',function(e){
            that.addText($(this).attr('data-texttype'),$(this).attr('data-text'));
        })
        $container.find('#images').on('click','.thumbnail',function(e){
            that.addImage($(this).attr('data-image'));
        })

        $container.find('#leftTools').on('click','.clone-item',function(e){
            e.preventDefault();
      	    that.cloneSelectedItem();
      	});

        $container.find('#leftTools').on('click','.delete-item',function(e){
            e.preventDefault();
      	    that.removeSelectedObject();
      	});

        $container.find('#leftTools').on('click','.formating ',function(e){
            e.preventDefault();
            that.setTextFormating($(this).attr('data-style'), this)
        })
        $container.find('#leftTools').on('click','.align ',function(e){
            e.preventDefault();
            $('.align').removeClass('active');
    		$(this).addClass('active');
            //that.setActiveStyle('originX',$(this).attr('data-align'))
            var __left;
            var __w = that.$canvas.getActiveObject().width;
            if($(this).attr('data-align') == 'left'){
                __left = __w/2;
            }else if($(this).attr('data-align') == 'right'){
                __left = that.$canvas.width - __w/2; 
            }else if($(this).attr('data-align')=='center'){
                __left = that.$canvas.width/2;
            }
            that.$canvas.getActiveObject().alignment = $(this).attr('data-align');
            that.$canvas.getActiveObject().set("left", __left).setCoords();
            that.$canvas.renderAll();
        })
        $container.find('#leftTools').on('click','.rotation-icon ',function(e){
            e.preventDefault();
            $('.rotation-icon').removeClass('active');
        		$(this).addClass('active');
            that.$canvas.getActiveObject().set("angle", $(this).attr('data-rotation')).setCoords();
            that.$canvas.renderAll();
        })
        $container.find('#textSettings').on('click','.opacity-icon ',function(e){
            e.preventDefault();
            $('.opacity-icon').removeClass('active');
        	$(this).addClass('active');
            that.setActiveStyle('opacity',parseInt($(this).attr('data-opacity'), 10) / 100);
            that.$canvas.renderAll();
        })
        $container.find('#leftTools').on('click','.send-backward',function(e){
            that.$canvas.getActiveObject().sendBackwards()
        });
        $container.find('#leftTools').on('click','.bring-forward',function(e){
            that.$canvas.getActiveObject().bringForward()
        });

        $container.find('#leftTools').on('click','.send-to-back',function(e){
            that.$canvas.getActiveObject().sendToBack()
        });
        $container.find('#leftTools').on('click','.bring-to-front',function(e){
            that.$canvas.getActiveObject().bringToFront()
        });

        $container.find('#textSettings').on('change','#colorControl',function(e){
            that.setSelectedColor = e.target.value;
        		//console.log(that.setSelectedColor);
        		that.setActiveStyle('fill',e.target.value)
      	})
        $container.find('#textSettings').on('change','#fSizeControl',function(e){
      		  that.setActiveStyle('fontSize',e.target.value)
      	})

        $container.find('#textSettings').on('change','#font-family',function(e){
        		//selectedFont =  e.target.value;
               // console.log(e.target.value);
        		WebFont.load({
        			google: {
        				  families: [e.target.value]
        			},
        			active: function() {
                      //  console.log("loaded");
        		      that.setActiveStyle('fontFamily',e.target.value)
        			},
        		});
      	})
        $container.find('#textSettings').on('change' , '.object-shadow' , function(){
            console.log('shadow change event');
            console.log(this.checked)
            that.manageObjectShadow(this,'#textSettings')
        });
        $container.find('#image-settings').on('change' , '.object-shadow' , function(){
            that.manageObjectShadow(this,'#image-settings')
        });
        $container.find('#textSettings').on('change','.shadow-distance',function(e){
           // console.log(e.target.value)
            that.manageShadowDistance(e.target.value)
      	})
        $container.find('#image-settings').on('change','.shadow-distance',function(e){
            that.manageShadowDistance(e.target.value)
      	})
        
        $container.find('#textSettings').on('change','.shadowColorControl',function(e){
            that.manageShadowColor(e.target.value)
      	})
        $container.find('#image-settings').on('change','.shadowColorControl',function(e){
            that.manageShadowColor(e.target.value)
      	})
        canvaApp.prototype.manageShadowColor = function(__color){
            var that = this;
            var shadow = that.$canvas.getActiveObject().getShadow();
            shadow.color = __color;
            that.$canvas.getActiveObject().setShadow(shadow);
            that.$canvas.renderAll();
        }
        canvaApp.prototype.manageObjectShadow = function(__this,__parent){
            var that = this;
            var shadow = {};
            if(__this.checked) {
                shadow = that.setItemShadow();
                $(__parent+' .shadow-distance-container'+','+__parent+' .shadowColorControl').removeClass('hidden');
            }else{
                shadow = "";
                $(__parent+' .shadow-distance-container'+','+__parent+' .shadowColorControl').addClass('hidden');
            }
            that.$canvas.getActiveObject().setShadow(shadow);
            that.$canvas.renderAll();
        }
        canvaApp.prototype.manageShadowDistance = function(__distance){
            var that = this;
            var shadow = that.$canvas.getActiveObject().getShadow();
            shadow.offsetY = shadow.offsetX = parseInt(__distance);
            that.$canvas.getActiveObject().setShadow(shadow);
            that.$canvas.renderAll();
        }

        
        $container.find('#leftTools').on('click','.increase',function(e){
      		  that.manageObjectPosition('increase',$(this).parent().attr('data-position'),0);
      	})
        $container.find('#leftTools').on('click','.decrease',function(e){
      		  that.manageObjectPosition('decrease',$(this).parent().attr('data-position'),0)
      	})
        $container.find('#leftTools').on('keyup','.object-position',function(e){
      		  that.manageObjectPosition('with-input',$(this).parent().attr('data-position'),$(this).val())
      	})
        $container.find('#leftTools').on('change','#img-opacity,#shape-opacity',function(e){
            that.setActiveStyle('opacity',parseInt(e.target.value, 10) / 100);
            that.$canvas.renderAll();
      	})
        $container.find('.shapes-list,.shapes-list1').on('click','.shape',function(e){
            e.preventDefault();
            that.loadSelectedShape($(this).attr('data-image'));
      	})
        $container.find('.themes-list').on('click','.theme',function(e){
            e.preventDefault();
            selectedThemeId = $(this).attr('data-id');
            $('#update-theme-btn') && $('#update-theme-btn').removeClass('hidden');
            $('#save-theme-btn') && $('#save-theme-btn').addClass('hidden');
            that.getTheme($(this).attr('data-id'));
      	})
        $container.find('.my-projects-list').on('click','.myproject',function(e){
            e.preventDefault();
            //selectedThemeId = $(this).attr('data-id');
            //$('#update-theme-btn') && $('#update-theme-btn').removeClass('hidden');
            //$('#save-theme-btn') && $('#save-theme-btn').addClass('hidden');
            projectID = $(this).attr('data-id');
            that.getProject();
      	})
        $container.find('.basic-shapes').on('click','.shape',function(e){
            e.preventDefault();
            that.loadSelectedShape($(this).attr('data-image'));
        })

        $container.find('#backgrounds .search-container').on('click','.btn',function(e){
            that.manageSearch('background',$('#backgrounds .search-container .search-key').val(),'#backgrounds','.backgrounds-list','.search-backgrounds-list',1);
      	})
        $container.find('#images .search-container').on('click','.btn',function(e){
            $('.search-images-list').attr('data-page',1)
            that.manageSearch('images',$('#images .search-container .search-key').val(),'#images','.masonry','.search-images-list',1);
      	})
        $container.find('.search-container').on('click','.fa-long-arrow-left',function(e){
            if($(this).parents('#images').length > 0){
                $('.search-images-list .mCSB_container').html("");
                $('.images-list').removeClass('hidden');
                $('#images .search-container .search-key').val("");
                $('#images .search-container .fa-long-arrow-left').addClass('hidden');
            }
            if($(this).parents('#backgrounds').length > 0){
                $('.search-backgrounds-list .mCSB_container').html("")
                $('.backgrounds-list').removeClass('hidden');
                $('#backgrounds .search-container .search-key').val("");
                $('#backgrounds .search-container .fa-long-arrow-left').addClass('hidden');
            }
      	})

        $container.find('.upload-image-form').on('change','#imgUpload',function(e){
            $('.loading-container').removeClass('hidden');
            var i = 0, len = this.files.length, img, reader, file;

    		for ( ; i < len; i++ ) {
    			file = this.files[i];

    			if (!!file.type.match(/image.*/)) {
    				if ( window.FileReader ) {
    					reader = new FileReader();
    					reader.onloadend = function (e) {
    						//showUploadedItem(e.target.result, file.fileName);
    					};
    					//reader.readAsDataURL(file);
    				}

    				if (formdata) {
    					formdata.append("images[]", file);
    				}
    			}
    		}

    		if (formdata) {
    			$.ajax({
                    crossDomain: true,
    				url: globalarr['site_url']+"/wp-content/themes/moonpixlar/upload.php",
    				type: "POST",
    				data: formdata,
    				processData: false,
    				contentType: false,
                    async:false,
    				success: function (res) {
    					fabric.Image.fromURL(globalarr['site_url']+'/wp-content/themes/moonpixlar/uploadedImages/'+res, function(imgObj) {
    					  	console.log(imgObj.width +"     "+ that.$canvas.width);
                            console.log(imgObj.height +"     "+ that.$canvas.height)
                            if (imgObj.width > that.$canvas.width) {
                                imgObj.scaleToWidth(that.$canvas.width);
                            }
                            if (imgObj.height > that.$canvas.height) {
                                imgObj.scaleToHeight(that.$canvas.height);
                            }
                            that.$canvas.centerObject(imgObj);
                            that.$canvas.add(imgObj);
                            that.$canvas.renderAll();
                            //that.$canvas.add(oImg);
                            $('.loading-container').addClass('hidden');
    					});
    				},
                    error: function (xhr) {
                        //console.log(xhr);
                    }
    			});
    		}

      	})
        //$('.settings-panel').addClass('hidden');
        /*$container.find('a[aria-controls="shapes"]').on('shown.bs.tab', function (e) {
            that.loadShapes();
        })*/
        $container.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if ($(this).attr('aria-controls')=='shapes') {
                that.loadShapes();
            }else if ($(this).attr('aria-controls')=='themes') {
                that.loadThemes();
            }else if ($(this).attr('aria-controls')=='myProjects') {
                that.loadProjects('.my-projects-list');
            }
            $('.settings-panel').addClass('hidden');
            $container.find('.tab-pane').removeClass('hidden');
        })
        $container.find('.mask-images li').on('click', function (e) {
            var imgSrc = $(this).find('img').attr('src');
            that.manageMask(imgSrc);
        })

        $('#snap-btn').on('click',function(e){
            $(this).toggleClass('active');
        })
        $('#grid-btn').on('click',function(e){
            if($(this).hasClass('active')){
               $(this).removeClass('active');
               that.hideGrid();
            }else{
                $(this).addClass('active');
                var gSize = parseInt(jQuery("#grid-size").val()) || 40;
                if (gSize > that.$canvas.width / 2) {
                    gSize = that.$canvas.width / 2;
                }
                that.showGrid(gSize);
            }
        })
        $('#save-theme-btn').on('click',function(e){
            /*var properties_to_save = Array("width", "height", "orig_src", "clip_left", "clip_top", "clip_width", "clip_height", "is_frame", "id", "gradientAngle");
            var object = JSON.stringify(that.$canvas.toJSON(properties_to_save));
            var dataURL = that.$canvas.toDataURL("image/jpeg");
            $.ajax({
                url : "api.php?rquest=saveThemes",
                type : "POST",
                data : {
                    json_object : JSON.stringify(that.$canvas),
                    width: that.$canvas.width,
                    height: that.$canvas.height,
                    theme_name: 'Test Theme1',
                    tag: 'New Year',
                    thumbnail: dataURL
                },
                success:function(result){
                    console.log(result);
                }
            })*/

            $('.loading-container').removeClass('hidden')
            var properties_to_save = Array("width", "height", "orig_src", "clip_left", "clip_top", "clip_width", "clip_height", "is_frame", "id", "gradientAngle");
            var object = JSON.stringify(that.$canvas.toJSON(properties_to_save));
            var dataURL = that.$canvas.toDataURL("image/jpeg");
           // console.log(JSON.stringify(that.$canvas));

            $.ajax({
                url: globalarr['site_url']+'/wp-json/save-theme/post',
                type: 'post',
                data : {
                    theme_name: $('#projectName').val(),
                    theme_width: that.$canvas.width,
                    theme_height: that.$canvas.height,
                    theme_tag: $('#projectTag').val(),
                    theme_image: dataURL,
                    json_object : JSON.stringify(that.$canvas)
                },
                success: function(data, status) {
                   // console.log(data);
                   // console.log(status);
                    $('.loading-container').addClass('hidden')
                },
                error: function(xhr, desc, err) {

                }
            })

        })

        $('.save-project-btn').on('click',function(e){
            $('.loading-container').removeClass('hidden')
            that.saveProject();
        })


        $('#update-theme-btn').on('click',function(e){
            //console.log(selectedThemeId);
            that.updateTheme();
        })

        $('#shapes .covers-btn').on('click',function(e){
            that.loadProjects('.covers-list');
            $('#shapes .btn-group button').removeClass('active');
            $(this).addClass('active');
            $('.shapes-list').addClass('hidden');
            $('.covers-list').removeClass('hidden');
            $('.effects-list').addClass('hidden');
        })
        $('#shapes .shapes-btn').on('click',function(e){
            that.loadShapes();
            $('#shapes .btn-group button').removeClass('active');
            $(this).addClass('active');
            $('.shapes-list').removeClass('hidden');
            $('.covers-list').addClass('hidden');
            $('.effects-list').addClass('hidden');
        })
        $('#shapes .effects-btn').on('click',function(e){
            that.loadEffects();
            $('#shapes .btn-group button').removeClass('active');
            $(this).addClass('active');
            $('.shapes-list').addClass('hidden');
            $('.covers-list').addClass('hidden');
            $('.effects-list').removeClass('hidden');
        })
        $('#backgrounds').on('scroll',function(event){ 
            var __scrollHeight = parseInt($('#backgrounds').prop("scrollHeight"));
            var __sTop = parseInt($(this).scrollTop());
            var __paneHeight = parseInt($(this).height());
            if((__paneHeight+__sTop) == (__scrollHeight - 10)){
                console.log($(this).scrollTop()+"     "+$(this).height()+"  "+$('#backgrounds').prop("scrollHeight"))
                var currentPage = parseInt($('.search-backgrounds-list').attr('data-page'));
                currentPage = currentPage + 1;
                $('.search-backgrounds-list').attr('data-page', currentPage)
                that.manageSearch('background',$('#backgrounds .search-container .search-key').val(),'#backgrounds','.backgrounds-list','.search-backgrounds-list',currentPage);
            }
        })
        $('#images').on('scroll',function(event){ 
            var __scrollHeight = parseInt($('#images').prop("scrollHeight"));
            var __sTop = parseInt($(this).scrollTop());
            var __paneHeight = parseInt($(this).height());
            if((__paneHeight+__sTop) == (__scrollHeight - 10)){
                var currentPage = parseInt($('.search-images-list').attr('data-page'));
                currentPage = currentPage + 1;
                $('.search-images-list').attr('data-page', currentPage)
                that.manageSearch('images',$('#images .search-container .search-key').val(),'#images','.masonry','.search-images-list',currentPage);
            }
        })
        that.$canvas.on('object:moving', function(options) {
           if ($("#snap-btn").hasClass("active")) {
                that.snapObjects(options);
            }
        });
        that.$canvasFrontCover.on('mouse:down', function(options) {
            selectedBookCanvas = that.$canvasFrontCover;
            that.$canvas = that.$canvasFrontCover;
        });
        that.$canvasBackCover.on('mouse:down', function(options) {
            selectedBookCanvas = that.$canvasBackCover;
            that.$canvas = that.$canvasBackCover;
        });
        that.$canvasSpine.on('mouse:down', function(options) {
            selectedBookCanvas = that.$canvasSpine;
            that.$canvas = that.$canvasSpine;
        });
        that.$canvas.on('mouse:down', function(options) {
            console.log(this)
            //$container.find('.tab-pane').addClass('hidden');
            //console.log(options.target.type)
            switch (options.target && options.target.type) {
                case 'i-text':
                    $container.find('.settings-panel').addClass('hidden');
                    $container.find('#textSettings').removeClass('hidden');
                    $container.find('.tab-pane').addClass('hidden');
                    that.showTextSettings();
                    break;
                case 'image':
                    $container.find('.settings-panel').addClass('hidden');
                    $container.find('#image-settings').removeClass('hidden');
                    $container.find('.tab-pane').addClass('hidden');
                    that.updateImageSettings();
                    break;
                case 'path-group':
                case 'group':
                    that.showShapeSettings(options.target)
                    break;
                default:
                    $container.find('.settings-panel').addClass('hidden');
                    $container.find('.tab-pane').removeClass('hidden');

            }
        });
    }
    canvaApp.prototype.init = function(){
        var that = this;
        that.$canvas = new fabric.Canvas('canvas');
        that.$canvas.setHeight(canvasHeight);
        that.$canvas.setWidth(canvasWidth);
        that._configure();

    }
    canvaApp.prototype.initBookCanvas = function(){
        var that = this;
        that.$canvasFrontCover = new fabric.Canvas('canvasFrontCover');
        that.$canvasBackCover = new fabric.Canvas('canvasBackCover');
        that.$canvasSpine = new fabric.Canvas('canvasSpine');
        selectedBookCanvas = that.$canvasFrontCover;
        that.$canvas = that.$canvasFrontCover;
        that._configureBookCanvas();
    }
    canvaApp.prototype.setBackgroundColor = function($color){
        var that = this;
        that.$canvas.backgroundImage = 0;
        that.$canvas.setBackgroundColor($color);
        that.$canvas.renderAll();
    }
    canvaApp.prototype.setBackgroundImage = function($url){
        var that = this;
        //$('.loading-container').removeClass('hidden')
        /*
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL("image/png");
            fabric.Image.fromURL(dataURL, function(bgObj) {
                bgObj.set({
                    originX: "left",
                    originY: "top"
                });
                var scaleRatio = parseInt(that.$canvas.width) / parseInt(bgObj.getWidth());
                bgObj.scale(scaleRatio);
                if (that.$canvas.getHeight() > bgObj.getHeight()) {
                    bgObj.scaleToHeight(that.$canvas.getHeight())
                }
                bgObj.left = (that.$canvas.getWidth() - bgObj.getWidth()) / 2;
                bgObj.top = (that.$canvas.getHeight() - bgObj.getHeight()) / 2;
                that.$canvas.setBackgroundImage(bgObj, that.$canvas.renderAll.bind(that.$canvas));
                //jQuery(".bg_loading").css("display", "none")
                $('.loading-container').addClass('hidden');
            });
            canvas = null;
        };
        img.src = $url;*/



        fabric.Image.fromURL($url, function(bgObj) {
            bgObj.set({
                originX: "left",
                originY: "top"
            });
            var scaleRatio = parseInt(that.$canvas.width) / parseInt(bgObj.getWidth());
            bgObj.scale(scaleRatio);
            if (that.$canvas.getHeight() > bgObj.getHeight()) {
                bgObj.scaleToHeight(that.$canvas.getHeight())
            }
            bgObj.left = (that.$canvas.getWidth() - bgObj.getWidth()) / 2;
            bgObj.top = (that.$canvas.getHeight() - bgObj.getHeight()) / 2;
            that.$canvas.setBackgroundImage(bgObj, that.$canvas.renderAll.bind(that.$canvas));
            //jQuery(".bg_loading").css("display", "none")
        }, {
            crossOrigin: 'Anonymous'
        });
    }
    canvaApp.prototype.addText = function($textType,$text){
        var that = this;
        var fsize;
        if($textType=="big"){
            fsize = 36;
        }else if($textType=="medium"){
            fsize = 22;
        }else{
            fsize = 16;
        }
        var __text = new fabric.IText($text,{
            originX: "center",
            originY: "center",
            fontFamily: "Open Sans",
            fontSize: fsize,
            fill: "#ccc",
            fontWeight: "bold"
        });
        __text.left = that.$canvas.width / 2 - __text.width / 2;
        __text.top = that.$canvas.height / 2 - __text.height / 2;

        var shadow = {
            color: 'rgba(0,0,0,0.6)',
            blur: 20,
            offsetX: 10,
            offsetY: 10,
            opacity: 0.6,
            fillShadow: true,
            strokeShadow: true
        }
        //__text.stroke = '#000';
        //__text.strokeWidth = 1;
        //__text.setShadow(shadow);
        that.$canvas.add(__text)
    }
    canvaApp.prototype.addImage = function($url){
        var that = this;
        /*var largeside = img.width;
        var canvasside = canvas.width;
        var scalefactor = 1;
        if (img_width > canvas.width || img_height > canvas.height) {
            img_width > img_height ? largeside = img_width : largeside = img_height;
            canvas.width > canvas.height ? canvasside = canvas.width : canvasside = canvas.height;
            scalefactor = canvasside / largeside / 2;
        }*/

        fabric.Image.fromURL($url, function(imgObj) {
            console.log(imgObj.width +"     "+ that.$canvas.width);
            console.log(imgObj.height +"     "+ that.$canvas.height)
            if (imgObj.width > that.$canvas.width) {
                imgObj.scaleToWidth(that.$canvas.width);
            }
            if (imgObj.height > that.$canvas.height) {
                imgObj.scaleToHeight(that.$canvas.height);
            }
            that.$canvas.centerObject(imgObj);
            that.$canvas.add(imgObj);
            that.$canvas.renderAll();
        }, {
            crossOrigin: 'Anonymous'
        });

        /*var that = this;
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL("image/png");
            fabric.Image.fromURL(dataURL, function(imgObj) {
                that.$canvas.add(imgObj)
            });
            canvas = null;
        };
        img.src = $url;*/
    }
    canvaApp.prototype.cloneSelectedItem = function(){
        var that = this;
        var obj = that.$canvas.getActiveObject();
        if (!obj) return;
        if (fabric.util.getKlass(obj.type).async) {
          obj.clone(function (clone) {
            clone.set({left: obj.left + 20, top: obj.top + 20});
            that.$canvas.add(clone);
          });
        }
        else {
          that.$canvas.add(obj.clone().set({left: obj.left + 20, top: obj.top + 20}));
        }
        that.$canvas.renderAll();
    }
    canvaApp.prototype.removeSelectedObject  = function (){
        var that = this;
        var activeObject = that.$canvas.getActiveObject();
        that.$canvas.remove(activeObject);
    }
    canvaApp.prototype.setTextFormating = function($dataStyle,$Obj){
        var that = this;
        switch($dataStyle){
          case 'italic':
             // $($Obj).addClass(that.getActiveStyle('fontStyle') === 'italic' ? '' : 'active');
             that.manageClassOnTextProps($Obj)
              that.setActiveStyle('fontStyle',that.getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
          break;
          case 'bold':
              //$($Obj).addClass(that.getActiveStyle('fontWeight') === 'bold' ? '' : 'active');
              that.manageClassOnTextProps($Obj)
              that.setActiveStyle('fontWeight', that.getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
          break;
          case 'underline':
              //$($Obj).addClass(that.getActiveStyle('textDecoration') === 'underline' ? '' : 'active');
              that.manageClassOnTextProps($Obj)
              that.setActiveStyle('textDecoration', that.getActiveStyle('textDecoration') === 'underline' ? '' : 'underline');
          break;
        }

    }
    canvaApp.prototype.manageClassOnTextProps = function(obj){
        var that = this;
        if($(obj).hasClass('active')){
            $(obj).removeClass('active')
        }else{
            $(obj).addClass('active');
        }
    }
    canvaApp.prototype.setActiveStyle = function (styleName, value, object) {
        var that = this;
        object = object || that.$canvas.getActiveObject();
        if (!object) return;
        if (object.setSelectionStyles && object.isEditing) {
            var style = { };
            style[styleName] = value;
            object.setSelectionStyles(style);
            object.setCoords();
        }
        else {
            object[styleName] = value;
        }
        object.setCoords();
        that.$canvas.renderAll();
    }
    canvaApp.prototype.getActiveStyle = function (styleName, object) {
        var that = this;
        object = object || that.$canvas.getActiveObject();
        if (!object) return '';

        return (object.getSelectionStyles && object.isEditing)
          ? (object.getSelectionStyles()[styleName] || '')
          : (object[styleName] || '');
    };
    canvaApp.prototype.updateImageSettings = function(){
        var that = this;
        $('#image-settings #object-x-position').val(that.$canvas.getActiveObject().left);
        $('#image-settings #object-y-position').val(that.$canvas.getActiveObject().top)
        var shadowObj = that.$canvas.getActiveObject().getShadow()
        if(shadowObj){
            $('#img-shadow').bootstrapSlider('setValue', parseInt(shadowObj.offsetX)).change()
        }
    }
    canvaApp.prototype.showTextSettings = function(){
        var that = this;
        if(that.getActiveStyle('fontWeight') === 'bold'){
            $('.formating.bold').addClass('active')
        }else{
            $('.formating.bold').removeClass('active')
        }
        if(that.getActiveStyle('fontStyle') === 'italic'){
            $('.formating.italic').addClass('active')
        }else{
            $('.formating.italic').removeClass('active')
        }
        if(that.getActiveStyle('textDecoration') === 'underline'){
            $('.formating.underline').addClass('active')
        }else{
            $('.formating.underline').removeClass('active')
        }
        if(that.getActiveStyle('fontFamily')!='Helvetica'){
            $('#font-family').val(that.getActiveStyle('fontFamily')).change();
        }
        $('#fSizeControl').bootstrapSlider('setValue', parseInt(that.getActiveStyle('fontSize'))).change();
        var shadowObj = that.$canvas.getActiveObject().getShadow();
        if(shadowObj){
            $('#textSettings #shadow-distance-text').bootstrapSlider('setValue', parseInt(shadowObj.offsetX)).change();
            $('#textSettings #shadowColorControl').val(shadowObj.color);
        }else{

        }
        $('#textSettings #colorControl').val(that.getActiveStyle('fill'));
        var __opacity = that.getActiveStyle('opacity')
        __opacity = __opacity * 100;
        $('#textSettings .opacity-icon').removeClass('active');
        $( "#textSettings .opacity-icon[data-opacity='"+__opacity+"']" ).addClass('active');
        var __align = that.$canvas.getActiveObject().alignment;
        $('#textSettings .align').removeClass('active');
        $( "#textSettings .align[data-align='"+__align+"']" ).addClass('active');
    }
    canvaApp.prototype.manageObjectPosition = function ($type,$pos,$inputPos) {
        var that = this;
        if($type == 'increase'){
            that.$canvas.getActiveObject()[$pos] = that.$canvas.getActiveObject()[$pos] + 5;
        }else if($type == 'decrease'){
            that.$canvas.getActiveObject()[$pos] = that.$canvas.getActiveObject()[$pos] - 5;
        }else{
            that.$canvas.getActiveObject()[$pos] = parseInt($inputPos);
        }
        switch (that.$canvas.getActiveObject().type) {
          case 'image':
              $('#image-settings #object-x-position').val(that.$canvas.getActiveObject().left);
              $('#image-settings #object-y-position').val(that.$canvas.getActiveObject().top)
              break;
          case 'shape':
          case 'path-group':
              $('.shape-settings #object-x-position').val(that.$canvas.getActiveObject().left);
              $('.shape-settings #object-y-position').val(that.$canvas.getActiveObject().top)
          break;
          default:
        }
        that.$canvas.renderAll();
    }
    canvaApp.prototype.manageSearch = function($searchType,$searchKey,$id,$elmToHide,$listElm,$currentPage){
        var that = this;
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url: globalarr['site_url']+'/wp-json/get-pixabay-images/get',
            type: 'get',
            data: {'search_type': $searchType, 'search_string': $searchKey, 'current_page': $currentPage},
            success: function(data, status) {
                var data = JSON.parse(data);
                $('.loading-container').addClass('hidden');
                if (parseInt(data.totalHits) > 0){
                    $($elmToHide).addClass('hidden');
                    if($currentPage == 1){
                        //$($listElm+' .mCSB_container').html("")
                    }
                    $.each(data.hits, function(i, hit){
                        var url = $searchType == "background" ?  hit.fullHDURL : hit.webformatURL;
                        var __html = '<a href="#" class="thumbnail" data-image="'+url+'"><img src="'+hit.previewURL+'" alt="bg" /></a>';
                        $($listElm).append(__html);
                        //$($listElm).mCustomScrollbar("update");
                        $($id+' .search-container .fa-long-arrow-left').removeClass('hidden');
                    });
                } else{
                    console.log('No hits');
                }
            },
            error: function(xhr, desc, err) {
              console.log(xhr);
              console.log("Details: " + desc + "\nError:" + err);
            }
        })
    }
    canvaApp.prototype.manageMask = function ($imgSrc) {
        var that = this;
        fabric.Image.fromURL($imgSrc, function(img){
            img.width = 200;
            img.height = 200;
            img.left = that.$canvas.getActiveObject().left;
            img.top = that.$canvas.getActiveObject().top;
            that.$canvas.add(img);
            that.$canvas.sendBackwards(img);
            that.$canvas.getActiveObject().globalCompositeOperation = 'source-atop';

            that.$canvas.renderAll();
        });
    };
    canvaApp.prototype.snapObjects = function($options){
        $options.target.set({
            left: Math.round($options.target.left / grid) * grid,
            top: Math.round($options.target.top / grid) * grid
        });
    }
    canvaApp.prototype.showGrid = function($gSize){
        grid = $gSize;
        var that = this;
        for (var i = 0; i < (that.$canvas.width / grid); i++) {
            that.$canvas.add(new fabric.Line([ 0, i * grid, that.$canvas.width, i * grid], { stroke: '#ccc', selectable: false, id: 'grid-line' }))
        }
        for (var i = 0; i < (that.$canvas.width / grid); i++) {
            that.$canvas.add(new fabric.Line([ i * grid, 0, i * grid, that.$canvas.height], { stroke: '#ccc', selectable: false, id: 'grid-line' }));
        }
    }
    canvaApp.prototype.hideGrid = function(){
        var that = this;
        that.$canvas.forEachObject(function(o, i) {
            if (o.id == "grid-line") {
                that.$canvas.item(i).remove();
            }
        });
        that.$canvas.renderAll();
    }

    canvaApp.prototype.loadShapes = function(){
        $('.shapes-list .mCSB_container').html("");
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url : globalarr['site_url']+"/wp-json/get-shapes/get",
            type : "GET",
            success : function(data){
                $('.loading-container').addClass('hidden');
                jQuery.each(jQuery.parseJSON(data).data, function(i, val) {
                    var __html = '<a href="#" class="thumbnail shape" title="'+val.title+'" data-id="'+val.id+'" data-image="'+val.guid+'"><img src="'+val.guid+'" alt="'+val.title+'" /></a>';
                    $('.shapes-list .mCSB_container').append(__html);
                    $('.shapes-list').mCustomScrollbar('update');
                });
                
            }
        })
    }
    canvaApp.prototype.loadEffects = function(){
        $('.effects-list .mCSB_container').html("")
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url : globalarr['site_url']+"/wp-json/get-effects/get",
            type : "GET",
            success : function(data){
                $('.loading-container').addClass('hidden');
                jQuery.each(jQuery.parseJSON(data).data, function(i, val) {
                    var __html = '<a href="#" class="thumbnail effects" title="'+val.title+'" data-id="'+val.id+'" data-image="'+val.guid+'"><img src="'+val.guid+'" alt="'+val.title+'" /></a>';
                    $('.effects-list .mCSB_container').append(__html);
                    $('.effects-list').mCustomScrollbar('update');
                });
                
            }
        })
    }
    canvaApp.prototype.loadThemes = function(){
        var that = this;
        $('.themes-list .mCSB_container').html("")
        $.ajax({
            url: globalarr['site_url']+'/wp-json/get-themes/get',
            type: 'get',
            success: function(data, status) {
                var data = JSON.parse(data);
                var themes = $.grep(data.data, function (element, index) {
                    return element.width == that.$canvas.width && element.height == that.$canvas.height;
                });
                jQuery.each(themes, function(i, val) {
                    //console.log("asdfadsfasd");
                    var __html = '<a href="#" class="thumbnail theme" title="'+val.title+'" data-id="'+val.theme_id+'"><img src="'+val.image+'" alt="'+val.tag+'" /></a>';
                    $('.themes-list .mCSB_container').append(__html);
                    $('.themes-list').mCustomScrollbar('update');
                });
            },
            error: function(xhr, desc, err) {

            }
        })
    }
    canvaApp.prototype.loadProjects = function(objName){
        $(objName+' .mCSB_container').html("")
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url: globalarr['site_url']+'/wp-json/get-projects/post',
            type : "post",
            data : {
                user_id: globalarr['user_id'],
                user_key: globalarr['user_key']
            },
            success: function(data, status) {
                $('.loading-container').addClass('hidden');
                //console.log(status);
                var data = JSON.parse(data);
                //console.log(data.data);
                jQuery.each(data.data, function(i, val) {
                  //  console.log("asdfadsfasd");
                    var __html = '<a href="#" class="thumbnail myproject" title="'+val.title+'" data-projectuser="'+val.project_user+'" data-id="'+val.project_id+'"><img src="'+val.image+'" alt="'+val.tag+'" /></a>';
                    $(objName+' .mCSB_container').append(__html);
                    $(objName).mCustomScrollbar('update');
                });
                $(objName).mCustomScrollbar({
                    callbacks:{
                        onScroll:function(){
                          console.log("Content scrolled...");
                        }
                    }
                });
            },
            error: function(xhr, desc, err) {
                console.log(xhr)
            }
        })
    }
    canvaApp.prototype.getTheme = function($themeId){
        var that = this;
        var that = this;
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url: globalarr['site_url']+'/wp-json/get-theme/get',
            type : "get",
            data : {
                theme_id: $themeId
            },
            success: function(data, status) {
                var data = JSON.parse(data);
                jQuery.each(data, function(i, val) {
                    //console.log(val);
                    that.$canvas.loadFromJSON(val.json_object, function(){
                       // console.log('dfadsadsf');
                        that.$canvas.renderAll();
                        $('.loading-container').addClass('hidden');
                    });
                });
            }
        })
    }

    canvaApp.prototype.saveProject = function(){
        var that = this;
        var properties_to_save = Array("width", "height", "orig_src", "clip_left", "clip_top", "clip_width", "clip_height", "is_frame", "id", "gradientAngle");
        var object = JSON.stringify(that.$canvas.toJSON(properties_to_save));
        var dataURL = that.$canvas.toDataURL("image/jpeg");
        $.ajax({
            url: globalarr['site_url']+'/wp-json/save-project/post',
            type: 'post',
            data : {
                user_id: globalarr['user_id'],
                user_key: globalarr['user_key'],
                project_name: $('#projectName').val(),
                project_width: that.$canvas.width,
                project_height: that.$canvas.height,
                project_tag: $('#projectTag').val(),
                project_image: dataURL,
                json_object : JSON.stringify(that.$canvas),
                type:'test',
                project_id: projectID
            },
            success: function(data, status) {
                $('.loading-container').addClass('hidden');
            },
            error: function(xhr, desc, err) {
                console.log(err);
            }
        })
    }

    canvaApp.prototype.getProject = function(){
        var that = this;
        that.$canvas.clear();
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url: globalarr['site_url']+'/wp-json/get-project/post',
            type : "post",
            data : {
                user_id: globalarr['user_id'],
                user_key: globalarr['user_key'],
                project_id: projectID
            },
            success: function(data, status) {
               // console.log(data);
                var data = JSON.parse(data);
                //console.log(data);
                var jObj = data.data.json_object.replace(/\\/g, "");
                that.$canvas.loadFromJSON(jObj, function(){
                   // console.log('dfadsadsf');
                    that.$canvas.renderAll();
                });
                $('.loading-container').addClass('hidden');
            }
        })
    }

    canvaApp.prototype.updateTheme = function(){
        var that = this;
        var dataURL = that.$canvas.toDataURL("image/png");
        $('.loading-container').removeClass('hidden');
        $.ajax({
            url : "api.php?rquest=updateTheme",
            type : "POST",
            data : {
                json_object : JSON.stringify(that.$canvas),
                width: that.$canvas.width,
                height: that.$canvas.height,
                theme_name: 'Test Theme1',
                tag: 'New Year',
                thumbnail: dataURL,
                theme_id: selectedThemeId
            },
            success:function(result){
               // console.log(result);
                $('.loading-container').addClass('hidden');
            }
        })
    }

    canvaApp.prototype.loadSelectedShape  = function(svgURL) {
        var that = this;
       // console.log(svgURL);
        fabric.loadSVGFromURL(svgURL, function(objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            that.$canvas.add(obj).centerObject(obj).renderAll();
            obj.setCoords();
        });
        that.$canvas.renderAll();

        //that.load_svg_from_string(svgURL)
        //that.loadTempShape()
    };
    Array.prototype.getDuplicates = function () {
        var duplicates = {};
        for (var i = 0; i < this.length; i++) {
            if(duplicates.hasOwnProperty(this[i])) {
                duplicates[this[i]].push(i);
            } else if (this.lastIndexOf(this[i]) !== i) {
                duplicates[this[i]] = [i];
            }
        }

        return duplicates;
    }
    canvaApp.prototype.showShapeSettings = function (__target) {
        var that = this;
        /*var options = {
            showPalette: false,
            showPaletteOnly: false,
            togglePaletteOnly: false,
            togglePaletteMoreText: "Custom",
            togglePaletteLessText: "Popular",
            showInput: true,
            showInitial: true,
            showButtons: false,
            chooseText: "Choose",
            cancelText: "",
            preferredFormat: "hex",
            clickoutFiresChange: true,
            appendTo: ".shape-color-picker",
            palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]]
        };*/

        var active_object = that.$canvas.getActiveObject() || that.$canvas.getActiveGroup();
        var tempArray = new Array();
        for (var variable in active_object.paths) {
            if (active_object.paths.hasOwnProperty(variable)) {
                if(active_object.paths[variable].fill!=""){
                    tempArray.push(active_object.paths[variable].fill)
                }
            }
        }

        var dulicateColors = tempArray.getDuplicates();
        var shapeColors = [];
        var uniqueColorIndex = [];
        for(i = 0; i< tempArray.length; i++){
            if(shapeColors.indexOf(tempArray[i]) === -1){
                shapeColors.push(tempArray[i]);
                uniqueColorIndex.push(i)
            }
        }
        $('.shape-colors').html("");
        for (var i = 0; i < shapeColors.length; i++) {
            if(dulicateColors[shapeColors[i]]!=undefined){
                $('.shape-colors').append('<div class="shape-color" data-group="'+dulicateColors[shapeColors[i]]+'" data-old-color="'+shapeColors[i]+'" data-new-color=""><div style="background:'+shapeColors[i]+'" class="shape-color-preview" ></div><i class="fa fa-caret-down"></i></div>');
            }else{
                $('.shape-colors').append('<div class="shape-color" data-group="'+uniqueColorIndex[i]+'" data-old-color="'+shapeColors[i]+'" data-new-color=""><div style="background:'+shapeColors[i]+'" class="shape-color-preview" ></div><i class="fa fa-caret-down"></i></div>');
            }
        }
        $('.settings-panel').addClass('hidden');
        $('.tab-pane').addClass('hidden');
        $('.shape-edit-panel').removeClass('hidden');

        $('.shape-colors').find('.shape-color').colorpicker({
            container: true,
            align: 'left'
        }).on('changeColor', function(e) {
            var arrayaa = $(this).attr('data-group').split(",");
            for (var variable in arrayaa) {
                if (arrayaa.hasOwnProperty(variable)) {
                    var ind = parseInt(arrayaa[variable])
                    active_object.paths[ind].fill = e.color.toHex();
                }
            }
            $(this).find('.shape-color-preview').css('background',e.color.toHex())
            that.$canvas.renderAll();
        });
        that.$canvas.renderAll();
    };
    canvaApp.prototype.loadTheme = function($json){
        var that = this;
        that.$canvas.loadFromJSON($json, function(){
            that.$canvas.renderAll();
        });
    }
    canvaApp.prototype.saveCanvasAsImage = function($format){
        var that = this;
        
        if(projectType != 'bookCover'){
            var activeObject = that.$canvas.getActiveObject();
            if(activeObject){
                activeObject.hasBorders = activeObject.hasControls = false;
            }
            that.$canvas.renderAll();
            var img = that.$canvas.toDataURL({
                format: $format,
                quality: 1
            });
            var blob = that.dataURItoBlob(img, "image/" + $format);
            saveAs(blob,  "canvas." + $format);
        }else{
            var frontCanvasObj = that.$canvasFrontCover.getActiveObject();
            if(frontCanvasObj){
                frontCanvasObj.hasBorders = frontCanvasObj.hasControls = false;
            }
            that.$canvasFrontCover.renderAll();
            
            var img1 = that.$canvasFrontCover.toDataURL({
                format: $format,
                quality: 1
            });
            var img2 = that.$canvasSpine.toDataURL({
                format: $format,
                quality: 1
            });
            var img3 = that.$canvasBackCover.toDataURL({
                format: $format,
                quality: 1
            });

            var c3 = document.getElementById('canvasFrontCover');
            var c2 = document.getElementById('canvasSpine');
            var c1 = document.getElementById('canvasBackCover');

            var buffer = document.createElement('canvas');
            var bufferCtx = buffer.getContext("2d");
            buffer.width = 1300;
            buffer.height = 750;
            //bufferCtx.putImageData(img, 0, 0);
            bufferCtx.drawImage(c1, 0, 0);
            bufferCtx.drawImage(c2, 500, 0);
            bufferCtx.drawImage(c3, 600, 0);

            var img = buffer.toDataURL({
                format: $format,
                quality: 1
            });
            var blob = that.dataURItoBlob(img, "image/" + $format);
            saveAs(blob,  "canvas." + $format);
        }

        
    }
    canvaApp.prototype.dataURItoBlob = function (dataURI, type) {
        var byteString = atob(dataURI.split(",")[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab],{
            type: type
        });
    }
    canvaApp.prototype.loadContentOnScroll = function(__type){
        var that = this;
        switch(__type){
            case "shapes-list":

            break;
            case "images-list":
                var currentPage = parseInt($('.search-images-list').attr('data-page'));
                currentPage = currentPage + 1;
                $('.search-images-list').attr('data-page', currentPage)
                that.manageSearch('images',$('#images .search-container .search-key').val(),'#images','.masonry','.search-images-list',currentPage);
            break;
            case "backgrounds-list":
                var currentPage = parseInt($('.search-backgrounds-list').attr('data-page'));
                currentPage = currentPage + 1;
                $('.search-backgrounds-list').attr('data-page', currentPage)
                that.manageSearch('background',$('#backgrounds .search-container .search-key').val(),'#backgrounds','.backgrounds-list','.search-backgrounds-list',currentPage);
            break;
            
            
        }
    }
    /*
    canvaApp.prototype.load_svg_from_string  = function(string) {
        var that = this;
        var group = [];
        var gr = [];
        fabric.loadSVGFromURL(string, function(objects, options) {
            var loadedObjects = new fabric.Group();
            var lo = new fabric.Group();
            loadedObjects.set({
                left: 0,
                top: 0,
                originX: "center",
                originY: "center",
                width: options.width,
                height: options.height
            });
            group.forEach(function(object) {
                object.set({
                    originX: "center",
                    originY: "center"
                });
                object.setCoords();
                object.left = object.left - loadedObjects.width / 2;
                object.top = object.top - loadedObjects.height / 2;
                loadedObjects.add(object);
            });
            gr.forEach(function(object) {
                object.set({
                    originX: "left",
                    originY: "top"
                });
                object.setCoords();
                switch (object.type) {
                case "polygon":
                    object.left = object.left - object.width / 2;
                    object.top = object.top - object.height / 2;
                    break;
                default:
                    object.left = object.left - object.width / 2 - loadedObjects.width / 2;
                    object.top = object.top - object.height / 2 - loadedObjects.height / 2;
                }
                loadedObjects.add(object);
            });
            that.$canvas.add(loadedObjects);
            loadedObjects.center().setCoords();
            if (loadedObjects.getWidth() > that.$canvas.getWidth()) {
                loadedObjects.scaleToWidth(that.$canvas.getWidth());
            }
            if (loadedObjects.getHeight() > that.$canvas.getHeight()) {
                loadedObjects.scaleToHeight(that.$canvas.getHeight());
            }
            that.$canvas.renderAll();
        }, function(item, object) {
            var tr = item.getAttribute("transform");
            var tx = 0;
            var ty = 0;
            if (tr) {
                var res = tr.match(/[a-z]+\(([\d\.\-]+).([\d\.\-]+)\)/);
                if (res) {
                    tx = parseFloat(res[1]);
                    ty = parseFloat(res[2]);
                }
            }
            object.set("id", item.getAttribute("id"));
            object.set({
                originX: "center",
                originY: "center"
            });
            if (object.transformMatrix || object.gradientTransform) {
                tm = object.transformMatrix;
                if (object.gradientTransform) {
                    tm = object.gradientTransform;
                }
                object.transformMatrix = null ;
                var ox = object.left;
                var oy = object.top;
                if (item.getAttribute("x1")) {
                    ox = item.getAttribute("x1");
                }
                if (item.getAttribute("y1")) {
                    oy = item.getAttribute("y1");
                }
                var resm = that.pmatrix2("matrix(1,0,0,1," + ox + "," + oy + ")", "matrix(" + tm.join(",") + ")");
                object.left = parseFloat(resm.split(",")[4]) + tx;
                object.top = parseFloat(resm.split(",")[5]) + ty;
                group.push(object);
                object.setCoords();
            } else {
                if (object.type == "circle") {
                    if (parseFloat(item.getAttribute("cx"))) {
                        object.left = parseFloat(item.getAttribute("cx")) + tx;
                    }
                    if (parseFloat(item.getAttribute("cy"))) {
                        object.top = parseFloat(item.getAttribute("cy")) + ty;
                    }
                }
                if (object.type == "polygon") {}
                gr.push(object);
            }
        });
    }

    canvaApp.prototype.loadTempShape = function(){
        var that = this;
        var obj = '[{"type":"path-group","originX":"left","originY":"top","left":104.5,"top":168.5,"width":200,"height":200,"fill":"","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"paths":[{"type":"path","originX":"left","originY":"top","left":48.58,"top":16.57,"width":120.03,"height":65.17,"fill":"#5E889E","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",166.091,65.046],["l",-21.08,16.693],["h",-6.747],["l",17.19,-13.615],["l",8.022,-6.358],["l",0.011,-0.007],["c",0.087,-0.068,0.159,-0.154,0.238,-0.233],["c",0.753,-0.753,1.038,-1.828,0.795,-2.821],["c",-0.1,-0.412,-0.271,-0.806,-0.548,-1.151],["l",-21.894,-27.643],["l",-6.357,-8.026],["c",-1.027,-1.295,-2.907,-1.514,-4.203,-0.489],["l",-8.044,6.374],["L",55.336,81.739],["h",-6.754],["l",80.333,-63.625],["c",3.101,-2.453,7.639,-1.927,10.095,1.17],["l",28.253,35.667],["C",169.715,58.052,169.188,62.591,166.091,65.046],["z"],["M",156.262,50.725],["c",0.005,-0.003,0.005,-0.003,0.007,-0.007],["l",-15.673,-19.784],["c",-5.097,3.038,-11.632,2.279,-15.912,-1.831],["L",58.227,81.739],["h",32.105],["c",-4.907,-8.741,-3.833,-19.144,3.05,-24.598],["c",7.789,-6.169,20.055,-3.658,27.393,5.606],["c",4.63,5.843,6.185,12.972,4.758,18.992],["h",9.836],["l",19.06,-15.099],["C",151.393,61.54,152.149,55.007,156.262,50.725],["z"],["M",106.782,70.654],["c",-3.265,1.046,-4.792,1.246,-5.566,0.268],["c",-0.655,-0.827,-0.687,-2.148,1.233,-3.672],["c",2.132,-1.686,4.028,-2.085,5.055,-2.369],["l",-1.787,-4.019],["c",-1.351,0.298,-3.012,0.94,-5.065,2.421],["l",-1.027,-1.3],["c",-0.263,-0.333,-0.655,-0.568,-1.118,-0.617],["c",-0.452,-0.054,-0.887,0.084,-1.225,0.347],["l",-0.284,0.228],["c",-0.335,0.265,-0.566,0.655,-0.622,1.114],["c",-0.053,0.456,0.084,0.892,0.35,1.227],["l",1.191,1.503],["c",-2.673,3.129,-2.891,6.623,-0.829,9.224],["c",2.272,2.87,5.603,2.641,9.615,1.199],["c",2.773,-0.997,4.283,-1.036,5.172,0.085],["c",0.938,1.188,0.3,2.751,-1.388,4.087],["c",-0.692,0.549,-1.423,0.994,-2.16,1.358],["h",6.992],["c",2.778,-3.241,2.827,-6.878,0.781,-9.462],["C",113.993,69.611,111.29,69.11,106.782,70.654],["z"]],"pathOffset":{"x":108.5986185817361,"y":49.1541711478263}},{"type":"path","originX":"left","originY":"top","left":16.9,"top":69.28,"width":166.21,"height":130.72,"fill":"#5E889E","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",167.031,77.586],["h",-10.063],["l",7.614,-6.034],["c",0.033,0.03,0.066,0.054,0.095,0.084],["c",1.569,1.57,2.354,3.627,2.354,5.684],["V",77.586],["z"],["M",183.103,133.302],["v",19.286],["c",0,0.618,-0.236,1.235,-0.706,1.704],["c",-0.474,0.472,-1.09,0.708,-1.707,0.708],["h",-33.75],["c",-3.084,0,-6.167,-1.177,-8.521,-3.53],["c",-2.354,-2.354,-3.53,-5.439,-3.53,-8.523],["c",0,-3.087,1.176,-6.172,3.53,-8.525],["c",2.354,-2.353,5.438,-3.53,8.521,-3.53],["h",33.75],["c",0.617,0,1.233,0.237,1.707,0.706],["C",182.866,132.068,183.103,132.687,183.103,133.302],["z"],["M",153.017,142.946],["c",0,-3.356,-2.721,-6.077,-6.077,-6.077],["c",-3.355,0,-6.076,2.721,-6.076,6.077],["c",0,3.355,2.721,6.076,6.076,6.076],["C",150.296,149.022,153.017,146.302,153.017,142.946],["z"],["M",146.939,159.016],["h",31.603],["v",28.931],["c",0,3.085,-1.178,6.169,-3.53,8.523],["c",-2.354,2.354,-5.438,3.53,-8.525,3.53],["H",28.953],["c",-3.085,0,-6.17,-1.177,-8.521,-3.53],["c",-2.356,-2.354,-3.534,-5.438,-3.534,-8.523],["V",81.336],["c",0,-3.083,1.177,-6.169,3.534,-8.521],["c",2.351,-2.355,5.437,-3.53,8.521,-3.53],["h",7.951],["l",-3.559,8.302],["h",-4.124],["c",-1.028,0,-2.057,0.393,-2.84,1.178],["c",-0.789,0.785,-1.179,1.815,-1.179,2.841],["v",0.267],["c",0,1.03,0.391,2.057,1.179,2.842],["c",0.783,0.785,1.812,1.177,2.84,1.177],["h",137.265],["c",3.087,0,6.172,1.177,8.525,3.53],["c",2.353,2.354,3.53,5.438,3.53,8.523],["v",28.929],["h",-31.603],["c",-4.292,0,-8.327,1.671,-11.363,4.705],["c",-3.034,3.038,-4.708,7.073,-4.708,11.367],["c",0,4.293,1.674,8.327,4.708,11.363],["C",138.612,157.346,142.648,159.016,146.939,159.016],["z"],["M",169.298,116.025],["c",0,-0.662,-0.539,-1.205,-1.203,-1.205],["s",-1.205,0.543,-1.205,1.205],["v",5.626],["c",0,0.662,0.541,1.205,1.205,1.205],["s",1.203,-0.543,1.203,-1.205],["V",116.025],["z"],["M",169.298,103.972],["c",0,-0.662,-0.539,-1.205,-1.203,-1.205],["s",-1.205,0.543,-1.205,1.205],["v",5.626],["c",0,0.66,0.541,1.203,1.205,1.203],["s",1.203,-0.543,1.203,-1.203],["V",103.972],["z"],["M",164.644,96.338],["c",0,0.664,0.541,1.205,1.207,1.205],["h",0.636],["c",0.179,0,0.403,0.226,0.403,0.401],["v",0.638],["c",0,0.666,0.539,1.206,1.205,1.206],["s",1.203,-0.54,1.203,-1.206],["v",-0.638],["c",0,-1.498,-1.312,-2.812,-2.812,-2.812],["h",-0.636],["C",165.185,95.133,164.644,95.671,164.644,96.338],["z"],["M",153.972,96.338],["c",0,0.662,0.542,1.205,1.206,1.205],["h",5.623],["c",0.664,0,1.209,-0.543,1.209,-1.205],["c",0,-0.664,-0.545,-1.206,-1.209,-1.206],["h",-5.623],["C",154.514,95.133,153.972,95.674,153.972,96.338],["z"],["M",141.918,96.338],["c",0,0.662,0.54,1.205,1.204,1.205],["h",5.625],["c",0.664,0,1.207,-0.543,1.207,-1.205],["c",0,-0.664,-0.543,-1.206,-1.207,-1.206],["h",-5.625],["C",142.458,95.133,141.918,95.674,141.918,96.338],["z"],["M",129.862,96.338],["c",0,0.662,0.545,1.205,1.209,1.205],["h",5.622],["c",0.664,0,1.206,-0.543,1.206,-1.205],["c",0,-0.664,-0.542,-1.206,-1.206,-1.206],["h",-5.622],["C",130.407,95.133,129.862,95.674,129.862,96.338],["z"],["M",26.14,98.583],["c",0,0.666,0.541,1.206,1.207,1.206],["c",0.666,0,1.204,-0.54,1.204,-1.206],["v",-0.638],["c",0,-0.175,0.226,-0.401,0.403,-0.401],["h",0.636],["c",0.667,0,1.205,-0.541,1.205,-1.205],["c",0,-0.667,-0.538,-1.206,-1.205,-1.206],["h",-0.636],["c",-1.5,0,-2.813,1.314,-2.813,2.812],["V",98.583],["z"],["M",26.14,109.598],["c",0,0.66,0.543,1.203,1.207,1.203],["s",1.204,-0.543,1.204,-1.203],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",109.598],["z"],["M",26.14,121.651],["c",0,0.662,0.543,1.205,1.207,1.205],["s",1.204,-0.543,1.204,-1.205],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",121.651],["z"],["M",26.14,133.705],["c",0,0.662,0.543,1.205,1.207,1.205],["s",1.204,-0.543,1.204,-1.205],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",133.705],["z"],["M",26.14,145.759],["c",0,0.664,0.543,1.205,1.207,1.205],["s",1.204,-0.541,1.204,-1.205],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",145.759],["z"],["M",26.14,157.813],["c",0,0.664,0.543,1.203,1.207,1.203],["s",1.204,-0.539,1.204,-1.203],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",157.813],["z"],["M",26.14,169.864],["c",0,0.666,0.543,1.207,1.207,1.207],["s",1.204,-0.541,1.204,-1.207],["v",-5.624],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",169.864],["z"],["M",26.14,181.92],["c",0,0.664,0.543,1.205,1.207,1.205],["s",1.204,-0.541,1.204,-1.205],["v",-5.626],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["s",-1.207,0.543,-1.207,1.205],["V",181.92],["z"],["M",30.796,189.553],["c",0,-0.665,-0.54,-1.205,-1.206,-1.205],["h",-0.638],["c",-0.177,0,-0.403,-0.226,-0.403,-0.401],["v",-0.638],["c",0,-0.666,-0.538,-1.205,-1.204,-1.205],["c",-0.666,0,-1.207,0.539,-1.207,1.205],["v",0.638],["c",0,1.498,1.314,2.813,2.813,2.813],["h",0.638],["C",30.257,190.759,30.796,190.221,30.796,189.553],["z"],["M",41.471,189.553],["c",0,-0.662,-0.545,-1.205,-1.206,-1.205],["H",34.64],["c",-0.664,0,-1.206,0.543,-1.206,1.205],["s",0.542,1.206,1.206,1.206],["h",5.625],["C",40.926,190.759,41.471,190.215,41.471,189.553],["z"],["M",41.471,96.338],["c",0,-0.664,-0.545,-1.206,-1.206,-1.206],["H",34.64],["c",-0.664,0,-1.206,0.542,-1.206,1.206],["c",0,0.662,0.542,1.205,1.206,1.205],["h",5.625],["C",40.926,97.543,41.471,97,41.471,96.338],["z"],["M",53.523,189.553],["c",0,-0.662,-0.543,-1.205,-1.205,-1.205],["h",-5.622],["c",-0.666,0,-1.208,0.543,-1.208,1.205],["s",0.542,1.206,1.208,1.206],["h",5.622],["C",52.98,190.759,53.523,190.215,53.523,189.553],["z"],["M",53.523,96.338],["c",0,-0.664,-0.543,-1.206,-1.205,-1.206],["h",-5.622],["c",-0.666,0,-1.208,0.542,-1.208,1.206],["c",0,0.662,0.542,1.205,1.208,1.205],["h",5.622],["C",52.98,97.543,53.523,97,53.523,96.338],["z"],["M",65.579,189.553],["c",0,-0.662,-0.545,-1.205,-1.207,-1.205],["h",-5.626],["c",-0.664,0,-1.204,0.543,-1.204,1.205],["s",0.54,1.206,1.204,1.206],["h",5.626],["C",65.034,190.759,65.579,190.215,65.579,189.553],["z"],["M",65.579,96.338],["c",0,-0.664,-0.545,-1.206,-1.207,-1.206],["h",-5.626],["c",-0.664,0,-1.204,0.542,-1.204,1.206],["c",0,0.662,0.54,1.205,1.204,1.205],["h",5.626],["C",65.034,97.543,65.579,97,65.579,96.338],["z"],["M",77.63,189.553],["c",0,-0.662,-0.541,-1.205,-1.205,-1.205],["h",-5.624],["c",-0.664,0,-1.206,0.543,-1.206,1.205],["s",0.542,1.206,1.206,1.206],["h",5.624],["C",77.089,190.759,77.63,190.215,77.63,189.553],["z"],["M",77.63,96.338],["c",0,-0.664,-0.541,-1.206,-1.205,-1.206],["h",-5.624],["c",-0.664,0,-1.206,0.542,-1.206,1.206],["c",0,0.662,0.542,1.205,1.206,1.205],["h",5.624],["C",77.089,97.543,77.63,97,77.63,96.338],["z"],["M",89.684,189.553],["c",0,-0.662,-0.543,-1.205,-1.204,-1.205],["h",-5.625],["c",-0.664,0,-1.206,0.543,-1.206,1.205],["s",0.542,1.206,1.206,1.206],["h",5.625],["C",89.141,190.759,89.684,190.215,89.684,189.553],["z"],["M",89.684,96.338],["c",0,-0.664,-0.543,-1.206,-1.204,-1.206],["h",-5.625],["c",-0.664,0,-1.206,0.542,-1.206,1.206],["c",0,0.662,0.542,1.205,1.206,1.205],["h",5.625],["C",89.141,97.543,89.684,97,89.684,96.338],["z"],["M",101.738,189.553],["c",0,-0.662,-0.542,-1.205,-1.206,-1.205],["h",-5.624],["c",-0.664,0,-1.204,0.543,-1.204,1.205],["s",0.54,1.206,1.204,1.206],["h",5.624],["C",101.196,190.759,101.738,190.215,101.738,189.553],["z"],["M",101.738,96.338],["c",0,-0.664,-0.542,-1.206,-1.206,-1.206],["h",-5.624],["c",-0.664,0,-1.204,0.542,-1.204,1.206],["c",0,0.662,0.54,1.205,1.204,1.205],["h",5.624],["C",101.196,97.543,101.738,97,101.738,96.338],["z"],["M",113.792,189.553],["c",0,-0.662,-0.54,-1.205,-1.204,-1.205],["h",-5.627],["c",-0.661,0,-1.206,0.543,-1.206,1.205],["s",0.545,1.206,1.206,1.206],["h",5.627],["C",113.252,190.759,113.792,190.215,113.792,189.553],["z"],["M",113.792,96.338],["c",0,-0.664,-0.54,-1.206,-1.204,-1.206],["h",-5.627],["c",-0.661,0,-1.206,0.542,-1.206,1.206],["c",0,0.662,0.545,1.205,1.206,1.205],["h",5.627],["C",113.252,97.543,113.792,97,113.792,96.338],["z"],["M",125.847,189.553],["c",0,-0.662,-0.544,-1.205,-1.205,-1.205],["h",-5.625],["c",-0.664,0,-1.206,0.543,-1.206,1.205],["s",0.542,1.206,1.206,1.206],["h",5.625],["C",125.303,190.759,125.847,190.215,125.847,189.553],["z"],["M",125.847,96.338],["c",0,-0.664,-0.544,-1.206,-1.205,-1.206],["h",-5.625],["c",-0.664,0,-1.206,0.542,-1.206,1.206],["c",0,0.662,0.542,1.205,1.206,1.205],["h",5.625],["C",125.303,97.543,125.847,97,125.847,96.338],["z"],["M",137.899,189.553],["c",0,-0.662,-0.542,-1.205,-1.206,-1.205],["h",-5.622],["c",-0.664,0,-1.209,0.543,-1.209,1.205],["s",0.545,1.206,1.209,1.206],["h",5.622],["C",137.357,190.759,137.899,190.215,137.899,189.553],["z"],["M",166.89,169.864],["c",0,0.666,0.541,1.207,1.205,1.207],["s",1.203,-0.541,1.203,-1.207],["v",-5.624],["c",0,-0.662,-0.539,-1.205,-1.203,-1.205],["s",-1.205,0.543,-1.205,1.205],["V",169.864],["z"],["M",166.89,181.92],["c",0,0.664,0.541,1.205,1.205,1.205],["s",1.203,-0.541,1.203,-1.205],["v",-5.626],["c",0,-0.662,-0.539,-1.205,-1.203,-1.205],["s",-1.205,0.543,-1.205,1.205],["V",181.92],["z"],["M",164.644,189.553],["c",0,0.668,0.541,1.206,1.207,1.206],["h",0.636],["c",1.5,0,2.812,-1.314,2.812,-2.813],["v",-0.638],["c",0,-0.666,-0.537,-1.205,-1.203,-1.205],["s",-1.205,0.539,-1.205,1.205],["v",0.638],["c",0,0.176,-0.225,0.401,-0.403,0.401],["h",-0.636],["C",165.185,188.348,164.644,188.888,164.644,189.553],["z"],["M",153.972,189.553],["c",0,0.662,0.542,1.206,1.206,1.206],["h",5.623],["c",0.664,0,1.209,-0.544,1.209,-1.206],["s",-0.545,-1.205,-1.209,-1.205],["h",-5.623],["C",154.514,188.348,153.972,188.891,153.972,189.553],["z"],["M",148.747,188.348],["h",-5.625],["c",-0.664,0,-1.204,0.543,-1.204,1.205],["s",0.54,1.206,1.204,1.206],["h",5.625],["c",0.664,0,1.207,-0.544,1.207,-1.206],["S",149.411,188.348,148.747,188.348],["z"]],"pathOffset":{"x":100.0005,"y":134.64249999999998}},{"type":"path","originX":"left","originY":"top","left":35.94,"top":0,"width":85.38,"height":81.74,"fill":"#5E889E","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",69.047,52.989],["l",3.487,2.688],["c",-0.768,0.736,-2.248,1.99,-3.32,4.489],["c",-0.024,0.056,-0.037,0.102,-0.058,0.156],["l",-4.814,3.814],["c",-0.104,-0.957,-0.047,-1.997,0.189,-3.106],["l",-1.764,-0.755],["c",-0.391,-0.168,-0.72,-0.485,-0.888,-0.911],["c",-0.172,-0.427,-0.151,-0.883,0.014,-1.275],["l",0.144,-0.336],["c",0.17,-0.393,0.487,-0.72,0.916,-0.892],["c",0.424,-0.172,0.881,-0.152,1.274,0.016],["l",1.521,0.655],["C",66.844,55.249,68.001,53.896,69.047,52.989],["z"],["M",120.363,18.506],["L",78.543,0.58],["c",-3.632,-1.559,-7.877,0.14,-9.437,3.77],["l",-33.17,77.389],["h",4.557],["l",28.424,-66.306],["L",72.961,6],["c",0.652,-1.517,2.413,-2.221,3.93,-1.569],["l",9.414,4.033],["l",31.352,13.443],["l",3.655,-2.896],["C",121.012,18.823,120.698,18.648,120.363,18.506],["z"],["M",108.68,20.023],["c",0.003,-0.005,0.003,-0.008,0.003,-0.01],["l",-23.2,-9.944],["c",-3.038,5.1,-9.146,7.542,-14.867,5.964],["L",42.622,81.336],["L",57.201,69.79],["c",-2.297,-4.529,-2.733,-9.624,-0.771,-14.205],["c",3.914,-9.133,15.896,-12.761,26.762,-8.104],["c",0.466,0.2,0.92,0.417,1.368,0.641],["l",24.656,-19.529],["C",108.119,25.938,107.875,22.932,108.68,20.023],["z"]],"pathOffset":{"x":78.62400000000001,"y":40.869923855659486}}]}]';
        var objs = JSON.parse(obj.replace(/\n/g, "\\n"));
        objs = [].concat(objs);
        objs.forEach(function(o, i) {
            if (o.type == "i-text" && (o.id == "helperText" || o.text.indexOf("Helper") > -1)) {
                objs.splice(i, 1);
            }
        });

        o = {
            objects: objs,
            background: ""
        };
        that.$canvas.loadFromJSON(o, function() {
            var vlen = 0;
            if (that.$canvas._objects[0] && that.$canvas._objects[0].type == "group") {
                var gr = that.$canvas._objects[0];
            } else {
                var gr = new fabric.Group().set({
                    originX: "center",
                    originY: "center",
                    hasBorder: 0
                });
            }
            var vlen = 0;
            while (that.$canvas._objects[vlen]) {
                if (that.$canvas._objects[vlen].type != "group") {
                    gr.addWithUpdate(that.$canvas._objects[vlen]);
                }
                if (that.$canvas._objects[vlen].type == "group") {
                    that.$canvas._objects[vlen].forEachObject(function(o, i) {
                        if (o.type == "path-group") {
                            o.fill = o.paths[0].fill;
                        }
                    });
                    if (vlen > 0) {
                        gr.addWithUpdate(that.$canvas._objects[vlen]);
                    }
                }
                vlen++;
            }
            gr.forEachObject(function(obj) {
                obj.hasBorders = 0;
            });
            gr.forEachObject(function(obj) {
                obj.hasBorders = 0;
            });
            that.$canvas.clear();
            that.$canvas.add(gr);

            that.$canvas.forEachObject(function(obj) {
                that.$canvas.add(obj);
                obj.center().setCoords();
            });
        });
        //that.$canvas.renderAll();
    }
    canvaApp.prototype.pmatrix2= function (s1, s2) {
        var sep;
        if (s1.indexOf(",") == -1) {
            sep = " ";
        } else {
            sep = ",";
        }
        var l = s1.length;
        var s1 = s1.substring(7, s1.length - 1);
        s1 = s1.split(sep);
        var s2 = s2.substring(7, s2.length - 1);
        if (s2.indexOf(",") == -1) {
            sep = " ";
        } else {
            sep = ",";
        }
        s2 = s2.split(sep);
        return "matrix(" + (s1[0] * s2[0] + s1[2] * s2[1]) + "," + (s1[1] * s2[0] + s1[3] * s2[1]) + "," + (s1[0] * s2[2] + s1[2] * s2[3]) + "," + (s1[1] * s2[2] + s1[3] * s2[3]) + "," + (s1[0] * s2[4] + s1[2] * s2[5] + s1[4] * 1) + "," + (s1[1] * s2[4] + s1[3] * s2[5] + s1[5] * 1) + ")";
    }
    */

});
