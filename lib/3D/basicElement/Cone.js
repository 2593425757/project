import React from 'react'
import Mesh from '../Mesh.js'
import ConeGeometry from '../geometry/ConeGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Cone extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		return <Mesh position={this.props.position} rotation={this.props.rotation}>
			<ConeGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters}/>
		</Mesh>
	}
}
Cone.defaultProps = {
	geometry_parameters:{radius:3,height:10,radialSegments:32,heightSegments:1,openEnded:false,thetaStart:0,thetaLength:2*Math.PI},
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00}
}
export default Cone