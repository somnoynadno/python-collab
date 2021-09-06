import React from 'react';
import {
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import TeacherClassPage from "./pages/TeacherClassPage";
import StudentClassPage from "./pages/StudentClassPage";

function App() {
    return (
        <Switch>
            <Route exact path='/' component={IndexPage} />
            <Route exact path='/join/:id' component={StudentClassPage} />
            <Route exact path='/class/:id' component={TeacherClassPage} />
        </Switch>
    );
}

export default withRouter(App);
