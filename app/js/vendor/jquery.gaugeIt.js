! function(t) {
    t.fn.extend({
        gaugeIt: function(a) {
            defaults = {
                name: "Medidor",
                selector: this,
                value: 25,
                gaugeMaxValue: 100,
                barWidth: 3,
                range: 100,
                label: "",
                colorNeddle: "#000000",
                forceWidth: "default"
            };
            a = t.extend({}, defaults, a);
            this.each(function() {
                var t, e, r, n, l, d, s, i, c, o, h, u, p, f, g, x;
                o = a.value / a.gaugeMaxValue, sectionPerc = .5, r = 10, el = d3.select(a.selector), s = {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30
                }, p = "default" == a.forceWidth ? 195 : el[0][0].offsetWidth - s.left - s.right, widtho = el[0][0].offsetWidth - s.left + 25 - s.right + 25, d = p, heighto = widtho, h = Math.min(p, d) / 2, radiuso = Math.min(widtho + 10, heighto + 10) / 2, t = 3 * p / 150, barWidtho = 1 * widtho / 150, i = function(t) {
                    return 360 * t
                }, c = function(t) {
                    return n(i(t))
                }, n = function(t) {
                    return t * Math.PI / 180
                }, u = p < 245 ? el.append("svg").attr("width", p + s.left + s.right).attr("height", p / 1) : el.append("svg").attr("width", p + s.left + s.right).attr("height", p / 1.1), chort = u.append("defs").append("linearGradient").attr("id", "grad1").attr("x1", "0%").attr("y1", "100%").attr("x2", "100%").attr("y2", "0%"), chort.append("stop").attr("offset", "0%").attr("style", "stop-color:#9FBD35;stop-opacity:1;"), chort.append("stop").attr("offset", "100%").attr("style", "stop-color:#FB3033;stop-opacity:1;"), (e = u.append("g").attr("transform", "translate(" + (p / 2 + s.left) + ", " + (d + s.top + 40) / 2 + ")")).append("path").attr("class", "arc chart-first"), e.append("path").attr("class", "arc chart-second"), e.append("path").attr("class", "arc chart-third"), e.append("path").attr("class", "arc chart-blanco"), e.append("path").attr("id", "arc"), e.append("text").attr("id", "Valueo").attr("font-size", 72).attr("text-anchor", "middle").attr("dy", ".5em").style("fill", a.colorNeddle), f = e.append("text").attr("id", "Value").attr("font-size", 14).attr("text-anchor", "middle").attr("dy", ".5em").style("fill", a.colorNeddle), x = d3.format(".2f"), g = e.append("text").attr("id", "Label").attr("font-size", 14).attr("text-anchor", "middle").attr("dy", ".5em").style("fill", a.colorNeddle), blanco = d3.svg.arc().outerRadius(radiuso).innerRadius(radiuso - barWidtho), arc3 = d3.svg.arc().outerRadius(h - r).innerRadius(h - r - t), arc2 = d3.svg.arc().outerRadius(h - r).innerRadius(h - r - t), arc1 = d3.svg.arc().outerRadius(h - r).innerRadius(h - r - t), l = function() {
                    perc = .5;
                    var t = .75;
                    arcStartRad = c(t), arcEndRad = arcStartRad + c(perc / 1), perc, blanco.startAngle(arcStartRad).endAngle(arcEndRad), arcStartRad = c(t), arcEndRad = arcStartRad + c(perc / 3), t += perc / 3, arc1.startAngle(arcStartRad).endAngle(arcEndRad), arcStartRad = c(t), arcEndRad = arcStartRad + c(perc / 3), t += perc / 3, arc2.startAngle(arcStartRad + .001).endAngle(arcEndRad), arcStartRad = c(t), arcEndRad = arcStartRad + c(perc / 3), t += perc / 3, arc3.startAngle(arcStartRad + .001).endAngle(arcEndRad), e.select(".chart-first").attr("d", arc1), e.select(".chart-second").attr("d", arc2), e.select(".chart-third").attr("d", arc3), e.select(".chart-blanco").attr("d", blanco)
                };
                var R = [{
                        metric: a.name,
                        value: a.value
                    }],
                    y = u.selectAll("text").data(R).enter();
                y.append("text").text(function() {
                    return R[0].metric
                }).attr("id", "Name").attr("transform", "translate(" + (p + s.left) / 6 + ", " + (d + s.top) / 1.5 + ")").attr("font-size", 25).style("fill", "#000000"), y.append("text").text(function() {
                    return 0
                }).attr("id", "scale0").attr("transform", "translate(" + (p + s.left) / 100 + ", " + (d + s.top) / 2 + ")").attr("font-size", 15).style("fill", "#000000"), y.append("text").text(function() {
                    return a.gaugeMaxValue / 2
                }).attr("id", "scale10").attr("transform", "translate(" + (p + s.left) / 2.15 + ", " + (d + s.top) / 30 + ")").attr("font-size", 15).style("fill", "#000000"), y.append("text").text(function() {
                    return a.gaugeMaxValue
                }).attr("id", "scale20").attr("transform", "translate(" + (p + s.left) / 1.03 + ", " + (d + s.top) / 2 + ")").attr("font-size", 15).style("fill", "#000000"), y.append("text").text(".").attr("id", "scale30").attr("transform", "translate(" + (p + s.left) / 1.03 + ", " + (d + s.top) / 2 + ")").attr("font-size", 72).style("fill", "#ffffff");
                var v = function() {
                    var t = function(t) {
                        var a, e, r;
                        return a = c(t / 2), 0, 0, e = 0 - this.len * Math.cos(a), r = 0 - this.len * Math.sin(a), "M " + (0 - this.radius * Math.cos(a - Math.PI / 2)) + " " + (0 - this.radius * Math.sin(a - Math.PI / 2)) + " L " + e + " " + r + " L " + (0 - this.radius * Math.cos(a + Math.PI / 2)) + " " + (0 - this.radius * Math.sin(a + Math.PI / 2))
                    };

                    function e(t) {
                        this.el = t, this.len = p / 2.5, this.radius = this.len / 13, this.radiuso = this.len / 18
                    }
                    return e.prototype.render = function() {
                        return this.el.append("circle").attr("class", "needle-pointer").attr("cx", 0).attr("cy", 0).attr("r", this.radiuso), this.el.append("circle").attr("class", "needle-center").attr("cx", 0).attr("cy", 0).attr("r", this.radius), this.el.append("path").attr("class", "needle").attr("id", "client-needle").attr("d", t.call(this, 0))
                    }, e.prototype.moveTo = function(e) {
                        var r, n = this.perc || 0;
                        this.perc = e, r = this, this.el.select(".needle").attr("fill", a.colorNeddle), this.el.select(".needle-center").attr("fill", a.colorNeddle), this.el.transition().delay(100).ease("quad").duration(200).select(".needle").tween("reset-progress", function() {
                            return function(e) {
                                var d = (1 - e) * n;
                                return d > a.gaugeMaxValue && (d = a.gaugeMaxValue), l(), d3.select(this).attr("d", t.call(r, d))
                            }
                        }), this.el.transition().delay(300).ease("bounce").duration(1500).select(".needle").tween("progress", function() {
                            return function(n) {
                                var d = n * e;
                                l();
                                var s = c(d / 2);
                                r.len, Math.cos(s), r.len, Math.sin(s), x(d), a.gaugeMaxValue;
                                return f.text(a.value).attr("x", "-20").attr("y", "30"), g.text(a.label).attr("x", "20").attr("y", "30"), d3.select(this).attr("d", t.call(r, d))
                            }
                        })
                    }, e
                }();
                needle = new v(e), needle.render();
                if(a.value > a.gaugeMaxValue){
                   needle.moveTo(1)
                   }
                    else if(a.value <= a.gaugeMaxValue && a.value > 0)
                    {
                       needle.moveTo(o)
                   }else{
                      needle.moveTo(0) 
                   }
//                a.value > a.gaugeMaxValue ? needle.moveTo(1) : needle.moveTo(o), a.value < 0 ? needle.moveTo(0) : needle.moveTo(o)
            })
        }
    })
}(jQuery);