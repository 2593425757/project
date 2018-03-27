import React from 'react'
import * as ELEMENT from './index.js'
import * as MAKEOBJ from './makeObjFunctions.js'
import Mesh from './Mesh.js'
import * as THREE from 'three'

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
                var geometryList = data.geometry
                var geometry = new THREE.Geometry()
                geometryList.forEach((item)=>{
                	var temp = MAKEOBJ[item.type](item)
                	temp.rotateX(item.rotation.x)
                	temp.rotateY(item.rotation.y)
                	temp.rotateZ(item.rotation.z)
                	temp.translate(item.translate.x,item.translate.y,item.translate.z)
                	geometry.merge(temp)
                })
                if (data.material.type=='loadTexture') {
                	var material = new THREE.MeshBasicMaterial()
            		MAKEOBJ.loadTexture(data.material.url,function(texture){
            			material.map = texture
            			var mesh = new THREE.Mesh(geometry,material)
		                mesh.rotation.set(data.rotation.x,data.rotation.y,data.rotation.z) 
		                if (data.scale) {
		                	mesh.scale.set(data.scale.x,data.scale.y,data.scale.z)
		                }
		                mesh.makeObjData = data
	                	mesh.animation = animation
		                global.dragObject = mesh
            		})
                }else if(data.material.type == 'meshBasicMaterial'){
                	if (data.material.parameters.color) {
	                	if ((typeof data.material.parameters.color)=='string') {
	                		data.material.parameters.color = eval(data.material.parameters.color)
	                	}
	                }
	                var material = MAKEOBJ[data.material.type](data.material)
	                var mesh = new THREE.Mesh(geometry,material)
	                mesh.rotation.set(data.rotation.x,data.rotation.y,data.rotation.z) 
	                if (data.scale) {
	                	mesh.scale.set(data.scale.x,data.scale.y,data.scale.z)
	                }
	                mesh.makeObjData = data
	                mesh.animation = animation
	                global.dragObject = mesh
                }else if (data.material.type == 'meshFaceMaterial') {
                	var material = []
                	if (data.material.basicMaterial) {
                		if (data.material.basicMaterial.color) {
                			data.material.basicMaterial.color = eval(data.material.basicMaterial.color)
                		}
                		for(var i = 0;i<geometry.faces.length/2;i++){
	                		material[i] = new THREE.MeshBasicMaterial({color:data.material.basicMaterial.color})
	                	}
                	}
                	if (data.material.textureData) {
                		data.material.textureData.forEach((item)=>{
                			if (item.type == 'loadTexture') {
                				MAKEOBJ.loadTexture(item.url,function(texture){
                					var temp = new THREE.MeshBasicMaterial()
                					temp.map = texture
		                			material[item.index] = temp
		                		})
                			}else if (item.type != 'loadTexture') {
                				var mat = MAKEOBJ[item.type](item.parameters)
                				material[item.index] = mat
                			}
                		})
                	}
                	var mesh = new THREE.Mesh(geometry,material)
	                mesh.rotation.set(data.rotation.x,data.rotation.y,data.rotation.z) 
	                if (data.scale) {
	                	mesh.scale.set(data.scale.x,data.scale.y,data.scale.z)
	                }
	                mesh.makeObjData = data
	                mesh.animation = animation
	                global.dragObject = mesh
                }
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