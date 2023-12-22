import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';
import {Card, CardContent, CardHeader} from '@material-ui/core';

const Item = ({item}) => {
    return (
        <Card>
            <CardHeader title={item.title} subheader={`Published: ${moment(item.publishedAt).format('YYYY MMM do - HH:mm')}`}/>
            <CardContent dangerouslySetInnerHTML={{__html: item.body}} />
        </Card>
    )
};

Item.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        publishedAt: PropTypes.string.isRequired
    }).isRequired
}

export default Item;
