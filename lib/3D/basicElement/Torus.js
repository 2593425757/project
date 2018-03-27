import React from 'react'
import Mesh from '../Mesh.js'
import TorusGeometry from '../geometry/TorusGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Torus extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		return <Mesh position={this.props.position} rotation={this.props.rotation}>
			<TorusGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters}/>
		</Mesh>
	}
}
Torus.defaultProps = {
	geometry_parameters:{radius:1,tube:0.4,radialSegments:8,tubularSegments:6,arc:2*Math.PI},
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00}
}
export default Torus