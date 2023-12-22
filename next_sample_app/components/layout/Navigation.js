import React from 'react';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import Link from "next/link";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    link: {
        marginRight: theme.spacing(2),
        cursor: 'pointer'
    }
}));

const navItems = [
    {
        title: 'Home',
        path: '/'
    },
    {
        title: 'New Article',
        path: '/articles/create'
    }
];
const Navigation = () => {
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                {
                    navItems.map((item, i) => (
                        <Link key={i} href={item.path}>
                            <Typography variant={'h6'} className={classes.link}>
                                {item.title}
                            </Typography>
                        </Link>
                    ))
                }
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
