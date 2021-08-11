<?php

function my_load_files_webinars()
{
    wp_enqueue_script('search_webinars_js', plugins_url('/js/customsearch.js', __FILE__), array('jquery'), time());
    wp_enqueue_style('search_webinars_style', plugins_url('/css/index.css', __FILE__), [], time());
    wp_localize_script('search_webinars_js', 'ajax_var', array(
        'url'    => rest_url('/api/search'),
        'nonce'  => wp_create_nonce('wp_rest')
    ));
	
	
}
add_action('wp_enqueue_scripts', 'my_load_files_webinars');
