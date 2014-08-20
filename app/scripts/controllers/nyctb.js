'use strict';

/**
 * @ngdoc function
 * @name yoAngularApp.controller:NyctbCtrl
 * @description
 * # NyctbCtrl
 * Controller of the yoAngularApp
 */

var app = angular.module('yoAngularApp');

app.directive('nyctBike', ['d3Service', function (d3Service) {
    function link(scope, el, attr) {
        d3Service.d3().then(function (d3) {
            var width = 800,
                height = 700;

            var radius = d3.scale.sqrt()
                .domain([0, 60])
                .range([0, 20]);


            scope.render = function (nyb) {

                var svg = d3.select('#nycbody').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('style', 'background-color:white');

                var projection = d3.geo.mercator()
                    .center([-73.94, 40.70])
                    .scale(290000)
                    .translate([(width) / 2 + 150, (height) / 2 + 120])
                    .rotate([0.01, 0, 0.01]);

                var path = d3.geo.path()
                    .projection(projection);

                var g = svg.append('g');


                var legend = svg.append('g')
                    .attr('class', 'legend')
                    .attr('transform', 'translate(' + (width - 700) + ',' + (height - 500) + ')')
                    .selectAll('g')
                    .data([5, 20, 50])
                    .enter().append('g');

                legend.append('circle')
                    .attr('cy', function (d) {
                        return -radius(d)
                    })
                    .attr('r', function (d) {
                        return radius(d)
                    });

                legend.append('text')
                    .attr('y', function (d) {
                        return -2 * radius(d);
                    })
                    .attr('dy', '1em')
                    .text(d3.format('.1s'));

                var datetime = svg.append('g')
                    .attr('class', 'datetime')
                    .attr('transform', 'translate(' + (width - 800) + ',' + (height - 750) + ')')
                    .selectAll('g')
                    .data(['Datetime'])
                    .enter().append('g');

                datetime.append('text')
                    .attr('dy', '5em')
                    .text('Datetime');


                g.append('g')
                    .attr('id', 'boroughs')
                    .selectAll('.state')
                    .data(nyb.objects.boros.features)
                    .enter().append('path')
                    .attr('class', function (d) {
                        return d.properties.borough;
                    })
                    .attr('d', path);

                svg.append('g')
                    .attr('class', 'bubble')
                    .selectAll('circle')
                    .data(topojson.feature(nyb, nyb.objects.stations).features)
                    .enter().append('circle')
                    .attr('transform', function (d) {
                        return 'translate(' + path.centroid(d) + ')';
                    })
                    .attr('id', function (d) {
                        return 'Station_' + d.properties.Station_Id;
                    })
                    .attr('class', 'bubbles')
                    .attr('r', 5)
                    .append('svg:title')
                    .text(function (d) {
                        return d.properties.Address;
                    })
            };

            scope.$watch('data', function (data) {
                if (!data) {
                    return;
                }
                scope.render(data)
                if (typeof scope.loaded === 'function') {
                    scope.loaded();
                }
            });
        })
    }

    return {
        link: link,
        restrict: 'EAC',
        scope: { data: '=', loaded: '&' }
    }
}]);

app.controller('NyctbCtrl', function ($scope, $firebase, d3Service, $interval, $timeout, $http,$q) {

    var _d3;

    d3Service.d3().then(function (d3) {
        _d3 = d3;
        var width = 800,
            height = 700;

        $scope.play = undefined;
        $scope.dt = 1000;
        $scope.fforward = function () {
            if ($scope.dt > 300) {
                $scope.dt = $scope.dt - 300;
                $scope.letsStop();
                $scope.play = undefined;
                $scope.letsRun($scope.dt);
                
            }
        };

        $scope.fbackward = function () {
            if ($scope.dt < 2000) {
                $scope.dt = $scope.dt + 300;
                $scope.letsStop();
                $scope.play = undefined;
                $scope.letsRun($scope.dt);
            }
        };

        $scope.count = 0;
        $scope.countS= "0";
        $scope.$watch("countS", function() { $scope.count = parseInt($scope.countS)});
        $scope.$watch("count", function() { $scope.countS = $scope.count.toString() });
        $scope.playing = false;
        $scope.progress = 0;
        $scope.loadingDone = false;

        $scope.letsStop = function () {
           
            $interval.cancel($scope.play);
            $scope.play = undefined;
            
            $scope.playing = false;
        };

        d3.json('nyc.json', function (error, data) {
            if (error) {
                throw error;
            };
            $scope.nyb = data;
            $scope.$apply();
        });
    });

    $scope.iAmLoaded = function () {
        var d3 = _d3;
        var radius = d3.scale.sqrt()
                .domain([0, 60])
                .range([0, 20]);
        var bwcolor = d3.scale.linear()
            .domain([5, 9, 15, 18, 23])
            .range(['grey', 'white', 'white', 'grey', 'black']);

        var diffcolor = d3.scale.linear()
            .domain([-7, 0, 7])
            .range(['red', 'grey', 'green']);


        var circle_order = [];
        var circles = d3.selectAll('circle.bubbles');

        circles[0].forEach(function (e, i, array) {
            
            circle_order.push(e.id.split('_')[1]);
            //if (e.id.split('_')[1] == 289){console.log(i)};
        });
       

        //This function organizes data from Firebase into corresponding form for D3
        //TODO: simplify to two newarrays instead of four
        function data_scrambler(firebase_array1, firebase_array2, order) {
            var newarray1 = [];
            var newarray2 = [];
            var newarray3 = [];
            var newarray4 = [];
            var timestamp = firebase_array1[firebase_array1.length - 1];
            var complete_time = moment(timestamp).format('dddd')+", " +moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
            order.forEach(function (e, i, a) {
                newarray1.push(firebase_array1[e])
            });
            if (firebase_array2) {
                firebase_array1.slice(1, firebase_array1.length - 1).forEach(function (e, i, a) {
                    newarray2.push(firebase_array1[i + 1] - firebase_array2[i + 1])
                });
            } else {
                firebase_array1.slice(1, firebase_array1.length - 1).forEach(function (e, i, a) {
                    newarray2.push(0);
                });
            }
            order.forEach(function (e, i, a) {
                newarray4.push(newarray2[e - 1])
            });
            newarray1.forEach(function (e, i, a) {
                newarray3.push({number: e, differential: newarray4[i]})
            });
            return { data: newarray3, time: complete_time, hour: timestamp.substring(11, 13), timestamp: timestamp}
        };
        var nextHour = 0;
        function weatherFetcher (timestamp, hour){
          var deferred = $q.defer();
          if (nextHour != hour && hour % 2 === 1){
            nextHour = hour
            var unixTime = moment(timestamp).unix();
            var weatherUrl = 'http://api.openweathermap.org/data/2.5/history/city?id=5128581&type=hour&start='+unixTime+'&cnt=1';
            $http.get(weatherUrl)
            .success(function(data) {
         	 deferred.resolve(data['list'][0]['weather'][0]['id']);  })
			.error(function(reason) { deferred.reject(reason);})

			return deferred.promise    }else{
				deferred.resolve(700);
				return deferred.promise
			}
        };
        function weatherIconAppender (weather_id){
        	var weatherNumber = parseInt(weather_id);
        	if (weatherNumber < 700){
        		//append umbrella icon
        		$('#weather').removeClass('fa-sun-o').removeClass('fa-cloud').addClass('fa-umbrella');
        	}else if (weatherNumber > 700 && weatherNumber != 800){
        		//append cloud icon
        		$('#weather').removeClass('fa-sun-o').removeClass('fa-umbrella').addClass('fa-cloud');
        	}else if (weatherNumber === 800){
        		//append sun icon
        		$('#weather').removeClass('fa-cloud').removeClass('fa-umbrella').addClass('fa-sun-o');
        	}
        };
        var svg = d3.selectAll('svg');
        var ref = new Firebase('https://luminous-fire-6005.firebaseio.com/Citibike/');
        var reflimit = ref.startAt().endAt();
        var sync = $firebase(reflimit);

        //    reflimit.on('value', function (snapshot) {
        $scope.fbArray = sync.$asArray();
        console.log($scope.fbArray.length);
        $interval(function() {
        	if ($scope.fbArray.length === 0){ 
        		if ($scope.progress < 70){$scope.progress += 15 }else{$scope.progress += 1}
        			}else{ $scope.progress = 100;
        				$timeout(function(){$scope.loadingDone = true}, 800)}
        }, 1000, 22);
        
        $scope.letsRun = function (t) {
            console.log($scope.fbArray);
            $scope.playing = true;
            if (angular.isDefined($scope.play)) return
               
            $scope.play = $interval(function () {
                var circle_data = data_scrambler($scope.fbArray[$scope.count], $scope.fbArray[$scope.count - 1], circle_order);
                //console.log([circle_data.data[322].differential,circle_data.data[322].number]);
                //console.log(circle_data);
                circles.data(circle_data.data);
                circles.transition(t).attr('r', function (d) {
                    return radius(d.number)
                });
                circles.attr('style', function (d) {
                    return 'fill:' + diffcolor(d.differential)
                });
                svg.attr('style', 'background-color:' + bwcolor(circle_data.hour));
                var weatherPromise = weatherFetcher(circle_data.timestamp, circle_data.hour);
                weatherPromise.then(function(id){weatherIconAppender(id)},function(reason){console.log('Weather fetching failed: '+ reason)});
                d3.selectAll('g.datetime text').text(circle_data.time);
                if ($scope.count === 2218) {
                    $scope.count = 0
                } else {
                    $scope.count += 1
                };
            }, t);
        };
    };
});
