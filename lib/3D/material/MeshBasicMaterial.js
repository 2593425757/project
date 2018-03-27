import React from 'react'
class MeshBasicMaterial extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
MeshBasicMaterial.defaultProps = {
	parameters:{
		color:0xeeeeee,
		side:0,
		wireframe:false
	},
	type:'meshBasicMaterial',
	type2:'material'
}
export default MeshBasicMaterial