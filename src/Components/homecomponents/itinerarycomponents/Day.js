import Add from '@material-ui/icons/Add'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './Day.css';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import firebase from '../../../config/Firebase'
import IconButton from '@material-ui/core/IconButton';
import "./Itinerary.css";
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import TimePicker from 'react-time-picker';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: '5%'
    },
    card: {
        minWidth: 325,
      },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    }));

export default function Day(props) {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    // this handles the opening and closing of the expansion panels
    const handleChange = panel => (event, isExpanded) => {
        // this could use improvement, I don't as of yet know how to make the MaterialUI API for the expansion panel open and close only the icon click
            // this is a rudimentary fix but it still is slightly buggy
        if (event.target.id === `expand-icon-${props.index}`) {
            setExpanded(isExpanded ? panel : false);
        }

    };

    // the hooks for both the inputs
    const [time, handleTime] = useState('00:00');
    const [activity, handleActivity] = useState(''); 

    let onChange = time => handleTime(time)

    

    const handleDelete = (event, activity) => {
        let timeID = activity.slice(0, 5)
        console.log(timeID)

        firebase.database()
            .ref(`${props.dateID}-${firebase.auth().currentUser.uid}/${props.date}/${timeID}`)
            .remove()
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // validate the input before passing to Itinerary to write to firebase 
        if (time === null || activity === "") {
            return
        }
        else {
            props.handleAdd(props.date, time, activity)
            handleActivity('')
            handleTime('00:00')
        }
    }
    
    // create empty arrays to sort each activity into 
    let mornList = []
    let aftList = []
    let eveList = []
    let nightList = []


    return (
            <ExpansionPanel expanded={expanded === `panel${props.index}`} onChange={handleChange(`panel${props.index}`)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon id={`expand-icon-${props.index}`}/>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                    <Typography className={classes.heading}>{props.date}</Typography>
                    <form className="event-form" onSubmit={handleSubmit}>
                        <div className="event-inputs">
                            <TextField 
                                placeholder="Enter activity."
                                onChange={e => handleActivity(e.target.value)}
                                value={activity}/>
                            <TimePicker 
                            onChange={onChange}
                            value={time}
                            clockIcon={null}/>
                        </div>
                        <IconButton type="submit">
                            <Add/>
                        </IconButton>
                    </form>
                </ExpansionPanelSummary>
                <div className="individual-day">
                    <ExpansionPanelDetails>
                            {props.activities === undefined 
                                ? 
                                null 
                                :
                                (Object.keys(props.activities)).map(hour => {
                                    // append to the arrays above, so each array has the activities that belong to that part of day
                                    if (Number(hour.slice(0, 2)) >= 5 && Number(hour.slice(0, 2)) < 12) {
                                        mornList.push(props.activities[hour])
                                    }
                                    else if (Number(hour.slice(0, 2)) >= 12 && Number(hour.slice(0, 2)) < 17) {
                                        aftList.push(props.activities[hour])
                                    }
                                    else if (Number(hour.slice(0, 2)) >= 17 && Number(hour.slice(0, 2)) < 21) {
                                        eveList.push(props.activities[hour])
                                    }
                                    else {
                                        nightList.push(props.activities[hour])
                                    }                                     
                                })
                            }
                            <div className="cards">
                                <Card className={classes.card}>
                                    <CardContent>
                                        <h3 className="card-title">Morning</h3>
                                        <ul className="activities-list">
                                            {mornList.map(activity => 
                                                <li key={activity}>
                                                    {activity}
                                                    <IconButton id={activity} onClick={e => handleDelete(e, activity)}>
                                                        <DeleteIcon id={activity} fontSize="small" />
                                                    </IconButton>
                                                </li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <h3 className="card-title">Afternoon</h3>
                                        <ul className="activities-list">
                                            {aftList.map(activity => 
                                                <li key={activity}>
                                                    {activity}
                                                    <IconButton id={activity} onClick={e => handleDelete(e, activity)}>
                                                        <DeleteIcon id={activity} fontSize="small" />
                                                    </IconButton>
                                                </li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <h3 className="card-title">Evening</h3>
                                        <ul className="activities-list">
                                        {eveList.map(activity => 
                                            <li key={activity}>
                                                {activity}
                                                <IconButton id={activity} onClick={e => handleDelete(e, activity)}>
                                                    <DeleteIcon id={activity} fontSize="small" />
                                                </IconButton>
                                            </li>
                                        )}
                                        </ul>

                                    </CardContent>
                                </Card>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <h3 className="card-title">Night</h3>
                                        <ul className="activities-list">
                                        {nightList.map(activity => 
                                            <li key={activity}>
                                                {activity}
                                                <IconButton id={activity} onClick={e => handleDelete(e, activity)}>
                                                    <DeleteIcon id={activity} fontSize="small" />
                                                </IconButton>
                                            </li>
                                        )}
                                        </ul>
                                    </CardContent>
                                </Card>
                        </div>
                    </ExpansionPanelDetails>
                </div>
            </ExpansionPanel>
    )
}