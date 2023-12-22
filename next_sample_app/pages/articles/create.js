import React from "react";
import ArticleForm from "../../components/forms/ArticleForm";
import {Card, CardHeader, CardContent} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formWrapper: {
        marginTop: '30px',
        cursor: 'pointer'
    }
}));

const CreateArticlePage = () => {
    const classes = useStyles();
    return (
        <Card className={classes.formWrapper}>
            <CardHeader title={'New Article'}/>
            <CardContent>
                <ArticleForm />
            </CardContent>
        </Card>
    );
}

export default CreateArticlePage;
