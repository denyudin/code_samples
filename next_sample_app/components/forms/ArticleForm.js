import React, {useState} from 'react';
import {TextField, FormControl, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    publishDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    control: {
        margin: theme.spacing(1)
    }
}));

const ArticleForm = ({data}) => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        publisher: '',
        publishAt: '',
        ...data
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Throw the data to the parent or dispatch the action
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl fullWidth className={classes.control}>
                <TextField
                    id="title"
                    label="Title"
                    variant="outlined"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </FormControl >
            <br/>
            <FormControl fullWidth className={classes.control}>
                <TextField
                    id="body"
                    label="Body"
                    multiline
                    rows={10}
                    variant="outlined"
                    value={formData.body}
                    onChange={(e) => handleChange('body', e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.control}>
                <TextField
                    id="publisher"
                    label="Publisher"
                    placeholder={'Please input an email address'}
                    variant="outlined"
                    type={"email"}
                    value={formData.publisher}
                    onChange={(e) => handleChange('publisher', e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.control}>
                <TextField
                    id="date"
                    label="Publish At"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formData.publishAt}
                    onChange={(e) => handleChange('publishAt', e.target.value)}
                />
            </FormControl>
            <FormControl className={classes.control}>
                <Button variant="contained" color="primary" type={'submit'}>
                    Save
                </Button>
            </FormControl>
        </form>
    )
}

export default ArticleForm;
