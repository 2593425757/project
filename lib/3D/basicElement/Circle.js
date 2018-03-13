import React from 'react'
import Mesh from '../Mesh.js'
import CircleGeometry from '../geometry/CircleGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Circle extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		return <Mesh position={this.props.position} rotation={this.props.rotation}>
			<CircleGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters}/>
		</Mesh>
	}
}
Circle.defaultProps = {
	geometry_parameters:{radius:1,segments:32,thetaStart:0,thetaLength:2*Math.PI},
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00,side:2}
}
export default Circle