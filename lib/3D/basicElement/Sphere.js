import React from 'react'
import Mesh from '../Mesh.js'
import {Vector3} from 'three'
import SphereGeometry from '../geometry/SphereGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Sphere extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		var x = this.props.position.x+this.props.position_offset.x
		var y = this.props.position.y+this.props.position_offset.y
		var z = this.props.position.z+this.props.position_offset.z
		var position = new Vector3(x,y,z)
		return <Mesh position={position} rotation={this.props.rotation}>
			<SphereGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters} />
		</Mesh>
	}
}
Sphere.defaultProps = {
	geometry_parameters:{radius:1, widthSegments:8, heightSegments:6, phiStart:0, phiLength:Math.PI*2, thetaStart:0, thetaLength:Math.PI},
	position:{x:0,y:0,z:0},
	position_offset:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00}
}
export default Sphere