<?php
/**
 * JSPlumb display template.
 *
 * 
 *
 * @author 		Tom Woodward
 * @package 	
 * @version     1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Don't allow direct access

?><div id="the-blueprint">  
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
        <?php wp_editor('', 'bodyText'); ?>
        <div class="text-buttons">
          <button id="discardButton">Discard</button>   
          <button id="submitContent" type="submit" value="Submit">Submit</button>
        </div>     
    </div>
  </div>
</div>