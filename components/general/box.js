import React,{Component} from 'react'
class Box extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div id={this.props.id} style={{	width:'100%',
							margin:'1em 0',
							borderRadius:'1em',
							borderWidth:'1px',
							borderColor:'black',
							padding:'1em',
							backgroundColor:'#f8f8f8',
							borderStyle:'none',
							height:'auto',
							boxSizing:'border-box',
							display:'inline-block',...this.props.style}} onClick={this.props.onClick}>
				{this.props.children}
			</div>
			)
	}
}
Box.defaultProps = {
	id:'',
	style:{},
	onClick:function(){}
}
export default Box