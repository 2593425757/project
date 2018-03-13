import React,{Component} from 'react'
import {TopBar,Box,MapComponent,Dashboard1} from '../components'
import {PageHeader} from 'react-bootstrap'
import {Scene,Mesh,MeshBasicMaterial,PlaneGeometry,SpotLight,CubeGeometry,Cube,Circle,Cone,Cylinder,Icosahedron,Torus,saveScene} from '../lib/3D'
import * as THREE from 'three'
import {pickObject,pickObjectByUrl} from '../lib/3D/dragObjFunctions.js'
var mainPage
const url = 'http://localhost:3000/lib/3D/mesh/'
class MainPage extends Component{
	constructor(props){
		super(props)
		mainPage = this
		this.state = {
			n:0.9
		}
		window.drag_i=0
		
		
	}
	less(){
		mainPage.setState({n:mainPage.state.n-0.1})
	}
	componentDidMount(){

		var scene = new THREE.Scene();
		
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		
        var renderer = new THREE.WebGLRenderer();
		
        renderer.setSize(800, 800);
		
        document.getElementById('test').appendChild(renderer.domElement);
        var geometry = new THREE.CircleGeometry( 1, 32 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var circle = new THREE.Mesh( geometry, material );
		scene.add( circle );
        camera.position.z = 5;
        function render() {
            requestAnimationFrame(render);
            circle.rotation.x += 0.03;
            circle.rotation.y += 0.03;
            renderer.render(scene, camera);
        }
        render();

	}
	btnClick(){
		var props = {
			geometry_parameters:{width:10,height:10,depth:10},
			material_parameters:{color:eval('0x00ee00')}
		}
		pickObject(Cube,props,true)
	}
	btnClick_wall(){
		pickObjectByUrl(url+'wall10.json',url+'brick.jpg')
	}
	btnClick_door(){
		pickObjectByUrl(url+'door.json',url+'brick.jpg')
	}
	btnClick_desk(){
		pickObjectByUrl(url+'desk.json',url+'wood.jpg')
	}
	btnClick_chair(){
		pickObjectByUrl(url+'chair.json',url+'wood.jpg')
	}
	btnClick__door(){
		pickObjectByUrl(url+'_door.json',url+'door.png')
	}
	btnClick_air_conditioner(){
		pickObjectByUrl(url+'air-conditioner.json',[{type:'loadTexture',url:url+'air-conditioner.png',index:0}])
	}
	btnClick_mechineBox(){
		pickObjectByUrl(url+'mechineBox.json',[{type:'loadTexture',url:url+'mechineBox.png',index:0}])
	}
	btnClick_glass(){
		pickObjectByUrl(url+'glass.json')
	}
	btnClick_computer(){
		pickObjectByUrl(url+'computer.json',[{type:'loadTexture',url:url+'computer.jpg',index:0}])
	}
	btnClick_saveScene(){
		saveScene('http://localhost:3000/save',0,function(data){
			console.log(data)
		})
	}
	render(){
		
		return (
			<div >
				<TopBar />
				<div id='mainPage_body' style={{width:'1200px',margin:'0 auto',height:(window.screen.availHeight-102)+'px'}}>
					<PageHeader id='page_header'>
						页面
					</PageHeader>
					<Box style={{height:'1000px'}}>
						<Scene camera_position={{x:150,y:150,z:0}} plane_width={300} plane_height={300} plane_position={{x:0,y:-10,z:0}} plane_rotation={{x:-Math.PI/2,y:0,z:0}}>
							<Cube geometry_parameters={{width:10,height:10,depth:10}} material_parameters={{color:eval('0x00ee00')}} position={{x:0,y:20,z:0}} rotation={{x:1,y:1,z:1}} />
						</Scene>
					</Box>
					<Box style={{height:'200px',width:'49%'}}>
						<button onMouseDown={this.btnClick}>cube</button>
						<button onMouseDown={this.btnClick_wall}>wall</button>
						<button onMouseDown={this.btnClick_door}>door</button>
						<button onMouseDown={this.btnClick_desk}>desk</button>
						<button onMouseDown={this.btnClick_chair}>chair</button>
						<button onMouseDown={this.btnClick__door}>_door</button>
						<button onMouseDown={this.btnClick_air_conditioner}>air-conditioner</button>
						<button onMouseDown={this.btnClick_mechineBox}>mechineBox</button>
						<button onMouseDown={this.btnClick_glass}>glass</button>
						<button onMouseDown={this.btnClick_computer}>computer</button>
						<button onClick={this.btnClick_saveScene}>save</button>
					</Box>
					<Box id='test'>
					</Box>
				</div>
				
			</div>
			)
	}
}
export default MainPage