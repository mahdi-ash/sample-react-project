import React, {Component} from 'react';

import styles from './List.scss';

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: null
        }
    }

    onClickMainItem(id) {
        this.setState({ activeItem: id});
    }

    //TODO: Needs to be more organized
    render() {
        return (
            <ul className={styles.levelOne}>
                {/*Iterating the array for top level items to construct the menu*/}
                {this.props.items.map(function (item) {
                    return <li key={item.id}>
                        <span onClick={() => this.onClickMainItem(item.id)}>{item.name}
                        </span>
                        <ul className={[styles.levelTwo,
                            this.state.activeItem==item.id?styles.show:styles.hidden].join(' ')}>
                            {/*Iterating the array for second level items*/}
                            {item.items.map(function (item) {
                                return <li key={item.id}>
                                    <span onClick={() => this.props.onClickSubitem(item.id)}>{item.name}
                                    </span>
                                </li>
                            }, this)}
                        </ul>
                    </li>
                }, this)}
            </ul>
        )
    }
}

export default List;