<?php

/**
 * Plugin Name: Library Custom Search For Webinars.
 * Description: A plugin that provides a shortcode for searching library posts.
 * Plugin URI:  https://github.com/marin73tomas/visio_custom_search_wp_plugin
 * Author:      Espectro
 * Version:     0.0.1
 */

include(WP_PLUGIN_DIR . '/customsearch_webinars/parts/modify_wpquery.php');
include(WP_PLUGIN_DIR . '/customsearch_webinars/parts/init.php');
include(WP_PLUGIN_DIR . '/customsearch_webinars/parts/loadfiles.php');
include(WP_PLUGIN_DIR . '/customsearch_webinars/parts/shortcode.php');
