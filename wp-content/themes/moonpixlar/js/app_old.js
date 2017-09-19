var canvas;
var imageObj = new Image();
var textarea = null;
var selectedFont = null;
var selectedColor = '#ffff00';
var imageWidth,imageHeight;


window.addEventListener('load', function onLoad() {
	canvas = new fabric.Canvas('canvas');
	var input = document.getElementById("imgUpload"), 
		formdata = false;
	function showUploadedItem (source) {
  		var list = document.getElementById("image-list"),
	  		li   = document.createElement("li"),
	  		img  = document.createElement("img");
  		img.src = source;
  		li.appendChild(img);
		list.appendChild(li);
	}   
	if (window.FormData) {
  		formdata = new FormData();
  		$('#imgUpload').removeClass('hidden');
  		document.getElementById("btn").style.display = "none";
	}
 	input.addEventListener("change", function (evt) {
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
				url: "upload.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function (res) {
					fabric.Image.fromURL('uploadedImages/'+res, function(oImg) {
					  	canvas.add(oImg);
					});
				}
			});
		}
	}, false);
	$(document).on('click', '#invitations .thumbnail img', function(){
		canvas.clear();
		$.ajax({
			type:'POST',
			url:'templates/'+$(this).parent().attr('data-json'),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			cache: false
		}).done(function(result) {
			displayCanvasContent(result)
		});
	});
	$(document).on('click', '#myfiles .thumbnail img', function(e){
		fabric.Image.fromURL($(this).attr('src'), function(oImg) {
		  	canvas.add(oImg);
		});
	});

	$(document).on('click','#saveBtn', function(){
		//canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });
		var activeObject = canvas.getActiveObject();
		if(activeObject){
			activeObject.hasBorders = activeObject.hasControls = false; 
		}
		$('#textSettings').addClass('hidden');
		canvas.renderAll();
		var theImage = document.getElementById("canvas").toDataURL('image/png');
		setTimeout(function(){ 
			$.ajax({
				type: "POST",
				url: "saveimage.php",
				data: { 
					imgBase64: theImage
				}
			}).done(function(o) {
				console.log('saved'); 
			});
		}, 3000);
	})

	$(document).on('click','#addTextBtn', function(){
		var textObj = new Object();
		textObj.text = "Enter Your Text";
		textObj.left = 50;
		textObj.top = 50;
		console.log(" .....      "+selectedColor);
		textObj.color = selectedColor;
		if(selectedFont==null){
			selectedFont = "Arial";
		}
		textObj.fontFamily = selectedFont;
		textObj.fontSize = 40;
		textObj.fontWeight = 'normal';
		textObj.halign = 'left'; 
		addTextOnCanvas(textObj)
	});
	$(document).on('click','#textSettings button#remove',function(e){
		removeSelectedObject();
		$('#textSettings').addClass('hidden');
	});
	$(document).on('click','#textSettings button#copy',function(e){
		var o = fabric.util.object.clone(canvas.getActiveObject());
	    o.set("top", o.top+5);
	    o.set("left", o.left+5);
		canvas.add(o);
		$('#textSettings').addClass('hidden');
	});
	$(document).on('change','#opacityControl',function(e){
		setActiveStyle('opacity',parseInt(e.target.value, 10) / 100)
	})
	$(document).on('change','#colorControl',function(e){
		selectedColor = e.target.value;
		console.log(selectedColor);
		setActiveStyle('fill',e.target.value)
	})
	$(document).on('change','#fSizeControl',function(e){
		setActiveStyle('fontSize',e.target.value)
	})
	$(document).on('change','#font-family',function(e){
		selectedFont =  e.target.value;
		WebFont.load({
			google: {
				families: [e.target.value]
			},
			active: function() {
		        setActiveStyle('fontFamily',e.target.value)
			},
		});
	})
	$(document).on('click','.text-alignment .align ',function(e){
		e.preventDefault();
		$('.align').removeClass('active');
		$(this).addClass('active');
		setActiveStyle('originX',$(this).attr('data-align'))
	})
	$(document).on('click','.text-styling .formating ',function(e){
		e.preventDefault();
		$(this).removeClass('active');
		switch($(this).attr('data-style')){
			case 'italic':

				$(this).addClass(getActiveStyle('fontStyle') === 'italic' ? '' : 'active');
				setActiveStyle('fontStyle',getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');

			break;
			case 'bold':
				$(this).addClass(getActiveStyle('fontWeight') === 'bold' ? '' : 'active');
				setActiveStyle('fontWeight', getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
			break;
			case 'underline':
				$(this).addClass(getActiveStyle('textDecoration') === 'underline' ? '' : 'active');
    			setActiveStyle('textDecoration', getActiveStyle('textDecoration') === 'underline' ? '' : 'underline');
			break;
		}
	})
	$(document).on('click','#saveDesignBtn',function(e){
		console.log(JSON.stringify(canvas));
		$.ajax({
	        type : "POST",
	        url : "savedesign.php",
	        dataType : 'json',
	        data : {
	            json : JSON.stringify(canvas)
	        }
	    });
	})
	$(document).on('click','#loadDesignBtn',function(e){
		var jsonUrl = "userDesigns/design1.json";
		$.getJSON( jsonUrl, {
			format: "json"
		})
		.done(function( data ) {
			var fArray = [];
			$.each( data.objects, function( key, value ) {
				if(typeof(value.fontFamily)  != "undefined"){
					fArray.push(value.fontFamily)
					WebFont.load({
						google: {
							families: [value.fontFamily]
						},
						active: function() {
					        
						},
					});
				}
			});
			
			
			setTimeout(function(){ 
				canvas.loadFromJSON(JSON.stringify(data), function(){
			      canvas.renderAll();
			    });
			}, 3000);
			/*canvas.loadFromJSON(JSON.stringify(data), function(){
		      canvas.renderAll();
		    });*/
		});
	})
	canvas.on('mouse:up', function(options) {
		//console.log(options.e.clientX, options.e.clientY,options.target, options.e);
		if (options.target) {
			if(options.target.type=='i-text'){
				$('#textSettings').removeClass('hidden')
				$('#textSettings').css('left',options.target.left + options.target.width + 10);
				$('#textSettings').css('top',options.target.top);

				console.log(getActiveStyle('originX'));
				$('#font-family').val(getActiveStyle('fontFamily'))
				$('#colorControl').val(getActiveStyle('fill'))
				$('#fSizeControl').val(getActiveStyle('fontSize'))
				$('#opacityControl').val(getActiveStyle('opacity') * 100);
				$('.formating.bold, .formating.italic, .formating.underline').removeClass('active')
				$('.formating.bold').addClass(getActiveStyle('fontWeight') === 'bold' ? 'active' : '');
				$('.formating.italic').addClass(getActiveStyle('fontStyle') === 'italic' ? 'active' : '');
				$('.formating.underline').addClass(getActiveStyle('textDecoration') === 'underline' ? 'active' : '');
				$('.align').removeClass('active');
				$('.align[data-align="'+getActiveStyle('originX')+'"]').addClass('active');

			}else{
				$('#textSettings').addClass('hidden')
			}
		}
	});
	canvas.on('mouse:down', function(options) {
		//console.log(options.e.clientX, options.e.clientY,options.target, options.e);
		$('#textSettings').addClass('hidden')
	});
	window.onkeydown = function(event){
		console.log(event.which);
		var obj = canvas.getActiveObject();
		var leftPos = obj.getLeft();
		var topPos = obj.getTop();
		$('#textSettings').addClass('hidden')
		switch(event.which){
			case 37:
				obj.setLeft(parseInt(leftPos) - 5).setCoords();
			break;
			case 38:
				obj.setTop(parseInt(topPos) + 5).setCoords();
			break;
			case 39:
				obj.setLeft(parseInt(leftPos) + 5).setCoords();
			break;
			case 40:
				obj.setTop(parseInt(topPos) - 5).setCoords();
			break;
			case 46:
				removeSelectedObject();
			break;
		}
    	canvas.renderAll();
	}
	function displayCanvasContent(result){
		fabric.Image.fromURL(result['image'], function(oImg) {
		  	canvas.add(oImg);
		  	oImg.selectable = false;
		  	oImg.scaleToWidth(500);
		  	for(var i in result['texts']){
				addTextOnCanvas(result['texts'][i])
			}
		});
	}
	function addTextOnCanvas(textObj){
		WebFont.load({
			google: {
				families: [textObj.fontFamily]
			},
			active: function() {
		        var textSample = new fabric.IText(textObj.text, {
					left: textObj.left,
					top: textObj.top,
					fontFamily: textObj.fontFamily,
					fill: textObj.color,
					fontSize: textObj.fontSize,
					fontWeight: textObj.fontWeight,
					originX: textObj.halign,
					hasRotatingPoint: true,
					centerTransform: true
			    });
			    canvas.add(textSample);
				canvas.renderAll();
			},
		});
	}
});
function setActiveStyle(styleName, value, object) {
	object = object || canvas.getActiveObject();
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
	canvas.renderAll();
};
function getActiveStyle(styleName, object) {
  object = object || canvas.getActiveObject();
  if (!object) return '';

  return (object.getSelectionStyles && object.isEditing)
    ? (object.getSelectionStyles()[styleName] || '')
    : (object[styleName] || '');
};
function removeSelectedObject(){
	var activeObject = canvas.getActiveObject();
	canvas.remove(activeObject);
};
