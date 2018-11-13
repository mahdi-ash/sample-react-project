import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getProjects, getSites} from '../model';

import {centerMapOnSite} from '../model/map';

import List from '../components/List';

class Sidebar extends Component {

    readMenuData() {
        let items = [];

        //Iterating projects to make top level items for menu
        this.props.projects.map(function (project) {

            let sites = [];

            /*
            Iterating site ids inside each project and finding corresponding data in sites
            to make sub items for menu
            */
            project.sites.map(function (siteId) {
                let matchedSite = this.props.sites.filter(site => site.id == siteId);
                if (matchedSite[0]) //Making sure that site id matches a site in sites
                    sites.push({id: matchedSite[0].id, name: matchedSite[0].name});
            }, this);
            items.push({id: project.id, name: project.name, items: sites});

        }, this);
        return items;
    }

    render() {
        const items = this.readMenuData();
        return <List items={items} onClickSubitem={this.props.centerMapOnSite}/>
    }
}

function mapStateToProps(state) {
    return {
        projects: getProjects(state),
        sites: getSites(state)
    };
}

const mapDispatchToProps = {
    centerMapOnSite
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
