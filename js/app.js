//Make app
angular.module("uiApp", ['ui.router', 'ui.bootstrap'])

//Config UI and different pages
.config(function($stateProvider){
	$stateProvider
		.state('home',{
			url:'/',
			templateUrl:'templates/home.html',
			controller:'HomeController'
		})
		.state('web',{
			url:'/web',
			templateUrl:'templates/web.html',
			controller:'WebController'
		})
		.state('research',{
			url:'/research',
			templateUrl:'templates/research.html',
			controller:'ResearchController'
		})
		.state('contact',{
			url:'/contact',
			templateUrl:'templates/contact.html',
			controller:'ContactController'
		})
		.state('documents',{
			url:'/documents',
			templateUrl:'templates/documents.html',
			controller:'DocumentsController'
		})
})

//UI controllers
.controller('HomeController', function($scope,$http){

})
.controller('WebController', function($scope,$http){
	$http.get('data/web.json').then(function(response){
		$scope.data = response.data;
	})
})
.controller('ResearchController', function($scope,$http){
	$http.get('data/research.json').then(function(response){
		$scope.data = response.data;
	})
})
.controller('ContactController', function($scope,$http){
	$http.get('data/contact.json').then(function(response){
		$scope.data = response.data;
	})
})
.controller('DocumentsController', function($scope,$http){
	$http.get('data/documents.json').then(function(response){
		$scope.data = response.data;
	})
})

//D3 directive
.directive('hexbin', function($filter,$compile) {

	return {
		restrict:'E',//Make a new HTML element

		//give scope the data
		scope:{
			data:"=data"
		},

		//Create a link function that creates the hexbin element

		link:function(scope,elem,attrs){
			//Create a wrapper to the first element 
			var wrapper = d3.select(elem[0])

			//Height/width of the bin, where hexagons will lie
			var height = 400,
				width = 400,
				circleValue = 100;

			var svg = wrapper.append('svg')
				.attr('width', width)
				.attr('height', height);

			var circleData = {
				    children:[
				    ]
				}

			//The layout
			var layout;
			//A scale
			var colorScale = d3.scale.category20();
			var defs;

			//When data is assigned, assign it to the circle data and make patterns
			scope.$watch('data', function(){

				scope.data.forEach(function(d){
					circleData.children.push(d);
				})

				defs = svg.append('defs')
					.selectAll("pattern")
					.data(scope.data)
					.enter()
					.append('pattern')
					.attr('x', -100)
					.attr('y',-100)
				    .attr("width", 500)
				    .attr("height", 500)
				    .attr("id",function(d){return d.idName})
				    .attr('patternUnits',"userSpaceOnUse")
				    .append("image")
				    .attr("width", 500)
				    .attr("height", 500)
				    .attr('x',30)
				    .attr('y',50)
				    .attr("xlink:href", function(d){return d.imgURL;});

				makeLayout();
				draw();
			})

			//Wait for data to be assigned to make the layout
			var makeLayout = function(){
				layout = d3.layout.pack()
					.size([width,height])
					.value(function(d){return circleValue;});
			}
			
			//Reusable function to assign attributes to our circles
			var bubbleFunc = function(circle){   	
				 circle.attr('cx',function(d){return d.x;})
				    .attr('cy', function(d){return d.y})
				    .attr('r',function(d){return d.r})
				    .attr('fill', function(d){return colorScale(d.title)})
				    .attr('fill', function(d){return "url(#"+ d.idName +")";})
				    .attr("tooltip-append-to-body", true)
				    .attr('tooltip', function(d){
				    	return d.title + ': ' + d.description;
				    })

			}

			var draw = function(){
				var circles = svg.selectAll('circle')
					.data(layout.nodes(circleData))

				circles.enter()
					.append('circle')
					.call(bubbleFunc)
					.call(function(){
						$compile(this[0].parentNode)(scope);
					})

				circles.exit()
					.remove()

				svg.selectAll('circle')
					.call(bubbleFunc)

			}
		}
	}
})





