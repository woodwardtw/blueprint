<?php
/**
 * The template for displaying all single blueprint posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package ThemeGrill
 * @subpackage Suffice
 * @since Suffice 1.0.0
 */

get_header(); ?>
</div>
</div>
<div id="the-blueprint">  
  <div class="top-menu">
    <button id="make">new item</button>
    <button id="save">save</button>
  </div>

  <div id="diagramContainer">
    <div class="bg-layer physical-layer"><h2 contenteditable="true">Physical<br>Evidence</h2></div>
    <div class="bg-layer customer-layer"><h2 contenteditable="true">Customer<br>Actions</h2></div>
    <div class="bg-layer front-layer"><h2 contenteditable="true">Front<br>Stage</h2></div>
    <div class="bg-layer back-layer"><h2 contenteditable="true">Back<br>Stage</h2></div>
    <div class="bg-layer support-layer"><h2 contenteditable="true">Support<br>Process</h2></div>
  </div>


  <div class="editOverlay">  	 
    <div id="textEditor">
        <!-- <textarea type="text" id="bodyText"></textarea><br>    -->
        <?php 
        if ( is_user_logged_in() && current_user_can( 'edit_post', $postID ) ) {
		            wp_editor('', 'bodyText'); 
		} else if (!current_user_can( 'edit_post', $postID )) {
			echo '<h2>This content is owned by another author.</h2>';
		}

		else {
			echo '<h2>Please log in</h2>';
		    wp_login_form();
		}


        ?>
        <div class="text-buttons">
          <button id="discardButton">Discard</button>   
          <button id="submitContent" type="submit" value="Submit">Submit</button>
        </div>     
    </div>
  </div>
</div>

<div id="jsplumb-id"><?php echo the_ID();?></div>
<?php echo addJsonContent();?>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
