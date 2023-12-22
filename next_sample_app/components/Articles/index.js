import React from "react";
import PropTypes from 'prop-types';
import Item from "./Item";
import { List, ListItem } from "@material-ui/core";

const Articles = ({items}) => {
    return (
        <List>
            {
                items.map((item, i) => (
                    <ListItem key={i}>
                        <Item item={item} />
                    </ListItem>
                ))
            }
        </List>
    )
}

Articles.propTypes = {
    items: PropTypes.array.isRequired
}

Articles.defaultProps = {
    items: []
}
export default Articles;
