import React from 'react'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
class SpotLight extends React.Component{
	constructor(props,context){
		super(props)
		this.state = {
			scene_i:context.scene_i
		}
		
	}
	componentWillMount(){
		var _this = this
		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set(_this.props.position.x,_this.props.position.y,_this.props.position.z)
		if (_this.props.target) {
			spotLight.target = _this.props.target
		}
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;
		global['scene_'+_this.state.scene_i].scene.add(spotLight)
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set( 0, 10, 0 );
		global['scene_'+_this.state.scene_i].scene.add( directionalLight );
	}
	render(){
		return <div style={{display:'none'}}></div>
	}
}
SpotLight.defaultProps = {
	color:0x999999,
	position:{x:0,y:50,z:0}
}
SpotLight.contextTypes = {
	scene_i:PropTypes.string
}
export default SpotLight