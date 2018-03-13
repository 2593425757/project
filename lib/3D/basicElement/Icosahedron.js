import React from 'react'
import Mesh from '../Mesh.js'
import IcosahedronGeometry from '../geometry/IcosahedronGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Icosahedron extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		return <Mesh position={this.props.position} rotation={this.props.rotation}>
			<IcosahedronGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters}/>
		</Mesh>
	}
}
Icosahedron.defaultProps = {
	geometry_parameters:{radius:1,detail:0},
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00}
}
export default Icosahedron