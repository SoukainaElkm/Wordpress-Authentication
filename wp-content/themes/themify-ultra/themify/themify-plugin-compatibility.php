<?php
/**
 * Provide compatibility with third party plugins
 *
 * @package Themify
 */

defined( 'ABSPATH' ) || exit;

/**
 * Support for Nextgen gallery plugin #9340
 *
 * @since 5.0.9
 */
if (defined('NGG_PLUGIN') && themify_check('setting-cache-html',true) && !defined('NGG_DISABLE_RESOURCE_MANAGER')){
    define('NGG_DISABLE_RESOURCE_MANAGER', true);
}

/**
 * Support for Toolset
 *
 * @since 5.1.7
 */
if(function_exists('is_wpv_wp_archive_assigned') && function_exists('has_blocks')){
    add_filter('themify_deq_css','themify_toolset_block_style');
    function themify_toolset_block_style($css){
        if (($key = array_search('wp-block-library', $css)) !== false) {
            global $wp_query, $WPV_settings;
            $queried_term = $wp_query->get_queried_object();
            if(has_blocks($WPV_settings['view_taxonomy_loop_' . $queried_term->taxonomy]) ){
                unset($css[$key]);
            }
        }
        return $css;
    }
}