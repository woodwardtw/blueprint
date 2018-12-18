jsPlumb.ready(function() {
  removeMasthead()
  jsPlumb.setContainer(document.getElementById("diagramContainer"));

  var common = {
    isSource: true,
    isTarget: true,
    connectorStyle:{
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2,
        },
    connectorHoverStyle:{ strokeWidth:5 },
    connector: ["Flowchart", { stub: [5, 5], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
    endpointStyle:{ fill:"rgba(33,133,12,.3)"},
    maxConnections: -1, 
  }; 

  let i = 0
  let nodes = [];//get the nodes
  let connections = []//get the connections

  if (jQuery('#json-data').val()){
    let nodesGraphJson = jQuery('#json-data').val()//get any current data
    let nodesGraph = JSON.parse(nodesGraphJson)//parse it
    nodes = nodesGraph.points;//get the nodes
    connections = nodesGraph.connections//get the connections
    let data = {}

      
      jQuery.each(nodes, function(index, elem) {
        addNode(elem.id, elem.text)
        jQuery("#" + elem.id + "_txt").html(elem.text).addClass('item')   

        placeInCorner(elem.id, elem.positionX, elem.positionY)
        i = parseInt(elem.id.substr(4)) + 1
        console.log(elem)
        data[elem.id] = {
          id: elem.id,
          positionX: elem.positionX,
          positionY: elem.positionY,
          text: elem.text
        }
        expandContainer(elem.positionX) //make sure it all fits in the space
       jsPlumb.repaintEverything()
      })

  jQuery.each(connections, function(index, elem) { 
     addConnection (elem)
     jsPlumb.repaintEverything()
  })
} 

function addNode(id, text) {
      // Adds node to container div
      var newNode = jQuery('<div>').attr('id', id).addClass('item')
      jQuery('#diagramContainer').append(newNode)
       jsPlumb.draggable(jQuery(".item"), {
          grid: [10,10],
          containment:false,
          drag: function (event){  
             modifyLocation (nodes, id, event.pos[0], event.pos[1])
          }
        });//sets the grid drag params  
      // Add an inner div which can be used as a target/source
      var attachedText = '<div class="kill"></div><div class="edit"><i class="fa fa-pencil" aria-hidden="true"></i></div><div class="description">' + text + '</div>';
      jQuery(newNode).append(attachedText)
      i++     
  jsPlumb.addEndpoint(     
      jQuery(".item"),
        {
          anchors: ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]
        },
        common
    );
    }
   

function addConnection (elem){
        jsPlumb.connect({
          source: elem.source,
          target: elem.target,        
          connector: ["Flowchart", { stub: [5, 5], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
          endpointStyle:{ fill:"rgba(33,133,12,.3)"},
          paintStyle:{
              strokeWidth: 2,
              stroke: "#61B7CF",
              joinstyle: "round",
              outlineStroke: "white",
              outlineWidth: 2,
          },
          hoverPaintStyle:{ strokeWidth:5 },
        })  
}    

//DELETE CONNECTION
  jsPlumb.bind("click", function (conn, originalEvent) {
           if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
            jsPlumb.deleteConnection(conn);
            jsPlumb.repaintEverything()
           console.log(newData = removeSingleConnection(conn.sourceId, conn.targetId, connections))

    let newNodes =  JSON.stringify(nodes)
    let newConnections = JSON.stringify(newData)
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
      document.getElementById('json-data').value = newValue //writes it to the json-data div

        });

//ADD CONNECTION JSON 
// jsPlumb.bind("connection", function(elem) { 
//     console.log(connections)
//     console.log(connections.length)
//     let newNodes =  JSON.stringify(nodes) 
//     //connections = checkConnectDuplicates(elem.source.id, elem.target.id, connections)  

//     connections.push({"source": elem.source.id,"target": elem.target.id})    
//     let newConnections = JSON.stringify(connections)
//     let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
//     document.getElementById('json-data').value = newValue //writes it to the json-data div
// });

//ADD CONNECTION JSON 
jsPlumb.bind('connectionDragStop', function (elem) {
  if (elem.target != null) {
    console.log(connections)
    console.log(connections.length)
    let newNodes =  JSON.stringify(nodes) 
    //connections = checkConnectDuplicates(elem.source.id, elem.target.id, connections)  

    connections.push({"source": elem.source.id,"target": elem.target.id})    
    let newConnections = JSON.stringify(connections)
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
    document.getElementById('json-data').value = newValue //writes it to the json-data div
  }
})

 
  //DELETE ITEM
  jsPlumb.on(document,"click", ".kill", function(){
    if (confirm("Delete this item?"))
        node = jQuery(this).parent().prop("id")
        jsPlumb.remove(jQuery(this).parent())
        jsPlumb.repaintEverything()
      
      var newData = nodes.filter(function(object) {
        return object.id !== node;
      }) 

    let newNodes =  JSON.stringify(newData)
    let newConnections = JSON.stringify(removeAnyConnection(node,connections))
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
      document.getElementById('json-data').value = newValue //writes it to the json-data div
  });

   //EDIT ITEM
  jsPlumb.on(document,"click", ".edit", function(){
    if(jQuery(this).siblings('.description').html()){
      console.log(jQuery(this).siblings('.description').html())
      var exist = jQuery(this).siblings('.description').html()
    } else {
      var exist = ''
    }
    //jQuery('#bodyText').val(exist) +++++++++++
    if(typeof(tinyMCE) != "undefined"){
      tinyMCE.activeEditor.setContent(exist);
      tinyMCE.activeEditor.getContent({format : 'raw'});
    } 
    jQuery('.editOverlay').css('height','100%')
    document.getElementById('bodyText').dataset.node = jQuery(this).parent()[0].id
    jsPlumb.repaintEverything()
  });

  //MAKE ITEM
  jsPlumb.addEndpoint(
    jQuery(".item"),
    common
  );
  jsPlumb.on(document, "click", "#make", function() {
    var item = '<div class="item" id="node'+i+'"><div class="kill"></div><div class="edit" alt-text="edit"><i class="fa fa-pencil" aria-hidden="true"></i></div><div class="description"></div></div>';
    jQuery('#diagramContainer').prepend(item);
    nodes.push({"id": "node"+i,"positionX": 50,"positionY": 50,"text":""});
    let newNodes =  JSON.stringify(nodes)
    let newConnections = JSON.stringify(connections)
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
    document.getElementById('json-data').value = newValue //writes it to the json-data div
    i++
    jsPlumb.addEndpoint(
     
    jQuery(".item"),
      {
        anchors: ["TopCenter", "BottomCenter", "LeftMiddle", "RightMiddle"]
      },
      common
  );
    jsPlumb.draggable(jQuery(".item"), {
      grid: [10,10],
      containment:false,
      drag: function (event){    
        modifyLocation (nodes, event.el.id, event.pos[0], event.pos[1]) 
      }
    });//sets the grid drag params    
  });
     
function modifyLocation (nodes, node, x, y){
  jQuery.each(nodes, function(index, elem) {
      if (node == elem.id){        
        elem.positionX = x
        elem.positionY = y
        expandContainer(x)
      }
    let newNodes =  JSON.stringify(nodes)
    let newConnections = JSON.stringify(connections)
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
      document.getElementById('json-data').value = newValue //writes it to the json-data div
    })
}


//make sure container is big enough 
function expandContainer(x){
  let screenX = screen.width
  x = 300+x
  if (x > screenX && document.getElementById('diagramContainer')) {
    document.getElementById('diagramContainer').style.width = x+'px'
  }
}

//modify description text on edit
function modifyTextJson(nodes, node, desc){
    jQuery.each(nodes, function(index, elem) {
      if (node == elem.id){
        elem.text = desc        
      }
    let newNodes =  JSON.stringify(nodes)
    let newConnections = JSON.stringify(connections)
    let newValue = '{"points":' + newNodes+ ',"connections":' + newConnections +'}' 
      document.getElementById('json-data').value = newValue //writes it to the json-data div
    })
}


function discardButton(){
      jQuery('.editOverlay').css('height','0')
      //jQuery('#bodyText').val('')
}

document.getElementById("discardButton").addEventListener("click", function(){
    discardButton();
    //jQuery('#bodyText').val('')
    jsPlumb.repaintEverything()
});

document.getElementById("submitContent").addEventListener("click", function(){
  //let words = jQuery('#bodyText').val()
    let words = tinyMCE.activeEditor.getContent({format : 'raw'});
    let node = document.getElementById('bodyText').getAttribute('data-node')
    document.getElementById(node).getElementsByClassName('description')[0].innerHTML = words
  modifyTextJson(nodes, node, words)
  jQuery('.editOverlay').css('height','0')
       jsPlumb.repaintEverything()
});

function placeInCorner(id, posX, posY) {
    // Repositions a div/element (used when loading node graph)
    jQuery('#' + id).css('left', posX)
    jQuery('#' + id).css('top', posY)
  }

});

function saveItems(){
  let items = document.getElementsByClassName('item')
  return items
}


jQuery(document).ready(function(jQuery) {
    jQuery('button#save').click(function saveItems(){
       var postID = document.getElementById('jsplumb-id').innerHTML
       var jsonData = jQuery('#json-data').val()
        var data = { action: 'update_jsplumb', postID: postID, jsonData: jsonData }

        jQuery.post(ajaxurl, data, function(response) {
            //alert('Got this from the server: ' + response);  // Uncomment to use for testing
        });
    });
});
//+++++++++++++++++++++++++tinyMCE.activeEditor.getContent({format : 'raw'});

//WRITE SOMETHING TO COMPARE OLD VS NEW JSON
// window.addEventListener('beforeunload', function (e) {
//   // Cancel the event as stated by the standard.
//   e.preventDefault();
//   // Chrome requires returnValue to be set.
//   e.returnValue = '';
// });



function checkConnectDuplicates(newSource, newTarget, connections){ 
 var cleanConnections = []
 if (connections.length > 0){
    for (var key in connections){
        if (connections[key].source == newSource && connections[key].target == newTarget) {
         console.log('match ' + newSource + ' ' + newTarget)
      } else {
         cleanConnections.push({"source": newSource,"target": newTarget})   
      }
    }
  }  if (connections.length === 0) {
      cleanConnections.push({"source": newSource,"target": newTarget})   
  }

  return cleanConnections
}

function removeDuplicateUsingFilter(arr){
    let unique_array = arr.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });
    return unique_array
}



//CLEAN FUNCTIONS

function removeSingleConnection(source, target, connections){
    for(var i = 0; i < connections.length; i++)
    {
        if(connections[i].source == source && connections[i].target == target) {
            connections.splice( i, 1 ) 
            console.log(connections)
            return connections //goal is to remove only one 
        }
    }
}


function removeAnyConnection(id, connections){  
    for(var i = 0; i < connections.length; i++)
    {
        if(connections[i].source == id || connections[i].target == id) {
            connections.splice( i, 1 ) 
            console.log(connections)           
        }
    }
    return connections //goal is to remove only one 
}

function removeMasthead(){
  if (document.getElementById('masthead')){
    document.getElementById('masthead').style.display = 'none';
  }
}