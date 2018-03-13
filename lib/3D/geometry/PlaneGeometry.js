import React from 'react'
class PlaneGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
PlaneGeometry.defaultProps = {
	parameters:{width:10,height:10},
	type:'planeGeometry',
	type2:'geometry'
}
export default PlaneGeometry