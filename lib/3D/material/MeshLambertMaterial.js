import React from 'react'
class MeshLambertMaterial extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
MeshLambertMaterial.defaultProps = {
	parameters:{
		color:0xeeeeee,
		side:0,
		wireframe:false
	},
	type:'meshLambertMaterial',
	type2:'material'
}
export default MeshLambertMaterial