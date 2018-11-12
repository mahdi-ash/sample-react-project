import React, {Component} from 'react';

import styles from './List.scss';

export default function List(props) {
    //TODO: Needs to be more organized
    return (
        <ul className={"levelOneItem"}>
            {props.items.map(function (item) {
                return <li>{item.name}
                    <ul className={"levelTwoItem"}>
                        {item.items.map(function (item) {
                            return <li>{item.name}
                            </li>
                        })}
                    </ul>
                </li>
            })}

        </ul>
    )
}
