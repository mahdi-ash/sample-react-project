import React, {Component} from 'react';

import styles from './List.scss';

export default function List(props) {
    //TODO: Needs to be more organized
    return (
        <ul className={styles.levelOne}>
            {/*Iterating the array for top level items to construct the menus*/}
            {props.items.map(function (item,index) {
                return <li key={index}><span>{item.name}</span>
                    <ul className={styles.levelTwo}>
                        {item.items.map(function (item,index) {
                            return <li key={index}><span>{item.name}</span>
                            </li>
                        })}
                    </ul>
                </li>
            })}

        </ul>
    )
}
