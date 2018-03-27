import React from 'react'
class BoxGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
BoxGeometry.defaultProps = {
	parameters:{width:1,depth:1,height:1},
	type:'boxGeometry',
	type2:'geometry'
}
export default BoxGeometry