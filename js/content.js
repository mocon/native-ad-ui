// For grabbing markup of hovered element
var markupHtml = null,
    element = null;

// Get estimated CSS path
function getCssPath(el){
  var childElement = el[0],
      elementAncestors = [],
      thisTag,
      childIndex = $(childElement).index() + 1; // Number for nth-child, if applicable
  
  // Child tag (target element)
  if (childElement.className && childElement.className !== 'gumgum-highlighted-element'){
    thisTag = $.trim(childElement.tagName.toLowerCase() + '.' + childElement.className.replace('gumgum-highlighted-element',''));
  } else {
    thisTag = childElement.tagName.toLowerCase();
  }
  if (childIndex > 1){
    thisTag = thisTag + ':nth-child(' + childIndex + ')';
  }
  
  // Find parent elements of child tag
  $(childElement).parents().not('html').each(function() {
    var entry = '';
    if (this.className){
      entry += '.' + this.className.replace(/ /g, '.');
      elementAncestors.push(entry);
    } else if (this.id){
      entry += '#' + this.id;
      elementAncestors.push(entry);
    }
  });
  elementAncestors.reverse();
  
  $('.selector-path').val(elementAncestors.join(' ') + ' ' + thisTag);
}

// Transform markup into Native ad
function transformMarkupToNativeAd(markup){
  var markupAsHtml = $.parseHTML(markup),
      modifiedMarkupString = '',
      nativeImage = {},
      origImage = $(markupAsHtml).children('img')[0],
      longestTextSoFar = -1,
      longestText,
      shortestTextSoFar = 10000,
      shortestText;
  
  // Set wrapper attributes
  markupAsHtml.id = '';
  $(markupAsHtml).css('cursor', 'pointer');
  $(markupAsHtml).attr('onclick','window.open("[link]","_blank");');
  
  // Get image dimensions and class names
  nativeImage.width = $(markupAsHtml).children('img')[0].naturalWidth;
  nativeImage.height = $(markupAsHtml).children('img')[0].naturalHeight;
  nativeImage.className = $(markupAsHtml).children('img')[0].className;
  
  $(markupAsHtml).children().each(function(){
    var text = $(this).text();
    // Title, automatically replaces the content of the child node with the fewest characters
    if (text && text.length < shortestTextSoFar){
      shortestTextSoFar = text.length;
      shortestText = this;
    }
    // Description, automatically replaces the content of the child node with the most characters
    if (text && text.length > longestTextSoFar){
      longestTextSoFar = text.length;
      longestText = this;
    }
  });
  
  // Replace title and description text
  $(shortestText).text('[title]');
  $(longestText).text('[desc]');
  
  // Replace image with custom markup for dynamic resizing
  $(origImage).replaceWith('<div id="GGUID-hidden-div"></div><div id="GGUID-wrapper" class="' + nativeImage.className + '"><img id="GGUID-variable-image" src="[img]"></div>');
  
  // Custom JS and CSS for image resizing
  $('<style>#GGUID-wrapper, #GGUID-wrapper img {margin: 0; padding: 0; vertical-align: top !important;}#GGUID-wrapper {transform-origin: top left; position: relative; display: block; overflow: hidden; background-size: cover; background-position: center center;}#GGUID-wrapper::after {content: ""; background: #fff; opacity: 0.6; top: 0; left: 0; bottom: 0; right: 0; position: absolute; z-index: -1;}#GGUID-variable-image {position: relative; border: none;}#GGUID-hidden-div {position: relative; width: 100%; opacity: 0;}@media (max-width: 1023px){#GGUID-hidden-div {width: 100%;}#GGUID-variable-image {max-width: 100% !important;}}</style><img id="imGGUID" src="//c.gumgum.com/images/pixel.gif?GGUID" style="display: none;" onload=\'(function adjustImages(e){var wrapper=document.getElementById("GGUID-wrapper"),image=document.getElementById("GGUID-variable-image"),hiddenDiv=document.getElementById("GGUID-hidden-div"),neededWidth=' + nativeImage.width + ',neededHeight=' + nativeImage.height + ',neededRatio=neededHeight/neededWidth,newImgRatio,scaleRatio,timer,new_img=new Image;new_img.onload=function(){var img_width=0,img_height=0;img_width=this.width,img_height=this.height,newImgRatio=img_height/img_width;if(newImgRatio<neededRatio){image.style.width=neededWidth+"px";image.style.height="auto";image.style.marginTop=(neededHeight-image.height)/2+"px";image.style.marginLeft=0+"px"}else{image.style.width="auto";image.style.height=neededHeight+"px";image.style.marginTop=0+"px";image.style.marginLeft=(neededWidth-image.width)/2+"px"}};new_img.src=image.src;wrapper.style.width=neededWidth+"px";wrapper.style.height=neededHeight+"px";wrapper.style.backgroundImage="url("+image.src+")";scaleRatio=hiddenDiv.clientWidth/neededWidth;wrapper.style.transform="scale("+scaleRatio+")";wrapper.style.marginBottom=-(neededHeight-neededHeight*scaleRatio)+"px";window.onresize=function(){clearTimeout(timer);timer=setTimeout(adjustImages(),500)};e.onload=false;return false})(this);\' />').appendTo($(markupAsHtml));
  
  modifiedMarkupString = $(markupAsHtml).prop('outerHTML').replace(/&quot;/g, "'");
  $('.modified-markup').val(modifiedMarkupString);
  injectPreviewAd();
}

// Inject preview ad
function injectPreviewAd(){
  
}

// Fired on clicking extension icon
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  // Add UI to the page
  function addUiToPage(){
    var topLevelElement = document.createElement('div'),
        closeButton = document.createElement('div'),
        pathLabel = document.createElement('label'),
        pathTextarea = document.createElement('textarea'),
        markupLabel = document.createElement('label'),
        markupTextarea = document.createElement('textarea'),
        newMarkupLabel = document.createElement('label'),
        newMarkupTextarea = document.createElement('textarea'),
        uiSideSwitcher = document.createElement('div'),
        style = document.createElement('link');
    
    // Top level element
    topLevelElement.setAttribute('id', 'gumgum-native-ui');
    topLevelElement.setAttribute('class', 'pinned-right');
    topLevelElement.innerText = 'Native Placement UI';
    
    // Close button
    closeButton.setAttribute('class', 'close-button');
    closeButton.onclick = function(){$('#gumgum-native-ui').remove();};
    topLevelElement.appendChild(closeButton);
    
    // Markup selector area
    markupLabel.innerText = 'Original publisher element markup (hover over an element and press Enter to copy its markup):';
    topLevelElement.appendChild(markupLabel);
    markupTextarea.setAttribute('placeholder', 'Hover over an element and press Enter to copy its markup');
    markupTextarea.setAttribute('class', 'original-markup');
    topLevelElement.appendChild(markupTextarea);
    
    // Path selector area
    pathLabel.innerText = 'Suggested CSS path:';
    topLevelElement.appendChild(pathLabel);
    pathTextarea.setAttribute('placeholder', 'Hover an element for the CSS selector path');
    pathTextarea.setAttribute('class', 'selector-path');
    topLevelElement.appendChild(pathTextarea);
    
    // Dynamically modified markup area
    newMarkupLabel.innerText = 'Native ad markup:';
    topLevelElement.appendChild(newMarkupLabel);
    newMarkupTextarea.setAttribute('placeholder', 'Generated Native ad markup');
    newMarkupTextarea.setAttribute('class', 'modified-markup');
    topLevelElement.appendChild(newMarkupTextarea);
    
    // Switch UI to other side of page
    uiSideSwitcher.setAttribute('class', 'side-switcher');
    uiSideSwitcher.innerText = '< Pin to left side';
    topLevelElement.appendChild(uiSideSwitcher);
    
    // Append native UI and stylesheet to page
    document.getElementsByTagName('body')[0].appendChild(topLevelElement);
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL('css/styles.css');
    (document.head || document.documentElement).appendChild(style);
  };
  if (!document.getElementById('gumgum-native-ui')){
    addUiToPage();
  }
  
  $('body').focus();
  
  // Switch left or right
  $('.side-switcher').on('click', function(){
    if ($('#gumgum-native-ui').hasClass('pinned-right')){
      $('#gumgum-native-ui').removeClass('pinned-right').addClass('pinned-left');
      $(this).text('Pin to right side >');
    } else {
      $('#gumgum-native-ui').addClass('pinned-right').addClass('pinned-left');
      $(this).text('< Pin to left side');
    }
  });
  
  // Highlight element on hover
  $('*').on('mouseover', function(e){
    // Prevent selection of parent elements
    e.stopPropagation();
    // Remove whitespace before and after HTML tags
    markupHtml = $(this).prop('outerHTML').replace(/\n/g, "").replace(/[\t ]+\</g, "<").replace(/\>[\t ]+\</g, "><").replace(/\>[\t ]+$/g, ">");
    element = $(this);
    $(this).addClass('gumgum-highlighted-element');
  });
  $('*').on('mouseout', function(){
    if ($(this).hasClass('gumgum-highlighted-element')){
      markupHtml = null;
      element = null;
      $(this).removeClass('gumgum-highlighted-element');
    }
  });
  
  // Select textarea on click
  $('textarea').on('focus, click', function(){
    $(this).select();
  });
  
});

// For grabbing markup - by hovering desired element and then pressing enter
$(document).keypress(function(e) {
  if (e.which == 13 && markupHtml && element) {
    $('.original-markup').text(markupHtml);
    transformMarkupToNativeAd(markupHtml);
    getCssPath(element);
  }
});
