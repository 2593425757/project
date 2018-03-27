import React from 'react'
import Mesh from '../Mesh.js'
import CylinderGeometry from '../geometry/CylinderGeometry.js'
import MeshBasicMaterial from '../material/MeshBasicMaterial.js'
class Cylinder extends React.Component{
	constructor(props,context){
		super(props)
	}
	render(){
		return <Mesh position={this.props.position} rotation={this.props.rotation}>
			<CylinderGeometry parameters={this.props.geometry_parameters}/>
			<MeshBasicMaterial parameters={this.props.material_parameters}/>
		</Mesh>
	}
}
Cylinder.defaultProps = {
	geometry_parameters:{radiusTop:3,radiusBottom:3,height:10,radialSegments:8,heightSegments:1,openEnded:false,thetaStart:0,thetaLength:2*Math.PI},
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	material_parameters:{color:0x00ee00}
}
export default Cylinder