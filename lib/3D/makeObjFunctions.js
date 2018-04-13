// import * as THREE from 'three'
var boxGeometry = function(props){
	var res = new THREE.BoxGeometry(props.parameters.width,props.parameters.height,props.parameters.depth, props.parameters.widthSegments, props.parameters.heightSegments, props.parameters.depthSegments)
	res.verticesNeedUpdate = true
	return res
}
var circleGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.CircleGeometry(temp.radius, temp.segments, temp.thetaStart, temp.thetaLength)
	return res
}
var coneGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.ConeGeometry(temp.radius, temp.height, temp.radialSegments, temp.heightSegments, temp.openEnded, temp.thetaStart, temp.thetaLength)
	return res
}
var cylinderGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.CylinderGeometry(temp.radiusTop, temp.radiusBottom, temp.height, temp.radialSegments, temp.heightSegments, temp.openEnded, temp.thetaStart, temp.thetaLength)
	return res
}
var icosahedronGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.IcosahedronGeometry(temp.radius, temp.detail)
	return res
}
var torusGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.TorusGeometry(temp.radius, temp.tube, temp.radialSegments, temp.tubularSegments, temp.arc)
	return res
}
var dodecahedronGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.DodecahedronGeometry(temp.radius,temp.detail)
	return res
}
var octahedronGeometry = function(props){
    var temp = props.parameters
    var res = new THREE.OctahedronGeometry(temp.radius,temp.detail)
    return res
}
var ringGeometry = function(props){
    var temp = props.parameters
    var res = new THREE.RingGeometry(temp.innerRadius, temp.outerRadius, temp.thetaSegments, temp.phiSegments, temp.thetaStart, temp.thetaLength)
    return res
}
var sphereGeometry = function(props){
    var temp = props.parameters
    var res = new THREE.SphereGeometry(temp.radius, temp.widthSegments, temp.heightSegments, temp.phiStart, temp.phiLength, temp.thetaStart, temp.thetaLength)
    return res
}
var tetrahedronGeometry = function(props){
    var temp = props.parameters
    var res = new THREE.TetrahedronGeometry(temp.radius,temp.detail)
    return res
}
var torusKnotGeometry = function(props){
    var temp = props.parameters
    var res = new THREE.TorusKnotGeometry(temp.radius, temp.tube, temp.tubularSegments, temp.radialSegments, temp.p, temp.q)
    return res
}
var meshBasicMaterial =function(props){
	var temp = props.parameters
	var res = new THREE.MeshBasicMaterial(temp)
	return res
}
var meshLambertMaterial =function(props){
    var temp = props.parameters
    var res = new THREE.MeshLambertMaterial(temp)
    return res
}
var loadTexture =function(url,onload){
	var loader = new THREE.TextureLoader()
	loader.load(url,onload)
}
var loadFont =function(url,onload){
	var loader = new THREE.FontLoader()
	loader.load(url,onload)
}
var planeGeometry =function(props){
	var res = new THREE.PlaneGeometry(props.parameters.width, props.parameters.height, props.parameters.widthSegments, props.parameters.heightSegments)
	return res
}
var saveScene = function(i='0'){
	var toJSON = function(object3D){
		var _children = []
		object3D.children.forEach(item=>{
			_children.push(toJSON(item))
		})
		return {
			makeObjData:object3D.makeObjData,
			position:{x:object3D.position.x,y:object3D.position.y,z:object3D.position.z},
			rotation:{x:object3D.rotation.x,y:object3D.rotation.y,z:object3D.rotation.z},
			scale:{x:object3D.scale.x,y:object3D.scale.y,z:object3D.scale.z},
			originMesh:object3D.originMesh,
			animation:object3D.animation,
			children:_children,
			uuid:object3D.uuid
		}
	}
	var meshList = []
	global['scene_'+i].scene.children.forEach(item=>{
		meshList.push(toJSON(item))
	})
	var scenePlane = global['scene_'+i].scenePlane
	return {meshList,scenePlane}
}
var clearScene = function(i='0'){
	global['scene_'+i].scene.children = []
}
var makeMesh = function(data){
	var geometryList = data.geometry
    var geometry = new THREE.Geometry()
    geometryList.forEach((item)=>{
    	if (item.op!='-') {
    		var temp = eval(item.type)(item)
        	temp.rotateX(item.rotation.x)
        	temp.rotateY(item.rotation.y)
        	temp.rotateZ(item.rotation.z)
        	temp.translate(item.translate.x,item.translate.y,item.translate.z)
        	geometry.merge(temp)
    	}
    })
    var op_sub = geometryList.filter((item)=>{
    	if (item.op=='-') {return true}
    })
    if (op_sub.length!=0) {
    	var geometry2 = new THREE.Geometry()
    	op_sub.forEach((item)=>{
    		var temp = eval(item.type)(item)
        	temp.rotateX(item.rotation.x)
        	temp.rotateY(item.rotation.y)
        	temp.rotateZ(item.rotation.z)
        	temp.translate(item.translate.x,item.translate.y,item.translate.z)
        	geometry2.merge(temp)
        })
        var mesh1 = new THREE.Mesh(geometry)
        var mesh2 = new THREE.Mesh(geometry2)
        var mesh1BSP = new ThreeBSP(mesh1)
        var mesh2BSP = new ThreeBSP(mesh2)
        var resultBSP = mesh1BSP.subtract(mesh2BSP)
		var res = resultBSP.toMesh()
		res.geometry.computeFaceNormals()
		res.geometry.computeVertexNormals()
		geometry = res.geometry.clone()
    }
    if (data.material.type=='loadTexture') {
    	var material = new THREE.MeshBasicMaterial()
    	var load_promise = new Promise((resolve,reject)=>{
			loadTexture(data.material.url,function(texture){
				material.map = texture
				resolve({geometry,material})
			})
    	})
		return load_promise
    }else if(data.material.type == 'meshBasicMaterial'){
    	if (data.material.parameters.color) {
        	if ((typeof data.material.parameters.color)=='string') {
        		data.material.parameters.color = eval(data.material.parameters.color)
        	}
        }
        var material = eval(data.material.type)(data.material)
        var load_promise = new Promise((resolve,reject)=>{
        	resolve({geometry,material})
        })
        return load_promise
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
    				loadTexture(item.url,function(texture){
    					var temp = new THREE.MeshBasicMaterial()
    					temp.map = texture
            			material[item.index] = temp
            		})
    			}else if (item.type != 'loadTexture') {
    				var mat = eval(item.type)(item.parameters)
    				material[item.index] = mat
    			}
    		})
    	}
    	var load_promise = new Promise((resolve,reject)=>{
        	resolve({geometry,material})
        })
        return load_promise
    }
}
var setOrigin = function(mesh){
	var position = new THREE.Vector3(mesh.position.x,mesh.position.y,mesh.position.z)
	var rotation = new THREE.Euler(mesh.rotation.x,mesh.rotation.y,mesh.rotation.z)
	var scale = new THREE.Vector3(mesh.scale.x,mesh.scale.y,mesh.scale.z)
	var originMesh = {position,rotation,scale}
	mesh.originMesh = originMesh
}
var turnToOrigin = function(mesh,fast=false){
	if (!mesh.makeObjData) {
		return
	}
	if (mesh.makeObjData.alterId==undefined) {
		return
	}
	var judge = mesh.makeObjData.alternative.every(item=>{
		return item.geometry==undefined&&item.material==undefined
	})
	if (judge) {
        if (fast) {
            return new Promise(resolve=>{
                mesh.position.set(mesh.originMesh.position.x,mesh.originMesh.position.y,mesh.originMesh.position.z)
                mesh.rotation.set(mesh.originMesh.rotation.x,mesh.originMesh.rotation.y,mesh.originMesh.rotation.z)
                mesh.scale.set(mesh.originMesh.scale.x,mesh.originMesh.scale.y,mesh.originMesh.scale.z)
                mesh.makeObjData.alterId = 0
                resolve(mesh)
            })
        }
		return new Promise(resolve=>{
			var percent = 0,_translate={x:0,y:0,z:0},_rotation={x:0,y:0,z:0},_scale={x:0,y:0,z:0}
			mesh.makeObjData.alternative.forEach(item=>{
				if (item.translate) {
					_translate.x+=item.translate.x
					_translate.y+=item.translate.y
					_translate.z+=item.translate.z
				}
				if (item.rotation) {
					_rotation.x+=item.rotation.x
					_rotation.y+=item.rotation.y
					_rotation.z+=item.rotation.z
				}
				if (item.scale) {
					_scale.x+=item.scale.x
					_scale.y+=item.scale.y
					_scale.z+=item.scale.z
				}
			})
			mesh.makeObjData.alterId = 0
			mesh.animation = false
			var interval = setInterval(()=>{
				if (percent>=1) {
					clearInterval(interval)
					mesh.animation = true
                    resolve(mesh)
				}
				mesh.position.set(mesh.position.x-_translate.x*0.05,mesh.position.y-_translate.y*0.05,mesh.position.z-_translate.z*0.05)
				mesh.rotation.set(mesh.rotation.x-_rotation.x*0.05,mesh.rotation.y-_rotation.y*0.05,mesh.rotation.z-_rotation.z*0.05)
				mesh.scale.set(mesh.scale.x-_scale.x*0.05,mesh.scale.y-_scale.y*0.05,mesh.scale.z-_scale.z*0.05)
				percent+=0.05
			},50)
			
		})
	}
	var getPromise = makeMesh(mesh.makeObjData)
	return getPromise.then(value=>{
		var {geometry,material} = value
		mesh.geometry = geometry
		mesh.material = material
		mesh.makeObjData.alterId = 0
		mesh.position.set(mesh.originMesh.position.x,mesh.originMesh.position.y,mesh.originMesh.position.z)
		mesh.rotation.set(mesh.originMesh.rotation.x,mesh.originMesh.rotation.y,mesh.originMesh.rotation.z)
		mesh.scale.set(mesh.originMesh.scale.x,mesh.originMesh.scale.y,mesh.originMesh.scale.z)
		return mesh
	})
}
var changeState = function(clickedObject){
	if (clickedObject.animation!=true) {
		return
	}
	var data = clickedObject.makeObjData
	var geometryList = data.geometry
	if (data.alterId == data.alternative.length) {
		turnToOrigin(clickedObject)
	}else{
		var id = data.alterId+1
		var new_geometryList = []
		if (new_geometryList.length==0) {
        	geometryList.forEach(item=>{
        		new_geometryList.push(item)
        	})
        }
		if (data.alternative[id-1].geometry) {
			data.alternative[id-1].geometry.forEach((item)=>{
				var geo_id = item.id
				new_geometryList.forEach((_item,key)=>{
					if (_item.id==geo_id) {
						var res = new Object()
						Object.assign(res,_item,item)
						new_geometryList[key] = res
					}
				})
			})
		}
        var geometry = new THREE.Geometry()
        new_geometryList.forEach((item)=>{
        	if (item.op!='-') {
        		var temp = eval(item.type)(item)
            	temp.rotateX(item.rotation.x)
            	temp.rotateY(item.rotation.y)
            	temp.rotateZ(item.rotation.z)
            	temp.translate(item.translate.x,item.translate.y,item.translate.z)
            	geometry.merge(temp)
        	}
        })
        var op_sub = new_geometryList.filter((item)=>{
        	if (item.op=='-') {return true}
        })
        if (op_sub.length!=0) {
        	var geometry2 = new THREE.Geometry()
        	op_sub.forEach((item)=>{
        		var temp = eval(item.type)(item)
            	temp.rotateX(item.rotation.x)
            	temp.rotateY(item.rotation.y)
            	temp.rotateZ(item.rotation.z)
            	temp.translate(item.translate.x,item.translate.y,item.translate.z)
            	geometry2.merge(temp)
            })
            var mesh1 = new THREE.Mesh(geometry)
            var mesh2 = new THREE.Mesh(geometry2)
            var mesh1BSP = new ThreeBSP(mesh1)
            var mesh2BSP = new ThreeBSP(mesh2)
            var resultBSP = mesh1BSP.subtract(mesh2BSP)
			var res = resultBSP.toMesh()
			res.geometry.computeFaceNormals()
			res.geometry.computeVertexNormals()
			geometry = res.geometry.clone()
        }
        if (data.alternative[id-1].material) {
        	if (data.alternative[id-1].material.type=='loadTexture') {
            	var material = new THREE.MeshBasicMaterial()
        		loadTexture(data.alternative[id-1].material.url,function(texture){
        			material.map = texture
        			var mesh = clickedObject
        			mesh.geometry = geometry
        			mesh.material = material
        			if (data.alternative[id-1].translate) {
        				mesh.position.set(clickedObject.position.x+data.alternative[id-1].translate.x,clickedObject.position.y+data.alternative[id-1].translate.y,clickedObject.position.z+data.alternative[id-1].translate.z)
        			}else{
        				mesh.position.set(clickedObject.position.x,clickedObject.position.y,clickedObject.position.z)
        			}
        			if (data.alternative[id-1].rotation) {
        				mesh.rotation.set(clickedObject.rotation.x+data.alternative[id-1].rotation.x,clickedObject.rotation.y+data.alternative[id-1].rotation.y,clickedObject.rotation.z+data.alternative[id-1].rotation.z)
        			}else{
        				mesh.rotation.set(clickedObject.rotation.x,clickedObject.rotation.y,clickedObject.rotation.z)
        			}
        			if (data.alternative[id-1].scale) {
        				mesh.scale.set(clickedObject.scale.x+ data.alternative[id-1].scale.x,clickedObject.scale.y+ data.alternative[id-1].scale.y,clickedObject.scale.z+ data.alternative[id-1].scale.z)
        			}else{
        				mesh.scale.set(clickedObject.scale.x,clickedObject.scale.y,clickedObject.scale.z)
        			}
	                mesh.makeObjData.alterId = id
        		})
            }else if(data.alternative[id-1].material.type == 'meshBasicMaterial'){
            	if (data.alternative[id-1].material.parameters.color) {
                	if ((typeof data.alternative[id-1].material.parameters.color)=='string') {
                		data.alternative[id-1].material.parameters.color = eval(data.alternative[id-1].material.parameters.color)
                	}
                }
                var material = eval(data.alternative[id-1].material.type)(data.alternative[id-1].material)
                var mesh = clickedObject
                mesh.geometry = geometry
        		mesh.material = material
                if (data.alternative[id-1].translate) {
    				mesh.position.set(clickedObject.position.x+data.alternative[id-1].translate.x,clickedObject.position.y+data.alternative[id-1].translate.y,clickedObject.position.z+data.alternative[id-1].translate.z)
    			}else{
    				mesh.position.set(clickedObject.position.x,clickedObject.position.y,clickedObject.position.z)
    			}
    			if (data.alternative[id-1].rotation) {
    				mesh.rotation.set(clickedObject.rotation.x+data.alternative[id-1].rotation.x,clickedObject.rotation.y+data.alternative[id-1].rotation.y,clickedObject.rotation.z+data.alternative[id-1].rotation.z)
    			}else{
    				mesh.rotation.set(clickedObject.rotation.x,clickedObject.rotation.y,clickedObject.rotation.z)
    			}
    			if (data.alternative[id-1].scale) {
    				mesh.scale.set(clickedObject.scale.x+ data.alternative[id-1].scale.x,clickedObject.scale.y+ data.alternative[id-1].scale.y,clickedObject.scale.z+ data.alternative[id-1].scale.z)
    			}else{
    				mesh.scale.set(clickedObject.scale.x,clickedObject.scale.y,clickedObject.scale.z)
    			}
                mesh.makeObjData.alterId = id
            }else if (data.alternative[id-1].material.type == 'meshFaceMaterial') {
            	var material = []
            	if (data.alternative[id-1].material.basicMaterial) {
            		if (data.alternative[id-1].material.basicMaterial.color) {
            			data.alternative[id-1].material.basicMaterial.color = eval(data.alternative[id-1].material.basicMaterial.color)
            		}
            		for(var i = 0;i<geometry.faces.length/2;i++){
                		material[i] = new THREE.MeshBasicMaterial({color:data.alternative[id-1].material.basicMaterial.color})
                	}
            	}
            	if (data.alternative[id-1].material.textureData) {
            		data.alternative[id-1].material.textureData.forEach((item)=>{
            			if (item.type == 'loadTexture') {
            				loadTexture(item.url,function(texture){
            					var temp = new THREE.MeshBasicMaterial()
            					temp.map = texture
	                			material[item.index] = temp
	                		})
            			}else if (item.type != 'loadTexture') {
            				var mat = eval(item.type)(item.parameters)
            				material[item.index] = mat
            			}
            		})
            	}
            	var mesh = clickedObject
                mesh.geometry = geometry
        		mesh.material = material
                if (data.alternative[id-1].translate) {
    				mesh.position.set(clickedObject.position.x+data.alternative[id-1].translate.x,clickedObject.position.y+data.alternative[id-1].translate.y,clickedObject.position.z+data.alternative[id-1].translate.z)
    			}else{
    				mesh.position.set(clickedObject.position.x,clickedObject.position.y,clickedObject.position.z)
    			}
    			if (data.alternative[id-1].rotation) {
    				mesh.rotation.set(clickedObject.rotation.x+data.alternative[id-1].rotation.x,clickedObject.rotation.y+data.alternative[id-1].rotation.y,clickedObject.rotation.z+data.alternative[id-1].rotation.z)
    			}else{
    				mesh.rotation.set(clickedObject.rotation.x,clickedObject.rotation.y,clickedObject.rotation.z)
    			}
    			if (data.alternative[id-1].scale) {
    				mesh.scale.set(clickedObject.scale.x+ data.alternative[id-1].scale.x,clickedObject.scale.y+ data.alternative[id-1].scale.y,clickedObject.scale.z+ data.alternative[id-1].scale.z)
    			}else{
    				mesh.scale.set(clickedObject.scale.x,clickedObject.scale.y,clickedObject.scale.z)
    			}
                mesh.makeObjData.alterId = id
            }
        }else{
        	var percent = 0
        	var mesh = clickedObject
			mesh.geometry = geometry
        	mesh.animation = false
        	var interval = setInterval(()=>{
        		if (percent>=1) {
        			clearInterval(interval)
        			mesh.animation = true
        		}else{
        			percent+=0.05
        		}
	            if (data.alternative[id-1].translate) {
					mesh.position.set(clickedObject.position.x+data.alternative[id-1].translate.x*0.05,clickedObject.position.y+data.alternative[id-1].translate.y*0.05,clickedObject.position.z+data.alternative[id-1].translate.z*0.05)
				}else{
					mesh.position.set(clickedObject.position.x,clickedObject.position.y,clickedObject.position.z)
				}
				if (data.alternative[id-1].rotation) {
					mesh.rotation.set(clickedObject.rotation.x+data.alternative[id-1].rotation.x*0.05,clickedObject.rotation.y+data.alternative[id-1].rotation.y*0.05,clickedObject.rotation.z+data.alternative[id-1].rotation.z*0.05)
				}else{
					mesh.rotation.set(clickedObject.rotation.x,clickedObject.rotation.y,clickedObject.rotation.z)
				}
				if (data.alternative[id-1].scale) {
					mesh.scale.set(clickedObject.scale.x+ data.alternative[id-1].scale.x*0.05,clickedObject.scale.y+ data.alternative[id-1].scale.y*0.05,clickedObject.scale.z+ data.alternative[id-1].scale.z*0.05)
				}else{
					mesh.scale.set(clickedObject.scale.x,clickedObject.scale.y,clickedObject.scale.z)
				}
	            mesh.makeObjData.alterId = id
        	},50)
        }
    }
}
var importScene = function(sceneData,i='0'){
	var scenePlane = sceneData.scenePlane
	var _promise = new Promise((resolve,reject)=>{
		if (scenePlane.plane_materialUrl) {
			var loader = new THREE.TextureLoader()
			loader.load(scenePlane.plane_materialUrl,texture=>{
				var material = new THREE.MeshBasicMaterial()
				material.map = texture
				resolve(material)
			})
		}else{
			var material = new THREE.MeshBasicMaterial({color:scenePlane.plane_color})
			resolve(material)
		}
	})
	_promise.then(material=>{
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(scenePlane.plane_width,scenePlane.plane_height),material)
		plane.position.set(scenePlane.plane_position.x,scenePlane.plane_position.y,scenePlane.plane_position.z)
		plane.rotation.set(scenePlane.plane_rotation.x,scenePlane.plane_rotation.y,scenePlane.plane_rotation.z)
		plane.groundFlag = true
		global['scene_'+i].scene.add(plane)
	})
	var makeObj = function(meshJson,Target){
		var {position,rotation,scale,originMesh,animation,makeObjData,children,uuid,onClick} = meshJson
		if (!makeObjData) {
			if (children.length!=0) {
				var object3D = new THREE.Object3D()
				object3D.position.set(position.x,position.y,position.z)
				object3D.rotation.set(rotation.x,rotation.y,rotation.z)
				object3D.scale.set(scale.x,scale.y,scale.z)
				object3D.uuid = uuid
				children.forEach(item=>{
					makeObj(item,object3D)
				})
				Target.add(object3D)
			}
		}else{
			var getPromise = makeMesh(makeObjData)
			getPromise.then(value=>{
				var {geometry,material} = value
				var mesh = new THREE.Mesh(geometry,material)
				mesh.position.set(position.x,position.y,position.z)
				mesh.rotation.set(rotation.x,rotation.y,rotation.z)
				mesh.scale.set(scale.x,scale.y,scale.z)
				mesh.animation = animation
				mesh.makeObjData = makeObjData
				var alterId = makeObjData.alterId
				mesh.originMesh = originMesh
				mesh.uuid = uuid
				Target.add(mesh)
				if (makeObjData.alterId) {
					turnToOrigin(mesh,true).then(()=>{
						for(var i=0;i<parseInt(alterId);i++){
							changeState(mesh)
						}
					})
				}
			})
		}
	}
	sceneData.meshList.forEach(item=>{
		makeObj(item,global['scene_'+i].scene)
	})
}
module.exports.boxGeometry = boxGeometry
module.exports.circleGeometry = circleGeometry
module.exports.coneGeometry = coneGeometry
module.exports.cylinderGeometry = cylinderGeometry
module.exports.icosahedronGeometry = icosahedronGeometry
module.exports.torusGeometry = torusGeometry
module.exports.dodecahedronGeometry=dodecahedronGeometry
module.exports.octahedronGeometry=octahedronGeometry
module.exports.ringGeometry=ringGeometry
module.exports.sphereGeometry=sphereGeometry
module.exports.tetrahedronGeometry=tetrahedronGeometry
module.exports.torusKnotGeometry=torusKnotGeometry
module.exports.planeGeometry = planeGeometry
module.exports.meshBasicMaterial = meshBasicMaterial
module.exports.meshLambertMaterial = meshLambertMaterial
module.exports.loadTexture = loadTexture
module.exports.loadFont = loadFont
module.exports.saveScene = saveScene
module.exports.clearScene = clearScene
module.exports.importScene = importScene
module.exports.makeMesh = makeMesh
module.exports.changeState = changeState
module.exports.setOrigin = setOrigin
module.exports.turnToOrigin = turnToOrigin