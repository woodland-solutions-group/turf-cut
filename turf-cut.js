/**
*	Function that cuts a {@link Polygon} with a {@link Linestring}
* @param {Feature<(Polygon)>} poly - single Polygon Feature
* @param {Feature<(Polyline)>} line - single Polyline Feature
* @return {FeatureCollection<(Polygon)>}
* @author	Abel Vázquez
* @version 1.0.0
*
* edited into plug and play function for inventorymanager 8/22 JM
*/
function turfCut(poly, line){
  // validation
	if (poly.geometry === void 0 || poly.geometry.type !== 'Polygon' ){
    throw('"turf-cut" only accepts Polygon type as victim input');
  }
	if (line.geometry === void 0 || line.geometry.type !== 'LineString' ){
    throw('"turf-cut" only accepts LineString type as axe input');
  }
  // updated from inside to booleanPointInPolygon 8/22 JM
	if(turf.booleanPointInPolygon(turf.point(line.geometry.coordinates[0]), poly)
      || turf.booleanPointInPolygon(turf.point(line.geometry.coordinates
                                    [line.geometry.coordinates.length-1]), poly)){
    throw('Both first and last points of the polyline must be outside of the polygon');
  }

  // erase replaced by difference and buffer function changed significantly
	var _axe = turf.buffer(line, 0.001, {units: 'meters'}),
      _body = turf.difference(poly, _axe),
      pieces = [];

	if (_body.geometry.type == 'Polygon' ){
		pieces.push(turf.polygon(_body.geometry.coordinates));
	}else{
		_body.geometry.coordinates.forEach(a => pieces.push(turf.polygon(a)));
	}

	pieces.forEach(a => a.properties = poly.properties);

	return turf.featureCollection(pieces);
}
