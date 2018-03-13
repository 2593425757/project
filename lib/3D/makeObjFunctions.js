import * as THREE from 'three'
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
var textGeometry = function(props){
	var temp = props.parameters
	var res = new THREE.TextGeometry(temp.text,temp)
	return res
}
var meshBasicMaterial =function(props){
	var temp = props.parameters
	var res = new THREE.MeshBasicMaterial(temp)
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
var saveScene = function(url,i=0,successFunc){
	var sceneData = window['scene_'+i]
	var data = {}
	data.scenePlane = sceneData.scenePlane
	data.meshList = sceneData.meshList.map((item)=>{
		return item.toJSON()
	})
	console.log(sceneData)
	var file = new File([data],'obj')
	// $.ajax({
	// 	type:'POST',
	// 	url:url,
	// 	dataType:'json',
	// 	data:file,
	// 	success:successFunc
	// })
}
var loadScene = function(sceneData,i=0){

}
module.exports.boxGeometry = boxGeometry
module.exports.circleGeometry = circleGeometry
module.exports.coneGeometry = coneGeometry
module.exports.cylinderGeometry = cylinderGeometry
module.exports.icosahedronGeometry = icosahedronGeometry
module.exports.torusGeometry = torusGeometry
module.exports.meshBasicMaterial = meshBasicMaterial
module.exports.planeGeometry = planeGeometry
module.exports.textGeometry = textGeometry
module.exports.loadTexture = loadTexture
module.exports.loadFont = loadFont
module.exports.saveScene = saveScene