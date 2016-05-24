angular.module('SDWSNApp').controller('EchatsSensorDataCtrl',function($scope,socket){
	var elem = document.getElementById('echartsdata');
	var echartsdata = echarts.init(elem);
	socket.on('sensorDatas',function(sensorDatas){
        var temperatures = sensorDatas.temperature;
        var wets = sensorDatas.wet;
        var smokes = sensorDatas.smoke;
        var names =sensorDatas.names;

		var categories = names;

        var seriesLine = [];
        (function(){
            temperatures.forEach(function(tempByNode,index){
                if(tempByNode.length){
                    seriesLine.push({
                        name: tempByNode[0][2],
                        type: 'line',
                        zlevel: 0,
                        data: tempByNode.map(function(data){
                            var date = new Date(data[0]);
                            return [date,data[1],data[2]];
                        }),
                        lable:{
                            normal:{
                                show:true,
                                formatter:'{c}'
                            }
                        },
                        markPoint:{
                            data:[{
                                type:'max',
                                name:'最大值'
                            },
                            {
                                type:'min',
                                name:'最小值'
                            }]
                        },
                        markLine:{
                            data:[{
                                type:'average',
                                name:'平均值'
                            }]
                        },
                        areaStyle:{
                            normal:{}
                        }
                    });
                }
            });

            wets.forEach(function(wetByNode,index){
                if(wetByNode.length){
                    seriesLine.push({
                        name: wetByNode[0][2],
                        type: 'line',
                        yAxisIndex:1,
                        zlevel: 0,
                        data: wetByNode.map(function(data){
                            var date = new Date(data[0]);
                            return [date,data[1],data[2]];
                        }),
                        lable:{
                            normal:{
                                show:true,
                                formatter:'{c}'
                            }
                        },
                        markPoint:{
                            data:[{
                                type:'max',
                                name:'最大值'
                            },
                            {
                                type:'min',
                                name:'最小值'
                            }]
                        },
                        markLine:{
                            data:[{
                                type:'average',
                                name:'平均值'
                            }]
                        },
                        areaStyle:{
                            normal:{}
                        }
                    });
                }
            });
            
            smokes.forEach(function(smokeByNode,index){
                if (smokeByNode.length){
                    smokeByNode.forEach(function(s){
                        if(s[1] == 0){
                            s[1] = null;
                        }
                        s.symbolSize = 30;
                    });
                    seriesLine.push({
                        name:smokeByNode[0][2],
                        type:'effectScatter',
                        data:smokeByNode.map(function(data){
                            return [new Date(data[0]),data[1],data[2]];
                        }),
                        zlevel:1,
                        itemStyle:{
                            normal:{
                                color:'#FEC42C'
                            }
                        },
                        lable:{
                            normal:{
                                show:true
                            }
                        },
                        rippleEffect:{
                            period:3,
                            scale:2.5,
                            brushType:'stroke'
                        }
                    });
                }
            });
        })();
        
        var optionLine = {
            tooltip: {
                trigger: 'axis',
                //enterable:true
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true},
                    dataView:{show:true},
                    magicType:{
                        show:true,
                        type:['line','stack','tiled']
                    },
                    mySingleNodeData: {
                        show:true,
                        title:'显示单个节点数据',
                        icon:'path://M924.001491 279.81694c-52.810903 0-95.642116 42.801828-95.642116 95.611591 0 30.714536 14.731096 57.746192 37.252942 75.250868L746.594883 688.747493c-11.768503-5.176906-24.710787-8.165983-38.401138-8.165983-7.186974 0-14.186675 0.798179-20.921329 2.301416L519.00533 288.659329c12.730451-16.238846 20.320624-36.696784 20.320624-58.930157 0-52.80874-42.817909-95.66378-95.642116-95.66378-52.82523 0-95.642116 42.85504-95.642116 95.66378 0 17.539468 4.727868 33.972742 12.971961 48.102554L130.390925 540.234041c-9.607192-3.229554-19.707638-5.390777-30.395486-5.390777-52.810903 0-95.642116 42.829458-95.642116 95.637174 0 52.822043 42.831213 95.624894 95.642116 95.624894s95.642116-42.802852 95.642116-95.624894c0-22.12081-7.831683-42.241057-20.453659-58.4666l225.686126-256.770038c12.881906 6.457062 27.421636 10.096962 42.813816 10.096962 10.351166 0 20.314484-1.64957 29.649465-4.689812l166.102705 389.094786c-16.640664 17.20587-26.884379 40.638559-26.884379 66.473971 0 52.782134 42.831213 95.639221 95.642116 95.639221s95.642116-42.857087 95.642116-95.639221c0-18.188244-5.2815-35.016515-14.175418-49.414433l127.243106-256.459976c2.402821 0.187265 4.669538 0.720408 7.098966 0.720408 52.810903 0 95.642116-42.829458 95.642116-95.638197S976.813418 279.81694 924.001491 279.81694zM99.995439 671.454642c-22.60269 0-40.989186-18.411325-40.989186-40.974203 0-22.600741 18.386496-40.98853 40.989186-40.98853 22.603713 0 40.990209 18.387789 40.990209 40.98853C140.985648 653.043317 122.599152 671.454642 99.995439 671.454642zM402.693628 229.729172c0-22.601764 18.386496-41.014112 40.990209-41.014112 22.60269 0 40.989186 18.412348 40.989186 41.014112 0 22.576181-18.386496 40.960901-40.989186 40.960901C421.080124 270.690072 402.693628 252.30433 402.693628 229.729172zM708.193745 817.208237c-22.60269 0-40.989186-18.413372-40.989186-40.98853s18.386496-40.98853 40.989186-40.98853c22.603713 0 40.990209 18.413372 40.990209 40.98853S730.797458 817.208237 708.193745 817.208237zM924.001491 416.415015c-22.60269 0-40.989186-18.385742-40.989186-40.987506 0-22.576181 18.386496-40.960901 40.989186-40.960901 22.603713 0 40.990209 18.385742 40.990209 40.960901C964.9917 398.030295 946.605204 416.415015 924.001491 416.415015z',
                        onclick: function (){
                            optionLine.legend.selectedMode = 'single';
                            echartsdata.setOption(option);
                        }
                    },
                    myAllNodesData: {
                        show:true,
                        title:'显示所有节点数据',
                        icon:'path://M84.715828 610.596576c44.855395 0 81.223141-36.367279 81.223141-81.220836 0-20.482497-7.831683-38.983873-20.324717-53.260018l277.559643-317.205479c8.507093 3.035126 17.508463 4.977361 27.048114 4.977361 8.705623 0 16.934365-1.744737 24.805959-4.28356L654.328793 657.630798c-13.147977 14.434757-21.356252 33.432437-21.356252 54.490032 0 44.853557 36.368769 81.219813 81.222118 81.219813 44.855395 0 81.224164-36.366256 81.224164-81.219813 0-20.979824-8.149944-39.894615-21.197633-54.310953l155.961325-311.930335c2.479573 0.23536 4.85681 0.751107 7.376293 0.751107 44.855395 0 81.224164-36.365232 81.224164-81.216743 0-44.854581-36.368769-81.22186-81.224164-81.22186s-81.222118 36.367279-81.222118 81.22186c0 27.759227 13.977912 52.208059 35.236946 66.861804l-151.598792 303.187207c-8.151991-2.737344-16.717415-4.560876-25.780186-4.560876-8.704599 0-16.934365 1.726318-24.804935 4.242627L510.086851 137.118937c13.149-14.415314 21.357275-33.412994 21.357275-54.451146 0-44.853557-36.369792-81.22186-81.223141-81.22186-44.855395 0-81.224164 36.368302-81.224164 81.22186 0 20.463054 7.83373 38.943964 20.326764 53.240575L111.763942 453.113845c-8.507093-3.015683-17.511533-4.957919-27.049138-4.957919-44.855395 0-81.223141 36.366256-81.223141 81.219813C3.492687 574.229297 39.860433 610.596576 84.715828 610.596576zM937.558807 224.801952c22.387787 0 40.610547 18.202571 40.610547 40.61093 0 22.385846-18.22276 40.608883-40.610547 40.608883-22.38881 0-40.612594-18.223037-40.612594-40.608883C896.947237 243.004523 915.17102 224.801952 937.558807 224.801952zM754.806228 712.12083c0 22.38687-18.223783 40.609906-40.612594 40.609906-22.386764 0-40.610547-18.223037-40.610547-40.609906 0-22.406313 18.223783-40.608883 40.610547-40.608883C736.583468 671.511947 754.806228 689.713494 754.806228 712.12083zM450.220985 42.056861c22.387787 0 40.61157 18.203594 40.61157 40.61093 0 22.385846-18.223783 40.608883-40.61157 40.608883-22.38881 0-40.612594-18.223037-40.612594-40.608883C409.608391 60.260455 427.832175 42.056861 450.220985 42.056861zM84.715828 488.766856c22.386764 0 40.612594 18.203594 40.612594 40.608883 0 22.387893-18.224807 40.61093-40.612594 40.61093s-40.610547-18.223037-40.610547-40.61093C44.105281 506.97045 62.328041 488.766856 84.715828 488.766856zM937.558807 569.985646c-44.855395 0-81.222118 36.366256-81.222118 81.219813 0 20.860097 8.089567 39.698141 21.040037 54.076616L772.833529 879.497908c-14.793521-15.486716-35.535764-25.241894-58.638871-25.241894-22.56585 0-42.970388 9.218966-57.684087 24.072255L525.933396 633.382535l-2.025206 10.92277c4.739125-10.292414 7.534912-21.653159 7.534912-33.708729 0-44.853557-36.369792-81.220836-81.223141-81.220836-44.855395 0-81.224164 36.367279-81.224164 81.220836 0 44.854581 36.368769 81.219813 81.224164 81.219813 19.015855 0 36.307368-6.822382 50.149175-17.786085l133.891799 248.637824c-0.673363 4.201695-1.289419 8.40646-1.289419 12.8077 0 44.853557 36.368769 81.22186 81.222118 81.22186 44.855395 0 81.224164-36.368302 81.224164-81.22186 0-4.323469-0.616056-8.447393-1.269975-12.571317L911.284344 727.687364c8.28912 2.854001 17.015209 4.737908 26.275487 4.737908 44.855395 0 81.224164-36.365232 81.224164-81.21879S982.414202 569.985646 937.558807 569.985646zM450.220985 651.205459c-22.38881 0-40.612594-18.222013-40.612594-40.609906 0-22.406313 18.223783-40.61093 40.612594-40.61093 22.387787 0 40.61157 18.203594 40.61157 40.61093C490.831532 632.984469 472.608772 651.205459 450.220985 651.205459zM714.194658 976.085734c-22.386764 0-40.610547-18.223037-40.610547-40.61093 0-22.406313 18.223783-40.608883 40.610547-40.608883 22.38881 0 40.612594 18.202571 40.612594 40.608883C754.806228 957.862697 736.583468 976.085734 714.194658 976.085734zM937.558807 691.816388c-22.38881 0-40.612594-18.22406-40.612594-40.61093 0-22.405289 18.223783-40.609906 40.612594-40.609906 22.387787 0 40.610547 18.204617 40.610547 40.609906C978.169354 673.592328 959.946594 691.816388 937.558807 691.816388zM394.054523 615.101169 138.930765 733.26029c-14.415905-13.009292-33.294631-21.139459-54.21596-21.139459-44.855395 0-81.223141 36.366256-81.223141 81.219813s36.367746 81.219813 81.223141 81.219813 81.223141-36.366256 81.223141-81.219813c0-9.160637-1.844073-17.805528-4.660327-26.01449L413.527815 650.755204 394.054523 615.101169zM84.715828 833.951573c-22.386764 0-40.610547-18.223037-40.610547-40.611953 0-22.407336 18.223783-40.61093 40.610547-40.61093s40.612594 18.202571 40.612594 40.61093C125.327398 815.729559 107.102592 833.951573 84.715828 833.951573z',
                        onclick: function (){
                            optionLine.legend.selectedMode = 'mutiple';
                            echartsdata.setOption(option);
                        }
                    },
                    myScatter:{
                        show:true,
                        title:'切换为散点图',
                        icon:'path://M0 1024 0 0l33.032258 0 0 990.967742 1123.096774 0 0 33.032258L0 1024zM1048.774194 181.677419C1016.848516 181.677419 990.967742 155.796645 990.967742 123.870968S1016.848516 66.064516 1048.774194 66.064516 1106.580645 91.94529 1106.580645 123.870968 1080.699871 181.677419 1048.774194 181.677419zM891.870968 363.354839c-54.734452 0-99.096774-44.362323-99.096774-99.096774s44.362323-99.096774 99.096774-99.096774 99.096774 44.362323 99.096774 99.096774S946.605419 363.354839 891.870968 363.354839zM990.967742 660.645161c0 91.218581-73.94271 165.16129-165.16129 165.16129s-165.16129-73.94271-165.16129-165.16129 73.94271-165.16129 165.16129-165.16129S990.967742 569.426581 990.967742 660.645161zM445.935484 825.806452c-45.601032 0-82.580645-36.979613-82.580645-82.580645s36.979613-82.580645 82.580645-82.580645 82.580645 36.979613 82.580645 82.580645S491.536516 825.806452 445.935484 825.806452zM198.193548 858.83871c-18.250323 0-33.032258-14.781935-33.032258-33.032258s14.781935-33.032258 33.032258-33.032258 33.032258 14.781935 33.032258 33.032258S216.443871 858.83871 198.193548 858.83871z',
                        onclick:function(){
                            option.series.forEach(function(serie){
                                if (serie.type == 'line'){
                                    serie.type = 'scatter';
                                }
                            });
                            var tools = option.toolbox.feature;
                            tools.magicType.show = false;
                            tools.restore.show = false;
                            
                            option.visualMap = [];
                            option.visualMap.push({
                                type:'continuous',
                                min:15,
                                max:60,
                                calculable:true,
                                text:['60℃','15℃'],
                                dimension:1,
                                seriesIndex:names.map(function(name,i){
                                    return i;
                                }),
                                inRange:{
                                    color:['#d94e5d','#FF8000','#eac736'],
                                    symbolSize:[20,60]
                                },
                                outOfRange:{
                                    color:['#d94e5d','#FF8000','#eac736'],
                                    symbolSize:[20,60],
                                    opacity:[0.2,0.2]
                                }
                            });
                            option.visualMap.push({
                                type:'continuous',
                                min:10,
                                max:70,
                                top:35,
                                calculable:true,
                                text:['70%','10%'],
                                dimension:1,
                                seriesIndex:names.map(function(name,i){
                                    return i+names.length;
                                }),
                                inRange:{
                                    color:['#0000A0','#50a3ba','#008000'],
                                    symbolSize:[20,60]
                                },
                                outOfRange:{
                                    color:['#0000A0','#50a3ba','#008000'],
                                    symbolSize:[20,60],
                                    opacity:[0.2,0.2]
                                }
                            });
                            echartsdata.setOption(option);
                        }
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend:{
                data:names,
                selectedMode:'single',
                left:5
            },
            xAxis:{
                name:'时间',
                type:'time'
            },
            yAxis:[{
                name:'温度',
                type:'value',
                splitLine: {
                    show: false
                }
            },
            {
                name:'湿度',
                type:'value',
                splitLine: {
                    show: false
                }
            }],
            dataZoom: [{
                show: true,
                type:'slider',
                realtime: true,
                start: 60,
                end: 100
            },
            {
                type: 'inside',
                show:'true',
                realtime: true,
                start: 60,
                end: 100
            }],
            series:seriesLine,
            animationDuration: 1500
        };
        var option = optionLine;
        echartsdata.setOption(option);
    });
});