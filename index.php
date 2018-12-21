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
    global $post_type;
    if( 'blueprint' == $post_type ){
     wp_enqueue_style('blueprint-styles');
    }
}
add_action( 'wp_enqueue_scripts', 'blueprint_enqueue_scripts' );


if(!function_exists('load_jsplumb')){
    function load_jsplumb() {
        global $post;
          global $post_type;
        if( 'blueprint' == $post_type ){
            $version= '1.0'; 
            $in_footer = true;
            wp_enqueue_script('jsplumb', '//cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.8.4/js/jsplumb.min.js', array('jquery'), $version, $in_footer);
        }
        
    }
}
add_action('wp_enqueue_scripts', 'load_jsplumb');

    function load_blueprint() {
        global $post;
        $dep = array('jsplumb');
        $version = '1.0'; 
        $in_footer = true;        
        wp_enqueue_script( 'blueprint-scripts', plugins_url('/js/blueprint.js', __FILE__), $dep, $version, $in_footer );
    }
add_action('wp_enqueue_scripts', 'load_blueprint');


function addJsonContent(){
    global $post;
    $id = $post->ID;
    $json = get_post_meta($id, 'json-data');
    if ($json){
        $div = '<textarea id="json-data">' . $json[0] . '</textarea>';
    } else {
        $div = '<textarea id="json-data"></textarea>';
    }   
    return  $div;
}

add_filter('the_content', 'addJsonContent') ; 


//shortcode for HTML display
function jsPlumb_display( $atts ){
    return include( 'jsplumb-display.php' );
}
add_shortcode( 'blueprint', 'jsPlumb_display' );


add_action('wp_ajax_update_jsplumb', 'update_jsplumb_data_callback');
function update_jsplumb_data_callback() {
    $postID = $_POST['postID'];
    $jsonData = $_POST['jsonData'];
    $custom = get_post_custom($postID);
    // find the json data
    $data = intval($custom['json-data'][0]);
  
    if($data > 0 && current_user_can( 'edit_post', $postID )) {
        update_post_meta($postID, 'json-data', $jsonData);
    } else if (current_user_can( 'edit_post', $postID )){
        add_post_meta($postID, 'json-data', $jsonData, true);
    }
    update_post_meta($postID, 'json-data', $jsonData );    
    die(); // this is required to return a proper result
}


//Make blueptrint custom post type


// Register Custom Post Type blueprint
// Post Type Key: blueprint

function create_blueprint_cpt() {

  $labels = array(
    'name' => __( 'Blueprints', 'Post Type General Name', 'textdomain' ),
    'singular_name' => __( 'Blueprint', 'Post Type Singular Name', 'textdomain' ),
    'menu_name' => __( 'Blueprint', 'textdomain' ),
    'name_admin_bar' => __( 'Blueprint', 'textdomain' ),
    'archives' => __( 'Blueprint Archives', 'textdomain' ),
    'attributes' => __( 'Blueprint Attributes', 'textdomain' ),
    'parent_item_colon' => __( 'Blueprint:', 'textdomain' ),
    'all_items' => __( 'All Blueprints', 'textdomain' ),
    'add_new_item' => __( 'Add New Blueprint', 'textdomain' ),
    'add_new' => __( 'Add New', 'textdomain' ),
    'new_item' => __( 'New Blueprint', 'textdomain' ),
    'edit_item' => __( 'Edit Blueprint', 'textdomain' ),
    'update_item' => __( 'Update Blueprint', 'textdomain' ),
    'view_item' => __( 'View Blueprint', 'textdomain' ),
    'view_items' => __( 'View Blueprints', 'textdomain' ),
    'search_items' => __( 'Search Blueprints', 'textdomain' ),
    'not_found' => __( 'Not found', 'textdomain' ),
    'not_found_in_trash' => __( 'Not found in Trash', 'textdomain' ),
    'featured_image' => __( 'Featured Image', 'textdomain' ),
    'set_featured_image' => __( 'Set featured image', 'textdomain' ),
    'remove_featured_image' => __( 'Remove featured image', 'textdomain' ),
    'use_featured_image' => __( 'Use as featured image', 'textdomain' ),
    'insert_into_item' => __( 'Insert into blueprint', 'textdomain' ),
    'uploaded_to_this_item' => __( 'Uploaded to this blueprint', 'textdomain' ),
    'items_list' => __( 'Blueprint list', 'textdomain' ),
    'items_list_navigation' => __( 'Blueprint list navigation', 'textdomain' ),
    'filter_items_list' => __( 'Filter Blueprint list', 'textdomain' ),
  );
  $args = array(
    'label' => __( 'blueprint', 'textdomain' ),
    'description' => __( '', 'textdomain' ),
    'labels' => $labels,
    'menu_icon' => '',
    'supports' => array('title', 'editor', 'revisions', 'author', 'trackbacks', 'custom-fields', 'thumbnail',),
    'taxonomies' => array(),
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'menu_position' => 5,
    'show_in_admin_bar' => true,
    'show_in_nav_menus' => true,
    'can_export' => true,
    'has_archive' => true,
    'hierarchical' => false,
    'exclude_from_search' => false,
    'show_in_rest' => true,
    'publicly_queryable' => true,
    'capability_type' => 'post',
    'menu_icon' => 'dashicons-universal-access-alt',
  );
  register_post_type( 'blueprint', $args );
  
  // flush rewrite rules because we changed the permalink structure
  global $wp_rewrite;
  $wp_rewrite->flush_rules();
}
add_action( 'init', 'create_blueprint_cpt', 0 );


//load custom post type template
function load_blueprint_template($template) {
    global $post;

    if ($post->post_type == "blueprint" && $template !== locate_template(array("single-blueprint.php"))){
        /* This is a "movie" post 
         * AND a 'single movie template' is not found on 
         * theme or child theme directories, so load it 
         * from our plugin directory
         */
        return plugin_dir_path( __FILE__ ) . "single-blueprint.php";
    }

    return $template;
}

add_filter('single_template', 'load_blueprint_template');


add_filter( 'wp_default_editor', create_function('', 'return "tinymce";'));