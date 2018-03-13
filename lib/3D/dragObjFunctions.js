import React from 'react'
import * as ELEMENT from './index.js'
import * as MAKEOBJ from './makeObjFunctions.js'
import Mesh from './Mesh.js'
import * as THREE from 'three'

var pickObject = function(objectClass,props,importPosition){
	if (!window.drag_i) {
		window.drag_i = 0
	}
	var obj = {
		objectClass,
		props:{key:window.drag_i,...props},
		importPosition:importPosition==true?true:false,
		type:'class'
	}
	window.drag_i++
	window.dragObject = obj
}
var pickObjectAsMesh = function(mesh,importPosition){
	if (!window.drag_i) {
		window.drag_i = 0
	}
	var obj = {
		mesh,
		type:'mesh',
		importPosition:importPosition==true?true:false
	}
	window.drag_i++
	window.dragObject = obj
}
var pickObjectByUrl = function(url,textureData){
		var obj
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
                	if (textureData) {
                		MAKEOBJ[data.material.type](textureData,function(texture){
                			material.map = texture
                			var mesh = new THREE.Mesh(geometry,material)
			                mesh.position_offset = data.position_offset
			                mesh.rotation_offset = data.rotation
			                // eval(data.onClick)
			                // console.log(Function)
			                mesh.onClick = eval(data.onClick)
			                pickObjectAsMesh(mesh,true)
                		})
                	}
                }else if(data.material.type == 'meshBasicMaterial'){
                	if (data.material.parameters.color) {
	                	if ((typeof data.material.parameters.color)=='string') {
	                		data.material.parameters.color = eval(data.material.parameters.color)
	                	}
	                }
	                var material = MAKEOBJ[data.material.type](data.material)
	                var mesh = new THREE.Mesh(geometry,material)
	                mesh.position_offset = data.position_offset
	                mesh.rotation_offset = data.rotation
	                mesh.onClick = eval(data.onClick)
	                pickObjectAsMesh(mesh,true)
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
                	if (textureData) {
                		textureData.forEach((item)=>{
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
	                mesh.position_offset = data.position_offset
	                mesh.rotation_offset = data.rotation
	                mesh.onClick = eval(data.onClick)
	                pickObjectAsMesh(mesh,true)
                }
                
            }  
        })  
}
var takeObjectAsElement = function(position){
	if (window.dragObject) {
		if (window.dragObject.type=='mesh') {
			var obj = window.dragObject
			if (obj.importPosition==true) {
				if (position) {
					var ele = React.createElement(Mesh,{
						position:{x:position.x,y:position.y,z:position.z},
						position_offset:obj.mesh.position_offset,
						rotation:obj.mesh.rotation_offset,
						importMesh:obj.mesh,
						key:window.drag_i-1
					})
				}else{
					console.log('请传入position,function:takeObjectAsElement')
				}
			}else{
				var ele = React.createElement(Mesh,{importMesh:obj.mesh,key:window.drag_i})
			}
			return ele
		}
		var obj = window.dragObject
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
	if (window.dragObject) {
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