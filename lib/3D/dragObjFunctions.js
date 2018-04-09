import React from 'react'
import * as ELEMENT from './index.js'
import * as MAKEOBJ from './makeObjFunctions.js'
import Mesh from './Mesh.js'
// import * as THREE from 'three'

var pickObject = function(objectClass,props,importPosition){
	if (!global.drag_i) {
		global.drag_i = 0
	}
	var obj = {
		objectClass,
		props:{key:global.drag_i,...props},
		importPosition:importPosition==true?true:false,
		type:'class'
	}
	global.drag_i++
	global.dragObject = obj
}
var pickObjectAsMesh = function(mesh,importPosition){
	if (!global.drag_i) {
		global.drag_i = 0
	}
	var obj = {
		mesh,
		type:'mesh',
		importPosition:importPosition==true?true:false
	}
	global.drag_i++
	global.dragObject = obj
}
var pickObjectByUrl = function(url,animation){
		$.ajax({  
            type:'get',  
            url:url,  
            dataType:'json',  
            success:function(data){
            	var getPromise = MAKEOBJ.makeMesh(data)
	            getPromise.then((value)=>{
	                var geometry = value.geometry
	                var material = value.material
	                var mesh = new THREE.Mesh(geometry,material)
	                mesh.rotation.set(data.rotation.x,data.rotation.y,data.rotation.z) 
	                if (data.scale) {
	                	mesh.scale.set(data.scale.x,data.scale.y,data.scale.z)
	                }
	                mesh.makeObjData = data
	                mesh.animation = animation
	                global.dragObject = mesh
	            })
            }  
        })  
}
var takeObjectAsElement = function(position){
	if (global.dragObject) {
		if (global.dragObject.type=='mesh') {
			var obj = global.dragObject
			if (obj.importPosition==true) {
				if (position) {
					var ele = React.createElement(Mesh,{
						position:{x:position.x,y:position.y,z:position.z},
						position_offset:obj.mesh.translation?obj.mesh.translation:{x:0,y:0,z:0},
						importMesh:obj.mesh,
						key:global.drag_i-1
					})
				}else{
					console.log('请传入position,function:takeObjectAsElement')
				}
			}else{
				var ele = React.createElement(Mesh,{importMesh:obj.mesh,key:global.drag_i})
			}
			return ele
		}
		var obj = global.dragObject
		if (obj.importPosition==true) {
			if (position) {
				var ele = React.createElement(obj.objectClass,{
					position:{x:position.x,y:position.y,z:position.z},
					...obj.props
				})
			}else{
				console.log('请传入position,function:takeObjectAsElement')
			}
		}else{
			var ele = React.createElement(obj.objectClass,obj.props)
		}
		return ele
	}else{
		return null
	}
}
var if_dragging = function(){
	if (global.dragObject) {
		return true
	}else{
		return false
	}
}
module.exports.pickObject = pickObject
module.exports.pickObjectAsMesh = pickObjectAsMesh
module.exports.pickObjectByUrl = pickObjectByUrl
module.exports.takeObjectAsElement = takeObjectAsElement
module.exports.if_dragging = if_dragging