
var video_types = ['youtube', 'camideo', 'vimeo', 'aol', 'hulu', 'dailymotion'];
var video_colors = ['#1b1b1b', '#418cc5', '#FFFFFF', '#304699', '#90c434', '#06357d'];
var page_width = jQuery(window).width();
var page_height = jQuery(window).height();

var cache;

function search(query) {
    jQuery.ajax({
                type: 'GET',
                url: 'http://vidi.livmobile.tv/api/',
                data: { query : query },
                dataType: 'JSON',
                success: function(data) {
                cache = data;
                parse();
                },
                error: function(data) {
                alert(JSON.stringify(data));
                }
                });
}

function parse() {
    var temp = function() {
        var size_height = Math.floor(page_width / 3.8);
        var size_width = page_width / 2;
        var featured_height = (page_height - (size_height * 4));
        
        var menu_button = jQuery(document.createElement('div'));
        menu_button.attr({ 'class':'menu-button' });
        jQuery('#content').append(menu_button);
        menu_button.bind('click', function() { menu(); });
        
        var featured = jQuery(document.createElement('div'));
        featured.attr({ 'class':'featured' });
        featured.css({ 'height':featured_height+ 'px', 'background-image':'url('+cache[video_types[0]][0]['thumbnail']+')' });
        jQuery('#content').append(featured);
        
        for(var i = 0; i < video_types.length; ++i) {
            if(!cache[video_types[i]]) {
                continue;
            }
            var container = jQuery(document.createElement('div'));
            container.attr({ 'class':'main-box', 'name':video_types[i] });
            container.css({ 'height':size_height + 'px', 'width':size_width + 'px' });
            
            var img = jQuery(document.createElement('img'));
            img.attr({ 'class':'main-img', 'src':cache[video_types[i]][0]['thumbnail'] });
            
            var color_div = jQuery(document.createElement('div'));
            color_div.attr({ 'class':'main-color ' + video_types[i] });
            
            var text_div = jQuery(document.createElement('div'));
            text_div.attr({ 'class':'main-text' });
            text_div.css({ 'line-height':size_height + 'px' });
            text_div.html(video_types[i]);
            
            container.append(img, color_div, text_div);
            jQuery('#content').append(container);
            
            container.bind('click', function() { page(jQuery(this).attr('name')); });
            
        }
    };
    transition(temp);
}

function page(name) {
    var temp = function() {
        
        var header = jQuery(document.createElement('div'));
        header.attr({ 'class':'header' });
        var back = jQuery(document.createElement('div'));
        back.attr({ 'class':'back-button' });
        back.bind('click', function() { parse(); });
        back.html('Back');
        header.append(back);
        jQuery('#content').append(header);
        
        var videos = cache[name];
        for(var i = 0; i < videos.length; ++i) {
            var container = jQuery(document.createElement('div'));
            container.attr({ 'class':'video-box', 'url':videos[i]['url'] });
            
            var imgc = jQuery(document.createElement('div'));
            imgc.attr({ 'class':'video-img-container' });
            var img = jQuery(document.createElement('img'));
            img.attr({ 'class':'video-img', 'src':videos[i]['thumbnail'] });
            
            imgc.append(img);
            
            var title = jQuery(document.createElement('div'));
            title.attr({ 'class':'video-text' });
            title.html(createCutTitle(videos[i]['title'], 20));
            
            container.append(imgc, title);
            
            jQuery('#content').append(container);
            
            container.bind('click', function() { video(name, jQuery(this).attr('url')); });
        }
    };
    transition(temp);
}

function video(name, url) {
    var temp = function() {
        var header = jQuery(document.createElement('div'));
        header.attr({ 'class':'header' });
        var back = jQuery(document.createElement('div'));
        back.attr({ 'class':'back-button' });
        back.bind('click', function() { page(name); });
        back.html('Back');
        header.append(back);
        jQuery('#content').append(header);
        
        if(name == 'vimeo') {
            var parts = url.split('/');
            var videoID = parts[parts.length - 1];
            var iframe = jQuery(document.createElement('iframe'));
            iframe.attr({ 'src':'http://player.vimeo.com/video/' + videoID });
            iframe.css({ 'width':'100%', 'border':'none' });
            jQuery('#content').append(iframe);
        } else if(name == 'aol') {
            alert('Doesn\'t work yet but in progress.');
        } else {
            var divTemp = jQuery(document.createElement('div'));
            divTemp.oembed(url, { maxWidth: jQuery(window).width(), maxHeight: jQuery(window).height() - 100, autoplay: false });
            jQuery('#content').append(divTemp);
        }
        
    };
    transition(temp);
}

function menu() {
    var temp = function() {
        
        var header = jQuery(document.createElement('div'));
        header.attr({ 'class':'header' });
        var back = jQuery(document.createElement('div'));
        back.attr({ 'class':'back-button' });
        back.bind('click', function() { parse(); });
        back.html('Back');
        header.append(back);
        jQuery('#content').append(header);
        
        var div = jQuery(document.createElement('div'));
        div.attr({ 'class':'menu-box' });
        
        var search_input = jQuery(document.createElement('input'));
        search_input.attr({ 'class':'search-input', 'id':'search-input', 'placeholder':'e.g. News' });
        
        var search_button = jQuery(document.createElement('div'));
        search_button.attr({ 'class':'search-button' });
        search_button.html('Search');
        search_button.bind('click', function() { search(jQuery('#search-input').val()); });
        
        div.append(search_input, search_button);
        
        jQuery('#content').append(div);
    };
    transition(temp);
}

function transition(callback) {
    jQuery('#content').css({ 'opacity':'0' });
    jQuery('#content').bind('webkitTransitionEnd', function() {
                            jQuery('#content').html('');
                            callback();
                            jQuery('#content').css({ 'opacity':'1' });
                            jQuery('#content').unbind('webkitTransitionEnd');
                            });
}

function createCutTitle(title, length) {
    var newtitle = '';
    for(var i = 0; i < length; ++i) {
        newtitle += title.charAt(i);
    }
    if(length > title.length) {
        return newtitle;
    }
    return newtitle + '...';
}