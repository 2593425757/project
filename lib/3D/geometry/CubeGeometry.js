import React from 'react'
class CubeGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
CubeGeometry.defaultProps = {
	size:{width:1,depth:1,height:1},
	type:'cubeGeometry',
	type2:'geometry'
}
export default CubeGeometry