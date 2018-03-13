import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
class Mesh extends React.Component{
	constructor(props,context){
		super(props)
		this.state = {
			scene_i:context.scene_i
		}

	}
	componentWillMount(){
		var mesh
		var _this = this
		if (_this.props.importMesh!=null) {
			mesh = _this.props.importMesh
			mesh.position.x = this.props.position.x + this.props.position_offset.x
			mesh.position.y = this.props.position.y + this.props.position_offset.y
			mesh.position.z = this.props.position.z + this.props.position_offset.z
			mesh.rotation.x = this.props.rotation.x
			mesh.rotation.y = this.props.rotation.y
			mesh.rotation.z = this.props.rotation.z
			window['scene_'+_this.state.scene_i].meshList.push(mesh)
			return
		}
		var geometry,material
		for(var i=0;i<_this.props.children.length;i++){
			if (_this.props.children[i].props.type2=='material') {
				material = MAKEOBJ[_this.props.children[i].props.type](_this.props.children[i].props)
				// console.log(material)
			}
			if (_this.props.children[i].props.type2=='geometry') {
				// console.log(_this.props.children[i].props)
				geometry = MAKEOBJ[_this.props.children[i].props.type](_this.props.children[i].props)
			}
		}
		
		mesh = new THREE.Mesh(geometry,material)
		mesh.position.x = this.props.position.x + this.props.position_offset.x
		mesh.position.y = this.props.position.y + this.props.position_offset.y
		mesh.position.z = this.props.position.z + this.props.position_offset.z
		mesh.rotation.x = this.props.rotation.x
		mesh.rotation.y = this.props.rotation.y
		mesh.rotation.z = this.props.rotation.z
		window['scene_'+_this.state.scene_i].meshList.push(mesh)
	}
	componentDidMount(){
	}
	render(){
		return <div></div>
	}
}
Mesh.defaultProps = {
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	position_offset:{x:0,y:0,z:0},
	importMesh:null
}
Mesh.contextTypes = {
	scene_i:PropTypes.string
}
export default Mesh