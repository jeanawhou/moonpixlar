var cardsConfig={card1:{name:"a68d1c214415c77ed829be3c43096fb9.jpg",font:'"Vast Shadow"',font_size:"40pt",default_text:"Pradeep",links:[[50,140,100,""]]}};window.onload=function(){var e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href="http://fonts.googleapis.com/css?family=Vast+Shadow",document.getElementsByTagName("head")[0].appendChild(e),window.onkeydown=function(e){32==e.keyCode&&"BODY"===e.target.nodeName.toUpperCase()&&e.preventDefault()},$(document).on("click","#saveBtn",function(){var e=document.getElementById("canvas").toDataURL("image/png");setTimeout(function(){$.ajax({type:"POST",url:"saveimage.php",data:{imgBase64:e}}).done(function(e){console.log("saved")})},3e3)}),$(document).on("click",".designs img.design",function(){var e=document.getElementById("canvas"),t=e.getContext("2d");t.canvas.height=1e3;var n=!1,a=new Image,i=null,s,r;a.onload=function(){function i(e){t.drawImage(a,0,0,s,r),C+=e,t.font=cardsConfig.card1.font_size+" "+cardsConfig.card1.font,t.fillStyle="white",d(t,C,u,m,70,y)}function o(){t.drawImage(a,0,0,s,r),C=C.substring(0,C.length-1),t.font=cardsConfig.card1.font_size+" "+cardsConfig.card1.font,t.fillStyle="white",d(t,C,u,m,70,y)}function d(e,t,n,a,i,s){var r=t.split("\n"),o="";a-=100;for(var d=0;d<r.length;d++){var c=o+r[d]+" ",f=e.measureText(c),l=f.width;e.fillText(o,n,a),o=r[d]+" ",a+=s}e.fillText(o,n,a)}function c(e){var t="abcdefghijklmnopqrstuvwxyz",n="ABCDEFGHIJKLMNOPQRSTUVWXYZ",a="0123456789",s="0!\"#$%&'()",r=e.keyCode,d=e.shiftKey;if(r>64&&91>r){if(d)var c=n.substring(r-64,r-65);else var c=t.substring(r-64,r-65);i(c)}else if(r>47&&58>r){if(d)var c=s.substring(r-47,r-48);else var c=a.substring(r-47,r-48);i(c)}else 8==r?o():32==r?i(" "):13==r&&i("\n")}function f(t){var a,i;(t.layerX||0==t.layerX)&&(a=t.layerX,i=t.layerY),a-=e.offsetLeft,i-=e.offsetTop,a>=u&&u+p>=a&&m>=i&&i>=m-v?(document.body.style.cursor="pointer",n=!0):(document.body.style.cursor="",n=!1)}function l(e){n&&(C="",t.drawImage(a,0,0,s,r),window.addEventListener("keyup",c,!0))}if(this.src.indexOf(cardsConfig.card1.name)>-1){t.drawImage(a,0,0,this.width/2,this.height/2),s=this.width/2,r=this.height/2;for(var g=0;g<cardsConfig.card1.links.length;g++){var h=cardsConfig.card1.default_text,u=cardsConfig.card1.links[g][0],m=cardsConfig.card1.links[g][1],v=cardsConfig.card1.links[g][2],p,w=parseInt(cardsConfig.card1.font_size.replace("pt",""))+2,y=parseInt(1.33*w);t.font=cardsConfig.card1.font_size+" "+cardsConfig.card1.font,t.fillStyle="white",t.fillText(h,u,m),p=t.measureText(h).width,e.addEventListener("mousemove",f,!1),e.addEventListener("click",l,!1)}}else t.drawImage(a,0,0,this.width/2,this.height/2),s=this.width/2,r=this.height/2,e.removeEventListener("keyup",c);var C=""};var o=$(this).attr("src");a.src=o})};