// jquery.gaugeIt.js
// Medidor con animación

(function($){
  $.fn.extend({
    gaugeIt:function(options){
      defaults = {
          name: 'Medidor',
          selector: this,
          value: 25,
          gaugeMaxValue: 100,
          barWidth: 3,
          range:100,
          label: '',
          colorNeddle:"#000000",
          forceWidth: 'default'//Put 195px width
      }

      var options = $.extend({}, defaults, options);

        this.each(function() {

          var percentValue = options.value / options.gaugeMaxValue;
          var needleClient;
          var needleClient2;

          var barWidthi, chart, chartInset, degToRad, repaintGauge,
          height, margin, numSections, padRad, percToDeg, percToRad,
          percent, radius, sectionIndx, svg, totalPercent, width,
          valueText,labelText,valueTexto, formatValue, k;

          percent = percentValue;

          numSections = 1;
          sectionPerc = 1 / numSections / 2;
          padRad = 0.001;
          chartInset = 10;

          // Orientation of gauge:
          totalPercent = .75;

          el = d3.select(options.selector);

          margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
          };

          console.log(el[0][0].offsetWidth);

          if (options.forceWidth == 'default'){
            width = 195;
          }else{
            width = el[0][0].offsetWidth - margin.left - margin.right;
          }
          //width = el[0][0].offsetWidth - margin.left - margin.right;
          //width = 150;
          widtho = el[0][0].offsetWidth - margin.left + 25 - margin.right + 25;
          height = width;
          heighto = widtho;
          radius = Math.min(width, height) / 2;
          radiuso = Math.min(widtho+10,heighto+10) / 2
          barWidthi = 3 * width / 150;

          barWidtho = 1 * widtho / 150;



          //Utility methods

          percToDeg = function(perc) {
            return perc * 360;
          };

          percToRad = function(perc) {
            return degToRad(percToDeg(perc));
          };

          degToRad = function(deg) {
            return deg * Math.PI / 180;
          };

          // Create SVG element
          //svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
          if (width < 245) {
                svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', width/1);
          }else {
            svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', width/1.1);
          }


          // Add layer for the panel
          chort = svg.append('defs').append('linearGradient').attr('id','grad1').attr('x1','0%').attr('y1','100%').attr('x2','100%').attr('y2','0%');
          chort.append('stop').attr('offset','0%').attr('style','stop-color:#9FBD35;stop-opacity:1;');
          chort.append('stop').attr('offset','100%').attr('style','stop-color:#FB3033;stop-opacity:1;');

          chart = svg.append('g').attr('transform', "translate(" + ((width) / 2 + margin.left) + ", " + ((height + margin.top +40) / 2) + ")");

          chart.append('path').attr('class', "arc chart-first");
          chart.append('path').attr('class', "arc chart-second");
          chart.append('path').attr('class', "arc chart-third");
          chart.append('path').attr('class', "arc chart-blanco");
          chart.append('path').attr('id', "arc");
          // chart.append('path').attr('class', "arc chart-fourth");
          // chart.append('path').attr('class', "arc chart-fifth");

        valueTexto = chart.append("text")
              .attr('id', "Valueo")
              .attr("font-size",72)
              .attr("text-anchor","middle")
              .attr("dy",".5em")
              .style("fill", options.colorNeddle);

        valueText = chart.append("text")
              .attr('id', "Value")
              .attr("font-size",14)
              .attr("text-anchor","middle")
              .attr("dy",".5em")
              .style("fill", options.colorNeddle);
              //formatValue = d3.format('1%');
              formatValue = d3.format(".2f");


        labelText = chart.append("text")
              .attr('id', "Label")
              .attr("font-size",14)
              .attr("text-anchor","middle")
              .attr("dy",".5em")
              .style("fill", options.colorNeddle);

              // arc5 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
              blanco = d3.svg.arc().outerRadius(radiuso).innerRadius(radiuso - barWidtho)
              arc3 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidthi)
              arc2 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidthi)
              arc1 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidthi)

              repaintGauge = function ()
              {
                perc = 0.5;
                var next_start = totalPercent;
                var next_starto = totalPercent;


                arcStartRad = percToRad(next_start);
                arcEndRad = arcStartRad + percToRad(perc / 1);
                next_starto = perc / 1;

                blanco.startAngle(arcStartRad).endAngle(arcEndRad);

                arcStartRad = percToRad(next_start);
                arcEndRad = arcStartRad + percToRad(perc / 3);
                next_start += perc / 3;

                arc1.startAngle(arcStartRad).endAngle(arcEndRad);

                arcStartRad = percToRad(next_start);
                arcEndRad = arcStartRad + percToRad(perc / 3);
                next_start += perc / 3;

                arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

                arcStartRad = percToRad(next_start);
                arcEndRad = arcStartRad + percToRad(perc / 3);
                next_start += perc / 3;

                arc3.startAngle(arcStartRad + padRad).endAngle(arcEndRad);


                // arcStartRad = percToRad(next_start);
                // arcEndRad = arcStartRad + percToRad(perc / 5);
                // next_start += perc / 5;
                //
                // arc4.startAngle(arcStartRad + padRad).endAngle(arcEndRad);
                //
                // arcStartRad = percToRad(next_start);
                // arcEndRad = arcStartRad + percToRad(perc / 5);
                //
                // arc5.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

                chart.select(".chart-first").attr('d', arc1);
                chart.select(".chart-second").attr('d', arc2);
                chart.select(".chart-third").attr('d', arc3);
                chart.select(".chart-blanco").attr('d', blanco);
                // chart.select(".chart-fifth").attr('d', arc5);

              }
              /////////

              var dataset = [{metric:options.name, value: options.value}]

              var texts = svg.selectAll("text")
                .data(dataset)
                .enter();

          texts.append("text")
               .text(function(){
                    return dataset[0].metric;
               })
               .attr('id', "Name")
               .attr('transform', "translate(" + ((width + margin.left) / 6) + ", " + ((height + margin.top) / 1.5) + ")")
               .attr("font-size",25)
               .style("fill", "#000000");


          texts.append("text")
              .text(function(){
                  return 0;
              })
              .attr('id', 'scale0')
              .attr('transform', "translate(" + ((width + margin.left) / 100 ) + ", " + ((height + margin.top) / 2) + ")")
              .attr("font-size", 15)
              .style("fill", "#000000");

          texts.append("text")
              .text(function(){
                  return options.gaugeMaxValue/2;
              })
              .attr('id', 'scale10')
              .attr('transform', "translate(" + ((width + margin.left) / 2.15 ) + ", " + ((height + margin.top) / 30) + ")")
              .attr("font-size", 15)
              .style("fill", "#000000");


          texts.append("text")
              .text(function(){
                  return options.gaugeMaxValue;
              })
              .attr('id', 'scale20')
              .attr('transform', "translate(" + ((width + margin.left) / 1.03 ) + ", " + ((height + margin.top) / 2) + ")")
              .attr("font-size", 15)
              .style("fill", "#000000");

          texts.append("text")
              .text('.')
              .attr('id', 'scale30')
              .attr('transform', "translate(" + ((width + margin.left) / 1.03 ) + ", " + ((height + margin.top) / 2) + ")")
              .attr("font-size", 72)
              .style("fill", "#ffffff");


          var Needle = (function() {

          //Helper function that returns the `d` value for moving the needle
          var recalcPointerPos = function(perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2);
            centerX = 0;
            centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

            return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
          };

          function Needle(el) {
            this.el = el;
            this.len = width / 2.5;
            this.radius = this.len / 13;
            this.radiuso = this.len / 18;
          }

          Needle.prototype.render = function() {
            this.el.append('circle').attr('class', 'needle-pointer').attr('cx', 0).attr('cy', 0).attr('r', this.radiuso);
            this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
            return this.el.append('path').attr('class', 'needle').attr('id', 'client-needle').attr('d', recalcPointerPos.call(this, 0));
          };

      Needle.prototype.moveTo = function(perc) {
        var self,
            oldValue = this.perc || 0;

        this.perc = perc;
        self = this;

        this.el.select('.needle').attr('fill', options.colorNeddle);
        this.el.select('.needle-center').attr('fill', options.colorNeddle);

        // Reset pointer position
        this.el.transition().delay(100).ease('quad').duration(200).select('.needle').tween('reset-progress', function() {
          return function(percentOfPercent) {
            var progress = (1 - percentOfPercent) * oldValue;

            if(progress > options.gaugeMaxValue){
              console.log('Mayor');
              progress =  options.gaugeMaxValue;
            }

            repaintGauge(progress);

            return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
          };
        });

        this.el.transition().delay(300).ease('bounce').duration(1500).select('.needle').tween('progress', function() {
          return function(percentOfPercent) {
            var progress = percentOfPercent * perc;
            //var progress = perc;
            //console.log('Progress');
            //console.log(progress);

            repaintGauge(progress);

            var thetaRad = percToRad(progress / 2);
            var textX = - (self.len + 45) * Math.cos(thetaRad);
            var textY = - (self.len + 45) * Math.sin(thetaRad);


            var percent100 = formatValue(progress) * options.gaugeMaxValue;

            valueText.text(options.value)
            .attr("x","-20")
            .attr("y","30")

            labelText.text(options.label)
            .attr("x","20")
            .attr("y","30")

            //valueText.text(percent100)
            //.attr('transform', "translate("+textX+","+textY+")")

              // valueTexto.text('.')
              //   .attr('transform', "translate("+textX+","+textY+")")
            return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
          };
        });

      };

      return Needle;
      })();

      needle = new Needle(chart);
      needle.render();


      if(options.value > options.gaugeMaxValue){
        needle.moveTo(1);
      }else {
        needle.moveTo(percent);
      }



      //needle.moveTo(value);

        });

    }
  });

})(jQuery)
