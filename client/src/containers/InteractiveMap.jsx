import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as turf from '@turf/turf';

import Map, {Layer, Sources, GeoJSON} from '../components/map';

import {centerMapOnSite, mapSetCenter, mapSetZoom} from '../model/map';

const treeAPI = "/api/trees";

class InteractiveMap extends Component {

    constructor() {
        super();
        this.state = {
            allUnorderedTrees: null,
            treesBySites: {}
        };
    }

    componentDidMount() {
        //Fetching all trees data by id from API and putting them into state
        fetch(treeAPI)
            .then(res => res.json()
                .then((data) => {
                        this.setState({allUnorderedTrees: data.byId});
                    }
                )
            );
    }

    /*
    Extracts current site trees data including id,lat,lng,height from current site trees IDs if doesn't exist
    */
    getCurrentSiteTreesData() {
        if (this.state.allUnorderedTrees && !this.state.treesBySites[this.props.currentSite.id]) {
            const {trees} = this.props.currentSite;
            let treeDataForOrdered = {}, treeDataForOrderedList = [];
            trees.map(function (tree) {
                treeDataForOrdered = {
                    id: this.state.allUnorderedTrees[tree].id,
                    lat: this.state.allUnorderedTrees[tree].lat,
                    long: this.state.allUnorderedTrees[tree].long,
                    height: this.state.allUnorderedTrees[tree].height
                };
                treeDataForOrderedList.push(treeDataForOrdered);
            }, this);
            const tempTreeBySites = Object.assign({[this.props.currentSite.id]: treeDataForOrderedList}, this.state.treesBySites);

            this.setState(() => {
                return {treesBySites: tempTreeBySites};
            });
        }
    }

    componentDidUpdate() {
        this.getCurrentSiteTreesData();
    }


    makePointsArray() {
        let points = [];
        if (this.state.treesBySites[this.props.currentSite.id]) {

            this.state.treesBySites[this.props.currentSite.id].map(function (treeData) {
                    points.push([treeData.long, treeData.lat]);
                }
            );
            console.log(points);

        }
        return points;
    }

    render() {

        const {bounding} = this.props.currentSite;
        const boundaries = [[
            [bounding.left, bounding.top],
            [bounding.right, bounding.top],
            [bounding.right, bounding.bottom],
            [bounding.left, bounding.bottom],
            [bounding.left, bounding.top]
        ]];
        const boundingFeature = turf.polygon(boundaries, {name: 'Bounding Area'});

        const backgroundFeature = turf.polygon(boundaries, {name: 'Background Area'});

        const TreesFeatures = turf.multiPoint(this.makePointsArray());

        return (
            <Map {...this.props}>
                <Sources>
                    <GeoJSON id="bounding-box" data={boundingFeature}/>
                    <GeoJSON id="background-box" data={backgroundFeature}/>
                    <GeoJSON id="tree-points" data={TreesFeatures}/>
                </Sources>
                <Layer
                    id="bounding-box"
                    type="line"
                    paint={{
                        'line-width': 2,
                        'line-color': '#fff'
                    }}
                    source="bounding-box"
                />
                <Layer
                    id="background-box"
                    type="fill"
                    paint={{
                        'fill-opacity': 0.1,
                        'fill-color': '#fff'
                    }}
                    source="background-box"
                />
                <Layer
                    id="tree-points"
                    type="circle"
                    paint={{
                        'circle-radius': 4,
                        'circle-color': '#fff'
                    }}
                    source="tree-points"
                />
            </Map>
        );
    }
}


function mapStateToProps(state) {
    return {
        currentSite: state.sites.byId[state.sites.selected],
        center: state.map.center,
        zoom: state.map.zoom
    };
}

const mapDispatchToProps = {
    centerMapOnSite,
    mapSetCenter,
    mapSetZoom
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveMap);