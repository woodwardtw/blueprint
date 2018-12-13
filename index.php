<?php
/**
 * Plugin Name: Blueprint
 * Plugin URI: 
 * Description: For making business blueprint graphic organizers
 * Version: .007	
 * Author: Tom Woodward
 * Author URI: http://bionicteaching.com
 * License: GPL2
 */
 
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

function blueprint_enqueue_scripts() {
    wp_register_style( 'blueprint-styles', plugins_url( '/css/blueprint.css', __FILE__ )  ); 
    wp_enqueue_style('blueprint-styles');
}
add_action( 'wp_enqueue_scripts', 'blueprint_enqueue_scripts' );




if(!function_exists('load_jsplumb')){
    function load_jsplumb() {
        global $post;
        $version= '1.0'; 
        $in_footer = true;
        wp_enqueue_script('jsplumb', '//cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.8.4/js/jsplumb.min.js', array('jquery'), $version, $in_footer);
        
    }
}
add_action('wp_enqueue_scripts', 'load_jsplumb');

    function load_blueprint() {
        global $post;
        $version= '1.0'; 
        $in_footer = true;
        wp_enqueue_script( 'blueprint-scripts', plugins_url('/js/blueprint.js', __FILE__),array('jsplumb'), $version, $in_footer );
    }
add_action('wp_enqueue_scripts', 'load_blueprint');


function addJsonContent($content){
	global $post;
	$id = $post->ID;
	$json = get_post_meta($id, 'json-data');
	if ($json){
		$div = '<textarea id="json-data">' . $json[0] . '</textarea>';
	} else {
		$div = '<textarea id="json-data"></textarea>';
	}
	return $content . $div;
}

add_filter('the_content', 'addJsonContent') ; 



//shortcode for HTML display
function jsPlumb_display( $atts ){
	return include( 'jsplumb-display.php' );
}
add_shortcode( 'blueprint', 'jsPlumb_display' );
